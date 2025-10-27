class NewsAnalysis {
    constructor() {
        this.newsFeed = document.querySelector('.news-feed');
    }

    async fetchNews(type, identifier = '') {
        try {
            let url = '/api/smartai/';
            switch(type) {
                case 'market':
                    url += 'market/news';
                    break;
                case 'company':
                    url += `company/${identifier}/news`;
                    break;
                case 'sector':
                    url += `sector/${identifier}/news`;
                    break;
            }

            const response = await fetch(url);
            const data = await response.json();
            this.displayNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
            this.showError('Failed to fetch news data');
        }
    }

    displayNews(newsData) {
        if (!this.newsFeed) return;
        
        this.newsFeed.innerHTML = '';
        
        newsData.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            const sentimentClass = this.getSentimentClass(item.sentiment.sentiment);
            
            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p class="${sentimentClass}">
                    Sentiment: ${item.sentiment.sentiment} 
                    (Score: ${item.sentiment.score.toFixed(2)})
                </p>
                <p>Published: ${new Date(item.publishedAt).toLocaleString()}</p>
                <a href="${item.url}" target="_blank">Read More</a>
            `;
            
            this.newsFeed.appendChild(newsItem);
        });
    }

    getSentimentClass(sentiment) {
        if (sentiment.includes('Positive')) return 'sentiment-positive';
        if (sentiment.includes('Negative')) return 'sentiment-negative';
        return 'sentiment-neutral';
    }

    showError(message) {
        if (!this.newsFeed) return;
        
        this.newsFeed.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize News Analysis
const newsAnalysis = new NewsAnalysis();
// Fetch market news by default
newsAnalysis.fetchNews('market');