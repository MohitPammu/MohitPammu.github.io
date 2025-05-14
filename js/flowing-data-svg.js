/**
 * flowing-data-svg.js
 * SVG-based background with reliable initialization and smooth animations
 * Resolves conflicts with other background animation methods
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing SVG background animation with fixed initialization...');

  // Configuration - Optimized for performance and visual appeal
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
        baseAmplitude: 40, // Reduced for better performance
        period: 350,
        speed: 0.00005, // Slower for smoother appearance
        speedVariation: 0.00001
      },
      // Secondary waves
      {
        count: 4,
        minY: 0.2,
        maxY: 0.8,
        opacity: 0.10,
        width: 0.8,
        baseAmplitude: 25, // Reduced amplitude
        period: 200,
        speed: 0.00007,
        speedVariation: 0.00002
      }
    ],
    
    // Particle configuration
    particleCount: 45,
    particleMinSize: 1.0,     
    particleMaxSize: 2.5,     
    particleMinSpeed: 0.03, // Slower for smoother movement
    particleMaxSpeed: 0.08,
    particleOpacity: 0.75,
    particleFadeDistance: 50,
    
    // Scroll effects - Very gentle
    parallaxRate: 0.005, // Extremely gentle parallax
    scrollDampingFactor: 0.95, // Strong damping
    
    // Inertia settings for smoother transitions
    useInertia: true,
    inertiaFactor: 0.95,
    scrollLerpFactor: 0.08,
    
    // Performance optimizations
    reduceOnMobile: true,
    waveSegment: 20,
    fpsLimit: 30, // Limit FPS for better performance
    
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
  let targetScrollY = scrollY;
  let lastScrollY = scrollY;
  let scrollVelocity = 0;
  let scrollProgress = 0;
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  let isMobile = window.innerWidth < 768;
  let waves = [];
  let particles = [];
  let animationFrameId;
  let initialized = false;
  let themeColors;
  let lastFrameTime = 0;
  let frameInterval = 1000 / config.fpsLimit;
  
  // Initialize SVG container
  function setupSVGContainer() {
    try {
      // Remove any existing canvas implementation
      const existingCanvas = document.getElementById('flow-canvas');
      if (existingCanvas) {
        console.log('Removing old canvas implementation');
        existingCanvas.remove();
      }
    
      // Find or create container
      container = document.querySelector('.parallax-container');
      if (!container) {
        console.log('Creating new parallax container');
        container = document.createElement('div');
        container.className = 'parallax-container';
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        console.log('Using existing parallax container');
      }
      
      // Get or create SVG element
      svg = document.getElementById('background-svg');
      if (!svg) {
        console.log('Creating new SVG element');
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'background-svg';
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        container.appendChild(svg);
      } else {
        console.log('Using existing SVG element');
      }
      
      // Clear existing SVG content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      
      // Create background rect
      bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('width', '100%');
      bgRect.setAttribute('height', '100%');
      bgRect.setAttribute('x', '0');
      bgRect.setAttribute('y', '0');
      bgRect.id = 'bg-rect';
      svg.appendChild(bgRect);
      
      // Create group for waves
      wavesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wavesGroup.id = 'waves-group';
      svg.appendChild(wavesGroup);
      
      // Create group for particles
      particlesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      particlesGroup.id = 'particles-group';
      svg.appendChild(particlesGroup);
      
      return true;
    } catch (error) {
      console.error('Error setting up SVG container:', error);
      return false;
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
      config.fpsLimit = 24;
      frameInterval = 1000 / config.fpsLimit;
    } else {
      // Reset to default values for desktop
      frameInterval = 1000 / config.fpsLimit;
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
    try {
      const bodyTheme = document.body.getAttribute('data-theme');
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      currentTheme = bodyTheme || htmlTheme || 'light';
      themeColors = getThemeColors();
      
      // Update background color
      if (bgRect) {
        bgRect.setAttribute('fill', themeColors.backgroundColor);
      }
      
      // Update wave colors
      waves.forEach((wave, index) => {
        // Find wave element by ID
        const waveId = `wave-${Math.floor(index / Math.max(1, config.waveSets[0].count))}-${index % Math.max(1, config.waveSets[0].count)}`;
        const wavePath = document.getElementById(waveId);
        if (wavePath) {
          wavePath.setAttribute('stroke', themeColors.elementColor + wave.opacity + ')');
        }
      });
      
      // Update particle colors
      particles.forEach((particle, index) => {
        const circle = document.getElementById(`particle-${index}`);
        if (circle) {
          circle.setAttribute('fill', themeColors.elementColor + particle.opacity + ')');
        }
      });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }
  
  /**
   * Generate SVG path data for a wave
   */
  function generateWavePath(wave) {
    try {
      const segmentWidth = width / config.waveSegment;
      
      // Calculate amplitude multiplier based on scroll position
      const scrollFactor = 1 + (scrollProgress - 0.5) * 0.2; // Significantly reduced effect
      const adjustedAmplitude = wave.amplitude * scrollFactor;
      
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
    } catch (error) {
      console.error('Error generating wave path:', error);
      // Return fallback path
      return `M 0 ${wave.baseY} L ${width} ${wave.baseY}`;
    }
  }
  
  /**
   * Create waves from configuration
   */
  function createWaves() {
    try {
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
            setIndex: i,
            targetY: originalY
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
            wavePath.style.transform = 'translateY(20px)';
            setTimeout(() => {
              wavePath.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
              wavePath.style.opacity = '1';
              wavePath.style.transform = 'translateY(0)';
            }, i * 100);
          }
          
          wavesGroup.appendChild(wavePath);
        }
      });
    } catch (error) {
      console.error('Error creating waves:', error);
    }
  }
  
  /**
   * Create particles
   */
  function createParticles() {
    try {
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
          drift: (Math.random() - 0.5) * 0.2,
          targetY: 0
        };
        
        // Set initial target
        particle.targetY = particle.y;
        
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
          }, i * 15 + 300);
        }
        
        particlesGroup.appendChild(circle);
      }
    } catch (error) {
      console.error('Error creating particles:', error);
    }
  }
  
  /**
   * Update wave positions and paths
   */
  function updateWaves() {
    try {
      waves.forEach((wave, index) => {
        // Find the wave element by index
        const waveId = `wave-${Math.floor(index / Math.max(1, config.waveSets[0].count))}-${index % Math.max(1, config.waveSets[0].count)}`;
        const wavePath = document.getElementById(waveId);
        
        if (!wavePath) return;
        
        // Smooth transition to target position (LERP)
        if (config.useInertia && Math.abs(wave.baseY - wave.targetY) > 0.1) {
          wave.baseY += (wave.targetY - wave.baseY) * 0.1;
        }
        
        // Gradually restore waves to their original positions (anti-drift)
        const distanceFromOriginal = wave.targetY - wave.originalY;
        if (Math.abs(distanceFromOriginal) > 2) {
          // Gentle restoration - 1% correction per frame
          wave.targetY -= distanceFromOriginal * 0.01;
        }
        
        // Update the path
        wavePath.setAttribute('d', generateWavePath(wave));
      });
    } catch (error) {
      console.error('Error updating waves:', error);
    }
  }
  
  /**
   * Update particle positions with smooth transitions
   */
  function updateParticles() {
    try {
      particles.forEach((particle, index) => {
        const circle = document.getElementById(`particle-${index}`);
        if (!circle) return;
        
        // Apply smooth transition to target position (if using inertia)
        if (config.useInertia && Math.abs(particle.y - particle.targetY) > 0.1) {
          particle.y += (particle.targetY - particle.y) * 0.1;
        }
        
        // Move upward with minimal drift
        particle.targetY -= particle.speed;
        particle.x += particle.drift;
        
        // Reset particles that move off screen
        if (particle.targetY < -20) {
          particle.targetY = height + 10;
          particle.y = height + 10; // Instant reset
          particle.x = Math.random() * width;
        }
        
        // Wrap horizontally 
        if (particle.x < -20) particle.x = width + 10;
        if (particle.x > width + 20) particle.x = -10;
        
        // Update SVG element
        circle.setAttribute('cx', particle.x);
        circle.setAttribute('cy', particle.y);
      });
    } catch (error) {
      console.error('Error updating particles:', error);
    }
  }
  
  /**
   * Update scroll position with gentle parallax effect
   */
  function updateScrollPosition(newScrollY) {
    try {
      // Update target scroll position
      targetScrollY = newScrollY;
      
      // Calculate scroll velocity with damping
      scrollVelocity = (targetScrollY - scrollY) * config.scrollDampingFactor;
      
      // Apply smooth interpolation (LERP)
      if (config.useInertia) {
        scrollY += (targetScrollY - scrollY) * config.scrollLerpFactor;
      } else {
        scrollY = targetScrollY;
      }
      
      // Calculate scroll progress (0 to 1)
      const docHeight = Math.max(
          document.body.scrollHeight, 
          document.documentElement.scrollHeight
      ) - window.innerHeight;
      
      scrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      
      // Apply very gentle parallax to waves
      waves.forEach(wave => {
        // Minimal parallax effect
        const dampedVelocity = scrollVelocity * config.parallaxRate;
        wave.targetY -= dampedVelocity;
      });
      
      // Apply even gentler effect to particles
      particles.forEach(particle => {
        particle.targetY -= scrollVelocity * config.parallaxRate * 0.1;
      });
      
      // Update last scroll position
      lastScrollY = scrollY;
    } catch (error) {
      console.error('Error updating scroll position:', error);
    }
  }
  
  /**
   * Main animation loop with FPS limiting
   */
  function animate(timestamp) {
    try {
      // Limit frame rate for performance
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // Track frame time
      lastFrameTime = timestamp;
      
      // Update time counter (slower for smoother movement)
      time += 0.5;
      
      // Update wave animations
      updateWaves();
      
      // Update particle animations
      updateParticles();
      
      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Error in animation loop:', error);
      // Continue animation despite errors
      animationFrameId = requestAnimationFrame(animate);
    }
  }
  
  /**
   * Handle window resize
   */
  function handleResize() {
    try {
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
    } catch (error) {
      console.error('Error handling resize:', error);
    }
  }
  
  /**
   * Handle scroll events with debouncing
   */
  function handleScroll() {
    // Use requestAnimationFrame for smoother handling
    requestAnimationFrame(() => {
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
        wave.targetY = wave.originalY;
        wave.baseY = wave.originalY;
      });
      
      // Reset smooth scroll variables
      scrollY = window.scrollY;
      targetScrollY = scrollY;
      scrollVelocity = 0;
    }
  }
  
  /**
   * Watch for theme changes
   */
  function watchThemeChanges() {
    try {
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
    } catch (error) {
      console.error('Error setting up theme observer:', error);
    }
  }
  
  /**
   * Initialize the visualization
   */
  function initBackgroundAnimation() {
    if (initialized) {
      console.log('Background animation already initialized, skipping');
      return; // Prevent double initialization
    }
    
    try {
      console.log('Initializing background animation');
      
      // Setup container and SVG elements
      if (!setupSVGContainer()) {
        console.error('Failed to setup SVG container, aborting initialization');
        return;
      }
      
      // Set initial theme colors
      themeColors = getThemeColors();
      if (bgRect) {
        bgRect.setAttribute('fill', themeColors.backgroundColor);
      }
      
      adjustConfig();
      createWaves();
      createParticles();
      watchThemeChanges();
      
      // Initialize smooth scroll variables
      scrollY = window.scrollY;
      targetScrollY = scrollY;
      lastScrollY = scrollY;
      
      // Start animation
      if (!animationFrameId) {
        lastFrameTime = 0;
        animationFrameId = requestAnimationFrame(animate);
      }
      
      // Add event listeners
      window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(handleResize, 200);
      }, { passive: true });
      
      // Use a more responsive scroll listener for smoother scrolling
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Handle theme toggle
      const themeToggle = document.querySelector('.theme-switcher');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          setTimeout(updateTheme, 50);
        });
      }
      
      initialized = true;
      console.log('Background animation initialized successfully');
    } catch (error) {
      console.error('Error initializing background animation:', error);
      
      // Try fallback to canvas if available
      try {
        if (typeof initFlowingCanvas === 'function') {
          console.log('Attempting fallback to canvas background');
          initFlowingCanvas();
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }
  
  // Clean up any existing animation before reinitializing
  function cleanup() {
    try {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      if (wavesGroup) {
        while (wavesGroup.firstChild) {
          wavesGroup.removeChild(wavesGroup.firstChild);
        }
      }
      
      if (particlesGroup) {
        while (particlesGroup.firstChild) {
          particlesGroup.removeChild(particlesGroup.firstChild);
        }
      }
      
      waves = [];
      particles = [];
      initialized = false;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  
  // Expose global method for initialization
  window.initBackgroundAnimation = function() {
    // Clean up first if already initialized
    if (initialized) {
      cleanup();
    }
    
    // Initialize with new instances
    initBackgroundAnimation();
  };
  
  // Expose a global method for other scripts to sync with scroll
  window.syncFlowingDataWithScroll = function(newScrollY) {
    if (initialized) {
      updateScrollPosition(newScrollY || window.scrollY);
    }
  };
  
  // Listen for loading complete event to auto-initialize
  document.addEventListener('loadingComplete', () => {
    // Slight delay to ensure smooth transition from loading screen
    setTimeout(() => {
      if (!initialized) {
        initBackgroundAnimation();
      }
    }, 300);
  });
  
  // Set background color even before full initialization
  themeColors = getThemeColors();
  
  // Attempt auto-initialization if loading animation didn't trigger
  if (document.readyState === 'complete') {
    setTimeout(() => {
      if (!initialized) {
        console.log('Page already loaded, initializing background directly');
        initBackgroundAnimation();
      }
    }, 500);
  }
});
