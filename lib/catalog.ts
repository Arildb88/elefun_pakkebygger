import "server-only";
import { env } from "cloudflare:workers";
import snapshot from "@/data/catalog-snapshot.json";
import type { CatalogProduct } from "./catalog-types";
export type { CatalogProduct } from "./catalog-types";
const seed=snapshot as CatalogProduct[];
const revision="elefun-20-models-2026-10-10-v1";
export async function loadCatalog():Promise<CatalogProduct[]>{
  try {
    const db=env.DB;
    if(!db) return seed;
    await db.prepare("CREATE TABLE IF NOT EXISTS catalog_revisions (id TEXT PRIMARY KEY)").run();
    const loaded=await db.prepare("SELECT id FROM catalog_revisions WHERE id=?").bind(revision).first();
    if(!loaded){
      const sql="INSERT OR REPLACE INTO products (id,kind,vehicle_type,name,brand,description,price,stock,source_url,image_url,connector,cells,capacity_mah,length_mm,width_mm,height_mm,min_cells,max_cells,battery_count,tags_json,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      // Replace only this prototype's seeded catalog, preserving unrelated database rows.
      const oldIds=['arrma-senton-223s','mjx-hyper-go-73081','traxxas-rustler-30488','udi-venom-28768','proboat-miss-illinois-75083','proboat-jetstream','spektrum-2s-5000-ic5','spektrum-3s-5000-ic5','spektrum-4s-5000-ic5','gensace-2s-5000-xt60','bronto-2s-5200-tplug','mjx-2s-3000-tplug','udi-2s-1100-xh','traxxas-2s-5800-trx','oversize-4s-7000-ic5','charger-smart'];
      await db.batch([
        ...oldIds.map(id=>db.prepare("UPDATE products SET is_active=0 WHERE id=?").bind(id)),
        ...seed.map(p=>db.prepare(sql).bind(p.id,p.kind,p.vehicleType,p.name,p.brand,p.description,p.price,p.stock,p.sourceUrl,p.imageUrl,p.connector,p.cells,p.capacityMah,p.lengthMm,p.widthMm,p.heightMm,p.minCells,p.maxCells,p.batteryCount,JSON.stringify(p.tags),1)),
        db.prepare("INSERT OR IGNORE INTO catalog_revisions (id) VALUES (?)").bind(revision)
      ]);
    }
    const result=await db.prepare("SELECT * FROM products WHERE is_active=1").all<Record<string,unknown>>();
    const ids=new Set(seed.map(p=>p.id));
    return result.results.filter(r=>ids.has(String(r.id))).map(r=>({id:String(r.id),kind:r.kind as CatalogProduct['kind'],vehicleType:r.vehicle_type as string|null,name:String(r.name),brand:String(r.brand),description:String(r.description),price:Number(r.price),stock:Number(r.stock),sourceUrl:r.source_url as string|null,imageUrl:r.image_url as string|null,connector:r.connector as string|null,cells:r.cells as number|null,capacityMah:r.capacity_mah as number|null,lengthMm:r.length_mm as number|null,widthMm:r.width_mm as number|null,heightMm:r.height_mm as number|null,minCells:r.min_cells as number|null,maxCells:r.max_cells as number|null,batteryCount:Number(r.battery_count),tags:JSON.parse(String(r.tags_json))}));
  } catch { return seed; }
}
