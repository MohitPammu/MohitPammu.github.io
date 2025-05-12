// Flowing Data Background with Minimal Scroll Responsiveness
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing flowing data background with reduced scroll effects...');

    // Configuration - Optimized for minimal distraction
    const config = {
        // Wave configuration
        waveSets: [
            // Primary waves
            {
                count: 3,
                minY: 0.3,
                maxY: 0.7,
                opacity: 0.15, 
                width: 1.2,
                baseAmplitude: 55,
                period: 350,
                speed: 0.00008,
                speedVariation: 0.00002
            },
            // Secondary waves
            {
                count: 4,
                minY: 0.2,
                maxY: 0.8,
                opacity: 0.10,
                width: 0.8,
                baseAmplitude: 35,
                period: 200,
                speed: 0.0001,
                speedVariation: 0.00003
            }
        ],
        
        // Particle configuration
        particleCount: 45,
        particleMinSize: 1.0,     
        particleMaxSize: 2.5,     
        particleMinSpeed: 0.1,    
        particleMaxSpeed: 0.4,    
        particleOpacity: 0.75,
        particleFadeDistance: 50,
        
        // Scroll effects - SIGNIFICANTLY REDUCED
        parallaxRate: 0.015, // Drastically reduced from 0.08
        waveAmplitudeChange: 0.2, // Reduced from 0.6 to 0.2 (80% less effect)
        scrollDampingFactor: 0.8, // Strong damping on scroll movements
        
        // Performance optimizations
        enableAnimation: true,
        useTranslucent: true,
        reduceOnMobile: true,
        waveSegment: 20,
        animationFrameSkip: 1,
        
        // Colors
        lightTheme: {
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            elementColor: 'rgba(55, 100, 247, '
        },
        darkTheme: {
            backgroundColor: 'rgba(8, 8, 12, 0.96)',
            elementColor: 'rgba(140, 180, 255, '
        }
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) {
        console.warn('Flow canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d', { alpha: config.useTranslucent });
    let width, height;
    let waves = [];
    let particles = [];
    let animationFrameId;
    let time = 0;
    let frameCount = 0;
    let lastScrollY = window.scrollY;
    let scrollProgress = 0;
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;
    let lastScrollTime = 0; // Track last scroll time for debouncing

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
            config.waveSets.forEach(set => {
                set.count = Math.max(1, Math.floor(set.count / 2));
            });
            config.particleCount = 25;
            config.waveSegment = 30;
        }
    }

    /**
     * Initialize canvas size and recreate elements
     */
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        adjustConfig();
        initWaves();
        initParticles();
    }

    /**
     * Create waves from configuration
     */
    function initWaves() {
        waves = [];
        
        // Create waves for each set
        config.waveSets.forEach(waveSet => {
            for (let i = 0; i < waveSet.count; i++) {
                // Calculate vertical position (evenly distributed)
                const position = waveSet.minY + (waveSet.maxY - waveSet.minY) * (i / Math.max(1, waveSet.count - 1));
                
                // Store original position for reference to prevent drift
                const originalY = height * position;
                
                waves.push({
                    baseY: originalY,
                    originalY: originalY, // Keep track of original position
                    amplitude: waveSet.baseAmplitude,
                    period: waveSet.period + (Math.random() * 50 - 25), // Slight variation
                    phase: Math.random() * Math.PI * 2,
                    speed: waveSet.speed + (Math.random() * waveSet.speedVariation),
                    width: waveSet.width,
                    opacity: waveSet.opacity,
                    setIndex: i
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
        
        // Calculate amplitude with minimal scroll effect
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
        // Sort waves by y-position
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
     * Update scroll position with minimized effect
     */
    function updateScrollPosition(scrollY) {
        // Calculate scroll progress (0 to 1)
        const docHeight = Math.max(
            document.body.scrollHeight, 
            document.documentElement.scrollHeight
        ) - window.innerHeight;
        
        // Get scroll progress between 0 and 1
        scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
        
        // Debounce rapid scrolling - only apply effect if it's been a while since last scroll
        const now = Date.now();
        if (now - lastScrollTime < 100) {
            // Skip rapid scroll events
            lastScrollY = scrollY;
            return;
        }
        lastScrollTime = now;
        
        // Calculate scroll difference
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Skip tiny movements
        if (Math.abs(deltaY) < 2) return;
        
        // Gradually restore waves to their original positions
        waves.forEach(wave => {
            // Apply extremely minimal parallax
            const dampedDelta = deltaY * config.parallaxRate * config.scrollDampingFactor;
            wave.baseY -= dampedDelta;
            
            // Gradually drift back to original position (key fix for bunching)
            const distanceFromOriginal = wave.baseY - wave.originalY;
            if (Math.abs(distanceFromOriginal) > 5) {
                wave.baseY -= distanceFromOriginal * 0.05; // 5% correction per frame
            }
        });
        
        // Apply even smaller effect to particles
        particles.forEach(particle => {
            particle.y -= deltaY * config.parallaxRate * 0.2; // Significantly reduced effect
        });
    }

    /**
     * Handle scroll events - with debouncing
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
     * Periodically reset waves to original positions
     */
    function setupWavePositionReset() {
        // Gently reset waves to original positions every 8 seconds
        setInterval(() => {
            let needsReset = false;
            
            // Check if any wave is far from its original position
            waves.forEach(wave => {
                if (Math.abs(wave.baseY - wave.originalY) > height * 0.15) {
                    needsReset = true;
                }
            });
            
            if (needsReset) {
                // Gently move waves back to original positions
                waves.forEach(wave => {
                    // Animate back to original position over next few frames
                    wave.baseY = wave.baseY * 0.8 + wave.originalY * 0.2;
                });
            }
        }, 2000);
    }
    
    /**
     * Exposed method for other scripts
     */
    window.syncFlowingDataWithScroll = function(scrollY) {
        updateScrollPosition(scrollY || window.scrollY);
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
        
        // Gently correct wave positions on each frame
        waves.forEach(wave => {
            // Small, gradual correction toward original position
            const distanceFromOriginal = wave.baseY - wave.originalY;
            if (Math.abs(distanceFromOriginal) > 2) {
                wave.baseY -= distanceFromOriginal * 0.02; // Very small correction per frame
            }
        });
        
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
     * Handle visibility change
     */
    function handleVisibilityChange() {
        config.enableAnimation = document.visibilityState === 'visible';
        
        // Reset wave positions when visibility changes
        if (document.visibilityState === 'visible') {
            // Gently reset waves to original positions
            waves.forEach(wave => {
                wave.baseY = wave.originalY;
            });
        }
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

        // Setup gentle wave position correction
        setupWavePositionReset();
        
        // Add event listeners
        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 200);
        }, { passive: true });
        
        // Use a debounced scroll listener to reduce impact
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 50); // Debounced scroll handling
        }, { passive: true });
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Listen for section changes with reduced effect
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail && typeof e.detail.index !== 'undefined') {
                // Reset waves to original positions on section change instead of parallax
                waves.forEach(wave => {
                    // Gently return to original position
                    wave.baseY = wave.baseY * 0.5 + wave.originalY * 0.5;
                });
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
