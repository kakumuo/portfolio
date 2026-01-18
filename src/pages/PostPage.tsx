import * as React from 'react'
import { Box, Divider, Skeleton, Typography } from "@mantine/core";
import { data, Link, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { MainPage } from "../components/MainPage";
import { StatusGridCaption, TechMakeupBar } from "../components/ProjectPreview";
import { formatDate, resolvePreload, threeDigitCode } from '../components/Utils';
import { type GitRevision, type ProjectHeader, type BlogHeader, type PostPageData, type Preload, type PostPageResponseData, type PostData } from '../components/types';
import { PortfolioClient } from '../components/PortfolioClient';
import { StyledMarkdown } from '../components/MarkdownStyle';
import { SideNav, type SideNavElement } from '../components/SideNav';
import { Button } from '../components/Components';
import { LoadingPage } from './LoadingPage';


export function loadPostPage(client:PortfolioClient, data:Preload<PostPageResponseData>, isProject:boolean, id:string) {
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
    const [sideNavElements, setSideNavElements] = React.useState<SideNavElement[]>([])
    const [loaded, setLoaded] = React.useState(false); 
    const [scrollY, setScrollY] = React.useState(0); 
    const mainRef = React.useRef<HTMLDivElement>(null!); 
    const [client, _] = React.useState(new PortfolioClient()); 
    const {id} = useParams()
    const location = useLocation();

    
    const navigate = useNavigate()

    React.useEffect(() => {
        ;(async() => {
            // const [post, header, changelog, projchangelog] = await Promise.all([
            //     (await fetch("/samplePost/post.md")).text(), 
            //     (await fetch("/samplePost/projheader.json")).json(), 
            //     (await fetch("/samplePost/changelog.json")).json(), 
            //     (await fetch("/samplePost/changelog.json")).json()
            // ]); 

            // // console.log(post, header, changelog); 

            // setPageData({
            //     isProject: true, 
            //     headerData: [header], 
            //     postChangelog: changelog, 
            //     projChangelog: projchangelog,
            //     postData: {
            //         postContent: post
            //     }
            // } as PostPageData)

            const isProject = location.pathname.match(/\/projects\//) != null

            console.log(isProject)

            const [post, header, changelog, projChangelog] = await Promise.all([
                client.getPostData({id: id!}), 
                isProject ? client.getProjectHeader({ids: [id!]}) : client.getBlogHeader({ids: [id!]}), 
                client.getPostChangelog({id: id!}),
                client.getProjectChangelog({linkOrId: id!})
            ]);

            if(!post.success || !header.success || !changelog.success || (projChangelog && !projChangelog.success)) {
                const tmp = [header, changelog, post]
                if(projChangelog) tmp.push(projChangelog); 
                const target = tmp.find(d => d.success == false)
                navigate('/error', {
                    replace: true, 
                    state: target
                })
                return;
            }

            setPageData({
                isProject: isProject, 
                headerData: (header as any).data, 
                postChangelog: (changelog as any).data, 
                postData: (post as any).data, 
                projChangelog: (projChangelog as any).data
            })
            setLoaded(true); 
        })();

        return () => {
            setLoaded(false); 
        }
    }, [location.pathname]); 


    // run when data is loaded
        React.useEffect(() => {

        if(!mainRef.current) return; 
        const tmp:SideNavElement[]= [{
            href: '#title', 
            label: '[Top]', 
            yPos: 0
        }]; 
        const targetAnchors = ['h1', 'h2', 'h3', 'h4', 'h5']

        for (const child of mainRef.current!.children) {
            if (targetAnchors.includes(child.tagName.toLowerCase())) {

                tmp.push({
                    label: child.textContent,
                    href: "#" + child.id,
                    yPos: (child as HTMLElement).offsetTop - (child as HTMLElement).offsetHeight
                });
            }
        }

        setSideNavElements(tmp); 
    }, [pageData, mainRef.current])

    React.useEffect(() => {
        let scrollHandler:()=>void; 
        if(mainRef.current){
            scrollHandler = () => {
                setScrollY(mainRef.current.scrollTop + mainRef.current.clientTop)
            }
            mainRef.current.addEventListener('scroll', scrollHandler); 
        } 
        return () => {
            if(mainRef.current) mainRef.current.removeEventListener('scroll', scrollHandler);
        }
    }, [mainRef.current]);

    return <>{!loaded ? <LoadingPage /> : <MainPage 
        ref={mainRef}
        className={styles._} >
        {!pageData || !pageData.headerData || !pageData.postData ? 
            <Skeleton variant='text' /> 
            :<>
                <SideNav rootElements={sideNavElements} scrollY={scrollY} parentRef={mainRef}/>
                {pageData.isProject ? <ProjectBanner data={pageData.headerData[0] as ProjectHeader} />: <BlogBanner data={pageData.headerData[0] as BlogHeader} />}
                <Divider className='mb-[5vh] invisible' />
                <StyledMarkdown className='mb-[40vh]'>{pageData.postData.postContent}</StyledMarkdown>
                <Divider className='mt-[5vh] mb-auto invisible' />
                {pageData.isProject && <ChangeLog title='Project ChangeLog' revisions={pageData.projChangelog} />}
                <ChangeLog title='Post ChangeLog' revisions={pageData.postChangelog} />
            </>
        }
    </MainPage>}</>
}


function ProjectBanner(props:{data:ProjectHeader}) {
    const styles = {
        _: `flex flex-col gap-sm`, 
        header: `grid grid-cols-[auto_1fr_auto] items-end gap-md`, 
        footer: `grid grid-rows-[auto_1fr]`, 
    }

    return <Box className={styles._}>
        <Box className={styles.header}>
            <StatusGridCaption className='text-[.8em]' id='title' data={props.data} />
            <Typography className='font-title'>{props.data.title}</Typography>
            <Typography className='font-subheader justify-self-end self-end'>{formatDate(props.data.startDate)}</Typography>
        </Box>
        <Divider />
        <Box className={styles.footer}>
            <Typography className='font-subheader italic text-right'>{props.data.summary}</Typography>
            <TechMakeupBar makeup={props.data.makeupLayers} />
        </Box>
    </Box>
}

function BlogBanner(props:{data:BlogHeader}){
    const styles = {
        _: `grid grid-rows-[auto_1fr_auto] gap-sm`, 
        header: `font-subheader grid grid-cols-[auto_1fr_auto] grid-rows-1 items-center gap-sm`, 
        main: `relative border overflow-hidden grid grid-rows-2 p-md`, 
        footer: `font-subheader italic text-right`, 
    }

    return <Box className={styles._}>
        <Box className={styles.header}>
            <Typography>//BLOG-{threeDigitCode(props.data.id)}</Typography>
            <Divider />
            <Typography>READ TIME // 8 MINS</Typography>
        </Box>
        <Box className={styles.main}>
            <Typography className='font-title' id='title'>{props.data.title}</Typography>
            <Typography className='font-subheader justify-self-end self-end'>{formatDate(props.data.createDate)}</Typography>
            <img className='absolute left-1/2 top-1/2 -translate-1/2 -z-2 w-full h-auto objectfit-contain opacity-20' src={props.data.bannerImage} />
        </Box>
        <Typography className={styles.footer}>{props.data.summary}</Typography>
    </Box>
}

function ChangeLog(props: { title: string; revisions: GitRevision[] }) {
  const [show, setShow] = React.useState(false);

  return (
    <Box className={styles.changelog.container}>
        <Box className={styles.changelog.header}>
            <Typography className="font-subtitle">{props.title}</Typography>
            <Button onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
            </Button>
        </Box>
        <Divider />
        <Box
            className="grid grid-cols-1 grid-rows-auto transition-all duration-300 overflow-hidden gap-md"
            style={{ maxHeight: show ? "500px" : 0 }}
            >
            {props.revisions.map((rev, revI) => (
                <RevisionItem key={revI} revision={rev} />
            ))}
        </Box>
    </Box>
  );
}


function RevisionItem(props: { revision: GitRevision }) {
  return (
    <Box className={styles.changelog.revision.container}>
      <Box className={styles.changelog.revision.header}>
        <Typography className="font-subheader">{formatDate(props.revision.date)}</Typography>
        <Typography className="font-subtext text-[1.2em]">{props.revision.title}</Typography>
        <Divider />
        <Link to={props.revision.url}>
          <Typography className="font-label text-[1em] hover:underline">{props.revision.id.substring(0, 7)}</Typography>
        </Link>
      </Box>
      <StyledMarkdown className='px-8'>{props.revision.body}</StyledMarkdown>
    </Box>
  );
}

const styles = {
    _: `gap-sm mb-12 overflow-y-scroll px-4 flex flex-col`, 
    header: {
        container: `grid mt-12`, 
        head: `grid grid-cols-[auto_1fr_auto] grid-rows-1`, 
        footer: `grid`,
    },
    body: `grid gap-md font-body`, 
    changelog: {
        container: `grid gap-md`, 
        header: `grid grid-cols-[1fr_auto] grid-rows-1 gap-sm`, 
        revision: {
            container: `grid`, 
            header: `grid grid-cols-[auto_auto_1fr_auto] gap-md items-center`, 
        }
    }
}



