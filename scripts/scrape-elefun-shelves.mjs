// Henter et begrenset produktutvalg fra Elefuns kategorisider og lagrer det i data/elefun-shelves.json.
// Bygger på kategoritreet i data/elefun-menu.json. Kjør: node scripts/scrape-elefun-shelves.mjs
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://www.elefun.no/";
const SUBS_PER_CATEGORY = 4;
const PRODUCTS_PER_SUB = 12;
const MAX_ATTEMPTS = 10;

const menu = JSON.parse(readFileSync(new URL("../data/elefun-menu.json", import.meta.url), "utf8"));

const slugify = s => s.toLowerCase()
  .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
  .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const text = s => s
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/\s+/g, " ").trim();
const absolute = href => new URL(href.replace(/^(\.\.\/)+/, ""), BASE).href;
const kroner = s => {
  const m = /([\d.]+)(?:,(\d{1,2}))?/.exec(s.replace(/\s/g, ""));
  return m ? Number(m[1].replace(/\./g, "")) + (m[2] && m[2] !== "-" ? Number(m[2]) / 100 : 0) : null;
};

/** Elefuns egen tolkning av lagerkoden "status|antall|kategori" (miniscripts.js, category_stock). */
function stockOf(code) {
  const [status, qtyRaw] = code.split("|");
  const qty = Number(qtyRaw);
  if ((status === "3" || status === "1") && qty > 0) {
    const label = qty <= 3 ? `${qty} på lager` : qty <= 10 ? "4–10 på lager" : qty <= 25 ? "10–25 på lager"
      : qty <= 50 ? "25+ på lager" : qty <= 100 ? "50+ på lager" : "100+ på lager";
    return { inStock: true, label };
  }
  if (status === "1" || status === "2") return { inStock: false, label: "Snart tilgjengelig" };
  if (status === "3") return { inStock: false, label: "Usikker leveringstid" };
  if (status === "0") return { inStock: false, label: qty > 0 ? "Snart tilgjengelig" : "Utsolgt" };
  if (status === "4") return { inStock: false, label: "Kun i butikk" };
  if (status === "5") return { inStock: false, label: "Utgått" };
  if (status === "7") return { inStock: true, label: "Pakke med flere varer" };
  return { inStock: true, label: "På lager" };
}

function parseProducts(html) {
  const cards = html.split('<div id="c-p').slice(1);
  return cards.map(card => {
    const id = /^(\d+)"/.exec(card)?.[1];
    const href = /<div class="category_prod_name">\s*<a href='([^']+)'/.exec(card)?.[1];
    const name = text(/<div class="category_prod_name">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/.exec(card)?.[1] ?? "");
    const thumb = /<div class="category_prod_pic">\s*<img src='([^']+)'/.exec(card)?.[1];
    const brand = text(/<a href="[^"]*produsent-[^"]*">\s*Produsent ([\s\S]*?)<\/a>/.exec(card)?.[1] ?? "") || null;
    const price = kroner(/<div class="category_price_current">\s*<span>kr <\/span>([^<]+)/.exec(card)?.[1] ?? "");
    const prev = /class="category_price_previous" style="([^"]*)">\s*<span class="category_price_previoustxt">([^<|]*)\|?<\/span><span class="category_price_previousprice">([^<]*)/.exec(card);
    const previousPrice = prev && !prev[1].includes("hidden") ? kroner(prev[3]) : null;
    const reviews = Number(/<span>\((\d+)\)<\/span>/.exec(card)?.[1] ?? 0);
    const stockCode = /class="category_stock category_stock_position">\s*([^<]*)</.exec(card)?.[1]?.trim() ?? "";
    if (!id || !href || !name || !price) return null;
    return {
      id, name, brand, price,
      ...(previousPrice && previousPrice > price ? { previousPrice } : {}),
      imageUrl: thumb ? absolute(thumb) : null,
      url: absolute(href),
      stock: stockOf(stockCode),
      reviews,
    };
  }).filter(Boolean);
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (elefun-pakkebygger studentprosjekt)" } });
  if (!res.ok) throw new Error(`${url} svarte ${res.status}`);
  return res.text();
}
const pause = ms => new Promise(r => setTimeout(r, ms));

/** Bladkategorier fordelt over kolonnene, slik at utvalget dekker ulike deler av hovedkategorien. */
function candidates(top) {
  const lists = top.children
    .map(c => c.children?.length ? { column: c.name, leaves: c.children.filter(l => !l.children?.length) } : { column: c.group, leaves: [c] })
    .filter(l => l.leaves.length);
  const out = [];
  for (let i = 0; out.length < MAX_ATTEMPTS && lists.some(l => l.leaves[i]); i++)
    for (const { column, leaves } of lists) if (leaves[i] && out.length < MAX_ATTEMPTS) out.push({ leaf: leaves[i], column });
  return out;
}

/**
 * Elefun's default listing is grouped by brand, so the first page is often one brand only.
 * Pick in-stock items first, the most reviewed first, taking one brand at a time.
 */
function curate(products) {
  const ranked = [...products].sort((a, b) => Number(b.stock.inStock) - Number(a.stock.inStock) || b.reviews - a.reviews);
  const byBrand = new Map();
  for (const p of ranked) {
    const key = p.brand ?? "";
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key).push(p);
  }
  const queues = [...byBrand.values()];
  const picked = [];
  while (picked.length < PRODUCTS_PER_SUB && queues.some(q => q.length)) {
    const round = queues.filter(q => q.length).map(q => q.shift());
    round.sort((a, b) => Number(b.stock.inStock) - Number(a.stock.inStock) || b.reviews - a.reviews);
    picked.push(...round.slice(0, PRODUCTS_PER_SUB - picked.length));
  }
  return picked;
}

const categories = [];
// Elefun lists some subcategories under several main categories; each gets one page, under the first.
const usedSubs = new Set();
for (const top of menu.categories) {
  const subs = [];
  const seenProducts = new Set();
  for (const { leaf, column } of candidates(top)) {
    if (subs.length >= SUBS_PER_CATEGORY) break;
    if (usedSubs.has(leaf.id) || !/\/(kategori|filter)-\d+/.test(leaf.url)) continue;
    let products;
    try { products = parseProducts(await fetchPage(leaf.url)); } catch (e) { console.warn(e.message); continue; }
    await pause(250);
    const fresh = products.filter(p => !seenProducts.has(p.id));
    const picked = curate(fresh);
    if (picked.length < 4) continue;
    picked.forEach(p => seenProducts.add(p.id));
    usedSubs.add(leaf.id);
    let slug = slugify(leaf.name);
    if (subs.some(s => s.slug === slug)) slug = `${slug}-${leaf.id}`;
    subs.push({ id: leaf.id, slug, name: leaf.name, ...(column && column !== leaf.name ? { column } : {}), sourceUrl: leaf.url, total: products.length, products: picked });
  }
  categories.push({ id: top.id, slug: slugify(top.name), name: top.name, icon: top.icon, sourceUrl: top.url, subs });
  console.log(`${top.name}: ${subs.map(s => `${s.name} (${s.products.length})`).join(", ") || "ingen"}`);
}

writeFileSync(new URL("../data/elefun-shelves.json", import.meta.url), JSON.stringify({
  source: BASE,
  fetchedAt: new Date().toISOString().slice(0, 10),
  categories,
}, null, 2) + "\n");
const n = categories.reduce((a, c) => a + c.subs.reduce((b, s) => b + s.products.length, 0), 0);
console.log(`Lagret ${categories.length} kategorier, ${categories.reduce((a, c) => a + c.subs.length, 0)} underkategorier og ${n} produkter.`);
