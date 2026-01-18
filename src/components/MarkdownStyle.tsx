import type { Components } from "react-markdown"
import { Caption } from "./Caption";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Typography } from "@mantine/core";

export const StyledMarkdown = (props:{className?:string, children:string|undefined|null}) => {
    return <Markdown remarkPlugins={[remarkGfm]} components={MarkdownStyle}  children={props.children}/>
}

export const MarkdownStyle:Components = {
    p(props) {
        type Node = {type: 'node' | 'caption' | 'open' | 'capOpen' , base?:any, caption?:any}
        const {node, children, ...rest} = props; 
        let curString = ""; 
        const stack:Node[] = []; 

        // early return if not iterable
        if (props.children == null || typeof (props.children as any)[Symbol.iterator] !== 'function') {
            return <p {...rest} children={children} />
        }

        for (let element of props.children as any[]) {
            if(typeof element == 'string') {
                for(let char of element) {
                    if(char == '{') {
                        if(curString.length > 0) stack.push({type: 'node', base: curString}); 
                        stack.push({type: 'open'}); 
                        curString = ""; 
                    } else if (char == '}') {
                        stack.push({type: 'node', base: curString}); 
                        curString = ""; 

                        let index = stack.length - 1; 
                        while(index >= 0 && stack[index].type != 'open') {
                            index--; 
                        }

                        if(index >= 0 && stack[index].type == 'open') {
                            const level = stack.splice(index+1); 
                            stack.pop(); 
                            stack.push({'type':'caption', base: level}); 
                        } else {
                            stack.push({type: 'node', base: '}'}); 
                        }
                    } else if (char == '[' && stack.length > 0 && stack[stack.length - 1].type == 'caption'){ 
                        stack.push({type:'capOpen'})
                    } else if (char == ']'){
                        stack.push({type: 'node', base: curString}); 
                        curString = ""; 

                        let index = stack.length - 1; 
                        while(index >= 0 && stack[index].type != 'capOpen') {
                            index--; 
                        }

                        if(index >= 0 && stack[index].type == 'capOpen') {
                            const level = stack.splice(index+1); 
                            stack.pop(); 
                            stack[stack.length - 1].caption = level; 
                        } else {
                            stack.push({type: 'node', base: ']'}); 
                        }
                    } else {
                        curString += char; 
                    }
                }
            } else {
                stack.push({type: 'node', base: curString}); 
                stack.push({type: 'node', base: element}); 
                curString = ""; 
            }
        }

        if(curString.length > 0) stack.push({type: 'node', base: curString}); 
        let textContent = []
        
        const resolveNode = (node:Node) => {
            switch(node.type){
                case 'open': return '{'
                case 'capOpen': return '['
                case 'node': return node.base; 
                case 'caption': {
                    let baseArr = []
                    if(Array.isArray(node.base)) {
                        baseArr = node.base.map(b => resolveNode(b))
                    }else {
                        baseArr = [resolveNode(node.base)]
                    }

                    let captionArr = undefined
                    if(node.caption) {
                        if(Array.isArray(node.caption)) {
                            captionArr = node.caption.map(c => resolveNode(c)); 
                        } else {
                            captionArr = [resolveNode(node.caption)]
                        }
                    }

                    return <Caption className={styles.caption} caption={captionArr}>{`{`}{baseArr}{`}`}</Caption>
                }
            }
        }

        textContent = stack.map(val => resolveNode(val));         
        return <p  {...rest}>{textContent}</p>
    }, 

    em(props) {
        const {node, ...rest} = props
        return <em {...rest} className="font-subtext text-[.7em]" />
    },

    img: ({node, children, title, alt, ...props}) => {
        return <Box className="max-w-1/2 mx-auto items-center flex flex-col">
            <Typography className="font-subtext text-[.9em]">{title}</Typography>
            <img {...props} title={title} alt={alt} className="max-h-[50vh]" />
            <Typography className="font-subtext text-[.7em]">{alt}</Typography>
        </Box>
    }, 

    h1: ({ node, children, ...props }) => (
    <h1 className="font-title pt-4" id={children?.toString().toLowerCase().replace(" ", '-')} {...props}>[{children}]</h1>
    ),
    h2: ({ node, children, ...props }) => (
    <h2 className="font-subtitle pt-4" id={children?.toString().toLowerCase().replace(" ", '-')} {...props}>[{children}]</h2>
    ),
    h3: ({ node, children, ...props }) => (
    <h3 className="font-subheader pt-4" id={children?.toString().toLowerCase().replace(" ", '-')} {...props}>[{children}]</h3>
    ),
    h4: ({ node, children, ...props }) => (
    <h4 className="font-header pt-4" id={children?.toString().toLowerCase().replace(" ", '-')} {...props}>[{children}]</h4>
    ),
    a: ({node, ...props}) => (
        <a className="font-body underline" {...props} />
    ),
    li: ({node, ...props}) => (
        <li className="font-subtext" {...props} />
    ),
   table: ({ node, align, ...props }) => {
    const alignmentClass =
        align === 'center' ? 'mx-auto text-center' :
        align === 'right' ? 'ml-auto text-right' :
        'text-left';

    return (
        <table
         className={`table-auto border-collapse ${alignmentClass} text-[.8em] mx-15`}
        {...props}
        />
    );
    },

    thead: ({ children, ...props }) => (
    <thead
        className="relative"
        {...props}
    >
        {children}
        
        <tr>
        <td colSpan={"100%" as any}>
            <div className="h-[2px] bg-gray-600 w-full"></div>
        </td>
        </tr>
    </thead>
    ),

    th: ({ children, ...props }) => (
    <th
        className="px-3 text-left font-semibold tracking-wide"
        {...props}
    >
        {children}
    </th>
    ),

    td: ({ align, children, ...props }) => {
    const alignStyle:any = align ? { textAlign: align } : {};
    return (
        <td
        className="px-3 py-2 border-t border-gray-300"
        style={alignStyle}
        {...props}
        >
        {children}
        </td>
    );
    },

    }
    const styles = {
        caption: `inline-block font-body`, 
        p: `font-body`, 
    }


/*
Caption ${**test**}[some **caption**]

Caption ${testA}[some caption] ${**test**}[some **caption**]

Caption ${**test** **!**}[![](https://placehold.co/600x400/EEE/31343C)]

Caption ${**test**}[some caption] and ${**test**}[some caption]
*/


/*
const expr = /\$\{.*?\}\[.*?\]/gd; 

function captionString(text:string) {
    let matches = text.matchAll(expr); 
    let prevIndex = 0; 
    let contentArr = []
    for(let match of matches) {
        let captionBase = match[0].match(/(?<=\$\{).*?(?=\})/)
        let captionContent = match[0].match(/(?<=\[).*?(?=\])/)
        let textContent = text.substring(prevIndex, match.index); 

        if(textContent.length > 0) contentArr.push(textContent)
        contentArr.push(<Caption className={styles.caption} key={match.index} caption={captionContent}><p>{captionBase}</p></Caption>)
        prevIndex = match.index + match[0].length; 
    }

    let textContent = text.substring(prevIndex);
    if(textContent.length > 0) contentArr.push(textContent); 
    
    return contentArr
}
*/


