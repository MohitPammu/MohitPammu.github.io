const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Parser = require('rss-parser');

const parser = new Parser();
const OUTPUT_FILE = path.join(__dirname, '../../assets/data/news.json');

// Make sure the directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to extract source name from URL or title
function getSourceName(url, title) {
  if (!url && !title) return 'News';
  
  // Try to extract from URL first
  if (url) {
    try {
      const urlLower = url.toLowerCase();
      if (urlLower.includes('simplilearn.com')) return 'Simplilearn';
      if (urlLower.includes('unite.ai')) return 'Unite.AI';
      if (urlLower.includes('towardsdatascience.com')) return 'Towards Data Science';
      if (urlLower.includes('kdnuggets.com')) return 'KDnuggets';
      if (urlLower.includes('analyticsvidhya.com')) return 'Analytics Vidhya';
      if (urlLower.includes('medium.com')) return 'Medium';
      if (urlLower.includes('datacamp.com')) return 'DataCamp';
      if (urlLower.includes('elmhurst.edu')) return 'Elmhurst University';
      if (urlLower.includes('stackoverflow.com')) return 'Stack Overflow';
      if (urlLower.includes('github.com')) return 'GitHub';
      if (urlLower.includes('kaggle.com')) return 'Kaggle';
      if (urlLower.includes('machinelearningmastery.com')) return 'Machine Learning Mastery';
      if (urlLower.includes('forbes.com')) return 'Forbes';
      if (urlLower.includes('techcrunch.com')) return 'TechCrunch';
      if (urlLower.includes('venturebeat.com')) return 'VentureBeat';
      if (urlLower.includes('wired.com')) return 'Wired';
      if (urlLower.includes('ieee.org')) return 'IEEE';
      if (urlLower.includes('datanami.com')) return 'Datanami';
      if (urlLower.includes('insidebigdata.com')) return 'Inside Big Data';
      if (urlLower.includes('bloomberg.com')) return 'Bloomberg';
      if (urlLower.includes('hbr.org')) return 'Harvard Business Review';
      if (urlLower.includes('zdnet.com')) return 'ZDNet';
      
      // Extract domain name
      const domain = new URL(url).hostname.replace('www.', '');
      const parts = domain.split('.');
      
      if (parts.length > 0) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
      
      return domain;
    } catch (e) {
      // If URL parsing fails, try to extract from title
      if (!title) return 'News';
    }
  }
  
  // Try to extract from title as fallback
  if (title) {
    // Often article titles end with "- Source Name"
    const titleParts = title.split(' - ');
    if (titleParts.length > 1) {
      return titleParts[titleParts.length - 1].trim();
    }
  }
  
  return 'News';
}

// Fallback content in case the RSS feed fetch fails
const fallbackContent = [
  {
    title: "Data Science vs Machine Learning vs Data Analytics [2025] - Simplilearn.com",
    link: "https://simplilearn.com/data-science-vs-machine-learning-vs-data-analytics",
    pubDate: new Date().toISOString(),
    author: "Staff Writer",
    source: "Simplilearn"
  },
  {
    title: "What is the Best Language for Machine Learning? (May 2025) - Unite.AI",
    link: "https://unite.ai/best-language-for-machine-learning-2025/",
    pubDate: new Date().toISOString(),
    author: "Staff Writer",
    source: "Unite.AI"
  },
  {
    title: "Talking to Kids About AI - Towards Data Science",
    link: "https://towardsdatascience.com/talking-to-kids-about-ai",
    pubDate: new Date().toISOString(),
    author: "Staff Writer",
    source: "Towards Data Science"
  }
];

async function fetchRssFeed() {
  try {
    // Google News RSS feed URL for data science and machine learning
    const rssUrl = 'https://news.google.com/rss/search?q=data+science+machine+learning+when:7d&hl=en-US&gl=US&ceid=US:en';
    
    // Fetch and parse the feed
    const feed = await parser.parseURL(rssUrl);
    
// Process items
const items = feed.items.slice(0, 6).map(item => {
  // Extract the actual link (Google News wraps the original URL)
  let link = item.link;
  if (link.includes('news.google.com')) {
    const matches = item.content.match(/href="([^"]+)"/);
    if (matches && matches[1]) {
      link = matches[1];
    }
  }
  
  // Better author extraction
  let author = 'Staff Writer';
  if (item.creator) {
    author = item.creator;
  } else if (item.author) {
    author = item.author;
  } else if (item['dc:creator']) {
    author = item['dc:creator'];
  }
  
  // Clean up author name if needed
  if (author.includes('@')) {
    author = author.split('@')[0].trim();
  }
  
  return {
    title: item.title,
    link: link,
    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
    author: author,
    source: getSourceName(link, item.title)
  };
});
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      status: 'ok',
      lastUpdated: new Date().toISOString(),
      items: items
    }, null, 2));
    
    console.log('News feed updated successfully!');
    
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    
    // Create fallback content if failed
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      status: 'fallback',
      lastUpdated: new Date().toISOString(),
      items: fallbackContent
    }, null, 2));
    
    console.log('Used fallback content due to error.');
  }
}

// Run the function
fetchRssFeed();
