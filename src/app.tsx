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

type AppContextData = {
    client:PortfolioClient
}

export const AppContext = React.createContext(null! as AppContextData); 

//TODO: fix tailwind theme config
export function App() {
    const [client, _] = React.useState(new PortfolioClient()); 

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

    return <AppContext value={{client}}>
        <Box className={styles.container}
            style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: 'orange transparent',
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



