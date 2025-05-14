// script.js 
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing portfolio site with standard scrolling');
    
    try {
        // Initialize all components with error handling
        initSmoothScrolling();
        initTypedText();
        initMobileNav();
        initProjectFilters();
        initThemeSwitcher();
        initContactForm();
        loadIndustryNews();
        updateFooterYear();
        
        // Add 'loaded' class to body for fade-in
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 200);
    } catch (error) {
        console.error("Error during initialization:", error);
        // Ensure the page at least becomes visible even if there's an error
        document.body.classList.add('loaded');
    }
});

// Standard smooth scrolling with navigation highlighting
function initSmoothScrolling() {
    try {
        const sections = document.querySelectorAll('section') || [];
        const navLinks = document.querySelectorAll('nav ul li a') || [];
        const backToTopBtn = document.querySelector('.back-to-top');
        
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            try {
                if (window.scrollY > 300) {
                    backToTopBtn?.classList.add('active');
                } else {
                    backToTopBtn?.classList.remove('active');
                }
                
                // Highlight active navigation link based on scroll position
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            } catch (error) {
                console.error("Error in scroll event:", error);
            }
        });
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (!targetId || !targetId.startsWith('#')) return;
                    
                    const targetSection = document.querySelector(targetId);
                    if (!targetSection) return;
                    
                    // Calculate offset with header height
                    const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                    const offset = targetSection.offsetTop - headerHeight;
                    
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
                } catch (error) {
                    console.error("Error in navigation click:", error);
                }
            });
        });
        
        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                try {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    console.error("Error in back to top click:", error);
                    // Fallback for browsers that don't support smooth scrolling
                    window.scrollTo(0, 0);
                }
            });
        }
    } catch (error) {
        console.error("Error in initSmoothScrolling:", error);
    }
}

// Improved mobile menu handling
function initMobileNav() {
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('nav ul');
        
        if (!hamburger || !navMenu) {
            console.warn("Mobile navigation elements not found");
            return;
        }
        
        hamburger.addEventListener('click', function() {
            try {
                // Toggle menu
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
                
                // Add animation delays to menu items
                const menuItems = navMenu.querySelectorAll('li');
                menuItems.forEach((item, index) => {
                    // Reset any existing animation
                    item.style.animation = 'none';
                    
                    // Force reflow
                    void item.offsetWidth;
                    
                    // Add staggered animation
                    if (navMenu.classList.contains('active')) {
                        item.style.animation = `fadeInDown 0.3s ease forwards ${index * 0.1}s`;
                    } else {
                        item.style.animation = '';
                    }
                });
            } catch (error) {
                console.error("Error in hamburger click:", error);
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            try {
                // Skip if menu is not open or if clicking on hamburger
                if (!navMenu.classList.contains('active') || hamburger.contains(e.target)) return;
                
                // If click is outside the menu, close it
                if (!navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            } catch (error) {
                console.error("Error in document click for mobile nav:", error);
            }
        });
    } catch (error) {
        console.error("Error in initMobileNav:", error);
    }
}

// Improved typing animation
function initTypedText() {
    try {
        const typedTextSpan = document.querySelector('.typed-text');
        const cursorSpan = document.querySelector('.cursor');
        
        if (!typedTextSpan || !cursorSpan) {
            console.warn("Typed text elements not found");
            return;
        }
        
        const textArray = ["Data Scientist", "Problem Solver", "Impact Analyst", "Data Storyteller", "Insight Architect"];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;
        let isTyping = false;
        let isErasing = false;
        
        function type() {
            try {
                if (isTyping) return;
                isTyping = true;
                
                if (charIndex < textArray[textArrayIndex].length) {
                    if (!cursorSpan.classList.contains('typing')) {
                        cursorSpan.classList.add('typing');
                    }
                    
                    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                    charIndex++;
                    
                    isTyping = false;
                    setTimeout(type, typingDelay);
                } else {
                    cursorSpan.classList.remove('typing');
                    
                    // Only set timeout if still on the same element
                    if (typedTextSpan && textArray[textArrayIndex] === typedTextSpan.textContent) {
                        setTimeout(erase, newTextDelay);
                    }
                    
                    isTyping = false;
                }
            } catch (error) {
                console.error("Error in type function:", error);
                isTyping = false;
            }
        }
        
        function erase() {
            try {
                if (isErasing) return;
                isErasing = true;
                
                if (charIndex > 0) {
                    if (!cursorSpan.classList.contains('typing')) {
                        cursorSpan.classList.add('typing');
                    }
                    
                    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                    charIndex--;
                    
                    isErasing = false;
                    setTimeout(erase, erasingDelay);
                } else {
                    cursorSpan.classList.remove('typing');
                    textArrayIndex = (textArrayIndex + 1) % textArray.length;
                    
                    isErasing = false;
                    setTimeout(type, typingDelay + 1100);
                }
            } catch (error) {
                console.error("Error in erase function:", error);
                isErasing = false;
            }
        }
        
        // Start the effect
        if (textArray.length) {
            setTimeout(type, newTextDelay + 250);
        }
    } catch (error) {
        console.error("Error in initTypedText:", error);
    }
}

// Improved project filtering
function initProjectFilters() {
    try {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!filterButtons.length || !projectCards.length) {
            console.warn("Project filter elements not found");
            return;
        }
        
        // Initialize all projects visible
        projectCards.forEach(card => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                try {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get filter value
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Filter projects with animation
                    projectCards.forEach(card => {
                        // Add animation properties
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            // Show card
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            // Fade out
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            
                            // Remove from DOM after animation completes
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 400);
                        }
                    });
                } catch (error) {
                    console.error("Error in filter button click:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error in initProjectFilters:", error);
    }
}

