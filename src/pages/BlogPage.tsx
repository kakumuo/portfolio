import React from "react"

import { Box, Divider, Typography } from "@mantine/core"
import { BlogPostPreview } from "../components/BlogPostPreview"
import { SearchBar } from "../components/Components"
import { AppContext } from "../app"
import type { BlogHeader } from "../components/types"

export function BlogPage() {
    const {client} = React.useContext(AppContext)
    const [blogData, setBlogData] = React.useState([] as BlogHeader[])
    const [filters, setFilters] = React.useState([] as string[])

    React.useEffect(() => {
        (async() => {
            const resp = await client.getBlogHeader({});
            setBlogData(resp);  
        })(); 
    }, [])

    return <Box className={styles.container}>
        <Box className={styles.header.container}>
            <Typography>Blog</Typography>
            <Divider />
            <SearchBar setFilters={setFilters} sortOptions={[]} />
        </Box>
        <Box className={styles.body.container}>
            <Box className={styles.body.main}> 
                <BlogSection title="April 2025">
                    {blogData.map((data, dataI) => <BlogPostPreview blogData={data} key={dataI} />)}
                </BlogSection>

                <BlogSection title="June 2024" />
                <BlogSection title="May 2024" />
            </Box>

            <Box className={styles.body.aside.container}>
                <Typography>Recent</Typography>
                <Divider />
                <ul>
                    <li>2025-10 | Some Title 1</li>
                    <li>2025-10 | Some Title 2</li>
                    <li>2025-10 | Some Title 3</li>
                    <li>2025-10 | Some Title 4</li>
                </ul>
            </Box>
        </Box>

    </Box>
}

function BlogSection(props:{title:string, children?:any}) {
    return <Box className={styles.blogSection.container}>
        <Typography>{props.title}</Typography>
        <Box className={styles.blogSection.content}>
            {props.children}
        </Box>
    </Box>
}

const styles = {
    container: ``, 
    header: {
        container: ``, 
    }, 
    body: {
        container: `grid grid-cols-[1fr_auto] grid-rows-1 gap-lg`, 
        main: `grid grid-rows-auto grid-cols-1 gap-lg`, 
        aside: {
            container: `flex flex-col`, 
            section: ``, 
        }, 
    },
    blogSection: {
        container: `grid grid-rows-auto grid-cols-1 gap-sm`, 
        content: `grid grid-rows-auto grid-cols-1 gap-md`
    }, 
}