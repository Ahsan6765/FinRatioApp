
const db = require('../db/connection');
exports.getMacroData = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM macroeconomics ORDER BY date DESC LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
