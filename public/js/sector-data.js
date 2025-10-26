// API Configuration
const API_CONFIG = {
  baseUrl: process.env.PSX_API_BASE_URL || 'https://api.psx.com.pk/api/v1', // Replace with actual PSX API URL
  apiKey: process.env.PSX_API_KEY, // You'll need to set this in your environment variables
};

class SectorData {
  constructor() {
    this.newsCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
    this.failedRequests = new Map(); // Track failed requests for retry mechanism
    this.maxRetries = 3; // Maximum number of retry attempts
  }

  async getTopMovers(sector) {
    // In production, this would be an API call to get real data
    // For demo, generating sample data
    return {
      gainers: [
        { symbol: "MEBL", name: "Meezan Bank", change: "+3.45%", price: "185.50", volume: "2.5M" },
        { symbol: "LUCK", name: "Lucky Cement", change: "+2.88%", price: "876.25", volume: "1.2M" },
        { symbol: "ENGRO", name: "Engro Corp", change: "+2.12%", price: "345.75", volume: "0.9M" }
      ],
      losers: [
        { symbol: "PPL", name: "Pakistan Petroleum", change: "-2.34%", price: "145.30", volume: "1.8M" },
        { symbol: "OGDC", name: "Oil & Gas Dev", change: "-1.95%", price: "234.50", volume: "1.5M" },
        { symbol: "POL", name: "Pakistan Oilfields", change: "-1.45%", price: "456.25", volume: "0.7M" }
      ]
    };
  }

  async getSectorNews(sector) {
    if (this.newsCache.has(sector)) {
      return this.newsCache.get(sector);
    }

    // In production, this would be an API call to get real news
    // For demo, generating sample news
    const news = [
      {
        title: `${sector} Sector Shows Strong Growth in Q3`,
        date: "2025-10-26",
        source: "Business Recorder",
        url: "#",
        summary: "The sector demonstrated robust performance with increased trading volumes..."
      },
      {
        title: `New Regulations Impact ${sector} Companies`,
        date: "2025-10-25",
        source: "Dawn",
        url: "#",
        summary: "Recent policy changes by SECP expected to influence sector dynamics..."
      },
      {
        title: `${sector} Outlook for 2026`,
        date: "2025-10-24",
        source: "The News",
        url: "#",
        summary: "Analysts predict positive growth trajectory for the sector..."
      }
    ];

    this.newsCache.set(sector, news);
    return news;
  }

  async getKeyStocks(sector) {
    // In production, this would be an API call
    return {
      marketLeaders: [
        { symbol: "MEBL", name: "Meezan Bank", marketCap: "82.5B", weight: "15.2%" },
        { symbol: "LUCK", name: "Lucky Cement", marketCap: "65.3B", weight: "12.1%" },
        { symbol: "ENGRO", name: "Engro Corp", marketCap: "58.7B", weight: "10.8%" }
      ],
      volumeLeaders: [
        { symbol: "WTL", name: "WorldCall Telecom", volume: "15.2M", value: "125.3M" },
        { symbol: "TELE", name: "Telecard Ltd", volume: "12.1M", value: "98.5M" },
        { symbol: "ANL", name: "Azgard Nine", volume: "10.8M", value: "87.2M" }
      ]
    };
  }

  async getEconomicIndicators(sector) {
    // In production, this would be an API call
    return {
      keyMetrics: [
        { name: "Sector P/E", value: "12.5", trend: "up", change: "+0.5" },
        { name: "Avg ROE", value: "15.2%", trend: "up", change: "+1.2%" },
        { name: "Dividend Yield", value: "5.8%", trend: "down", change: "-0.3%" }
      ],
      macroFactors: [
        { name: "Interest Rate Impact", status: "Moderate", trend: "negative" },
        { name: "Currency Risk", status: "High", trend: "negative" },
        { name: "Regulatory Environment", status: "Stable", trend: "neutral" }
      ],
      sectorHealth: {
        outlook: "Positive",
        risk: "Moderate",
        growthPotential: "High"
      }
    };
  }

  async getMarketCapBreakdown(sector) {
    // In production, this would be an API call
    return {
      totalMarketCap: "1.2T",
      segments: [
        { name: "Large Cap (>50B)", value: "45%", marketCap: "540B" },
        { name: "Mid Cap (10B-50B)", value: "35%", marketCap: "420B" },
        { name: "Small Cap (<10B)", value: "20%", marketCap: "240B" }
      ],
      yearlyGrowth: "+8.5%",
      marketShare: "12.5%"  // % of total market
    };
  }
}

// Make it available globally
window.sectorData = new SectorData();