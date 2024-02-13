

// Iterates through the listOfTags to see if any of them are a child
// of the input tag. If no match is found, then the input tag is child less
function isChildless(tag, listOfTags){
    const childTags = listOfTags.filter((x) => x.startsWith(tag) && x != tag);

    return !(childTags.length > 0);

}

// adds hashtag to tags that are missing them
function hashifyTags(frontmatter){
    const hashedTags = frontmatter["tags"].map((x) => !x.startsWith("#") ? "#" + x : x);

    frontmatter["tags"] = hashedTags;

    return frontmatter;

}

// Extract the domains from the provided frontmatter array
function extractDomains(frontmatter){
    const tagList = Array.from(frontmatter["tags"]);

    return tagList.filter((x) => x.startsWith("#domain")).sort();
}

// Extract the tags (w/o domain and parentTag family tags) from
// the provided frontmatter array.
function extractTags(frontmatter, parentTag){
    const tagList = Array.from(frontmatter["tags"]);

    return tagList.filter((x) => !x.startsWith("#domain") && !x.startsWith(parentTag)).sort();
}

// Extract the properties from the provided frontmatter array.
function extractProperties(frontmatter){
    const propertyArr = Array.from(Object.keys(frontmatter));

    return propertyArr.filter((y) => y.toLowerCase() != "aliases" && y.toLowerCase() != "tags").sort();

}

// Function with if logic that builds a table
// according to column arrays, but remove those
// that were not requested by the user
// It should also group by the remaining columns to avoid
// duplicates caused by generating all properties
// Counts will not be returned by this code.
function buildTable(domains, tags, properties){

    let headers = [];
    let matrix = [];

    // These if statements build the headers and column array
    // based on columns that the user specified
    if(domains){
        headers.push("domains");
        matrix.push(domains);
    }
    if(tags){
        headers.push("tags");
        matrix.push(tags);
    }
    if(properties){
        headers.push("properties");
        matrix.push(properties);
    }

    // https://stackoverflow.com/a/46805290
    matrix = matrix[0].map((col, i) => matrix.map(row => row[i]));

    // Logic to remove potential duplicates.
    // Uses serialization and a set conversion to achieve this
    matrix = matrix.map((x) => JSON.stringify(x));
    matrix = [... new Set(matrix)];
    matrix = matrix.map((x) => JSON.parse(x));

    return dv.markdownTable(headers, matrix);
}


function displayTable(tagToAnalyze, table){
    dv.span(tagToAnalyze);
    dv.paragraph(table);

}



// The input will be the parent tag you wish to map a schema for.
// Each non-parent subtag of the input tag will have their domain, tag, and property
// combinations mapped out in a table.
async function generate(parentTag, displayDomains=false, displayTags=false, displayProperties=false){

    // Early failure in case of bad or incomplete parameters
    if (!displayDomains && !displayTags && !displayProperties){
        dv.paragraph("No columns specified");
        return;
    }

    if (!parentTag){
        dv.paragraph("No tag provided to map");
        return;
    }

    /* Creating a list of all child tags to map
    *  Any tag with children are considered a parent and are excluded
    *  from the list. Note that if the user entered a tag with no children
    *  it will be included in the mapping
    */


    const everyTagFromVault = await dv.tryQuery("LIST group by file.tags");

    const distinctTagsFromVault = [... new Set (everyTagFromVault.values.flat())];

    // Get all tags that match the user's input, or are a descendant of it.
    let tagsToMap = distinctTagsFromVault.filter((x) => x.startsWith(parentTag)).sort();


    // The input tag doesn't exist
    if (tagsToMap.length == 0){
        dv.paragraph("The provided input tag " + parentTag + " does not exist.");
        return;
    }

    // Remove parents from the mapping
    // Don't run this if only one tag matches the user's input
    if(tagsToMap.length > 1){
        tagsToMap = tagsToMap.filter((x) => isChildless(x, tagsToMap));
    }


    // main loop where each tag will be iterated through
    // and it's respective table will be built and displayed.
    for (let i = 0; i < tagsToMap.length; i++)
    {

        let frontmatterArr = await dv.tryQuery("LIST from " + tagsToMap[i] + " group by file.frontmatter");

        frontmatterArr = Array.from(frontmatterArr.values);

        frontmatterArr = frontmatterArr.map((x) => hashifyTags(x));

        const domains =  displayDomains ? frontmatterArr.map((x) => extractDomains(x)) : null;

        const tags =  displayTags ? frontmatterArr.map((x) => extractTags(x, parentTag)) : null;

        const properties = displayProperties ? frontmatterArr.map((x) => extractProperties(x)) : null;

        const table = buildTable(domains, tags, properties);

        displayTable(tagsToMap[i], table);

    }



}


generate(input.parentTag, input.displayDomains, input.displayTags, input.displayProperties);

