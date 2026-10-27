"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { money } from "@/lib/store";

export type PackageOption={key:string;title:string;facts:string;price:number;priceLabel?:string;disabled?:boolean;reason?:string;group?:string};

/** Price shown relative to the current choice: "+400 kr", "−320 kr". */
export function priceDelta(diff:number){
  if(diff===0) return "Samme pris";
  return `${diff>0?"+":"−"}${money(Math.abs(diff))}`;
}

export default function PackageSelect({label,icon,options,value,onChange,quantity=1}:{label:string;icon:ReactNode;options:PackageOption[];value:string;onChange:(key:string)=>void;quantity?:number}){
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(value);
  const root=useRef<HTMLDivElement>(null);const list=useRef<HTMLUListElement>(null);const trigger=useRef<HTMLButtonElement>(null);
  const id=useId();
  const current=options.find(o=>o.key===value)??options[0];
  const enabled=options.filter(o=>!o.disabled);

  useEffect(()=>{
    if(!open) return;
    list.current?.focus();
    const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
    document.addEventListener("pointerdown",outside);
    return()=>document.removeEventListener("pointerdown",outside);
  },[open]);
  useEffect(()=>{if(open)document.getElementById(`${id}-${active}`)?.scrollIntoView({block:"nearest"});},[open,active,id]);

  function show(){setActive(value);setOpen(true);}
  function close(refocus=true){setOpen(false);if(refocus)trigger.current?.focus();}
  function choose(key:string){onChange(key);close();}
  function move(step:number){
    const i=enabled.findIndex(o=>o.key===active);
    setActive(enabled[(i+step+enabled.length)%enabled.length].key);
  }
  function onListKey(e:KeyboardEvent){
    if(e.key==="ArrowDown"){e.preventDefault();move(1);}
    else if(e.key==="ArrowUp"){e.preventDefault();move(-1);}
    else if(e.key==="Home"){e.preventDefault();setActive(enabled[0].key);}
    else if(e.key==="End"){e.preventDefault();setActive(enabled[enabled.length-1].key);}
    else if(e.key==="Enter"||e.key===" "){e.preventDefault();choose(active);}
    // Keep Escape from also closing the surrounding dialog.
    else if(e.key==="Escape"){e.preventDefault();e.stopPropagation();close();}
    else if(e.key==="Tab") close(false);
  }

  return <div className="psel" ref={root}>
    <span className="psel-label" id={`${id}-label`}>{label}</span>
    <button ref={trigger} type="button" className="psel-trigger" aria-haspopup="listbox" aria-expanded={open} aria-labelledby={`${id}-label ${id}-value`} onClick={()=>open?close():show()} onKeyDown={e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();show();}}}>
      <span className="psel-icon" aria-hidden>{icon}</span>
      <span className="psel-value" id={`${id}-value`}>
        <strong>{current.title}{quantity>1&&<span className="psel-qty"> × {quantity}</span>}</strong>
        <small>{current.facts}</small>
      </span>
      <span className="price psel-price">{current.priceLabel??money(current.price*quantity)}</span>
      <ChevronDown className="psel-chevron" size={20} aria-hidden/>
    </button>
    {open&&<ul ref={list} className="psel-list" role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`} aria-activedescendant={`${id}-${active}`} onKeyDown={onListKey}>
      {options.map((o,i)=>{
        const header=o.group&&o.group!==options[i-1]?.group?<li role="presentation" className="psel-group" key={`g-${o.group}`}>{o.group}</li>:null;
        const selected=o.key===value;const diff=(o.price-current.price)*quantity;
        return [header,<li key={o.key} id={`${id}-${o.key}`} role="option" aria-selected={selected} aria-disabled={o.disabled||undefined} className={`psel-option${o.key===active?" is-active":""}`} onPointerEnter={()=>!o.disabled&&setActive(o.key)} onClick={()=>!o.disabled&&choose(o.key)}>
          <span className="psel-option-text"><strong>{o.title}</strong><small>{o.disabled&&o.reason&&!o.group?o.reason:o.facts}</small></span>
          <span className={`psel-delta${diff<0?" is-less":""}`}>{selected?<><Check size={16} aria-hidden/> Valgt</>:priceDelta(diff)}</span>
        </li>];
      })}
    </ul>}
  </div>;
}
