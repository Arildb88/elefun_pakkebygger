export type SavedPackage={id:string;name:string;total:number;lines:{id:string;name:string;quantity:number;price:number}[]};

export const CART_KEY="elefun-packages-v2";

export function readCart():SavedPackage[]{
  try{const parsed=JSON.parse(localStorage.getItem(CART_KEY)??"[]");return Array.isArray(parsed)&&parsed.every(p=>typeof p?.total==="number"&&Array.isArray(p.lines))?parsed:[];}catch{return [];}
}

export function writeCart(next:SavedPackage[]){
  try{localStorage.setItem(CART_KEY,JSON.stringify(next));}catch{}
  window.dispatchEvent(new CustomEvent("elefun-cart",{detail:next.length}));
}
