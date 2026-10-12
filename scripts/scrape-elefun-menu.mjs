// Henter kategoritreet fra Elefuns hovedmeny og lagrer det i data/elefun-menu.json.
// Kjør: node scripts/scrape-elefun-menu.mjs
import { writeFileSync } from "node:fs";

const BASE = "https://www.elefun.no/";

const res = await fetch(BASE, { headers: { "User-Agent": "Mozilla/5.0 (elefun-pakkebygger studentprosjekt)" } });
if (!res.ok) throw new Error(`elefun.no svarte ${res.status}`);
const bytes = new Uint8Array(await res.arrayBuffer());
const headerCharset = /charset=([\w-]+)/i.exec(res.headers.get("content-type") ?? "")?.[1];
const probe = new TextDecoder("latin1").decode(bytes.slice(0, 4096));
const metaCharset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(probe)?.[1];
const html = new TextDecoder(headerCharset ?? metaCharset ?? "utf-8").decode(bytes);

const decode = s => s
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ").trim();
const absolute = href => new URL(href.replace(/^(\.\.\/)+/, ""), BASE).href;

/** Innholdet i én menycontainer, fra åpningstaggen fram til neste containers dim-element. */
function containerBody(id) {
  const start = html.indexOf(`<div id="${id}" class="em_child">`);
  if (start < 0) return "";
  const end = html.indexOf('class="em_dimclick', start);
  return html.slice(start, end < 0 ? undefined : end);
}

const ITEM = /<div class="em_headline">([\s\S]*?)<\/div>|<a href="([^"]+)"[^>]*class="em_link"[^>]*>\s*<div id="([^"]+)" class="em_button[^"]*">([\s\S]*?)<\/a>|<div id="([^"]+)" class="em_button em_childopen[^"]*">([\s\S]*?<div class="em_button_text">[\s\S]*?<\/div>)/g;
const label = inner => decode(/<div class="em_button_text">([\s\S]*?)<\/div>/.exec(inner)?.[1] ?? "");
/** Elefun slår opp kategorier på ID alene, så noder uten egen lenke i menyen får /kategori-<id>. */
const iconOf = inner => /<i class="fa-[a-z]+ fa-([a-z0-9-]+)/.exec(inner)?.[1] ?? /icon_([a-z0-9]+)\.png/.exec(inner)?.[1];
const categoryId = domId => Number(/_?m(\d+)$/.exec(domId)?.[1]);
const byId = id => `${BASE}kategori-${id}`;

function parseChildren(containerId, depth) {
  const body = containerBody(containerId);
  const nodes = [];
  let group;
  for (const m of body.matchAll(ITEM)) {
    if (m[1] !== undefined) { group = decode(m[1]); continue; }
    if (m[2]) {
      const name = label(m[4]);
      if (!name) continue;
      const icon = iconOf(m[4]);
      nodes.push({ id: categoryId(m[3]), name, url: absolute(m[2]), ...(icon ? { icon } : {}), ...(group ? { group } : {}) });
      continue;
    }
    const name = label(m[6]);
    const id = categoryId(m[5]);
    const icon = iconOf(m[6]);
    const children = depth < 4 ? parseChildren(`${m[5]}c`, depth + 1) : [];
    nodes.push({ id, name, url: byId(id), ...(icon ? { icon } : {}), ...(group ? { group } : {}), children });
  }
  return nodes;
}

const mainStart = html.indexOf('id="em_main"');
const mainEnd = html.indexOf('class="em_dimclick', mainStart);
const top = [];
for (const m of html.slice(mainStart, mainEnd).matchAll(/<div id="(em_m\d+)" class="em_button em_childopen[^"]*">([\s\S]*?<div class="em_button_text">[\s\S]*?<\/div>)/g)) {
  const name = label(m[2]);
  const children = parseChildren(`${m[1]}c`, 1);
  const landing = children.find(c => c.url && /^Topplister/i.test(c.name));
  const pagelink = [...html.matchAll(/<a href="([^"]+)"><div class="pagelink[^"]*">[\s\S]*?<div>([^<]+)<\/div>/g)]
    .find(p => decode(p[2]).toLowerCase() === name.toLowerCase());
  const id = categoryId(m[1]);
  const icon = iconOf(m[2]);
  top.push({
    id,
    name,
    ...(icon ? { icon } : {}),
    url: landing?.url ?? (pagelink ? absolute(pagelink[1]) : byId(id)),
    children: children.filter(c => c !== landing),
  });
}

const count = nodes => nodes.reduce((n, c) => n + 1 + count(c.children ?? []), 0);
writeFileSync(new URL("../data/elefun-menu.json", import.meta.url), JSON.stringify({
  source: BASE,
  fetchedAt: new Date().toISOString().slice(0, 10),
  categories: top,
}, null, 2) + "\n");
console.log(`Lagret ${top.length} hovedkategorier og ${count(top)} kategorier totalt.`);
