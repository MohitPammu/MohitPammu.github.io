// Parallax Effect for Portfolio Website
// This script adds smooth section transitions and gradient wave backgrounds

document.addEventListener('DOMContentLoaded', function() {
    // Initialize once DOM is loaded
    initParallaxEffect();

    // Listen for theme changes
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            // Small delay to let theme change apply before updating waves
            setTimeout(updateWaveColors, 300);
        });
    }
});

// Main initialization function
function initParallaxEffect() {
    // Create background container for gradient waves
    createWaveBackground();
    
    // Create gradient waves
    createWaves();
    
    // Set up sections for full-height effect
    setupSections();
    
    // Initial update of sections based on current scroll position
    updateSectionsVisibility();
    
    // Set up scroll handling that works with existing handlers
    setupScrollHandling();
    
    // Set up navigation for the new section structure
    setupNavigation();
}

// Create the background container for waves
function createWaveBackground() {
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.id = 'wave-container';
    document.body.insertBefore(waveContainer, document.body.firstChild);

    // Add CSS variables for wave colors based on theme
    updateCSSVariables();
}

// Create the gradient waves
function createWaves() {
    const container = document.getElementById('wave-container');
    if (!container) return;
    
    // Clear existing waves
    container.innerHTML = '';
    
    // Create multiple waves with different properties
    const numWaves = 7; // Subtle number of waves
    
    for (let i = 0; i < numWaves; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        
        // Random wave properties - kept very subtle
        const width = Math.random() * 100 + 100; // 100-200% width
        const height = Math.random() * 300 + 100; // 100-400px height
        const left = Math.random() * 100 - 50; // -50% to 50% left
        const top = Math.random() * 100; // 0-100% top
        
        // Set wave styles
        wave.style.width = `${width}%`;
        wave.style.height = `${height}px`;
        wave.style.left = `${left}%`;
        wave.style.top = `${top}%`;
        
        // Use CSS variables for colors
        const colorIndex = i % 3;
        wave.style.background = `linear-gradient(90deg, transparent, var(--wave-color-${colorIndex}), transparent)`;
        
        // Set data-speed for parallax effect - very subtle movement
        wave.dataset.speed = 0.05 + (Math.random() * 0.05); // 0.05-0.1 - subtle speed
        
        // Add to container
        container.appendChild(wave);
    }
}

// Set up sections for parallax effect with full-height sections
function setupSections() {
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Create a wrapper for all sections to maintain the document flow
    const wrapper = document.createElement('div');
    wrapper.className = 'sections-wrapper';
    wrapper.id = 'sectionsWrapper';
    
    // Insert wrapper after header
    if (header && header.nextSibling) {
        document.body.insertBefore(wrapper, header.nextSibling);
    } else {
        document.body.appendChild(wrapper);
    }
    
    // Process each section
    sections.forEach((section, index) => {
        // Don't process the section if it's already been moved
        if (section.parentNode === wrapper) return;
        
        // Clone the section to preserve event listeners
        const clonedSection = section.cloneNode(true);
        
        // Add to our sections wrapper
        wrapper.appendChild(clonedSection);
        
        // Hide original section
        section.style.display = 'none';
        
        // Configure the cloned section for our effect
        clonedSection.style.position = 'relative';
        clonedSection.style.opacity = index === 0 ? '1' : '0.3'; // Show first section fully
        clonedSection.style.visibility = index === 0 ? 'visible' : 'hidden';
        clonedSection.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        clonedSection.style.minHeight = `100vh`;
        clonedSection.style.paddingTop = `${headerHeight + 20}px`; // Account for fixed header
        
        // Style the content for transitions
        const content = clonedSection.querySelector('.section-content, .container > div');
        if (content) {
            content.style.transition = 'transform 0.5s ease';
            content.style.transform = index === 0 ? 'translateY(0)' : 'translateY(40px)';
        }
    });
    
    // Set the wrapper height to account for all sections
    wrapper.style.height = `${sections.length * 100}vh`;
    
    // Create scroll indicator dots
    createScrollIndicator(sections.length);
}

// Create scroll indicator dots
function createScrollIndicator(numSections) {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    
    for (let i = 0; i < numSections; i++) {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', function() {
            scrollToSection(i);
        });
        
        indicator.appendChild(dot);
    }
    
    document.body.appendChild(indicator);
}

// Scroll to a specific section
function scrollToSection(index) {
    const sections = document.querySelectorAll('#sectionsWrapper section');
    if (index >= 0 && index < sections.length) {
        // Calculate the scroll position
        const section = sections[index];
        const scrollTarget = section.offsetTop;
        
        // Smooth scroll to the target
        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });
    }
}

