// ────────────────────────────────────────────────────────────────
// Prerender: bake every sitemap route of the built SPA into static
// HTML (dist/<route>/index.html) so crawlers that don't execute
// JavaScript still see full content, per-page <title>/description/
// canonical, and real internal links.
//
// The technical SEO audit flagged the site-wide symptoms of a
// client-rendered SPA: "no canonical", "low word count", "orphan
// pages". Google renders JS, but this fixes it for EVERY crawler.
//
// Run AFTER `npx vite build` (from anywhere):
//   node prerender/prerender.mjs
//
// How it works:
//   1. Serves app/dist on a local port with an SPA fallback.
//   2. Playwright Chromium visits each route from dist/sitemap.xml,
//      blocking heavy third-party hosts (Vimeo/GTM/GA) so renders are
//      fast and deterministic.
//   3. Waits for the app to mount, then snapshots the rendered DOM
//      (head now contains the per-route title/meta/canonical that
//      src/lib/seo-meta.ts applied) into dist/<route>/index.html.
//   4. The root dist/index.html is replaced with the rendered home
//      page LAST, after all other routes are done.
// React re-mounts over the prerendered markup on load, so behaviour
// in real browsers is unchanged.
// ────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, "..", "app");
const DIST = path.join(APP, "dist");
const require = createRequire(path.join(APP, "package.json"));
const { chromium } = require("playwright");

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("app/dist/index.html not found - run `npx vite build` first.");
  process.exit(1);
}

// ── Routes from the sitemap (single source of truth) ──
const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
  .map((m) => m[1])
  .filter((p, i, a) => a.indexOf(p) === i);
console.log(`Routes to prerender: ${routes.length}`);

// Hosts that must not load during prerender (heavy, non-deterministic).
const BLOCKED = /vimeo|vimeocdn|googletagmanager|google-analytics|akamaized|doubleclick/;

// ── Tiny static server with SPA fallback ──
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".pdf": "application/pdf", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(DIST, urlPath);
  if (urlPath.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIST, "index.html"); // SPA fallback
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const PORT = 4573;
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
await context.route("**/*", (route) => {
  const u = route.request().url();
  if (BLOCKED.test(u)) return route.abort();
  return route.continue();
});
const page = await context.newPage();

const results = [];
let homeHtml = null;

for (const r of routes) {
  const url = `http://127.0.0.1:${PORT}${r}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // Wait for the SPA to mount real content, then let entrance
    // animations reach their (opacity-1) end state.
    await page.waitForSelector("#root h1, #root h2", { timeout: 15000 });
    await page.waitForTimeout(1800);
    let html = await page.evaluate(
      () => "<!doctype html>\n" + document.documentElement.outerHTML
    );
    // Freeze hero entrance animations at their END state. The snapshot
    // catches them as "opacity:0 + animation ... forwards" - invisible
    // until the animation runs, so in static form the hero never
    // painted and Lighthouse took the tiny header logo as the LCP
    // element (~13s simulated). With the entrance frozen visible, the
    // big hero text/cutouts paint with first render. React re-mounts
    // on load and replays the entrance as usual.
    html = html.replace(
      /style="([^"]*animation:[^"]*(?:heroSlideUp|cutoutFadeIn|fadeInUp|fadeIn)[^"]*)"/g,
      (_m, css) => {
        const fixed = css
          .replace(/animation:[^;"]*;? ?/, "")
          .replace(/opacity: ?0;? ?/, "opacity: 1; ");
        return `style="${fixed}"`;
      }
    );
    // Belt-and-braces: dev-inspect attributes must never ship - the
    // plugin is dev-server-only now (vite.config), but 640 of these
    // were 40KB = 27% of the home HTML when it leaked into a build.
    html = html.replace(/ code-path="[^"]*"/g, "");
    const stats = await page.evaluate(() => ({
      title: document.title.length,
      canonical: !!document.querySelector('link[rel="canonical"]'),
      anchors: document.querySelectorAll('a[href^="/"]').length,
      words: (document.body.innerText || "").split(/\s+/).filter(Boolean).length,
    }));
    if (r === "/") {
      homeHtml = html; // write last so the fallback shell survives until the end
    } else {
      const dir = path.join(DIST, r.replace(/^\/+|\/+$/g, ""));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), html);
    }
    results.push({ route: r, ...stats, ok: true });
    console.log(`OK  ${r}  (title:${stats.title}ch canonical:${stats.canonical} links:${stats.anchors} words:${stats.words})`);
  } catch (e) {
    results.push({ route: r, ok: false, err: String(e).slice(0, 120) });
    console.log(`FAIL ${r}: ${String(e).slice(0, 120)}`);
  }
}

if (homeHtml) fs.writeFileSync(path.join(DIST, "index.html"), homeHtml);

await browser.close();
server.close();

const ok = results.filter((x) => x.ok).length;
const noCanonical = results.filter((x) => x.ok && !x.canonical).map((x) => x.route);
const lowWords = results.filter((x) => x.ok && x.words < 150).map((x) => x.route);
console.log(`\nDone: ${ok}/${routes.length} prerendered.`);
if (noCanonical.length) console.log("Missing canonical:", noCanonical.join(", "));
if (lowWords.length) console.log("Low word count (<150):", lowWords.join(", "));
