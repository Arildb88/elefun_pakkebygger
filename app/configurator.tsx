"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BatteryCharging, Check, ChevronDown, Heart, Info, Menu, PackageCheck, Search, Ship, ShoppingCart, Truck, UserRound, X } from "lucide-react";

const money=(n:number)=>new Intl.NumberFormat("nb-NO",{style:"currency",currency:"NOK",maximumFractionDigits:0}).format(n);
type Reason={code:"connector"|"voltage"|"length"|"width"|"height";label:string};

function compatibility(vehicle:CatalogProduct,battery:CatalogProduct):Reason[]{
  const reasons:Reason[]=[];
  if(vehicle.connector!==battery.connector)reasons.push({code:"connector",label:`Feil kontakt: modellen bruker ${vehicle.connector}, batteriet har ${battery.connector}.`});
  if((battery.cells??0)<(vehicle.minCells??0)||(battery.cells??0)>(vehicle.maxCells??0))reasons.push({code:"voltage",label:`Feil spenning: modellen støtter ${vehicle.minCells===vehicle.maxCells?`${vehicle.minCells}S`:`${vehicle.minCells}–${vehicle.maxCells}S`}.`});
  if((battery.lengthMm??0)>(vehicle.lengthMm??0))reasons.push({code:"length",label:`For langt: ${battery.lengthMm} mm, maks ${vehicle.lengthMm} mm.`});
  if((battery.widthMm??0)>(vehicle.widthMm??0))reasons.push({code:"width",label:`For bredt: ${battery.widthMm} mm, maks ${vehicle.widthMm} mm.`});
  if((battery.heightMm??0)>(vehicle.heightMm??0))reasons.push({code:"height",label:`For høyt: ${battery.heightMm} mm, maks ${vehicle.heightMm} mm.`});
  return reasons;
}

