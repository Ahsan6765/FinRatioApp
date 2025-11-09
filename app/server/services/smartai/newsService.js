const axios = require('axios');
const Parser = require('rss-parser');
const rssParser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml,application/xml;q=0.9',
    }
});

class NewsService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 15 * 60 * 1000; // 15 minutes cache
        this.rateLimits = new Map();
        this.maxRequestsPerMinute = 10;

        // RSS feed URLs
        this.rssSources = {
            // Google News RSS feed for financial news
            googleNewsFinance: 'https://news.google.com/rss/search?q=finance+market+stocks&hl=en-US&gl=US&ceid=US:en',
            // Yahoo Finance RSS feed for market news
            yahooFinanceRSS: 'https://finance.yahoo.com/news/rssindex',
            // Google News top stories
            googleNewsTop: 'https://news.google.com/news/rss?hl=en-US&gl=US&ceid=US:en'
        };
    }

    checkRateLimit(source) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        if (!this.rateLimits.has(source)) {
            this.rateLimits.set(source, []);
        }
        
        let requests = this.rateLimits.get(source);
        requests = requests.filter(time => time > oneMinuteAgo);
        
        if (requests.length >= this.maxRequestsPerMinute) {
            throw new Error(`Rate limit exceeded for ${source}`);
        }
        
        requests.push(now);
        this.rateLimits.set(source, requests);
    }

    async getFinancialNews(query) {
        const cacheKey = `news-${query || 'general'}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheDuration) {
                return cachedData.data;
            }
            this.cache.delete(cacheKey);
        }

        try {
            const newsData = { articles: [] };
            const searchQuery = query ? 
                encodeURIComponent(query + ' financial OR market OR stocks') : 
                'finance+market+stocks';

            // Try Google News RSS with search query first (most reliable)
            try {
                const url = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;
                const feed = await this.fetchRSSFeed(url, 'Google News');
                
                if (feed && feed.length > 0) {
                    console.log('Successfully fetched Google News articles:', feed.length);
                    newsData.articles.push(...feed);
                }
            } catch (error) {
                console.error('Error fetching Google News:', error.message);
            }

            // If we don't have enough articles, try Yahoo Finance RSS
            if (newsData.articles.length < 10) {
                try {
                    const feed = await this.fetchRSSFeed(this.rssSources.yahooFinanceRSS, 'Yahoo Finance');
                    if (feed && feed.length > 0) {
                        console.log('Successfully fetched Yahoo Finance articles:', feed.length);
                        newsData.articles.push(...feed);
                    }
                } catch (error) {
                    console.error('Error fetching Yahoo Finance RSS:', error.message);
                }
            }

            // If we still don't have enough articles, try Google News top stories
            if (newsData.articles.length < 10) {
                try {
                    const feed = await this.fetchRSSFeed(this.rssSources.googleNewsTop, 'Google News');
                    if (feed && feed.length > 0) {
                        console.log('Successfully fetched Google News top stories:', feed.length);
                        newsData.articles.push(...feed);
                    }
                } catch (error) {
                    console.error('Error fetching Google News top stories:', error.message);
                }
            }

            // Filter and sort articles
            if (query) {
                newsData.articles = this.filterByQuery(newsData.articles, query);
            }

            // Remove duplicates and sort by date
            newsData.articles = this.removeDuplicates(newsData.articles);
            newsData.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

            // Cache the results
            this.cache.set(cacheKey, {
                timestamp: Date.now(),
                data: newsData
            });

            return newsData;

        } catch (error) {
            console.error('Error fetching financial news:', error);
            throw new Error('Failed to fetch news data');
        }
    }

    async fetchRSSFeed(url, source) {
        try {
            this.checkRateLimit(source);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/rss+xml,application/xml;q=0.9',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout: 10000,
                responseType: 'text'
            });

            const feed = await rssParser.parseString(response.data);
            
            return feed.items.map(item => ({
                title: item.title,
                description: item.contentSnippet || item.description || '',
                url: item.link,
                publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
                source: source
            }));
        } catch (error) {
            console.error(`Error fetching RSS feed from ${source}:`, error.message);
            return [];
        }
    }

    filterByQuery(articles, query) {
        const queryTerms = query.toLowerCase().split(/\s+/);
        return articles.filter(article => {
            const content = (article.title + ' ' + article.description).toLowerCase();
            return queryTerms.some(term => content.includes(term));
        });
    }

    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            const titleKey = article.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
            if (seen.has(titleKey)) return false;
            seen.add(titleKey);
            return true;
        });
    }

    async getCompanyNews(companySymbol) {
        return this.getFinancialNews(`${companySymbol} stock OR company news`);
    }

    async getSectorNews(sectorName) {
        return this.getFinancialNews(`${sectorName} sector market analysis`);
    }

    async getMarketNews() {
        return this.getFinancialNews('stock market financial news');
    }
}

module.exports = new NewsService();