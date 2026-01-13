import * as React from 'react'; 

import { Box, Typography } from "@mantine/core";
import { MainPage } from "../components/MainPage";
import { SectionHeader } from "../components/SectionHeader";
import { BlogPostPreview } from "../components/BlogPostPreview";
import { ProjectPreview } from "../components/ProjectPreview";
import { Caption } from "../components/Caption";
import { AppContext } from "../app";
import type { BlogHeader, PostData, ProjectHeader } from '../components/types';
import Markdown from 'react-markdown';


export function HomePage(){
    const {client} = React.useContext(AppContext); 
    const [overview, setOverview] = React.useState({} as PostData)
    const [featuredBlogData, setFeaturedBlogData] = React.useState([] as BlogHeader[]); 
    const [featuredProjData, setFeaturedProjData] = React.useState([] as ProjectHeader[]); 

    React.useEffect(() => {      
        ;(async() => {
            const [overviewData, blogData, projData] = await Promise.all([
                client.getPostData({id: 'overview'}), 
                client.getBlogHeader({}), 
                client.getProjectHeader({}), 
            ])

            setOverview(overviewData) 

            const blogRes = blogData.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            setFeaturedBlogData(blogRes); 

            const projRes = projData.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            setFeaturedProjData(projRes); 
        })(); 
    }, []); 

    return <MainPage>
        {overview && <Box className={styles.textheader}><Markdown >{overview.postContent}</Markdown></Box>}
        
        <SectionHeader title="Featured Posts" more={{label: "More Posts", link: "/blog"}} />
        <Box className={styles.blogCarousel}>
            {featuredBlogData.map((data, dataI) => <BlogPostPreview key={dataI} blogData={data}/>)}
        </Box>
        
        <SectionHeader  title="Projects" more={{label: "More Projects", link: "/projects"}}>
            <Caption className={styles.projectHelp}>
                <Typography className={styles.projectHelp}>[?]</Typography>
            </Caption>
        </SectionHeader>
        <Box className={styles.projectsSection}>
            {featuredProjData.map((proj, projI) => <ProjectPreview data={proj} key={projI} />)}
        </Box>
    </MainPage>
}

const styles = {
    container: `h-full w-full grid`,
    textheader: `pl-4 pr-4`, 
    blogCarousel: `w-full h-auto grid grid-rows-1 grid-cols-3 gap-sm pl-4 pr-4`,
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}