import React from "react";

import { Typography, Box, Input } from "@mantine/core";
import { Caption } from "../components/Caption";
import { ProjectPreview } from "../components/ProjectPreview";
import  { SectionHeader } from "../components/SectionHeader";
import { MainPage } from "../components/MainPage";
import { SearchBar } from "../components/SearchBar";
import type { ProjectHeader } from "../components/types";
import { AppContext } from "../app";


export function ProjectsPage(){
    const {client} = React.useContext(AppContext); 
    const [projectHeaders, setProjectHeaders]   = React.useState([] as ProjectHeader[]) 

    React.useEffect(() => {
        ; (async() => {
            const resp = await client.getProjectHeader({}); 
            setProjectHeaders(resp); 
        })(); 
    }, [])

    return <MainPage>
        <SectionHeader  title="Projects">
            <Caption className={styles.projectHelp}>
                <Typography className={styles.projectHelp}>[?]</Typography>
            </Caption>
        </SectionHeader>

        <SearchBar />

        <Box className={styles.projectsSection}>
            {projectHeaders.map((proj, projI) => <ProjectPreview data={proj} key={projI} />)}
        </Box>
    </MainPage>
}


const styles = {
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}