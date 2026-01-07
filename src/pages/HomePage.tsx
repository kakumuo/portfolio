import { Box, Text, Typography } from "@mantine/core";
import { MainPage } from "../components/MainPage";
import { SectionHeader } from "../components/SectionHeader";
import { BlogPostPreview, type BlogData } from "../components/BlogPostPreview";
import { ProjectPreview, type ProjectData } from "../components/ProjectPreview";
import { LookAt } from "../components/LookAt";

const sampleBlogData:BlogData[] = [
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagA", "tagB"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" },
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagC", "tagD"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" },
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagE", "tagF"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" }
]

const projects: ProjectData[] = [
  {
    title: "AI Chat Assistant",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    type: "personal",
    taskSize: "small",
    complexity: "low",
    status: "completed",
    // gitLink: "https://github.com/example/ai-chat-assistant",
    // projectLink: "https://aiassistant.demo.app",
    preview: "An AI-powered chat app that integrates OpenAI's API to deliver intelligent real-time responses with a polished React UI.",
    techMakeup: [
      { tech: "React", percent: 30 },
      { tech: "TypeScript", percent: 25 },
      { tech: "Node.js", percent: 20 },
      { tech: "Express", percent: 10 },
      { tech: "OpenAI API", percent: 15 },
    ],
  },
  {
    title: "Portfolio Website",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2026-01-05"),
    type: "personal",
    taskSize: "small",
    complexity: "low",
    status: "completed",
    gitLink: "https://github.com/example/portfolio-site",
    projectLink: "https://example.dev",
    preview: "A modern, responsive portfolio website built with Next.js and Tailwind CSS to showcase personal projects and experience.",
    techMakeup: [
      { tech: "Next.js", percent: 40 },
      { tech: "TypeScript", percent: 30 },
      { tech: "Tailwind CSS", percent: 20 },
      { tech: "Vercel", percent: 10 },
    ],
  },
];



export function HomePage(){
    return <MainPage>
        <Text>
            I am an experienced software developer with a strong background in Backend and ETL development. Currently working as a Applicaiton Developer II at UPS, where I've been instrumental in developing and improving critical processes for managing large-scale customer data.
            I am committed to continuous learning and applying cutting-edge solutions to complex business problems in the rapidly evolving field of software development.
        </Text>

        <SectionHeader title="Featured" more={{label: "More Posts", link: "/blog"}} />
        <Box className={styles.blogCarousel}>
            {sampleBlogData.map((data, dataI) => <BlogPostPreview key={dataI} blogData={data}/>)}
        </Box>

        
        <SectionHeader  title="Projects" more={{label: "More Projects", link: "/projects"}}>
            <LookAt className={styles.projectHelp}>
                <Typography className={styles.projectHelp}>[?]</Typography>
            </LookAt>
        </SectionHeader>
        <Box className={styles.projectsSection}>
            {projects.map((proj, projI) => <ProjectPreview data={proj} key={projI} />)}
        </Box>

    </MainPage>
}

const styles = {
    container: `h-full w-full grid`,
    blogCarousel: `w-full h-auto grid grid-rows-1 grid-cols-3 gap-4`,
    projectsSection: `w-full grid gap-lg`, 
    projectHelp: `justify-self-end`,
}