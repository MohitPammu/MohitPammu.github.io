/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTFOLIO WEBSITE - MAIN JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        script.js
 * @version     3.1.1
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Main JavaScript for portfolio website with performance
 *              optimization, security features, and mobile support
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * - config.js (global CONFIG object - paths, features, settings)
 * - security-utils.js (SecurityUtils object - sanitization functions)
 * - loading.js (loading animation & app initialization)
 * - main.js (orchestration layer)
 * - skills-sphere.js (3D skills visualization)
 * - Font Awesome 6.0+ (icons)
 * - Formspree API (contact form submission)
 * 
 * ───────────────────────────────────────────────────────────────────
 * BROWSER SUPPORT
 * ───────────────────────────────────────────────────────────────────
 * - Chrome 90+
 * - Firefox 88+
 * - Safari 14+
 * - Edge 90+
 * - Mobile Safari (iOS 14+)
 * - Chrome Mobile (Android 10+)
 * 
 * ───────────────────────────────────────────────────────────────────
 * FEATURES
 * ───────────────────────────────────────────────────────────────────
 * ✓ Auto-hide navigation with mouse proximity detection
 * ✓ Mobile hamburger menu with glassmorphic dropdown
 * ✓ Smooth scrolling & active section highlighting
 * ✓ Dynamic theme switcher (dark/light)
 * ✓ Project filtering with animations
 * ✓ Multi-layer contact form security
 * ✓ Industry news RSS feed integration
 * ✓ Skills sphere project linking
 * ✓ Back-to-top button
 * ✓ Dynamic fixed button positioning (mobile)
 * ✓ Typed text animation
 * 
 * ───────────────────────────────────────────────────────────────────
 * PERFORMANCE OPTIMIZATIONS
 * ───────────────────────────────────────────────────────────────────
 * - Deferred initialization (post-loading animation)
 * - Throttled scroll/mousemove listeners via requestAnimationFrame
 * - Passive event listeners where possible
 * - Intersection Observer for section detection
 * - Minimal DOM queries (cached references)
 * 
 * ───────────────────────────────────────────────────────────────────
 * SECURITY FEATURES
 * ───────────────────────────────────────────────────────────────────
 * - Input sanitization (XSS prevention)
 * - Honeypot spam protection
 * - Rate limiting (60s cooldown)
 * - Session attempt limiting (3 max)
 * - URL/image validation (via SecurityUtils)
 * - HTML escape for user content
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. SCRIPT CONFIGURATION
 * 2. SECURITY UTILITIES FALLBACK
 * 3. LOADING ANIMATION HANDLER
 * 4. NAVIGATION SYSTEM
 *    - Auto-hide Navigation
 *    - Mobile Hamburger Menu
 *    - Smooth Scrolling
 *    - Active Section Highlighting
 * 5. FIXED UI ELEMENTS
 *    - Theme Switcher
 *    - Back to Top Button
 *    - Dynamic Button Positioning (Mobile)
 * 6. PROJECT FILTERING
 * 7. CONTACT FORM
 *    - Validation
 *    - Security Checks
 *    - Submission Handler
 * 8. TYPED TEXT ANIMATION
 * 9. INDUSTRY NEWS
 *    - RSS Feed Parser
 *    - Source Icons
 *    - Image Extraction
 * 10. SKILLS SPHERE INTEGRATION
 * 11. INITIALIZATION
 * 12. CREDENTIALS CAROUSEL/PAGINATION SYSTEM
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/**
 * ═══════════════════════════════════════════════════════════════════
 * 1. SCRIPT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * NOTE: Named SCRIPT_CONFIG to avoid collision with global CONFIG
 *       from config.js which handles paths, features, and environment.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

const SCRIPT_CONFIG = {
    // Navigation
    NAV_SCROLL_THRESHOLD: 100,           // Pixels scrolled before auto-hide
    NAV_MOUSE_PROXIMITY: 50,             // Pixels from top to reveal nav
    MOBILE_BREAKPOINT: 768,              // Mobile vs desktop breakpoint
    
    // Back to Top
    BACK_TO_TOP_THRESHOLD: 300,          // Show button after scrolling
    
    // Typed Text Animation
    TYPING_DELAY: 100,                   // ms per character typed
    ERASING_DELAY: 50,                   // ms per character erased
    NEW_TEXT_DELAY: 2000,                // Pause at end of text
    
    // Contact Form Security
    SUBMIT_COOLDOWN: 60000,              // 60s between submissions
    MAX_ATTEMPTS_PER_SESSION: 3,         // Max form submissions per session
    SUCCESS_MESSAGE_DURATION: 4000,      // How long to show success message
    
    // News
    MAX_NEWS_ITEMS: 3,                   // Number of news articles to display
    
    // Project Scroll
    PROJECT_SCROLL_THRESHOLD: 0.6,       // 60% of card visible
    PROJECT_HIGHLIGHT_DURATION: 2000,    // Duration of highlight animation
    OBSERVER_TIMEOUT: 10000              // Auto-cleanup observer after 10s
};

// App initialization state
let isAppReady = false;


/**
 * ═══════════════════════════════════════════════════════════════════
 * 2. SECURITY UTILITIES FALLBACK
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Check if SecurityUtils exists (from security-utils.js).
 * If not, provide fallback implementations.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

if (typeof SecurityUtils === 'undefined') {
    window.SecurityUtils = {
        /**
         * Escape HTML to prevent XSS attacks
         * @param {string} unsafe - Untrusted string
         * @returns {string} HTML-escaped string
         */
        escapeHtml(unsafe) {
            const div = document.createElement('div');
            div.textContent = unsafe;
            return div.innerHTML;
        },
        
        /**
         * Sanitize URL to prevent javascript: and data: URIs
         * @param {string} url - URL to validate
         * @returns {string|null} Safe URL or null if malicious
         */
        sanitizeUrl(url) {
            if (!url || typeof url !== 'string') return null;
            
            const urlLower = url.toLowerCase().trim();
            
            // Block dangerous protocols
            if (urlLower.startsWith('javascript:') || 
                urlLower.startsWith('data:') ||
                urlLower.startsWith('vbscript:')) {
                return null;
            }
            
            // Allow http(s) and relative URLs
            if (urlLower.startsWith('http://') || 
                urlLower.startsWith('https://') ||
                urlLower.startsWith('/') ||
                urlLower.startsWith('#')) {
                return url;
            }
            
            return null;
        },
        
        /**
         * Validate image URL
         * @param {string} url - Image URL to validate
         * @returns {string|null} Safe image URL or null
         */
        sanitizeImageUrl(url) {
            if (!url || typeof url !== 'string') return null;
            
            const urlLower = url.toLowerCase().trim();
            
            // Block dangerous protocols
            if (urlLower.startsWith('javascript:') || 
                urlLower.startsWith('data:text') ||
                urlLower.startsWith('vbscript:')) {
                return null;
            }
            
            // Allow http(s), data:image, and relative URLs
            if (urlLower.startsWith('http://') || 
                urlLower.startsWith('https://') ||
                urlLower.startsWith('data:image/') ||
                urlLower.startsWith('/')) {
                return url;
            }
            
            return null;
        }
    };
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 3. LOADING ANIMATION HANDLER
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Waits for loading animation completion before initializing
 * CPU/GPU intensive features. Triggered by main.js via custom event.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

