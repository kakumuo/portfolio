import { Box, Typography } from "@mantine/core";
import { Tag } from "./Tag";
import { formatDate } from "./Utils";
import { Link } from "react-router";


export type BlogData = {title:string, preview:string, tags:string[], created:Date, imgPath:string, path:string}
export function BlogPostPreview(props:{blogData: BlogData}) {
    return <Link to={`/blog/${props.blogData.path}`}>
        <Box className={styles.container}>
        {props.blogData.imgPath && <img className={styles.img} src={props.blogData.imgPath} />}
        <Typography>{props.blogData.preview}</Typography>
        <Box className={styles.footer}>
            {props.blogData.tags.slice(0, 2).map((tag, tagI) => <Tag key={tagI} text={tag}/>)}
            <Typography className="ml-auto">{formatDate(props.blogData.created, true)}</Typography>
        </Box>
    </Box>
    </Link>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-auto border p-sm gap-sm`, 
    img: `object-contain`, 
    footer: `flex gap-sm`, 
}