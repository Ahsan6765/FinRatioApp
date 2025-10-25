// /public/js/efficiency.js
function calculateAssetTurnover() {
  const sales = parseFloat(document.getElementById("sales_at").value || 0);
  const assets = parseFloat(document.getElementById("assets_at").value || 0);
  const r = assets === 0 ? NaN : (sales / assets);
  document.getElementById("assetTurnoverResult").innerText = `Asset Turnover = ${fmt(r)}`;
  showEfficiencyInsight();
}
function clearAssetTurnover(){ ["sales_at","assets_at"].forEach(i=>document.getElementById(i).value=""); document.getElementById("assetTurnoverResult").innerText=""; showEfficiencyInsight(); }

function calculateInventoryTurnover() {
  const cogs = parseFloat(document.getElementById("cogs_it").value || 0);
  const avgInv = parseFloat(document.getElementById("avgInventory").value || 0);
  const r = avgInv === 0 ? NaN : (cogs / avgInv);
  document.getElementById("inventoryTurnoverResult").innerText = `Inventory Turnover = ${fmt(r)}`;
  showEfficiencyInsight();
}
function clearInventoryTurnover(){ ["cogs_it","avgInventory"].forEach(i=>document.getElementById(i).value=""); document.getElementById("inventoryTurnoverResult").innerText=""; showEfficiencyInsight(); }

function calculateDIO() {
  const avgInv = parseFloat(document.getElementById("avgInventory_dio").value || 0);
  const cogs = parseFloat(document.getElementById("cogs_dio").value || 0);
  const r = cogs === 0 ? NaN : ((avgInv / cogs) * 365);
  document.getElementById("dioResult").innerText = `DIO = ${fmt(r)} days`;
  showEfficiencyInsight();
}
function clearDIO(){ ["avgInventory_dio","cogs_dio"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dioResult").innerText=""; showEfficiencyInsight(); }

function calculateDSO() {
  const ar = parseFloat(document.getElementById("accountsReceivable").value || 0);
  const sales = parseFloat(document.getElementById("totalSales_dso").value || 0);
  const r = sales === 0 ? NaN : ((ar / sales) * 365);
  document.getElementById("dsoResult").innerText = `DSO = ${fmt(r)} days`;
  showEfficiencyInsight();
}
function clearDSO(){ ["accountsReceivable","totalSales_dso"].forEach(i=>document.getElementById(i).value=""); document.getElementById("dsoResult").innerText=""; showEfficiencyInsight(); }

function showEfficiencyInsight() {
  const dso = document.getElementById("dsoResult").innerText;
  const dio = document.getElementById("dioResult").innerText;
  let msgs = [];
  if (dso) msgs.push(`DSO: ${dso.split('=')[1].trim()}`);
  if (dio) msgs.push(`DIO: ${dio.split('=')[1].trim()}`);
  document.getElementById("efficiencyInsight").innerText = msgs.length ? msgs.join(" • ") : "Results and efficiency commentary will appear here.";
}
