/**
 * ═══════════════════════════════════════════════════════════════════
 * SKILLS SPHERE VISUALIZATION - 3D INTERACTIVE NETWORK
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        skills-sphere.js
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Interactive 3D skills network visualization using Three.js.
 *              Features major nodes, satellites, connections, and project
 *              integration with smooth animations and theme adaptation.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * This visualization creates an interactive 3D sphere that:
 * 
 * 1. Displays Core Skills (7 major nodes)
 *    - SQL, Python, Power BI, R, Excel, Git, Machine Learning
 * 
 * 2. Shows Related Technologies (satellite nodes)
 *    - Tools, libraries, frameworks orbiting each skill
 * 
 * 3. Visualizes Relationships (connection mesh)
 *    - Web-like connections showing skill integration
 * 
 * 4. Enables Exploration (interactive controls)
 *    - Drag to rotate, hover for details, click for projects
 * 
 * 5. Integrates Portfolio (project navigation)
 *    - Click projects to scroll to portfolio cards
 * 
 * ───────────────────────────────────────────────────────────────────
 * FEATURES
 * ───────────────────────────────────────────────────────────────────
 * 
 * ✓ 3D sphere with major + satellite nodes
 * ✓ Mesh connections creating web appearance
 * ✓ Drag to rotate (all directions, 360°)
 * ✓ Hover to reveal satellite labels
 * ✓ Click to lock details panel
 * ✓ Auto-rotation when idle
 * ✓ Smooth rotation to selected nodes
 * ✓ Category highlighting via legend
 * ✓ Project integration with portfolio
 * ✓ Fully responsive (desktop + mobile)
 * ✓ Dark/light theme compatible
 * ✓ Logo textures on nodes
 * ✓ Billboard text labels (always face camera)
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * 
 * Required (Load Order):
 * 1. Three.js r128+ (CDN in HTML)
 * 2. skills-sphere-data.js (data configuration)
 * 3. security-utils.js (XSS prevention)
 * 4. skills-sphere.css (styling)
 * 
 * Optional:
 * - script.js (handleSkillsSphereProjectClick)
 * 
 * ───────────────────────────────────────────────────────────────────
 * BROWSER SUPPORT
 * ───────────────────────────────────────────────────────────────────
 * 
 * - Chrome 90+ (full support)
 * - Firefox 88+ (full support)
 * - Safari 14+ (full support)
 * - Edge 90+ (full support)
 * - Mobile Safari iOS 14+ (touch optimized)
 * - Chrome Mobile Android 10+ (touch optimized)
 * 
 * WebGL Required: All modern browsers support WebGL
 * 
 * ───────────────────────────────────────────────────────────────────
 * PERFORMANCE NOTES
 * ───────────────────────────────────────────────────────────────────
 * 
 * Optimizations:
 * - Cached node references (eliminates repeated filtering)
 * - Throttled hover checks (~60fps)
 * - Passive event listeners where possible
 * - Debounced resize handlers
 * - Single-pass node updates
 * - Sprite billboarding via cached array
 * - Texture caching for logos
 * 
 * Target: 60fps on desktop, 30fps on mobile
 * 
 * ───────────────────────────────────────────────────────────────────
 * INTERACTION STATES
 * ───────────────────────────────────────────────────────────────────
 * 
 * 1. IDLE
 *    - Auto-rotation active
 *    - No highlights
 *    - Normal opacity
 * 
 * 2. HOVER (not selected)
 *    - Brightens hovered node + satellites
 *    - Shows details panel (unlocked)
 *    - Pauses auto-rotation
 * 
 * 3. SELECTED (clicked node)
 *    - Locks details panel
 *    - Dims other nodes
 *    - Rotates to center
 *    - Auto-rotation disabled
 * 
 * 4. CATEGORY HIGHLIGHT (legend click)
 *    - Highlights all nodes in category
 *    - Dims other categories
 *    - Mutually exclusive with node selection
 * 
 * 5. DRAGGING
 *    - Manual rotation active
 *    - Pauses auto-rotation
 *    - Prevents hover detection
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. NAMESPACE & CONFIGURATION
 *    - Global variables
 *    - Category colors
 *    - Performance settings
 *    - Satellite positioning
 * 
 * 2. INITIALIZATION
 *    - Dependency checks
 *    - DOM setup
 *    - Resource loading
 * 
 * 3. SCENE SETUP
 *    - Three.js scene
 *    - Camera configuration
 *    - Renderer setup
 *    - Lighting
 * 
 * 4. NODE CREATION
 *    - Major nodes
 *    - Satellite nodes
 *    - Text sprites (labels)
 *    - Logo sprites
 *    - Connections (mesh)
 *    - Performance cache
 * 
 * 5. INTERACTION SYSTEM
 *    - Event listener setup
 *    - Details panel
 *    - Legend panel
 *    - Category highlighting
 * 
 * 6. EVENT HANDLERS
 *    - Mouse events
 *    - Touch events
 *    - Window resize
 * 
 * 7. ANIMATION LOOP
 *    - Rotation updates
 *    - Auto-rotation
 *    - Sprite billboarding
 *    - Rendering
 * 
 * 8. THEME ADAPTATION
 *    - Theme observer
 *    - Color updates
 *    - Sprite regeneration
 * 
 * 9. UTILITIES
 *    - Coordinate conversion
 *    - Sprite positioning
 * 
 * 10. CLEANUP
 *     - Resource disposal
 *     - Event listener removal
 * 
 * 11. INTERACTION LOGIC
 *     - Hover detection
 *     - Node selection
 *     - State management
 * 
 * 12. AUTO-ROTATE TO NODE
 *     - Rotation animation
 *     - Smooth transitions
 * 
 * 13. DETAILS PANEL
 *     - Content updates
 *     - Project handling
 * 
 * 14. MOBILE INTERACTIONS
 *     - Touch optimizations
 *     - Panel collapsing
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  /**
   * ═══════════════════════════════════════════════════════════════
   * 1. NAMESPACE & CONFIGURATION
   * ═══════════════════════════════════════════════════════════════
   * 
   * Global namespace prevents conflicts with other scripts.
   * All sphere functionality encapsulated in SkillsSphereVisualization.
   * 
   * ═══════════════════════════════════════════════════════════════
   */
  
  window.SkillsSphereVisualization = {
    
    /**
     * ───────────────────────────────────────────────────────────
     * Debug Mode
     * ───────────────────────────────────────────────────────────
     * 
     * Set to false for production (removes console logs)
     * Set to true for development/debugging
     */
    DEBUG: true,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Category Color Definitions
     * ───────────────────────────────────────────────────────────
     * 
     * Theme-adaptive colors for each skill category.
     * Dark theme uses brighter colors, light theme uses deeper tones.
     */
    CATEGORY_COLORS: {
      'Core Analytics': { 
        dark: '#6d8dfa',   // Brighter blue for dark mode
        light: '#4a6cf7'   // Deeper blue for light mode
      },
      'Programming': { 
        dark: '#f472b6',   // Brighter pink for dark mode
        light: '#ec4899'   // Deeper pink for light mode
      },
      'Tools': { 
        dark: '#64748b',   // Brighter gray for dark mode
        light: '#475569'   // Deeper gray for light mode
      },
      'Machine Learning': { 
        dark: '#10b981',   // Brighter green for dark mode
        light: '#059669'   // Deeper green for light mode
      }
    },

    /**
     * ───────────────────────────────────────────────────────────
     * Performance Optimization
     * ───────────────────────────────────────────────────────────
     * 
     * Throttle hover checks to ~60fps for better performance.
     * Prevents excessive raycasting calculations.
     */
    lastHoverCheck: 0,
    hoverCheckInterval: 16, // 1000ms / 60fps = 16.67ms
    
    /**
     * ───────────────────────────────────────────────────────────
     * Satellite Rotation Adjustments
     * ───────────────────────────────────────────────────────────
     * 
     * Manually calibrated rotations to prevent satellite overlap
     * with node labels. Each node can have custom angle and distance.
     * 
     * Format:
     * - angle: Rotation offset in radians
     * - distance: Distance multiplier (1.0 = normal)
     */
    SATELLITE_ROTATIONS: {
      'ml': { 
        angle: Math.PI + (Math.PI / 12),  // 195° rotation
        distance: 1.1                      // 10% farther
      },
      'excel': { 
        angle: Math.PI + (Math.PI / 10),  // 198° rotation
        distance: 1.0 
      },
      'sql': { 
        angle: Math.PI * 0.20,             // 36° rotation
        distance: 1.05                     // 5% farther
      },
      'powerbi': { 
        angle: Math.PI * 0.10,             // 18° rotation
        distance: 1.0 
      },
      'r': { 
        angle: Math.PI * 0.30,             // 54° rotation
        distance: 1.0 
      }
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * Camera Configuration
     * ───────────────────────────────────────────────────────────
     * 
     * Default Z position adjusted to fit entire sphere with labels
     * and logos without clipping.
     */
    CAMERA_DEFAULT_Z: 62,  // Increased from 55 to prevent node cutoff
    
    /**
     * ───────────────────────────────────────────────────────────
     * Theme Detection Utility
     * ───────────────────────────────────────────────────────────
     * 
     * Checks current theme from data-theme attribute.
     * Used for color adaptation and sprite generation.
     * 
     * @returns {boolean} true if dark theme, false if light theme
     */
    isDarkTheme: function() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.body.getAttribute('data-theme') === 'dark';
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * Core Three.js Objects
     * ───────────────────────────────────────────────────────────
     */
    scene: null,
    camera: null,
    renderer: null,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Node Arrays
     * ───────────────────────────────────────────────────────────
     */
    nodes: [],           // All nodes (major + satellite)
    connections: [],     // Connection lines
    labels: [],          // Legacy (unused)
    sprites: [],         // Cached sprite array for billboarding
    
    /**
     * ───────────────────────────────────────────────────────────
     * Interaction State
     * ───────────────────────────────────────────────────────────
     */
    raycaster: null,
    mouse: null,
    hoveredNode: null,
    selectedNode: null,
    highlightedCategory: null,
    isDragging: false,
    justFinishedDragging: false,  // Prevents immediate hover after drag
    totalDragDistance: 0,          // Track pixel movement during drag
    dragStartTime: 0,              // Track when drag started
    lastMouseX: 0,
    lastMouseY: 0,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Rotation State
     * ───────────────────────────────────────────────────────────
     */
    autoRotate: true,
    rotationVelocity: { x: 0, y: 0 },
    isAutoRotatingToNode: false,   // Flag for smooth rotation animation
    
    /**
     * ───────────────────────────────────────────────────────────
     * Animation & Resources
     * ───────────────────────────────────────────────────────────
     */
    animationId: null,
    logoTextures: {},              // Cached logo textures
    textureLoader: null,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Container References
     * ───────────────────────────────────────────────────────────
     */
    containerEl: null,
    detailsEl: null,
    canvasElement: null,
    legendEl: null,
    canvasWrapper: null,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Cleanup Tracking (for proper resource management)
     * ───────────────────────────────────────────────────────────
     * 
     * Store bound event handlers for removal during cleanup.
     */
    themeObserver: null,
    resizeObserver: null,
    boundMouseDown: null,
    boundMouseMove: null,
    boundMouseUp: null,
    boundClick: null,
    boundContextMenu: null,
    
    /**
     * ───────────────────────────────────────────────────────────
     * Performance Cache
     * ───────────────────────────────────────────────────────────
     * 
     * Pre-filtered arrays to avoid repeated filtering.
     */
    hoverableNodes: [],      // Nodes that can be hovered
    clickableObjects: [],    // Nodes + logos that can be clicked
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 2. INITIALIZATION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Initialize the skills sphere visualization
     * 
     * Execution order:
     * 1. Dependency checks (Three.js, data, container)
     * 2. Scene setup (camera, renderer, lights)
     * 3. Node creation (major, satellites, connections)
     * 4. Interaction setup (events, raycasting)
     * 5. UI setup (details panel, legend)
     * 6. Animation start
     * 
     * @returns {void}
     */
    init: function() {
      if (this.DEBUG) console.log('Initializing Skills Sphere Visualization...');
      
      try {
        /**
         * ─────────────────────────────────────────────────────────
         * Dependency Checks
         * ─────────────────────────────────────────────────────────
         */
        
        // Check for Three.js
        if (typeof THREE === 'undefined') {
          console.error('ERROR: THREE.js is required. Load it via CDN in HTML.');
          return;
        }
        if (this.DEBUG) console.log('✓ THREE.js loaded');
        
        // Check for data
        if (typeof SKILLS_SPHERE_DATA === 'undefined') {
          console.error('ERROR: skills-sphere-data.js must be loaded first.');
          return;
        }
        if (this.DEBUG) console.log('✓ Data loaded');
        
        // Get container
        this.containerEl = document.getElementById('skills-sphere-container');
        if (!this.containerEl) {
          console.error('ERROR: Container #skills-sphere-container not found in DOM.');
          return;
        }
        if (this.DEBUG) console.log('✓ Container found');
        
        /**
         * ─────────────────────────────────────────────────────────
         * Resource Loading
         * ─────────────────────────────────────────────────────────
         */
        
        // Initialize texture loader for logos
        this.textureLoader = new THREE.TextureLoader();
        if (this.DEBUG) console.log('✓ Texture loader initialized');
        
        /**
         * ─────────────────────────────────────────────────────────
         * Scene Setup
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Setting up scene...');
        this.setupScene();
        
        if (this.DEBUG) console.log('Setting up camera...');
        this.setupCamera();
        
        if (this.DEBUG) console.log('Setting up renderer...');
        this.setupRenderer();
        
        if (this.DEBUG) console.log('Setting up lights...');
        this.setupLights();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Node Creation
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Creating nodes...');
        this.createNodes();
        
        if (this.DEBUG) console.log('Creating connections...');
        this.createConnections();

        /**
         * ─────────────────────────────────────────────────────────
         * Performance Optimization
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Caching node references...');
        this.cacheNodeReferences();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Interaction & UI Setup
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Setting up interaction...');
        this.setupInteraction();
        
        if (this.DEBUG) console.log('Setting up details panel...');
        this.setupDetailsPanel();
        this.setupDetailsShadowOptimization();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Responsive Handling
         * ─────────────────────────────────────────────────────────
         */
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        /**
         * ─────────────────────────────────────────────────────────
         * Theme & Mobile Setup
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Setting up theme observer...');
        this.initThemeObserver();
        
        if (this.DEBUG) console.log('Setting up mobile interactions...');
        this.setupMobileInteractions();
        
        /**
         * ─────────────────────────────────────────────────────────
         * Start Animation
         * ─────────────────────────────────────────────────────────
         */
        
        if (this.DEBUG) console.log('Starting animation...');
        this.animate();
        
        if (this.DEBUG) console.log('✓ Skills Sphere initialized successfully!');
        
      } catch (error) {
        console.error('ERROR: Initialization error:', error);
        console.error('Stack trace:', error.stack);
      }
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 3. SCENE SETUP
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Create Three.js scene
     * 
     * Background is transparent to inherit page background.
     * Allows glassmorphism effects to show through.
     * 
     * @returns {void}
     */
    setupScene: function() {
      this.scene = new THREE.Scene();
      this.scene.background = null; // Transparent background
    },
    
    /**
     * Configure camera
     * 
     * Uses perspective camera for 3D depth perception.
     * FOV of 38° provides balanced view without distortion.
     * 
     * @returns {void}
     */
    setupCamera: function() {
      // Default dimensions (updated after renderer creates wrapper)
      const width = 800;
      const height = 750;
      
      this.camera = new THREE.PerspectiveCamera(
        38,                    // FOV (narrower prevents clipping)
        width / height,        // Aspect ratio
        0.1,                   // Near clipping
        1000                   // Far clipping
      );
      
      // Move camera back to fit entire sphere with labels/logos
      this.camera.position.z = this.CAMERA_DEFAULT_Z;
    },
    
    /**
     * Setup WebGL renderer
     * 
     * Creates canvas element and wrapper div.
     * Adds instructions and attribution overlays.
     * Updates size after DOM insertion for accurate measurements.
     * 
     * @returns {void}
     */
    setupRenderer: function() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,      // Smooth edges
        alpha: true           // Transparent background
      });
      
      // Initial size (updated after wrapper insertion)
      this.renderer.setSize(800, 750, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      const canvas = this.renderer.domElement;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Content Area
       * ─────────────────────────────────────────────────────────
       */
      
      let contentArea = document.getElementById('skills-sphere-content');
      if (!contentArea) {
        if (this.DEBUG) console.log('Content area not found, creating it');
        contentArea = document.createElement('div');
        contentArea.id = 'skills-sphere-content';
        contentArea.className = 'skills-sphere-content';
        this.containerEl.appendChild(contentArea);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Add Instructions Overlay
       * ─────────────────────────────────────────────────────────
       */
      
      if (!document.querySelector('.skills-sphere-instructions')) {
        const instructions = document.createElement('div');
        instructions.className = 'skills-sphere-instructions';
        instructions.textContent = 'Drag to rotate • Hover to explore • Click to lock details';
        this.containerEl.appendChild(instructions);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Add Attribution
       * ─────────────────────────────────────────────────────────
       */
      
      if (!document.querySelector('.skills-sphere-attribution')) {
        const attribution = document.createElement('div');
        attribution.className = 'skills-sphere-attribution';
        attribution.textContent = 'Built with Three.js for interactive 3D visualization';
        this.containerEl.appendChild(attribution);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Canvas Wrapper
       * ─────────────────────────────────────────────────────────
       */
      
      const canvasWrapper = document.createElement('div');
      canvasWrapper.className = 'skills-sphere-canvas-wrapper';
      canvasWrapper.appendChild(canvas);
      
      // Add to content area (first column in grid)
      contentArea.appendChild(canvasWrapper);
      
      // Store reference
      this.canvasWrapper = canvasWrapper;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Update Size After DOM Insertion
       * ─────────────────────────────────────────────────────────
       * 
       * Wait for grid layout to calculate, then measure wrapper
       * and update camera/renderer accordingly.
       */
      
      setTimeout(() => {
        const wrapperWidth = canvasWrapper.clientWidth - 8;   // Subtract padding
        const wrapperHeight = canvasWrapper.clientHeight - 8; // Subtract padding
        
        if (this.DEBUG) console.log('Canvas wrapper size:', wrapperWidth, 'x', wrapperHeight);
        
        if (wrapperWidth > 0 && wrapperHeight > 0) {
          this.camera.aspect = wrapperWidth / wrapperHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(wrapperWidth, wrapperHeight, false);
        } else {
          if (this.DEBUG) console.warn('Canvas wrapper has no size, using fallback');
          // Fallback dimensions
          const fallbackWidth = 600;
          const fallbackHeight = 550;
          this.camera.aspect = fallbackWidth / fallbackHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(fallbackWidth, fallbackHeight, false);
        }
      }, 100); // Wait for grid layout calculation
    },
    
    /**
     * Setup scene lighting
     * 
     * Combination of ambient (overall illumination) and directional
     * (creates depth/shadows) lights for balanced appearance.
     * 
     * @returns {void}
     */
    setupLights: function() {
      // Ambient light - soft overall illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      
      // Directional light - creates depth perception
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight.position.set(10, 10, 10);
      this.scene.add(directionalLight);
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 4. NODE CREATION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Create all nodes (major + satellites)
     * 
     * Iterates through SKILLS_SPHERE_DATA.majorNodes and creates:
     * - Major node sphere
     * - Text label sprite
     * - Logo sprite (if icon URL provided)
     * - Satellite nodes
     * 
     * @returns {void}
     */
    createNodes: function() {
      const data = SKILLS_SPHERE_DATA;
      const config = data.config;
      
      // Create major nodes (and their satellites)
      data.majorNodes.forEach(nodeData => {
        this.createMajorNode(nodeData, config);
      });
    },
    
    /**
     * Create a major skill node
     * 
     * Major nodes are:
     * - Large spheres (2.0 radius by default)
     * - Positioned via spherical coordinates
     * - Flat shading with glow (MeshBasicMaterial)
     * - 85% opaque to allow logos to show through
     * 
     * @param {Object} nodeData - Node configuration from data file
     * @param {Object} config - Visual configuration
     * @returns {void}
     */
    createMajorNode: function(nodeData, config) {
      /**
       * ─────────────────────────────────────────────────────────
       * Convert Spherical to Cartesian Coordinates
       * ─────────────────────────────────────────────────────────
       */
      
      const pos = this.sphericalToCartesian(
        nodeData.theta,
        nodeData.phi,
        config.sphereRadius
      );
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Sphere Geometry
       * ─────────────────────────────────────────────────────────
       * 
       * High segment count (64x64) for smooth appearance.
       * MeshBasicMaterial for flat, glowing look.
       */
      
      const geometry = new THREE.SphereGeometry(config.majorNodeSize, 64, 64);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeData.color),
        transparent: true,
        opacity: 0.85  // 85% opaque - allows logos to show through
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.scale.set(1, 1, 1); // Perfect sphere
      
      /**
       * ─────────────────────────────────────────────────────────
       * Store Metadata
       * ─────────────────────────────────────────────────────────
       * 
       * userData stores all node properties for interaction:
       * - type: 'major' (distinguishes from satellites)
       * - id: Unique identifier (e.g., 'python', 'powerbi')
       * - label: Display name
       * - category: Skill category (for legend/filtering)
       * - projects: Linked portfolio projects
       * - originalColor: For theme restoration
       */
      
      mesh.userData = {
        type: 'major',
        id: nodeData.id,
        label: nodeData.label,
        displayName: nodeData.displayName,     // Optional display name
        category: nodeData.category,
        color: nodeData.color,
        icon: nodeData.icon,
        satellites: nodeData.satellites,
        description: nodeData.description,
        projects: nodeData.projects || [],
        credentials: nodeData.credentials || [],
        originalColor: nodeData.color,
        originalEmissiveIntensity: 0.4
      };
      
      this.scene.add(mesh);
      this.nodes.push(mesh);
      
      /**
       * ─────────────────────────────────────────────────────────
       * Load Logo (if URL provided)
       * ─────────────────────────────────────────────────────────
       */
      
      if (nodeData.icon && nodeData.icon.startsWith('http')) {
        this.loadLogoForNode(nodeData.icon, mesh);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Text Label Sprite
       * ─────────────────────────────────────────────────────────
       * 
       * Billboard effect: always faces camera
       */
      
      this.createTextSprite(nodeData.label, mesh);
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Satellites
       * ─────────────────────────────────────────────────────────
       */
      
      this.createSatellites(nodeData, config);
    },
    
    /**
     * Create text sprite label for a node
     * 
     * Labels are rendered as canvas textures and always face the camera
     * (billboard effect). Theme-adaptive text and shadow colors.
     * 
     * @param {string} text - Label text to display
     * @param {THREE.Mesh} parentNode - Node this label belongs to
     * @param {boolean} isDark - Optional theme override
     * @returns {void}
     */
    createTextSprite: function(text, parentNode, isDark) {
      // Auto-detect theme if not provided
      if (isDark === undefined) {
        isDark = this.isDarkTheme();
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Canvas for Text Rendering
       * ─────────────────────────────────────────────────────────
       */
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;   // Power of 2 for better GPU performance
      canvas.height = 128;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Theme-Adaptive Colors
       * ─────────────────────────────────────────────────────────
       */
      
      const textColor = isDark ? 'rgba(248, 249, 250, 1)' : 'rgba(0, 0, 0, 0.95)';
      const shadowColor = isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      
      /**
       * ─────────────────────────────────────────────────────────
       * Draw Text with Shadow
       * ─────────────────────────────────────────────────────────
       */
      
      context.fillStyle = textColor;
      context.font = 'bold 54px Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Text shadow for better visibility
      context.shadowColor = shadowColor;
      context.shadowBlur = 10;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      
      context.fillText(text, 256, 64);
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Sprite from Canvas
       * ─────────────────────────────────────────────────────────
       */
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false,  // Always visible on top
        depthWrite: false
      });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(8, 2, 1); // Readable size
      
      // Store reference (needed for positioning)
      parentNode.userData.sprite = sprite;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Position Using Camera-Relative Method
       * ─────────────────────────────────────────────────────────
       * 
       * Prevents obstruction at steep camera angles.
       * Adaptive positioning based on camera angle.
       */
      
      this.positionSpriteTowardCamera(sprite, parentNode, 2.5);
      
      this.scene.add(sprite);
      this.sprites.push(sprite); // Cache for billboarding
    },
    
    /**
     * Load logo texture for a node
     * 
     * Checks texture cache first to avoid redundant loads.
     * Loads via TextureLoader, then creates sprite.
     * 
     * @param {string} iconUrl - URL to logo image
     * @param {THREE.Mesh} parentNode - Node to attach logo to
     * @returns {void}
     */
    loadLogoForNode: function(iconUrl, parentNode) {
      // Check cache first
      if (this.logoTextures[iconUrl]) {
        this.createLogoInsideNode(this.logoTextures[iconUrl], parentNode);
        return;
      }
      
      // Load texture
      this.textureLoader.load(
        iconUrl,
        (texture) => {
          // Cache it
          this.logoTextures[iconUrl] = texture;
          this.createLogoInsideNode(texture, parentNode);
        },
        undefined,
        (error) => {
          console.warn(`Failed to load logo: ${iconUrl}`, error);
        }
      );
    },
    
    /**
     * Create logo sprite inside node
     * 
     * Logos are positioned at the exact center of parent node.
     * Sized to fit inside node sphere (2.5 scale vs 2.0 radius).
     * Always faces camera (billboard).
     * 
     * @param {THREE.Texture} texture - Loaded texture
     * @param {THREE.Mesh} parentNode - Node to attach to
     * @returns {void}
     */
    createLogoInsideNode: function(texture, parentNode) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,  // Always visible
        depthWrite: true,
        alphaTest: 0.5     // Discard transparent pixels
      });
      
      const logoSprite = new THREE.Sprite(spriteMaterial);
      logoSprite.scale.set(2.5, 2.5, 1); // Fit inside node
      
      // Position at center of parent node
      logoSprite.position.copy(parentNode.position);
      
      // Link logo to parent for click detection
      logoSprite.userData = {
        type: 'logo',
        parentNode: parentNode
      };
      
      // Store reference
      parentNode.userData.logoSprite = logoSprite;
      
      this.scene.add(logoSprite);
      this.sprites.push(logoSprite); // Cache for billboarding
    },
    
    /**
     * Create satellite nodes around a major node
     * 
     * Satellites are distributed in a ring around the parent node
     * in its tangent plane (perpendicular to sphere radius).
     * 
     * Process:
     * 1. Calculate parent's tangent plane
     * 2. Distribute satellites evenly around ring
     * 3. Add deterministic variation for organic appearance
     * 4. Apply custom rotation/distance adjustments (if defined)
     * 
     * @param {Object} parentData - Parent node configuration
     * @param {Object} config - Visual configuration
     * @returns {void}
     */
    createSatellites: function(parentData, config) {
      /**
       * ─────────────────────────────────────────────────────────
       * Get Parent Position
       * ─────────────────────────────────────────────────────────
       */
      
      const parentPos = this.sphericalToCartesian(
        parentData.theta,
        parentData.phi,
        config.sphereRadius
      );
      
      const parentPosVec = new THREE.Vector3(parentPos.x, parentPos.y, parentPos.z);
      
      if (this.DEBUG) {
        console.log(`Creating ${parentData.satellites.length} satellites for ${parentData.label}`);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Pre-calculate Seeds
       * ─────────────────────────────────────────────────────────
       * 
       * Deterministic pseudo-random for consistent positioning.
       */
      
      const seedBase = parentData.id.length * 13;
      const distanceSeedBase = parentData.label.length * 17;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Each Satellite
       * ─────────────────────────────────────────────────────────
       */
      
      parentData.satellites.forEach((satName, index) => {
        /**
         * ───────────────────────────────────────────────────────
         * Calculate Base Angle
         * ───────────────────────────────────────────────────────
         * 
         * Distribute evenly around ring (360° / count).
         */
        
        const baseAngle = (index / parentData.satellites.length) * Math.PI * 2;
        
        /**
         * ───────────────────────────────────────────────────────
         * Add Deterministic Variation
         * ───────────────────────────────────────────────────────
         * 
         * ±0.15 radians (~8.6 degrees) for organic appearance.
         */
        
        const seed = (index * 7 + seedBase) % 100;
        const angleVariation = ((seed / 100) - 0.5) * 0.3;
        let angle = baseAngle + angleVariation;
        
        /**
         * ───────────────────────────────────────────────────────
         * Apply Custom Rotation (if defined)
         * ───────────────────────────────────────────────────────
         */
        
        const rotation = this.SATELLITE_ROTATIONS[parentData.id];
        if (rotation) {
          angle += rotation.angle;
        }
        
        /**
         * ───────────────────────────────────────────────────────
         * Calculate Distance with Variation
         * ───────────────────────────────────────────────────────
         * 
         * ±15% variation for organic clustering.
         */
        
        const distanceSeed = (index * 11 + distanceSeedBase) % 100;
        const distanceVariation = 0.85 + (distanceSeed / 100) * 0.3; // 0.85 to 1.15
        let offset = config.satelliteDistance * config.sphereRadius * distanceVariation;
        
        /**
         * ───────────────────────────────────────────────────────
         * Apply Distance Adjustment (if defined)
         * ───────────────────────────────────────────────────────
         */
        
        if (rotation && rotation.distance) {
          offset *= rotation.distance;
        }
        
        /**
         * ───────────────────────────────────────────────────────
         * Calculate Tangent Plane Vectors
         * ───────────────────────────────────────────────────────
         * 
         * Two perpendicular vectors in plane perpendicular to
         * sphere radius at parent position.
         */
        
        const parentNormal = parentPosVec.clone().normalize();
        const tangent1 = new THREE.Vector3();
        const tangent2 = new THREE.Vector3();
        
        // Choose arbitrary vector not parallel to normal
        const arbitrary = Math.abs(parentNormal.y) < 0.9 
          ? new THREE.Vector3(0, 1, 0) 
          : new THREE.Vector3(1, 0, 0);
        
        tangent1.crossVectors(parentNormal, arbitrary).normalize();
        tangent2.crossVectors(parentNormal, tangent1).normalize();
        
        /**
         * ───────────────────────────────────────────────────────
         * Calculate Satellite Position
         * ───────────────────────────────────────────────────────
         */
        
        const ringX = Math.cos(angle) * offset;
        const ringY = Math.sin(angle) * offset;
        
        const satPos = parentPosVec.clone()
          .add(tangent1.clone().multiplyScalar(ringX))
          .add(tangent2.clone().multiplyScalar(ringY));
        
        /**
         * ───────────────────────────────────────────────────────
         * Create Satellite Mesh
         * ───────────────────────────────────────────────────────
         */
        
        const geometry = new THREE.SphereGeometry(config.satelliteNodeSize, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(parentData.color),
          transparent: true,
          opacity: 0.7  // 70% opaque for satellites
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(satPos);
        mesh.scale.set(1, 1, 1); // Perfect sphere
        
        /**
         * ───────────────────────────────────────────────────────
         * Store Metadata
         * ───────────────────────────────────────────────────────
         */
        
        mesh.userData = {
          type: 'satellite',
          label: satName,
          parentId: parentData.id,
          color: parentData.color,
          originalOpacity: 0.7,
          originalEmissiveIntensity: 0.3
        };
        
        this.scene.add(mesh);
        this.nodes.push(mesh);
      });
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * CONNECTIONS (Web Mesh)
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Create connection lines between nodes
     * 
     * Creates two types of connections:
     * 1. Major node ↔ Major node (skill relationships)
     * 2. Major node → Satellite (tool relationships)
     * 
     * @returns {void}
     */
    createConnections: function() {
      const data = SKILLS_SPHERE_DATA;
      const config = data.config;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Connection Material
       * ─────────────────────────────────────────────────────────
       */
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x475569,                        // Gray color
        transparent: true,
        opacity: config.connectionOpacity,      // 0.4 by default
        linewidth: config.connectionWidth       // 2.5 by default
      });
      
      /**
       * ─────────────────────────────────────────────────────────
       * Major Node Connections
       * ─────────────────────────────────────────────────────────
       * 
       * Defined in SKILLS_SPHERE_DATA.connections
       * Example: ['python', 'sql'], ['powerbi', 'excel']
       */
      
      data.connections.forEach(([id1, id2]) => {
        const node1 = this.nodes.find(n => n.userData.id === id1);
        const node2 = this.nodes.find(n => n.userData.id === id2);
        
        if (node1 && node2) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            node1.position,
            node2.position
          ]);
          
          const line = new THREE.Line(geometry, lineMaterial.clone());
          line.userData = {
            type: 'connection',
            nodes: [id1, id2],
            originalOpacity: config.connectionOpacity
          };
          
          this.scene.add(line);
          this.connections.push(line);
        }
      });
      
      /**
       * ─────────────────────────────────────────────────────────
       * Satellite Connections
       * ─────────────────────────────────────────────────────────
       * 
       * Connect each major node to its satellites.
       */
      
      data.majorNodes.forEach(majorData => {
        const majorNode = this.nodes.find(n => n.userData.id === majorData.id);
        if (!majorNode) return;
        
        const satellites = this.nodes.filter(n => 
          n.userData.type === 'satellite' && n.userData.parentId === majorData.id
        );
        
        satellites.forEach(sat => {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            majorNode.position,
            sat.position
          ]);
          
          const line = new THREE.Line(geometry, lineMaterial.clone());
          line.userData = {
            type: 'satellite-connection',
            parentId: majorData.id,
            originalOpacity: config.connectionOpacity
          };
          
          this.scene.add(line);
          this.connections.push(line);
        });
      });
    },

    /**
     * ═══════════════════════════════════════════════════════════
     * PERFORMANCE OPTIMIZATION - CACHE NODE REFERENCES
     * ═══════════════════════════════════════════════════════════
     * 
     * Pre-filter node arrays to avoid repeated filtering during
     * hover checks and click detection (~60 times per second).
     * 
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Cache filtered node arrays for performance
     * 
     * Creates:
     * - hoverableNodes: Major + satellite nodes (for hover detection)
     * - clickableObjects: Nodes + logos (for click detection)
     * 
     * @returns {void}
     */
    cacheNodeReferences: function() {
      /**
       * ─────────────────────────────────────────────────────────
       * Hoverable Nodes
       * ─────────────────────────────────────────────────────────
       * 
       * Used in checkHover() which runs ~60 times per second.
       */
      
      this.hoverableNodes = this.nodes.filter(n => 
        n.userData.type === 'major' || n.userData.type === 'satellite'
      );
      
      /**
       * ─────────────────────────────────────────────────────────
       * Clickable Objects
       * ─────────────────────────────────────────────────────────
       * 
       * Includes both nodes and logo sprites.
       */
      
      this.clickableObjects = [];
      this.nodes.forEach(n => {
        if (n.userData.type === 'major' || n.userData.type === 'satellite') {
          this.clickableObjects.push(n);
        }
        if (n.userData.logoSprite) {
          this.clickableObjects.push(n.userData.logoSprite);
        }
      });
      
      if (this.DEBUG) {
        console.log(`Cached ${this.hoverableNodes.length} hoverable nodes and ${this.clickableObjects.length} clickable objects`);
      }
    },

    /**
     * ═══════════════════════════════════════════════════════════
     * 5. INTERACTION SYSTEM
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Setup mouse and touch interaction
     * 
     * Event Listeners:
     * - mousedown (canvas): Initiate drag
     * - mousemove (window): Track movement (continuous)
     * - mouseup (window): End drag (catch outside canvas)
     * - click (canvas): Node selection
     * - touchstart/move/end: Mobile gestures
     * 
     * CRITICAL: mousemove/mouseup on WINDOW, not canvas!
     * This ensures drag continues even when mouse leaves canvas.
     * 
     * @returns {void}
     */
    setupInteraction: function() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      
      // Cache canvas reference
      this.canvasElement = this.renderer.domElement;
      const canvas = this.renderer.domElement;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Store Bound Functions (for cleanup)
       * ─────────────────────────────────────────────────────────
       */
      
      this.boundMouseDown = this.onMouseDown.bind(this);
      this.boundMouseMove = this.onMouseMove.bind(this);
      this.boundMouseUp = this.onMouseUp.bind(this);
      this.boundClick = this.onClick.bind(this);
      this.boundContextMenu = this.onContextMenu.bind(this);
      
      // SAFARI FIX: Bind touch handlers for consistency
      this.boundTouchStart = this.onTouchStart.bind(this);
      this.boundTouchMove = this.onTouchMove.bind(this);
      this.boundTouchEnd = this.onTouchEnd.bind(this);
      
      /**
       * ─────────────────────────────────────────────────────────
       * SAFARI FIX: Touch/Mouse Conflict Prevention
       * ─────────────────────────────────────────────────────────
       * 
       * Safari Desktop sometimes fires both touch AND mouse events.
       * This flag prevents conflicts.
       */
      
      this.touchActive = false;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Mouse Events
       * ─────────────────────────────────────────────────────────
       * 
       * SAFARI FIX: { passive: false } required for preventDefault()
       * Safari won't allow preventDefault in passive listeners.
       */
      
      // Canvas events
      canvas.addEventListener('mousedown', this.boundMouseDown, { passive: false });
      canvas.addEventListener('click', this.boundClick);
      canvas.addEventListener('contextmenu', this.boundContextMenu);
      
      // Window events (CRITICAL for continuous tracking)
      window.addEventListener('mousemove', this.boundMouseMove, { passive: false });
      window.addEventListener('mouseup', this.boundMouseUp, { passive: false });
      
      /**
       * ─────────────────────────────────────────────────────────
       * Touch Events (Mobile)
       * ─────────────────────────────────────────────────────────
       */
      
      canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
      canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
      canvas.addEventListener('touchend', this.boundTouchEnd);
      
      /**
       * ─────────────────────────────────────────────────────────
       * Cursor Style
       * ─────────────────────────────────────────────────────────
       */
      
      canvas.style.cursor = 'grab';
    },
    
    /**
     * Setup details panel HTML structure
     * 
     * Creates:
     * - Sidebar container
     * - Legend panel (categories)
     * - Details panel (node info)
     * 
     * @returns {void}
     */
    setupDetailsPanel: function() {
      let detailsPanel = document.getElementById('skills-sphere-details');
      
      if (!detailsPanel) {
        const contentArea = document.getElementById('skills-sphere-content');
        if (!contentArea) {
          console.error('Content area not found for sidebar');
          return;
        }
        
        /**
         * ─────────────────────────────────────────────────────────
         * Create Sidebar HTML
         * ─────────────────────────────────────────────────────────
         */
        
        const panelHTML = `
          <div class="skills-sphere-sidebar">
            <div class="skills-sphere-panel skills-sphere-legend">
              <h3>${SKILLS_SPHERE_DATA.labels.legendTitle}</h3>
              <div class="skills-sphere-legend-items" id="skills-sphere-legend-items"></div>
            </div>
            
            <div class="skills-sphere-panel skills-sphere-details" id="skills-sphere-details">
              <div class="skills-sphere-details-empty">
                ${SKILLS_SPHERE_DATA.labels.detailsPanelEmpty}
              </div>
            </div>
          </div>
        `;
        
        contentArea.insertAdjacentHTML('beforeend', panelHTML);
        
        // Populate legend
        this.populateLegend();
      }
      
      this.detailsEl = document.getElementById('skills-sphere-details');
      
      // Setup scroll visibility
      this.setupScrollbarVisibility();
    },
    
    /**
     * Setup scrollbar visibility detection
     * 
     * Shows scrollbar while scrolling, hides after 1s of inactivity.
     * Improves UX by not showing scrollbar until needed.
     * 
     * @returns {void}
     */
    setupScrollbarVisibility: function() {
      const detailsContent = document.querySelector('.skills-sphere-details-content');
      if (!detailsContent) return;
      
      let scrollTimeout;
      
      detailsContent.addEventListener('scroll', () => {
        // Show scrollbar
        detailsContent.classList.add('scrolling');
        
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Hide after 1 second of no scroll
        scrollTimeout = setTimeout(() => {
          detailsContent.classList.remove('scrolling');
        }, 1000);
      });
    },
    
    /**
     * Populate legend with categories
     * 
     * Creates clickable legend items for each category.
     * Clicking a category highlights all nodes in that category.
     * 
     * @returns {void}
     */
    populateLegend: function() {
      const legendEl = document.getElementById('skills-sphere-legend-items');
      if (!legendEl) return;
      
      /**
       * ─────────────────────────────────────────────────────────
       * Get Unique Categories
       * ─────────────────────────────────────────────────────────
       */
      
      const categories = {};
      SKILLS_SPHERE_DATA.majorNodes.forEach(node => {
        if (!categories[node.category]) {
          categories[node.category] = node.color;
        }
      });
      
      /**
       * ─────────────────────────────────────────────────────────
       * Create Legend Items
       * ─────────────────────────────────────────────────────────
       */
      
      Object.keys(categories).forEach(category => {
        const item = document.createElement('div');
        item.className = 'skills-sphere-legend-item';
        item.setAttribute('data-category', category);
        item.setAttribute('data-original-color', categories[category]);
        item.innerHTML = `
          <div class="skills-sphere-legend-dot" style="background: ${categories[category]}; box-shadow: 0 0 8px ${categories[category]}"></div>
          <span>${category}</span>
        `;
        
        // Make clickable
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => this.handleLegendClick(category));
        
        legendEl.appendChild(item);
      });
      
      // Store reference for theme updates
      this.legendEl = legendEl;
    },
    
    /**
     * Handle legend category click
     * 
     * Behavior:
     * - Click once: Highlight category
     * - Click again: Clear highlight
     * - Mutually exclusive with node selection
     * 
     * @param {string} category - Category name to highlight
     * @returns {void}
     */
    handleLegendClick: function(category) {
      // Clear node selection (mutually exclusive)
      if (this.selectedNode) {
        this.clearSelection();
      }
      
      // Toggle category highlight
      if (this.highlightedCategory === category) {
        this.clearCategoryHighlight();
        this.highlightedCategory = null;
      } else {
        this.highlightCategory(category);
        this.highlightedCategory = category;
      }
    },
    
    /**
     * Highlight all nodes in a category
     * 
     * @param {string} category - Category to highlight
     * @returns {void}
     */
    highlightCategory: function(category) {
      this.clearCategoryHighlight();
      
      // Dim all nodes first
      this.nodes.forEach(node => {
        if (node.userData.type === 'major') {
          node.material.opacity = 0.3;
          node.material.emissiveIntensity = 0.1;
        } else if (node.userData.type === 'satellite') {
          node.material.opacity = 0.1;
        }
      });
      
      // Dim all connections
      this.connections.forEach(conn => {
        conn.material.opacity = 0.05;
      });
      
      // Highlight category nodes
      this.nodes.forEach(node => {
        if (node.userData.type === 'major' && node.userData.category === category) {
          node.material.opacity = 1.0;
          node.material.emissiveIntensity = 0.7;
          node.scale.set(1.2, 1.2, 1.2);
          
          // Highlight satellites
          this.nodes.forEach(sat => {
            if (sat.userData.type === 'satellite' && sat.userData.parentId === node.userData.id) {
              sat.material.opacity = 0.8;
              sat.material.emissiveIntensity = 0.4;
            }
          });
          
          // Highlight connections
          this.connections.forEach(conn => {
            if (conn.userData.parentId === node.userData.id ||
                (conn.userData.nodes && 
                 (conn.userData.nodes[0] === node.userData.id || 
                  conn.userData.nodes[1] === node.userData.id))) {
              conn.material.opacity = 0.4;
            }
          });
        }
      });
      
      // Highlight legend item
      const legendItems = document.querySelectorAll('.skills-sphere-legend-item');
      legendItems.forEach(item => {
        if (item.getAttribute('data-category') === category) {
          item.classList.add('active');
        }
      });
    },
    
    /**
     * Clear category highlight
     * 
     * Restores all nodes to default opacity.
     * 
     * @returns {void}
     */
    clearCategoryHighlight: function() {
      // Reset nodes to default opacity
      this.nodes.forEach(node => {
        if (node.userData.type === 'major') {
          node.material.opacity = 0.85;
          node.material.emissiveIntensity = node.userData.originalEmissiveIntensity;
          node.scale.set(1, 1, 1);
        } else if (node.userData.type === 'satellite') {
          node.material.opacity = 0.7;
          node.material.emissiveIntensity = node.userData.originalEmissiveIntensity;
        }
      });
      
      // Reset connections
      this.connections.forEach(conn => {
        conn.material.opacity = conn.userData.originalOpacity;
      });
      
      // Remove legend highlight
      const legendItems = document.querySelectorAll('.skills-sphere-legend-item');
      legendItems.forEach(item => {
        item.classList.remove('active');
      });
    },
    
    /**
     * Setup shadow optimization for details panel
     * 
     * Removes box-shadow when panel is full-height to improve performance.
     * Uses ResizeObserver with debouncing.
     * 
     * @returns {void}
     */
    setupDetailsShadowOptimization: function() {
      const detailsPanel = document.querySelector('.skills-sphere-details');
      if (!detailsPanel) return;
      
      const sidebarPanel = detailsPanel.closest('.skills-sphere-panel');
      
      // Debounce resize events
      let resizeTimeout;
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const panelHeight = detailsPanel.offsetHeight;
          const sidebar = detailsPanel.closest('.skills-sphere-sidebar');
          const sidebarHeight = sidebar ? sidebar.offsetHeight : 0;
          
          if (sidebarHeight - panelHeight < 160) {
            detailsPanel.classList.add('full-height');
            if (sidebarPanel) {
              sidebarPanel.classList.add('details-full-height');
            }
          } else {
            detailsPanel.classList.remove('full-height');
            if (sidebarPanel) {
              sidebarPanel.classList.remove('details-full-height');
            }
          }
        }, 100);
      });
      
      this.resizeObserver.observe(detailsPanel);
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 6. EVENT HANDLERS
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Mouse down handler
     * 
     * Initiates drag operation.
     * Only responds to left-click (button 0).
     * 
     * @param {MouseEvent} event - Mouse event
     * @returns {void}
     */
    onMouseDown: function(event) {
      // SAFARI FIX: Ignore mouse events if touch is active
      if (this.touchActive) return;
      
      // Only left-click
      if (event.button !== 0) return;
      
      this.isDragging = true;
      this.autoRotate = false;
      this.isAutoRotatingToNode = false;
      this.totalDragDistance = 0;
      this.dragStartTime = Date.now();
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      this.canvasElement.style.cursor = 'grabbing';
    },
    
    /**
     * Mouse move handler
     * 
     * Handles both:
     * 1. Drag rotation (when isDragging)
     * 2. Hover detection (when not dragging)
     * 
     * Bound to WINDOW for continuous tracking.
     * 
     * @param {MouseEvent} event - Mouse event
     * @returns {void}
     */
    onMouseMove: function(event) {
      // SAFARI FIX: Ignore mouse events if touch is active
      if (this.touchActive) return;

      const rect = this.canvasElement.getBoundingClientRect();
      
      // Check if inside canvas
      const isInsideCanvas = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
      
      // Update mouse position (for raycasting)
      if (isInsideCanvas) {
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
      
      if (this.isDragging) {
        /**
         * ─────────────────────────────────────────────────────────
         * Drag Rotation
         * ─────────────────────────────────────────────────────────
         */
        
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        
        // Track total distance
        this.totalDragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        
        // Apply rotation velocity (increased sensitivity)
        this.rotationVelocity.y = deltaX * 0.008;
        this.rotationVelocity.x = deltaY * 0.008;
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        
      } else if (!this.justFinishedDragging && isInsideCanvas) {
        /**
         * ─────────────────────────────────────────────────────────
         * Hover Detection
         * ─────────────────────────────────────────────────────────
         */
        
        this.checkHover();
        
      } else if (!isInsideCanvas && this.hoveredNode && !this.selectedNode) {
        /**
         * ─────────────────────────────────────────────────────────
         * Clear Hover (Mouse Left Canvas)
         * ─────────────────────────────────────────────────────────
         */
        
        this.clearHover();
      }
    },
    
    /**
     * Mouse up handler
     * 
     * Ends drag operation.
     * Resumes auto-rotation after delay.
     * 
     * @returns {void}
     */
    onMouseUp: function() {
      this.isDragging = false;
      this.canvasElement.style.cursor = 'grab';
      
      // Prevent immediate hover
      this.justFinishedDragging = true;
      setTimeout(() => {
        this.justFinishedDragging = false;
      }, 150);
      
      // Resume auto-rotation after delay
      setTimeout(() => {
        if (!this.isDragging && !this.isAutoRotatingToNode) {
          this.autoRotate = true;
        }
      }, 2000);
    },
    
    /**
     * Right-click context menu handler
     * 
     * Prevents context menu on canvas.
     * 
     * @param {Event} event - Context menu event
     * @returns {boolean} false to prevent menu
     */
    onContextMenu: function(event) {
      event.preventDefault();
      return false;
    },
    
    /**
     * Click handler
     * 
     * Handles node selection.
     * Distinguishes clicks from drags via distance threshold.
     * 
     * @param {MouseEvent} event - Click event
     * @returns {void}
     */
    onClick: function(event) {
      // Distinguish click from drag
      const wasDragging = this.totalDragDistance > 5; // 5px threshold
      
      if (wasDragging) {
        this.totalDragDistance = 0;
        return;
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Raycast for Intersections
       * ─────────────────────────────────────────────────────────
       */
      
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableObjects, false);
      
      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        let targetNode = null;
        
        // Determine target node
        if (clicked.userData.type === 'logo') {
          targetNode = clicked.userData.parentNode;
        } else if (clicked.userData.type === 'satellite') {
          targetNode = this.nodes.find(n => 
            n.userData.type === 'major' && n.userData.id === clicked.userData.parentId
          );
        } else if (clicked.userData.type === 'major') {
          targetNode = clicked;
        }
        
        if (targetNode) {
          // Clear category highlight (mutually exclusive)
          if (this.highlightedCategory) {
            this.clearCategoryHighlight();
            this.highlightedCategory = null;
          }
          
          // Toggle selection
          if (this.selectedNode === targetNode) {
            this.clearSelection();
          } else {
            this.clearSelection(true); // Skip opacity restore
            this.selectNode(targetNode);
            this.rotateToNode(targetNode);
          }
        }
      } else {
        // Click on empty space - clear both
        this.clearSelection();
        if (this.highlightedCategory) {
          this.clearCategoryHighlight();
          this.highlightedCategory = null;
        }
      }
    },
    
    /**
     * Touch start handler
     * 
     * SAFARI FIX: Sets touchActive flag to prevent mouse event conflicts.
     * 
     * @param {TouchEvent} event - Touch event
     * @returns {void}
     */
    onTouchStart: function(event) {
      event.preventDefault();
      
      if (event.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.isAutoRotatingToNode = false;
        this.totalDragDistance = 0;  // Reset for tap detection
        this.dragStartTime = Date.now();  // Track tap duration
        
        const touch = event.touches[0];
        const rect = this.canvasElement.getBoundingClientRect();
        
        this.lastMouseX = touch.clientX;
        this.lastMouseY = touch.clientY;
        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.canvasElement.style.cursor = 'grabbing';
      }
    },
    
    /**
     * Touch move handler
     * 
     * @param {TouchEvent} event - Touch event
     * @returns {void}
     */
    onTouchMove: function(event) {
      event.preventDefault();
      
      if (this.isDragging && event.touches.length === 1) {
        const touch = event.touches[0];
        
        // Calculate delta like desktop mouse
        const deltaX = touch.clientX - this.lastMouseX;
        const deltaY = touch.clientY - this.lastMouseY;
        
        // Track total drag distance for tap detection
        this.totalDragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        
        // Apply rotation like desktop mouse
        this.rotationVelocity.y = deltaX * 0.008;
        this.rotationVelocity.x = deltaY * 0.008;
        
        // Update last position
        this.lastMouseX = touch.clientX;
        this.lastMouseY = touch.clientY;
        
        // Update mouse coords for raycasting
        const rect = this.canvasElement.getBoundingClientRect();
        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    },
    
    /**
     * Touch end handler
     * 
     * SAFARI FIX: Clears touchActive flag after brief delay.
     * 
     * @param {TouchEvent} event - Touch event
     * @returns {void}
     */
    onTouchEnd: function(event) {
    event.preventDefault();
    
    // Detect if this was a TAP (not a drag)
    const touchDuration = Date.now() - this.dragStartTime;
    const isTap = this.totalDragDistance < 10 && touchDuration < 300;
    
    console.log('[Touch End] Duration:', touchDuration, 'ms, Distance:', this.totalDragDistance, 'px, isTap:', isTap);
    
    // Reset drag state early so rotation animations work
    const wasDragging = this.isDragging;
    this.isDragging = false;
    this.totalDragDistance = 0;
    
    if (isTap && event.changedTouches && event.changedTouches.length > 0) {
      console.log('[Touch End] TAP detected, checking for node...');
      
      // This was a tap - trigger node selection
      const touch = event.changedTouches[0];
      const rect = this.canvasElement.getBoundingClientRect();
      
      // Update mouse position for raycasting
      this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      
      console.log('[Touch End] Mouse coords:', this.mouse.x.toFixed(2), this.mouse.y.toFixed(2));
      
      // Raycast for node selection (same logic as desktop onClick)
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableObjects, false);
      
      console.log('[Touch End] Intersects found:', intersects.length);
      
      if (intersects.length > 0) {
        const tapped = intersects[0].object;
        let targetNode = null;
        
        console.log('[Touch End] Tapped object type:', tapped.userData.type);
        
        // Determine target node (same logic as desktop)
        if (tapped.userData.type === 'logo') {
          targetNode = tapped.userData.parentNode;
          console.log('[Touch End] Logo tapped, parent:', targetNode.userData.label);
        } else if (tapped.userData.type === 'satellite') {
          targetNode = this.nodes.find(n => 
            n.userData.type === 'major' && n.userData.id === tapped.userData.parentId
          );
          console.log('[Touch End] Satellite tapped, parent:', targetNode ? targetNode.userData.label : 'NOT FOUND');
        } else if (tapped.userData.type === 'major') {
          targetNode = tapped;
          console.log('[Touch End] Major node tapped:', targetNode.userData.label);
        }
        
        if (targetNode) {
          console.log('[Touch End] ✅ Target node confirmed:', targetNode.userData.label);
          
          // Clear category highlight (mutually exclusive)
          if (this.highlightedCategory) {
            this.clearCategoryHighlight();
            this.highlightedCategory = null;
          }
          
          // Toggle selection
          if (this.selectedNode === targetNode) {
            console.log('[Touch End] Clearing selection (already selected)');
            this.clearSelection();
          } else {
            console.log('[Touch End] Selecting node...');
            this.clearSelection(true); // Skip opacity restore
            this.selectNode(targetNode);
            
            console.log('[Touch End] Calling rotateToNode...');
            console.log('[Touch End] isDragging:', this.isDragging);
            console.log('[Touch End] isAutoRotatingToNode:', this.isAutoRotatingToNode);
            
            this.rotateToNode(targetNode);
            
            console.log('[Touch End] rotateToNode called, isAutoRotatingToNode now:', this.isAutoRotatingToNode);
          }
        } else {
          console.log('[Touch End] ❌ No valid target node found');
        }
      } else {
        console.log('[Touch End] No intersects - clearing selection');
        // Tap on empty space - clear both selection and category
        this.clearSelection();
        if (this.highlightedCategory) {
          this.clearCategoryHighlight();
          this.highlightedCategory = null;
        }
      }
    } else {
      console.log('[Touch End] NOT a tap (drag or long press)');
    }
    
    if (this.canvasElement) {
      this.canvasElement.style.cursor = 'grab';
    }
    
    // Resume auto-rotation after delay
    setTimeout(() => {
      if (!this.isDragging && !this.isAutoRotatingToNode && !this.selectedNode) {
        this.autoRotate = true;
        console.log('[Touch End] Auto-rotation resumed');
      }
    }, 2000);
  },
    
    onWindowResize: function() {
      if (!this.canvasWrapper) return;
      
      const width = this.canvasWrapper.clientWidth;
      const height = this.canvasWrapper.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(width, height, false);
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 7. ANIMATION LOOP
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Main animation loop
     * 
     * Runs at ~60fps (requestAnimationFrame).
     * 
     * Updates:
     * - Scene rotation
     * - Rotation damping
     * - Auto-rotation
     * - Sprite billboarding
     * 
     * @returns {void}
     */
    animate: function() {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
      
      /**
       * ─────────────────────────────────────────────────────────
       * Apply Rotation Velocity
       * ─────────────────────────────────────────────────────────
       */
      
      if (this.isDragging || Math.abs(this.rotationVelocity.x) > 0.0001 || Math.abs(this.rotationVelocity.y) > 0.0001) {
        this.scene.rotation.y += this.rotationVelocity.y;
        this.scene.rotation.x += this.rotationVelocity.x;
        
        // Full 360° rotation (no clamping)
        
        // Apply damping
        if (!this.isDragging) {
          this.rotationVelocity.y *= SKILLS_SPHERE_DATA.config.rotationDamping;
          this.rotationVelocity.x *= SKILLS_SPHERE_DATA.config.rotationDamping;
        }
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Auto-Rotation
       * ─────────────────────────────────────────────────────────
       */
      
      if (this.autoRotate && !this.isDragging && !this.isAutoRotatingToNode) {
        this.scene.rotation.y += SKILLS_SPHERE_DATA.config.autoRotateSpeed * 0.01;
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Sprite Billboarding
       * ─────────────────────────────────────────────────────────
       * 
       * Make all sprites (labels + logos) face camera.
       * Uses cached sprites array for performance.
       */
      
      for (let i = 0, len = this.sprites.length; i < len; i++) {
        this.sprites[i].quaternion.copy(this.camera.quaternion);
      }
      
      /**
       * ─────────────────────────────────────────────────────────
       * Render Scene
       * ─────────────────────────────────────────────────────────
       */
      
      this.renderer.render(this.scene, this.camera);
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 8. THEME ADAPTATION
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Initialize theme observer
     * 
     * Watches for data-theme attribute changes and updates colors.
     * Observes both html and body elements for compatibility.
     * 
     * @returns {void}
     */
    initThemeObserver: function() {
      // Delayed initial detection
      setTimeout(() => {
        this.updateThemeColors();
      }, 50);
      
      // Create observer
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            if (this.DEBUG) console.log('Theme change detected');
            this.updateThemeColors();
          }
        });
      });
      
      // Watch both html and body
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      this.themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      if (this.DEBUG) console.log('Theme observer initialized');
    },
    
    /**
     * Update colors for current theme
     * 
     * Updates:
     * - Node colors (from CATEGORY_COLORS)
     * - Connection colors
     * - Text sprites (regenerated)
     * - Legend colors
     * 
     * @returns {void}
     */
    updateThemeColors: function() {
      const isDark = this.isDarkTheme();
      
      if (this.DEBUG) console.log('Theme:', isDark ? 'dark' : 'light');
      
      // Update connection colors
      const connectionColor = isDark ? 0x64748b : 0x94a3b8;
      this.connections.forEach(conn => {
        if (!conn.userData.isHighlighted) {
          conn.material.color.setHex(connectionColor);
        }
      });
      
      // Update node colors
      this.nodes.forEach(node => {
        if (node.userData.type === 'major' || node.userData.type === 'satellite') {
          // Get category
          let nodeCategory = node.userData.category;
          if (node.userData.type === 'satellite' && node.userData.parentId) {
            const parentNode = this.nodes.find(n => 
              n.userData.type === 'major' && n.userData.id === node.userData.parentId
            );
            if (parentNode) {
              nodeCategory = parentNode.userData.category;
            }
          }
          
          // Get theme color
          const colorScheme = this.CATEGORY_COLORS[nodeCategory];
          let themeColor;
          if (colorScheme) {
            themeColor = new THREE.Color(isDark ? colorScheme.dark : colorScheme.light);
          } else {
            themeColor = new THREE.Color(node.userData.originalColor);
          }
          
          // Apply color
          node.material.color.copy(themeColor);
          node.userData.currentThemeColor = '#' + themeColor.getHexString();
        }
        
        // Update text sprites (regenerate with new theme)
        if (node.userData.sprite) {
          const oldSprite = node.userData.sprite;
          const label = node.userData.label;
          this.scene.remove(oldSprite);
          this.createTextSprite(label, node, isDark);
        }
      });
      
      // Update legend colors
      if (this.legendEl) {
        const legendItems = this.legendEl.querySelectorAll('.skills-sphere-legend-item');
        legendItems.forEach(item => {
          const category = item.getAttribute('data-category');
          const originalColor = item.getAttribute('data-original-color');
          const dot = item.querySelector('.skills-sphere-legend-dot');
          
          if (dot && originalColor) {
            const colorScheme = this.CATEGORY_COLORS[category];
            const legendColor = colorScheme
              ? (isDark ? colorScheme.dark : colorScheme.light)
              : originalColor;
            
            dot.style.background = legendColor;
            dot.style.boxShadow = `0 0 8px ${legendColor}`;
          }
        });
      }
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 9. UTILITIES
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Convert spherical to Cartesian coordinates
     * 
     * @param {number} theta - Horizontal angle (radians)
     * @param {number} phi - Vertical angle (radians)
     * @param {number} radius - Distance from origin
     * @returns {Object} {x, y, z} coordinates
     */
    sphericalToCartesian: function(theta, phi, radius) {
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
      };
    },
    
    /**
     * Position sprite toward camera
     * 
     * Adaptive positioning prevents label obstruction at steep angles.
     * 
     * @param {THREE.Sprite} sprite - Label sprite
     * @param {THREE.Mesh} node - Parent node
     * @param {number} baseOffset - Base Y-offset
     * @returns {void}
     */
    positionSpriteTowardCamera: function(sprite, node, baseOffset) {
      // Get direction to camera
      const toCamera = new THREE.Vector3().subVectors(
        this.camera.position,
        node.position
      ).normalize();
      
      // Calculate steepness
      const steepness = Math.abs(toCamera.y);
      
      // Adaptive Y-offset (more upward when steep)
      const adaptiveYOffset = baseOffset + (steepness * 1.2);
      
      // Position sprite
      sprite.position.copy(node.position);
      sprite.position.y += adaptiveYOffset;
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 10. CLEANUP
     * ═══════════════════════════════════════════════════════════
     * 
     * For SPA frameworks or dynamic page updates.
     * Properly disposes resources and removes event listeners.
     * 
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Cleanup all resources
     * 
     * Disposes:
     * - Animation frames
     * - Event listeners
     * - Observers
     * - Three.js objects (geometries, materials, textures)
     * - DOM references
     * 
     * @returns {void}
     */
    destroy: function() {
      if (this.DEBUG) console.log('[Skills Sphere] Starting cleanup...');
      
      // Cancel animation
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      // Remove window event listeners
      if (this.boundMouseMove) {
        window.removeEventListener('mousemove', this.boundMouseMove);
        this.boundMouseMove = null;
      }
      if (this.boundMouseUp) {
        window.removeEventListener('mouseup', this.boundMouseUp);
        this.boundMouseUp = null;
      }
      
      window.removeEventListener('resize', this.onWindowResize.bind(this));
      
      // Remove canvas event listeners
      const canvas = this.renderer ? this.renderer.domElement : null;
      if (canvas) {
        if (this.boundMouseDown) {
          canvas.removeEventListener('mousedown', this.boundMouseDown);
          this.boundMouseDown = null;
        }
        if (this.boundClick) {
          canvas.removeEventListener('click', this.boundClick);
          this.boundClick = null;
        }
        if (this.boundContextMenu) {
          canvas.removeEventListener('contextmenu', this.boundContextMenu);
          this.boundContextMenu = null;
        }
      }
      
      // Disconnect observers
      if (this.themeObserver) {
        this.themeObserver.disconnect();
        this.themeObserver = null;
        if (this.DEBUG) console.log('[Skills Sphere] Theme observer disconnected');
      }
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
        if (this.DEBUG) console.log('[Skills Sphere] Resize observer disconnected');
      }
      
      // Dispose Three.js objects
      this.nodes.forEach(node => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) node.material.dispose();
        
        // Dispose sprites
        if (node.userData.sprite && node.userData.sprite.material.map) {
          node.userData.sprite.material.map.dispose();
          node.userData.sprite.material.dispose();
        }
        if (node.userData.logoSprite && node.userData.logoSprite.material.map) {
          node.userData.logoSprite.material.map.dispose();
          node.userData.logoSprite.material.dispose();
        }
      });
      
      this.connections.forEach(conn => {
        if (conn.geometry) conn.geometry.dispose();
        if (conn.material) conn.material.dispose();
      });

      // Clear caches
      this.sprites = [];
      
      // Dispose renderer
      if (this.renderer) {
        this.renderer.dispose();
      }
      
      // Clear DOM references
      this.canvasElement = null;
      this.legendEl = null;
      this.detailsEl = null;
      
      // Clear container
      if (this.containerEl) {
        this.containerEl.innerHTML = '';
      }
      
      if (this.DEBUG) console.log('[Skills Sphere] Cleanup complete');
    },
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 11. INTERACTION LOGIC - HOVER & SELECTION
     * ═══════════════════════════════════════════════════════════
     */

    /**
     * Check for node hover
     * 
     * Throttled to ~60fps for performance.
     * Uses raycasting to detect intersections.
     * 
     * @returns {void}
     */
    checkHover: function() {
      // Throttle to ~60fps
      const now = Date.now();
      if (now - this.lastHoverCheck < this.hoverCheckInterval) {
        return;
      }
      this.lastHoverCheck = now;
      
      // Raycast
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.hoverableNodes, false);
      
      if (intersects.length > 0) {
        let node = intersects[0].object;
        
        // If satellite, hover parent instead
        if (node.userData.type === 'satellite') {
          const parentNode = this.nodes.find(n => 
            n.userData.type === 'major' && n.userData.id === node.userData.parentId
          );
          if (parentNode) {
            node = parentNode;
          }
        }
        
        // Check visibility threshold
        const worldScale = new THREE.Vector3();
        node.getWorldScale(worldScale);
        
        if (worldScale.x > 0.3) {
          if (this.hoveredNode !== node) {
            this.setHoveredNode(node);
          }
        } else {
          this.clearHover();
          this.canvasElement.style.cursor = 'grab';
        }
      } else {
        this.clearHover();
        if (!this.isDragging) {
          this.canvasElement.style.cursor = 'grab';
        }
      }
    },

    /**
     * Set hovered node
     * 
     * @param {THREE.Mesh} node - Node to hover
     * @returns {void}
     */
    setHoveredNode: function(node) {
      // Don't hover if already selected
      if (this.selectedNode === node) {
        return;
      }
      
      this.clearHover();
      this.hoveredNode = node;
      
      // Brighten node
      const baseColor = node.userData.currentThemeColor || node.userData.color;
      const brightColor = new THREE.Color(baseColor).multiplyScalar(1.5);
      node.material.color.copy(brightColor);
      node.material.opacity = 0.85;
      node.scale.set(1.3, 1.3, 1.3);

      // Update cursor
      this.canvasElement.style.cursor = 'pointer';
      
      // Enlarge sprite label
      if (node.userData.sprite) {
        node.userData.sprite.scale.set(10.4, 2.6, 1);
      }
      
      // Brighten satellites
      this.nodes.forEach(n => {
        if (n.userData.type === 'satellite' && n.userData.parentId === node.userData.id) {
          n.material.opacity = 1.0;
          n.scale.set(1.3, 1.3, 1.3);
          const satBaseColor = n.userData.currentThemeColor || n.userData.color;
          const brightSatColor = new THREE.Color(satBaseColor).multiplyScalar(1.5);
          n.material.color.copy(brightSatColor);
        }
      });
      
      // Brighten connections
      this.connections.forEach(conn => {
        if (conn.userData.type === 'satellite-connection' && 
            conn.userData.parentId === node.userData.id) {
          conn.material.opacity = 0.9;
          conn.material.linewidth = 3;
          const connColor = node.userData.currentThemeColor || node.userData.color;
          conn.material.color.setHex(parseInt(connColor.replace('#', '0x')));
        }
        if (conn.userData.nodes && 
            (conn.userData.nodes[0] === node.userData.id || 
            conn.userData.nodes[1] === node.userData.id)) {
          conn.material.opacity = 0.9;
          conn.material.linewidth = 3;
          const connColor = node.userData.currentThemeColor || node.userData.color;
          conn.material.color.setHex(parseInt(connColor.replace('#', '0x')));
        }
      });
      
      // Update details panel (if not locked)
      if (!this.selectedNode) {
        this.updateDetailsPanel(node);
      }
    },

    /**
     * Clear hover state
     * 
     * @returns {void}
     */
    clearHover: function() {
      if (!this.hoveredNode) return;
      
      // Don't clear if this is the selected node
      if (this.selectedNode === this.hoveredNode) {
        this.hoveredNode = null;
        return;
      }
      
      const hasActiveSelection = this.selectedNode !== null;
      const hasActiveCategoryHighlight = this.highlightedCategory !== null;
      
      // Reset node
      const colorToUse = this.hoveredNode.userData.currentThemeColor || this.hoveredNode.userData.originalColor;
      this.hoveredNode.material.color.copy(new THREE.Color(colorToUse));
      this.hoveredNode.scale.set(1, 1, 1);
      
      // Reset opacity based on state
      if (hasActiveSelection) {
        if (this.hoveredNode.userData.type === 'major') {
          this.hoveredNode.material.opacity = 0.3;
        }
      } else if (hasActiveCategoryHighlight) {
        if (this.hoveredNode.userData.type === 'major') {
          if (this.hoveredNode.userData.category === this.highlightedCategory) {
            this.hoveredNode.material.opacity = 1.0;
          } else {
            this.hoveredNode.material.opacity = 0.3;
          }
        }
      } else {
        if (this.hoveredNode.userData.type === 'major') {
          this.hoveredNode.material.opacity = 0.85;
        }
      }
      
      // Reset sprite
      if (this.hoveredNode.userData.sprite) {
        this.hoveredNode.userData.sprite.scale.set(8, 2, 1);
      }
      
      // Reset satellites
      const hoveredParentId = this.hoveredNode.userData.id;
      for (let i = 0, len = this.nodes.length; i < len; i++) {
        const n = this.nodes[i];
        if (n.userData.type !== 'satellite' || n.userData.parentId !== hoveredParentId) continue;
        
        n.scale.set(1, 1, 1);
        const satColor = n.userData.currentThemeColor || n.userData.color;
        n.material.color.copy(new THREE.Color(satColor));
        
        if (hasActiveSelection) {
          n.material.opacity = n.userData.parentId === this.selectedNode.userData.id ? 0.8 : 0.1;
        } else if (hasActiveCategoryHighlight) {
          let parentCategory = null;
          for (let j = 0; j < this.nodes.length; j++) {
            if (this.nodes[j].userData.type === 'major' && this.nodes[j].userData.id === n.userData.parentId) {
              parentCategory = this.nodes[j].userData.category;
              break;
            }
          }
          n.material.opacity = parentCategory === this.highlightedCategory ? 0.8 : 0.1;
        } else {
          n.material.opacity = n.userData.originalOpacity;
        }
      }
      
      // Reset connections
      this.connections.forEach(conn => {
        if (conn.userData.parentId === this.hoveredNode.userData.id ||
            (conn.userData.nodes && 
            (conn.userData.nodes[0] === this.hoveredNode.userData.id || 
              conn.userData.nodes[1] === this.hoveredNode.userData.id))) {
          conn.material.linewidth = SKILLS_SPHERE_DATA.config.connectionWidth;
          
          if (hasActiveSelection) {
            if (conn.userData.parentId === this.selectedNode.userData.id ||
                (conn.userData.nodes && 
                (conn.userData.nodes[0] === this.selectedNode.userData.id || 
                  conn.userData.nodes[1] === this.selectedNode.userData.id))) {
              conn.material.opacity = 0.4;
            } else {
              conn.material.opacity = 0.05;
            }
          } else if (hasActiveCategoryHighlight) {
            let belongsToHighlightedCategory = false;
            if (conn.userData.parentId) {
              const parentNode = this.nodes.find(n => 
                n.userData.type === 'major' && n.userData.id === conn.userData.parentId
              );
              belongsToHighlightedCategory = parentNode && parentNode.userData.category === this.highlightedCategory;
            } else if (conn.userData.nodes) {
              const node1 = this.nodes.find(n => n.userData.id === conn.userData.nodes[0]);
              const node2 = this.nodes.find(n => n.userData.id === conn.userData.nodes[1]);
              belongsToHighlightedCategory = (node1 && node1.userData.category === this.highlightedCategory) ||
                                            (node2 && node2.userData.category === this.highlightedCategory);
            }
            
            if (belongsToHighlightedCategory) {
              conn.material.opacity = 0.4;
            } else {
              conn.material.opacity = 0.05;
            }
          } else {
            conn.material.opacity = conn.userData.originalOpacity;
          }
        }
      });
      
      this.hoveredNode = null;
      
      // Reapply dimming if selected
      if (this.selectedNode) {
        this.dimOtherNodes(this.selectedNode);
      }
      
      // Clear details if not locked
      if (!this.selectedNode) {
        this.clearDetailsPanel();
      }
    },

    /**
     * Select a node
     * 
     * @param {THREE.Mesh} node - Node to select
     * @returns {void}
     */
    selectNode: function(node) {
      this.selectedNode = node;
      
      // Apply selection visuals
      const baseColor = node.userData.currentThemeColor || node.userData.color;
      const brightColor = new THREE.Color(baseColor).multiplyScalar(1.5);
      node.material.color.copy(brightColor);
      node.material.opacity = 0.85;
      node.scale.set(1.15, 1.15, 1.15);
      
      if (node.userData.sprite) {
        node.userData.sprite.scale.set(9, 2.25, 1);
        this.positionSpriteTowardCamera(node.userData.sprite, node, 2.95);
      }
      
      // Brighten satellites
      this.nodes.forEach(n => {
        if (n.userData.type === 'satellite' && n.userData.parentId === node.userData.id) {
          n.material.opacity = 1.0;
          n.scale.set(1.15, 1.15, 1.15);
          const satBaseColor = n.userData.currentThemeColor || n.userData.color;
          const brightSatColor = new THREE.Color(satBaseColor).multiplyScalar(1.5);
          n.material.color.copy(brightSatColor);
        }
      });
      
      // Brighten connections
      this.connections.forEach(conn => {
        if (conn.userData.type === 'satellite-connection' && 
            conn.userData.parentId === node.userData.id) {
          conn.material.opacity = 0.9;
          conn.material.linewidth = 3;
          const connColor = node.userData.currentThemeColor || node.userData.color;
          conn.material.color.setHex(parseInt(connColor.replace('#', '0x')));
        }
        if (conn.userData.nodes && 
            (conn.userData.nodes[0] === node.userData.id || 
            conn.userData.nodes[1] === node.userData.id)) {
          conn.material.opacity = 0.9;
          conn.material.linewidth = 3;
          const connColor = node.userData.currentThemeColor || node.userData.color;
          conn.material.color.setHex(parseInt(connColor.replace('#', '0x')));
        }
      });
      
      this.dimOtherNodes(node);
      this.updateDetailsPanel(node);
    },

    /**
     * Dim other nodes
     * 
     * @param {THREE.Mesh} selectedNode - Selected node to keep bright
     * @returns {void}
     */
    dimOtherNodes: function(selectedNode) {
      const selectedId = selectedNode.userData.id;
      
      for (let i = 0, len = this.nodes.length; i < len; i++) {
        const n = this.nodes[i];
        if (n === selectedNode) continue;
        
        if (n.userData.type === 'major') {
          n.material.opacity = 0.3;
        } else if (n.userData.type === 'satellite') {
          n.material.opacity = n.userData.parentId === selectedId ? 0.8 : 0.1;
        }
      }
      
      for (let i = 0, len = this.connections.length; i < len; i++) {
        const conn = this.connections[i];
        const isSelected = conn.userData.parentId === selectedId ||
                          (conn.userData.nodes && 
                           (conn.userData.nodes[0] === selectedId || 
                            conn.userData.nodes[1] === selectedId));
        
        conn.material.opacity = isSelected ? 0.4 : 0.05;
      }
    },

    /**
     * Clear selection
     * 
     * @param {boolean} skipOpacityRestore - Skip restoring opacity
     * @returns {void}
     */
    clearSelection: function(skipOpacityRestore) {
      if (!this.selectedNode) return;
      
      const node = this.selectedNode;
      this.selectedNode = null;
      
      // Reset node
      const colorToUse = node.userData.currentThemeColor || node.userData.originalColor;
      node.material.color.copy(new THREE.Color(colorToUse));
      node.scale.set(1, 1, 1);
      
      if (node.userData.sprite) {
        node.userData.sprite.scale.set(8, 2, 1);
        this.positionSpriteTowardCamera(node.userData.sprite, node, 2.5);
      }
      
      // Reset satellites
      this.nodes.forEach(n => {
        if (n.userData.type === 'satellite' && n.userData.parentId === node.userData.id) {
          n.material.opacity = n.userData.originalOpacity;
          n.scale.set(1, 1, 1);
          const satColor = n.userData.currentThemeColor || n.userData.color;
          n.material.color.copy(new THREE.Color(satColor));
        }
      });
      
      // Reset connections
      this.connections.forEach(conn => {
        if (conn.userData.type === 'satellite-connection' && 
            conn.userData.parentId === node.userData.id) {
          conn.material.opacity = conn.userData.originalOpacity || SKILLS_SPHERE_DATA.config.connectionOpacity;
          conn.material.linewidth = SKILLS_SPHERE_DATA.config.connectionWidth;
          const connColor = node.userData.currentThemeColor || node.userData.color;
          conn.material.color.setHex(parseInt(connColor.replace('#', '0x')));
        }
        if (conn.userData.nodes && 
            (conn.userData.nodes[0] === node.userData.id || 
            conn.userData.nodes[1] === node.userData.id)) {
          conn.material.opacity = conn.userData.originalOpacity || SKILLS_SPHERE_DATA.config.connectionOpacity;
          conn.material.linewidth = SKILLS_SPHERE_DATA.config.connectionWidth;
        }
      });
      
      if (!skipOpacityRestore) {
        this.restoreAllNodesOpacity();
      }
      
      this.clearDetailsPanel();
      
      // Resume rotation after delay
      setTimeout(() => {
        if (!this.isDragging && !this.isAutoRotatingToNode && !this.selectedNode) {
          this.autoRotate = true;
        }
      }, 2000);
    },
    
    /**
     * Restore all nodes opacity
     * 
     * @returns {void}
     */
    restoreAllNodesOpacity: function() {
      for (let i = 0, len = this.nodes.length; i < len; i++) {
        const n = this.nodes[i];
        n.material.opacity = n.userData.type === 'major' ? 0.85 : (n.userData.originalOpacity || 0.7);
      }
      
      const defaultOpacity = SKILLS_SPHERE_DATA.config.connectionOpacity;
      for (let i = 0, len = this.connections.length; i < len; i++) {
        this.connections[i].material.opacity = this.connections[i].userData.originalOpacity || defaultOpacity;
      }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 12. AUTO-ROTATE TO NODE
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Rotate camera to center node
     * 
     * @param {THREE.Mesh} node - Node to rotate to
     * @returns {void}
     */
    rotateToNode: function(node) {
    console.log('[rotateToNode] Called for:', node.userData.label);
    console.log('[rotateToNode] Current isDragging:', this.isDragging);
    
    const nodeData = SKILLS_SPHERE_DATA.majorNodes.find(n => n.id === node.userData.id);
    if (!nodeData) {
      console.warn('[rotateToNode] ❌ Node data not found for:', node.userData.id);
      return;
    }
    
    console.log('[rotateToNode] Node data found:', nodeData.id);
    
    const ROTATION_LOOKUP = {
      'git': { rotY: 2.3562, rotX: -0.4712 },
      'excel': { rotY: 5.4978, rotX: -0.4712 },
      'sql': { rotY: 4.7124, rotX: 0 },
      'powerbi': { rotY: 1.5708, rotX: 0 },
      'python': { rotY: 0, rotX: 0.5236 },
      'r': { rotY: 3.1416, rotX: 0.5236 },
      'ml': { rotY: 0.7854, rotX: -0.6285 }
    };
    
    const targetRotation = ROTATION_LOOKUP[nodeData.id];
    if (!targetRotation) {
      console.warn('[rotateToNode] ❌ No rotation mapping for:', nodeData.id);
      return;
    }
    
    console.log('[rotateToNode] Target rotation:', targetRotation);
    console.log('[rotateToNode] Starting animateRotation...');
      
      const currentRotY = this.scene.rotation.y;
      let normalizedRotY = targetRotation.rotY;
      
      while (normalizedRotY - currentRotY > Math.PI) {
        normalizedRotY -= Math.PI * 2;
      }
      while (normalizedRotY - currentRotY < -Math.PI) {
        normalizedRotY += Math.PI * 2;
      }
      
      this.animateRotation(normalizedRotY, targetRotation.rotX, 1000);
    },
    
    /**
     * Animate rotation to target
     * 
     * @param {number} targetY - Target Y rotation
     * @param {number} targetX - Target X rotation  
     * @param {number} duration - Animation duration (ms)
     * @returns {void}
     */
    animateRotation: function(targetY, targetX, duration) {
      const startY = this.scene.rotation.y;
      const startX = this.scene.rotation.x;
      const startTime = Date.now();
      
      this.isAutoRotatingToNode = true;
      this.autoRotate = false;
      
      const selectedNode = this.selectedNode;
      
      this.nodes.forEach(n => {
        if (n === selectedNode) {
        } else if (n.userData.type === 'major') {
          n.material.opacity = 0.3;
        } else if (n.userData.type === 'satellite') {
          if (n.userData.parentId === selectedNode.userData.id) {
            n.material.opacity = 0.8;
          } else {
            n.material.opacity = 0.1;
          }
        }
      });
      
      this.connections.forEach(conn => {
        if (conn.userData.parentId === selectedNode.userData.id ||
            (conn.userData.nodes && 
             (conn.userData.nodes[0] === selectedNode.userData.id || 
              conn.userData.nodes[1] === selectedNode.userData.id))) {
          conn.material.opacity = 0.4;
        } else {
          conn.material.opacity = 0.05;
        }
      });
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = 1 - Math.pow(1 - progress, 3);
        
        this.scene.rotation.y = startY + (targetY - startY) * eased;
        this.scene.rotation.x = startX + (targetX - startX) * eased;
        
        if (this.isDragging) {
          this.isAutoRotatingToNode = false;
          if (this.selectedNode) {
            this.dimOtherNodes(this.selectedNode);
          } else {
            this.restoreAllNodesOpacity();
          }
          this.autoRotate = true;
          return;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isAutoRotatingToNode = false;
        }
      };
      
      animate();
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 13. DETAILS PANEL
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Update details panel with node info
     * 
     * @param {THREE.Mesh} node - Node to display
     * @returns {void}
     */
    updateDetailsPanel: function(node) {
      if (!this.detailsEl) return;
      
      const data = node.userData;
      
      const safeLabel = SecurityUtils.escapeHtml(data.label || 'Unknown');
      const safeDisplayName = SecurityUtils.escapeHtml(data.displayName || data.label || 'Unknown');
      const safeDescription = SecurityUtils.escapeHtml(data.description || '');
      
      let iconHtml = '';
      if (data.icon && data.icon.startsWith('http')) {
        const safeIconUrl = SecurityUtils.sanitizeImageUrl(data.icon);
        if (safeIconUrl) {
          iconHtml = `<img src="${safeIconUrl}" alt="${safeLabel}" style="width: 40px; height: 40px; object-fit: contain;">`;
        }
      } else if (data.icon) {
        iconHtml = SecurityUtils.escapeHtml(data.icon);
      }
      
      let credentialsHtml = '';
      if (data.credentials && data.credentials.length > 0) {
        credentialsHtml = `
          <div class="skills-sphere-details-section">
            <h5 class="skills-sphere-details-section-title">Credentials</h5>
            <div class="skills-sphere-credentials-list">
              ${data.credentials.map(cred => {
                const safeName = SecurityUtils.escapeHtml(cred.name || '');
                const safeDesc = SecurityUtils.escapeHtml(cred.description || '');
                const safeYear = SecurityUtils.escapeHtml(cred.year || '');
                
                return `
                  <div class="skills-sphere-credential-item">
                    <div class="skills-sphere-credential-name">${safeName}</div>
                    <div class="skills-sphere-credential-desc">${safeDesc} (${safeYear})</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
      
      let projectsHtml = '';
      if (data.projects && data.projects.length > 0) {
        projectsHtml = `
          <div class="skills-sphere-details-section">
            <h5 class="skills-sphere-details-section-title">Related Projects</h5>
            <div class="skills-sphere-projects-list">
              ${data.projects.map(project => {
                const safeProjName = SecurityUtils.escapeHtml(project.name || '');
                const safeProjDesc = SecurityUtils.escapeHtml(project.description || '');
                
                let projectCredHtml = '';
                if (project.credentials && project.credentials.length > 0) {
                  projectCredHtml = `
                    <div class="skills-sphere-project-credentials">
                      ${project.credentials.map(cred => {
                        const safeCredName = SecurityUtils.escapeHtml(cred.name || '');
                        const safeCredDesc = SecurityUtils.escapeHtml(cred.description || '');
                        const safeCredYear = SecurityUtils.escapeHtml(cred.year || '');
                        
                        return `<span class="skills-sphere-project-credential-badge">${safeCredName} - ${safeCredDesc} (${safeCredYear})</span>`;
                      }).join('')}
                    </div>
                  `;
                }
                
                const safeProjectJson = SecurityUtils.sanitizeJsonAttribute(project);
                
                return `
                  <div class="skills-sphere-project-item" data-project='${safeProjectJson}'>
                    <div class="skills-sphere-project-name">${safeProjName}</div>
                    <div class="skills-sphere-project-desc">${safeProjDesc}</div>
                    ${projectCredHtml}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
      
      const html = `
        <div class="skills-sphere-details-content">
          <div class="skills-sphere-details-header">
            <div class="skills-sphere-details-icon">${iconHtml}</div>
            <div class="skills-sphere-details-title">
              <h4>${safeDisplayName}</h4>
              <div class="skills-sphere-details-subtitle">${safeDescription}</div>
            </div>
          </div>
          <div class="skills-sphere-details-list">
            ${data.satellites.map(sat => {
              const safeSat = SecurityUtils.escapeHtml(sat || '');
              return `<div class="skills-sphere-detail-chip">${safeSat}</div>`;
            }).join('')}
          </div>
          ${credentialsHtml}
          ${projectsHtml}
        </div>
      `;
      
      this.detailsEl.innerHTML = html;
      
      this.setupScrollbarVisibility();
      
      if (data.projects && data.projects.length > 0) {
        const projectItems = this.detailsEl.querySelectorAll('.skills-sphere-project-item');
        projectItems.forEach(item => {
          item.addEventListener('click', () => {
            const projectData = JSON.parse(item.getAttribute('data-project'));
            this.handleProjectClick(projectData);
          });
        });
      }
    },
    
    /**
     * Handle project click
     * 
     * @param {Object} project - Project data
     * @returns {void}
     */
    handleProjectClick: function(project) {
      if (this.DEBUG) console.log('Project clicked:', project);
      
      if (project.isExternal && project.externalUrl) {
        window.open(project.externalUrl, '_blank');
        return;
      }
      
      if (typeof window.handleSkillsSphereProjectClick === 'function') {
        window.handleSkillsSphereProjectClick(project);
      } else {
        console.warn('handleSkillsSphereProjectClick not found. Make sure script.js is loaded.');
      }
    },
    
    /**
     * Clear details panel
     * 
     * @returns {void}
     */
    clearDetailsPanel: function() {
      if (!this.detailsEl) return;
      
      this.detailsEl.innerHTML = `
        <div class="skills-sphere-details-empty">
          ${SKILLS_SPHERE_DATA.labels.detailsPanelEmpty}
        </div>
      `;
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════
     * 14. MOBILE INTERACTIONS
     * ═══════════════════════════════════════════════════════════
     */
    
    /**
     * Setup mobile-specific interactions
     * 
     * @returns {void}
     */
    setupMobileInteractions: function() {
      if (window.innerWidth > 768) {
        return;
      }
      
      const panels = document.querySelectorAll('.skills-sphere-panel');
      
      panels.forEach(panel => {
        const header = panel.querySelector('h3');
        if (header) {
          header.style.cursor = 'pointer';
          
          header.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
          });
          
          if (panel.classList.contains('skills-sphere-legend')) {
            panel.classList.add('collapsed');
          }
        }
      });
      
      const originalSelectNode = this.selectNode.bind(this);
      this.selectNode = function(node) {
        originalSelectNode(node);
        
        if (window.innerWidth <= 768) {
          const detailsPanel = document.querySelector('.skills-sphere-details');
          if (detailsPanel) {
            detailsPanel.classList.remove('collapsed');
          }
        }
      };
      
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          panels.forEach(panel => {
            panel.classList.remove('collapsed');
          });
        } else {
          const legendPanel = document.querySelector('.skills-sphere-legend');
          if (legendPanel && !legendPanel.classList.contains('collapsed')) {
            legendPanel.classList.add('collapsed');
          }
        }
      });
    },
    
  };
  
  /**
   * ═══════════════════════════════════════════════════════════
   * AUTO-INITIALIZATION
   * ═══════════════════════════════════════════════════════════
   */
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.SkillsSphereVisualization.init();
    });
  } else {
    window.SkillsSphereVisualization.init();
  }
  
})();

