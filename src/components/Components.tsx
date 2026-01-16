import type { ButtonProps } from "@mantine/core";
import { useState } from "react";

export function Corners(props:{className:string, corner:'bl'|'br'|'tl'|'tr'}) {
    return <svg className={props.className} viewBox="0 0 100 100" width="50px">
        {
            props.corner == 'bl' ? <path d="M25,98 L2,98 L2,75" fill="none" stroke="black" strokeWidth={3} />
            : props.corner == 'br' ? <path d="M75,98 L98,98 L98,75" fill="none" stroke="black" strokeWidth={3} />
            : props.corner == 'tl' ? <path d="M25,2 L2,2 L2,25" fill="none" stroke="black" strokeWidth={3} />
            : <path d="M75,2 L98,2 L98,25" fill="none" stroke="black" strokeWidth={3} />
        }
    </svg>
}


export function Button(props: React.ComponentPropsWithoutRef<"button">) {
  const [hover, setHover] = useState(false);
  const { children, className, ...rest } = props;

  return (
    <button
      {...rest}
      className={`${className ?? ""}  ${styles._}`}
      onMouseEnter={(e) => { setHover(true); props.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); props.onMouseLeave?.(e); }}
      style={{fontWeight: 'bold', textTransform: 'uppercase'}}
    >
      {children}
    </button>
  );
}

const styles = {
  _: `relative overflow-hidden px-5 py-1.5
    hover:bg-orange-300
    hover:cursor-pointer
    not-hover:bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,orange_3px,orange_6px)]
    not-hover:bg-repeat-x
    not-hover:animate-slide
    font-header 
    card capitalize
  `,
};

