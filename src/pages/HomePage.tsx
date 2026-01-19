import * as React from 'react'; 

import { Box, Divider, Typography } from "@mantine/core";
import { Button as Button, ProgressBar } from '../components/Components';
import { MainPage } from "../components/MainPage";
import { StatusGridCaption, TechMakeupBar } from "../components/ProjectPreview";
import { AppContext } from "../app";
import type { BlogHeader, PostData, ProjectHeader } from '../components/types';
import {StyledMarkdown} from '../components/MarkdownStyle';
import { Link, useNavigate } from 'react-router';
import { formatDate, threeDigitCode } from '../components/Utils';
import { Corners } from '../components/Components';
import { LoadingPage } from './LoadingPage';


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
    "title": "Portfolio Site-2",
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



export function HomePage(){
    const {client} = React.useContext(AppContext); 
    const [overview, setOverview] = React.useState({} as PostData)
    const [featuredBlogData, setFeaturedBlogData] = React.useState([] as BlogHeader[]); 
    const [featuredProjData, setFeaturedProjData] = React.useState([] as ProjectHeader[]); 
    const [loaded, setLoaded] = React.useState(false); 
    const [tagline, setTagline] = React.useState("")
    const navigate = useNavigate(); 

    React.useEffect(() => {      
        ;(async() => {
            const [overviewData, blogData, projData] = await Promise.all([
                client.getPostData({id: 'overview'}), 
                client.getBlogHeader({}), 
                client.getProjectHeader({}), 
            ])

            if(!overviewData.success || !blogData.success || !projData.success) {
              const target = [overviewData, blogData, projData].find(d => d.success == false); 
              navigate('/error', {
                replace: true, 
                state: target!
              })
              return; 
            }
            setOverview(overviewData.data);          

            const blogRes = blogData.data.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            // const blogRes = sampleBlogPosts.sort((a, b) => b.createDate - a.createDate).filter((_, i) => i < 3); 
            setFeaturedBlogData(blogRes); 

            const projRes = projData.data.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            // const projRes = sampleProjData.sort((a, b) => b.endDate - a.endDate).filter((_, i) => i < 3); 
            setFeaturedProjData(projRes); 

            setLoaded(true); 
        })(); 

        const taglines = ["apps", "games", "music", "clothing"]
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

    return <>{!loaded ? <LoadingPage /> :
    <MainPage className={styles._}>
        <Typography className={styles.tagline}>creating // {tagline}</Typography>
        <Box className={styles.textheader}><StyledMarkdown >{overview.postContent}</StyledMarkdown></Box>

        <Box className={styles.body}>
            <ProjectDisplay projects={featuredProjData} />
            <BlogDisplay blogs={featuredBlogData} />
        </Box>
    </MainPage>
    }</>
}


function DisplayHeader(props:{label:string, to:string}){
    return <Box className={styles.displayHeader._}>
        <Box className={`${styles.displayHeader.indicator}`} />
        <Typography className={styles.displayHeader.title}>{props.label}</Typography>
        <Divider color="var(--tertiary)"/>
        <Link to={props.to}><Button>View More</Button></Link>
    </Box>
}

const SHOW_DUR_MS = 10 * 1000; 
function ProjectDisplay({projects}:{projects:ProjectHeader[]}){
    const [projI, setProjI] = React.useState(0); 
    const progressBarRef = React.createRef<HTMLDivElement>(); 
    const curProj = projects[projI]; 
    const [hover, setHover] = React.useState(false); 
    const hoverProps = {
      onMouseEnter: () => setHover(true), 
      onMouseLeave: () => setHover(false), 
    }

    const nextProj = (inc:boolean) => {
        if(inc) {
            setProjI(val => (val + 1) % projects.length); 
        } else {
            setProjI(val => val == 0 ? projects.length - 1 : val - 1)
        }

        progressBarRef.current && progressBarRef.current.getAnimations().forEach(anim => {anim.cancel(); anim.play();}); 
    }

    return <Box className={styles.projDisplay._}>
        <DisplayHeader label='Project // Featured' to='/projects' />
        <ProjectPreview className={styles.projDisplay.main._} {...hoverProps} key={projI} curProj={curProj} />
        
        {projects.length > 1 && <ProgressBar ref={progressBarRef} pause={hover} className={styles.projDisplay.progress} durationMS={SHOW_DUR_MS} onAnimationIteration={() => nextProj(true)} />}

        <Box className={styles.projDisplay.footer._}>
            <Button disabled={projects.length <= 1} onClick={() => nextProj(false)} className={styles.projDisplay.footer.buttons}>{"prev"}</Button>
            {projects.map((_, i) => <Box className={`${styles.projDisplay.footer.$} ${projI == i ? 'bg-(--neutral-contrast)' : 'bg-(--neutral)'}`} key={i} />)}
            <Button disabled={projects.length <= 1} onClick={() => nextProj(true)} className={styles.projDisplay.footer.buttons}>{"next"}</Button>
        </Box>
    </Box>
}

export function ProjectPreview({curProj, ...props}:React.ComponentPropsWithoutRef<'div'>&{curProj:ProjectHeader }){
  return <Box {...props}>
            <Link className='w-full h-full absolute top-0 left-0 z-1 peer' to={`/projects/${curProj.id}`} />
            <Box className='absolute w-full h-full top-0 left-0
              transition duration-300 ease-in-out
              bg-(--neutral-contrast)/3 opacity-0
              group-hover:opacity-100
            '>
              <Corners className='absolute top-0 left-0 stroke-(--secondary)' corner='tl' />
              <Corners className='absolute bottom-0 right-0 stroke-(--secondary)' corner='br' />
            </Box>
            <Typography className='font-subheader'>// PROJ-{threeDigitCode(curProj.id)}</Typography>
            <Box className={styles.projDisplay.header._}>
                <Typography className={styles.projDisplay.header.title}>{curProj.title}</Typography>
                <Divider color="var(--tertiary)"/>
                <Link className='z-2' to={curProj.git!}><Button disabled={curProj.git == null}>Git</Button></Link>
                <Link className='z-2' to={curProj.url!}><Button disabled={curProj.url == null}>Site</Button></Link>
            </Box>

            <Typography className={styles.projDisplay.main.summary}>{curProj.summary}</Typography>

            <Box className={styles.projDisplay.main.footer}>
                <StatusGridCaption className='z-2' data={curProj} />
                <TechMakeupBar className='z-2' makeup={curProj.makeupLayers} />
            </Box>
        </Box>
}

function BlogDisplay({blogs}:{blogs:BlogHeader[]}) {
    return <Box className={styles.blogDisplay.display._}>
         <DisplayHeader label='Blog // Featured' to='/blog' />
         <Box className={styles.blogDisplay.display.list}>
            {blogs.map((b, bI) => <Box key={bI} ><BlogPreview blog={b}/></Box>)}
         </Box>
    </Box>
}

export function BlogPreview({blog, showSummary}:{blog:BlogHeader, showSummary?:boolean}){
    const [hover, setHover] = React.useState(false); 

    return <Link to={`/blog/${blog.id}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Box className={styles.blogDisplay.preview._}>
          <Box
            className={`
              absolute w-full h-full top-0 left-0
              transition duration-300 ease-in-out
              -z-12
              bg-(--neutral-contrast)/3 opacity-0
              group-hover:opacity-100
            `}
          >
            <Corners className="absolute top-0 left-0 stroke-(--secondary)" corner="tl" />
            <Corners className="absolute bottom-0 right-0 stroke-(--secondary)" corner="br" />
          </Box>
          <img className={styles.blogDisplay.preview.img} src={blog.bannerImage} />        
          <Box className={styles.blogDisplay.preview.header._}>
            <Typography className={styles.blogDisplay.preview.header.numLabel}>//BLOG-{threeDigitCode(blog.id)}</Typography>
            <Box className={styles.blogDisplay.preview.header.indicator}/>
          </Box>
          <Typography style={{textDecoration: hover ? 'underline' : 'none'}} className={styles.blogDisplay.preview.title}>{blog.title}</Typography>
          <Box className={styles.blogDisplay.preview.sub}>
            <Typography className={styles.blogDisplay.preview.sub_$}>{formatDate(blog.createDate)}</Typography>
            {blog.tags.map((t, tI) => <Typography className={styles.blogDisplay.preview.sub_$} key={tI}>{t}</Typography>)}
          </Box>

          {showSummary && <Box className={styles.blogDisplay.summary}>{blog.summary}</Box>}
      </Box>
    </Link>
}

const styles = {
    blogDisplay: {
        display: {
          _:  `h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-md`, 
          list: `grid grid-cols-1 grid-rows-auto gap-md`, 
        },
        preview: {
          _: `relative flex flex-col z-1 p-sm overflow-hidden group bg-(--neutral)/75`,
          img:`absolute left-1/2 top-1/dd2 -translate-1/2 w-full h-auto objectfit-contain opacity-10`, 
          header:{
            _: `flex items-center z-1`, 
            numLabel: `mr-auto font-subheader`, 
            indicator: `rounded-full h-2 aspect-1/1 border animate-pulse border-(--tertiary) bg-(--tertiary)`, 
          }, 
          title: `col-start-2 row-start-1 row-span-1 col-span-full flex items-center mt-auto mb-auto font-subtitle 
          group-hover:italic group-hover:underline group-hover:text-(--tertiary) z-1`, 
          sub: `col-start-2 ro-start-2 row-span-1 col-span-full flex items-center z-1`, 

          sub_$:`
            first:mr-auto first:text-[14px] first:font-subtext
            not-first:border not-first:pl-4 not-first:pr-4 not-first:font-label`, 
        }, 
        summary: `font-body text-[.8em]`, 
    },

    _: `h-full w-full flex flex-col gap-lg`,
    tagline: `font-subheader `, 
    body: `h-auto grid grid-cols-2 grid-rows-1 gap-md p-md my-auto border-b-2 border-dashed border-(--neutral-contrast)`, 
    textheader: `pl-4 pr-4 font-body`, 

    displayHeader: {
        _: `grid grid-cols-[auto_auto_1fr_auto] items-center gap-sm`, 
        indicator: `aspect-1/1 h-1/2 border animate-pulse border-(--primary) bg-(--primary)`, 
        title: `font-subheader`, 
    },

    projDisplay: {
        _: `h-full flex flex-col gap-md`, 
        main: {
            _: `flex flex-col p-sm grow gap-sm relative group h-auto`, 
            footer: `grid grid-cols-[auto_1fr] grid-rows-1 gap-sm`, 
            summary: `grow font-body`, 
        }, 
        progress: `grid flex h-2 border`,
        header: {
          _:  `grid grid-rows-1 grid-cols-[auto_1fr_auto_auto] items-center gap-sm`,
          title: `font-subtitle group-hover:italic group-hover:underline group-hover:text-(--tertiary)`, 
        },
        footer: {
            _:  `flex items-center justify-center gap-sm`,
            $: `border rounded-full aspect-1/1 h-2`, 
            buttons: `first:mr-auto last:ml-auto`, 
        }, 
    },


    blogCarousel: `w-full h-auto grid grid-rows-1 grid-cols-3 gap-sm pl-4 pr-4`,
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}