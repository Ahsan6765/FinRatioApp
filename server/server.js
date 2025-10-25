// server/server.js
const express = require("express");
const path = require("path");
const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, "../public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/liquidity", (req, res) => res.render("liquidity"));
app.get("/profitability", (req, res) => res.render("profitability"));
app.get("/leverage", (req, res) => res.render("leverage"));
app.get("/efficiency", (req, res) => res.render("efficiency"));
app.get("/marketvalue", (req, res) => res.render("marketvalue"));

// 404 fallback
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
