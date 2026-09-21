import "server-only";
import { env } from "cloudflare:workers";

export type CatalogProduct = {
  id:string; kind:"vehicle"|"battery"|"charger"; vehicleType:string|null; name:string; brand:string;
  description:string; price:number; stock:number; sourceUrl:string|null; imageUrl:string|null;
  connector:string|null; cells:number|null; capacityMah:number|null; lengthMm:number|null;
  widthMm:number|null; heightMm:number|null; minCells:number|null; maxCells:number|null;
  batteryCount:number; tags:string[];
};

const seed:CatalogProduct[]=[
  {id:"arrma-senton-223s",kind:"vehicle",vehicleType:"car",name:"ARRMA Senton 1/10 223S BLX 4WD Blue - RTR",brand:"ARRMA",description:"1/10 short-course bil med børsteløst 2S/3S-oppsett.",price:4699,stock:8,sourceUrl:"https://www.elefun.no/vare-67220/radiostyrt-bil-elektro-arrma-senton-1-10-223s-blx-4wd-blue-rtr",imageUrl:"https://www.elefun.no/aspx/resize.aspx?W=900&file=..%2Fbilder%2Fproduktbilder%2F67220%2F67220_1.jpg",connector:"IC5",cells:null,capacityMah:null,lengthMm:156,widthMm:51,heightMm:48,minCells:2,maxCells:3,batteryCount:1,tags:["Bil","1/10","2–3S","IC5"]},
  {id:"mjx-hyper-go-73081",kind:"vehicle",vehicleType:"car",name:"MJX Hyper GO Brushless 1/14 4WD Truggy",brand:"MJX",description:"Kompakt 4WD truggy. Leveres originalt med 2S 3000mAh.",price:2195,stock:100,sourceUrl:"https://www.elefun.no/vare-73081/radiostyrt-bil-elektro-buggy-mjx-hyper-go-brushless-1-14-4wd-truggy",imageUrl:"https://www.elefun.no/aspx/resize.aspx?W=900&file=..%2Fbilder%2Fproduktbilder%2F73081%2F73081_1.jpg",connector:"T-plug",cells:null,capacityMah:null,lengthMm:106,widthMm:36,heightMm:27,minCells:2,maxCells:3,batteryCount:1,tags:["Bil","1/14","2–3S","T-plug"]},
  {id:"traxxas-rustler-30488",kind:"vehicle",vehicleType:"car",name:"Traxxas Rustler XL-5 RTR WP",brand:"Traxxas",description:"2WD stadium truck som kan bruke 2S LiPo.",price:3495,stock:0,sourceUrl:"https://www.elefun.no/vare-30488/",imageUrl:"https://www.elefun.no/aspx/resize.aspx?W=900&file=..%2Fbilder%2Fproduktbilder%2F30488%2F30488_1.jpg",connector:"TRX",cells:null,capacityMah:null,lengthMm:155,widthMm:49,heightMm:30,minCells:2,maxCells:2,batteryCount:1,tags:["Bil","1/10","2S","TRX"]},
  {id:"udi-venom-28768",kind:"vehicle",vehicleType:"boat",name:"UDI Venom RC Båt - Orange 2.4G",brand:"UDI",description:"Selvrettende 32 cm båt med 2S drivbatteri.",price:649,stock:100,sourceUrl:"https://www.elefun.no/vare-28768/radiostyrt-bat-udi-venom-rc-orange-24g",imageUrl:"https://www.elefun.no/aspx/resize.aspx?W=900&file=..%2Fbilder%2Fproduktbilder%2F28768%2F28768_1.jpg",connector:"UDI-XH",cells:null,capacityMah:null,lengthMm:72,widthMm:35,heightMm:20,minCells:2,maxCells:2,batteryCount:1,tags:["Båt","32 cm","2S","UDI-XH"]},
  {id:"proboat-miss-illinois-75083",kind:"vehicle",vehicleType:"boat",name:"Pro Boat Miss Illinois U-34 RTR",brand:"Pro Boat",description:"8S hydroplane som bruker to 4S-batterier med IC5.",price:8995,stock:3,sourceUrl:"https://www.elefun.dk/vare-75083/radiostyret-bad-pro-boat-miss-illinois-u-34-rtr",imageUrl:"https://www.elefun.no/aspx/resize.aspx?W=900&file=..%2Fbilder%2Fproduktbilder%2F75083%2F75083_1.jpg",connector:"IC5",cells:null,capacityMah:null,lengthMm:155,widthMm:52,heightMm:52,minCells:4,maxCells:4,batteryCount:2,tags:["Båt","8S totalt","2 × 4S","IC5"]},
  {id:"proboat-jetstream",kind:"vehicle",vehicleType:"boat",name:"Pro Boat Jetstream 1/6 RTR Mojo",brand:"Pro Boat",description:"Jetbåt med 4S-oppsett og EC5/IC5-kompatibel kontakt.",price:7995,stock:4,sourceUrl:"https://www.elefun.no/bat",imageUrl:null,connector:"IC5",cells:null,capacityMah:null,lengthMm:160,widthMm:55,heightMm:50,minCells:4,maxCells:4,batteryCount:1,tags:["Båt","1/6","4S","IC5"]},
  {id:"spektrum-2s-5000-ic5",kind:"battery",vehicleType:null,name:"Spektrum Smart G2 2S 5000mAh 50C",brand:"Spektrum",description:"Hardcase LiPo med IC5 Smart-kontakt.",price:899,stock:11,sourceUrl:null,imageUrl:null,connector:"IC5",cells:2,capacityMah:5000,lengthMm:139,widthMm:47,heightMm:35,minCells:null,maxCells:null,batteryCount:1,tags:["2S","5000mAh","IC5","139×47×35 mm"]},
  {id:"spektrum-3s-5000-ic5",kind:"battery",vehicleType:null,name:"Spektrum Smart G2 3S 5000mAh 50C",brand:"Spektrum",description:"3S hardcase LiPo med IC5 Smart-kontakt.",price:1099,stock:7,sourceUrl:null,imageUrl:null,connector:"IC5",cells:3,capacityMah:5000,lengthMm:139,widthMm:47,heightMm:39,minCells:null,maxCells:null,batteryCount:1,tags:["3S","5000mAh","IC5","139×47×39 mm"]},
  {id:"spektrum-4s-5000-ic5",kind:"battery",vehicleType:null,name:"Spektrum Smart G2 4S 5000mAh 50C",brand:"Spektrum",description:"4S hardcase LiPo for kraftige biler og båter.",price:1299,stock:6,sourceUrl:null,imageUrl:null,connector:"IC5",cells:4,capacityMah:5000,lengthMm:139,widthMm:47,heightMm:49,minCells:null,maxCells:null,batteryCount:1,tags:["4S","5000mAh","IC5","139×47×49 mm"]},
  {id:"gensace-2s-5000-xt60",kind:"battery",vehicleType:null,name:"Gens Ace 2S 5000mAh 60C Hardcase",brand:"Gens Ace",description:"Standard hardcase med XT60. Riktig størrelse, men feil kontakt for IC5.",price:649,stock:18,sourceUrl:null,imageUrl:null,connector:"XT60",cells:2,capacityMah:5000,lengthMm:138,widthMm:47,heightMm:25,minCells:null,maxCells:null,batteryCount:1,tags:["2S","5000mAh","XT60","138×47×25 mm"]},
  {id:"bronto-2s-5200-tplug",kind:"battery",vehicleType:null,name:"Bronto 2S 5200mAh 50C Hardcase",brand:"Bronto",description:"2S hardcase med T-plug/Deans.",price:499,stock:24,sourceUrl:null,imageUrl:null,connector:"T-plug",cells:2,capacityMah:5200,lengthMm:138,widthMm:47,heightMm:25,minCells:null,maxCells:null,batteryCount:1,tags:["2S","5200mAh","T-plug","138×47×25 mm"]},
  {id:"mjx-2s-3000-tplug",kind:"battery",vehicleType:null,name:"MJX 2S 3000mAh 25C",brand:"MJX",description:"Kompakt batteri for Hyper GO 1/14.",price:399,stock:34,sourceUrl:null,imageUrl:null,connector:"T-plug",cells:2,capacityMah:3000,lengthMm:103,widthMm:34,heightMm:24,minCells:null,maxCells:null,batteryCount:1,tags:["2S","3000mAh","T-plug","103×34×24 mm"]},
  {id:"udi-2s-1100-xh",kind:"battery",vehicleType:null,name:"UDI 2S 1100mAh - hvit plugg",brand:"UDI",description:"Kompakt originaltype for UDI-båter.",price:165,stock:100,sourceUrl:"https://www.elefun.no/vare-44319/udi009-18-rapid-usb-lader-v2",imageUrl:null,connector:"UDI-XH",cells:2,capacityMah:1100,lengthMm:68,widthMm:34,heightMm:18,minCells:null,maxCells:null,batteryCount:1,tags:["2S","1100mAh","UDI-XH","68×34×18 mm"]},
  {id:"traxxas-2s-5800-trx",kind:"battery",vehicleType:null,name:"Traxxas Power Cell 2S 5800mAh iD",brand:"Traxxas",description:"2S LiPo med proprietær Traxxas iD-kontakt.",price:999,stock:9,sourceUrl:null,imageUrl:null,connector:"TRX",cells:2,capacityMah:5800,lengthMm:155,widthMm:45,heightMm:25,minCells:null,maxCells:null,batteryCount:1,tags:["2S","5800mAh","TRX","155×45×25 mm"]},
  {id:"oversize-4s-7000-ic5",kind:"battery",vehicleType:null,name:"PowerPack 4S 7000mAh 100C",brand:"PowerPack",description:"Testbatteri med riktig IC5-kontakt, men for stort for flere batterirom.",price:1399,stock:5,sourceUrl:null,imageUrl:null,connector:"IC5",cells:4,capacityMah:7000,lengthMm:165,widthMm:55,heightMm:52,minCells:null,maxCells:null,batteryCount:1,tags:["4S","7000mAh","IC5","165×55×52 mm"]},
  {id:"charger-smart",kind:"charger",vehicleType:null,name:"SmartCharge Multi 100W",brand:"Elefun testdata",description:"Balanseringslader for 2–4S LiPo.",price:799,stock:15,sourceUrl:null,imageUrl:null,connector:null,cells:null,capacityMah:null,lengthMm:null,widthMm:null,heightMm:null,minCells:2,maxCells:4,batteryCount:1,tags:["2–4S","LiPo","100W"]},
];