document.addEventListener('appReady', function(event) {
    isAppReady = true;
    
    // Initialize heavy features after loading completes
    initTypedText();
    loadIndustryNews();
    
    // Initialize skills sphere if available
    if (typeof window.initializeSkillsSphere === 'function') {
        window.initializeSkillsSphere();
    }
});


/**
 * ═══════════════════════════════════════════════════════════════════
 * 4. NAVIGATION SYSTEM
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * ───────────────────────────────────────────────────────────────────
 * 4.1 Auto-Hide Navigation
 * ───────────────────────────────────────────────────────────────────
 * 
 * Hides navigation on scroll down, shows on scroll up or mouse proximity.
 * Desktop: Mouse proximity detection enabled
 * Mobile: Scroll-based only (performance optimization)
 * 
 * Performance: Throttled via requestAnimationFrame
 * 
 * ───────────────────────────────────────────────────────────────────
 */
function initAutoHideNavigation() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let isHeaderHidden = false;
    const isMobile = window.innerWidth <= SCRIPT_CONFIG.MOBILE_BREAKPOINT;
    let scrollTicking = false;
    let mouseTicking = false;
    
    // Ensure header is visible on page load
    header.classList.remove('hidden');
    isHeaderHidden = false;
    
    /**
     * Update header visibility based on scroll position
     */
    function updateHeaderOnScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > SCRIPT_CONFIG.NAV_SCROLL_THRESHOLD) {
            // Scrolled down - hide header
            if (scrollTop > lastScrollTop && !isHeaderHidden) {
                header.classList.add('hidden');
                isHeaderHidden = true;
            } 
            // Scrolled up - show header
            else if (scrollTop < lastScrollTop && isHeaderHidden) {
                header.classList.remove('hidden');
                isHeaderHidden = false;
            }
        } else {
            // Near top - always show header
            header.classList.remove('hidden');
            isHeaderHidden = false;
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        scrollTicking = false;
    }
    
    // Throttled scroll listener (all devices)
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(updateHeaderOnScroll);
            scrollTicking = true;
        }
    }, { passive: true });
    
    
    /**
     * DESKTOP ONLY: Mouse proximity detection
     * Shows header when mouse moves near top of viewport
     */
    if (!isMobile) {
        function updateHeaderOnMouseMove(e) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > SCRIPT_CONFIG.NAV_SCROLL_THRESHOLD && isHeaderHidden) {
                if (e.clientY < SCRIPT_CONFIG.NAV_MOUSE_PROXIMITY) {
                    header.classList.remove('hidden');
                    isHeaderHidden = false;
                }
            }
            mouseTicking = false;
        }
        
        // Throttled mousemove listener (desktop only)
        document.addEventListener('mousemove', function(e) {
            if (!mouseTicking) {
                requestAnimationFrame(() => updateHeaderOnMouseMove(e));
                mouseTicking = true;
            }
        }, { passive: true });
    }
}


/**
 * ───────────────────────────────────────────────────────────────────
 * 4.2 Mobile Hamburger Menu
 * ───────────────────────────────────────────────────────────────────
 * 
 * Glassmorphic dropdown menu with blur overlay.
 * Features: Click outside to close, scroll to close, smooth animations
 * 
 * ───────────────────────────────────────────────────────────────────
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (!hamburger || !navMenu) return;
    
    // Create blur overlay
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileOverlay);
    
    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }
    
    // Hamburger toggle
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('active');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });
    
    // Close on overlay click
    mobileOverlay.addEventListener('click', closeMobileMenu);
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        const isClickInsideNav = navMenu.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Prevent menu clicks from bubbling
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Close menu on scroll (professional UX standard)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (navMenu.classList.contains('active')) {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            // Close if scrolled more than 10px
            if (scrollDelta > 10) {
                closeMobileMenu();
            }
            
            lastScrollY = currentScrollY;
        }
    }, { passive: true });
}


/**
 * ───────────────────────────────────────────────────────────────────
 * 4.3 Smooth Scrolling for Navigation Links
 * ───────────────────────────────────────────────────────────────────
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const navMenu = document.querySelector('nav ul');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle hash links
            if (!this.getAttribute('href').startsWith('#')) return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.querySelector('.hamburger')?.classList.remove('active');
                    document.querySelector('.mobile-menu-overlay')?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }

                document.documentElement.classList.add('smooth-scroll');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    document.documentElement.classList.remove('smooth-scroll');
                }, 1000); // Remove after 1s
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}


/**
 * ───────────────────────────────────────────────────────────────────
 * 4.4 Active Section Highlighting
 * ───────────────────────────────────────────────────────────────────
 * 
 * Uses Intersection Observer to detect which section is in viewport
 * and highlights corresponding navigation link.
 * 
 * Performance: More efficient than scroll listeners
 * 
 * ───────────────────────────────────────────────────────────────────
 */
function initActiveNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',  // Trigger when section is 20-30% into viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 5. FIXED UI ELEMENTS
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * ───────────────────────────────────────────────────────────────────
 * 5.1 Theme Switcher
 * ───────────────────────────────────────────────────────────────────
 * 
 * Toggles between dark and light themes.
 * Persists preference in localStorage.
 * 
 * ───────────────────────────────────────────────────────────────────
 */
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const rootEl = document.documentElement;
    
    if (!themeSwitcher) return;
    
    // Load saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    rootEl.setAttribute('data-theme', currentTheme);
    
    /**
     * Update theme icon based on current theme
     */
    function updateThemeIcon() {
        const currentTheme = rootEl.getAttribute('data-theme');
        const icon = themeSwitcher.querySelector('i');
        
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';  // Sun icon for light theme
        } else {
            icon.className = 'fas fa-moon'; // Moon icon for dark theme
        }
    }
    
    updateThemeIcon();
    
    // Toggle theme on click
    themeSwitcher.addEventListener('click', function() {
        let theme = rootEl.getAttribute('data-theme');
        
        if (theme === 'dark') {
            rootEl.setAttribute('data-theme', 'light');
            theme = 'light';
        } else {
            rootEl.setAttribute('data-theme', 'dark');
            theme = 'dark';
        }
        
        localStorage.setItem('theme', theme);
        updateThemeIcon();
    });
}


/**
 * ───────────────────────────────────────────────────────────────────
 * 5.2 Back to Top Button
 * ───────────────────────────────────────────────────────────────────
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > SCRIPT_CONFIG.BACK_TO_TOP_THRESHOLD) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }, { passive: true });
    
    // Smooth scroll to top on click
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/**
 * ───────────────────────────────────────────────────────────────────
 * 5.3 Dynamic Fixed Button Positioning (Mobile Only)
 * ───────────────────────────────────────────────────────────────────
 * 
 * Moves theme switcher and back-to-top buttons up when footer is
 * visible to prevent covering footer social icons.
 * 
 * Performance: Uses Intersection Observer (no scroll listeners)
 * Mobile Only: Automatically disabled on desktop
 * 
 * CSS: Controlled via .footer-visible class on <body>
 * 
 * ───────────────────────────────────────────────────────────────────
 */
