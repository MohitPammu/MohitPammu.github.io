/**
 * loading-animation.js
 * MP logo loading animation with particles, progress bar, and glow effects
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing loading animation...');
  
  // DOM Elements
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const mPath = document.getElementById('m-path');
  const pPath = document.getElementById('p-path');
  const glowEffect = document.getElementById('glow-effect');
  const particlesCanvas = document.getElementById('loading-particles-canvas');
  const skipButton = document.getElementById('skip-loading-btn');
  const body = document.body;
  
  // Add loading class to body to prevent scrolling
  body.classList.add('loading');
  
  // Fade in skip button after a delay
  setTimeout(() => {
    if (skipButton) skipButton.classList.add('visible');
  }, 1500);
  
  // Animation variables
  let animationProgress = 0;
  let animationDuration = 4000; // 4 seconds for loading sequence
  let animationStartTime;
  let loadingComplete = false;
  
  // Particles animation variables
  let particles = [];
  const particleCount = 100;
  let ctx;
  
  // Check if site assets are already cached
  const isCached = sessionStorage.getItem('site-cached') === 'true';
  
  // Reduce animation time if site is cached
  if (isCached) {
    animationDuration = 2500; // Faster loading animation for returning visitors
  }
  
  // Initialize particles animation on canvas
  function initParticles() {
    if (!particlesCanvas) return;
    
    ctx = particlesCanvas.getContext('2d');
    
    // Set canvas size
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    
    // Create particles
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height,
        size: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: 0.1 + Math.random() * 0.5
      });
    }
    
    // Start animation
    animateParticles();
  }
  
  // Animate particles
  function animateParticles() {
    if (!ctx || loadingComplete) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
      
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap particles around edges
      if (particle.x < 0) particle.x = particlesCanvas.width;
      if (particle.x > particlesCanvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = particlesCanvas.height;
      if (particle.y > particlesCanvas.height) particle.y = 0;
    });
    
    // Continue animation
    if (!loadingComplete) {
      requestAnimationFrame(animateParticles);
    }
  }
  
  // Handle window resize for particles
  function handleResize() {
    if (!particlesCanvas || !ctx) return;
    
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  
  // Update loading animation
  function updateLoadingAnimation(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp;
    }
    
    // Calculate progress (0 to 1)
    const elapsed = timestamp - animationStartTime;
    animationProgress = Math.min(1, elapsed / animationDuration);
    
    // Update loading bar width
    loadingBar.style.width = `${animationProgress * 100}%`;
    
    // Animate M letter (starts at 10% progress)
    if (animationProgress > 0.1) {
      const mProgress = Math.min(1, (animationProgress - 0.1) / 0.4);
      mPath.style.strokeDashoffset = 1000 - (mProgress * 1000);
    }
    
    // Animate P letter (starts at 50% progress)
    if (animationProgress > 0.5) {
      const pProgress = Math.min(1, (animationProgress - 0.5) / 0.3);
      pPath.style.strokeDashoffset = 1000 - (pProgress * 1000);
    }
    
    // Glow effect (starts at 80% progress)
    if (animationProgress > 0.8) {
      const glowProgress = (animationProgress - 0.8) / 0.2; // 0-1 scale for final 20%
      const glowIntensity = Math.min(25, 5 + glowProgress * 100);
      
      // Update MP letter glow
      mPath.style.stroke = '#4a6cf7';
      pPath.style.stroke = '#4a6cf7';
      mPath.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(74, 108, 247, 0.7))`;
      pPath.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(74, 108, 247, 0.7))`;
      
      // Update radial glow effect
      glowEffect.style.background = `radial-gradient(circle, rgba(74, 108, 247, ${0.1 * glowProgress}) 0%, rgba(74, 108, 247, 0) 70%)`;
      glowEffect.style.opacity = glowProgress;
      
      // At full completion, animate the glow expansion
      if (animationProgress >= 0.99) {
        glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
        glowEffect.style.opacity = '0.7';
      }
    }
    
    // Continue or finish
    if (animationProgress < 1) {
      requestAnimationFrame(updateLoadingAnimation);
    } else {
      completeLoading();
    }
  }
  
  // Complete loading animation
  function completeLoading() {
    loadingComplete = true;
    
    // Set site as cached for future visits
    sessionStorage.setItem('site-cached', 'true');
    
    // Initialize background animation first (if the function exists)
    if (typeof window.initBackgroundAnimation === 'function') {
      window.initBackgroundAnimation();
    }
    
    // Let the glow effect expand fully
    setTimeout(() => {
      // Remove loading class from body to allow scrolling
      body.classList.remove('loading');
      
      // Add loaded class to body to fade out loading screen
      body.classList.add('loaded');
      
      // Hide loading screen after fade out completes
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }, 1000);
      
      // Dispatch custom event to signal loading complete
      document.dispatchEvent(new CustomEvent('loadingComplete'));
    }, 800);
  }
  
  // Skip loading animation
  function skipLoading() {
    // Force animation to complete
    animationProgress = 1;
    
    // Update visual elements to their final state
    loadingBar.style.width = '100%';
    mPath.style.strokeDashoffset = '0';
    pPath.style.strokeDashoffset = '0';
    mPath.style.stroke = '#4a6cf7';
    pPath.style.stroke = '#4a6cf7';
    mPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    pPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    glowEffect.style.background = 'radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0) 70%)';
    glowEffect.style.opacity = '0.7';
    glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
    
    // Complete loading
    completeLoading();
  }
  
  // Check if site-resources are loaded
  function checkResourcesLoaded() {
    // Use performance API to check if critical resources are loaded
    if (window.performance) {
      const resources = performance.getEntriesByType('resource');
      const loadTimes = resources.map(resource => resource.responseEnd);
      
      // If we have resources and they've all loaded
      if (loadTimes.length > 0 && Math.max(...loadTimes) < 1000) {
        // All resources loaded relatively quickly, reduce animation time
        animationDuration = Math.min(animationDuration, 2500);
      }
    }
  }
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  if (skipButton) {
    skipButton.addEventListener('click', skipLoading);
  }
  
  // Start initialization
  initParticles();
  checkResourcesLoaded();
  requestAnimationFrame(updateLoadingAnimation);
});
