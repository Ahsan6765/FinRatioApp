class SmartSignals {
    constructor() {
        this.signalGridEl = document.querySelector('.signal-grid');
        this.initializeSignals();
    }

    async initializeSignals() {
        try {
            // Get sector data for signal generation
            const response = await fetch('/api/sectors');
            const sectorData = await response.json();
            
            // Generate and display signals
            const signals = this.generateSignals(sectorData);
            this.displaySignals(signals);
        } catch (error) {
            console.error('Error initializing signals:', error);
            this.showError('Failed to generate market signals');
        }
    }

    generateSignals(sectorData) {
        const signals = [];

        // Market Breadth Signal
        const positivePerformers = sectorData.filter(s => (s.momentum || 0) > 0).length;
        const marketBreadth = positivePerformers / sectorData.length;
        
        signals.push({
            type: 'Market Breadth',
            signal: this.getMarketBreadthSignal(marketBreadth),
            strength: Math.abs(marketBreadth - 0.5) * 2,
            description: `${positivePerformers} out of ${sectorData.length} sectors showing positive momentum`
        });

        // Sector Rotation Signal
        const sectorRotation = this.analyzeSectorRotation(sectorData);
        signals.push({
            type: 'Sector Rotation',
            signal: sectorRotation.signal,
            strength: sectorRotation.strength,
            description: sectorRotation.description
        });

        // Market Momentum Signal
        const momentum = this.calculateMarketMomentum(sectorData);
        signals.push({
            type: 'Market Momentum',
            signal: momentum.signal,
            strength: momentum.strength,
            description: momentum.description
        });

        // Sector Concentration Signal
        const concentration = this.analyzeSectorConcentration(sectorData);
        signals.push({
            type: 'Sector Concentration',
            signal: concentration.signal,
            strength: concentration.strength,
            description: concentration.description
        });

        return signals;
    }

    getMarketBreadthSignal(breadth) {
        if (breadth >= 0.7) return 'Strong Buy';
        if (breadth >= 0.6) return 'Buy';
        if (breadth <= 0.3) return 'Strong Sell';
        if (breadth <= 0.4) return 'Sell';
        return 'Neutral';
    }

    analyzeSectorRotation(sectorData) {
        // Analyze sector performance changes to detect rotation
        const defensiveSectors = ['Commercial Banks', 'Power Generation', 'Oil & Gas'];
        const cyclicalSectors = ['Technology', 'Automobile', 'Cement'];
        
        const defensivePerf = this.calculateSectorGroupPerformance(sectorData, defensiveSectors);
        const cyclicalPerf = this.calculateSectorGroupPerformance(sectorData, cyclicalSectors);
        
        const rotationStrength = Math.abs(defensivePerf - cyclicalPerf);
        let signal, description;

        if (cyclicalPerf > defensivePerf + 2) {
            signal = 'Risk-On';
            description = 'Rotation into cyclical sectors indicating risk appetite';
        } else if (defensivePerf > cyclicalPerf + 2) {
            signal = 'Risk-Off';
            description = 'Rotation into defensive sectors indicating caution';
        } else {
            signal = 'Neutral';
            description = 'No significant sector rotation detected';
        }

        return {
            signal,
            strength: rotationStrength / 5, // Normalize to 0-1
            description
        };
    }

    calculateSectorGroupPerformance(sectorData, sectorNames) {
        const sectors = sectorData.filter(s => sectorNames.includes(s.name));
        if (sectors.length === 0) return 0;
        
        return sectors.reduce((sum, s) => sum + (s.momentum || 0), 0) / sectors.length;
    }

    calculateMarketMomentum(sectorData) {
        const avgMomentum = sectorData.reduce((sum, s) => sum + (s.momentum || 0), 0) / sectorData.length;
        const strength = Math.abs(avgMomentum) / 5; // Normalize to 0-1

        let signal, description;
        if (avgMomentum >= 2) {
            signal = 'Strong Uptrend';
            description = 'Market showing strong positive momentum';
        } else if (avgMomentum >= 0.5) {
            signal = 'Uptrend';
            description = 'Market showing moderate positive momentum';
        } else if (avgMomentum <= -2) {
            signal = 'Strong Downtrend';
            description = 'Market showing strong negative momentum';
        } else if (avgMomentum <= -0.5) {
            signal = 'Downtrend';
            description = 'Market showing moderate negative momentum';
        } else {
            signal = 'Neutral';
            description = 'Market showing minimal momentum';
        }

        return { signal, strength, description };
    }

    analyzeSectorConcentration(sectorData) {
        // Calculate market cap concentration
        const totalMarketCap = sectorData.reduce((sum, s) => sum + (s.marketCap || 0), 0);
        const marketCapShares = sectorData.map(s => (s.marketCap || 0) / totalMarketCap);
        
        // Calculate Herfindahl-Hirschman Index (HHI)
        const hhi = marketCapShares.reduce((sum, share) => sum + share * share, 0);
        const normalizedHHI = (hhi - (1/sectorData.length)) / (1 - (1/sectorData.length));
        
        let signal, description;
        if (normalizedHHI > 0.7) {
            signal = 'High Concentration';
            description = 'Market highly concentrated in few sectors';
        } else if (normalizedHHI > 0.4) {
            signal = 'Moderate Concentration';
            description = 'Market showing moderate sector concentration';
        } else {
            signal = 'Well Distributed';
            description = 'Market well distributed across sectors';
        }

        return {
            signal,
            strength: normalizedHHI,
            description
        };
    }

    displaySignals(signals) {
        if (!this.signalGridEl) return;

        this.signalGridEl.innerHTML = `
            <div class="signals-container">
                ${signals.map(signal => this.generateSignalCard(signal)).join('')}
            </div>
        `;
    }

    generateSignalCard(signal) {
        const strengthClass = this.getStrengthClass(signal.strength);
        const signalClass = this.getSignalClass(signal.signal);

        return `
            <div class="signal-card ${signalClass}">
                <div class="signal-header">
                    <h3>${signal.type}</h3>
                    <div class="signal-strength ${strengthClass}">
                        ${this.generateStrengthBars(signal.strength)}
                    </div>
                </div>
                <div class="signal-content">
                    <div class="signal-value">${signal.signal}</div>
                    <p class="signal-description">${signal.description}</p>
                </div>
            </div>
        `;
    }

    getStrengthClass(strength) {
        if (strength >= 0.7) return 'very-strong';
        if (strength >= 0.4) return 'strong';
        if (strength >= 0.2) return 'moderate';
        return 'weak';
    }

    getSignalClass(signal) {
        const signalLower = signal.toLowerCase();
        if (signalLower.includes('buy') || signalLower.includes('strong up')) return 'signal-positive';
        if (signalLower.includes('sell') || signalLower.includes('strong down')) return 'signal-negative';
        return 'signal-neutral';
    }

    generateStrengthBars(strength) {
        const bars = 5;
        const filledBars = Math.round(strength * bars);
        
        return `
            <div class="strength-bars">
                ${Array(bars).fill(0).map((_, i) => `
                    <div class="bar ${i < filledBars ? 'filled' : ''}"></div>
                `).join('')}
            </div>
        `;
    }

    showError(message) {
        if (this.signalGridEl) {
            this.signalGridEl.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize Smart Signals
const smartSignals = new SmartSignals();