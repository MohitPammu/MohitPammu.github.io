// Create this as scroll-manager.js - a new file to centralize scroll handling
const ScrollManager = (function() {
    // Configuration
    const config = {
        fullpageEnabled: true,
        mobileBreakpoint: 768,
        scrollThreshold: 400,
        animationDuration: 600
    };
    
    // State
    let state = {
        isFullpageMode: true,
        isMobile: false,
        currentSection: 0,
        isAnimating: false,
        sections: [],
        totalSections: 0
    };
    
    // Initialize
    function init() {
        // Get all sections
        state.sections = Array.from(document.querySelectorAll('.fullpage-section'));
        state.totalSections = state.sections.length;
        
        // Check device initially
        checkDeviceSize();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize appropriate scroll mode
        setScrollMode();
        
        // Make the API globally available
        window.ScrollManager = {
            goToSection: goToSection,
            getCurrentSection: () => state.currentSection,
            isFullpageMode: () => state.isFullpageMode,
            refresh: refresh,
            getVirtualScrollY: () => state.currentSection * window.innerHeight
        };
        
        // Trigger initial section visibility
        showInitialSection();
    }
    
    // Check device size and set mode flag
    function checkDeviceSize() {
        const prevIsMobile = state.isMobile;
        state.isMobile = window.innerWidth < config.mobileBreakpoint;
        
        // Return whether the state changed
        return prevIsMobile !== state.isMobile;
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Wheel event for fullpage scrolling
        document.addEventListener('wheel', handleWheel, { passive: false });
        
        // Touch events for mobile/tablet
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Window resize
        window.addEventListener('resize', handleResize);
        
        // Navigation links
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Back to top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => goToSection(0));
        }
    }
    
    // Set the appropriate scroll mode based on device
    function setScrollMode() {
        state.isFullpageMode = config.fullpageEnabled && !state.isMobile;
        
        if (state.isFullpageMode) {
            enableFullpageMode();
        } else {
            enableStandardMode();
        }
    }
    
    // Enable fullpage scrolling mode
    function enableFullpageMode() {
        // Add class to body
        document.body.classList.add('fullpage-enabled');
        
        // Disable standard scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
        
        // Set up sections for fullpage
        state.sections.forEach((section, index) => {
            section.style.position = 'absolute';
            section.style.top = '0';
            section.style.left = '0';
            section.style.width = '100%';
            section.style.height = '100vh';
            section.style.overflow = 'auto';
            section.style.transition = `opacity ${config.animationDuration}ms ease, visibility ${config.animationDuration}ms ease`;
            
            if (index === state.currentSection) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.zIndex = '1';
            } else {
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.style.zIndex = '0';
            }
        });
        
        // Dispatch event about mode change
        document.dispatchEvent(new CustomEvent('scrollModeChanged', { 
            detail: { mode: 'fullpage' } 
        }));
    }
    
    // Enable standard scrolling mode
    function enableStandardMode() {
        // Remove class from body
        document.body.classList.remove('fullpage-enabled');
        
        // Enable standard scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        
        // Reset sections for normal scrolling
        state.sections.forEach(section => {
            section.style.position = 'relative';
            section.style.top = '';
            section.style.left = '';
            section.style.width = '100%';
            section.style.height = 'auto';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.zIndex = '1';
        });
        
        // Dispatch event about mode change
        document.dispatchEvent(new CustomEvent('scrollModeChanged', { 
            detail: { mode: 'standard' } 
        }));
    }
    
    // Handle wheel events
    function handleWheel(e) {
        if (!state.isFullpageMode || state.isAnimating) return;
        
        // Special handling for sections with internal scrolling
        const currentSection = state.sections[state.currentSection];
        if (currentSection) {
            // If section has scrollable content and not at boundaries
            if (currentSection.scrollHeight > currentSection.clientHeight) {
                const isScrollingUp = e.deltaY < 0;
                const isScrollingDown = e.deltaY > 0;
                const isAtTop = currentSection.scrollTop === 0;
                const isAtBottom = Math.abs(currentSection.scrollTop + currentSection.clientHeight - currentSection.scrollHeight) < 2;
                
                // Allow internal scrolling
                if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
                    return;
                }
            }
        }
        
        // Prevent default scrolling behavior
        e.preventDefault();
        
        // Determine direction and navigate
        if (e.deltaY > 0 && state.currentSection < state.totalSections - 1) {
            goToSection(state.currentSection + 1);
        } else if (e.deltaY < 0 && state.currentSection > 0) {
            goToSection(state.currentSection - 1);
        }
    }
    
    // Variables for touch handling
    let touchStartY = 0;
    let touchStartTime = 0;
    
    // Handle touch start
    function handleTouchStart(e) {
        if (!state.isFullpageMode) return;
        
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }
    
    // Handle touch end
    function handleTouchEnd(e) {
        if (!state.isFullpageMode || state.isAnimating) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchTime = Date.now() - touchStartTime;
        const touchDistance = touchStartY - touchEndY;
        
        // Check if this was a deliberate swipe (not a long scroll/drag)
        if (touchTime < 300 && Math.abs(touchDistance) > 50) {
            // Similar to wheel handling, check for scrollable content
            const currentSection = state.sections[state.currentSection];
            if (currentSection) {
                if (currentSection.scrollHeight > currentSection.clientHeight) {
                    const isScrollingUp = touchDistance < 0;
                    const isScrollingDown = touchDistance > 0;
                    const isAtTop = currentSection.scrollTop === 0;
                    const isAtBottom = Math.abs(currentSection.scrollTop + currentSection.clientHeight - currentSection.scrollHeight) < 2;
                    
                    if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
                        return;
                    }
                }
            }
            
            // Navigate based on swipe direction
            if (touchDistance > 0 && state.currentSection < state.totalSections - 1) {
                goToSection(state.currentSection + 1);
            } else if (touchDistance < 0 && state.currentSection > 0) {
                goToSection(state.currentSection - 1);
            }
        }
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e) {
        if (!state.isFullpageMode || state.isAnimating) return;
        
        // Skip if in input/textarea
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                if (state.currentSection < state.totalSections - 1) {
                    e.preventDefault();
                    goToSection(state.currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                if (state.currentSection > 0) {
                    e.preventDefault();
                    goToSection(state.currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(state.totalSections - 1);
                break;
        }
    }
    
    // Handle window resize
    function handleResize() {
        // Debounce resize handler
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            if (checkDeviceSize()) {
                // Mode changed, update scrolling
                setScrollMode();
            }
            
            // Refresh section visibility
            if (state.isFullpageMode) {
                goToSection(state.currentSection, false);
            }
        }, 200);
    }
    
    // Handle navigation link clicks
    function handleNavClick(e) {
        // Only handle internal links
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        // Find target section
        const targetId = href.substring(1);
        const targetIndex = state.sections.findIndex(section => section.id === targetId);
        
        if (targetIndex !== -1) {
            goToSection(targetIndex);
            
            // Close mobile menu if open
            const navMenu = document.querySelector('nav ul');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active') && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }
    
    // Navigate to a specific section
    function goToSection(index, animate = true) {
        // Validate index
        if (index < 0 || index >= state.totalSections || (state.isAnimating && animate)) {
            return;
        }
        
        // Skip if already at this section
        if (index === state.currentSection && state.initialized) {
            return;
        }
        
        // Set animation state
        if (animate) {
            state.isAnimating = true;
        }
        
        // Update state
        const previousSection = state.currentSection;
        state.currentSection = index;
        
        // Handle section visibility in fullpage mode
        if (state.isFullpageMode) {
            // Update URL hash without scrolling
            const targetSection = state.sections[index];
            if (targetSection && targetSection.id) {
                history.replaceState(null, null, `#${targetSection.id}`);
            }
            
            // Set section visibility
            state.sections.forEach((section, i) => {
                if (i === index) {
                    section.style.zIndex = '1';
                    section.style.visibility = 'visible';
                    // Force reflow
                    void section.offsetWidth;
                    section.style.opacity = '1';
                } else if (i !== previousSection) {
                    section.style.zIndex = '0';
                    section.style.opacity = '0';
                    section.style.visibility = 'hidden';
                }
            });
            
            // For previous section, delay hiding until transition completes
            if (previousSection !== index) {
                const prevSection = state.sections[previousSection];
                prevSection.style.opacity = '0';
                
                if (animate) {
                    setTimeout(() => {
                        prevSection.style.visibility = 'hidden';
                        prevSection.style.zIndex = '0';
                    }, config.animationDuration);
                } else {
                    prevSection.style.visibility = 'hidden';
                    prevSection.style.zIndex = '0';
                }
            }
        } else {
            // In standard mode, scroll to the target section
            const targetSection = state.sections[index];
            if (targetSection) {
                const offset = targetSection.offsetTop - document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: offset,
                    behavior: animate ? 'smooth' : 'auto'
                });
            }
        }
        
        // Update navigation links
        updateNavLinks(index);
        
        // Update footer visibility based on section
        updateFooterVisibility(index);
        
        // If using parallax effects, update them
        if (typeof window.applyParallax === 'function') {
            window.applyParallax(index * window.innerHeight);
        }
        
        // Reset animation state after transition
        if (animate) {
            setTimeout(() => {
                state.isAnimating = false;
                
                // Dispatch section changed event
                document.dispatchEvent(new CustomEvent('sectionChanged', { 
                    detail: { 
                        index: index, 
                        sectionId: state.sections[index].id 
                    } 
                }));
            }, config.animationDuration);
        } else {
            // Dispatch immediately for non-animated changes
            document.dispatchEvent(new CustomEvent('sectionChanged', { 
                detail: { 
                    index: index, 
                    sectionId: state.sections[index].id 
                } 
            }));
        }
    }
    
    // Update navigation links to reflect current section
    function updateNavLinks(currentIndex) {
        const links = document.querySelectorAll('nav ul li a');
        const currentSectionId = state.sections[currentIndex].id;
        
        links.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Update back-to-top button visibility
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (currentIndex > 0) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    }
    
    // Update footer visibility based on section
    function updateFooterVisibility(index) {
        // Show footer on last section
        const footer = document.querySelector('footer');
        if (footer) {
            if (index === state.totalSections - 1) {
                document.body.setAttribute('data-section', 'last');
                footer.style.opacity = '1';
                footer.style.visibility = 'visible';
            } else {
                document.body.removeAttribute('data-section');
                footer.style.opacity = '0';
                footer.style.visibility = 'hidden';
            }
        }
    }
    
    // Show initial section based on URL hash or default to first
    function showInitialSection() {
        // Get hash from URL if present
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            const targetIndex = state.sections.findIndex(section => section.id === targetId);
            if (targetIndex !== -1) {
                goToSection(targetIndex, false);
                return;
            }
        }
        
        // Default to first section
        goToSection(0, false);
    }
    
    // Refresh state and recalculate (e.g., after DOM changes)
    function refresh() {
        state.sections = Array.from(document.querySelectorAll('.fullpage-section'));
        state.totalSections = state.sections.length;
        checkDeviceSize();
        setScrollMode();
        goToSection(state.currentSection, false);
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ScrollManager.init);
