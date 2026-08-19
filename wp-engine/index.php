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

/* ── /sitemap-blog.xml ────────────────────────────────────────────
   Blog posts are written in /admin after a deploy, so they can never
   be in the static sitemap the build produces - which is why none of
   them were being submitted to Google. sitemap.xml is now an index
   pointing at sitemap-pages.xml (static) and this file, generated
   from the same store the blog reads, so a new post is discoverable
   the moment it publishes.

   Only published posts are listed; drafts and not-yet-due scheduled
   posts are skipped, matching what the public blog shows. */
if ($reqPath === '/sitemap-blog.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    $posts = storytime_posts();
    $now = gmdate('c');
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    // the blog index itself lives in sitemap-pages.xml, so only posts here
    foreach ($posts as $p) {
        $status = isset($p['status']) ? $p['status'] : 'published';
        if ($status !== 'published') { continue; }
        if (!empty($p['publishAt']) && $p['publishAt'] > $now) { continue; }
        if (empty($p['slug']) || !preg_match('/^[a-z0-9-]+$/', $p['slug'])) { continue; }
        $lastmod = '';
        foreach (array('updatedAt', 'createdAt') as $k) {
            if (!empty($p[$k])) { $ts = strtotime($p[$k]); if ($ts) { $lastmod = gmdate('Y-m-d', $ts); } break; }
        }
        echo "  <url><loc>https://ashkanstudios.com/storytime/" . htmlspecialchars($p['slug'], ENT_QUOTES, 'UTF-8') . "/</loc>";
        if ($lastmod !== '') { echo "<lastmod>" . $lastmod . "</lastmod>"; }
        echo "<changefreq>monthly</changefreq><priority>0.7</priority></url>\n";
    }
    echo "</urlset>\n";
    exit;
}

/* ── Per-post SEO tags for /storytime/<slug>/ ──────────────────────
   Blog posts are written in /admin AFTER the build, so the prerender
   pass never sees them and this fallback served the homepage shell:
   raw source showed the HOME title, the HOME description and
   <link rel="canonical" href="https://ashkanstudios.com/">. The React
   app corrects all three on mount, but a crawler reading the raw HTML
   sees a post that declares itself a duplicate of the homepage - which
   tells Google not to index the blog at all (client report 2026-08-10).

   So: look the post up in the same store blog-api.php writes, and
   rewrite the four head tags before sending the shell. Everything is
   best-effort - any miss (no store, unknown slug, unpublished post,
   tag not found) falls through to the untouched index.html, exactly
   what this file did before. */
function storytime_slug($path) {
    if (strpos($path, '/storytime/') !== 0) { return ''; }
    $rest = trim(substr($path, strlen('/storytime/')), '/');
    // index page itself is prerendered; nested paths are not posts
    if ($rest === '' || strpos($rest, '/') !== false) { return ''; }
    return preg_match('/^[a-z0-9-]+$/', $rest) ? $rest : '';
}

/* Every post in the store, or an empty array. Mirrors blog-api.php's
   storage ladder - kept as a local copy on purpose, because including
   blog-api.php would run a whole API request. */
function storytime_posts() {
    static $cache = null;
    if ($cache !== null) { return $cache; }
    if (!defined('BLOG_ADMIN_PASSWORD_FOR_LOOKUP')) {
        // Same value blog-api.php uses; only the data-file name is
        // derived from it here, never compared against user input.
        define('BLOG_ADMIN_PASSWORD_FOR_LOOKUP', 'SET_A_PASSWORD_' . 'BEFORE_UPLOAD');
    }
    $suffix = substr(hash('sha256', 'ashkan-posts|' . BLOG_ADMIN_PASSWORD_FOR_LOOKUP), 0, 12);
    $ladder = array();
    if (is_dir(__DIR__ . '/_wpeprivate')) {
        $ladder[] = __DIR__ . '/_wpeprivate/ashkan-blog-data.json';
    }
    $ladder[] = __DIR__ . '/blog-data/posts-' . $suffix . '.json';
    $ladder[] = __DIR__ . '/blog-data.php';

    foreach ($ladder as $file) {
        if (!is_file($file)) { continue; }
        $txt = @file_get_contents($file);
        if ($txt === false) { continue; }
        if (strpos($txt, '<?php') === 0) {          // webroot variant is PHP-guarded
            $nl  = strpos($txt, "\n");
            $txt = $nl === false ? '' : substr($txt, $nl + 1);
        }
        $posts = json_decode($txt, true);
        if (is_array($posts)) { $cache = $posts; return $cache; }
    }
    $cache = array();
    return $cache;
}

