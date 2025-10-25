// FCF Calculator Logic
function calculateFCF() {
  const netIncome = parseFloat(document.getElementById("netIncome").value);
  const depreciation = parseFloat(document.getElementById("depreciation").value);
  const capex = parseFloat(document.getElementById("capex").value);
  const workingCapital = parseFloat(document.getElementById("workingCapital").value);

  if (isNaN(netIncome) || isNaN(depreciation) || isNaN(capex) || isNaN(workingCapital)) {
    document.getElementById("fcfResult").innerText = "⚠️ Please enter valid numeric inputs.";
    return;
  }

  const fcf = netIncome + depreciation - capex - workingCapital;

  document.getElementById("fcfResult").innerText =
    `Free Cash Flow (FCF): Rs ${fcf.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  let interpretation;
  if (fcf > 0) interpretation = "✅ Positive FCF indicates strong liquidity and internal funding capacity.";
  else interpretation = "⚠️ Negative FCF may signal heavy investment or financial strain.";

  document.getElementById("fcfInsight").innerText = interpretation;
}

function resetFCF() {
  ["netIncome", "depreciation", "capex", "workingCapital"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("fcfResult").innerText = "";
  document.getElementById("fcfInsight").innerText = "";
}
