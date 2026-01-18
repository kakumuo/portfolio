import { useLocation } from "react-router"
import { MainPage } from "../components/MainPage"
import { StyledMarkdown } from "../components/MarkdownStyle"
import type { PortfolioClientResponse } from "../components/types";
import React from "react";

export function ErrorPage(props:{className?:string}){   
    const location = useLocation(); 
    
    const message = React.useMemo(() => {
        let errorState:PortfolioClientResponse<any> & {success:false} = {
            errorCode: 404, 
            success: false, 
            message: `The requested path **\`${location.pathname}\`** is not found`, 
        }
        
        if(location.state) errorState = location.state as PortfolioClientResponse<any> & {success:false}; 

        return `
# ${errorState.errorCode}
${errorState.message}
        `
    }, [location.state])

    return <MainPage className={`${props.className ?? ""} ${styles.container}`}>
        <StyledMarkdown>{message}</StyledMarkdown>
    </MainPage>
}

const styles = {
    container: `flex m-auto font-body`, 
}