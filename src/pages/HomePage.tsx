import * as React from 'react'; 

import { Box, Button, Divider, Typography } from "@mantine/core";
import { MainPage } from "../components/MainPage";
import { SectionHeader } from "../components/SectionHeader";
import { BlogPostPreview } from "../components/BlogPostPreview";
import { ProjectPreview, StatusGrid, TechMakeupBar } from "../components/ProjectPreview";
import { Caption } from "../components/Caption";
import { AppContext } from "../app";
import type { BlogHeader, PostData, ProjectHeader } from '../components/types';
import Markdown from 'react-markdown';
import { Link } from 'react-router';
import { threeDigitCode } from '../components/Utils';


const sampleProjData:ProjectHeader[] = [
  {
    "id": "personal-site",
    "title": "Portfolio Site",
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
            "percentage": 100
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
    "id": "personal-site4",
    "title": "Some Site",
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
            "percentage": 100
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
    "id": "personal-site2",
    "title": "Some Other Site",
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
            "percentage": 100
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

const sampleBlogPosts:BlogHeader[] = [
  {
    "id": "about-me",
    "title": "About Me",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolore omnis dignissimos adipisci doloremque necessitatibus culpa nisi nesciunt delectus?",
    "tags": [
      "info"
    ]
  }, 
	{
    "id": "kla-flee",
    "title": "Another Post",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque!",
    "tags": [
      "info"
    ]
  }, 
    {
    "id": "smabout-me",
    "title": "Some Post",
    "createDate": 123432,
    "summary": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas, minus!",
    "tags": [
      "info"
    ]
  }
]



export function HomePage(){
    const {client} = React.useContext(AppContext); 
    const [overview, setOverview] = React.useState({} as PostData)
    const [featuredBlogData, setFeaturedBlogData] = React.useState([] as BlogHeader[]); 
    const [featuredProjData, setFeaturedProjData] = React.useState([] as ProjectHeader[]); 
    const [loaded, setLoaded] = React.useState(false); 
    const [tagline, setTagline] = React.useState("")

    React.useEffect(() => {      
        ;(async() => {
            const [overviewData, blogData, projData] = await Promise.all([
                client.getPostData({id: 'overview'}), 
                client.getBlogHeader({}), 
                client.getProjectHeader({}), 
            ])

            setOverview(overviewData) 

            // const blogRes = blogData.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            const blogRes = sampleBlogPosts.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            setFeaturedBlogData(blogRes); 

            const projRes = sampleProjData.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            // const projRes = projData.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            setFeaturedProjData(projRes); 

            setLoaded(true); 
        })(); 

        const taglines = ["everything", "something", "nothing"]
        setTagline(taglines[0])
        const handle = setInterval(() => {
            setTagline(curTagline => {
                const i = taglines.indexOf(curTagline); 
                if(i >= 0) return taglines[(i + 1) % taglines.length]; 
                return curTagline; 
            })
        }, 2000);

        return () => {
            clearInterval(handle); 
        }
    }, []); 

    return <>{loaded && 
    <MainPage className={styles._}>
        <Typography className={styles.tagline}>creating // {tagline}</Typography>
        <Box className={styles.textheader}><Markdown >{overview.postContent}</Markdown></Box>

        <Box className={styles.body}>
            <ProjectDisplay projects={featuredProjData} />
            <BlogDisplay blogs={featuredBlogData} />
        </Box>
    </MainPage>
    }</>
}


function DisplayHeader(props:{label:string, to:string, color:string}){
    return <Box className={styles.displayHeader._}>
        <Box className={`${styles.displayHeader.ele} bg-[${props.color}]`} />
        <Typography>{props.label}</Typography>
        <Divider />
        <Link to={props.to}><Button>View More</Button></Link>
    </Box>
}

const SHOW_DUR_MS = 5 * 1000; 
const SHOW_UNIT_MS = .5 * 1000; 
function ProjectDisplay({projects}:{projects:ProjectHeader[]}){
    const [projI, setProjI] = React.useState(0); 
    const curProj = projects[projI]; 
    const [curDur, setCurDur] = React.useState(0); 
    const [handle, setHandle] = React.useState(-1); 

    const nextProj = (inc:boolean) => {
        setCurDur(0); 

        if(inc) {
            setProjI(val => (val + 1) % projects.length); 
        } else {
            setProjI(val => val == 0 ? projects.length - 1 : val - 1)
        }
    }

    const handleMouseEnter = () => {
        clearInterval(handle); 
        setHandle(-1); 
    }

    const handleMouseLeave = () => {
        const handle = setInterval(() => {
            setCurDur(dur => {
                dur += SHOW_UNIT_MS
                if(dur > SHOW_DUR_MS) {
                    nextProj(true); 
                    return 0; }
                else return dur; 
            });
        }, SHOW_UNIT_MS);
        setHandle(handle); 
    }

    React.useEffect(() => {
        const handle = setInterval(() => {
            setCurDur(dur => {
                dur += SHOW_UNIT_MS
                if(dur >= SHOW_DUR_MS) {
                    setProjI(val => (val + 1) % projects.length); 
                    return 0; }
                else return dur; 
            });
        }, SHOW_UNIT_MS);
        setHandle(handle);

        () => {
            clearInterval(handle); 
            setHandle(-1); 
        }
    }, []); 

    React.useEffect(() => {
        console.log({curDur, val: (curDur / SHOW_DUR_MS) * 100})
    }, [curDur])

    return <Box className={styles.projDisplay._}>
        <DisplayHeader label='Project // Featured' color='orange' to='/projects' />
        <Box className={styles.projDisplay.main._} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} key={projI}>
            <Box className={styles.projDisplay.header}>
                <Typography>Proj // {threeDigitCode(curProj.id)}</Typography>
                <Typography>{curProj.title}</Typography>
                <Divider />
                <Link to={curProj.git!}><Button disabled={curProj.git == null}>Git</Button></Link>
                <Link to={curProj.url!}><Button disabled={curProj.url == null}>Site</Button></Link>
            </Box>

            <Typography className={styles.projDisplay.main.summary}>{curProj.summary}</Typography>

            <Box className={styles.projDisplay.main.footer}>
                <StatusGrid data={curProj} />
                <TechMakeupBar makeup={curProj.makeupLayers} />
            </Box>
        </Box>
        
        <Box className={styles.projDisplay.progress._}>
            <Box w={`${(curDur / SHOW_DUR_MS)*100}%`} className={`${styles.projDisplay.progress.fill}`} />
        </Box>
        <Box className={styles.projDisplay.footer._}>
            <Button onClick={() => nextProj(false)} className={styles.projDisplay.footer.buttons}>{"> prev"}</Button>
            {projects.map((_, i) => <Box className={`${styles.projDisplay.footer.ele} ${projI == i ? 'bg-black' : 'bg-white'}`} key={i} />)}
            <Button onClick={() => nextProj(true)} className={styles.projDisplay.footer.buttons}>{"next <"}</Button>
        </Box>
    </Box>
}

function BlogDisplay({blogs}:{blogs:BlogHeader[]}) {
    return <Box>
         <DisplayHeader label='Blog // Featured' color='orange' to='/blog' />
         <Box>
            {blogs.map((b, bI) => <BlogPreview key={bI} blog={b} showSummary/>)}
         </Box>
    </Box>
}

function BlogPreview({blog, showSummary}:{blog:BlogHeader, showSummary?:boolean}){
    return <Box>
        <Box>
            <img />
        </Box>

        <Box>
            <Box>
                <Box>
                    <Typography>{threeDigitCode(blog.title)}</Typography>
                    <Typography>{blog.title}</Typography>
                    <Box>
                        <Typography>{blog.createDate}</Typography>
                    </Box>
                </Box>
            </Box>

            {showSummary && <Box>{blog.summary}</Box>}
        </Box>

        <Box>{blog.tags.filter((_, i) => i < 3).map((t, tI) => <Typography key={tI}>{t}</Typography>)}</Box>        
    </Box>
}

const styles = {
    _: `h-full w-full flex flex-col gap-lg`,
    tagline: `font-subheader`, 
    body: `h-full grid grid-cols-2 grid-rows-1 border gap-md p-md`, 
    textheader: `pl-4 pr-4 font-subtext`, 

    displayHeader: {
        _: `grid grid-cols-[auto_auto_1fr_auto] items-center gap-sm`, 
        ele: `aspect-1/1 h-1/2 border`, 
    },


    blogDisplay: {
        _: `h-full flex flex-col gap-md`, 
    }, 

    projDisplay: {
        _: `h-full flex flex-col gap-md`, 
        main: {
            _: `flex flex-col p-sm border grow gap-sm`, 
            footer: `grid grid-cols-[auto_1fr] grid-rows-1 gap-sm`, 
            summary: `grow`, 
        }, 
        progress: {
            _: `grid flex h-2 border`, 
            fill: `h-full border bg-black z-10`, 
        },
        header: `grid grid-rows-1 grid-cols-[auto_auto_1fr_auto_auto] items-center gap-sm`,
        footer: {
            _:  `flex items-center justify-center gap-sm`,
            ele: `border rounded-full aspect-1/1 h-2`, 
            buttons: `first:mr-auto last:ml-auto`, 
        }, 
    },


    blogCarousel: `w-full h-auto grid grid-rows-1 grid-cols-3 gap-sm pl-4 pr-4`,
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}