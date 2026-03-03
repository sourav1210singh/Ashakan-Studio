<?php
/**
 * The template for displaying all single posts
 */

get_header();

while (have_posts()) :
    the_post();
    ?>
    
    <!-- Single Post Hero -->
    <section class="page-hero">
        <h1><?php the_title(); ?></h1>
        <?php if (has_excerpt()) : ?>
            <p><?php echo get_the_excerpt(); ?></p>
        <?php endif; ?>
    </section>
    
    <!-- Featured Image -->
    <?php if (has_post_thumbnail()) : ?>
    <div class="featured-image">
        <?php the_post_thumbnail('full', array('alt' => get_the_title())); ?>
    </div>
    <?php endif; ?>
    
    <!-- Post Content -->
    <article class="single-content">
        <div class="post-meta">
            <span class="post-date"><?php echo get_the_date(); ?></span>
            <?php
            $categories = get_the_category();
            if ($categories) :
                echo '<span class="post-categories">' . esc_html($categories[0]->name) . '</span>';
            endif;
            ?>
        </div>
        
        <div class="post-content">
            <?php the_content(); ?>
        </div>
        
        <!-- Post Navigation -->
        <nav class="post-navigation">
            <?php
            previous_post_link('<div class="prev-post">%link</div>', '<span>' . __('Previous', 'ashkan-studios') . '</span> %title');
            next_post_link('<div class="next-post">%link</div>', '<span>' . __('Next', 'ashkan-studios') . '</span> %title');
            ?>
        </nav>
    </article>
    
    <?php
endwhile;

get_footer();
