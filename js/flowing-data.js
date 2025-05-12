// Flowing Data Background - Simple Elegant Design
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        // Wave configuration - very subtle
        waves: {
            count: 3,            // Fewer waves for subtlety
            minY: 0.35,          // Position in the middle portion of the screen
            maxY: 0.65,          // Keep waves in the middle area
            opacity: 0.07,       // Very low opacity for subtlety
            width: 0.8,          // Thinner lines
            baseAmplitude: 25,   // Base wave height (smaller)
            period: 300,         // Wave length
            speed: 0.00008       // Slower animation speed
        },
        
        // Particle configuration - simple independently floating
        particles: {
            count: 40,           // Moderate number of particles
            minSize: 0.5,        // Minimum size
            maxSize: 1.5,        // Maximum size
            minSpeed: 0.15,      // Minimum upward speed (slower)
            maxSpeed: 0.4,       // Maximum upward speed
            opacity: 0.5,        // Base opacity
            fadeDistance: 40     // Distance from bottom to start fading
        },
        
        // Scroll interaction
        scroll: {
            parallaxRate: 0.08,  // Subtle parallax effect
            waveChange: 0.6      // How much waves change with scroll
        },
        
        // Colors
        colors: {
            light: {
                background: 'rgba(255, 255, 255, 0.98)', // Nearly solid white
                primary: 'rgba(74, 108, 247, '          // Primary blue
            },
            dark: {
                background: 'rgba(8, 8, 12, 0.98)',     // Nearly solid dark
                primary: 'rgba(109, 141, 250, '         // Lighter blue for dark theme
            }
        }
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let waves = [];
    let particles = [];
    let time = 0;
    let lastScrollY = 0;
    let scrollProgress = 0; // 0 to 1 based on page scroll position
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;
    let animationFrameId;
    
    // Get theme colors
    function getThemeColors() {
        return currentTheme === 'dark' ? config.colors.dark : config.colors.light;
    }
    
    // Update current theme
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
        
        // Recreate elements
        initWaves();
        initParticles();
    }
    
    // Create waves
    function initWaves() {
        waves = [];
        
        for (let i = 0; i < config.waves.count; i++) {
            // Calculate vertical position (evenly distributed)
            const position = config.waves.minY + 
                          (config.waves.maxY - config.waves.minY) * (i / Math.max(1, config.waves.count - 1));
            
            waves.push({
                baseY: height * position,
                amplitude: config.waves.baseAmplitude,
                period: config.waves.period * (0.8 + Math.random() * 0.4), // Slight variation
                phase: Math.random() * Math.PI * 2, // Random starting phase
                speed: config.waves.speed * (0.8 + Math.random() * 0.4), // Slight variation
                width: config.waves.width,
                opacity: config.waves.opacity
            });
        }
    }
    
    // Create particles
    function initParticles() {
        particles = [];
        const count = isMobile ? Math.floor(config.particles.count * 0.7) : config.particles.count;
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: config.particles.minSize + Math.random() * 
                      (config.particles.maxSize - config.particles.minSize),
                speed: config.particles.minSpeed + Math.random() *
                       (config.particles.maxSpeed - config.particles.minSpeed),
                opacity: config.particles.opacity * (0.7 + Math.random() * 0.3),
                drift: (Math.random() - 0.5) * 0.2 // Very slight horizontal drift
            });
        }
    }
    
    // Draw waves
    function drawWaves() {
        const themeColors = getThemeColors();
        
        // Draw each wave
        waves.forEach(wave => {
            // Calculate amplitude based on scroll position
            // Either grow or shrink waves based on scroll
            const scrollFactor = 1 + (scrollProgress - 0.5) * config.scroll.waveChange;
            const adjustedAmplitude = wave.amplitude * scrollFactor;
            
            ctx.beginPath();
            ctx.strokeStyle = themeColors.primary + wave.opacity + ')';
            ctx.lineWidth = wave.width;
            
            // Draw smooth wave
            ctx.moveTo(0, wave.baseY);
            
            for (let x = 0; x <= width; x += 20) {
                const y = wave.baseY + 
                          Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * 
                          adjustedAmplitude;
                          
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        });
    }
    
    // Update particle positions
    function updateParticles() {
        particles.forEach(particle => {
            // Simple upward movement with tiny drift
            particle.y -= particle.speed;
            particle.x += particle.drift;
            
            // Reset particles that move off screen
            if (particle.y < -20) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }
            
            // Wrap horizontally
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
        });
    }
    
    // Draw particles
    function drawParticles() {
        const themeColors = getThemeColors();
        
        particles.forEach(particle => {
            // Calculate opacity (fade near bottom)
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
    
    // Update scroll position and apply effects
    function updateScrollPosition(scrollY) {
        // Calculate scroll progress (0 to 1)
        const docHeight = Math.max(
            document.body.scrollHeight, 
            document.documentElement.scrollHeight
        ) - window.innerHeight;
        
        scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
        
        // Calculate delta for parallax
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Apply subtle parallax to waves
        if (Math.abs(deltaY) >= 1) {
            waves.forEach(wave => {
                wave.baseY -= deltaY * config.scroll.parallaxRate;
                
                // Keep waves on screen
                if (wave.baseY < 0) wave.baseY = height;
                if (wave.baseY > height) wave.baseY = 0;
            });
        }
    }
    
    // Handle scroll events
    function handleScroll() {
        requestAnimationFrame(() => {
            // Check for fullpage scrolling
            if (typeof window.currentSectionIndex !== 'undefined') {
                const virtualScrollY = window.currentSectionIndex * window.innerHeight;
                updateScrollPosition(virtualScrollY);
            } else {
                // Regular scroll
                updateScrollPosition(window.scrollY);
            }
        });
    }
    
    // Expose method for external scripts
    window.syncFlowingDataWithScroll = function(scrollY) {
        updateScrollPosition(scrollY || window.scrollY);
    };
    
    // Main render loop
    function render() {
        // Clear canvas with theme background
        const themeColors = getThemeColors();
        ctx.fillStyle = themeColors.background;
        ctx.fillRect(0, 0, width, height);
        
        // Update time
        time += 1;
        
        // Draw elements
        drawWaves();
        updateParticles();
        drawParticles();
        
        // Continue animation
        animationFrameId = requestAnimationFrame(render);
    }
    
    // Watch for theme changes
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
        
        // Listen for section changes (fullpage scrolling)
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail && typeof e.detail.index !== 'undefined') {
                const virtualScrollY = e.detail.index * window.innerHeight;
                updateScrollPosition(virtualScrollY);
            }
        });
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(render);
            }
        });
        
        // Handle theme toggle
        const themeToggle = document.querySelector('.theme-switcher');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(updateTheme, 50);
            });
        }
    }
    
    // Start initialization
    init();
});
