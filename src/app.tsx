import * as React from 'react'

import {Box} from '@mantine/core'; 
import { HomePage } from './pages/HomePage';
import { createBrowserRouter, RouterProvider, } from 'react-router';

import { ProjectsPage } from './pages/ProjectsPage';
import { PostPage } from './pages/PostPage';
import { BlogPage } from './pages/BlogPage';
import { PortfolioClient } from './components/PortfolioClient';
import { MainLayout } from './components/MainLayout';
import { ErrorPage } from './pages/ErrorPage';



export type PreloadMap = {[key:string]:{data:any, retriveTime:number}}
export type AppTheme = {themeClass:string, isDark:boolean}
type AppContextData = {
    client:PortfolioClient, 
    theme: AppTheme,
    setTheme:React.Dispatch<React.SetStateAction<AppTheme>>
}

export const AppContext = React.createContext(null! as AppContextData); 

//TODO: fix tailwind theme config
export function App() {
    const [client, _] = React.useState(new PortfolioClient()); 
    const [theme, setTheme] = React.useState<AppTheme>({themeClass: 'normal', isDark: true})

    const router = React.useMemo(() => 
        createBrowserRouter([
            {path: "/", Component: MainLayout, children: [
                {path: "/", Component: HomePage},
                {path: '/projects' , Component: ProjectsPage},
                {path: '/blog' , Component: BlogPage},
                {path: '/projects/:id' , Component: PostPage},
                {path: '/blog/:id'  , Component: PostPage},
                {path: '/error', Component: ErrorPage},
                {path: '/*', Component: ErrorPage},
            ]}
        ])
    , []); 

    return <AppContext value={{client, theme, setTheme}}>
        <Box className={styles.container + ` ${theme.themeClass + (theme.isDark ? '-dark' : '-light')}`}
            style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: 'var(--tertiary) transparent',
                scrollbarGutter: 'stable'
            }}
        >
            <RouterProvider router={router} />
        </Box>
    </AppContext>
}

const styles = {
    container: `
            h-screen  w-screen px-[min(30vw,15%)] overflow-hidden
            grid grid-cols-1 grid-rows-[auto_1fr]
            dark gap-8xl text-(--neutral-contrast)
            -z-100
            [background-image:linear-gradient(to_bottom,rgb(from_var(--neutral-accent)_r_g_b_/_0.2)_2px,transparent_2px),linear-gradient(to_right,rgb(from_var(--neutral-accent)_r_g_b_/_.2)_2px,transparent_2px),linear-gradient(to_right,var(--neutral))]
            bg-repeat
            bg-size-[15vw_15vw]
            bg-center
        `,
}



