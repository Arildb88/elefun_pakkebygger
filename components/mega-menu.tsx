"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, BadgePercent, Battery, BatteryFull, Blocks, BookOpen, Bot, Box, Boxes, Briefcase, Camera, Car, CarFront, Cctv, ChevronDown, ChevronLeft, ChevronRight,
  CircleArrowRight, CircleDot, CloudSun, Cog, Container, Disc, Drill, Drone, Droplet, Eye, Fan, Fish, Flag, Flame, FlameKindling, Forklift, Fuel, Gauge,
  Gem, Glasses, Hammer, HardDrive, Heart, Helicopter, House, Lightbulb, Magnet, Mic, Package, PaintBucket, Paintbrush, Pipette, Plane, Plug, PlugZap,
  Printer, Puzzle, Radar, Radio, Rocket, Route, Sailboat, SatelliteDish, ScanLine, Scooter, Send, Server, Shield, ShieldCheck, Ship, Shirt, Sun,
  Target, ThumbsUp, Train, TrainTrack, Trees, Truck, Usb, Video, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import type { MegaCategory } from "@/lib/elefun-menu";

/** Elefun tags categories with Font Awesome names; these are the closest Lucide shapes. */
const ICONS:Record<string,LucideIcon>={
  "3dprint":Printer,"print":Printer,"scanner-gun":ScanLine,"bore-hole":Drill,"lazer":Zap,"compact-disc":Disc,"bottle-water":Droplet,
  "bolt":Zap,"battery-full":BatteryFull,"car-battery":Battery,"charging-station":PlugZap,"plug":Plug,"plug-circle-bolt":PlugZap,"shield-check":ShieldCheck,
  "fire-extinguisher":Flame,"dumpster-fire":FlameKindling,"smoke":CloudSun,"car-tilt":CarFront,"road":Route,"truck-monster":Truck,"car-side":Car,
  "forklift":Forklift,"truck-moving":Container,"tank":Shield,"boat":Ship,"ship":Ship,"sailboat":Sailboat,"fishing-rod":Fish,"drone":Drone,
  "drone-front":Drone,"dji":Drone,"suitcase":Briefcase,"briefcase":Briefcase,"inbox-in":Box,"sun-cloud":CloudSun,"propeller":Fan,"propeller3":Fan,
  "plane":Plane,"paper-plane":Send,"paper-plane-top":Send,"helicopter":Helicopter,"helicopter-symbol":Helicopter,"lightbulb-on":Lightbulb,
  "user-pilot":Glasses,"head-side-goggles":Glasses,"desktop":Gauge,"video":Video,"camera-security":Camera,"camera-cctv":Cctv,"microphone":Mic,
  "sd-card":HardDrive,"usb-drive":Usb,"satellite-dish":SatelliteDish,"block-brick":Blocks,"warhammer":Hammer,"tree-christmas":Trees,
  "eye-dropper":Pipette,"fill-drip":PaintBucket,"square-heart":Heart,"train":Train,"train-track":TrainTrack,"traincar":Train,"house":House,
  "trees":Trees,"gear":Cog,"gears":Cog,"engine":Cog,"servo":Activity,"explosion":Flame,"parachute-box":Package,"gauge-high":Gauge,"boxes-packing":Boxes,
  "server":Server,"screwdriver":Wrench,"screwdriver-wrench":Wrench,"flag-checkered":Flag,"skate":Scooter,"scooter":Scooter,"thumbs-up":ThumbsUp,
  "sun":Sun,"solar-panel":Sun,"bullseye-arrow":Target,"flying-disc":CircleDot,"magnet":Magnet,"detector":Radar,"raspberry-pi":Puzzle,"robot":Bot,
  "vacuum-robot":Bot,"glasses":Glasses,"walkie-talkie":Radio,"gas-pump":Fuel,"bearing":CircleDot,"spray-can":Paintbrush,"bottle-droplet":Droplet,
  "pallet":Boxes,"oil-can":Droplet,"book":BookOpen,"shirt":Shirt,"badge-percent":BadgePercent,"rocket":Rocket,"rocket-launch":Rocket,"sensor-on":Eye,
  "ribbon":Gem,
};
const iconFor=(name?:string,fallback?:string)=>ICONS[name??""]??ICONS[fallback??""]??Box;

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
        {categories.map(c=>{
          const expanded=c.id===openId;
          return <li key={c.id}>
            <button type="button" data-cat={c.id} aria-expanded={expanded} aria-controls={expanded?panelId:undefined}
              data-current={c.local&&path.startsWith(c.local.href)?"":undefined}
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
            const Icon=iconFor(col.icon,open.icon);
            return <section key={col.key} className="mega-col">
              <h3>
                <Icon size={18} aria-hidden/>
                {col.url?<a href={col.url} target="_blank" rel="noreferrer">{col.title}</a>:<span>{col.title}</span>}
              </h3>
              <ul>
                {col.links.map(l=><li key={l.url}><a href={l.url} target="_blank" rel="noreferrer">{l.name}</a></li>)}
                {col.more>0&&<li><a className="mega-more" href={col.url??open.url} target="_blank" rel="noreferrer">Vis {col.more} til</a></li>}
              </ul>
            </section>;
          })}
        </div>
        <div className="mega-foot">
          {open.local&&<Link className="mega-local" href={open.local.href}>{open.local.label}</Link>}
          <a className="mega-all" href={open.url} target="_blank" rel="noreferrer">Se alt innen {open.name} <CircleArrowRight size={20} aria-hidden/></a>
        </div>
      </div>
    </div>}
  </nav>;
}
