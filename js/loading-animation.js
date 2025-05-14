/**
 * loading-animation.js - Enhanced version
 * MP logo loading animation with forced minimum duration
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing enhanced loading animation...');
  
  // DOM Elements
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const mPath = document.getElementById('m-path');
  const pPath = document.getElementById('p-path');
  const glowEffect = document.getElementById('glow-effect');
  const particlesCanvas = document.getElementById('loading-particles-canvas');
  const body = document.body;
  
  // Animation variables
  let animationProgress = 0;
  let animationDuration = 3000; // 3 seconds minimum duration (previously 4000)
  let animationStartTime;
  let loadingComplete = false;
  let skipEnabled = false;
  let isSkipping = false;
  let ctx;
  let forceMinimumDuration = true; // Force minimum animation duration
  let minAnimationTime = 2500; // Minimum of 2.5 seconds
  let animationStartedAt = Date.now();
  
  // Block scrolling immediately during loading
  body.classList.add('loading');
  
  // Check if site assets are already cached
  const hasVisitedBefore = localStorage.getItem('has-visited') === 'true';
  
  // Reduce animation time if site is cached or returning visitor
  if (hasVisitedBefore) {
    animationDuration = 3000; // Still show for 3 seconds (instead of 2500)
    minAnimationTime = 2000; // Minimum of 2 seconds for returning visitors
  }
  
  // Initialize particles animation on canvas
  function initParticles() {
    if (!particlesCanvas) {
      console.warn('Particles canvas not found');
      return;
    }
    
    ctx = particlesCanvas.getContext('2d');
    
    // Set canvas size
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    
    // Create particles
    let particles = [];
    const particleCount = 100;
    
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
    
    // Animate particles function
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
    
    // Start animation
    animateParticles();
  }
  
  // Enable loading screen skip functionality
  function enableSkipping() {
    if (skipEnabled) return;
    
    skipEnabled = true;
    
    // Add clickable class for visual feedback
    if (loadingScreen) {
      loadingScreen.classList.add('clickable');
      
      // Add click event listener to loading screen
      loadingScreen.addEventListener('click', handleSkip);
      
      // Add accessibility message
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
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event) {
    // Allow skipping with Escape key
    if (event.key === 'Escape' && skipEnabled && !isSkipping) {
      handleSkip();
    }
  }
  
  // Handle window resize for particles
  function handleResize() {
    if (!particlesCanvas || !ctx) return;
    
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  
  // Accelerate to completion (used when already close to finished)
  function accelerateAnimation() {
    // Add class to speed up all transitions
    loadingScreen.classList.add('accelerate-animation');
    
    // Force all animations to completion
    if (mPath) mPath.style.strokeDashoffset = '0';
    if (pPath) pPath.style.strokeDashoffset = '0';
    if (loadingBar) loadingBar.style.width = '100%';
    
    // Enhance glow effect
    if (mPath && pPath) {
      mPath.style.stroke = '#4a6cf7';
      pPath.style.stroke = '#4a6cf7';
      mPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
      pPath.style.filter = 'drop-shadow(0 0 25px rgba(74, 108, 247, 0.7))';
    }
    
    // Expand glow
    if (glowEffect) {
      glowEffect.style.background = 'radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0) 70%)';
      glowEffect.style.opacity = '0.7';
      glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
    }
    
    // Complete shortly after transitions would finish
    setTimeout(completeLoading, 400);
  }
  
  // Skip animation more abruptly (used when early in animation)
  function skipAnimation() {
    // Skip to completion slightly faster
    setTimeout(completeLoading, 200);
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
    if (loadingBar) {
      loadingBar.style.width = `${animationProgress * 100}%`;
    }
    
    // Animate M letter (starts at 10% progress)
    if (mPath && animationProgress > 0.1) {
      const mProgress = Math.min(1, (animationProgress - 0.1) / 0.4);
      mPath.style.strokeDashoffset = 1000 - (mProgress * 1000);
    }
    
    // Animate P letter (starts at 50% progress)
    if (pPath && animationProgress > 0.5) {
      const pProgress = Math.min(1, (animationProgress - 0.5) / 0.3);
      pPath.style.strokeDashoffset = 1000 - (pProgress * 1000);
    }
    
    // Glow effect (starts at 80% progress)
    if (glowEffect && animationProgress > 0.8) {
      const glowProgress = (animationProgress - 0.8) / 0.2;
      const glowIntensity = Math.min(25, 5 + glowProgress * 100);
      
      // Update MP letter glow
      if (mPath && pPath) {
        mPath.style.stroke = '#4a6cf7';
        pPath.style.stroke = '#4a6cf7';
        mPath.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(74, 108, 247, 0.7))`;
        pPath.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(74, 108, 247, 0.7))`;
      }
      
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
      // Check if we should continue animating
      requestAnimationFrame(updateLoadingAnimation);
    } else {
      // Check if we should honor minimum duration
      const now = Date.now();
      const animationElapsed = now - animationStartedAt;
      
      if (forceMinimumDuration && animationElapsed < minAnimationTime) {
        // Continue animation until minimum time is reached
        const delayRemaining = minAnimationTime - animationElapsed;
        console.log(`Enforcing minimum animation time (${delayRemaining}ms remaining)`);
        
        // Hold at completed state
        if (loadingBar) loadingBar.style.width = '100%';
        if (mPath) mPath.style.strokeDashoffset = '0';
        if (pPath) pPath.style.strokeDashoffset = '0';
        
        // Complete after enforced delay
        setTimeout(() => {
          completeLoading();
        }, delayRemaining);
      } else {
        // Proceed to completion
        completeLoading();
      }
    }
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
      try {
        window.initBackgroundAnimation();
      } catch (error) {
        console.error('Error initializing background animation:', error);
      }
    }
    
    // Let the glow effect expand fully
    setTimeout(() => {
      // Keep loading screen visible with a smooth fade-out
      if (loadingScreen) {
        loadingScreen.style.transition = 'opacity 1s ease-out';
        loadingScreen.style.opacity = '0';
      }
      
      // Remove loading class from body to allow scrolling
      body.classList.remove('loading');
      
      // Add loaded class to body
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
  
  // Check if resources are loaded
  function checkResourcesLoaded() {
    // Ensure animation lasts at least the minimum duration, even if resources load quickly
    forceMinimumDuration = true;
  }
  
  // Start initialization
  animationStartedAt = Date.now();
  initParticles();
  checkResourcesLoaded();
  requestAnimationFrame(updateLoadingAnimation);
  
  // Add event listeners
  window.addEventListener('resize', handleResize);
});
