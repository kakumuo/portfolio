import {Box} from '@mantine/core'; 
import { HomePage } from './pages/HomePage';
import { PageHeader } from './components/PageHeader';
import { BrowserRouter, Route, Routes } from 'react-router';

//TODO: fix tailwind theme config


export function App() {
    return <Box className={styles.container}>
        <BrowserRouter>
            <PageHeader showFooter />
            <Routes>
                <Route path='/' Component={HomePage}/>
            </Routes>
        </BrowserRouter>
    </Box>
}

const styles = {
    container: `
        h-screen w-screen 
        overflow-y-scroll
        grid grid-cols-1 grid-rows-[auto_1fr]
        border border-10`,
}
