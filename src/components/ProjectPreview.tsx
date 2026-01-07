import { Box, Button, Typography } from "@mantine/core"
import React from "react";
import { Link } from "react-router"

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
    preview:string,
    techMakeup:TechMakeup
}

export function ProjectPreview(props:{className?:string, data:ProjectData}){
    return <Box className={styles.container}>
        <Box className={styles.header}>
            <Typography>{props.data.title}</Typography>
            <Link to={props.data.gitLink!}><Button disabled={props.data.gitLink == null}>Git</Button></Link>
            <Link to={props.data.projectLink!}><Button disabled={props.data.projectLink == null}>Site</Button></Link>
        </Box>
        <Box className={styles.body}>
            <StatusGrid data={props.data} />
            <Typography>{props.data.preview}</Typography>
        </Box>
        <TechMakeupBar makeup={props.data.techMakeup} />
    </Box>
}

function TechMakeupBar(props:{makeup:TechMakeup}) {
    return <Box className={styles.TMB.container}>
        {props.makeup.map((cur, curI) => 
            <Typography key={curI} className={styles.TMB.item} style={{flex: cur.percent}}>{`${cur.tech} (${cur.percent}%)`}</Typography>
        )}
    </Box>
}

function StatusGrid(props:{data:ProjectData}){
    const chars = React.useMemo(() => {
        const output:string[] = [];
        const data = props.data; 

        output.push(...Math.round(data.startDate.getFullYear() / 100).toString().split(""));
        output.push(...Math.round(data.endDate.getFullYear() / 100).toString().split(""));

        output.push(...(data.startDate.getMonth()).toString().padStart(2, "0").split(""));
        output.push(...(data.endDate.getMonth()).toString().padStart(2, "0").split(""));

        output.push(...(data.startDate.getDate()).toString().padStart(2, "0").split(""));
        output.push(...(data.endDate.getDate()).toString().padStart(2, "0").split(""));

        output.push(data.type[0], data.taskSize[0], data.complexity[0], data.status[0]);
        console.log(data.startDate.getDate()); 

        return output; 
    }, [props.data]);
    
    return <Box className={styles.SG.container}>
        {chars.map((c, cI) => <Typography key={cI}>{c}</Typography>)}
    </Box>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-md`, 
    header: `w-full grid grid-cols-[1fr_auto_auto] gap-sm`, 
    body: `w-full flex flex-wrap gap-sm border`, 
    footer: `w-full grid`,
    SG:{
        container: `
            grid grid-cols-4 grid-rows-4 gap-sm
            float-right aspect-1/1
            text-center text-[.75rem]
        `, 
    }, 
    TMB: {
        container: `flex border`, 
        item: `border text-center`
    }
}

