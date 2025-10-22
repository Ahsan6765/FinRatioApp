
const calculateRatios = require('../utils/calculateRatios');

// POST /api/ratios/calculate
exports.calculate = async (req, res) => {
  try {
    const fin = req.body.financials || req.body;
    // ensure numeric conversion
    for (let k in fin) {
      if (fin[k] === '') fin[k] = null;
      if (typeof fin[k] === 'string' && fin[k].trim() !== '') fin[k] = Number(fin[k].replace(/,/g, ''));
    }
    const ratios = calculateRatios(fin);
    return res.json({ success: true, ratios });
  } catch (err) {
    console.error('Ratio calc error', err);
    return res.status(500).json({ success: false, error: 'Calculation error' });
  }
};
