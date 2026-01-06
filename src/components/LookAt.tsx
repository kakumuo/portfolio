import * as React from 'react'

export const LookAt = ({caption, outerStyle={}, innerStyle={}, link, children}:{caption?:string, link?:string, children:any, outerStyle?:React.CSSProperties, innerStyle?:React.CSSProperties}) => {
    const captionRef = React.useRef<HTMLDivElement>(null); 
    const [pos, setPos] = React.useState({x:0, y:0});
    const [hoverTimeout, setHoverTimeout] = React.useState(setTimeout(()=>{}, 1))
    const HOVER_TIME = 1000 * .2
    const OFFSET = {x: 20, y: 20}; // Changed to numbers for easier calculations

    const clrScheme = sampleColorSchemes[React.useContext(AppContext).schemeI];
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
        <span className='look-at'  
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onMouseMove={handleMouseMove}
        >
            <a style={{color: clrScheme[!isHover.val ? 'fontPrimary' : 'fontAccent'].toString(), fontWeight: 'bold', textDecoration: 'none', cursor: link ? 'pointer' : 'auto', ...outerStyle}} href={link}>
                {children}
            </a>
            
            {caption && 
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
                    {/* {caption.match(/.*\....$/) ? <img style={{width: '100%', padding: 4}} src={caption} /> : caption} */}
                    {caption}
                </caption>
            }
        </span>
    );
};
