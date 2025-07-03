
(function() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-theme", theme === "dark");
  document.body.classList.toggle("light-theme", theme === "light");
})();
