// /public/js/main.js
// small utilities used on many pages

// Format a number to 2 decimals and handle NaN/Infinite
function fmt(n) {
  if (isNaN(n) || !isFinite(n)) return "—";
  // show two decimals, but for very small numbers show 4
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// Simple DOM ready helper
document.addEventListener("DOMContentLoaded", () => {
  // highlight nav active link by pathname
  const links = document.querySelectorAll(".top-nav a");
  links.forEach(a => {
    if (a.getAttribute("href") === location.pathname) {
      a.classList.add("active");
    }
  });
});

// export fmt for other modules (works in browser global scope)
window.fmt = fmt;

// Theme toggle logic
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || 
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

document.documentElement.setAttribute("data-theme", currentTheme);
if (themeToggle) themeToggle.textContent = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

themeToggle?.addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Technical analysis UI removed temporarily because PSX APIs are unavailable.
// If you want to re-enable technical charts later, restore the TechnicalChart
// initialization and ensure the backend & data providers are available.
