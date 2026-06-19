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
