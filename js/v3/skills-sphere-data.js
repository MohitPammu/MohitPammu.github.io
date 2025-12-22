/**
 * ═══════════════════════════════════════════════════════════════════
 * SKILLS SPHERE DATA CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        skills-sphere-data.js
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Complete data configuration for 3D interactive skills
 *              sphere visualization. Defines nodes, satellites,
 *              connections, projects, and visual parameters.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * This configuration defines:
 * 
 * 1. Major Nodes (7 Core Skills)
 *    - SQL, Python, Power BI, R, Excel, Git, Machine Learning
 * 
 * 2. Satellite Nodes (Related Technologies)
 *    - Tools, libraries, frameworks for each skill
 * 
 * 3. Connections (Skill Relationships)
 *    - Visual web showing how skills integrate
 * 
 * 4. Project Integration
 *    - Links to portfolio project cards
 *    - Auto-filtering and scroll navigation
 * 
 * 5. Visual Configuration
 *    - Node sizes, colors, animations
 *    - Rotation, hover effects, spacing
 * 
 * ───────────────────────────────────────────────────────────────────
 * COORDINATE SYSTEM
 * ───────────────────────────────────────────────────────────────────
 * 
 * Nodes are positioned using spherical coordinates:
 * 
 * theta (θ) - Horizontal rotation (0 to 2π)
 *   - 0       = Right (3 o'clock)
 *   - π/2     = Front (12 o'clock)
 *   - π       = Left (9 o'clock)
 *   - 3π/2    = Back (6 o'clock)
 * 
 * phi (φ) - Vertical angle (0 to π)
 *   - 0       = Top (North Pole)
 *   - π/2     = Equator (Middle)
 *   - π       = Bottom (South Pole)
 * 
 * Example:
 *   theta: 0,      phi: π/2   = Right side, middle height
 *   theta: π/2,    phi: π/3   = Front, upper third
 *   theta: π,      phi: π/2   = Left side, middle height
 * 
 * ───────────────────────────────────────────────────────────────────
 * PROJECT INTEGRATION
 * ───────────────────────────────────────────────────────────────────
 * 
 * How clicking a project works:
 * 
 * 1. User clicks project in details panel
 * 2. skills-sphere.js calls handleSkillsSphereProjectClick()
 * 3. main.js filters projects by category
 * 4. Page scrolls to target card
 * 5. Card highlights with animation
 * 
 * Required Project Properties:
 * - name: Display name
 * - description: Brief summary
 * - tags: Array of technologies
 * - scrollTarget: HTML element ID (e.g., 'project-hr-analytics')
 * - filterCategory: Filter button value (e.g., 'power-bi')
 * 
 * External Projects:
 * - isExternal: true
 * - externalUrl: Full URL to open in new tab
 * 
 * ───────────────────────────────────────────────────────────────────
 * VISUAL TUNING GUIDE
 * ───────────────────────────────────────────────────────────────────
 * 
 * Node Sizes:
 *   majorNodeSize: 2.0 (default)
 *     - Larger = more prominent
 *     - Smaller = more compact
 * 
 * Connections:
 *   connectionOpacity: 0.4 (visible web)
 *     - Higher = stronger visual weight
 *     - Lower = subtle connections
 * 
 * Rotation:
 *   autoRotateSpeed: 0.05 (slow rotation)
 *     - 0 = no auto-rotation
 *     - Higher = faster spin
 * 
 * Satellites:
 *   satelliteDistance: 0.255 (close to major node)
 *     - Larger = farther orbit
 *     - Smaller = tighter cluster
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * - skills-sphere.js (consumes this data)
 * - Three.js (3D rendering library)
 * - skills-sphere.css (styling)
 * 
 * ───────────────────────────────────────────────────────────────────
 * ADDING NEW SKILLS
 * ───────────────────────────────────────────────────────────────────
 * 
 * 1. Add to majorNodes array:
 *    {
 *      id: 'newskill',
 *      label: 'New Skill',
 *      category: 'Core Analytics',
 *      color: '#6d8dfa',
 *      icon: 'https://cdn.../icon.svg',
 *      theta: Math.PI / 4,
 *      phi: Math.PI / 2,
 *      satellites: ['Tool1', 'Tool2'],
 *      description: 'What this skill is for',
 *      projects: []
 *    }
 * 
 * 2. Add connections in connections array:
 *    ['newskill', 'existingskill']
 * 
 * 3. Choose position (theta/phi) to avoid overlap
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. DATA STRUCTURE
 *    1.1 Major Nodes (7 Core Skills)
 *        - SQL
 *        - Python
 *        - Power BI
 *        - R
 *        - Excel
 *        - Git
 *        - Machine Learning
 *    1.2 Connections (Skill Relationships)
 *    1.3 Visual Configuration
 *    1.4 UI Text Labels
 * 2. EXPORT
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

const SKILLS_SPHERE_DATA = {
  
  /**
   * ═══════════════════════════════════════════════════════════════
   * 1.1 MAJOR NODES - 7 CORE SKILLS
   * ═══════════════════════════════════════════════════════════════
   * 
   * Primary skill nodes displayed on the sphere.
   * Each node can have:
   * - Satellite nodes (related technologies)
   * - Linked projects (portfolio integration)
   * - Credentials (certifications)
   * 
   * ═══════════════════════════════════════════════════════════════
   */
  
  majorNodes: [
    
    /**
     * ───────────────────────────────────────────────────────────
     * 1. SQL - Database Querying & Data Manipulation
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Right side, middle height (equator)
     * Category: Core Analytics (blue)
     * Status: Production-ready, no linked projects yet
     */
    {
      id: 'sql',
      label: 'SQL',
      category: 'Core Analytics',
      color: '#6d8dfa',                   // Website theme blue
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg',
      
      // Spherical coordinates
      theta: 0,                            // Right side (3 o'clock)
      phi: Math.PI / 2,                    // Equator (middle)
      
      satellites: [
        'PostgreSQL',
        'BigQuery',
        'pgAdmin',
        'DBeaver',
        'JOINS & Subqueries',
        'Aggregate Functions'
      ],
      
      description: 'Database querying and data manipulation',
      
      projects: []                         // Coming soon
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 2. PYTHON - Data Analysis & Machine Learning
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Front, upper third
     * Category: Programming (pink)
     * Projects: 3 linked (FoodHub, SVHN, Emotion Detection)
     */
    {
      id: 'python',
      label: 'Python',
      category: 'Programming',
      color: '#f472b6',                   // Soft pink
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      
      // Spherical coordinates
      theta: Math.PI / 2,                  // Front (12 o'clock)
      phi: Math.PI / 3,                    // Upper third
      
      satellites: [
        'Pandas',
        'NumPy',
        'Matplotlib',
        'Seaborn',
        'Jupyter',
        'Google Colab',
        'VS Code'
      ],
      
      description: 'Data analysis, visualization, and machine learning',
      
      /**
       * Linked Projects
       * Each project enables scroll navigation from sphere to portfolio
       */
      projects: [
        {
          name: 'Foodhub Order Analysis',
          description: 'Restaurant order patterns & insights',
          tags: ['Python', 'Pandas', 'EDA'],
          scrollTarget: 'project-foodhub',
          filterCategory: 'python-r',
          credentials: [
            {
              name: 'MIT Professional Education',
              description: 'Applied Data Science Program',
              year: '2025'
            }
          ]
        },
        {
          name: 'SVHN Digit Recognition',
          description: '90% accuracy on street view digits',
          tags: ['Python', 'TensorFlow', 'Computer Vision'],
          scrollTarget: 'project-svhn',
          filterCategory: 'machine-learning',
          credentials: [
            {
              name: 'MIT Professional Education',
              description: 'Applied Data Science Program',
              year: '2025'
            }
          ]
        },
        {
          name: 'Facial Emotion Detection',
          description: '82% accuracy across 7 emotions',
          tags: ['Python', 'TensorFlow', 'CNNs'],
          scrollTarget: 'project-emotion',
          filterCategory: 'machine-learning',
          credentials: [
            {
              name: 'MIT Professional Education',
              description: 'Applied Data Science Program',
              year: '2025'
            }
          ]
        }
      ]
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 3. POWER BI - Business Intelligence & Dashboards
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Left side, middle height (equator)
     * Category: Core Analytics (blue)
     * Projects: 4 linked (HR, Global Sales, Sales/Customer, Netflix)
     */
    {
      id: 'powerbi',
      label: 'Power BI',
      category: 'Core Analytics',
      color: '#6d8dfa',                   // Website theme blue
      icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg',
      
      // Spherical coordinates
      theta: Math.PI,                      // Left side (9 o'clock)
      phi: Math.PI / 2,                    // Equator (middle)
      
      satellites: [
        'DAX',
        'Power Query',
        'Data Modeling',
        'Row-Level Security',
        'Custom Visuals',
        'Incremental Refresh'
      ],
      
      description: 'Interactive dashboards and business intelligence',
      
      /**
       * Linked Projects
       * Power BI has the most portfolio projects (4)
       */
      projects: [
        {
          name: 'HR Workforce Analytics',
          description: 'Employee metrics and workforce insights',
          tags: ['Power BI', 'DAX', 'HR Analytics'],
          scrollTarget: 'project-hr-analytics',
          filterCategory: 'power-bi',
          credentials: [
            {
              name: 'Edureka',
              description: 'Business Analyst using Power BI',
              year: '2024'
            }
          ]
        },
        {
          name: 'Global Sales Performance',
          description: 'International sales KPI dashboard',
          tags: ['Power BI', 'Data Modeling', 'Sales'],
          scrollTarget: 'project-global-sales',
          filterCategory: 'power-bi',
          credentials: [
            {
              name: 'Edureka',
              description: 'Business Analyst using Power BI',
              year: '2024'
            }
          ]
        },
        {
          name: 'Sales & Customer Analytics',
          description: 'Customer behavior and sales trends',
          tags: ['Power BI', 'DAX', 'Customer Insights'],
          scrollTarget: 'project-sales-customer',
          filterCategory: 'power-bi',
          credentials: [
            {
              name: 'Edureka',
              description: 'Business Analyst using Power BI',
              year: '2024'
            }
          ]
        },
        {
          name: 'Netflix Content Analysis',
          description: 'Content library trends and insights',
          tags: ['Power BI', 'Power Query', 'Entertainment'],
          scrollTarget: 'project-netflix',
          filterCategory: 'power-bi',
          credentials: [
            {
              name: 'Edureka',
              description: 'Business Analyst using Power BI',
              year: '2024'
            }
          ]
        }
      ]
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 4. R - Statistical Computing & Graphics
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Back-left, upper third
     * Category: Programming (pink)
     * Projects: 1 linked (Cyclistic)
     */
    {
      id: 'r',
      label: 'R',
      category: 'Programming',
      color: '#f472b6',                   // Soft pink
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
      
      // Spherical coordinates
      theta: Math.PI * 1.5,                // Back (6 o'clock)
      phi: Math.PI / 3,                    // Upper third
      
      satellites: [
        'tidyverse',
        'ggplot2',
        'dplyr',
        'RStudio'
      ],
      
      description: 'Statistical computing and graphics',
      
      /**
       * Linked Projects
       */
      projects: [
        {
          name: 'Cyclistic Bikeshare Analysis',
          description: 'Bike sharing usage patterns and trends',
          tags: ['R', 'ggplot2', 'dplyr'],
          scrollTarget: 'project-cyclistic',
          filterCategory: 'python-r',
          credentials: [
            {
              name: 'Google',
              description: 'Data Analytics Professional',
              year: '2024'
            }
          ]
        }
      ]
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 5. EXCEL - Data Analysis & Business Modeling
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Front-right, lower third
     * Category: Core Analytics (blue)
     * Projects: None (used in daily work)
     */
    {
      id: 'excel',
      label: 'Excel',
      category: 'Core Analytics',
      color: '#6d8dfa',                   // Website theme blue
      icon: 'https://img.icons8.com/color/480/microsoft-excel-2019--v1.png',
      
      // Spherical coordinates
      theta: Math.PI / 4,                  // Front-right diagonal
      phi: Math.PI * 0.65,                 // Lower third
      
      satellites: [
        'Pivot Tables',
        'VLOOKUP',
        'Power Query',
        'Macros',
        'Data Analysis'
      ],
      
      description: 'Data analysis, reporting, and business modeling',
      
      projects: []                         // Used in daily analytics work
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 6. GIT - Version Control & Collaboration
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Back-left, lower third
     * Category: Tools (gray)
     * Projects: 1 external (GitHub portfolio)
     */
    {
      id: 'git',
      label: 'Git',
      category: 'Tools',
      color: '#64748b',                   // Gray
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      
      // Spherical coordinates
      theta: Math.PI * 1.25,               // Back-left diagonal
      phi: Math.PI * 0.65,                 // Lower third
      
      satellites: [
        'GitHub',
        'Branching',
        'Pull Requests',
        'Version Control',
        'Collaborative Workflows'
      ],
      
      description: 'Version control and collaboration',
      
      /**
       * External Project
       * Opens in new tab instead of scrolling
       */
      projects: [
        {
          name: 'GitHub Portfolio',
          description: 'View all repositories and contributions',
          externalUrl: 'https://github.com/MohitPammu/Projects',
          isExternal: true
        }
      ]
    },
    
    /**
     * ───────────────────────────────────────────────────────────
     * 7. MACHINE LEARNING - Deep Learning & Computer Vision
     * ───────────────────────────────────────────────────────────
     * 
     * Position: Front-right-down, lower third
     * Category: Machine Learning (green)
     * Projects: 2 linked (SVHN, Emotion Detection)
     * Special: Displays as "Machine Learning (Emerging)"
     */
    {
      id: 'ml',
      label: 'Machine Learning',
      displayName: 'Machine Learning (Emerging)',  // Display name for details panel
      category: 'Machine Learning',
      color: '#10b981',                   // Soft green
      icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg',
      
      // Spherical coordinates
      theta: Math.PI * 0.75,               // Front-right diagonal
      phi: Math.PI * 0.7,                  // Lower third
      
      satellites: [
        'TensorFlow',
        'Keras',
        'Scikit-learn',
        'Neural Networks',
        'CNNs',
        'Computer Vision',
        'Image Classification'
      ],
      
      description: 'Deep learning and computer vision',
      
      /**
       * Linked Projects
       */
      projects: [
        {
          name: 'SVHN Digit Recognition',
          description: '90% accuracy on street view digits',
          tags: ['TensorFlow', 'CNNs', 'Computer Vision'],
          scrollTarget: 'project-svhn',
          filterCategory: 'machine-learning',
          credentials: [
            {
              name: 'MIT Professional Education',
              description: 'Applied Data Science Program',
              year: '2025'
            }
          ]
        },
        {
          name: 'Facial Emotion Detection',
          description: '82% accuracy across 7 emotions',
          tags: ['Keras', 'CNNs', 'Image Classification'],
          scrollTarget: 'project-emotion',
          filterCategory: 'machine-learning',
          credentials: [
            {
              name: 'MIT Professional Education',
              description: 'Applied Data Science Program',
              year: '2025'
            }
          ]
        }
      ]
    }
    
  ],
  
  /**
   * ═══════════════════════════════════════════════════════════════
   * 1.2 CONNECTIONS - SKILL RELATIONSHIPS
   * ═══════════════════════════════════════════════════════════════
   * 
   * Visual web showing how skills integrate and complement each other.
   * Creates lines between major nodes.
   * 
   * Format: [nodeId1, nodeId2]
   * 
   * Connection Logic:
   * - Data pipeline: sql → powerbi, sql → python, sql → r
   * - Programming: python ↔ r (both for analysis)
   * - ML dependencies: ml → python, ml → sql
   * - Microsoft ecosystem: powerbi ↔ excel
   * - Version control: git → python, git → r
   * 
   * ═══════════════════════════════════════════════════════════════
   */
  
  connections: [
    // Core data pipeline
    ['python', 'sql'],      // Python queries databases
    ['r', 'sql'],           // R queries databases
    ['sql', 'powerbi'],     // Power BI uses SQL sources
    ['sql', 'excel'],       // Excel queries databases
    
    // Programming + ML
    ['python', 'ml'],       // Python is the ML language
    ['ml', 'sql'],          // ML needs data from databases
    
    // BI tools integration
    ['powerbi', 'excel'],   // Microsoft ecosystem
    ['powerbi', 'python'],  // Power BI can run Python scripts
    
    // Analysis tools
    ['r', 'python'],        // Both used for statistical analysis
    
    // Version control
    ['python', 'git'],      // Python code versioned
    ['r', 'git']            // R code versioned
  ],
  
  /**
   * ═══════════════════════════════════════════════════════════════
   * 1.3 VISUAL CONFIGURATION
   * ═══════════════════════════════════════════════════════════════
   * 
   * Fine-tune the appearance and behavior of the sphere.
   * 
   * ───────────────────────────────────────────────────────────────
   * TUNING GUIDE
   * ───────────────────────────────────────────────────────────────
   * 
   * Node Sizing:
   *   majorNodeSize: Larger = more prominent, smaller = compact
   *   satelliteNodeSize: Relative to major nodes
   * 
   * Connection Styling:
   *   connectionOpacity: 0.4 = visible web, 0.1 = subtle
   *   connectionWidth: Thicker = stronger visual weight
   * 
   * Rotation Behavior:
   *   autoRotateSpeed: 0 = static, higher = faster spin
   *   rotationDamping: Higher = smoother stop (0.95 = smooth)
   * 
   * Sphere Dimensions:
   *   sphereRadius: Larger = more spread out, smaller = compact
   *   satelliteDistance: Closer = tight orbit, farther = loose
   * 
   * Visual Effects:
   *   depthFading: true = nodes fade when behind sphere
   *   backNodeOpacity: Lower = more transparent when behind
   * 
   * ═══════════════════════════════════════════════════════════════
   */
  
  config: {
    // ───────────────────────────────────────────────────────────────
    // Node Sizing
    // ───────────────────────────────────────────────────────────────
    majorNodeSize: 2.0,                  // Size of core skill nodes
    satelliteNodeSize: 0.65,             // Size of satellite nodes
    
    // ───────────────────────────────────────────────────────────────
    // Connection Styling
    // ───────────────────────────────────────────────────────────────
    connectionOpacity: 0.4,              // Normal connection visibility
    connectionOpacityHover: 1.00,        // Hover state (fully opaque)
    connectionWidth: 2.5,                // Line thickness
    
    // ───────────────────────────────────────────────────────────────
    // Rotation Behavior
    // ───────────────────────────────────────────────────────────────
    autoRotateSpeed: 0.05,               // Slow auto-rotation
    rotationDamping: 0.95,               // Smooth deceleration
    
    // ───────────────────────────────────────────────────────────────
    // Animation Timing
    // ───────────────────────────────────────────────────────────────
    hoverTransitionSpeed: 0.3,           // Hover effect duration
    
    // ───────────────────────────────────────────────────────────────
    // Sphere Dimensions
    // ───────────────────────────────────────────────────────────────
    sphereRadius: 16.5,                  // Overall sphere size
    
    // ───────────────────────────────────────────────────────────────
    // Satellite Distribution
    // ───────────────────────────────────────────────────────────────
    satelliteDistance: 0.255,            // Orbit distance from major node
    
    // ───────────────────────────────────────────────────────────────
    // Visual Effects
    // ───────────────────────────────────────────────────────────────
    nodeGlowIntensity: 0.5,              // Glow effect strength
    depthFading: true,                   // Enable depth-based opacity
    backNodeOpacity: 0.4                 // Opacity when behind sphere
  },
  
  /**
   * ═══════════════════════════════════════════════════════════════
   * 1.4 UI TEXT LABELS
   * ═══════════════════════════════════════════════════════════════
   * 
   * User-facing text displayed in the sphere interface.
   * Separated for easy localization and customization.
   * 
   * ═══════════════════════════════════════════════════════════════
   */
  
  labels: {
    centerTitle: 'Core Skills Network',
    centerSubtitle: '7 Core Competencies',
    instructionsDesktop: 'Drag to rotate • Hover to explore • Click projects to view',
    instructionsMobile: 'Swipe to rotate • Tap to explore • Tap projects to view',
    detailsPanelEmpty: 'Hover over a skill node to see related tools and projects',
    legendTitle: 'CATEGORIES'
  }
  
};


/**
 * ═══════════════════════════════════════════════════════════════════
 * 2. EXPORT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Make data globally available for skills-sphere.js consumption.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

if (typeof window !== 'undefined') {
  window.SKILLS_SPHERE_DATA = SKILLS_SPHERE_DATA;
}


/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready skills sphere data for Mohit Pammu's Portfolio
 * 
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * Statistics:
 * - 7 Major Nodes (Core Skills)
 * - 40 Satellite Nodes (Related Technologies)
 * - 11 Connections (Skill Relationships)
 * - 8 Linked Projects (Portfolio Integration)
 * - 1 External Link (GitHub)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */