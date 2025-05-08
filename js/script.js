// Main JavaScript for Portfolio Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Typed text animation for hero section
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    const textArray = ["Data Scientist", "Problem Solver", "Impact Analyst", "Data Storyteller", "Insight Architect"];
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

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Initialize showing all projects
    projectCards.forEach(card => {
        card.classList.add('visible');
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                // First remove visible class for animation
                card.classList.remove('visible');
                
                // Small delay to allow animation
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('visible');
                    }
                }, 50);
            });
        });
    });


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

// Form submission handling with fade-in effect
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
        
        // Create FormData object from the form
        const formData = new FormData(this);
        
        // Submit form via fetch
        fetch('https://formspree.io/f/meoggbop', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Create success message
            const formContainer = contactForm.parentNode;
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-lg); background-color: var(--card-bg); 
                border-radius: var(--border-radius-md); box-shadow: 0 5px 15px var(--shadow-color); opacity: 0; transition: opacity 0.6s ease;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: var(--spacing-md);"></i>
                    <h3 style="margin-bottom: var(--spacing-sm);">Thank you for your message!</h3>
                    <p style="color: var(--light-text-color);">I will get back to you as soon as possible.</p>
                </div>
            `;
            
            // Hide the form 
            contactForm.style.display = 'none';
            formContainer.insertBefore(successMsg, contactForm);
            
            // Get the inner div element for the animation
            const successContent = successMsg.querySelector('div');
            
            // Trigger fade-in effect after a small delay
            setTimeout(() => {
                successContent.style.opacity = '1';
            }, 100);
            
            // Clear the form
            contactForm.reset();
            
            // Set a timer to fade out and then show the form again
            setTimeout(function() {
                // Fade out
                successContent.style.opacity = '0';
                
                // Remove message and show form after fade-out completes
                setTimeout(() => {
                    successMsg.remove();
                    contactForm.style.display = 'block';
                }, 600); // Match the transition duration
                
            }, 4000); // Display success message for 4 seconds
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! There was a problem submitting your form. Please try again.');
        });
    });
}

// News Feed Function - GitHub Actions Updated Version
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Center the intro text
    const introText = document.querySelector('.news p, .section-header p');
    if (introText) {
        introText.style.textAlign = 'center';
        introText.style.marginBottom = '30px';
        introText.style.color = 'var(--light-text-color)';
    }
    
// Comprehensive source icons for data science and business publications
const sourceIcons = {
    // Data Science Publications
    simplilearn: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2ZmNjUwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
    unite: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzUwNTVlYiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5VPC90ZXh0Pjwvc3ZnPg==',
    towards: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAzYTlmNCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
    kdnuggets: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2ZmZDcwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiPks8L3RleHQ+PC9zdmc+',
    analyticsvidhya: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzJkYmZkZiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5BPC90ZXh0Pjwvc3ZnPg==',
    medium: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5NPC90ZXh0Pjwvc3ZnPg==',
    datacamp: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAzZWY2MiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5EPC90ZXh0Pjwvc3ZnPg==',
    elmhurst: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMjE1NiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5FPC90ZXh0Pjwvc3ZnPg==',
    stackoverflow: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2YyODAyMSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
    github: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzI0MjkyZSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5HPC90ZXh0Pjwvc3ZnPg==',
    kaggle: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzIwYmVmZiIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5LPC90ZXh0Pjwvc3ZnPg==',
    machinelearningmastery: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzQyODVmNCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5NPC90ZXh0Pjwvc3ZnPg==',
    
    // Business and Tech Publications
    forbes: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAxMDEwMSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5GPC90ZXh0Pjwvc3ZnPg==',
    techcrunch: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzBhOTg1OSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
    venturebeat: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzE5MTk3MCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5WPC90ZXh0Pjwvc3ZnPg==',
    wired: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5XPC90ZXh0Pjwvc3ZnPg==',
    ieee: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwNjJhZCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5JPC90ZXh0Pjwvc3ZnPg==',
    datanami: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2ZmNzYwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5EPC90ZXh0Pjwvc3ZnPg==',
    insidebigdata: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2U2NTEyOCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5JPC90ZXh0Pjwvc3ZnPg==',
    bloomberg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5CPC90ZXh0Pjwvc3ZnPg==',
    harvard: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2E0MTAzNCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5IPC90ZXh0Pjwvc3ZnPg==',
    zdnet: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5aPC90ZXh0Pjwvc3ZnPg==',
    
    // Default fallback
    default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzc1NzU3NSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg=='
};
    
// Get source icon based on source name or URL
function getSourceIcon(source, url) {
    if (!source && !url) return sourceIcons.default;
    
    // Check source name first (case insensitive)
    if (source) {
        const sourceLower = source.toLowerCase();
        
        // Data Science Publications
        if (sourceLower.includes('simplilearn')) return sourceIcons.simplilearn;
        if (sourceLower.includes('unite')) return sourceIcons.unite;
        if (sourceLower.includes('towards data science')) return sourceIcons.towards;
        if (sourceLower.includes('kdnuggets')) return sourceIcons.kdnuggets;
        if (sourceLower.includes('analytics vidhya')) return sourceIcons.analyticsvidhya;
        if (sourceLower.includes('medium')) return sourceIcons.medium;
        if (sourceLower.includes('datacamp')) return sourceIcons.datacamp;
        if (sourceLower.includes('elmhurst')) return sourceIcons.elmhurst;
        if (sourceLower.includes('stack overflow')) return sourceIcons.stackoverflow;
        if (sourceLower.includes('github')) return sourceIcons.github;
        if (sourceLower.includes('kaggle')) return sourceIcons.kaggle;
        if (sourceLower.includes('machine learning mastery')) return sourceIcons.machinelearningmastery;
        
        // Business and Tech Publications
        if (sourceLower.includes('forbes')) return sourceIcons.forbes;
        if (sourceLower.includes('techcrunch')) return sourceIcons.techcrunch;
        if (sourceLower.includes('venturebeat')) return sourceIcons.venturebeat;
        if (sourceLower.includes('wired')) return sourceIcons.wired;
        if (sourceLower.includes('ieee')) return sourceIcons.ieee;
        if (sourceLower.includes('datanami')) return sourceIcons.datanami;
        if (sourceLower.includes('inside big data')) return sourceIcons.insidebigdata;
        if (sourceLower.includes('bloomberg')) return sourceIcons.bloomberg;
        if (sourceLower.includes('harvard')) return sourceIcons.harvard;
        if (sourceLower.includes('zdnet')) return sourceIcons.zdnet;
    }
    
    // Fallback to URL check if source name doesn't match
    if (url) {
        const urlLower = url.toLowerCase();
        
        // Data Science Publications
        if (urlLower.includes('simplilearn.com')) return sourceIcons.simplilearn;
        if (urlLower.includes('unite.ai')) return sourceIcons.unite;
        if (urlLower.includes('towardsdatascience.com')) return sourceIcons.towards;
        if (urlLower.includes('kdnuggets.com')) return sourceIcons.kdnuggets;
        if (urlLower.includes('analyticsvidhya.com')) return sourceIcons.analyticsvidhya;
        if (urlLower.includes('medium.com')) return sourceIcons.medium;
        if (urlLower.includes('datacamp.com')) return sourceIcons.datacamp;
        if (urlLower.includes('elmhurst.edu')) return sourceIcons.elmhurst;
        if (urlLower.includes('stackoverflow.com')) return sourceIcons.stackoverflow;
        if (urlLower.includes('github.com')) return sourceIcons.github;
        if (urlLower.includes('kaggle.com')) return sourceIcons.kaggle;
        if (urlLower.includes('machinelearningmastery.com')) return sourceIcons.machinelearningmastery;
        
        // Business and Tech Publications
        if (urlLower.includes('forbes.com')) return sourceIcons.forbes;
        if (urlLower.includes('techcrunch.com')) return sourceIcons.techcrunch;
        if (urlLower.includes('venturebeat.com')) return sourceIcons.venturebeat;
        if (urlLower.includes('wired.com')) return sourceIcons.wired;
        if (urlLower.includes('ieee.org')) return sourceIcons.ieee;
        if (urlLower.includes('datanami.com')) return sourceIcons.datanami;
        if (urlLower.includes('insidebigdata.com')) return sourceIcons.insidebigdata;
        if (urlLower.includes('bloomberg.com')) return sourceIcons.bloomberg;
        if (urlLower.includes('hbr.org')) return sourceIcons.harvard;
        if (urlLower.includes('zdnet.com')) return sourceIcons.zdnet;
    }
    
    // Return default icon if no match
    return sourceIcons.default;
}
    
    // Format date 
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return dateString;
        }
    }
    
// Create news layout with the provided items
function createNewsLayout(items) {
    // Clear container
    newsContainer.innerHTML = '';
    
    // Create centered container with 2-column grid
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 1100px; 
        margin: 0 auto;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
        gap: 30px;
    `;
    
    // Limit to 4 articles (for 2x2 grid)
    const limitedItems = items.slice(0, 4);
    
    // Process each news item
    limitedItems.forEach((item, index) => {
        // Extract source name
        const sourceName = item.source || 'News';
        
        // Article container - styled like project cards
        const articleEl = document.createElement('div');
        articleEl.style.cssText = `
            padding: 24px;
            height: 100%;
            width: 100%;
            text-align: left;
            background-color: var(--card-bg, #ffffff);
            border-radius: var(--border-radius-md, 8px);
            box-shadow: 0 5px 15px var(--shadow-color, rgba(0, 0, 0, 0.1));
            transition: transform var(--transition-fast, 0.3s ease);
            position: relative;
            overflow: hidden;
        `;
        
        // Add hover effect like project cards
        articleEl.onmouseover = function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px var(--shadow-color, rgba(0, 0, 0, 0.15))';
        };
        
        articleEl.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px var(--shadow-color, rgba(0, 0, 0, 0.1))';
        };

        // Add thematic background icon based on title keywords
        const categoryIcon = document.createElement('div');
        categoryIcon.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 3rem;
            opacity: 0.07;
            color: var(--primary-color);
        `;

        // Choose icon based on article content
        let iconClass = 'fa-chart-line'; // Default icon
        
        if (item.title.toLowerCase().includes('ai') || 
            item.title.toLowerCase().includes('machine learning') || 
            item.title.toLowerCase().includes('generative')) {
            iconClass = 'fa-robot';
        } else if (item.title.toLowerCase().includes('python')) {
            iconClass = 'fa-python';
        } else if (item.title.toLowerCase().includes('data')) {
            iconClass = 'fa-database';
        } else if (item.title.toLowerCase().includes('code') || 
                  item.title.toLowerCase().includes('programming')) {
            iconClass = 'fa-code';
        } else if (item.title.toLowerCase().includes('analytics')) {
            iconClass = 'fa-chart-pie';
        }

        categoryIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
        articleEl.appendChild(categoryIcon);
        
        // Title first - Article title
        const titleEl = document.createElement('h3');
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: var(--h4-size, 1.25rem);
            font-weight: 500;
            line-height: 1.4;
            text-align: left;
            position: relative;
            z-index: 2;
        `;
        
        const titleLink = document.createElement('a');
        titleLink.href = item.link;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = item.title;
        titleLink.style.cssText = `
            color: var(--text-color, #333);
            text-decoration: none;
            transition: color var(--transition-fast, 0.3s ease);
        `;
        
        // Add hover effect
        titleLink.onmouseover = function() {
            this.style.color = 'var(--primary-color, #4a6cf7)';
        };
        
        titleLink.onmouseout = function() {
            this.style.color = 'var(--text-color, #333)';
        };
        
        titleEl.appendChild(titleLink);
        
        // Source row with logo SECOND
        const sourceRow = document.createElement('div');
        sourceRow.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            text-align: left;
            position: relative;
            z-index: 2;
        `;
        
        // Source icon
        const sourceIcon = getSourceIcon(sourceName, item.link);
        const logoImg = document.createElement('img');
        logoImg.src = sourceIcon;
        logoImg.alt = '';
        logoImg.style.cssText = `
            width: 24px;
            height: 24px;
            margin-right: 10px;
            border-radius: 50%;
        `;
        
        // Fallback if logo fails to load
        logoImg.onerror = function() {
            this.src = sourceIcons.default;
            this.onerror = null;
        };
        
        // Source text
        const sourceText = document.createElement('span');
        sourceText.innerHTML = `In <strong>${sourceName}</strong> by ${item.author || 'Staff Writer'}`;
        sourceText.style.cssText = `
            font-size: var(--small-size, 0.875rem);
            color: var(--light-text-color, #6c757d);
        `;
        
        // Add logo and text to source row
        sourceRow.appendChild(logoImg);
        sourceRow.appendChild(sourceText);
        
        // Publication date
        const dateEl = document.createElement('div');
        dateEl.textContent = formatDate(item.pubDate);
        dateEl.style.cssText = `
            font-size: var(--small-size, 0.875rem);
            color: var(--light-text-color, #6c757d);
            text-align: left;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
        `;
        
        // Add a "Read More" link styled similar to project links
        const readMoreLink = document.createElement('div');
        readMoreLink.style.cssText = `
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid var(--border-color, #e9e9e9);
            display: flex;
            position: relative;
            z-index: 2;
        `;
        
        const readMoreAnchor = document.createElement('a');
        readMoreAnchor.href = item.link;
        readMoreAnchor.target = '_blank';
        readMoreAnchor.rel = 'noopener noreferrer';
        readMoreAnchor.innerHTML = '<i class="fas fa-external-link-alt"></i> Read Article';
        readMoreAnchor.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--primary-color, #4a6cf7);
            font-size: var(--small-size, 0.875rem);
            font-weight: 500;
            text-decoration: none;
            transition: color var(--transition-fast, 0.3s ease);
        `;
        
        readMoreAnchor.onmouseover = function() {
            this.style.color = 'var(--secondary-color, #6c757d)';
        };
        
        readMoreAnchor.onmouseout = function() {
            this.style.color = 'var(--primary-color, #4a6cf7)';
        };
        
        readMoreLink.appendChild(readMoreAnchor);
        
        // Assemble article - new order with flex for vertical positioning
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            z-index: 2;
        `;
        
        contentWrapper.appendChild(titleEl);       // 1. Title on top
        contentWrapper.appendChild(sourceRow);     // 2. Source info underneath
        contentWrapper.appendChild(dateEl);        // 3. Date
        
        // Add a spacer to push the Read More link to bottom
        const spacer = document.createElement('div');
        spacer.style.flexGrow = '1';
        contentWrapper.appendChild(spacer);
        
        contentWrapper.appendChild(readMoreLink);  // 4. Read More link at bottom
        
        articleEl.appendChild(contentWrapper);
        
        // Add to container
        container.appendChild(articleEl);
    });
    
    // More News button
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
        display: flex;
        justify-content: center;
        margin-top: 32px;
        grid-column: 1 / -1;
        width: 100%;
    `;
    
    const moreNewsBtn = document.createElement('a');
    moreNewsBtn.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
    moreNewsBtn.target = "_blank";
    moreNewsBtn.rel = "noopener noreferrer";
    moreNewsBtn.textContent = "More News";
    moreNewsBtn.className = "btn secondary-btn";
    
    btnContainer.appendChild(moreNewsBtn);
    container.appendChild(btnContainer);
    
    // Add the container to the news container
    newsContainer.appendChild(container);
}
    
    // Show loading indicator
    newsContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100px;"><div style="width:30px;height:30px;border:3px solid var(--border-color, #eee);border-top:3px solid var(--primary-color, #4a6cf7);border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    
    // Add animation for spinner
    if (!document.getElementById('spinner-style')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'spinner-style';
        styleEl.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(styleEl);
    }
    
    // Fallback content in case the file loading fails
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: "2025-05-03T07:00:00Z",
            author: "Staff Writer",
            source: "Simplilearn"
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: "2025-05-01T07:00:00Z",
            author: "Staff Writer",
            source: "Unite.AI"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: "2025-05-02T05:52:00Z",
            author: "Staff Writer",
            source: "Towards Data Science"
        }
    ];
    
    // Load news from static JSON file
    fetch('/assets/data/news.json?' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.items && data.items.length > 0) {
                console.log("Loaded news data successfully!");
                // Process and create the news layout
                createNewsLayout(data.items);
                
                // Add last updated info
                if (data.lastUpdated) {
                    const updatedInfo = document.createElement('div');
                    updatedInfo.style.cssText = `
                        text-align: center;
                        font-size: 0.75rem;
                        color: var(--light-text-color, #6c757d);
                        margin-top: 20px;
                    `;
                    updatedInfo.textContent = `Last updated: ${formatDate(data.lastUpdated)}`;
                    newsContainer.appendChild(updatedInfo);
                }
            } else {
                throw new Error('No items returned or invalid data format');
            }
        })
        .catch(error => {
            console.error("Error loading news:", error);
            // Use fallback content if the file loading fails
            createNewsLayout(fallbackContent);
        });
}

// Call the function to load the news
loadIndustryNews();
    
});
