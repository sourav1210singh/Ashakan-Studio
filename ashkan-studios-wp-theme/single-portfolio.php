<?php
/**
 * The template for displaying portfolio single posts
 */

get_header();

while (have_posts()) :
    the_post();
    ?>
    
    <!-- Portfolio Detail Header -->
    <div class="portfolio-detail">
        <div class="portfolio-detail-header">
            <h1><?php the_title(); ?></h1>
            <?php
            $categories = get_the_terms(get_the_ID(), 'portfolio_category');
            if ($categories && !is_wp_error($categories)) :
                $cat_names = wp_list_pluck($categories, 'name');
                echo '<p>' . esc_html(implode(', ', $cat_names)) . '</p>';
            endif;
            ?>
        </div>
        
        <!-- Portfolio Gallery -->
        <div class="portfolio-detail-gallery">
            <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('portfolio-large', array('alt' => get_the_title())); ?>
            <?php endif; ?>
            
            <?php
            // Additional gallery images from ACF
            if (have_rows('gallery_images')) :
                while (have_rows('gallery_images')) : the_row();
                    $image = get_sub_field('image');
                    if ($image) :
                    ?>
                    <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>">
                    <?php
                    endif;
                endwhile;
            endif;
            ?>
        </div>
        
        <!-- Portfolio Description -->
        <div class="portfolio-description">
            <?php the_content(); ?>
        </div>
        
        <!-- Portfolio Meta -->
        <div class="portfolio-meta">
            <?php if (get_field('client')) : ?>
                <div class="meta-item">
                    <h4><?php _e('Client', 'ashkan-studios'); ?></h4>
                    <p><?php echo esc_html(get_field('client')); ?></p>
                </div>
            <?php endif; ?>
            
            <?php if (get_field('date')) : ?>
                <div class="meta-item">
                    <h4><?php _e('Date', 'ashkan-studios'); ?></h4>
                    <p><?php echo esc_html(get_field('date')); ?></p>
                </div>
            <?php endif; ?>
            
            <?php if (get_field('services_provided')) : ?>
                <div class="meta-item">
                    <h4><?php _e('Services', 'ashkan-studios'); ?></h4>
                    <p><?php echo esc_html(get_field('services_provided')); ?></p>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Back to Work -->
        <div class="back-to-work">
            <a href="<?php echo get_post_type_archive_link('portfolio'); ?>" class="btn btn-outline">
                <?php _e('Back to Work', 'ashkan-studios'); ?>
            </a>
        </div>
    </div>
    
    <?php
endwhile;

get_footer();
