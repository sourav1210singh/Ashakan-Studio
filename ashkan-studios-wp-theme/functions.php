<?php
/**
 * Ashkan Studios Theme Functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function ashkan_studios_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'ashkan-studios'),
        'footer' => __('Footer Menu', 'ashkan-studios'),
    ));
    
    // Add image sizes
    add_image_size('portfolio-thumb', 600, 800, true);
    add_image_size('portfolio-large', 1200, 800, true);
    add_image_size('leaf-card', 400, 1200, true);
}
add_action('after_setup_theme', 'ashkan_studios_setup');

/**
 * Enqueue Scripts and Styles
 */
function ashkan_studios_scripts() {
    // Google Fonts
    wp_enqueue_style('ashkan-fonts', 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Main stylesheet
    wp_enqueue_style('ashkan-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Custom scripts
    wp_enqueue_script('ashkan-main', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0.0', true);
    
    // Pass AJAX URL to script
    wp_localize_script('ashkan-main', 'ashkan_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('ashkan_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'ashkan_studios_scripts');

/**
 * Register Custom Post Types
 */
function ashkan_studios_register_post_types() {
    
    // Portfolio CPT
    $portfolio_labels = array(
        'name' => __('Portfolio', 'ashkan-studios'),
        'singular_name' => __('Portfolio Item', 'ashkan-studios'),
        'add_new' => __('Add New', 'ashkan-studios'),
        'add_new_item' => __('Add New Portfolio Item', 'ashkan-studios'),
        'edit_item' => __('Edit Portfolio Item', 'ashkan-studios'),
        'new_item' => __('New Portfolio Item', 'ashkan-studios'),
        'view_item' => __('View Portfolio Item', 'ashkan-studios'),
        'search_items' => __('Search Portfolio', 'ashkan-studios'),
        'not_found' => __('No portfolio items found', 'ashkan-studios'),
        'not_found_in_trash' => __('No portfolio items found in trash', 'ashkan-studios'),
    );
    
    $portfolio_args = array(
        'labels' => $portfolio_labels,
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'rewrite' => array('slug' => 'portfolio'),
        'show_in_rest' => true,
    );
    
    register_post_type('portfolio', $portfolio_args);
    
    // Portfolio Categories
    $portfolio_cat_labels = array(
        'name' => __('Portfolio Categories', 'ashkan-studios'),
        'singular_name' => __('Portfolio Category', 'ashkan-studios'),
    );
    
    $portfolio_cat_args = array(
        'labels' => $portfolio_cat_labels,
        'hierarchical' => true,
        'public' => true,
        'rewrite' => array('slug' => 'portfolio-category'),
        'show_in_rest' => true,
    );
    
    register_taxonomy('portfolio_category', 'portfolio', $portfolio_cat_args);
    
    // Services CPT
    $services_labels = array(
        'name' => __('Services', 'ashkan-studios'),
        'singular_name' => __('Service', 'ashkan-studios'),
        'add_new' => __('Add New', 'ashkan-studios'),
        'add_new_item' => __('Add New Service', 'ashkan-studios'),
        'edit_item' => __('Edit Service', 'ashkan-studios'),
        'new_item' => __('New Service', 'ashkan-studios'),
        'view_item' => __('View Service', 'ashkan-studios'),
        'search_items' => __('Search Services', 'ashkan-studios'),
        'not_found' => __('No services found', 'ashkan-studios'),
        'not_found_in_trash' => __('No services found in trash', 'ashkan-studios'),
    );
    
    $services_args = array(
        'labels' => $services_labels,
        'public' => true,
        'has_archive' => false,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 6,
        'menu_icon' => 'dashicons-admin-tools',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'rewrite' => array('slug' => 'services'),
        'show_in_rest' => true,
    );
    
    register_post_type('services', $services_args);
    
    // Storytime CPT (Blog)
    $storytime_labels = array(
        'name' => __('Storytime', 'ashkan-studios'),
        'singular_name' => __('Story', 'ashkan-studios'),
        'add_new' => __('Add New', 'ashkan-studios'),
        'add_new_item' => __('Add New Story', 'ashkan-studios'),
        'edit_item' => __('Edit Story', 'ashkan-studios'),
        'new_item' => __('New Story', 'ashkan-studios'),
        'view_item' => __('View Story', 'ashkan-studios'),
        'search_items' => __('Search Stories', 'ashkan-studios'),
        'not_found' => __('No stories found', 'ashkan-studios'),
        'not_found_in_trash' => __('No stories found in trash', 'ashkan-studios'),
    );
    
    $storytime_args = array(
        'labels' => $storytime_labels,
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 7,
        'menu_icon' => 'dashicons-book-alt',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'comments'),
        'rewrite' => array('slug' => 'storytime'),
        'show_in_rest' => true,
    );
    
    register_post_type('storytime', $storytime_args);
    
    // Press CPT
    $press_labels = array(
        'name' => __('Press', 'ashkan-studios'),
        'singular_name' => __('Press Item', 'ashkan-studios'),
        'add_new' => __('Add New', 'ashkan-studios'),
        'add_new_item' => __('Add New Press Item', 'ashkan-studios'),
        'edit_item' => __('Edit Press Item', 'ashkan-studios'),
        'new_item' => __('New Press Item', 'ashkan-studios'),
        'view_item' => __('View Press Item', 'ashkan-studios'),
        'search_items' => __('Search Press', 'ashkan-studios'),
        'not_found' => __('No press items found', 'ashkan-studios'),
        'not_found_in_trash' => __('No press items found in trash', 'ashkan-studios'),
    );
    
    $press_args = array(
        'labels' => $press_labels,
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 8,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'rewrite' => array('slug' => 'press'),
        'show_in_rest' => true,
    );
    
    register_post_type('press', $press_args);
}
add_action('init', 'ashkan_studios_register_post_types');

/**
 * Add ACF Options Page
 */
function ashkan_studios_acf_options() {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page(array(
            'page_title' => __('Theme Settings', 'ashkan-studios'),
            'menu_title' => __('Theme Settings', 'ashkan-studios'),
            'menu_slug' => 'theme-settings',
            'capability' => 'edit_posts',
            'redirect' => false
        ));
    }
}
add_action('acf/init', 'ashkan_studios_acf_options');

/**
 * Custom Excerpt Length
 */
function ashkan_studios_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'ashkan_studios_excerpt_length', 999);

/**
 * Custom Excerpt More
 */
function ashkan_studios_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'ashkan_studios_excerpt_more');

