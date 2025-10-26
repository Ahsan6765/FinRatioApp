const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

class StockDataService {
  constructor() {
    this.baseUrl = 'https://stockanalysis.com/list/pakistan-stock-exchange/';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchWithCache(url, scraper) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await scraper();
    this.cache.set(url, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  async getStockList() {
    return this.fetchWithCache(this.baseUrl, async () => {
      const browser = await puppeteer.launch({ headless: 'new' });
      try {
        const page = await browser.newPage();
        await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
        
        // Wait for the table to load
        await page.waitForSelector('table');
        
        const data = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll('table tr')).slice(1); // Skip header
          return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return {
              symbol: cells[0]?.textContent.trim(),
              name: cells[1]?.textContent.trim(),
              price: cells[2]?.textContent.trim(),
              change: cells[3]?.textContent.trim(),
              changePct: cells[4]?.textContent.trim(),
              volume: cells[5]?.textContent.trim(),
              marketCap: cells[6]?.textContent.trim()
            };
          });
        });

        return data;
      } finally {
        await browser.close();
      }
    });
  }

  async getSectorData() {
    const stocks = await this.getStockList();
    
    // Group stocks by sector (using a simplified sector mapping)
    const sectors = {
      'Banking': stocks.filter(s => s.name.toLowerCase().includes('bank')),
      'Energy': stocks.filter(s => 
        s.name.toLowerCase().includes('oil') || 
        s.name.toLowerCase().includes('gas') ||
        s.name.toLowerCase().includes('power')
      ),
      'Technology': stocks.filter(s => 
        s.name.toLowerCase().includes('tech') || 
        s.name.toLowerCase().includes('systems')
      ),
      'Manufacturing': stocks.filter(s => 
        s.name.toLowerCase().includes('cement') || 
        s.name.toLowerCase().includes('steel')
      ),
      'Others': stocks // Remaining stocks
    };

    // Calculate sector metrics
    return Object.entries(sectors).map(([sectorName, stocks]) => {
      const totalMarketCap = stocks.reduce((sum, stock) => {
        const cap = parseFloat(stock.marketCap.replace(/[^\d.-]/g, '')) || 0;
        return sum + cap;
      }, 0);

      const avgChange = stocks.reduce((sum, stock) => {
        const change = parseFloat(stock.changePct) || 0;
        return sum + change;
      }, 0) / stocks.length;

      const volume = stocks.reduce((sum, stock) => {
        const vol = parseFloat(stock.volume.replace(/[^\d.-]/g, '')) || 0;
        return sum + vol;
      }, 0);

      return {
        name: sectorName,
        change: avgChange.toFixed(2),
        marketCap: totalMarketCap.toFixed(2),
        volume: volume.toFixed(2),
        stocks: stocks.map(s => ({
          symbol: s.symbol,
          name: s.name,
          price: s.price,
          change: s.changePct,
          volume: s.volume
        }))
      };
    });
  }

  async getTopMovers(sectorName) {
    const stocks = await this.getStockList();
    const sectorStocks = this.filterStocksBySector(stocks, sectorName);
    
    // Sort by percentage change
    const sortedStocks = [...sectorStocks].sort((a, b) => {
      return parseFloat(b.changePct) - parseFloat(a.changePct);
    });

    return {
      gainers: sortedStocks.slice(0, 3),
      losers: sortedStocks.reverse().slice(0, 3)
    };
  }

  async getSectorNews(sectorName) {
    // Since we don't have direct news access, we could potentially scrape from business recorder or dawn
    // For now, returning mock news
    return [
      {
        title: `${sectorName} Sector Update - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        source: 'Stock Analysis',
        url: this.baseUrl,
        summary: `Latest market update for ${sectorName} sector stocks.`
      }
    ];
  }

  filterStocksBySector(stocks, sectorName) {
    // Simple sector filtering logic - can be enhanced with better mapping
    const sectorKeywords = {
      'Banking': ['bank'],
      'Energy': ['oil', 'gas', 'power'],
      'Technology': ['tech', 'systems'],
      'Manufacturing': ['cement', 'steel']
    };

    const keywords = sectorKeywords[sectorName] || [];
    return stocks.filter(stock => 
      keywords.some(keyword => stock.name.toLowerCase().includes(keyword))
    );
  }
}

module.exports = new StockDataService();