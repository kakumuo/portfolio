import { Box, Typography } from "@mantine/core";
import React from "react";
import { IconArrowDown, IconArrowUp } from "./Icons";

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
  const { children, className, ...rest } = props;

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
        tag: `border border-1 px-2 py-1 self-center hover:text-orange-700 transition cursor-pointer`, 
        input: `grow h-10 border focus:border-orange-400 outline-none px-2 rounded-sm transition`, 
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
      border focus-within:border-orange-400 outline-none rounded-sm
      transition cursor-pointer
      h-10 px-2 p-1 w-50
      grid grid-cols-[auto_1fr] grid-rows-auto gap-md 
      items-center relative
    `, 
    indicator: `text-center border px-2 aspect-1/1 rounded-sm`,
    input: `outline-none border-none p-0 peer`, 
    list: `
      absolute border w-full max-h-100 overflow-y-scroll
      grid grid-cols-1 grid-rows-auto gap-xs
      top-10 z-2 bg-white
      p-xs
      invisible opacity-0 peer-focus:visible peer-focus:opacity-100
      focus-within:visible focus-within:opacity-100
      transition-opacity duration-200
    `, 
    item: `w-full h-10 grid grid-cols-[30px_1fr] grid-rows-1 hover:bg-black/2 select-none rounded-sm items-center`, 
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
        targetOption && targetOption.asc ? <IconArrowUp />
        : targetOption && !targetOption.asc ? <IconArrowDown />
        : <Box />
      }
      <Typography>{option}</Typography>
    </Box>
  }

  const filteredOpts = React.useMemo(() => {
    if(filter == "") return props.options; 
    const regex = new RegExp(`.*${filter.trim()}`, 'i')
    return props.options.filter(o => o.toLowerCase().trim().match(regex))
  }, [filter])
    
  return <Box className={styles._} onFocus={() => null}>
    {opts.length != 0 && <Typography className={styles.indicator}>{opts.length}</Typography>}
    <input placeholder="Sort By..." onChange={(ev) => setFilter(ev.target.value.trim())} className={styles.input} />
    <Box tabIndex={0} className={styles.list}>
      {filteredOpts.map(o => createItem(o))}
    </Box>
  </Box>
}

