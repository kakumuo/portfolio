import type { BlogData } from "./components/BlogPostPreview";
import type { ProjectData } from "./components/ProjectPreview";

export const sampleBlogData:BlogData[] = [
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagA", "tagB"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" },
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagC", "tagD"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" },
    {title: "Some Title", preview: "liquet sem sem ac justo. Duis ex magna, commodo a dui in, ornare facilisis urna. Vestibulum dapibus pellentesque orci efficitur efficitur.", tags:["tagE", "tagF"], created: "23h ago", imgPath: "https://placehold.co/600x400/png" }
]

export const projects: ProjectData[] = [
  {
    title: "AI Chat Assistant",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    type: "personal",
    taskSize: "small",
    complexity: "low",
    status: "completed",
    postLink: "/projects/12345", 
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


export const headerLinks:{label:string, link:string}[] = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Projects", link: "/projects"},
    {label: "Blog", link: "/blog"},
    {label: "Contact", link: "/contact"},
];
