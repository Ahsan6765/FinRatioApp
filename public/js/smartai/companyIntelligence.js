class CompanyIntelligence {
    constructor() {
        this.companyAnalysis = document.querySelector('.company-analysis');
        this.searchInput = document.getElementById('company-search-input');
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchButton = document.querySelector('.company-search button');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchCompany());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCompany();
                }
            });
        }
    }

    async searchCompany() {
        if (!this.searchInput || !this.companyAnalysis) return;
        
        const symbol = this.searchInput.value.trim().toUpperCase();
        if (!symbol) {
            this.showError('Please enter a company symbol');
            return;
        }

        try {
            const response = await fetch(`/api/smartai/company/${symbol}/news`);
            const data = await response.json();
            this.displayCompanyAnalysis(symbol, data);
        } catch (error) {
            console.error('Error analyzing company:', error);
            this.showError('Failed to analyze company data');
        }
    }

    displayCompanyAnalysis(symbol, data) {
        if (!this.companyAnalysis) return;
        
        // Calculate overall sentiment
        const sentimentScores = data.map(item => item.sentiment.score);
        const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
        
        this.companyAnalysis.innerHTML = `
            <div class="company-summary">
                <h3>${symbol} Analysis</h3>
                <p class="${this.getSentimentClass(averageSentiment)}">
                    Overall Sentiment: ${this.getOverallSentiment(averageSentiment)}
                </p>
            </div>
            <div class="company-news">
                <h4>Recent News Impact</h4>
                ${this.generateNewsHtml(data)}
            </div>
        `;
    }

    generateNewsHtml(news) {
        return news.map(item => `
            <div class="news-impact-item">
                <p class="news-title">${item.title}</p>
                <p class="${this.getSentimentClass(item.sentiment.score)}">
                    Impact: ${item.sentiment.sentiment}
                </p>
                <p class="news-date">
                    ${new Date(item.publishedAt).toLocaleDateString()}
                </p>
            </div>
        `).join('');
    }

    getOverallSentiment(score) {
        if (score <= -0.5) return 'Very Negative';
        if (score < 0) return 'Negative';
        if (score === 0) return 'Neutral';
        if (score <= 0.5) return 'Positive';
        return 'Very Positive';
    }

    getSentimentClass(score) {
        if (score > 0) return 'sentiment-positive';
        if (score < 0) return 'sentiment-negative';
        return 'sentiment-neutral';
    }

    showError(message) {
        if (!this.companyAnalysis) return;
        
        this.companyAnalysis.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize Company Intelligence
const companyIntelligence = new CompanyIntelligence();