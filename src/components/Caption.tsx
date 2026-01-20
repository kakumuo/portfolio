import * as React from 'react'
import { Link } from 'react-router';
import { Corners } from './Components';


export const Caption = (props:{caption?:any, link?:string} & React.ComponentPropsWithoutRef<'span'>) => {
    const captionRef = React.useRef<HTMLDivElement>(null); 
    const [xPos, setXPos] = React.useState(0);
    const [yPos, setYPos] = React.useState(0);
    const OFFSET = {x: 25, y: 25}; // Changed to numbers for easier calculations

    const handleMouseEnter = (ev:React.MouseEvent) => { 
        updateCaptionPosition(ev.clientX, ev.clientY);
    }

    const handleMouseMove = (ev:React.MouseEvent) => {        
        updateCaptionPosition(ev.clientX, ev.clientY);
    }

    const updateCaptionPosition = (mouseX: number, mouseY: number) => {
        if (!captionRef.current) return;

        const captionWidth = captionRef.current.offsetWidth;
        const captionHeight = captionRef.current.offsetHeight;

        // Calculate new positions
        let newX =  (mouseX + OFFSET.x);
        let newY =  (mouseY + OFFSET.y);

        // Check boundaries
        if (newX + captionWidth > window.innerWidth) {
            newX = window.innerWidth - captionWidth - 10; // 10px padding from right
        }
        if (newY + captionHeight > window.innerHeight) {
            newY = window.innerHeight - captionHeight - 10; // 10px padding from bottom
        }

        // setPos({ x: newX, y: newY });
        setXPos(newX)
        setYPos(newY)
    };

    return (
        <span className={`${props.className} ${styles.container}`}  
            onMouseEnter={handleMouseEnter} 
            onMouseMove={handleMouseMove}
            id={props.id}
        >
            {
            props.link ?             
                <Link to={props.link} className={`cursor-${props.link ? 'pointer' : 'auto'}`}>
                    {props.children}
                </Link>
                : 
                <span className={`cursor-${props.link ? 'pointer' : 'auto'} group-hover/caption:text-(--primary) transition`}>
                    {props.children}
                </span>
            }

            {
                (props.caption) && 
                    <span 
                        className={`${styles.caption}`}
                        // style={{left: pos.x, top:pos.y, visibility: show ? 'visible': 'hidden'}}
                        // style={{left: xPos, top:yPos, visibility: show ? 'visible': 'hidden'}}
                        style={{left: xPos, top:yPos}}
                        ref={captionRef}
                    >
                        <Corners className='absolute top-0 left-0 stroke-(--secondary)' corner='tl' />
                        <Corners className='absolute top-0 right-0 stroke-(--secondary)' corner='tr' />
                        <Corners className='absolute bottom-0 left-0 stroke-(--secondary)' corner='bl' />
                        <Corners className='absolute bottom-0 right-0 stroke-(--secondary)' corner='br' />
                        {props.caption}
                    </span>
            }

        </span>
    );
};

const styles = {
    container: `relative grid group/caption`, 
    caption: `fixed z-3 grid grid-cols-auto grid-rows-auto p-2 px-4 bg-(--neutral)/90 invisible group-hover/caption:visible group-hover/caption:opacity-100 opacity-0 transition`,
}
