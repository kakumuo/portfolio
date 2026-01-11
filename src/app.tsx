import * as React from 'react'

import {Box, Button, Divider, Portal, Typography} from '@mantine/core'; 
import { HomePage } from './pages/HomePage';
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router';

import { Link } from "react-router";
import { IconGithub, IconGoodReads, IconLeetCode, IconLinkedIn, IconMAL } from "./components/Icons";
import { ProjectsPage } from './pages/ProjectsPage';
import { loadPostPage, PostPage } from './pages/PostPage';
import { BlogPage } from './pages/BlogPage';
import { PortfolioClient } from './components/PortfolioClient';
import { MainLayout, PageFooter, PageHeader } from './components/MainLayout';
import type { PostPageData, Preload } from './components/types';
import type { LoaderFunctionArgs } from 'react-router';



export type PreloadMap = {[key:string]:{data:any, retriveTime:number}}

type AppContextData = {
    client:PortfolioClient,
    preload:PreloadMap, 
    setPreload:React.Dispatch<PreloadMap>
}

export const AppContext = React.createContext(null! as AppContextData); 

//TODO: fix tailwind theme config
export function App() {
    const [client, _] = React.useState(new PortfolioClient()); 
    const [preload, setPreload] = React.useState({} as PreloadMap)

    const handlePreload = (path:string, callback:(...data:any[])=>any) => {
        console.log(preload[path])
        if (!preload[path]) {
            console.log("setting preload on: ", path)
            const entry = {
                data: callback(), 
                retriveTime: Date.now()
            } as PreloadMap[any]; 

            setPreload(prev => ({
                ...prev, 
                [path]: entry
            })); 

            return entry.data; 
        } else {
            console.log("getting preload on: ", path)
            return preload[path].data; 
        }
    }

    const router = React.useMemo(() => 
        createBrowserRouter([
            {path: "/", Component: MainLayout, children: [
                {path: "/", Component: HomePage},
                {path: '/projects' , Component: ProjectsPage},
                {path: '/blog' , Component: BlogPage},
                {path: '/projects/:id' , Component: PostPage, 
                    loader: ({params, unstable_pattern}) => 
                        handlePreload(params.id as string, loadPostPage.bind(loadPostPage, client, {} as Preload<PostPageData>, true, params.id as string))
                },
                {path: '/blog/:id'  , Component: PostPage, 
                    loader: ({params}) => 
                        handlePreload(params.id as string, loadPostPage.bind(loadPostPage, client, {} as Preload<PostPageData>, false, params.id as string))
                }
            ]}
        ])
    , [preload]); 

    return <AppContext value={{client, preload, setPreload}}>
        <Box className={styles.container}>
            <RouterProvider router={router} />
        </Box>
    </AppContext>
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



