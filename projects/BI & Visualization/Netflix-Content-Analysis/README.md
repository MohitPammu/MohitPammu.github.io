# Netflix Content Analysis Dashboard

![Netflix Dashboard Preview](./Netflix_Dashboard.png)

📁 **[Download .pbix File](./Netflix%20Dashboard.pbix)**

## Project Overview
A Power BI content analytics dashboard developed as part of the **Edureka Business Analyst using Power BI certification** to demonstrate data visualization, Power Query transformations, and dashboard design fundamentals using Netflix streaming data.

**Dataset**: 5,806 Netflix titles | 77,213 credits records  
**Scope**: Content distribution analysis across genres, release years, geographic regions, and IMDB ratings  
**Timeframe**: Content releases from 2000-2022

## Key Insights

### 📺 **Content Composition**
- **Platform is 65% movies (3,759 titles) vs. 35% TV shows (2,047 titles)**
- Despite fewer titles, **TV shows average 13% higher IMDB ratings** (6.43 vs. 5.68)
- Suggests potential quality-over-quantity trade-off in production strategy

### 🎬 **Genre Distribution**
- **Top 3 genres by volume:**
  1. Comedy: 510 titles (407 movies, 103 shows)
  2. Drama: 350 titles (240 movies, 110 shows)
  3. Documentary: 320 titles (225 movies, 95 shows)

### 📈 **Production Trends**
- **Content releases peaked in 2018** (540 movies, 308 shows)
- **Dramatic decline by 2022** (109 movies, 108 shows)
- Movie and TV show production converged in recent years, indicating strategic shift

### 🌍 **Geographic Availability**
- **Highest content concentration:** United States and India (by runtime hours)
- **Strong presence** in Western Europe markets
- Runtime clustering suggests regional content availability strategies

### ⭐ **Quality Metrics**
- **Average IMDB rating:** 5.94 across all content
- **TV shows consistently outperform movies** in ratings
- **Total runtime:** 7,513 hours across platform

## Technical Implementation

### Data Architecture
- **Primary Table**: Titles (5,806 rows)
- **Supporting Table**: Credits (77,213 rows)
- Data relationships established between titles and cast/crew information

### Power Query Transformations
- Data cleaning and standardization performed prior to modeling
- Country field consolidation (handled multi-variation country values)
- Genre categorization and normalization
- Date field parsing for time-based analysis

### DAX Measures
```dax
// Runtime Conversion
Runtime hours = SUM(titles[runtime])/60

// Total Content Calculation
Total Content = SUM(titles[runtime]*titles[seasons])

// Content Type Counts
Total Movies = COUNTROWS(FILTER(titles, titles[type] = "MOVIE"))

Total Shows = COUNTROWS(FILTER(titles, titles[type] = "SHOW"))
```

### Dashboard Features

**KPI Cards:**
- Total runtime hours (7,513)
- Movie count (3,759)
- TV show count (2,047)
- Average IMDB rating (5.94)

**Visualizations:**
1. **Top 5 Genres** (Stacked Bar Chart) - Movie vs. show breakdown by genre
2. **Content by Year** (Area Chart) - Release trends from 2000-2022
3. **Movies vs TV Shows** (Donut Chart) - 65/35 split visualization
4. **Subscribers by Country** (Map Visual) - Geographic distribution by runtime
5. **Interactive Filters** - Title, genre, and production year slicers

## Technical Skills Demonstrated

### ✅ **Data Preparation**
- Power Query data cleaning and transformation
- Multi-table data modeling
- Feature engineering (runtime calculations, content categorization)

### ✅ **DAX Implementation**
- Calculated measures for aggregations
- Content type filtering logic
- Runtime conversions and summations

### ✅ **Visual Design**
- Netflix brand-aligned color scheme (red/black/white)
- Clear visual hierarchy and layout
- Interactive filtering and cross-filtering
- Appropriate chart type selection for data types

### ✅ **Business Intelligence**
- Content strategy analysis (movie vs. show focus)
- Quality metrics tracking (IMDB ratings)
- Geographic content distribution patterns
- Trend identification (production peaks and declines)

## Tools & Technologies
- **Power BI Desktop**: Dashboard development and visualization
- **Power Query**: ETL and data transformation
- **DAX**: Calculated measures and aggregations
- **Data Source**: Netflix catalog dataset (Edureka certification materials)

## Project Files
```
Netflix-Content-Analysis/
├── Netflix_Dashboard.pbix          # Power BI dashboard file
├── Netflix_Dashboard.png           # Dashboard screenshot
└── README.md                       # This documentation
```

## How to Use This Dashboard

### **View the Screenshot**
- `Netflix_Dashboard.png` provides static overview of key metrics

### **Interactive Exploration**
1. Download `Netflix_Dashboard.pbix`
2. Open in Power BI Desktop
3. Use slicers to filter by:
   - Content type (Movie/Show)
   - Genre categories
   - Production year ranges
4. Click on visualizations for cross-filtering insights

## Business Applications

While built with sample data, this dashboard framework could support:

**Content Strategy Decisions:**
- Genre portfolio optimization
- Movie vs. series production balance
- Quality vs. quantity investment trade-offs

**Regional Planning:**
- Geographic content gaps identification
- Market-specific content recommendations
- Runtime availability analysis by region

**Performance Monitoring:**
- Content library growth tracking
- Quality metrics over time
- Genre trend analysis

## Learning Outcomes

This project demonstrates:
- End-to-end dashboard development workflow
- Power Query data transformation skills
- DAX measure creation for business metrics
- Visual design aligned with brand identity
- Insight generation from content metadata

## Context & Authenticity

Created as part of the **Edureka Business Analyst using Power BI certification program**. The dataset represents sample Netflix content data used for educational purposes to demonstrate Power BI capabilities including data modeling, transformation, visualization, and dashboard design.

The technical skills, analytical approach, and visualization techniques are directly applicable to real-world content analytics and streaming platform business intelligence scenarios.

## Frequently Asked Questions

**Q: Is this based on real Netflix data?**  
A: This uses sample data provided in the Edureka certification program for educational purposes. While the data structure reflects real streaming content metadata, the specific values and distributions are for demonstration.

**Q: What was the main focus of this project?**  
A: This was an early certification project focused on dashboard design fundamentals, Power Query transformations, and visual storytelling. The emphasis was on creating a clean, professional dashboard rather than deep statistical analysis.

**Q: What's the key insight from your analysis?**  
A: The most interesting finding was that TV shows consistently rate 13% higher on IMDB than movies (6.43 vs 5.68) despite Netflix producing nearly twice as many movies. This suggests viewers perceive shows as higher quality, which could inform content investment strategy.

**Q: How would you enhance this dashboard?**  
A: In a production environment, I'd add: (1) time-based trending with year-over-year comparisons, (2) deeper genre analysis with sub-genre breakdowns after data cleaning, (3) cast/crew analytics using the credits table, (4) predictive models for content performance, and (5) integration with actual viewership/engagement data if available.

---

## Author

**Mohit Pammu, MBA**  
Data Analyst | SQL, Python, Power BI  

📧 mopammu@gmail.com  
💼 [LinkedIn](https://linkedin.com/in/mohitpammu)  
🌐 [Portfolio](https://mohitpammu.github.io/Projects/)

**Certification**: Edureka Business Analyst using Power BI (January 2024)

---

*This project demonstrates Power BI visualization and dashboard design skills developed through professional certification coursework.*
