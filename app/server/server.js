


// /server/server.js
require('dotenv').config();
const express = require("express");
const path = require("path");
const stockDataService = require('./services/stockDataService');
const smartAiRoutes = require('./routes/smartai');
const signalsRouter = require('./routes/signalsRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware Setup =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// ===== API Routes =====

// SmartAI Routes
app.use('/api/smartai', smartAiRoutes);

// Signals Routes
app.use('/api', signalsRouter);

// API Endpoints
// Technical analysis API is temporarily disabled until reliable PSX APIs are available.
app.get('/api/stock/:symbol/technical', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe } = req.query;
    const data = await stockDataService.getTechnicalData(symbol, timeframe || '1D');
    res.json(data);
  } catch (error) {
    console.error('Error fetching technical data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sectors', async (req, res) => {
  try {
    const data = await stockDataService.getSectorData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sector data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sector/:sectorId/top-movers', async (req, res) => {
  try {
    const data = await stockDataService.getTopMovers(req.params.sectorId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching top movers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sector/:sectorId/news', async (req, res) => {
  try {
    const data = await stockDataService.getSectorNews(req.params.sectorId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching sector news:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== Routes =====

// Home Page
app.get("/", (req, res) => {
  res.render("index");
});

// Financial Ratio Pages
app.get("/liquidity", (req, res) => {
  res.render("liquidity");
});

app.get("/profitability", (req, res) => {
  res.render("profitability");
});

app.get("/leverage", (req, res) => {
  res.render("leverage");
});

app.get("/efficiency", (req, res) => {
  res.render("efficiency");
});

app.get("/marketvalue", (req, res) => {
  res.render("marketvalue");
});

// ===== Valuation tools (DCF & FCF) =====
// These routes were missing which caused 404s for /dcf and /fcf
// DCF and FCF had separate pages previously. They are now part of the
// consolidated /valuation page. Redirect old routes to /valuation so links
// and bookmarks continue to work.
app.get("/dcf", (req, res) => {
  res.redirect(302, '/valuation');
});

app.get("/fcf", (req, res) => {
  res.redirect(302, '/valuation');
});

// ===== NEW: Valuation Page =====
app.get("/valuation", (req, res) => {
  res.render("valuation");
});

// SmartAI Dashboard
app.get("/smartai", (req, res) => {
  res.render("smartai");
});

// Watchlist Page
app.get("/watchlist", (req, res) => {
  res.render("watchlist");
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).send(`
    <h1 style="font-family: Arial; color:#0369a1; text-align:center; margin-top:50px;">
      404 - Page Not Found
    </h1>
    <p style="text-align:center;"><a href="/">Go Back Home</a></p>
  `);
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`✅ Financial Ratio Analyzer running at http://localhost:${PORT}`);
});


