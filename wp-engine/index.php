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

// Blog MCP connector routing (blog-mcp.php). Two groups of paths have
// no physical file, so nginx sends them here:
//   /.well-known/oauth-*   OAuth discovery (fixed by spec)
//   /mcp, /mcp/<endpoint>  the connector's public clean URL - this is
//                          what people paste into claude.ai
$reqPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (file_exists(__DIR__ . '/blog-mcp.php')) {
    if (strpos($reqPath, '/.well-known/oauth-') === 0) {
        $_GET['p'] = (strpos($reqPath, 'protected-resource') !== false) ? 'pr-meta' : 'as-meta';
        require __DIR__ . '/blog-mcp.php';
        exit;
    }
    if ($reqPath === '/mcp' || strpos($reqPath, '/mcp/') === 0) {
        $rest = trim(substr($reqPath, 4), '/');           // "" | authorize | token | register
        if ($rest !== '') { $_GET['p'] = $rest; }
        require __DIR__ . '/blog-mcp.php';
        exit;
    }
    /* ROOT-level OAuth endpoints. Claude's connector ignores the
       endpoints our metadata advertises and calls issuer-root defaults
       instead - it POSTed /register and opened /authorize at the root,
       which the SPA fallback answered with HTML. That silent HTML is
       what produced "Couldn't register" (and why nothing ever reached
       blog-mcp.php's log). Serving them here makes that path work. */
    $rootOauth = array('authorize' => 1, 'token' => 1, 'register' => 1);
    $bare = strtolower(trim($reqPath, '/'));
    if (isset($rootOauth[$bare])) {
        $_GET['p'] = $bare;
        require __DIR__ . '/blog-mcp.php';
        exit;
    }
}

// 301s for OLD-site URLs (pre-2026 WordPress: /about-me, /portfolios/*,
// old blog slugs...). The map is generated from app/vercel.json - the
// repo's redirect source of truth - which WP Engine never reads (it is
// Vercel-only config), so without this lookup every old URL soft-404ed
// into the homepage. Runs AFTER the MCP/OAuth routing above (those
// paths are not in the map, but order keeps the invariant obvious) and
// BEFORE the SPA fallback. Real files never reach this file at all, so
// a map entry can never shadow a live page.
$redirectsFile = __DIR__ . '/redirects-map.php';
if (is_file($redirectsFile)) {
    $redirects = include $redirectsFile;
    $key = strtolower(trim($reqPath, '/'));
    if ($key !== '' && is_array($redirects) && isset($redirects[$key])) {
        // Absolute target = host + scheme canonicalisation in the same
        // single hop (http://www.../about-me -> https://ashkanstudios.com/studio/).
        $qs = (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '')
            ? '?' . $_SERVER['QUERY_STRING'] : '';
        header('Location: https://ashkanstudios.com' . $redirects[$key] . $qs, true, 301);
        exit;
    }
}

// OpenID Connect discovery: this site is an OAuth 2.1 server, NOT an
// OIDC provider. Clients commonly probe this path first; the SPA
// fallback was answering with 200 + HTML, which a client parses as a
// broken discovery document instead of falling back to
// oauth-authorization-server. Answer honestly with a JSON 404.
if (strpos($reqPath, '/.well-known/openid-configuration') === 0) {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo '{"error":"not_found","error_description":"Not an OpenID provider. Use /.well-known/oauth-authorization-server"}';
    exit;
}

http_response_code(200);
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
