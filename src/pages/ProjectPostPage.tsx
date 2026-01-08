import { Box } from "@mantine/core";
import { useParams } from "react-router";


export function PostPage() {
    const params = useParams()
    
    return <Box className={styles.container}>
        {params.project_id}
    </Box>
}

const styles = {
    container: ``
}


