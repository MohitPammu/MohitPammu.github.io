/**
 * Portfolio Website - Main JavaScript
 */

console.log("Script loaded successfully!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    // DOM Elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    const themeToggler = document.querySelector('.theme-switcher');
    const backToTopBtn = document.querySelector('.back-to-top');
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const yearSpan = document.getElementById('current-year');
    
    // Set current year in footer
    yearSpan.textContent = new Date().getFullYear();
    
    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('nav') && 
            !e.target.closest('.hamburger')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the target section
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Typed Text Animation
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    const textArray = ['Data Scientist', 'Problem Solver', 'Freelancer'];
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
    
// Improved Project Filtering Function
projectFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        console.log("Filter button clicked");
        
        // Remove active class from all filters
        projectFilters.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Log the filter value for debugging
        console.log("Filter clicked:", filterValue);
        
        // Get DOM elements
        const mainProjectsGrid = document.querySelector('.projects-grid:not(#more-projects)');
        const moreProjects = document.getElementById("more-projects");
        const viewMoreBtn = document.getElementById('view-more-projects');
        
        if (!moreProjects) {
            console.error("more-projects element not found");
            return;
        }
        
        // Check if more-projects was hidden before filtering
        const wasHidden = moreProjects.classList.contains("hidden");
        console.log("more-projects was hidden:", wasHidden);
        
        // Track matches in main and more-projects sections
        let matchesInMain = 0;
        let matchesInMore = 0;
        
        // Debug all project cards and their categories
        console.log("All project cards:");
        const allCards = document.querySelectorAll('.project-card');
        console.log(`Found ${allCards.length} project cards`);
        
        allCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'No title';
            console.log(`Card ${index + 1}: "${title}" - Category: "${category}"`);
        });
        
        // Filter projects in both grids
        allCards.forEach(card => {
            const isInMoreProjects = card.closest('#more-projects') !== null;
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : 'No title';
            
            // Log the card category for debugging
            console.log(`Processing card: "${cardTitle}" with category "${cardCategory}"`);
            console.log(`Comparing with filter: "${filterValue}"`);
            
            // Check if the card matches the selected filter
            const matches = filterValue === 'all' || cardCategory === filterValue;
            console.log(`Match result: ${matches ? 'YES' : 'NO'}`);
            
            if (matches) {
                card.style.display = 'flex';
                console.log(`Showing card: "${cardTitle}"`);
                
                if (isInMoreProjects) {
                    matchesInMore++;
                } else {
                    matchesInMain++;
                }
            } else {
                card.style.display = 'none';
                console.log(`Hiding card: "${cardTitle}"`);
            }
        });
        
        console.log("Matches in main:", matchesInMain, "Matches in more:", matchesInMore);
        
        // Special case for "all" filter - always hide more projects and show button
        if (filterValue === 'all') {
            moreProjects.classList.add('hidden');
            if (viewMoreBtn) viewMoreBtn.style.display = 'inline-block';
            return;
        }
        
        // For other filters: if there are matches in more section, show the section
        // and hide the button; otherwise hide section and hide button too
        if (matchesInMore > 0) {
            moreProjects.classList.remove('hidden');
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        } else {
            moreProjects.classList.add('hidden');
            if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        }
    });
});

// View More Projects Button
const viewMoreProjectsBtn = document.getElementById('view-more-projects');
if (viewMoreProjectsBtn) {
    viewMoreProjectsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const moreProjects = document.getElementById("more-projects");
        if (moreProjects.classList.contains("hidden")) {
            // Show more projects
            moreProjects.classList.remove("hidden");
            this.textContent = "Show Less Projects";
        } else {
            // Hide more projects
            moreProjects.classList.add("hidden");
            this.textContent = "View More Projects";
        }
    });
}
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validate form data
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            if (!nameInput.value.trim()) {
                nameInput.style.borderColor = 'red';
                isValid = false;
            } else {
                nameInput.style.borderColor = '';
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                emailInput.style.borderColor = 'red';
                isValid = false;
            } else {
                emailInput.style.borderColor = '';
            }
            
            if (!subjectInput.value.trim()) {
                subjectInput.style.borderColor = 'red';
                isValid = false;
            } else {
                subjectInput.style.borderColor = '';
            }
            
            if (!messageInput.value.trim()) {
                messageInput.style.borderColor = 'red';
                isValid = false;
            } else {
                messageInput.style.borderColor = '';
            }
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For now, we'll just log it and show a success message
                console.log('Form submitted:', formValues);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully!';
                successMessage.style.color = 'green';
                successMessage.style.marginTop = '1rem';
                successMessage.style.textAlign = 'center';
                
                // Add success message to form
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Theme Switcher
    themeToggler.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggler.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggler.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggler.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Back to Top Button
    window.addEventListener('scroll', () => {
        // Show/hide back to top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
        
        // Add scrolled class to header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Back to Top Button Click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Download CV Button
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            // Allow the default behavior to download the CV
        });
    }
    
    // Add placeholder image for project cards
    document.querySelectorAll('.project-img img').forEach(img => {
        if (img.getAttribute('src').includes('project-placeholder.jpg')) {
            // Create a colored placeholder with project number
            const projectCard = img.closest('.project-card');
            const projectIndex = Array.from(projectCards).indexOf(projectCard) + 1;
            
            const placeholderDiv = document.createElement('div');
            placeholderDiv.className = 'project-placeholder';
            placeholderDiv.textContent = `Project ${projectIndex}`;
            placeholderDiv.style.backgroundColor = getRandomColor();
            placeholderDiv.style.color = 'white';
            placeholderDiv.style.display = 'flex';
            placeholderDiv.style.justifyContent = 'center';
            placeholderDiv.style.alignItems = 'center';
            placeholderDiv.style.height = '100%';
            placeholderDiv.style.fontSize = '1.5rem';
            placeholderDiv.style.fontWeight = 'bold';
            
            img.parentNode.replaceChild(placeholderDiv, img);
        }
    });
    
    // Helper function to generate random colors for project placeholders
    function getRandomColor() {
        const colors = [
            '#4a6cf7', // Primary color
            '#6d8dfa', // Darker primary
            '#3d5ce0', // Lighter primary
            '#6c757d', // Secondary color
            '#5a6268', // Darker secondary
            '#7d868c'  // Lighter secondary
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});
