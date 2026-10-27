"use client";
import { useEffect, useRef, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog-types";
import { batteryReasons, chargingReasons, controllerIdsFor, defaultControllerKey, evaluateCarPackage, packageLines, rules } from "@/lib/compatibility";
import { readCart, writeCart, type SavedPackage } from "@/lib/cart";
import { batteryVolts, cleanName, discountFor, discountLine, money, optionFacts, productHref, shortTitle, specsFor, tierPackages, type DefaultPackage } from "@/lib/store";
import PackageSelect, { type PackageOption } from "@/components/package-select";
import PackageTiers from "@/components/package-tiers";
import { ProductCard, SpecRail } from "@/components/store-ui";
import { ArrowDown, ArrowRight, ArrowUpRight, BatteryCharging, CircleAlert, Gamepad2, PackageCheck, Search, ShoppingCart, X, Zap } from "lucide-react";
const categories=[['car','Elektrobiler'],['boat','Elektrobåter'],['drone','Droner med kamera'],['plane','Elektrofly']] as const;
export default function Configurator({products}:{products:CatalogProduct[]}){
 const [category,setCategory]=useState('car');const [experience,setExperience]=useState<'beginner'|'experienced'>('beginner');const [query,setQuery]=useState('');const [sort,setSort]=useState('default');
 const [vehicleId,setVehicleId]=useState<string>();const [batteryId,setBatteryId]=useState<string>();const [chargerId,setChargerId]=useState<string>();const [batterySets,setBatterySets]=useState(1);const [controllerKey,setControllerKey]=useState('none');
 // The ready-made package the builder was opened from. The discount only holds while nothing is changed.
 const [origin,setOrigin]=useState<{vehicleId:string;batteryId?:string;chargerId?:string;controllerKey:string;tier:string}|null>(null);
 const [cart,setCart]=useState<SavedPackage[]>([]);const [cartOpen,setCartOpen]=useState(false);const [notice,setNotice]=useState('');
 const dialog=useRef<HTMLDialogElement>(null);const cartDialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{setCart(readCart());
 const route=()=>{const c=location.hash.slice(1);if(categories.some(([id])=>id===c)||c==='accessories'){setCategory(c);setQuery('');}if(c==='cart')setCartOpen(true);};
 const click=(e:MouseEvent)=>{if((e.target as Element).closest('a[href$="#cart"]')){e.preventDefault();setCartOpen(true);}};
 const sync=(e:Event)=>{if(typeof (e as CustomEvent).detail==='number')setCart(readCart());};
 route();
 // Deep link from product and category pages: /?modell=<id>#<type> opens the builder for that model.
 const model=new URLSearchParams(location.search).get('modell');const v=products.find(p=>p.id===model&&p.kind==='vehicle');
 if(v){setCategory(v.vehicleType??'car');choose(v);history.replaceState(null,'',`/#${v.vehicleType}`);}
 window.addEventListener('hashchange',route);document.addEventListener('click',click);window.addEventListener('elefun-cart',sync);
 return()=>{window.removeEventListener('hashchange',route);document.removeEventListener('click',click);window.removeEventListener('elefun-cart',sync);};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{if(vehicleId)dialog.current?.showModal();else dialog.current?.close();},[vehicleId]);
 useEffect(()=>{if(cartOpen)cartDialog.current?.showModal();else cartDialog.current?.close();},[cartOpen]);
 function saveCart(next:SavedPackage[]){setCart(next);writeCart(next);}
 const vehicle=products.find(p=>p.id===vehicleId);const rule=vehicle?rules[vehicle.id]:undefined;
 const battery=products.find(p=>p.id===batteryId);const charger=products.find(p=>p.id===chargerId);
 const ctrl=rule?.controller;const controllerIds=controllerIdsFor(rule,controllerKey);
 const lines=vehicle?packageLines(products,vehicle,battery,charger,{sets:batterySets,controllerIds}):[];const total=lines.reduce((s,l)=>s+l.quantity*l.product.price,0);
 const compatibility=vehicle?.vehicleType==='car'?evaluateCarPackage(vehicle,battery,charger,controllerIds):undefined;
 const radioCaveat=compatibility?.status==='conditional'?compatibility.reasons.find(r=>/sender|mottaker|radio/i.test(r)):undefined;
 const radioBlockers=compatibility?.status==='incompatible'?compatibility.reasons.filter(r=>/sender|mottaker|radio/i.test(r)):[];
 const reasons=vehicle?[...chargingReasons(vehicle,battery,charger),...radioBlockers]:[];
 const blocked=reasons.length>0||compatibility?.status==='unknown'||compatibility?.status==='incompatible';
 const documented=vehicle&&rule?rule.batteryIds.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p):[];
 const volts=documented[0]?batteryVolts(documented[0]):null;
 // Other batteries at the same voltage stay visible with their price difference, but cannot be chosen.
 const others=vehicle&&volts?products.filter(p=>p.kind==='battery'&&!rule?.batteryIds.includes(p.id)&&batteryVolts(p)===volts):[];
 // Each documented battery comes as one set or two sets (an extra set for double run time). Prices are for the whole choice.
 const n=vehicle?.batteryCount??1;const count=(sets:number)=>n*sets>1?`${n*sets} × `:'';
 const batteryOptions:PackageOption[]=vehicle?[...documented.flatMap(b=>[1,2].map(sets=>({key:`${b.id}:${sets}`,title:`${count(sets)}${shortTitle(b)}`,facts:sets>1?`Ekstra sett, dobbel kjøretid · ${optionFacts(b)}`:optionFacts(b),price:b.price*n*sets,disabled:batteryReasons(vehicle,b).length>0,reason:batteryReasons(vehicle,b)[0]}))).sort((a,b)=>a.price-b.price),...others.sort((a,b)=>a.price-b.price).map(b=>({key:b.id,title:`${count(1)}${shortTitle(b)}`,facts:optionFacts(b),price:b.price*n,disabled:true,reason:'Ikke dokumentert for denne modellen',group:'Samme spenning, ikke dokumentert for modellen'}))]:[];
 const setOption=(ids:string[],i:number):PackageOption=>{const items=ids.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p);return {key:String(i),title:items.map(p=>cleanName(p.name)).join(' + '),facts:[...specsFor(items[0]).slice(1),...(items.length>1?['med mottaker']:[])].join(' · '),price:items.reduce((s,p)=>s+p.price,0)};};
 const noneOption:PackageOption[]=ctrl?.included?[{key:'none',title:ctrl.unconfirmed?'Medfølgende radio (ikke bekreftet)':'Radio som følger med',facts:ctrl.included,price:0,priceLabel:ctrl.unconfirmed?'–':'Inkludert'}]
  :ctrl?.noneLabel?[{key:'none',title:ctrl.noneLabel,facts:ctrl.noneFacts??'Ingen sender i pakken',price:0,priceLabel:'0 kr'}]:[];
 const controllerOptions:PackageOption[]=ctrl?.sets?(ctrl.included||ctrl.defaultNone?[...noneOption,...ctrl.sets.map(setOption)]:[...ctrl.sets.map(setOption),...noneOption]):[];
 const chargerPending=!!(rule?.chargingPending||rule?.needsPowerSupply);
 const chargerOptions:PackageOption[]=rule?[...(rule.includedCharger?[{key:'included',title:'Lader som følger med',facts:'Følger med modellen',price:0,priceLabel:'Inkludert'}]:[]),...rule.chargerIds.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p).map(c=>({key:c.id,title:shortTitle(c),facts:chargerPending?'Trenger bekreftelse eller ekstra tilbehør':optionFacts(c),price:c.price}))]:[];
 const leads=rule?rule.leadIds.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p):[];
 function choose(v:CatalogProduct,controller?:string,tier?:string){const r=rules[v.id];const start={vehicleId:v.id,batteryId:r?.batteryIds[0],chargerId:r?.includedCharger?undefined:r?.chargerIds[0],controllerKey:controller??defaultControllerKey(r)};
  setVehicleId(start.vehicleId);setBatteryId(start.batteryId);setBatterySets(1);setControllerKey(start.controllerKey);setChargerId(start.chargerId);setNotice('');setOrigin(tier?{...start,tier}:null);}
 function resetToTier(){if(!origin)return;setBatteryId(origin.batteryId);setBatterySets(1);setChargerId(origin.chargerId);setControllerKey(origin.controllerKey);setNotice('');}
 const fromTier=!!origin&&origin.vehicleId===vehicleId;
 const discountActive=fromTier&&batteryId===origin.batteryId&&batterySets===1&&chargerId===origin.chargerId&&controllerKey===origin.controllerKey;
 const discount=discountActive?discountFor(total):0;
 function add(){if(!vehicle||blocked)return;saveCart([...cart,{id:crypto.randomUUID(),name:cleanName(vehicle.name),total:total-discount,lines:[...lines.map(l=>({id:l.product.id,name:cleanName(l.product.name),quantity:l.quantity,price:l.product.price})),...(discount?[discountLine(discount)]:[])]}]);setNotice('Pakken er lagt i demo-handlevognen.');}
 function addReady(p:DefaultPackage){const d=discountFor(p.total);saveCart([...cart,{id:crypto.randomUUID(),name:cleanName(p.vehicle.name),total:p.total-d,lines:[...p.lines.map(l=>({id:l.product.id,name:cleanName(l.product.name),quantity:l.quantity,price:l.product.price})),discountLine(d)]}]);}
 function pick(id:string){setCategory(id);history.replaceState(null,'',`#${id}`);setQuery('');}
 const filtered=products.filter(p=>(category==='accessories'?p.kind!=='vehicle':p.kind==='vehicle'&&p.vehicleType===category&&p.tags.includes(`experience:${experience}`))&&`${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:0);
 const heroModel=products.find(p=>p.id==='50807');
 const tierProducts=products.filter(p=>p.kind!=='vehicle'||p.tags.includes(`experience:${experience}`));
 const tiers=category==='accessories'?[]:tierPackages(tierProducts,category);
 const title=categories.find(([id])=>id===category)?.[1]??'Batterier, ladere og tilbehør';
 return <main className="builder-main">
  <section className="hero" aria-labelledby="hero-title">
   <div className="hero-inner">
    <div className="hero-copy">
     <h1 id="hero-title">Finn modellen.<br/>Bygg pakken.</h1>
     <p>Velg en radiostyrt modell, så setter vi sammen batteri, lader og kablene den trenger. Det som ikke passer, får du vite hvorfor.</p>
     <a href="#katalog" className="btn-build btn-build-hero">Velg en modell <ArrowDown size={19} aria-hidden/></a>
    </div>
    {heroModel&&<a className="hero-visual" href={productHref(heroModel)}>
     <span className="hero-visual-media"><img src={heroModel.imageUrl??''} alt={cleanName(heroModel.name)}/></span>
     <span className="hero-tag"><strong>{cleanName(heroModel.name)}</strong><span>{money(heroModel.price)}</span></span>
    </a>}
   </div>
   <ol className="hero-steps">
    <li><strong>Velg modell</strong><span>24 modeller fra Elefun</span></li>
    <li><strong>Batteri som passer</strong><span>Riktig kontakt og celler</span></li>
    <li><strong>Lader og kabler</strong><span>Overganger legges til selv</span></li>
   </ol>
  </section>

  <section id="katalog" className="builder-catalog" aria-labelledby="catalog-title">
   <div className="segmented" role="tablist" aria-label="Produktkategori">{categories.map(([id,label])=><button role="tab" aria-selected={category===id} key={id} onClick={()=>pick(id)}>{label}<small>{products.filter(p=>p.kind==='vehicle'&&p.vehicleType===id&&(p.tags.includes(`experience:${experience}`))).length} modeller</small></button>)}<button role="tab" aria-selected={category==='accessories'} onClick={()=>pick('accessories')}>Batterier og ladere<small>Tilbehør</small></button></div>
   {category!=='accessories'&&<div className="experience-toggle" role="group" aria-label="Erfaringsnivå"><span>Erfaringsnivå</span><button type="button" aria-pressed={experience==='beginner'} onClick={()=>setExperience('beginner')}>Nybegynner</button><button type="button" aria-pressed={experience==='experienced'} onClick={()=>setExperience('experienced')}>Erfaren</button><p>{experience==='beginner'?'Modeller med enklere oppsett, stabilisering eller medfølgende utstyr som kan gjøre starten lettere.':'Modeller med høyere ytelse eller større krav til utstyr, oppsett eller fly-/kjøreerfaring.'}</p></div>}
   <PackageTiers tiers={tiers} onAdd={addReady} onCustomize={(p,tier)=>choose(p.vehicle,p.controllerKey,tier)}/>
   <div className="toolbar">
    <div><h2 id="catalog-title">{title}</h2><p>{filtered.length} produkter <span>· Prisene er øyeblikksbilder fra elefun.no</span></p></div>
    <div className="toolbar-controls">
     <label className="field-search"><Search size={18} aria-hidden/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Søk i utvalget" aria-label="Søk i utvalget"/></label>
     <label className="select"><span>Sorter</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Anbefalt</option><option value="low">Pris: lav til høy</option><option value="high">Pris: høy til lav</option></select></label>
    </div>
   </div>
   {filtered.length===0?<div className="empty"><h3>Ingen produkter matcher søket</h3><p>Prøv et annet navn eller merke.</p></div>:
   <div className="product-grid product-grid-5">{filtered.map((v,i)=><ProductCard key={v.id} product={v} priority={i<5} action={v.kind==='vehicle'?<button type="button" className="btn-build btn-build-compact" onClick={()=>choose(v)}>Bygg pakke <ArrowRight size={16} aria-hidden/></button>:<a className="text-link" href={productHref(v)}>Detaljer</a>}/>)}</div>}
  </section>

  <aside className="builder-note"><PackageCheck size={22} aria-hidden/><p>Pakkene bygger på modellspesifikke batterier og ladeoppsett. Kombinasjoner som ikke er avklart, blir markert og kan ikke legges i handlevognen som ferdig pakke.</p><button type="button" className="btn-secondary" onClick={()=>setCartOpen(true)}><ShoppingCart size={18} aria-hidden/> Demo-handlevogn ({cart.length})</button></aside>

  <dialog ref={dialog} className="sheet builder-sheet" aria-labelledby="builder-title" onCancel={()=>setVehicleId(undefined)} onClose={()=>setVehicleId(undefined)}>
   {vehicle&&rule&&<><header className="sheet-head pb-head"><div><h2 id="builder-title">{cleanName(vehicle.name)}</h2><p>Sett sammen pakken med batteri, lader, kabler og kontroll</p></div><button className="icon-button" aria-label="Lukk pakkebygger" onClick={()=>setVehicleId(undefined)}><X/></button></header>
   <div className="pb-body">
    <section className="pb-model" aria-label="Modellen">
     <div className="pb-model-media"><img src={vehicle.imageUrl??''} alt=""/></div>
     <SpecRail specs={specsFor(vehicle)}/>
     <p className="pb-note">{rule.note}</p>
     <a className="source-link" href={productHref(vehicle)}>Om modellen <ArrowRight size={14} aria-hidden/></a>
    </section>
    <section className="pb-config" aria-labelledby="pb-config-title">
     <h3 id="pb-config-title">Din pakke</h3>
     <p className="pb-hint">Bytt batteri, lader eller kontroll i menyene. Prisene der viser hva byttet koster eller sparer.</p>
     <div className="pb-rows">
      <div className="pb-row"><span className="pb-row-label">Modell</span><div className="pb-static"><span><strong>{cleanName(vehicle.name)}</strong></span><span className="price">{money(vehicle.price)}</span></div></div>
      {batteryOptions.length>1?<PackageSelect label={vehicle.batteryCount>1?`Batteri · ${vehicle.batteryCount} stk. trengs`:'Batteri'} icon={<BatteryCharging size={20}/>} value={`${batteryId}:${batterySets}`} onChange={k=>{const [id,sets]=k.split(':');setBatteryId(id);setBatterySets(Number(sets)||1);setNotice('');}} options={batteryOptions}/>:batteryOptions[0]&&<div className="pb-row"><span className="pb-row-label">{vehicle.batteryCount>1?`Batteri · ${vehicle.batteryCount} stk. trengs`:'Batteri'}</span><div className="pb-static"><span><strong>{batteryOptions[0].title}</strong><small>{batteryOptions[0].facts}</small></span><span className="price">{money(batteryOptions[0].price)}</span></div></div>}
      {chargerOptions.length>1?<PackageSelect label="Lader" icon={<Zap size={20}/>} value={chargerId??'included'} onChange={k=>{setChargerId(k==='included'?undefined:k);setNotice('');}} options={chargerOptions}/>
      :chargerOptions.length===1&&<div className="pb-row"><span className="pb-row-label">Lader</span><div className="pb-static"><span><strong>{chargerOptions[0].title}</strong><small>{chargerOptions[0].facts}</small></span><span className="price">{chargerOptions[0].price?money(chargerOptions[0].price):'Inkludert'}</span></div></div>}
      {controllerOptions.length>0?<div className="pb-row"><PackageSelect label="Kontroll" icon={<Gamepad2 size={20}/>} value={controllerKey} onChange={k=>{setControllerKey(k);setNotice('');}} options={controllerOptions}/>{ctrl?.note&&<p className="pb-row-note">{ctrl.note}</p>}</div>
      :ctrl?.included&&<div className="pb-row"><span className="pb-row-label">Kontroll</span><div className={`pb-static${ctrl.unconfirmed?' pb-static-warn':''}`}><span><strong>{ctrl.unconfirmed?'Ikke bekreftet':'Følger med modellen'}</strong><small>{ctrl.included}</small></span><span className="price">{ctrl.unconfirmed?'–':'Inkludert'}</span></div></div>}
      {leads.length>0&&<div className="pb-row"><span className="pb-row-label">Kabler · legges til automatisk</span>{leads.map(l=><div className="pb-static" key={l.id}><span><strong>{vehicle.batteryCount} × {cleanName(l.name)}</strong><small>{l.description!=='Tilbehør fra Elefuns produktkatalog.'?l.description:'Trengs for å lade batteriet'}</small></span><span className="price">{money(l.price*vehicle.batteryCount)}</span></div>)}</div>}
     </div>
     {fromTier&&!discountActive&&<div className="note note-warn"><CircleAlert size={18} aria-hidden/><div><strong>Pakkerabatten gjelder ikke lenger</strong><p>Du har endret ferdigpakken {origin?.tier}, så 15 % rabatt blir ikke gitt. <button className="link-button" onClick={resetToTier}>Gå tilbake til ferdigpakken</button></p></div></div>}
     {reasons.length>0&&<div className="note note-warn"><CircleAlert size={18} aria-hidden/><div><strong>Må avklares før pakken er komplett</strong><ul>{reasons.map(r=><li key={r}>{r}</li>)}</ul></div></div>}
     {radioCaveat&&<div className="note note-warn"><CircleAlert size={18} aria-hidden/><div><strong>Radiooppsettet har et forbehold</strong><p>{radioCaveat}</p></div></div>}
     <div className="pb-total">
      {discountActive&&<p className="pb-discount"><span className="discount-badge">−15 %</span> Ferdigpakke {origin?.tier}: du sparer {money(discount)}</p>}
      <div className="pb-sum"><span>Sum for pakken</span><span className="pb-sum-price">{discount>0&&<s className="price">{money(total)}</s>}<strong className="price">{money(total-discount)}</strong></span></div>
      <p className="pb-sum-split">Modell {money(vehicle.price)} · tilbehør {money(total-vehicle.price)} · demopriser inkl. mva., frakt ikke beregnet</p>
      <span className={`status ${blocked||compatibility?.status==='conditional'?'status-warn':'status-ok'}`}>{blocked?'Trenger avklaring før pakken er komplett':compatibility?.status==='conditional'?'Passer med forbehold':'Dokumentert bilpakke'}</span>
      <button className="btn-buy btn-buy-full" disabled={blocked} onClick={add}><ShoppingCart size={18} aria-hidden/> Legg i demo-handlevogn</button>
      <p className="fine-print">{vehicle.vehicleType==='plane'?'Sender og eventuelt mottaker kommer i tillegg. Pakken er ikke et komplett flyklart sett.':'Kontroller hva som følger med, og eventuelle batterier til senderen.'}</p>
      <div aria-live="polite" className="success-notice">{notice}</div>
     </div>
    </section>
   </div></>}
  </dialog>
  <dialog ref={cartDialog} className="sheet cart-sheet" aria-labelledby="cart-title" onCancel={()=>setCartOpen(false)} onClose={()=>setCartOpen(false)}><header className="sheet-head"><div><h2 id="cart-title">Demo-handlevogn</h2><p>Lagres bare på denne enheten. Ingen ekte ordre eller betaling.</p></div><button className="icon-button" aria-label="Lukk handlevogn" onClick={()=>setCartOpen(false)}><X/></button></header>
   <div className="cart-body">{cart.length===0?<div className="empty"><h3>Handlevognen er tom</h3><p>Velg en modell og bygg en pakke, eller legg til tilbehør fra en kategori.</p></div>:cart.map(p=><article className="cart-package" key={p.id}><h3>{p.name}</h3>{p.lines.map(l=><div className="summary-row" key={l.id}><span>{l.quantity} × {l.name}</span><b>{money(l.price*l.quantity)}</b></div>)}<div className="cart-package-foot"><button className="link-button" onClick={()=>saveCart(cart.filter(c=>c.id!==p.id))}>Fjern</button><strong className="price">{money(p.total)}</strong></div></article>)}
   {cart.length>0&&<div className="cart-total"><span>Totalt</span><strong className="price">{money(cart.reduce((s,p)=>s+p.total,0))}</strong></div>}
   <a className="source-link" href="https://www.elefun.no/" target="_blank" rel="noreferrer">Handle på ekte hos Elefun <ArrowUpRight size={15} aria-hidden/></a></div>
  </dialog>
 </main>;
}
