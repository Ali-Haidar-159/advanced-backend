"use strict";

const authTabs = Array.from(document.querySelectorAll("[data-auth-tab]"));
const authPanels = Array.from(document.querySelectorAll("[data-auth-panel]"));
const formTitle = document.querySelector("#form-title");
const formDescription = document.querySelector("#form-description");

function setAuthMode(mode) {
  const isSignup = mode === "signup";

  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authTab === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  authPanels.forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== mode;
  });

  formTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  formDescription.textContent = isSignup
    ? "Start making space for the things that matter."
    : "Sign in to pick up where you left off.";
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab));
});

document.querySelectorAll("[data-switch-auth]").forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.switchAuth));
});

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const passwordInput = document.getElementById(button.dataset.passwordToggle);
    const shouldShow = passwordInput.type === "password";

    passwordInput.type = shouldShow ? "text" : "password";
    button.textContent = shouldShow ? "Hide" : "Show";
    button.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
    button.setAttribute("aria-pressed", String(shouldShow));
  });
});

const currentYear = document.querySelector("#current-year");
currentYear.textContent = String(new Date().getFullYear());

const toast = document.querySelector("[data-toast]");

if (toast) {
  let dismissTimeout;

  const dismissToast = () => {
    window.clearTimeout(dismissTimeout);

    if (toast.isConnected && !toast.classList.contains("is-dismissing")) {
      toast.classList.add("is-dismissing");
      window.setTimeout(() => toast.remove(), 200);
    }
  };

  toast.querySelector("[data-toast-close]").addEventListener("click", dismissToast);
  dismissTimeout = window.setTimeout(dismissToast, 6000);
}
