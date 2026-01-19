import { Box, Typography } from "@mantine/core";
import React, { type ChangeEventHandler } from "react";
import { IconArrowDown, IconArrowUp, IconPalette } from "./Icons";
import { Checkbox } from "@mantine/core";
import { AppContext, type AppTheme } from "../app";

export function Corners(props:{className:string, corner:'bl'|'br'|'tl'|'tr'}) {
    return <svg className={props.className} viewBox="0 0 100 100" width="50px">
        {
            props.corner == 'bl' ? <path d="M25,98 L2,98 L2,75" fill="none" stroke="inherit" strokeWidth={3} />
            : props.corner == 'br' ? <path d="M75,98 L98,98 L98,75" fill="none" stroke="inherit" strokeWidth={3} />
            : props.corner == 'tl' ? <path d="M25,2 L2,2 L2,25" fill="none" stroke="inherit" strokeWidth={3} />
            : <path d="M75,2 L98,2 L98,25" fill="none" stroke="inherit" strokeWidth={3} />
        }
    </svg>
}


export function Button(props: React.ComponentPropsWithoutRef<"button">) {
  const { children, className, ...rest } = props;

  const styles = {
    _: `relative overflow-hidden px-5 py-1.5
      not-disabled:text-(--neutral-contrast)
      not-disabled:hover:bg-(--primary)/50
      not-disabled:hover:cursor-pointer

      not-hover:bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,var(--primary)_2px,var(--primary)_10px)]
      not-hover:bg-repeat-x
      not-hover:animate-slide

      disabled:hover:cursor-not-allowed
      disabled:bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,var(--neutral-accent)_2px,var(--neutral-accent)_10px)]
      disabled:bg-repeat-x
      disabled:animate-slide

      font-header 
      card capitalize
    `,
  };

  return (
    <button
      {...rest}
      className={`${className ?? ""}  ${styles._}`}
      style={{fontWeight: 'bold', textTransform: 'uppercase'}}
    >
      {children}
    </button>
  );
}


export function SearchBar(props:{sortOptions:string[], setFilters?:(filters:string[])=>void, setSort?:(options:SortOption[])=>void}) {
    const [filters, setFilters] = React.useState([] as string[]); 
    const inputRef = React.useRef<HTMLInputElement>(null!); 
    
    const handleRemoveFilter = (filter:string) => {
        setFilters(prev => prev.filter(f => f != filter))
    }

    const handleEnter = (ev:React.KeyboardEvent) => {
        if(ev.key == "Enter" && inputRef.current && inputRef.current.value.trim() != "") {
            const tmp = inputRef.current.value.trim()
            setFilters(prev => [tmp, ...prev]); 
            inputRef.current.value = ""; 
        }
    }

    React.useEffect(() => {
        props.setFilters && props.setFilters(filters); 
    }, [filters])

    const styles = {
        _: ``, 
        header: `flex gap-md items-center`, 
        footer: `flex gap-sm h-10 font-label text-[.75em]`, 
        tag: `border border-1 px-2 py-1 self-center hover:text-(--tertiary) hover:border-(--tertiary) transition cursor-pointer`, 
        input: `grow h-10 border focus:border-(--tertiary) outline-none px-2 rounded-sm transition`, 
    }

    return <Box className={styles._}>
            <Box className={styles.header}>
                <input className={styles.input} ref={inputRef} onKeyDown={handleEnter} />
                <SortDropdown options={props.sortOptions} setSort={props.setSort}  />
            </Box>
            <Box className={styles.footer}>
                {filters.map(f => <Typography onClick={() => handleRemoveFilter(f)} className={styles.tag} key={f}>{f}</Typography>)}
            </Box>
        </Box>
}; 


