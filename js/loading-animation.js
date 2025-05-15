/**
 * loading-animation.js - Reliable Loading Animation
 * Controls the initial loading experience with guaranteed completion
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing loading animation with reliable completion...');
  
  // DOM Elements
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const mPath = document.getElementById('m-path');
  const pPath = document.getElementById('p-path');
  const glowEffect = document.getElementById('glow-effect');
  const particlesCanvas = document.getElementById('loading-particles-canvas');
  const skipButton = document.getElementById('skip-loading');
  const body = document.body;
  
  // Animation variables
  let animationProgress = 0;
  let animationDuration = 3000; // 3 seconds default
  let animationStartTime;
  let loadingComplete = false;
  let skipEnabled = false;
  let isSkipping = false;
  let ctx;
  let minAnimationTime = 2000; // Minimum duration of 2 seconds
  let animationStartedAt = Date.now();
  
  // Check if site assets are already cached
  const hasVisitedBefore = localStorage.getItem('has-visited') === 'true';
  
  // Reduce animation time for returning visitors
  if (hasVisitedBefore) {
    animationDuration = 2500;
    minAnimationTime = 1500;
  }
  
  // Initialize particles animation
  function initParticles() {
    if (!particlesCanvas) return;
    
    try {
      ctx = particlesCanvas.getContext('2d');
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
      
      // Create particles
      let particles = [];
      const particleCount = 80; // Reduced count for better performance
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * particlesCanvas.width,
          y: Math.random() * particlesCanvas.height,
          size: 1 + Math.random() * 1.5, // Smaller particles
          speedX: (Math.random() - 0.5) * 0.3, // Slower movement
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: 0.1 + Math.random() * 0.4
        });
      }
      
      // Animate particles function
      function animateParticles() {
        if (!ctx || loadingComplete) return;
        
        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = 'rgba(18, 18, 18, 0.2)';
        ctx.fillRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        
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
    }
  }
  
  // Enable loading screen skip functionality
  function enableSkipping() {
    if (skipEnabled) return;
    
    skipEnabled = true;
    
    // Make the whole loading screen clickable
    if (loadingScreen) {
      loadingScreen.classList.add('clickable');
      loadingScreen.addEventListener('click', handleSkip);
    }
    
    // Configure skip button if it exists
    if (skipButton) {
      skipButton.classList.add('visible');
      skipButton.addEventListener('click', handleSkip);
    }
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', handleKeyDown);
  }
  
  // Handle skip action
  function handleSkip() {
    if (isSkipping || !skipEnabled) return;
    
    isSkipping = true;
    skipAnimation();
    localStorage.setItem('has-skipped', 'true');
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event) {
    if ((event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') && 
        skipEnabled && !isSkipping) {
      handleSkip();
    }
  }
  
  // Skip animation immediately
  function skipAnimation() {
    if (loadingBar) loadingBar.style.width = '100%';
    if (mPath && pPath) {
      mPath.style.strokeDashoffset = '0';
      pPath.style.strokeDashoffset = '0';
      mPath.style.stroke = '#4a6cf7';
      pPath.style.stroke = '#4a6cf7';
      mPath.style.filter = 'drop-shadow(0 0 15px rgba(74, 108, 247, 0.7))';
      pPath.style.filter = 'drop-shadow(0 0 15px rgba(74, 108, 247, 0.7))';
    }
    
    if (glowEffect) {
      glowEffect.style.opacity = '0.7';
      glowEffect.style.transform = 'translate(-50%, -50%) scale(3)';
    }
    
    // Add class to speed up all transitions
    if (loadingScreen) loadingScreen.classList.add('accelerate-animation');
    
    // Complete after a short delay
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
      
      if (mProgress >= 1) {
        mPath.style.stroke = '#4a6cf7';
      }
    }
    
    // Animate P letter (starts at 50% progress)
    if (pPath && animationProgress > 0.5) {
      const pProgress = Math.min(1, (animationProgress - 0.5) / 0.3);
      pPath.style.strokeDashoffset = 1000 - (pProgress * 1000);
      
      if (pProgress >= 1) {
        pPath.style.stroke = '#4a6cf7';
      }
    }
    
    // Glow effect (starts at 80% progress)
    if (glowEffect && animationProgress > 0.8) {
      const glowProgress = (animationProgress - 0.8) / 0.2;
      
      // Update MP letter glow
      if (mPath && pPath) {
        const glowIntensity = 10 + glowProgress * 15;
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
    
    // Enable skipping after a short delay
    if (animationProgress > 0.2 && !skipEnabled) {
      enableSkipping();
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
        
        // Hold at completed state
        if (loadingBar) loadingBar.style.width = '100%';
        if (mPath) mPath.style.strokeDashoffset = '0';
        if (pPath) pPath.style.strokeDashoffset = '0';
        
        // Complete after enforced delay
        setTimeout(completeLoading, delayRemaining);
      } else {
        // Check if document is ready before completing
        if (document.readyState === 'complete' || isSkipping) {
          completeLoading();
        } else {
          // Wait for document to be ready
          window.addEventListener('load', completeLoading);
          
          // Fallback if load event doesn't fire
          setTimeout(completeLoading, 3000);
        }
      }
    }
  }
  
  // Complete loading animation
  function completeLoading() {
    if (loadingComplete) return; // Prevent multiple calls
    loadingComplete = true;
    
    console.log('Loading animation complete, transitioning to main content');
    
    // Clean up event listeners
    if (loadingScreen) {
      loadingScreen.removeEventListener('click', handleSkip);
    }
    
    if (skipButton) {
      skipButton.removeEventListener('click', handleSkip);
    }
    
    document.removeEventListener('keydown', handleKeyDown);
    
    // Set as visited for future visits
    localStorage.setItem('has-visited', 'true');
    
    // Remove loading class from body to allow scrolling
    body.classList.remove('loading');
    
    // Add loaded class to body for fade-in transitions
    body.classList.add('loaded');
    
    // Trigger the custom event that other components are waiting for
    document.dispatchEvent(new CustomEvent('loadingComplete'));
    
    // Fade out loading screen
    if (loadingScreen) {
      loadingScreen.style.transition = 'opacity 1s ease-out, visibility 1s ease-out';
      loadingScreen.style.opacity = '0';
      
      // Actually hide and remove loading screen after transition completes
      setTimeout(() => {
        loadingScreen.style.visibility = 'hidden';
      }, 1000);
    }
  }
  
  // Start initialization
  initParticles();
  requestAnimationFrame(updateLoadingAnimation);
  
  // Add event listeners
  window.addEventListener('resize', () => {
    if (particlesCanvas) {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }
  });
  
  // Safety fallback - force complete after 8 seconds maximum
  setTimeout(() => {
    if (!loadingComplete) {
      console.warn('Forcing loading completion after safety timeout');
      skipAnimation();
    }
  }, 8000);
});
