// /public/js/profitability.js
function calculateGrossMargin() {
  const revenue = parseFloat(document.getElementById("revenue_gross").value || 0);
  const cogs = parseFloat(document.getElementById("cogs").value || 0);
  const margin = revenue === 0 ? NaN : ((revenue - cogs) / revenue) * 100;
  document.getElementById("grossResult").innerText = `Gross Margin = ${fmt(margin)}%`;
  showProfitInsight();
}
function clearGross() { ["revenue_gross","cogs"].forEach(i=>document.getElementById(i).value=""); document.getElementById("grossResult").innerText=""; showProfitInsight(); }

function calculateNetMargin() {
  const net = parseFloat(document.getElementById("netIncome").value || 0);
  const revenue = parseFloat(document.getElementById("revenue_net").value || 0);
  const margin = revenue === 0 ? NaN : (net / revenue) * 100;
  document.getElementById("netResult").innerText = `Net Profit Margin = ${fmt(margin)}%`;
  showProfitInsight();
}
function clearNet() { ["netIncome","revenue_net"].forEach(i=>document.getElementById(i).value=""); document.getElementById("netResult").innerText=""; showProfitInsight(); }

function calculateOperatingMargin() {
  const op = parseFloat(document.getElementById("operatingIncome").value || 0);
  const revenue = parseFloat(document.getElementById("revenue_op").value || 0);
  const margin = revenue === 0 ? NaN : (op / revenue) * 100;
  document.getElementById("operatingResult").innerText = `Operating Margin = ${fmt(margin)}%`;
  showProfitInsight();
}
function clearOperating() { ["operatingIncome","revenue_op"].forEach(i=>document.getElementById(i).value=""); document.getElementById("operatingResult").innerText=""; showProfitInsight(); }

function calculateROA() {
  const net = parseFloat(document.getElementById("netIncome_roa").value || 0);
  const assets = parseFloat(document.getElementById("totalAssets").value || 0);
  const roa = assets === 0 ? NaN : (net / assets) * 100;
  document.getElementById("roaResult").innerText = `ROA = ${fmt(roa)}%`;
  showProfitInsight();
}
function clearROA(){ ["netIncome_roa","totalAssets"].forEach(i=>document.getElementById(i).value=""); document.getElementById("roaResult").innerText=""; showProfitInsight(); }

function calculateROE() {
  const net = parseFloat(document.getElementById("netIncome_roe").value || 0);
  const equity = parseFloat(document.getElementById("shareholdersEquity").value || 0);
  const roe = equity === 0 ? NaN : (net / equity) * 100;
  document.getElementById("roeResult").innerText = `ROE = ${fmt(roe)}%`;
  showProfitInsight();
}
function clearROE(){ ["netIncome_roe","shareholdersEquity"].forEach(i=>document.getElementById(i).value=""); document.getElementById("roeResult").innerText=""; showProfitInsight(); }

function calculateDividendYield() {
  const div = parseFloat(document.getElementById("annualDividend").value || 0);
  const price = parseFloat(document.getElementById("pricePerShare").value || 0);
  const yieldPct = price === 0 ? NaN : (div / price) * 100;
  document.getElementById("dividendResult").innerText = `Dividend Yield = ${fmt(yieldPct)}%`;
  showProfitInsight();
}
function clearDividend(){ ["annualDividend","pricePerShare"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dividendResult").innerText=""; showProfitInsight(); }

function showProfitInsight() {
  const netMarginText = document.getElementById("netResult").innerText;
  const roaText = document.getElementById("roaResult").innerText;
  const roeText = document.getElementById("roeResult").innerText;

  let msgs = [];
  if (netMarginText) msgs.push(`Net margin: ${netMarginText.split('=')[1].trim()}`);
  if (roaText) msgs.push(`ROA: ${roaText.split('=')[1].trim()}`);
  if (roeText) msgs.push(`ROE: ${roeText.split('=')[1].trim()}`);

  document.getElementById("profitInsight").innerText = msgs.length ? msgs.join(" • ") : "Results and insights will appear here.";
}
