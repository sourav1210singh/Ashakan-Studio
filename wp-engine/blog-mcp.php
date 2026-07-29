<?php
// ────────────────────────────────────────────────────────────────
// Ashkan Studios — OAuth-secured remote MCP connector (standalone PHP).
//
// A shareable claude.ai "custom connector": whoever adds it must sign
// in with a username + password, then Claude can write and publish
// Storytime blog posts. Lives on the same WP Engine webroot as
// blog-api.php / contact.php and reaches the blog through blog-api.php.
//
// Full OAuth 2.1 (Dynamic Client Registration + PKCE + a hosted login
// page + authorization_code / refresh_token grants). All codes/tokens
// are stateless HMAC-signed, so there's nothing to store — rotating
// MCP_OAUTH_SECRET invalidates every issued token at once.
//
// SETUP (one time, set the 5 defines below then upload to the webroot):
//   BLOG_ADMIN_PASSWORD  = same as the /admin login
//   MCP_OAUTH_SECRET     = a long random string (token signing key)
//   MCP_LOGIN_USER       = the connector username you choose
//   MCP_LOGIN_PASS       = the connector password you choose
//   OPENAI_API_KEY       = OpenAI key (only image generation needs it)
// Also upload the updated index.php (routes the two /.well-known/ paths
// here). Connector URL to give people:
//   https://ashkanstudios.com/blog-mcp.php
//
// Endpoints (dispatched by ?p=):
//   (default)  POST  MCP JSON-RPC (Bearer-gated)
//   ?p=as-meta       GET  authorization-server metadata
//   ?p=pr-meta       GET  protected-resource metadata
//   ?p=register      POST dynamic client registration
//   ?p=authorize     GET  login page | POST check creds -> code
//   ?p=token         POST code/refresh -> tokens
// ────────────────────────────────────────────────────────────────

define('BLOG_ADMIN_PASSWORD', 'SET_A_PASSWORD_BEFORE_UPLOAD');
define('MCP_OAUTH_SECRET',    'SET_OAUTH_SECRET_BEFORE_UPLOAD');
define('MCP_LOGIN_USER',      'SET_LOGIN_USER_BEFORE_UPLOAD');
define('MCP_LOGIN_PASS',      'SET_LOGIN_PASS_BEFORE_UPLOAD');
// Simple alternative to OAuth: a client that can send a custom header
// (X-MCP-Secret, or Authorization: Bearer <this value>) skips the whole
// OAuth flow. Whoever holds this value can publish - treat it like a
// password. OAuth still works too; this is just an easier second door.
define('MCP_SHARED_SECRET',   'SET_SHARED_SECRET_BEFORE_UPLOAD');
// Pre-registered client id, for clients that can't complete Dynamic
// Client Registration (claude.ai offers "add an OAuth Client ID in the
// connector settings" when its DCR call fails). Paste this value there
// and the OAuth flow proceeds with no registration step. Redirect URIs
// are restricted to Anthropic's own domains, so it can't be abused as
// an open redirect.
define('MCP_MANUAL_CLIENT_ID', 'ashkan-blog-connector');
define('OPENAI_API_KEY',      '');

$SITE = 'https://ashkanstudios.com';
$API  = $SITE . '/blog-api.php';

$ACCESS_TTL  = 24 * 3600;
$REFRESH_TTL = 90 * 24 * 3600;
$CODE_TTL    = 300;
$CID_TTL     = 180 * 24 * 3600;

header('Cache-Control: no-store');
// WP Engine + Cloudflare both OVERRODE no-store and cached the GET
// metadata (as-meta) for 10 min, so a deployed metadata change kept
// serving the stale version and the OAuth client saw old endpoints.
// Both caches skip any response that sets a cookie (they treat it as
// per-user) - so this harmless cookie forces every response fresh.
header('Set-Cookie: mcp_nc=1; Path=/; HttpOnly; SameSite=Lax');

// Capture the raw request body ONCE (php://input isn't reliably
// re-readable); everything below reuses this.
$GLOBALS['__RAW'] = file_get_contents('php://input');