// Update the sections based on scroll position
function updateSectionsVisibility() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const sections = document.querySelectorAll('#sectionsWrapper section');
    const dots = document.querySelectorAll('.scroll-dot');
    
    // Find the section that should be visible
    let activeIndex = Math.floor(scrollPosition / windowHeight);
    if (activeIndex >= sections.length) {
        activeIndex = sections.length - 1;
    }
    
    // Update each section
    sections.forEach((section, index) => {
        const content = section.querySelector('.section-content, .container > div');
        
        if (index === activeIndex) {
            // Active section - fully visible
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        } else {
            // Inactive section - partially visible
            section.style.opacity = '0.3';
            section.style.visibility = 'hidden'; // Hide when not active
            if (content) {
                content.style.transform = 'translateY(40px)';
            }
        }
    });
    
    // Update navigation dots
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update navigation menu active state
    updateNavigationActive(activeIndex);
    
    // Update wave positions
    updateWaves();
}

// Update wave positions based on scroll
function updateWaves() {
    const scrollPosition = window.scrollY;
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach(wave => {
        const speed = parseFloat(wave.dataset.speed);
        const yPos = -scrollPosition * speed;
        wave.style.transform = `translateY(${yPos}px)`;
    });
}

// Set up scroll handling that works with existing handlers
function setupScrollHandling() {
    // For smoother section transitions, use a debounced scroll handler
    let scrollTimeout;
    
    // Create a function that handles the scroll
    const handleScroll = function() {
        // Update immediately for responsive feel
        updateSectionsVisibility();
        
        // Clear any existing timeout
        clearTimeout(scrollTimeout);
        
        // Set a timeout to snap to the nearest section when scrolling stops
        scrollTimeout = setTimeout(function() {
            // Get the current scroll position
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Calculate which section we're closest to
            const closestSectionIndex = Math.round(scrollPosition / windowHeight);
            
            // Snap to that section
            scrollToSection(closestSectionIndex);
        }, 200); // Small delay to allow for natural scrolling first
    };
    
    // Add our scroll handler
    window.addEventListener('scroll', handleScroll);
    
    // Also handle wheel events for smoother scrolling
    window.addEventListener('wheel', function(e) {
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Calculate current section
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const currentSectionIndex = Math.floor(scrollPosition / windowHeight);
        
        // Determine target section
        let targetSectionIndex = currentSectionIndex + direction;
        
        // Ensure target is in bounds
        const sections = document.querySelectorAll('#sectionsWrapper section');
        if (targetSectionIndex < 0) targetSectionIndex = 0;
        if (targetSectionIndex >= sections.length) targetSectionIndex = sections.length - 1;
        
        // Only handle if changing sections and not already scrolling
        if (targetSectionIndex !== currentSectionIndex && !window.isScrolling) {
            e.preventDefault(); // Prevent default scroll
            
            // Set flag to prevent multiple scrolls
            window.isScrolling = true;
            
            // Scroll to target section
            scrollToSection(targetSectionIndex);
            
            // Clear flag after animation completes
            setTimeout(function() {
                window.isScrolling = false;
            }, 700);
        }
    }, { passive: false });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        // Simple debounce
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            // Recalculate section heights and positions
            setupSections();
            updateSectionsVisibility();
        }, 250);
    });
}

// Setup navigation links to work with our section structure
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        // Clone the existing event listener setup but adjust for our structure
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a hash link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1); // Remove the # character
                const sections = document.querySelectorAll('#sectionsWrapper section');
                
                // Find the section index
                let targetIndex = -1;
                sections.forEach((section, index) => {
                    if (section.id === targetId) {
                        targetIndex = index;
                    }
                });
                
                // Scroll to the section
                if (targetIndex >= 0) {
                    scrollToSection(targetIndex);
                }
                
                // Close mobile menu if open
                const navMenu = document.querySelector('nav ul');
                const hamburger = document.querySelector('.hamburger');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        });
    });
}

// Update active navigation link based on visible section
function updateNavigationActive(activeIndex) {
    const sections = document.querySelectorAll('#sectionsWrapper section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Get the ID of the active section
    const activeSection = sections[activeIndex];
    if (!activeSection) return;
    
    const activeSectionId = activeSection.id;
    
    // Update nav links
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href');
        
        // Check if this link points to the active section
        if (linkTarget === `#${activeSectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update CSS variables for wave colors based on theme
function updateCSSVariables() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    // Primary color from your theme
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    const accentColors = isDark ? 
        ['#6d8dfa', '#a3b9ff', '#4b6cd9'] : // Dark theme colors
        ['#4a6cf7', '#86a0ff', '#3353d8'];  // Light theme colors
    
    // Set wave color variables
    root.style.setProperty('--wave-color-0', primaryColor);
    root.style.setProperty('--wave-color-1', accentColors[1]);
    root.style.setProperty('--wave-color-2', accentColors[2]);
    
    // Set wave opacity based on theme
    root.style.setProperty('--wave-opacity', isDark ? '0.08' : '0.05');
}

// Update wave colors when theme changes
function updateWaveColors() {
    updateCSSVariables();
    createWaves(); // Recreate waves with new colors
}
