import React from "react";
import { Link, type LinkProps } from "react-router";
import { AppContext, type PreloadMap } from "../app";


//TODO: turn preloads into steps, have each step execute async, return total when done
const HOVER_THRESH_MS = 250; //prevent spamming of api calls when hovering over
const PRELOAD_TTL_MS = 10_000; //allows for cacheing of data throughout app
export function PreloadableLink<T>(props:LinkProps & {preLoad:()=>T}) {
    const [timer, setTimer] = React.useState(-1); 
    const [localPre, setLocalPre] = React.useState(null! as PreloadMap[any])
    const {preload, setPreload} = React.useContext(AppContext); 

    const handleMouseEnter = () => {
        setTimer(setTimeout(async () => {
            if(!localPre || Date.now() - localPre.retriveTime > PRELOAD_TTL_MS) {
                const res = await props.preLoad(); 
                setLocalPre({data: res, retriveTime: Date.now()}); 
                console.log("preloadablelink retreived data...")
            }else {
                console.log("ignoring preload, already has data",  localPre)
            }

            setTimer(-1); 
        }, HOVER_THRESH_MS));
    } 

    const handleMouseLeave = () => {
        if(timer != -1) {
            clearTimeout(timer); 
            setTimer(-1); 
            console.log("preemptively clearing timeout")
        }
    }

    const handleMouseDown = () => {
        const target = props.to.toString(); 
        const tmp = {...preload}; 
        tmp[target] = localPre; 
        setPreload(tmp); 
    }

    return <Link {...props} 
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
        onMouseDown={handleMouseDown}
    />
}