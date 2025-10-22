
const db = require('../db/connection');
// GET /api/company/:ticker
exports.getCompanyByTicker = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  try {
    const [rows] = await db.promise().query('SELECT * FROM companies WHERE ticker = ?', [ticker]);
    if (!rows.length) return res.status(404).json({ message: 'Company not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