/**
 * Disable Gutenberg for specific post types (optional)
 */
function ashkan_studios_disable_gutenberg($use_block_editor, $post_type) {
    // Keep Gutenberg enabled for all post types
    return $use_block_editor;
}
add_filter('use_block_editor_for_post_type', 'ashkan_studios_disable_gutenberg', 10, 2);

/**
 * Add Custom Body Class
 */
function ashkan_studios_body_classes($classes) {
    if (is_page()) {
        $classes[] = 'page-' . get_post_field('post_name', get_post());
    }
    return $classes;
}
add_filter('body_class', 'ashkan_studios_body_classes');

/**
 * Custom Login Logo
 */
function ashkan_studios_login_logo() {
    ?>
    <style type="text/css">
        #login h1 a {
            background-image: url(<?php echo get_template_directory_uri(); ?>/images/logo.png);
            background-size: contain;
            width: 200px;
            height: 80px;
        }
    </style>
    <?php
}
add_action('login_enqueue_scripts', 'ashkan_studios_login_logo');

/**
 * Custom Login Logo URL
 */
function ashkan_studios_login_logo_url() {
    return home_url();
}
add_filter('login_headerurl', 'ashkan_studios_login_logo_url');

/**
 * Remove WordPress Version from Head
 */
function ashkan_studios_remove_version() {
    return '';
}
add_filter('the_generator', 'ashkan_studios_remove_version');

/**
 * Disable Emoji Scripts
 */
function ashkan_studios_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
}
add_action('init', 'ashkan_studios_disable_emojis');

/**
 * Add SVG Upload Support
 */
function ashkan_studios_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'ashkan_studios_mime_types');

/**
 * Custom Pagination
 */
function ashkan_studios_pagination() {
    global $wp_query;
    
    $big = 999999999;
    
    $paginate_links = paginate_links(array(
        'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
        'format' => '?paged=%#%',
        'current' => max(1, get_query_var('paged')),
        'total' => $wp_query->max_num_pages,
        'prev_text' => '&larr;',
        'next_text' => '&rarr;',
        'type' => 'list',
    ));
    
    if ($paginate_links) {
        echo '<nav class="pagination">' . $paginate_links . '</nav>';
    }
}

/**
 * Get Portfolio Items
 */
function ashkan_studios_get_portfolio($limit = -1, $category = '') {
    $args = array(
        'post_type' => 'portfolio',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    if (!empty($category)) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'portfolio_category',
                'field' => 'slug',
                'terms' => $category,
            ),
        );
    }
    
    return new WP_Query($args);
}

/**
 * Get Services
 */
function ashkan_studios_get_services($limit = -1) {
    $args = array(
        'post_type' => 'services',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'menu_order',
        'order' => 'ASC',
    );
    
    return new WP_Query($args);
}

/**
 * Get Storytime Posts
 */
function ashkan_studios_get_stories($limit = -1) {
    $args = array(
        'post_type' => 'storytime',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    return new WP_Query($args);
}

/**
 * Get Press Items
 */
function ashkan_studios_get_press($limit = -1) {
    $args = array(
        'post_type' => 'press',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    return new WP_Query($args);
}
