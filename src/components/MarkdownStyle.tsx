import type { Components } from "react-markdown"
import { Caption } from "./Caption";

export const MarkdownStyle:Components = {
    // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
    em(props) {
        const {node, ...rest} = props
        return <i style={{color: 'pink'}} {...rest} />
    },

    p(props) {
        type Node = {type: 'node' | 'caption' | 'open' | 'capOpen' , base?:any, caption?:any}
        const {node, children, ...rest} = props; 
        let curString = ""; 
        const stack:Node[] = []; 

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

                    return <Caption className={styles.caption} caption={captionArr}>{baseArr}</Caption>
                }
            }
        }

        textContent = stack.map(val => resolveNode(val));         
        return <p {...rest}>{textContent}</p>
    }
}
const styles = {
    caption: `inline-block`
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


