const express = require('express');
const router = express.Router();
const stockDataService = require('../services/stockDataService');

// Get sector data for signals
router.get('/sectors', async (req, res) => {
    try {
        const sectors = await stockDataService.getSectorData();
        
        // Add momentum calculations
        const sectorsWithMomentum = sectors.map(sector => ({
            ...sector,
            momentum: calculateSectorMomentum(sector)
        }));

        res.json(sectorsWithMomentum);
    } catch (error) {
        console.error('Error fetching sector data:', error);
        res.status(500).json({ error: 'Failed to fetch sector data' });
    }
});

// Calculate sector momentum using available metrics
function calculateSectorMomentum(sector) {
    // This is a simplified momentum calculation
    // Actual implementation should use historical data and proper technical indicators
    const volumeChange = ((sector.volume - sector.prevVolume) / sector.prevVolume) || 0;
    const priceChange = ((sector.currentPrice - sector.prevPrice) / sector.prevPrice) || 0;
    
    // Combine volume and price momentum with weighted average
    return (volumeChange * 0.3) + (priceChange * 0.7);
}

module.exports = router;