function storytime_post($slug) {
    foreach (storytime_posts() as $p) {
        if (!isset($p['slug']) || $p['slug'] !== $slug) { continue; }
        // Drafts and not-yet-due scheduled posts are not public, so
        // they keep the generic shell (the SPA 404s them anyway).
        $status = isset($p['status']) ? $p['status'] : 'published';
        if ($status !== 'published') { return null; }
        return $p;
    }
    return null;                                     // slug not in the store
}

$slug = storytime_slug($reqPath);
$post = $slug !== '' ? storytime_post($slug) : null;

if ($post !== null) {
    $html = @file_get_contents(__DIR__ . '/index.html');
    if ($html !== false) {
        $esc   = function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
        $title = $esc($post['title']) . ' | Ashkan Studios';
        $descRaw = '';
        if (!empty($post['metaDescription'])) { $descRaw = $post['metaDescription']; }
        elseif (!empty($post['excerpt']))     { $descRaw = $post['excerpt']; }
        // mbstring is standard on WP Engine, but blog-api.php guards it
        // too - keep the same fallback so a host without it never fatals.
        $descRaw = trim(preg_replace('/\s+/', ' ', $descRaw));
        $desc = $esc(function_exists('mb_substr') ? mb_substr($descRaw, 0, 160) : substr($descRaw, 0, 160));
        $url  = 'https://ashkanstudios.com/storytime/' . $slug . '/';
        $img  = '';
        if (!empty($post['image'])) {
            $img = (strpos($post['image'], 'http') === 0)
                ? $post['image']
                : 'https://ashkanstudios.com' . $post['image'];
        }

        // Replace only the specific tags, leaving the rest of the head
        // byte-identical. preg_replace with a count of 1 so a stray
        // match later in the document can never be rewritten.
        $sub = function ($pattern, $replacement, $subject) {
            $out = preg_replace($pattern, str_replace('$', '\$', $replacement), $subject, 1, $n);
            return ($out === null || $n === 0) ? $subject : $out;
        };
        $html = $sub('#<title>.*?</title>#is', '<title>' . $title . '</title>', $html);
        $html = $sub('#<link rel="canonical"[^>]*>#i', '<link rel="canonical" href="' . $url . '">', $html);
        if ($desc !== '') {
            $html = $sub('#<meta name="description"[^>]*>#i', '<meta name="description" content="' . $desc . '">', $html);
            $html = $sub('#<meta property="og:description"[^>]*>#i', '<meta property="og:description" content="' . $desc . '">', $html);
            $html = $sub('#<meta name="twitter:description"[^>]*>#i', '<meta name="twitter:description" content="' . $desc . '">', $html);
        }
        $html = $sub('#<meta property="og:title"[^>]*>#i', '<meta property="og:title" content="' . $title . '">', $html);
        $html = $sub('#<meta name="twitter:title"[^>]*>#i', '<meta name="twitter:title" content="' . $title . '">', $html);
        $html = $sub('#<meta property="og:url"[^>]*>#i', '<meta property="og:url" content="' . $url . '">', $html);
        // A post is an article, not the site's front page.
        $html = $sub('#<meta property="og:type"[^>]*>#i', '<meta property="og:type" content="article">', $html);
        if ($img !== '') {
            $html = $sub('#<meta property="og:image"[^>]*>#i', '<meta property="og:image" content="' . $esc($img) . '">', $html);
            $html = $sub('#<meta name="twitter:image"[^>]*>#i', '<meta name="twitter:image" content="' . $esc($img) . '">', $html);
        }

        http_response_code(200);
        header('Content-Type: text/html; charset=UTF-8');
        echo $html;
        exit;
    }
}

http_response_code(200);
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
