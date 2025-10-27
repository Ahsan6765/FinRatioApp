const axios = require('axios');
const cheerio = require('cheerio');

class NewsService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 15 * 60 * 1000; // 15 minutes cache
        this.rateLimits = new Map();
        this.maxRequestsPerMinute = 10;
        this.sources = {
            marketWatch: 'https://www.marketwatch.com/latest-news',
            yahooFinance: 'https://finance.yahoo.com/news',
            reuters: 'https://www.reuters.com/markets',
            investingCom: 'https://www.investing.com/news/stock-market-news',
            seekingAlpha: 'https://seekingalpha.com/market-news'
        };
    }

    checkRateLimit(source) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Initialize or clean up old requests
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

    calculateRelevanceScore(article, query) {
        let score = 0;
        const queryTerms = query ? query.toLowerCase().split(/\s+/) : [];
        const content = (article.title + ' ' + article.description).toLowerCase();

        // Term frequency scoring
        queryTerms.forEach(term => {
            const regex = new RegExp(term, 'g');
            const matches = content.match(regex);
            if (matches) {
                score += matches.length;
            }
        });

        // Recency scoring (newer articles score higher)
        const age = Date.now() - new Date(article.publishedAt).getTime();
        const recencyScore = Math.max(0, 1 - (age / (24 * 60 * 60 * 1000))); // Full score if less than 24h old
        score += recencyScore * 3;

        // Source credibility scoring
        const credibilityScores = {
            'Reuters': 5,
            'MarketWatch': 4,
            'Yahoo Finance': 4,
            'Seeking Alpha': 3,
            'Investing.com': 3
        };
        score += credibilityScores[article.source] || 1;

        // Content length scoring
        score += Math.min(content.length / 1000, 2); // Up to 2 points for length

        return score;
    }

    async getFinancialNews(query) {
        const cacheKey = `news-${query}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheDuration) {
                return cachedData.data;
            }
            this.cache.delete(cacheKey);
        }

        try {
            // Fetch from multiple free sources with rate limiting
            const newsData = {
                articles: []
            };

            const NewsScrapers = require('./newsScrapers');
            
            // MarketWatch scraping
            try {
                this.checkRateLimit('MarketWatch');
                const marketWatchNews = await this.scrapeMarketWatch();
                newsData.articles.push(...marketWatchNews);
            } catch (error) {
                console.warn('Error fetching MarketWatch news:', error);
            }

            // Yahoo Finance scraping
            try {
                this.checkRateLimit('Yahoo Finance');
                const yahooNews = await this.scrapeYahooFinance();
                newsData.articles.push(...yahooNews);
            } catch (error) {
                console.warn('Error fetching Yahoo Finance news:', error);
            }

            // Reuters scraping
            try {
                this.checkRateLimit('Reuters');
                const reutersNews = await NewsScrapers.scrapeReuters();
                newsData.articles.push(...reutersNews);
            } catch (error) {
                console.warn('Error fetching Reuters news:', error);
            }

            // Investing.com scraping
            try {
                this.checkRateLimit('Investing.com');
                const investingNews = await NewsScrapers.scrapeInvestingCom();
                newsData.articles.push(...investingNews);
            } catch (error) {
                console.warn('Error fetching Investing.com news:', error);
            }

            // Seeking Alpha scraping
            try {
                this.checkRateLimit('Seeking Alpha');
                const seekingAlphaNews = await NewsScrapers.scrapeSeekingAlpha();
                newsData.articles.push(...seekingAlphaNews);
            } catch (error) {
                console.warn('Error fetching Seeking Alpha news:', error);
            }

            // Ensure we have at least some articles
            if (newsData.articles.length === 0) {
                throw new Error('No news articles could be fetched from any source');
            }

            // Remove duplicates based on title similarity
            newsData.articles = this.removeDuplicates(newsData.articles);

            // Calculate relevance scores and filter/sort based on query
            newsData.articles = newsData.articles.map(article => ({
                ...article,
                relevanceScore: this.calculateRelevanceScore(article, query)
            }));

            // Filter by query if provided
            if (query) {
                const queryLower = query.toLowerCase();
                newsData.articles = newsData.articles.filter(article => 
                    article.title.toLowerCase().includes(queryLower) ||
                    article.description.toLowerCase().includes(queryLower)
                );
            }

            // Sort by relevance score and date
            newsData.articles.sort((a, b) => {
                if (Math.abs(b.relevanceScore - a.relevanceScore) > 0.5) {
                    return b.relevanceScore - a.relevanceScore;
                }
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            });

            // Cache the results
            this.cache.set(cacheKey, {
                timestamp: Date.now(),
                data: newsData
            });

            return newsData;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw new Error('Failed to fetch news data');
        }
    }

    async scrapeMarketWatch() {
        try {
            const response = await axios.get(this.sources.marketWatch);
            const $ = cheerio.load(response.data);
            const articles = [];

            $('.article__content').each((i, elem) => {
                const title = $(elem).find('.article__headline').text().trim();
                const description = $(elem).find('.article__summary').text().trim();
                const url = $(elem).find('a').attr('href');
                const publishedAt = new Date().toISOString(); // Use current date as fallback

                if (title && description) {
                    articles.push({
                        title,
                        description,
                        url,
                        publishedAt,
                        source: 'MarketWatch'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error('Error scraping MarketWatch:', error);
            return [];
        }
    }

    async scrapeYahooFinance() {
        try {
            const response = await axios.get(this.sources.yahooFinance);
            const $ = cheerio.load(response.data);
            const articles = [];

            $('li.js-stream-content').each((i, elem) => {
                const title = $(elem).find('h3').text().trim();
                const description = $(elem).find('p').text().trim();
                const url = 'https://finance.yahoo.com' + $(elem).find('a').attr('href');
                const publishedAt = new Date().toISOString(); // Use current date as fallback

                if (title && description) {
                    articles.push({
                        title,
                        description,
                        url,
                        publishedAt,
                        source: 'Yahoo Finance'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error('Error scraping Yahoo Finance:', error);
            return [];
        }
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

    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            // Create a simplified version of the title for comparison
            const simplifiedTitle = article.title
                .toLowerCase()
                .replace(/[^\w\s]/g, '') // Remove punctuation
                .replace(/\s+/g, ' ')    // Normalize whitespace
                .trim();
            
            // Calculate similarity with existing titles
            for (const existingTitle of seen) {
                if (this.calculateStringSimilarity(existingTitle, simplifiedTitle) > 0.8) {
                    return false; // Skip this article as it's too similar to an existing one
                }
            }
            
            seen.add(simplifiedTitle);
            return true;
        });
    }

    calculateStringSimilarity(str1, str2) {
        // Implement Levenshtein distance for string similarity
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }

        // Convert distance to similarity score (0 to 1)
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (track[str2.length][str1.length] / maxLength);
    }
}

module.exports = new NewsService();