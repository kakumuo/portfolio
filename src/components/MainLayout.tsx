import { Box, Button, Divider, Typography } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./Icons";
import { HashLink } from "react-router-hash-link";
import { Caption } from "./Caption";
import { ProjectsPage } from "../pages/ProjectsPage";



const headerLinks:{label:string, link:string}[] = [
    {label: "//home", link: "/"},
    {label: "//about", link: "/blog/about-me"},
    {label: "//projects", link: "/projects"},
    {label: "//blog", link: "/blog"},
    {label: "//contact", link: "/blog/contact-me"},
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
        <PageHeader/>
        <Outlet />
        <PageFooter />
    </>
}

function HeaderLink(props:{link:string, label:string, className?:string}) {
    const loc = useLocation(); 
    const regex = new RegExp(`.*${props.link}(#.*)?$`); 
    const selectStyle = `underline font-bold italic`

    return <Link className={`${props.className} ${loc.pathname.match(regex) ? selectStyle : ""}`} key={props.label} to={props.link} children={props.label}/>
}

export function PageHeader() {
    return <Box id="top" className={styles.pageHeader.container}>
        <Link to={"/"} className={`${styles.pageHeader.element}`}>Some Name</Link>
        <Divider className={styles.pageHeader.divider} />
        {headerLinks.map((link, linkI) => <HeaderLink className={`${styles.pageHeader.element}`} key={linkI} {...link}/>)}
    </Box>
}


export function PageFooter(){
    return <Box className={styles.pageFooter._}>
        {footerLinks.map((l, lI) => <Caption className={styles.pageFooter.ele} key={lI} children={l.icon} link={l.link} caption={l.label} />)}
        <Divider className={styles.pageFooter.divider} />
        <Typography className={styles.pageFooter.ele}>© {new Date().getFullYear()} Kevin Akumuo - All rights reserved</Typography>
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
        container: `relative w-full flex gap-sm`, 
        element: `
            bg-white z-10 p-sm align-middle
            first:mr-auto first:ml-10 first:text-xl first:font-header
            last:mr-10`,
        divider: `absolute top-1/2 w-full bg-blue`, 
        header: `w-full flex gap-md`, 
        footer: `w-full flex gap-md`
    }, 
    pageFooter: {
        _: `flex gap relative h-10 items-center gap-md`, 
        divider: `absolute self-center w-full`, 
        ele: `first:ml-8 last:mr-8 last:ml-auto z-1 bg-white`, 
    }
}