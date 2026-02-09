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
  try { user = userRaw ? JSON.parse(userRaw) : null; } catch { user = null; }
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

setMode("login");
updateUI();