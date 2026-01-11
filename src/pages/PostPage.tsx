import * as React from 'react'
import { Box, Divider, Skeleton, Typography } from "@mantine/core";
import { Link, useLocation, useParams } from "react-router";
import { MainPage } from "../components/MainPage";
import { LinkButtonGroup, StatusGrid, TechMakeupBar } from "../components/ProjectPreview";
import { formatDate, resolvePreload } from '../components/Utils';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type GitRevision, type ProjectHeader, type BlogHeader, type PostPageData, type Preload } from '../components/types';
import { AppContext } from '../app';
import type { PortfolioClient } from '../components/PortfolioClient';

/*

export async function loadPostPage(client:PortfolioClient, data:Preload<PostPageData>, targetId?:string) {
    const pageData:PostPageData = {} as PostPageData; 
    pageData.isProject = location.pathname.includes("/projects/");      

    let targetData; 
    if(!data.headerData) {
        const headerResp = pageData.isProject ? (await client.getProjectHeader({})) : (await client.getBlogHeader({}))
        targetData = headerResp.find(val => val.id == targetId); 
        if(targetData) pageData.headerData = targetData; 
    }

    // handle calls async
    if(!data.postData && targetId) {
        client.getPostData({id: targetId}).
            then(resp => resp.length > 0 && (pageData.postData = resp[0]))

    if(!data.postChangelog && targetId)
        client.getPostChangelog({id: targetId})
            .then(resp => pageData.postChangelog = resp); 
    }

    if(!data.projChangelog && (targetData as ProjectHeader).git) {
        client.getProjectChangelog({link: (targetData as ProjectHeader).git!})
            .then(resp => (pageData.projChangelog = resp)); 
    }

    return pageData
}
*/


export function loadPostPage(client:PortfolioClient, data:Preload<PostPageData>, isProject:boolean, id:string) {
    data.isProject = new Promise((resolve, _) => resolve(isProject)); 
    data.headerData = isProject ? client.getProjectHeader({ids:[id]}) : client.getBlogHeader({ids:[id]}); 
    data.postData = client.getPostData({id: id})
    data.postChangelog = client.getPostChangelog({id: id})
    if(isProject)
        data.projChangelog = client.getProjectChangelog({linkOrId: id})

    return data
}

export function PostPage() {
    const params = useParams(); 
    const location = useLocation(); 
    const [pageData, setPageData] = React.useState(null! as PostPageData); 
    const {client, preload} = React.useContext(AppContext)

    React.useEffect(() => {
        ;(async() => {
            let preloadData = {} as Preload<PostPageData>
            if(Object.hasOwn(preload, location.pathname) && preload[location.pathname]) {
                console.log("postpage - retreving data")
                preloadData = await preload[location.pathname].data; 
            } else {
                preloadData = loadPostPage(client, {} as Preload<PostPageData>, location.pathname.match(/project/) != null, params.id!); 
            }

            setPageData(await resolvePreload(preloadData));
        })(); 
    }, [params.id]); 

    React.useEffect(() => {
        console.log("Updated page data", pageData)
    }, [pageData]); 

    return <MainPage className={styles.container}>
        {!pageData || !pageData.headerData || !pageData.postData ? 
            <Skeleton variant='text' /> 
            :<>
                {pageData.isProject ? <ProjectBanner data={pageData.headerData[0] as ProjectHeader} />: <BlogBanner data={pageData.headerData[0] as BlogHeader} />}
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



