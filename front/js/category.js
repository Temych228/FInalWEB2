let categoryLoaded = false;

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAge(age) {
  if (age === null || age === undefined) return "Age: -";
  return `Age: ${age} yr${Number(age) === 1 ? "" : "s"}`;
}


function normalizePhotoUrl(url) {
  const placeholder = "/images/no-image.png"; 
  if (!url) return placeholder;

  const str = String(url).trim();
  if (!str) return placeholder;

  if (str.startsWith("data:")) return str;

  if (/^https?:\/\//i.test(str)) return str;

  if (/^\/\//.test(str)) return str;

  if (!str.startsWith("/")) return "/" + str;

  return str;
}

function renderGallery(pets) {
  const petGrid = document.getElementById("pet-grid");
  if (!petGrid) {
    console.warn("renderGallery: element #pet-grid not found");
    return;
  }

  petGrid.innerHTML = "";

  if (!Array.isArray(pets) || pets.length === 0) {
    petGrid.innerHTML = `<div style="opacity:.9;">No pets found.</div>`;
    return;
  }

  petGrid.innerHTML = pets
    .map((p) => {
      const id = esc(p._id || "");
      const name = esc(p.name || "Unknown");
      const ageText = esc(formatAge(p.age));
      const photoRaw = p.photoUrl || "";
      const photo = esc(normalizePhotoUrl(photoRaw));

      if (!photoRaw) {
      }

      return `
        <div class="pet-card" data-id="${id}">
          <img src="${photo}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='/images/no-image.png'">
          <div class="pet-overlay">
            <div class="pet-name">${name}</div>
            <div class="pet-age">${ageText}</div>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".pet-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (!id) return;
      window.location.href = `pet.html?id=${encodeURIComponent(id)}`;
    });
  });
}

async function loadCategory(type) {
  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.textContent = "Loading pets from database...";

  try {
    const res = await fetch("/api/pets");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const allPets = await res.json();

    const arr = Array.isArray(allPets) ? allPets : [];

    const filtered = arr.filter((p) => String(p.type) === String(type));

    if (statusEl) {
      statusEl.textContent = `Found ${filtered.length} ${type}(s). Hover to see name & age.`;
    }

    renderGallery(filtered);
  } catch (e) {
    console.error("loadCategory error:", e);
    if (statusEl) statusEl.textContent = "Failed to load pets. Check server + /api/pets.";
    const petGrid = document.getElementById("pet-grid");
    if (petGrid) petGrid.innerHTML = `<div style="opacity:.9;">Error loading pets.</div>`;
  }
}

const API_BASE = "";
const TOKEN_KEY = "petadopt_token";
const USER_KEY = "petadopt_user";

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");

const authStatus = document.getElementById("authStatus");
const logoutBtn = document.getElementById("logoutBtn");

function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function setMsg(el, text = "", ok = false) {
  if (!el) return;
  el.textContent = text;
  el.style.color = ok ? "#9fffb0" : "#ffb0b0";
}

function showStatus(text = "") {
  if (!authStatus) return;
  if (!text) {
    authStatus.style.display = "none";
    authStatus.textContent = "";
    return;
  }
  authStatus.style.display = "block";
  authStatus.textContent = text;
}

function updateUI() {
  const { token, user } = getAuth();
  if (token && user) {
    showStatus(`Logged in as: ${user.username} (${user.email})`);
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    showStatus("");
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

function setMode(mode = "login") {
  setMsg(loginMsg, "");
  setMsg(registerMsg, "");

  if (mode === "login") {
    if (tabLogin) tabLogin.classList.add("active");
    if (tabRegister) tabRegister.classList.remove("active");
    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";
  } else {
    if (tabLogin) tabLogin.classList.remove("active");
    if (tabRegister) tabRegister.classList.add("active");
    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "block";
  }
}

if (tabLogin) tabLogin.addEventListener("click", () => setMode("login"));
if (tabRegister) tabRegister.addEventListener("click", () => setMode("register"));

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(loginMsg, "");

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      setMsg(loginMsg, "Введите email и пароль");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(loginMsg, data.message || "Login failed");
        return;
      }

      saveAuth(data.token, data.user);
      setMsg(loginMsg, "Вход выполнен ✅", true);
      updateUI();
      window.location.href = "profile.html";
    } catch (err) {
      console.error("Login error:", err);
      setMsg(loginMsg, "Network error. Check server.");
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(registerMsg, "");

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!username || !email || !password) {
      setMsg(registerMsg, "Заполните все поля");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(registerMsg, data.message || "Registration failed");
        return;
      }

      saveAuth(data.token, data.user);
      setMsg(registerMsg, "Зарегистрированы и вошли ✅", true);
      updateUI();
      window.location.href = "profile.html";
    } catch (err) {
      console.error("Register error:", err);
      setMsg(registerMsg, "Network error. Check server.");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearAuth();
    updateUI();
    setMode("login");
    setMsg(loginMsg, "");
    setMsg(registerMsg, "");
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.category;
  if (page) loadCategory(page);
});