//Essential Functions

// Smooth scrolling with Intersection Observer
function initSmoothScrolling() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Configure Intersection Observer for section detection
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When section is at least 40% visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                const activeId = entry.target.getAttribute('id');
                
                // Update navigation
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Show/hide back to top button
                if (activeId !== 'home' && backToTopBtn) {
                    backToTopBtn.classList.add('active');
                } else if (backToTopBtn) {
                    backToTopBtn.classList.remove('active');
                }
                
                // Sync background animation if function exists
                if (typeof window.syncBackgroundWithScroll === 'function') {
                    window.syncBackgroundWithScroll(window.scrollY);
                }
            }
        });
    }, { threshold: [0.4] }); // Detect when section is 40% visible
    
    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip external links
            if (!targetId || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            // Calculate position accounting for fixed header
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            // Scroll to target with smooth behavior
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('nav ul');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active') && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Improved mobile menu handling
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        // Toggle menu
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Add animation delays to menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            // Reset any existing animation
            item.style.animation = 'none';
            
            // Force reflow
            void item.offsetWidth;
            
            // Add staggered animation
            if (navMenu.classList.contains('active')) {
                item.style.animation = `fadeInDown 0.3s ease forwards ${index * 0.1}s`;
            } else {
                item.style.animation = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        // Skip if menu is not open or if clicking on hamburger
        if (!navMenu.classList.contains('active') || hamburger.contains(e.target)) return;
        
        // If click is outside the menu, close it
        if (!navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Typed Text and Project Filters

// Improved typing animation
function initTypedText() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    if (!typedTextSpan || !cursorSpan) return;
    
    const textArray = ["Data Scientist", "Problem Solver", "Impact Analyst", "Data Storyteller", "Insight Architect"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    let isErasing = false;
    
    function type() {
        if (isTyping) return;
        isTyping = true;
        
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            
            isTyping = false;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            
            // Only set timeout if still on the same element
            if (typedTextSpan && textArray[textArrayIndex] === typedTextSpan.textContent) {
                setTimeout(erase, newTextDelay);
            }
            
            isTyping = false;
        }
    }
    
    function erase() {
        if (isErasing) return;
        isErasing = true;
        
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            
            isErasing = false;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            
            isErasing = false;
            setTimeout(type, typingDelay + 1100);
        }
    }
    
    // Start the effect
    if (textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }
}

// Improved project filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    // Initialize all projects visible
    projectCards.forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                // Add animation properties
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    // Show card
                    if (card.style.display === 'none') {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        // Trigger reflow to enable transition
                        void card.offsetWidth;
                    }
                    
                    // Fade in
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    // Fade out
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Remove from DOM after animation completes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
}

// Initialization and Theme Switching

// Theme switcher function
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (!themeSwitcher) return;
    
    themeSwitcher.addEventListener('click', function() {
        // Toggle theme
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Update footer year
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Form submission handler - keep your existing implementation
// function initContactForm() { ... }

// News loading function - keep your existing implementation
// function loadIndustryNews() { ... }

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initTypedText();
    initMobileNav();
    initProjectFilters();
    initThemeSwitcher();
    updateFooterYear();
    
    // Keep other initializations if you have them
    if (typeof initContactForm === 'function') initContactForm();
    if (typeof loadIndustryNews === 'function') loadIndustryNews();
    
    // Add 'loaded' class to body for fade-in
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 200);
    
    console.log('Portfolio website initialized with content-respecting scrolling');
});

// Add window load event listener
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