function initDynamicButtonPositioning() {
    // Only run on mobile
    if (window.innerWidth > SCRIPT_CONFIG.MOBILE_BREAKPOINT) return;
    
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Intersection Observer configuration
    const observerOptions = {
        root: null,           // Use viewport as root
        rootMargin: '0px',    // No margin
        threshold: 0.1        // Trigger when 10% of footer is visible
    };
    
    // Create observer
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Footer visible - elevate buttons
                document.body.classList.add('footer-visible');
            } else {
                // Footer not visible - return to normal position
                document.body.classList.remove('footer-visible');
            }
        });
    }, observerOptions);
    
    // Start observing footer
    footerObserver.observe(footer);
    
    // Re-initialize on window resize (mobile ↔ desktop transition)
    let resizeTimer;
    window.addEventListener('resize', () => {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > SCRIPT_CONFIG.MOBILE_BREAKPOINT) {
                // Desktop - remove class and disconnect observer
                document.body.classList.remove('footer-visible');
                footerObserver.disconnect();
            } else {
                // Mobile - ensure observer is active
                footerObserver.observe(footer);
            }
        }, 250);
    });
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 6. PROJECT FILTERING
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Filter projects by category with fade animations.
 * Categories: all, data-viz, ml-ai, web-dev
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Show all projects initially
    projectCards.forEach(card => card.classList.add('visible'));
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                card.classList.remove('visible');
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                }, 50);
            });
        });
    });
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 7. CONTACT FORM
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Secure contact form with multi-layer protection:
 * - Honeypot (bot detection)
 * - Rate limiting (60s cooldown)
 * - Attempt limiting (3 per session)
 * - Input validation & sanitization
 * - XSS prevention
 * 
 * Submission: Formspree API
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    // Security state
    let lastSubmitTime = 0;
    
    // Disable browser validation (we handle it)
    contactForm.setAttribute('novalidate', true);
    
    // Create error message elements
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorMsg = document.createElement('span');
        errorMsg.className = 'form-error';
        errorMsg.style.display = 'none';
        formGroup.appendChild(errorMsg);
        
        // Clear error on input
        input.addEventListener('input', function() {
            if (errorMsg.style.display !== 'none') {
                errorMsg.style.display = 'none';
                input.classList.remove('error');
            }
        });
    });
    
    /**
     * Validate individual form field
     */
    function validateField(input, errorMsg) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        // Required field check
        if (!value) {
            showError(input, errorMsg, 'Please fill out this field');
            return false;
        }
        
        // Email validation
        if (type === 'email' || name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                showError(input, errorMsg, 'Please enter a valid email address');
                return false;
            }
            
            // Check for suspicious characters
            const suspiciousChars = /[<>{}[\]\\();"']/;
            if (suspiciousChars.test(value)) {
                showError(input, errorMsg, 'Invalid characters in email');
                return false;
            }
        }
        
        // Name validation
        if (name === 'name') {
            const nameRegex = /^[a-zA-Z\s'-]+$/;
            if (!nameRegex.test(value)) {
                showError(input, errorMsg, 'Please enter a valid name');
                return false;
            }
            
            if (value.length < 2 || value.length > 100) {
                showError(input, errorMsg, 'Name must be between 2-100 characters');
                return false;
            }
        }
        
        // Subject validation
        if (name === 'subject') {
            if (value.length < 3 || value.length > 200) {
                showError(input, errorMsg, 'Subject must be between 3-200 characters');
                return false;
            }
        }
        
        // Message validation
        if (name === 'message') {
            if (value.length < 10) {
                showError(input, errorMsg, 'Message must be at least 10 characters');
                return false;
            }
            
            if (value.length > 5000) {
                showError(input, errorMsg, 'Message is too long (max 5000 characters)');
                return false;
            }
            
            // Check for excessive links (spam indicator)
            const urlCount = (value.match(/https?:\/\//gi) || []).length;
            if (urlCount > 2) {
                showError(input, errorMsg, 'Too many links detected');
                return false;
            }
        }
        
        // Field is valid
        errorMsg.style.display = 'none';
        input.classList.remove('error');
        return true;
    }
    
    /**
     * Show validation error
     */
    function showError(input, errorMsg, message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        input.classList.add('error');
    }
    
    /**
     * Form submission handler
     */
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Security Check 1: Honeypot (bot detection)
        const honeypot = document.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value !== '') {
            // Bot detected - silent fail
            contactForm.reset();
            return;
        }
        
        // Security Check 2: Rate Limiting
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime;
        
        if (timeSinceLastSubmit < SCRIPT_CONFIG.SUBMIT_COOLDOWN) {
            const remainingTime = Math.ceil((SCRIPT_CONFIG.SUBMIT_COOLDOWN - timeSinceLastSubmit) / 1000);
            alert(`Please wait ${remainingTime} seconds before submitting again.`);
            return;
        }
        
        // Security Check 3: Attempt Limiting
        const sessionAttempts = parseInt(sessionStorage.getItem('formAttempts') || '0');
        if (sessionAttempts >= SCRIPT_CONFIG.MAX_ATTEMPTS_PER_SESSION) {
            alert('Maximum submission attempts reached. Please refresh the page and try again later.');
            return;
        }
        
        // Security Check 4: Input Validation
        let isValid = true;
        let firstInvalidField = null;
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const errorMsg = formGroup.querySelector('.form-error');
            
            if (!validateField(input, errorMsg)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
                
                // Auto-hide error after 3 seconds
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                    input.classList.remove('error');
                }, 3000);
            }
        });
        
        if (!isValid) {
            // Scroll to first invalid field if not in viewport
            if (firstInvalidField) {
                const rect = firstInvalidField.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isInViewport) {
                    firstInvalidField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
                
                setTimeout(() => {
                    firstInvalidField.focus();
                }, isInViewport ? 0 : 500);
            }
            return;
        }
        
        // Security Check 5: Input Sanitization
        const formData = new FormData(contactForm);
        
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                const sanitized = value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]*>/g, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .trim();
                
                formData.set(key, sanitized);
            }
        }
        
        // Update security state
        lastSubmitTime = now;
        sessionStorage.setItem('formAttempts', sessionAttempts + 1);
        
        // Submit to Formspree
        fetch('https://formspree.io/f/meoggbop', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            const formContainer = contactForm.parentNode;
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-lg); background-color: var(--card-bg); 
                border-radius: var(--radius-card); box-shadow: 0 5px 15px var(--shadow-color); opacity: 0; 
                transition: opacity 0.6s ease;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); 
                    margin-bottom: var(--spacing-md);"></i>
                    <h3 style="margin-bottom: var(--spacing-sm);">Thank you for your message!</h3>
                    <p style="color: var(--light-text-color);">I will get back to you as soon as possible.</p>
                </div>
            `;
            
            contactForm.style.display = 'none';
            formContainer.insertBefore(successMsg, contactForm);
            
            // Fade in success message
            const successContent = successMsg.querySelector('div');
            setTimeout(() => successContent.style.opacity = '1', 100);
            
            // Reset form and clear errors
            contactForm.reset();
            inputs.forEach(input => {
                input.classList.remove('error');
                const formGroup = input.closest('.form-group');
                const errorMsg = formGroup.querySelector('.form-error');
                if (errorMsg) errorMsg.style.display = 'none';
            });
            
            // Reset attempt counter
            sessionStorage.setItem('formAttempts', '0');
            
            // Hide success message and restore form after delay
            setTimeout(() => {
                successContent.style.opacity = '0';
                setTimeout(() => {
                    successMsg.remove();
                    contactForm.style.display = 'block';
                }, 600);
            }, SCRIPT_CONFIG.SUCCESS_MESSAGE_DURATION);
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('Oops! There was a problem submitting your form. Please try again or email me directly at mopammu@gmail.com');
        });
    });
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 8. TYPED TEXT ANIMATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Animated typing effect for hero section subtitle.
 * Cycles through multiple role titles.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
function initTypedText() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    if (!typedTextSpan || !cursorSpan) return;
    
    const textArray = [
        "Data Analyst", 
        "Insight Architect", 
        "Visual Storyteller", 
        "Pattern Hunter", 
        "Impact Strategist"
    ];
    
    let textArrayIndex = 0;
    let charIndex = 0;
    
    /**
     * Type characters one by one
     */
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, SCRIPT_CONFIG.TYPING_DELAY);
        } else {
            cursorSpan.classList.remove('typing');
            setTimeout(erase, SCRIPT_CONFIG.NEW_TEXT_DELAY);
        }
    }
    
    /**
     * Erase characters one by one
     */
    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, SCRIPT_CONFIG.ERASING_DELAY);
        } else {
            cursorSpan.classList.remove('typing');
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) {
                textArrayIndex = 0;
            }
            setTimeout(type, SCRIPT_CONFIG.TYPING_DELAY + 1100);
        }
    }
    
    // Start typing animation with delay
    if (textArray.length) {
        setTimeout(type, SCRIPT_CONFIG.NEW_TEXT_DELAY + 250);
    }
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 9. INDUSTRY NEWS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Fetches and displays industry news from RSS feed.
 * Features: Source icons, image extraction, category detection
 * 
 * Security: All URLs/images validated via SecurityUtils
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * ───────────────────────────────────────────────────────────────────
 * Source Icon Mapping
 * ───────────────────────────────────────────────────────────────────
 */
const sourceIcons = {
    simplilearn: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2ZmNjUwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
    unite: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzUwNTVlYiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5VPC90ZXh0Pjwvc3ZnPg==',
    towards: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAzYTlmNCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
    kdnuggets: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2ZmZDcwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiPks8L3RleHQ+PC9zdmc+',
    analyticsvidhya: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzJkYmZkZiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5BPC90ZXh0Pjwvc3ZnPg==',
    medium: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5NPC90ZXh0Pjwvc3ZnPg==',
    datacamp: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAzZWY2MiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5EPC90ZXh0Pjwvc3ZnPg==',
    default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzc1NzU3NSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg=='
};

/**
 * Get source icon based on source name or URL
 */
function getSourceIcon(source, url) {
    if (!source && !url) return sourceIcons.default;
    
    const sourceLower = (source || '').toLowerCase();
    const urlLower = (url || '').toLowerCase();
    
    // Check source name first
    if (sourceLower.includes('simplilearn')) return sourceIcons.simplilearn;
    if (sourceLower.includes('unite')) return sourceIcons.unite;
    if (sourceLower.includes('towards data science')) return sourceIcons.towards;
    if (sourceLower.includes('kdnuggets')) return sourceIcons.kdnuggets;
    if (sourceLower.includes('analytics vidhya')) return sourceIcons.analyticsvidhya;
    if (sourceLower.includes('medium')) return sourceIcons.medium;
    if (sourceLower.includes('datacamp')) return sourceIcons.datacamp;
    
    // Check URL
    if (urlLower.includes('simplilearn.com')) return sourceIcons.simplilearn;
    if (urlLower.includes('unite.ai')) return sourceIcons.unite;
    if (urlLower.includes('towardsdatascience.com')) return sourceIcons.towards;
    if (urlLower.includes('kdnuggets.com')) return sourceIcons.kdnuggets;
    if (urlLower.includes('analyticsvidhya.com')) return sourceIcons.analyticsvidhya;
    if (urlLower.includes('medium.com')) return sourceIcons.medium;
    if (urlLower.includes('datacamp.com')) return sourceIcons.datacamp;
    
    return sourceIcons.default;
}

/**
 * Get category icon based on article title
 */
function getCategoryIcon(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('generative')) {
        return 'fa-robot';
    } else if (titleLower.includes('python')) {
        return 'fa-python';
    } else if (titleLower.includes('data')) {
        return 'fa-database';
    } else if (titleLower.includes('code') || titleLower.includes('programming')) {
        return 'fa-code';
    } else if (titleLower.includes('analytics')) {
        return 'fa-chart-pie';
    }
    
    return 'fa-chart-line';
}

/**
 * Format date string
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Extract image URL from RSS item content
 */
function extractImageFromContent(item) {
    // Priority 1: Dedicated image fields
    if (item.thumbnail) return item.thumbnail;
    
    // Check enclosure for images
    if (item.enclosure) {
        if (typeof item.enclosure === 'string') {
            return item.enclosure;
        } else if (item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
            return item.enclosure.url;
        }
    }
    
    // Check media RSS fields
    if (item['media:thumbnail']) {
        if (typeof item['media:thumbnail'] === 'string') {
            return item['media:thumbnail'];
        } else if (item['media:thumbnail'].url) {
            return item['media:thumbnail'].url;
        }
    }
    
    if (item['media:content']) {
        if (typeof item['media:content'] === 'string') {
            return item['media:content'];
        } else if (item['media:content'].url) {
            return item['media:content'].url;
        }
    }
    
    // Priority 2: Parse HTML content for <img> tags
    const htmlContent = item.description || item.content || item['content:encoded'] || '';
    
    if (htmlContent) {
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        const matches = [...htmlContent.matchAll(imgRegex)];
        
        for (const match of matches) {
            const imgUrl = match[1];
            
            // Skip tracking pixels and tiny images
            if (imgUrl.includes('1x1') || 
                imgUrl.includes('pixel') || 
                imgUrl.includes('spacer') ||
                imgUrl.includes('icon.') ||
                imgUrl.includes('logo.') ||
                imgUrl.includes('avatar') ||
                imgUrl.endsWith('.gif') ||
                imgUrl.includes('feedburner') ||
                imgUrl.includes('stats')) {
                continue;
            }
            
            return imgUrl;
        }
    }
    
    // Priority 3: Open Graph image
    if (item['og:image']) return item['og:image'];
    if (item.image) return item.image;
    
    return null;
}

/**
 * Extract clean source name from URL
 */
function extractSourceFromUrl(url) {
    try {
        const hostname = new URL(url).hostname;
        const domain = hostname.replace('www.', '').split('.')[0];
        
        // Capitalize domain name
        const sourceName = domain
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return sourceName;
    } catch (e) {
        return 'News Source';
    }
}

/**
 * Load and display industry news
 */
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    /**
     * Create news article layout
     */
    function createNewsLayout(items) {
        newsContainer.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'news-content-wrapper';
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'news-grid-container';
        
        const limitedItems = items.slice(0, SCRIPT_CONFIG.MAX_NEWS_ITEMS);
        
        limitedItems.forEach((item) => {
            const sourceName = item.source || extractSourceFromUrl(item.link) || 'News';
            
            const articleEl = document.createElement('a');
            articleEl.className = 'news-article';
            
            // Security: Validate URL
            const safeLink = SecurityUtils.sanitizeUrl(item.link);
            if (safeLink) {
                articleEl.href = safeLink;
            } else {
                articleEl.href = '#';
                articleEl.style.pointerEvents = 'none';
                articleEl.style.opacity = '0.5';
            }
            
            articleEl.target = '_blank';
            articleEl.rel = 'noopener noreferrer';
            
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'news-content-wrapper-inner';
            
            const titleEl = document.createElement('h3');
            titleEl.className = 'news-title';
            titleEl.textContent = item.title;
            
            const sourceRow = document.createElement('div');
            sourceRow.className = 'news-source-row';
            
            const sourceIcon = getSourceIcon(sourceName, item.link);
            const logoImg = document.createElement('img');
            logoImg.src = sourceIcon;
            logoImg.alt = '';
            logoImg.className = 'news-source-logo';
            logoImg.onerror = function() {
                this.src = sourceIcons.default;
                this.onerror = null;
            };
            
            const sourceText = document.createElement('span');
            sourceText.className = 'news-source-text';
            
            // Security: Escape HTML
            const safeSource = SecurityUtils.escapeHtml(sourceName);
            const safeAuthor = SecurityUtils.escapeHtml(item.author || 'Staff Writer');
            sourceText.innerHTML = `In <strong>${safeSource}</strong> by ${safeAuthor}`;
            
            sourceRow.appendChild(logoImg);
            sourceRow.appendChild(sourceText);
            
            const dateEl = document.createElement('div');
            dateEl.className = 'news-date';
            dateEl.textContent = formatDate(item.pubDate);
            
            contentWrapper.appendChild(titleEl);
            contentWrapper.appendChild(sourceRow);
            contentWrapper.appendChild(dateEl);
            
            const visualContainer = document.createElement('div');
            visualContainer.className = 'news-visual';
            
            // Extract and validate image
            const extractedImage = extractImageFromContent(item);
            const imageToValidate = item.image || extractedImage;
            
            if (imageToValidate && imageToValidate.trim() !== '') {
                // Security: Validate image URL
                const safeImageUrl = SecurityUtils.sanitizeImageUrl(imageToValidate);
                
                if (safeImageUrl) {
                    const articleImage = document.createElement('img');
                    articleImage.src = safeImageUrl;
                    articleImage.alt = item.title;
                    articleImage.className = 'news-image';
                    
                    // Fallback to icon if image fails
                    articleImage.onerror = function() {
                        visualContainer.innerHTML = '';
                        const categoryIcon = document.createElement('div');
                        categoryIcon.className = 'news-category-icon';
                        categoryIcon.innerHTML = `<i class="fas ${getCategoryIcon(item.title)}"></i>`;
                        visualContainer.appendChild(categoryIcon);
                    };
                    
                    visualContainer.appendChild(articleImage);
                } else {
                    // Malicious URL - use fallback
                    const categoryIcon = document.createElement('div');
                    categoryIcon.className = 'news-category-icon';
                    categoryIcon.innerHTML = `<i class="fas ${getCategoryIcon(item.title)}"></i>`;
                    visualContainer.appendChild(categoryIcon);
                }
            } else {
                // No image - use category icon
                const categoryIcon = document.createElement('div');
                categoryIcon.className = 'news-category-icon';
                categoryIcon.innerHTML = `<i class="fas ${getCategoryIcon(item.title)}"></i>`;
                visualContainer.appendChild(categoryIcon);
            }
            
            articleEl.appendChild(contentWrapper);
            articleEl.appendChild(visualContainer);
            cardsContainer.appendChild(articleEl);
        });
        
        // Sidebar with "More News" button and last updated
        const sidebar = document.createElement('div');
        sidebar.className = 'news-sidebar';
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'news-more-button-container';
        const moreNewsBtn = document.createElement('a');
        moreNewsBtn.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        moreNewsBtn.target = "_blank";
        moreNewsBtn.rel = "noopener noreferrer";
        moreNewsBtn.textContent = "More News";
        moreNewsBtn.className = "btn-secondary";
        btnContainer.appendChild(moreNewsBtn);
        
        const lastUpdatedDiv = document.createElement('div');
        lastUpdatedDiv.className = 'news-last-updated';
        lastUpdatedDiv.textContent = `Last updated: ${formatDate(new Date())}`;
        
        sidebar.appendChild(btnContainer);
        sidebar.appendChild(lastUpdatedDiv);
        
        wrapper.appendChild(cardsContainer);
        wrapper.appendChild(sidebar);
        newsContainer.appendChild(wrapper);
    }
    
    // Fallback content if fetch fails
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://www.simplilearn.com/data-science-vs-machine-learning-vs-data-analytics-article",
            pubDate: "2025-05-03T07:00:00Z",
            author: "Staff Writer",
            source: "Simplilearn",
            image: "",
            description: ""
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://www.unite.ai/best-language-for-machine-learning/",
            pubDate: "2025-05-01T07:00:00Z",
            author: "Staff Writer",
            source: "Unite.AI",
            image: "",
            description: ""
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: "2025-05-02T05:52:00Z",
            author: "Staff Writer",
            source: "Towards Data Science",
            image: "",
            description: ""
        }
    ];
    
    // Show loading spinner
    newsContainer.innerHTML = '<div class="news-loading"><div class="news-spinner"></div></div>';

    // Fetch news
    fetch('assets/data/news.json?' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.items && data.items.length > 0) {
                createNewsLayout(data.items);
                
                // Wait to ensure MobileCardSelection is initialized
                setTimeout(() => {
                    if (window.mobileCardSelection && typeof window.mobileCardSelection.attachNewsListeners === 'function') {
                        window.mobileCardSelection.attachNewsListeners();
                    }
                }, 100);
            } else {
                throw new Error('No items returned or invalid data format');
            }
        })
        .catch(error => {
            console.error('News fetch error:', error);
            createNewsLayout(fallbackContent);
            
            setTimeout(() => {
                if (window.mobileCardSelection && typeof window.mobileCardSelection.attachNewsListeners === 'function') {
                    window.mobileCardSelection.attachNewsListeners();
                }
            }, 100);
        });
    }

/**
 * ═══════════════════════════════════════════════════════════════════
 * 10. SKILLS SPHERE INTEGRATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Handles project clicks from the skills sphere visualization.
 * Filters projects, scrolls to target card, and triggers highlight.
 * 
 * Observer Cleanup: Automatically disconnects after 10s to prevent
 * memory leaks from abandoned scroll operations.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// Track active observer for cleanup
let activeProjectObserver = null;
let activeProjectTimeout = null;

/**
 * Handle project click from skills sphere
 * @param {Object} projectData - Project data from skills sphere
 */
function handleSkillsSphereProjectClick(projectData) {
    // Cleanup previous observer
    if (activeProjectObserver) {
        activeProjectObserver.disconnect();
        activeProjectObserver = null;
    }
    if (activeProjectTimeout) {
        clearTimeout(activeProjectTimeout);
        activeProjectTimeout = null;
    }
    
    // Handle external links
    if (projectData.isExternal && projectData.externalUrl) {
        window.open(projectData.externalUrl, '_blank');
        return;
    }
    
    const targetCard = document.getElementById(projectData.scrollTarget);
    if (!targetCard) return;
    
    const filterCategory = projectData.filterCategory;
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Update filter buttons
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filterCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter project cards
    projectCards.forEach(card => {
        if (card.getAttribute('data-category') === filterCategory) {
            card.classList.remove('hidden');
            card.classList.remove('visible');
            card.classList.add('instant-show');
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
            card.classList.remove('instant-show');
        }
    });
    
    // Create observer for highlight animation
    activeProjectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= SCRIPT_CONFIG.PROJECT_SCROLL_THRESHOLD) {
                targetCard.classList.remove('instant-show');
                targetCard.classList.add('highlight-flash');
                
                // Cleanup observer
                if (activeProjectObserver) {
                    activeProjectObserver.disconnect();
                    activeProjectObserver = null;
                }
                
                // Remove highlight after duration
                setTimeout(() => {
                    targetCard.classList.remove('highlight-flash');
                    projectCards.forEach(card => card.classList.remove('instant-show'));
                }, SCRIPT_CONFIG.PROJECT_HIGHLIGHT_DURATION);
            }
        });
    }, {
        threshold: SCRIPT_CONFIG.PROJECT_SCROLL_THRESHOLD,
        rootMargin: '-50px'
    });
    
    activeProjectObserver.observe(targetCard);
    
    // Failsafe: Auto-cleanup after timeout
    activeProjectTimeout = setTimeout(() => {
        if (activeProjectObserver) {
            activeProjectObserver.disconnect();
            activeProjectObserver = null;
        }
    }, SCRIPT_CONFIG.OBSERVER_TIMEOUT);
    
    // Scroll to target card
    targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
}

// Expose to global scope for skills-sphere.js
window.handleSkillsSphereProjectClick = handleSkillsSphereProjectClick;

/**
 * ═══════════════════════════════════════════════════════════════════
 * 11. INITIALIZATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Initialize all features when DOM is ready.
 * 
 * Lightweight features initialize immediately.
 * Heavy features (typed text, news, skills sphere) initialize after
 * loading animation completes (via appReady event).
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation
    initAutoHideNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavHighlighting();
    
    // Fixed UI Elements
    initThemeSwitcher();
    initBackToTop();
    initDynamicButtonPositioning();
    
    // Project Filtering
    initProjectFiltering();
    
    // Contact Form
    initContactForm();
    
});

/**
 * ═══════════════════════════════════════════════════════════════
 * 12. CREDENTIALS CAROUSEL/PAGINATION SYSTEM
 * ═══════════════════════════════════════════════════════════════
 */

class CredentialsCarousel {
    constructor() {
        this.carousel = document.querySelector('.credentials-carousel');
        this.container = document.querySelector('.credentials-container');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevBtn = document.querySelector('.carousel-arrow-prev');
        this.nextBtn = document.querySelector('.carousel-arrow-next');
        
        if (!this.carousel || !this.container) return;
        
        this.cards = Array.from(this.container.querySelectorAll('.credential-card'));
        this.currentPage = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isPaginated = this.cards.length > 4;
        
        this.init();
    }
    
    init() {
        // Only activate pagination if >4 cards
        if (!this.isPaginated) {
            // Clean up any inline styles from previous sessions
            this.cards.forEach(card => {
                card.style.display = '';
                card.style.opacity = '';
                card.style.transition = '';
            });
            return; // No pagination needed, let CSS handle everything
        }
        
        // Show pagination controls
        this.carousel.classList.add('has-pagination');
        
        // Calculate pages
        this.updatePagination();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => {
            this.prevBtn.classList.add('pressed');
            setTimeout(() => {
                this.goToPage(this.currentPage - 1);
                this.prevBtn.classList.remove('pressed');
            }, 120); // 120ms for feedback
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextBtn.classList.add('pressed');
            setTimeout(() => {
                this.goToPage(this.currentPage + 1);
                this.nextBtn.classList.remove('pressed');
            }, 120); // 120ms for feedback
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Responsive handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    get cardsPerPage() {
        // Determine cards per page based on orientation
        const isPortrait = window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;
        return isPortrait ? 4 : 4; // 4 cards per page in all modes
    }
    
    get totalPages() {
        return Math.ceil(this.cards.length / this.cardsPerPage);
    }
    
    get isVerticalMode() {
        // Portrait mobile = vertical pagination
        return window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;
    }
    
    handleResize() {
        // Check if pagination status changed after resize
        const nowPaginated = this.cards.length > 4;
        
        if (nowPaginated !== this.isPaginated) {
            this.isPaginated = nowPaginated;
            
            if (!this.isPaginated) {
                // Became non-paginated, clean up
                this.carousel.classList.remove('has-pagination');
                this.cards.forEach(card => {
                    card.style.display = '';
                    card.style.opacity = '';
                    card.style.transition = '';
                });
                this.dotsContainer.innerHTML = '';
            } else {
                // Became paginated, activate
                this.carousel.classList.add('has-pagination');
                this.updatePagination();
            }
        } else if (this.isPaginated) {
            // Still paginated, just update layout
            this.updatePagination();
        }
    }
    
    updatePagination() {
        // Create dots
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            
            if (i === this.currentPage) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        
        // Show current page (without animation on initial load)
        this.showPage(this.currentPage, false);
    }
    
    showPage(pageIndex, animate = true) {
        // Clamp page index
        pageIndex = Math.max(0, Math.min(pageIndex, this.totalPages - 1));
        this.currentPage = pageIndex;
        
        const startIndex = pageIndex * this.cardsPerPage;
        const endIndex = startIndex + this.cardsPerPage;
        
        // Hide all cards, show only current page cards
        this.cards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                // Show this card
                card.style.display = 'flex';
                
                if (animate) {
                    // Animated page transition (only when navigating)
                    card.style.opacity = '0';
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease';
                    
                    // Stagger animation
                    const delay = (index - startIndex) * 80;
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        
                        setTimeout(() => {
                            card.style.opacity = '';
                            card.style.transition = '';

                        }, 400); 
                        
                    }, delay);
                } else {
                    card.style.opacity = '';
                    card.style.transition = '';
                }
            } else {
                // Hide this card
                card.style.display = 'none';
            }
        });
        
        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === pageIndex);
        });
        
        // Update arrow states
        this.prevBtn.disabled = pageIndex === 0;
        this.nextBtn.disabled = pageIndex === this.totalPages - 1;
    }
    
    goToPage(pageIndex) {
        // Clear mobile selections before page change
        if (window.mobileCardSelection) {
            window.mobileCardSelection.clearAllSelections();
        }

        this.showPage(pageIndex, true); // Always animate when user navigates
    }
    
    
    handleKeyboard(e) {
        // Only handle keyboard on desktop/landscape
        if (this.isVerticalMode) return;
        
        if (e.key === 'ArrowLeft') {
            this.goToPage(this.currentPage - 1);
        } else if (e.key === 'ArrowRight') {
            this.goToPage(this.currentPage + 1);
        }
    }
}

// Initialize credentials carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CredentialsCarousel();
});

/**
 * ═══════════════════════════════════════════════════════════════
 * 13. MOBILE CARD SELECTION SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Provides tap-to-select functionality for credential and project cards
 * on touch devices. Desktop maintains native hover behavior.
 * 
 * Features:
 * - Single-select toggle (one card active at a time)
 * - Scroll-safe (distinguishes taps from scroll gestures)
 * - Respects interactive elements (links/buttons)
 * - Auto-clear on navigation events
 * - Keyboard accessible
 * 
 * @class MobileCardSelection
 * 
 * ═══════════════════════════════════════════════════════════════
 */

class MobileCardSelection {
    constructor() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (!this.isTouchDevice) return;
        
        this.touchStartY = 0;
        this.touchMoved = false;
        
        this.init();
    }
    
    init() {
        const cards = document.querySelectorAll('.credential-card, .project-card, .contact-form');
        
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchMoved = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (Math.abs(e.touches[0].clientY - this.touchStartY) > 10) {
                this.touchMoved = true;
            }
        }, { passive: true });
        
        cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            card.dataset.cardIndex = index;
            
            card.addEventListener('click', (e) => {
                if (this.touchMoved) return;
                
                const interactive = e.target.closest('a, button, input, select, textarea');
                
                if (interactive) {
                    const href = interactive.getAttribute('href');
                    const isLink = interactive.tagName === 'A' && href;
                    
                    if (isLink) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        this.clearAllSelections();
                        card.classList.add('selected');
                        card.setAttribute('aria-pressed', 'true');
                        
                        setTimeout(() => {
                            if (interactive.target === '_blank') {
                                window.open(href, '_blank', 'noopener,noreferrer');
                                setTimeout(() => this.clearAllSelections(), 400);
                            } else {
                                window.location.href = href;
                            }
                        }, 250);
                    } else {
                        this.clearAllSelections();
                    }
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                this.toggleCard(card);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (this.touchMoved) return;
            
            const clickedCard = e.target.closest('.credential-card, .project-card, .contact-form, .news-article');
            if (!clickedCard) {
                this.clearAllSelections();
            }
        });
        
        const sections = document.querySelectorAll('section[id]');
        let currentSection = null;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const newSection = entry.target.id;
                    if (currentSection && currentSection !== newSection) {
                        this.clearAllSelections();
                    }
                    currentSection = newSection;
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(s => observer.observe(s));
        
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', () => this.clearAllSelections());
        }

        // Clear selections smoothly when returning to tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // User returned to tab - clear any lingering selections
                setTimeout(() => {
                    this.clearAllSelections();
                }, 300);
            }
        });
    }
    
    attachNewsListeners() {
        const newsArticles = document.querySelectorAll('.news-article');
        
        newsArticles.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            card.dataset.cardIndex = 'news-' + index;
            
            card.addEventListener('click', (e) => {
                if (this.touchMoved) return;
                
                const interactive = e.target.closest('a, button, input, select, textarea');
                
                if (interactive) {
                    const href = interactive.getAttribute('href');
                    const isLink = interactive.tagName === 'A' && href;
                    
                    if (isLink) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        this.clearAllSelections();
                        card.classList.add('selected');
                        card.setAttribute('aria-pressed', 'true');
                        
                        setTimeout(() => {
                            if (interactive.target === '_blank') {
                                window.open(href, '_blank', 'noopener,noreferrer');
                                setTimeout(() => {
                                    this.clearAllSelections(true);
                                }, 400); 
                            } else {
                                window.location.href = href;
                            }
                        }, 250);
                    } else {
                        this.clearAllSelections();
                    }
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                this.toggleCard(card);
            });
        });
    }
    
    toggleCard(card) {
        const isSelected = card.classList.contains('selected');
        
        if (isSelected) {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
        } else {
            this.clearAllSelections();
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
        }
    }
    
    clearAllSelections() {
        document.querySelectorAll('.credential-card.selected, .project-card.selected, .contact-form.selected, .news-article.selected').forEach(card => {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
        });
    }

    clearAllSelections(smooth = true) {
        document.querySelectorAll('.credential-card.selected, .project-card.selected, .contact-form.selected, .news-article.selected').forEach(card => {
            if (smooth) {
                // Let CSS transition handle the fade
                card.classList.remove('selected');
                card.setAttribute('aria-pressed', 'false');
            } else {
                // Instant clear
                card.classList.remove('selected');
                card.setAttribute('aria-pressed', 'false');
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.mobileCardSelection = new MobileCardSelection();
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF SCRIPT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready JavaScript for Mohit Pammu's Portfolio Website
 * 
 * @version     3.1.1
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
