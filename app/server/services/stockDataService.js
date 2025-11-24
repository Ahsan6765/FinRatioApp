const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const yahooFinance = require('yahoo-finance2');

class StockDataService {
  constructor() {
    this.baseUrl = 'https://stockanalysis.com/list/pakistan-stock-exchange/';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.fallbackStocks = [
      { symbol: 'OGDC', name: 'Oil & Gas Development Company Ltd', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'PPL', name: 'Pakistan Petroleum Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'UBL', name: 'United Bank Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'ENGRO', name: 'Engro Corporation Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'LUCK', name: 'Lucky Cement Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'HBL', name: 'Habib Bank Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'POL', name: 'Pakistan Oilfields Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'MCB', name: 'MCB Bank Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'PSO', name: 'Pakistan State Oil Company Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' },
      { symbol: 'HUBC', name: 'The Hub Power Company Limited', price: '0', change: '0', changePct: '0', volume: '0', marketCap: '0' }
    ];
  }

  async fetchWithCache(url, scraper) {
    try {
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
    } catch (error) {
      console.error('Cache fetch error:', error);
      throw error;
    }
  }

  async getStockList() {
    return this.fetchWithCache(this.baseUrl, async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080'
        ],
        defaultViewport: {
          width: 1920,
          height: 1080
        }
      });

      try {
        const page = await browser.newPage();

        // Set longer timeout and better error handling
        await page.setDefaultNavigationTimeout(60000); // 60 seconds
        await page.setDefaultTimeout(60000);

        // Add request interception to block unnecessary resources
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (
            req.resourceType() === 'image' ||
            req.resourceType() === 'stylesheet' ||
            req.resourceType() === 'font'
          ) {
            req.abort();
          } else {
            req.continue();
          }
        });

        await page.goto(this.baseUrl, {
          waitUntil: ['networkidle0', 'domcontentloaded'],
          timeout: 60000
        });

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
    try {
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

    } catch (error) {
      console.error('Error fetching real stock data, using fallback data:', error);

      // Use fallback data when scraping fails
      const sectors = {
        'Banking': this.fallbackStocks.filter(s => s.name.toLowerCase().includes('bank')),
        'Energy': this.fallbackStocks.filter(s =>
          s.name.toLowerCase().includes('oil') ||
          s.name.toLowerCase().includes('gas') ||
          s.name.toLowerCase().includes('power')
        ),
        'Technology': this.fallbackStocks.filter(s =>
          s.name.toLowerCase().includes('tech') ||
          s.name.toLowerCase().includes('systems')
        ),
        'Manufacturing': this.fallbackStocks.filter(s =>
          s.name.toLowerCase().includes('cement') ||
          s.name.toLowerCase().includes('steel')
        ),
        'Others': this.fallbackStocks
      };

      return Object.entries(sectors).map(([sectorName, stocks]) => ({
        name: sectorName,
        change: '0.00',
        marketCap: '0.00',
        volume: '0.00',
        stocks: stocks.map(s => ({
          symbol: s.symbol,
          name: s.name,
          price: s.price,
          change: s.changePct,
          volume: s.volume
        }))
      }));
    }
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

  async getTechnicalData(symbol, timeframe) {
    try {
      // Ensure symbol has .PA suffix for PSX stocks if not present
      const querySymbol = symbol.endsWith('.PA') ? symbol : `${symbol}.PA`;

      const queryOptions = { period1: '2023-01-01', interval: '1d' }; // Default options

      // Adjust interval based on timeframe
      if (timeframe === '1W') queryOptions.interval = '1wk';
      if (timeframe === '1M') queryOptions.interval = '1mo';

      const result = await yahooFinance.historical(querySymbol, queryOptions);

      // Format data for chart.js
      return result.map(quote => ({
        date: quote.date.toISOString().split('T')[0],
        open: quote.open,
        high: quote.high,
        low: quote.low,
        close: quote.close,
        volume: quote.volume
      }));
    } catch (error) {
      console.error(`Error fetching technical data for ${symbol}:`, error);
      throw new Error('Failed to fetch technical data.');
    }
  }
}

module.exports = new StockDataService();