// ── CORS ────────────────────────────────────────────────────────
// claude.ai's web app runs the OAuth discovery / registration / token
// calls from the BROWSER, so every endpoint must allow cross-origin
// requests, answer the preflight, and expose WWW-Authenticate (the
// browser reads the resource_metadata URL out of it). Without this the
// connector fails at "Couldn't register" even though the endpoints work
// from a server. Bearer auth (no cookies) means "*" is safe here.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type, mcp-protocol-version, mcp-session-id, x-mcp-secret');
header('Access-Control-Expose-Headers: WWW-Authenticate, mcp-session-id');
header('Access-Control-Max-Age: 86400');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── TEMP debug logging (remove after diagnosing the connector) ──
// Captures exactly what the OAuth client sends. Read it back with
//   GET /blog-mcp.php?p=_dbg&k=<MCP_OAUTH_SECRET>
// Writes to a PHP-created dir (always writable), unguessable filename.
define('MCP_DEBUG', true);
function dbg_file() {
    $dir = __DIR__ . '/blog-data';
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); @file_put_contents($dir . '/index.php', "<?php http_response_code(404); exit;\n"); }
    // .json, not .log: WP Engine restricts which extensions PHP may
    // write in the webroot, and the .log writes silently stopped.
    return $dir . '/mcp-debug-' . substr(hash('sha256', 'dbg|' . MCP_OAUTH_SECRET), 0, 12) . '.json';
}
if (MCP_DEBUG && ($_GET['p'] ?? '') === '_dbg') {
    header('Content-Type: text/plain; charset=utf-8');
    if (($_GET['k'] ?? '') !== MCP_OAUTH_SECRET) { http_response_code(403); exit('no'); }
    $f = dbg_file();
    $old = preg_replace('/\.json$/', '.log', $f);
    // Report WHY a write failed, not just its result.
    echo "file: $f\n"
        . "exists: " . (file_exists($f) ? 'y' : 'n')
        . " | file-writable: " . (file_exists($f) && is_writable($f) ? 'y' : 'n')
        . " | dir-writable: " . (is_writable(dirname($f)) ? 'y' : 'n')
        . " | probe: " . (@file_put_contents($f, "", FILE_APPEND) !== false ? 'ok' : 'FAILED') . "\n"
        . "---\n";
    if (file_exists($old)) { echo "[older .log file]\n" . file_get_contents($old) . "---\n"; }
    echo file_exists($f) ? file_get_contents($f) : '(empty)';
    if (isset($_GET['clear'])) { @unlink($f); @unlink($old); }
    exit;
}
if (MCP_DEBUG) {
    $entry = array(
        't'      => gmdate('H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'] ?? '',
        'uri'    => $_SERVER['REQUEST_URI'] ?? '',
        'p'      => mcp_endpoint(),
        'origin' => $_SERVER['HTTP_ORIGIN'] ?? '',
        'ua'     => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 60),
        'ctype'  => $_SERVER['HTTP_CONTENT_TYPE'] ?? '',
        'hasAuth'=> isset($_SERVER['HTTP_AUTHORIZATION']) ? 'y' : 'n',
        'body'   => substr($GLOBALS['__RAW'], 0, 600),
    );
    @file_put_contents(dbg_file(), json_encode($entry) . "\n", FILE_APPEND | LOCK_EX);
}

// Which endpoint is this request for? Supports BOTH a clean path
// (/blog-mcp.php/register) and the ?p= query form. Anthropic's OAuth
// client mishandles a registration_endpoint that carries a query
// string, so the metadata now advertises the clean-path form; ?p= is
// kept for the index.php-routed .well-known paths and back-compat.
function mcp_endpoint() {
    if (isset($_GET['p']) && $_GET['p'] !== '') return $_GET['p'];
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (preg_match('#/blog-mcp\.php/([a-z_-]+)#', (string) $path, $m)) return $m[1];
    return '';
}

// ── crypto / token helpers ──────────────────────────────────────
function b64url($bin) {
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}
function b64url_decode($s) {
    return base64_decode(strtr($s, '-_', '+/'));
}
function jwt_sign($type, $payload, $ttl) {
    $payload['iat'] = time();
    $payload['exp'] = time() + $ttl;
    $head = $type . '.' . b64url(json_encode($payload));
    $sig  = b64url(hash_hmac('sha256', $head, MCP_OAUTH_SECRET, true));
    return $head . '.' . $sig;
}
function jwt_verify($type, $token) {
    if (!is_string($token)) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3 || $parts[0] !== $type) return null;
    $head = $parts[0] . '.' . $parts[1];
    $expected = b64url(hash_hmac('sha256', $head, MCP_OAUTH_SECRET, true));
    if (!hash_equals($expected, $parts[2])) return null;
    $payload = json_decode(b64url_decode($parts[1]), true);
    if (!is_array($payload) || empty($payload['exp']) || $payload['exp'] < time()) return null;
    return $payload;
}
/* A redirect_uri is allowed when it was registered for that client
   (DCR path), or - for the pre-registered manual client id - when it
   points at an Anthropic domain. Anything else is rejected, so this
   can never become an open redirect. */
