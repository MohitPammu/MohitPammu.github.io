// Optimized Background Animation with Zoom Effect
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    let animationFrameId;
    let isVisible = true;
    let lastScrollY = 0;
    let zoomFactor = 1;
    
    // Simplified configuration
    const config = {
        particleCount: window.innerWidth < 768 ? 40 : 70,
        particleOpacity: { min: 0.2, max: 0.6 },
        particleSize: { min: 1, max: 3 },
        lineOpacity: 0.05,
        lineThreshold: 150,
        zoomIntensity: 0.0005, // Controls zoom intensity when scrolling
        isDarkTheme: document.documentElement.getAttribute('data-theme') === 'dark'
    };
    
    // Colors for particles and background
    const colors = {
        light: {
            particle: 'rgba(74, 108, 247, ', // Primary color
            background: 'rgba(255, 255, 255, 0.02)'
        },
        dark: {
            particle: 'rgba(109, 141, 250, ', // Dark theme primary color
            background: 'rgba(18, 18, 18, 0.02)'
        }
    };
    
    // Initialize canvas size
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Reinitialize particles
        initParticles();
    }
    
    // Create particles
    function initParticles() {
        particles = [];
        
        for (let i = 0; i < config.particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseX: Math.random() * width, // Original position for zoom
                baseY: Math.random() * height, // Original position for zoom
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                size: config.particleSize.min + Math.random() * 
                      (config.particleSize.max - config.particleSize.min),
                opacity: config.particleOpacity.min + Math.random() * 
                         (config.particleOpacity.max - config.particleOpacity.min)
            });
        }
    }
    
    // Update particle positions
    function updateParticles() {
        particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Update base position too
            particle.baseX += particle.speedX;
            particle.baseY += particle.speedY;
            
            if (particle.baseX < 0) particle.baseX = width;
            if (particle.baseX > width) particle.baseX = 0;
            if (particle.baseY < 0) particle.baseY = height;
            if (particle.baseY > height) particle.baseY = 0;
        });
    }
    
    // Synchronize with scroll position
    window.syncBackgroundWithScroll = function(scrollY) {
        // Get scroll difference
        const scrollDiff = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Update zoom factor - slowly zoom in as user scrolls down
        zoomFactor = 1 + (scrollY * config.zoomIntensity);
        
        // Apply to particles
        applyZoomEffect();
    };
    
    // Apply zoom effect to particles
    function applyZoomEffect() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        particles.forEach(particle => {
            // Calculate vector from center to base position
            const dx = particle.baseX - centerX;
            const dy = particle.baseY - centerY;
            
            // Apply zoom
            particle.x = centerX + dx * zoomFactor;
            particle.y = centerY + dy * zoomFactor;
        });
    }
    
    // Draw particles and connections
    function drawParticles() {
        // Get colors based on theme
        const themeColors = config.isDarkTheme ? colors.dark : colors.light;
        
        // Apply semi-transparent background for trail effect
        ctx.fillStyle = themeColors.background;
        ctx.fillRect(0, 0, width, height);
        
        // Draw particles
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `${themeColors.particle}${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections between nearby particles - limit for performance
        for (let i = 0; i < particles.length; i++) {
            // Only check every other particle for connections to improve performance
            if (i % 2 !== 0) continue;
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.lineThreshold) {
                    // Calculate opacity based on distance
                    const opacity = (1 - distance / config.lineThreshold) * config.lineOpacity;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `${themeColors.particle}${opacity})`;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Main animation loop
    function animate() {
        if (isVisible) {
            updateParticles();
            drawParticles();
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    function init() {
        // Initial theme check
        config.isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        
        resizeCanvas();
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 200);
        }, { passive: true });
        
        // Handle visibility changes to save resources
        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
        });
        
        // Handle theme changes
        const themeObserver = new MutationObserver(() => {
            config.isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        });
        
        themeObserver.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
        
        // Initial scroll sync
        window.addEventListener('scroll', () => {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    window.syncBackgroundWithScroll(window.scrollY);
                });
            } else {
                window.syncBackgroundWithScroll(window.scrollY);
            }
        }, { passive: true });
    }
    
    // Start animation
    init();
});
