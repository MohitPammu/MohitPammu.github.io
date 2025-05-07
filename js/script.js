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

// News Feed Function with Google News exact layout
function loadIndustryNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }
    
    console.log("News function is running");
    
    // Center the intro text
    const introText = document.querySelector('.section-header p');
    if (introText) {
        introText.style.textAlign = 'center';
    }
    
    // Base64 encoded SVG images as fallbacks
    const defaultImages = {
        // Featured article image (blue-green gradient with "Data Science News" text)
        featuredImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQyODVmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRhODUzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjI3MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+CiAgPHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+RGF0YSBTY2llbmNlIE5ld3M8L3RleHQ+Cjwvc3ZnPg=='
    };
    
    // Update this with your fallback articles
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Simplilearn.com",
            image: defaultImages.featuredImage,
            featured: true
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Unite.AI"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Towards Data Science"
        },
        {
            title: "Albert Einstein College of Medicine Launches Data Science Institute | Newswise",
            link: "https://www.newswise.com/articles/albert-einstein-college-of-medicine-launches-data-science-institute",
            pubDate: new Date(Date.now() - 86400000 * 1).toISOString(),
            author: "Newswise"
        },
        {
            title: "12 top ways artificial intelligence will impact healthcare - TechTarget",
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
    
    // Function to get appropriate news source logo
    function getNewsSourceLogo(url) {
        if (!url) return '';
        
        try {
            const hostname = new URL(url).hostname.replace('www.', '');
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
        } catch (e) {
            return '';
        }
    }
    
    // Create news layout exactly like Google News
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Set intro text to center
        const introText = document.querySelector('.news-intro');
        if (introText) {
            introText.style.textAlign = 'center';
        }
        
        // Extract source domains for all articles
        items.forEach(item => {
            try {
                const url = new URL(item.link);
                const domain = url.hostname.replace('www.', '');
                
                // Set displayable source name
                if (domain.includes('simplilearn')) {
                    item.sourceName = 'Simplilearn';
                } else if (domain.includes('unite.ai')) {
                    item.sourceName = 'Unite.AI';
                } else if (domain.includes('towardsdatascience')) {
                    item.sourceName = 'Towards Data Science';
                } else if (domain.includes('newswise')) {
                    item.sourceName = 'Newswise';
                } else if (domain.includes('techtarget')) {
                    item.sourceName = 'TechTarget';
                } else {
                    // Extract domain name as displayable source
                    const parts = domain.split('.');
                    if (parts.length >= 2) {
                        item.sourceName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                    } else {
                        item.sourceName = domain;
                    }
                }
                
                // Set source logo
                item.sourceLogo = getNewsSourceLogo(item.link);
            } catch (e) {
                console.error('Error parsing URL:', e);
                item.sourceName = 'News Source';
                item.sourceLogo = '';
            }
        });
        
        /* CREATE LAYOUT STRUCTURE */
        // Create outer wrapper with table-like CSS grid
        const wrapper = document.createElement('div');
        wrapper.className = 'news-wrapper';
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            max-width: 100%;
            font-family: "Google Sans", Arial, sans-serif;
        `;
        
        // Create the top section with main article and side articles
        const topSection = document.createElement('div');
        topSection.className = 'news-top-section';
        topSection.style.cssText = `
            display: grid;
            grid-template-columns: 320px 1fr;
            grid-gap: 24px;
            margin-bottom: 16px;
        `;
        
        // Make it responsive
        if (window.innerWidth < 768) {
            topSection.style.gridTemplateColumns = '1fr';
        }
        
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                topSection.style.gridTemplateColumns = '1fr';
            } else {
                topSection.style.gridTemplateColumns = '320px 1fr';
            }
        });
        
        // Featured article (first item)
        const featuredItem = items[0];
        
        // CREATE LEFT COLUMN - MAIN ARTICLE
        const mainArticle = document.createElement('div');
        mainArticle.className = 'main-article';
        mainArticle.style.cssText = `
            display: flex;
            flex-direction: column;
        `;
        
        // Create the main article image container
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            width: 100%;
            padding-top: 56.25%; /* 16:9 aspect ratio */
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 12px;
            background-color: #f0f0f0;
        `;
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            imageContainer.style.backgroundColor = '#333';
        }
        
        // Create the image element
        const mainImage = document.createElement('img');
        mainImage.src = featuredItem.image || defaultImages.featuredImage;
        mainImage.alt = featuredItem.title;
        mainImage.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        // Add fallback for image error
        mainImage.onerror = function() {
            this.src = defaultImages.featuredImage;
            this.onerror = null;
        };
        
        imageContainer.appendChild(mainImage);
        mainArticle.appendChild(imageContainer);
        
        // Main article source and title
        const mainArticleContent = document.createElement('div');
        
        // Create source with logo
        const sourceContainer = document.createElement('div');
        sourceContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 4px;
        `;
        
        const sourceLogo = document.createElement('img');
        sourceLogo.src = featuredItem.sourceLogo || '';
        sourceLogo.alt = '';
        sourceLogo.style.cssText = `
            width: 16px;
            height: 16px;
            margin-right: 6px;
            border-radius: 50%;
        `;
        
        // Hide logo if it fails to load
        sourceLogo.onerror = function() {
            this.style.display = 'none';
        };
        
        const sourceText = document.createElement('span');
        sourceText.textContent = 'Google News';
        sourceText.style.cssText = `
            font-size: 12px;
            color: #70757a;
        `;
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            sourceText.style.color = '#9aa0a6';
        }
        
        sourceContainer.appendChild(sourceLogo);
        sourceContainer.appendChild(sourceText);
        
        // Create title element
        const titleElement = document.createElement('a');
        titleElement.href = featuredItem.link;
        titleElement.target = '_blank';
        titleElement.rel = 'noopener noreferrer';
        titleElement.textContent = featuredItem.title;
        titleElement.style.cssText = `
            display: block;
            font-size: 18px;
            line-height: 1.3;
            margin-bottom: 4px;
            font-weight: normal;
            color: var(--text-color, #202124);
            text-decoration: none;
        `;
        
        // Create date element
        const pubDate = new Date(featuredItem.pubDate);
        const dateStr = `${pubDate.getMonth() + 1}/${pubDate.getDate()}`;
        const timeStr = pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const dateElement = document.createElement('div');
        dateElement.textContent = `${dateStr} • ${timeStr}`;
        dateElement.style.cssText = `
            font-size: 12px;
            color: #70757a;
        `;
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            dateElement.style.color = '#9aa0a6';
        }
        
        // Assemble main article content
        mainArticleContent.appendChild(sourceContainer);
        mainArticleContent.appendChild(titleElement);
        mainArticleContent.appendChild(dateElement);
        mainArticle.appendChild(mainArticleContent);
        
        // Add main article to top section
        topSection.appendChild(mainArticle);
        
        // CREATE RIGHT COLUMN - RELATED ARTICLES
        const relatedArticles = document.createElement('div');
        relatedArticles.className = 'related-articles';
        relatedArticles.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
        `;
        
        // Add related articles (items 1-4)
        for (let i = 1; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            const articleElement = document.createElement('div');
            articleElement.className = 'related-article';
            articleElement.style.cssText = `
                padding-bottom: ${i < Math.min(items.length, 5) - 1 ? '16px' : '0'};
                border-bottom: ${i < Math.min(items.length, 5) - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'};
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                articleElement.style.borderBottomColor = 'rgba(255,255,255,0.1)';
            }
            
            // Source with logo
            const itemSourceContainer = document.createElement('div');
            itemSourceContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            `;
            
            const itemSourceLogo = document.createElement('img');
            itemSourceLogo.src = item.sourceLogo || '';
            itemSourceLogo.alt = '';
            itemSourceLogo.style.cssText = `
                width: 16px;
                height: 16px;
                margin-right: 6px;
                border-radius: 50%;
            `;
            
            // Hide logo if it fails to load
            itemSourceLogo.onerror = function() {
                this.style.display = 'none';
            };
            
            const itemSourceText = document.createElement('span');
            itemSourceText.textContent = 'Google News';
            itemSourceText.style.cssText = `
                font-size: 12px;
                color: #70757a;
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                itemSourceText.style.color = '#9aa0a6';
            }
            
            itemSourceContainer.appendChild(itemSourceLogo);
            itemSourceContainer.appendChild(itemSourceText);
            
            // Title
            const itemTitle = document.createElement('a');
            itemTitle.href = item.link;
            itemTitle.target = '_blank';
            itemTitle.rel = 'noopener noreferrer';
            itemTitle.textContent = item.title;
            itemTitle.style.cssText = `
                display: block;
                font-size: 16px;
                line-height: 1.3;
                margin-bottom: 4px;
                font-weight: normal;
                color: var(--text-color, #202124);
                text-decoration: none;
            `;
            
            // Date
            const itemDate = new Date(item.pubDate);
            const itemDateStr = `${itemDate.getMonth() + 1}/${itemDate.getDate()}`;
            const itemTimeStr = itemDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const itemDateElement = document.createElement('div');
            itemDateElement.textContent = `${itemDateStr} • ${itemTimeStr}`;
            itemDateElement.style.cssText = `
                font-size: 12px;
                color: #70757a;
            `;
            
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                itemDateElement.style.color = '#9aa0a6';
            }
            
            // Assemble article
            articleElement.appendChild(itemSourceContainer);
            articleElement.appendChild(itemTitle);
            articleElement.appendChild(itemDateElement);
            
            // Add to related articles
            relatedArticles.appendChild(articleElement);
        }
        
        // Add related articles to top section
        topSection.appendChild(relatedArticles);
        
        // Add top section to wrapper
        wrapper.appendChild(topSection);
        
        // Add Full Coverage button
        const fullCoverageContainer = document.createElement('div');
        fullCoverageContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 24px;
            margin-bottom: 16px;
        `;
        
        const fullCoverageButton = document.createElement('a');
        fullCoverageButton.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        fullCoverageButton.target = "_blank";
        fullCoverageButton.rel = "noopener noreferrer";
        fullCoverageButton.textContent = "Full Coverage";
        fullCoverageButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            background-color: #f1f3f4;
            color: #202124;
        `;
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            fullCoverageButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
            fullCoverageButton.style.color = '#e8eaed';
        }
        
        fullCoverageContainer.appendChild(fullCoverageButton);
        wrapper.appendChild(fullCoverageContainer);
        
        // Add wrapper to container
        newsContainer.appendChild(wrapper);
    }
    
    // Extract images from article description
    function extractImageFromDescription(description) {
        if (!description) return null;
        
        // Try to find image tags
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [...description.matchAll(imgRegex)];
        
        if (matches && matches.length > 0) {
            // Get all image URLs from the description
            const imgUrls = matches.map(match => match[1]);
            
            // Filter out tracking pixels and other tiny images
            const validImages = imgUrls.filter(url => {
                return !url.includes('1x1.gif') && 
                       !url.includes('pixel.gif') &&
                       !url.includes('tracker') &&
                       !url.includes('analytics') &&
                       !url.match(/width=["']?[0-9]px/) &&
                       !url.match(/height=["']?[0-9]px/);
            });
            
            return validImages.length > 0 ? validImages[0] : null;
        }
        
        return null;
    }
    
    // Show loading indicator before fetching
    newsContainer.innerHTML = '<div class="news-loading" style="display:flex;justify-content:center;align-items:center;height:150px;"><div style="width:32px;height:32px;border:3px solid #eee;border-top:3px solid #4285f4;border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    
    // Add animation for spinner
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}`;
    document.head.appendChild(styleSheet);
    
    // Get the news
    loadNewsWithCache()
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                // Process only the first 5 items
                const items = data.items.slice(0, 5);
                
                // Extract images and enhance items
                items.forEach((item, index) => {
                    // Cleanup description
                    const cleanDescription = item.description?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/style=(["'])(?:(?=(\\?))\2.)*?\1/g, '') || '';
                    
                    // Try to extract image from description
                    const imgFromDesc = extractImageFromDescription(cleanDescription);
                    
                    // Try to extract from content if available
                    const imgFromContent = extractImageFromDescription(item.content || '');
                    
                    // Set image if found
                    if (imgFromDesc || imgFromContent) {
                        item.image = imgFromDesc || imgFromContent;
                    } else if (index === 0) {
                        // For main article, use default if no image found
                        item.image = defaultImages.featuredImage;
                    }
                    
                    // Log for debugging
                    console.log(`Image for article ${index}:`, item.image);
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
