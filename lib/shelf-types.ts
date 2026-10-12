export type ShelfProduct={
  id:string;name:string;brand:string|null;price:number;previousPrice?:number;imageUrl:string|null;url:string;
  stock:{inStock:boolean;label:string};reviews:number;
};
export type Shelf={id:number;slug:string;name:string;column?:string;sourceUrl:string;total:number;products:ShelfProduct[]};
export type ShelfCategory={id:number;slug:string;name:string;icon?:string;sourceUrl:string;subs:Shelf[]};

export const categoryHref=(c:Pick<ShelfCategory,"slug">)=>`/sortiment/${c.slug}`;
export const shelfHref=(c:Pick<ShelfCategory,"slug">,s:Pick<Shelf,"slug">)=>`/sortiment/${c.slug}/${s.slug}`;
export const productHref=(c:Pick<ShelfCategory,"slug">,s:Pick<Shelf,"slug">,p:Pick<ShelfProduct,"id">)=>`${shelfHref(c,s)}/${p.id}`;
export const discountPercent=(p:ShelfProduct)=>p.previousPrice?Math.round((1-p.price/p.previousPrice)*100):0;
