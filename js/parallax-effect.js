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

// Create individual waves
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
        
        // More dramatic wave properties
        const width = 150 + (i * 30); // 150-270% width
        const height = 200 + (i * 70); // 200-480px height
        const left = -40 + (i * 20); // -40 to 40% left
        const top = (i * 20); // 0-80% top
        
        // Set styles
        wave.style.width = `${width}%`;
        wave.style.height = `${height}px`;
        wave.style.left = `${left}%`;
        wave.style.top = `${top}%`;
        
        // Color from CSS variables
        const colorIndex = i % 3;
        wave.style.background = `radial-gradient(ellipse at center, var(--wave-color-${colorIndex}), transparent 70%)`;
        
        // Slightly more noticeable movement
        wave.dataset.speed = 0.03 + (i * 0.01); // 0.03-0.07
        
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
    
    // Set colors based on theme
    const colors = isDark ? 
        ['rgba(109, 141, 250, 0.3)', 'rgba(75, 108, 217, 0.25)', 'rgba(45, 65, 130, 0.2)'] : // Dark theme
        ['rgba(74, 108, 247, 0.15)', 'rgba(134, 160, 255, 0.12)', 'rgba(51, 83, 216, 0.1)']; // Light theme
    
    // Set wave colors
    root.style.setProperty('--wave-color-0', colors[0]);
    root.style.setProperty('--wave-color-1', colors[1]);
    root.style.setProperty('--wave-color-2', colors[2]);
    
    // Set base background color to match theme
    root.style.setProperty('--unified-background', isDark ? '#121212' : '#ffffff');
}

// Update wave colors when theme changes
function updateWaveColors() {
    updateCSSVariables();
    createWaves();
}


