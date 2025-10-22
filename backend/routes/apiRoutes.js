
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const macroController = require('../controllers/macroController');
const ratioController = require('../controllers/ratioController');
const fallback = require('../controllers/fallbackController');
const db = require('../db/connection');

// Simple check if DB connection works, otherwise use fallback
async function isDbReady(){
  try{
    await db.promise().query('SELECT 1');
    return true;
  }catch(e){
    return false;
  }
}

router.get('/company/:ticker', async (req, res) => {
  if(await isDbReady()) return companyController.getCompanyByTicker(req, res);
  return fallback.getCompanyByTicker(req, res);
});

router.get('/macro', async (req, res) => {
  if(await isDbReady()) return macroController.getMacroData(req, res);
  return fallback.getMacroData(req, res);
});

// Ratio calculation (accepts JSON financials)
router.post('/ratios/calculate', ratioController.calculate);

module.exports = router;
