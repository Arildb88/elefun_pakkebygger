export type CatalogProduct = {
  id:string; kind:"vehicle"|"battery"|"charger"|"accessory"|"controller"; vehicleType:string|null; name:string; brand:string;
  description:string; price:number; stock:number; sourceUrl:string|null; imageUrl:string|null;
  connector:string|null; cells:number|null; capacityMah:number|null; lengthMm:number|null;
  widthMm:number|null; heightMm:number|null; minCells:number|null; maxCells:number|null;
  batteryCount:number; tags:string[];
};
