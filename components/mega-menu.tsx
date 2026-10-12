"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, CircleArrowRight } from "lucide-react";
import type { MegaCategory } from "@/lib/elefun-menu";
import { CategoryIcon } from "./category-icons";

function MenuAnchor({href,className,children}:{href:string;className?:string;children:React.ReactNode}){
  return href.startsWith("/")
    ?<Link href={href} className={className}>{children}</Link>
    :<a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
}

const OPEN_DELAY=120;
const CLOSE_DELAY=220;

export default function MegaMenu({categories}:{categories:MegaCategory[]}){
  const path=usePathname()??"/";
  // The panel belongs to the page it was opened on, so navigating closes it.
  const [state,setState]=useState<{id:number;path:string}|null>(null);
  const openId=state?.path===path?state.id:null;
  const setOpenId=useCallback((id:number|null)=>setState(id===null?null:{id,path}),[path]);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const navRef=useRef<HTMLElement>(null);
  const listRef=useRef<HTMLUListElement>(null);
  const [overflow,setOverflow]=useState({left:false,right:false});
  const panelId=useId();
  const open=categories.find(c=>c.id===openId);

  const schedule=useCallback((next:number|null,delay:number)=>{
    if(timer.current) clearTimeout(timer.current);
    timer.current=setTimeout(()=>setOpenId(next),delay);
  },[setOpenId]);
  const cancel=()=>{if(timer.current) clearTimeout(timer.current);};

  useEffect(()=>()=>{if(timer.current) clearTimeout(timer.current);},[]);
  useEffect(()=>{
    const list=listRef.current;
    if(!list) return;
    const measure=()=>setOverflow({left:list.scrollLeft>4,right:list.scrollLeft+list.clientWidth<list.scrollWidth-4});
    measure();
    const ro=new ResizeObserver(measure);
    ro.observe(list);
    list.addEventListener("scroll",measure,{passive:true});
    return()=>{ro.disconnect();list.removeEventListener("scroll",measure);};
  },[]);
  const scrollBar=(dir:1|-1)=>{const list=listRef.current;list?.scrollBy({left:dir*list.clientWidth*.6,behavior:"smooth"});};
  useEffect(()=>{
    if(openId===null) return;
    const onKey=(e:KeyboardEvent)=>{
      if(e.key!=="Escape") return;
      setOpenId(null);
      navRef.current?.querySelector<HTMLButtonElement>(`[data-cat="${openId}"]`)?.focus();
    };
    const onDown=(e:PointerEvent)=>{if(!navRef.current?.contains(e.target as Node)) setOpenId(null);};
    document.addEventListener("keydown",onKey);
    document.addEventListener("pointerdown",onDown);
    return()=>{document.removeEventListener("keydown",onKey);document.removeEventListener("pointerdown",onDown);};
  },[openId,setOpenId]);

  return <nav ref={navRef} className="catbar mega" aria-label="Kategorier" onPointerLeave={e=>{if(e.pointerType==="mouse") schedule(null,CLOSE_DELAY);}} onPointerEnter={cancel}>
    <div className="catbar-inner" data-left={overflow.left||undefined} data-right={overflow.right||undefined}>
      {overflow.left&&<button type="button" className="mega-scroll mega-scroll-left" aria-label="Bla til forrige kategorier" tabIndex={-1} onClick={()=>scrollBar(-1)}><ChevronLeft size={18} aria-hidden/></button>}
      <ul ref={listRef}>
        <li><Link href="/" aria-current={path==="/"?"page":undefined}>Pakkebygger</Link></li>
        <li><Link href="/sortiment" aria-current={path==="/sortiment"?"page":undefined}>Sortiment</Link></li>
        {categories.map(c=>{
          const expanded=c.id===openId;
          return <li key={c.id}>
            <button type="button" data-cat={c.id} aria-expanded={expanded} aria-controls={expanded?panelId:undefined}
              data-current={(c.local&&path.startsWith(c.local.href))||(c.internal&&(path===c.url||path.startsWith(`${c.url}/`)))?"":undefined}
              onPointerEnter={e=>{if(e.pointerType==="mouse") schedule(c.id,openId===null?OPEN_DELAY:0);}}
              onClick={()=>{cancel();setOpenId(expanded?null:c.id);}}>
              {c.name}<ChevronDown size={14} aria-hidden/>
            </button>
          </li>;
        })}
      </ul>
      {overflow.right&&<button type="button" className="mega-scroll mega-scroll-right" aria-label="Bla til flere kategorier" tabIndex={-1} onClick={()=>scrollBar(1)}><ChevronRight size={18} aria-hidden/></button>}
    </div>

    {open&&<div id={panelId} className="mega-panel" role="region" aria-label={open.name}>
      <div className="mega-inner">
        <div className="mega-grid">
          {open.columns.map(col=>{
            return <section key={col.key} className="mega-col">
              <h3>
                <CategoryIcon name={col.icon} fallback={open.icon} size={18}/>
                {col.url?<MenuAnchor href={col.url}>{col.title}</MenuAnchor>:<span>{col.title}</span>}
              </h3>
              <ul>
                {col.links.map(l=><li key={l.url}><MenuAnchor href={l.url} className={l.internal?"mega-internal":undefined}>{l.name}</MenuAnchor></li>)}
                {col.more>0&&<li><MenuAnchor className="mega-more" href={col.url??open.url}>Vis {col.more} til</MenuAnchor></li>}
              </ul>
            </section>;
          })}
        </div>
        <div className="mega-foot">
          {open.local&&<Link className="mega-local" href={open.local.href}>{open.local.label}</Link>}
          <MenuAnchor className="mega-all" href={open.url}>Se alt innen {open.name} <CircleArrowRight size={20} aria-hidden/></MenuAnchor>
        </div>
      </div>
    </div>}
  </nav>;
}
