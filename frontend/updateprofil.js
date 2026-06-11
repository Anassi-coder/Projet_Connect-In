const API_BASE = "/api";

// MENU BURGER LOGIC
const burgerBtn = document.getElementById("burger-menu");
const closeBtn = document.getElementById("close-menu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("mobile-overlay");

function toggleMenu() {
  sidebar.classList.toggle("-translate-x-full");
  overlay.classList.toggle("hidden");
  document.body.classList.toggle("overflow-hidden");
}

burgerBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

// MOBILE SEARCH LOGIC
const searchToggle = document.getElementById("search-toggle");
const mobileSearchBar = document.getElementById("mobile-search-bar");

searchToggle.addEventListener("click", () => {
  mobileSearchBar.classList.toggle("hidden");
  // Focus automatique sur l'input quand on l'ouvre
  if (!mobileSearchBar.classList.contains("hidden")) {
    mobileSearchBar.querySelector("input").focus();
  }
});

const token = localStorage.getItem("authToken");

if (!token) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserData();

  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🔥 empêche le reload

    const first_name = document.getElementById("firstName").value.trim();
    const last_name = document.getElementById("lastName").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const location = document.getElementById("location").value.trim();
    const website = document.getElementById("website").value.trim();

    try {
      const response = await fetch(`${API_BASE}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name,
          last_name,
          bio,
          location,
          website,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur mise à jour");
      }

      alert("Profil mis à jour avec succès !");
      window.location.href = "profil.html";
    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  });
});

async function loadUserData() {
  try {
    const response = await fetch(`${API_BASE}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur chargement profil");
    }

    const data = await response.json();
    const user = data.user;

    document.getElementById("firstName").value = user.first_name ?? "";
    document.getElementById("lastName").value = user.last_name ?? "";
    document.getElementById("bio").value = user.bio ?? "";
    document.getElementById("location").value = user.location ?? "";
    document.getElementById("website").value = user.website ?? "";
  } catch (error) {
    console.error("Erreur chargement profil :", error);
  }
}
