import * as React from 'react'; 

import { Box, Typography } from "@mantine/core";
import { MainPage } from "../components/MainPage";
import { SectionHeader } from "../components/SectionHeader";
import { BlogPostPreview } from "../components/BlogPostPreview";
import { ProjectPreview } from "../components/ProjectPreview";
import { Caption } from "../components/Caption";
import { AppContext } from "../app";
import type { BlogHeader, ProjectHeader } from '../components/types';


export function HomePage(){
    const {client} = React.useContext(AppContext); 
    const [featuredBlogData, setFeaturedBlogData] = React.useState([] as BlogHeader[]); 
    const [featuredProjData, setFeaturedProjData] = React.useState([] as ProjectHeader[]); 

    React.useEffect(() => {
        (async() => {
            const blogData = await client.getBlogHeader({});
            const blogRes = blogData.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            setFeaturedBlogData(blogRes); 

            const projData = await client.getProjectHeader({}); 
            const projRes = projData.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            setFeaturedProjData(projRes); 
        })(); 
    }, []); 

    return <MainPage>
        <Typography className={styles.textheader}>
            I am an experienced software developer with a strong background in Backend and ETL development. Currently working as a Applicaiton Developer II at UPS, where I've been instrumental in developing and improving critical processes for managing large-scale customer data.
            I am committed to continuous learning and applying cutting-edge solutions to complex business problems in the rapidly evolving field of software development.
        </Typography>

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