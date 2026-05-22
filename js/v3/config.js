/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTFOLIO CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        config.js
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Centralized configuration for portfolio website.
 *              Single source of truth for paths, features, and settings.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * This configuration file provides:
 * - Environment detection (local vs production)
 * - Path management (local vs GitHub Pages)
 * - Feature flags (enable/disable features)
 * - Performance settings (particles, loading, images)
 * - Resource definitions (preload targets)
 * - Helper methods (path building, feature checks)
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPLOYMENT
 * ───────────────────────────────────────────────────────────────────
 * For GitHub Pages deployment:
 * 1. Update 'production' paths section (lines 60-70)
 * 2. Set correct repository name in base paths
 * 3. Verify feature flags are production-ready
 * 4. Test locally before deploying
 * 
 * For local development:
 * - No changes needed
 * - Automatic detection via hostname
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * - None (standalone configuration)
 * - Consumed by: loading.js, main.js, script.js
 * 
 * ───────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ───────────────────────────────────────────────────────────────────
 * Get image path:
 *   CONFIG.getPath('images', 'Profile-1.png')
 *   // → './images/Profile-1.png' (local)
 *   // → 'assets/images/Profile-1.png' (production)
 * 
 * Check feature:
 *   if (CONFIG.isFeatureEnabled('particleBackground')) { ... }
 * 
 * Get performance setting:
 *   const count = CONFIG.getPerformanceSetting('particles.loading');
 *   // → 60
 * 
 * Get preload resources:
 *   const resources = CONFIG.getPreloadResources();
 *   // → { images: [...], data: [...] }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. ENVIRONMENT DETECTION
 * 2. PATH CONFIGURATION
 *    - Local Development Paths
 *    - Production (GitHub Pages) Paths
 * 3. FEATURE FLAGS
 * 4. PERFORMANCE SETTINGS
 *    - Particle Configuration
 *    - Resource Preloading
 *    - Loading Animation Timing
 *    - Image Optimization
 * 5. API ENDPOINTS
 * 6. RESOURCE DEFINITIONS
 *    - Critical Images
 *    - Project Images
 *    - Data Files
 * 7. HELPER METHODS
 *    - getPaths()
 *    - getPath()
 *    - isFeatureEnabled()
 *    - getPerformanceSetting()
 *    - log()
 *    - getPreloadResources()
 * 8. INITIALIZATION
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

