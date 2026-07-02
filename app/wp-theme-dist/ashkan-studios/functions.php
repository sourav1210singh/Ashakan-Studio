<?php
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

// ────────────────────────────────────────────────────────────────
// Contact form -> Resend email (WordPress REST endpoint).
//
// The React ContactPage POSTs to /wp-json/ashkan/v1/contact when the
// SPA is served by WordPress (on the Vercel preview it uses the
// /api/contact serverless function instead - same payload, same email).
//
// REQUIRED SETUP (one time): add the Resend API key to wp-config.php,
// above the "stop editing" line:
//     define('RESEND_API_KEY', 're_xxxxxxxxxxxxxxxx');
// The key lives only on the server - never in this repo.
// ────────────────────────────────────────────────────────────────
add_action('rest_api_init', function () {
    register_rest_route('ashkan/v1', '/contact', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'ashkan_studios_contact_handler',
    ));
});

// Every submission is STORED FIRST in the WordPress database (visible
// in wp-admin under "Enquiries"), and only then emailed. If Resend or
// the email setup is ever down, no lead is lost: the entry sits in
// wp-admin with status "failed" and is retried automatically every
// 3 hours for up to 2 days.
add_action('init', function () {
    register_post_type('ashkan_enquiry', array(
        'labels' => array(
            'name'          => 'Enquiries',
            'singular_name' => 'Enquiry',
            'menu_name'     => 'Enquiries',
        ),
        'public'        => false,
        'show_ui'       => true,
        'menu_position' => 25,
        'menu_icon'     => 'dashicons-email-alt',
        'supports'      => array('title', 'editor'),
    ));
});

function ashkan_studios_contact_handler(WP_REST_Request $req) {
    $name    = sanitize_text_field((string) $req->get_param('name'));
    $email   = sanitize_email((string) $req->get_param('email'));
    $company = sanitize_text_field((string) $req->get_param('company'));
    $type    = sanitize_text_field((string) $req->get_param('projectType'));
    $message = sanitize_textarea_field((string) $req->get_param('message'));

    if ($name === '' || $email === '' || $message === '') {
        return new WP_REST_Response(array('error' => 'Please fill in your name, email, and message.'), 400);
    }

    // 1) STORE the enquiry first - the lead is safe no matter what
    //    happens to the email below.
    $post_id = wp_insert_post(array(
        'post_type'    => 'ashkan_enquiry',
        'post_status'  => 'private',
        'post_title'   => $name . ($company !== '' ? ' - ' . $company : ''),
        'post_content' => $message,
    ));
    if (is_wp_error($post_id)) { $post_id = 0; }
    if ($post_id) {
        update_post_meta($post_id, 'enquiry_email', $email);
        update_post_meta($post_id, 'enquiry_company', $company);
        update_post_meta($post_id, 'enquiry_project_type', $type);
        update_post_meta($post_id, 'enquiry_email_status', 'pending');
        update_post_meta($post_id, 'enquiry_attempts', 0);
    }

    // 2) Send the notification email.
    $sent = ashkan_send_enquiry_email($name, $email, $company, $type, $message);

    if ($post_id) {
        update_post_meta($post_id, 'enquiry_email_status', $sent ? 'sent' : 'failed');
        update_post_meta($post_id, 'enquiry_attempts', 1);
        if (!$sent) {
            // Retry in 3 hours (repeats up to ~2 days - see retry hook).
            wp_schedule_single_event(time() + 3 * HOUR_IN_SECONDS, 'ashkan_retry_enquiry_email', array($post_id));
        }
    }

    // Saved OR emailed = the studio has the lead -> success for the
    // visitor. Only fail when BOTH storage and email failed.
    if ($post_id || $sent) {
        return new WP_REST_Response(array('ok' => true), 200);
    }
    return new WP_REST_Response(array(
        'error' => 'Could not send your message right now. Please try again, or email us at info@ashkanstudios.com.',
    ), 502);
}

