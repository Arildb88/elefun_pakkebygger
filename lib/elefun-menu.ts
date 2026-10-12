import menu from "@/data/elefun-menu.json";

export type ElefunMenuNode={id:number;name:string;url:string;icon?:string;group?:string;children?:ElefunMenuNode[]};
export type MenuLink={name:string;url:string};
export type MenuColumn={key:string;title:string;url?:string;icon?:string;links:MenuLink[];more:number};
export type MegaCategory={id:number;name:string;url:string;icon?:string;local?:{href:string;label:string};columns:MenuColumn[]};

const MAX_LINKS=9;

/** Elefun's own categories that also have a page in this store. */
const LOCAL:Record<string,{href:string;label:string}>={
  "Biler":{href:"/kategori/biler",label:"Se elektrobilene i pakkebyggeren"},
  "Båter":{href:"/kategori/baater",label:"Se elektrobåtene i pakkebyggeren"},
  "Droner":{href:"/kategori/droner",label:"Se kameradronene i pakkebyggeren"},
  "Fly":{href:"/kategori/fly",label:"Se elektroflyene i pakkebyggeren"},
  "Batteri & ladere":{href:"/kategori/batterier-og-ladere",label:"Se batterier og ladere i butikken"},
  "Radioutstyr":{href:"/kategori/kontrollere",label:"Se sendere og kontrollere i butikken"},
};

const link=(n:ElefunMenuNode):MenuLink=>({name:n.name,url:n.url});

/**
 * Subcategories with their own children become a column each. Elefun lists the rest as loose
 * links under a headline ("Tilbehør", "Batterier"), so those are collected into one column per headline.
 */
export function columnsFor(top:ElefunMenuNode):MenuColumn[]{
  const columns:MenuColumn[]=[];
  const loose=new Map<string,MenuColumn>();
  for(const c of top.children??[]){
    if(c.children?.length){
      columns.push({key:`c${c.id}`,title:c.name,url:c.url,icon:c.icon??top.icon,links:c.children.map(link),more:0});
      continue;
    }
    const title=c.group??top.name;
    let col=loose.get(title);
    if(!col){col={key:`g${c.id}`,title,icon:c.icon??top.icon,links:[],more:0};loose.set(title,col);columns.push(col);}
    col.links.push(link(c));
  }
  for(const col of columns){
    if(col.links.length>MAX_LINKS){col.more=col.links.length-MAX_LINKS+1;col.links=col.links.slice(0,MAX_LINKS-1);}
  }
  return columns;
}

export function megaMenu():MegaCategory[]{
  return (menu.categories as ElefunMenuNode[]).map(top=>({
    id:top.id,name:top.name,url:top.url,icon:top.icon,local:LOCAL[top.name],columns:columnsFor(top),
  }));
}

export const MENU_SOURCE={url:menu.source,fetchedAt:menu.fetchedAt};
