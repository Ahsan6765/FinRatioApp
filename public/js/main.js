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
