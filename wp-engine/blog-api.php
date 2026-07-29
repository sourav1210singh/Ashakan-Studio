<?php
// ────────────────────────────────────────────────────────────────
// Ashkan Studios — Storytime blog backend (standalone PHP, no WordPress).
//
// Powers the public Storytime blog + the /admin/blog dashboard on the
// static React site. Uploaded images go to /blog-uploads/.
//
// WHERE POSTS ARE STORED — a try-ladder, because WP Engine blocks PHP
// from writing .php files anywhere (verified: a .png and an index.php
// written to the same PHP-created dir in the same request — png ok,
// php silently blocked) and _wpeprivate writability varies:
//   1. _wpeprivate/ashkan-blog-data.json — WPE's private dir (nginx
//      returns 403 for it, verified) — used when writable.
//   2. blog-data/posts-<hash>.json — a directory THIS script mkdirs
//      (PHP-owned dirs are always writable, proven by blog-uploads/),
//      filename suffixed with sha256(admin password) so it can't be
//      guessed over HTTP; a guard index.php is attempted best-effort.
//   3. blog-data.php in the webroot (PHP-guarded) — legacy/local hosts.
// Reads walk the same ladder, first existing file wins.
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

$PRIVATE_DIR = __DIR__ . '/_wpeprivate';
$DATA_DIR    = __DIR__ . '/blog-data';
$DATA_SUFFIX = substr(hash('sha256', 'ashkan-posts|' . BLOG_ADMIN_PASSWORD), 0, 12);
// _wpeprivate is only on the ladder when the PLATFORM provides it —
// never self-created: only WP Engine's nginx 403s that path, so a
// self-made _wpeprivate on another host would be public.
$DATA_LADDER = array();
if (is_dir($PRIVATE_DIR)) { $DATA_LADDER[] = $PRIVATE_DIR . '/ashkan-blog-data.json'; }
$DATA_LADDER[] = $DATA_DIR . '/posts-' . $DATA_SUFFIX . '.json';
$DATA_LADDER[] = __DIR__ . '/blog-data.php';
// Leads written by contact.php: private dir, hashed-name jsonl files in
// blog-data/ (matched by glob - contact.php derives its own suffix from
// the Resend key, this script doesn't need to know it), legacy webroot.
$LEADS_GLOBS = array(
    $PRIVATE_DIR . '/ashkan-enquiries.jsonl',
    $DATA_DIR . '/enquiries-*.jsonl',
    __DIR__ . '/enquiries-log.php',
);
$UPLOAD_DIR  = __DIR__ . '/blog-uploads';

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

function load_posts($ladder) {
    foreach ($ladder as $file) {
        if (!file_exists($file)) { continue; }
        $txt = file_get_contents($file);
        // Webroot variant is PHP-guarded: JSON starts after the guard line.
        if (strpos($txt, '<?php') === 0) {
            $nl  = strpos($txt, "\n");
            $txt = $nl === false ? '' : substr($txt, $nl + 1);
        }
        $arr = json_decode($txt, true);
        if (is_array($arr)) { return $arr; }
    }
    return array();
}

function save_posts($ladder, $posts) {
    // newest first, stable
    usort($posts, function ($a, $b) {
        return strcmp(isset($b['createdAt']) ? $b['createdAt'] : '', isset($a['createdAt']) ? $a['createdAt'] : '');
    });
    $json = json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    foreach ($ladder as $file) {
        $dir = dirname($file);
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true)) { continue; }
            // Best-effort guard for the PHP-created dir (WPE silently
            // blocks .php writes; on other hosts it hides the folder).
            @file_put_contents($dir . '/index.php', "<?php http_response_code(404); exit;\n");
        }
        $prefix = substr($file, -4) === '.php'
            ? "<?php http_response_code(404); exit; // Ashkan Studios blog data - do not delete ?>\n"
            : '';
        if (@file_put_contents($file, $prefix . $json, LOCK_EX) !== false) {
            return true;
        }
    }
    return false;
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
        'metaDescription' => isset($p['metaDescription']) ? $p['metaDescription'] : '',
        'publishAt' => isset($p['publishAt']) ? $p['publishAt'] : '',
        'createdAt' => $p['createdAt'],
        'updatedAt' => isset($p['updatedAt']) ? $p['updatedAt'] : $p['createdAt'],
    );
    if ($withContent) { $out['content'] = isset($p['content']) ? $p['content'] : ''; }
    return $out;
}

/* Scheduled publishing. A post saved with status 'scheduled' carries a
   UTC publishAt timestamp; the moment that time has passed, the next
   read flips it to 'published' for good. No cron is involved - every
   read path calls this first, and the site itself provides the traffic
   (the Storytime page fetches on load, and so does the admin). */
function apply_schedule($posts, $ladder) {
    $now = gmdate('c');
    $changed = false;
    foreach ($posts as $i => $p) {
        if (($p['status'] ?? '') === 'scheduled' && !empty($p['publishAt']) && $p['publishAt'] <= $now) {
            $posts[$i]['status'] = 'published';
            $posts[$i]['updatedAt'] = $now;
            $changed = true;
        }
    }
    if ($changed) { save_posts($ladder, $posts); }
    return $posts;
}

$authed = !empty($_SESSION['ashkan_blog_authed']);

// ── Public actions ──
if ($action === 'posts') {
    $posts = apply_schedule(load_posts($DATA_LADDER), $DATA_LADDER);
    $out = array();
    foreach ($posts as $p) {
        if (isset($p['status']) && $p['status'] === 'published') { $out[] = public_fields($p); }
    }
    respond(array('ok' => true, 'posts' => $out));
}

