import * as React from 'react'
import { Box, Divider, Skeleton, Typography } from "@mantine/core";
import { Link, useLoaderData } from "react-router";
import { MainPage } from "../components/MainPage";
import { LinkButtonGroup, StatusGrid, TechMakeupBar } from "../components/ProjectPreview";
import { formatDate } from '../components/Utils';
import { type GitRevision, type ProjectHeader, type BlogHeader, type PostPageData, type Preload } from '../components/types';
import type { PortfolioClient } from '../components/PortfolioClient';
import { StyledMarkdown } from '../components/MarkdownStyle';
import { SideNav, type SideNavElement } from '../components/SideNav';


const sampleNavElements: SideNavElement[] = [
  { label: "Experience", href: "#experience", priority: 1 },
  { label: "Projects", href: "#projects", priority: 2 },
  { label: "Teams", href: "#teams", priority: 3 },
  { label: "Reports", href: "#reports", priority: 4 },
  { label: "Settings", href: "#settings", priority: 5 },
  { label: "Help Center", href: "#help", priority: 6 },
  { label: "Profile", href: "#profile", priority: 7 },
  { label: "Logout", href: "#logout", priority: 99 }
]; 

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
    const preloadData = useLoaderData<typeof loadPostPage>(); 
    const [sideNavElements, setSideNavElements] = React.useState(sampleNavElements)
    const bodyRef = React.useRef<HTMLDivElement>(null!); 

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


    // run when data is loaded
    React.useEffect(() => {
        if(!bodyRef.current || !bodyRef.current.children) return; 
        const tmp:SideNavElement[]= []; 
        const targetAnchors = ['h1', 'h2', 'h3', 'h4', 'h5']

        for(let child of bodyRef.current.children) {
            if(targetAnchors.includes(child.tagName.toLowerCase())) {
                const targetId = child.textContent.toLowerCase().replace(' ', '-'); 
                child.id = targetId; 

                tmp.push({label: child.textContent, href: "#" + targetId, priority: targetAnchors.indexOf(child.tagName.toLowerCase())})
            }
        }

        setSideNavElements(tmp); 

    }, [pageData])

    return <MainPage className={styles.container}>
        {!pageData || !pageData.headerData || !pageData.postData ? 
            <Skeleton variant='text' /> 
            :<>
                <SideNav rootElements={sideNavElements} />
                {pageData.isProject ? <ProjectBanner data={pageData.headerData[0] as ProjectHeader} />: <BlogBanner data={pageData.headerData[0] as BlogHeader} />}
                <Box ref={bodyRef} className={styles.body}>
                    <StyledMarkdown>{pageData.postData.postContent}</StyledMarkdown>
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
        <StyledMarkdown>{props.revision.body}</StyledMarkdown>
    </Box>
}

const styles = {
    container: `gap-lg mb-12`, 
    header: {
        container: `grid mt-12`, 
        head: `grid grid-cols-[auto_1fr_auto] grid-rows-1`, 
        footer: `grid`,
    },
    body: `grid gap-md`, 
    changelog: {
        container: `grid gap-md`, 
        header: `grid gap-sm`, 
        revision: {
            container: `grid`, 
            header: `grid grid-cols-[auto_1fr_auto]`, 
        }
    }, 
}



