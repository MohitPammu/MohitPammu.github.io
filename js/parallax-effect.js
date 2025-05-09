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
    
    // Set up sections for parallax effect
    setupSections();
    
    // Initial update of sections based on current scroll position
    updateSectionsVisibility();
    
    // Set up scroll handling that works with existing handlers
    setupScrollHandling();
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

// Set up sections for parallax effect
function setupSections() {
    const sections = document.querySelectorAll('section');
    
    // We don't modify the sections' heights as they vary in content
    // Instead we just prepare them for fade transitions
    sections.forEach(section => {
        // Add transition for opacity
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Get the content wrapper inside the section
        const content = section.querySelector('.section-content, .container > div');
        if (content) {
            // Add transition for content
            content.style.transition = 'transform 0.5s ease';
        }
    });
}

// Update the sections based on scroll position
function updateSectionsVisibility() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const sections = document.querySelectorAll('section');
    
    // Update active navigation item (alongside existing code)
    const navLinks = document.querySelectorAll('nav ul li a');
    
    sections.forEach((section, index) => {
        // Calculate distance from section to current scroll position
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + sectionHeight / 2;
        
        // Calculate distance from the section's midpoint to middle of viewport
        const distanceFromMiddle = Math.abs(scrollPosition + windowHeight/2 - sectionMiddle);
        const maxDistance = windowHeight + sectionHeight / 2;
        
        // Calculate opacity based on distance (1 when in center, fading as it moves away)
        let scrollProgress = 1 - Math.min(distanceFromMiddle / maxDistance, 1);
        
        // Apply subtle minimum opacity so sections never completely disappear
        // This preserves the flow of the site while still creating the effect
        scrollProgress = 0.4 + (scrollProgress * 0.6);
        
        // Apply opacity
        section.style.opacity = scrollProgress;
        
        // Apply subtle transform for content based on scroll progress
        const content = section.querySelector('.section-content, .container > div');
        if (content) {
            const contentTransform = 20 - (scrollProgress * 20); // max 20px shift, minimum 0
            content.style.transform = `translateY(${contentTransform}px)`;
        }
    });
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
    // Create a function that combines all scroll effects
    const handleScroll = function() {
        // Update sections visibility with subtle fade effect
        updateSectionsVisibility();
        
        // Update wave positions for parallax effect
        updateWaves();
    };
    
    // Add our combined scroll handler
    window.addEventListener('scroll', handleScroll);
    
    // Also handle resize events
    window.addEventListener('resize', function() {
        // Simple debounce
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            updateSectionsVisibility();
        }, 250);
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
