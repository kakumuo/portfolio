import { Box, Button, Divider, Typography } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./Icons";
import { Caption } from "./Caption";


type HeaderLink = {label:string, link:string}
const headerLinks:HeaderLink[] = [
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

function HeaderLinkElement(props:HeaderLink & React.ComponentPropsWithoutRef<'a'>) {
    const loc = useLocation(); 
    const regex = new RegExp(`.*${props.link}(#.*)?$`); 
    const selectStyle = `underline font-bold italic`

    return <Link className={`${props.className} ${loc.pathname.match(regex) ? selectStyle : ""}`} key={props.label} to={props.link} children={props.label}/>
}

export function PageHeader() {
    return <Box id="top" className={styles.pageHeader._}>
        <Link to={"/"} className={`${styles.pageHeader.$}`}>Some Name</Link>
        <Divider className={styles.pageHeader.divider} />
        {headerLinks.map((link, linkI) => <HeaderLinkElement className={`${styles.pageHeader.$}`} key={linkI} {...link}/>)}
        
    </Box>
}


export function PageFooter(){
    return <Box className={styles.pageFooter._}>
        {footerLinks.map((l, lI) => <Caption className={styles.pageFooter.$} key={lI} link={l.link} caption={l.label}>{<Box className="hover:fill-orange-500">{l.icon}</Box>}</Caption>)}
        <Divider className={styles.pageFooter.divider} />
        <Typography className={styles.pageFooter.$}>© {new Date().getFullYear()} Kevin Akumuo - All rights reserved</Typography>
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
        _: `relative w-full flex gap-sm items-center`, 
        $: `
            bg-white p-sm align-middle
            first:mr-auto first:ml-10 first:font-title
            last:mr-10
            transition hover:underline`,
        divider: `absolute top-1/2 w-full bg-blue -z-1`, 
        header: `w-full flex gap-md`, 
        footer: `w-full flex gap-md`
    }, 
    pageFooter: {
        _: `flex gap relative h-10 items-center gap-md`, 
        divider: `absolute self-center w-full -z-1`, 
        $: `first:ml-8 last:mr-8 last:ml-auto bg-white font-subheader font-black opacity-100`, 
    }
}