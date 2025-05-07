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

// News Feed Function with Medium-style layout
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Base64 encoded SVG images as fallbacks
    const defaultImages = {
        // Default article image (for when no image is available)
        defaultImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCIgZmlsbD0ibm9uZSI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQyODVmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRhODUzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjZ3JhZDEpIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIzMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjI3MCIgY3k9IjgwIiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE4MCIgcj0iMjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+CiAgPHBhdGggZD0iTTEwMCw1MCBMNTAwLDUwIEw1MDAsMjUwIEwxMDAsMjUwIFoiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjMiLz4KICA8dGV4dCB4PSIxNDAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPkRhdGEgU2NpZW5jZTwvdGV4dD4KPC9zdmc+'
    };
    
    // Update this with your fallback articles
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            description: "Understanding the key differences between data science, machine learning, and data analytics, and how they impact your career choices in 2025.",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Simplilearn.com",
            image: defaultImages.defaultImage
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            description: "A comprehensive analysis of programming languages for machine learning in 2025, comparing Python, R, Julia, and emerging options.",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Unite.AI"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            description: "How to explain artificial intelligence concepts to children in an age-appropriate and engaging way.",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Towards Data Science"
        },
        {
            title: "Albert Einstein College of Medicine Launches Data Science Institute | Newswise",
            description: "New research institute aims to leverage data science for breakthrough medical discoveries and improved patient outcomes.",
            link: "https://www.newswise.com/articles/albert-einstein-college-of-medicine-launches-data-science-institute",
            pubDate: new Date(Date.now() - 86400000 * 1).toISOString(),
            author: "Newswise"
        },
        {
            title: "12 top ways artificial intelligence will impact healthcare - TechTarget",
            description: "From diagnosis to treatment planning, AI is transforming healthcare delivery and patient outcomes across various domains.",
            link: "https://www.techtarget.com/searchhealthit/feature/12-top-ways-artificial-intelligence-will-impact-healthcare",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "TechTarget"
        }
    ];
    
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Improved loadNewsWithCache function
    function loadNewsWithCache() {
        console.log("Checking for cached news data...");
        const cachedNews = localStorage.getItem('newsCache');
        const cacheTimestamp = localStorage.getItem('newsCacheTimestamp');
        
        // Check if we have cached data less than 6 hours old
        if (cachedNews && cacheTimestamp) {
            console.log("Found cached data, checking age...");
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            if (cacheAge < 6 * 60 * 60 * 1000) { // 6 hours in milliseconds
                console.log("Using cached data (less than 6 hours old)");
                try {
                    const newsData = JSON.parse(cachedNews);
                    return Promise.resolve(newsData);
                } catch (e) {
                    console.error("Error parsing cached data:", e);
                }
            } else {
                console.log("Cache expired, fetching fresh data");
            }
        } else {
            console.log("No cache found, fetching fresh data");
        }
        
        console.log("Making API request to RSS2JSON...");
        
        // No valid cache, fetch fresh data with timeout
        const fetchPromise = fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 5000); // 5 second timeout
        });
        
        return Promise.race([fetchPromise, timeoutPromise])
            .then(response => {
                console.log("API response received:", response.status);
                if(!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data parsed successfully, caching results");
                // Cache the results
                localStorage.setItem('newsCache', JSON.stringify(data));
                localStorage.setItem('newsCacheTimestamp', Date.now().toString());
                return data;
            })
            .catch(error => {
                console.error("API request failed:", error);
                throw error; // Re-throw to be caught by the outer catch
            });
    }
    
    // Function to extract a short description from HTML content
    function extractDescription(content, maxLength = 150) {
        if (!content) return "";
        
        // Strip HTML tags
        const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Return a truncated version with ellipsis if needed
        if (textContent.length > maxLength) {
            return textContent.substring(0, maxLength) + '...';
        }
        return textContent;
    }
    
    // Function to get domain or source from URL
    function getSourceFromUrl(url) {
        try {
            const domain = new URL(url).hostname;
            
            // Replace common prefixes and suffixes
            return domain.replace(/^www\./, '')
                         .replace(/\.com$|\.org$|\.net$|\.io$|\.ai$/, '')
                         .split('.')
                         .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                         .join(' ');
        } catch (e) {
            console.error("Error parsing URL:", e);
            return "News Source";
        }
    }
    
    // Function to get source logo from URL
    function getSourceLogo(url) {
        if (!url) return '';
        
        try {
            const hostname = new URL(url).hostname;
            // Use Google's favicon service
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
        } catch (e) {
            return '';
        }
    }
    
    // Function to extract image from description
    function extractImage(description) {
        if (!description) return null;
        
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [...description.matchAll(imgRegex)];
        
        if (matches && matches.length > 0) {
            // Find first valid image
            for (const match of matches) {
                const imgUrl = match[1];
                if (!imgUrl.includes('1x1') && 
                    !imgUrl.includes('pixel') && 
                    !imgUrl.match(/tracking|tracker|analytics/i)) {
                    return imgUrl;
                }
            }
        }
        
        return null;
    }
    
    // Create Medium-style news layout
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Center the intro text if it exists
        const introText = document.querySelector('.section-header p');
        if (introText) {
            introText.style.textAlign = 'center';
        }
        
        // Create container for articles
        const articlesContainer = document.createElement('div');
        articlesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 32px;
            max-width: 100%;
            font-family: "Helvetica Neue", Arial, sans-serif;
        `;
        
        // Process each article
        items.forEach((item, index) => {
            // Create article wrapper
            const articleWrapper = document.createElement('div');
            articleWrapper.style.cssText = `
                display: flex;
                border-bottom: ${index < items.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'};
                padding-bottom: ${index < items.length - 1 ? '32px' : '0'};
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                articleWrapper.style.borderBottomColor = 'rgba(255,255,255,0.1)';
            }
            
            // Create left column for content
            const leftColumn = document.createElement('div');
            leftColumn.style.cssText = `
                flex: 1;
                padding-right: 20px;
            `;
            
            // Source info (like Medium's "In DataScienceCollective by Author")
            const sourceContainer = document.createElement('div');
            sourceContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 14px;
            `;
            
            // Source icon (favicon)
            const sourceLogo = document.createElement('img');
            sourceLogo.src = getSourceLogo(item.link);
            sourceLogo.alt = '';
            sourceLogo.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 4px;
                margin-right: 8px;
                background-color: #f0f0f0;
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                sourceLogo.style.backgroundColor = '#333';
            }
            
            // Handle image loading errors
            sourceLogo.onerror = function() {
                this.style.display = 'none';
            };
            
            // Source text
            const sourceName = getSourceFromUrl(item.link);
            const sourceText = document.createElement('span');
            sourceText.innerHTML = `In <strong>${sourceName}</strong> by ${item.author || 'Staff Writer'}`;
            sourceText.style.cssText = `
                color: var(--light-text-color, #757575);
            `;
            
            // Add source elements to container
            sourceContainer.appendChild(sourceLogo);
            sourceContainer.appendChild(sourceText);
            
            // Article title
            const titleElement = document.createElement('h3');
            titleElement.style.cssText = `
                margin: 0 0 12px;
                font-size: 22px;
                font-weight: 700;
                line-height: 1.3;
            `;
            
            const titleLink = document.createElement('a');
            titleLink.href = item.link;
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';
            titleLink.textContent = item.title;
            titleLink.style.cssText = `
                color: var(--text-color, #242424);
                text-decoration: none;
            `;
            
            titleElement.appendChild(titleLink);
            
            // Article description/excerpt
            const description = item.description || extractDescription(item.content || '');
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = description;
            descriptionElement.style.cssText = `
                margin: 0 0 16px;
                font-size: 16px;
                line-height: 1.5;
                color: var(--light-text-color, #757575);
            `;
            
            // Date and stats (like Medium's date and read time)
            const dateElement = document.createElement('div');
            dateElement.style.cssText = `
                display: flex;
                align-items: center;
                font-size: 14px;
                color: var(--light-text-color, #757575);
            `;
            
            const pubDate = new Date(item.pubDate);
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateStr = pubDate.toLocaleDateString('en-US', dateOptions);
            
            dateElement.textContent = dateStr;
            
            // Add content elements to left column
            leftColumn.appendChild(sourceContainer);
            leftColumn.appendChild(titleElement);
            leftColumn.appendChild(descriptionElement);
            leftColumn.appendChild(dateElement);
            
            // Create right column for image
            const rightColumn = document.createElement('div');
            rightColumn.style.cssText = `
                flex: 0 0 200px;
            `;
            
            // Image container with fixed aspect ratio
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                width: 200px;
                height: 134px;
                overflow: hidden;
                border-radius: 4px;
                background-color: #f0f0f0;
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                imageContainer.style.backgroundColor = '#333';
            }
            
            // Article image
            const imageUrl = item.image || extractImage(item.content || item.description || '') || defaultImages.defaultImage;
            
            const articleImage = document.createElement('img');
            articleImage.src = imageUrl;
            articleImage.alt = '';
            articleImage.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
            `;
            
            // Handle image loading errors
            articleImage.onerror = function() {
                this.src = defaultImages.defaultImage;
                this.onerror = null;
            };
            
            // Add image to container
            imageContainer.appendChild(articleImage);
            rightColumn.appendChild(imageContainer);
            
            // Add columns to article wrapper
            articleWrapper.appendChild(leftColumn);
            articleWrapper.appendChild(rightColumn);
            
            // Add article to container
            articlesContainer.appendChild(articleWrapper);
        });
        
        // Add articles container to news container
        newsContainer.appendChild(articlesContainer);
        
        // Add Full Coverage button
        const fullCoverageContainer = document.createElement('div');
        fullCoverageContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 32px;
        `;
        
        const fullCoverageButton = document.createElement('a');
        fullCoverageButton.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        fullCoverageButton.target = "_blank";
        fullCoverageButton.rel = "noopener noreferrer";
        fullCoverageButton.textContent = "More Articles";
        fullCoverageButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border: 1px solid rgba(0,0,0,0.2);
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            color: var(--text-color, #242424);
            background-color: transparent;
            transition: background-color 0.2s;
        `;
        
        fullCoverageButton.onmouseover = function() {
            this.style.backgroundColor = 'rgba(0,0,0,0.05)';
        };
        
        fullCoverageButton.onmouseout = function() {
            this.style.backgroundColor = 'transparent';
        };
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            fullCoverageButton.style.borderColor = 'rgba(255,255,255,0.2)';
            fullCoverageButton.style.color = '#e8eaed';
            
            fullCoverageButton.onmouseover = function() {
                this.style.backgroundColor = 'rgba(255,255,255,0.05)';
            };
        }
        
        fullCoverageContainer.appendChild(fullCoverageButton);
        newsContainer.appendChild(fullCoverageContainer);
        
        // Add responsiveness for mobile
        addResponsiveStyles(articlesContainer);
    }
    
    // Function to add responsive styles
    function addResponsiveStyles(container) {
        // Initial check for mobile
        if (window.innerWidth < 768) {
            applyMobileStyles(container);
        }
        
        // Add resize listener
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                applyMobileStyles(container);
            } else {
                applyDesktopStyles(container);
            }
        });
    }
    
    // Apply mobile styles
    function applyMobileStyles(container) {
        const articles = container.querySelectorAll('div');
        
        articles.forEach(article => {
            if (article.style.display === 'flex') {
                article.style.flexDirection = 'column';
                
                // Get the right column (image)
                const rightColumn = article.querySelector('div:nth-child(2)');
                if (rightColumn) {
                    rightColumn.style.flex = '0 0 auto';
                    rightColumn.style.marginTop = '16px';
                    rightColumn.style.marginBottom = '16px';
                    
                    // Adjust image container
                    const imageContainer = rightColumn.querySelector('div');
                    if (imageContainer) {
                        imageContainer.style.width = '100%';
                        imageContainer.style.height = '200px';
                    }
                }
                
                // Get the left column (content)
                const leftColumn = article.querySelector('div:first-child');
                if (leftColumn) {
                    leftColumn.style.paddingRight = '0';
                }
            }
        });
    }
    
    // Apply desktop styles
    function applyDesktopStyles(container) {
        const articles = container.querySelectorAll('div');
        
        articles.forEach(article => {
            if (article.style.display === 'flex') {
                article.style.flexDirection = 'row';
                
                // Get the right column (image)
                const rightColumn = article.querySelector('div:nth-child(2)');
                if (rightColumn) {
                    rightColumn.style.flex = '0 0 200px';
                    rightColumn.style.marginTop = '0';
                    rightColumn.style.marginBottom = '0';
                    
                    // Adjust image container
                    const imageContainer = rightColumn.querySelector('div');
                    if (imageContainer) {
                        imageContainer.style.width = '200px';
                        imageContainer.style.height = '134px';
                    }
                }
                
                // Get the left column (content)
                const leftColumn = article.querySelector('div:first-child');
                if (leftColumn) {
                    leftColumn.style.paddingRight = '20px';
                }
            }
        });
    }
    
    // Show loading indicator
    newsContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:150px;"><div style="width:30px;height:30px;border:3px solid #eee;border-top:3px solid #767676;border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    
    // Add animation for spinner
    const styleSheet = document.createElement("style");
    styleSheet.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
    document.head.appendChild(styleSheet);
    
    // Get news data and create layout
    loadNewsWithCache()
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                // Process only the first 5 items
                const items = data.items.slice(0, 5);
                
                // Process items to extract images and descriptions
                items.forEach(item => {
                    // Extract image from content/description if not already present
                    if (!item.image) {
                        item.image = extractImage(item.content || item.description || '');
                    }
                    
                    // Make sure we have a valid description
                    if (!item.description) {
                        item.description = extractDescription(item.content || '');
                    }
                });
                
                createNewsLayout(items);
            } else {
                throw new Error('No items returned or invalid data format');
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            
            // Clear loading indicator
            newsContainer.innerHTML = '';
            
            // Use fallback content
            createNewsLayout(fallbackContent);
        });
}

// Call the function to load the news
loadIndustryNews();
    
});
