// Main JavaScript for Portfolio Website

// Typed text animation for hero section
function initTypedText() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    if (!typedTextSpan || !cursorSpan) return;
    
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
}

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Project filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
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
}

// Theme switcher
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const rootEl = document.documentElement;
    
    if (!themeSwitcher) return;
    
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

// Update current year in footer
function updateFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// Form submission handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
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

// News Feed Function
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
        introText.classList.add('section-subtitle');
    }
    
    // Create news layout with the provided items
    function createNewsLayout(items) {
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
                this.src = sourceIcons.default;
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
            createNewsLayout(fallbackContent);
        });
}

// Helper functions for News Feed
// Get source icon based on source name or URL
function getSourceIcon(source, url) {
    // Define source icons (all your existing icons)
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

// Format date helper function
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

// Fullpage Scrolling Implementation
function initFullpageScrolling() {
    // Configuration
    const config = {
        sectionClass: 'fullpage-section',
        activeClass: 'active',
        navItemClass: 'nav-item',
        navLinkClass: 'section-active',
        animationDuration: 700, // ms
        scrollThreshold: 800, // ms between scroll events
        mobileBreakpoint: 768
    };
    
    // State Variables
    let state = {
        sections: [],
        navLinks: [],
        currentIndex: 0,
        isAnimating: false,
        lastScrollTime: 0,
        isMobile: window.innerWidth < config.mobileBreakpoint
    };
    
    // Initialize the fullpage system
    function init() {
        // Get all sections and nav links
        state.sections = Array.from(document.querySelectorAll(`.${config.sectionClass}`));
        state.navLinks = Array.from(document.querySelectorAll('nav ul li a'));
        
        console.log("Found sections:", state.sections.length);
        
        // Check if mobile first
        checkMobileMode();
        
        // Set up the initial section
        if(!state.isMobile && state.sections.length > 0) {
            activateSection(0, false);
            setupEventListeners();
        } else if (state.sections.length === 0) {
            console.error("No fullpage sections found");
        }
        
        // Make our activate function globally available
        window.activateSection = (index) => activateSection(index, true);
        
        // Expose the current index for other scripts
        window.currentSectionIndex = 0;
        
        console.log('Fullpage scrolling initialized');
    }
    
    // Check if we're in mobile mode
    function checkMobileMode() {
        const wasAlreadyMobile = state.isMobile;
        state.isMobile = window.innerWidth < config.mobileBreakpoint;
        
        // Only toggle if there was a change
        if (wasAlreadyMobile !== state.isMobile) {
            if (state.isMobile) {
                enableMobileMode();
            } else {
                enableDesktopMode();
            }
        }
    }
    
    // Enable mobile mode (standard scrolling)
    function enableMobileMode() {
        console.log('Enabling mobile mode');
        
        // Make all sections visible and positioned statically
        state.sections.forEach(section => {
            section.style.position = 'relative';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.height = 'auto';
            section.style.zIndex = '1';
            section.classList.remove(config.activeClass);
        });
        
        // Enable scrolling
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // Reset current index
        state.currentIndex = 0;
    }
    
    // Enable desktop mode (fullpage scrolling)
    function enableDesktopMode() {
        console.log('Enabling desktop mode');
        
        // Prepare all sections
        state.sections.forEach((section, index) => {
            section.style.position = 'absolute';
            section.style.top = '0';
            section.style.left = '0';
            section.style.width = '100%';
            section.style.height = '100vh';
            
            // Hide all sections except current
            if (index === state.currentIndex) {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.zIndex = '1';
                section.classList.add(config.activeClass);
            } else {
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.style.zIndex = '0';
                section.classList.remove(config.activeClass);
            }
        });
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Update nav links
        updateNavLinks();
    }
    
    // Activate a specific section
    function activateSection(index, animate = true) {
        // Validate the index
        if (index < 0 || index >= state.sections.length || state.isAnimating || index === state.currentIndex) {
            return;
        }
        
        console.log(`Activating section ${index}`);
        
        // Mark as animating if needed
        state.isAnimating = animate;
        
        // Get current and target sections
        const currentSection = state.sections[state.currentIndex];
        const targetSection = state.sections[index];
        
        // Prepare target section while hidden
        targetSection.style.opacity = '0';
        targetSection.style.visibility = 'visible';
        targetSection.style.zIndex = '2'; // Put above current
        
        // Start transition
        if (animate) {
            // Start animation
            setTimeout(() => {
                // Fade in target section
                targetSection.style.transition = `opacity ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                targetSection.style.opacity = '1';
                
                // Fade out current section
                currentSection.style.transition = `opacity ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                currentSection.style.opacity = '0';
                
                // Complete after transition
                setTimeout(() => {
                    completeTransition(index, currentSection, targetSection);
                }, config.animationDuration);
            }, 20); // Small delay for transitions to register properly
        } else {
            // Instant transition
            targetSection.style.opacity = '1';
            completeTransition(index, currentSection, targetSection);
        }
        
        // Update state
        state.currentIndex = index;
        window.currentSectionIndex = index;
        
        // Update navigation
        updateNavLinks();
        
        // Update back-to-top button visibility
        updateBackToTopButton();
        
        // Notify flowing-data.js about the section change
        if (typeof window.applyParallax === 'function') {
            // Calculate virtual scroll position for parallax effect
            const virtualScrollY = index * window.innerHeight;
            window.applyParallax(virtualScrollY);
        }
    }
    
    // Finish section transition
    function completeTransition(index, currentSection, targetSection) {
        // Update section classes
        state.sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add(config.activeClass);
            } else {
                section.classList.remove(config.activeClass);
                section.style.visibility = 'hidden';
                section.style.zIndex = '0';
            }
        });
        
        // Reset animation flag
        state.isAnimating = false;
    }
    
    // Update navigation links to show active section
    function updateNavLinks() {
        const activeSection = state.sections[state.currentIndex];
        const activeSectionId = activeSection ? activeSection.id : '';
        
        state.navLinks.forEach(link => {
            // Clean up all active classes
            link.classList.remove('active', config.navLinkClass);
            
            // Add active class to matching link
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active', config.navLinkClass);
            }
        });
    }
    
    // Show/hide back to top button based on current section
    function updateBackToTopButton() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (state.currentIndex > 0) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Mouse wheel navigation
        window.addEventListener('wheel', function(e) {
            // Skip if in mobile mode
            if (state.isMobile) return;
            
            const now = Date.now();
            
            // Throttle scroll events
            if (now - state.lastScrollTime < config.scrollThreshold || state.isAnimating) {
                e.preventDefault();
                return;
            }
            
            state.lastScrollTime = now;
            
            // Determine scroll direction
            if (e.deltaY > 0 && state.currentIndex < state.sections.length - 1) {
                // Scrolling down
                activateSection(state.currentIndex + 1);
            } else if (e.deltaY < 0 && state.currentIndex > 0) {
                // Scrolling up
                activateSection(state.currentIndex - 1);
            }
            
            // Prevent default scroll
            e.preventDefault();
        }, { passive: false });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Skip if in mobile mode
            if (state.isMobile) return;
            
            // Skip if in input field
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.key === 'ArrowDown' && state.currentIndex < state.sections.length - 1) {
                activateSection(state.currentIndex + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp' && state.currentIndex > 0) {
                activateSection(state.currentIndex - 1);
                e.preventDefault();
            }
        });
        
        // Navigation links
        state.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip external links
                if (!this.getAttribute('href').startsWith('#')) return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetIndex = state.sections.findIndex(section => section.id === targetId);
                
                if (targetIndex !== -1) {
                    activateSection(targetIndex);
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('nav ul');
                    const hamburger = document.querySelector('.hamburger');
                    if (navMenu && navMenu.classList.contains('active') && hamburger) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            });
        });
        
        // Back to top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                activateSection(0);
            });
        }
        
        // Window resize handler
        window.addEventListener('resize', function() {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(function() {
                checkMobileMode();
            }, 200);
        });
    }
    
    // Start the initialization
    init();
}

// Flowing Data and Fullpage Compatibility
function initCompatibilityHooks() {
    // Wait for both scripts to be initialized
    setTimeout(() => {
        console.log('Setting up flowing-data and fullpage compatibility');

        // Override flowing-data.js handle scroll function
        const originalHandleScroll = window.handleScroll;
        
        if (typeof window.applyParallax === 'function') {
            // Create a synchronized method to ensure proper parallax effects
            window.syncParallaxWithSections = () => {
                // Use the current section index to determine parallax position
                const index = window.currentSectionIndex || 0;
                const virtualScrollY = index * window.innerHeight;
                
                try {
                    window.applyParallax(virtualScrollY);
                } catch (e) {
                    console.error('Error applying parallax:', e);
                }
            };
            
            // Call initial sync
            window.syncParallaxWithSections();
        }
    }, 500); // Wait for scripts to initialize
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypedText();
    initMobileNav();
    initProjectFilters();
    initThemeSwitcher();
    updateFooterYear();
    initContactForm();
    loadIndustryNews();
    // Initialize fullpage scrolling (NEW)
    initFullpageScrolling();
    
    // Initialize compatibility hooks (NEW)
    initCompatibilityHooks();
    
});
