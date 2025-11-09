// /public/js/leverage.js
function calculateDebtToEquity() {
  const tl = parseFloat(document.getElementById("totalLiabilities").value || 0);
  const eq = parseFloat(document.getElementById("shareholdersEquity_leverage").value || 0);
  const r = eq === 0 ? NaN : (tl / eq);
  document.getElementById("dteResult").innerText = `Debt-to-Equity = ${fmt(r)}`;
  showLeverageInsight();
}
function clearDebtToEquity(){ ["totalLiabilities","shareholdersEquity_leverage"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dteResult").innerText=""; showLeverageInsight(); }

function calculateInterestCoverage() {
  const ebit = parseFloat(document.getElementById("ebit").value || 0);
  const interest = parseFloat(document.getElementById("interestExpense").value || 0);
  const r = interest === 0 ? NaN : (ebit / interest);
  document.getElementById("interestResult").innerText = `Interest Coverage = ${fmt(r)}`;
  showLeverageInsight();
}
function clearInterest(){ ["ebit","interestExpense"].forEach(i=>document.getElementById(i).value=""); document.getElementById("interestResult").innerText=""; showLeverageInsight(); }

function calculateDSCR() {
  const noi = parseFloat(document.getElementById("netOperatingIncome").value || 0);
  const tds = parseFloat(document.getElementById("totalDebtService").value || 0);
  const r = tds === 0 ? NaN : (noi / tds);
  document.getElementById("dscrResult").innerText = `DSCR = ${fmt(r)}`;
  showLeverageInsight();
}
function clearDSCR(){ ["netOperatingIncome","totalDebtService"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dscrResult").innerText=""; showLeverageInsight(); }

function calculateDebtToAsset() {
  const tl = parseFloat(document.getElementById("totalLiabilities_da").value || 0);
  const ta = parseFloat(document.getElementById("totalAssets_da").value || 0);
  const r = ta === 0 ? NaN : (tl / ta);
  document.getElementById("dtaResult").innerText = `Debt-to-Asset = ${fmt(r)}`;
  showLeverageInsight();
}
function clearDebtToAsset(){ ["totalLiabilities_da","totalAssets_da"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dtaResult").innerText=""; showLeverageInsight(); }

function calculateEquityRatio() {
  const eq = parseFloat(document.getElementById("shareholdersEquity_eq").value || 0);
  const tl = parseFloat(document.getElementById("totalLiabilities_eq").value || 0);
  const r = tl === 0 ? NaN : (eq / tl);
  document.getElementById("eqResult").innerText = `Equity Ratio = ${fmt(r)}`;
  showLeverageInsight();
}
function clearEquityRatio(){ ["shareholdersEquity_eq","totalLiabilities_eq"].forEach(i=>document.getElementById(i).value=""); document.getElementById("eqResult").innerText=""; showLeverageInsight(); }

function showLeverageInsight() {
  const dte = document.getElementById("dteResult").innerText;
  const ic = document.getElementById("interestResult").innerText;
  const dscr = document.getElementById("dscrResult").innerText;
  let msgs = [];
  if (dte) msgs.push(dte.split('=')[1].trim());
  if (ic) {
    const val = parseFloat(ic.split('=')[1]);
    if (!isNaN(val)) {
      msgs.push(val < 2 ? "Interest coverage low (<2) — watch solvency." : "Interest coverage adequate (≥2).");
    }
  }
  if (dscr) {
    const val = parseFloat(dscr.split('=')[1]);
    if (!isNaN(val)) msgs.push(val < 1.5 ? "DSCR < 1.5 — debt service risk." : "DSCR acceptable.");
  }
  document.getElementById("leverageInsight").innerText = msgs.length ? msgs.join(" ") : "Results and commentary will appear here.";
}
