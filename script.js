document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileNav();
    initHeaderScroll();
    initProductCarousel();
    initTestimonialsSlider();
    initCategoryTabs();
    initBackToTop();
    initScrollAnimations();
    initImageLazyLoading();
    initWishlistButtons();
    initQuickViewButtons();
});

/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */
function initMobileNav() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');

    if (!menuToggle || !mobileNav) return;

    function openNav() {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function() {
        if (mobileNav.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeNav);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeNav);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeNav();
        }
    });
}

/* =====================================================
   HEADER SCROLL EFFECT
   ===================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for shadow
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* =====================================================
   PRODUCT CAROUSEL
   ===================================================== */
function initProductCarousel() {
    const wrapper = document.getElementById('productsWrapper');
    const track = document.getElementById('productsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!wrapper || !track) return;

    const cardWidth = 296; // 280px card + 16px gap
    let currentPosition = 0;
    let maxPosition = 0;

    function calculateMaxPosition() {
        const visibleWidth = wrapper.offsetWidth;
        const totalWidth = track.scrollWidth;
        maxPosition = Math.max(0, totalWidth - visibleWidth);
    }

    function updateButtons() {
        if (prevBtn) {
            prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentPosition <= 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentPosition >= maxPosition ? 'none' : 'auto';
        }
    }

    function slide(direction) {
        calculateMaxPosition();
        
        if (direction === 'next') {
            currentPosition = Math.min(currentPosition + cardWidth, maxPosition);
        } else {
            currentPosition = Math.max(currentPosition - cardWidth, 0);
        }

        track.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => slide('prev'));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => slide('next'));
    }

    // Initialize
    calculateMaxPosition();
    updateButtons();

    // Recalculate on resize
    window.addEventListener('resize', function() {
        calculateMaxPosition();
        currentPosition = Math.min(currentPosition, maxPosition);
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons();
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                slide('next');
            } else {
                slide('prev');
            }
        }
    }
}

/* =====================================================
   TESTIMONIALS SLIDER
   ===================================================== */
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = cards.length;
    const visibleCards = window.innerWidth >= 768 ? 3 : 1;
    const maxIndex = Math.max(0, totalCards - visibleCards);

    // Create dots
    if (dotsContainer) {
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const cardWidth = cards[0].offsetWidth + 24; // Including gap
        track.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        updateDots();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // Auto-play
    let autoPlayInterval;

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                goToSlide(0);
            } else {
                goToSlide(currentIndex + 1);
            }
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start autoplay
    startAutoPlay();

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
}

/* =====================================================
   CATEGORY TABS
   ===================================================== */
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');

            // Here you would typically filter products based on category
            // For demo purposes, we'll just add a visual effect
            const productsTrack = document.getElementById('productsTrack');
            if (productsTrack) {
                productsTrack.style.opacity = '0.5';
                setTimeout(() => {
                    productsTrack.style.opacity = '1';
                }, 300);
            }
        });
    });
}

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =====================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ===================================================== */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
        '.section-title, .product-card, .gift-card, .banner-card, ' +
        '.collection-item, .gift-occasion, .testimonial-card, .trend-item'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 6) * 0.1}s`;
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

/* =====================================================
   IMAGE LAZY LOADING
   ===================================================== */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Add loading effect for all images
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.classList.add('img-loading');
            img.addEventListener('load', function() {
                this.classList.remove('img-loading');
            });
        }
    });
}

/* =====================================================
   WISHLIST FUNCTIONALITY
   ===================================================== */
function initWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.add-wishlist');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#DC3545';
                showToast('Added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showToast('Removed from wishlist');
            }

            // Add heart animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 300);
        });
    });
}

/* =====================================================
   QUICK VIEW FUNCTIONALITY
   ===================================================== */
function initQuickViewButtons() {
    const quickViewBtns = document.querySelectorAll('.quick-view');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // For demo purposes, show a toast
            showToast('Quick view coming soon!');
        });
    });
}

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background-color: #1B4D3E;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/* =====================================================
   ADD TO CART ANIMATION
   ===================================================== */
function addToCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');

    if (cartBtn && cartCount) {
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;

        // Animate cart icon
        cartBtn.classList.add('bounce');
        setTimeout(() => {
            cartBtn.classList.remove('bounce');
        }, 500);

        showToast('Added to cart!');
    }
}

/* =====================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* =====================================================
   KEYBOARD NAVIGATION SUPPORT
   ===================================================== */
document.addEventListener('keydown', function(e) {
    // Focus trap for modals
    if (e.key === 'Tab') {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav && mobileNav.classList.contains('active')) {
            const focusableElements = mobileNav.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});
