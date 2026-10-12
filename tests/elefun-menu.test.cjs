const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');
const menu=require('../data/elefun-menu.json');
const js=ts.transpileModule(fs.readFileSync('lib/elefun-menu.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const mod={exports:{}};new Function('require','module','exports',js)(name=>name==='@/data/elefun-menu.json'?menu:require(name),mod,mod.exports);
const {megaMenu,columnsFor}=mod.exports;
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
