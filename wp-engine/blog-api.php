<?php
// ────────────────────────────────────────────────────────────────
// Ashkan Studios — Storytime blog backend (standalone PHP, no WordPress).
//
// Powers the public Storytime blog + the /admin/blog dashboard on the
// static React site. Posts live in blog-data.php (a PHP-guarded JSON
// file browsers can't read); uploaded images go to /blog-uploads/.
//
// SETUP (one time):
//   1. Set the admin password on the line below (client will use this
//      to log in at ashkanstudios.com/admin/blog).
//   2. Upload this file to the site WEBROOT (next to index.html).
//   That's it - the data file and uploads folder create themselves.
//
// To change the password later: edit the line below on the server
// (SFTP) and save. Active sessions stay valid until the browser closes.
//
// All requests are POST (WP Engine's cache strips query strings from
// GETs, which would cross-cache responses). Actions:
//   posts (public)   -> published posts, newest first (no content body)
//   post (public)    -> one published post by slug, full content
//   login/logout/me  -> session auth
//   all (auth)       -> every post incl. drafts (dashboard list)
//   get (auth)       -> one post by id, any status
//   save (auth)      -> create/update  |  delete (auth) -> remove
//   upload (auth)    -> multipart image upload -> { url }
// ────────────────────────────────────────────────────────────────

define('BLOG_ADMIN_PASSWORD', 'SET_A_PASSWORD_BEFORE_UPLOAD');

$DATA_FILE  = __DIR__ . '/blog-data.php';
$UPLOAD_DIR = __DIR__ . '/blog-uploads';
$GUARD      = "<?php http_response_code(404); exit; // Ashkan Studios blog data - do not delete ?>\n";

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Method not allowed'));
    exit;
}

session_set_cookie_params(array(
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax',
));
session_name('ashkan_blog');
session_start();

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) { $body = $_POST; }
$action = isset($body['action']) ? (string) $body['action'] : '';

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function load_posts($file, $guard) {
    if (!file_exists($file)) { return array(); }
    $txt = file_get_contents($file);
    $nl  = strpos($txt, "\n");
    $json = $nl === false ? '' : substr($txt, $nl + 1);
    $arr = json_decode($json, true);
    return is_array($arr) ? $arr : array();
}

