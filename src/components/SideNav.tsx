import { Box, colorsTuple, Divider, Typography } from "@mantine/core";
import React, { useState } from "react"; 
import { HashLink } from 'react-router-hash-link';

export type SideNavElement = {
    label: string, 
    href: string,
    yPos: number
}


export function SideNav(
    {rootElements, scrollY, maxScrollY, parentRef}:
    {rootElements:SideNavElement[], scrollY:number, maxScrollY:number, parentRef:React.RefObject<HTMLDivElement>}
){
    const [windowHeight, setWindowHeight] = React.useState(0); 
    
    React.useEffect(() => {
        const handler = () => {
            setWindowHeight(parentRef.current.clientHeight)
        }; 
        const observer = new ResizeObserver(handler); 
        if(parentRef.current) {
            observer.observe(parentRef.current)
        }

        return  () => {
            observer.disconnect(); 
        }
    }, [parentRef.current])

    const ticks = React.useMemo(() => {
        const MAX_TICK_COUNT = Math.min(windowHeight / 15, 50); 
        const res:({type: 'sub', yPos:number} | ({type: 'main'} & SideNavElement))[] = []
        const tickSpacing = maxScrollY / MAX_TICK_COUNT; 
        
        if(rootElements.length > 0) 
            res.push({
                ...rootElements[0], 
                type: 'main'
            }); 

        let [start, end] = [0, 0]; 
        for(let i = 1; i < rootElements.length; i++) {
            start = rootElements[i - 1].yPos; 
            end =  rootElements[i].yPos; 
            
            for(let j = start + tickSpacing; j < end; j += tickSpacing) {
                res.push({type: 'sub', yPos: j}); 
            }

            res.push({
                ...rootElements[i], 
                type: 'main'
            }); 
        }

        for(let j = end; j < maxScrollY; j += tickSpacing) {
            res.push({type: 'sub', yPos: j}); 
        } 

        return res; 
    }, [rootElements, windowHeight]); 

    const closestI = React.useMemo(() => {
        let closestI = 0; 

        if(ticks.length > 0) {
            const tmp = [...ticks]
            closestI = tmp.map((k, kI) => ({kI, yPos: k.yPos})).sort((a, b) => Math.abs(a.yPos - scrollY) - Math.abs(b.yPos - scrollY))[0].kI; 
        }
   
        return closestI; 
    }, [ticks, scrollY])

    const handleSubClick = (targetScrollY:number) => {
        if(parentRef && parentRef.current) {
            parentRef.current.scrollTo({top: targetScrollY, behavior: 'smooth'})
        }
    }

    return <Box className={styles._}> 
        {
            ticks.map((tick, tickI) => {
                let targetStyle:React.CSSProperties = {}; 
                
                if(tick.type === 'sub') {
                    targetStyle.color = 'lightgray';
                }

                if(tickI == closestI) targetStyle.color = 'orange'
                else if (tickI < closestI) targetStyle.color = 'goldenrod'
                
                if(tick.type == 'main') return (
                    <HashLink key={tickI} to={tick.href} smooth className={styles.tick._} style={targetStyle}>
                        <Typography className={styles.tick.label}>{tick.label}</Typography>
                        <Box className={styles.tick.tick} />
                    </HashLink>
                )
                else if (tick.type == 'sub') return (
                    <Box onClick={() => handleSubClick(tick.yPos)} key={tickI} className={styles.subtick._}>
                        <Box className={styles.subtick.tick} style={targetStyle}/>
                    </Box>
                )
            })
        }
        <Box className={styles.footer} key={scrollY}>
            <Typography>[</Typography>
            <Typography>{`${Math.round(Math.min(scrollY / maxScrollY, 1) * 10000) / 100}%`}</Typography>
            <Typography>//</Typography>
            <Typography>{`${10}m`}</Typography>
            <Typography>]</Typography>
        </Box>
    </Box>
}
// <Typography className={styles.footer} key={scrollY}>{`[${Math.round(Math.min(scrollY / maxScrollY, 1) * 10000) / 100}% // ${10}m]`}</Typography>
const styles = {
    _: `
        right-0 top-1/2 -translate-y-1/2 fixed 
        pr-4 w-full max-w-[15vw] h-3/4
        grid grid-cols-1 grid-rows-auto 
    `,
    tick: {
        _: `flex items-center gap-md group `,
        label: `font-subtext invisible opacity-0 group-hover:visible group-hover:opacity-100 transition`, 
        tick: `h-px border-b border-b-4 w-1/4 ml-auto group-hover:w-full max-w-1/2 group-hover:border-b-5 rounded-full `,  
    }, 
    subtick: {
        _: `cursor-pointer group h-3 w-1/8 hover:w-3/16 ml-auto flex`,
        tick: `h-px border-b border-b-3 w-full transition group-hover:border-b-4 my-auto rounded-full`,  
    },
    footer: `font-subtext tracking-widest text-center flex justify-between `, 
}