// Parallax Effect for Portfolio Website
// This script adds subtle background waves and section navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize once DOM is loaded
    initParallaxEffect();
    
    // Listen for theme changes
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            // Update colors when theme changes
            setTimeout(updateWaveColors, 300);
        });
    }
});

// Main initialization function
function initParallaxEffect() {
    // Create and add wave background
    createWaveBackground();
    
    // Create navigation dots
    createNavigationDots();
    
    // Set up scroll event handler
    setupScrollHandler();
}

// Create wave background
function createWaveBackground() {
    // Check if container already exists
    if (document.getElementById('wave-container')) return;
    
    // Create container
    const waveContainer = document.createElement('div');
    waveContainer.className = 'wave-container';
    waveContainer.id = 'wave-container';
    document.body.insertBefore(waveContainer, document.body.firstChild);
    
    // Set CSS variables for colors
    updateCSSVariables();
    
    // Create waves
    createWaves();
}

// Create individual waves
function createWaves() {
    const container = document.getElementById('wave-container');
    if (!container) return;
    
    // Clear existing waves
    container.innerHTML = '';
    
    // Create waves (fewer for better performance)
    const numWaves = 3;
    
    for (let i = 0; i < numWaves; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        
        // Randomize properties slightly
        const width = 120 + (i * 20); // 120-160% width
        const height = 150 + (i * 50); // 150-250px height
        const left = -30 + (i * 30); // -30 to 30% left
        const top = 20 + (i * 30); // 20-80% top
        
        // Set styles
        wave.style.width = `${width}%`;
        wave.style.height = `${height}px`;
        wave.style.left = `${left}%`;
        wave.style.top = `${top}%`;
        
        // Color from CSS variables
        const colorIndex = i % 3;
        wave.style.background = `linear-gradient(90deg, transparent, var(--wave-color-${colorIndex}), transparent)`;
        
        // Very subtle movement
        wave.dataset.speed = 0.02 + (i * 0.01); // 0.02-0.04
        
        container.appendChild(wave);
    }
}

// Create navigation dots
function createNavigationDots() {
    // Remove existing dots if any
    const existingDots = document.querySelector('.section-nav-dots');
    if (existingDots) existingDots.remove();
    
    // Get all main sections with IDs
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    // Create container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'section-nav-dots';
    
    // Create a dot for each section
    sections.forEach((section) => {
        const dot = document.createElement('div');
        dot.className = 'section-nav-dot';
        dot.dataset.target = section.id;
        
        // Add click handler
        dot.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Add to document
    document.body.appendChild(dotsContainer);
    
    // Update active dot initially
    updateActiveDot();
}

// Scroll to section
function scrollToSection(section) {
    if (!section) return;
    
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const offset = section.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    });
}

// Update active dot based on scroll position
function updateActiveDot() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportMiddle = scrollY + (viewportHeight / 2);
    
    // Get all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    const dots = document.querySelectorAll('.section-nav-dot');
    
    // Find active section (closest to viewport middle)
    let activeSection = null;
    let minDistance = Infinity;
    
    sections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        const sectionMiddle = scrollY + sectionRect.top + (sectionRect.height / 2);
        const distance = Math.abs(viewportMiddle - sectionMiddle);
        
        if (distance < minDistance) {
            minDistance = distance;
            activeSection = section;
        }
    });
    
    // Update dots
    if (activeSection) {
        dots.forEach(dot => {
            if (dot.dataset.target === activeSection.id) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update waves
    updateWaves();
}

// Update wave positions
function updateWaves() {
    const scrollY = window.scrollY;
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach(wave => {
        const speed = parseFloat(wave.dataset.speed) || 0.02;
        const yPos = -scrollY * speed;
        wave.style.transform = `translateY(${yPos}px)`;
    });
}

// Set up scroll handler
function setupScrollHandler() {
    // Debounced scroll handler for better performance
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        // Update waves immediately for smooth effect
        updateWaves();
        
        // Debounce the more expensive operations
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateActiveDot, 100);
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(updateActiveDot, 200);
    });
}

// Update CSS variables based on theme
function updateCSSVariables() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    // Get primary color
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    
    // Set colors based on theme
    const accentColors = isDark ? 
        ['#6d8dfa', '#a3b9ff', '#4b6cd9'] : // Dark theme
        ['#4a6cf7', '#86a0ff', '#3353d8'];  // Light theme
    
    // Set wave colors
    root.style.setProperty('--wave-color-0', primaryColor);
    root.style.setProperty('--wave-color-1', accentColors[1]);
    root.style.setProperty('--wave-color-2', accentColors[2]);
    
    // Set opacity based on theme
    root.style.setProperty('--wave-opacity', isDark ? '0.07' : '0.04');
}

// Update wave colors when theme changes
function updateWaveColors() {
    updateCSSVariables();
    createWaves();
}
