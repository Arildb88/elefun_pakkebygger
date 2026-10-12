import data from "@/data/elefun-shelves.json";
import { categoryHref, shelfHref, type ShelfCategory } from "./shelf-types";

export * from "./shelf-types";

export const SHELF_CATEGORIES=(data.categories as ShelfCategory[]).filter(c=>c.subs.length>0);
export const SHELVES_FETCHED_AT=data.fetchedAt;

export const findCategory=(slug:string)=>SHELF_CATEGORIES.find(c=>c.slug===slug);
export const findShelf=(c:ShelfCategory,slug:string)=>c.subs.find(s=>s.slug===slug);
export const productCount=(c:ShelfCategory)=>c.subs.reduce((n,s)=>n+s.products.length,0);

/** Elefun category id (top-level or subcategory) → the page for it in this store. */
export const INTERNAL_HREF=new Map<number,string>(SHELF_CATEGORIES.flatMap(c=>[
  [c.id,categoryHref(c)] as const,
  ...c.subs.map(s=>[s.id,shelfHref(c,s)] as const),
]));

export function formatFetchedAt(){
  return new Intl.DateTimeFormat("nb-NO",{day:"numeric",month:"long",year:"numeric"}).format(new Date(SHELVES_FETCHED_AT));
}
