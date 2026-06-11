// ===============================
// Zone Configuration
// ===============================

const API_BASE_URL = "/api";
const TOKEN_KEY = "authToken";

// ===============================
// GESTION TOKEN
// ===============================

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ===============================
// API REQUEST (fonction générique)
// ===============================

async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  // preparer les options de la requete (method dynamique et definition du body en json)
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };
  // ajouter le token d'authentification si il existe
  const token = getToken();
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  // ajouter les données au body si elles sont fournies
  if (data) {
    options.body = JSON.stringify(data);
  }
  // faire la requete et gerer les erreurs
  try {
    const response = await fetch(url, options); // attendre la reponse de l'API
    if (!response.ok) //différence entre réussite technique et logique
    {
      const errorData = await response.json(); // récupérer les détails de l'erreur depuis la réponse
      throw new Error(errorData.message || "Erreur API");
    }
    return await response.json(); // renvoie l'objet JSON de la réponse si tout s'est bien passé
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ===============================
// Zone UI (Gestion des modales)
// ===============================

// Modales
const registerModal = document.getElementById("registerModal");
const loginModal = document.getElementById("loginModal");

// Boutons ouverture
const openRegisterBtn = document.getElementById("openRegister");
const openLoginBtn = document.getElementById("openLogin");

// Boutons fermeture
const closeRegisterBtn = document.getElementById("closeRegister");
const closeLoginBtn = document.getElementById("closeLogin");

// Fonctions génériques
function showModal(modal) {
  modal.classList.replace("hidden", "flex");
  document.body.style.overflow = "hidden";
}

function hideModal(modal) {
  modal.classList.replace("flex", "hidden");
  document.body.style.overflow = "auto";
}

// Ouverture modales
openRegisterBtn.addEventListener("click", () => showModal(registerModal));
openLoginBtn.addEventListener("click", () => showModal(loginModal));

// Fermeture modales via bouton
closeRegisterBtn.addEventListener("click", () => hideModal(registerModal));
closeLoginBtn.addEventListener("click", () => hideModal(loginModal));

// Fermeture en cliquant sur le fond sombre
window.addEventListener("click", (e) => {
  if (e.target === registerModal) hideModal(registerModal);
  if (e.target === loginModal) hideModal(loginModal);
});

// ================================
//Zone Authenfication et Inscription
// ===============================

const loginForm = document.getElementById("loginForm"); // Récupération du formulaire de connexion

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]'); // Récupération de l'input email
  const password = loginForm.querySelector('input[type="password"]'); // Récupération de l'input mot de passe

  const emailValue = email.value.trim(); // Récupération de la valeur de l'email et suppression des espaces
  const passwordValue = password.value.trim(); // Récupération de la valeur du mot de passe et suppression des espaces

  if (!emailValue || !passwordValue) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  // Préparation des données à envoyer à l'API
  const data = {
    email: emailValue,
    password: passwordValue,
  };

  try {
    // Envoi de la requête de connexion à l'API
    const response = await apiRequest("/login", "POST", data); // Si la connexion est réussie, on stocke le token et on redirige vers l'accueil
    saveToken(response.token); // stocker le token dans le localStorage
    window.location.href = "accueil.html"; // On redirige vers l’accueil après une connexion réussie
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
});

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = registerForm.querySelector('[name="username"]').value.trim();
  const firstName = registerForm
    .querySelector('[name="first_name"]')
    .value.trim();
  const lastName = registerForm
    .querySelector('[name="last_name"]')
    .value.trim();
  const email = registerForm.querySelector('[name="email"]').value.trim();
  const password = registerForm.querySelector('[name="password"]').value.trim();
  const passwordConfirmation = registerForm
    .querySelector('[name="password_confirmation"]')
    .value.trim();

  if (
    !username ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !passwordConfirmation
  ) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (password !== passwordConfirmation) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  const data = {
    username: username,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    password_confirmation: passwordConfirmation,
  };

  try {
    const response = await apiRequest("/register", "POST", data);

    saveToken(response.token);

    window.location.href = "accueil.html";
  } catch (error) {
    alert("Erreur d'inscription : " + error.message);
  }
});