/**
 * ═══════════════════════════════════════════════════════════════════
 * MOBILE DEBUG CONSOLE (INLINE - REMOVE IN PRODUCTION)
 * ═══════════════════════════════════════════════════════════════════
 */
(function() {
  // Only create debug console on mobile
  if (window.innerWidth > 768) return;
  
  // Create debug console HTML
  const debugHTML = `
    <div id="mobile-debug-console" style="
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 300px;
      background: rgba(0, 0, 0, 0.95);
      color: #00ff00;
      font-family: monospace;
      font-size: 10px;
      padding: 10px;
      overflow-y: auto;
      z-index: 99999;
      border-top: 2px solid #00ff00;
      display: none;
    ">
      <button id="close-debug" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff0000;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 11px;
        border-radius: 3px;
        z-index: 1;
      ">CLOSE</button>
      <button id="clear-debug" style="
        position: absolute;
        top: 5px;
        right: 70px;
        background: #ff9900;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 11px;
        border-radius: 3px;
        z-index: 1;
      ">CLEAR</button>
      <div id="debug-output" style="margin-top: 35px; white-space: pre-wrap; word-break: break-word; font-size: 10px;"></div>
    </div>
    <button id="toggle-debug" style="
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: #00ff00;
      color: black;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      border-radius: 5px;
      z-index: 100000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    ">🐛 DEBUG</button>
  `;
  
  // Wait for DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Add HTML to page
    document.body.insertAdjacentHTML('beforeend', debugHTML);
    
    const debugConsole = document.getElementById('mobile-debug-console');
    const debugOutput = document.getElementById('debug-output');
    const toggleBtn = document.getElementById('toggle-debug');
    const closeBtn = document.getElementById('close-debug');
    const clearBtn = document.getElementById('clear-debug');
    
    let logCount = 0;
    const maxLogs = 50;
    
    // Intercept console.log
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      
      if (!debugOutput) return;
      
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${message}\n`;
      
      debugOutput.textContent += logEntry;
      logCount++;
      
      if (logCount > maxLogs) {
        const lines = debugOutput.textContent.split('\n');
        debugOutput.textContent = lines.slice(-maxLogs).join('\n');
        logCount = maxLogs;
      }
      
      debugOutput.scrollTop = debugOutput.scrollHeight;
    };
    
    // Intercept console.warn
    const originalWarn = console.warn;
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      console.log('[WARN]', ...args);
    };
    
    // Intercept console.error
    const originalError = console.error;
    console.error = function(...args) {
      originalError.apply(console, args);
      console.log('[ERROR]', ...args);
    };
    
    // Toggle button
    toggleBtn.addEventListener('click', () => {
      debugConsole.style.display = debugConsole.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
      debugConsole.style.display = 'none';
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      debugOutput.textContent = '';
      logCount = 0;
      console.log('Debug console cleared');
    });
    
    console.log('Mobile debug console loaded');
  }
})();

/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF SKILLS SPHERE VISUALIZATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready 3D visualization for Mohit Pammu's Portfolio
 * 
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * Features:
 * - 7 major nodes (core skills)
 * - 40+ satellite nodes (related technologies)
 * - 11+ connections (skill relationships)
 * - Project integration (portfolio navigation)
 * - Theme adaptation (dark/light)
 * - Full mobile support (touch gestures)
 * - Performance optimized (60fps target)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */
