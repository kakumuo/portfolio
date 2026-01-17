import { Box, Button, Typography } from "@mantine/core"
import React from "react";
import { data, Link } from "react-router"
import { Caption } from "./Caption";
import { formatDate } from "./Utils";
import type { MakeupLayer, ProjectHeader, PostPageData, Preload } from "./types";
import { AppContext } from "../app";
import { PreloadableLink } from "./Preloadable";
import { loadPostPage } from "../pages/PostPage";

export function ProjectPreview(props:{className?:string, data:ProjectHeader}){
    const {client} = React.useContext(AppContext); 
    
    const handlePreload = () => loadPostPage(client, {} as Preload<PostPageData>, true, props.data.id)

    return <Box className={styles.container}>
        <Box className={styles.header}>
            {
                props.data.hasPost ?
                <PreloadableLink className="justify-self-start" to={`/projects/${props.data.id}`} preLoad={handlePreload}>
                    <Typography>{props.data.title}</Typography>
                </PreloadableLink>
                : <Typography className="justify-self-start">{props.data.title}</Typography>
            }
            <LinkButtonGroup data={props.data} />
        </Box>
        <Box className={styles.body}>
            <Caption className="float-left" caption={<StatusGridCaption data={props.data} />}>
                <StatusGrid data={props.data} />
            </Caption>
            <p>{props.data.summary}</p>
        </Box>
        <TechMakeupBar makeup={props.data.makeupLayers} />
    </Box>
}

export function LinkButtonGroup(props:{data:ProjectHeader}) {
    return <Box className="flex">
        <Link to={props.data.git!}><Button disabled={props.data.git == null}>Git</Button></Link>
        <Link to={props.data.url!}><Button disabled={props.data.url == null}>Site</Button></Link>
    </Box>
}

function StatusGridCaption(props:{data:ProjectHeader}) {
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

export function TechMakeupBar(props:{makeup:MakeupLayer[]}) {
    return <Box className={styles.TMB._}>
        {props.makeup.map((m, mI) => <TechMakeupLayer layer={m} key={mI} />)}
    </Box>
}

function TechMakeupLayer({layer}:{layer:MakeupLayer}) {
    const colors = ['black', 'gray', 'lightgray', 'slate']

    return <Box className={styles.TMB.layer._}>
        <Typography className={styles.TMB.layer.title}>{layer.name}</Typography>
        <Box 
            style={{gridTemplateColumns: layer.items.map(i => i.percentage + "fr").join(" ")}} 
            className={styles.TMB.layer.row._ }
        >
            {layer.items.map((i, iI) => {
                const targetColor = colors[iI % colors.length]; 
                return <>
                        <Box key={`bar-${iI}`} className={styles.TMB.layer.row.top} style={{backgroundColor: targetColor, color: targetColor}} />
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
        captionText: `grid grid-rows-auto grid-cols-2`, 
    }, 
    TMB: {
        _: `grid`, 
        layer:{
            _: `grid grid-cols-1 grid-rows-[auto_1fr]`, 
            title: `text-end text-[12px] font-subtext`, 
            row: {
                _: `grid grid-rows-[auto_1fr]`, 
                top: `row-start-1 h-2 w-full border first:rounded-l-full [&:nth-last-child(2)]:rounded-r-full`, 
                bot: `row-start-2 text-end text-[10px] text-nowrap font-label`, 
            }
        }
    }
}

