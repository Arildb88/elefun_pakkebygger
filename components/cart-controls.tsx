"use client";
import { useState, useSyncExternalStore } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-types";
import { readCart, writeCart } from "@/lib/cart";
import { cleanName } from "@/lib/store";

function subscribe(onChange:()=>void){
  window.addEventListener("elefun-cart",onChange);window.addEventListener("storage",onChange);
  return()=>{window.removeEventListener("elefun-cart",onChange);window.removeEventListener("storage",onChange);};
}

export function CartCount(){
  const count=useSyncExternalStore(subscribe,()=>readCart().length,()=>0);
  return count>0?<i className="cart-count" aria-label={`${count} i handlevognen`}>{count}</i>:null;
}

export function AddToCart({product,variant="compact"}:{product:CatalogProduct;variant?:"compact"|"full"}){
  const [added,setAdded]=useState(false);
  function add(){
    const name=cleanName(product.name);
    writeCart([...readCart(),{id:crypto.randomUUID(),name,total:product.price,lines:[{id:product.id,name,quantity:1,price:product.price}]}]);
    setAdded(true);window.setTimeout(()=>setAdded(false),2200);
  }
  const label=added?"Lagt i handlevognen":"Legg i handlevogn";
  return <button type="button" className={`btn-buy btn-buy-${variant}`} onClick={add} aria-label={variant==="compact"?`${label}: ${cleanName(product.name)}`:undefined}>
    {added?<Check size={18} aria-hidden/>:<ShoppingCart size={18} aria-hidden/>}
    {variant==="full"?<span>{label}</span>:<span className="sr-only-sm">{added?"Lagt til":"Kjøp"}</span>}
    <span className="sr-only" aria-live="polite">{added?"Lagt i demo-handlevognen":""}</span>
  </button>;
}
