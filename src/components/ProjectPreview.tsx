import { Box, Button, Typography } from "@mantine/core"
import React from "react";
import { Link } from "react-router"
import { Caption } from "./Caption";
import { formatDate } from "./Utils";
import type { MakeupLayer, ProjectHeader } from "./types";


export function LinkButtonGroup(props:{data:ProjectHeader}) {
    return <Box className="flex">
        <Link to={props.data.git!}><Button disabled={props.data.git == null}>Git</Button></Link>
        <Link to={props.data.url!}><Button disabled={props.data.url == null}>Site</Button></Link>
    </Box>
}

export function StatusGridCaption(props:{data:ProjectHeader, id?:string, className?:string}) {
    const bracketFirst = (text:string) => {
        return `[${text.substring(0, 1)}]${text.substring(1)}`
    }

    const caption = <Box className={styles.SG.captionText._}>
            <Typography className={styles.SG.captionText.$}>Start Date:</Typography> 
            <Typography className={styles.SG.captionText.$}> {formatDate(props.data.startDate)}</Typography>

            <Typography className={styles.SG.captionText.$}>End Date:</Typography>   
            <Typography className={styles.SG.captionText.$}> {formatDate(props.data.endDate)}</Typography>

            <Typography className={styles.SG.captionText.$}>Type:</Typography>       
            <Typography className={styles.SG.captionText.$}> {bracketFirst(props.data.type)}</Typography>

            <Typography className={styles.SG.captionText.$}>Task Size:</Typography>  
            <Typography className={styles.SG.captionText.$}> {bracketFirst(props.data.taskSize)}</Typography>

            <Typography className={styles.SG.captionText.$}>Complexity:</Typography> 
            <Typography className={styles.SG.captionText.$}> {bracketFirst(props.data.complexity)}</Typography>

            <Typography className={styles.SG.captionText.$}>Stauts:</Typography>     
            <Typography className={styles.SG.captionText.$}> {bracketFirst(props.data.status)}</Typography>
        </Box>

    return <Caption caption={caption} id={props.id} className={props.className} >
        <StatusGrid data={props.data} />
    </Caption>
}

export function TechMakeupBar(props:React.ComponentPropsWithoutRef<'div'> & {makeup:MakeupLayer[]}) {
    return <Box className={`${styles.TMB._} ${props.className}`}>
        {props.makeup.map((m, mI) => <TechMakeupLayer layer={m} key={mI} />)}
    </Box>
}

function TechMakeupLayer({layer}:{layer:MakeupLayer}) {
    return <Box className={styles.TMB.layer._}>
        <Typography className={styles.TMB.layer.title}>{layer.name}</Typography>
        <Box 
            style={{gridTemplateColumns: layer.items.map(i => i.percentage + "fr").join(" ")}} 
            className={styles.TMB.layer.row._ }
        >
            {layer.items.map((i, iI) => {
                return <>
                        <Caption caption={`${i.tech} - ${i.percentage}%`}><Box key={`bar-${iI}`} className={`${styles.TMB.layer.row.top} border-(--secondary) bg-(--secondary)/25`} /></Caption>
                        <Typography key={`text-${iI}`} className={styles.TMB.layer.row.bot}>{" // " + i.tech}</Typography>
                    </>
            })}
        </Box>
    </Box>
}

export function StatusGrid(props:{data:ProjectHeader,  className?:string, id?:string}){
    const chars = React.useMemo(() => {
        const output:string[] = [];
        const data = props.data; 
        const startDate = new Date(data.startDate); 
        const endDate = new Date(data.endDate); 

        output.push(...Math.round(startDate.getFullYear() % 100).toString().padStart(2, "0").split(""));
        output.push(...Math.round(endDate.getFullYear() % 100).toString().padStart(2, "0").split(""));

        output.push(...(startDate.getMonth()).toString().padStart(2, "0").split(""));
        output.push(...(endDate.getMonth()).toString().padStart(2, "0").split(""));

        output.push(...(startDate.getDate()).toString().padStart(2, "0").split(""));
        output.push(...(endDate.getDate()).toString().padStart(2, "0").split(""));

        output.push(data.type[0], data.taskSize[0], data.complexity[0], data.status[0]);

        return output; 
    }, [props.data]);
    
    return <Box id={props.id} className={`${styles.SG.container} ${props.className}`}>
        {chars.map((c, cI) => <Typography className={styles.SG.item} key={cI}>{c}</Typography>)}
    </Box>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-md`, 
    header: `w-full grid grid-cols-[1fr_auto_auto] gap-sm`, 
    body: `w-full flex gap-sm`, 
    footer: `w-full grid`,
    SG:{
        container: `
            grid grid-cols-4 grid-rows-4 gap-sm
            aspect-1/1
            text-center
            select-none
            float-left
            font-subheader
        `, 
        item:`font-serif`, 
        captionContainer: `grid`, 
        captionText: {
            _: `grid grid-rows-auto grid-cols-2`,
            $: `odd:font-subtext odd:mr-4 even:font-body `, 
        },
    }, 
    TMB: {
        _: `grid`, 
        layer:{
            _: `grid grid-cols-1 grid-rows-[auto_1fr]`, 
            title: `text-end text-[12px] font-subtext`, 
            row: {
                _: `grid grid-rows-[auto_1fr] gap-1`, 
                top: `row-start-1 h-2 w-full border odd:rounded`, 
                bot: `row-start-2 text-end text-[10px] text-nowrap font-label`, 
            }
        }
    }
}

