// Flowing Data Background - Data Science Portfolio
document.addEventListener('DOMContentLoaded', () => {
    // Configuration - REDUCED COMPLEXITY for better performance
    const config = {
        // Wave configuration - REDUCED COUNT
        waveSets: [
            // Primary waves - fewer count, simpler math
            {
                count: 3, // Reduced from 5
                minY: 0.2,
                maxY: 0.8,
                opacity: 0.12,
                width: 1,
                amplitude: 70,
                period: 300,
                speed: 0.0001,
                speedVariation: 0.00003
            },
            // Secondary waves - fewer count
            {
                count: 4, // Reduced from 8
                minY: 0.1,
                maxY: 0.9,
                opacity: 0.08,
                width: 0.7,
                amplitude: 40,
                period: 180,
                speed: 0.00015,
                speedVariation: 0.00005
            },
            // Detail waves - fewer count, simplified
            {
                count: 5, // Reduced from 12
                minY: 0.05,
                maxY: 0.95,
                opacity: 0.05,
                width: 0.5,
                amplitude: 20,
                period: 100,
                speed: 0.0002,
                speedVariation: 0.00008
            }
        ],
        
        // Particle configuration - REDUCED COUNT
        particleCount: 60, // Reduced from 120
        particleMinSize: 0.4,     
        particleMaxSize: 1.2,     
        particleMinSpeed: 0.1,    
        particleMaxSpeed: 0.4,    
        particleOpacity: 0.6,     
        particleFadeDistance: 50, 
        
        // Interaction
        parallaxRate: 0.1, // Reduced from 0.15
        
        // Performance optimizations
        enableAnimation: true,
        throttleScroll: true,
        useTranslucent: true, // Don't clear full canvas each frame
        reduceOnMobile: true, // Further reduce elements on mobile
        waveSegment: 20, // Increased from 10 - fewer segments = better performance
        animationFrameSkip: 2, // Only update animation every X frames
        sortFrequency: 10, // Only sort waves every X frames

        // Theme settings - ADJUSTED for visibility
        lightTheme: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // More transparent
            elementColor: 'rgba(74, 108, 247, 0.85)'  // Primary color with opacity
        },
        darkTheme: {
            backgroundColor: 'rgba(5, 5, 8, 0.9)', // More transparent 
            elementColor: 'rgba(109, 141, 250, 0.85)' // Dark theme primary color
        }
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return; // Exit if canvas element not found
    
    const ctx = canvas.getContext('2d', { alpha: config.useTranslucent });
    let width, height;
    let waves = [];
    let particles = [];
    let animationFrameId;
    let time = 0;
    let frameCount = 0;
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout;
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;

    // Get theme colors
    function getThemeColors() {
        return currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
    }

    // Update theme
    function updateTheme() {
        // Check BOTH possible places theme might be stored
        const bodyTheme = document.body.getAttribute('data-theme');
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        currentTheme = bodyTheme || htmlTheme || 'light';
    }

    // Adjust configuration based on device
    function adjustConfig() {
        isMobile = window.innerWidth < 768;
        
        if (isMobile && config.reduceOnMobile) {
            // Reduce elements on mobile
            config.waveSets.forEach(set => {
                set.count = Math.max(2, Math.floor(set.count / 2));
            });
            config.particleCount = 30;
            config.waveSegment = 30; // Fewer segments for mobile
        }
    }

    // Initialize canvas size
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Adjust config for device
        adjustConfig();
        
        // Recreate waves and particles
        initWaves();
        initParticles();
    }

    // Create a wave - SIMPLIFIED
    function createWave(config, index, total) {
        // Calculate vertical position
        const position = config.minY + (config.maxY - config.minY) * (index / Math.max(1, total - 1));
        const yBase = height * position;
        
        return {
            baseY: yBase,
            amplitude: config.amplitude, 
            period: config.period,
            phase: Math.random() * Math.PI * 2,
            speed: config.speed,
            width: config.width,
            opacity: config.opacity
        };
    }

    // Initialize all wave sets
    function initWaves() {
        waves = [];
        
        // Create waves for each set of wave configuration
        config.waveSets.forEach(waveSet => {
            for (let i = 0; i < waveSet.count; i++) {
                waves.push({
                    ...createWave(waveSet, i, waveSet.count),
                    setOpacity: waveSet.opacity,
                    setWidth: waveSet.width
                });
            }
        });
    }

    // Create a particle - SIMPLIFIED
    function createParticle(randomY = true) {
        const x = Math.random() * width;
        const y = randomY ? Math.random() * height : height + Math.random() * 20;
        
        return { 
            x, 
            y, 
            size: config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize),
            speed: config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed),
            opacity: config.particleOpacity * (0.7 + Math.random() * 0.3),
            drift: Math.random() * 0.2 - 0.1
        };
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const count = isMobile && config.reduceOnMobile ? 
                      Math.floor(config.particleCount / 2) : 
                      config.particleCount;
                      
        for (let i = 0; i < count; i++) {
            particles.push(createParticle(true));
        }
    }

    // Draw a single wave - SIMPLIFIED for performance
    function drawWave(wave) {
        const themeColors = getThemeColors();
        
        ctx.beginPath();
        ctx.strokeStyle = themeColors.elementColor.replace(/[^,]+(?=\))/, wave.opacity.toString());
        ctx.lineWidth = wave.width;
        
        // Use larger segments for better performance
        const segment = config.waveSegment;
        let startX = -100;
        
        // Simplified wave calculation
        let startY = wave.baseY + Math.sin(startX * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude;
        
        ctx.moveTo(startX, startY);
        
        // Draw fewer segments for better performance
        for (let x = startX + segment; x <= width + 100; x += segment) {
            // Simplified to a single sine wave
            const y = wave.baseY + Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    }

    // Draw all waves - with less frequent sorting
    function drawWaves() {
        // Only sort waves occasionally for better performance
        if (frameCount % config.sortFrequency === 0) {
            waves.sort((a, b) => a.baseY - b.baseY);
        }
        
        // Draw waves from back to front
        waves.forEach(wave => drawWave(wave));
    }

    // Update particle positions - SIMPLIFIED
    function updateParticles() {
        particles.forEach(particle => {
            // Move upward with minimal drift
            particle.y -= particle.speed;
            particle.x += particle.drift;
            
            // Reset particles that move off screen
            if (particle.y < -20) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }
        });
    }

    // Draw particles - SIMPLIFIED
    function drawParticles() {
        const themeColors = getThemeColors();
        const baseColor = themeColors.elementColor;
        
        particles.forEach(particle => {
            // Simplified opacity calculation
            let finalOpacity = particle.opacity;
            if (particle.y > height - config.particleFadeDistance) {
                finalOpacity = particle.opacity * (height - particle.y) / config.particleFadeDistance;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = baseColor.replace(/[^,]+(?=\))/, finalOpacity.toString());
            ctx.fill();
        });
    }

    // Apply parallax effect on scroll - OPTIMIZED
    function applyParallax(scrollY) {
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Skip tiny movements
        if (Math.abs(deltaY) < 1) return;
        
        // Apply to waves
        waves.forEach(wave => {
            wave.baseY -= deltaY * config.parallaxRate;
            
            // Reset waves that move off screen
            if (wave.baseY < -wave.amplitude) {
                wave.baseY = height + wave.amplitude;
            } else if (wave.baseY > height + wave.amplitude) {
                wave.baseY = -wave.amplitude;
            }
        });
        
        // Apply to particles
        particles.forEach(particle => {
            particle.y -= deltaY * config.parallaxRate * 0.3;
        });
    }

