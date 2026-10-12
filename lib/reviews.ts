import data from "@/data/product-reviews.json";

export type Review={rating:number;headline:string;author:string;date:string;text:string;helpful:number;notHelpful:number};
export type ProductReviews={sourceUrl:string;count:number;stars:number;reviews:Review[]};

const products=data.products as Record<string,ProductReviews>;

/** Real customer reviews copied from the product's page on elefun.no, or null when it has none. */
export const reviewsFor=(id:string):ProductReviews|null=>products[id]??null;

export const ratingLabel=(stars:number)=>new Intl.NumberFormat("nb-NO",{minimumFractionDigits:stars%1?1:0,maximumFractionDigits:1}).format(stars);
export const reviewDate=(iso:string)=>new Intl.DateTimeFormat("nb-NO",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${iso}T12:00:00`));
export const countLabel=(n:number)=>`${n} ${n===1?"anmeldelse":"anmeldelser"}`;
