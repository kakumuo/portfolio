import { Box, Typography } from "@mantine/core";
import { Tag } from "./Tag";
import { formatDate } from "./Utils";
import { Link } from "react-router";
import type { BlogHeader } from "./types";


export function BlogPostPreview(props:{blogData: BlogHeader}) {
    return <Link to={`/blog/${props.blogData.id}`}>
        <Box className={styles.container}>
        <img className={styles.img} src={"https://placehold.co/600x400/png"} />
        <Typography>{props.blogData.summary}</Typography>
        <Box className={styles.footer}>
            {props.blogData.tags.slice(0, 2).map((tag, tagI) => <Tag key={tagI} text={tag}/>)}
            <Typography className="ml-auto">{formatDate(props.blogData.createDate, true)}</Typography>
        </Box>
    </Box>
    </Link>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-auto border p-sm gap-sm`, 
    img: `object-contain`, 
    footer: `flex gap-sm`, 
}