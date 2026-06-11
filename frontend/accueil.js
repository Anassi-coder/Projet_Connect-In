// ===================================
// AUTHENTIFICATION & VARIABLES GLOBALES
// ===================================
 
// récupération du token d'authentification stocké dans le localStorage
const token = localStorage.getItem("authToken");
 
// conteneur HTML qui va contenir tous les posts
const postsContainer = document.getElementById("postsContainer");
 
// variables utilisées pour savoir quel élément est en cours de modification
let editingType = null;
let editingId = null;
 
// ===================================
// RÉFÉRENCES DU MODAL DE MODIFICATION
// ===================================
 
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editContentInput");
const editTitle = document.getElementById("editModalTitle");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
 
// éléments utilisés pour gérer les images lors de la modification d'un post
const editImageInput = document.getElementById("editImageInput");
const removeImageCheckbox = document.getElementById("removeImageCheckbox");
const currentImageContainer = document.getElementById("currentImageContainer");
const currentPostImage = document.getElementById("currentPostImage");
 
// RÉCUPÉRATION DU PROFIL UTILISATEUR
// ==================================
 
async function fetchUserProfile() {
  // fonction qui récupère les informations de l'utilisateur connecté via l'API
 
  try {
    const response = await fetch("http://localhost/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // envoi du token d'authentification
      },
    });
 
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du profil utilisateur");
    }
 
    const user = await response.json();
    const userData = user.user;
 
    // stockage de l'id de l'utilisateur pour vérifier la propriété des posts
    window.currentUserId = userData.id;
 
    // création des initiales pour afficher l'avatar
    const initials =
      userData.first_name.charAt(0).toUpperCase() +
      userData.last_name.charAt(0).toUpperCase();
 
    const avatar = document.getElementById("userAvatar");
 
    // affichage des initiales dans l'avatar
    avatar.textContent = initials;
  } catch (error) {
    console.error("Erreur:", error);
    alert(
      "Une erreur est survenue lors de la récupération du profil utilisateur.",
    );
  }
}
 
// ===================================
// RÉCUPÉRATION ET AFFICHAGE DES POSTS
// ===================================
 
