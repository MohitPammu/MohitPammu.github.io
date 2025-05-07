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

// News Feed Function with Website-Matched Styling
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
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Data Science Expert",
            image: defaultImages.defaultImage
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "AI Research Team"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Education Specialist"
        },
        {
            title: "Albert Einstein College of Medicine Launches Data Science Institute | Newswise",
            link: "https://www.newswise.com/articles/albert-einstein-college-of-medicine-launches-data-science-institute",
            pubDate: new Date(Date.now() - 86400000 * 1).toISOString(),
            author: "Science Reporter"
        },
        {
            title: "12 top ways artificial intelligence will impact healthcare - TechTarget",
            link: "https://www.techtarget.com/searchhealthit/feature/12-top-ways-artificial-intelligence-will-impact-healthcare",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Healthcare Analyst"
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
        
        // Try to find image tags with improved regex
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
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
    
    // Format date to "Month Day, Year" format (e.g., "May 3, 2025")
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    }
    
    // Create news layout that matches the website style
    function createNewsLayout(items) {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // First make sure the "Stay updated..." text is centered and has proper spacing
        const introText = document.querySelector('.news p, .section-header p');
        if (introText) {
            introText.style.textAlign = 'center';
            introText.style.marginBottom = '30px';
            introText.style.color = 'var(--light-text-color)';
        }
        
        // Main news container
        const newsWrapper = document.createElement('div');
        newsWrapper.className = 'news-items-container';
        newsWrapper.style.cssText = `
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            font-family: 'Poppins', sans-serif;
        `;
        
        // Process each article
        items.forEach((item, index) => {
            // Article container
            const articleContainer = document.createElement('div');
            articleContainer.className = 'news-article';
            articleContainer.style.cssText = `
                padding-bottom: 20px;
                margin-bottom: 20px;
                border-bottom: ${index < items.length - 1 ? '1px solid var(--border-color)' : 'none'};
            `;
            
            // Source with logo
            const sourceContainer = document.createElement('div');
            sourceContainer.className = 'news-source';
            sourceContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            `;
            
            // Source logo
            const sourceLogo = document.createElement('img');
            sourceLogo.src = getSourceLogo(item.link);
            sourceLogo.alt = '';
            sourceLogo.style.cssText = `
                width: 16px;
                height: 16px;
                margin-right: 8px;
                border-radius: 3px;
            `;
            
            // Hide if logo fails to load
            sourceLogo.onerror = function() {
                this.style.display = 'none';
            };
            
            // In News Google by Staff Writer
            const sourceText = document.createElement('span');
            sourceText.style.cssText = `
                font-size: var(--small-size, 0.875rem);
                color: var(--light-text-color);
            `;
            
            // Extract source name from URL
            let sourceName = "News Google";
            try {
                const url = new URL(item.link);
                const domainParts = url.hostname.replace('www.', '').split('.');
                if (domainParts.length > 0) {
                    if (domainParts[0] === 'google') {
                        sourceName = "News Google";
                    } else {
                        sourceName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
                    }
                }
            } catch(e) {
                console.error("Error parsing URL:", e);
            }
            
            sourceText.innerHTML = `In <span style="font-weight:500;">${sourceName}</span> by Staff Writer`;
            
            // Add logo and text to source container
            sourceContainer.appendChild(sourceLogo);
            sourceContainer.appendChild(sourceText);
            
            // Article title
            const titleElement = document.createElement('h3');
            titleElement.style.cssText = `
                margin: 0 0 10px 0;
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
                color: var(--text-color);
                text-decoration: none;
                transition: color var(--transition-fast, 0.3s ease);
            `;
            
            // Add hover effect
            titleLink.onmouseover = function() {
                this.style.color = 'var(--primary-color)';
            };
            
            titleLink.onmouseout = function() {
                this.style.color = 'var(--text-color)';
            };
            
            titleElement.appendChild(titleLink);
            
            // Date
            const dateElement = document.createElement('div');
            dateElement.style.cssText = `
                font-size: var(--small-size, 0.875rem);
                color: var(--light-text-color);
                margin-bottom: 10px;
            `;
            
            dateElement.textContent = formatDate(item.pubDate);
            
            // Add elements to article container
            articleContainer.appendChild(sourceContainer);
            articleContainer.appendChild(titleElement);
            articleContainer.appendChild(dateElement);
            
            // Add article to wrapper
            newsWrapper.appendChild(articleContainer);
        });
        
        // "Full Coverage" button
        const fullCoverageContainer = document.createElement('div');
        fullCoverageContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 30px;
        `;
        
        const fullCoverageButton = document.createElement('a');
        fullCoverageButton.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        fullCoverageButton.target = "_blank";
        fullCoverageButton.rel = "noopener noreferrer";
        fullCoverageButton.textContent = "Full Coverage";
        fullCoverageButton.className = "btn secondary-btn";
        
        fullCoverageContainer.appendChild(fullCoverageButton);
        newsWrapper.appendChild(fullCoverageContainer);
        
        // Add wrapper to container
        newsContainer.appendChild(newsWrapper);
    }
    
    // Show loading indicator
    newsContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100px;"><div style="width:30px;height:30px;border:3px solid var(--border-color);border-top:3px solid var(--primary-color);border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    
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
                
                // Process items to extract additional info
                items.forEach(item => {
                    // Try to extract actual author if available (often in the "creator" field)
                    if (item.creator && item.creator !== 'staff' && item.creator !== 'Staff Writer') {
                        item.author = item.creator;
                    }
                    
                    // Extract image from content if available
                    if (!item.image) {
                        const imgFromDesc = extractImage(item.description || '');
                        const imgFromContent = extractImage(item.content || '');
                        item.image = imgFromDesc || imgFromContent || defaultImages.defaultImage;
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
