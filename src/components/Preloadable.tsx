import React from "react";
import { Link, useFetcher, type LinkProps } from "react-router";
import { AppContext, type PreloadMap } from "../app";


//TODO: turn preloads into steps, have each step execute async, return total when done
const HOVER_THRESH_MS = 100; //prevent spamming of api calls when hovering over
const PRELOAD_TTL_MS = 10_000; //allows for cacheing of data throughout app
export function PreloadableLink<T>(props:LinkProps & {preLoad:()=>T}) {
    const [timer, setTimer] = React.useState(-1); 
    const [localPre, setLocalPre] = React.useState(null! as PreloadMap[any])
    const [lastFetchMS, setLastFetchMS] = React.useState(0); 
    const {preload, setPreload} = React.useContext(AppContext); 
    const fetcher = useFetcher({key: "something"})

    const handleMouseEnter = () => {
        setTimer(setTimeout(async () => {
            if(!localPre || Date.now() - lastFetchMS > PRELOAD_TTL_MS) {
                // const res = props.preLoad();
                // setLocalPre({data: res, retriveTime: Date.now()}); 
                fetcher.load(props.to.toString())
                setLastFetchMS(Date.now())
            }

            setTimer(-1); 
        }, HOVER_THRESH_MS));
    } 

    const handleMouseLeave = () => {
        if(timer != -1) {
            clearTimeout(timer); 
            setTimer(-1); 
        }
    }

    const handleMouseDown = () => {
        const target = props.to.toString(); 
        const tmp = {...preload}; 
        tmp[target] = localPre; 
        setPreload(tmp); 
    }

    return <Link 
        to={props.to}
        children={props.children}
        className={props.className}
        prefetch="intent"
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
        onMouseDown={handleMouseDown}
    />
}