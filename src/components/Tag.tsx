import { Typography } from "@mantine/core"


export function Tag(props:{className?:string, text:String}){
    return <Typography className={props.className + styles.container}>{props.text}</Typography>
}

const styles = {
    container: ` border p-2`
}