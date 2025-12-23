/**
 * ═══════════════════════════════════════════════════════════════════
 * PREMIUM LOADING ANIMATION - FIRST IMPRESSION EXPERIENCE
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        loading-animation.js
 * @version     2.0.0
 * @date        2025-12-13
 * @author      Mohit Pammu
 * @description Premium loading screen with animated logo, particle effects,
 *              resource preloading, and dramatic burst transition. Features
 *              adaptive timing for return visitors and theme-aware visuals.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('Initializing premium loading animation...');

    /**
     * ═══════════════════════════════════════════════════════════
     * 1. CONFIGURATION
     * ═══════════════════════════════════════════════════════════
     */
    
    const config = {
        initialVisitDuration: 1600,
        returnVisitDuration: 850,
        minLoadingTimeInitial: 1200,
        minLoadingTimeReturn: 500,
        maxLoadingTime: 8000,
        burstDuration: 1100,
        preBurstPauseInitial: 250,
        preBurstPauseReturn: 150,
        
        logoAnimationStart: 0.1,
        logoAnimationDuration: 0.4,
        pLetterStart: 0.5,
        pLetterDuration: 0.3,
        glowStart: 0.5,
        
        particleCount: 60,
        particleMinSize: 0.5,
        particleMaxSize: 1.5,
        particleMinSpeed: 0.08,
        particleMaxSpeed: 0.3,
        particleOpacity: 0.85,
        
        burstParticleCount: 250,
        burstMinSize: 1.5,
        burstMaxSize: 4,
        burstMinSpeed: 10,
        burstMaxSpeed: 25
    };
        
    const resources = window.CONFIG ? window.CONFIG.getPreloadResources() : {
        images: [
            'assets/images/Profile-1.png',
            'assets/images/projects/HR.webp',
            'assets/images/projects/global-business.webp',
            'assets/images/projects/Cyclistic.webp',
            'assets/images/projects/FoodHub.webp',
            'assets/images/projects/Sales.webp',
            'assets/images/projects/Netflix.webp',
            'assets/images/projects/digit-recognition.webp',
            'assets/images/projects/facial-recognition.webp'
        ],
        data: [
            'assets/data/news.json'
        ]
    };

    /**
     * ═══════════════════════════════════════════════════════════
     * 2. STATE MANAGEMENT
     * ═══════════════════════════════════════════════════════════
     */
    
    const hasVisitedBefore = localStorage.getItem('portfolio-has-visited') === 'true';
    
    const state = {
        animationProgress: 0,
        loadingProgress: 0,
        isComplete: false,
        isBursting: false,
        isAnimating: true,
        startTime: Date.now(),
        animationStartTime: null,
        hasVisited: hasVisitedBefore,
        currentTheme: document.documentElement.getAttribute('data-theme') || 'dark',
        preloadedResources: {},
        totalResources: 0,
        loadedResources: 0,
        particles: [],
        burstParticles: [],
        backgroundAnimationId: null,
        burstAnimationId: null,
        eventListeners: []
    };

    /**
     * ═══════════════════════════════════════════════════════════
     * 3. DOM ELEMENTS
     * ═══════════════════════════════════════════════════════════
     */
    
    const elements = {
        loadingScreen: document.getElementById('loading-screen'),
        canvas: document.getElementById('loading-canvas'),
        logo: document.getElementById('loading-logo'),
        mPath: document.getElementById('m-path'),
        pPath: document.getElementById('p-path'),
        barContainer: document.getElementById('loading-bar-container'),
        barFill: document.getElementById('loading-bar-fill')
    };

    if (!elements.loadingScreen || !elements.canvas || !elements.barFill) {
        console.error('Required loading screen elements not found!');
        return;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 4. THEME MANAGEMENT
     * ═══════════════════════════════════════════════════════════
     */
    
    function getThemeColors() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        const themes = {
            dark: {
                background: 'linear-gradient(135deg, #050508 0%, #0a0a10 100%)',
                canvasBg: 'rgba(5, 5, 8, 0.94)',
                stroke: '#6D8DFA',
                glowColor: '#6D8DFA',
                glowColorRGB: '109, 141, 250',
                particleColor: 'rgba(133, 150, 255, 0.85)',
                barGradient: 'linear-gradient(90deg, #6D8DFA 0%, #9AABFF 100%)',
                barShadow: 'rgba(109, 141, 250, 0.8)'
            },
            light: {
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                canvasBg: 'rgba(255, 255, 255, 0.92)',
                stroke: '#4A6CF7',
                glowColor: '#4A6CF7',
                glowColorRGB: '74, 108, 247',
                particleColor: 'rgba(74, 108, 247, 0.8)',
                barGradient: 'linear-gradient(90deg, #4A6CF7 0%, #6D8DFA 100%)',
                barShadow: 'rgba(74, 108, 247, 0.5)'
            }
        };
        
        return themes[currentTheme] || themes.dark;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 5. RESOURCE PRELOADING
     * ═══════════════════════════════════════════════════════════
     */
    
    function preloadResources() {
        const { images, data } = resources;
        state.totalResources = images.length + data.length;

        images.forEach((src, index) => {
            const networkDelay = 100 + Math.random() * 300;
            
            setTimeout(() => {
                const img = new Image();
                
                img.onload = () => {
                    state.loadedResources++;
                    state.preloadedResources[src] = img;
                    updateLoadingProgress();
                };
                
                img.onerror = () => {
                    state.loadedResources++;
                    updateLoadingProgress();
                };
                
                img.src = src;
            }, networkDelay);
        });

        data.forEach((url, index) => {
            const networkDelay = 150 + Math.random() * 250;
            
            setTimeout(() => {
                fetch(url)
                    .then(res => res.json())
                    .then(jsonData => {
                        state.loadedResources++;
                        state.preloadedResources[url] = jsonData;
                        updateLoadingProgress();
                    })
                    .catch(err => {
                        state.loadedResources++;
                        updateLoadingProgress();
                    });
            }, networkDelay);
        });
    }

    function updateLoadingProgress() {
        state.loadingProgress = state.totalResources > 0 
            ? state.loadedResources / state.totalResources 
            : 1;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 6. PARTICLE COLOR SYSTEM
     * ═══════════════════════════════════════════════════════════
     */
    
    function getParticleColor(z, opacity) {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        let r, g, b;
        
        if (theme === 'dark') {
            r = 90 + (z * 130);
            g = 120 + (z * 110);
            b = 250 + (z * 5);
        } else {
            r = 64 + (z * 45);
            g = 98 + (z * 43);
            b = 240 + (z * 10);
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    function getBurstColor(z, opacity) {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        let r, g, b;
        
        if (theme === 'dark') {
            r = 109 + (z * 100);
            g = 141 + (z * 80);
            b = 250 + (z * 5);
        } else {
            r = 50 + (z * 59);
            g = 85 + (z * 56);
            b = 200 + (z * 50);
        }
        
        const finalOpacity = theme === 'light' ? Math.min(1, 0.95) : opacity;
        
        return `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 7. PARTICLE SYSTEM
     * ═══════════════════════════════════════════════════════════
     */
    
    let ctx = null;
    let mouseX = 0;
    let mouseY = 0;
    let mouseMoveHandler = null;
    let resizeHandler = null;

    function initParticles() {
        if (!elements.canvas) return;

        ctx = elements.canvas.getContext('2d', { alpha: true });
        elements.canvas.width = window.innerWidth;
        elements.canvas.height = window.innerHeight;

        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;

        const particleCount = state.currentTheme === 'light' ? 60 : 70;

        state.particles = [];
        for (let i = 0; i < particleCount; i++) {
            state.particles.push(createParticle());
        }

        mouseMoveHandler = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', mouseMoveHandler);
        state.eventListeners.push({ type: 'mousemove', handler: mouseMoveHandler });

        // Render first frame synchronously
        if (ctx && elements.canvas) {
            const colors = getThemeColors();
            ctx.fillStyle = colors.canvasBg;
            ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
            
            // Draw initial particles
            state.particles.forEach(particle => {
                const particleColor = getParticleColor(particle.z, particle.opacity);
                ctx.shadowBlur = particle.size * 3;
                ctx.shadowColor = particleColor;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            });
            ctx.shadowBlur = 0;
        }

        animateParticles();
    }

    function createParticle() {
        const depth = Math.random();
        const sizeMultiplier = state.currentTheme === 'light' ? 1.3 : 1.0;
        const baseSize = config.particleMinSize * sizeMultiplier;
        const maxSize = config.particleMaxSize * sizeMultiplier;
        const baseOpacity = config.particleOpacity;  
        const depthFactor = 0.5 + (depth * 0.5);
        const calculatedOpacity = baseOpacity * depthFactor * (0.7 + Math.random() * 0.3);

        return {
            x: Math.random() * elements.canvas.width,
            y: Math.random() * elements.canvas.height,
            z: depth,
            size: baseSize + (depth * (maxSize - baseSize)),
            speed: config.particleMinSpeed + (depth * (config.particleMaxSpeed - config.particleMinSpeed)),
            opacity: calculatedOpacity,
            drift: Math.random() * 0.2 - 0.1
        };
    }

    function animateParticles() {
        if (!state.isAnimating || !ctx) return;

        const colors = getThemeColors();
        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);

        state.particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const mouseInfluence = 150;

            if (distance < mouseInfluence) {
                const force = (1 - distance / mouseInfluence) * 0.3;
                particle.x -= dx * force * 0.5;
                particle.y -= dy * force * 0.5;
            }

            particle.y -= particle.speed;
            particle.x += particle.drift;

            if (particle.y < -20) {
                particle.y = elements.canvas.height + 10;
                particle.x = Math.random() * elements.canvas.width;
            }

            const particleColor = getParticleColor(particle.z, particle.opacity);
            
            if (state.currentTheme === 'light') {
                const glowBase = particle.size * 2;
                const glowIntensity = 0.3 + (particle.z * 0.4);
                
                ctx.shadowBlur = glowBase * 0.8;
                ctx.shadowColor = particleColor.replace(/[^,]+(?=\))/, (particle.opacity * glowIntensity * 0.5).toString());
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
                
                ctx.shadowBlur = glowBase * 0.3;
                ctx.shadowColor = particleColor.replace(/[^,]+(?=\))/, (particle.opacity * glowIntensity * 0.8).toString());
                ctx.fill();
            } else {
                ctx.shadowBlur = particle.size * 3;
                ctx.shadowColor = particleColor.replace(/[^,]+(?=\))/, (particle.opacity * 0.6).toString());
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
            
            ctx.shadowBlur = 0;
        });

        if (state.isBursting && state.burstParticles.length > 0) {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            
            state.burstParticles.forEach(bp => {
                if (bp.opacity > 0) {
                    const burstColor = getBurstColor(bp.z, bp.opacity);
                    
                    if (theme === 'light') {
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    } else {
                        const burstGlow = bp.size * 8 * (0.5 + bp.z * 1.5);
                        ctx.shadowBlur = burstGlow;
                        ctx.shadowColor = burstColor;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                    }
                    
                    ctx.globalAlpha = bp.opacity;
                    ctx.beginPath();
                    ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
                    ctx.fillStyle = burstColor;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
            });
        }

        state.backgroundAnimationId = requestAnimationFrame(animateParticles);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 8. BURST ANIMATION
     * ═══════════════════════════════════════════════════════════
     */
    
    function triggerParticleBurst() {
        if (!ctx || !elements.canvas) return;
        
        state.isBursting = true;
        state.burstParticles = [];
        
        const centerX = elements.canvas.width / 2;
        const centerY = elements.canvas.height / 2 - 40;
        
        for (let i = 0; i < config.burstParticleCount; i++) {
            const angle = (Math.PI * 2 * i) / config.burstParticleCount + (Math.random() * 0.3 - 0.15);
            const depth = Math.random();
            const speed = (config.burstMinSpeed + Math.random() * (config.burstMaxSpeed - config.burstMinSpeed)) 
                        * (0.7 + depth * 0.6);
            
            state.burstParticles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                z: depth,
                size: (config.burstMinSize + Math.random() * (config.burstMaxSize - config.burstMinSize)) 
                    * (0.6 + depth * 0.7),
                opacity: 1,
                life: 1,
                fadeStart: 0.4 + Math.random() * 0.3,
                drag: 0.96 + (depth * 0.04)
            });
        }
        
        let burstFrame = 0;
        const burstDurationFrames = (config.burstDuration / 1000) * 60;
        
        function updateBurstParticles() {
            if (burstFrame++ > burstDurationFrames) {
                state.isBursting = false;
                state.burstParticles = [];
                return;
            }
            
            state.burstParticles.forEach(bp => {
                bp.vx *= bp.drag;
                bp.vy *= bp.drag;
                bp.x += bp.vx;
                bp.y += bp.vy;
                
                const lifeProgress = burstFrame / burstDurationFrames;
                if (lifeProgress > bp.fadeStart) {
                    const fadeProgress = (lifeProgress - bp.fadeStart) / (1 - bp.fadeStart);
                    bp.opacity = 1 - fadeProgress;
                }
            });
            
            state.burstAnimationId = requestAnimationFrame(updateBurstParticles);
        }
        
        updateBurstParticles();
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 9. ANIMATION ENGINE
     * ═══════════════════════════════════════════════════════════
     */
    
    let cachedGlowFilter = '';
    let lastGlowProgress = -1;

    function updateAnimation(timestamp) {
        if (!state.animationStartTime) {
            state.animationStartTime = timestamp;
        }

        const elapsed = timestamp - state.animationStartTime;
        const duration = state.hasVisited ? config.returnVisitDuration : config.initialVisitDuration;
        
        const logoProgress = Math.min(0.5, elapsed / duration);
        const resourceProgress = state.loadingProgress * 0.5;
        state.animationProgress = logoProgress + resourceProgress;

        const colors = getThemeColors();

        if (elements.barFill) {
            const barProgress = Math.min(1, state.animationProgress);
            elements.barFill.style.width = `${barProgress * 100}%`;
        }

        if (elements.mPath && state.animationProgress > config.logoAnimationStart) {
            const mProgress = Math.min(1, (state.animationProgress - config.logoAnimationStart) / config.logoAnimationDuration);
            const mLength = elements.mPath.getTotalLength();
            if (mLength) {
                elements.mPath.style.strokeDashoffset = mLength * (1 - mProgress);
            }
        }

        if (elements.pPath && state.animationProgress > config.pLetterStart) {
            const pProgress = Math.min(1, (state.animationProgress - config.pLetterStart) / config.pLetterDuration);
            const pLength = elements.pPath.getTotalLength();
            if (pLength) {
                elements.pPath.style.strokeDashoffset = pLength * (1 - pProgress);
            }
        }

        if (state.animationProgress > config.glowStart) {
            const glowProgress = (state.animationProgress - config.glowStart) / (1 - config.glowStart);

            if (Math.abs(glowProgress - lastGlowProgress) > 0.01) {
                if (state.currentTheme === 'light') {
                    const glowIntensity = 1 + (glowProgress * 3);
                    const glowOpacity = 0.3 + (glowProgress * 0.5);
                
                    cachedGlowFilter = `
                        drop-shadow(0 0 ${glowIntensity}px rgba(${colors.glowColorRGB}, ${glowOpacity}))
                        drop-shadow(0 0 ${glowIntensity * 1.5}px rgba(${colors.glowColorRGB}, ${glowOpacity * 0.6}))
                    `.trim();
                } else {
                    const glowIntensity = 8 + (glowProgress * 24);
                    const glowOpacity = 0.3 + (glowProgress * 0.6);
                
                    cachedGlowFilter = `
                      drop-shadow(0 0 ${glowIntensity}px rgba(${colors.glowColorRGB}, ${glowOpacity}))
                      drop-shadow(0 0 ${glowIntensity * 1.5}px rgba(${colors.glowColorRGB}, ${glowOpacity * 0.6}))
                    `.trim();
                }

                lastGlowProgress = glowProgress;
            } 
            
            if (elements.logo) {
                elements.logo.style.filter = cachedGlowFilter;
            }
        }

        const minTime = state.hasVisited ? config.minLoadingTimeReturn : config.minLoadingTimeInitial;
        const minTimeElapsed = (Date.now() - state.startTime) >= minTime;
        const criticalResourcesLoaded = state.loadingProgress >= 0.9;
        const animationComplete = state.animationProgress >= 1.0;

        if (minTimeElapsed && criticalResourcesLoaded && animationComplete) {
            completeLoading();
        } else {
            requestAnimationFrame(updateAnimation);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 10. CLEANUP
     * ═══════════════════════════════════════════════════════════
     */
    
    function cleanupAnimation() {
        state.isAnimating = false;
        state.isBursting = false;
        
        if (state.backgroundAnimationId) {
            cancelAnimationFrame(state.backgroundAnimationId);
            state.backgroundAnimationId = null;
        }
        
        if (state.burstAnimationId) {
            cancelAnimationFrame(state.burstAnimationId);
            state.burstAnimationId = null;
        }
        
        state.particles = [];
        state.burstParticles = [];
        
        if (elements.canvas && ctx) {
            ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        }
        
        state.eventListeners.forEach(({ type, handler }) => {
            window.removeEventListener(type, handler);
        });
        state.eventListeners = [];
    }

    function completeLoading() {
        if (state.isComplete) return;
        
        const elapsed = Date.now() - state.startTime;
        const minTime = state.hasVisited ? config.minLoadingTimeReturn : config.minLoadingTimeInitial;
        const remainingTime = Math.max(0, minTime - elapsed);
        
        const eventDetail = {
            images: state.preloadedResources || {},
            data: state.preloadedResources || {},
            theme: state.currentTheme || 'dark',
            skipped: false,
            loadTime: Date.now() - state.startTime,
            isFirstVisit: !state.hasVisited
        };
        
        setTimeout(() => {
            state.isComplete = true;
            
            if (!state.hasVisited) {
                localStorage.setItem('portfolio-has-visited', 'true');
            }

            const preBurstPause = state.hasVisited ? config.preBurstPauseReturn : config.preBurstPauseInitial;
            
            setTimeout(() => {
                triggerParticleBurst();
                
                setTimeout(() => {
                    cleanupAnimation();
                    
                    document.dispatchEvent(new CustomEvent('loadingComplete', {
                        detail: eventDetail
                    }));

                    if (elements.loadingScreen) {
                        elements.loadingScreen.style.opacity = '0';
                        
                        setTimeout(() => {
                            elements.loadingScreen.style.display = 'none';
                            document.body.classList.remove('loading');
                            document.body.classList.add('loaded');

                            if (elements.canvas) {
                                elements.canvas.remove();
                                ctx = null;
                            }
                        }, 400);
                    }
                }, config.burstDuration);
            }, preBurstPause);
            
        }, remainingTime);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 11. INITIALIZATION
     * ═══════════════════════════════════════════════════════════
     */
    
    function init() {
        state.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        if (elements.loadingScreen) {
            elements.loadingScreen.setAttribute('data-theme', state.currentTheme);
        }
    
        // Initialize canvas FIRST (no delay)
        initParticles();
        
        // Then start preloading
        preloadResources();
        
        // Then start logo animation
        requestAnimationFrame(updateAnimation);
    
        // Safety timeout
        setTimeout(() => {
            if (!state.isComplete) {
                console.warn('Safety timeout - forcing completion');
                completeLoading();
            }
        }, config.maxLoadingTime);
    
        // Resize handler
        resizeHandler = () => {
            if (elements.canvas) {
                elements.canvas.width = window.innerWidth;
                elements.canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', resizeHandler);
        state.eventListeners.push({ type: 'resize', handler: resizeHandler });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupAnimation);
    
    // Check if elements exist, not document state
    if (elements.loadingScreen && elements.canvas) {
        // Elements already exist - start immediately
        console.log('Elements ready - starting immediately');
        init();
    } else {
        // Elements not ready yet - wait for DOM
        console.log('Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', init);
    }
    })();
