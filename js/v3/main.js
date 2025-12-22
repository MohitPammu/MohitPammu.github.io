/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTFOLIO APPLICATION ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        main.js
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Application orchestration layer that coordinates the
 *              loading animation → main site transition. Manages image
 *              injection, content fade-in, and event dispatching.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * This orchestrator bridges the loading animation and main application:
 * 
 * 1. Listens for loadingComplete event (from loading.js)
 * 2. Injects preloaded images into project cards
 * 3. Fades in main content with smooth transition
 * 4. Dispatches appReady event (to script.js)
 * 
 * ───────────────────────────────────────────────────────────────────
 * EVENT FLOW
 * ───────────────────────────────────────────────────────────────────
 * 
 * loading.js → loadingComplete → main.js → appReady → script.js
 *               (resources loaded)         (UI ready)   (features init)
 * 
 * Timeline:
 * 1. loading.js preloads images/data (2-3s)
 * 2. loadingComplete event fired
 * 3. main.js injects images + fades in content
 * 4. appReady event fired
 * 5. script.js initializes heavy features
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * - loading.js (fires loadingComplete event)
 * - config.js (global CONFIG object)
 * - Consumed by: script.js (listens for appReady)
 * 
 * ───────────────────────────────────────────────────────────────────
 * DATA STRUCTURES
 * ───────────────────────────────────────────────────────────────────
 * 
 * loadingComplete event.detail:
 * {
 *   theme: 'dark' | 'light',
 *   images: { [path]: Image },      // Preloaded Image objects
 *   data: { [name]: Object },        // Preloaded JSON data
 *   isFirstVisit: boolean,
 *   loadTime: number                 // milliseconds
 * }
 * 
 * appReady event.detail:
 * {
 *   theme: 'dark' | 'light',
 *   preloadedData: Object,           // Full data objects
 *   preloadedImages: Object,         // Full Image objects
 *   preloadedImagePaths: string[],   // Just the paths
 *   isFirstVisit: boolean,
 *   loadTime: number
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. PORTFOLIO APP NAMESPACE
 * 2. CONTENT FADE-IN
 * 3. IMAGE INJECTION
 * 4. EVENT LISTENER (loadingComplete)
 * 5. INITIALIZATION
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';


/**
 * ═══════════════════════════════════════════════════════════════════
 * 1. PORTFOLIO APP NAMESPACE
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Minimal namespace for orchestration utilities.
 * Keeps global scope clean.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

const PortfolioApp = {
    /**
     * Log with timestamp prefix
     * 
     * @param {...*} args - Arguments to log
     * 
     * @example
     * PortfolioApp.log('Loading complete');
     * // Output: [12:34:56.789] [Main] Loading complete
     */
    log: function(...args) {
        const timestamp = new Date().toISOString().substring(11, 23);
        console.log(`[${timestamp}] [Main]`, ...args);
    }
};


/**
 * ═══════════════════════════════════════════════════════════════════
 * 2. CONTENT FADE-IN
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Smoothly reveals main content after loading completes.
 * Uses CSS transition triggered by class addition.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Fade in main content after loading complete
 * 
 * Adds 'content-now-visible' class to <main> element to trigger
 * CSS opacity transition. Also removes 'loading' class from body.
 * 
 * CSS Requirements:
 * - main { opacity: 0; transition: opacity 0.6s ease; }
 * - main.content-now-visible { opacity: 1; }
 * 
 * @returns {void}
 */