function client_allows_redirect($clientId, $redirectUri) {
    if ($clientId === '' || $redirectUri === '') return false;
    if ($clientId === MCP_MANUAL_CLIENT_ID) {
        $parts = parse_url($redirectUri);
        if (empty($parts['host']) || ($parts['scheme'] ?? '') !== 'https') return false;
        return (bool) preg_match('/(^|\.)(claude\.ai|claude\.com|anthropic\.com)$/i', $parts['host']);
    }
    $client = jwt_verify('cid', $clientId);
    return $client && in_array($redirectUri, $client['redirect_uris'], true);
}

function pkce_matches($verifier, $challenge) {
    if (!$verifier || !$challenge) return false;
    $hash = b64url(hash('sha256', $verifier, true));
    return hash_equals($hash, $challenge);
}
function base_url() {
    $host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? ($_SERVER['HTTP_HOST'] ?? 'ashkanstudios.com');
    // Cloudflare/WP Engine set X-Forwarded-Proto to https in production;
    // default to https so self-referential OAuth URLs are always correct.
    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'https';
    return $proto . '://' . $host;
}
function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function read_json_body() {
    $b = json_decode(isset($GLOBALS['__RAW']) ? $GLOBALS['__RAW'] : file_get_contents('php://input'), true);
    return is_array($b) ? $b : array();
}
function bearer_token() {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (!$h && function_exists('apache_request_headers')) {
        foreach (apache_request_headers() as $k => $v) {
            if (strtolower($k) === 'authorization') { $h = $v; break; }
        }
    }
    return (stripos($h, 'Bearer ') === 0) ? substr($h, 7) : '';
}

// ── blog-api.php client (HTTP, same host) ───────────────────────
$BLOG_COOKIE = null;
function blog_login() {
    global $API, $BLOG_COOKIE;
    $ch = curl_init($API);
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS => json_encode(array('action' => 'login', 'password' => BLOG_ADMIN_PASSWORD)),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_TIMEOUT => 20,
    ));
    $resp = curl_exec($ch);
    $hsize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    $headers = substr($resp, 0, $hsize);
    $body = json_decode(substr($resp, $hsize), true);
    if (preg_match('/set-cookie:\s*(ashkan_blog=[^;]+)/i', $headers, $m)) $BLOG_COOKIE = $m[1];
    if (empty($body['ok'])) throw new Exception('Blog login failed: ' . ($body['error'] ?? 'unknown'));
}
function blog_api($action, $body = array(), $auth = false) {
    global $API, $BLOG_COOKIE;
    if ($auth && !$BLOG_COOKIE) blog_login();
    $headers = array('Content-Type: application/json');
    if ($BLOG_COOKIE) $headers[] = 'Cookie: ' . $BLOG_COOKIE;
    $ch = curl_init($API);
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode(array_merge(array('action' => $action), $body)),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ));
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($auth && $code === 401) { // session expired — one retry
        $BLOG_COOKIE = null;
        blog_login();
        return blog_api($action, $body, false);
    }
    $data = json_decode($resp, true);
    if (!is_array($data)) throw new Exception("blog-api returned non-JSON (HTTP $code)");
    if (isset($data['error'])) throw new Exception('blog-api "' . $action . '": ' . $data['error']);
    return $data;
}
function blog_upload_image($bytes, $slug) {
    global $API, $BLOG_COOKIE;
    if (!$BLOG_COOKIE) blog_login();
    $tmp = tempnam(sys_get_temp_dir(), 'img') . '.webp';
    file_put_contents($tmp, $bytes);
    $ch = curl_init($API);
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => array('Cookie: ' . $BLOG_COOKIE),
        CURLOPT_POSTFIELDS => array(
            'action' => 'upload',
            'file' => new CURLFile($tmp, 'image/webp', $slug . '.webp'),
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 40,
    ));
    $resp = curl_exec($ch);
    curl_close($ch);
    @unlink($tmp);
    $data = json_decode($resp, true);
    if (empty($data['ok']) || empty($data['url'])) throw new Exception('Image upload failed: ' . ($data['error'] ?? 'unknown'));
    return $data['url'];
}

