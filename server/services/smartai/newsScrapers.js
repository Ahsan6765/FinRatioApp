const axios = require('axios');
const cheerio = require('cheerio');

class NewsScrapers {
    static async scrapeReuters() {
        try {
            const response = await axios.get('https://www.reuters.com/markets');
            const $ = cheerio.load(response.data);
            const articles = [];

            $('.story-card').each((i, elem) => {
                const title = $(elem).find('h3.story-card__heading__2mwx3').text().trim();
                const description = $(elem).find('p.story-card__description__27vd8').text().trim();
                const url = 'https://www.reuters.com' + $(elem).find('a').attr('href');
                const publishedAt = $(elem).find('time').attr('datetime') || new Date().toISOString();

                if (title && description) {
                    articles.push({
                        title,
                        description,
                        url,
                        publishedAt,
                        source: 'Reuters'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error('Error scraping Reuters:', error);
            return [];
        }
    }

    static async scrapeInvestingCom() {
        try {
            const response = await axios.get('https://www.investing.com/news/stock-market-news');
            const $ = cheerio.load(response.data);
            const articles = [];

            $('.articleItem').each((i, elem) => {
                const title = $(elem).find('.title').text().trim();
                const description = $(elem).find('.articleDetails').text().trim();
                const url = 'https://www.investing.com' + $(elem).find('a').attr('href');
                const publishedAt = $(elem).find('.date').attr('data-timestamp') 
                    ? new Date(parseInt($(elem).find('.date').attr('data-timestamp')) * 1000).toISOString()
                    : new Date().toISOString();

                if (title && description) {
                    articles.push({
                        title,
                        description,
                        url,
                        publishedAt,
                        source: 'Investing.com'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error('Error scraping Investing.com:', error);
            return [];
        }
    }

    static async scrapeSeekingAlpha() {
        try {
            const response = await axios.get('https://seekingalpha.com/market-news');
            const $ = cheerio.load(response.data);
            const articles = [];

            $('.mc-article-card').each((i, elem) => {
                const title = $(elem).find('.mc-article-title').text().trim();
                const description = $(elem).find('.mc-article-description').text().trim();
                const url = 'https://seekingalpha.com' + $(elem).find('a').attr('href');
                const publishedAt = $(elem).find('time').attr('datetime') || new Date().toISOString();

                if (title && description) {
                    articles.push({
                        title,
                        description,
                        url,
                        publishedAt,
                        source: 'Seeking Alpha'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error('Error scraping Seeking Alpha:', error);
            return [];
        }
    }
}

module.exports = NewsScrapers;