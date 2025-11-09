// /public/js/marketvalue.js
function calculatePE() {
  const price = parseFloat(document.getElementById("price_pe").value || 0);
  const eps = parseFloat(document.getElementById("eps").value || 0);
  const r = eps === 0 ? NaN : (price / eps);
  document.getElementById("peResult").innerText = `P/E = ${fmt(r)}`;
  showMarketInsight();
}
function clearPE(){ ["price_pe","eps"].forEach(i=>document.getElementById(i).value=""); document.getElementById("peResult").innerText=""; showMarketInsight(); }

function calculatePB() {
  const price = parseFloat(document.getElementById("price_pb").value || 0);
  const bv = parseFloat(document.getElementById("bookValue").value || 0);
  const r = bv === 0 ? NaN : (price / bv);
  document.getElementById("pbResult").innerText = `P/B = ${fmt(r)}`;
  showMarketInsight();
}
function clearPB(){ ["price_pb","bookValue"].forEach(i=>document.getElementById(i).value=""); document.getElementById("pbResult").innerText=""; showMarketInsight(); }

function calculatePS() {
  const price = parseFloat(document.getElementById("price_ps").value || 0);
  const rev = parseFloat(document.getElementById("revenuePerShare").value || 0);
  const r = rev === 0 ? NaN : (price / rev);
  document.getElementById("psResult").innerText = `P/S = ${fmt(r)}`;
  showMarketInsight();
}
function clearPS(){ ["price_ps","revenuePerShare"].forEach(i=>document.getElementById(i).value=""); document.getElementById("psResult").innerText=""; showMarketInsight(); }

function calculateEarningsYield() {
  const eps = parseFloat(document.getElementById("eps_ey").value || 0);
  const price = parseFloat(document.getElementById("price_ey").value || 0);
  const fair = parseFloat(document.getElementById("fairValue").value || 0);
  const ey = price === 0 ? NaN : ((eps / price) * 100);
  let mosText = "";
  if (!isNaN(fair) && fair > 0 && price > 0) {
    const mos = ((fair - price) / fair) * 100;
    mosText = ` Margin of Safety = ${fmt(mos)}%`;
  }
  document.getElementById("eyResult").innerText = `Earnings Yield = ${fmt(ey)}%` + (mosText ? ` •${mosText}` : "");
  showMarketInsight();
}
function clearEY(){ ["eps_ey","price_ey","fairValue"].forEach(i=>document.getElementById(i).value=""); document.getElementById("eyResult").innerText=""; showMarketInsight(); }

function showMarketInsight() {
  const pe = document.getElementById("peResult").innerText;
  const ey = document.getElementById("eyResult").innerText;
  let msgs = [];
  if (pe) msgs.push(pe.split('=')[1].trim());
  if (ey) msgs.push(ey.split('=')[1].trim());
  document.getElementById("marketInsight").innerText = msgs.length ? msgs.join(" • ") : "Valuation insights will appear here.";
}
