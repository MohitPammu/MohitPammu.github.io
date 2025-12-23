# Global Sales Performance Dashboard

![Sales Dashboard Preview](./Global-Sales-Performance-Dashboard.png)

📊 **[View Dashboard PDF](./Global-Sales-Performance-Dashboard.pdf)** | 📁 **[Download .pbix File](./Global-Sales-Performance-Dashboard.pbix)**

## Project Overview
A Power BI sales analytics dashboard developed as part of the **Edureka Business Analyst using Power BI certification** to demonstrate multi-market analysis, row-level security implementation, DAX proficiency, and profit optimization insights using global retail data.

**Dataset**: 51,291 order transactions across global markets  
**Scope**: $62.3M in total sales | 3 product categories | Multiple geographic regions  
**Timeframe**: 2012-2015 (4-year analysis period)

## Key Insights

### 📈 **Sales Performance**
- **$62.3M total sales** across 4-year period (2012-2015)
- **23.8% average annual growth** with peak performance of 32.5% YoY growth (2013-2014)
- **Technology leads** at 37.73% of total revenue ($23.5M)
- **Consistent growth trajectory** despite market challenges

### ⚠️ **Critical Profitability Challenge**
- **Overall profit ratio: 2.4%** (extremely thin margins)
- **Central Asia operating at -9.4% loss** (negative profitability)
- **Total profit: $1.5M** on $62.3M revenue indicates pricing or cost structure issues
- **Regional disparity**: Canada (7.5%) vs. Central US (1.4%) profit ratios

### 🌍 **Geographic Performance**
- **Europe leads in returned orders** (307 returns) - potential quality/satisfaction issue
- **USCA (United States/Canada)** shows 233 returns
- **Asia Pacific** follows with 243 returns
- **Regional manager performance varies significantly** (Gilbert Wolff leads in sales)

### 📦 **Product Category Analysis**
- **Technology**: 37.73% of sales (highest volume)
- **Furniture**: 32.26% of sales
- **Office Supplies**: 30.01% of sales
- Balanced portfolio with no over-dependence on single category

### 💡 **Strategic Recommendations**
1. **Urgent profitability intervention** - 2.4% margins unsustainable
2. **Central Asia market review** - investigate negative profitability causes
3. **Europe returns analysis** - address quality/satisfaction drivers
4. **Regional best practice sharing** - replicate Canada's 7.5% profit model
5. **Technology category optimization** - leverage highest revenue generator

## Technical Implementation

### Data Architecture

**Data Model:**
- **Fact Table**: Orders (51,291 transactions)
- **Dimension Tables**:
  - Date Table - Time intelligence and period calculations
  - People - Regional manager and sales team data
  - Returns - Product return tracking
  - Categories - Product classification

**Relationships:**
- Star schema design
- One-to-many from dimensions to fact table
- Date table supports time-based calculations

### Row-Level Security (RLS)

**Implementation:**
- Created **2 regional security roles**: Africa Role, Europe Role
- Applied DAX filters on appropriate tables for regional data access
- Enables regional managers to view only their market data
- Executive access maintains full visibility across all regions

**Business Value:**
- Regional managers access filtered regional data
- Maintains data governance and confidentiality
- Supports distributed sales organization structure

### DAX Measures
```dax
// Core Sales Metrics
Total Sales = 
SUMX(
    Orders, 
    Orders[Unit Price] * Orders[Quantity]
)

Total Profit = SUM(Orders[Profit])

// Profitability Analysis
Profit Ratio = 
DIVIDE(
    [Total Profit],
    [Total Sales],
    0
)

// Year-over-Year Growth
YoY Growth % = 
VAR CurrentYearSales = [Total Sales]
VAR PreviousYearSales = 
    CALCULATE(
        [Total Sales],
        DATEADD('Date Table'[Date], -1, YEAR)
    )
RETURN
    DIVIDE(
        CurrentYearSales - PreviousYearSales,
        PreviousYearSales,
        BLANK()
    )
```

### Dashboard Features

**KPI Cards:**
- Total Sales ($62.3M)
- Total Profit ($1.5M)
- Profit Ratio (2.4%)

**Visualizations:**

1. **Total Sales by Year and Category** (Stacked Column Chart)
   - 4-year trend showing category performance
   - Reveals Technology's dominance and consistent growth

2. **Total Sales by Category** (Donut Chart)
   - Clear 37.73% / 32.26% / 30.01% split
   - Balanced portfolio distribution

3. **Region Contribution in Profit** (Table)
   - Profit ratio by region highlighting Central Asia loss
   - Identifies regional performance gaps

4. **Sales, Profit & Profit Ratio by Sub-Category** (Matrix)
   - Granular product performance analysis
   - Profit margin breakdown by sub-category

5. **#Returned Orders by Market** (Treemap)
   - Visual representation of return volume by region
   - Europe identified as highest return market

6. **Top 5 Regional Manager by Sales** (Bar Chart)
   - Performance tracking for sales leadership
   - Gilbert Wolff leads with significant margin

7. **Sales/Profit Toggle** (Button functionality)
   - Interactive switching between sales and profit trends
   - Enhanced user experience for dual-metric analysis

8. **Global Sales Map** (Page 2)
   - Geographic distribution visualization
   - Market penetration and concentration analysis

## Technical Skills Demonstrated

