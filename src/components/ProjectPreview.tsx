import { Box, Button, Typography } from "@mantine/core"
import React from "react";
import { data, Link } from "react-router"
import { Caption } from "./Caption";
import { formatDate } from "./Utils";

type TechMakeup = {tech:string, percent:number}[]

export type ProjectData = {
    title:string, 
    startDate:Date, 
    endDate:Date, 
    type:string, 
    taskSize:string, 
    complexity:string, 
    status:string, 
    gitLink?:string, 
    projectLink?:string, 
    postLink?:string,
    preview:string,
    techMakeup:TechMakeup
}

export function ProjectPreview(props:{className?:string, data:ProjectData}){
    return <Box className={styles.container}>
        <Box className={styles.header}>
            {
                props.data.postLink ?
                <Link className="justify-self-start" to={props.data.postLink}>
                    <Typography>{props.data.title}</Typography>
                </Link>
                : <Typography className="justify-self-start">{props.data.title}</Typography>
            }
            <LinkButtonGroup data={props.data} />
        </Box>
        <Box className={styles.body}>
            <Caption className="float-left" caption={<StatusGridCaption data={props.data} />}>
                <StatusGrid data={props.data} />
            </Caption>
            <p>{props.data.preview}</p>
        </Box>
        <TechMakeupBar makeup={props.data.techMakeup} />
    </Box>
}

export function LinkButtonGroup(props:{data:ProjectData}) {
    return <Box className="flex">
        <Link to={props.data.gitLink!}><Button disabled={props.data.gitLink == null}>Git</Button></Link>
        <Link to={props.data.projectLink!}><Button disabled={props.data.projectLink == null}>Site</Button></Link>
    </Box>
}

function StatusGridCaption(props:{data:ProjectData}) {
    return <Box className={styles.SG.captionContainer}>
        {/* TODO: depending on whether having display in the container, remove "captionText" */}
        <Box className={styles.SG.captionText}>
            <Typography>Start Date:</Typography> <Typography> {formatDate(props.data.startDate)}</Typography>
            <Typography>End Date:</Typography>   <Typography> {formatDate(props.data.endDate)}</Typography>
            <Typography>Type:</Typography>       <Typography> {props.data.type}</Typography>
            <Typography>Task Size:</Typography>  <Typography> {props.data.taskSize}</Typography>
            <Typography>Complexity:</Typography> <Typography> {props.data.complexity}</Typography>
            <Typography>Stauts:</Typography>     <Typography> {props.data.status}</Typography>
        </Box>
    </Box>
}

export function TechMakeupBar(props:{makeup:TechMakeup}) {
    return <Box className={styles.TMB.container}>
        {props.makeup.map((cur, curI) => 
            <Typography key={curI} className={styles.TMB.item} style={{flex: cur.percent}}>{`${cur.tech} (${cur.percent}%)`}</Typography>
        )}
    </Box>
}

export function StatusGrid(props:{data:ProjectData,  className?:string}){
    const chars = React.useMemo(() => {
        const output:string[] = [];
        const data = props.data; 

        output.push(...Math.round(data.startDate.getFullYear() % 100).toString().padStart(2, "0").split(""));
        output.push(...Math.round(data.endDate.getFullYear() % 100).toString().padStart(2, "0").split(""));

        output.push(...(data.startDate.getMonth()).toString().padStart(2, "0").split(""));
        output.push(...(data.endDate.getMonth()).toString().padStart(2, "0").split(""));

        output.push(...(data.startDate.getDate()).toString().padStart(2, "0").split(""));
        output.push(...(data.endDate.getDate()).toString().padStart(2, "0").split(""));

        output.push(data.type[0], data.taskSize[0], data.complexity[0], data.status[0]);
        console.log(data.startDate.getDate()); 

        return output; 
    }, [props.data]);
    
    return <Box className={`${styles.SG.container} ${props.className}`}>
        {chars.map((c, cI) => <Typography className={styles.SG.item} key={cI}>{c}</Typography>)}
    </Box>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-md`, 
    header: `w-full grid grid-cols-[1fr_auto_auto] gap-sm `, 
    body: `w-full flex gap-sm`, 
    footer: `w-full grid`,
    SG:{
        container: `
            grid grid-cols-4 grid-rows-4 gap-sm
            aspect-1/1
            text-center
            select-none
        `, 
        item:`font-serif`, 
        captionContainer: `grid`, 
        captionText: `grid grid-rows-auto grid-cols-2`, 
    }, 
    TMB: {
        container: `flex border`, 
        item: `border text-center`
    }
}

