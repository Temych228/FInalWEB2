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

const loginLink = document.getElementById("loginLink");
const profileLink = document.getElementById("profileLink");
const logoutLink = document.getElementById("logoutLink");

const token = localStorage.getItem("petadopt_token");

if (token) {
  if (loginLink) loginLink.style.display = "none";
  if (profileLink) profileLink.style.display = "inline-block";
  if (logoutLink) logoutLink.style.display = "inline-block";

  if (logoutLink) {
    logoutLink.onclick = () => {
      localStorage.removeItem("petadopt_user");
      localStorage.removeItem("petadopt_token");
      window.location.href = "/";
    };
  }
} else {
  if (loginLink) loginLink.style.display = "inline-block";
  if (profileLink) profileLink.style.display = "none";
  if (logoutLink) logoutLink.style.display = "none";
}
