class MarketPredictions {
    constructor() {
        this.chartsEl = document.querySelector('.prediction-charts');
        this.timeframeSelect = document.getElementById('predictionTimeframe');
        this.setupEventListeners();
        this.initializePredictions();
    }

    setupEventListeners() {
        if (this.timeframeSelect) {
            this.timeframeSelect.addEventListener('change', () => {
                this.updatePredictions();
            });
        }
    }

    async initializePredictions() {
        try {
            // Initialize with market-wide predictions
            await this.updatePredictions();
        } catch (error) {
            console.error('Error initializing predictions:', error);
            this.showError('Failed to load market predictions');
        }
    }

    async updatePredictions() {
        const timeframe = this.timeframeSelect ? this.timeframeSelect.value : '1d';
        
        try {
            // In a real implementation, this would call your AI model's predictions
            // For now, we'll generate some sample data
            const predictions = this.generateSamplePredictions(timeframe);
            this.renderPredictions(predictions);
        } catch (error) {
            console.error('Error updating predictions:', error);
            this.showError('Failed to update predictions');
        }
    }

    generateSamplePredictions(timeframe) {
        const now = new Date();
        const predictions = [];
        const intervals = {
            '1d': { count: 24, unit: 'hours' },
            '1w': { count: 7, unit: 'days' },
            '1m': { count: 30, unit: 'days' }
        };

        const { count, unit } = intervals[timeframe];
        let currentValue = 100; // Starting value

        for (let i = 0; i <= count; i++) {
            const date = new Date(now);
            switch (unit) {
                case 'hours':
                    date.setHours(date.getHours() + i);
                    break;
                case 'days':
                    date.setDate(date.getDate() + i);
                    break;
            }

            // Add some random variation
            const change = (Math.random() - 0.5) * 2;
            currentValue *= (1 + change/100);

            predictions.push({
                date: date.toISOString(),
                actual: i === 0 ? currentValue : null,
                predicted: currentValue,
                confidence: 0.95 - (i / count) * 0.3 // Confidence decreases over time
            });
        }

        return predictions;
    }

    renderPredictions(predictions) {
        if (!this.chartsEl) return;

        // Clear previous content
        this.chartsEl.innerHTML = '';

        // Create SVG for the chart
        const margin = {top: 20, right: 30, bottom: 30, left: 60};
        const width = this.chartsEl.offsetWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(this.chartsEl)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const x = d3.scaleTime()
            .domain(d3.extent(predictions, d => new Date(d.date)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min(predictions, d => Math.min(d.predicted * 0.995, d.actual || d.predicted)),
                d3.max(predictions, d => Math.max(d.predicted * 1.005, d.actual || d.predicted))
            ])
            .range([height, 0]);

        // Add confidence area
        const area = d3.area()
            .x(d => x(new Date(d.date)))
            .y0(d => y(d.predicted * (1 - d.confidence/20)))
            .y1(d => y(d.predicted * (1 + d.confidence/20)));

        svg.append('path')
            .datum(predictions)
            .attr('fill', '#4caf50')
            .attr('fill-opacity', 0.1)
            .attr('d', area);

        // Add prediction line
        const line = d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.predicted));

        svg.append('path')
            .datum(predictions)
            .attr('fill', 'none')
            .attr('stroke', '#4caf50')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add actual values
        const actualData = predictions.filter(d => d.actual !== null);
        
        svg.selectAll('.actual-point')
            .data(actualData)
            .enter()
            .append('circle')
            .attr('class', 'actual-point')
            .attr('cx', d => x(new Date(d.date)))
            .attr('cy', d => y(d.actual))
            .attr('r', 4)
            .attr('fill', '#2196f3');

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .call(d3.axisLeft(y));

        // Add legend
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 100}, 0)`);

        legend.append('line')
            .attr('x1', 0)
            .attr('x2', 20)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', '#4caf50')
            .attr('stroke-width', 2);

        legend.append('text')
            .attr('x', 25)
            .attr('y', 4)
            .text('Predicted')
            .style('font-size', '12px')
            .style('fill', '#fff');

        legend.append('circle')
            .attr('cx', 10)
            .attr('cy', 20)
            .attr('r', 4)
            .attr('fill', '#2196f3');

        legend.append('text')
            .attr('x', 25)
            .attr('y', 24)
            .text('Actual')
            .style('font-size', '12px')
            .style('fill', '#fff');
    }

    showError(message) {
        if (this.chartsEl) {
            this.chartsEl.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize Market Predictions
const marketPredictions = new MarketPredictions();