### ✅ **Data Modeling**
- Star schema architecture
- Multi-table relationships
- Date table creation for time intelligence
- Fact and dimension table design

### ✅ **DAX Proficiency**
- SUMX for row-level calculations
- DIVIDE with error handling (zero division protection)
- DATEADD for time intelligence (YoY comparisons)
- CALCULATE for context modification

### ✅ **Security Implementation**
- Row-level security (RLS) configuration
- Regional role creation with DAX filtering
- Multi-tier data access control
- Role testing and validation

### ✅ **Visual Design**
- Professional dashboard layout
- Appropriate chart selection for data types
- Interactive filtering and cross-filtering
- Button-based navigation and metric toggling

### ✅ **Business Intelligence**
- Profitability analysis and margin optimization
- Regional performance benchmarking
- Return rate analysis for quality insights
- Sales leadership performance tracking

## Tools & Technologies

- **Power BI Desktop**: Dashboard development and data modeling
- **DAX**: Calculated measures and business logic
- **Power Query**: Data transformation and preparation (ETL)
- **Row-Level Security**: Access control implementation
- **Data Source**: Global retail transaction data (Edureka certification materials)

## Project Files
```
Global-Sales-Performance-Dashboard/
├── Global-Sales-Performance-Dashboard.pbix          # Power BI dashboard file
├── Global-Sales-Performance-Dashboard.pdf          # Dashboard export
├── Global-Sales-Performance-Dashboard.png          # Dashboard screenshot
└── README.md                         # This documentation
```

## How to Use This Dashboard

### **View the PDF**
- `Global-Sales-Performance-Dashboard.pdf` provides static overview of analytics

### **Interactive Exploration**
1. Download `Global-Sales-Performance-Dashboard.pbix`
2. Open in Power BI Desktop
3. Explore interactive features:
   - Filter by year, category, region
   - Toggle between Sales and Profit views
   - Click visualizations for cross-filtering
4. Test RLS by selecting "View as Role" (Modeling tab)
   - Africa Role: Shows only Africa region data
   - Europe Role: Shows only Europe region data

## Business Applications

Insights from this dashboard type support:

**Strategic Planning:**
- Revenue growth trajectory analysis
- Market profitability assessment
- Regional expansion decisions
- Product portfolio optimization

**Operational Management:**
- Regional manager performance tracking
- Return rate monitoring and quality improvement
- Category mix optimization
- Profit margin enhancement initiatives

**Risk Management:**
- Identifying loss-making regions (Central Asia)
- Return pattern analysis (Europe quality concerns)
- Profitability sustainability assessment

## Learning Outcomes

This project demonstrates:

**Technical Competencies:**
- Multi-market data modeling and analysis
- Row-level security for distributed organizations
- Advanced DAX for profitability calculations
- Interactive dashboard design with toggle functionality

**Analytical Competencies:**
- Profitability vs. revenue growth trade-offs
- Regional performance benchmarking
- Return rate analysis for operational insights
- Sales leadership effectiveness evaluation

## Context & Authenticity

Created as part of the **Edureka Business Analyst using Power BI certification program**. The dataset represents sample global retail transaction data used for educational purposes to demonstrate Power BI capabilities including multi-market analysis, security implementation, and profitability optimization.

The technical skills, analytical methodology, and business insights are directly applicable to real-world multi-regional sales analytics and retail business intelligence scenarios.

## Frequently Asked Questions

**Q: Is this based on real company data?**  
A: This uses sample data from the Edureka certification program simulating a global retail operation. While the data is for educational purposes, the analysis methodology and technical implementation reflect real-world business intelligence practices.

**Q: What's the most important finding from this analysis?**  
A: The critical insight is the profitability challenge: despite 23.8% average annual revenue growth, overall profit margins are only 2.4%, with Central Asia operating at a loss. This indicates either aggressive pricing for market penetration, cost structure issues, or operational inefficiencies that need immediate attention.

**Q: How does row-level security work in this dashboard?**  
A: I created two regional security roles (Africa and Europe) that filter data so regional managers only see their respective markets. This is implemented through DAX filters on the appropriate tables. In a production environment, users would be assigned to roles when the dashboard is published to Power BI Service, ensuring they automatically see only their authorized data.

**Q: What would you do differently or add to enhance this dashboard?**  
A: I'd add several features: (1) Profitability deep-dive page analyzing cost drivers, (2) Customer segmentation by profitability, (3) Product-level margin analysis to identify underperforming SKUs, (4) Forecasting for sales and profit trends, (5) Drill-through pages for regional detail, and (6) Alert thresholds for negative profit regions.

**Q: Why is Central Asia showing negative profitability?**  
A: While I can't determine the root cause from this sample data, typical drivers include: below-cost pricing for market entry, high logistics/freight costs, unfavorable currency exchange, or operational inefficiencies. In a real scenario, I'd analyze cost of goods sold, freight expenses, discounting patterns, and compare to profitable regions to identify specific issues.

---

## Author

**Mohit Pammu, MBA**  
Data Analyst | SQL, Python, Power BI  

📧 mopammu@gmail.com  
💼 [LinkedIn](https://linkedin.com/in/mohitpammu)  
🌐 [Portfolio](https://mohitpammu.github.io/Projects/)

**Certification**: Edureka Business Analyst using Power BI (January 2024)

---

*This project demonstrates Power BI technical proficiency, multi-market analysis capabilities, and business intelligence skills developed through professional certification coursework.*