const CONFIG = {
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 1. ENVIRONMENT DETECTION
     * ═══════════════════════════════════════════════════════════════
     * 
     * Automatically detects environment based on hostname.
     * - Local: localhost, 127.0.0.1, *.local
     * - Production: Any other hostname (GitHub Pages, custom domain)
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    isProduction: window.location.hostname !== 'localhost' && 
                  !window.location.hostname.includes('127.0.0.1') &&
                  !window.location.hostname.includes('.local'),
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 2. PATH CONFIGURATION
     * ═══════════════════════════════════════════════════════════════
     * 
     * Separate path configurations for local and production environments.
     * Automatically selected based on isProduction flag.
     * 
     * ───────────────────────────────────────────────────────────────
     * LOCAL DEVELOPMENT
     * ───────────────────────────────────────────────────────────────
     * Uses relative paths starting with './'
     * Works with local file structure
     * 
     * ───────────────────────────────────────────────────────────────
     * PRODUCTION (GitHub Pages)
     * ───────────────────────────────────────────────────────────────
     * Adjust these paths for your GitHub Pages deployment:
     * - Standard: 'assets/images', '/js', '/css'
     * - Repository subdirectory: '/repo-name/assets/images'
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    paths: {
        
        /**
         * Local Development Paths
         * Relative paths for local testing
         */
        local: {
              images: './assets/images',
              projectImages: './assets/images/projects',
              certificates: './assets/certificates',      // PDFs
              data: './assets/data',
              js: './js',
              css: './css',
              assets: './assets'
        },
        
        /**
         * Production Paths (GitHub Pages)
         * 
         * IMPORTANT: Update these for your deployment!
         * 
         * Example configurations:
         * 
         * Root domain (username.github.io):
         *   images: 'assets/images'
         *   js: '/js'
         * 
         * Repository subdirectory (username.github.io/portfolio):
         *   images: '/portfolio/assets/images'
         *   js: '/portfolio/js'
         */
        production: {
            images: 'assets/images',              
            projectImages: 'assets/images/projects', 
            certificates: 'assets/certificates',   
            projects: '/projects',           
            data: 'assets/data',                   
            js: 'js/v3',                    
            css: 'css/v3',                  
            assets: 'assets' 
        }
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 3. FEATURE FLAGS
     * ═══════════════════════════════════════════════════════════════
     * 
     * Enable/disable features without code changes.
     * Useful for:
     * - A/B testing
     * - Gradual rollout
     * - Debug mode
     * - Production optimization
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    features: {
        loadingAnimation: true,        // Show loading animation on first visit
        particleBackground: true,      // Transition particles to background
        newsAutoRefresh: false,        // Auto-refresh news feed (future)
        skillsSphere: true,            // Enable 3D skills visualization
        flowingBackground: true,       // Enable flowing data parallax
        contactForm: true,             // Enable contact form
        analytics: false,              // Google Analytics (future)
        debugMode: true                // Verbose console logging
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 4. PERFORMANCE SETTINGS
     * ═══════════════════════════════════════════════════════════════
     * 
     * Fine-tune performance characteristics.
     * 
     * ───────────────────────────────────────────────────────────────
     * OPTIMIZATION NOTES
     * ───────────────────────────────────────────────────────────────
     * - Lower particle counts improve FPS on mobile
     * - Higher preload counts reduce layout shift but increase load time
     * - Adjust timing based on user testing
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    performance: {
        
        /**
         * ───────────────────────────────────────────────────────────
         * Particle System Configuration
         * ───────────────────────────────────────────────────────────
         */
        particles: {
            loading: 60,               // Particles during loading animation
            background: 30             // Ambient particles after loading
        },
        
        /**
         * ───────────────────────────────────────────────────────────
         * Resource Preloading Configuration
         * ───────────────────────────────────────────────────────────
         * 
         * Balance between perceived performance and actual load time.
         * Higher counts = smoother experience but longer initial load
         */
        preload: {
            projectImages: 8,          // Number of project images to preload
            criticalThreshold: 4       // Minimum before completing (50%)
        },
        
        /**
         * ───────────────────────────────────────────────────────────
         * Loading Animation Timing
         * ───────────────────────────────────────────────────────────
         * 
         * Durations in milliseconds.
         * First visit should feel premium, return visits fast.
         */
        loading: {
            timeout: 8000,             // Maximum loading time (fail-safe)
            initialDuration: 3350,     // First visit animation duration
            returnDuration: 2150,      // Return visit animation duration
            minInitial: 2500,          // Minimum time for first visit
            minReturn: 1500            // Minimum time for return visit
        },
        
        /**
         * ───────────────────────────────────────────────────────────
         * Image Optimization Settings
         * ───────────────────────────────────────────────────────────
         */
        images: {
            lazyLoad: true,            // Enable lazy loading for below-fold
            format: 'webp',            // Preferred format (modern browsers)
            fallback: 'jpg'            // Fallback for older browsers
        }
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 5. API ENDPOINTS
     * ═══════════════════════════════════════════════════════════════
     * 
     * External service endpoints and configuration.
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    apis: {
        formspree: 'https://formspree.io/f/meoggbop',  // Contact form endpoint
        newsCache: true                                 // Use browser cache for news
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 6. RESOURCE DEFINITIONS
     * ═══════════════════════════════════════════════════════════════
     * 
     * Files to preload during loading animation.
     * Preloading critical resources improves perceived performance.
     * 
     * ───────────────────────────────────────────────────────────────
     * RESOURCE CATEGORIES
     * ───────────────────────────────────────────────────────────────
     * 1. Critical: Hero section (above-fold)
     * 2. Projects: Project thumbnails (high priority)
     * 3. Data: JSON/JS files needed immediately
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    resources: {
        
        /**
         * Critical Images (Hero Section)
         * Loaded first for immediate display
         */
        critical: [
            'Profile-1.png'            // Hero profile image
        ],
        
        /**
         * Project Images
         * Preloaded during loading animation for instant display
         * Order: Most important projects first
         */
        projects: [
            'HR.webp',                 // HR Analytics Dashboard
            'global-business.webp',    // Global Business Insights
            'Cyclistic.webp',          // Cyclistic Bike Share
            'FoodHub.webp',            // FoodHub Analytics
            'Sales.webp',              // Sales Performance
            'Netflix.webp',            // Netflix Content Analysis
            'digit-recognition.webp',  // Digit Recognition ML
            'facial-recognition.webp'  // Facial Recognition ML
        ],
        
        /**
         * Data Files (JSON, JS)
         * Configuration and dynamic content
         */
        data: [
            'news.json',               // Industry news RSS data
            //'skills-sphere-data.js'    // Skills visualization config
        ]
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 7. HELPER METHODS
     * ═══════════════════════════════════════════════════════════════
     * 
     * Utility functions for working with configuration.
     * Simplifies path building and feature checking.
     * 
     * ═══════════════════════════════════════════════════════════════
     */
    
    /**
     * Get current environment paths (local or production)
     * 
     * @returns {Object} Path configuration object
     * 
     * @example
     * const paths = CONFIG.getPaths();
     * // → { images: './images', ... } (local)
     * // → { images: 'assets/images', ... } (production)
     */
    getPaths() {
        return this.isProduction ? this.paths.production : this.paths.local;
    },
    
    /**
     * Build full path for a resource
     * 
     * @param {string} category - Path category (e.g., 'images', 'projectImages')
     * @param {string} filename - Optional filename to append
     * @returns {string} Full path to resource
     * 
     * @example
     * CONFIG.getPath('images', 'Profile-1.png')
     * // Local:      './images/Profile-1.png'
     * // Production: 'assets/images/Profile-1.png'
     * 
     * CONFIG.getPath('projectImages')
     * // Local:      './images/projects'
     * // Production: 'assets/projects'
     */
    getPath(category, filename = '') {
        const paths = this.getPaths();
        const basePath = paths[category] || paths.images;
        return filename ? `${basePath}/${filename}` : basePath;
    },
    
    /**
     * Check if a feature is enabled
     * 
     * @param {string} feature - Feature name from features object
     * @returns {boolean} True if feature is enabled
     * 
     * @example
     * if (CONFIG.isFeatureEnabled('particleBackground')) {
     *     // Initialize particle system
     * }
     */
    isFeatureEnabled(feature) {
        return this.features[feature] === true;
    },
    
    /**
     * Get performance setting by dot-notation path
     * 
     * @param {string} setting - Setting path (e.g., 'particles.loading')
     * @returns {*} Setting value or undefined if not found
     * 
     * @example
     * const count = CONFIG.getPerformanceSetting('particles.loading');
     * // → 60
     * 
     * const timeout = CONFIG.getPerformanceSetting('loading.timeout');
     * // → 8000
     */
    getPerformanceSetting(setting) {
        const parts = setting.split('.');
        let value = this.performance;
        
        for (const part of parts) {
            if (value && typeof value === 'object') {
                value = value[part];
            } else {
                return undefined;
            }
        }
        
        return value;
    },
    
    /**
     * Log to console (only if debug mode enabled)
     * 
     * @param {...*} args - Arguments to log
     * 
     * @example
     * CONFIG.log('Environment:', CONFIG.isProduction ? 'PROD' : 'LOCAL');
     * // Only outputs if features.debugMode === true
     */
    log(...args) {
        if (this.features.debugMode) {
            console.log('[CONFIG]', ...args);
        }
    },
    
    /**
     * Get all preloadable resources with full paths
     * 
     * @returns {Object} Resources organized by type
     *   - images: Array of image paths
     *   - data: Array of data file paths
     * 
     * @example
     * const resources = CONFIG.getPreloadResources();
     * // {
     * //   images: [
     * //     './images/Profile-1.png',
     * //     './images/projects/HR.webp',
     * //     ...
     * //   ],
     * //   data: [
     * //     './data/news.json',
     * //     './js/skills-sphere-data.js'
     * //   ]
     * // }
     */
    getPreloadResources() {
        return {
            // Combine critical and project images
            images: [
                // Critical hero images
                ...this.resources.critical.map(img => this.getPath('images', img)),
                // Project thumbnails
                ...this.resources.projects.map(img => this.getPath('projectImages', img))
            ],
            // Data files (JSON/JS)
            data: this.resources.data.map(file => {
                // Check if it's a JS file or JSON file
                if (file.endsWith('.js')) {
                    return this.getPath('js', file);
                } else {
                    return this.getPath('data', file);
                }
            })
        };
    }
};


/**
 * ═══════════════════════════════════════════════════════════════════
 * 8. INITIALIZATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Make CONFIG globally available and log startup information.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// Expose CONFIG to global scope
window.CONFIG = CONFIG;

// Log configuration on load (debug mode only)
CONFIG.log('═══════════════════════════════════════════════════════════');
CONFIG.log('Portfolio Configuration Loaded');
CONFIG.log('═══════════════════════════════════════════════════════════');
CONFIG.log('Environment:', CONFIG.isProduction ? 'PRODUCTION' : 'LOCAL');
CONFIG.log('Hostname:', window.location.hostname);
CONFIG.log('Active Paths:', CONFIG.getPaths());
CONFIG.log('Features:', CONFIG.features);
CONFIG.log('Performance:', CONFIG.performance);
CONFIG.log('═══════════════════════════════════════════════════════════');

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready configuration for Mohit Pammu's Portfolio Website
 * 
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