export default function Configurator({products}:{products:CatalogProduct[]}){
  const vehicles=products.filter(p=>p.kind==="vehicle");
  const batteries=products.filter(p=>p.kind==="battery");
  const charger=products.find(p=>p.kind==="charger")!;
  const[vehicleId,setVehicleId]=useState(vehicles[0]?.id);
  const[vehicleFilter,setVehicleFilter]=useState<"all"|"car"|"boat">("all");
  const[showAll,setShowAll]=useState(false);
  const[cart,setCart]=useState(false);
  const vehicle=vehicles.find(p=>p.id===vehicleId)??vehicles[0];
  const compatible=batteries.filter(b=>compatibility(vehicle,b).length===0);
  const[batteryId,setBatteryId]=useState<string|undefined>(compatible[0]?.id);
  const selectedBattery=batteries.find(b=>b.id===batteryId);
  const chosenBattery=selectedBattery&&compatibility(vehicle,selectedBattery).length===0?selectedBattery:compatible[0];
  const displayed=showAll?batteries:compatible;
  const total=vehicle.price+(chosenBattery?.price??0)*(vehicle.batteryCount||1)+charger.price;
  const filteredVehicles=vehicles.filter(v=>vehicleFilter==="all"||v.vehicleType===vehicleFilter);

  function chooseVehicle(id:string){
    const next=vehicles.find(v=>v.id===id)!;
    const current=batteries.find(b=>b.id===batteryId);
    setVehicleId(id); setCart(false);
    if(!current||compatibility(next,current).length)setBatteryId(batteries.find(b=>compatibility(next,b).length===0)?.id);
  }

  return <div className="site-shell">
    <div className="prototype-bar"><strong>PROTOTYPE</strong><span>Produktdata lagres i database – ingen ekte bestilling</span></div>
    <header className="store-header">
      <div className="header-main">
        <button className="mobile-menu" aria-label="Åpne meny"><Menu/></button>
        <a className="elefun-logo" href="https://www.elefun.no/" target="_blank" rel="noreferrer"><img src="https://www.elefun.no/aspx/resize.aspx?W=1500&file=..%2Fbilder%2Fproduktbilder%2F34094%2F34094_3.jpg" alt="Elefun"/></a>
        <label className="search"><Search/><input placeholder="Søk blant våre 30.000 produkter" aria-label="Søk"/></label>
        <nav className="header-actions"><button><Heart/><span>Favoritter</span></button><button><UserRound/><span>Logg inn</span></button><button><ShoppingCart/><span>{cart?"1 pakke":"Handlevogn"}</span></button></nav>
      </div>
      <nav className="category-nav"><button>Alle produkter <ChevronDown/></button><a>3D-print</a><a>Batteri & ladere</a><a className="active">Biler</a><a>Båter</a><a>Droner</a><a>Fly</a><a>Radioutstyr</a><a className="sale">Outlet</a></nav>
      <div className="service-strip"><span><b>100% norsk nettbutikk</b> siden 2003</span><span><b>Lynrask levering</b> fra Norge</span><span><b>60 dager bytterett</b> trygg handel</span></div>
    </header>

    <main>
      <div className="breadcrumbs">Forside <span>/</span> Pakker <span>/</span> Finn riktig batteri</div>
      <section className="builder-head"><div><Badge>PAKKEBYGGER</Badge><h1>Velg modell og batteri</h1><p>Vi sjekker kontakt, spenning og fysiske mål før batteriet kan velges.</p></div><div className="db-status"><span/><div><strong>Database tilkoblet</strong><small>{products.length} produkter tilgjengelig</small></div></div></section>

      <section className="vehicle-section">
        <div className="section-title"><div><span className="step">1</span><h2>Velg bil eller båt</h2></div><div className="filter-tabs"><button className={vehicleFilter==="all"?"selected":""} onClick={()=>setVehicleFilter("all")}>Alle</button><button className={vehicleFilter==="car"?"selected":""} onClick={()=>setVehicleFilter("car")}>Biler</button><button className={vehicleFilter==="boat"?"selected":""} onClick={()=>setVehicleFilter("boat")}>Båter</button></div></div>
        <div className="vehicle-grid">{filteredVehicles.map(v=><button key={v.id} className={`vehicle-card ${v.id===vehicle.id?"selected":""}`} onClick={()=>chooseVehicle(v.id)}>
          <div className="vehicle-image">{v.imageUrl?<img src={v.imageUrl} alt=""/>:v.vehicleType==="boat"?<Ship/>:<Truck/>}<Badge>{v.vehicleType==="boat"?"BÅT":"BIL"}</Badge></div>
          <div className="vehicle-info"><small>{v.brand}</small><strong>{v.name}</strong><p>{v.description}</p><div className="tag-row">{v.tags.map(t=><i key={t}>{t}</i>)}</div><div className="vehicle-price"><span>{money(v.price)}</span>{v.stock>0?<em>{v.stock>=100?"100+":v.stock} på lager</em>:<em className="sold">Ikke på lager</em>}</div></div>
          {v.id===vehicle.id&&<span className="selected-check"><Check/></span>}
        </button>)}</div>
      </section>

      <div className="builder-grid">
        <section className="battery-section">
          <div className="section-title"><div><span className="step">2</span><div><h2>Velg batteri</h2><p>{vehicle.batteryCount>1?`Denne modellen bruker ${vehicle.batteryCount} like batterier.`:"Velg ett batteri til modellen."}</p></div></div><label className="show-all"><input type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)}/>Vis også batterier som ikke passer</label></div>
          <div className="fit-summary"><PackageCheck/><div><strong>{compatible.length} batterier passer til {vehicle.brand}</strong><span>Krav: {vehicle.minCells===vehicle.maxCells?`${vehicle.minCells}S`:`${vehicle.minCells}–${vehicle.maxCells}S`} · {vehicle.connector} · maks {vehicle.lengthMm} × {vehicle.widthMm} × {vehicle.heightMm} mm</span></div></div>
          <div className="battery-list">{displayed.map(b=>{const reasons=compatibility(vehicle,b);const fits=reasons.length===0;const picked=chosenBattery?.id===b.id;return <button key={b.id} className={`battery-card ${picked?"selected":""} ${!fits?"blocked":""}`} disabled={!fits} onClick={()=>{setBatteryId(b.id);setCart(false)}}>
            <div className="battery-icon"><BatteryCharging/><b>{b.cells}S</b></div><div className="battery-copy"><div><strong>{b.name}</strong>{fits?<Badge className="fits"><Check/> Passer</Badge>:<Badge className="no-fit"><X/> Passer ikke</Badge>}</div><p>{b.description}</p><div className="tag-row">{b.tags.map(t=><i key={t}>{t}</i>)}</div>{!fits&&<div className="reason"><Info/>{reasons[0].label}</div>}</div><div className="battery-price"><strong>{money(b.price)}</strong><span>{b.stock} på lager</span></div>
          </button>})}</div>
        </section>

        <aside className="summary-card">
          <div className="summary-banner"><img src="https://www.elefun.no/aspx/resize.aspx?W=1500&file=..%2Fbilder%2Fproduktbilder%2F34094%2F34094_3.jpg" alt="Elefun banner"/></div>
          <Badge className="complete"><Check/> KOMPATIBEL PAKKE</Badge><h2>{vehicle.name}</h2>
          <div className="package-line"><span>Modell</span><strong>{money(vehicle.price)}</strong></div>
          <div className="package-product"><BatteryCharging/><div><strong>{chosenBattery?.name??"Ingen batterier passer"}</strong><span>{vehicle.batteryCount>1?`${vehicle.batteryCount} × ${money(chosenBattery?.price??0)}`:money(chosenBattery?.price??0)}</span></div></div>
          <div className="package-line"><span>SmartCharge Multi 100W</span><strong>{money(charger.price)}</strong></div>
          <div className="summary-total"><span>Pakkepris</span><strong>{money(total)}</strong><small>inkl. mva.</small></div>
          <Button className="buy-button" disabled={!chosenBattery} onClick={()=>setCart(true)}>{cart?<><Check/>Lagt i handlevogn</>:<><ShoppingCart/>Legg pakken i handlevogn</>}</Button>
          <div className="compat-list"><h3>Kontrollert automatisk</h3><div><Check/>Riktig kontakttype ({vehicle.connector})</div><div><Check/>Riktig batterispenning</div><div><Check/>Passer i batterirommet</div></div>
        </aside>
      </div>
    </main>
  </div>;
}
