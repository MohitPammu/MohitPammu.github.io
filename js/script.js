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
    
    // Base64 encoded SVG images as fallbacks (will always work even offline)
    const defaultImages = {
        // Main featured article image (more colorful, larger)
        featuredImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNjAwIDMwMCIgZmlsbD0ibm9uZSI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQyODVmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRhODUzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+CiAgPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjM1MCIgY3k9IjgwIiByPSIyNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPgogIDxjaXJjbGUgY3g9IjQ1MCIgY3k9IjE4MCIgcj0iMzUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMjAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+CiAgPHBhdGggZD0iTTEwMCw1MCBMNTAwLDUwIEw1MDAsMjUwIEwxMDAsMjUwIFoiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMyIvPgogIDx0ZXh0IHg9IjE2MCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+RGF0YSBTY2llbmNlIE5ld3M8L3RleHQ+Cjwvc3ZnPg==',
        
        // News source logos (simple colored circles with initials)
        googleNews: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzQyODVmNCIvPgogIDx0ZXh0IHg9IjExIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPkc8L3RleHQ+Cjwvc3ZnPg==',
        towardsDataScience: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAzYTlmNCIvPgogIDx0ZXh0IHg9IjEzIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPlQ8L3RleHQ+Cjwvc3ZnPg==',
        kdnuggets: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2ZmY2IwMCIvPgogIDx0ZXh0IHg9IjExIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzMzMyI+SzwvdGV4dD4KPC9zdmc+',
        analyticsVidhya: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzM0YTg1MyIvPgogIDx0ZXh0IHg9IjEyIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPkE8L3RleHQ+Cjwvc3ZnPg==',
        datacamp: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2VhNDMzNSIvPgogIDx0ZXh0IHg9IjExIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPkQ8L3RleHQ+Cjwvc3ZnPg==',
        neptune: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzlhNjdhYiIvPgogIDx0ZXh0IHg9IjExIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPk48L3RleHQ+Cjwvc3ZnPg==',
        techTarget: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzQwNDA0MCIvPgogIDx0ZXh0IHg9IjEyIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPlQ8L3RleHQ+Cjwvc3ZnPg==',
        newswise: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzFhNzNlOCIvPgogIDx0ZXh0IHg9IjExIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPlc8L3RleHQ+Cjwvc3ZnPg==',
        uniteAI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzUwNTVlYiIvPgogIDx0ZXh0IHg9IjEyIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPlU8L3RleHQ+Cjwvc3ZnPg=='
    };
    
    // Get the appropriate logo for a source
    function getSourceLogo(source) {
        if (!source) return defaultImages.googleNews;
        const sourceLower = source.toLowerCase();
        
        if (sourceLower.includes('google')) return defaultImages.googleNews;
        if (sourceLower.includes('towards data science')) return defaultImages.towardsDataScience;
        if (sourceLower.includes('kdnuggets')) return defaultImages.kdnuggets;
        if (sourceLower.includes('analytics vidhya')) return defaultImages.analyticsVidhya;
        if (sourceLower.includes('datacamp')) return defaultImages.datacamp;
        if (sourceLower.includes('neptune')) return defaultImages.neptune;
        if (sourceLower.includes('techtarget')) return defaultImages.techTarget;
        if (sourceLower.includes('newswise')) return defaultImages.newswise;
        if (sourceLower.includes('unite.ai')) return defaultImages.uniteAI;
        
        // Default logo if no match
        return defaultImages.googleNews;
    }
    
    // Updated fallback content
    const fallbackContent = [
        {
            title: "What is the Best Language for Machine Learning? (May 2025)",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date().toISOString(),
            author: "Unite.AI",
            image: defaultImages.featuredImage,
            featured: true
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            author: "Towards Data Science"
        },
        {
            title: "Albert Einstein College of Medicine Launches Data Science Institute",
            link: "https://www.newswise.com/articles/albert-einstein-college-of-medicine-launches-data-science-institute",
            pubDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            author: "Newswise"
        },
        {
            title: "12 top ways artificial intelligence will impact healthcare",
            link: "https://www.techtarget.com/searchhealthit/feature/12-top-ways-artificial-intelligence-will-impact-healthcare",
            pubDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            author: "TechTarget"
        },
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025]",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Simplilearn"
        }
    ];
    
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Load news with cache function
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
    
    // Create news layout - Google News style
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Create main container with Google News style
        const newsWrapper = document.createElement('div');
        newsWrapper.className = 'news-wrapper';
        
        // Create featured article (first item)
        const featuredItem = items[0];
        const featuredArticle = document.createElement('div');
        featuredArticle.className = 'news-featured-article';
        
        const pubDate = new Date(featuredItem.pubDate);
        const formattedDate = pubDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + 
                             ' • ' + pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        featuredArticle.innerHTML = `
            <div class="news-featured-content">
                <div class="news-source">
                    <img src="${getSourceLogo(featuredItem.author)}" class="news-source-logo" alt="${featuredItem.author}">
                    <span class="news-source-name">${featuredItem.author || 'Google News'}</span>
                </div>
                <h3 class="news-title">
                    <a href="${featuredItem.link}" target="_blank" rel="noopener noreferrer">${featuredItem.title}</a>
                </h3>
                <div class="news-date">${formattedDate}</div>
            </div>
            <div class="news-featured-image">
                <img src="${featuredItem.image || defaultImages.featuredImage}" 
                    alt="${featuredItem.title}" 
                    loading="lazy"
                    onerror="this.src='${defaultImages.featuredImage}'; this.onerror=null;">
            </div>
        `;
        
        newsWrapper.appendChild(featuredArticle);
        
        // Divider
        const divider = document.createElement('div');
        divider.className = 'news-divider';
        newsWrapper.appendChild(divider);
        
        // Create related articles list
        const articlesList = document.createElement('div');
        articlesList.className = 'news-articles-list';
        
        // Add related articles (items 1-4)
        for (let i = 1; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            const articleItem = document.createElement('div');
            articleItem.className = 'news-list-item';
            
            const pubDate = new Date(item.pubDate);
            const formattedDate = pubDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + 
                                ' • ' + pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            articleItem.innerHTML = `
                <div class="news-source">
                    <img src="${getSourceLogo(item.author)}" class="news-source-logo" alt="${item.author}">
                    <span class="news-source-name">${item.author || 'Google News'}</span>
                </div>
                <h4 class="news-title">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
                </h4>
                <div class="news-date">${formattedDate}</div>
            `;
            
            articlesList.appendChild(articleItem);
        }
        
        newsWrapper.appendChild(articlesList);
        
        // Add "Full Coverage" button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'news-full-coverage';
        
        const viewMore = document.createElement('a');
        viewMore.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        viewMore.target = "_blank";
        viewMore.rel = "noopener noreferrer";
        viewMore.className = "news-full-coverage-btn";
        viewMore.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Full Coverage
        `;
        
        viewMoreContainer.appendChild(viewMore);
        newsWrapper.appendChild(viewMoreContainer);
        
        // Add to container
        newsContainer.appendChild(newsWrapper);
    }
    
    // Show loading indicator before fetching
    newsContainer.innerHTML = '<div class="news-loading"></div>';
    
    // Add CSS for Google News style
    const style = document.createElement('style');
    style.textContent = `
        /* Google News style layout */
        .news-wrapper {
            font-family: 'Google Sans', Arial, sans-serif;
            max-width: 100%;
            color: var(--text-color, #202124);
        }
        
        /* Featured article */
        .news-featured-article {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
            border-radius: 8px;
        }
        
        @media (min-width: 768px) {
            .news-featured-article {
                flex-direction: row;
                align-items: flex-start;
            }
            
            .news-featured-content {
                flex: 1;
            }
            
            .news-featured-image {
                flex: 0 0 40%;
                max-width: 40%;
            }
        }
        
        .news-featured-image img {
            width: 100%;
            height: auto;
            max-height: 200px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        /* Article list */
        .news-divider {
            height: 1px;
            background-color: rgba(0,0,0,0.1);
            margin: 8px 0;
        }
        
        .news-articles-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 8px 0;
        }
        
        .news-list-item {
            padding: 8px 0;
        }
        
        /* Source styling */
        .news-source {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .news-source-logo {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border-radius: 50%;
        }
        
        .news-source-name {
            font-size: 12px;
            color: var(--light-text-color, #5f6368);
            font-weight: 500;
        }
        
        /* Title styling */
        .news-title {
            margin: 0 0 8px 0;
            font-weight: 500;
            line-height: 1.4;
        }
        
        .news-featured-article .news-title {
            font-size: 18px;
        }
        
        .news-list-item .news-title {
            font-size: 16px;
        }
        
        .news-title a {
            color: var(--text-color, #202124);
            text-decoration: none;
        }
        
        .news-title a:hover {
            text-decoration: underline;
        }
        
        /* Date styling */
        .news-date {
            font-size: 12px;
            color: var(--light-text-color, #5f6368);
        }
        
        /* Full coverage button */
        .news-full-coverage {
            padding: 16px 0;
            display: flex;
            justify-content: flex-start;
        }
        
        .news-full-coverage-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 100px;
            background-color: rgba(0,0,0,0.05);
            color: var(--light-text-color, #5f6368);
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            transition: background-color 0.2s ease;
        }
        
        .news-full-coverage-btn:hover {
            background-color: rgba(0,0,0,0.1);
        }
        
        .news-full-coverage-btn svg {
            width: 16px;
            height: 16px;
        }
        
        /* Loading indicator */
        .news-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
        }
        
        .news-loading:after {
            content: '';
            width: 24px;
            height: 24px;
            border: 2px solid #f3f3f3;
            border-radius: 50%;
            border-top: 2px solid #4285f4;
            animation: spin 1s ease infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Dark mode adjustments */
        [data-theme="dark"] .news-featured-article,
        [data-theme="dark"] .news-list-item {
            color: var(--text-color, #e8eaed);
        }
        
        [data-theme="dark"] .news-title a {
            color: var(--text-color, #e8eaed);
        }
        
        [data-theme="dark"] .news-divider {
            background-color: rgba(255,255,255,0.1);
        }
        
        [data-theme="dark"] .news-full-coverage-btn {
            background-color: rgba(255,255,255,0.1);
            color: var(--light-text-color, #adb5bd);
        }
    `;
    document.head.appendChild(style);
    
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
                                !imgUrl.match(/tracking|tracker|analytics/i) && 
                                imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
                                item.image = imgUrl;
                            } else if (index === 0) {
                                // For featured article, use the default featured image
                                item.image = defaultImages.featuredImage;
                            }
                        } catch (e) {
                            if (index === 0) {
                                item.image = defaultImages.featuredImage;
                            }
                        }
                    } else if (index === 0) {
                        // For featured article, always ensure there's an image
                        item.image = defaultImages.featuredImage;
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