function live_url($slug) { global $SITE; return $SITE . '/storytime/' . $slug . '/'; }

// ── MCP tools ───────────────────────────────────────────────────
function tool_list_recent_posts($a) {
    $limit = min((int) ($a['limit'] ?? 20), 100);
    $data = !empty($a['include_drafts']) ? blog_api('all', array(), true) : blog_api('posts');
    $out = array();
    foreach (array_slice($data['posts'] ?? array(), 0, $limit) as $p) {
        $out[] = array(
            'id' => $p['id'], 'title' => $p['title'], 'slug' => $p['slug'],
            'status' => $p['status'] ?? 'published', 'createdAt' => $p['createdAt'], 'url' => live_url($p['slug']),
        );
    }
    return array('count' => count($out), 'posts' => $out);
}
function tool_generate_blog_image($a) {
    if (OPENAI_API_KEY === '') throw new Exception('OPENAI_API_KEY is not set on the server, so image generation is off. Publish without an image, or set the key.');
    $slug = preg_replace('/[^a-z0-9-]/', '', (string) ($a['slug'] ?? 'image'));
    $styled = ((string) $a['prompt']) . '. Cinematic editorial photography, warm natural light, shallow depth of field, premium commercial-studio aesthetic, photorealistic, no text, no logos, no watermarks.';
    $ch = curl_init('https://api.openai.com/v1/images/generations');
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json', 'Authorization: Bearer ' . OPENAI_API_KEY),
        CURLOPT_POSTFIELDS => json_encode(array(
            'model' => 'gpt-image-1', 'prompt' => $styled, 'size' => '1536x1024',
            'quality' => 'medium', 'n' => 1, 'output_format' => 'webp', 'output_compression' => 82,
        )),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 120,
    ));
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    $img = json_decode($resp, true);
    if ($code < 200 || $code >= 300 || empty($img['data'][0]['b64_json'])) {
        throw new Exception('OpenAI image failed (HTTP ' . $code . '): ' . ($img['error']['message'] ?? 'no image'));
    }
    $bytes = base64_decode($img['data'][0]['b64_json']);
    $url = blog_upload_image($bytes, $slug);
    global $SITE;
    return array('image' => $url, 'absoluteUrl' => $SITE . $url, 'bytes' => strlen($bytes));
}
function tool_publish_blog_post($a) {
    $status = (isset($a['status']) && $a['status'] === 'draft') ? 'draft' : 'published';
    $fields = array('title' => $a['title'] ?? '', 'content' => $a['content'] ?? '');
    foreach (array('keywords', 'excerpt', 'slug', 'image', 'metaDescription') as $k) if (isset($a[$k])) $fields[$k] = $a[$k];
    $fields['status'] = $status;
    $data = blog_api('save', $fields, true);
    return array(
        'ok' => true, 'id' => $data['id'], 'slug' => $data['slug'], 'status' => $status,
        'url' => $status === 'published' ? live_url($data['slug']) : base_url() . '/admin/ (draft - not public)',
    );
}
function tool_update_blog_post($a) {
    $id = (string) ($a['id'] ?? '');
    $cur = blog_api('get', array('id' => $id), true)['post'];
    $merged = array(
        'id' => $id,
        'title' => $a['title'] ?? $cur['title'],
        'content' => $a['content'] ?? $cur['content'],
        'keywords' => $a['keywords'] ?? ($cur['keywords'] ?? ''),
        'excerpt' => $a['excerpt'] ?? ($cur['excerpt'] ?? ''),
        'metaDescription' => $a['metaDescription'] ?? ($cur['metaDescription'] ?? ''),
        'slug' => $a['slug'] ?? $cur['slug'],
        'image' => $a['image'] ?? ($cur['image'] ?? ''),
        'status' => $a['status'] ?? ($cur['status'] ?? 'draft'),
    );
    $data = blog_api('save', $merged, true);
    return array(
        'ok' => true, 'id' => $id, 'slug' => $data['slug'], 'status' => $merged['status'],
        'url' => $merged['status'] === 'published' ? live_url($data['slug']) : base_url() . '/admin/ (draft - not public)',
    );
}
function tool_delete_blog_post($a) {
    if (($a['confirm'] ?? null) !== true) throw new Exception('confirm must be true - deletion is permanent.');
    blog_api('delete', array('id' => (string) ($a['id'] ?? '')), true);
    return array('ok' => true, 'deleted' => (string) ($a['id'] ?? ''));
}

