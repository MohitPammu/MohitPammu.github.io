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

// Form submission handling for Formspree
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
            // Show success message
            const formContainer = contactForm.parentNode;
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-lg); background-color: var(--card-bg); 
                border-radius: var(--border-radius-md); box-shadow: 0 5px 15px var(--shadow-color);">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: var(--spacing-md);"></i>
                    <h3 style="margin-bottom: var(--spacing-sm);">Thank you for your message!</h3>
                    <p style="color: var(--light-text-color);">I will get back to you as soon as possible.</p>
                </div>
            `;
            
            // Hide the form 
            contactForm.style.display = 'none';
            formContainer.insertBefore(successMsg, contactForm);
            
            // Clear the form
            contactForm.reset();
            
            // Set a timer to show the form again after 30 seconds
            setTimeout(function() {
                successMsg.remove();
                contactForm.style.display = 'block';
            }, 30000);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! There was a problem submitting your form. Please try again.');
        });
    });
}

// News Feed Function with GitHub Pages compatibility
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
    
    // Embedded Base64 icons for common news sources (compatible with GitHub Pages CSP)
    const sourceIcons = {
        google: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzQyODVmNCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5HPC90ZXh0Pjwvc3ZnPg==',
        simplilearn: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iI2ZmNjUwMCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
        unite: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzUwNTVlYiIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5VPC90ZXh0Pjwvc3ZnPg==',
        towards: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzAzYTlmNCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
        newswise: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzFhNzNlOCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg==',
        techtarget: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzQwNDA0MCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
        medium: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5NPC90ZXh0Pjwvc3ZnPg==',
        default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzc1NzU3NSIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg=='
    };
    
    // Get icon for a source based on URL
    function getSourceIcon(url) {
        if (!url) return sourceIcons.default;
        
        const urlLower = url.toLowerCase();
        if (urlLower.includes('simplilearn.com')) return sourceIcons.simplilearn;
        if (urlLower.includes('unite.ai')) return sourceIcons.unite;
        if (urlLower.includes('towardsdatascience.com')) return sourceIcons.towards;
        if (urlLower.includes('newswise.com')) return sourceIcons.newswise;
        if (urlLower.includes('techtarget.com')) return sourceIcons.techtarget;
        if (urlLower.includes('medium.com')) return sourceIcons.medium;
        if (urlLower.includes('google.com')) return sourceIcons.google;
        
        return sourceIcons.default;
    }
    
    // Get source name based on URL
    function getSourceName(url) {
        if (!url) return 'News';
        
        try {
            const urlLower = url.toLowerCase();
            if (urlLower.includes('simplilearn.com')) return 'Simplilearn';
            if (urlLower.includes('unite.ai')) return 'Unite.AI';
            if (urlLower.includes('towardsdatascience.com')) return 'Towards Data Science';
            if (urlLower.includes('newswise.com')) return 'Newswise';
            if (urlLower.includes('techtarget.com')) return 'TechTarget';
            if (urlLower.includes('medium.com')) return 'Medium';
            
            // Extract domain name
            const domain = new URL(url).hostname.replace('www.', '');
            const parts = domain.split('.');
            
            if (parts.length > 0) {
                return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            }
            
            return domain;
        } catch (e) {
            console.error("Error parsing URL:", e);
            return 'News';
        }
    }
    
    // Format date to "Month Day, Year" format
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    }
    
    // Simplified version of fallback content (only 3 articles)
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Staff Writer"
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Staff Writer"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Staff Writer"
        }
    ];
    
    // Create news layout
    function createNewsLayout(items) {
        // Clear existing content
        newsContainer.innerHTML = '';
        
        // Create container div with max-width and center alignment
        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 800px; 
            margin: 0 auto;
            width: 100%;
        `;
        
        // Only use first 3 items
        const limitedItems = items.slice(0, 3);
        
        // Process each item
        limitedItems.forEach((item, index) => {
            // Article container
            const articleEl = document.createElement('div');
            articleEl.style.cssText = `
                padding-bottom: 24px;
                margin-bottom: 24px;
                border-bottom: ${index < limitedItems.length - 1 ? '1px solid var(--border-color, rgba(0,0,0,0.1))' : 'none'};
                width: 100%;
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                articleEl.style.borderBottomColor = 'var(--border-color, rgba(255,255,255,0.1))';
            }
            
            // Get source info
            const sourceName = getSourceName(item.link);
            const sourceIconUrl = getSourceIcon(item.link);
            
            // Source row 
            const sourceRow = document.createElement('div');
            sourceRow.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            `;
            
            // Source icon (using data URI that works with GitHub Pages)
            const logoImg = document.createElement('img');
            logoImg.src = sourceIconUrl;
            logoImg.alt = '';
            logoImg.style.cssText = `
                width: 16px;
                height: 16px;
                margin-right: 8px;
                border-radius: 4px;
            `;
            
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
            
            // Article title
            const titleEl = document.createElement('h3');
            titleEl.style.cssText = `
                margin: 0 0 8px 0;
                font-size: var(--h4-size, 1.25rem);
                font-weight: 500;
                line-height: 1.4;
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
            
            // Publication date
            const dateEl = document.createElement('div');
            dateEl.textContent = formatDate(item.pubDate);
            dateEl.style.cssText = `
                font-size: var(--small-size, 0.875rem);
                color: var(--light-text-color, #6c757d);
            `;
            
            // Assemble article
            articleEl.appendChild(sourceRow);
            articleEl.appendChild(titleEl);
            articleEl.appendChild(dateEl);
            
            // Add to container
            container.appendChild(articleEl);
        });
        
        // Full Coverage button
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 32px;
            width: 100%;
        `;
        
        const fullCoverageBtn = document.createElement('a');
        fullCoverageBtn.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        fullCoverageBtn.target = "_blank";
        fullCoverageBtn.rel = "noopener noreferrer";
        fullCoverageBtn.textContent = "Full Coverage";
        fullCoverageBtn.className = "btn secondary-btn";
        
        btnContainer.appendChild(fullCoverageBtn);
        container.appendChild(btnContainer);
        
        // Add the container to the news container
        newsContainer.appendChild(container);
    }
    
    // Show loading indicator
    newsContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100px;"><div style="width:30px;height:30px;border:3px solid var(--border-color, #eee);border-top:3px solid var(--primary-color, #4a6cf7);border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    
    // Add animation for spinner
    const styleEl = document.createElement('style');
    styleEl.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(styleEl);
    
    // Fetch RSS data
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data && data.status === 'ok' && data.items && data.items.length > 0) {
            console.log("Fetched RSS data successfully:", data);
            
            // Process the results
            const processedItems = data.items.map(item => {
                return {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    author: item.author || 'Staff Writer'
                };
            });
            
            // Create the news layout
            createNewsLayout(processedItems);
        } else {
            console.error("Invalid RSS data format:", data);
            createNewsLayout(fallbackContent);
        }
    })
    .catch(error => {
        console.error("Error fetching RSS data:", error);
        createNewsLayout(fallbackContent);
    });
}

// Call the function to load news
loadIndustryNews();
    
});
