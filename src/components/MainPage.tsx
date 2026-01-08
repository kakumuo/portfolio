import { Box } from "@mantine/core";


export function MainPage(props:{children?:any}){
    return <Box className={styles.container}>
        {props.children}
    </Box>
}

const styles = {
    container: `flex flex-col`
}