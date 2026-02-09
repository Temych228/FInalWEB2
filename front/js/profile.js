const TOKEN_KEY = "petadopt_token";
const USER_KEY = "petadopt_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function loadProfile() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      clearAuth();
      window.location.href = "login.html";
      return;
    }

    const user = await res.json();
    document.getElementById("profileName").innerText = user.username || "";
    document.getElementById("profileEmail").innerText = user.email || "";
    document.getElementById("profileRole").innerText = user.role || "";
    document.getElementById("profileRoleText").innerText = user.role || "";

    saveUser(user);

    const elUser = document.getElementById("editUsername");
    const elEmail = document.getElementById("editEmail");
    if (elUser) elUser.value = user.username || "";
    if (elEmail) elEmail.value = user.email || "";

  } catch (err) {
    console.error("Profile load error:", err);
    clearAuth();
    window.location.href = "login.html";
  }
}

document.getElementById("logoutBtn2")?.addEventListener("click", () => {
  clearAuth();
  window.location.href = "login.html";
});

document.getElementById("editProfileForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) { window.location.href = "login.html"; return; }

  const username = document.getElementById("editUsername").value.trim();
  const email = document.getElementById("editEmail").value.trim();

  try {
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ username, email })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    await loadProfile();
    alert("Профиль обновлён");
  } catch (err) {
    console.error("Update profile error:", err);
    alert("Network error");
  }
});

loadProfile();