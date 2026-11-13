"use client";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-types";
import { flightComparison, flightTime, formatMinutes } from "@/lib/flight-time";
import { rules } from "@/lib/compatibility";
import { cleanName, discountFor, money, productHref, shortTitle, type DefaultPackage, type FpvPackage } from "@/lib/store";
import FlightTimeBar from "./flight-time-bar";

/** The three main FPV packages: Whoop, Freestyle and Longrange. Same layout and 15 % package discount as the other categories. */
export default function FpvPackages({packages,products,onAdd,onCustomize}:{packages:FpvPackage[];products:CatalogProduct[];onAdd:(p:DefaultPackage)=>void;onCustomize:(p:DefaultPackage,tier:string)=>void}){
  const [added,setAdded]=useState<string>();
  if(!packages.length) return null;
  const batteryFor=(d:CatalogProduct)=>products.find(p=>p.id===rules[d.id]?.batteryIds[0]);
  return <section className="tiers" aria-labelledby="tiers-title">
    <div className="tiers-head"><h2 id="tiers-title"><span className="step-num"><span className="sr-only">Steg </span>3</span>Velg pakke</h2></div>
    <div className="tier-grid">
      {packages.map(({cls,pkg,count})=>{
        const v=pkg.vehicle;const saved=discountFor(pkg.total);const flight=flightTime(v,pkg.battery);
        const rows=flightComparison(products,{droneId:v.id,battery:pkg.battery},batteryFor);
        const parts=pkg.lines.slice(1);
        return <article key={cls.id} className="tier tier-fpv" aria-labelledby={`fpv-${cls.id}`}>
          <span className="save-flag" aria-label="15 prosent rabatt">−15 %</span>
          <header className="tier-head"><h3 id={`fpv-${cls.id}`}>{cls.label}</h3><p>{count>1?`${count} droner å velge mellom`:"1 drone"}</p></header>
          <p className="tier-blurb">{cls.blurb}</p>
          <div className="tier-body">
            <a className="tier-media" href={productHref(v)} tabIndex={-1} aria-hidden="true">{v.imageUrl&&<img src={v.imageUrl} alt="" loading="lazy"/>}</a>
            <div>
              <a className="tier-model" href={productHref(v)}>{cleanName(v.name)}</a>
              <ul className="tier-items" aria-label="Dette er med i pakken">
                {parts.map(l=><li key={l.product.id}>{l.quantity} × {shortTitle(l.product)}</li>)}
                {pkg.includedCharger&&<li>Lader følger med dronen</li>}
                {rules[v.id]?.includedBattery&&<li>Batteri følger med: {rules[v.id]!.includedBattery}</li>}
              </ul>
            </div>
          </div>
          {flight?<p className="tier-flight"><strong>{formatMinutes(flight.minutes)}</strong> flytid{flight.basis==="stated"?" (oppgitt av Elefun)":" (regnet ut)"}</p>
            :<p className="tier-flight tier-flight-none">Flytid er ikke beregnet. Vekt er ikke dokumentert.</p>}
          {rows.length>1&&<FlightTimeBar rows={rows} compact/>}
          {pkg.evaluation.status==="CONDITIONAL"&&<p className="tier-caveat">Passer med forbehold. Se hva som må sjekkes under «Tilpass pakken».</p>}
          <div className="tier-total">
            <p className="tier-price"><strong className="price">{money(pkg.total-saved)}</strong> hele pakken</p>
            <p className="tier-save"><s>{money(pkg.total)}</s> <span className="discount-badge">Du sparer {money(saved)}</span></p>
          </div>
          <div className="tier-actions">
            <button type="button" className="btn-buy btn-buy-full" onClick={()=>{onAdd(pkg);setAdded(cls.id);}}>
              {added===cls.id?<><Check size={18} aria-hidden/> Lagt i handlevognen</>:<><ShoppingCart size={18} aria-hidden/> Legg i handlevogn</>}
            </button>
            <button type="button" className="btn-secondary tier-customize" onClick={()=>onCustomize(pkg,cls.label)}>Tilpass pakken</button>
          </div>
        </article>;
      })}
    </div>
    <p className="tiers-note" aria-live="polite">{added?"Pakken er lagt i demo-handlevognen.":"15 % pakkerabatt er et forslag fra dette studentprosjektet, ikke et tilbud fra Elefun. Prisene er øyeblikksbilder fra elefun.no. Flytid er et anslag."}</p>
  </section>;
}
