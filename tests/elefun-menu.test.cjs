const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const menu=require('../data/elefun-menu.json');const shelves=require('../data/elefun-shelves.json');
const cache={};
function load(file){
  if(cache[file]) return cache[file].exports;
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  const mod=cache[file]={exports:{}};
  const req=name=>name==='@/data/elefun-menu.json'?menu:name==='@/data/elefun-shelves.json'?shelves:name.startsWith('./')?load(path.join(path.dirname(file),name+'.ts')):require(name);
  new Function('require','module','exports',js)(req,mod,mod.exports);
  return mod.exports;
}
const {megaMenu,columnsFor}=load('lib/elefun-menu.ts');
const {SHELF_CATEGORIES,INTERNAL_HREF}=load('lib/elefun-shelves.ts');
const walk=(nodes,fn)=>{for(const n of nodes){fn(n);walk(n.children??[],fn);}};

test('menu snapshot holds every Elefun main category, each linking back to elefun.no',()=>{
  assert.equal(menu.categories.length,20);
  walk(menu.categories,n=>{assert.ok(n.name,'navn mangler');assert.match(n.url,/^https:\/\/www\.elefun\.no\//);assert.ok(Number.isInteger(n.id));});
});

test('subcategories with children get their own column, loose links are grouped by headline',()=>{
  const batteri=menu.categories.find(c=>c.name==='Batteri & ladere');
  const cols=columnsFor(batteri);
  assert.deepEqual(cols.map(c=>c.title),['Ladere','Kontakter & kabling','Ladetilbehør','Li-Po Batterier','Ni-Mh Batterier','Batterier','Sikkerhet','Sender/mottaker batterier']);
  assert.deepEqual(cols.find(c=>c.title==='Sikkerhet').links.map(l=>l.name),['Batteristropper','Røykvarslere','Sikker ladebag for LiPo','Spesialbrannslukkere']);
});

test('long columns are capped and report how many links are hidden',()=>{
  for(const top of megaMenu())for(const col of top.columns) assert.ok(col.links.length<=9,`${top.name} / ${col.title}`);
  const lipo=columnsFor(menu.categories.find(c=>c.name==='Batteri & ladere')).find(c=>c.title==='Li-Po Batterier');
  assert.equal(lipo.links.length+lipo.more,11);
});

test('shelf products are real Elefun items with a price, image and product link',()=>{
  assert.ok(SHELF_CATEGORIES.length>=15);
  for(const c of SHELF_CATEGORIES){
    assert.ok(c.subs.length>=1&&c.subs.length<=4,c.name);
    assert.equal(new Set(c.subs.map(s=>s.slug)).size,c.subs.length,`${c.name}: like slugs`);
    for(const s of c.subs){
      assert.ok(s.products.length>=4&&s.products.length<=12,`${c.name} / ${s.name}`);
      for(const p of s.products){
        assert.match(p.url,/^https:\/\/www\.elefun\.no\/vare-\d+\//);
        assert.match(p.imageUrl,/^https:\/\/www\.elefun\.no\/bilder\/produktbilder\//);
        assert.ok(p.price>0);
        if(p.previousPrice) assert.ok(p.previousPrice>p.price);
      }
    }
  }
});

test('menu links point at our pages for every category that has a shelf',()=>{
  const tops=megaMenu();
  for(const c of SHELF_CATEGORIES){
    assert.equal(tops.find(t=>t.id===c.id).url,`/sortiment/${c.slug}`);
    for(const s of c.subs) assert.equal(INTERNAL_HREF.get(s.id),`/sortiment/${c.slug}/${s.slug}`);
  }
  const internal=tops.flatMap(t=>t.columns.flatMap(col=>col.links)).filter(l=>l.internal);
  assert.ok(internal.length>=SHELF_CATEGORIES.length);
  for(const l of internal) assert.match(l.url,/^\/sortiment\//);
});
