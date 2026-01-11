import React from "react";
import { Box, Typography } from "@mantine/core";
import { Tag } from "./Tag";
import { formatDate } from "./Utils";
import type { BlogHeader, PostPageData, Preload } from "./types";
import { PreloadableLink } from "./Preloadable";
import { AppContext } from "../app";
import {loadPostPage} from '../pages/PostPage'


export function BlogPostPreview(props:{blogData: BlogHeader}) {
    const {client} = React.useContext(AppContext); 

    const handlePreload = () => loadPostPage(client, {} as Preload<PostPageData>, false, props.blogData.id)

    return <PreloadableLink to={`/blog/${props.blogData.id}`} preLoad={handlePreload} prefetch="intent">
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