const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

class AIAnalysisService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 30 * 60 * 1000; // 30 minutes cache
    }

    async analyzeSentiment(text) {
        const cacheKey = `sentiment-${text.substring(0, 50)}`; // Use first 50 chars as key
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheDuration) {
                return cachedData.data;
            }
            this.cache.delete(cacheKey);
        }

        try {
            const tokens = tokenizer.tokenize(text);
            const sentimentScore = sentiment.getSentiment(tokens);

            const analysis = {
                score: sentimentScore,
                sentiment: this.getSentimentCategory(sentimentScore),
                confidence: this.calculateConfidence(tokens.length)
            };

            this.cache.set(cacheKey, {
                timestamp: Date.now(),
                data: analysis
            });

            return analysis;
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            throw new Error('Failed to analyze sentiment');
        }
    }

    getSentimentCategory(score) {
        if (score <= -0.5) return 'Very Negative';
        if (score < 0) return 'Negative';
        if (score === 0) return 'Neutral';
        if (score <= 0.5) return 'Positive';
        return 'Very Positive';
    }

    calculateConfidence(tokenCount) {
        // Simple confidence calculation based on text length
        // More sophisticated methods can be implemented
        return Math.min(0.5 + (tokenCount / 100), 0.95);
    }

    async extractEntities(text) {
        // Basic entity extraction - can be enhanced with NER models
        const tokens = tokenizer.tokenize(text);
        const entities = new Set();
        
        // Simple company name detection (can be enhanced)
        const companyIndicators = ['Inc', 'Corp', 'Ltd', 'LLC', 'Limited'];
        
        for (let i = 0; i < tokens.length; i++) {
            if (companyIndicators.includes(tokens[i]) && i > 0) {
                entities.add(tokens[i-1] + ' ' + tokens[i]);
            }
        }

        return Array.from(entities);
    }

    async analyzeNewsImpact(newsData) {
        const results = [];
        
        for (const article of newsData.articles) {
            const sentiment = await this.analyzeSentiment(article.title + ' ' + article.description);
            const entities = await this.extractEntities(article.title + ' ' + article.description);
            
            results.push({
                title: article.title,
                publishedAt: article.publishedAt,
                sentiment,
                entities,
                url: article.url
            });
        }

        return results;
    }
}

module.exports = new AIAnalysisService();