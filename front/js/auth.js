// front/js/auth.js
const API_BASE = ""; // same origin (localhost:3000)
const TOKEN_KEY = "petadopt_token";
const USER_KEY = "petadopt_user";

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const authStatus = document.getElementById("authStatus");
const logoutBtn = document.getElementById("logoutBtn");

function setMsg(el, text, ok = false) {
  el.textContent = text || "";
  el.style.color = ok ? "#9fffb0" : "#ffb0b0";
}

function showStatus(text) {
  if (!text) {
    authStatus.style.display = "none";
    authStatus.textContent = "";
    return;
  }
  authStatus.style.display = "block";
  authStatus.textContent = text;
}

function setMode(mode) {
  // reset msgs
  setMsg(loginMsg, "");
  setMsg(registerMsg, "");

  if (mode === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    authTitle.textContent = "Login";
    authSubtitle.textContent = "Sign in to manage your requests.";
  } else {
    tabLogin.classList.remove("active");
    tabRegister.classList.add("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    authTitle.textContent = "Register";
    authSubtitle.textContent = "Create an account to adopt pets.";
  }
}

function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

function updateUI() {
  const { token, user } = getAuth();
  if (token && user) {
    showStatus(`Logged in as: ${user.username} (${user.email})`);
    logoutBtn.style.display = "block";
  } else {
    showStatus("");
    logoutBtn.style.display = "none";
  }
}

tabLogin.addEventListener("click", () => setMode("login"));
tabRegister.addEventListener("click", () => setMode("register"));

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(loginMsg, "");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

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

    // expected: { token, user:{id,username,email,role} }
    saveAuth(data.token, data.user);
    setMsg(loginMsg, "Login successful ✅", true);
    updateUI();

    // optional redirect after login:
    // window.location.href = "index.html";
  } catch (err) {
    setMsg(loginMsg, "Network error. Check server.", false);
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(registerMsg, "");

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const address = document.getElementById("regAddress").value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, address })
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(registerMsg, data.message || "Register failed");
      return;
    }

    // expected: { message, token, user:{...} }
    saveAuth(data.token, data.user);
    setMsg(registerMsg, "Registered & logged in ✅", true);
    updateUI();

    // switch to login tab (optional)
    setMode("login");
  } catch (err) {
    setMsg(registerMsg, "Network error. Check server.", false);
  }
});

logoutBtn.addEventListener("click", () => {
  clearAuth();
  updateUI();
  setMsg(loginMsg, "");
  setMsg(registerMsg, "");
  setMode("login");
});

setMode("login");
updateUI();
