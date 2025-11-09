class MarketIntelligence {
    constructor() {
        this.marketSummaryEl = document.querySelector('.market-summary');
        this.sentimentMeterEl = document.querySelector('.market-sentiment-meter');
        this.initializeMarketPulse();
    }

    async initializeMarketPulse() {
        try {
            // Get sector data from existing endpoint
            const response = await fetch('/api/sectors');
            const sectorData = await response.json();
            
            // Calculate overall market sentiment
            const sentiment = this.calculateMarketSentiment(sectorData);
            
            // Update UI
            this.updateMarketPulse(sentiment, sectorData);
        } catch (error) {
            console.error('Error initializing market pulse:', error);
            this.showError('Failed to load market data');
        }
    }

    calculateMarketSentiment(sectorData) {
        // Calculate weighted sentiment based on market cap and momentum
        let totalWeight = 0;
        let weightedSentiment = 0;

        sectorData.forEach(sector => {
            const weight = sector.marketCap || 1;
            const sectorSentiment = sector.momentum || 0;
            
            totalWeight += weight;
            weightedSentiment += (sectorSentiment * weight);
        });

        return totalWeight ? (weightedSentiment / totalWeight) : 0;
    }

    updateMarketPulse(sentiment, sectorData) {
        // Update sentiment meter
        this.updateSentimentMeter(sentiment);

        // Update market summary
        const summary = this.generateMarketSummary(sentiment, sectorData);
        if (this.marketSummaryEl) {
            this.marketSummaryEl.innerHTML = summary;
        }
    }

    updateSentimentMeter(sentiment) {
        if (!this.sentimentMeterEl) return;

        // Create a D3.js gauge chart
        const width = this.sentimentMeterEl.offsetWidth;
        const height = 120;
        
        // Clear previous content
        this.sentimentMeterEl.innerHTML = '';

        // Create SVG
        const svg = d3.select(this.sentimentMeterEl)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Add gauge implementation here
        // This is a placeholder for the D3.js gauge chart
        const gauge = svg.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

        // Add background arc
        const arc = d3.arc()
            .innerRadius(35)
            .outerRadius(45)
            .startAngle(-Math.PI/2)
            .endAngle(Math.PI/2);

        gauge.append('path')
            .attr('d', arc)
            .style('fill', '#ddd');

        // Add value arc
        const valueArc = d3.arc()
            .innerRadius(35)
            .outerRadius(45)
            .startAngle(-Math.PI/2)
            .endAngle(-Math.PI/2 + (Math.PI * (sentiment + 1)/2));

        gauge.append('path')
            .attr('d', valueArc)
            .style('fill', this.getSentimentColor(sentiment));

        // Add value text
        gauge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .style('font-size', '24px')
            .style('fill', '#fff')
            .text(`${(sentiment * 100).toFixed(1)}%`);
    }

    generateMarketSummary(sentiment, sectorData) {
        const sentimentLevel = this.getSentimentLevel(sentiment);
        const topSectors = this.getTopPerformingSectors(sectorData, 3);
        const bottomSectors = this.getBottomPerformingSectors(sectorData, 3);

        return `
            <div class="market-summary-content">
                <div class="sentiment-status ${sentimentLevel.class}">
                    <h3>Market Sentiment: ${sentimentLevel.label}</h3>
                    <p>${this.generateSentimentDescription(sentiment, topSectors[0])}</p>
                </div>
                <div class="sector-performance">
                    <div class="top-sectors">
                        <h4>Top Performing Sectors</h4>
                        ${this.generateSectorList(topSectors)}
                    </div>
                    <div class="bottom-sectors">
                        <h4>Underperforming Sectors</h4>
                        ${this.generateSectorList(bottomSectors)}
                    </div>
                </div>
            </div>
        `;
    }

    getSentimentLevel(sentiment) {
        if (sentiment >= 0.5) return { label: 'Very Bullish', class: 'very-positive' };
        if (sentiment > 0.2) return { label: 'Bullish', class: 'positive' };
        if (sentiment >= -0.2) return { label: 'Neutral', class: 'neutral' };
        if (sentiment >= -0.5) return { label: 'Bearish', class: 'negative' };
        return { label: 'Very Bearish', class: 'very-negative' };
    }

    getSentimentColor(sentiment) {
        if (sentiment >= 0.5) return '#00ff87';
        if (sentiment > 0.2) return '#7bff87';
        if (sentiment >= -0.2) return '#ffeb3b';
        if (sentiment >= -0.5) return '#ff7043';
        return '#ff1744';
    }

    getTopPerformingSectors(sectorData, limit) {
        return [...sectorData]
            .sort((a, b) => (b.momentum || 0) - (a.momentum || 0))
            .slice(0, limit);
    }

    getBottomPerformingSectors(sectorData, limit) {
        return [...sectorData]
            .sort((a, b) => (a.momentum || 0) - (b.momentum || 0))
            .slice(0, limit);
    }

    generateSectorList(sectors) {
        return `
            <ul class="sector-list">
                ${sectors.map(sector => `
                    <li>
                        <span class="sector-name">${sector.name}</span>
                        <span class="sector-momentum ${sector.momentum >= 0 ? 'positive' : 'negative'}">
                            ${sector.momentum >= 0 ? '▲' : '▼'} ${Math.abs(sector.momentum).toFixed(2)}%
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    generateSentimentDescription(sentiment, topSector) {
        const sentimentLevel = this.getSentimentLevel(sentiment);
        const marketStrength = sentiment >= 0 ? 'strength' : 'weakness';
        
        return `The market is showing ${sentimentLevel.label.toLowerCase()} signals with ${
            Math.abs(sentiment * 100).toFixed(1)}% ${marketStrength}. ${
            topSector ? `${topSector.name} sector is leading the market.` : ''
        }`;
    }

    showError(message) {
        if (this.marketSummaryEl) {
            this.marketSummaryEl.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize Market Intelligence
const marketIntelligence = new MarketIntelligence();