import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { discountPercent, shelfHref, type Shelf, type ShelfCategory, type ShelfProduct } from "@/lib/shelf-types";
import { cleanName, money } from "@/lib/store";
import { AddToCart } from "./cart-controls";

export function StockLine({stock}:{stock:ShelfProduct["stock"]}){
  return <span className={`stock ${stock.inStock?"stock-in":"stock-out"}`}><i aria-hidden/>{stock.label}</span>;
}

export function ShelfCard({product,priority=false}:{product:ShelfProduct;priority?:boolean}){
  const name=cleanName(product.name);
  const off=discountPercent(product);
  return <article className="pcard scard">
    <a className="pcard-media scard-media" href={product.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
      {product.imageUrl&&<img src={product.imageUrl} alt="" loading={priority?"eager":"lazy"}/>}
      {off>0&&<span className="scard-badge">−{off} %</span>}
    </a>
    <div className="pcard-body">
      {product.brand&&<span className="scard-brand">{product.brand}</span>}
      <h3><a href={product.url} target="_blank" rel="noreferrer">{name}<span className="sr-only"> (åpnes hos Elefun)</span></a></h3>
      <div className="scard-meta">
        <StockLine stock={product.stock}/>
        {product.reviews>0&&<span className="scard-reviews"><Star size={13} aria-hidden/>{product.reviews} <span className="sr-only">omtaler</span></span>}
      </div>
      <div className="pcard-foot">
        <div className="scard-price">
          <strong className="price">{money(product.price)}</strong>
          {product.previousPrice&&<s className="price">{money(product.previousPrice)}</s>}
        </div>
        {product.stock.inStock
          ?<AddToCart product={{id:`elefun-${product.id}`,name:product.name,price:product.price}}/>
          :<a className="btn-secondary scard-ext" href={product.url} target="_blank" rel="noreferrer">Se hos Elefun <ArrowUpRight size={15} aria-hidden/></a>}
      </div>
    </div>
  </article>;
}

export function ShelfNav({category,current}:{category:ShelfCategory;current?:Shelf}){
  return <nav className="shelf-nav" aria-label={`Underkategorier i ${category.name}`}>
    <ul>
      {category.subs.map(s=><li key={s.id}>
        <Link href={shelfHref(category,s)} aria-current={s.id===current?.id?"page":undefined}>{s.name}<small>{s.products.length}</small></Link>
      </li>)}
    </ul>
  </nav>;
}

export function ShelfSection({category,shelf}:{category:ShelfCategory;shelf:Shelf}){
  const href=shelfHref(category,shelf);
  return <section className="shelf" aria-labelledby={`shelf-${shelf.id}`}>
    <div className="section-head section-head-row">
      <div>
        {shelf.column&&<p className="eyebrow">{shelf.column}</p>}
        <h2 id={`shelf-${shelf.id}`}><Link href={href}>{shelf.name}</Link></h2>
      </div>
      <Link href={href}>Se utvalget ({shelf.products.length}) <ArrowRight size={16} aria-hidden/></Link>
    </div>
    <div className="product-grid shelf-grid">{shelf.products.slice(0,4).map(p=><ShelfCard key={p.id} product={p}/>)}</div>
  </section>;
}
