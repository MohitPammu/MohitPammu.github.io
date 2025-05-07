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

// News Feed Function with Dynamic Source Logos
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
    
    // Update this with your fallback articles (only 3 now)
    const fallbackContent = [
        {
            title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
            link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
            pubDate: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
            author: "Staff Writer",
            sourceName: "Simplilearn"
        },
        {
            title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
            link: "https://unite.ai/best-language-for-machine-learning-2025/",
            pubDate: new Date(Date.now() - 86400000 * 6).toISOString(),
            author: "Staff Writer",
            sourceName: "Unite.AI"
        },
        {
            title: "Talking to Kids About AI - Towards Data Science",
            link: "https://towardsdatascience.com/talking-to-kids-about-ai",
            pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            author: "Staff Writer",
            sourceName: "Towards Data Science"
        }
    ];
    
    // RSS URL - Google News search for data science and machine learning
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Extract domain name from URL for display
    function extractSourceName(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');
            
            // Custom mapping for known domains
            if (hostname.includes('simplilearn.com')) return 'Simplilearn';
            if (hostname.includes('unite.ai')) return 'Unite.AI';
            if (hostname.includes('towardsdatascience.com')) return 'Towards Data Science';
            if (hostname.includes('newswise.com')) return 'Newswise';
            if (hostname.includes('techtarget.com')) return 'TechTarget';
            
            // Generic extraction - split by dots and capitalize first part
            const parts = hostname.split('.');
            if (parts.length > 0) {
                return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            }
            
            return hostname;
        } catch (e) {
            console.error("Error extracting source name:", e);
            return "News Source";
        }
    }
    
    // Get favicon for a website
    function getSourceLogo(url) {
        if (!url) return '';
        
        try {
            // Extract hostname
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            
            // Use DuckDuckGo favicon service - more reliable than Google's and no size restriction
            return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
        } catch (e) {
            console.error("Error getting source logo:", e);
            return '';
        }
    }
    
    // Format date to "Month Day, Year" format (e.g., "May 3, 2025")
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
    
    // Create news layout that matches the website style
    function createNewsLayout(items) {
        // Clear any existing content
        newsContainer.innerHTML = '';
        
        // Only use first 3 items
        const limitedItems = items.slice(0, 3);
        
        // Process each item
        limitedItems.forEach((item, index) => {
            // Extract source name if not already present
            if (!item.sourceName) {
                item.sourceName = extractSourceName(item.link);
            }
            
            // Get source logo URL
            const logoUrl = getSourceLogo(item.link);
            
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
            
            // Source row (Website logo + "In [SourceName] by Staff Writer")
            const sourceRow = document.createElement('div');
            sourceRow.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            `;
            
            // Source logo
            const logoImg = document.createElement('img');
            logoImg.src = logoUrl;
            logoImg.alt = '';
            logoImg.style.cssText = `
                width: 16px;
                height: 16px;
                margin-right: 8px;
                border-radius: 4px;
            `;
            
            // Handle logo loading error
            logoImg.onerror = function() {
                // Try Google's favicon service as a fallback
                this.src = `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}`;
                
                // If that also fails, hide the image
                this.onerror = function() {
                    this.style.display = 'none';
                };
            };
            
            // Source text
            const sourceText = document.createElement('span');
            sourceText.innerHTML = `In <strong>${item.sourceName}</strong> by ${item.author || 'Staff Writer'}`;
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
            
            // Add to news container
            newsContainer.appendChild(articleEl);
        });
        
        // Full Coverage button
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 32px;
        `;
        
        const fullCoverageBtn = document.createElement('a');
        fullCoverageBtn.href = "https://news.google.com/search?q=data+science+machine+learning&hl=en-US";
        fullCoverageBtn.target = "_blank";
        fullCoverageBtn.rel = "noopener noreferrer";
        fullCoverageBtn.textContent = "Full Coverage";
        fullCoverageBtn.className = "btn secondary-btn";
        
        btnContainer.appendChild(fullCoverageBtn);
        newsContainer.appendChild(btnContainer);
    }
    
    // Make the actual fetch request (with proper error handling)
    function fetchRssData() {
        // Show loading indicator
        newsContainer.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:150px;"><div style="width:30px;height:30px;border:3px solid var(--border-color, #eee);border-top:3px solid var(--primary-color, #4a6cf7);border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
        
        // Add animation for spinner
        const styleEl = document.createElement('style');
        styleEl.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(styleEl);
        
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.status === 'ok' && data.items && data.items.length > 0) {
                console.log("Fetched RSS data successfully:", data);
                
                // Process the results
                const processedItems = data.items.map(item => {
                    // Extract source name from the link
                    const sourceName = extractSourceName(item.link);
                    
                    return {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        author: item.author || 'Staff Writer',
                        sourceName: sourceName
                    };
                });
                
                // Use the data to create the news layout
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

    // Try to fetch directly (no caching to simplify)
    fetchRssData();
}

// Call the function to load the news
loadIndustryNews();
    
});
