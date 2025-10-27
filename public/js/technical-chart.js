// Technical Chart Class using TradingView
class TechnicalChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widget = null;
    this.currentSymbol = null;
    this.initializeChart();
  }

  initializeChart() {
    const widgetOptions = {
      symbol: "PSX:KSE100",  // Default to KSE100 index
      interval: 'D',  // Default to daily timeframe
      timezone: "Asia/Karachi",
      theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      container_id: "tradingview_container",
      studies: [
        "MASimple@tv-basicstudies",  // Simple Moving Average
        "RSI@tv-basicstudies",       // Relative Strength Index
        "MACD@tv-basicstudies"       // MACD
      ],
      width: "100%",
      height: 600
    };

    this.widget = new TradingView.widget(widgetOptions);
    
    // Listen for theme changes
    window.addEventListener('themeChange', (e) => {
      this.updateTheme(e.detail.theme);
    });
  }

  updateChart(symbol) {
    if (!symbol) return;
    
    // Format symbol for TradingView (PSX exchange)
    const formattedSymbol = `PSX:${symbol}`;
    this.currentSymbol = formattedSymbol;
    
    // Update the widget with new symbol
    if (this.widget && this.widget.chart) {
      this.widget.chart().setSymbol(formattedSymbol);
    }
  }

  updateTheme(theme) {
    // Update TradingView widget theme
    if (this.widget && this.widget.chart) {
      this.widget.chart().setTheme(theme === 'dark' ? 'dark' : 'light');
    }
  }

  // Technical Indicators Calculations
  calculateSMA(data, period) {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
        continue;
      }
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  calculateEMA(data, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);
    let previousEMA = data[0];

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(data[0]);
        continue;
      }
      const currentEMA = (data[i] - previousEMA) * multiplier + previousEMA;
      ema.push(currentEMA);
      previousEMA = currentEMA;
    }
    return ema;
  }

  calculateRSI(data, period = 14) {
    const rsi = [];
    let gains = [];
    let losses = [];

    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(Math.max(0, change));
      losses.push(Math.max(0, -change));
    }

    // Calculate RSI
    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push(null);
        continue;
      }

      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }

    return rsi;
  }

  calculateMACD(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const shortEMA = this.calculateEMA(data, shortPeriod);
    const longEMA = this.calculateEMA(data, longPeriod);
    const macdLine = shortEMA.map((short, i) => short - longEMA[i]);
    const signalLine = this.calculateEMA(macdLine, signalPeriod);

    return {
      macdLine,
      signalLine
    };
  }

  toggleIndicatorsPanel() {
    if (!this.indicatorsPanel) {
      this.createIndicatorsPanel();
    }
    this.indicatorsPanel.classList.toggle('active');
  }

  createIndicatorsPanel() {
    this.indicatorsPanel = document.createElement('div');
    this.indicatorsPanel.className = 'indicators-panel';
    this.indicatorsPanel.innerHTML = `
      <h3>Technical Indicators</h3>
      <div class="indicator-controls">
        <label>
          <input type="checkbox" ${this.indicators.sma ? 'checked' : ''} data-indicator="sma">
          SMA (20)
        </label>
        <label>
          <input type="checkbox" ${this.indicators.ema ? 'checked' : ''} data-indicator="ema">
          EMA (20)
        </label>
        <label>
          <input type="checkbox" ${this.indicators.rsi ? 'checked' : ''} data-indicator="rsi">
          RSI (14)
        </label>
        <label>
          <input type="checkbox" ${this.indicators.macd ? 'checked' : ''} data-indicator="macd">
          MACD
        </label>
        <label>
          <input type="checkbox" ${this.indicators.volume ? 'checked' : ''} data-indicator="volume">
          Volume
        </label>
      </div>
      <div class="chart-type">
        <label>
          <input type="radio" name="chartType" value="candlestick" ${this.chartType === 'candlestick' ? 'checked' : ''}>
          Candlestick
        </label>
        <label>
          <input type="radio" name="chartType" value="line" ${this.chartType === 'line' ? 'checked' : ''}>
          Line
        </label>
      </div>
    `;

    this.container.parentNode.appendChild(this.indicatorsPanel);

    // Add event listeners
    this.indicatorsPanel.addEventListener('change', (e) => {
      if (e.target.dataset.indicator) {
        this.indicators[e.target.dataset.indicator] = e.target.checked;
      } else if (e.target.name === 'chartType') {
        this.chartType = e.target.value;
      }
      this.updateChart(this.currentSymbol);
    });
  }

  showError(message) {
    if (!this.errorElement) {
      this.errorElement = document.createElement('div');
      this.errorElement.className = 'chart-error';
      this.container.appendChild(this.errorElement);
    }
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
    setTimeout(() => {
      this.errorElement.style.display = 'none';
    }, 3000);
  }

  handleChartClick(event) {
    // Handle chart click events
    console.log('Chart clicked:', event);
  }

  handleChartHover(event) {
    // Handle chart hover events
    console.log('Chart hover:', event);
  }
}

// Export for use in other modules
window.TechnicalChart = TechnicalChart;