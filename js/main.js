/**
 * main.js - Centralized Initialization Controller
 * Manages component loading sequence and dependencies
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing portfolio site with centralized controller');
  
  // Global state to track initialization
  window.portfolioState = {
    loadingAnimationComplete: false,
    backgroundInitialized: false,
    componentsInitialized: false,
    themeInitialized: false,
    currentTheme: document.documentElement.getAttribute('data-theme') || 'light'
  };
  
  // Component initialization functions
  const components = {
    // Initialize theme system first
    initTheme: function() {
      if (window.portfolioState.themeInitialized) return;
      
      try {
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) return;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
          window.portfolioState.currentTheme = 'dark';
        } else {
          window.portfolioState.currentTheme = 'light';
        }
        
        // Set up theme toggle
        themeSwitcher.addEventListener('click', function() {
          try {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
              document.documentElement.removeAttribute('data-theme');
              localStorage.setItem('theme', 'light');
              this.innerHTML = '<i class="fas fa-moon"></i>';
              window.portfolioState.currentTheme = 'light';
            } else {
              document.documentElement.setAttribute('data-theme', 'dark');
              localStorage.setItem('theme', 'dark');
              this.innerHTML = '<i class="fas fa-sun"></i>';
              window.portfolioState.currentTheme = 'dark';
            }
            
            // Notify components of theme change
            document.dispatchEvent(new CustomEvent('themeChanged', { 
              detail: { theme: window.portfolioState.currentTheme } 
            }));
          } catch (error) {
            console.error("Error in theme toggle:", error);
          }
        });
        
        window.portfolioState.themeInitialized = true;
        console.log('Theme system initialized');
      } catch (error) {
        console.error("Error initializing theme system:", error);
      }
    },
    
    // Initialize background after loading screen completes
    initBackground: function() {
      if (window.portfolioState.backgroundInitialized) return;
      
      try {
        if (typeof window.initBackgroundAnimation === 'function') {
          window.initBackgroundAnimation();
          window.portfolioState.backgroundInitialized = true;
          console.log('Background animation initialized');
        } else {
          console.warn('Background animation function not found');
        }
      } catch (error) {
        console.error("Error initializing background:", error);
      }
    },
    
    // Initialize UI components after background is ready
    initUIComponents: function() {
      if (window.portfolioState.componentsInitialized) return;
      
      try {
        // Core UI elements
        if (typeof initSmoothScrolling === 'function') initSmoothScrolling();
        if (typeof initTypedText === 'function') initTypedText();
        if (typeof initMobileNav === 'function') initMobileNav();
        if (typeof initProjectFilters === 'function') initProjectFilters();
        if (typeof initContactForm === 'function') initContactForm();
        if (typeof loadIndustryNews === 'function') loadIndustryNews();
        if (typeof updateFooterYear === 'function') updateFooterYear();
        
        // Initialize skills network visualization only when visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && typeof initSkillsNetwork === 'function') {
              initSkillsNetwork();
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        
        const skillsSection = document.getElementById('skills-network');
        if (skillsSection) {
          observer.observe(skillsSection);
        }
        
        window.portfolioState.componentsInitialized = true;
        console.log('UI components initialized');
        
        // Add loaded class to body for fade-in transitions
        document.body.classList.add('loaded');
      } catch (error) {
        console.error("Error initializing UI components:", error);
        // Ensure the page is visible even if there's an error
        document.body.classList.add('loaded');
      }
    }
  };
  
  // Listen for loading animation completion
  document.addEventListener('loadingComplete', function() {
    console.log('Loading animation complete event received');
    window.portfolioState.loadingAnimationComplete = true;
    
    // Initialize theme first
    components.initTheme();
    
    // Initialize background next
    setTimeout(() => components.initBackground(), 100);
    
    // Initialize UI components last
    setTimeout(() => components.initUIComponents(), 300);
  });
  
  // Fallback initialization if loading animation doesn't trigger
  window.addEventListener('load', function() {
    setTimeout(() => {
      if (!window.portfolioState.loadingAnimationComplete) {
        console.warn('Loading animation did not complete, initializing components directly');
        
        // Force body loaded state
        document.body.classList.add('loaded');
        document.body.classList.remove('loading');
        
        // Initialize all components
        components.initTheme();
        components.initBackground();
        components.initUIComponents();
      }
    }, 5000); // 5 second fallback timeout
  });
});
