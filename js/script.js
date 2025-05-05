// Main JavaScript for Portfolio Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Typed text animation for hero section
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    const textArray = ["Data Scientist", "Machine Learning Engineer", "Data Analyst"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains('typing')) {
                cursorSpan.classList.add('typing');
            }
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove('typing');
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) {
                textArrayIndex = 0;
            }
            setTimeout(type, typingDelay + 1100);
        }
    }
    
    if (textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a hash link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                    
                    // Update active link
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
// Filter projects
if (filterValue === 'all') {
    const mainProjectCards = document.querySelectorAll('.projects-grid > .project-card');
    mainProjectCards.forEach(card => {
        showElement(card);
    });
    
    // Make sure more projects are properly hidden
    if (moreProjects) {
        moreProjects.classList.add('hidden');
        const moreProjectCards = document.querySelectorAll('#more-projects .project-card');
        moreProjectCards.forEach(card => {
            hideElement(card);
        });
    }
    
    // Ensure View More button is visible and properly labeled
    if (viewMoreBtn) {
        viewMoreBtn.style.display = 'inline-block';
        viewMoreBtn.textContent = 'View More Projects';
    }
} else {
    // Filter by category
    const allProjectCards = document.querySelectorAll('.project-card');
    allProjectCards.forEach(card => {
        if (card.getAttribute('data-category') === filterValue) {
            showElement(card);
        } else {
            hideElement(card);
        }
    });
    
    // Show more projects section but hide the button
    if (moreProjects) {
        moreProjects.classList.remove('hidden');
    }
    
    if (viewMoreBtn) {
        viewMoreBtn.style.display = 'none';
    }
}

// View More Projects Button
if (viewMoreBtn && moreProjects) {
    viewMoreBtn.addEventListener('click', function() {
        if (moreProjects.classList.contains('hidden')) {
            // Show more projects
            moreProjects.classList.remove('hidden');
            this.textContent = 'View Less Projects';
            
            // Make sure all more projects are visible (if no filter is active)
            const activeFilter = document.querySelector('.filter-btn.active');
            const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            
            const moreProjectCards = document.querySelectorAll('#more-projects .project-card');
            moreProjectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    // First set display, then opacity for smooth transition
                    card.style.display = 'flex';
                    // Use requestAnimationFrame for smoother transitions
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                    });
                }
            });
        } else {
            // Properly hide more projects
            const moreProjectCards = document.querySelectorAll('#more-projects .project-card');
            moreProjectCards.forEach(card => {
                card.style.opacity = '0';
            });
            
            // Wait for transition to complete before changing display
            setTimeout(() => {
                moreProjects.classList.add('hidden');
                this.textContent = 'View More Projects';
            }, 300); // Match your transition duration
        }
    });
}
    
    // Theme switcher
    const themeSwitcher = document.querySelector('.theme-switcher');
    const rootEl = document.documentElement;
    
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            if (rootEl.getAttribute('data-theme') === 'dark') {
                rootEl.removeAttribute('data-theme');
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            } else {
                rootEl.setAttribute('data-theme', 'dark');
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            rootEl.setAttribute('data-theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Update current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // You can add form submission logic here (e.g., AJAX call)
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});
