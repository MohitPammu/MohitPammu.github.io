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

// News Feed Function with error handling and fallback content
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Prepare fallback content with images
    const fallbackContent = [
        {
            title: "Introduction to Neural Networks for Beginners",
            link: "https://towardsdatascience.com/",
            pubDate: new Date().toISOString(),
            author: "Towards Data Science",
            image: "https://via.placeholder.com/400x250?text=Neural+Networks",
            featured: true
        },
        {
            title: "The Future of Machine Learning in Business Applications",
            link: "https://www.kdnuggets.com/",
            pubDate: new Date().toISOString(),
            author: "KDnuggets"
        },
        {
            title: "Understanding Data Ethics in the Age of AI",
            link: "https://www.analyticsvidhya.com/",
            pubDate: new Date().toISOString(),
            author: "Analytics Vidhya"
        },
        {
            title: "Python vs. R for Data Science in 2025",
            link: "https://www.datacamp.com/",
            pubDate: new Date().toISOString(),
            author: "DataCamp"
        },
        {
            title: "How to Build a Recommendation System from Scratch",
            link: "https://neptune.ai/blog/",
            pubDate: new Date().toISOString(),
            author: "Neptune.ai"
        }
    ];
    
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Define the loadNewsWithCache function as before
    function loadNewsWithCache() {
        // Existing code...
        console.log("Checking for cached news data...");
        const cachedNews = localStorage.getItem('newsCache');
        const cacheTimestamp = localStorage.getItem('newsCacheTimestamp');
        
        // Check if we have cached data less than 12 hours old
        if (cachedNews && cacheTimestamp) {
            console.log("Found cached data, checking age...");
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            if (cacheAge < 12 * 60 * 60 * 1000) { // 12 hours in milliseconds
                console.log("Using cached data (less than 12 hours old)");
                try {
                    const newsData = JSON.parse(cachedNews);
                    // Use cached data
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
        
        // No valid cache, fetch fresh data
        return fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
            .then(response => {
                console.log("API response received:", response.status);
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
    
    // News Feed Function with error handling and fallback content
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Base64 encoded SVG images as fallbacks (will always work even offline)
    const defaultImages = {
        neuralNetwork: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiMwNzRkODciIG9wYWNpdHk9IjAuOCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIxNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iMTUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIxMjAiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CiAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iODAiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTYwIiByPSIxNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iMTUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxNjAiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+CiAgPGxpbmUgeDE9IjEwMCIgeTE9IjgwIiB4Mj0iMTUwIiB5Mj0iMTIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iODAiIHgyPSIyMDAiIHkyPSI4MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjE1MCIgeTE9IjEyMCIgeDI9IjI1MCIgeTI9IjEyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjE1MCIgeTE9IjEyMCIgeDI9IjEwMCIgeTI9IjE2MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjE1MCIgeTE9IjEyMCIgeDI9IjIwMCIgeTI9IjE2MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjIwMCIgeTE9IjgwIiB4Mj0iMjUwIiB5Mj0iMTIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iMjAwIiB5MT0iODAiIHgyPSIzMDAiIHkyPSI4MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjI1MCIgeTE9IjEyMCIgeDI9IjMwMCIgeTI9IjE2MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjMwMCIgeTE9IjgwIiB4Mj0iMzAwIiB5Mj0iMTYwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxNDUiIHk9IjIxMCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPk5ldXJhbCBOZXR3b3JrPC90ZXh0Pgo8L3N2Zz4=',
        dataScience: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiMyZDMyMzYiIG9wYWNpdHk9IjAuOSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+RGF0YSBTY2llbmNlPC90ZXh0PgogIDx0ZXh0IHg9IjExMCIgeT0iMTQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+JmFtcDsgQUk8L3RleHQ+CiAgPGNpcmNsZSBjeD0iNjAiIGN5PSIxMjAiIHI9IjI1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC43Ii8+CiAgPGNpcmNsZSBjeD0iMzQwIiBjeT0iMTIwIiByPSIyNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyIvPgo8L3N2Zz4='
    };
    
    // Simple function to get the right image for a headline
    function getImageForHeadline(title) {
        const titleLower = title.toLowerCase();
        if(titleLower.includes('neural') || titleLower.includes('network')) {
            return defaultImages.neuralNetwork;
        }
        return defaultImages.dataScience;
    }
    
    // Updated fallback content with embedded images
    const fallbackContent = [
        {
            title: "Introduction to Neural Networks for Beginners",
            link: "https://towardsdatascience.com/",
            pubDate: new Date().toISOString(),
            author: "Towards Data Science",
            image: defaultImages.neuralNetwork,
            featured: true
        },
        {
            title: "The Future of Machine Learning in Business Applications",
            link: "https://www.kdnuggets.com/",
            pubDate: new Date().toISOString(),
            author: "KDnuggets",
            image: defaultImages.dataScience
        },
        {
            title: "Understanding Data Ethics in the Age of AI",
            link: "https://www.analyticsvidhya.com/",
            pubDate: new Date().toISOString(),
            author: "Analytics Vidhya",
            image: defaultImages.dataScience
        },
        {
            title: "Python vs. R for Data Science in 2025",
            link: "https://www.datacamp.com/",
            pubDate: new Date().toISOString(),
            author: "DataCamp",
            image: defaultImages.dataScience
        },
        {
            title: "How to Build a Recommendation System from Scratch",
            link: "https://neptune.ai/blog/",
            pubDate: new Date().toISOString(),
            author: "Neptune.ai",
            image: defaultImages.dataScience
        }
    ];
    
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Keeping the same loadNewsWithCache function with minor error handling improvements
    function loadNewsWithCache() {
        console.log("Checking for cached news data...");
        const cachedNews = localStorage.getItem('newsCache');
        const cacheTimestamp = localStorage.getItem('newsCacheTimestamp');
        
        // Check if we have cached data less than 12 hours old
        if (cachedNews && cacheTimestamp) {
            console.log("Found cached data, checking age...");
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            if (cacheAge < 12 * 60 * 60 * 1000) { // 12 hours in milliseconds
                console.log("Using cached data (less than 12 hours old)");
                try {
                    const newsData = JSON.parse(cachedNews);
                    // Use cached data
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
    
    // Updated createNewsLayout function with better image handling
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Create news grid container
        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';
        
        // Create featured article (first item)
        const featuredItem = items[0];
        const featuredArticle = document.createElement('div');
        featuredArticle.className = 'featured-article';
        
        const pubDate = new Date(featuredItem.pubDate);
        
        // Safe URL extraction with error handling
        let sourceIconUrl = '';
        try {
            sourceIconUrl = new URL(featuredItem.link).hostname;
        } catch(e) {
            console.error("Invalid URL:", featuredItem.link);
            sourceIconUrl = 'news.google.com';
        }
        
        const sourceIcon = featuredItem.author ? 
            `<img src="https://www.google.com/s2/favicons?domain=${sourceIconUrl}" 
                 alt="${featuredItem.author}" 
                 class="source-icon"
                 onerror="this.style.display='none';">` : '';
        
        featuredArticle.innerHTML = `
            <div class="featured-image">
                <img src="${featuredItem.image || getImageForHeadline(featuredItem.title)}" 
                     alt="${featuredItem.title}" 
                     loading="lazy"
                     onerror="this.src='${defaultImages.dataScience}'; this.onerror=null;">
            </div>
            <div class="article-source">
                ${sourceIcon} ${featuredItem.author || 'Google News'}
            </div>
            <h3 class="article-title">
                <a href="${featuredItem.link}" target="_blank" rel="noopener noreferrer">
                    ${featuredItem.title}
                </a>
            </h3>
            <div class="article-date">${pubDate.toLocaleDateString()} • ${pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        // Create related articles container (keeping your original structure)
        const relatedArticles = document.createElement('div');
        relatedArticles.className = 'related-articles';
        
        // Add related articles (items 1-4)
        for (let i = 1; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            
            const pubDate = new Date(item.pubDate);
            
            // Safe URL extraction
            let sourceIconUrl = '';
            try {
                sourceIconUrl = new URL(item.link).hostname;
            } catch(e) {
                console.error("Invalid URL:", item.link);
                sourceIconUrl = 'news.google.com';
            }
            
            const sourceIcon = item.author ? 
                `<img src="https://www.google.com/s2/favicons?domain=${sourceIconUrl}" 
                     alt="${item.author}" 
                     class="source-icon"
                     onerror="this.style.display='none';">` : '';
            
            articleItem.innerHTML = `
                <div class="article-content">
                    <div class="article-source">
                        ${sourceIcon} ${item.author || 'Google News'}
                    </div>
                    <h4 class="article-title">
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                            ${item.title}
                        </a>
                    </h4>
                    <div class="article-date">${pubDate.toLocaleDateString()} • ${pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
            
            relatedArticles.appendChild(articleItem);
        }
        
        // Assemble the grid
        newsGrid.appendChild(featuredArticle);
        newsGrid.appendChild(relatedArticles);
        newsContainer.appendChild(newsGrid);
        
        // Add "Explore More" button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        
        const viewMore = document.createElement('a');
        viewMore.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        viewMore.target = "_blank";
        viewMore.rel = "noopener noreferrer";
        viewMore.className = "btn secondary-btn";
        viewMore.textContent = "Full Coverage";
        
        viewMoreContainer.appendChild(viewMore);
        newsContainer.appendChild(viewMoreContainer);
    }
    
    // Show loading indicator before fetching
    newsContainer.innerHTML = '<div class="news-loading"></div>';
    
    // Enhanced version of your existing result handling
    loadNewsWithCache()
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                // Process only the first 5 items
                const items = data.items.slice(0, 5);
                
                // Extract images for all items, not just the first one
                items.forEach((item, index) => {
                    const description = item.description || '';
                    const imgRegex = /<img[^>]+src="([^">]+)"/;
                    const imgMatch = description.match(imgRegex);
                    
                    if (imgMatch && imgMatch[1]) {
                        try {
                            // Validate image URL and filter out tracking pixels
                            const imgUrl = imgMatch[1];
                            if (!imgUrl.includes('1x1') && !imgUrl.includes('pixel') && 
                                imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
                                item.image = imgUrl;
                            } else {
                                item.image = getImageForHeadline(item.title);
                            }
                        } catch (e) {
                            item.image = getImageForHeadline(item.title);
                        }
                    } else {
                        item.image = getImageForHeadline(item.title);
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
        
    // Add minimal CSS for loading indicator
    const style = document.createElement('style');
    style.textContent = `
        .news-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
        }
        
        .news-loading:after {
            content: '';
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #555;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Add the function call right here!
loadIndustryNews();
    
});
