import { Box, Typography } from "@mantine/core"
import { MainPage } from "../components/MainPage"

export function NotFoundPage(props:{className?:string,}){   
    return <MainPage className={`${props.className ?? ""} ${styles.container}`}>
        <Typography>404</Typography>
        <Typography>Page not found</Typography>
        <Typography>The requested url ({`${location.protocol}//${location.hostname}${location.pathname}`}) does not exist</Typography>
    </MainPage>
}

const styles = {
    container: `grid m-auto`, 
}