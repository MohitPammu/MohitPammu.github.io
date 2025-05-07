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

// News Feed Function with Google News styling
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
        featuredImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDAwIDIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQyODVmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRhODUzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPgogIDxjaXJjbGUgY3g9IjI3MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+CiAgPHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+RGF0YSBTY2llbmNlIE5ld3M8L3RleHQ+Cjwvc3ZnPg==',
        
        // Source logos (colored circles with initials)
        simpliLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iI2ZmNWM0MCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5TPC90ZXh0Pjwvc3ZnPg==',
        uniteLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzUwNTVlYiIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5VPC90ZXh0Pjwvc3ZnPg==',
        tdsLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzAzYTlmNCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg==',
        newswiseLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzFhNzNlOCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg==',
        techTargetLogo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iIzQwNDA0MCIvPjx0ZXh0IHg9IjUiIHk9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5UPC90ZXh0Pjwvc3ZnPg=='
    };
    
    // Get appropriate logo for each source
    function getSourceLogo(url) {
        if (!url) return '';
        
        const urlLower = url.toLowerCase();
        if (urlLower.includes('unite.ai')) return defaultImages.uniteLogo;
        if (urlLower.includes('towardsdatascience')) return defaultImages.tdsLogo;
        if (urlLower.includes('simplilearn')) return defaultImages.simpliLogo;
        if (urlLower.includes('newswise')) return defaultImages.newswiseLogo;
        if (urlLower.includes('techtarget')) return defaultImages.techTargetLogo;
        
        return '';
    }
    
    // Update this with your additional fallback articles
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
    
    // Create news layout (Google News style)
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Create the news container wrapper
        const newsWrapper = document.createElement('div');
        newsWrapper.className = 'news-wrapper';
        newsWrapper.style.cssText = 'display: grid; grid-template-columns: 1fr; grid-gap: 20px; width: 100%;';
        
        // Apply media query directly
        if (window.innerWidth >= 768) {
            newsWrapper.style.gridTemplateColumns = '300px 1fr';
        }
        
        // Featured article (first item)
        const featuredItem = items[0];
        
        // Extract domain name for source display
        let sourceName = '';
        let sourceLogo = '';
        
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
            sourceName = featuredItem.author || 'Source';
            sourceLogo = getSourceLogo(featuredItem.link);
        }
        
        // Format date
        const pubDate = new Date(featuredItem.pubDate);
        const dateStr = pubDate.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
        const timeStr = pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Main article card (left column)
        const mainCard = document.createElement('div');
        mainCard.className = 'main-card';
        mainCard.style.cssText = 'width: 100%; height: 100%;';
        
        // Image container for main article
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = 'width: 100%; height: auto; overflow: hidden;';
        
        // Image element with forced dimensions
        const mainImage = document.createElement('img');
        mainImage.src = featuredItem.image || defaultImages.featuredImage;
        mainImage.alt = featuredItem.title;
        mainImage.style.cssText = 'width: 100%; height: auto; object-fit: cover; border-radius: 8px;';
        mainImage.onerror = function() {
            this.src = defaultImages.featuredImage;
            this.onerror = null;
        };
        
        imageContainer.appendChild(mainImage);
        mainCard.appendChild(imageContainer);
        
        // Add the main card to the wrapper
        newsWrapper.appendChild(mainCard);
        
        // Related articles container (right column)
        const relatedArticles = document.createElement('div');
        relatedArticles.className = 'related-articles';
        relatedArticles.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
        
        // Add the main article information to the related articles (at the top)
        const mainArticleInfo = document.createElement('div');
        mainArticleInfo.className = 'article-item';
        mainArticleInfo.style.cssText = 'margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);';
        
        // Source with logo for main article
        const mainSourceContainer = document.createElement('div');
        mainSourceContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
        
        if (sourceLogo) {
            const logoImg = document.createElement('img');
            logoImg.src = sourceLogo;
            logoImg.alt = sourceName;
            logoImg.style.cssText = 'width: 16px; height: 16px; margin-right: 8px; border-radius: 50%;';
            mainSourceContainer.appendChild(logoImg);
        }
        
        const sourceText = document.createElement('span');
        sourceText.textContent = 'Google News';
        sourceText.style.cssText = 'font-size: 12px; color: var(--light-text-color, #5f6368); font-weight: 500;';
        mainSourceContainer.appendChild(sourceText);
        
        // Title link for main article
        const mainTitleLink = document.createElement('a');
        mainTitleLink.href = featuredItem.link;
        mainTitleLink.target = '_blank';
        mainTitleLink.rel = 'noopener noreferrer';
        mainTitleLink.textContent = featuredItem.title;
        mainTitleLink.style.cssText = 'color: var(--text-color, #202124); text-decoration: none; font-size: 18px; font-weight: 500; line-height: 1.4; display: block; margin-bottom: 8px;';
        
        // Date for main article
        const mainDateEl = document.createElement('div');
        mainDateEl.textContent = `${dateStr} • ${timeStr}`;
        mainDateEl.style.cssText = 'font-size: 12px; color: var(--light-text-color, #5f6368);';
        
        // Assemble main article info
        mainArticleInfo.appendChild(mainSourceContainer);
        mainArticleInfo.appendChild(mainTitleLink);
        mainArticleInfo.appendChild(mainDateEl);
        
        // Add main article info to related articles
        relatedArticles.appendChild(mainArticleInfo);
        
        // Add related articles (items 1-4)
        for (let i = 1; i < Math.min(items.length, 5); i++) {
            const item = items[i];
            
            // Get source and logo
            let relatedSourceName = '';
            let relatedSourceLogo = '';
            
            try {
                const url = new URL(item.link);
                relatedSourceName = url.hostname.replace('www.', '');
                
                // Simplify domain if possible
                if (relatedSourceName.includes('simplilearn')) {
                    relatedSourceName = 'Simplilearn.com';
                    relatedSourceLogo = defaultImages.simpliLogo;
                }
                else if (relatedSourceName.includes('unite.ai')) {
                    relatedSourceName = 'Unite.AI';
                    relatedSourceLogo = defaultImages.uniteLogo;
                }
                else if (relatedSourceName.includes('towardsdatascience')) {
                    relatedSourceName = 'Towards Data Science';
                    relatedSourceLogo = defaultImages.tdsLogo;
                }
                else if (relatedSourceName.includes('newswise')) {
                    relatedSourceName = 'Newswise';
                    relatedSourceLogo = defaultImages.newswiseLogo;
                }
                else if (relatedSourceName.includes('techtarget')) {
                    relatedSourceName = 'TechTarget';
                    relatedSourceLogo = defaultImages.techTargetLogo;
                }
            } catch(e) {
                relatedSourceName = item.author || 'Source';
                relatedSourceLogo = getSourceLogo(item.link);
            }
            
            // Format date
            const itemPubDate = new Date(item.pubDate);
            const itemDateStr = itemPubDate.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
            const itemTimeStr = itemPubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Create article item
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.style.cssText = 'padding: 8px 0;';
            
            // Source container with logo
            const sourceContainer = document.createElement('div');
            sourceContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
            
            if (relatedSourceLogo) {
                const logoImg = document.createElement('img');
                logoImg.src = relatedSourceLogo;
                logoImg.alt = relatedSourceName;
                logoImg.style.cssText = 'width: 16px; height: 16px; margin-right: 8px; border-radius: 50%;';
                sourceContainer.appendChild(logoImg);
            }
            
            const sourceTextEl = document.createElement('span');
            sourceTextEl.textContent = 'Google News';
            sourceTextEl.style.cssText = 'font-size: 12px; color: var(--light-text-color, #5f6368); font-weight: 500;';
            sourceContainer.appendChild(sourceTextEl);
            
            // Title link
            const titleLink = document.createElement('a');
            titleLink.href = item.link;
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';
            titleLink.textContent = item.title;
            titleLink.style.cssText = 'color: var(--text-color, #202124); text-decoration: none; font-size: 15px; font-weight: 500; line-height: 1.4; display: block; margin-bottom: 8px;';
            
            // Date
            const dateEl = document.createElement('div');
            dateEl.textContent = `${itemDateStr} • ${itemTimeStr}`;
            dateEl.style.cssText = 'font-size: 12px; color: var(--light-text-color, #5f6368);';
            
            // Assemble article item
            articleItem.appendChild(sourceContainer);
            articleItem.appendChild(titleLink);
            articleItem.appendChild(dateEl);
            
            // Add to related articles
            relatedArticles.appendChild(articleItem);
        }
        
        // Add related articles to the wrapper
        newsWrapper.appendChild(relatedArticles);
        
        // Add "Full Coverage" button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 24px; grid-column: 1 / -1;';
        
        const viewMore = document.createElement('a');
        viewMore.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        viewMore.target = "_blank";
        viewMore.rel = "noopener noreferrer";
        viewMore.className = "btn secondary-btn";
        viewMore.textContent = "Full Coverage";
        
        viewMoreContainer.appendChild(viewMore);
        newsWrapper.appendChild(viewMoreContainer);
        
        // Add dark mode compatibility
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            mainArticleInfo.style.borderBottomColor = 'rgba(255,255,255,0.1)';
        }
        
        // Add the whole layout to the container
        newsContainer.appendChild(newsWrapper);
        
        // Apply responsive behavior
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                newsWrapper.style.gridTemplateColumns = '300px 1fr';
            } else {
                newsWrapper.style.gridTemplateColumns = '1fr';
            }
        });
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
