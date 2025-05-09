// Flowing Data Background - Data Science Portfolio
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        // Wave configuration
        waveSets: [
            // Primary waves - large gentle flows
            {
                count: 5,
                minY: 0.2,
                maxY: 0.8,
                opacity: 0.12,
                width: 1,
                amplitude: 70,
                period: 300,
                speed: 0.0001,
                speedVariation: 0.00003
            },
            // Secondary waves - medium frequency detail
            {
                count: 8,
                minY: 0.1,
                maxY: 0.9,
                opacity: 0.08,
                width: 0.7,
                amplitude: 40,
                period: 180,
                speed: 0.00015,
                speedVariation: 0.00005
            },
            // Detail waves - high frequency detail
            {
                count: 12,
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
        
        // Particle configuration
        particleCount: 120,       // Number of particles
        particleMinSize: 0.4,     // Minimum particle size
        particleMaxSize: 1.2,     // Maximum particle size
        particleMinSpeed: 0.1,    // Minimum particle speed
        particleMaxSpeed: 0.4,    // Maximum particle speed
        particleOpacity: 0.6,     // Particle opacity
        particleFadeDistance: 50, // Distance over which particles fade in
        
        // Interaction
        parallaxRate: 0.15,       // Parallax effect strength
        
        // Performance
        enableAnimation: true,    // Enable/disable animation
        throttleScroll: true      // Throttle scroll events
    };

    // Canvas setup
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return; // Exit if canvas element not found
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let waves = [];
    let particles = [];
    let animationFrameId;
    let time = 0;
    let lastScrollY = 0;
    let isScrolling = false;
    let scrollTimeout;

    // Initialize canvas size
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Recreate waves and particles
        initWaves();
        initParticles();
    }

    // Create a wave
    function createWave(config, index, total) {
        // Calculate vertical position based on min/max range
        const position = config.minY + (config.maxY - config.minY) * (index / Math.max(1, total - 1));
        const yBase = height * position;
        
        // Add slight randomness to make waves more natural
        const randomOffset = (Math.random() * 0.1 - 0.05) * height;
        
        return {
            baseY: yBase + randomOffset,
            amplitude: config.amplitude * (0.8 + Math.random() * 0.4), // Slight amplitude variation
            period: config.period * (0.9 + Math.random() * 0.2),       // Slight period variation
            phase: Math.random() * Math.PI * 2,                        // Random starting phase
            speed: config.speed + (Math.random() * config.speedVariation * 2 - config.speedVariation), // Speed variation
            width: config.width * (0.8 + Math.random() * 0.4),         // Width variation
            opacity: config.opacity * (0.8 + Math.random() * 0.4)      // Opacity variation
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
                    setOpacity: waveSet.opacity, // Store original set opacity for reference
                    setWidth: waveSet.width      // Store original set width for reference
                });
            }
        });
    }

    // Create a particle
    function createParticle(randomY = true) {
        // Random position - either all over screen or just at bottom
        const x = Math.random() * width;
        const y = randomY ? Math.random() * height : height + Math.random() * 20;
        
        // Random size - biased toward smaller
        const size = Math.random() < 0.8 ? 
                     config.particleMinSize + Math.random() * 0.3 : 
                     config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize);
        
        // Random speed - biased toward average
        const speed = config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed);
        
        // Random opacity - centered on config value with variation
        const opacity = config.particleOpacity * (0.7 + Math.random() * 0.6);
        
        // Random horizontal drift factor
        const drift = Math.random() * 0.4 - 0.2;
        
        return { x, y, size, speed, opacity, drift };
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(createParticle(true));
        }
    }

    // Draw a single wave
    function drawWave(wave) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`;
        ctx.lineWidth = wave.width;
        
        // Start offscreen to prevent edge visibility
        let startX = -100;
        const segment = 10; // Smaller segments for smoother waves
        
        // Calculate initial y position with multiple frequencies for complexity
        let startY = wave.baseY + 
                    Math.sin(startX * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude + 
                    Math.sin(startX * (1/wave.period) * 2 + wave.phase * 1.5 + time * wave.speed * 1.3) * (wave.amplitude * 0.4) +
                    Math.sin(startX * (1/wave.period) * 0.5 + wave.phase * 0.7 + time * wave.speed * 0.7) * (wave.amplitude * 0.2);
        
        ctx.moveTo(startX, startY);
        
        // Draw wave from left to right
        for (let x = startX + segment; x <= width + 100; x += segment) {
            // Composite sine wave with three frequencies for complex, natural look
            const y = wave.baseY + 
                      Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude + 
                      Math.sin(x * (1/wave.period) * 2 + wave.phase * 1.5 + time * wave.speed * 1.3) * (wave.amplitude * 0.4) +
                      Math.sin(x * (1/wave.period) * 0.5 + wave.phase * 0.7 + time * wave.speed * 0.7) * (wave.amplitude * 0.2);
            
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    }

    // Draw all waves
    function drawWaves() {
        // Sort waves by baseY to create proper layering
        const sortedWaves = [...waves].sort((a, b) => a.baseY - b.baseY);
        
        // Draw waves from back to front
        sortedWaves.forEach(wave => drawWave(wave));
    }

    // Update particle positions
    function updateParticles() {
        particles.forEach(particle => {
            // Move upward with slight horizontal drift
            particle.y -= particle.speed;
            particle.x += Math.sin(particle.y * 0.01 + time * 0.001) * particle.drift;
            
            // Reset particles that move off screen
            if (particle.y < -20) {
                const newParticle = createParticle(false);
                particle.x = newParticle.x;
                particle.y = newParticle.y;
                particle.drift = newParticle.drift;
                // Keep same size and speed for better performance
            }
        });
    }

    // Draw particles with fade in at bottom
    function drawParticles() {
        particles.forEach(particle => {
            // Calculate opacity with fade in effect at bottom
            let finalOpacity = particle.opacity;
            
            // Fade in particles near the bottom of the screen
            if (particle.y > height - config.particleFadeDistance) {
                const fadeRatio = (height - particle.y) / config.particleFadeDistance;
                finalOpacity = particle.opacity * fadeRatio;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.fill();
        });
    }

    // Apply parallax effect on scroll
    function applyParallax(scrollY) {
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Parallax effect for waves - each set moves at different rate
        waves.forEach((wave, index) => {
            // Calculate parallax factor based on wave's vertical position
            // Waves higher in the screen move faster
            const relativePosition = wave.baseY / height;
            const parallaxFactor = config.parallaxRate * (1.2 - relativePosition);
            
            wave.baseY -= deltaY * parallaxFactor;
            
            // Reset waves that move too far off screen
            if (wave.baseY < -wave.amplitude * 2) {
                wave.baseY = height + wave.amplitude * 2;
            } else if (wave.baseY > height + wave.amplitude * 2) {
                wave.baseY = -wave.amplitude * 2;
            }
        });
        
        // Boost particle speed temporarily after scrolling
        const scrollFactor = Math.min(Math.abs(deltaY) * 0.01, 0.5);
        particles.forEach(particle => {
            particle.y -= deltaY * config.parallaxRate * 0.3;
        });
    }

    // Handle scroll events with throttling
    function handleScroll() {
        if (config.throttleScroll && isScrolling) return;
        
        isScrolling = true;
        applyParallax(window.scrollY);
        
        // Reset throttle after a frame
        requestAnimationFrame(() => {
            isScrolling = false;
        });
        
        // Final update after scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            applyParallax(window.scrollY);
        }, 50);
    }

    // Main render loop
    function render() {
        // Clear canvas
        ctx.fillStyle = '#0a0a14'; // Set to match your dark theme
        ctx.fillRect(0, 0, width, height);
        
        // Update time
        if (config.enableAnimation) {
            time += 1;
        }
        
        // Update and draw elements
        drawWaves();
        if (config.enableAnimation) {
            updateParticles();
        }
        drawParticles();
        
        // Request next frame
        animationFrameId = requestAnimationFrame(render);
    }

    // Handle visibility change
    function handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            config.enableAnimation = false;
        } else {
            config.enableAnimation = true;
        }
    }

    // Initialize the visualization
    function init() {
        resizeCanvas();
        
        // Start rendering
        render();
        
        // Add event listeners
        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Start initialization
    init();
});
