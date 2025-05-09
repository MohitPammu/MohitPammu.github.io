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

// Update wave positions
function updateWaves() {
    const scrollY = window.scrollY;
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach(wave => {
        const speed = parseFloat(wave.dataset.speed) || 0.03;
        const yPos = -scrollY * speed;
        wave.style.transform = `translateY(${yPos}px)`;
    });
}

// Set up scroll handler
function setupScrollHandler() {
    window.addEventListener('scroll', function() {
        // Just update waves on scroll for subtle effect
        updateWaves();
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            // Recreate waves on resize for better positioning
            createWaves();
        }, 200);
    });
}

// Update CSS variables based on theme
function updateCSSVariables() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    // Get primary color
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    
    // Create more vibrant color combinations
    const colors = isDark ? 
        [
            'rgba(109, 141, 250, 0.4)', // Primary blue glow
            'rgba(98, 108, 235, 0.35)', // Slight violet tint
            'rgba(65, 87, 190, 0.3)'    // Deeper blue
        ] : 
        [
            'rgba(74, 108, 247, 0.25)', // Primary blue
            'rgba(97, 142, 255, 0.2)',  // Lighter blue
            'rgba(51, 83, 216, 0.18)'   // Darker blue
        ];
    
    // Set wave colors
    root.style.setProperty('--wave-color-0', colors[0]);
    root.style.setProperty('--wave-color-1', colors[1]);
    root.style.setProperty('--wave-color-2', colors[2]);
    
    // Set base background color to match theme
    root.style.setProperty('--unified-background', isDark ? '#121212' : '#ffffff');
}

