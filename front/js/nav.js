(function setupDropdown() {
  const dropdown = document.querySelector(".dropdown");
  const btn = document.getElementById("petsToggle");

  if (!dropdown || !btn) return;

  const close = () => dropdown.classList.remove("open");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  dropdown.querySelectorAll(".dropdown-content a").forEach((a) => {
    a.addEventListener("click", close);
  });
})();
