// /public/js/liquidity.js
function calculateCurrentRatio() {
  const a = parseFloat(document.getElementById("currentAssets").value || 0);
  const l = parseFloat(document.getElementById("currentLiabilities").value || 0);
  const r = (l === 0) ? NaN : (a / l);
  document.getElementById("currentRatioResult").innerText = `Current Ratio = ${fmt(r)}`;
  showLiquidityInsight();
}
function clearCurrent() {
  document.getElementById("currentAssets").value = "";
  document.getElementById("currentLiabilities").value = "";
  document.getElementById("currentRatioResult").innerText = "";
  showLiquidityInsight();
}

function calculateQuickRatio() {
  const a = parseFloat(document.getElementById("quickAssets").value || 0);
  const i = parseFloat(document.getElementById("inventory").value || 0);
  const l = parseFloat(document.getElementById("quickLiabilities").value || 0);
  const r = (l === 0) ? NaN : ((a - i) / l);
  document.getElementById("quickRatioResult").innerText = `Quick Ratio = ${fmt(r)}`;
  showLiquidityInsight();
}
function clearQuick() {
  ["quickAssets","inventory","quickLiabilities"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("quickRatioResult").innerText = "";
  showLiquidityInsight();
}

function calculateCashRatio() {
  const c = parseFloat(document.getElementById("cashEquivalents").value || 0);
  const l = parseFloat(document.getElementById("cashLiabilities").value || 0);
  const r = (l === 0) ? NaN : (c / l);
  document.getElementById("cashRatioResult").innerText = `Cash Ratio = ${fmt(r)}`;
  showLiquidityInsight();
}
function clearCash() {
  ["cashEquivalents","cashLiabilities"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("cashRatioResult").innerText = "";
  showLiquidityInsight();
}

function calculateOCFRatio() {
  const o = parseFloat(document.getElementById("operatingCashFlow").value || 0);
  const l = parseFloat(document.getElementById("ocfLiabilities").value || 0);
  const r = (l === 0) ? NaN : (o / l);
  document.getElementById("ocfRatioResult").innerText = `Operating Cash Flow Ratio = ${fmt(r)}`;
  showLiquidityInsight();
}
function clearOCF() {
  ["operatingCashFlow","ocfLiabilities"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("ocfRatioResult").innerText = "";
  showLiquidityInsight();
}

function showLiquidityInsight() {
  // Consolidated short interpretation based on computed results (best-effort)
  const cur = parseFloat(document.getElementById("currentAssets")?.value || 0) / (parseFloat(document.getElementById("currentLiabilities")?.value || 0) || NaN);
  const quick = (parseFloat(document.getElementById("quickAssets")?.value || 0) - parseFloat(document.getElementById("inventory")?.value || 0)) / (parseFloat(document.getElementById("quickLiabilities")?.value || 0) || NaN);
  const cash = parseFloat(document.getElementById("cashEquivalents")?.value || 0) / (parseFloat(document.getElementById("cashLiabilities")?.value || 0) || NaN);

  let messages = [];
  if (!isNaN(cur)) {
    if (cur >= 2) messages.push("Current Ratio strong (≥ 2).");
    else if (cur >= 1) messages.push("Current Ratio acceptable (≈1–2).");
    else messages.push("Current Ratio weak (<1) — liquidity risk.");
  }
  if (!isNaN(quick)) {
    if (quick >= 1) messages.push("Quick Ratio healthy (≥1).");
    else messages.push("Quick Ratio weak — inventory may be inflating current assets.");
  }
  if (!isNaN(cash)) {
    if (cash >= 0.5) messages.push("Cash Ratio decent (≥0.5).");
    else messages.push("Low Cash Ratio — depends on receivables conversion.");
  }

  document.getElementById("liquidityInsight").innerText = messages.length ? messages.join(" ") : "Results will appear after calculation.";
}
