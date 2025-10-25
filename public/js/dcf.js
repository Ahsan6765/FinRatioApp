// DCF Calculator Logic
function calculateDCF() {
  const fcf = parseFloat(document.getElementById("fcf").value);
  const growth = parseFloat(document.getElementById("growth").value) / 100;
  const discount = parseFloat(document.getElementById("discount").value) / 100;
  const terminal = parseFloat(document.getElementById("terminal").value) / 100;
  const years = parseInt(document.getElementById("years").value);

  if (isNaN(fcf) || isNaN(growth) || isNaN(discount) || isNaN(terminal) || isNaN(years)) {
    document.getElementById("dcfResult").innerText = "⚠️ Please enter valid numeric inputs.";
    return;
  }

  let pvSum = 0;
  for (let i = 1; i <= years; i++) {
    const projectedFCF = fcf * Math.pow(1 + growth, i);
    const discounted = projectedFCF / Math.pow(1 + discount, i);
    pvSum += discounted;
  }

  // Terminal Value
  const terminalValue = (fcf * Math.pow(1 + growth, years) * (1 + terminal)) / (discount - terminal);
  const discountedTV = terminalValue / Math.pow(1 + discount, years);
  const intrinsicValue = pvSum + discountedTV;

  document.getElementById("dcfResult").innerText =
    `Intrinsic Value (DCF): Rs ${intrinsicValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  document.getElementById("dcfInsight").innerHTML = `
    <p>💡 The DCF represents the **present value** of projected cash flows and terminal value.</p>
    <p>If current market price < Intrinsic value → stock may be **undervalued**.</p>
  `;
}

function resetDCF() {
  ["fcf", "growth", "discount", "terminal", "years"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("dcfResult").innerText = "";
  document.getElementById("dcfInsight").innerText = "";
}