// Handle scroll events with improved throttling
function handleScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    
    // Get the active section index for smoother parallax
    const activeSection = document.querySelector('.fullpage-section.active');
    if (activeSection) {
        const sectionIndex = Array.from(document.querySelectorAll('.fullpage-section')).indexOf(activeSection);
        // Use section index to create a virtual scroll position
        const virtualScrollY = sectionIndex * window.innerHeight;
        applyParallax(virtualScrollY);
    } else {
        // Fallback to window scroll if no active section
        applyParallax(window.scrollY);
    }
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        isScrolling = false;
    });
}

    // Main render loop - OPTIMIZED
    function render() {
        frameCount++;
        
        // Skip frames for better performance
        const updateAnimation = frameCount % config.animationFrameSkip === 0;
        
        // Use translucent fill for better performance
        if (config.useTranslucent) {
            const themeColors = getThemeColors();
            ctx.fillStyle = themeColors.backgroundColor;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.clearRect(0, 0, width, height);
        }
        
        // Update time at reduced rate
        if (updateAnimation && config.enableAnimation) {
            time += 1;
        }
        
        // Draw elements
        drawWaves();
        
        // Only update particles on some frames
        if (updateAnimation && config.enableAnimation) {
            updateParticles();
        }
        
        drawParticles();
        
        // Request next frame
        animationFrameId = requestAnimationFrame(render);
    }

    // Handle visibility change
    function handleVisibilityChange() {
        config.enableAnimation = document.visibilityState === 'visible';
    }

    // Handle theme change with improved detection
    function handleThemeChange(newTheme) {
        updateTheme();
    }

    // Watch for theme changes by checking multiple elements and using MutationObserver
    function watchThemeChanges() {
        // Check both html and body elements for theme attribute
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    handleThemeChange();
                    break;
                }
            }
        });
        
        // Observe both possible elements where theme might be stored
        observer.observe(document.documentElement, { attributes: true });
        observer.observe(document.body, { attributes: true });
        
        // Also check for class changes that might indicate theme switches
        document.addEventListener('themeChanged', handleThemeChange);
    }

    // Initialize the visualization
    function init() {
        updateTheme(); // Initialize theme
        resizeCanvas();
        watchThemeChanges(); // Set up theme change observer
        
        // Start rendering
        render();
        
        // Add event listeners
        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 200);
        }, { passive: true });
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Check for theme toggle clicks
        const themeToggle = document.querySelector('.theme-switcher');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Force theme update after a brief delay to ensure DOM changes
                setTimeout(updateTheme, 50);
            });
        }
    }

    // Start initialization
    init();
});
