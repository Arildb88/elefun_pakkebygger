import { loadCatalog } from "@/lib/catalog";
import Configurator from "./configurator";

export const dynamic = "force-dynamic";

export default async function Home(){
  try{
    const products=await loadCatalog();
    return <Configurator products={products}/>;
  }catch{
    return <main className="database-error"><h1>Produktdatabasen er midlertidig utilgjengelig</h1><p>Prøv å laste siden på nytt om et øyeblikk.</p></main>;
  }
}
