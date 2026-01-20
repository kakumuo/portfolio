import React from "react";
import { useNavigate } from "react-router";
import { Box, Divider } from "@mantine/core";
import { ProjectPreview } from "./HomePage";
import  { SectionHeader } from "../components/SectionHeader";
import { MainPage } from "../components/MainPage";
import { SearchBar, type SortOption } from "../components/Components";
import type { ProjectHeader } from "../components/types";
import { AppContext } from "../app";
import { LoadingPage } from "./LoadingPage";



enum SortOptionType {
    TITLE = 'Name',
    STARTDATE = 'Start Date',
    ENDDATE = 'End Date',
}

export function ProjectsPage(){
    const {client} = React.useContext(AppContext); 
    const [projectHeaders, setProjectHeaders]   = React.useState([] as ProjectHeader[]) 
    const [sort, setSort] = React.useState([] as SortOption[]); 
    const [filters, setFilters] = React.useState([] as string[]); 
    const [loaded, setLoaded] = React.useState(false); 
    const navigate = useNavigate(); 

    React.useEffect(() => {
        ; (async() => {
            const resp = await client.getProjectHeader({}); 

            if(!resp.success) {
              navigate('/error', {
                replace: true, 
                state: resp
              }); 
              return; 
            }

            setProjectHeaders(resp.data); 
            // setProjectHeaders(sampleProjData); 
            setLoaded(true); 
        })(); 
    }, [])

    const filterData = React.useMemo(() => {
        let tmp = [...projectHeaders]
        if(filters.length > 0) {
            tmp = projectHeaders.filter(h => {
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
            } else if ((curIndex = sort.findIndex(o => o.label == SortOptionType.STARTDATE)) != -1 && a.startDate - b.startDate != 0) {
                return (sort[curIndex].asc ? 1 : -1) * a.startDate - b.startDate
            } else if (((curIndex = sort.findIndex(o => o.label == SortOptionType.ENDDATE)) != -1) && a.endDate - b.endDate != 0) {
                return (sort[curIndex].asc ? 1 : -1) * a.endDate - b.endDate
            }
            else return 0; 
        })

        return tmp;         
    }, [filters, projectHeaders, sort])

    return <>{!loaded ? <LoadingPage  /> : <MainPage className={styles._}>
            <SectionHeader  title="Projects" />
            <SearchBar setFilters={setFilters} sortOptions={Object.values(SortOptionType)} setSort={setSort} />
            <Divider color="var(--tertiary)"/>
            <Box className={styles.projectsSection}>
                {filterData.map(proj => <Box><ProjectPreview className="flex flex-col p-sm grow gap-sm relative group h-auto peer" curProj={proj} /></Box>)}
            </Box>
        </MainPage>}</>
    
}

const styles = {
    _: `flex flex-col overflow-hidden gap-sm`, 
    projectHelp: `justify-self-end`,
    projectsSection: `w-full flex flex-col gap-md overflow-y-scroll p-sm grow`, 
}