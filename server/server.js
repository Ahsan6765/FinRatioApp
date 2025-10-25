// // server/server.js
// const express = require("express");
// const path = require("path");
// const app = express();

// // Serve static files from /public
// app.use(express.static(path.join(__dirname, "../public")));

// // EJS setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "../views"));

// // Routes
// app.get("/", (req, res) => res.render("index"));
// app.get("/liquidity", (req, res) => res.render("liquidity"));
// app.get("/profitability", (req, res) => res.render("profitability"));
// app.get("/leverage", (req, res) => res.render("leverage"));
// app.get("/efficiency", (req, res) => res.render("efficiency"));
// app.get("/marketvalue", (req, res) => res.render("marketvalue"));
// // server/server.js

// app.get("/dcf", (req, res) => {
//   res.render("dcf", { title: "Discounted Cash Flow (DCF) Valuation" });
// });

// app.get("/fcf", (req, res) => {
//   res.render("fcf", { title: "Free Cash Flow Valuation" });
// });

// // ===== NEW: Valuation Page =====
// app.get("/valuation", (req, res) => {
//   res.render("valuation");
// });

// // 404 fallback
// app.use((req, res) => {
//   res.status(404).send("404 - Not Found");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





// /server/server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware Setup =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

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
app.get("/dcf", (req, res) => {
  res.render("dcf", { title: "Discounted Cash Flow (DCF) Valuation" });
});

app.get("/fcf", (req, res) => {
  res.render("fcf", { title: "Free Cash Flow (FCF) Calculator" });
});

// ===== NEW: Valuation Page =====
app.get("/valuation", (req, res) => {
  res.render("valuation");
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