// Automatic retry for enquiries whose notification email failed:
// every 3 hours, up to 16 attempts (~2 days of outage coverage).
add_action('ashkan_retry_enquiry_email', function ($post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'ashkan_enquiry') { return; }
    if (get_post_meta($post_id, 'enquiry_email_status', true) === 'sent') { return; }

    $attempts = (int) get_post_meta($post_id, 'enquiry_attempts', true);
    $company  = (string) get_post_meta($post_id, 'enquiry_company', true);
    $title    = $post->post_title;
    $name     = ($company !== '' && substr($title, -strlen(' - ' . $company)) === ' - ' . $company)
        ? substr($title, 0, strlen($title) - strlen(' - ' . $company))
        : $title;

    $sent = ashkan_send_enquiry_email(
        $name,
        (string) get_post_meta($post_id, 'enquiry_email', true),
        $company,
        (string) get_post_meta($post_id, 'enquiry_project_type', true),
        (string) $post->post_content
    );

    update_post_meta($post_id, 'enquiry_attempts', $attempts + 1);
    if ($sent) {
        update_post_meta($post_id, 'enquiry_email_status', 'sent');
    } elseif ($attempts + 1 < 16) {
        wp_schedule_single_event(time() + 3 * HOUR_IN_SECONDS, 'ashkan_retry_enquiry_email', array($post_id));
    }
});

// wp-admin "Enquiries" list: show the lead details at a glance.
add_filter('manage_ashkan_enquiry_posts_columns', function ($cols) {
    return array(
        'cb'            => isset($cols['cb']) ? $cols['cb'] : '<input type="checkbox" />',
        'title'         => 'Name',
        'enquiry_email' => 'Email',
        'enquiry_type'  => 'Project type',
        'email_status'  => 'Email status',
        'date'          => 'Date',
    );
});
add_action('manage_ashkan_enquiry_posts_custom_column', function ($col, $post_id) {
    if ($col === 'enquiry_email') {
        $e = get_post_meta($post_id, 'enquiry_email', true);
        echo $e !== '' ? '<a href="mailto:' . esc_attr($e) . '">' . esc_html($e) . '</a>' : '&mdash;';
    } elseif ($col === 'enquiry_type') {
        $t = get_post_meta($post_id, 'enquiry_project_type', true);
        echo $t !== '' ? esc_html($t) : '&mdash;';
    } elseif ($col === 'email_status') {
        $s = get_post_meta($post_id, 'enquiry_email_status', true);
        if ($s === 'sent') {
            echo '<span style="color:#1a7a2e;font-weight:600">Sent</span>';
        } elseif ($s === 'failed') {
            echo '<span style="color:#b32d2e;font-weight:600">Failed (retrying)</span>';
        } else {
            echo esc_html($s !== '' ? $s : '&mdash;');
        }
    }
}, 10, 2);

// Builds + sends the brand-matched notification email via Resend.
// Returns true on success. Requires RESEND_API_KEY in wp-config.php.
function ashkan_send_enquiry_email($name, $email, $company, $type, $message) {
    if (!defined('RESEND_API_KEY') || RESEND_API_KEY === '') { return false; }

    // Brand-matched HTML email - same template as the Vercel function
    // (dark #1A1A1A header, cream #F5F5F0 card, warmbeige #E8E0D1
    // message box, dark Reply CTA).
    $n  = esc_html($name);
    $e  = esc_html($email);
    $c  = esc_html($company);
    $t  = esc_html($type);
    $m  = esc_html($message);
    $rowStyleL = 'padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;width:130px;vertical-align:top';
    $rowStyleR = 'padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#1A1A1A;vertical-align:top';

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
      . '<tr><td style="' . $rowStyleL . '">Name</td><td style="' . $rowStyleR . '"><strong style="font-weight:bold">' . $n . '</strong></td></tr>'
      . '<tr><td style="' . $rowStyleL . '">Email</td><td style="' . $rowStyleR . '"><a href="mailto:' . $e . '" style="color:#1A1A1A;text-decoration:underline">' . $e . '</a></td></tr>'
      . '<tr><td style="' . $rowStyleL . '">Company</td><td style="' . $rowStyleR . '">' . ($c !== '' ? $c : '&mdash;') . '</td></tr>'
      . '<tr><td style="' . $rowStyleL . '">Project type</td><td style="' . $rowStyleR . '">' . ($t !== '' ? $t : '&mdash;') . '</td></tr>'
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

    $resp = wp_remote_post('https://api.resend.com/emails', array(
        'timeout' => 15,
        'headers' => array(
            'Authorization' => 'Bearer ' . RESEND_API_KEY,
            'Content-Type'  => 'application/json',
        ),
        'body' => wp_json_encode(array(
            'from'     => 'Ashkan Studios <contact@ashkanstudios.com>',
            'to'       => array('info@ashkanstudios.com'),
            'bcc'      => array('leadquality@incrementors.com'),
            'reply_to' => $email,
            'subject'  => 'New enquiry from ' . $name . ($company !== '' ? ' - ' . $company : ''),
            'html'     => $html,
        )),
    ));

    if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) >= 300) {
        return false;
    }
    return true;
}
