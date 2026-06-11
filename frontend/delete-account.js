/**
 * delete-account.js
 */
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const emailForm = document.getElementById("email-form");
  emailForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("new-email").value.trim();
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    const msg = document.getElementById("email-msg");
    if (response.ok) {
      msg.classList.remove("hidden");
      msg.textContent = "Email mis à jour avec succès.";
      msg.classList.add("text-green-600");
    } else {
      msg.classList.remove("hidden");
      msg.textContent = "Erreur lors de la mise à jour.";
      msg.classList.add("text-red-600");
    }
  });

  const passwordForm = document.getElementById("password-form");
  passwordForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value.trim();
    const passwordConfirmation = document
      .getElementById("confirm-password")
      .value.trim();
    const msg = document.getElementById("password-msg");
    if (password !== passwordConfirmation) {
      msg.classList.remove("hidden");
      msg.classList.add("text-red-600");
      msg.textContent = "Les mots de passe ne correspondent pas.";
      return;
    }
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
    if (response.ok) {
      msg.classList.remove("hidden");
      msg.textContent = "Mot de passe mis à jour avec succès.";
      msg.classList.add("text-green-600");
    } else {
      msg.classList.remove("hidden");
      msg.textContent = "Erreur lors de la mise à jour.";
      msg.classList.add("text-red-600");
    }
  });

  // --- GESTION DE LA RECHERCHE MOBILE ---
  const searchTrigger = document.getElementById("search-trigger");
  const mobileSearchBar = document.getElementById("mobile-search-bar");

  if (searchTrigger && mobileSearchBar) {
    searchTrigger.addEventListener("click", () => {
      mobileSearchBar.classList.toggle("hidden");
    });
  }

  // --- GESTION DE LA NAVIGATION (SIDEBAR) ---
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  const toggleMenu = () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  };

  if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
  if (closeBtn) closeBtn.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);

  // --- LOGIQUE DE SUPPRESSION ---
  const btnKeepContent = document.getElementById("keep-content");
  const btnDeleteContent = document.getElementById("delete-content");

  // Action : Supprimer le compte mais GARDER les posts
  btnKeepContent?.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmFirst = confirm(
      "Supprimer votre profil ? Vos publications resteront visibles.",
    );
    if (confirmFirst) {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delete_content: false }),
      });
      if (response.ok) {
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
      }
    }
  });

  // Action : TOUT supprimer
  btnDeleteContent?.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmSecond = confirm(
      "ATTENTION : Voulez-vous vraiment supprimer votre compte et tout votre contenu ?",
    );
    if (confirmSecond) {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delete_content: true }),
      });
      if (response.ok) {
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
      }
    }
  });
});
