import * as React from 'react'
import { Box, Button, Divider, Typography } from "@mantine/core";
import { Link, useLocation, useParams } from "react-router";
import { MainPage } from "../components/MainPage";
import { LinkButtonGroup, StatusGrid, TechMakeupBar, type ProjectData } from "../components/ProjectPreview";
import { projects, sampleBlogData } from "../sampleData";
import type { BlogData } from '../components/BlogPostPreview';
import { formatDate } from '../components/Utils';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';




type GitRevision = {
    id:string, 
    title: string, 
    date:Date, 
    body:string, 
    revisionLink:string
}

type GitChangelog = {title:string, gitLink:string, changeItems:GitRevision[]}

const changelog: GitRevision[] = [
  {
    id: "a1b2c3d",
    revisionLink: "a1b2c3d",
    title: "Add authentication middleware",
    date: new Date("2026-01-02T10:30:00Z"),
    body: `
### Added
- Implemented **JWT-based authentication middleware** to secure API routes.
- Introduced new endpoints:
  - \`/login\`
  - \`/logout\`

### Details
This update enhances security by requiring valid tokens for all protected routes.
`
  },
  {
    id: "d4e5f6g",
    revisionLink: "d4e5f6g",
    title: "Fix memory leak in data parser",
    date: new Date("2026-01-05T14:00:00Z"),
    body: `
### Fixed
- Resolved a **memory leak** in the XML data parser caused by improper buffer cleanup.
- Improved parser efficiency by approximately **20%**.

### Code Snippet
\`\`\`ts
parser.cleanupBuffers()
\`\`\`
`
  },
  {
    id: "h7i8j9k",
    revisionLink: "h7i8j9k",
    title: "Improve dashboard UI",
    date: new Date("2026-01-07T09:15:00Z"),
    body: `
### Updated
- Refreshed **color scheme** for a modern look.
- Fixed alignment issues on main dashboard cards.
- Added **responsive grid** support for mobile devices.

### Preview
*The new layout improves user experience and accessibility.*
`
  }
]

const blogChangelog: GitRevision[] = [
  {
    id: "r1v2b3n",
    revisionLink: "r1v2b3n",
    title: "Initial draft of 'AI in Everyday Life'",
    date: new Date("2026-01-03T11:45:00Z"),
    body: `
### Created
- Wrote the **first draft** of the post: *AI in Everyday Life*.
- Added structure with:
  - Introduction
  - Overview of real-world applications
  - Placeholder sections for case studies

### Notes
This is an early draft intended for concept validation.
`
  },
  {
    id: "c4x5z6a",
    revisionLink: "c4x5z6a",
    title: "Added images and formatting",
    date: new Date("2026-01-05T08:20:00Z"),
    body: `
### Updated
- Inserted relevant **images** illustrating AI in consumer devices.
- Improved **Markdown formatting** for better readability.
- Adjusted **heading hierarchy** and fixed spacing issues.

### Example
\`\`\`md
## Examples of AI in Daily Life
\`\`\`
`
  },
  {
    id: "m7n8b9v",
    revisionLink: "m7n8b9v",
    title: "SEO optimization and metadata",
    date: new Date("2026-01-07T17:10:00Z"),
    body: `
### Added
- Configured **meta descriptions** and improved titles for search visibility.
- Enhanced internal linking between related technology articles.
- Refined headings to include popular **search keywords**.

### Benefit
Improves organic reach and ranking performance.
`
  },
  {
    id: "x1y2z3k",
    revisionLink: "x1y2z3k",
    title: "Final review and publication",
    date: new Date("2026-01-08T10:00:00Z"),
    body: `
### Completed
- Performed final **grammar and style** review.
- Finalized section structure and verified image attributions.
- Published *AI in Everyday Life* under the **Technology** category.

### Status
✅ Post published successfully on January 8, 2026.
`
  }
]



export function PostPage() {
    const params = useParams(); 
    const location = useLocation(); 
    const [isProject, setIsProject] = React.useState(true);  
    const [bodyContent, setBodyContent] = React.useState(""); 

    React.useEffect(() => {
        setIsProject(location.pathname.includes("/projects/")); 

        ; (async() => {
            const resp = await fetch("/posts/projtest.md"); 
            const respText = await resp.text(); 

            console.log(respText); 
            setBodyContent(respText); 
        })()
    }, [location]); 

    return <MainPage className={styles.container}>
        {isProject ? <ProjectHeader data={projects[0]} />: <BlogHeader data={sampleBlogData[0]} />}
        <Box className={styles.body}>
            <Markdown components={mdStyle} remarkPlugins={[remarkGfm]}>{bodyContent}</Markdown>
        </Box>  
        {isProject ? 
            <>
                <ChangeLog title='Project ChangeLog' link='.' revisions={changelog} />
                <ChangeLog title='Post ChangeLog' link='.' revisions={blogChangelog} />
            </>

            : 
            <ChangeLog title='Changelog' link='.' revisions={blogChangelog} />
        }

    </MainPage>
}


function ProjectHeader(props:{data:ProjectData}) {
    return <Box className={styles.header.container}>
        <Box className={styles.header.head}>    
            <StatusGrid data={props.data} />
            <Typography>{props.data.title}</Typography>
            <LinkButtonGroup data={props.data} />
        </Box>
        <Divider />
        <Box className={styles.header.footer}>
            <Typography>{props.data.preview}</Typography>
            <TechMakeupBar makeup={props.data.techMakeup} />
        </Box>
    </Box>
}

function BlogHeader(props:{data:BlogData}){
    return <Box className={styles.header.container}>
        <Typography>{props.data.title}</Typography>
        <Divider />
        <Box className={styles.header.footer}>
            <Typography>{formatDate(props.data.created)}</Typography>
        </Box>
    </Box>
}

function ChangeLog(props:{title:string, link:string, revisions:GitRevision[]}){
    return <Box className={styles.changelog.container}>
        <Box className={styles.changelog.header}>
            <Link to={props.link}><Typography>{props.title}</Typography></Link>
            <Divider />
        </Box>
        {props.revisions.map((rev, revI)=> <RevisionItem key={revI} revision={rev} />)}
    </Box>
}

function RevisionItem(props:{revision:GitRevision}) {
    return <Box className={styles.changelog.revision.container}>
        <Box className={styles.changelog.revision.header}>
            <Typography>{formatDate(props.revision.date)}</Typography>
            <Typography>{props.revision.title}</Typography>
            <Link to={props.revision.revisionLink}><Typography>{props.revision.id}</Typography></Link>
        </Box>
        <Markdown>{props.revision.body}</Markdown>
    </Box>
}

const mdStyle:Components = {
    // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
    em(props) {
        const {node, ...rest} = props
        return <i style={{color: 'red'}} {...rest} />
    }
}

const styles = {
    container: `gap-lg mb-12`, 
    header: {
        container: `grid mt-12`, 
        head: `grid grid-cols-[auto_1fr_auto] grid-rows-1`, 
        footer: `grid`,
    },
    body: `grid`, 
    changelog: {
        container: `grid gap-md`, 
        header: `grid gap-sm`, 
        revision: {
            container: `grid`, 
            header: `grid grid-cols-[auto_1fr_auto]`, 
        }
    }, 
}