// Theme switcher function
function initThemeSwitcher() {
    try {
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) {
            console.warn("Theme switcher element not found");
            return;
        }
        
        themeSwitcher.addEventListener('click', function() {
            try {
                // Toggle theme
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                    this.innerHTML = '<i class="fas fa-moon"></i>';
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    this.innerHTML = '<i class="fas fa-sun"></i>';
                }
            } catch (error) {
                console.error("Error in theme switcher click:", error);
            }
        });
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } catch (error) {
        console.error("Error in initThemeSwitcher:", error);
    }
}

// Update footer year
function updateFooterYear() {
    try {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.error("Error in updateFooterYear:", error);
    }
}

// Contact Form Handler with improved error handling
function initContactForm() {
    try {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.warn("Contact form not found");
            return;
        }
        
        contactForm.addEventListener('submit', function(e) {
            try {
                e.preventDefault(); // Prevent the default form submission
                
                // Validate form inputs
                const nameInput = contactForm.querySelector('input[name="name"]');
                const emailInput = contactForm.querySelector('input[name="email"]');
                const messageInput = contactForm.querySelector('textarea[name="message"]');
                
                // Basic validation (can be expanded)
                if (!nameInput?.value || !emailInput?.value || !messageInput?.value) {
                    alert('Please fill out all required fields');
                    return;
                }
                
                // Disable form during submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (!submitBtn) return;
                
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
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
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Create success message
                    const formContainer = contactForm.parentNode;
                    if (!formContainer) throw new Error('Form container not found');
                    
                    // Check if success message already exists
                    let successMsg = formContainer.querySelector('.form-success');
                    if (!successMsg) {
                        successMsg = document.createElement('div');
                        successMsg.className = 'form-success';
                        successMsg.innerHTML = `
                            <div style="text-align: center; padding: var(--spacing-lg); background-color: var(--card-bg); 
                            border-radius: var(--border-radius-md); box-shadow: 0 5px 15px var(--shadow-color); opacity: 0; transition: opacity 0.6s ease;">
                                <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: var(--spacing-md);"></i>
                                <h3 style="margin-bottom: var(--spacing-sm);">Thank you for your message!</h3>
                                <p style="color: var(--light-text-color);">I will get back to you as soon as possible.</p>
                            </div>
                        `;
                        formContainer.insertBefore(successMsg, contactForm);
                    }
                    
                    // Hide the form 
                    contactForm.style.display = 'none';
                    
                    // Get the inner div element for the animation
                    const successContent = successMsg.querySelector('div');
                    
                    // Trigger fade-in effect after a small delay
                    setTimeout(() => {
                        successContent.style.opacity = '1';
                        successMsg.classList.add('visible');
                    }, 100);
                    
                    // Clear the form
                    contactForm.reset();
                    
                    // Set a timer to fade out and then show the form again
                    setTimeout(function() {
                        // Fade out
                        successContent.style.opacity = '0';
                        successMsg.classList.remove('visible');
                        
                        // Remove message and show form after fade-out completes
                        setTimeout(() => {
                            successMsg.remove();
                            contactForm.style.display = 'block';
                            
                            // Reset button
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnText;
                        }, 600); // Match the transition duration
                        
                    }, 4000); // Display success message for 4 seconds
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Oops! There was a problem submitting your form. Please try again.');
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            } catch (error) {
                console.error("Error in form submission:", error);
                alert('An error occurred. Please try again later.');
                
                // Reset button state if possible
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                }
            }
        });
    } catch (error) {
        console.error("Error in initContactForm:", error);
    }
}

