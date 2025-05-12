/**
 * Theme Manager - Centralized theme control
 */
const ThemeManager = (function() {
    // Configuration
    const config = {
        storageKey: 'theme',
        defaultTheme: 'light',
        darkTheme: 'dark',
        transitionDuration: 500 // ms
    };
    
    // State
    let currentTheme = config.defaultTheme;
    
    // Initialize
    function init() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem(config.storageKey);
        if (savedTheme) {
            setTheme(savedTheme, false);
        } else {
            // Optional: Detect system preference
            detectSystemPreference();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Make API globally available
        window.ThemeManager = {
            getTheme: () => currentTheme,
            setTheme: setTheme,
            toggleTheme: toggleTheme
        };
    }
    
    // Detect system color scheme preference
    function detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme(config.darkTheme, false);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Theme switcher button
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', toggleTheme);
            
            // Update button icon based on current theme
            updateSwitcherIcon(themeSwitcher);
        }
        
        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (e.matches) {
                    setTheme(config.darkTheme, true);
                } else {
                    setTheme(config.defaultTheme, true);
                }
            });
        }
    }
    
    // Toggle between light and dark theme
    function toggleTheme() {
        const newTheme = currentTheme === config.darkTheme ? config.defaultTheme : config.darkTheme;
        setTheme(newTheme, true);
    }
    
    // Set a specific theme
    function setTheme(theme, animate = true) {
        // Validate theme
        if (theme !== config.darkTheme && theme !== config.defaultTheme) {
            theme = config.defaultTheme;
        }
        
        // Update state
        currentTheme = theme;
        
        // Apply to document
        if (theme === config.darkTheme) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Store preference
        localStorage.setItem(config.storageKey, theme);
        
        // Update UI
        updateSwitcherIcon();
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme, animate: animate } 
        }));
    }
    
    // Update theme switcher icon
    function updateSwitcherIcon(switcher = null) {
        const themeSwitcher = switcher || document.querySelector('.theme-switcher');
        if (!themeSwitcher) return;
        
        if (currentTheme === config.darkTheme) {
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ThemeManager.init);
