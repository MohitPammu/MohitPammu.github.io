/**
 * flowing-data-svg.js - Optimized Version
 * SVG-based background with reliable initialization and performance optimizations
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Ready to initialize SVG background when needed');
  
  // Configuration - Optimized for performance
  const config = {
    // Wave configuration
    waveSets: [
      // Primary waves
      {
        count: 2, // Reduced count
        minY: 0.3,
        maxY: 0.7,
        opacity: 0.15, 
        width: 1.2,
        baseAmplitude: 35, // Reduced amplitude
        period: 350,
        speed: 0.00004, // Slower for better performance
        speedVariation: 0.00001
      },
      // Secondary waves
      {
        count: 3, // Reduced count
        minY: 0.2,
        maxY: 0.8,
        opacity: 0.10,
        width: 0.8,
        baseAmplitude: 20, // Reduced amplitude
        period: 200,
        speed: 0.00006,
        speedVariation: 0.00002
      }
    ],
    
    // Particle configuration
    particleCount: 35, // Reduced count for better performance
    particleMinSize: 1.0,     
    particleMaxSize: 2.0,     
    particleMinSpeed: 0.02, // Slower movement
    particleMaxSpeed: 0.06,
    particleOpacity: 0.65,
    
    // Scroll effects - Very subtle
    parallaxRate: 0.004,
    scrollDampingFactor: 0.96,
    
    // Performance settings
    fpsLimit: 24, // Lower FPS for better performance
    reduceOnMobile: true,
    
    // Colors - Will be retrieved from CSS variables
    lightTheme: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      elementColor: 'rgba(55, 100, 247, '
    },
    darkTheme: {
      backgroundColor: 'rgba(12, 12, 18, 0.96)',
      elementColor: 'rgba(140, 180, 255, '
    }
  };
  
  // State variables
  let container, svg, bgRect, wavesGroup, particlesGroup;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let time = 0;
  let scrollY = window.scrollY || 0;
  let waves = [];
  let particles = [];
  let animationFrameId;
  let initialized = false;
  let lastFrameTime = 0;
  let frameInterval = 1000 / config.fpsLimit;
  
  // Setup SVG container
  function setupSVGContainer() {
    // Find or create container
    container = document.querySelector('.parallax-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'parallax-container';
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Create SVG element
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'background-svg';
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    container.appendChild(svg);
    
    // Create background rectangle
    bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.id = 'bg-rect';
    svg.appendChild(bgRect);
    
    // Create groups for waves and particles
    wavesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wavesGroup.id = 'waves-group';
    svg.appendChild(wavesGroup);
    
    particlesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    particlesGroup.id = 'particles-group';
    svg.appendChild(particlesGroup);
  }
  
  // Adjust config for mobile devices
  function adjustConfig() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && config.reduceOnMobile) {
      // Further reduce elements on mobile
      config.waveSets.forEach(set => {
        set.count = Math.max(1, Math.floor(set.count / 2));
      });
      config.particleCount = 20;
      config.fpsLimit = 20; // Lower FPS on mobile
      frameInterval = 1000 / config.fpsLimit;
    } else {
      frameInterval = 1000 / config.fpsLimit;
    }
  }
  
  // Get theme colors
  function getThemeColors() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    return currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
  }
  
  // Create waves
  function createWaves() {
    waves = [];
    
    // Clear existing waves
    while (wavesGroup.firstChild) {
      wavesGroup.removeChild(wavesGroup.firstChild);
    }
    
    const themeColors = getThemeColors();
    
    // Create waves for each set
    config.waveSets.forEach((waveSet, setIndex) => {
      for (let i = 0; i < waveSet.count; i++) {
        // Calculate vertical position
        const position = waveSet.minY + (waveSet.maxY - waveSet.minY) * (i / Math.max(1, waveSet.count - 1));
        
        // Create wave data
        const wave = {
          baseY: height * position,
          originalY: height * position,
          amplitude: waveSet.baseAmplitude,
          period: waveSet.period + (Math.random() * 50 - 25),
          phase: Math.random() * Math.PI * 2,
          speed: waveSet.speed + (Math.random() * waveSet.speedVariation),
          width: waveSet.width,
          opacity: waveSet.opacity
        };
        
        waves.push(wave);
        
        // Create SVG path
        const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        wavePath.setAttribute('fill', 'none');
        wavePath.setAttribute('stroke', themeColors.elementColor + wave.opacity + ')');
        wavePath.setAttribute('stroke-width', wave.width);
        wavePath.setAttribute('d', generateWavePath(wave));
        wavePath.id = `wave-${setIndex}-${i}`;
        wavePath.classList.add('wave-path');
        
        // Add fade-in animation
        wavePath.style.opacity = '0';
        wavePath.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          wavePath.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
          wavePath.style.opacity = '1';
          wavePath.style.transform = 'translateY(0)';
        }, 50 + i * 100 + setIndex * 200);
        
        wavesGroup.appendChild(wavePath);
      }
    });
  }
  
  // Create particles
  function createParticles() {
    particles = [];
    
    // Clear existing particles
    while (particlesGroup.firstChild) {
      particlesGroup.removeChild(particlesGroup.firstChild);
    }
    
    const themeColors = getThemeColors();
    
    for (let i = 0; i < config.particleCount; i++) {
      const particle = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize),
        speed: config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed),
        opacity: config.particleOpacity * (0.7 + Math.random() * 0.3),
        drift: (Math.random() - 0.5) * 0.15
      };
      
      particles.push(particle);
      
      // Create SVG circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', particle.x);
      circle.setAttribute('cy', particle.y);
      circle.setAttribute('r', particle.size);
      circle.setAttribute('fill', themeColors.elementColor + particle.opacity + ')');
      circle.id = `particle-${i}`;
      circle.classList.add('particle');
      
      // Add fade-in animation
      circle.style.opacity = '0';
      
      setTimeout(() => {
        circle.style.transition = 'opacity 1s ease-out';
        circle.style.opacity = '1';
      }, 500 + i * 15);
      
      particlesGroup.appendChild(circle);
    }
  }
  
  // Generate wave path
  function generateWavePath(wave) {
    const segments = 20;
    const segmentWidth = width / segments;
    
    // Start path
    let path = `M -100 ${wave.baseY}`;
    
    // Generate points
    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const y = wave.baseY + Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude;
      path += ` L ${x} ${y}`;
    }
    
    // Complete path
    path += ` L ${width + 100} ${wave.baseY}`;
    
    return path;
  }
  
  // Update waves
  function updateWaves() {
    waves.forEach((wave, index) => {
      // Get wave path element
      const waveId = `wave-${Math.floor(index / Math.max(1, config.waveSets[0].count))}-${index % Math.max(1, config.waveSets[0].count)}`;
      const wavePath = document.getElementById(waveId);
      
      if (!wavePath) return;
      
      // Update path
      wavePath.setAttribute('d', generateWavePath(wave));
    });
  }
  
  // Update particles
  function updateParticles() {
    particles.forEach((particle, index) => {
      const circle = document.getElementById(`particle-${index}`);
      if (!circle) return;
      
      // Move particle
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
      
      // Update position
      circle.setAttribute('cx', particle.x);
      circle.setAttribute('cy', particle.y);
    });
  }
  
  // Main animation loop with FPS limiting
  function animate(timestamp) {
    // Limit frame rate for performance
    if (timestamp - lastFrameTime < frameInterval) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }
    
    // Update frame time
    lastFrameTime = timestamp;
    
    // Update time counter
    time += 0.5;
    
    // Update waves and particles
    updateWaves();
    updateParticles();
    
    // Continue animation
    animationFrameId = requestAnimationFrame(animate);
  }
  
 // Update theme (continued)
  function updateTheme() {
    const themeColors = getThemeColors();
    
    // Update background
    if (bgRect) {
      bgRect.setAttribute('fill', themeColors.backgroundColor);
    }
    
    // Update wave colors
    waves.forEach((wave, index) => {
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
  }
  
  // Handle window resize
  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    adjustConfig();
    createWaves();
    createParticles();
  }
  
  // Handle scroll - using requestAnimationFrame for smoothness
  function handleScroll() {
    // This function is intentionally minimal to avoid performance issues
    // Just update scrollY which will be used in the next animation frame
    scrollY = window.scrollY;
  }
  
  // Public synchronization method for other scripts
  function syncWithScroll(newScrollY) {
    if (typeof newScrollY === 'number') {
      scrollY = newScrollY;
    }
  }
  
  // Initialize background animation
  function initBackgroundAnimation() {
    if (initialized) return;
    
    console.log('Initializing background animation');
    
    // Setup container and elements
    setupSVGContainer();
    
    // Set background color
    const themeColors = getThemeColors();
    if (bgRect) {
      bgRect.setAttribute('fill', themeColors.backgroundColor);
    }
    
    // Create waves and particles
    adjustConfig();
    createWaves();
    createParticles();
    
    // Add event listeners
    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(handleResize, 200);
    }, { passive: true });
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Watch for theme changes
    document.addEventListener('themeChanged', updateTheme);
    
    // Start animation
    lastFrameTime = 0;
    animationFrameId = requestAnimationFrame(animate);
    
    initialized = true;
  }
  
  // Cleanup function for potential re-initialization
  function cleanup() {
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
  }
  
  // Expose global methods
  window.initBackgroundAnimation = initBackgroundAnimation;
  window.syncFlowingDataWithScroll = syncWithScroll;
});
