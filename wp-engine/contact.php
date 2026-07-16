<?php
// ────────────────────────────────────────────────────────────────
// Ashkan Studios — contact form endpoint (standalone PHP, no WordPress).
//
// The live site on WP Engine is a static React build, so this single
// file IS the form backend. The React ContactPage POSTs JSON here
// (/contact.php) on ashkanstudios.com.
//
// SETUP (one time):
//   1. Paste the Resend API key on the line below (starts with re_).
//   2. Upload this file to the site WEBROOT via SFTP - the same folder
//      that contains index.html and the assets/ folder.
//   That's it. The key lives only on the server - never in the repo.
//
// Every submission is LOGGED as well as emailed via Resend, so if
// email ever breaks no lead is lost. WP Engine blocks PHP from writing
// .php files in the webroot, so on WPE the log lives at
// _wpeprivate/ashkan-enquiries.jsonl (WPE's private dir — PHP-writable,
// never served over HTTP). On other hosts it falls back to
// enquiries-log.php in the webroot (PHP-guarded, browsers get a 404).
// The /admin LEADS tab reads both via blog-api.php; you can also
// download the file over SFTP.
// ────────────────────────────────────────────────────────────────

define('RESEND_API_KEY', 'PASTE_YOUR_RESEND_KEY_HERE');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Method not allowed'));
    exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) { $body = $_POST; }

$name    = trim((string) ($body['name'] ?? ''));
$email   = trim((string) ($body['email'] ?? ''));
$company = trim((string) ($body['company'] ?? ''));
$type    = trim((string) ($body['projectType'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(array('error' => 'Please fill in your name, email, and message.'));
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array('error' => 'Please enter a valid email address.'));
    exit;
}

$configured = (RESEND_API_KEY !== '' && strpos(RESEND_API_KEY, 're_') === 0);

// ── 1) Send the notification email via Resend ──
$sent = false;
if ($configured) {
    $esc = function ($v) {
        return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
    };
    $n = $esc($name);
    $e = $esc($email);
    $c = $esc($company);
    $t = $esc($type);
    $m = $esc($message);

    // Brand-matched HTML email (dark #1A1A1A header, cream #F5F5F0
    // card, warmbeige #E8E0D1 message box, dark Reply CTA) - the same
    // template the site has always used.
    $rowL = 'padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;width:130px;vertical-align:top';
    $rowR = 'padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#1A1A1A;vertical-align:top';

    $html = ''
      . '<div style="display:none;max-height:0;overflow:hidden;opacity:0">New enquiry from ' . $n . ($c !== '' ? ' at ' . $c : '') . ' via the website contact form.</div>'
      . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#1A1A1A;margin:0;padding:0"><tr><td align="center" style="padding:32px 16px">'
      . '<table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;background-color:#F5F5F0">'
      . '<tr><td align="center" style="background-color:#1A1A1A;padding:40px 40px 34px">'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:30px;letter-spacing:9px;color:#F5F5F0;line-height:1">ASHKAN</div>'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:6px;color:#E8E0D1;margin-top:6px">&mdash; STUDIOS &mdash;</div>'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8f8a7f;margin-top:22px">New Website Enquiry</div>'
      . '</td></tr>'
      . '<tr><td style="padding:38px 40px 8px">'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:26px;letter-spacing:1px;text-transform:uppercase;color:#1A1A1A;line-height:1.15">You&#39;ve got a new lead</div>'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#6f6a60;margin-top:8px">Someone reached out through the contact form. Details below.</div>'
      . '</td></tr>'
      . '<tr><td style="padding:14px 40px 0"><table role="presentation" cellpadding="0" cellspacing="0" width="100%">'
      . '<tr><td style="' . $rowL . '">Name</td><td style="' . $rowR . '"><strong style="font-weight:bold">' . $n . '</strong></td></tr>'
      . '<tr><td style="' . $rowL . '">Email</td><td style="' . $rowR . '"><a href="mailto:' . $e . '" style="color:#1A1A1A;text-decoration:underline">' . $e . '</a></td></tr>'
      . '<tr><td style="' . $rowL . '">Company</td><td style="' . $rowR . '">' . ($c !== '' ? $c : '&mdash;') . '</td></tr>'
      . '<tr><td style="' . $rowL . '">Project type</td><td style="' . $rowR . '">' . ($t !== '' ? $t : '&mdash;') . '</td></tr>'
      . '</table></td></tr>'
      . '<tr><td style="padding:28px 40px 0">'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;margin-bottom:10px">Message</div>'
      . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#E8E0D1">'
      . '<tr><td style="padding:20px 22px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1A1A1A;white-space:pre-wrap">' . $m . '</td></tr>'
      . '</table></td></tr>'
      . '<tr><td style="padding:30px 40px 40px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#1A1A1A">'
      . '<a href="mailto:' . $e . '?subject=' . rawurlencode('Re: Your enquiry with Ashkan Studios') . '" style="display:inline-block;padding:15px 34px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#F5F5F0;text-decoration:none">Reply to ' . $n . ' &nbsp;&rsaquo;</a>'
      . '</td></tr></table></td></tr>'
      . '<tr><td style="background-color:#1A1A1A;padding:26px 40px">'
      . '<div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8f8a7f;line-height:1.7">'
      . 'Sent from the <a href="https://ashkanstudios.com" style="color:#E8E0D1;text-decoration:none">ashkanstudios.com</a> contact form<br>'
      . '1502 Sawyer St #108, Houston, TX 77007 &nbsp;&middot;&nbsp; (346) 335-7973'
      . '</div></td></tr>'
      . '</table></td></tr></table>';

    $payload = json_encode(array(
        'from'     => 'Ashkan Studios <contact@ashkanstudios.com>',
        'to'       => array('info@ashkanstudios.com'),
        'bcc'      => array('leadquality@incrementors.com'),
        'reply_to' => $email,
        'subject'  => 'New enquiry from ' . $name . ($company !== '' ? ' - ' . $company : ''),
        'html'     => $html,
    ));

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => array(
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ),
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
    ));
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    $sent = ($resp !== false && $code >= 200 && $code < 300);
}

// ── 2) Log the enquiry ──
// _wpeprivate on WP Engine (PHP-writable, never served over HTTP);
// elsewhere a PHP-guarded file in the webroot (browsers get a 404).
$logged = false;
$privateDir = __DIR__ . '/_wpeprivate';
if (is_dir($privateDir) && is_writable($privateDir)) {
    $logFile = $privateDir . '/ashkan-enquiries.jsonl';
    $guard   = '';
} else {
    $logFile = __DIR__ . '/enquiries-log.php';
    $guard   = "<?php http_response_code(404); exit; // Ashkan Studios enquiry log - do not delete ?>\n";
}
$entry   = json_encode(array(
    'time'        => gmdate('c'),
    'name'        => $name,
    'email'       => $email,
    'company'     => $company,
    'projectType' => $type,
    'message'     => $message,
    'emailStatus' => $sent ? 'sent' : ($configured ? 'failed' : 'not-configured'),
), JSON_UNESCAPED_UNICODE);
if ($entry !== false) {
    if ($guard !== '' && !file_exists($logFile)) {
        @file_put_contents($logFile, $guard, LOCK_EX);
    }
    $logged = (bool) @file_put_contents($logFile, $entry . "\n", FILE_APPEND | LOCK_EX);
}

// Lead saved OR emailed = the studio has it -> success for the visitor.
if ($sent || $logged) {
    echo json_encode(array('ok' => true));
    exit;
}
http_response_code(502);
echo json_encode(array(
    'error' => 'Could not send your message right now. Please try again, or email us at info@ashkanstudios.com.',
));
