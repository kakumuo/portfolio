import { Typography, Box, Input } from "@mantine/core";
import { Caption } from "../components/Caption";
import { ProjectPreview } from "../components/ProjectPreview";
import  { SectionHeader } from "../components/SectionHeader";
import { projects } from "../sampleData";


export function ProjectsPage(){
    return <Box className={styles.container}>
        <SectionHeader  title="Projects">
            <Caption className={styles.projectHelp}>
                <Typography className={styles.projectHelp}>[?]</Typography>
            </Caption>
        </SectionHeader>

        <Box className={styles.searchContainer}>
            <Input />
            <Box className={styles.searchFilter}>

            </Box>
        </Box>

        <Box className={styles.projectsSection}>
            {projects.map((proj, projI) => <ProjectPreview data={proj} key={projI} />)}
        </Box>
    </Box>
}


const styles = {
    container: `flex flex-col gap-lg`, 
    searchContainer: `grid`, 
    searchFilter: `grid`, 
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}