// News Feed Function with improved error handling
function loadIndustryNews() {
    try {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) {
            console.warn("News container not found");
            return;
        }
        
        console.log("News function is running");
        
        // Center the intro text
        const introText = document.querySelector('.news p, .section-header p');
        if (introText) {
            introText.classList.add('section-subtitle');
        }
        
        // Create news layout with the provided items
        function createNewsLayout(items) {
            try {
                // Clear container
                newsContainer.innerHTML = '';
                
                // Create container with grid
                const container = document.createElement('div');
                container.className = 'news-grid-container';
                
                // Limit to 4 articles (for 2x2 grid)
                const limitedItems = items.slice(0, 4);
                
                // Process each news item
                limitedItems.forEach((item, index) => {
                    // Extract source name
                    const sourceName = item.source || 'News';
                    
                    // Article container
                    const articleEl = document.createElement('div');
                    articleEl.className = 'news-article';
                    
                    // Add thematic background icon based on title keywords
                    const categoryIcon = document.createElement('div');
                    categoryIcon.className = 'news-category-icon';
                    
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
                    
                    // Title
                    const titleEl = document.createElement('h3');
                    titleEl.className = 'news-title';
                    
                    const titleLink = document.createElement('a');
                    titleLink.href = item.link;
                    titleLink.target = '_blank';
                    titleLink.rel = 'noopener noreferrer';
                    titleLink.textContent = item.title;
                    
                    titleEl.appendChild(titleLink);
                    
                    // Source row with logo
                    const sourceRow = document.createElement('div');
                    sourceRow.className = 'news-source-row';
                    
                    // Source icon
                    const sourceIcon = getSourceIcon(sourceName, item.link);
                    const logoImg = document.createElement('img');
                    logoImg.src = sourceIcon;
                    logoImg.alt = '';
                    logoImg.className = 'news-source-logo';
                    
                    // Fallback if logo fails to load
                    logoImg.onerror = function() {
                        this.src = getDefaultSourceIcon();
                        this.onerror = null;
                    };
                    
                    // Source text
                    const sourceText = document.createElement('span');
                    sourceText.innerHTML = `In <strong>${sourceName}</strong> by ${item.author || 'Staff Writer'}`;
                    sourceText.className = 'news-source-text';
                    
                    // Add logo and text to source row
                    sourceRow.appendChild(logoImg);
                    sourceRow.appendChild(sourceText);
                    
                    // Publication date
                    const dateEl = document.createElement('div');
                    dateEl.textContent = formatDate(item.pubDate);
                    dateEl.className = 'news-date';
                    
                    // Read More link
                    const readMoreLink = document.createElement('div');
                    readMoreLink.className = 'news-read-more';
                    
                    const readMoreAnchor = document.createElement('a');
                    readMoreAnchor.href = item.link;
                    readMoreAnchor.target = '_blank';
                    readMoreAnchor.rel = 'noopener noreferrer';
                    readMoreAnchor.innerHTML = '<i class="fas fa-external-link-alt"></i> Read Article';
                    
                    readMoreLink.appendChild(readMoreAnchor);
                    
                    // Assemble article
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'news-content-wrapper';
                    
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
                btnContainer.className = 'news-more-button-container';
                
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
            } catch (error) {
                console.error("Error in createNewsLayout:", error);
                // Show fallback content when layout creation fails
                showFallbackNewsContent(newsContainer);
            }
        }
        
        // Show loading indicator
        newsContainer.innerHTML = '<div class="news-loading"><div class="news-spinner"></div></div>';
        
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
        
        // Show fallback news content
        function showFallbackNewsContent(container) {
            try {
                console.warn("Using fallback news content");
                createNewsLayout(fallbackContent);
            } catch (error) {
                console.error("Error showing fallback news:", error);
                container.innerHTML = '<p class="news-error">Unable to load news at this time.</p>';
            }
        }
        
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
                        updatedInfo.className = 'news-last-updated';
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
                showFallbackNewsContent(newsContainer);
            });
    } catch (error) {
        console.error("Error in loadIndustryNews:", error);
    }
}

// Helper functions for News Feed
// Get source icon based on source name or URL
function getSourceIcon(source, url) {
    try {
        // Define source icons (all your existing icons)
        const sourceIcons = getSourceIcons();
        
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
    } catch (error) {
        console.error("Error in getSourceIcon:", error);
        return getDefaultSourceIcon();
    }
}

// Get default source icon
function getDefaultSourceIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzc1NzU3NSIvPjx0ZXh0IHg9IjgiIHk9IjE3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg==';
}

// Get source icons
function getSourceIcons() {
    return {
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
}

/**
 * Format date helper function
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        console.warn("Date formatting error:", e);
        return dateString || 'Unknown date';
    }
}

// Add window load event listener with error handling
window.addEventListener('load', function() {
    try {
        document.body.classList.add('loaded');
        console.log('Page fully loaded');
    } catch (error) {
        console.error("Error in window load event:", error);
    }
});

// Ensure the page becomes visible even if there are script errors
document.addEventListener('DOMContentLoaded', function() {
    // Set a fallback timeout to make sure body gets 'loaded' class
    setTimeout(function() {
        if (!document.body.classList.contains('loaded')) {
            console.warn('Forcing loaded state after timeout');
            document.body.classList.add('loaded');
        }
    }, 1500); // 1.5 second fallback
});
