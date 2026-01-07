import { Box } from '@mantine/core';
import * as React from 'react'
import { Link } from 'react-router';


//TODO: fix lookat
export const LookAt = (props:{caption?:any, children:any, link?:string, className?:string}) => {
    const captionRef = React.useRef<HTMLDivElement>(null); 
    const [pos, setPos] = React.useState({x:0, y:0});
    const [hoverTimeout, setHoverTimeout] = React.useState(setTimeout(()=>{}, 1))
    const HOVER_TIME = 1000 * .2
    const OFFSET = {x: 20, y: 20}; // Changed to numbers for easier calculations

    const [isHover, setIsHover] = React.useState({val: false})
    const [show, setShow] = React.useState(false); 

    const handleMouseEnter = (ev:React.MouseEvent) => { 
        setIsHover({val: true})       
        updateCaptionPosition(ev.clientX, ev.clientY);
        
        clearTimeout(hoverTimeout)            
        setHoverTimeout(setTimeout(() => {
            if(!isHover.val)
                setShow(true)
        }, HOVER_TIME))

    }

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeout)   
        setShow(false);
        setIsHover({val: false})
    }

    const handleMouseMove = (ev:React.MouseEvent) => {        
        updateCaptionPosition(ev.clientX, ev.clientY);
    }

    const updateCaptionPosition = (mouseX: number, mouseY: number) => {
        if (!captionRef.current) return;

        const captionWidth = captionRef.current.offsetWidth;
        const captionHeight = captionRef.current.offsetHeight;

        // Calculate new positions
        let newX = mouseX + OFFSET.x;
        let newY = mouseY + OFFSET.y;

        // Check boundaries
        if (newX + captionWidth > window.innerWidth) {
            newX = window.innerWidth - captionWidth - 10; // 10px padding from right
        }
        if (newY + captionHeight > window.innerHeight) {
            newY = window.innerHeight - captionHeight - 10; // 10px padding from bottom
        }

        setPos({ x: newX, y: newY });
    };

    return (
        <span className={props.className}  
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onMouseMove={handleMouseMove}
        >
            {
                props.link ?             
                <Link to={props.link} className={`hover:primary font-bold cursor-${props.link ? 'pointer' : 'auto'}`}>
                    {props.children}
                </Link>

                : 
                <Box className={`hover:primary font-bold cursor-${props.link ? 'pointer' : 'auto'}`}>
                    {props.children}
                </Box>
            }


            {/* {props.caption && 
                <caption 
                    style={{
                        zIndex: 4,
                        top: pos.y, 
                        left: pos.x,
                        //TODO: use color scheme
                        backgroundColor: "white",
                        borderColor: "black", 
                        color: "black",
                        display: 'grid', 
                        gridTemplateColumns: 'auto', gridTemplateRows: 'auto'
                    }} 
                    ref={captionRef} 
                    className={`${!show ? 'hidden' : ''} caption`}
                >
                    {props.caption}
                </caption>
            } */}
        </span>
    );
};
