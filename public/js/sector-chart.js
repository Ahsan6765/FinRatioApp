// Sector Chart Implementation using Chart.js
class SectorChart {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chart = null;
  }

  createChart(sectorData) {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      console.error('Canvas element not found:', this.canvasId);
      return;
    }

    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sectorData.dates,
        datasets: [{
          label: 'Price',
          data: sectorData.prices,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Volume',
          data: sectorData.volume,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'volume'
        }]
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          volume: {
            type: 'linear',
            position: 'right',
            grid: {
              display: false
            }
          }
        },
        plugins: {
          tooltip: {
            position: 'nearest'
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  updateChart(newData) {
    if (this.chart) {
      this.chart.data.labels = newData.dates;
      this.chart.data.datasets[0].data = newData.prices;
      this.chart.data.datasets[1].data = newData.volume;
      this.chart.update();
    }
  }
}

// Export for use in other modules
window.SectorChart = SectorChart;