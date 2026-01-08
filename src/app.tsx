import {Box, Button, Divider, Typography} from '@mantine/core'; 
import { HomePage } from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Link } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./components/Icons";
import { headerLinks } from './sampleData';
import { ProjectsPage } from './pages/ProjectsPage';
import { PostPage } from './pages/ProjectPostPage';

const footerLinks:{label:string, link:string, icon:React.JSX.Element}[] = [
    {label: "LinkedIn", link: "https://www.linkedin.com/in/kevin-akumuo/", icon: <IconLinkedIn className="w-5 h-5" /> },
    {label: "GitHub", link: "https://github.com/kakumuo/", icon: <IconGithub className="w-5 h-5" />},
    {label: "LeetCode", link: "https://leetcode.com/u/foxfen23/", icon: <IconLeetCode className="w-5 h-5" />},
    {label: "GoodReads", link: "https://www.goodreads.com/user/show/186704789-kevin-akumuo", icon: <IconGoodReads className="w-5 h-5" />},
    {label: "MyMangaList", link: "https://myanimelist.net/mangalist/foxfen64?status=2&order=4&order2=0", icon: <IconMAL className="w-5 h-5" />},
];

//TODO: fix tailwind theme config
export function App() {
    return <Box className={styles.container}>
        <BrowserRouter>
            <PageHeader showFooter />
            <Routes>
                <Route path='/' Component={HomePage}/>
                <Route path='/projects' Component={ProjectsPage}/>
                <Route path='/projects/:project_id' Component={PostPage}/>
            </Routes>
            <PageFooter />
        </BrowserRouter>
    </Box>
}

const styles = {
    container: `
        h-screen w-screen 
        pl-50 pr-50
        overflow-y-scroll
        grid grid-cols-1 grid-rows-[auto_1fr]
        `,
    pageHeader: {
        container: `light w-full h-auto grid grid-cols-1 grid-rows-auto gap-sm bg-secondary`, 
        header: `w-full flex gap-md text-primary`, 
        footer: `w-full flex gap-md`
    }, 
    pageFooter: {
        container: `grid grid-cols-1 grid-rows-auto`
    }
}

export function PageHeader(props:{showFooter:boolean}) {
    return <Box className={styles.pageHeader.container}>
        <Box className={styles.pageHeader.header}>
            <Typography className={"mr-auto"}>Some Name</Typography>
            {headerLinks.map((link, linkI) => <Link key={linkI} to={link.link}>{link.label}</Link>)}
        </Box>
        <Divider />

        {props.showFooter &&         
            <Box className={styles.pageHeader.footer}>
                <Box className={"ml-auto"} />
                {footerLinks.map((link, linkI) => <Link key={linkI} to={link.link}>{link.icon}</Link>)}
            </Box>
        }
    </Box>
}


export function PageFooter(){
    const handleTOP = () => {
        document.documentElement.scrollTop = 0; 
    }

    return <Box className={styles.pageFooter.container}>
        <Button className="justify-self-start" onClick={handleTOP}>Top of Page</Button>
        <Typography className="justify-self-center">© {new Date().getFullYear()} Kevin Akumuo - All rights reserved</Typography>
    </Box>
}
