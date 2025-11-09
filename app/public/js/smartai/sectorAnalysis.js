class SectorAnalysis {
    constructor() {
        this.heatmapEl = document.querySelector('.sector-heatmap');
        this.insightsEl = document.querySelector('.sector-insights');
        this.metricSelect = document.getElementById('sectorMetric');
        this.setupEventListeners();
        this.initializeHeatmap();
    }

    setupEventListeners() {
        if (this.metricSelect) {
            this.metricSelect.addEventListener('change', () => {
                this.updateHeatmap(this.currentData);
            });
        }
    }

    async initializeHeatmap() {
        try {
            const response = await fetch('/api/sectors');
            this.currentData = await response.json();
            this.updateHeatmap(this.currentData);
            this.updateInsights(this.currentData);
        } catch (error) {
            console.error('Error initializing sector heatmap:', error);
            this.showError('Failed to load sector data');
        }
    }

    updateHeatmap(sectorData) {
        if (!this.heatmapEl || !sectorData) return;

        const metric = this.metricSelect ? this.metricSelect.value : 'momentum';
        const values = sectorData.map(sector => sector[metric] || 0);
        const maxAbs = Math.max(...values.map(Math.abs));

        // Clear previous content
        this.heatmapEl.innerHTML = '';

        // Create grid layout
        const grid = document.createElement('div');
        grid.className = 'sector-grid';
        
        sectorData.forEach(sector => {
            const value = sector[metric] || 0;
            const cell = this.createSectorCell(sector, value, maxAbs);
            grid.appendChild(cell);
        });

        this.heatmapEl.appendChild(grid);
        this.addHeatmapLegend();
    }

    createSectorCell(sector, value, maxValue) {
        const cell = document.createElement('div');
        cell.className = 'sector-cell';
        
        const intensity = Math.abs(value) / maxValue;
        const color = value >= 0 ? 
            this.interpolateColor('#e8f5e9', '#00c853', intensity) :
            this.interpolateColor('#ffebee', '#d50000', intensity);

        cell.style.backgroundColor = color;
        cell.style.color = intensity > 0.5 ? '#fff' : '#000';

        cell.innerHTML = `
            <div class="sector-name">${sector.name}</div>
            <div class="sector-value">${value.toFixed(2)}%</div>
            <div class="sector-market-cap">MCap: ${this.formatMarketCap(sector.marketCap)}B</div>
        `;

        cell.addEventListener('click', () => this.showSectorDetails(sector));
        return cell;
    }

    interpolateColor(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        
        return `rgb(${r},${g},${b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    formatMarketCap(value) {
        return (value / 1e9).toFixed(1); // Convert to billions
    }

    addHeatmapLegend() {
        const legend = document.createElement('div');
        legend.className = 'heatmap-legend';
        
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-color" style="background: #d50000"></div>
                <span>Strong Negative</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #ffebee"></div>
                <span>Weak Negative</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #e8f5e9"></div>
                <span>Weak Positive</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #00c853"></div>
                <span>Strong Positive</span>
            </div>
        `;

        this.heatmapEl.appendChild(legend);
    }

    async showSectorDetails(sector) {
        try {
            // Fetch detailed sector data
            const [topMovers, news] = await Promise.all([
                fetch(`/api/sector/${sector.id}/top-movers`).then(r => r.json()),
                fetch(`/api/sector/${sector.id}/news`).then(r => r.json())
            ]);

            // Update insights panel
            if (this.insightsEl) {
                this.insightsEl.innerHTML = `
                    <div class="sector-detail">
                        <h3>${sector.name}</h3>
                        <div class="sector-metrics">
                            <div class="metric">
                                <span class="label">Market Cap</span>
                                <span class="value">${this.formatMarketCap(sector.marketCap)}B</span>
                            </div>
                            <div class="metric">
                                <span class="label">Momentum</span>
                                <span class="value ${sector.momentum >= 0 ? 'positive' : 'negative'}">
                                    ${sector.momentum.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        
                        <div class="top-movers">
                            <h4>Top Movers</h4>
                            ${this.generateTopMoversHtml(topMovers)}
                        </div>
                        
                        <div class="sector-news">
                            <h4>Latest News</h4>
                            ${this.generateNewsHtml(news)}
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching sector details:', error);
            this.showError('Failed to load sector details');
        }
    }

    generateTopMoversHtml(movers) {
        return `
            <div class="movers-list">
                ${movers.map(stock => `
                    <div class="mover-item">
                        <span class="stock-symbol">${stock.symbol}</span>
                        <span class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                            ${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)}%
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateNewsHtml(news) {
        return `
            <div class="news-list">
                ${news.map(item => `
                    <div class="news-item">
                        <h5>${item.title}</h5>
                        <p>${item.summary}</p>
                        <span class="news-date">${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showError(message) {
        if (this.heatmapEl) {
            this.heatmapEl.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize Sector Analysis
const sectorAnalysis = new SectorAnalysis();