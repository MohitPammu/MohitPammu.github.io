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

// News Feed Function with Google News styling and logos
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Base64 encoded SVG images as fallbacks
    const defaultImages = {
        // Featured article image (blue-green gradient with "Data Science News" text)
        featuredImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQyODVmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRhODUzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjI3MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+CiAgPHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+RGF0YSBTY2llbmNlIE5ld3M8L3RleHQ+Cjwvc3ZnPg==',
        
        // Source logos (colored circles with initials)
        googleLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzRjOGJmNSIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5HPC90ZXh0Pjwvc3ZnPg==',
        uniteLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzUwNTVlYiIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5VPC90ZXh0Pjwvc3ZnPg==',
        tdsLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzAzYTlmNCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
        simpliLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iI2ZmNWM0MCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
        newswiseLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzFhNzNlOCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg==',
        techTargetLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzQwNDA0MCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg=='
    };
    
    // Get appropriate logo for each source
    function getSourceLogo(url) {
        if (!url) return defaultImages.googleLogo;
        
        const urlLower = url.toLowerCase();
        if (urlLower.includes('unite.ai')) return defaultImages.uniteLogo;
        if (urlLower.includes('towardsdatascience')) return defaultImages.tdsLogo;
        if (urlLower.includes('simplilearn')) return defaultImages.simpliLogo;
        if (urlLower.includes('newswise')) return defaultImages.newswiseLogo;
        if (urlLower.includes('techtarget')) return defaultImages.techTargetLogo;
        
        return defaultImages.googleLogo;
    }
    
    // Update this with your additional fallback articles
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Google News",
            image: defaultImages.featuredImage,
            featured: true
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Google News"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Google News"
        },
        {
            title: "Albert Einstein College of Medicine Launches Data Science Institute | Newswise",
            link: "https://www.newswise.com/articles/albert-einstein-college-of-medicine-launches-data-science-institute",
            pubDate: new Date(Date.now() - 86400000 * 1).toISOString(),
            author: "Google News"
        },
        {
            title: "12 top ways artificial intelligence will impact healthcare - TechTarget",
            link: "https://www.techtarget.com/searchhealthit/feature/12-top-ways-artificial-intelligence-will-impact-healthcare",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Google News"
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
    
    // Create news layout (Google News style)
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Create the news container
        const newsWrapper = document.createElement('div');
        newsWrapper.className = 'news-layout';
        
        // First create main row
        const mainRow = document.createElement('div');
        mainRow.className = 'news-main-row';
        
        // Featured article (first item)
        const featuredItem = items[0];
        
        // Extract domain name from URL for source display
        let sourceName = '';
        let sourceLogo = defaultImages.googleLogo;
        
        try {
            const url = new URL(featuredItem.link);
            sourceName = url.hostname.replace('www.', '');
            
            // Simplify domain if possible
            if (sourceName.includes('simplilearn')) {
                sourceName = 'Simplilearn.com';
                sourceLogo = defaultImages.simpliLogo;
            }
            else if (sourceName.includes('unite.ai')) {
                sourceName = 'Unite.AI';
                sourceLogo = defaultImages.uniteLogo;
            }
            else if (sourceName.includes('towardsdatascience')) {
                sourceName = 'Towards Data Science';
                sourceLogo = defaultImages.tdsLogo;
            }
            else if (sourceName.includes('newswise')) {
                sourceName = 'Newswise';
                sourceLogo = defaultImages.newswiseLogo;
            }
            else if (sourceName.includes('techtarget')) {
                sourceName = 'TechTarget';
                sourceLogo = defaultImages.techTargetLogo;
            }
        } catch(e) {
            sourceName = 'Google News';
            sourceLogo = defaultImages.googleLogo;
        }
        
        // Featured article date
        const pubDate = new Date(featuredItem.pubDate);
        const dateOptions = { month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateStr = pubDate.toLocaleDateString(undefined, dateOptions);
        const timeStr = pubDate.toLocaleTimeString([], timeOptions);
        
        // Main featured article left side
        const mainLeft = document.createElement('div');
        mainLeft.className = 'news-main-left';
        mainLeft.innerHTML = `
            <img src="${featuredItem.image || defaultImages.featuredImage}" 
                 alt="${featuredItem.title}" 
                 class="news-featured-image"
                 loading="lazy"
                 onerror="this.src='${defaultImages.featuredImage}'; this.onerror=null;">
        `;
        
        // Main featured article right side
        const mainRight = document.createElement('div');
        mainRight.className = 'news-main-right';
        
        // Add source info with logo
        mainRight.innerHTML = `
            <div class="news-source">
                <img src="${sourceLogo}" alt="${sourceName}" class="news-source-logo">
                <span>Google News</span>
            </div>
            <h3 class="news-title">
                <a href="${featuredItem.link}" target="_blank" rel="noopener noreferrer">
                    ${featuredItem.title}
                </a>
            </h3>
            <div class="news-date">${dateStr} • ${timeStr}</div>
        `;
        
        // Add to main row
        mainRow.appendChild(mainLeft);
        mainRow.appendChild(mainRight);
        newsWrapper.appendChild(mainRow);
        
        // Add divider
        const divider = document.createElement('div');
        divider.className = 'news-divider';
        newsWrapper.appendChild(divider);
        
        // Related articles section
        const relatedSection = document.createElement('div');
        relatedSection.className = 'news-related-section';
        
        // Add related articles
        for (let i = 1; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            
            // Get source from URL
            let sourceName = '';
            let sourceLogo = defaultImages.googleLogo;
            
            try {
                const url = new URL(item.link);
                sourceName = url.hostname.replace('www.', '');
                sourceLogo = getSourceLogo(item.link);
                
                // Simplify domain if possible
                if (sourceName.includes('simplilearn')) sourceName = 'Simplilearn.com';
                else if (sourceName.includes('unite.ai')) sourceName = 'Unite.AI';
                else if (sourceName.includes('towardsdatascience')) sourceName = 'Towards Data Science';
                else if (sourceName.includes('newswise')) sourceName = 'Newswise';
                else if (sourceName.includes('techtarget')) sourceName = 'TechTarget';
            } catch(e) {
                sourceName = 'Google News';
            }
            
            // Related article date
            const pubDate = new Date(item.pubDate);
            const dateStr = pubDate.toLocaleDateString(undefined, dateOptions);
            const timeStr = pubDate.toLocaleTimeString([], timeOptions);
            
            // Create article item
            const articleItem = document.createElement('div');
            articleItem.className = 'news-related-item';
            
            articleItem.innerHTML = `
                <div class="news-source">
                    <img src="${sourceLogo}" alt="${sourceName}" class="news-source-logo">
                    <span>Google News</span>
                </div>
                <h4 class="news-title">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                        ${item.title}
                    </a>
                </h4>
                <div class="news-date">${dateStr} • ${timeStr}</div>
            `;
            
            relatedSection.appendChild(articleItem);
        }
        
        newsWrapper.appendChild(relatedSection);
        
        // Add "Full Coverage" button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'news-full-coverage-container';
        
        const viewMore = document.createElement('a');
        viewMore.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        viewMore.target = "_blank";
        viewMore.rel = "noopener noreferrer";
        viewMore.className = "news-full-coverage-btn";
        viewMore.innerHTML = "Full Coverage";
        
        viewMoreContainer.appendChild(viewMore);
        newsWrapper.appendChild(viewMoreContainer);
        
        // Add the whole layout to the container
        newsContainer.appendChild(newsWrapper);
    }
    
    // Show loading indicator before fetching
    newsContainer.innerHTML = '<div class="news-loading"></div>';
    
    // Get the news
    loadNewsWithCache()
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                // Process only the first 5 items
                const items = data.items.slice(0, 5);
                
                // Extract images for the first item
                if (items[0]) {
                    const description = items[0].description || '';
                    const imgRegex = /<img[^>]+src="([^">]+)"/;
                    const imgMatch = description.match(imgRegex);
                    
                    if (imgMatch && imgMatch[1]) {
                        try {
                            // Validate image URL and filter out tracking pixels
                            const imgUrl = imgMatch[1];
                            if (!imgUrl.includes('1x1') && !imgUrl.includes('pixel') && 
                                !imgUrl.match(/tracking|tracker|analytics/i) && 
                                imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
                                items[0].image = imgUrl;
                            } else {
                                // Use default image for featured article
                                items[0].image = defaultImages.featuredImage;
                            }
                        } catch (e) {
                            items[0].image = defaultImages.featuredImage;
                        }
                    } else {
                        items[0].image = defaultImages.featuredImage;
                    }
                }
                
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
