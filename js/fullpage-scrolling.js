// Content-respecting scrolling with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing content-respecting scrolling');
    
    // DOM Elements
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const backToTopBtn = document.querySelector('.back-to-top');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 70;
    
    // Configure Intersection Observer for section detection
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When section is visible at top of viewport (accounting for header)
            if (entry.isIntersecting && 
                entry.boundingClientRect.top <= headerHeight + 20) {
                const activeId = entry.target.getAttribute('id');
                
                // Update navigation
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Show/hide back to top button
                if (activeId !== 'home') {
                    backToTopBtn?.classList.add('active');
                } else {
                    backToTopBtn?.classList.remove('active');
                }
                
                // Trigger custom event for section change
                document.dispatchEvent(new CustomEvent('sectionChanged', {
                    detail: { id: activeId, index: Array.from(sections).findIndex(s => s.id === activeId) }
                }));
            }
        });
    }, { 
        // Use root margin to trigger slightly before section reaches top
        rootMargin: `-${headerHeight + 5}px 0px -${window.innerHeight - headerHeight - 50}px 0px`,
        threshold: 0
    });
    
    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId.startsWith('#')) return; // Skip external links
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            // Calculate offset accounting for header
            const offset = targetSection.offsetTop - headerHeight;
            
            // Scroll to target with smooth behavior
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('nav ul');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active') && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Update scroll position for hash in URL on load
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'auto'
                });
            }, 100);
        }
    }
});
