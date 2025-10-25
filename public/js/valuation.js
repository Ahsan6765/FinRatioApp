// valuation.js — DCF + FCF models with Margin of Safety comparison

document.addEventListener("DOMContentLoaded", () => {
  const dcfSection = document.getElementById("dcfSection");
  const fcfSection = document.getElementById("fcfSection");

  const btnDCF = document.getElementById("btnDCF");
  const btnFCF = document.getElementById("btnFCF");

  btnDCF.addEventListener("click", () => {
    dcfSection.classList.remove("hidden");
    fcfSection.classList.add("hidden");
    btnDCF.classList.add("active");
    btnFCF.classList.remove("active");
  });

  btnFCF.addEventListener("click", () => {
    fcfSection.classList.remove("hidden");
    dcfSection.classList.add("hidden");
    btnFCF.classList.add("active");
    btnDCF.classList.remove("active");
  });

  // === DCF Calculation ===
  document.getElementById("calculateDCF").addEventListener("click", () => {
    const fcf = parseFloat(document.getElementById("initialFCF").value);
    const g = parseFloat(document.getElementById("growthRate").value) / 100;
    const r = parseFloat(document.getElementById("discountRate").value) / 100;
    const t = parseFloat(document.getElementById("terminalGrowth").value) / 100;
    const n = parseInt(document.getElementById("projectionYears").value);
    const shares = parseFloat(document.getElementById("sharesOutstanding").value);
    const currentPrice = parseFloat(document.getElementById("currentPrice").value);

    if (isNaN(fcf) || isNaN(g) || isNaN(r) || isNaN(t) || isNaN(n) || isNaN(shares)) return;

    let npv = 0;
    let cashFlow = fcf;
    for (let i = 1; i <= n; i++) {
      cashFlow *= (1 + g);
      npv += cashFlow / Math.pow(1 + r, i);
    }

    // Terminal value
    const terminalValue = (cashFlow * (1 + t)) / (r - t);
    const discountedTV = terminalValue / Math.pow(1 + r, n);
    const intrinsicValue = (npv + discountedTV) / shares;

    document.getElementById("dcfValue").innerHTML = 
      `Intrinsic Value (DCF): <strong>PKR ${intrinsicValue.toFixed(2)}</strong>`;

    if (!isNaN(currentPrice)) {
      const mos = ((intrinsicValue - currentPrice) / currentPrice) * 100;
      const mosOutput = document.getElementById("mosOutput");
      mosOutput.innerHTML = `Margin of Safety: ${mos.toFixed(1)}%`;

      mosOutput.style.color = mos > 0 ? "#059669" : "#dc2626";
      mosOutput.innerHTML += mos > 0
        ? " 🟢 Undervalued"
        : " 🔴 Overvalued";
    }
  });

  // === FCF Calculation ===
  document.getElementById("calculateFCF").addEventListener("click", () => {
    const fcfValues = [1, 2, 3, 4, 5].map(i =>
      parseFloat(document.getElementById(`fcf${i}`).value) || 0
    );
    const r = parseFloat(document.getElementById("discountRateFCF").value) / 100;
    const t = parseFloat(document.getElementById("terminalGrowthFCF").value) / 100;
    const shares = parseFloat(document.getElementById("sharesOutstandingFCF").value);
    const currentPrice = parseFloat(document.getElementById("currentPriceFCF").value);

    let npv = 0;
    fcfValues.forEach((fcf, i) => {
      npv += fcf / Math.pow(1 + r, i + 1);
    });

    const terminalValue =
      (fcfValues[4] * (1 + t)) / (r - t);
    const discountedTV = terminalValue / Math.pow(1 + r, 5);
    const intrinsicValue = (npv + discountedTV) / shares;

    document.getElementById("fcfValue").innerHTML = 
      `Intrinsic Value (FCF): <strong>PKR ${intrinsicValue.toFixed(2)}</strong>`;

    if (!isNaN(currentPrice)) {
      const mos = ((intrinsicValue - currentPrice) / currentPrice) * 100;
      const mosOutput = document.getElementById("mosOutputFCF");
      mosOutput.innerHTML = `Margin of Safety: ${mos.toFixed(1)}%`;
      mosOutput.style.color = mos > 0 ? "#059669" : "#dc2626";
      mosOutput.innerHTML += mos > 0
        ? " 🟢 Undervalued"
        : " 🔴 Overvalued";
    }
  });
});