function row(p:CatalogProduct){
  return [p.id,p.kind,p.vehicleType,p.name,p.brand,p.description,p.price,p.stock,p.sourceUrl,p.imageUrl,p.connector,p.cells,p.capacityMah,p.lengthMm,p.widthMm,p.heightMm,p.minCells,p.maxCells,p.batteryCount,JSON.stringify(p.tags),1];
}

export async function loadCatalog():Promise<CatalogProduct[]>{
  try{
    if(!env.DB) return seed;
    const count=await env.DB.prepare("SELECT COUNT(*) AS count FROM products").first<{count:number}>();
    if(!count?.count){
      const sql="INSERT OR IGNORE INTO products (id,kind,vehicle_type,name,brand,description,price,stock,source_url,image_url,connector,cells,capacity_mah,length_mm,width_mm,height_mm,min_cells,max_cells,battery_count,tags_json,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      await env.DB.batch(seed.map(p=>env.DB.prepare(sql).bind(...row(p))));
    }
    const result=await env.DB.prepare("SELECT id,kind,vehicle_type,name,brand,description,price,stock,source_url,image_url,connector,cells,capacity_mah,length_mm,width_mm,height_mm,min_cells,max_cells,battery_count,tags_json FROM products WHERE is_active = 1 ORDER BY kind DESC, price ASC").all();
    return result.results.map((r:any)=>({id:r.id,kind:r.kind,vehicleType:r.vehicle_type,name:r.name,brand:r.brand,description:r.description,price:r.price,stock:r.stock,sourceUrl:r.source_url,imageUrl:r.image_url,connector:r.connector,cells:r.cells,capacityMah:r.capacity_mah,lengthMm:r.length_mm,widthMm:r.width_mm,heightMm:r.height_mm,minCells:r.min_cells,maxCells:r.max_cells,batteryCount:r.battery_count,tags:JSON.parse(r.tags_json)}));
  }catch{
    return seed;
  }
}
