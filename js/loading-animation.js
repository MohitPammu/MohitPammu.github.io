/**
 * loading-animation.js - Fixed Version
 * MP logo loading animation with reliable completion logic
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing loading animation with fixed completion logic...');
  
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
  let animationDuration = 3000; // 3 seconds default duration
  let animationStartTime;
  let loadingComplete = false;
  let skipEnabled = false;
  let isSkipping = false;
  let ctx;
  let minAnimationTime = 2000; // Minimum duration
  let animationStartedAt = Date.now();
  let resourcesReady = false;
  let pageLoaded = false;
  
  // Block scrolling during loading
  body.classList.add('loading');
  
  // Check if site assets are already cached
  const hasVisitedBefore = localStorage.getItem('has-visited') === 'true';
  
  // Reduce animation time for returning visitors
  if (hasVisitedBefore) {
    animationDuration = 2500;
    minAnimationTime = 1500;
  }

  // Initialize particles animation
  function initParticles() {
    if (!particlesCanvas) {
      console.warn('Particles canvas not found');
      return;
    }
    
    try {
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
    } catch (error) {
      console.error('Error initializing particles:', error);
      // Continue with loading even if particles fail
    }
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
    }
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', handleKeyDown);
  }
  
  // Handle skip action
  function handleSkip() {
    // Don't process if already skipping or not enabled
    if (isSkipping || !skipEnabled) return;
    
    isSkipping = true;
    
    // Skip to completion immediately
    skipAnimation();
    
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
  
  // Handle window resize
  function handleResize() {
    if (!particlesCanvas || !ctx) return;
    
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  
  // Skip animation immediately
  function skipAnimation() {
    // Force all animations to completion
    if (loadingBar) loadingBar.style.width = '100%';
    if (mPath) mPath.style.strokeDashoffset = '0';
    if (pPath) pPath.style.strokeDashoffset = '0';
    
    // Add class to speed up all transitions
    if (loadingScreen) loadingScreen.classList.add('accelerate-animation');
    
    // Complete soon
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
    
    // Update loading bar
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
      
      // Update MP letter glow
      if (mPath && pPath) {
        mPath.style.stroke = '#4a6cf7';
        pPath.style.stroke = '#4a6cf7';
        mPath.style.filter = `drop-shadow(0 0 ${10 + glowProgress * 15}px rgba(74, 108, 247, 0.7))`;
        pPath.style.filter = `drop-shadow(0 0 ${10 + glowProgress * 15}px rgba(74, 108, 247, 0.7))`;
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
    
    // Enable skipping after a short delay
    if (animationProgress > 0.2 && !skipEnabled) {
      enableSkipping();
    }
    
    // Check if all resources are loaded
    if (!resourcesReady && document.readyState === 'complete') {
      resourcesReady = true;
      console.log('All resources loaded');
    }
    
    // Continue or finish animation
    if (animationProgress < 1 && !isSkipping) {
      requestAnimationFrame(updateLoadingAnimation);
    } else {
      // Ensure minimum animation time
      const now = Date.now();
      const animationElapsed = now - animationStartedAt;
      
      if (animationElapsed < minAnimationTime && !isSkipping) {
        // Continue animation until minimum time is reached
        const delayRemaining = minAnimationTime - animationElapsed;
        console.log(`Waiting for minimum animation time: ${delayRemaining}ms remaining`);
        
        // Hold at completed state
        if (loadingBar) loadingBar.style.width = '100%';
        if (mPath) mPath.style.strokeDashoffset = '0';
        if (pPath) pPath.style.strokeDashoffset = '0';
        
        // Complete after enforced delay
        setTimeout(completeLoading, delayRemaining);
      } else {
        // Check if page resources are ready before completing
        if (resourcesReady || document.readyState === 'complete' || isSkipping) {
          completeLoading();
        } else {
          // Wait for resources to load
          console.log('Waiting for resources to load...');
          document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete' && !loadingComplete) {
              resourcesReady = true;
              completeLoading();
            }
          });
        }
      }
    }
  }
  
  // Complete loading animation
  function completeLoading() {
    if (loadingComplete) return; // Prevent multiple calls
    loadingComplete = true;
    
    console.log('Animation complete, transitioning to main content');
    
    // Clean up event listeners
    if (loadingScreen) {
      loadingScreen.removeEventListener('click', handleSkip);
    }
    document.removeEventListener('keydown', handleKeyDown);
    
    // Set as visited for future visits
    localStorage.setItem('has-visited', 'true');
    
    // Initialize background animation
    if (typeof window.initBackgroundAnimation === 'function') {
      try {
        window.initBackgroundAnimation();
      } catch (error) {
        console.error('Error initializing background animation:', error);
      }
    } else {
      console.warn('Background animation function not found');
    }
    
    // Smooth transition to main content
    setTimeout(() => {
      // Remove loading class from body to allow scrolling
      body.classList.remove('loading');
      
      // Add loaded class to body
      body.classList.add('loaded');
      
      // Fade out loading screen
      if (loadingScreen) {
        loadingScreen.style.transition = 'opacity 1s ease-out';
        loadingScreen.style.opacity = '0';
      }
      
      // Hide loading screen after fade out completes
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('loadingComplete'));
        
        // Trigger any deferred content initialization
        onPageFullyLoaded();
      }, 1000);
    }, isSkipping ? 200 : 500);
  }
  
  // Function that runs when the page is fully loaded
  function onPageFullyLoaded() {
    if (pageLoaded) return;
    pageLoaded = true;
    
    // Ensure body has loaded class
    if (!body.classList.contains('loaded')) {
      body.classList.add('loaded');
    }
    
    // Initialize any additional scripts if they failed to load earlier
    try {
      if (typeof initSmoothScrolling === 'function') initSmoothScrolling();
      if (typeof initTypedText === 'function') initTypedText();
      if (typeof initMobileNav === 'function') initMobileNav();
      if (typeof initProjectFilters === 'function') initProjectFilters();
      if (typeof initThemeSwitcher === 'function') initThemeSwitcher();
      if (typeof initContactForm === 'function') initContactForm();
      if (typeof loadIndustryNews === 'function') loadIndustryNews();
      if (typeof updateFooterYear === 'function') updateFooterYear();
      console.log('All page components initialized successfully');
    } catch (error) {
      console.error('Error initializing page components:', error);
      // Even if some components fail, ensure the page is visible
      document.body.classList.add('loaded');
    }
  }
  
  // Start initialization
  animationStartedAt = Date.now();
  initParticles();
  requestAnimationFrame(updateLoadingAnimation);
  
  // Add event listeners
  window.addEventListener('resize', handleResize);
  
  // Set up fallback for when everything else fails
  window.addEventListener('load', () => {
    if (!loadingComplete) {
      console.warn('Forcing load completion after window load event');
      skipAnimation();
    }
  });
  
  // Extra safety timeout - force completion after 10 seconds
  setTimeout(() => {
    if (!loadingComplete) {
      console.warn('Forcing load completion after safety timeout');
      skipAnimation();
    }
  }, 10000);
});
