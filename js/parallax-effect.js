// Gradient Wave Background Effect for Portfolio Website
// Creates a unified gradient background with subtle parallax waves

document.addEventListener('DOMContentLoaded', function() {
    // Initialize once DOM is loaded
    initGradientBackground();
    
    // Listen for theme changes
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            // Update colors immediately when theme changes
            updateWaveColors();
        });
    }
});

// Main initialization function
function initGradientBackground() {
    // Create and add wave background
    createWaveBackground();
    
    // Add special class to body to adjust section backgrounds
    document.body.classList.add('unified-gradient-background');
    
    // Set up scroll event handler for subtle wave movement
    setupScrollHandler();
}

// More synchronized theme switching
function updateWaveColors() {
    // First, update the CSS variables
    updateCSSVariables();
    
    // Then recreate waves with a slight delay to allow other transitions to start
    createWaves();
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

// Create more organic, flowing waves
function createWaves() {
    const container = document.getElementById('wave-container');
    if (!container) return;
    
    // Clear existing waves
    container.innerHTML = '';
    
    // Create waves - more waves for more visible effect
    const numWaves = 5;
    
    for (let i = 0; i < numWaves; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        
        // Create more varied dimensions for a less uniform look
        const width = 180 + (i * 40 + Math.random() * 20); // Add some randomness
        const height = Math.max(width * (0.5 + Math.random() * 0.2), 250); // More oval shape
        const left = -50 + (i * 25 + (Math.random() * 10 - 5)); // Slightly random positioning
        const top = -20 + (i * 30 + (Math.random() * 10 - 5)); // Slightly random positioning
        
        // Create rotation for more organic feel
        const rotation = Math.random() * 30 - 15; // -15 to 15 degrees
        
        // Set styles
        wave.style.width = `${width}%`;
        wave.style.height = `${height}px`;
        wave.style.left = `${left}%`;
        wave.style.top = `${top}%`;
        wave.style.transform = `rotate(${rotation}deg)`;
        
        // Color from CSS variables with slightly randomized stops
        const colorIndex = i % 3;
        const fade = 65 + Math.random() * 10; // 65-75% for more gradual fade
        wave.style.background = `radial-gradient(ellipse at center, var(--wave-color-${colorIndex}), transparent ${fade}%)`;
        
        // Apply blur filter for softness
        wave.style.filter = `blur(${40 + i * 10}px)`; // Increasing blur for deeper waves
        
        // Slightly more noticeable movement
        wave.dataset.speed = 0.04 + (i * 0.015);
        
        container.appendChild(wave);
    }
}

// Variables for scroll performance optimization
let lastScrollY = window.scrollY;
let ticking = false;
let scrollTimer = null;
const body = document.body;

// Optimized updateWaves function using requestAnimationFrame
function updateWaves() {
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach(wave => {
        const speed = parseFloat(wave.dataset.speed) || 0.03;
        const yPos = -lastScrollY * speed;
        
        // Get current rotation from dataset to preserve it
        const rotation = wave.dataset.rotation || '0';
        
        // Use translate3d for hardware acceleration
        wave.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
    });
    
    ticking = false;
}

// Set up optimized scroll handler
function setupScrollHandler() {
    // Store initial rotation during creation
    document.querySelectorAll('.wave').forEach(wave => {
        // Extract rotation angle if it exists in the current transform
        const rotation = wave.style.transform.match(/rotate\(([^)]+)\)/);
        if (rotation && rotation[1]) {
            wave.dataset.rotation = rotation[1].replace('deg', '');
        }
    });
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        // Add class to reduce animations during scroll
        if (!body.classList.contains('is-scrolling')) {
            body.classList.add('is-scrolling');
        }
        
        // Clear previous timeout
        clearTimeout(scrollTimer);
        
        // Set timeout to remove class after scrolling stops
        scrollTimer = setTimeout(function() {
            body.classList.remove('is-scrolling');
        }, 100);
        
        // Only request animation frame if we're not already processing one
        if (!ticking) {
            window.requestAnimationFrame(updateWaves);
            ticking = true;
        }
    }, { passive: true });
    
    // Handle resize with debounce
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            createWaves();
        }, 200);
    });
}

// Update CSS variables with more vibrant colors
function updateCSSVariables() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    // Get primary color
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    
    // Create more vibrant, glowing color combinations
    const colors = isDark ? 
        [
            'rgba(109, 141, 250, 0.45)', // Brighter primary blue glow
            'rgba(98, 108, 235, 0.40)', // Purple-blue tint
            'rgba(120, 87, 255, 0.35)'  // Purple accent
        ] : 
        [
            'rgba(74, 108, 247, 0.30)', // Brighter blue
            'rgba(97, 142, 255, 0.25)', // Light blue
            'rgba(111, 163, 252, 0.20)' // Sky blue accent
        ];
    
    // Set wave colors
    root.style.setProperty('--wave-color-0', colors[0]);
    root.style.setProperty('--wave-color-1', colors[1]);
    root.style.setProperty('--wave-color-2', colors[2]);
    
    // Set base background color to match theme - add subtle color tint
    root.style.setProperty('--unified-background', isDark ? 
        'rgba(18, 18, 24, 1)' : // Slightly blueish dark background
        'rgba(250, 252, 255, 1)' // Very slight blue tint to white
    );
}
