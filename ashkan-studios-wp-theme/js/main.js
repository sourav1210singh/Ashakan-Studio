/**
 * Ashkan Studios Theme JavaScript
 */

(function($) {
    'use strict';

    // DOM Ready
    $(document).ready(function() {
        
        // Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (menuToggle && menuOverlay) {
            menuToggle.addEventListener('click', function() {
                menuOverlay.classList.toggle('active');
                document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking on links
            const menuLinks = menuOverlay.querySelectorAll('a');
            menuLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
        
        // Header scroll effect
        const header = document.getElementById('site-header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Campaign scroll - horizontal scroll with mouse wheel
        const campaignScroll = document.querySelector('.campaign-scroll');
        if (campaignScroll) {
            campaignScroll.addEventListener('wheel', function(e) {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    this.scrollLeft += e.deltaY;
                }
            });
        }
        
        // Intersection Observer for animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.leaf-image, .portfolio-item, .client-logo').forEach(function(el) {
            observer.observe(el);
        });
        
        // Parallax effect for hero cutouts
        const cutouts = document.querySelectorAll('.cutout-1, .cutout-2, .cutout-3');
        if (cutouts.length > 0 && !window.matchMedia('(pointer: coarse)').matches) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                cutouts.forEach(function(cutout, index) {
                    const speed = 0.1 + (index * 0.05);
                    cutout.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
                });
            });
        }
        
    });

})(jQuery);
