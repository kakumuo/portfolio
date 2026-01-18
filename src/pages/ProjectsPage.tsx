import React from "react";
import { Link, useNavigate } from "react-router";
import { Typography, Box, Input, Divider } from "@mantine/core";
import { Caption } from "../components/Caption";
import { ProjectPreview } from "./HomePage";
import  { SectionHeader } from "../components/SectionHeader";
import { MainPage } from "../components/MainPage";
import { SearchBar, type SortOption } from "../components/Components";
import type { ProjectHeader } from "../components/types";
import { AppContext } from "../app";
import { LoadingPage } from "./LoadingPage";



const sampleProjData:ProjectHeader[] = [
  {
    "id": "personal-site",
    "title": "Portfolio Site A",
    "summary": "A simple portfolio site",
    "startDate": 12345677,
    "endDate": 12345677,
    "hasPost": true,
    "git": "https://github.com/kakumuo/portfolio",
    "url": "https://kakumuo.github.io/portfolio/",
    "complexity": "medium",
    "status": "inprogress",
    "taskSize": "large",
    "type": "web-app",
    "makeupLayers": [
      {
        "name": "Frontend",
        "items": [
          {
            "tech": "React",
            "percentage": 1
          }, 
          {
            "tech": "React 2",
            "percentage": 30
          }, 
          {
            "tech": "React 3",
            "percentage": 40
          }
        ]
      },
      {
        "name": "Backend",
        "items": [
          {
            "tech": "GIT",
            "percentage": 100
          }
        ]
      }
    ]
  }, 
  {
    "id": "personal-site-2",
    "title": "Portfolio Site B",
    "summary": "A simple portfolio site",
    "startDate": 12345677,
    "endDate": 12345677,
    "hasPost": true,
    "git": "https://github.com/kakumuo/portfolio",
    "url": "https://kakumuo.github.io/portfolio/",
    "complexity": "medium",
    "status": "inprogress",
    "taskSize": "large",
    "type": "web-app",
    "makeupLayers": [
      {
        "name": "Frontend",
        "items": [
          {
            "tech": "React",
            "percentage": 1
          }, 
          {
            "tech": "React 2",
            "percentage": 30
          }, 
          {
            "tech": "React 3",
            "percentage": 40
          }
        ]
      },
      {
        "name": "Backend",
        "items": [
          {
            "tech": "GIT",
            "percentage": 100
          }
        ]
      }
    ]
  }, 
  {
    "id": "personal-site-1",
    "title": "Portfolio Site C",
    "summary": "A simple portfolio site",
    "startDate": 12345677,
    "endDate": 12345677,
    "hasPost": true,
    "git": "https://github.com/kakumuo/portfolio",
    "url": "https://kakumuo.github.io/portfolio/",
    "complexity": "medium",
    "status": "inprogress",
    "taskSize": "large",
    "type": "web-app",
    "makeupLayers": [
      {
        "name": "Frontend",
        "items": [
          {
            "tech": "React",
            "percentage": 1
          }, 
          {
            "tech": "React 2",
            "percentage": 30
          }, 
          {
            "tech": "React 3",
            "percentage": 40
          }
        ]
      },
      {
        "name": "Backend",
        "items": [
          {
            "tech": "GIT",
            "percentage": 100
          }
        ]
      }
    ]
  }
]


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
            <Divider />
            <Box className={styles.projectsSection}>
                {filterData.map(proj => <Box><ProjectPreview curProj={proj} /></Box>)}
            </Box>
        </MainPage>}</>
    
}

const styles = {
    _: `flex flex-col overflow-hidden gap-sm`, 
    projectHelp: `justify-self-end`,
    projectsSection: `w-full flex flex-col gap-md overflow-y-scroll p-sm grow`, 
}