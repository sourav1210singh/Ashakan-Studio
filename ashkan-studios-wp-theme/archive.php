<?php
/**
 * The template for displaying archive pages
 */

get_header();
?>

<!-- Archive Hero -->
<section class="page-hero">
    <h1>
        <?php
        if (is_post_type_archive('portfolio')) {
            _e('Work', 'ashkan-studios');
        } elseif (is_post_type_archive('services')) {
            _e('What We Do', 'ashkan-studios');
        } elseif (is_post_type_archive('storytime')) {
            _e('Storytime', 'ashkan-studios');
        } elseif (is_post_type_archive('press')) {
            _e('Press', 'ashkan-studios');
        } else {
            the_archive_title();
        }
        ?>
    </h1>
    <?php if (get_the_archive_description()) : ?>
        <p><?php echo get_the_archive_description(); ?></p>
    <?php endif; ?>
</section>

<!-- Archive Grid -->
<div class="portfolio-grid">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            ?>
            <a href="<?php the_permalink(); ?>" class="portfolio-item">
                <?php if (has_post_thumbnail()) : ?>
                    <?php the_post_thumbnail('portfolio-thumb', array('alt' => get_the_title())); ?>
                <?php endif; ?>
                <div class="portfolio-overlay">
                    <h3><?php the_title(); ?></h3>
                    <?php
                    $post_type = get_post_type();
                    if ($post_type === 'portfolio') {
                        $categories = get_the_terms(get_the_ID(), 'portfolio_category');
                        if ($categories && !is_wp_error($categories)) {
                            $cat_names = wp_list_pluck($categories, 'name');
                            echo '<p>' . esc_html(implode(', ', $cat_names)) . '</p>';
                        }
                    } else {
                        echo '<p>' . get_the_date() . '</p>';
                    }
                    ?>
                </div>
            </a>
            <?php
        endwhile;
        
        ashkan_studios_pagination();
        
    else :
        ?>
        <p><?php _e('No items found.', 'ashkan-studios'); ?></p>
        <?php
    endif;
    ?>
</div>

<?php
get_footer();
