// fullpage-scrolling.js 
// This script handles section visibility, smooth transitions, and coordinates with other components

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing enhanced fullpage scrolling solution');

    // Configuration
    const config = {
        sectionClass: 'fullpage-section',
        activeClass: 'active',
        navLinkClass: 'section-active',
        animationDuration: 600, // ms (slightly faster transitions)
        scrollThreshold: 1000, // ms (increased to prevent accidental double scrolls)
        mobileBreakpoint: 768,
        fixedHeader: true, // Keep header fixed at top
        disableScrollBar: true // Hide scrollbar on desktop
    };
    
    // State
    const state = {
        sections: [],
        navLinks: [],
        currentIndex: 0,
        isAnimating: false,
        lastScrollTime: 0,
        isMobile: false,
        initialized: false
    };
    
    // Initialize the fullpage system
    function init() {
        // Get all sections and nav links
        state.sections = Array.from(document.querySelectorAll(`.${config.sectionClass}`));
        state.navLinks = Array.from(document.querySelectorAll('nav ul li a'));

        state.sections.forEach((section, index) => {
            if (index === 0) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.classList.add(config.activeClass);
        } else {
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.classList.remove(config.activeClass);
        }
    });

        console.log(`Found ${state.sections.length} fullpage sections`);
        
        // Initial mobile check
        checkMobileMode();
        
        // Set up the initial section visibility
        if (!state.isMobile && state.sections.length > 0) {
            // Get hash from URL if present
            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.substring(1);
                const targetIndex = state.sections.findIndex(section => section.id === targetId);
                if (targetIndex !== -1) {
                    activateSection(targetIndex, false);
                } else {
                    activateSection(0, false);
                }
            } else {
                activateSection(0, false);
            }
            setupEventListeners();
        }
        
        // Apply CSS adjustments
        applyFullpageStyles();
        
        // Make the activation function globally available for other scripts
        window.activateSection = function(index) {
            activateSection(index, true);
        };
        
        // Expose current index for other scripts
        window.currentSectionIndex = state.currentIndex;
        
        // Expose scrollToSection function for scroll interception
        window.scrollToSection = function(index) {
            if (!state.isMobile) {
                activateSection(index, true);
                return false; // Prevent default scrolling
            }
            return true; // Allow default scrolling on mobile
        };
        
        state.initialized = true;
        console.log('Fullpage scrolling initialized');
    }
    
    // Apply necessary styles dynamically to avoid CSS conflicts
    function applyFullpageStyles() {
        // Check if we already have a style element
        let styleEl = document.getElementById('fullpage-dynamic-styles');
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'fullpage-dynamic-styles';
            document.head.appendChild(styleEl);
        }
        
        // Set styles with important flags to override conflicting styles
        styleEl.textContent = `
            /* Base fullpage section styles */
            .${config.sectionClass} {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100vh !important;
                opacity: 0 !important;
                visibility: hidden !important;
                z-index: 0 !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-top: 70px !important;
                transition: opacity ${config.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1), 
                    visibility ${config.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1) !important;
                will-change: opacity, visibility !important;
                transform: translateZ(0) !important;
                backface-visibility: hidden !important;
            }
            
            /* Active section */
            .${config.sectionClass}.${config.activeClass} {
                opacity: 1 !important;
                visibility: visible !important;
                z-index: 1 !important;
            }
            
            /* Section content animation */
            .section-content {
                transform: translateY(20px);
                opacity: 0.9;
                transition: transform ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
                            opacity ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .${config.sectionClass}.${config.activeClass} .section-content {
                transform: translateY(0);
                opacity: 1;
            }
            
            /* Body styles for desktop fullpage mode */
            body.fullpage-enabled {
                overflow: ${config.disableScrollBar ? 'hidden' : 'auto'} !important;
                height: 100vh !important;
            }
            
            /* Mobile styles */
            @media screen and (max-width: ${config.mobileBreakpoint}px) {
                .${config.sectionClass} {
                    position: relative !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    height: auto !important;
                    min-height: 100vh !important;
                    overflow: visible !important;
                    transition: none !important;
                }
                
                .section-content {
                    transform: none !important;
                    opacity: 1 !important;
                    transition: none !important;
                }
                
                body.fullpage-enabled {
                    overflow: auto !important;
                    height: auto !important;
                }
                
                .fullpage-container {
                    overflow: visible !important;
                    height: auto !important;
                }
            }
        `;
        
        // Apply body class for fullpage scrolling
        if (!state.isMobile) {
            document.body.classList.add('fullpage-enabled');
        } else {
            document.body.classList.remove('fullpage-enabled');
        }
    }
    
    // Check if we should be in mobile mode
    function checkMobileMode() {
        const wasAlreadyMobile = state.isMobile;
        state.isMobile = window.innerWidth < config.mobileBreakpoint;
        
        // Only toggle if there was a change
        if (wasAlreadyMobile !== state.isMobile) {
            if (state.isMobile) {
                enableMobileMode();
            } else {
                enableDesktopMode();
            }
        }
    }
    
    // Enable mobile mode (standard scrolling)
    function enableMobileMode() {
        console.log('Enabling mobile mode for fullpage scrolling');
        
        // Remove fullpage-enabled class from body
        document.body.classList.remove('fullpage-enabled');
        
        // Restore standard scrolling
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // Reset current index tracking
        state.currentIndex = 0;
    }
    
    // Enable desktop mode (fullpage scrolling)
    function enableDesktopMode() {
        console.log('Enabling desktop mode for fullpage scrolling');
        
        // Add fullpage-enabled class to body
        document.body.classList.add('fullpage-enabled');
        
        // Disable standard scrolling
        if (config.disableScrollBar) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
        
        // Activate the current section again to ensure proper visibility
        activateSection(state.currentIndex, false);
        
        // Update navigation
        updateNavLinks();
    }
    
    // Activate a specific section
    function activateSection(index, animate = true) {
        // Validate the index
        if (index < 0 || index >= state.sections.length || (state.isAnimating && animate)) {
            return;
        }
        
        // Skip if already on this section and initialized
        if (index === state.currentIndex && state.initialized) {
            return;
        }

        console.log(`Attempting to activate section ${index}`);
        
        // Mark as animating if needed
        if (animate) {
            state.isAnimating = true;
        }
        
        // IMPORTANT: Update state FIRST to ensure consistency
        const previousIndex = state.currentIndex;
        state.currentIndex = index;
        window.currentSectionIndex = index;
        
        // Get current and target sections
        const currentSection = state.sections[previousIndex];
        const targetSection = state.sections[index];
        
        console.log(`Section visibility set, current section: ${index}`);
        
        console.log(`Activating section ${index} ${animate ? 'with' : 'without'} animation`);
        
        // Update URL hash without scrolling
        if (targetSection.id) {
            history.replaceState(null, null, `#${targetSection.id}`);
        }
        
        // Setup for animation
        if (animate) {
            // Remove active class from all sections except target
            state.sections.forEach(section => {
                if (section !== targetSection && section !== currentSection) {
                    section.classList.remove(config.activeClass);
                }
            });
            
            // Prepare target section
            targetSection.style.opacity = '0';
            targetSection.style.visibility = 'visible';
            targetSection.style.zIndex = '1';
            
            // Force a reflow to ensure CSS transition works
            void targetSection.offsetWidth;
            
            // Add active class to trigger transition
            targetSection.classList.add(config.activeClass);
            
            // Remove active class from previous section
            if (currentSection && currentSection !== targetSection) {
                currentSection.classList.remove(config.activeClass);
            }
            
            // After animation completes
            setTimeout(() => {
                finishSectionActivation(index);
            }, config.animationDuration + 50); // Add a small buffer
        } else {
            // Instant transition without animation
            state.sections.forEach((section, i) => {
                if (i === index) {
                    section.classList.add(config.activeClass);
                    section.style.opacity = '1';
                    section.style.visibility = 'visible';
                    section.style.zIndex = '1';
                } else {
                    section.classList.remove(config.activeClass);
                    section.style.opacity = '0';
                    section.style.visibility = 'hidden';
                    section.style.zIndex = '0';
                }
            });
            
            finishSectionActivation(index);
        }
        
        // Sync background immediately for both animated and non-animated transitions
        console.log(`Syncing background with section: ${index}`);
        if (typeof window.applyParallax === 'function') {
            const virtualScrollY = index * window.innerHeight;
            window.applyParallax(virtualScrollY);
        }
        
        // Update navigation
        updateNavLinks();
        
        // Update back-to-top button visibility
        updateBackToTopButton();
    }
    
    // Complete section activation process
    function finishSectionActivation(index) {
        // Make sure final state is consistent with what we expect
        if (state.currentIndex !== index) {
            console.warn(`Section index mismatch: current=${state.currentIndex}, finishing=${index}`);
            state.currentIndex = index;
            window.currentSectionIndex = index;
        }

        // Reset animation flag
        state.isAnimating = false;
        
        // Emit a custom event that other scripts can listen for
        const event = new CustomEvent('sectionChanged', { 
            detail: { 
                index: index, 
                sectionId: state.sections[index].id 
            } 
        });
        document.dispatchEvent(event);
        
        // Just to be 100% certain that transitions complete properly,
        // do a final visibility check for all sections
        state.sections.forEach((section, i) => {
            if (i === index) {
                section.style.zIndex = '1';
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.classList.add(config.activeClass);
            } else {
                section.style.zIndex = '0';
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.classList.remove(config.activeClass);
            }
        });
        
        console.log(`Section ${index} activation complete`);
    }
    
    // Update navigation links to show active section
    function updateNavLinks() {
        const activeSection = state.sections[state.currentIndex];
        const activeSectionId = activeSection ? activeSection.id : '';
        
        state.navLinks.forEach(link => {
            // Clean up all active classes
            link.classList.remove('active', config.navLinkClass);
            
            // Add active class to matching link
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active', config.navLinkClass);
            }
        });
    }
    
    // Update back-to-top button visibility
    function updateBackToTopButton() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (state.currentIndex > 0) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Improved wheel handling with better debouncing
        let wheelTimeout;
        let isWheelHandled = false;
        
        window.addEventListener('wheel', function(e) {
            // Skip if in mobile mode
            if (state.isMobile) return;
            
            // Prevent default scroll behavior
            e.preventDefault();
            
            // If already handling a wheel event or animating, ignore
            if (isWheelHandled || state.isAnimating) {
                return;
            }
            
            // Mark as handling
            isWheelHandled = true;
            
            // Get current time
            const now = Date.now();
            
            // Throttle scroll events
            if (now - state.lastScrollTime < config.scrollThreshold) {
                isWheelHandled = false;
                return;
            }
            
            state.lastScrollTime = now;
            
            // Clear any existing timeout
            clearTimeout(wheelTimeout);

            // Use a single variable to track scroll intent
            let scrollIntent = 0;
        
            // Accumulate scrolling intent rather than immediately responding
            scrollIntent += (e.deltaY > 0) ? 1 : -1;

            // Determine scroll direction and navigate
            wheelTimeout = setTimeout(() => {
            if (scrollIntent > 0 && state.currentIndex < state.sections.length - 1) {
                // Scrolling down
                activateSection(state.currentIndex + 1);
            } else if (scrollIntent < 0 && state.currentIndex > 0) {
                // Scrolling up
                activateSection(state.currentIndex - 1);
            }
                
                // Reset wheel handling flag after delay
                setTimeout(() => {
                    isWheelHandled = false;
                scrollIntent = 0;
            }, 50);
        }, 100); // Longer delay to better detect intentional scrolls
    }, { passive: false });

        console.log('Wheel event listener attached');
    
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Skip if in mobile mode
            if (state.isMobile) return;
            
            // Skip if in input field
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.key === 'ArrowDown' && state.currentIndex < state.sections.length - 1) {
                activateSection(state.currentIndex + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp' && state.currentIndex > 0) {
                activateSection(state.currentIndex - 1);
                e.preventDefault();
            }
        });
        
        // Navigation links
        state.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip external links
                if (!this.getAttribute('href').startsWith('#')) return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetIndex = state.sections.findIndex(section => section.id === targetId);
                
                if (targetIndex !== -1) {
                    activateSection(targetIndex);
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('nav ul');
                    const hamburger = document.querySelector('.hamburger');
                    if (navMenu && navMenu.classList.contains('active') && hamburger) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            });
        });
        
        // Back to top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                activateSection(0);
            });
        }
        
        // Window resize handler
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                checkMobileMode();
            }, 200);
        });
        
        // Fix for touch devices: Single tap/touch navigation
        let touchStartY = 0;
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', function(e) {
            if (state.isMobile) return;
            
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (state.isMobile || state.isAnimating) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = touchStartY - touchEndY;
            
            // Only process quick, intentional swipes
            if (touchDuration < 300 && Math.abs(touchDistance) > 50) {
                if (touchDistance > 0 && state.currentIndex < state.sections.length - 1) {
                    // Swipe up - move down
                    activateSection(state.currentIndex + 1);
                } else if (touchDistance < 0 && state.currentIndex > 0) {
                    // Swipe down - move up
                    activateSection(state.currentIndex - 1);
                }
            }
        }, { passive: true });
    }
    
    // Initialize
    init();
    
    // Force an initial scroll to activate the first section
    setTimeout(function() {
        // Make sure the first section is active
        if (state.sections.length > 0) {
            activateSection(0, false);
            
            // Log current state
            console.log('Initial section activated');
            console.log('Current section index:', state.currentIndex);
            console.log('Sections count:', state.sections.length);
            
        }
    }, 500);

    document.body.classList.add('loaded');
    
    // Return public API
    return {
        goToSection: activateSection,
        getCurrentIndex: () => state.currentIndex,
        getTotalSections: () => state.sections.length,
        refreshState: () => {
            checkMobileMode();
            updateNavLinks();
        }
    };
});
