// KSE-100 Index Heatmap Implementation

class KSEHeatmap {
  constructor() {
    this.currentPeriod = '1D';
    this.container = document.getElementById('kseHeatmap');
    this.timeframeButtons = document.querySelectorAll('.timeframe-btn');
    this.setupEventListeners();
    this.fetchData('1D'); // Initial load with 1D timeframe
  }

  setupEventListeners() {
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
          marketCap: Math.floor(Math.random() * 1000) + 100 // Random market cap for box sizing
        }));

        resolve(data);
      }, 1000);
    });
  }

  renderHeatmap(data) {
    this.container.innerHTML = ''; // Clear previous content
    
    // Sort by market cap for treemap-like layout
    data.sort((a, b) => b.marketCap - a.marketCap);
    
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
      
      // Size box based on market cap
      const size = Math.max(100, Math.min(200, sector.marketCap / 5));
      box.style.width = `${size}px`;
      box.style.height = `${size}px`;
      
      box.innerHTML = `
        <div class="sector-name">${sector.name}</div>
        <div class="sector-change">${sector.change}%</div>
      `;
      
      this.container.appendChild(box);
    });
  }
}

// Initialize heatmap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kseHeatmap = new KSEHeatmap();
});