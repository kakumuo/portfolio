import { Box, Divider, Typography } from "@mantine/core";
import { Link } from "react-router";


export function SectionHeader(props:{children?:any, title:string, more?:{label:string, link:string}}){
    return <Box className={`${styles.container}`}>
        <Box className={styles.header}>
            <Typography>{props.title}</Typography>
            {props.more && 
                <Link to={props.more.link}>[{props.more.label}]</Link>
            }
        </Box>
        <Divider/>
        {props.children}
    </Box>
}

const styles = {
    container: `mt-10 mb-5 grid`, 
    header: `grid grid-cols-[1fr_auto_auto]`
}