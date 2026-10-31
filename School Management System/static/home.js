"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const authDialog = document.querySelector(".auth-dialog");
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");

function closeMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("is-open");
}

function selectAuthTab(tabName) {
    document.querySelectorAll("[data-auth-tab]").forEach((button) => {
        const isSelected = button.dataset.authTab === tabName;
        if (button.getAttribute("role") === "tab") {
            button.setAttribute("aria-selected", String(isSelected));
        }
    });

    document.querySelector("#signup-panel").hidden = tabName !== "signup";
    document.querySelector("#login-panel").hidden = tabName !== "login";
    document.querySelector("#auth-title").textContent = tabName === "signup" ? "A good place to start." : "Welcome back.";

    document.querySelector("#signup-message").textContent = "";
    document.querySelector("#signup-message").classList.remove("success");
    document.querySelector("#login-message").textContent = "";
}

menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    mainNav?.classList.toggle("is-open", isOpen);
});

mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.addEventListener("click", () => {
        closeMenu();
        selectAuthTab(button.dataset.openAuth);
        authDialog.showModal();
    });
});

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => selectAuthTab(button.dataset.authTab));
});

document.querySelector(".dialog-close")?.addEventListener("click", () => authDialog.close());
authDialog?.addEventListener("click", (event) => {
    if (event.target === authDialog) authDialog.close();
});

signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#signup-message");
    const submitButton = signupForm.querySelector('button[type="submit"]');
    const formData = new FormData(signupForm);

    message.textContent = "";
    message.classList.remove("success");
    submitButton.disabled = true;

    try {
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(formData)),
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "We couldn't create your account. Please check your details and try again.");
        }

        message.textContent = result.message || "Your account is ready.";
        message.classList.add("success");
        signupForm.reset();
    } catch (error) {
        message.textContent = error.message || "We couldn't reach the server. Please try again.";
    } finally {
        submitButton.disabled = false;
    }
});

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#login-message");
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    message.textContent = "";

    try {
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(new FormData(loginForm))),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to log in.");
        window.location.assign(result.redirect);
    } catch (error) {
        message.textContent = error.message || "We couldn't reach the server. Please try again.";
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", async () => {
        button.disabled = true;
        try {
            const response = await fetch("/api/user/logout", { method: "POST" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Unable to log out.");
            window.location.assign("/");
        } catch (error) {
            button.disabled = false;
            window.alert(error.message || "Unable to log out.");
        }
    });
});

document.querySelectorAll("[data-user-edit]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = document.querySelector("[data-user-edit-message]");
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        message.textContent = "";
        message.classList.remove("success");

        try {
            const fields = document.querySelectorAll(`[form="${CSS.escape(form.id)}"]`);
            const payload = Object.fromEntries(Array.from(fields, (field) => [field.name, field.value]));
            const response = await fetch(`/api/user/${encodeURIComponent(form.dataset.userEdit)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Unable to update the user account.");
            message.textContent = result.message;
            message.classList.add("success");
            window.setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            message.textContent = error.message || "Unable to update the user account.";
        } finally {
            button.disabled = false;
        }
    });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
