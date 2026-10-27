"use client";
import { useState } from "react";
import { Check, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { cleanName, discountFor, money, productHref, shortTitle, type DefaultPackage, type TIERS } from "@/lib/store";
import { reviewsFor } from "@/lib/reviews";
import { RatingBadge } from "./reviews";

type Tier={tier:(typeof TIERS)[number];pkg:DefaultPackage};

function Level({level}:{level:number}){
  return <span className="tier-level" aria-label={`Prisnivå ${level} av 3`} role="img">{"$".repeat(level)}</span>;
}

export default function PackageTiers({tiers,onAdd,onCustomize}:{tiers:Tier[];onAdd:(p:DefaultPackage)=>void;onCustomize:(p:DefaultPackage,tier:string)=>void}){
  const [added,setAdded]=useState<string>();
  if(!tiers.length) return null;
  return <section className="tiers" aria-labelledby="tiers-title">
    <div className="tiers-head">
      <h2 id="tiers-title">Ferdige pakker</h2>
      <p>Usikker på hva du trenger? Velg en ferdig pakke. Modell, batteri, lader og kabler er satt sammen og passer sammen.</p>
    </div>
    <div className="tier-grid">
      {tiers.map(({tier,pkg})=>{
        const v=pkg.vehicle;const extras=pkg.lines.slice(1);const reviews=reviewsFor(v.id);
        return <article key={tier.id} className={`tier tier-${tier.id}`} aria-labelledby={`tier-${tier.id}`}>
          <header className="tier-head">
            <h3 id={`tier-${tier.id}`}>{tier.name} <Level level={tier.level}/></h3>
            <p>{tier.blurb}</p>
          </header>
          <a className="tier-media" href={productHref(v)} tabIndex={-1} aria-hidden="true">{v.imageUrl&&<img src={v.imageUrl} alt="" loading="lazy"/>}</a>
          <a className="tier-model" href={productHref(v)}>{cleanName(v.name)}</a>
          {reviews&&<div className="tier-rating"><RatingBadge data={reviews} href={`${productHref(v)}#anmeldelser`}/></div>}
          <ul className="tier-items" aria-label="Dette er med i pakken">
            {extras.map(l=><li key={l.product.id}><Check size={16} aria-hidden/><span>{l.quantity} × {shortTitle(l.product)}</span></li>)}
            {pkg.includedCharger&&<li><Check size={16} aria-hidden/><span>Lader følger med modellen</span></li>}
            {pkg.controllerIncluded&&<li><Check size={16} aria-hidden/><span>Kontroll følger med modellen</span></li>}
          </ul>
          <div className="tier-total">
            <span>Hele pakken <span className="discount-badge">−15 %</span></span>
            <span className="tier-price"><s className="price">{money(pkg.total)}</s><strong className="price">{money(pkg.total-discountFor(pkg.total))}</strong></span>
          </div>
          <p className="tier-save">Du sparer {money(discountFor(pkg.total))} når du kjøper pakken slik den er.</p>
          <div className="tier-actions">
            <button type="button" className="btn-buy btn-buy-full" onClick={()=>{onAdd(pkg);setAdded(tier.id);}}>
              {added===tier.id?<><Check size={18} aria-hidden/> Lagt i handlevognen</>:<><ShoppingCart size={18} aria-hidden/> Legg pakken i handlevogn</>}
            </button>
            <button type="button" className="btn-secondary tier-customize" onClick={()=>onCustomize(pkg,tier.name)}><SlidersHorizontal size={17} aria-hidden/> Tilpass pakken</button>
          </div>
        </article>;
      })}
    </div>
    <p className="tiers-note" aria-live="polite">{added?"Pakken er lagt i demo-handlevognen.":"Nivåene er sortert etter totalpris i kategorien. Pakkerabatten på 15 % gjelder bare uendrede ferdigpakker, og er et forslag i dette studentprosjektet, ikke et tilbud fra Elefun. Demopriser inkl. mva."}</p>
  </section>;
}
