"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, CircleArrowRight } from "lucide-react";
import type { MenuCategory } from "@/lib/site-menu";
import { CategoryIcon } from "./category-icons";

const OPEN_DELAY=120;
const CLOSE_DELAY=220;

export default function MegaMenu({categories}:{categories:MenuCategory[]}){
  const path=usePathname()??"/";
  // The panel belongs to the page it was opened on, so navigating closes it.
  const [state,setState]=useState<{id:string;path:string}|null>(null);
  const openId=state?.path===path?state.id:null;
  const setOpenId=useCallback((id:string|null)=>setState(id===null?null:{id,path}),[path]);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const navRef=useRef<HTMLElement>(null);
  const listRef=useRef<HTMLUListElement>(null);
  const [overflow,setOverflow]=useState({left:false,right:false});
  const panelId=useId();
  const open=categories.find(c=>c.slug===openId);

  const schedule=useCallback((next:string|null,delay:number)=>{
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
        {categories.map(c=>{
          const current=path===c.href;
          if(!c.columns.length) return <li key={c.slug}>
            <Link href={c.href} aria-current={current?"page":undefined} onPointerEnter={e=>{if(e.pointerType==="mouse") schedule(null,CLOSE_DELAY);}}>{c.name}</Link>
          </li>;
          const expanded=c.slug===openId;
          return <li key={c.slug}>
            <button type="button" data-cat={c.slug} aria-expanded={expanded} aria-controls={expanded?panelId:undefined}
              data-current={current?"":undefined}
              onPointerEnter={e=>{if(e.pointerType==="mouse") schedule(c.slug,openId===null?OPEN_DELAY:0);}}
              onClick={()=>{cancel();setOpenId(expanded?null:c.slug);}}>
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
          {open.columns.map(col=><section key={col.title} className="mega-col">
            <h3><CategoryIcon name={col.icon} size={18}/><span>{col.title}</span></h3>
            <ul>{col.links.map(l=><li key={l.href}><Link href={l.href}>{l.name}</Link></li>)}</ul>
          </section>)}
        </div>
        <div className="mega-foot">
          <Link className="mega-all" href={open.href}>Se alt innen {open.name} <CircleArrowRight size={20} aria-hidden/></Link>
        </div>
      </div>
    </div>}
  </nav>;
}