if ($action === 'post') {
    $slug = isset($body['slug']) ? (string) $body['slug'] : '';
    $posts = apply_schedule(load_posts($DATA_LADDER), $DATA_LADDER);
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
    // Placeholder is split so a blind find-replace that sets the real
    // password in the define above can never rewrite THIS guard too
    // (that bug made login permanently return "not configured").
    $placeholder = 'SET_A_PASSWORD_' . 'BEFORE_UPLOAD';
    if (BLOG_ADMIN_PASSWORD === $placeholder || BLOG_ADMIN_PASSWORD === '') {
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
    // v = backend revision, so a deploy can be verified from outside
    // (v3 = storage try-ladder).
    respond(array('ok' => true, 'authed' => $authed, 'v' => 3));
}

// ── Everything below requires auth ──
if (!$authed) { respond(array('error' => 'Not logged in.'), 401); }

if ($action === 'leads') {
    // Contact-form submissions logged by contact.php. Reads every
    // location contact.php's own ladder can write to, so no lead is
    // missed. Newest first, capped at 500 for the dashboard.
    $files = array();
    foreach ($LEADS_GLOBS as $pattern) {
        $hits = strpos($pattern, '*') !== false ? glob($pattern) : array($pattern);
        if (is_array($hits)) { $files = array_merge($files, $hits); }
    }
    $leads = array();
    foreach ($files as $file) {
        if (!file_exists($file)) { continue; }
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (is_array($lines)) {
            foreach ($lines as $ln) {
                if (strpos($ln, '<?php') === 0) { continue; } // guard line
                $row = json_decode($ln, true);
                if (is_array($row)) { $leads[] = $row; }
            }
        }
    }
    usort($leads, function ($a, $b) {
        return strcmp(isset($a['time']) ? $a['time'] : '', isset($b['time']) ? $b['time'] : '');
    });
    $leads = array_reverse($leads);
    if (count($leads) > 500) { $leads = array_slice($leads, 0, 500); }
    respond(array('ok' => true, 'leads' => $leads));
}

if ($action === 'all') {
    $posts = apply_schedule(load_posts($DATA_LADDER), $DATA_LADDER);
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
    $posts = load_posts($DATA_LADDER);
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
    $metaDesc = trim((string) (isset($body['metaDescription']) ? $body['metaDescription'] : ''));
    $statusIn = isset($body['status']) ? (string) $body['status'] : '';
    $status   = in_array($statusIn, array('published', 'scheduled'), true) ? $statusIn : 'draft';
    $slugIn   = trim((string) (isset($body['slug']) ? $body['slug'] : ''));

    /* Scheduling: publishAt arrives as UTC ISO ("2026-07-31T14:00:00Z")
       or as the browser's datetime-local value already converted by the
       admin. A schedule in the past just goes live now. */
    $publishAt = trim((string) (isset($body['publishAt']) ? $body['publishAt'] : ''));
    if ($status === 'scheduled') {
        $ts = $publishAt !== '' ? strtotime($publishAt) : false;
        if ($ts === false) {
            respond(array('error' => 'Pick a date and time to schedule this post.'), 400);
        }
        $publishAt = gmdate('c', $ts);
        if ($publishAt <= gmdate('c')) { $status = 'published'; $publishAt = ''; }
    } else {
        $publishAt = '';
    }

    if ($excerpt === '') {
        $plain = trim(preg_replace('/\s+/', ' ', preg_replace('/[#>*_`\[\]()!-]/', ' ', $content)));
        // mbstring is standard on WP Engine, but fall back to plain
        // substr so the API never fatals on a host without it.
        if (function_exists('mb_substr')) {
            $excerpt = mb_substr($plain, 0, 160) . (mb_strlen($plain) > 160 ? '…' : '');
        } else {
            $excerpt = substr($plain, 0, 160) . (strlen($plain) > 160 ? '...' : '');
        }
    }

    $posts = load_posts($DATA_LADDER);
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
                    'image' => $image, 'excerpt' => $excerpt,
                    'metaDescription' => $metaDesc, 'content' => $content,
                    'status' => $status, 'publishAt' => $publishAt, 'updatedAt' => $now,
                ));
                $found = true; break;
            }
        }
        if (!$found) { respond(array('error' => 'Post not found'), 404); }
    } else {
        $id = 'p' . bin2hex(random_bytes(6));
        $posts[] = array(
            'id' => $id, 'title' => $title, 'slug' => $slug, 'keywords' => $keywords,
            'image' => $image, 'excerpt' => $excerpt,
            'metaDescription' => $metaDesc, 'content' => $content,
            'status' => $status, 'publishAt' => $publishAt,
            'createdAt' => $now, 'updatedAt' => $now,
        );
    }

    if (!save_posts($DATA_LADDER, $posts)) {
        respond(array('error' => 'Could not save the post.'), 500);
    }
    respond(array('ok' => true, 'id' => $id, 'slug' => $slug));
}

if ($action === 'delete') {
    $id = isset($body['id']) ? (string) $body['id'] : '';
    $posts = load_posts($DATA_LADDER);
    $kept = array();
    $removed = false;
    foreach ($posts as $p) {
        if ($p['id'] === $id) { $removed = true; continue; }
        $kept[] = $p;
    }
    if (!$removed) { respond(array('error' => 'Post not found'), 404); }
    if (!save_posts($DATA_LADDER, $kept)) {
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
