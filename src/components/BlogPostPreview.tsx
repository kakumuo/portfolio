import { Box, Typography } from "@mantine/core";
import { Tag } from "./Tag";


export type BlogData = {title:string, preview:string, tags:string[], created:string, imgPath:string}
export function BlogPostPreview(props:{blogData: BlogData}) {
    return <Box className={styles.container}>
        {props.blogData.imgPath && <img className={styles.img} src={props.blogData.imgPath} />}
        <Typography>{props.blogData.preview}</Typography>
        <Box className={styles.footer}>
            {props.blogData.tags.slice(0, 2).map((tag, tagI) => <Tag key={tagI} text={tag}/>)}
            <Typography className="ml-auto">{props.blogData.created}</Typography>
        </Box>
    </Box>
}

const styles = {
    container: `w-full grid grid-cols-1 grid-rows-auto border p-5`, 
    img: `object-contain`, 
    footer: `flex gap-5`, 
}