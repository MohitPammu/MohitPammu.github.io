/**
 * ═══════════════════════════════════════════════════════════════════
 * FLOWING DATA BACKGROUND - PARALLAX EFFECTS SYSTEM
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        flowing-data.js
 * @version     2.0.0
 * @date        2025-12-13
 * @author      Mohit Pammu
 * @description Animated parallax background with flowing waves and particles.
 *              Features theme adaptation, mouse interaction, scroll effects,
 *              and mobile optimizations for data analyst portfolio.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * Creates an immersive, data-inspired background animation that:
 * 
 * 1. Flowing Wave Layers (9 waves)
 *    - Multiple wave sets with varying amplitude/speed
 *    - Gradient coloring for depth perception
 *    - Smooth sine wave animation
 * 
 * 2. Particle System (55 particles desktop, 30 mobile)
 *    - Rising particles with drift
 *    - Mouse interaction with repulsion
 *    - Glow effects for depth
 * 
 * 3. Parallax Scrolling
 *    - Waves shift with scroll position
 *    - Infinite wrapping for seamless effect
 *    - Particles move at different rate
 * 
 * 4. Theme Adaptation
 *    - Dark/light color schemes
 *    - Smooth theme transitions
 *    - Observer-based theme detection
 * 
 * 5. Performance Optimization
 *    - Frame skipping on mobile
 *    - Throttled scroll handling
 *    - Reduced particle count on mobile
 * 
 * ───────────────────────────────────────────────────────────────────
 * FEATURES
 * ───────────────────────────────────────────────────────────────────
 * 
 * ✓ Multi-layer wave animation (3 wave sets, 9 total waves)
 * ✓ Dynamic particle system with physics
 * ✓ Scroll-based parallax effects
 * ✓ Mouse interaction (particle repulsion)
 * ✓ Dark/light theme support
 * ✓ Mobile-optimized (reduced particles, throttled updates)
 * ✓ Infinite scroll coverage (wave wrapping)
 * ✓ Gradient wave coloring
 * ✓ Particle glow effects
 * ✓ Smooth transitions
 * ✓ Performance throttling
 * ✓ Visibility-based animation pause
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * 
 * Required:
 * - HTML canvas element with id="flow-canvas"
 * - Theme system with data-theme attribute
 * 
 * Optional:
 * - .theme-switcher element for theme toggle detection
 * 
 * ───────────────────────────────────────────────────────────────────
 * BROWSER SUPPORT
 * ───────────────────────────────────────────────────────────────────
 * 
 * - Chrome 90+ (full support)
 * - Firefox 88+ (full support)
 * - Safari 14+ (full support)
 * - Edge 90+ (full support)
 * - Mobile Safari iOS 14+ (optimized)
 * - Chrome Mobile Android 10+ (optimized)
 * 
 * Canvas 2D API Required: All modern browsers support
 * 
 * ───────────────────────────────────────────────────────────────────
 * PERFORMANCE NOTES
 * ───────────────────────────────────────────────────────────────────
 * 
 * Desktop Performance:
 * - 9 wave layers
 * - 55 particles
 * - 60fps target
 * - Full parallax effects
 * 
 * Mobile Optimizations:
 * - 9 wave layers (unchanged)
 * - 30 particles (45% reduction)
 * - Larger wave segments (50px vs 15px)
 * - Same parallax rate (maintained quality)
 * - Throttled resize events
 * 
 * Frame Management:
 * - Wave sorting every 10 frames
 * - Animation frame skipping (configurable)
 * - Visibility-based pause
 * 
 * ───────────────────────────────────────────────────────────────────
 * CONFIGURATION
 * ───────────────────────────────────────────────────────────────────
 * 
 * Wave Sets:
 * - Set 1: 2 large waves (amplitude: 70px, slow)
 * - Set 2: 3 medium waves (amplitude: 40px, medium)
 * - Set 3: 4 small waves (amplitude: 20px, fast)
 * 
 * Particles:
 * - Size: 0.5px - 1.5px
 * - Speed: 0.08 - 0.35 px/frame
 * - Opacity: 0.85 (base)
 * - Fade distance: 80px from bottom
 * 
 * Mouse Interaction:
 * - Influence radius: 150px
 * - Repulsion strength: 0.3
 * - Smooth interpolation: 0.1
 * 
 * Parallax:
 * - Rate: 0.12 (waves)
 * - Rate: 0.036 (particles, 30% of waves)
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. CONFIGURATION
 *    - Wave set definitions
 *    - Particle settings
 *    - Theme colors
 *    - Performance options
 * 
 * 2. STATE MANAGEMENT
 *    - Canvas context
 *    - Wave arrays
 *    - Particle arrays
 *    - Animation state
 *    - Theme state
 * 
 * 3. THEME MANAGEMENT
 *    - Theme detection
 *    - Color retrieval
 *    - Theme observer
 * 
 * 4. CANVAS SETUP
 *    - Resize handling
 *    - Mobile detection
 *    - Configuration adjustment
 * 
 * 5. WAVE GENERATION
 *    - Wave creation
 *    - Wave initialization
 *    - Wave properties
 * 
 * 6. PARTICLE SYSTEM
 *    - Particle creation
 *    - Particle initialization
 *    - Particle physics
 * 
 * 7. RENDERING
 *    - Wave rendering
 *    - Particle rendering
 *    - Gradient generation
 * 
 * 8. PARALLAX EFFECTS
 *    - Scroll handling
 *    - Wave wrapping
 *    - Particle movement
 * 
 * 9. MOUSE INTERACTION
 *    - Mouse tracking
 *    - Particle repulsion
 *    - Smooth interpolation
 * 
 * 10. EVENT HANDLERS
 *     - Scroll events
 *     - Resize events
 *     - Visibility changes
 *     - Theme changes
 * 
 * 11. ANIMATION LOOP
 *     - Frame management
 *     - Update cycle
 *     - Render cycle
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * ═══════════════════════════════════════════════════════════
     * 1. CONFIGURATION
     * ═══════════════════════════════════════════════════════════
     * 
     * Central configuration object for all animation parameters.
     * Organized into logical groups for easy tuning.
     * 
     * ═══════════════════════════════════════════════════════════
     */
    
    const config = {
        /**
         * ───────────────────────────────────────────────────────
         * Wave Sets Configuration
         * ───────────────────────────────────────────────────────
         * 
         * Three sets of waves with different characteristics:
         * - Large waves: Slow, high amplitude, background layer
         * - Medium waves: Medium speed, mid-layer
         * - Small waves: Fast, low amplitude, foreground layer
         */
        waveSets: [
            {
                count: 2,              // Number of waves in this set
                minY: 0.1,             // Minimum Y position (10% from top)
                maxY: 0.9,             // Maximum Y position (90% from top)
                opacity: 0.15,         // Base opacity
                width: 1.2,            // Line width in pixels
                amplitude: 70,         // Wave height (pixels)
                period: 300,           // Wave length (pixels)
                speed: 0.0001,         // Base animation speed
                speedVariation: 0.00003, // Speed randomization
                blur: 0                // Blur amount (pixels)
            },
            {
                count: 3,
                minY: 0,
                maxY: 1.0,
                opacity: 0.10,
                width: 0.8,
                amplitude: 40,
                period: 180,
                speed: 0.00015,
                speedVariation: 0.00005,
                blur: 1
            },
            {
                count: 4,
                minY: 0,
                maxY: 1.0,
                opacity: 0.08,
                width: 0.5,
                amplitude: 20,
                period: 100,
                speed: 0.0002,
                speedVariation: 0.00008,
                blur: 2
            }
        ],
        
        /**
         * ───────────────────────────────────────────────────────
         * Particle System Configuration
         * ───────────────────────────────────────────────────────
         */
        particleCount: 55,              // Total particles (desktop)
        particleMinSize: 0.5,           // Minimum particle radius (px)
        particleMaxSize: 1.5,           // Maximum particle radius (px)
        particleMinSpeed: 0.08,         // Minimum upward speed (px/frame)
        particleMaxSpeed: 0.35,         // Maximum upward speed (px/frame)
        particleOpacity: 0.85,          // Base opacity
        particleFadeDistance: 80,       // Fade distance from bottom (px)
        particleGlow: true,             // Enable glow effect
        
        /**
         * ───────────────────────────────────────────────────────
         * Mouse Interaction Configuration
         * ───────────────────────────────────────────────────────
         */
        mouseInteraction: true,         // Enable mouse repulsion
        mouseInfluenceRadius: 150,      // Radius of mouse effect (px)
        mouseInfluenceStrength: 0.3,    // Strength of repulsion (0-1)
        
        /**
         * ───────────────────────────────────────────────────────
         * Visual Effects Configuration
         * ───────────────────────────────────────────────────────
         */
        useGradientWaves: true,         // Enable gradient wave coloring
        gradientIntensity: 0.3,         // Gradient accent strength (0-1)
        
        /**
         * ───────────────────────────────────────────────────────
         * Parallax Configuration
         * ───────────────────────────────────────────────────────
         */
        parallaxRate: 0.12,             // Scroll multiplier for parallax
        
        /**
         * ───────────────────────────────────────────────────────
         * Performance Configuration
         * ───────────────────────────────────────────────────────
         */
        enableAnimation: true,          // Master animation toggle
        throttleScroll: true,           // Throttle scroll events
        useTranslucent: true,           // Use semi-transparent background
        reduceOnMobile: true,           // Apply mobile optimizations
        waveSegment: 15,                // Distance between wave points (px)
        animationFrameSkip: 1,          // Frames to skip (1 = no skip)
        sortFrequency: 10,              // Frames between wave sorts

        /**
         * ───────────────────────────────────────────────────────
         * Theme Colors
         * ───────────────────────────────────────────────────────
         * 
         * RGBA colors for light and dark themes.
         */
        lightTheme: {
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            elementColor: 'rgba(74, 108, 247, 0.65)',      // Blue
            accentColor: 'rgba(109, 141, 250, 0.85)',      // Brighter blue
            particleColor: 'rgba(74, 108, 247, 0.7)'       // Blue
        },
        darkTheme: {
            backgroundColor: 'rgba(5, 5, 8, 0.94)',
            elementColor: 'rgba(109, 141, 250, 0.65)',     // Brighter blue
            accentColor: 'rgba(154, 170, 255, 0.85)',      // Even brighter
            particleColor: 'rgba(133, 150, 255, 0.75)'     // Bright blue
        }
    };

    /**
     * ═══════════════════════════════════════════════════════════
     * 2. STATE MANAGEMENT
     * ═══════════════════════════════════════════════════════════
     * 
     * Global state variables for animation system.
     * 
     * ═══════════════════════════════════════════════════════════
     */
    
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return; // Early exit if canvas not found
    
    const ctx = canvas.getContext('2d', { alpha: config.useTranslucent });
    
    let width, height;                  // Canvas dimensions
    let waves = [];                     // Wave objects array
    let particles = [];                 // Particle objects array
    let animationFrameId;               // requestAnimationFrame ID
    let time = 0;                       // Animation time counter
    let frameCount = 0;                 // Total frames rendered
    let lastScrollY = 0;                // Previous scroll position
    let parallaxOffset = 0;             // Cumulative parallax offset
    let isScrolling = false;            // Scroll throttle flag
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let isMobile = window.innerWidth < 768;

    /**
     * ───────────────────────────────────────────────────────────
     * Mouse Interaction State
     * ───────────────────────────────────────────────────────────
     * 
     * Separate current and target positions for smooth interpolation.
     */
    let mouseX = 0;                     // Current mouse X
    let mouseY = 0;                     // Current mouse Y
    let targetMouseX = 0;               // Target mouse X
    let targetMouseY = 0;               // Target mouse Y

    /**
     * ═══════════════════════════════════════════════════════════
     * 3. THEME MANAGEMENT
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Get current theme color scheme
     * 
     * @returns {Object} Theme colors (backgroundColor, elementColor, etc.)
     */
    function getThemeColors() {
        return currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
    }

    /**
     * Update current theme from DOM attributes
     * 
     * Checks both body and html elements for data-theme attribute.
     * Falls back to 'light' if neither is set.
     * 
     * @returns {void}
     */
    function updateTheme() {
        const bodyTheme = document.body.getAttribute('data-theme');
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        currentTheme = bodyTheme || htmlTheme || 'light';
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 4. CANVAS SETUP
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Adjust configuration for mobile devices
     * 
     * Mobile Detection Strategy:
     * - Width <= 768px (phones)
     * - Tablet portrait (width <= 1024 AND height > width)
     * - Touch capability
     * 
     * Mobile Optimizations:
     * - Reduce particles by 45% (55 → 30)
     * - Increase wave segment size (15px → 50px)
     * - Keep same parallax rate (quality maintained)
     * 
     * @returns {void}
     */
    function adjustConfig() {
        // Multi-factor mobile detection
        const isMobileWidth = window.innerWidth <= 768;
        const isTabletPortrait = window.innerWidth <= 1024 && window.innerHeight > window.innerWidth;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        isMobile = isMobileWidth || (isTabletPortrait && isTouchDevice);
        
        if (isMobile && config.reduceOnMobile) {
            // Keep wave counts unchanged (visual quality)
            config.waveSets[0].count = 2;
            config.waveSets[1].count = 3;
            config.waveSets[2].count = 4;
            
            // Reduce particles for performance
            config.particleCount = 30;
            
            // Larger segments = fewer draw calls
            config.waveSegment = 50;
            
            // Keep parallax rate (quality preserved)
            config.parallaxRate = 0.12; 
        } else {
            // Desktop: Full quality
            config.parallaxRate = 0.12;
        }
    }

    /**
     * Resize canvas to match window dimensions
     * 
     * Optimization: Only resize/repaint if dimensions actually changed.
     * Initializes mouse position to center on first run.
     * 
     * @returns {void}
     */
    function resizeCanvas() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Skip resize if dimensions unchanged
        if (canvas.width === newWidth && canvas.height === newHeight) {
            return;
        }
        
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Initialize mouse position (center of screen)
        if (mouseX === 0 && mouseY === 0) {
            mouseX = width / 2;
            mouseY = height / 2;
            targetMouseX = width / 2;
            targetMouseY = height / 2;
        }
        
        adjustConfig();
        initWaves();
        initParticles();
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 5. WAVE GENERATION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Create a single wave object
     * 
     * Wave Positioning:
     * - Distributed evenly between minY and maxY
     * - First wave at minY, last wave at maxY
     * - Intermediate waves spaced evenly
     * 
     * @param {Object} config - Wave set configuration
     * @param {number} index - Wave index in set (0-based)
     * @param {number} total - Total waves in set
     * @returns {Object} Wave object with properties
     */
    function createWave(config, index, total) {
        // Calculate Y position (linear interpolation)
        const position = config.minY + (config.maxY - config.minY) * (index / Math.max(1, total - 1));
        const yBase = height * position;
        
        return {
            baseY: yBase,                           // Center Y position
            amplitude: config.amplitude,            // Wave height
            period: config.period,                  // Wave length
            phase: Math.random() * Math.PI * 2,    // Random starting phase
            speed: config.speed,                    // Animation speed
            width: config.width,                    // Line width
            opacity: config.opacity,                // Base opacity
            blur: config.blur                       // Blur amount
        };
    }

    /**
     * Initialize all wave layers
     * 
     * Creates waves for each wave set defined in config.
     * Stores original set properties for reference.
     * 
     * @returns {void}
     */
    function initWaves() {
        waves = [];
        
        config.waveSets.forEach(waveSet => {
            for (let i = 0; i < waveSet.count; i++) {
                const wave = {
                    ...createWave(waveSet, i, waveSet.count),
                    setOpacity: waveSet.opacity,  // Original opacity
                    setWidth: waveSet.width       // Original width
                };
                
                waves.push(wave);
            }
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 6. PARTICLE SYSTEM
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Create a single particle
     * 
     * Particle Properties:
     * - Random X position across width
     * - Random Y position (or just below viewport for new particles)
     * - Random size, speed, opacity within configured ranges
     * - Random horizontal drift (-0.1 to +0.1 px/frame)
     * 
     * @param {boolean} randomY - If true, Y is random; if false, Y starts below viewport
     * @returns {Object} Particle object
     */
    function createParticle(randomY = true) {
        const x = Math.random() * width;
        const y = randomY ? Math.random() * height : height + Math.random() * 20;
        
        return { 
            x, 
            y, 
            size: config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize),
            speed: config.particleMinSpeed + Math.random() * (config.particleMaxSpeed - config.particleMinSpeed),
            opacity: config.particleOpacity * (0.7 + Math.random() * 0.3),
            drift: Math.random() * 0.2 - 0.1  // Horizontal drift
        };
    }

    /**
     * Initialize all particles
     * 
     * Creates initial particle pool.
     * Reduces count on mobile for performance.
     * 
     * @returns {void}
     */
    function initParticles() {
        particles = [];
        
        // Mobile gets 45% fewer particles (55 → 30)
        const count = isMobile && config.reduceOnMobile ? 
                      Math.floor(config.particleCount / 2) : 
                      config.particleCount;
                      
        for (let i = 0; i < count; i++) {
            particles.push(createParticle(true));
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 7. RENDERING
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Draw a single wave
     * 
     * Wave Rendering Process:
     * 1. Apply blur filter (if configured)
     * 2. Generate gradient (if enabled) or solid color
     * 3. Calculate sine wave points
     * 4. Draw smooth curve through points
     * 5. Clear filter
     * 
     * Gradient Strategy:
     * - 3-stop vertical gradient centered on wave
     * - Dimmer at top/bottom, brighter in middle
     * - Uses accent color for brightness boost
     * 
     * @param {Object} wave - Wave object to render
     * @returns {void}
     */
    function drawWave(wave) {
        const themeColors = getThemeColors();
        
        // Apply blur filter
        if (wave.blur > 0) {
            ctx.filter = `blur(${wave.blur}px)`;
        }
        
        ctx.beginPath();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Gradient vs Solid Color
         * ─────────────────────────────────────────────────────────
         */
        
        if (config.useGradientWaves) {
            // Vertical gradient for depth
            const gradient = ctx.createLinearGradient(0, wave.baseY - 50, 0, wave.baseY + 50);
            const baseOpacity = wave.opacity;
            const accentOpacity = baseOpacity * (1 + config.gradientIntensity);
            
            // Replace last number in rgba() with new opacity
            gradient.addColorStop(0, themeColors.elementColor.replace(/[^,]+(?=\))/, (baseOpacity * 0.7).toString()));
            gradient.addColorStop(0.5, themeColors.accentColor.replace(/[^,]+(?=\))/, accentOpacity.toString()));
            gradient.addColorStop(1, themeColors.elementColor.replace(/[^,]+(?=\))/, (baseOpacity * 0.7).toString()));
            
            ctx.strokeStyle = gradient;
        } else {
            // Solid color with opacity
            ctx.strokeStyle = themeColors.elementColor.replace(/[^,]+(?=\))/, wave.opacity.toString());
        }
        
        ctx.lineWidth = wave.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        /**
         * ─────────────────────────────────────────────────────────
         * Draw Wave Path
         * ─────────────────────────────────────────────────────────
         * 
         * Extends 100px beyond canvas edges for smooth appearance.
         * Uses configurable segment size for performance tuning.
         */
        
        const segment = config.waveSegment;
        let startX = -100;
        let startY = wave.baseY + Math.sin(startX * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude;
        
        ctx.moveTo(startX, startY);
        
        for (let x = startX + segment; x <= width + 100; x += segment) {
            const y = wave.baseY + Math.sin(x * (1/wave.period) + wave.phase + time * wave.speed) * wave.amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.filter = 'none';
    }

    /**
     * Draw all waves
     * 
     * Performance Optimization:
     * - Sorts waves by Y position every 10 frames
     * - Ensures proper layering (back to front)
     * 
     * @returns {void}
     */
    function drawWaves() {
        // Periodic sorting for proper depth ordering
        if (frameCount % config.sortFrequency === 0) {
            waves.sort((a, b) => a.baseY - b.baseY);
        }
        
        waves.forEach(wave => drawWave(wave));
    }

    /**
     * Update particle positions
     * 
     * Particle Physics:
     * - Move upward (negative Y)
     * - Apply horizontal drift
     * - Wrap around when off-screen (infinite particles)
     * 
     * @returns {void}
     */
    function updateParticles() {
        particles.forEach(particle => {
            particle.y -= particle.speed;  // Move upward
            particle.x += particle.drift;   // Horizontal drift
            
            // Wrap to bottom when off top
            if (particle.y < -20) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }
        });
    }

    /**
     * Draw all particles
     * 
     * Rendering Features:
     * - Mouse repulsion (if enabled)
     * - Fade out near bottom edge
     * - Glow effect (shadow blur)
     * 
     * @returns {void}
     */
    function drawParticles() {
        const themeColors = getThemeColors();
        const baseColor = themeColors.particleColor || themeColors.elementColor;
        
        particles.forEach(particle => {
            /**
             * ─────────────────────────────────────────────────────
             * Mouse Repulsion Effect
             * ─────────────────────────────────────────────────────
             * 
             * Particles within radius are pushed away from mouse.
             * Force decreases with distance (inverse square-ish).
             */
            
            if (config.mouseInteraction) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.mouseInfluenceRadius) {
                    const force = (1 - distance / config.mouseInfluenceRadius) * config.mouseInfluenceStrength;
                    particle.x -= dx * force * 0.5;
                    particle.y -= dy * force * 0.5;
                }
            }
            
            /**
             * ─────────────────────────────────────────────────────
             * Fade Out Near Bottom
             * ─────────────────────────────────────────────────────
             * 
             * Prevents harsh cutoff as particles wrap around.
             */
            
            let finalOpacity = particle.opacity;
            if (particle.y > height - config.particleFadeDistance) {
                finalOpacity = particle.opacity * (height - particle.y) / config.particleFadeDistance;
            }
            
            /**
             * ─────────────────────────────────────────────────────
             * Glow Effect
             * ─────────────────────────────────────────────────────
             */
            
            if (config.particleGlow) {
                ctx.shadowBlur = particle.size * 3;
                ctx.shadowColor = baseColor.replace(/[^,]+(?=\))/, (finalOpacity * 0.6).toString());
            }
            
            // Draw particle circle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = baseColor.replace(/[^,]+(?=\))/, finalOpacity.toString());
            ctx.fill();
            
            // Clear glow
            if (config.particleGlow) {
                ctx.shadowBlur = 0;
            }
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 8. PARALLAX EFFECTS
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Apply parallax effect to waves and particles
     * 
     * Parallax Strategy:
     * - Waves move at full parallax rate (0.12)
     * - Particles move at 30% rate (0.036) for depth
     * - Infinite wrapping prevents gaps during scroll
     * 
     * Wave Wrapping Logic:
     * - When wave goes off top, wrap to bottom
     * - When wave goes off bottom, wrap to top
     * - Threshold includes amplitude for smooth transition
     * 
     * @param {number} scrollY - Current scroll position
     * @returns {void}
     */
    function applyParallax(scrollY) {
        const deltaY = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Ignore tiny movements (noise reduction)
        if (Math.abs(deltaY) < 1) return;
        
        const parallaxDelta = deltaY * config.parallaxRate;
        parallaxOffset += parallaxDelta;
        
        /**
         * ─────────────────────────────────────────────────────────
         * Update Wave Positions with Wrapping
         * ─────────────────────────────────────────────────────────
         */
        
        waves.forEach(wave => {
            wave.baseY -= parallaxDelta;
            
            // Infinite scroll wrapping
            if (wave.baseY < -wave.amplitude) {
                wave.baseY = height + wave.amplitude;
            } else if (wave.baseY > height + wave.amplitude) {
                wave.baseY = -wave.amplitude;
            }
        });
        
        /**
         * ─────────────────────────────────────────────────────────
         * Update Particle Positions
         * ─────────────────────────────────────────────────────────
         * 
         * Particles move at 30% of wave speed for depth perception.
         */
        
        particles.forEach(particle => {
            particle.y -= parallaxDelta * 0.3;
        });
    }

    /**
     * Handle scroll events
     * 
     * Throttling Strategy:
     * - Set isScrolling flag
     * - Process parallax immediately
     * - Clear flag on next animation frame
     * - Prevents multiple updates per frame
     * 
     * @returns {void}
     */
    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        applyParallax(window.scrollY);
        
        requestAnimationFrame(() => {
            isScrolling = false;
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 9. MOUSE INTERACTION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Handle mouse move events
     * 
     * Stores target position for smooth interpolation.
     * Actual mouse position updates in updateMousePosition().
     * 
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    function handleMouseMove(e) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    }

    /**
     * Update mouse position with smooth interpolation
     * 
     * Uses linear interpolation (lerp) with factor 0.1.
     * Creates smooth, delayed following effect.
     * 
     * @returns {void}
     */
    function updateMousePosition() {
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 10. EVENT HANDLERS
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Handle visibility change
     * 
     * Pauses animation when tab is hidden.
     * Resumes when tab becomes visible.
     * Saves CPU/battery on hidden tabs.
     * 
     * @returns {void}
     */
    function handleVisibilityChange() {
        config.enableAnimation = document.visibilityState === 'visible';
    }

    /**
     * Handle theme change
     * 
     * Updates current theme and triggers re-render.
     * Colors update automatically on next frame.
     * 
     * @param {string} newTheme - New theme name (unused, reads from DOM)
     * @returns {void}
     */
    function handleThemeChange(newTheme) {
        updateTheme();
    }

    /**
     * Watch for theme changes
     * 
     * Observes both html and body elements for data-theme changes.
     * Listens for custom themeChanged event.
     * 
     * @returns {void}
     */
    function watchThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    handleThemeChange();
                    break;
                }
            }
        });
        
        observer.observe(document.documentElement, { attributes: true });
        observer.observe(document.body, { attributes: true });
        document.addEventListener('themeChanged', handleThemeChange);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 11. ANIMATION LOOP
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Main render loop
     * 
     * Execution Flow:
     * 1. Clear/fill background
     * 2. Update animation state (if enabled)
     * 3. Draw waves
     * 4. Update particle physics
     * 5. Draw particles
     * 6. Request next frame
     * 
     * Performance Features:
     * - Frame skipping (configurable)
     * - Conditional updates based on visibility
     * - Smooth interpolation for mouse
     * 
     * @returns {void}
     */
    function render() {
        frameCount++;
        const updateAnimation = frameCount % config.animationFrameSkip === 0;
        
        /**
         * ─────────────────────────────────────────────────────────
         * Clear Canvas
         * ─────────────────────────────────────────────────────────
         * 
         * Translucent mode: Fill with semi-transparent background
         * Transparent mode: Clear completely (shows page background)
         */
        
        if (config.useTranslucent) {
            const themeColors = getThemeColors();
            ctx.fillStyle = themeColors.backgroundColor;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.clearRect(0, 0, width, height);
        }
        
        /**
         * ─────────────────────────────────────────────────────────
         * Update Animation State
         * ─────────────────────────────────────────────────────────
         */
        
        if (updateAnimation && config.enableAnimation) {
            time += 1;
            updateMousePosition();
        }
        
        /**
         * ─────────────────────────────────────────────────────────
         * Render Layers
         * ─────────────────────────────────────────────────────────
         */
        
        drawWaves();
        
        if (updateAnimation && config.enableAnimation) {
            updateParticles();
        }
        
        drawParticles();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Request Next Frame
         * ─────────────────────────────────────────────────────────
         */
        
        animationFrameId = requestAnimationFrame(render);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * INITIALIZATION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Initialize animation system
     * 
     * Initialization Order:
     * 1. Update theme
     * 2. Resize canvas
     * 3. Set initial parallax offset
     * 4. Watch for theme changes
     * 5. Start render loop
     * 6. Attach event listeners
     * 
     * Mobile Resize Optimization:
     * - Only resize if width changed by 10px or height changed
     * - Ignores iOS URL bar show/hide
     * - Debounced with 200ms delay
     * 
     * @returns {void}
     */
    function init() {
        updateTheme();
        resizeCanvas();
        
        // Set initial parallax offset from current scroll
        parallaxOffset = window.scrollY * config.parallaxRate;
        lastScrollY = window.scrollY;
        
        watchThemeChanges();
        render();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Resize Event Handling
         * ─────────────────────────────────────────────────────────
         */
        
        let lastMobileWidth = window.innerWidth;
        let lastMobileHeight = window.innerHeight;

        window.addEventListener('resize', () => {
        // Check if orientation is changing (access parent window variable)
        if (typeof window.isOrientationChanging !== 'undefined' && window.isOrientationChanging) {
            return; // Block canvas resize during orientation
        }
        
        if (isMobile) {
            // Mobile: Only resize on significant width change
            const widthChanged = Math.abs(window.innerWidth - lastMobileWidth) > 10;
            
            if (widthChanged) {
                lastMobileWidth = window.innerWidth;
                lastMobileHeight = window.innerHeight;
                clearTimeout(window.resizeTimer);
                window.resizeTimer = setTimeout(resizeCanvas, 200);
            }
        } else {
            // Desktop: Always resize (debounced)
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 200);
        }
    }, { passive: true });
        
        /**
         * ─────────────────────────────────────────────────────────
         * Scroll Event Handling
         * ─────────────────────────────────────────────────────────
         */
        
        if (config.parallaxRate > 0) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        /**
         * ─────────────────────────────────────────────────────────
         * Mouse Event Handling
         * ─────────────────────────────────────────────────────────
         */
        
        if (config.mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        }
        
        /**
         * ─────────────────────────────────────────────────────────
         * Visibility Change Handling
         * ─────────────────────────────────────────────────────────
         */
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        /**
         * ─────────────────────────────────────────────────────────
         * Theme Toggle Detection
         * ─────────────────────────────────────────────────────────
         * 
         * Catches theme changes from manual toggle.
         * Delayed update ensures theme attribute is set first.
         */
        
        const themeToggle = document.querySelector('.theme-switcher');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(updateTheme, 50);
            });
        }
    }

    // Start the show!
    init();
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF FLOWING DATA BACKGROUND
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready parallax effects for Mohit Pammu's Portfolio
 * 
 * @version     2.0.0
 * @date        2025-12-13
 * @author      Mohit Pammu
 * 
 * Features:
 * - 9 flowing wave layers (3 sets)
 * - 55 particles (30 on mobile)
 * - Scroll-based parallax
 * - Mouse particle repulsion
 * - Theme adaptation
 * - Mobile optimizations
 * - 60fps target (desktop)
 * 
 * Performance:
 * - Desktop: 9 waves, 55 particles, full effects
 * - Mobile: 9 waves, 30 particles, optimized segments
 * - Frame skipping: Configurable
 * - Visibility pause: Automatic
 * 
 * ═══════════════════════════════════════════════════════════════════
 */