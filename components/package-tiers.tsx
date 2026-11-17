"use client";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cleanName, discountFor, money, productHref, shortTitle, type DefaultPackage, type TIERS } from "@/lib/store";
import { driveTime, formatMinutes } from "@/lib/flight-time";

type Tier={tier:(typeof TIERS)[number];pkg:DefaultPackage};

export default function PackageTiers({tiers,onAdd,onCustomize}:{tiers:Tier[];onAdd:(p:DefaultPackage)=>void;onCustomize:(p:DefaultPackage,tier:string)=>void}){
  const [added,setAdded]=useState<string>();
  if(!tiers.length) return null;
  return <section className="tiers" aria-labelledby="tiers-title">
    <div className="tiers-head"><h2 id="tiers-title"><span className="step-num"><span className="sr-only">Steg </span>3</span>Bygg pakken</h2></div>
    <div className="tier-grid">
      {tiers.map(({tier,pkg})=>{
        const v=pkg.vehicle;const extras=pkg.lines.slice(1);const saved=discountFor(pkg.total);const drive=v.vehicleType==="car"?driveTime(v,pkg.battery):null;
        return <article key={tier.id} className="tier tier-fpv" aria-labelledby={`tier-${tier.id}`}>
          <span className="save-flag" aria-label="15 prosent rabatt">−15 %</span>
          <header className="tier-head">
            <h3 id={`tier-${tier.id}`}>{tier.name}</h3>
            <p>{tier.purpose}</p>
          </header>
          <div className="tier-body">
            <a className="tier-media" href={productHref(v)} tabIndex={-1} aria-hidden="true">{v.imageUrl&&<img src={v.imageUrl} alt="" loading="lazy"/>}</a>
            <div>
              <a className="tier-model" href={productHref(v)}>{cleanName(v.name)}</a>
              <ul className="tier-items" aria-label="Dette er med i pakken">
                {extras.map(l=><li key={l.product.id}>{l.quantity} × {shortTitle(l.product)}</li>)}
                {pkg.includedCharger&&<li>Lader følger med modellen</li>}
                {pkg.controllerIncluded&&<li>Kontroll følger med modellen</li>}
              </ul>
            </div>
          </div>
          {drive&&<p className="tier-drive">Anslått kjøretid <strong>{formatMinutes(drive.minutes)}</strong></p>}
          <div className="tier-total">
            <p className="tier-price"><strong className="price">{money(pkg.total-saved)}</strong> hele pakken</p>
            <p className="tier-save"><s>{money(pkg.total)}</s> <span className="discount-badge">Du sparer {money(saved)}</span></p>
          </div>
          <div className="tier-actions">
            <button type="button" className="btn-buy btn-buy-full" onClick={()=>{onAdd(pkg);setAdded(tier.id);}}>
              {added===tier.id?<><Check size={18} aria-hidden/> Lagt i handlevognen</>:<><ShoppingCart size={18} aria-hidden/> Legg i handlevogn</>}
            </button>
            <button type="button" className="btn-secondary tier-customize" onClick={()=>onCustomize(pkg,tier.name)}>Tilpass pakken</button>
          </div>
        </article>;
      })}
    </div>
    <p className="tiers-note" aria-live="polite">{added?"Pakken er lagt i demo-handlevognen.":"Nivåer og 15 % pakkerabatt er forslag fra dette studentprosjektet, ikke tilbud fra Elefun. Demopriser inkl. mva."}</p>
  </section>;
}
