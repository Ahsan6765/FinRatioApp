// KSE-100 Index Heatmap Implementation with Enhanced Features

class KSEHeatmap {
  // Sector metrics for comparison
  static metrics = {
    pe: 'P/E Ratio',
    pb: 'P/B Ratio',
    dy: 'Dividend Yield',
    mc: 'Market Cap (B)',
    vol: 'Volume (M)',
    beta: 'Beta'
  };
  constructor() {
    this.currentPeriod = '1D';
    this.container = document.getElementById('kseHeatmap');
    this.timeframeButtons = document.querySelectorAll('.timeframe-btn');
    this.selectedMetric = 'mc'; // Default metric for box sizing
    this.setupEventListeners();
    this.setupMetricSelector();
    this.fetchData('1D'); // Initial load with 1D timeframe
  }

  setupEventListeners() {
    // Timeframe button events
    this.timeframeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        this.timeframeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Fetch new data for selected period
        const period = btn.dataset.period;
        this.currentPeriod = period;
        this.fetchData(period);
      });
    });

    // Modal close event
    document.getElementById('closeModal').addEventListener('click', () => {
      document.getElementById('sectorModal').classList.remove('active');
    });

    // Close modal on outside click
    document.getElementById('sectorModal').addEventListener('click', (e) => {
      if (e.target.id === 'sectorModal') {
        e.target.classList.remove('active');
      }
    });
  }

  async fetchData(period) {
    try {
      // Show loading state
      this.container.innerHTML = '<div class="loading">Loading KSE-100 data...</div>';
      
      // In production, replace this with actual API call to PSX data provider
      // For demo, we'll simulate data
      const data = await this.getDemoData(period);
      this.renderHeatmap(data);
    } catch (error) {
      this.container.innerHTML = `
        <div class="error">
          Unable to load KSE-100 data. 
          <button onclick="window.kseHeatmap.fetchData('${period}')">Retry</button>
        </div>`;
    }
  }

  setupMetricSelector() {
    const selector = document.getElementById('metricSelector');
    Object.entries(KSEHeatmap.metrics).forEach(([key, label]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = label;
      selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
      this.selectedMetric = e.target.value;
      this.renderHeatmap(this.lastData); // Re-render with new metric
    });
  }

  getDemoData(period) {
    // Simulate API response delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate mock data for demonstration
        const sectors = [
          'Commercial Banks', 'Cement', 'Oil & Gas', 'Fertilizer',
          'Power Generation', 'Technology', 'Automobile', 'Textile'
        ];

        const data = sectors.map(sector => ({
          name: sector,
          change: ((Math.random() * 10) - 5).toFixed(2), // Random change between -5% and +5%
          marketCap: Math.floor(Math.random() * 1000) + 100, // Random market cap
          pe: (Math.random() * 20 + 5).toFixed(1),
          pb: (Math.random() * 3 + 0.5).toFixed(2),
          dy: (Math.random() * 8).toFixed(2),
          vol: Math.floor(Math.random() * 50 + 1),
          beta: (Math.random() * 2 + 0.2).toFixed(2),
          // Historical data for charts
          historical: {
            dates: [...Array(30)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - i));
              return d.toISOString().split('T')[0];
            }),
            prices: [...Array(30)].map(() => Math.random() * 100 + 50),
            volume: [...Array(30)].map(() => Math.random() * 1000000)
          },
          trend: Math.random() > 0.5 ? 'up' : 'down',
          momentum: (Math.random() * 100).toFixed(0)
        }));

        resolve(data);
      }, 1000);
    });
  }

  renderHeatmap(data) {
    this.container.innerHTML = ''; // Clear previous content
    this.lastData = data; // Store for metric changes
    
    // Sort by selected metric
    data.sort((a, b) => b[this.selectedMetric] - a[this.selectedMetric]);
    
    data.forEach(sector => {
      const box = document.createElement('div');
      box.className = 'heatmap-box';
      
      // Add color class based on change percentage
      const change = parseFloat(sector.change);
      if (change <= -5) box.classList.add('very-negative');
      else if (change <= -2) box.classList.add('negative');
      else if (change <= 2) box.classList.add('neutral');
      else if (change <= 5) box.classList.add('positive');
      else box.classList.add('very-positive');
      
      // Size box based on selected metric
      const value = sector[this.selectedMetric];
      const maxValue = Math.max(...data.map(s => s[this.selectedMetric]));
      const size = Math.max(120, Math.min(250, (value / maxValue) * 250));
      box.style.width = `${size}px`;
      box.style.height = `${size}px`;
      
      // Add trend indicator and momentum
      const trendIcon = sector.trend === 'up' ? '↗' : '↘';
      const trendClass = sector.trend === 'up' ? 'trend-up' : 'trend-down';
      
      box.innerHTML = `
        <div class="sector-name">${sector.name}</div>
        <div class="sector-change ${trendClass}">
          ${sector.change}% ${trendIcon}
        </div>
        <div class="sector-metrics">
          <span class="metric">${KSEHeatmap.metrics[this.selectedMetric]}: ${sector[this.selectedMetric]}</span>
          <span class="momentum">Momentum: ${sector.momentum}</span>
        </div>
      `;
      
      // Add click handler for sector details
      box.addEventListener('click', () => this.showSectorDetails(sector));
      
      this.container.appendChild(box);
    });
  }

  showSectorDetails(sector) {
    const modal = document.getElementById('sectorModal');
    const content = document.getElementById('sectorDetails');
    
    content.innerHTML = `
      <h2>${sector.name}</h2>
      <div class="sector-summary">
        <div class="metric-grid">
          <div class="metric-item">
            <label>Change</label>
            <span class="${sector.trend}-trend">${sector.change}%</span>
          </div>
          <div class="metric-item">
            <label>P/E Ratio</label>
            <span>${sector.pe}</span>
          </div>
          <div class="metric-item">
            <label>P/B Ratio</label>
            <span>${sector.pb}</span>
          </div>
          <div class="metric-item">
            <label>Dividend Yield</label>
            <span>${sector.dy}%</span>
          </div>
          <div class="metric-item">
            <label>Market Cap (B)</label>
            <span>${sector.marketCap}</span>
          </div>
          <div class="metric-item">
            <label>Volume (M)</label>
            <span>${sector.vol}</span>
          </div>
          <div class="metric-item">
            <label>Beta</label>
            <span>${sector.beta}</span>
          </div>
          <div class="metric-item">
            <label>Momentum</label>
            <span>${sector.momentum}</span>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="sectorChart" width="600" height="400"></canvas>
        </div>
      </div>
    `;

    modal.classList.add('active');
    
    // Create chart after modal is visible and canvas is in the DOM
    setTimeout(() => {
      // Update the chart with historical data
      if (!this.sectorChart) {
        this.sectorChart = new SectorChart('sectorChart');
      }
      this.sectorChart.createChart({
        dates: sector.historical.dates,
        prices: sector.historical.prices,
        volume: sector.historical.volume
      });
    }, 100);
  }
}

// Initialize heatmap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kseHeatmap = new KSEHeatmap();
});