async function fetchPosts() {
  try {
    // appel API pour récupérer tous les posts
    const response = await fetch("http://localhost/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
 
    console.log(response.status);
 
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }
 
    // conversion de la réponse en JSON
    const posts = await response.json();
    console.log(posts);
 
    // reset du conteneur avant d'afficher les posts
    postsContainer.innerHTML = "";
 
    // boucle sur tous les posts récupérés
    posts.forEach((post) => {
      // création dynamique d'un élément HTML pour chaque post
      const article = document.createElement("article");
 
      article.className = "bg-[#F5F5F5] border border-white/10 rounded-3xl p-6";
 
      // génération du contenu HTML du post
      article.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-black shrink-0 flex items-center justify-center text-white font-bold">
              ${
                post.user && !post.user.deleted_at
                  ? post.user.first_name.charAt(0) +
                    post.user.last_name.charAt(0)
                  : "?"
              }
            </div>
            <div>
              <p class="text-black font-bold">
                ${post.user ? post.user.display_name : "Utilisateur supprimé"}
                <span class="text-black font-normal">• Utilisateur</span>
              </p>
              <p class="text-black text-xs">
                ${timeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <div class="relative">
          ${
            post.user && post.user.id === window.currentUserId
              ? `
          <button class="post-menu-btn text-black px-2" data-id="${post.id}">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
          
          <div class="post-menu hidden absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
               id="menu-${post.id}">
            <button class="edit-post block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-black"
                    data-id="${post.id}">
              Modifier
            </button>
          
            <button class="delete-post block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                    data-id="${post.id}">
              Supprimer
            </button>
          </div>
          `
              : ""
          }
        </div>
        </div>
 
        <p class="post-content text-black leading-relaxed mb-6">
          ${post.content}
        </p>
 
        ${
          post.image_path
            ? `<img
                src="/storage/${post.image_path}"
                class="rounded-xl mt-3 w-full max-h-96 object-cover"
                onerror="this.style.display='none'"
              >`
            : ""
        }
 
        <div class="flex gap-6 border-t border-white/10 pt-4">
          <button
            class="like-btn flex items-center gap-2 text-sm text-black"
            data-id="${post.id}"
            data-liked="${post.liked_by_user}"
          >
            <i class="${
              post.liked_by_user ? "fa-solid" : "fa-regular"
            } fa-heart"></i>
            ${post.likes_count ?? 0} J'aime
          </button>
 
          <button
            class="comment-toggle flex items-center gap-2 text-sm text-black"
            data-id="${post.id}"
            data-count="${post.comments_count ?? 0}"
            id="comment-count-${post.id}"
          >
            <i class="fa-regular fa-comment"></i>
            ${post.comments_count ?? 0} Commentaires
          </button>
        </div>
 
        <div
          class="comments-section hidden mt-4 border-t pt-4"
          id="comments-${post.id}"
        ></div>
      `;
 
      // ajout du post dans le DOM
      postsContainer.appendChild(article);
    });
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de la récupération des posts.");
  }
}
 
// =========================
// INITIALISATION DE LA PAGE
// =========================
 
// chargement du profil puis des posts au démarrage
(async () => {
  await fetchUserProfile();
  await fetchPosts();
})();
 
// ====================================
// GESTION DES INTERACTIONS UTILISATEUR
// ====================================
 
postsContainer.addEventListener("click", async (e) => {
  // ================================
  // OUVERTURE DU MENU POST (3 POINTS)
  // ================================
 
  const menuBtn = e.target.closest(".post-menu-btn");
 
  if (menuBtn) {
    const postId = menuBtn.dataset.id;
 
    const menu = document.getElementById(`menu-${postId}`);
 
    // fermeture des autres menus ouverts
    document.querySelectorAll(".post-menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden");
    });
 
    menu.classList.toggle("hidden");
 
    return;
  }
 
  // =====================
  // SUPPRESSION D'UN POST
  // =====================
 
  const deletePostBtn = e.target.closest(".delete-post");
 
  if (deletePostBtn) {
    const postId = deletePostBtn.dataset.id;
 
    if (!confirm("Supprimer ce post ?")) return;
 
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (!response.ok) throw new Error();
 
      // recharge les posts après suppression
      await fetchPosts();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
 
    return;
  }
 
  // ======================
  // MODIFICATION D'UN POST
  // ======================
 
  const editPostBtn = e.target.closest(".edit-post");
 
  if (editPostBtn) {
    const postId = editPostBtn.dataset.id;
 
    const article = editPostBtn.closest("article");
    const contentElement = article.querySelector(".post-content");
    const imageElement = article.querySelector("img");
 
    const currentContent = contentElement.textContent.trim();
 
    editingType = "post";
    editingId = postId;
 
    // pré-remplissage du modal avec le contenu du post
    editTitle.textContent = "Modifier le post";
    editInput.value = currentContent;
 
    // reset des champs image
    removeImageCheckbox.checked = false;
    editImageInput.value = "";
 
    // affichage de l'image actuelle si elle existe
    if (imageElement) {
      currentImageContainer.classList.remove("hidden");
      currentPostImage.src = imageElement.src;
    } else {
      currentImageContainer.classList.add("hidden");
    }
 
    // ouverture du modal
    editModal.classList.remove("hidden");
    editModal.classList.add("flex");
 
    return;
  }
 
  // ================
  // SYSTÈME DE LIKE
  // ================
 
  const likeBtn = e.target.closest(".like-btn");
 
  if (likeBtn) {
    const postId = likeBtn.dataset.id;
    const liked = likeBtn.dataset.liked === "true";
 
    try {
      const response = await fetch(
        `http://localhost/api/posts/${postId}/like`,
        {
          method: liked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
 
      if (!response.ok) {
        throw new Error("Erreur lors du like");
      }
 
      // recharge les posts pour mettre à jour les likes
      await fetchPosts();
    } catch (error) {
      console.error("Erreur:", error);
    }
 
    return;
  }
 
  // ==========================
  // OUVERTURE DES COMMENTAIRES
  // ==========================
 
  const commentBtn = e.target.closest(".comment-toggle");
 
  if (commentBtn) {
    const postId = commentBtn.dataset.id;
    const section = document.getElementById(`comments-${postId}`);
 
    // affichage ou fermeture des commentaires
    section.classList.toggle("hidden");
 
    // chargement des commentaires seulement la première fois
    if (!section.dataset.loaded) {
      await loadComments(postId);
      section.dataset.loaded = "true";
    }
 
    return;
  }
});
 
// ===========================
// CHARGEMENT DES COMMENTAIRES
// ===========================
 
async function loadComments(postId) {
  try {
    const response = await fetch(`http://localhost/api/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
 
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commentaires");
    }
 
    const post = await response.json();
    const comments = post.comments || [];
 
    const section = document.getElementById(`comments-${postId}`);
    section.innerHTML = "";
 
    // conteneur scrollable pour la liste des commentaires
    const commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-list h-64 overflow-y-auto pr-2";
 
    // affichage des commentaires existants
    comments.forEach((comment) => {
      const div = document.createElement("div");
      div.className = "flex items-start gap-4 mb-4";
 
      div.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-black shrink-0 flex items-center justify-center text-white font-bold">
          ${comment.user.first_name.charAt(0)}${comment.user.last_name.charAt(0)}
        </div>
        <div>
          <p class="text-black font-bold">
            ${comment.user.first_name} ${comment.user.last_name}
          </p>
          <p class="text-black text-xs">
            ${timeAgo(comment.created_at)}
          </p>
          <p class="text-black mt-1">
            ${comment.content}
          </p>
        </div>
      `;
 
      commentsContainer.appendChild(div);
    });
 
    section.appendChild(commentsContainer);
 
    // =================================
    // FORMULAIRE D'AJOUT DE COMMENTAIRE
    // =================================
 
    const formDiv = document.createElement("div");
    formDiv.className = "flex gap-2 mt-4";
 
    formDiv.innerHTML = `
      <textarea
        class="flex-1 border rounded-xl px-4 py-2 text-sm resize-none bg-white/80 text-black focus:outline-none focus:ring-0 focus:border-gray-300"
        rows="1"
        placeholder="Ajouter un commentaire..."
      ></textarea>
 
      <button class="bg-black text-white px-4 rounded-xl text-sm">
        Ajouter
      </button>
    `;
 
    section.appendChild(formDiv);
 
    const textarea = formDiv.querySelector("textarea");
    const button = formDiv.querySelector("button");
 
    // ======================
    // AJOUT D'UN COMMENTAIRE
    // ======================
 
    button.addEventListener("click", async () => {
      const content = textarea.value.trim();
      if (!content) return;
 
      try {
        const response = await fetch(
          `http://localhost/api/posts/${postId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
          },
        );
 
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout du commentaire");
        }
 
        const data = await response.json();
        const newComment = data.comment;
 
        // ajout du commentaire dans le DOM
        const div = document.createElement("div");
        div.className = "flex items-start gap-4 mb-4";
 
        div.innerHTML = `
          <div class="w-10 h-10 rounded-full bg-black shrink-0 flex items-center justify-center text-white font-bold">
            ${newComment.user.first_name.charAt(0)}${newComment.user.last_name.charAt(0)}
          </div>
          <div>
            <p class="text-black font-bold">
              ${newComment.user.first_name} ${newComment.user.last_name}
            </p>
            <p class="text-black text-xs">
              ${timeAgo(newComment.created_at)}
            </p>
            <p class="text-black mt-1">
              ${newComment.content}
            </p>
          </div>
        `;
 
        commentsContainer.appendChild(div);
 
        // mise à jour du compteur de commentaires
        const counterBtn = document.getElementById(`comment-count-${postId}`);
 
        if (counterBtn) {
          const currentText = counterBtn.textContent;
          const match = currentText.match(/\d+/);
 
          if (match) {
            const newCount = parseInt(match[0]) + 1;
 
            counterBtn.innerHTML = `
              <i class="fa-regular fa-comment"></i>
              ${newCount} Commentaires
            `;
          }
        }
 
        textarea.value = "";
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de la récupération des commentaires.");
  }
}
 
// =====================
// MENU MOBILE / SIDEBAR
// =====================
 
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const searchTrigger = document.getElementById("search-trigger");
const mobileSearch = document.getElementById("mobile-search-bar");
const sidebarLinks = document.querySelectorAll(".sidebar-item");
 
// ouverture du menu mobile
menuBtn.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});
 
// fermeture du menu mobile
const closeMenu = () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  document.body.style.overflow = "auto";
};
 
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
 
// fermeture automatique du menu lorsqu'on clique sur un lien
sidebarLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});
 
// =========================
// BARRE DE RECHERCHE MOBILE
// =========================
 
searchTrigger.addEventListener("click", () => {
  mobileSearch.classList.toggle("hidden");
 
  if (!mobileSearch.classList.contains("hidden")) {
    mobileSearch.querySelector("input").focus();
  }
});
 
// ======================================
// OUVERTURE DU MODAL DE CRÉATION DE POST
// ======================================
 
const postBtn = document.getElementById("post-btn");
 
postBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openPostModal();
});
 
// ==================================
// FERMETURE DU MODAL DE MODIFICATION
// ==================================
 
function closeEditModal() {
  editModal.classList.add("hidden");
  editModal.classList.remove("flex");
 
  editingId = null;
  editingType = null;
}
 
cancelEditBtn.addEventListener("click", () => {
  closeEditModal();
});
 
// =======================================
// SAUVEGARDE DE LA MODIFICATION D'UN POST
// =======================================
 
saveEditBtn.addEventListener("click", async () => {
  const newContent = editInput.value.trim();
  const newImage = editImageInput.files[0];
  const removeImage = removeImageCheckbox.checked;
 
  const formData = new FormData();
 
  formData.append("content", newContent);
 
  if (newImage) {
    formData.append("image", newImage);
  }
 
  if (removeImage) {
    formData.append("remove_image", "1");
  }
 
  // Laravel attend PUT → on simule la requête
  formData.append("_method", "PUT");
 
  try {
    const response = await fetch(`/api/posts/${editingId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
 
    if (!response.ok) throw new Error();
 
    closeEditModal();
 
    // recharge les posts après modification
    await fetchPosts();
  } catch (error) {
    console.error("Erreur modification :", error);
  }
});
 
// ====================================
// FERMETURE DU MODAL SI CLIC EXTÉRIEUR
// ====================================
 
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});
 
// ===============================
// FERMETURE AUTOMATIQUE DES MENUS
// ===============================
 
document.addEventListener("click", (e) => {
  if (!e.target.closest(".post-menu-btn") && !e.target.closest(".post-menu")) {
    document.querySelectorAll(".post-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});
 
 