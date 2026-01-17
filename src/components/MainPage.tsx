import { Box } from "@mantine/core";


export function MainPage(props:{children?:any, className?:string, style?:React.CSSProperties, ref?:any}){
    return <Box ref={props.ref} className={`${styles.container} ${props.className}`} style={styles}>
        {props.children}
    </Box>
}

const styles = {
    container: `flex flex-col`
}