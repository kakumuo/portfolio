import { Box, Typography } from '@mantine/core';
import * as React from 'react'
import { Link } from 'react-router';


export const Caption = (props:{caption?:any, children:any, link?:string, className?:string}) => {
    const captionRef = React.useRef<HTMLDivElement>(null); 
    const [pos, setPos] = React.useState({x:0, y:0});
    const [hoverTimeout, setHoverTimeout] = React.useState(setTimeout(()=>{}, 1))
    const HOVER_DELAY_MS = 1000 * .2
    const OFFSET = {x: 10, y: 10}; // Changed to numbers for easier calculations

    const [isHover, setIsHover] = React.useState({val: false})
    const [show, setShow] = React.useState(false); 

    const handleMouseEnter = (ev:React.MouseEvent) => { 
        setIsHover({val: true})       
        updateCaptionPosition(ev.clientX, ev.clientY);
        
        clearTimeout(hoverTimeout)            
        setHoverTimeout(setTimeout(() => {
            if(!isHover.val)
                setShow(true)
        }, HOVER_DELAY_MS))

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
        <span className={`${props.className} ${styles.container}`}  
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onMouseMove={handleMouseMove}
        >
            {
            props.link ?             
                <Link to={props.link} className={`hover:text-primary cursor-${props.link ? 'pointer' : 'auto'}`}>
                    {props.children}
                </Link>
                : 
                <Typography className={`hover:text-primary cursor-${props.link ? 'pointer' : 'auto'}`}>
                    {props.children}
                </Typography>
            }

            {
                props.caption && 
                    <Box 
                        className={`${styles.caption}`}
                        style={{left: pos.x, top:pos.y, visibility: show ? 'visible': 'hidden'}}
                        ref={captionRef}
                    >
                        {props.caption}
                    </Box>
            }

        </span>
    );
};

const styles = {
    container: `relative font-[bolder] grid`, 
    caption: `fixed border z-4 grid grid-cols-auto grid-rows-auto`,
}
