// Simplified Flowing Data Background with Subtle Wave Animation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing simplified flowing data background...');

    // Configuration - Simplified for cleaner look
    const config = {
        // Wave configuration - Reduced for subtlety
        waveSets: [
            // Primary waves - subtle background waves
            {
                count: 3,
                minY: 0.3,
                maxY: 0.7,
                opacity: 0.2, 
                width: 1.5,
                baseAmplitude: 55, // Base amplitude that will change with scroll
                period: 350, // Longer period for gentler waves
                speed: 0.00008, // Slower speed
                speedVariation: 0.00002
            },
            // Secondary waves - smaller detail waves
            {
                count: 4,
                minY: 0.2,
                maxY: 0.8,
                opacity: 0.12,
                width: 1.2,
                baseAmplitude: 35, // Base amplitude that will change with scroll
                period: 200,
                speed: 0.0001,
                speedVariation: 0.00003
            }
        ],
        
        // Particle configuration - Simplified
        particleCount: 45, 
        particleMinSize: 1.0,     
        particleMaxSize: 2.5,     
        particleMinSpeed: 0.1,    
        particleMaxSpeed: 0.4,    
        particleOpacity: 0.75, 
        particleFadeDistance: 50,
        
        // Scroll effects
        parallaxRate: 0.08, // Reduced for subtlety
        waveAmplitudeChange: 0.6, // How much wave amplitude changes with scroll (0.6 = 60%)
        
        // Performance optimizations
        enableAnimation: true,
        useTranslucent: true,
        reduceOnMobile: true,
        waveSegment: 20,
        animationFrameSkip: 1, // Don't skip frames by default (smoother)
        
        // Colors
        lightTheme: {
            backgroundColor: 'rgba(255, 255, 255, 0.96)', // Nearly solid white
            elementColor: 'rgba(55, 100, 247, '          // Primary blue
        },
        darkTheme: {
            backgroundColor: 'rgba(8, 8, 12, 0.96)',     // Nearly solid dark
            elementColor: 'rgba(140, 180, 255, '         // Lighter blue for dark theme
        }
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) {
        console.warn('Flow canvas element not found');
        return; // Exit if canvas element not found
    }
    
    const ctx = canvas.getContext('2d', { alpha: config.useTranslucent });
    let width, height;
    let waves = [];
    let particles = [];
    let animationFrameId;
    let time = 0;
    let frameCount = 0;
    let lastScrollY = window.scrollY;
    let scrollProgress = 0; // 0 to 1 based on scroll position
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;

    /**
     * Get theme colors based on current theme
     */
    function getThemeColors() {
        return currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
    }

    /**
     * Update theme state when theme changes
     */
    function updateTheme() {
        // Check both possible places theme might be stored
        const bodyTheme = document.body.getAttribute('data-theme');
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        currentTheme = bodyTheme || htmlTheme || 'light';
    }

    /**
     * Adjust configuration based on device
     */
    function adjustConfig() {
        isMobile = window.innerWidth < 768;
        
        if (isMobile && config.reduceOnMobile) {
            // Reduce elements on mobile
            config.waveSets.forEach(set => {
                set.count = Math.max(1, Math.floor(set.count / 2));
            });
            config.particleCount = 25;
            config.waveSegment = 30; // Fewer segments for mobile
        }
    }

    /**
     * Initialize canvas size and recreate elements
     */
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Adjust config for device
        adjustConfig();
        
        // Recreate waves and particles
        initWaves();
        initParticles();
    }

    /**
     * Create waves from configuration
     */
    function initWaves() {
        waves = [];
        
        // Create waves for each set of wave configuration
        config.waveSets.forEach(waveSet => {
            for (let i = 0; i < waveSet.count; i++) {
                // Calculate vertical position (evenly distributed)
                const position = waveSet.minY + (waveSet.maxY - waveSet.minY) * (i / Math.max(1, waveSet.count - 1));
                
                waves.push({
                    baseY: height * position,
                    amplitude: waveSet.baseAmplitude,
                    basePeriod: waveSet.period,
                    period: waveSet.period + (Math.random() * 50 - 25), // Slight variation
                    phase: Math.random() * Math.PI * 2, // Random starting phase
                    speed: waveSet.speed + (Math.random() * waveSet.speedVariation),
                    width: waveSet.width,
                    opacity: waveSet.opacity
                });
            }
        });
    }

    /**
     * Create particles
     */
    function initParticles() {
        particles = [];
        const count = isMobile ? Math.floor(config.particleCount * 0.6) : config.particleCount;
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize),
                speed: config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed),
                opacity: config.particleOpacity * (0.7 + Math.random() * 0.3),
                drift: (Math.random() - 0.5) * 0.2 // Slight horizontal drift
            });
        }
    }

    /**
     * Draw a single wave
     */
    function drawWave(wave) {
        const themeColors = getThemeColors();
        
        // Calculate amplitude based on scroll position
        // As we scroll down, waves get slightly larger
        const scrollFactor = 1 + (scrollProgress - 0.5) * config.waveAmplitudeChange;
        const adjustedAmplitude = wave.amplitude * scrollFactor;
        
        ctx.beginPath();
        ctx.strokeStyle = themeColors.elementColor + wave.opacity + ')';
        ctx.lineWidth = wave.width;
        
        // Use segments for better performance
        const segment = config.waveSegment;
        
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

    /**
     * Draw all waves
     */
    function drawWaves() {
        // Sort waves by y-position (back to front)
        waves.sort((a, b) => a.baseY - b.baseY);
        
        // Draw waves
        waves.forEach(wave => drawWave(wave));
    }

    /**
     * Update particle positions
     */
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
            
            // Wrap horizontally 
            if (particle.x < -20) particle.x = width + 10;
            if (particle.x > width + 20) particle.x = -10;
        });
    }

    /**
     * Draw particles
     */
    function drawParticles() {
        const themeColors = getThemeColors();
        
        particles.forEach(particle => {
            // Calculate final opacity (fade near bottom edge)
            let finalOpacity = particle.opacity;
            
            if (particle.y > height - config.particleFadeDistance) {
                finalOpacity *= (height - particle.y) / config.particleFadeDistance;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = themeColors.elementColor + finalOpacity + ')';
            ctx.fill();
        });
    }

    /**
     * Update scroll position and calculate effects
     */
    function updateScrollPosition(scrollY) {
        // Calculate scroll progress (0 to 1)
        const docHeight = Math.max(
            document.body.scrollHeight, 
            document.documentElement.scrollHeight
        ) - window.innerHeight;
        
        // Get scroll progress between 0 and 1
        scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
        
        // Calculate scroll difference for parallax
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Skip tiny movements
        if (Math.abs(deltaY) < 1) return;
        
        // Apply parallax to waves
        waves.forEach(wave => {
            wave.baseY -= deltaY * config.parallaxRate;
            
            // Keep waves on screen
            if (wave.baseY < -wave.amplitude) {
                wave.baseY = height + wave.amplitude;
            } else if (wave.baseY > height + wave.amplitude) {
                wave.baseY = -wave.amplitude;
            }
        });
        
        // Apply slight parallax to particles
        particles.forEach(particle => {
            particle.y -= deltaY * config.parallaxRate * 0.5;
        });
    }

    /**
     * Handle scroll events
     */
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
    
    /**
     * Exposed method for other scripts to call
     */
    window.syncFlowingDataWithScroll = function(scrollY) {
        updateScrollPosition(scrollY || window.scrollY);
    };
    
    /**
     * Exposed method for fullpage scrolling
     */
    window.syncParallaxWithSections = function() {
        // Use the current section index to determine parallax position
        const index = window.currentSectionIndex || 0;
        const virtualScrollY = index * window.innerHeight;
        
        updateScrollPosition(virtualScrollY);
    };
    
    /**
     * Main render loop
     */
    function render() {
        frameCount++;
        
        // Skip frames for better performance if needed
        const updateAnimation = frameCount % config.animationFrameSkip === 0;
        
        // Apply translucent background
        const themeColors = getThemeColors();
        ctx.fillStyle = themeColors.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        
        // Update time
        if (updateAnimation && config.enableAnimation) {
            time += 1;
        }
        
        // Draw elements
        drawWaves();
        
        // Update particles
        if (updateAnimation && config.enableAnimation) {
            updateParticles();
        }
        
        drawParticles();
        
        // Request next frame
        animationFrameId = requestAnimationFrame(render);
    }

    /**
     * Handle visibility change to save resources
     */
    function handleVisibilityChange() {
        config.enableAnimation = document.visibilityState === 'visible';
    }

    /**
     * Watch for theme changes
     */
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
        
        // Also listen for custom event
        document.addEventListener('themeChanged', updateTheme);
    }

    /**
     * Initialize the visualization
     */
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
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Listen for section changes (for fullpage scrolling)
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail && typeof e.detail.index !== 'undefined') {
                const virtualScrollY = e.detail.index * window.innerHeight;
                updateScrollPosition(virtualScrollY);
            }
        });
        
        // Handle theme toggle
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
