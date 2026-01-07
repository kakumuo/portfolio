
import { Anchor, Box, Divider, Text, Typography } from "@mantine/core";
import { Link } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./Icons";


const headerLinks:{label:string, link:string}[] = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Projects", link: "/projects"},
    {label: "Blog", link: "/blog"},
    {label: "Contact", link: "/contact"},
];

const footerLinks:{label:string, link:string, icon:React.JSX.Element}[] = [
    {label: "LinkedIn", link: "https://www.linkedin.com/in/kevin-akumuo/", icon: <IconLinkedIn className="w-5 h-5" /> },
    {label: "GitHub", link: "https://github.com/kakumuo/", icon: <IconGithub className="w-5 h-5" />},
    {label: "LeetCode", link: "https://leetcode.com/u/foxfen23/", icon: <IconLeetCode className="w-5 h-5" />},
    {label: "GoodReads", link: "https://www.goodreads.com/user/show/186704789-kevin-akumuo", icon: <IconGoodReads className="w-5 h-5" />},
    {label: "MyMangaList", link: "https://myanimelist.net/mangalist/foxfen64?status=2&order=4&order2=0", icon: <IconMAL className="w-5 h-5" />},
];

export function PageHeader(props:{showFooter:boolean}) {
    return <Box className={styles.container}>
        <Box className={styles.header}>
            <Typography className={"mr-auto"}>Some Name</Typography>
            {headerLinks.map((link, linkI) => <Link key={linkI} to={link.link}>{link.label}</Link>)}
        </Box>
        <Divider />

        {props.showFooter &&         
            <Box className={styles.footer}>
                <Box className={"ml-auto"} />
                {footerLinks.map((link, linkI) => <Link key={linkI} to={link.link}>{link.icon}</Link>)}
            </Box>
        }
    </Box>
}

const styles = {
    container: `light w-full h-auto grid grid-cols-1 grid-rows-auto gap-sm p-sm bg-secondary`, 
    header: `w-full flex gap-md text-primary underline`, 
    footer: `w-full flex gap-md`
}