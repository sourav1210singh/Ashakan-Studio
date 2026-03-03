<?php
/**
 * The main template file
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero" id="hero">
    <div class="hero-images">
        <?php if (get_field('hero_cutout_1', 'option')) : ?>
            <img src="<?php echo esc_url(get_field('hero_cutout_1', 'option')); ?>" alt="" class="cutout-1">
        <?php endif; ?>
        <?php if (get_field('hero_cutout_2', 'option')) : ?>
            <img src="<?php echo esc_url(get_field('hero_cutout_2', 'option')); ?>" alt="" class="cutout-2">
        <?php endif; ?>
        <?php if (get_field('hero_cutout_3', 'option')) : ?>
            <img src="<?php echo esc_url(get_field('hero_cutout_3', 'option')); ?>" alt="" class="cutout-3">
        <?php endif; ?>
    </div>
    
    <h1><?php echo get_field('hero_headline', 'option') ? esc_html(get_field('hero_headline', 'option')) : __('We Create Visual Stories That Inspire', 'ashkan-studios'); ?></h1>
    
    <p><?php echo get_field('hero_description', 'option') ? esc_html(get_field('hero_description', 'option')) : __('Ashkan Studios is a Houston-based production company specializing in commercial photography, videography, and creative direction.', 'ashkan-studios'); ?></p>
    
    <div class="hero-buttons">
        <a href="<?php echo get_post_type_archive_link('portfolio'); ?>" class="btn btn-primary">
            <?php _e('View Our Work', 'ashkan-studios'); ?>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </a>
        <a href="<?php echo get_permalink(get_page_by_path('contact')); ?>" class="btn btn-outline">
            <?php _e('Get in Touch', 'ashkan-studios'); ?>
        </a>
    </div>
</section>

<!-- Work Section -->
<section class="work-section" id="work">
    <h2 class="work-headline"><?php _e('The Work', 'ashkan-studios'); ?></h2>
    
    <div class="campaign-scroll">
        <?php
        $portfolio = ashkan_studios_get_portfolio(8);
        if ($portfolio->have_posts()) :
            $count = 0;
            while ($portfolio->have_posts()) : $portfolio->the_post();
                if ($count % 2 === 0) :
                    if ($count > 0) echo '</div>';
                    echo '<div class="campaign-block">';
                endif;
                ?>
                <a href="<?php the_permalink(); ?>" class="leaf-image">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('leaf-card', array('alt' => get_the_title())); ?>
                    <?php endif; ?>
                    <div class="leaf-overlay">
                        <h3><?php the_title(); ?></h3>
                        <?php
                        $categories = get_the_terms(get_the_ID(), 'portfolio_category');
                        if ($categories && !is_wp_error($categories)) :
                            $cat_names = wp_list_pluck($categories, 'name');
                            echo '<p>' . esc_html(implode(', ', $cat_names)) . '</p>';
                        endif;
                        ?>
                    </div>
                </a>
                <?php
                $count++;
            endwhile;
            echo '</div>';
        endif;
        wp_reset_postdata();
        ?>
    </div>
</section>

<!-- Clients Section -->
<section class="clients-section" id="clients">
    <h2 class="clients-headline"><?php _e('Clients', 'ashkan-studios'); ?></h2>
    
    <div class="clients-grid">
        <?php
        if (have_rows('clients', 'option')) :
            while (have_rows('clients', 'option')) : the_row();
                $logo = get_sub_field('client_logo');
                $name = get_sub_field('client_name');
                if ($logo) :
                ?>
                <div class="client-logo">
                    <img src="<?php echo esc_url($logo); ?>" alt="<?php echo esc_attr($name); ?>">
                </div>
                <?php
                endif;
            endwhile;
        endif;
        ?>
    </div>
</section>

<!-- Services Section -->
<section class="services-section" id="services">
    <?php if (get_field('services_background', 'option')) : ?>
        <img src="<?php echo esc_url(get_field('services_background', 'option')); ?>" alt="" class="services-bg">
    <?php endif; ?>
    <div class="services-overlay"></div>
    
    <div class="services-content">
        <h2 class="services-headline"><?php echo get_field('services_headline', 'option') ? esc_html(get_field('services_headline', 'option')) : __('Full-Service Production', 'ashkan-studios'); ?></h2>
        
        <p><?php echo get_field('services_description', 'option') ? esc_html(get_field('services_description', 'option')) : __('From concept to delivery, our talented network brings your vision to life.', 'ashkan-studios'); ?></p>
        
        <div class="services-list">
            <?php
            $services = ashkan_studios_get_services();
            if ($services->have_posts()) :
                while ($services->have_posts()) : $services->the_post();
                    ?>
                    <a href="<?php the_permalink(); ?>" class="service-link"><?php the_title(); ?></a>
                    <?php
                endwhile;
            endif;
            wp_reset_postdata();
            ?>
        </div>
        
        <a href="<?php echo get_post_type_archive_link('services'); ?>" class="btn btn-outline" style="border-color: rgba(255,255,255,0.5); color: #fff;">
            <?php _e('Explore Services', 'ashkan-studios'); ?>
        </a>
    </div>
</section>

<!-- About Section -->
<section class="about-section" id="about">
    <div class="about-grid">
        <div class="about-content">
            <h2 class="about-headline"><?php echo get_field('about_headline', 'option') ? esc_html(get_field('about_headline', 'option')) : __('Based in Houston, TX Endless Possibilities', 'ashkan-studios'); ?></h2>
            
            <p><?php echo get_field('about_paragraph_1', 'option') ? esc_html(get_field('about_paragraph_1', 'option')) : __('Every project at Ashkan Studios begins with a story — yours. We guide it from concept to completion, handling all aspects of production in-house with care, precision, and intention.', 'ashkan-studios'); ?></p>
            
            <p><?php echo get_field('about_paragraph_2', 'option') ? esc_html(get_field('about_paragraph_2', 'option')) : __('Crazy concept? Bring it. Big production? No problem. Need total artistic guidance? Can\'t wait.', 'ashkan-studios'); ?></p>
            
            <p><?php echo get_field('about_paragraph_3', 'option') ? esc_html(get_field('about_paragraph_3', 'option')) : __('Curious? Meet the studio behind the work.', 'ashkan-studios'); ?></p>
            
            <a href="<?php echo get_permalink(get_page_by_path('about')); ?>" class="btn btn-primary"><?php _e('About Us', 'ashkan-studios'); ?></a>
        </div>
        
        <div class="about-image">
            <?php if (get_field('about_image', 'option')) : ?>
                <img src="<?php echo esc_url(get_field('about_image', 'option')); ?>" alt="<?php _e('Ashkan Studios', 'ashkan-studios'); ?>">
            <?php endif; ?>
        </div>
    </div>
</section>

<?php
get_footer();
