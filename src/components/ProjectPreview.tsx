import { Box, Button, Typography } from "@mantine/core"
import React from "react";
import { data, Link } from "react-router"
import { Caption } from "./Caption";
import { formatDate } from "./Utils";
import type { MakeupLayer, ProjectHeader } from "./types";
import { AppContext } from "../app";
import { PreloadableLink } from "./Preloadable";
import type { PostPageData } from "../pages/PostPage";

export function ProjectPreview(props:{className?:string, data:ProjectHeader}){
     const {client} = React.useContext(AppContext); 

    const handlePreload = React.useCallback(async () => {
        const pageData:PostPageData = {} as PostPageData; 
        pageData.isProject = true;      

        const headerResp = pageData.isProject ? (await client.getProjectHeader({})) : (await client.getBlogHeader({}))
        const targetData = headerResp.find(val => val.id == props.data.id); 
        if(targetData) pageData.headerData = targetData; 

        // handle calls async
        if(props.data.id) {
            let resp:any; 
            resp = await client.getPostData({id: props.data.id})
            if(resp.length > 0) pageData.postData = resp[0];

            resp = await client.getPostChangelog({id: props.data.id})
            pageData.postChangelog = resp;
        }

        if(props.data.git) {
            let resp = await client.getProjectChangelog({link: props.data.git})
            pageData.projChangelog = resp;
        }

        return pageData
    }, [client])
    
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
    return <Box className={styles.TMB.container}>
        {
            props.makeup.map((layer, layerI) => 
                <Box className={styles.TMB.list} key={layerI}>  
                    <Typography>{layer.name}</Typography>
                    {layer.items.map((cur, curI) => 
                        <Typography key={curI} className={styles.TMB.item} style={{flex: cur.percentage}}>{`${cur.tech} (${cur.percentage}%)`}</Typography>
                    )}
                </Box>
            )
        }

    </Box>
}

export function StatusGrid(props:{data:ProjectHeader,  className?:string}){
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
        console.log(startDate.getDate()); 

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
        container: `grid`, 
        list: `border grid grid-cols-[auto_repeat(auto-fill, 1fr)] grid-rows-1`, 
        item: `border text-center`
    }
}

