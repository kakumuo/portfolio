import { Box, Divider, Typography } from "@mantine/core";
import { Link } from "react-router";


const headerLinks:{label:string, link:string}[] = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Projects", link: "/projects"},
    {label: "Blog", link: "/blog"},
    {label: "Contact", link: "/contact"},
];

const footerLinks:{label:string, link:string, iconPath:string}[] = [
    {label: "LinkedIn", link: "https://www.linkedin.com/in/kevin-akumuo/", iconPath: ""},
    {label: "GitHub", link: "https://www.linkedin.com/in/kevin-akumuo/", iconPath: ""},
    {label: "LeetCode", link: "https://www.linkedin.com/in/kevin-akumuo/", iconPath: ""},
    {label: "GoodReads", link: "https://www.linkedin.com/in/kevin-akumuo/", iconPath: ""},
    {label: "MyAnimeList", link: "https://www.linkedin.com/in/kevin-akumuo/", iconPath: ""},
];

export function PageHeader(props:{showFooter:boolean}) {
    return <Box className={styles.container}>
        <Box className={styles.header}>
            <Typography children={"Kevin Akumuo"} />
            {headerLinks.map((link, linkI) => <Link key={linkI} to={link.link}>{link.label}</Link>)}
        </Box>

        <Divider my={"md"} />

        {props.showFooter &&         
            <Box className={styles.footer}>
                {footerLinks.map((link, linkI) => <Typography key={linkI} children={link.label} />)}
            </Box>
        }
    </Box>
}

const styles = {
    container: `w-full h-auto grid grid-cols-1 grid-rows-auto border`, 
    header: `w-full flex first:underline gap-5`, 
    footer: `w-full flex`
}