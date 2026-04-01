"use strict";

const API = "http://localhost:5000/api";

// ── Tab switching ─────────────────────────────────────────────
function switchTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("loginForm").classList.toggle("hidden", !isLogin);
  document.getElementById("signupForm").classList.toggle("hidden", isLogin);
  document.getElementById("loginTab").classList.toggle("active", isLogin);
  document.getElementById("signupTab").classList.toggle("active", !isLogin);
  clearErrors();
}

function clearErrors() {
  ["loginError", "signupError"].forEach((id) => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.add("hidden");
  });
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.remove("hidden");
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  btn.disabled = loading;
  btn.textContent = loading
    ? "Please wait…"
    : btn.dataset.label || btn.textContent;
}

// ── Login ─────────────────────────────────────────────────────
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    return showError("loginError", "Both fields are required.");
  }

  setLoading("loginBtn", true);

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors
        ? data.errors[0].msg
        : data.error || "Login failed.";
      return showError("loginError", msg);
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "notes.html";
  } catch {
    showError(
      "loginError",
      "Unable to reach the server. Is the backend running?",
    );
  } finally {
    setLoading("loginBtn", false);
  }
});

// ── Sign-up ───────────────────────────────────────────────────
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!username || !email || !password || !confirmPassword) {
    return showError("signupError", "All fields are required.");
  }

  if (password !== confirmPassword) {
    return showError("signupError", "Passwords do not match.");
  }

  if (password.length < 8) {
    return showError("signupError", "Password must be at least 8 characters.");
  }

  setLoading("signupBtn", true);

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors
        ? data.errors[0].msg
        : data.error || "Sign-up failed.";
      return showError("signupError", msg);
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "notes.html";
  } catch {
    showError(
      "signupError",
      "Unable to reach the server. Is the backend running?",
    );
  } finally {
    setLoading("signupBtn", false);
  }
});

// ── Redirect if already logged in ────────────────────────────
// if (localStorage.getItem("token")) {
//   window.location.href = "notes.html";
// }