function fadeInMainContent() {
    const mainElement = document.querySelector('main');
    
    if (!mainElement) {
        PortfolioApp.log('⚠️ <main> element not found in DOM');
        return;
    }
    
    // Add visible class to trigger CSS transition
    mainElement.classList.add('content-now-visible');
    PortfolioApp.log('✓ Main content fade-in triggered');
    
    // Remove loading class from body
    document.body.classList.remove('loading');
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 3. IMAGE INJECTION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Injects preloaded images into project cards for instant display.
 * Prevents layout shift and improves perceived performance.
 * 
 * ───────────────────────────────────────────────────────────────────
 * HOW IT WORKS
 * ───────────────────────────────────────────────────────────────────
 * 
 * 1. Normalizes image paths (removes './' prefix)
 * 2. Finds all project cards with <img> tags
 * 3. Matches card src with preloaded images
 * 4. Replaces lazy loading with eager loading
 * 5. Swaps src to use preloaded image (from cache)
 * 
 * ───────────────────────────────────────────────────────────────────
 * PATH NORMALIZATION
 * ───────────────────────────────────────────────────────────────────
 * 
 * HTML:      <img src="./images/projects/HR.webp">
 * Preloaded: { './images/projects/HR.webp': Image }
 * Normalized: Both become 'images/projects/HR.webp' for matching
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Inject preloaded images into project cards
 * 
 * @param {Object} preloadedImages - Object mapping paths to Image objects
 *   Format: { [path]: Image }
 *   Example: { './images/projects/HR.webp': Image }
 * 
 * @returns {void}
 */
function injectPreloadedImages(preloadedImages) {
    if (!preloadedImages || typeof preloadedImages !== 'object') {
        PortfolioApp.log('⚠️ No preloaded images to inject');
        return;
    }
    
    PortfolioApp.log('───────────────────────────────────────────────────────────');
    PortfolioApp.log('Starting Image Injection');
    PortfolioApp.log('Available images:', Object.keys(preloadedImages).length);
    
    const projectCards = document.querySelectorAll('.project-card');
    let injectedCount = 0;
    let skippedCount = 0;
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Create Normalized Lookup Map
     * ───────────────────────────────────────────────────────────────
     * 
     * Removes './' prefix from keys for flexible matching.
     * Keeps both original and normalized keys for compatibility.
     */
    const normalizedImages = {};
    Object.keys(preloadedImages).forEach(key => {
        const normalizedKey = key.replace(/^\.\//, ''); // Remove "./" prefix
        normalizedImages[normalizedKey] = preloadedImages[key];
        normalizedImages[key] = preloadedImages[key]; // Keep original too
    });
    
    PortfolioApp.log('Normalized keys created:', Object.keys(normalizedImages).length);
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Process Each Project Card
     * ───────────────────────────────────────────────────────────────
     */
    projectCards.forEach((card, index) => {
        const img = card.querySelector('img');
        
        // Skip cards without images
        if (!img) {
            PortfolioApp.log(`  Card ${index + 1}: No <img> tag found`);
            skippedCount++;
            return;
        }
        
        const src = img.getAttribute('src');
        const normalizedSrc = src.replace(/^\.\//, ''); // Normalize HTML src too
        
        // Check both original and normalized paths
        if (normalizedImages[src] || normalizedImages[normalizedSrc]) {
            const preloadedImg = normalizedImages[src] || normalizedImages[normalizedSrc];
            
            if (preloadedImg && preloadedImg.src) {
                // Image found - inject it!
                PortfolioApp.log(`  Card ${index + 1}: ✓ Injecting ${src}`);
                
                img.removeAttribute('loading');           // Remove lazy loading
                img.setAttribute('loading', 'eager');     // Force eager loading
                img.src = preloadedImg.src;               // Use cached image
                img.classList.add('preloaded');           // Mark as preloaded
                
                // Decode image for smoother display
                img.decode()
                    .then(() => {
                        PortfolioApp.log(`    └─ Decoded successfully`);
                    })
                    .catch(err => {
                        PortfolioApp.log(`    └─ Decode failed:`, err.message);
                    });
                
                injectedCount++;
            } else {
                PortfolioApp.log(`  Card ${index + 1}: ✗ Preloaded image has no .src property`);
                skippedCount++;
            }
        } else {
            PortfolioApp.log(`  Card ${index + 1}: ✗ No match for ${src}`);
            skippedCount++;
        }
    });
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Summary
     * ───────────────────────────────────────────────────────────────
     */
    PortfolioApp.log('───────────────────────────────────────────────────────────');
    PortfolioApp.log('Image Injection Complete');
    PortfolioApp.log(`  ✓ Injected: ${injectedCount}`);
    PortfolioApp.log(`  ✗ Skipped:  ${skippedCount}`);
    PortfolioApp.log(`  Total cards: ${projectCards.length}`);
    PortfolioApp.log('───────────────────────────────────────────────────────────');
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * 4. EVENT LISTENER (loadingComplete)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Main orchestration handler.
 * Coordinates transition from loading to application ready state.
 * 
 * ───────────────────────────────────────────────────────────────────
 * EXECUTION SEQUENCE
 * ───────────────────────────────────────────────────────────────────
 * 
 * 1. Log loading completion details
 * 2. Fade in main content (visual transition)
 * 3. Inject preloaded images (instant display)
 * 4. Dispatch appReady event (initialize features)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

document.addEventListener('loadingComplete', function(event) {
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Log Loading Completion
     * ───────────────────────────────────────────────────────────────
     */
    PortfolioApp.log('═══════════════════════════════════════════════════════════');
    PortfolioApp.log('Loading Animation Complete!');
    PortfolioApp.log('═══════════════════════════════════════════════════════════');
    
    // Extract data from event
    const { theme, images, data, isFirstVisit, loadTime } = event.detail;
    
    // Log event details
    PortfolioApp.log('Theme:', theme);
    
    const imageCount = images && typeof images === 'object' ? 
        Object.keys(images).length : 0;
    PortfolioApp.log('Preloaded Images:', imageCount);
    
    if (data && typeof data === 'object') {
        PortfolioApp.log('Preloaded Data:', Object.keys(data).join(', '));
    } else {
        PortfolioApp.log('Preloaded Data: none');
    }
    
    PortfolioApp.log('First Visit:', isFirstVisit ? 'Yes' : 'No');
    PortfolioApp.log('Load Time:', (loadTime / 1000).toFixed(2) + 's');
    PortfolioApp.log('═══════════════════════════════════════════════════════════');
    
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Step 1: Fade in Main Content
     * ───────────────────────────────────────────────────────────────
     */
    fadeInMainContent();
    
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Step 2: Inject Preloaded Images
     * ───────────────────────────────────────────────────────────────
     */
    if (images) {
        injectPreloadedImages(images);
    } else {
        PortfolioApp.log('⚠️ No images to inject');
    }
    
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Step 3: Prepare appReady Event Data
     * ───────────────────────────────────────────────────────────────
     * 
     * Extract image paths for script.js compatibility.
     * Filters for actual image files (webp, png, jpg, jpeg).
     */
    const imagePaths = images && typeof images === 'object' ? 
        Object.keys(images).filter(k => 
            k.includes('.webp') || 
            k.includes('.png') || 
            k.includes('.jpg') || 
            k.includes('.jpeg')
        ) : [];
    
    
    /**
     * ───────────────────────────────────────────────────────────────
     * Step 4: Dispatch appReady Event
     * ───────────────────────────────────────────────────────────────
     * 
     * Signals to script.js that the application is ready for
     * heavy feature initialization (typed text, news, skills sphere).
     */
    document.dispatchEvent(new CustomEvent('appReady', {
        detail: {
            theme: theme,
            preloadedData: data || {},              // Full data objects
            preloadedImages: images || {},          // Full Image objects
            preloadedImagePaths: imagePaths,        // Just the paths
            isFirstVisit: isFirstVisit,
            loadTime: loadTime
        }
    }));
    
    PortfolioApp.log('───────────────────────────────────────────────────────────');
    PortfolioApp.log('✓ Dispatched appReady event to script.js');
    PortfolioApp.log('  Theme:', theme);
    PortfolioApp.log('  Image objects:', imageCount);
    PortfolioApp.log('  Image paths:', imagePaths.length);
    PortfolioApp.log('  Data objects:', data ? Object.keys(data).length : 0);
    PortfolioApp.log('═══════════════════════════════════════════════════════════');
});


/**
 * ═══════════════════════════════════════════════════════════════════
 * 5. INITIALIZATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Log that orchestrator is ready and waiting.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

PortfolioApp.log('Main orchestrator initialized');
PortfolioApp.log('Waiting for loadingComplete event from loading.js...');


/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready orchestration layer for Mohit Pammu's Portfolio
 * 
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * ═══════════════════════════════════════════════════════════════════
 */