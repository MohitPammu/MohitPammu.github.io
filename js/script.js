/**
 * Portfolio Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
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
    
// Improved Project Filtering
projectFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        // Remove active class from all filters
        projectFilters.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Access DOM elements
        const mainProjectsGrid = document.querySelector('.projects-grid:not(#more-projects)');
        const moreProjects = document.getElementById("more-projects");
        const viewMoreBtn = document.getElementById('view-more-projects');
        const allCards = document.querySelectorAll('.project-card');
        
        // Check if more-projects was hidden
        const wasHidden = moreProjects.classList.contains("hidden");
        
        // Temporarily show all projects for filtering
        if (wasHidden) {
            // Ensure proper display mode before removing hidden class
            moreProjects.style.display = 'grid'; 
            moreProjects.classList.remove("hidden");
        }
        
        // Track matches in each section
        let matchesInMain = 0;
        let matchesInMore = 0;
        
        // Filter all projects
        allCards.forEach(card => {
            const isInMoreProjects = card.closest('#more-projects') !== null;
            const matches = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
            
            if (matches) {
                // Force proper display mode for cards
                card.style.display = 'flex';
                card.style.opacity = '0';
                
                // Slight delay for visual effect
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
                
                // Track where matches were found
                if (isInMoreProjects) {
                    matchesInMore++;
                } else {
                    matchesInMain++;
                }
            } else {
                // Hide non-matching cards with animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Explicitly set grid display for more reliable layout
        mainProjectsGrid.style.display = 'grid';
        if (!wasHidden || matchesInMore > 0) {
            moreProjects.style.display = 'grid';
        }
        
        // Force grid layout to use proper columns
        const setGridColumns = () => {
            // For desktop: use proper grid layout
            if (window.innerWidth > 768) {
                mainProjectsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                moreProjects.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            } else {
                // For mobile: single column layout
                mainProjectsGrid.style.gridTemplateColumns = '1fr';
                moreProjects.style.gridTemplateColumns = '1fr';
            }
        };
        
        // Set proper grid columns
        setGridColumns();
        
        // Force proper display immediately
setTimeout(() => {
    if (matchesInMore > 0) {
        moreProjects.style.display = 'grid';
        moreProjects.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        
        // Force each visible card in more-projects to use flex display
        moreProjects.querySelectorAll('.project-card').forEach(card => {
            if (card.style.display !== 'none') {
                card.style.display = 'flex';
            }
        });
    }
}, 10);
        
        // Manage visibility of more-projects section
        if (matchesInMore > 0) {
            // Keep more-projects visible and update button
            viewMoreBtn.textContent = "Show Less Projects";
            viewMoreBtn.style.display = 'inline-block';
        } else if (wasHidden) {
            // If no matches in more-projects and it was hidden before, hide it again
            setTimeout(() => {
                moreProjects.classList.add("hidden");
            }, 300);
            viewMoreBtn.textContent = "View More Projects";
        }
    });
});
    
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
    
// View More Projects Button
const viewMoreProjectsBtn = document.getElementById('view-more-projects');
if (viewMoreProjectsBtn) {
    viewMoreProjectsBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default anchor link behavior
        
        // Reveal the hidden projects
        const moreProjects = document.getElementById("more-projects");
        if (moreProjects.classList.contains("hidden")) {
            moreProjects.classList.remove("hidden");
            this.textContent = "Show Less Projects"; // Update button text
        } else {
            // Add fadeOut animation
            moreProjects.style.animation = "fadeOut 0.5s ease-in-out";
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                moreProjects.classList.add("hidden");
                // Reset the animation property for next time
                moreProjects.style.animation = "";
            }, 500); // 500ms matches the animation duration
    
            this.textContent = "View More Projects"; // Reset button text
        }
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
    
    // Initialize AOS (Animate On Scroll) - This is a placeholder for if you want to add AOS library later
    // If you add the AOS library, uncomment this code
    /*
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    */
});

// Other existing JavaScript code

