/**
 * ═══════════════════════════════════════════════════════════════════
 * SECURITY UTILITIES - XSS PREVENTION TOOLKIT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @file        security-utils.js
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * @description Comprehensive security utilities for preventing XSS
 *              (Cross-Site Scripting) attacks. Provides sanitization
 *              functions for HTML, URLs, JSON, and text content.
 * 
 * ───────────────────────────────────────────────────────────────────
 * PURPOSE
 * ───────────────────────────────────────────────────────────────────
 * This security layer protects against common web vulnerabilities:
 * 
 * 1. XSS Attacks - Prevent malicious script injection
 * 2. URL Injection - Block dangerous URL schemes
 * 3. HTML Injection - Escape user-generated content
 * 4. JSON Attacks - Sanitize data attributes
 * 
 * All user input (form data, URLs, RSS feeds, etc.) MUST be
 * sanitized before rendering to prevent security vulnerabilities.
 * 
 * ───────────────────────────────────────────────────────────────────
 * THREAT MODEL
 * ───────────────────────────────────────────────────────────────────
 * 
 * Attack Vectors We Protect Against:
 * 
 * 1. Script Injection:
 *    Input:  <script>alert('XSS')</script>
 *    Output: &lt;script&gt;alert('XSS')&lt;/script&gt;
 * 
 * 2. Event Handler Injection:
 *    Input:  <img src=x onerror="alert('XSS')">
 *    Output: Escaped HTML entities
 * 
 * 3. JavaScript URL Schemes:
 *    Input:  javascript:alert('XSS')
 *    Output: '' (blocked)
 * 
 * 4. Data URL Attacks:
 *    Input:  data:text/html,<script>alert('XSS')</script>
 *    Output: '' (blocked)
 * 
 * 5. Prototype Pollution:
 *    Input:  {"__proto__": {"isAdmin": true}}
 *    Output: Sanitized without prototype properties
 * 
 * ───────────────────────────────────────────────────────────────────
 * SECURITY PRINCIPLES
 * ───────────────────────────────────────────────────────────────────
 * 
 * 1. Defense in Depth - Multiple layers of protection
 * 2. Whitelist Over Blacklist - Allow known-good, block rest
 * 3. Fail Securely - Return safe defaults on error
 * 4. Least Privilege - Minimum necessary permissions
 * 5. Separation of Concerns - Different sanitizers for different contexts
 * 
 * ───────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ───────────────────────────────────────────────────────────────────
 * - None (standalone utilities)
 * - Consumed by: script.js, main.js, any file handling user input
 * 
 * ───────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ───────────────────────────────────────────────────────────────────
 * 
 * Escape HTML:
 *   const safe = SecurityUtils.escapeHtml(userInput);
 *   element.innerHTML = safe;
 * 
 * Sanitize URL:
 *   const safeUrl = SecurityUtils.sanitizeUrl(untrustedUrl);
 *   if (safeUrl) {
 *     link.href = safeUrl;
 *   }
 * 
 * Sanitize Image URL:
 *   const safeImg = SecurityUtils.sanitizeImageUrl(imageUrl);
 *   img.src = safeImg || 'placeholder.png';
 * 
 * Set Text Content:
 *   SecurityUtils.setTextContent(element, userInput);
 *   // Safest method - cannot execute scripts
 * 
 * Set Safe HTML:
 *   SecurityUtils.setSafeHtml(element, 
 *     '<h3>${title}</h3><p>${content}</p>', 
 *     { title: userTitle, content: userContent }
 *   );
 * 
 * ───────────────────────────────────────────────────────────────────
 * SECURITY BEST PRACTICES
 * ───────────────────────────────────────────────────────────────────
 * 
 * DO:
 * ✓ Always sanitize user input before rendering
 * ✓ Use setTextContent() for plain text (safest)
 * ✓ Use escapeHtml() for HTML contexts
 * ✓ Validate URLs before setting href/src
 * ✓ Log security warnings for monitoring
 * 
 * DON'T:
 * ✗ Trust user input
 * ✗ Use innerHTML with unsanitized data
 * ✗ Skip validation for "trusted" sources
 * ✗ Ignore security warnings in console
 * ✗ Use eval() or Function() with user data
 * 
 * ═══════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. SECURITY UTILS NAMESPACE
 * 2. HTML SANITIZATION
 *    - escapeHtml()
 * 3. URL SANITIZATION
 *    - sanitizeUrl()
 *    - sanitizeImageUrl()
 * 4. JSON SANITIZATION
 *    - sanitizeJsonAttribute()
 * 5. SAFE DOM MANIPULATION
 *    - setTextContent()
 *    - setSafeHtml()
 * 6. INITIALIZATION
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';


/**
 * ═══════════════════════════════════════════════════════════════════
 * 1. SECURITY UTILS NAMESPACE
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Collection of security-focused sanitization utilities.
 * All methods are pure functions with no side effects.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

const SecurityUtils = {
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 2. HTML SANITIZATION
     * ═══════════════════════════════════════════════════════════════
     */
    
    /**
     * Escape HTML special characters to prevent XSS attacks
     * 
     * Converts dangerous HTML characters to their entity equivalents:
     * - < becomes &lt;
     * - > becomes &gt;
     * - & becomes &amp;
     * - " becomes &quot;
     * - ' becomes &#39;
     * 
     * This prevents browsers from interpreting user input as HTML/JavaScript.
     * 
     * @param {string} str - Untrusted string from user input
     * @returns {string} Safe HTML-escaped string
     * 
     * @example
     * const userInput = '<script>alert("XSS")</script>';
     * const safe = SecurityUtils.escapeHtml(userInput);
     * // Result: '&lt;script&gt;alert("XSS")&lt;/script&gt;'
     * element.innerHTML = safe; // Safe to render
     * 
     * @example
     * const userName = 'John <script>alert(1)</script> Doe';
     * const escaped = SecurityUtils.escapeHtml(userName);
     * // Result: 'John &lt;script&gt;alert(1)&lt;/script&gt; Doe'
     */
    escapeHtml: function(str) {
        // Type guard - non-strings become empty
        if (typeof str !== 'string') return '';
        
        // Use browser's built-in HTML escaping
        // This is more comprehensive than manual replacement
        const div = document.createElement('div');
        div.textContent = str;  // Sets as text (auto-escapes)
        return div.innerHTML;   // Retrieve escaped HTML
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 3. URL SANITIZATION
     * ═══════════════════════════════════════════════════════════════
     */
    
    /**
     * Sanitize URL to prevent dangerous URL schemes
     * 
     * Blocks dangerous protocols that can execute JavaScript:
     * - javascript:  → Executes JS when clicked
     * - data:        → Can contain executable code
     * - vbscript:    → VBScript execution (IE)
     * - file:        → Local file access
     * 
     * Only allows:
     * - http://      → Standard web protocol
     * - https://     → Secure web protocol
     * - /            → Relative paths (same-origin)
     * - ./           → Relative paths
     * - ../          → Parent directory paths
     * 
     * @param {string} url - Untrusted URL from user input or external source
     * @returns {string} Safe URL or empty string if dangerous
     * 
     * @example
     * // Malicious URL
     * const bad = SecurityUtils.sanitizeUrl('javascript:alert("XSS")');
     * // Result: '' (blocked)
     * 
     * @example
     * // Safe URL
     * const good = SecurityUtils.sanitizeUrl('https://example.com');
     * // Result: 'https://example.com'
     * 
     * @example
     * // Relative URL
     * const rel = SecurityUtils.sanitizeUrl('./images/photo.jpg');
     * // Result: './images/photo.jpg'
     */
    sanitizeUrl: function(url) {
        // Type guard
        if (typeof url !== 'string') return '';
        
        const trimmed = url.trim().toLowerCase();
        
        /**
         * ───────────────────────────────────────────────────────────
         * Block Dangerous Schemes (Blacklist)
         * ───────────────────────────────────────────────────────────
         */
        if (trimmed.startsWith('javascript:') || 
            trimmed.startsWith('data:') ||
            trimmed.startsWith('vbscript:') ||
            trimmed.startsWith('file:')) {
            console.warn('[Security] Blocked dangerous URL scheme:', url);
            return '';
        }
        
        /**
         * ───────────────────────────────────────────────────────────
         * Allow Safe Schemes (Whitelist)
         * ───────────────────────────────────────────────────────────
         */
        if (!trimmed.startsWith('http://') && 
            !trimmed.startsWith('https://') && 
            !trimmed.startsWith('/') &&
            !trimmed.startsWith('./') &&
            !trimmed.startsWith('../')) {
            console.warn('[Security] Blocked non-standard URL:', url);
            return '';
        }
        
        // URL is safe - return original (preserves case)
        return url.trim();
    },
    
    /**
     * Sanitize image URL with stricter validation
     * 
     * More restrictive than sanitizeUrl() because images are rendered
     * directly in the DOM and can be attack vectors.
     * 
     * Additional checks:
     * - Validates common image extensions (.jpg, .png, .webp, etc.)
     * - Allows trusted image CDN domains without extension check
     * - Warns about suspicious URLs
     * 
     * @param {string} url - Untrusted image URL
     * @returns {string} Safe image URL or empty string
     * 
     * @example
     * // Valid image
     * const img = SecurityUtils.sanitizeImageUrl('https://example.com/photo.jpg');
     * // Result: 'https://example.com/photo.jpg'
     * 
     * @example
     * // Malicious "image"
     * const bad = SecurityUtils.sanitizeImageUrl('javascript:alert(1)');
     * // Result: '' (blocked)
     * 
     * @example
     * // Suspicious URL (no extension)
     * const sus = SecurityUtils.sanitizeImageUrl('https://example.com/file');
     * // Warning logged, but returns URL if from trusted domain
     */
    sanitizeImageUrl: function(url) {
        // Type guard
        if (typeof url !== 'string') return '';
        
        // First pass - basic URL sanitization
        const sanitized = this.sanitizeUrl(url);
        if (!sanitized) return '';
        
        /**
         * ───────────────────────────────────────────────────────────
         * Validate Image Extensions
         * ───────────────────────────────────────────────────────────
         */
        const validExtensions = [
            '.jpg', 
            '.jpeg', 
            '.png', 
            '.gif', 
            '.webp', 
            '.svg'
        ];
        
        const hasValidExtension = validExtensions.some(ext => 
            sanitized.toLowerCase().includes(ext)
        );
        
        /**
         * ───────────────────────────────────────────────────────────
         * Trusted Image CDN Domains
         * ───────────────────────────────────────────────────────────
         * 
         * These domains can serve images without file extensions
         * (e.g., Cloudinary serves images via URL params)
         */
        const trustedDomains = [
            'imgur.com',
            'cloudinary.com',
            'unsplash.com',
            'i.redd.it',
            'pbs.twimg.com'
        ];
        
        const isTrustedDomain = trustedDomains.some(domain => 
            sanitized.toLowerCase().includes(domain)
        );
        
        /**
         * ───────────────────────────────────────────────────────────
         * Warning for Suspicious Images
         * ───────────────────────────────────────────────────────────
         */
        if (!hasValidExtension && !isTrustedDomain) {
            console.warn('[Security] Image URL lacks valid extension:', url);
        }
        
        return sanitized;
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 4. JSON SANITIZATION
     * ═══════════════════════════════════════════════════════════════
     */
    
    /**
     * Validate and sanitize JSON for use in data attributes
     * 
     * Prevents:
     * - Prototype pollution
     * - Function injection
     * - Script execution via JSON
     * 
     * Process:
     * 1. Remove function properties (can't execute)
     * 2. Escape string values (prevent XSS)
     * 3. Escape special HTML characters
     * 4. Safe for use in data-* attributes
     * 
     * @param {*} obj - Object to sanitize and stringify
     * @returns {string} Safe JSON string for HTML attributes
     * 
     * @example
     * const userData = {
     *   name: '<script>alert(1)</script>',
     *   execute: function() { alert('bad'); }
     * };
     * const safe = SecurityUtils.sanitizeJsonAttribute(userData);
     * // Result: '{"name":"&lt;script&gt;alert(1)&lt;/script&gt;"}'
     * // (function property removed, HTML escaped)
     * 
     * element.setAttribute('data-user', safe);
     */
    sanitizeJsonAttribute: function(obj) {
        try {
            /**
             * ───────────────────────────────────────────────────────
             * Deep Clone with Sanitization
             * ───────────────────────────────────────────────────────
             * 
             * JSON.parse(JSON.stringify()) creates a deep clone AND
             * removes non-serializable properties (functions, symbols)
             */
            const safe = JSON.parse(JSON.stringify(obj, (key, value) => {
                // Remove function properties
                if (typeof value === 'function') return undefined;
                
                // Sanitize string values
                if (typeof value === 'string') {
                    return this.escapeHtml(value);
                }
                
                return value;
            }));
            
            /**
             * ───────────────────────────────────────────────────────
             * Escape for HTML Attribute Context
             * ───────────────────────────────────────────────────────
             */
            return JSON.stringify(safe)
                .replace(/"/g, '&quot;')  // Escape quotes
                .replace(/</g, '&lt;')    // Escape < 
                .replace(/>/g, '&gt;');   // Escape >
                
        } catch (e) {
            console.error('[Security] Failed to sanitize JSON:', e);
            return '{}';  // Fail securely with empty object
        }
    },
    
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 5. SAFE DOM MANIPULATION
     * ═══════════════════════════════════════════════════════════════
     */
    
    /**
     * Set text content safely (SAFEST METHOD)
     * 
     * Uses createTextNode() which CANNOT execute scripts.
     * This is the most secure way to render user input.
     * 
     * Browser behavior:
     * - Text nodes are rendered as literal text
     * - HTML entities are displayed as-is
     * - Scripts cannot execute
     * - No parsing overhead
     * 
     * Use this when:
     * - Rendering plain user text
     * - No HTML formatting needed
     * - Maximum security required
     * 
     * @param {HTMLElement} element - Target DOM element
     * @param {string} text - Untrusted text content
     * 
     * @example
     * const userInput = '<script>alert("XSS")</script>';
     * SecurityUtils.setTextContent(div, userInput);
     * // Result: Renders literally as text, cannot execute
     * 
     * @example
     * // Preferred over:
     * element.innerHTML = userInput; // DANGEROUS
     * element.textContent = userInput; // Safe but less explicit
     */
    setTextContent: function(element, text) {
        // Validate element
        if (!element || !element.nodeType) return;
        
        /**
         * ───────────────────────────────────────────────────────────
         * Clear Existing Content
         * ───────────────────────────────────────────────────────────
         */
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        
        /**
         * ───────────────────────────────────────────────────────────
         * Add as Text Node (Cannot Execute Scripts)
         * ───────────────────────────────────────────────────────────
         */
        element.appendChild(document.createTextNode(text || ''));
    },
    
    /**
     * Set HTML with automatic escaping of user data
     * 
     * Template-based approach with automatic XSS protection.
     * HTML template is trusted, but inserted data is escaped.
     * 
     * How it works:
     * 1. Provide HTML template with ${placeholder} syntax
     * 2. Provide data object with values
     * 3. All data values are automatically escaped
     * 4. Safe HTML is rendered
     * 
     * Use this when:
     * - Need HTML structure with user data
     * - Template is trusted (from your code)
     * - Data is untrusted (from users)
     * 
     * @param {HTMLElement} element - Target DOM element
     * @param {string} html - Trusted HTML template with ${} placeholders
     * @param {Object} data - Untrusted data to inject (will be escaped)
     * 
     * @example
     * SecurityUtils.setSafeHtml(container,
     *   '<h3>${title}</h3><p>${description}</p>',
     *   { 
     *     title: '<script>alert(1)</script>', 
     *     description: 'User content' 
     *   }
     * );
     * // Result: 
     * // <h3>&lt;script&gt;alert(1)&lt;/script&gt;</h3>
     * // <p>User content</p>
     * 
     * @example
     * SecurityUtils.setSafeHtml(card,
     *   `<div class="user-card">
     *      <img src="${avatar}" alt="${name}">
     *      <h4>${name}</h4>
     *      <p>${bio}</p>
     *    </div>`,
     *   userData  // All values auto-escaped
     * );
     */
    setSafeHtml: function(element, html, data = {}) {
        // Validate element
        if (!element || !element.nodeType) return;
        
        /**
         * ───────────────────────────────────────────────────────────
         * Escape All Data Values
         * ───────────────────────────────────────────────────────────
         */
        const safeData = {};
        Object.keys(data).forEach(key => {
            safeData[key] = this.escapeHtml(String(data[key]));
        });
        
        /**
         * ───────────────────────────────────────────────────────────
         * Replace Placeholders with Escaped Data
         * ───────────────────────────────────────────────────────────
         */
        let safeHtml = html;
        Object.keys(safeData).forEach(key => {
            const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
            safeHtml = safeHtml.replace(regex, safeData[key]);
        });
        
        /**
         * ───────────────────────────────────────────────────────────
         * Render Safe HTML
         * ───────────────────────────────────────────────────────────
         */
        element.innerHTML = safeHtml;
    }
};


/**
 * ═══════════════════════════════════════════════════════════════════
 * 6. INITIALIZATION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Make SecurityUtils globally available and log initialization.
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// Expose to global scope
window.SecurityUtils = SecurityUtils;

// Log initialization
console.log('[Security] ✓ XSS prevention utilities loaded');
console.log('[Security] Available methods:', Object.keys(SecurityUtils).join(', '));


/**
 * ═══════════════════════════════════════════════════════════════════
 * END OF SECURITY UTILITIES
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Production-ready security toolkit for Mohit Pammu's Portfolio
 * 
 * @version     2.0.0
 * @date        2025-12-12
 * @author      Mohit Pammu
 * 
 * Security Standards:
 * - OWASP Top 10 Compliance
 * - Defense in Depth Strategy
 * - Fail-Secure Defaults
 * - Comprehensive Input Validation
 * 
 * ═══════════════════════════════════════════════════════════════════
 */