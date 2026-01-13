import { Box, Button, Divider, Typography } from "@mantine/core";
import { Link, Outlet } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./Icons";
import { HashLink } from "react-router-hash-link";



const headerLinks:{label:string, link:string}[] = [
    {label: "Home", link: "/"},
    {label: "About", link: "/blog/about-me"},
    {label: "Projects", link: "/projects"},
    {label: "Blog", link: "/blog"},
    {label: "Contact", link: "/blog/contact-me"},
];

const footerLinks:{label:string, link:string, icon:React.JSX.Element}[] = [
    {label: "LinkedIn", link: "https://www.linkedin.com/in/kevin-akumuo/", icon: <IconLinkedIn className="w-5 h-5" /> },
    {label: "GitHub", link: "https://github.com/kakumuo/", icon: <IconGithub className="w-5 h-5" />},
    {label: "LeetCode", link: "https://leetcode.com/u/foxfen23/", icon: <IconLeetCode className="w-5 h-5" />},
    {label: "GoodReads", link: "https://www.goodreads.com/user/show/186704789-kevin-akumuo", icon: <IconGoodReads className="w-5 h-5" />},
    {label: "MyMangaList", link: "https://myanimelist.net/mangalist/foxfen64?status=2&order=4&order2=0", icon: <IconMAL className="w-5 h-5" />},
];


export function MainLayout() {
    return <>
        <PageHeader showFooter/>
        <Outlet />
        <PageFooter />
    </>
}

export function PageHeader(props:{showFooter:boolean}) {
    return <Box id="top" className={styles.pageHeader.container}>
        <Box className={styles.pageHeader.header}>
            <Link to={"/"} className={"mr-auto"}>Some Name</Link>
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
    return <Box className={styles.pageFooter.container}>
        <HashLink smooth to={"#top"}>Top of Page</HashLink>
        <Typography className="justify-self-center">© {new Date().getFullYear()} Kevin Akumuo - All rights reserved</Typography>
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