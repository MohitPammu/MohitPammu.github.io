/**
 * loading-animation.js
 * MP logo loading animation with particles, progress bar, and glow effects
 * Includes clickable loading screen with intelligent skip behavior
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
  const body = document.body;
  
  // Add loading class to body to prevent scrolling
  body.classList.add('loading');
  
  // Animation variables
  let animationProgress = 0;
  let animationDuration = 4000; // 4 seconds for loading sequence
  let animationStartTime;
  let loadingComplete = false;
  let skipEnabled = false;
  let isSkipping = false;
  
  // Particles animation variables
  let particles = [];
  const particleCount = 100;
  let ctx;
  
  // Check if site assets are already cached
  const hasVisitedBefore = localStorage.getItem('has-visited') === 'true';
  
  // Reduce animation time if site is cached or returning visitor
  if (hasVisitedBefore) {
    animationDuration = 2500; // Faster loading animation for returning visitors
  }
  
  // Track if user has manually skipped before
  const hasSkippedBefore = localStorage.getItem('has-skipped') === 'true';
  if (hasSkippedBefore) {
    animationDuration = 2000; // Even faster for users who skipped before
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
    
    // Enable skipping after a short delay (prevent accidental skips)
    if (animationProgress > 0.1 && !skipEnabled) {
      enableSkipping();
    }
    
    // Continue or finish
    if (animationProgress < 1 && !isSkipping) {
      requestAnimationFrame(updateLoadingAnimation);
    } else {
      completeLoading();
    }
  }
  
  // Enable loading screen skip functionality
  function enableSkipping() {
    if (skipEnabled) return;
    
    skipEnabled = true;
    
    // Add clickable class for visual feedback (subtle hover effect)
    if (loadingScreen) {
      loadingScreen.classList.add('clickable');
      
      // Add click event listener to loading screen
      loadingScreen.addEventListener('click', handleSkip);
      
      // Add accessibility message (screen reader only)
      const skipMessage = document.createElement('div');
      skipMessage.className = 'skip-message';
      skipMessage.setAttribute('aria-live', 'polite');
      skipMessage.textContent = 'Click anywhere to skip animation';
      loadingScreen.appendChild(skipMessage);
    }
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', handleKeyDown);
  }
  
  // Handle skip action
  function handleSkip(event) {
    // Don't process if already skipping or not enabled
    if (isSkipping || !skipEnabled) return;
    
    isSkipping = true;
    
    // Add ripple effect from click point
    if (event && event.type === 'click') {
      createRipple(event);
    }
    
    // Different behavior based on current progress
    if (animationProgress > 0.75) {
      // If almost done, accelerate to completion
      accelerateAnimation();
    } else {
      // If early in animation, skip more abruptly
      skipAnimation();
    }
    
    // Mark as having skipped for future visits
    localStorage.setItem('has-skipped', 'true');
  }
  
  // Create ripple effect from click point
  function createRipple(event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Position ripple at click coordinates
    const rect = loadingScreen.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    loadingScreen.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event) {
    // Allow skipping with Escape key
    if (event.key === 'Escape' && skipEnabled && !isSkipping) {
      handleSkip();
    }
  }
  
  // Accelerate to completion (used when already close to finished)
  function accelerateAnimation() {
    // Add class to speed up all transitions
    loadingScreen.classList.add('accelerate-animation');
    
    // Force all animations to completion
    mPath.style.strokeDashoffset = '0';
    pPath.style.strokeDashoffset = '0';
    loadingBar.style.width = '100%';
    
    // Enhance glow effect
    mPath.style.stroke = '#4a6cf7';
    pPath.style.stroke = '#4a6cf7';
    mPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    pPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    
    // Expand glow
    glowEffect.style.background = 'radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0) 70%)';
    glowEffect.style.opacity = '0.7';
    glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
    
    // Complete shortly after transitions would finish
    setTimeout(completeLoading, 400);
  }
  
  // Skip animation more abruptly (used when early in animation)
  function skipAnimation() {
    // Skip to completion slightly faster
    setTimeout(completeLoading, 200);
  }
  
  // Complete loading animation
  function completeLoading() {
    if (loadingComplete) return; // Prevent multiple calls
    loadingComplete = true;
    
    // Clean up event listeners
    if (loadingScreen) {
      loadingScreen.removeEventListener('click', handleSkip);
    }
    document.removeEventListener('keydown', handleKeyDown);
    
    // Set as visited for future visits
    localStorage.setItem('has-visited', 'true');
    
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
    }, isSkipping ? 400 : 800); // Shorter delay if skipped
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
  
  // Handle reduced motion preference
  function checkReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Significantly reduce animation duration for accessibility
      animationDuration = 1500;
    }
  }
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  
  // Start initialization
  checkReducedMotion();
  initParticles();
  checkResourcesLoaded();
  requestAnimationFrame(updateLoadingAnimation);
});

  
  // Enable loading screen skip functionality
  function enableSkipping() {
    if (skipEnabled) return;
    
    skipEnabled = true;
    
    // Add clickable class for visual feedback (subtle hover effect)
    if (loadingScreen) {
      loadingScreen.classList.add('clickable');
      
      // Add click event listener to loading screen
      loadingScreen.addEventListener('click', handleSkip);
      
      // Add accessibility message (screen reader only)
      const skipMessage = document.createElement('div');
      skipMessage.className = 'skip-message';
      skipMessage.setAttribute('aria-live', 'polite');
      skipMessage.textContent = 'Click anywhere to skip animation';
      loadingScreen.appendChild(skipMessage);
    }
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', handleKeyDown);
  }
  
  // Handle skip action
  function handleSkip(event) {
    // Don't process if already skipping or not enabled
    if (isSkipping || !skipEnabled) return;
    
    isSkipping = true;
    
    // Add ripple effect from click point
    if (event && event.type === 'click') {
      createRipple(event);
    }
    
    // Different behavior based on current progress
    if (animationProgress > 0.75) {
      // If almost done, accelerate to completion
      accelerateAnimation();
    } else {
      // If early in animation, skip more abruptly
      skipAnimation();
    }
    
    // Mark as having skipped for future visits
    localStorage.setItem('has-skipped', 'true');
  }
  
  // Create ripple effect from click point
  function createRipple(event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Position ripple at click coordinates
    const rect = loadingScreen.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    loadingScreen.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event) {
    // Allow skipping with Escape key
    if (event.key === 'Escape' && skipEnabled && !isSkipping) {
      handleSkip();
    }
  }
  
  // Accelerate to completion (used when already close to finished)
  function accelerateAnimation() {
    // Add class to speed up all transitions
    loadingScreen.classList.add('accelerate-animation');
    
    // Force all animations to completion
    mPath.style.strokeDashoffset = '0';
    pPath.style.strokeDashoffset = '0';
    loadingBar.style.width = '100%';
    
    // Enhance glow effect
    mPath.style.stroke = '#4a6cf7';
    pPath.style.stroke = '#4a6cf7';
    mPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    pPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    
    // Expand glow
    glowEffect.style.background = 'radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0) 70%)';
    glowEffect.style.opacity = '0.7';
    glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
    
    // Complete shortly after transitions would finish
    setTimeout(completeLoading, 400);
  }
  
  // Skip animation more abruptly (used when early in animation)
  function skipAnimation() {
    // Skip to completion slightly faster
    setTimeout(completeLoading, 200);
  }
  
  // Complete loading animation
  function completeLoading() {
    if (loadingComplete) return; // Prevent multiple calls
    loadingComplete = true;
    
    // Clean up event listeners
    if (loadingScreen) {
      loadingScreen.removeEventListener('click', handleSkip);
    }
    document.removeEventListener('keydown', handleKeyDown);
    
    // Set as visited for future visits
    localStorage.setItem('has-visited', 'true');
    
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
    }, isSkipping ? 400 : 800); // Shorter delay if skipped
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
  
  // Handle reduced motion preference
  function checkReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Significantly reduce animation duration for accessibility
      animationDuration = 1500;
    }
  }
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  
  // Start initialization
  checkReducedMotion();
  initParticles();
  checkResourcesLoaded();
  requestAnimationFrame(updateLoadingAnimation);
});
 70%)`;
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