export type SortOption = {
  label:string, 
  asc:boolean
}
export function SortDropdown(props:{options:string[], setSort?:(options:SortOption[])=>void }){
  const [opts, setOpts] = React.useState([] as SortOption[])
  const [filter, setFilter] = React.useState(""); 

  const handleSelectOpt = (opt:string) => {
    let tmp = [...opts]; 
    const targetOptI = tmp.findIndex(o => o.label == opt)
    if(targetOptI == -1) {
      tmp.push({label: opt, asc: true})
    }else if (tmp[targetOptI].asc) {
      tmp[targetOptI].asc = false; 
    }else if (!tmp[targetOptI].asc) {
      tmp = tmp.filter((_, i) => i !- targetOptI); 
    }
    setOpts(tmp); 
  }

  React.useEffect(() => {
    props.setSort && props.setSort(opts)
  }, [opts])

  const styles = {
    _: `
      border focus-within:border-(--tertiary) outline-none rounded-sm
      transition cursor-pointer
      h-10 px-2 p-1 w-50
      grid grid-cols-[auto_1fr] grid-rows-auto gap-md 
      items-center relative
    `, 
    icon: `fill-(--secondary)`, 
    indicator: `text-center border px-2 aspect-1/1 rounded-sm text-(--secondary) border-(--secondary)`,
    input: `outline-none border-none p-0 peer`, 
    list: `
      absolute border w-full max-h-100 overflow-y-scroll
      grid grid-cols-1 grid-rows-auto gap-xs
      top-10 z-3 bg-(--neutral)
      p-xs
      invisible opacity-0 peer-focus:visible peer-focus:opacity-100
      focus-within:visible focus-within:opacity-100
      transition-opacity duration-200
    `, 
    item: `w-full h-10 grid grid-cols-[30px_1fr] grid-rows-1 hover:bg-(--neutral-contrast)/10 select-none rounded-sm items-center`, 
  }


  const createItem = (option:string) => {
    let targetOption = null; 
    for(const o of opts) {
      if(o.label == option){
        targetOption = o; 
        break; 
      }; 
    }


    return <Box className={styles.item} key={option} onClick={() => handleSelectOpt(option)}>
      {
        targetOption && targetOption.asc ? <IconArrowUp className={styles.icon} />
        : targetOption && !targetOption.asc ? <IconArrowDown className={styles.icon} />
        : <Box />
      }
      <Typography>{option}</Typography>
    </Box>
  }

  const filteredOpts = React.useMemo(() => {
    if(filter == "") return props.options; 
    const regex = new RegExp(`.*${filter.trim()}`, 'i')
    return props.options.filter(o => o.toLowerCase().trim().match(regex))
  }, [filter]); 
    
  return <Box className={styles._} onFocus={() => null}>
    {opts.length != 0 && <Typography className={styles.indicator}>{opts.length}</Typography>}
    <input placeholder="Sort By..." onChange={(ev) => setFilter(ev.target.value.trim())} className={styles.input} />
    <Box tabIndex={0} className={styles.list}>
      {filteredOpts.map(o => createItem(o))}
    </Box>
  </Box>
}



export const ProgressBar = ({durationMS, pause, ...props}:React.ComponentPropsWithoutRef<'div'> & {durationMS:number, pause?:boolean}) => {
  const progressRef = React.useRef<HTMLSpanElement>(null!); 

  return <Box {...props}>
      <span 
        ref={progressRef}
        className='h-full bg-black' 
        style={{
          // background: 'linear-gradient(to right, black 0%, transparent 0%)', 
          animationName: 'fillBar', 
          animationDuration: `${durationMS / 1000}s`, 
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite', 
          animationFillMode: 'forwards',
          animationPlayState: pause ? 'paused' : 'running', 
        }}
      />
    </Box>
}


type ThemeType = {
  label:string, 
  themeClass:string, 
  fontFace: string, 
}

