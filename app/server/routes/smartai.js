const express = require('express');
const router = express.Router();
const newsService = require('../services/smartai/newsService');
const aiAnalysisService = require('../services/smartai/aiAnalysisService');

// Get analyzed news for a specific company
router.get('/company/:symbol/news', async (req, res) => {
    try {
        const newsData = await newsService.getCompanyNews(req.params.symbol);
        const analyzedNews = await aiAnalysisService.analyzeNewsImpact(newsData);
        res.json(analyzedNews);
    } catch (error) {
        console.error('Error fetching company news:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get analyzed sector news
router.get('/sector/:name/news', async (req, res) => {
    try {
        const newsData = await newsService.getSectorNews(req.params.name);
        const analyzedNews = await aiAnalysisService.analyzeNewsImpact(newsData);
        res.json(analyzedNews);
    } catch (error) {
        console.error('Error fetching sector news:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get analyzed market news
router.get('/market/news', async (req, res) => {
    try {
        const newsData = await newsService.getMarketNews();
        const analyzedNews = await aiAnalysisService.analyzeNewsImpact(newsData);
        res.json(analyzedNews);
    } catch (error) {
        console.error('Error fetching market news:', error);
        res.status(500).json({ error: error.message });
    }
});

// Analyze custom text
router.post('/analyze/text', express.json(), async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        const sentiment = await aiAnalysisService.analyzeSentiment(text);
        const entities = await aiAnalysisService.extractEntities(text);
        
        res.json({
            sentiment,
            entities
        });
    } catch (error) {
        console.error('Error analyzing text:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;