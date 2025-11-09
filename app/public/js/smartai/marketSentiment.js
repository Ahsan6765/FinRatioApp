class MarketSentiment {
    constructor() {
        this.sentimentGauge = document.querySelector('.sentiment-gauge');
        this.sentimentSummary = document.querySelector('.sentiment-summary');
        this.setupGauge();
        this.startSentimentTracking();
    }

    setupGauge() {
        if (!this.sentimentGauge) return;
        
        // Initialize D3.js gauge chart here
        // This is a placeholder - you'll need to add D3.js and implement the gauge
        this.sentimentGauge.innerHTML = `
            <div class="placeholder-gauge">
                <p>Sentiment Gauge Placeholder</p>
                <p>(D3.js implementation required)</p>
            </div>
        `;
    }

    async startSentimentTracking() {
        try {
            const response = await fetch('/api/smartai/market/news');
            const data = await response.json();
            this.updateSentiment(data);
        } catch (error) {
            console.error('Error fetching market sentiment:', error);
            this.showError('Failed to fetch market sentiment');
        }
    }

    updateSentiment(data) {
        if (!this.sentimentSummary) return;

        // Calculate overall market sentiment
        const sentimentScores = data.map(item => item.sentiment.score);
        const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
        
        // Update gauge (placeholder)
        this.updateGauge(averageSentiment);

        // Update summary
        this.sentimentSummary.innerHTML = `
            <div class="sentiment-summary-content">
                <h3>Market Mood: <span class="${this.getSentimentClass(averageSentiment)}">
                    ${this.getMarketMood(averageSentiment)}
                </span></h3>
                <p>Based on analysis of ${data.length} recent market news items</p>
                <p>Last updated: ${new Date().toLocaleString()}</p>
            </div>
        `;
    }

    updateGauge(sentiment) {
        // Placeholder for D3.js gauge update
        if (!this.sentimentGauge) return;
        
        this.sentimentGauge.innerHTML = `
            <div class="placeholder-gauge ${this.getSentimentClass(sentiment)}">
                <p>Sentiment Score: ${sentiment.toFixed(2)}</p>
                <p>${this.getMarketMood(sentiment)}</p>
            </div>
        `;
    }

    getMarketMood(score) {
        if (score <= -0.5) return 'Very Bearish';
        if (score < 0) return 'Bearish';
        if (score === 0) return 'Neutral';
        if (score <= 0.5) return 'Bullish';
        return 'Very Bullish';
    }

    getSentimentClass(score) {
        if (score > 0) return 'sentiment-positive';
        if (score < 0) return 'sentiment-negative';
        return 'sentiment-neutral';
    }

    showError(message) {
        if (!this.sentimentSummary) return;
        
        this.sentimentSummary.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize Market Sentiment
const marketSentiment = new MarketSentiment();