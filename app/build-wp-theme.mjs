// Assembles a WordPress "wrapper" theme from the Vite production build.
// The compiled React app (assets/, images/) is served from the WordPress
// site ROOT; this theme's index.php is the shell that boots it and WP
// routing falls through to it for every front-end URL (so the React
// client-side router handles deep links like /work/photography/).
//
// Run AFTER `npx vite build`:   node build-wp-theme.mjs
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "wp-theme-dist");
const THEME = path.join(OUT, "ashkan-studios");

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("dist/index.html not found. Run `npx vite build` first.");
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(THEME, { recursive: true });

// ---- index.php : built index.html + WP hooks ----
let html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
html = html
  .replace(/<\/head>/i, "    <?php wp_head(); ?>\n  </head>")
  .replace(/<\/body>/i, "    <?php wp_footer(); ?>\n  </body>");
const indexPhp =
  "<?php if (!defined('ABSPATH')) { exit; } status_header(200); ?>\n" + html;
fs.writeFileSync(path.join(THEME, "index.php"), indexPhp);

// ---- style.css : theme header (required by WP) ----
fs.writeFileSync(
  path.join(THEME, "style.css"),
  `/*
Theme Name: Ashkan Studios
Theme URI: https://ashkanstudios.com
Author: Incrementors
Description: Ashkan Studios production site. The compiled React/Vite app is served from the site root; this theme is the shell that boots it. Pixel-identical to the live build.
Version: 1.0.0
Requires at least: 6.0
Requires PHP: 7.4
*/
`
);

// ---- functions.php : SPA routing glue ----
fs.writeFileSync(
  path.join(THEME, "functions.php"),
  `<?php
if (!defined('ABSPATH')) { exit; }

/**
 * Ashkan Studios - React SPA wrapper theme.
 * WordPress falls through to index.php for every front-end URL so the
 * client-side router (React) can handle deep links like /work/photography/.
 */

// Don't let WordPress canonical-redirect SPA routes (it would bounce or
// reshape paths like /work/photography/ that have no matching WP page).
remove_action('template_redirect', 'redirect_canonical');

// Any unknown front-end path is a real React route -> return HTTP 200,
// not 404, so browsers and crawlers treat it as a page.
add_action('template_redirect', function () {
    if (is_admin()) { return; }
    if (is_404()) { status_header(200); }
}, 1);

// Keep the <head> clean (matches the original build). Optional.
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
`
);

console.log("Theme assembled at:", THEME);
console.log("Files:", fs.readdirSync(THEME).join(", "));
console.log("\nRoot-upload source = dist/  (assets/, images/, robots.txt, sitemap.xml)");
