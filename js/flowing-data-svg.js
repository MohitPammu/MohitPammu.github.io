/**
 * flowing-data-svg.js
 * SVG-based background with waves and particles for smooth parallax effect
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing SVG-based flowing data background...');

  // Configuration
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
    particleMinSpeed: 0.05,
    particleMaxSpeed: 0.13,
    particleOpacity: 0.75,
    particleFadeDistance: 50,
    
    // Progressive wave amplification
    minAmplitude: 0.5,
    maxAmplitude: 2.0,
    
    // Scroll effects
    parallaxRate: 0.015,
    scrollDampingFactor: 0.8,
    
    // Performance optimizations
    reduceOnMobile: true,
    waveSegment: 20,
    
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

  // State variables
  let container, svg, bgRect, wavesGroup, particlesGroup;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let time = 0;
  let scrollY = window.scrollY || 0;
  let lastScrollY = scrollY;
  let scrollProgress = 0;
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  let isMobile = window.innerWidth < 768;
  let waves = [];
  let particles = [];
  let animationFrameId;
  let initialized = false;
  let themeColors;
  
  // Initialize SVG container
function setupSVGContainer() {
  // Find container
  container = document.querySelector('.parallax-container');
  if (!container) {
    console.warn('Parallax container not found, creating one');
    container = document.createElement('div');
    container.className = 'parallax-container';
    document.body.insertBefore(container, document.body.firstChild);
  }
  
  // Get or create SVG
  svg = document.getElementById('background-svg');
  if (!svg) {
    // If SVG doesn't exist, create it
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'background-svg';
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    container.appendChild(svg);
  }
  
  // Get or create background rect
  bgRect = document.getElementById('bg-rect');
  if (!bgRect) {
    bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.id = 'bg-rect';
    svg.appendChild(bgRect);
  }
  
  // Get or create group for waves
  wavesGroup = document.getElementById('waves-group');
  if (!wavesGroup) {
    wavesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wavesGroup.id = 'waves-group';
    svg.appendChild(wavesGroup);
  } else {
    // Clear existing waves
    while (wavesGroup.firstChild) {
      wavesGroup.removeChild(wavesGroup.firstChild);
    }
  }
  
  // Get or create group for particles
  particlesGroup = document.getElementById('particles-group');
  if (!particlesGroup) {
    particlesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    particlesGroup.id = 'particles-group';
    svg.appendChild(particlesGroup);
  } else {
    // Clear existing particles
    while (particlesGroup.firstChild) {
      particlesGroup.removeChild(particlesGroup.firstChild);
    }
  }
}
  
  /**
   * Adjust configuration based on device
   */
  function adjustConfig() {
    isMobile = window.innerWidth < 768;
    
    if (isMobile && config.reduceOnMobile) {
      // Reduce elements on mobile for performance
      config.waveSets.forEach(set => {
        set.count = Math.max(1, Math.floor(set.count / 2));
      });
      config.particleCount = 25;
      config.waveSegment = 30;
    }
  }
  
  /**
   * Get theme colors based on current theme
   */
  function getThemeColors() {
    return currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
  }
  
  /**
   * Update theme colors and state
   */
  function updateTheme() {
    const bodyTheme = document.body.getAttribute('data-theme');
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    currentTheme = bodyTheme || htmlTheme || 'light';
    themeColors = getThemeColors();
    
    // Update background color
    if (bgRect) {
      bgRect.setAttribute('fill', themeColors.backgroundColor);
    }
    
    // Update wave colors
    const waveElements = document.querySelectorAll('.wave-path');
    waveElements.forEach((wave, index) => {
      if (index < waves.length) {
        wave.setAttribute('stroke', themeColors.elementColor + waves[index].opacity + ')');
      }
    });
    
    // Update particle colors
    const particleElements = document.querySelectorAll('.particle');
    particleElements.forEach((particle, index) => {
      if (index < particles.length) {
        particle.setAttribute('fill', themeColors.elementColor + particles[index].opacity + ')');
      }
    });
  }
  
  /**
   * Generate SVG path data for a wave
   */
  function generateWavePath(wave) {
    const segmentWidth = width / config.waveSegment;
    
    // Calculate amplitude based on scroll position
    // This creates the progressive wave amplification as user scrolls
    const amplitudeMultiplier = config.minAmplitude + 
        (config.maxAmplitude - config.minAmplitude) * scrollProgress;
    
    const adjustedAmplitude = wave.amplitude * amplitudeMultiplier;
    
    // Start path before the left edge for smooth edges
    let path = `M -100 ${wave.baseY}`;
    
    // Generate points along the path
    for (let i = 0; i <= config.waveSegment; i++) {
      const x = i * segmentWidth;
      const y = wave.baseY + 
          Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * adjustedAmplitude;
      
      path += ` L ${x} ${y}`;
    }
    
    // Complete the path beyond the right edge
    path += ` L ${width + 100} ${wave.baseY}`;
    
    return path;
  }
  
  /**
   * Create waves from configuration
   */
  function createWaves() {
    waves = [];
    
    // Clear existing waves
    while (wavesGroup.firstChild) {
      wavesGroup.removeChild(wavesGroup.firstChild);
    }
    
    // Create waves for each set
    config.waveSets.forEach((waveSet, setIndex) => {
      for (let i = 0; i < waveSet.count; i++) {
        // Calculate vertical position (evenly distributed)
        const position = waveSet.minY + (waveSet.maxY - waveSet.minY) * (i / Math.max(1, waveSet.count - 1));
        
        // Store original position for reference to prevent drift
        const originalY = height * position;
        
        // Create the wave data
        const wave = {
          baseY: originalY,
          originalY: originalY, 
          amplitude: waveSet.baseAmplitude,
          period: waveSet.period + (Math.random() * 50 - 25), // Slight variation
          phase: Math.random() * Math.PI * 2,
          speed: waveSet.speed + (Math.random() * waveSet.speedVariation),
          width: waveSet.width,
          opacity: waveSet.opacity,
          setIndex: i
        };
        
        waves.push(wave);
        
        // Create SVG path for this wave
        const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        wavePath.setAttribute('fill', 'none');
        wavePath.setAttribute('stroke', themeColors.elementColor + wave.opacity + ')');
        wavePath.setAttribute('stroke-width', wave.width);
        wavePath.setAttribute('d', generateWavePath(wave));
        wavePath.id = `wave-${setIndex}-${i}`;
        wavePath.classList.add('wave-path');
        
        // Add animation for initial appearance
        if (!initialized) {
          wavePath.style.opacity = '0';
          wavePath.style.transform = 'translateY(30px)';
          setTimeout(() => {
            wavePath.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            wavePath.style.opacity = '1';
            wavePath.style.transform = 'translateY(0)';
          }, i * 100);
        }
        
        wavesGroup.appendChild(wavePath);
      }
    });
  }
  
  /**
   * Create particles
   */
  function createParticles() {
    particles = [];
    
    // Clear existing particles
    while (particlesGroup.firstChild) {
      particlesGroup.removeChild(particlesGroup.firstChild);
    }
    
    const count = isMobile ? Math.floor(config.particleCount * 0.6) : config.particleCount;
    
    for (let i = 0; i < count; i++) {
      const particle = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize),
        speed: config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed),
        opacity: config.particleOpacity * (0.7 + Math.random() * 0.3),
        drift: (Math.random() - 0.5) * 0.2 // Slight horizontal drift
      };
      
      particles.push(particle);
      
      // Create SVG circle for this particle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', particle.x);
      circle.setAttribute('cy', particle.y);
      circle.setAttribute('r', particle.size);
      circle.setAttribute('fill', themeColors.elementColor + particle.opacity + ')');
      circle.id = `particle-${i}`;
      circle.classList.add('particle');
      
      // Add animation for initial appearance
      if (!initialized) {
        circle.style.opacity = '0';
        setTimeout(() => {
          circle.style.transition = 'opacity 1s ease-out';
          circle.style.opacity = '1';
        }, i * 20 + 500);
      }
      
      particlesGroup.appendChild(circle);
    }
  }
  
  /**
   * Update wave positions and paths
   */
  function updateWaves() {
    waves.forEach((wave, index) => {
      // Find the wave element by index
      const waveId = `wave-${Math.floor(index / config.waveSets[0].count)}-${index % config.waveSets[0].count}`;
      const wavePath = document.getElementById(waveId);
      
      if (!wavePath) return;
      
      // Update the path
      wavePath.setAttribute('d', generateWavePath(wave));
      
      // Gradually restore waves to their original positions
      const distanceFromOriginal = wave.baseY - wave.originalY;
      if (Math.abs(distanceFromOriginal) > 5) {
        wave.baseY -= distanceFromOriginal * 0.05; // 5% correction per frame
      }
    });
  }
  
  /**
   * Update particle positions
   */
  function updateParticles() {
    particles.forEach((particle, index) => {
      const circle = document.getElementById(`particle-${index}`);
      if (!circle) return;
      
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
      
      // Calculate final opacity (fade near bottom edge)
      let finalOpacity = particle.opacity;
      if (particle.y > height - config.particleFadeDistance) {
        finalOpacity *= (height - particle.y) / config.particleFadeDistance;
      }
      
      // Update SVG element
      circle.setAttribute('cx', particle.x);
      circle.setAttribute('cy', particle.y);
      
      // Only update opacity if it changed significantly (performance optimization)
      const currentOpacity = parseFloat(circle.getAttribute('opacity') || particle.opacity);
      if (Math.abs(currentOpacity - finalOpacity) > 0.05) {
        circle.setAttribute('fill', themeColors.elementColor + finalOpacity + ')');
      }
    });
  }
  
  /**
   * Update scroll position with progressive wave amplification
   */
  function updateScrollPosition(newScrollY) {
    // Calculate scroll progress (0 to 1)
    const docHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    ) - window.innerHeight;
    
    // Get scroll progress between 0 and 1
    scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, newScrollY / docHeight)) : 0;
    
    // Calculate scroll difference
    const deltaY = newScrollY - lastScrollY;
    lastScrollY = newScrollY;
    
    // Skip tiny movements
    if (Math.abs(deltaY) < 2) return;
    
    // Apply parallax to waves
    waves.forEach(wave => {
      // Apply extremely minimal parallax
      const dampedDelta = deltaY * config.parallaxRate * config.scrollDampingFactor;
      wave.baseY -= dampedDelta;
    });
    
    // Apply even smaller effect to particles
    particles.forEach((particle, index) => {
      const circle = document.getElementById(`particle-${index}`);
      if (!circle) return;
      
      particle.y -= deltaY * config.parallaxRate * 0.2; // Significantly reduced effect
      circle.setAttribute('cy', particle.y);
    });
  }
  
  /**
   * Main animation loop
   */
  function animate() {
    // Update time
    time += 1;
    
    // Update wave animations
    updateWaves();
    
    // Update particle animations
    updateParticles();
    
    // Request next frame
    animationFrameId = requestAnimationFrame(animate);
  }
  
  /**
   * Handle window resize
   */
  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    adjustConfig();
    
    // Preserve animation state during resize
    const wasInitialized = initialized;
    initialized = true; // Prevent entrance animations on resize
    
    // Recreate waves and particles
    createWaves();
    createParticles();
    
    // Restore initialized state
    initialized = wasInitialized;
  }
  
  /**
   * Handle scroll events with debouncing
   */
  function handleScroll() {
    // Debounce scroll handling
    requestAnimationFrame(() => {
      // Regular scroll
      updateScrollPosition(window.scrollY);
    });
  }
  
  /**
   * Handle visibility change
   */
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // Reset wave positions when becoming visible again
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
  function initBackgroundAnimation() {
    if (initialized) return; // Prevent double initialization
    
    console.log('Initializing SVG background animation');
    
    // Setup container and SVG elements
    setupSVGContainer();
    
    // Set initial theme colors
    themeColors = getThemeColors();
    if (bgRect) {
      bgRect.setAttribute('fill', themeColors.backgroundColor);
    }
    
    adjustConfig();
    createWaves();
    createParticles();
    watchThemeChanges();
    
    // Start animation
    if (!animationFrameId) {
      animate();
    }
    
    // Add event listeners
    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(handleResize, 200);
    }, { passive: true });
    
    // Use a debounced scroll listener to reduce impact
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 30); // Debounced scroll handling
    }, { passive: true });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle theme toggle
    const themeToggle = document.querySelector('.theme-switcher');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(updateTheme, 50);
      });
    }
    
    initialized = true;
  }
  
  // Expose global method for initialization
  window.initBackgroundAnimation = initBackgroundAnimation;
  
  // Expose a global method for other scripts to sync with scroll
  window.syncFlowingDataWithScroll = function(newScrollY) {
    updateScrollPosition(newScrollY || window.scrollY);
  };
  
  // Listen for loading complete event to auto-initialize
  document.addEventListener('loadingComplete', () => {
    // Slight delay to ensure smooth transition from loading screen
    setTimeout(initBackgroundAnimation, 300);
  });
  
  // Set background color even before full initialization
  themeColors = getThemeColors();
  
  // Attempt auto-initialization if page appears to be already loaded
  if (document.readyState === 'complete') {
    setTimeout(initBackgroundAnimation, 500);
  }
});
