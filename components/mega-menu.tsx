'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronDown,ChevronRight,Menu,X,Car,Ship,Plane,Zap,Fan,Printer,Video,Grid2X2} from 'lucide-react';
import navigation from '@/data/elefun-navigation.json';
type Node={id:string;label:string;href:string|null;children:Node[]};
const roots=navigation as Node[];
const icons=[Printer,Zap,Grid2X2,Car,Ship,Fan,Video,Plane];
function destination(n:Node):string|null{
 if(n.id==='em_m1504'||n.label==='Elektrobiler'||n.label==='Alle Elektrobiler'||n.label==='Buggy')return '#car';
 if(n.id==='em_m1503'||n.label==='Elektrobåter')return '#boat';
 if(n.id==='em_m1500'||n.label==='Droner med kamera')return '#drone';
 if(n.id==='em_m1502'||n.label==='Elektrofly'||(n.label==='Warbirds'&&n.href?.includes('kategori-267')))return '#plane';
 if(n.id==='em_m1510')return '#accessories';
 if(n.id.startsWith('em_m1510')&&n.label==='Li-Po Batterier')return '#accessories/battery';
 if(n.id.startsWith('em_m1510')&&n.label==='Ladere')return '#accessories/charger';
 if(n.id.startsWith('em_m1510')&&n.label==='Ladekabler & overganger')return '#accessories/accessory';
 return n.href;
}
function Branch({node,onNavigate}:{node:Node;onNavigate:()=>void}){const href=destination(node);return <li>{href?<a href={href} onClick={onNavigate} target={href.startsWith('#')?undefined:'_blank'} rel="noreferrer">{node.label}</a>:<span>{node.label}</span>}{node.children.length>0&&<details className="mega-subtree"><summary>Underkategorier <ChevronDown size={12}/></summary><ul>{node.children.map(n=><Branch key={n.id} node={n} onNavigate={onNavigate}/>)}</ul></details>}</li>;}
export default function MegaMenu(){const [active,setActive]=useState<string|null>(null);const [all,setAll]=useState(false);const ref=useRef<HTMLDivElement>(null);const triggers=useRef<Record<string,HTMLButtonElement|null>>({});const selected=roots.find(n=>n.id===active);
 useEffect(()=>{function close(e:PointerEvent){if(!ref.current?.contains(e.target as globalThis.Node)){setActive(null);setAll(false);}}function escape(e:KeyboardEvent){if(e.key==='Escape'){if(active)triggers.current[active]?.focus();setActive(null);setAll(false);}}document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape);};},[active]);
 const close=()=>{setActive(null);setAll(false);};return <div className="mega-navigation" ref={ref} onBlur={e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget as globalThis.Node))close();}}>
 <nav className="mega-tabs" aria-label="Elefun produktkategorier"><button className={all?'active':''} aria-expanded={all} aria-controls="all-categories" onClick={()=>{setAll(!all);setActive(null);}}><Menu size={19}/> Alle kategorier</button>{roots.slice(0,8).map((n,i)=>{const Icon=icons[i];return <button key={n.id} ref={el=>{triggers.current[n.id]=el;}} className={active===n.id?'active':''} aria-expanded={active===n.id} aria-controls="mega-panel" onClick={()=>{setActive(active===n.id?null:n.id);setAll(false);}} onMouseEnter={()=>{if(active){setActive(n.id);setAll(false);}}}><Icon size={17}/>{n.label}<ChevronDown size={12}/></button>;})}</nav>
 {all&&<div id="all-categories" className="all-categories"><h2>Alle kategorier</h2><div>{roots.map(n=><button key={n.id} onClick={()=>{if(n.children.length){setActive(n.id);setAll(false);}else if(n.href){window.open(n.href,'_blank','noopener');close();}}}>{n.label}<ChevronRight size={16}/></button>)}</div></div>}
 {selected&&<section id="mega-panel" className="mega-panel" aria-label={`${selected.label} underkategorier`}><header><h2>{selected.label}</h2><button className="icon-button" aria-label="Lukk kategorimeny" onClick={close}><X size={20}/></button></header><div className="mega-columns">{selected.children.map(n=><section key={n.id}><h3>{destination(n)?<a href={destination(n)!} onClick={close} target={destination(n)!.startsWith('#')?undefined:'_blank'} rel="noreferrer">{n.label}</a>:n.label}</h3><ul>{n.children.map(c=><Branch key={c.id} node={c} onNavigate={close}/>)}</ul></section>)}</div>{destination(selected)&&<a className="mega-view-all" href={destination(selected)!} onClick={close}>Se utvalget innen {selected.label} <ChevronRight size={18}/></a>}</section>}
 </div>;
}