function tools_spec() {
    return array(
        array('name' => 'list_recent_posts', 'description' => 'List Storytime posts (id, title, slug, status, live URL). include_drafts=true also shows drafts. Call before publishing to avoid duplicate slugs/topics.',
            'inputSchema' => array('type' => 'object', 'properties' => array(
                'limit' => array('type' => 'number', 'description' => 'Max posts (default 20, max 100)'),
                'include_drafts' => array('type' => 'boolean', 'description' => 'Also include drafts (default false)')))),
        array('name' => 'generate_blog_image', 'description' => 'Generate a wide banner image (OpenAI gpt-image-1) and upload it to the site. Returns the image path for publish_blog_post. Describe only the SCENE - the cinematic editorial style is enforced server-side.',
            'inputSchema' => array('type' => 'object', 'properties' => array(
                'prompt' => array('type' => 'string', 'description' => 'Short scene description, subject only'),
                'slug' => array('type' => 'string', 'description' => 'kebab-case filename')), 'required' => array('prompt', 'slug'))),
        array('name' => 'publish_blog_post', 'description' => "Create a Storytime post. Write the full markdown yourself (500-900 words, ## sections, studio-journal tone). status 'published' = live immediately; 'draft' = hidden. Returns the live URL.",
            'inputSchema' => array('type' => 'object', 'properties' => array(
                'title' => array('type' => 'string'), 'content' => array('type' => 'string', 'description' => 'Full markdown body'),
                'keywords' => array('type' => 'string'), 'excerpt' => array('type' => 'string'),
                'metaDescription' => array('type' => 'string', 'description' => 'SEO meta description, ~150-160 chars'),
                'slug' => array('type' => 'string'), 'image' => array('type' => 'string', 'description' => 'Path from generate_blog_image'),
                'status' => array('type' => 'string', 'enum' => array('published', 'draft'))), 'required' => array('title', 'content'))),
        array('name' => 'update_blog_post', 'description' => 'Update an existing post by id (ids from list_recent_posts). Only passed fields change. Can flip draft/published via status.',
            'inputSchema' => array('type' => 'object', 'properties' => array(
                'id' => array('type' => 'string'), 'title' => array('type' => 'string'), 'content' => array('type' => 'string'),
                'keywords' => array('type' => 'string'), 'excerpt' => array('type' => 'string'), 'slug' => array('type' => 'string'),
                'metaDescription' => array('type' => 'string'),
                'image' => array('type' => 'string'), 'status' => array('type' => 'string', 'enum' => array('published', 'draft'))), 'required' => array('id'))),
        array('name' => 'delete_blog_post', 'description' => 'Permanently delete a post by id. Ask the user first; confirm must be true.',
            'inputSchema' => array('type' => 'object', 'properties' => array(
                'id' => array('type' => 'string'), 'confirm' => array('type' => 'boolean', 'description' => 'Must be true - deletion is permanent')), 'required' => array('id', 'confirm'))),
    );
}
function run_tool($name, $args) {
    switch ($name) {
        case 'list_recent_posts': return tool_list_recent_posts($args);
        case 'generate_blog_image': return tool_generate_blog_image($args);
        case 'publish_blog_post': return tool_publish_blog_post($args);
        case 'update_blog_post': return tool_update_blog_post($args);
        case 'delete_blog_post': return tool_delete_blog_post($args);
        default: throw new Exception('__UNKNOWN_TOOL__');
    }
}

$INSTRUCTIONS = "Publishing workflow for the Ashkan Studios Storytime blog (Houston commercial photo/video studio journal):\n"
    . "1. Call list_recent_posts first so you never repeat a slug or topic.\n"
    . "2. Write the article yourself in markdown: 500-900 words, short intro, 3-5 ## sections, natural human studio-journal voice. No AI-sounding filler.\n"
    . "3. Call generate_blog_image with a short scene description, then publish_blog_post with the returned image path.\n"
    . "4. Report the live URL back to the user. If the user gives only a title, that's enough - write the whole post from it.";