const themes:ThemeType[] = [
  {label: "Vaporwave", themeClass: 'vaporwave', fontFace: 'font-[Inter]'},
  {label: "Ocean", themeClass: 'ocean', fontFace: 'font-[Open_Sans] '},
]
export function ThemePicker({className, ...props}:React.ComponentPropsWithoutRef<'div'>){
  const ref = React.useRef<HTMLDivElement>(null!)
  const checkRef = React.useRef<HTMLInputElement>(null!); 
  const {theme, setTheme} = React.useContext(AppContext);
  const [dark, setDark] = React.useState(theme.isDark);  
  const [tmpTheme, setTmpTheme] = React.useState(theme)

  const handleMouseEnter = () => {
    if(ref.current) {
      ref.current.focus(); 
    }
  }

  const themeItemHandlers = {
    onMouseEnter: (t:AppTheme) => {setTmpTheme(theme); setTheme(t)}, 
    onMouseLeave: () => {setTheme(tmpTheme)}, 
    onClick:      (t:AppTheme) => {
      console.log(t); setTheme(t); setTmpTheme(t);
      ref.current.blur(); 
    }
  }

  const handleDark = (ev:React.ChangeEvent<HTMLInputElement>) => {
    const curDark = ev.currentTarget.checked; 
    const curTheme = {...theme}; 
    curTheme.isDark = curDark; 
    setDark(curDark)
    setTheme(curTheme)
    setTmpTheme(curTheme); 
  }

  const styles = {
    root: `
      relative group/themepicker
    `,
    _: `
      absolute top-full -translate-x-1/2 left-1/2
      border border-(--neutral-accent) bg-(--neutral)/90
      transition
      w-100 p-sm
      flex flex-col gap-sm max-w-50

      opacity-0 invisible
      group-hover/themepicker:opacity-100 group-hover/themepicker:visible
      
      hover:opacity-100 hover:visible
      focus:opacity-100 focus:visible
      z-10
    `,
    header: {
      _: `flex justify-between gap-sm`,
      $: `first:font-subtext`,
    },
    list: `flex flex-col`,
  }

  return <Box className={className + " " + styles.root}  {...props} onMouseEnter={handleMouseEnter}>
    <Typography className="w-7 h-auto fill-(--neutral-contrast)"><IconPalette /></Typography>
    
    <Box tabIndex={1} ref={ref} className={styles._} onMouseEnter={(ev) => ev.currentTarget.blur()}>

      <Box className={styles.header._}>
        <Typography className={styles.header.$}>Dark?</Typography>
        <Checkbox checked={dark} onChange={handleDark} ref={checkRef} className={styles.header.$} />
      </Box>

      <Box className={styles.list} >
        {themes.map(t => <ThemeItem isDark={dark} key={t.label} {...t} {...themeItemHandlers} />)}
      </Box>

    </Box>
  </Box>
}


function ThemeItem(
  {label, themeClass, fontFace, onClick, onMouseEnter, onMouseLeave, isDark}
  :ThemeType & {isDark:boolean, onClick?:(t:AppTheme)=>void, onMouseEnter?:(t:AppTheme)=>void, onMouseLeave?:()=>void}
){
  const styles = {
    _: `relative grid grid-cols-1 grid-rows-[1fr_auto] p-xs transition group/themeitem hover:cursor-pointer`, 
    label: `font-subtitle text-center`, 
    corners: `
        absolute w-full h-full top-0 left-0
        transition duration-300 ease-in-out
        -z-12
        bg-black/4 opacity-0
        group-hover/themeitem:opacity-100
      `,
    colorSet: {
      _: `flex h-2 `, 
      $: `h-full w-full border grow first:rounded-l-full last:rounded-r-full`, 
    }
  }

  return <Box className={styles._} 
      onClick={() => onClick && onClick({themeClass: themeClass, isDark: isDark})} 
      onMouseEnter={() => onMouseEnter && onMouseEnter({themeClass: themeClass, isDark: isDark})} 
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
    >
    <Box className={styles.corners}>
      <Corners className="absolute top-0 left-0 stroke-(--secondary)" corner="tl" />
      <Corners className="absolute bottom-0 right-0 stroke-(--secondary)" corner="br" />
    </Box>
    <Typography className={styles.label + ` ${fontFace}`}>{label}</Typography>
    <Box className={styles.colorSet._}>
      {/* <Box className={styles.colorSet.$ + ` ${themeClass} bg-(--neutral) border-(--neutral)`}/> */}
      <Box className={styles.colorSet.$ + ` ${themeClass}-${isDark ? 'dark' : 'light'} bg-(--neutral-accent) border-(--neutral-accent)`}/>
      <Box className={styles.colorSet.$ + ` ${themeClass}-${isDark ? 'dark' : 'light'} bg-(--neutral-contrast) border-(--neutral-contrast)`}/>
      <Box className={styles.colorSet.$ + ` ${themeClass}-${isDark ? 'dark' : 'light'} bg-(--primary) border-(--primary)`}/>
      <Box className={styles.colorSet.$ + ` ${themeClass}-${isDark ? 'dark' : 'light'} bg-(--secondary) border-(--secondary)`}/>
      <Box className={styles.colorSet.$ + ` ${themeClass}-${isDark ? 'dark' : 'light'} bg-(--tertiary) border-(--tertiary)`}/>
    </Box>
  </Box>
}
