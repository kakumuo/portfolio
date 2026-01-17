import React from "react"

import { Box, Divider, Typography } from "@mantine/core"
import { BlogPostPreview } from "../components/BlogPostPreview"
import { SearchBar, type SortOption } from "../components/Components"
import { AppContext } from "../app"
import type { BlogHeader } from "../components/types"
import { BlogPreview } from "./HomePage"
import { SectionHeader } from "../components/SectionHeader"
import { Caption } from "../components/Caption"


const sampleBlogPosts:BlogHeader[] = [
  {
    "id": "about-me",
    "title": "About Me",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolore omnis dignissimos adipisci doloremque necessitatibus culpa nisi nesciunt delectus?",
    "tags": [
      "info"
    ], 
    "bannerImage": "https://placehold.co/600x400/EEE/31343C"
  }, 
	{
    "id": "kla-flee",
    "title": "Another Post",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque!",
    "tags": [
      "info"
    ], 
    "bannerImage": "https://placehold.co/600x400/EEE/31343C"
  }, 
    {
    "id": "smabout-me",
    "title": "Some Post",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas, minus!",
    "tags": [
      "info"
    ], 
    "bannerImage": "https://placehold.co/600x400/EEE/31343C"
  }, 
  {
    "id": "smabout-me",
    "title": "Some Post",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas, minus!",
    "tags": [
      "info"
    ], 
    "bannerImage": "https://placehold.co/600x400/EEE/31343C"
  }
]




enum SortOptionType {
    TITLE = 'Name', 
    CREATE_DATE = 'Create Date'
}

export function BlogPage() {
    const {client} = React.useContext(AppContext)
    const [blogData, setBlogData] = React.useState([] as BlogHeader[])
    const [filters, setFilters] = React.useState([] as string[])
    const [sort, setSort] = React.useState([] as SortOption[]); 

    React.useEffect(() => {
        (async() => {
            const resp = await client.getBlogHeader({});
            // setBlogData(resp); 
            setBlogData(sampleBlogPosts) 
        })(); 
    }, [])


    const filterData = React.useMemo(() => {
        let tmp = [...blogData]
        if(filters.length > 0) {
            tmp = blogData.filter(h => {
                let didFilter = false; 
                for(const f of filters) {
                    if(f.trim() == "") continue; 
                    if(JSON.stringify(h).toLowerCase().includes(f.toLowerCase())) {
                        didFilter = true; 
                        return true; 
                    }
                }

                return didFilter; 
            })
        }

        tmp.sort((a, b) => {
            let curIndex = -1; 
            if((curIndex = sort.findIndex(o => o.label == SortOptionType.TITLE)) != -1 && a.title.localeCompare(b.title) != 0) {
                return  (sort[curIndex].asc ? 1 : -1) * a.title.localeCompare(b.title)
            } else if ((curIndex = sort.findIndex(o => o.label == SortOptionType.CREATE_DATE)) != -1 && a.createDate - b.createDate != 0) {
                return (sort[curIndex].asc ? 1 : -1) * a.createDate - b.createDate
            }
            else return 0; 
        })

        return tmp;         
    }, [filters, blogData, sort])


    return <Box className={styles.container}>
        <SectionHeader  title="Blog"/>
        <SearchBar sortOptions={Object.values(SortOptionType)} setSort={setSort} setFilters={setFilters} />
        <Box className={styles.body._}>
            {filterData.map((b,bI) => <BlogPreview showSummary blog={b} key={bI} />)}
        </Box>
    </Box>
}

const styles = {
    container: `flex flex-col overflow-hidden`, 
    header: {
        _: ``, 
    }, 
    body: {
        _: `flex flex-col gap-sm overflow-y-scroll p-sm grow`, 
    },
    blogSection: {
        _: `grid grid-rows-auto grid-cols-1 gap-sm`, 
        content: `grid grid-rows-auto grid-cols-1 gap-md`
    }, 
}