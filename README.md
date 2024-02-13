# About
My Obsidian vault uses tags and properties to mimic a relational database. The vault has a strong focus on domains while not limiting tags and file properties to any one of them. [More details on my data and domain tag structure are provided below.](#Closing-Notes-on-Tags-Referenced-in-the-Script)

This approach has allowed me to use [Dataview](https://github.com/blacksmithgu/obsidian-dataview) to quickly search my notes, answer my own data requests, and add features (e.g. my [personal message archiving system](https://github.com/StevenLares/Messaging-Thread-View-for-Dataview-and-Obsidian)). In tandem with [Maps of Content](https://obsidian.rocks/maps-of-content-effortless-organization-for-notes/), this modular approach has made it easy to build queries in Obsidian's tag search as well as Dataview's query language.

Yet as my system continued to grow, it became difficult to track relationships between data types across their inter-domain usage.
While I still find Obsidian's tag and property panes useful for building tag based queries, I no longer found them suitable for maintenance purposes.

Therefore, I wrote a generic, functional, and high performance script that maps out the schema for subtags of an input tag.

I have open-sourced this script for other Dataview users to use and modify according to their needs.

# Script Features

For each non-parent tag that is a descendant of the input tag, a table is created where each row represents a unique combination of:

1. domains
2. tags (not including domains)
3. properties

that that tag has been associated with.

In addition, the script has parameters that specify which columns will be displayed in the mapping table.

Furthermore, the script is designed in a way where users can add their own tag types to be extracted;
the user will need to create a function to extract them from the Obsidian page but hints are provided in the code on how to do this.

Finally, I have provided notes below that describe my use of data and domain subtags.
In short, the script is flexible enough that you can use it to map out domains, tags, and/or file property combinations for <i>any</i> tag in your vault.
A user does not <i>need</i> to have domain or data tags in their Obsidian vault but will benefit if they do.

# Usage

## Parameters:

1. parentTag:
    - String: tag you wish to map.
    - In my examples, I use \#data as the input
2. displayDomains:
    - Boolean: set to true to display domains, false otherwise.
    - Should be set to false if you don't tag your notes with a domain subtag.
3. displayTags:
    - Boolean: set to true to display tags (without domains), false otherwise
4. displayProperties:
    - Boolean: set to true to display properties, false otherwise


## Calling the method from a tag page
Use [Tag Wrangler](https://github.com/pjeby/tag-wrangler) to create tag pages from the tag pane. When created this way, the tag pages will have an alias that matches the tag's name.
From here, insert the following code block (begin with \```dataviewjs and end with \```)

\```dataviewjs

```

const alias = dv.current().aliases[0]
await dv.view("path/to/schemaMapper",
{parentTag: alias, displayDomains:true, displayTags:true, displayProperties:true})

```

\````


## Calling the method from anywhere

\```dataviewjs

```

//can be any tag you wish to map
const tag = #data
await dv.view("path/to/schemaMapper",{parentTag: tag, displayDomains:true, displayTags:true, displayProperties:true})

```

\````



## Example Tag Inputs

1. domains:
    - #domain/Career
    - #domain/Education
    - #domain/Obsidian
    - #domain/home_lab
2. data:
    - #data/article
    - #data/book
    - #data/contact
    - #data/machine
    - #data/job/prospecting
3. Other tags.
    - These are just the non-domain tags I happened to use when running the script in my vault, you may use anything else.





## Example Output

#data/article

| domains | tags | properties |
| ---- | ---- | ---- |
| #domain/career<br>#domain/education | #contains/dataview<br>#index |  |
| #domain/career<br>#domain/education |  | URL<br>authors<br>category<br>subcategory<br>summary<br>tech_stack |

#data/book

| domains | tags | properties |
| ---- | ---- | ---- |
| #domain/career<br>#domain/education | #contains/dataview<br>#index |  |
| #domain/career<br>#domain/education |  | ISBN<br>authors<br>category<br>subcategory<br>summary |

#data/contact

| domains | tags | properties |
| ---- | ---- | ---- |
| #domain/career | #contains/dataview<br>#index |  |
| #domain/career |  | career_resource<br>companies<br>linkedin<br>primary_email<br>primary_phone<br>reference<br>relationship<br>secondary_email<br>secondary_phone |

#data/machine

| domains | tags | properties |
| ---- | ---- | ---- |
| #domain/home_lab | #contains/dataview<br>#index |  |
| #domain/home_lab |  | deployed<br>device_type<br>duplicacy_snapshot_id<br>local_host_name<br>local_ip<br>operating_system<br>tailscale_ip |

#data/job/prospecting

| domains | tags | properties |
| ---- | ---- | ---- |
| #domain/career | #contains/dataview<br>#focus/job_info | W2_or_contract<br>application_date<br>application_link<br>application_status<br>application_summary<br>company<br>contacts<br>end_date<br>full_or_part_time<br>hourly_or_salary<br>job_offer_date<br>job_resume<br>location<br>pay<br>start_date<br>total_hours_in_contract |



## Closing Notes on Tags Referenced in the Script

### Domain

1. Domain tags are optional for this script
2. I use this tagging style for domains in my Obsidian vault.
    - #domain/domain1
    - #domain/domain2
3. I do not create subdomains, since I prefer to promote cross-domain tags and properties.
4. Note that while I did not design this script for subdomains, they will be mapped as expected.

### Data Tags

Data subtags in my vault behave much like tables in a relational database, although they may be reused across domains.

They may also use different file properties depending on their domain combination.

For example, I may have a data/article tag associated with an education domain on one page, associated with a career domain on another page, and both on yet another page.
