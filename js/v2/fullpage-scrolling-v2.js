// Improved fullpage-scrolling.js 
// Handles section visibility, smooth transitions, and coordinates with other components

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing enhanced fullpage scrolling solution');

    /**
     * Configuration Settings
     */
    const config = {
        sectionClass: 'fullpage-section',
        activeClass: 'active',
        navLinkClass: 'section-active',
        animationDuration: 700, // ms (slightly faster transitions)
        scrollThreshold: 500, // ms (reduced from 800ms for better responsiveness)
        mobileBreakpoint: 768,
        fixedHeader: true, // Keep header fixed at top
        disableScrollBar: true, // Hide scrollbar on desktop
        extraPaddingBottom: 20 // Additional padding for footer space
    };
    
    /**
     * State Management
     */
    const state = {
        sections: [],
        navLinks: [],
        currentIndex: 0,
        isAnimating: false,
        lastScrollTime: 0,
        isMobile: false,
        initialized: false,
        isScrollingWithinSection: false,
        wheelEventsEnabled: true
    };
    
    /**
     * Initialize the fullpage system
     */
    function init() {
        console.log('Initializing fullpage navigation...');
        
        // Get all sections and nav links
        state.sections = Array.from(document.querySelectorAll(`.${config.sectionClass}`));
        state.navLinks = Array.from(document.querySelectorAll('nav ul li a'));

        console.log(`Found ${state.sections.length} fullpage sections`);
        
        if (state.sections.length === 0) {
            console.error('No fullpage sections found. Aborting initialization.');
            return;
        }
        
        // Set initial section visibility
        state.sections.forEach((section, index) => {
            if (index === 0) {
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
        
        // Initial mobile check
        checkMobileMode();
        
        // Set up the initial section visibility based on hash or default to first section
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
            
            // Set up event listeners for navigation
            setupEventListeners();
        }
        
        // Apply body class for fullpage scrolling
        if (!state.isMobile) {
            document.body.classList.add('fullpage-enabled');
        } else {
            document.body.classList.remove('fullpage-enabled');
        }
        
        // Make the activation function globally available for other scripts
        window.activateSection = function(index) {
            activateSection(index, true);
        };
        
        // Expose current index for other scripts to access
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
        console.log('Fullpage scrolling initialized successfully');
    }
    
    /**
     * Check if we should be in mobile mode based on screen width
     */
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
    
    /**
     * Enable mobile mode (standard scrolling)
     */
    function enableMobileMode() {
        console.log('Enabling mobile mode for fullpage scrolling');
        
        // Disable wheel events
        state.wheelEventsEnabled = false;
        
        // Remove fullpage-enabled class from body
        document.body.classList.remove('fullpage-enabled');
        
        // Restore standard scrolling
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        document.documentElement.style.overflow = 'auto';
        
        // Make all sections visible
        state.sections.forEach(section => {
            section.classList.remove(config.activeClass);
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.position = 'relative';
            section.style.height = 'auto';
        });
        
        // Reset current index tracking
        state.currentIndex = 0;
    }
    
    /**
     * Enable desktop mode (fullpage scrolling)
     */
    function enableDesktopMode() {
        console.log('Enabling desktop mode for fullpage scrolling');
        
        // Enable wheel events
        state.wheelEventsEnabled = true;
        
        // Add fullpage-enabled class to body
        document.body.classList.add('fullpage-enabled');
        
        // Disable standard scrolling
        if (config.disableScrollBar) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';
        }
        
        // Reset section styles
        state.sections.forEach((section, index) => {
            section.style.position = 'absolute';
            section.style.height = '100vh';
            
            if (index === state.currentIndex) {
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
        
        // Activate the current section again to ensure proper visibility
        activateSection(state.currentIndex, false);
        
        // Update navigation
        updateNavLinks();
    }
    
    /**
     * Activate a specific section
     * @param {number} index - The index of the section to activate
     * @param {boolean} animate - Whether to animate the transition
     */
    function activateSection(index, animate = true) {
        // Validate the index
        if (index < 0 || index >= state.sections.length || (state.isAnimating && animate)) {
            return;
        }
        
        // Skip if already on this section and initialized
        if (index === state.currentIndex && state.initialized) {
            return;
        }

        console.log(`Activating section ${index}, animate: ${animate}`);
        
        // Mark as animating if needed
        if (animate) {
            state.isAnimating = true;
        }
        
        // Update state FIRST to ensure consistency
        const previousIndex = state.currentIndex;
        state.currentIndex = index;
        window.currentSectionIndex = index;

        // Control footer visibility based on section
        if (index === state.sections.length - 1) {
            // Last section - show footer
            document.body.setAttribute('data-section', 'last');
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.opacity = '1';
                footer.style.visibility = 'visible';
            }
        } else {
            // Not the last section - hide footer
            document.body.removeAttribute('data-section');
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.opacity = '0';
                footer.style.visibility = 'hidden';
            }
        }

        // Get current and target sections
        const currentSection = state.sections[previousIndex];
        const targetSection = state.sections[index];
        
        // Update URL hash without scrolling
        if (targetSection && targetSection.id) {
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
        if (typeof window.syncParallaxWithSections === 'function') {
            window.syncParallaxWithSections();
        } else if (typeof window.applyParallax === 'function') {
            const virtualScrollY = index * window.innerHeight;
            window.applyParallax(virtualScrollY);
        }
        
        // Update navigation
        updateNavLinks();
        
        // Update back-to-top button visibility
        updateBackToTopButton();
    }
    
    /**
     * Complete section activation process
     * @param {number} index - Index of the section being activated
     */
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
    
    /**
     * Update navigation links to show active section
     */
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
    
    /**
     * Update back-to-top button visibility
     */
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
    
    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Improved wheel event handling
        let wheelTimeout;
        let lastWheelTimestamp = 0;
        const wheelThreshold = 50; // Reduced from 100ms for better responsiveness
        
        // Main wheel event listener - more reliable capture
        document.addEventListener('wheel', function(e) {
            // Skip if in mobile mode or wheel events disabled
            if (state.isMobile || !state.wheelEventsEnabled) return;
            
            // Prevent default scroll behavior
            e.preventDefault();
            
            // Get current time
            const now = Date.now();
            
            // Ignore rapid successive wheel events
            if (now - lastWheelTimestamp < wheelThreshold) {
                return;
            }
            
            lastWheelTimestamp = now;
            
            // Handle special sections with internal scrolling
            const currentSection = state.sections[state.currentIndex];
            
            // Special handling for sections like Projects that need internal scrolling
            if (currentSection && currentSection.id === 'projects') {
                const scrollHeight = currentSection.scrollHeight;
                const clientHeight = currentSection.clientHeight;
                const scrollTop = currentSection.scrollTop;
                
                // If we're not at the top and scrolling up, or not at the bottom and scrolling down,
                // allow internal scrolling
                if ((scrollTop > 0 && e.deltaY < 0) || 
                    (scrollTop < scrollHeight - clientHeight && e.deltaY > 0)) {
                    // Allow internal scrolling
                    currentSection.scrollTop += e.deltaY;
                    return;
                }
            }
            
            // Throttle section changes
            if (now - state.lastScrollTime < config.scrollThreshold) {
                return;
            }
            
            state.lastScrollTime = now;
            
            // Lower threshold for detecting intentional scrolls
            if (Math.abs(e.deltaY) < 10) {
                return;
            }
            
            // Clear any existing timeout
            clearTimeout(wheelTimeout);
            
            // Move to next/previous section
            if (e.deltaY > 0 && state.currentIndex < state.sections.length - 1) {
                // Scrolling down - move exactly one section
                activateSection(state.currentIndex + 1);
            } else if (e.deltaY < 0 && state.currentIndex > 0) {
                // Scrolling up - move exactly one section
                activateSection(state.currentIndex - 1);
            }
            
            // Reset wheel handling flag after delay
            wheelTimeout = setTimeout(() => {
                state.isScrolling = false;
            }, 250); // Reduced from 300ms
        }, { passive: false });
    
        // Additional event listener for Firefox/some browsers
        window.addEventListener('DOMMouseScroll', function(e) {
            if (state.isMobile || !state.wheelEventsEnabled) return;
            e.preventDefault();
            
            const now = Date.now();
            if (now - state.lastScrollTime < config.scrollThreshold) return;
            
            state.lastScrollTime = now;
            
            if (e.detail > 0 && state.currentIndex < state.sections.length - 1) {
                activateSection(state.currentIndex + 1);
            } else if (e.detail < 0 && state.currentIndex > 0) {
                activateSection(state.currentIndex - 1);
            }
        }, { passive: false });
    
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
            } else if (e.key === 'PageDown' && state.currentIndex < state.sections.length - 1) {
                activateSection(state.currentIndex + 1);
                e.preventDefault();
            } else if (e.key === 'PageUp' && state.currentIndex > 0) {
                activateSection(state.currentIndex - 1);
                e.preventDefault();
            } else if (e.key === 'Home') {
                activateSection(0);
                e.preventDefault();
            } else if (e.key === 'End') {
                activateSection(state.sections.length - 1);
                e.preventDefault();
            }
        });
        
        // Navigation links
        state.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip external links
                if (!this.getAttribute('href') || !this.getAttribute('href').startsWith('#')) return;
                
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
                
                // Ensure section visibility is maintained after resize
                activateSection(state.currentIndex, false);
            }, 200);
        });
        
        // Touch devices handling with better detection for internal scrolling
        let touchStartY = 0;
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', function(e) {
            if (state.isMobile) return;
            
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            
            // Check if touch starts in a scrollable section
            const currentSection = state.sections[state.currentIndex];
            if (currentSection && currentSection.scrollHeight > currentSection.clientHeight) {
                state.isScrollingWithinSection = true;
            } else {
                state.isScrollingWithinSection = false;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (state.isMobile || state.isAnimating) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = touchStartY - touchEndY;
            
            // Only process quick, intentional swipes
            if (touchDuration < 300 && Math.abs(touchDistance) > 50) {
                const currentSection = state.sections[state.currentIndex];
                
                // Handle sections that need internal scrolling
                if (currentSection && currentSection.id === 'projects' && state.isScrollingWithinSection) {
                    const scrollHeight = currentSection.scrollHeight;
                    const clientHeight = currentSection.clientHeight;
                    const scrollTop = currentSection.scrollTop;
                    
                    // If we're not at the top and scrolling up, or not at the bottom and scrolling down,
                    // we've already handled the scroll internally
                    if ((scrollTop > 0 && touchDistance < 0) || 
                        (scrollTop < scrollHeight - clientHeight && touchDistance > 0)) {
                        return;
                    }
                }
                
                // Handle section navigation
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
            console.log('Initial section activated');
        }
        
        // Mark the body as loaded to trigger fadeIn
        document.body.classList.add('loaded');
    }, 300);
    
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