// ── JSON-RPC handler for one message ────────────────────────────
function handle_rpc($msg, $instructions) {
    $id = $msg['id'] ?? null;
    if ($id === null) return null; // notification
    $method = $msg['method'] ?? '';
    $params = $msg['params'] ?? array();
    switch ($method) {
        case 'initialize':
            return array('jsonrpc' => '2.0', 'id' => $id, 'result' => array(
                'protocolVersion' => $params['protocolVersion'] ?? '2025-06-18',
                'capabilities' => array('tools' => array('listChanged' => false)),
                'serverInfo' => array('name' => 'ashkan-blog', 'version' => '2.0.0-php'),
                'instructions' => $instructions,
            ));
        case 'ping':
            return array('jsonrpc' => '2.0', 'id' => $id, 'result' => new stdClass());
        case 'tools/list':
            return array('jsonrpc' => '2.0', 'id' => $id, 'result' => array('tools' => tools_spec()));
        case 'tools/call':
            try {
                $out = run_tool($params['name'] ?? '', $params['arguments'] ?? array());
                return array('jsonrpc' => '2.0', 'id' => $id, 'result' => array(
                    'content' => array(array('type' => 'text', 'text' => json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))), 'isError' => false));
            } catch (Exception $e) {
                if ($e->getMessage() === '__UNKNOWN_TOOL__') {
                    return array('jsonrpc' => '2.0', 'id' => $id, 'error' => array('code' => -32602, 'message' => 'Unknown tool: ' . ($params['name'] ?? '')));
                }
                return array('jsonrpc' => '2.0', 'id' => $id, 'result' => array(
                    'content' => array(array('type' => 'text', 'text' => 'Error: ' . $e->getMessage())), 'isError' => true));
            }
        default:
            return array('jsonrpc' => '2.0', 'id' => $id, 'error' => array('code' => -32601, 'message' => 'Method not found: ' . $method));
    }
}

// ── login page ──────────────────────────────────────────────────
function login_page($base, $q, $error) {
    $hidden = '';
    foreach (array('client_id', 'redirect_uri', 'state', 'code_challenge', 'code_challenge_method', 'response_type', 'scope') as $k) {
        $hidden .= '<input type="hidden" name="' . $k . '" value="' . htmlspecialchars($q[$k] ?? '', ENT_QUOTES) . '">';
    }
    $err = $error ? '<div class="err">' . htmlspecialchars($error, ENT_QUOTES) . '</div>' : '';
    $action = htmlspecialchars($base . MCP_AUTH_BASE . '/authorize', ENT_QUOTES);
    return '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Sign in — Ashkan Studios Blog</title>'
        . '<style>:root{color-scheme:light dark}*{box-sizing:border-box}'
        . 'body{margin:0;min-height:100vh;display:grid;place-items:center;background:#1A1A1A;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#F5F5F0;padding:24px}'
        . '.card{width:100%;max-width:380px;background:#F5F5F0;color:#1A1A1A;padding:40px 34px}'
        . '.brand{font-weight:700;font-size:26px;letter-spacing:8px;text-align:center}'
        . '.sub{font-size:11px;letter-spacing:5px;color:#8f8a7f;text-align:center;margin-top:4px}'
        . 'h1{font-size:15px;letter-spacing:2px;text-transform:uppercase;margin:28px 0 6px}'
        . 'p.hint{font-size:13px;color:#6f6a60;margin:0 0 22px;line-height:1.5}'
        . 'label{display:block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;margin:16px 0 6px}'
        . 'input[type=text],input[type=password]{width:100%;padding:12px 14px;border:1px solid #d8d3c6;background:#fff;font-size:15px;color:#1A1A1A}'
        . 'input:focus{outline:2px solid #1A1A1A;outline-offset:0}'
        . 'button{width:100%;margin-top:26px;padding:14px;background:#1A1A1A;color:#F5F5F0;border:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer}'
        . '.err{margin-top:18px;padding:10px 12px;background:#f6dcdc;color:#8a1c1c;font-size:13px}'
        . '.foot{margin-top:24px;font-size:11px;color:#9a958a;text-align:center}</style></head><body>'
        . '<form class="card" method="post" action="' . $action . '">'
        . '<div class="brand">ASHKAN</div><div class="sub">&mdash; STUDIOS &mdash;</div>'
        . '<h1>Blog Connector Sign-in</h1>'
        . '<p class="hint">Enter the connector username and password to let this app publish to the Storytime blog.</p>'
        . $err
        . '<label>Username</label><input type="text" name="username" autocomplete="username" autofocus required>'
        . '<label>Password</label><input type="password" name="password" autocomplete="current-password" required>'
        . $hidden
        . '<button type="submit">Sign in &amp; allow</button>'
        . '<div class="foot">Ashkan Studios &middot; secure connector</div>'
        . '</form></body></html>';
}

