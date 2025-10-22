// server.js
const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/dcf", (req, res) => res.render("dcf"));
app.get("/ddm", (req, res) => res.render("ddm"));
app.get("/pe", (req, res) => res.render("pe"));

// Helper function for margin of safety
function calculateMarginOfSafety(fairValue, marketPrice) {
  const fv = parseFloat(fairValue);
  const mp = parseFloat(marketPrice);
  if (isNaN(mp) || mp <= 0) return null;
  const mos = ((fv - mp) / fv) * 100;
  return mos.toFixed(2);
}

// DCF Calculator
app.post("/calculate-dcf", (req, res) => {
  const { cashFlow, growthRate, discountRate, terminalGrowth, years, marketPrice } = req.body;
  let pv = 0;
  const g = parseFloat(growthRate) / 100;
  const r = parseFloat(discountRate) / 100;
  const tg = parseFloat(terminalGrowth) / 100;
  const cf = parseFloat(cashFlow);
  const n = parseInt(years);

  for (let t = 1; t <= n; t++) {
    const projectedCF = cf * Math.pow(1 + g, t);
    pv += projectedCF / Math.pow(1 + r, t);
  }

  const terminalValue = (cf * Math.pow(1 + g, n) * (1 + tg)) / (r - tg);
  const terminalPV = terminalValue / Math.pow(1 + r, n);
  const intrinsicValue = pv + terminalPV;

  const fairValue = intrinsicValue.toFixed(2);
  const mos = calculateMarginOfSafety(fairValue, marketPrice);

  res.render("dcf", { result: fairValue, marketPrice, mos });
});

// DDM Calculator
app.post("/calculate-ddm", (req, res) => {
  const { dividend, growthRate, discountRate, marketPrice } = req.body;
  const D = parseFloat(dividend);
  const g = parseFloat(growthRate) / 100;
  const r = parseFloat(discountRate) / 100;

  const value = D * (1 + g) / (r - g);
  const fairValue = value.toFixed(2);
  const mos = calculateMarginOfSafety(fairValue, marketPrice);

  res.render("ddm", { result: fairValue, marketPrice, mos });
});

// P/E Calculator
app.post("/calculate-pe", (req, res) => {
  const { eps, peRatio, marketPrice } = req.body;
  const val = parseFloat(eps) * parseFloat(peRatio);
  const fairValue = val.toFixed(2);
  const mos = calculateMarginOfSafety(fairValue, marketPrice);

  res.render("pe", { result: fairValue, marketPrice, mos });
});

app.listen(3000, () => console.log("Valuation app running on http://localhost:3000"));
