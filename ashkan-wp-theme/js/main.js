/**
 * Ashkan Studios - Main JavaScript
 * WordPress Theme Functions
 */

(function() {
  'use strict';

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.getElementById('site-header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // MOBILE MENU OVERLAY
  // ============================================
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuClose = document.getElementById('menu-close');
  const menuLinks = document.querySelectorAll('.menu-item a');

  function openMenu() {
    if (menuOverlay) {
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    if (menuOverlay) {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  menuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  // Work Headline Letter Animation
  const workHeadline = document.querySelector('.work-headline');
  if (workHeadline) {
    // Split text into letters
    const text = workHeadline.textContent;
    workHeadline.innerHTML = '';
    text.split('').forEach(function(letter, index) {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      span.style.transitionDelay = (index * 0.06) + 's';
      workHeadline.appendChild(span);
    });

    const workObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          workObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    workObserver.observe(workHeadline);
  }

  // Clients Headline Word Animation
  const clientsHeadline = document.querySelector('.clients-headline');
  if (clientsHeadline) {
    // Split text into words
    const text = clientsHeadline.textContent.trim();
    clientsHeadline.innerHTML = '';
    text.split(' ').forEach(function(word) {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word + '\u00A0';
      clientsHeadline.appendChild(span);
    });

    const clientsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          clientsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    clientsObserver.observe(clientsHeadline);
  }

  // Services Headline Line Animation
  const servicesHeadline = document.querySelector('.services-headline');
  if (servicesHeadline) {
    const servicesObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          servicesObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    servicesObserver.observe(servicesHeadline);
  }

  // ============================================
  // HERO CUTOUT STAGGERED SWAP ANIMATION
  // ============================================
  const cutouts = document.querySelectorAll('.hero-cutout');
  
  if (cutouts.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Initial animation on page load
    setTimeout(function() {
      cutouts.forEach(function(cutout, index) {
        setTimeout(function() {
          cutout.classList.add('animate-in');
        }, index * 200);
      });
    }, 500);

    // Staggered swap animation
    const swapImages = function(cutout) {
      const img = cutout.querySelector('img');
      const altImages = cutout.dataset.altImages;
      
      if (!altImages) return;
      
      const images = altImages.split(',');
      let currentIndex = 0;
      
      // Find current image index
      images.forEach(function(src, idx) {
        if (img.src.includes(src.trim())) {
          currentIndex = idx;
        }
      });
      
      // Get next image
      const nextIndex = (currentIndex + 1) % images.length;
      const nextSrc = images[nextIndex].trim();
      
      // Animate out
      cutout.style.opacity = '0';
      cutout.style.transform = 'scale(0.92) translateY(12px)';
      
      setTimeout(function() {
        img.src = nextSrc;
        // Animate in
        cutout.style.opacity = '1';
        cutout.style.transform = 'scale(1) translateY(0)';
      }, 400);
    };

    // Set up random interval swaps for each cutout
    cutouts.forEach(function(cutout) {
      if (cutout.dataset.altImages) {
        const randomInterval = function() {
          return Math.random() * 4000 + 3000; // 3-7 seconds
        };
        
        const scheduleSwap = function() {
          setTimeout(function() {
            swapImages(cutout);
            scheduleSwap();
          }, randomInterval());
        };
        
        // Start swapping after initial animation
        setTimeout(scheduleSwap, 3000);
      }
    });
  } else {
    // Show cutouts immediately if reduced motion
    cutouts.forEach(function(cutout) {
      cutout.classList.add('animate-in');
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // PARALLAX EFFECT FOR SERVICES BACKGROUND
  // ============================================
  const servicesBg = document.querySelector('.services-bg');
  
  if (servicesBg && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      servicesBg.style.transform = 'translateY(' + rate + 'px)';
    });
  }

  // ============================================
  // FOOTER COPYRIGHT YEAR UPDATE
  // ============================================
  const copyrightYear = document.querySelector('.footer-copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

})();
