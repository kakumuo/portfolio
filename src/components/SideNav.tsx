import { Box, Typography } from "@mantine/core";
import React from "react"; 
import { HashLink } from 'react-router-hash-link';

export type SideNavElement = {
    label: string, 
    href: string,
    yPos: number
}


export function SideNav(
    {rootElements, scrollY, parentRef}:
    {rootElements:SideNavElement[], scrollY:number, parentRef:React.RefObject<HTMLDivElement>}
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
    }, [parentRef.current]); 

    const [isScrollable, maxScrollY] = React.useMemo(() => {
        return [
            parentRef.current && parentRef.current.scrollHeight > parentRef.current.clientHeight, 
            (parentRef.current as any)?.scrollTopMax + parentRef.current?.clientTop
        ]
    }, [windowHeight, parentRef.current]); 

    

    const ticks = React.useMemo(() => {
        const MAX_TICK_COUNT = Math.max(Math.min(maxScrollY / 10,50) - rootElements.length, 1);
        const res:({type: 'sub', yPos:number} | ({type: 'main'} & SideNavElement))[] = []
        const tickSpacing = Math.max(maxScrollY, 1) / MAX_TICK_COUNT; 

        // console.log(tickSpacing); 
        
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
    }, [rootElements, windowHeight, maxScrollY]); 

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

    return <Box className={styles._} style={{visibility: isScrollable ? 'visible' : 'hidden'}}> 
        {
            ticks.map((tick, tickI) => {
                let targetStyle:React.CSSProperties = {}; 
                
                if(tick.type === 'sub') {
                    targetStyle.color = 'var(--neutral-accent)';
                }

                if(tickI == closestI) targetStyle.color = 'var(--tertiary)'
                else if (tickI < closestI) targetStyle.color = 'var(--neutral-accent)'
                else if (tick.type == 'sub') targetStyle.color = 'var(--secondary)'
                else targetStyle.color = 'var(--primary)'
                
                if(tick.type == 'main') return (
                    <HashLink key={tickI} to={tick.href} smooth className={styles.tick._} style={targetStyle}>
                        <Typography className={styles.tick.label}>{tick.label}</Typography>
                        <Box className={styles.tick.tick} />
                    </HashLink>
                )
                else if (tick.type == 'sub') return (
                    <Box onClick={() => handleSubClick(tick.yPos)} key={tickI} className={styles.subtick._ + ` k-${tickI}-${tick.yPos}`}>
                        <Box className={styles.subtick.tick} style={targetStyle}/>
                    </Box>
                )
            })
        }
        <Box className={styles.footer} key={scrollY}>
            <Typography>[</Typography>
            <Typography>{`${((scrollY / maxScrollY) * 100).toFixed(2).toString().padStart(6, "0")}%`}</Typography>
            <Typography>]</Typography>
        </Box>
    </Box>
}
// <Typography className={styles.footer} key={scrollY}>{`[${Math.round(Math.min(scrollY / maxScrollY, 1) * 10000) / 100}% // ${10}m]`}</Typography>
const styles = {
    _: `
        right-0 top-1/2 -translate-y-1/2 fixed 
        pr-4 w-full max-w-[15vw] max-h-8/9
        grid grid-cols-1 grid-rows-auto 
    `,
    tick: {
        _: `flex items-center gap-md group `,
        label: `font-subtext invisible opacity-0 group-hover:visible group-hover:opacity-100 transition text-(--neutral-contrast)`, 
        tick: `h-px border-b border-b-2 w-1/4 ml-auto group-hover:w-full max-w-1/2 group-hover:border-b-3 rounded-full transition `,  
    }, 
    subtick: {
        _: `cursor-pointer group h-3 w-1/8 hover:w-3/16 ml-auto flex transition`,
        tick: `h-px border-b border-b-1 w-full transition group-hover:border-b-2 my-auto rounded-full transition`,  
    },
    footer: `font-subtext tracking-widest text-center flex justify-between `, 
}