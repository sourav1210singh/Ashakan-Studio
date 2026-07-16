<?php
// ────────────────────────────────────────────────────────────────
// WP Engine SPA fallback for the static React build.
//
// WP Engine routes every not-found request to /index.php
// (WordPress-style rewrite). Real files — /, /assets/*, the 44
// prerendered route folders, contact.php, blog-api.php — are served
// by nginx directly and never reach this file. Only paths with no
// physical file land here: /admin/*, new /storytime/<slug>/ posts,
// and unknown URLs.
//
// It must always serve the CURRENT index.html, read at request time.
// (The previous router on the server read a frozen copy named
// "index.html-OFF", so every deploy left the SPA fallback serving a
// stale build — /admin/ rendered the old bundle with no admin route.)
//
// Deploy: ship this file in the webroot next to index.html.
// ────────────────────────────────────────────────────────────────
http_response_code(200);
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
