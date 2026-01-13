import { Box } from "@mantine/core";
import { useLocation } from "react-router";
import { HashLink } from 'react-router-hash-link';

export type SideNavElement = {
    label: string, 
    href: string,
    priority: number
}

export function SideNav(props:{rootElements:SideNavElement[]}){
    const loc = useLocation()

    return <Box className={styles.container}> 
        {props.rootElements.map((e, eI) => <Box key={eI} className={styles.elementcontainer}>
            <HashLink smooth className={styles.link} to={e.href} key={e.href}>{e.label}</HashLink>
            <Box className={styles.tick} />
        </Box>)}
    </Box>
}

const styles = {
    container: `right-0 top-[25%] fixed pr-10 grid grid-cols-1 grid-rows-auto gap-md w-full max-w-[12vw]`, 
    // container: `top-20 right-0 bottom-10 w-full max-w-[15vw] justify-end pl-10 lg:fixed`, 
    elementcontainer: `grid grid-cols-[auto_1fr] grid-rows-1 gap-sm items-center`, 
    link: ``, 
    tick: `border h-.01`, 
}