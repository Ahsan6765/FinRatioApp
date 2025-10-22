
const sample = require('../../public/assets/data/sample-financials.json');
const macro = require('../../public/assets/data/macro-data.json');
exports.getCompanyByTicker = (req, res) => {
  const ticker = (req.params.ticker || '').toUpperCase();
  if(ticker === sample.ticker) return res.json(sample);
  return res.status(404).json({ message: 'Not found' });
};
exports.getMacroData = (req, res) => {
  return res.json(macro);
};