function save_posts($file, $guard, $posts) {
    // newest first, stable
    usort($posts, function ($a, $b) {
        return strcmp(isset($b['createdAt']) ? $b['createdAt'] : '', isset($a['createdAt']) ? $a['createdAt'] : '');
    });
    return (bool) file_put_contents($file, $guard . json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function make_slug($title) {
    $s = strtolower(trim($title));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    $s = trim($s, '-');
    return $s !== '' ? $s : 'post';
}

function public_fields($p, $withContent = false) {
    $out = array(
        'id'        => $p['id'],
        'slug'      => $p['slug'],
        'title'     => $p['title'],
        'keywords'  => isset($p['keywords']) ? $p['keywords'] : '',
        'image'     => isset($p['image']) ? $p['image'] : '',
        'excerpt'   => isset($p['excerpt']) ? $p['excerpt'] : '',
        'createdAt' => $p['createdAt'],
        'updatedAt' => isset($p['updatedAt']) ? $p['updatedAt'] : $p['createdAt'],
    );
    if ($withContent) { $out['content'] = isset($p['content']) ? $p['content'] : ''; }
    return $out;
}

$authed = !empty($_SESSION['ashkan_blog_authed']);

// ── Public actions ──
if ($action === 'posts') {
    $posts = load_posts($DATA_FILE, $GUARD);
    $out = array();
    foreach ($posts as $p) {
        if (isset($p['status']) && $p['status'] === 'published') { $out[] = public_fields($p); }
    }
    respond(array('ok' => true, 'posts' => $out));
}

if ($action === 'post') {
    $slug = isset($body['slug']) ? (string) $body['slug'] : '';
    $posts = load_posts($DATA_FILE, $GUARD);
    foreach ($posts as $p) {
        if ($p['slug'] === $slug && isset($p['status']) && $p['status'] === 'published') {
            respond(array('ok' => true, 'post' => public_fields($p, true)));
        }
    }
    respond(array('error' => 'Post not found'), 404);
}

// ── Auth ──
if ($action === 'login') {
    $pw = isset($body['password']) ? (string) $body['password'] : '';
    if (BLOG_ADMIN_PASSWORD === 'SET_A_PASSWORD_BEFORE_UPLOAD' || BLOG_ADMIN_PASSWORD === '') {
        respond(array('error' => 'Blog admin is not configured yet.'), 500);
    }
    if (!hash_equals(BLOG_ADMIN_PASSWORD, $pw)) {
        respond(array('error' => 'Incorrect password.'), 401);
    }
    session_regenerate_id(true);
    $_SESSION['ashkan_blog_authed'] = true;
    respond(array('ok' => true));
}

if ($action === 'logout') {
    $_SESSION = array();
    session_destroy();
    respond(array('ok' => true));
}

if ($action === 'me') {
    respond(array('ok' => true, 'authed' => $authed));
}

// ── Everything below requires auth ──
if (!$authed) { respond(array('error' => 'Not logged in.'), 401); }

if ($action === 'all') {
    $posts = load_posts($DATA_FILE, $GUARD);
    $out = array();
    foreach ($posts as $p) {
        $f = public_fields($p);
        $f['status'] = isset($p['status']) ? $p['status'] : 'draft';
        $out[] = $f;
    }
    respond(array('ok' => true, 'posts' => $out));
}

if ($action === 'get') {
    $id = isset($body['id']) ? (string) $body['id'] : '';
    $posts = load_posts($DATA_FILE, $GUARD);
    foreach ($posts as $p) {
        if ($p['id'] === $id) {
            $f = public_fields($p, true);
            $f['status'] = isset($p['status']) ? $p['status'] : 'draft';
            respond(array('ok' => true, 'post' => $f));
        }
    }
    respond(array('error' => 'Post not found'), 404);
}

if ($action === 'save') {
    $title   = trim((string) (isset($body['title']) ? $body['title'] : ''));
    $content = (string) (isset($body['content']) ? $body['content'] : '');
    if ($title === '' || trim($content) === '') {
        respond(array('error' => 'Title and content are required.'), 400);
    }
    $id       = trim((string) (isset($body['id']) ? $body['id'] : ''));
    $keywords = trim((string) (isset($body['keywords']) ? $body['keywords'] : ''));
    $image    = trim((string) (isset($body['image']) ? $body['image'] : ''));
    $excerpt  = trim((string) (isset($body['excerpt']) ? $body['excerpt'] : ''));
    $status   = (isset($body['status']) && $body['status'] === 'published') ? 'published' : 'draft';
    $slugIn   = trim((string) (isset($body['slug']) ? $body['slug'] : ''));

    if ($excerpt === '') {
        $plain = trim(preg_replace('/\s+/', ' ', preg_replace('/[#>*_`\[\]()!-]/', ' ', $content)));
        $excerpt = mb_substr($plain, 0, 160) . (mb_strlen($plain) > 160 ? '…' : '');
    }

    $posts = load_posts($DATA_FILE, $GUARD);
    $slug = make_slug($slugIn !== '' ? $slugIn : $title);
    // ensure slug unique (excluding self)
    $base = $slug; $n = 2;
    while (true) {
        $clash = false;
        foreach ($posts as $p) {
            if ($p['slug'] === $slug && $p['id'] !== $id) { $clash = true; break; }
        }
        if (!$clash) { break; }
        $slug = $base . '-' . $n; $n++;
    }

    $now = gmdate('c');
    if ($id !== '') {
        $found = false;
        foreach ($posts as $i => $p) {
            if ($p['id'] === $id) {
                $posts[$i] = array_merge($p, array(
                    'title' => $title, 'slug' => $slug, 'keywords' => $keywords,
                    'image' => $image, 'excerpt' => $excerpt, 'content' => $content,
                    'status' => $status, 'updatedAt' => $now,
                ));
                $found = true; break;
            }
        }
        if (!$found) { respond(array('error' => 'Post not found'), 404); }
    } else {
        $id = 'p' . bin2hex(random_bytes(6));
        $posts[] = array(
            'id' => $id, 'title' => $title, 'slug' => $slug, 'keywords' => $keywords,
            'image' => $image, 'excerpt' => $excerpt, 'content' => $content,
            'status' => $status, 'createdAt' => $now, 'updatedAt' => $now,
        );
    }

    if (!save_posts($DATA_FILE, $GUARD, $posts)) {
        respond(array('error' => 'Could not save the post.'), 500);
    }
    respond(array('ok' => true, 'id' => $id, 'slug' => $slug));
}

if ($action === 'delete') {
    $id = isset($body['id']) ? (string) $body['id'] : '';
    $posts = load_posts($DATA_FILE, $GUARD);
    $kept = array();
    $removed = false;
    foreach ($posts as $p) {
        if ($p['id'] === $id) { $removed = true; continue; }
        $kept[] = $p;
    }
    if (!$removed) { respond(array('error' => 'Post not found'), 404); }
    if (!save_posts($DATA_FILE, $GUARD, $kept)) {
        respond(array('error' => 'Could not delete the post.'), 500);
    }
    respond(array('ok' => true));
}

if ($action === 'upload') {
    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        respond(array('error' => 'No file received.'), 400);
    }
    $f = $_FILES['file'];
    if ($f['size'] > 8 * 1024 * 1024) {
        respond(array('error' => 'Image is too large (max 8 MB).'), 400);
    }
    $info = @getimagesize($f['tmp_name']);
    $mimeExt = array('image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif');
    if (!$info || !isset($mimeExt[$info['mime']])) {
        respond(array('error' => 'Only JPG, PNG, WebP, or GIF images are allowed.'), 400);
    }
    if (!is_dir($UPLOAD_DIR)) {
        @mkdir($UPLOAD_DIR, 0755, true);
        @file_put_contents($UPLOAD_DIR . '/index.php', "<?php http_response_code(404); exit;\n");
    }
    $name = 'img-' . gmdate('Ymd') . '-' . bin2hex(random_bytes(5)) . '.' . $mimeExt[$info['mime']];
    if (!move_uploaded_file($f['tmp_name'], $UPLOAD_DIR . '/' . $name)) {
        respond(array('error' => 'Could not store the image.'), 500);
    }
    respond(array('ok' => true, 'url' => '/blog-uploads/' . $name));
}

respond(array('error' => 'Unknown action.'), 400);
