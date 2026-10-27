import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CircleAlert, ChevronRight, PackageCheck, PlugZap } from "lucide-react";
import { loadCatalog } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog-types";
import { accessoriesFor, builderHref, categoryOf, cleanName, modelsUsing, money, productHref, specsFor } from "@/lib/store";
import { ProductCard, SpecRail } from "@/components/store-ui";
import { AddToCart } from "@/components/cart-controls";
import { RatingBadge, ReviewSection } from "@/components/reviews";
import { reviewsFor } from "@/lib/reviews";

export const dynamic = "force-dynamic";

function FitRow({product,role}:{product:CatalogProduct;role:string}){
  return <li className="fit-row">
    <a href={productHref(product)} className="fit-thumb" tabIndex={-1} aria-hidden="true">{product.imageUrl&&<img src={product.imageUrl} alt="" loading="lazy"/>}</a>
    <div>
      <a href={productHref(product)} className="fit-name">{cleanName(product.name)}</a>
      <span className="fit-specs"><b>{role}</b>{specsFor(product).map(s=>` · ${s}`).join("")}</span>
    </div>
    <strong className="price">{money(product.price)}</strong>
  </li>;
}

export default async function ProductPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const products=await loadCatalog();
  const product=products.find(p=>p.id===id);
  if(!product) notFound();
  const category=categoryOf(product);
  const name=cleanName(product.name);
  const isVehicle=product.kind==="vehicle";
  const fit=isVehicle?accessoriesFor(products,product):null;
  const usedBy=isVehicle?[]:modelsUsing(products,product);
  const related=products.filter(p=>p.id!==product.id&&category.match(p)).slice(0,4);
  const reviews=reviewsFor(product.id);
  const pending=fit?.rule&&(fit.rule.batteryPending||fit.rule.chargingPending||fit.rule.needsPowerSupply);

  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler"><Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/><a href={`/kategori/${category.slug}`}>{category.title}</a><ChevronRight size={14} aria-hidden/><span aria-current="page">{name}</span></nav>

    <article className="product">
      <div className="product-media">
        {product.imageUrl&&<img src={product.imageUrl} alt={name}/>}
      </div>
      <div className="product-info">
        <h1>{name}</h1>
        {reviews&&<RatingBadge data={reviews} href="#anmeldelser"/>}
        <SpecRail specs={specsFor(product)} size="lg"/>
        {isVehicle&&fit?.rule&&<p className="product-note">{fit.rule.note}</p>}
        {!isVehicle&&product.description!=="Tilbehør fra Elefuns produktkatalog."&&<p className="product-note">{product.description}</p>}
        <div className="buy-box">
          <div className="buy-price">
            <strong className="price price-xl">{money(product.price)}</strong>
            <small>Inkl. mva. Prisøyeblikksbilde fra elefun.no, ikke sanntidspris.</small>
          </div>
          <div className="buy-actions">
            {isVehicle&&<a className="btn-build" href={builderHref(product)}><PackageCheck size={19} aria-hidden/> Bygg pakke med batteri og lader</a>}
            <AddToCart product={product} variant="full"/>
          </div>
          <a className="source-link" href={product.sourceUrl??"https://www.elefun.no/"} target="_blank" rel="noreferrer">Se varen hos Elefun <ArrowUpRight size={15} aria-hidden/></a>
        </div>
      </div>
    </article>

    {fit&&(fit.batteries.length+fit.chargers.length+fit.leads.length>0||fit.rule?.includedCharger)&&<section className="fits" aria-labelledby="fits-title">
      <div className="section-head">
        <h2 id="fits-title"><PlugZap size={22} aria-hidden/> Dette passer til modellen</h2>
        <p>Batterier, lader og kabler som er dokumentert for akkurat denne modellen.</p>
      </div>
      <ul className="fit-list">
        {fit.batteries.map(b=><FitRow key={b.id} product={b} role={product.batteryCount>1?`Batteri · trenger ${product.batteryCount} stk.`:"Batteri"}/>)}
        {fit.chargers.map(c=><FitRow key={c.id} product={c} role="Lader"/>)}
        {fit.leads.map(l=><FitRow key={l.id} product={l} role="Kabel som trengs"/>)}
      </ul>
      {fit.rule?.includedCharger&&<p className="fit-included"><PackageCheck size={18} aria-hidden/> Egnet lader følger med modellen.</p>}
      {pending&&<p className="fit-pending"><CircleAlert size={18} aria-hidden/> Noe i ladeoppsettet må bekreftes før pakken er komplett. Pakkebyggeren viser hva.</p>}
      <a className="btn-build btn-build-inline" href={builderHref(product)}>Sett sammen pakken <ArrowRight size={17} aria-hidden/></a>
    </section>}

    {usedBy.length>0&&<section className="fits" aria-labelledby="used-title">
      <div className="section-head">
        <h2 id="used-title"><PlugZap size={22} aria-hidden/> Passer til disse modellene</h2>
        <p>Modeller der denne varen er en del av den dokumenterte pakken.</p>
      </div>
      <ul className="fit-list">{usedBy.map(v=><FitRow key={v.id} product={v} role={v.tags[0]??"Modell"}/>)}</ul>
    </section>}

    {reviews&&<ReviewSection data={reviews}/>}

    {related.length>0&&<section className="related" aria-labelledby="related-title">
      <div className="section-head section-head-row">
        <h2 id="related-title">Mer fra {category.title.toLowerCase()}</h2>
        <a href={`/kategori/${category.slug}`}>Se alle <ArrowRight size={16} aria-hidden/></a>
      </div>
      <div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p} action={p.kind==="vehicle"?<a className="btn-build btn-build-compact" href={builderHref(p)}>Bygg pakke <ArrowRight size={16} aria-hidden/></a>:<AddToCart product={p}/>}/>)}</div>
    </section>}
  </main>;
}
