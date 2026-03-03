<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <?php wp_head(); ?>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/images/favicon.png">
</head>
<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<!-- Header -->
<header id="site-header">
    <nav role="navigation" aria-label="<?php _e('Main Navigation', 'ashkan-studios'); ?>">
        <!-- Left Navigation -->
        <ul class="nav-left">
            <li class="dropdown">
                <a href="<?php echo get_post_type_archive_link('portfolio'); ?>"><?php _e('Work', 'ashkan-studios'); ?></a>
                <div class="dropdown-content">
                    <?php
                    $portfolio_cats = get_terms(array(
                        'taxonomy' => 'portfolio_category',
                        'hide_empty' => false,
                    ));
                    foreach ($portfolio_cats as $cat) :
                    ?>
                        <a href="<?php echo get_term_link($cat); ?>"><?php echo esc_html($cat->name); ?></a>
                    <?php endforeach; ?>
                </div>
            </li>
            <li><a href="<?php echo get_post_type_archive_link('services'); ?>"><?php _e('What We Do', 'ashkan-studios'); ?></a></li>
            <li><a href="<?php echo get_permalink(get_page_by_path('studio')); ?>"><?php _e('The Studio', 'ashkan-studios'); ?></a></li>
        </ul>
        
        <!-- Logo -->
        <a href="<?php echo home_url('/'); ?>" class="logo" aria-label="<?php bloginfo('name'); ?>">
            <img src="<?php echo get_template_directory_uri(); ?>/images/logo.png" alt="<?php bloginfo('name'); ?>">
        </a>
        
        <!-- Right Navigation -->
        <ul class="nav-right">
            <li><a href="<?php echo get_permalink(get_page_by_path('about')); ?>"><?php _e('About', 'ashkan-studios'); ?></a></li>
            <li><a href="<?php echo get_permalink(get_page_by_path('contact')); ?>"><?php _e('Contact', 'ashkan-studios'); ?></a></li>
            <li><a href="<?php echo get_post_type_archive_link('storytime'); ?>"><?php _e('Storytime', 'ashkan-studios'); ?></a></li>
        </ul>
        
        <!-- Menu Button -->
        <button class="menu-btn" id="menuToggle" aria-label="<?php _e('Toggle Menu', 'ashkan-studios'); ?>">
            <span><?php _e('Menu', 'ashkan-studios'); ?></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
    </nav>
</header>

<!-- Full Screen Menu Overlay -->
<div class="menu-overlay" id="menuOverlay">
    <div class="menu-content">
        <!-- Main Navigation -->
        <div class="menu-main-links">
            <div class="menu-main-item">
                <a href="<?php echo get_post_type_archive_link('portfolio'); ?>"><?php _e('Work', 'ashkan-studios'); ?></a>
            </div>
            <div class="menu-main-item">
                <a href="<?php echo get_post_type_archive_link('services'); ?>"><?php _e('What We Do', 'ashkan-studios'); ?></a>
            </div>
            <div class="menu-main-item">
                <a href="<?php echo get_permalink(get_page_by_path('studio')); ?>"><?php _e('The Studio', 'ashkan-studios'); ?></a>
            </div>
            <div class="menu-main-item menu-main-item-last">
                <a href="<?php echo get_post_type_archive_link('press'); ?>"><?php _e('Press', 'ashkan-studios'); ?></a>
                <a href="<?php echo get_post_type_archive_link('storytime'); ?>" class="menu-storytime-link"><?php _e('Storytime', 'ashkan-studios'); ?></a>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="menu-bottom-bar">
            <div class="menu-bottom-social">
                <?php if (get_field('instagram_url', 'option')) : ?>
                    <a href="<?php echo esc_url(get_field('instagram_url', 'option')); ?>" target="_blank" rel="noopener"><?php _e('Instagram', 'ashkan-studios'); ?></a>
                <?php endif; ?>
                <?php if (get_field('linkedin_url', 'option')) : ?>
                    <a href="<?php echo esc_url(get_field('linkedin_url', 'option')); ?>" target="_blank" rel="noopener"><?php _e('LinkedIn', 'ashkan-studios'); ?></a>
                <?php endif; ?>
                <?php if (get_field('tiktok_url', 'option')) : ?>
                    <a href="<?php echo esc_url(get_field('tiktok_url', 'option')); ?>" target="_blank" rel="noopener"><?php _e('TikTok', 'ashkan-studios'); ?></a>
                <?php endif; ?>
            </div>
            <div class="menu-bottom-contact">
                <?php if (get_field('phone', 'option')) : ?>
                    <a href="tel:<?php echo esc_attr(get_field('phone', 'option')); ?>"><?php echo esc_html(get_field('phone', 'option')); ?></a>
                <?php endif; ?>
                <?php if (get_field('email', 'option')) : ?>
                    <a href="mailto:<?php echo esc_attr(get_field('email', 'option')); ?>"><?php echo esc_html(get_field('email', 'option')); ?></a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Main Content Wrapper -->
<main id="main-content">