// ══ dispatch ═══════════════════════════════════════════════════
$p = mcp_endpoint();
$base = base_url();
$method = $_SERVER['REQUEST_METHOD'];

// Public connector URL. /mcp (routed by index.php) is the clean address
// people paste into claude.ai; /blog-mcp.php still works for anything
// already pointed at it.
define('MCP_PUBLIC_PATH', '/mcp');
// OAuth endpoints are advertised at the ROOT (/authorize, /token,
// /register) because Claude's connector calls those regardless of what
// the metadata says - advertising them keeps every client on one path.
// index.php routes root, /mcp/* and /blog-mcp.php/* to the same code.
define('MCP_AUTH_BASE', '');

if ($p === 'as-meta') {
    json_out(array(
        'issuer' => $base,
        'authorization_endpoint' => $base . MCP_AUTH_BASE . '/authorize',
        'token_endpoint' => $base . MCP_AUTH_BASE . '/token',
        'registration_endpoint' => $base . MCP_AUTH_BASE . '/register',
        'response_types_supported' => array('code'),
        'grant_types_supported' => array('authorization_code', 'refresh_token'),
        'code_challenge_methods_supported' => array('S256'),
        'token_endpoint_auth_methods_supported' => array('none'),
        'scopes_supported' => array('blog'),
    ));
}

if ($p === 'pr-meta') {
    json_out(array(
        'resource' => $base . MCP_PUBLIC_PATH,
        'authorization_servers' => array($base),
        'scopes_supported' => array('blog'),
        'bearer_methods_supported' => array('header'),
    ));
}

if ($p === 'register') {
    if ($method !== 'POST') json_out(array('error' => 'invalid_request'), 405);
    $b = read_json_body();
    $uris = array();
    if (isset($b['redirect_uris']) && is_array($b['redirect_uris'])) {
        foreach ($b['redirect_uris'] as $u) if (is_string($u)) $uris[] = $u;
    }
    if (!$uris) json_out(array('error' => 'invalid_client_metadata', 'error_description' => 'redirect_uris is required'), 400);
    $clientId = jwt_sign('cid', array('redirect_uris' => $uris), $GLOBALS['CID_TTL']);
    json_out(array(
        'client_id' => $clientId,
        'token_endpoint_auth_method' => 'none',
        'grant_types' => array('authorization_code', 'refresh_token'),
        'response_types' => array('code'),
        'redirect_uris' => $uris,
        'client_name' => is_string($b['client_name'] ?? null) ? $b['client_name'] : 'Ashkan Blog Client',
        'client_id_issued_at' => time(),
    ), 201);
}

if ($p === 'authorize') {
    $q = ($method === 'POST') ? $_POST : $_GET;
    if (($q['response_type'] ?? '') !== 'code') { http_response_code(400); exit('response_type must be code'); }
    if (($q['code_challenge_method'] ?? '') !== 'S256' || empty($q['code_challenge'])) { http_response_code(400); exit('PKCE S256 code_challenge required'); }
    if (!client_allows_redirect($q['client_id'] ?? '', $q['redirect_uri'] ?? '')) {
        http_response_code(400);
        exit('invalid client_id or redirect_uri (reconnect the connector)');
    }

    if ($method === 'GET') {
        header('Content-Type: text/html; charset=utf-8');
        echo login_page($base, $q, null);
        exit;
    }
    // POST — check credentials. Placeholders are split so the deploy
    // find-replace that sets the real creds in the define above can't
    // also rewrite THIS guard (the blog-api.php lesson).
    if (MCP_LOGIN_USER === 'SET_LOGIN_USER_' . 'BEFORE_UPLOAD' || MCP_LOGIN_PASS === 'SET_LOGIN_PASS_' . 'BEFORE_UPLOAD') {
        http_response_code(500); exit('Connector login is not configured.');
    }
    $okUser = hash_equals(MCP_LOGIN_USER, (string) ($q['username'] ?? ''));
    $okPass = hash_equals(MCP_LOGIN_PASS, (string) ($q['password'] ?? ''));
    if (!($okUser && $okPass)) {
        http_response_code(401);
        header('Content-Type: text/html; charset=utf-8');
        echo login_page($base, $q, 'Wrong username or password. Try again.');
        exit;
    }
    $code = jwt_sign('code', array(
        'redirect_uri' => $q['redirect_uri'],
        'code_challenge' => $q['code_challenge'],
        'client_id' => $q['client_id'],
    ), $GLOBALS['CODE_TTL']);
    $sep = (strpos($q['redirect_uri'], '?') !== false) ? '&' : '?';
    $loc = $q['redirect_uri'] . $sep . 'code=' . rawurlencode($code);
    if (!empty($q['state'])) $loc .= '&state=' . rawurlencode($q['state']);
    header('Location: ' . $loc);
    http_response_code(302);
    exit;
}

