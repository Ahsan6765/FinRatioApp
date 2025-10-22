
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const sampleMacro = require('../../public/assets/data/macro-data.json');

async function getLatestMacro(){
  try{
    const [rows] = await db.promise().query('SELECT * FROM macroeconomics ORDER BY date DESC LIMIT 1');
    if(rows && rows.length) return rows[0];
    return sampleMacro;
  }catch(e){
    return sampleMacro;
  }
}

router.get('/', async (req, res) => {
  const macro = await getLatestMacro();
  res.render('pages/index', { title: 'FinRatios Dashboard', macro });
});

router.get('/company', (req, res) => {
  res.render('pages/company', { title: 'Company Analysis' });
});

router.get('/peers', (req, res) => {
  res.render('pages/peers', { title: 'Peer Comparison' });
});

router.get('/economy', (req, res) => {
  res.render('pages/economy', { title: 'Economic Overview' });
});

router.get('/reports', (req, res) => {
  res.render('pages/reports', { title: 'Reports' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login' });
});

module.exports = router;
