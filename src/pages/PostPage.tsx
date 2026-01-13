import * as React from 'react'
import { Box, Divider, Skeleton, Typography } from "@mantine/core";
import { Link, useLoaderData } from "react-router";
import { MainPage } from "../components/MainPage";
import { LinkButtonGroup, StatusGrid, TechMakeupBar } from "../components/ProjectPreview";
import { formatDate, resolvePreload } from '../components/Utils';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type GitRevision, type ProjectHeader, type BlogHeader, type PostPageData, type Preload } from '../components/types';
import type { PortfolioClient } from '../components/PortfolioClient';
import { MarkdownStyle } from '../components/MarkdownStyle';


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
    const [pageData, setPageData] = React.useState(null! as PostPageData); 
    const preloadData = useLoaderData<typeof loadPostPage>()

    React.useEffect(() => {
        ;(async() => {
            const [post, header, changelog] = await Promise.all([
                (await fetch("/samplePost/post.md")).text(), 
                (await fetch("/samplePost/header.json")).json(), 
                (await fetch("/samplePost/changelog.json")).json()
            ]); 

            // console.log(post, header, changelog); 

            setPageData({
                isProject: false, 
                headerData: [header], 
                postChangelog: changelog, 
                postData: {
                    postContent: post
                }
            } as PostPageData)
        })();
    }, [preloadData]); 

    return <MainPage className={styles.container}>
        {!pageData || !pageData.headerData || !pageData.postData ? 
            <Skeleton variant='text' /> 
            :<>
                {pageData.isProject ? <ProjectBanner data={pageData.headerData[0] as ProjectHeader} />: <BlogBanner data={pageData.headerData[0] as BlogHeader} />}
                <Box className={styles.body}>
                    <Markdown components={MarkdownStyle} remarkPlugins={[remarkGfm]}>{pageData.postData.postContent}</Markdown>
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



