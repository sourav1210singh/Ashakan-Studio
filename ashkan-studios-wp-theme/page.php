<?php
/**
 * The template for displaying all pages
 */

get_header();

while (have_posts()) :
    the_post();
    ?>
    
    <!-- Page Hero -->
    <section class="page-hero">
        <h1><?php the_title(); ?></h1>
        <?php if (has_excerpt()) : ?>
            <p><?php echo get_the_excerpt(); ?></p>
        <?php endif; ?>
    </section>
    
    <!-- Page Content -->
    <div class="page-content">
        <?php the_content(); ?>
    </div>
    
    <?php
endwhile;

get_footer();
