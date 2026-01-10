import React from "react";
import { Box, Typography } from "@mantine/core";
import { Tag } from "./Tag";
import { formatDate } from "./Utils";
import type { BlogHeader, GitRevision, PostData } from "./types";
import { PreloadableLink } from "./Preloadable";
import type { PostPageData } from "../pages/PostPage";
import { AppContext } from "../app";

export function BlogPostPreview(props:{blogData: BlogHeader}) {
    const {client} = React.useContext(AppContext); 

    const handlePreload = React.useCallback(async () => {
        const pageData:PostPageData = {} as PostPageData; 
        pageData.isProject = false;    

        const headerResp = pageData.isProject ? (await client.getProjectHeader({})) : (await client.getBlogHeader({}))
        const targetData = headerResp.find(val => val.id == props.blogData.id); 
        if(targetData) pageData.headerData = targetData; 

        // handle calls async
        if(props.blogData.id) {
            let resp:any; 
            resp = await client.getPostData({id: props.blogData.id})
            if(resp.length > 0) pageData.postData = resp[0];

            resp = await client.getPostChangelog({id: props.blogData.id})
            pageData.postChangelog = resp;
        }
        return pageData
    }, [client])

    return <PreloadableLink to={`/blog/${props.blogData.id}`} preLoad={handlePreload}>
            <Box className={styles.container}>
            <img className={styles.img} src={"https://placehold.co/600x400/png"} />
            <Typography>{props.blogData.summary}</Typography>
            <Box className={styles.footer}>
                {props.blogData.tags.slice(0, 2).map((tag, tagI) => <Tag key={tagI} text={tag}/>)}
                <Typography className="ml-auto">{formatDate(props.blogData.createDate, true)}</Typography>
            </Box>
        </Box>
    </PreloadableLink>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-auto border p-sm gap-sm`, 
    img: `object-contain`, 
    footer: `flex gap-sm`, 
}