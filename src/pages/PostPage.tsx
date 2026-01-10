import * as React from 'react'
import { Box, Divider, Skeleton, Typography } from "@mantine/core";
import { Link, useLocation, useParams } from "react-router";
import { MainPage } from "../components/MainPage";
import { LinkButtonGroup, StatusGrid, TechMakeupBar } from "../components/ProjectPreview";
import { formatDate } from '../components/Utils';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GitRevision, ProjectHeader, BlogHeader, PostData } from '../components/types';
import { AppContext } from '../app';




const changelog: GitRevision[] = [
  {
    id: "a1b2c3d",
    url: "a1b2c3d",
    title: "Add authentication middleware",
    date: 1,
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
    url: "d4e5f6g",
    title: "Fix memory leak in data parser",
    date: 1,
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
    url: "h7i8j9k",
    title: "Improve dashboard UI",
    date: 1,
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
    url: "r1v2b3n",
    title: "Initial draft of 'AI in Everyday Life'",
    date: 1,
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
    url: "c4x5z6a",
    title: "Added images and formatting",
    date: 1,
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
    url: "m7n8b9v",
    title: "SEO optimization and metadata",
    date: 1,
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
    url: "x1y2z3k",
    title: "Final review and publication",
    date: 1,
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

export type PostPageData = {
    isProject:boolean, 
    headerData:ProjectHeader | BlogHeader, 
    postData:PostData, 
    postChangelog:GitRevision[], 
    projChangelog:GitRevision[],
}

export function PostPage() {
    const params = useParams(); 
    const location = useLocation(); 
    const [pageData, setPageData] = React.useState({} as PostPageData); 
    const {client, preload} = React.useContext(AppContext)

    React.useEffect(() => {
        console.log(preload); 
        console.log(location.pathname)

        if(Object.hasOwn(preload, location.pathname) && preload[location.pathname] && preload[location.pathname].data) {
            console.log("postpage - retreving data")
            setPageData(preload[location.pathname].data as any)
        } else {
            console.log("postpage - pulling data")
            ;(async() => {     
                const pageData:PostPageData = {} as PostPageData; 
                pageData.isProject = location.pathname.includes("/projects/");      

                const headerResp = pageData.isProject ? (await client.getProjectHeader({})) : (await client.getBlogHeader({}))
                const targetData = headerResp.find(val => val.id == params.id); 
                if(targetData) pageData.headerData = targetData; 

                // handle calls async
                if(params.id) {
                    let resp:any; 
                    resp = await client.getPostData({id: params.id})
                    if(resp.length > 0) pageData.postData = resp[0];

                    resp = await client.getPostChangelog({id: params.id})
                    pageData.postChangelog = resp;
                }

                if((targetData as ProjectHeader).git) {
                    let resp = await client.getProjectChangelog({link: (targetData as ProjectHeader).git!})
                    pageData.projChangelog = resp; 
                }

                setPageData(pageData); 
            })(); 
        }
    }, [location]); 

    return <MainPage className={styles.container}>

        {!pageData.headerData || !pageData.postData ? 
            <Skeleton variant='text' /> 
            :<>
                {pageData.isProject ? <ProjectBanner data={pageData.headerData as ProjectHeader} />: <BlogBanner data={pageData.headerData as BlogHeader} />}
                <Box className={styles.body}>
                    <Markdown components={mdStyle} remarkPlugins={[remarkGfm]}>{pageData.postData.postContent}</Markdown>
                </Box>  
                {pageData.isProject && <ChangeLog title='Project ChangeLog' revisions={pageData.projChangelog} />}
                <ChangeLog title='Post ChangeLog' revisions={pageData.postChangelog} />
            </>
        }
    </MainPage>
}


function ProjectBanner(props:{data:ProjectHeader}) {
    return <Box className={styles.header.container}>
        <Box className={styles.header.head}>    
            <StatusGrid data={props.data} />
            <Typography>{props.data.title}</Typography>
            <LinkButtonGroup data={props.data} />
        </Box>
        <Divider />
        <Box className={styles.header.footer}>
            <Typography>{props.data.summary}</Typography>
            <TechMakeupBar makeup={props.data.makeupLayers} />
        </Box>
    </Box>
}

function BlogBanner(props:{data:BlogHeader}){
    return <Box className={styles.header.container}>
        <Typography>{props.data.title}</Typography>
        <Divider />
        <Box className={styles.header.footer}>
            <Typography>{formatDate(props.data.createDate)}</Typography>
        </Box>
    </Box>
}

function ChangeLog(props:{title:string, revisions:GitRevision[]}){
    return <Box className={styles.changelog.container}>
        <Box className={styles.changelog.header}>
            <Typography>{props.title}</Typography>
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
            <Link to={props.revision.url}><Typography>{props.revision.id.substring(0, 7)}</Typography></Link>
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



