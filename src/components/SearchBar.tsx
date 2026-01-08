import { Box, Input } from "@mantine/core"


export function SearchBar(){
    return <Box className={styles.container}>
            <Input />
            <Box className={styles.filter}>

            </Box>
        </Box>
}

const styles = {
    container: ``, 
    filter: ``, 
}