if ($p === 'token') {
    if ($method !== 'POST') json_out(array('error' => 'invalid_request'), 405);
    // token endpoint accepts form-encoded (OAuth default) or JSON
    $b = !empty($_POST) ? $_POST : read_json_body();
    $grant = $b['grant_type'] ?? '';
    if ($grant === 'authorization_code') {
        $payload = jwt_verify('code', $b['code'] ?? '');
        if (!$payload) json_out(array('error' => 'invalid_grant', 'error_description' => 'code invalid or expired'), 400);
        if (($payload['redirect_uri'] ?? '') !== ($b['redirect_uri'] ?? '')) json_out(array('error' => 'invalid_grant', 'error_description' => 'redirect_uri mismatch'), 400);
        if (!pkce_matches($b['code_verifier'] ?? '', $payload['code_challenge'] ?? '')) json_out(array('error' => 'invalid_grant', 'error_description' => 'PKCE failed'), 400);
        json_out(issue_tokens());
    }
    if ($grant === 'refresh_token') {
        $payload = jwt_verify('rt', $b['refresh_token'] ?? '');
        if (!$payload) json_out(array('error' => 'invalid_grant', 'error_description' => 'refresh_token invalid or expired'), 400);
        json_out(issue_tokens());
    }
    json_out(array('error' => 'unsupported_grant_type', 'error_description' => "grant_type '$grant' not supported"), 400);
}
function issue_tokens() {
    return array(
        'access_token' => jwt_sign('at', array('scope' => 'blog'), $GLOBALS['ACCESS_TTL']),
        'token_type' => 'Bearer',
        'expires_in' => $GLOBALS['ACCESS_TTL'],
        'refresh_token' => jwt_sign('rt', array('scope' => 'blog'), $GLOBALS['REFRESH_TTL']),
        'scope' => 'blog',
    );
}

// ── default: the MCP endpoint ───────────────────────────────────
// Auth: accept EITHER the shared secret (header X-MCP-Secret, or
// Authorization: Bearer <shared secret>) OR a valid OAuth access token.
// Placeholder split so the deploy find-replace can't disable the guard.
$sharedConfigured = MCP_SHARED_SECRET !== 'SET_SHARED_SECRET_' . 'BEFORE_UPLOAD' && MCP_SHARED_SECRET !== '';
$authed = false;
if ($sharedConfigured) {
    $hdrSecret = $_SERVER['HTTP_X_MCP_SECRET'] ?? '';
    if ($hdrSecret !== '' && hash_equals(MCP_SHARED_SECRET, $hdrSecret)) { $authed = true; }
    elseif (($bt = bearer_token()) !== '' && hash_equals(MCP_SHARED_SECRET, $bt)) { $authed = true; }
}
if (!$authed && jwt_verify('at', bearer_token())) { $authed = true; }
if (!$authed) {
    header('WWW-Authenticate: Bearer resource_metadata="' . $base . '/.well-known/oauth-protected-resource"');
    json_out(array('error' => 'invalid_token', 'error_description' => 'Sign in, or send the X-MCP-Secret header.'), 401);
}
if ($method !== 'POST') json_out(array('error' => 'POST only'), 405);

$body = read_json_body();
try {
    if (isset($body[0])) { // batch
        $replies = array();
        foreach ($body as $m) { $r = handle_rpc($m, $INSTRUCTIONS); if ($r !== null) $replies[] = $r; }
        if (!$replies) { http_response_code(202); exit; }
        json_out($replies);
    }
    $reply = handle_rpc($body, $INSTRUCTIONS);
    if ($reply === null) { http_response_code(202); exit; }
    json_out($reply);
} catch (Exception $e) {
    json_out(array('jsonrpc' => '2.0', 'id' => $body['id'] ?? null, 'error' => array('code' => -32603, 'message' => $e->getMessage())));
}
