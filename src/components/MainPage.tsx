import { Box } from "@mantine/core";


export function MainPage(props:{children?:any, className?:string}){
    return <Box className={`${styles.container} ${props.className}`}>
        {props.children}
    </Box>
}

const styles = {
    container: `flex flex-col`
}