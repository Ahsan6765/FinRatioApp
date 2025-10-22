
function safeNum(x){ return (x === null || x === undefined || x === '') ? null : Number(x); }
function pct(x){ return x === null ? null : Number((x*100).toFixed(2)); }
function round2(x){ return x === null ? null : Number(x.toFixed(4)); }

function calculateRatios(fin){
  // fin expected keys: revenue, netIncome, totalAssets, totalEquity, currentAssets, currentLiabilities, inventory, costOfGoodsSold, interestExpense, sharesOutstanding, marketPrice, totalDebt
  const f = {};
  for(const k in fin) f[k] = safeNum(fin[k]);

  const ratios = {};

  // Profitability
  if(f.netIncome != null && f.revenue) ratios.netMargin = pct(f.netIncome / f.revenue);
  if(f.netIncome != null && f.totalAssets) ratios.roa = pct(f.netIncome / f.totalAssets);
  if(f.netIncome != null && f.totalEquity) ratios.roe = pct(f.netIncome / f.totalEquity);

  // Liquidity
  if(f.currentAssets != null && f.currentLiabilities) ratios.currentRatio = round2(f.currentAssets / f.currentLiabilities);
  if(f.currentAssets != null && f.inventory != null && f.currentLiabilities) ratios.quickRatio = round2((f.currentAssets - f.inventory) / f.currentLiabilities);

  // Solvency
  if(f.totalDebt != null && f.totalEquity != null && f.totalEquity !== 0) ratios.debtEquity = round2(f.totalDebt / f.totalEquity);
  if(f.ebit != null && f.interestExpense != null && f.interestExpense !== 0) ratios.interestCoverage = round2(f.ebit / f.interestExpense);

  // Efficiency
  if(f.costOfGoodsSold != null && f.inventory != null && f.inventory !== 0) ratios.inventoryTurnover = round2(f.costOfGoodsSold / f.inventory);
  if(f.revenue != null && f.totalAssets != null && f.totalAssets !== 0) ratios.assetTurnover = round2(f.revenue / f.totalAssets);

  // Market
  if(f.marketPrice != null && f.sharesOutstanding != null && f.sharesOutstanding !== 0) {
    const mcap = f.marketPrice * f.sharesOutstanding;
    ratios.marketCap = mcap;
    if(f.netIncome != null && mcap !== 0) ratios.pe = round2(mcap / (f.netIncome || 0));
    if(f.netIncome != null && f.sharesOutstanding != null) ratios.eps = round2(f.netIncome / f.sharesOutstanding);
    if(f.marketPrice != null && ratios.eps != null && ratios.eps !== 0) ratios.priceEps = round2(f.marketPrice / ratios.eps);
  }

  return ratios;
}

module.exports = calculateRatios;
