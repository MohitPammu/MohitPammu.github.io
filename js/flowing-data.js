// Flowing Data Background - Simplified Waves and Particles
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        // Wave configuration
        waves: {
            count: 4,           // Number of waves
            minY: 0.3,          // Minimum vertical position (as percentage of height)
            maxY: 0.7,          // Maximum vertical position
            opacity: 0.08,      // Base opacity
            width: 1,           // Line width
            amplitude: 40,      // Wave height
            period: 300,        // Wave length
            speed: 0.0001,      // Animation speed
            speedVariation: 0.00003 // Variation in speed
        },
        
        // Particle configuration
        particles: {
            count: 45,          // Number of particles
            minSize: 0.5,       // Minimum size
            maxSize: 1.5,       // Maximum size
            minSpeed: 0.2,      // Minimum upward speed
            maxSpeed: 0.5,      // Maximum upward speed
            opacity: 0.6,       // Base opacity
            fadeDistance: 40    // Distance from bottom to start fading
        },
        
        // Scroll interaction
        scroll: {
            parallaxRate: 0.1,  // How much elements move on scroll
            waveAmplitudeChange: 0.15 // How much wave amplitude changes on scroll
        },
        
        // Performance settings
        performance: {
            useTranslucent: true,  // Use translucent background instead of clear
            waveSegment: 15,       // Wave segment size (higher = better performance)
            reduceOnMobile: true   // Reduce elements on mobile
        },
        
        // Colors
        colors: {
            light: {
                background: 'rgba(255, 255, 255, 0.95)',
                primary: 'rgba(74, 108, 247, ' // Primary blue
            },
            dark: {
                background: 'rgba(10, 10, 15, 0.95)',
                primary: 'rgba(109, 141, 250, ' // Lighter blue for dark theme
            }
        }
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return; // Exit if canvas element not found
    
    const ctx = canvas.getContext('2d', { alpha: config.performance.useTranslucent });
    let width, height;
    let waves = [];
    let particles = [];
    let animationFrameId;
    let time = 0;
    let lastScrollY = 0;
    let scrollProgress = 0; // 0 to 1 based on page scroll position
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;
    
    // Get current theme colors
    function getThemeColors() {
        return currentTheme === 'dark' ? config.colors.dark : config.colors.light;
    }
    
    // Check and update current theme
    function updateTheme() {
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        const bodyTheme = document.body.getAttribute('data-theme');
        currentTheme = htmlTheme || bodyTheme || 'light';
    }
    
    // Initialize canvas size
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Adjust for mobile
        isMobile = window.innerWidth < 768;
        adjustConfigForDevice();
        
        // Recreate elements
        initWaves();
        initParticles();
    }
    
    // Adjust configuration based on device
    function adjustConfigForDevice() {
        if (isMobile && config.performance.reduceOnMobile) {
            config.waves.count = 3;
            config.particles.count = 30;
        } else {
            // Reset to default if not mobile or reduceOnMobile is false
            config.waves.count = 4;
            config.particles.count = 45;
        }
    }
    
    // Create waves
    function initWaves() {
        waves = [];
        
        for (let i = 0; i < config.waves.count; i++) {
            // Calculate vertical position (evenly distributed)
            const position = config.waves.minY + (config.waves.maxY - config.waves.minY) * (i / (config.waves.count - 1));
            
            waves.push({
                baseY: height * position,
                amplitude: config.waves.amplitude,
                period: config.waves.period + (Math.random() * 100 - 50), // Slight variation
                phase: Math.random() * Math.PI * 2, // Random starting phase
                speed: config.waves.speed + Math.random() * config.waves.speedVariation,
                width: config.waves.width,
                opacity: config.waves.opacity
            });
        }
    }
    
    // Create particles
    function initParticles() {
        particles = [];
        
        for (let i = 0; i < config.particles.count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: config.particles.minSize + Math.random() * 
                      (config.particles.maxSize - config.particles.minSize),
                speed: config.particles.minSpeed + Math.random() *
                       (config.particles.maxSpeed - config.particles.minSpeed),
                opacity: config.particles.opacity * (0.7 + Math.random() * 0.3),
                drift: Math.random() * 0.4 - 0.2 // Slight horizontal drift
            });
        }
    }
    
    // Draw a single wave
    function drawWave(wave) {
        const themeColors = getThemeColors();
        
        // Calculate wave amplitude adjusted by scroll
        const adjustedAmplitude = wave.amplitude * (1 + scrollProgress * config.scroll.waveAmplitudeChange);
        
        ctx.beginPath();
        ctx.strokeStyle = themeColors.primary + wave.opacity + ')';
        ctx.lineWidth = wave.width;
        
        // Use segments for better performance
        const segment = config.performance.waveSegment;
        
        // Start before left edge
        let x = -100;
        let y = wave.baseY + Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * adjustedAmplitude;
        
        ctx.moveTo(x, y);
        
        // Draw wave segments
        for (x = 0; x <= width + 100; x += segment) {
            y = wave.baseY + Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * adjustedAmplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    }
    
    // Draw all waves
    function drawWaves() {
        // Sort waves by y-position (back to front)
        waves.sort((a, b) => a.baseY - b.baseY);
        
        // Draw waves
        waves.forEach(wave => drawWave(wave));
    }
    
    // Update particle positions
    function updateParticles() {
        particles.forEach(particle => {
            // Move upward with slight drift
            particle.y -= particle.speed;
            particle.x += particle.drift;
            
            // Reset particles that move off screen
            if (particle.y < -20) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }
            
            // Wrap horizontally
            if (particle.x < -20) particle.x = width + 10;
            if (particle.x > width + 20) particle.x = -10;
        });
    }
    
    // Draw particles
    function drawParticles() {
        const themeColors = getThemeColors();
        
        particles.forEach(particle => {
            // Calculate final opacity (fade near bottom edge)
            let finalOpacity = particle.opacity;
            
            if (particle.y > height - config.particles.fadeDistance) {
                finalOpacity *= (height - particle.y) / config.particles.fadeDistance;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = themeColors.primary + finalOpacity + ')';
            ctx.fill();
        });
    }
    
    // Update scroll position and apply parallax
    function updateScrollPosition(scrollY) {
        // Get scroll progress (0 to 1)
        const docHeight = Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        const scrollRange = docHeight - window.innerHeight;
        scrollProgress = scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0;
        
        // Calculate scroll difference for parallax
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Skip tiny movements
        if (Math.abs(deltaY) < 1) return;
        
        // Apply parallax to waves
        waves.forEach(wave => {
            wave.baseY -= deltaY * config.scroll.parallaxRate;
            
            // Keep waves on screen
            if (wave.baseY < -wave.amplitude) {
                wave.baseY = height + wave.amplitude;
            } else if (wave.baseY > height + wave.amplitude) {
                wave.baseY = -wave.amplitude;
            }
        });
        
        // Apply slight parallax to particles
        particles.forEach(particle => {
            particle.y -= deltaY * config.scroll.parallaxRate * 0.5;
        });
    }
    
    // Handle scroll events
    function handleScroll() {
        requestAnimationFrame(() => {
            // Check for special fullpage scrolling
            if (typeof window.currentSectionIndex !== 'undefined') {
                const virtualScrollY = window.currentSectionIndex * window.innerHeight;
                updateScrollPosition(virtualScrollY);
            } else {
                // Regular scroll
                updateScrollPosition(window.scrollY);
            }
        });
    }
    
    // Create a synchronized method that can be called from other scripts
    window.syncFlowingDataWithScroll = function(scrollY) {
        updateScrollPosition(scrollY || window.scrollY);
    };
    
    // Main render loop
    function render() {
        // Apply translucent background for trail effect
        const themeColors = getThemeColors();
        ctx.fillStyle = themeColors.background;
        ctx.fillRect(0, 0, width, height);
        
        // Update time
        time += 1;
        
        // Draw elements
        drawWaves();
        updateParticles();
        drawParticles();
        
        // Request next frame
        animationFrameId = requestAnimationFrame(render);
    }
    
    // Handle theme changes
    function watchThemeChanges() {
        const observer = new MutationObserver(() => {
            updateTheme();
        });
        
        // Observe both possible theme locations
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
        
        // Also listen for custom theme event
        document.addEventListener('themeChanged', updateTheme);
    }
    
    // Initialize
    function init() {
        updateTheme();
        resizeCanvas();
        watchThemeChanges();
        
        // Start animation
        render();
        
        // Add event listeners
        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 200);
        }, { passive: true });
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Listen for section changes (for fullpage scrolling)
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail && typeof e.detail.index !== 'undefined') {
                const virtualScrollY = e.detail.index * window.innerHeight;
                updateScrollPosition(virtualScrollY);
            }
        });
        
        // Handle visibility change to save resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(render);
            }
        });
        
        // Add theme toggle listener
        const themeToggle = document.querySelector('.theme-switcher');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Update theme after toggle
                setTimeout(updateTheme, 50);
            });
        }
    }
    
    // Start initialization
    init();
});
