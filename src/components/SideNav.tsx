import { Box } from "@mantine/core";
import React, { useState } from "react";
import { HashLink } from 'react-router-hash-link';

export type SideNavElement = {
    label: string, 
    href: string,
    priority: number
    yPos: number
}


export function SideNav(props:{rootElements:SideNavElement[], scrollY:number, maxScrollY:number}){
    const [closest, setClosest] = React.useState(""); 

    React.useEffect(() => {
        if(props.rootElements.length > 0) {
            const tmp = [...props.rootElements]; 
            tmp.sort((a, b) => Math.abs(a.yPos - props.scrollY) - Math.abs(b.yPos - props.scrollY))
            setClosest(tmp[0].label)
        }
    }, [props.scrollY, props.rootElements])

    return <Box className={styles.container}> 
        {props.rootElements.map((e, eI) => {
            return <Box key={eI} className={styles.elementcontainer}>
                <HashLink smooth className={styles.link} style={{color: closest == e.label ? 'orange' :'black'}} to={e.href} key={e.href}>{e.label}</HashLink>
                <Box className={styles.tick} />
            </Box>
        })}
    </Box>
}

const styles = {
    container: `right-0 top-1/2 -translate-y-1/2 fixed pr-10 grid grid-cols-1 grid-rows-auto gap-md w-full max-w-[15vw]`, 
    elementcontainer: `grid grid-cols-[auto_1fr] grid-rows-1 gap-sm items-center`, 
    link: `font-subtext`, 
    tick: `border h-.01`, 
    subtick: `border border-black/2 h-.01`, 
}