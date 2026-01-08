import { Typography, Box, Input } from "@mantine/core";
import { Caption } from "../components/Caption";
import { ProjectPreview } from "../components/ProjectPreview";
import  { SectionHeader } from "../components/SectionHeader";
import { projects } from "../sampleData";
import { MainPage } from "../components/MainPage";
import { SearchBar } from "../components/SearchBar";


export function ProjectsPage(){
    return <MainPage>
        <SectionHeader  title="Projects">
            <Caption className={styles.projectHelp}>
                <Typography className={styles.projectHelp}>[?]</Typography>
            </Caption>
        </SectionHeader>

        <SearchBar />

        <Box className={styles.projectsSection}>
            {projects.map((proj, projI) => <ProjectPreview data={proj} key={projI} />)}
        </Box>
    </MainPage>
}


const styles = {
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}