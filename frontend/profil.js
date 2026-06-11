const API_BASE = "/api";

// ===================================
// AUTHENTIFICATION & VARIABLES GLOBALES
// ===================================

let editingType = null; // "post" ou "comment"
let editingId = null;

// ===================================
// RÉFÉRENCES DU MODAL DE MODIFICATION
// ===================================

const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editContentInput");
const editTitle = document.getElementById("editModalTitle");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editImageInput = document.getElementById("editImageInput");
const removeImageCheckbox = document.getElementById("removeImageCheckbox");
const currentImageContainer = document.getElementById("currentImageContainer");
const currentPostImage = document.getElementById("currentPostImage");

// récupération du token d'authentification stocké dans le localStorage
const token = localStorage.getItem("authToken");

// conteneur HTML qui va contenir tous les posts
const postsContainer = document.getElementById("postsContainer");

if (!token) {
  window.location.href = "index.html";
}

if (!postsContainer) {
  console.error("postsContainer introuvable dans le HTML");
}

// ==================================
// RÉCUPÉRATION DU PROFIL UTILISATEUR
// ==================================

async function fetchUserProfile() {
  try {
    const response = await fetch(`${API_BASE}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du profil");
    }

    const data = await response.json();
    const user = data.user;
    window.currentUserId = user.id;

    const initials =
      user.first_name.charAt(0).toUpperCase() +
      user.last_name.charAt(0).toUpperCase();

    const avatar = document.getElementById("userAvatar");
    if (avatar) avatar.textContent = initials;

    const name = document.getElementById("profileName");
    if (name) name.textContent = `${user.first_name} ${user.last_name}`;

    const bio = document.getElementById("profileBio");
    if (bio) bio.textContent = user.bio ?? "Pas de description";

    const location = document.getElementById("profileLocation");
    if (location) location.textContent = user.location ?? "Non renseigné";

    const website = document.getElementById("profileWebsite");
    if (website) website.href = user.website ?? "#";
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement du profil.");
  }
}

fetchUserProfile();

// ===================================
// RÉCUPÉRATION ET AFFICHAGE DES POSTS
// ===================================

async function fetchMyPosts() {
  try {
    const response = await fetch(`${API_BASE}/user/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const posts = await response.json();

    if (!postsContainer) return;

    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className =
        "bg-[#F5F5F5] border border-white/10 rounded-3xl p-6 mb-6";

      article.innerHTML = `
        <div class="flex justify-between items-start mb-4 relative">

          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
              ${post.user.first_name.charAt(0)}${post.user.last_name.charAt(0)}
            </div>
            <div>
              <p class="text-black font-bold">
                ${post.user.first_name} ${post.user.last_name}
              </p>
              <p class="text-black text-xs">
                ${timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <!-- MENU 3 POINTS -->
          <div class="relative">
            <button 
              class="post-menu-btn text-black text-xl px-2"
              data-id="${post.id}"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>

            <div 
              class="post-menu hidden absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
              id="menu-${post.id}"
            >
              <button 
                class="edit-post block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-black"
                data-id="${post.id}"
              >
                Modifier
              </button>

              <button 
                class="delete-post block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                data-id="${post.id}"
              >
                Supprimer
              </button>
            </div>
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
            <i class="${post.liked_by_user ? "fa-solid" : "fa-regular"} fa-heart"></i>
            ${post.likes_count ?? 0} J'aime
          </button>

          <button 
            class="comment-toggle flex items-center gap-2 text-sm text-black"
            data-id="${post.id}"
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

      postsContainer.appendChild(article);
    });
  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des posts.");
  }
}

fetchMyPosts();

// ====================================
// GESTION DES INTERACTIONS UTILISATEUR
// ====================================

if (postsContainer) {
  postsContainer.addEventListener("click", async (e) => {
    // ================================
    // OUVERTURE DU MENU POST (3 POINTS)
    // ================================

    const menuBtn = e.target.closest(".post-menu-btn");

    if (menuBtn) {
      const postId = menuBtn.dataset.id;
      const menu = document.getElementById(`menu-${postId}`);

      // Fermer tous les autres menus ouverts
      document.querySelectorAll(".post-menu").forEach((m) => {
        if (m !== menu) m.classList.add("hidden");
      });

      menu.classList.toggle("hidden");
      return;
    }

    // =============================================
    // OUVERTURE DU MENU COMMENTAIRE (3 POINTS)
    // =============================================

    const commentMenuBtn = e.target.closest(".comment-menu-btn");

    if (commentMenuBtn) {
      const commentId = commentMenuBtn.dataset.id;
      const menu = document.getElementById(`comment-menu-${commentId}`);

      // Fermer les autres menus commentaires
      document.querySelectorAll(".comment-menu").forEach((m) => {
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
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        await fetchMyPosts();
      } catch (error) {
        console.error("Erreur suppression post:", error);
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

      editTitle.textContent = "Modifier le post";
      editInput.value = currentContent;

      // reset
      if (removeImageCheckbox) removeImageCheckbox.checked = false;
      if (editImageInput) editImageInput.value = "";

      // image actuelle
      if (imageElement && currentImageContainer && currentPostImage) {
        currentImageContainer.classList.remove("hidden");
        currentPostImage.src = imageElement.src;
      } else if (currentImageContainer) {
        currentImageContainer.classList.add("hidden");
      }

      editModal.classList.remove("hidden");
      editModal.classList.add("flex");

      return;
    }

    // ==========================
    // SUPPRESSION D'UN COMMENTAIRE
    // ==========================

    const deleteCommentBtn = e.target.closest(".delete-comment");

    if (deleteCommentBtn) {
      const commentId = deleteCommentBtn.dataset.id;

      if (!confirm("Supprimer ce commentaire ?")) return;

      try {
        const response = await fetch(`${API_BASE}/comments/${commentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        // Recharge selon l'onglet actif
        if (tabComments.classList.contains("text-slate-800")) {
          await fetchMyComments();
        } else {
          await fetchMyPosts();
        }
      } catch (error) {
        console.error("Erreur suppression commentaire:", error);
      }

      return;
    }

    // ==========================
    // MODIFICATION D'UN COMMENTAIRE
    // ==========================

    const editCommentBtn = e.target.closest(".edit-comment");

    if (editCommentBtn) {
      const commentId = editCommentBtn.dataset.id;

      const commentItem = editCommentBtn.closest(".comment-item");
      const contentElement = commentItem.querySelector(".comment-content");

      if (!contentElement) return;

      const currentContent = contentElement.textContent.trim();

      editingType = "comment";
      editingId = commentId;

      editTitle.textContent = "Modifier le commentaire";
      editInput.value = currentContent;

      editModal.classList.remove("hidden");
      editModal.classList.add("flex");

      return;
    }

    // ================
    // SYSTÈME DE LIKE
    // ================

    const unlikeBtn = e.target.closest(".unlike-btn");

    if (unlikeBtn) {
      const postId = unlikeBtn.dataset.id;

      try {
        const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        await fetchMyLikes(); // Recharge la liste
      } catch (error) {
        console.error("Erreur suppression like:", error);
      }

      return;
    }

    const likeBtn = e.target.closest(".like-btn");

    if (likeBtn) {
      const postId = likeBtn.dataset.id;
      const liked = likeBtn.dataset.liked === "true";

      try {
        const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
          method: liked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        await fetchMyPosts();
      } catch (error) {
        console.error("Erreur like:", error);
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

      if (!section) return;

      section.classList.toggle("hidden");

      // chargement des commentaires seulement la première fois
      if (!section.dataset.loaded) {
        await loadComments(postId);
        section.dataset.loaded = "true";
      }

      return;
    }
  });
}

// ===========================
// CHARGEMENT DES COMMENTAIRES
// ===========================

async function loadComments(postId) {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error();

    const post = await response.json();
    const comments = post.comments || [];

    const section = document.getElementById(`comments-${postId}`);
    if (!section) return;

    section.innerHTML = "";

    const commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-list h-64 overflow-y-auto pr-2";

    comments.forEach((comment) => {
      const div = document.createElement("div");
      div.className = "comment-item flex items-start gap-4 mb-4";
      div.dataset.id = comment.id;

      div.innerHTML = `
  <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
    ${comment.user.first_name.charAt(0)}${comment.user.last_name.charAt(0)}
  </div>

  <div class="flex-1 relative">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-black font-bold">
          ${comment.user.first_name} ${comment.user.last_name}
        </p>
        <p class="text-black text-xs">
          ${timeAgo(comment.created_at)}
        </p>
      </div>

      <!-- MENU 3 POINTS -->
      ${
        comment.user.id === window.currentUserId
          ? `
        <div class="relative">
          <button class="comment-menu-btn text-black px-2" data-id="${comment.id}">
            <i class="fa-solid fa-ellipsis"></i>
          </button>

          <div class="comment-menu hidden absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
               id="comment-menu-${comment.id}">
            <button class="edit-comment block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-black"
                    data-id="${comment.id}">
              Modifier
            </button>

            <button class="delete-comment block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                    data-id="${comment.id}">
              Supprimer
            </button>
          </div>
        </div>
        `
          : ""
      }
    </div>

    <p class="comment-content text-black mt-2">
      ${comment.content}
    </p>
  </div>
`;

      commentsContainer.appendChild(div);
    });

    section.appendChild(commentsContainer);
  } catch (error) {
    console.error("Erreur chargement commentaires:", error);
  }
}

// =============================================
// RÉCUPÉRATION ET AFFICHAGE DE MES COMMENTAIRES
// =============================================

async function fetchMyComments() {
  try {
    const response = await fetch(`${API_BASE}/user/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error();

    const comments = await response.json();
    postsContainer.innerHTML = "";

    comments.forEach((comment) => {
      const article = document.createElement("article");
      article.className = "bg-[#F5F5F5] border border-white/10 rounded-3xl p-6";

      article.innerHTML = `
        <!-- POST ORIGINAL -->
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
              ${comment.post.user.first_name.charAt(0)}
              ${comment.post.user.last_name.charAt(0)}
            </div>
            <div>
              <p class="text-black font-bold">
                ${comment.post.user.first_name} ${comment.post.user.last_name}
              </p>
              <p class="text-black text-xs">
                ${timeAgo(comment.post.created_at)}
              </p>
            </div>
          </div>

          <p class="text-black leading-relaxed">
            ${comment.post.content}
          </p>
        </div>

        <!-- TON COMMENTAIRE -->
        <div class="comment-item mt-4 border-l-4 border-[#E2F167] pl-4 bg-white/50 rounded-lg p-3 relative" data-id="${comment.id}">
  
        <div class="flex justify-between items-start">
          <p class="text-xs text-slate-500 mb-1">
            Ton commentaire • ${timeAgo(comment.created_at)}
          </p>

          <!-- MENU 3 POINTS -->
          <div class="relative">
            <button 
              class="comment-menu-btn text-black px-2"
              data-id="${comment.id}"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>

            <div 
              class="comment-menu hidden absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 z-20"
              id="comment-menu-${comment.id}"
            >
              <button 
                class="edit-comment block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-black"
                data-id="${comment.id}"
              >
                Modifier
              </button>

              <button 
                class="delete-comment block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                data-id="${comment.id}"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <p class="comment-content text-black mt-2">
          ${comment.content}
        </p>
      </div>
    `;

      postsContainer.appendChild(article);
    });
  } catch (error) {
    console.error("Erreur chargement commentaires:", error);
  }
}

// ===========================
// GESTION DES ONGLETS PROFIL
// ===========================

const tabPosts = document.getElementById("tab-posts");
const tabComments = document.getElementById("tab-comments");
const tabLikes = document.getElementById("tab-likes");

tabPosts.addEventListener("click", (e) => {
  e.preventDefault();
  fetchMyPosts();
  activateTab(tabPosts);
});

tabComments.addEventListener("click", (e) => {
  e.preventDefault();
  fetchMyComments();
  activateTab(tabComments);
});

tabLikes.addEventListener("click", (e) => {
  e.preventDefault();
  fetchMyLikes();
  activateTab(tabLikes);
});

function activateTab(activeTab) {
  [tabPosts, tabComments, tabLikes].forEach((tab) => {
    tab.classList.remove("text-slate-800", "border-b-4", "border-[#E2F167]");
    tab.classList.add("text-slate-400");
  });

  activeTab.classList.remove("text-slate-400");
  activeTab.classList.add("text-slate-800", "border-b-4", "border-[#E2F167]");
}

// =========================================
// RÉCUPÉRATION ET AFFICHAGE DE MES LIKES
// =========================================

async function fetchMyLikes() {
  try {
    const response = await fetch(`${API_BASE}/user/likes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error();

    const posts = await response.json();
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const article = document.createElement("article");
      article.className = "bg-[#F5F5F5] border border-white/10 rounded-3xl p-6";

      article.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
            ${post.user.first_name.charAt(0)}
            ${post.user.last_name.charAt(0)}
          </div>
          <div>
            <p class="text-black font-bold">
              ${post.user.first_name} ${post.user.last_name}
            </p>
            <p class="text-black text-xs">
              ${timeAgo(post.created_at)}
            </p>
          </div>
        </div>

        <p class="text-black leading-relaxed mb-4">
          ${post.content}
        </p>

        <div class="flex items-center gap-2 text-sm">
          <button 
            class="unlike-btn flex items-center gap-2 text-red-500 hover:text-red-600"
            data-id="${post.id}"
          >
          <i class="fa-solid fa-heart"></i>
            Retirer le like
          </button>
        </div>
      `;

      postsContainer.appendChild(article);
    });
  } catch (error) {
    console.error("Erreur chargement likes:", error);
  }
}

// ===============================
// FERMETURE AUTOMATIQUE DES MENUS
// ===============================

document.addEventListener("click", (e) => {
  const clickedPostMenuBtn = e.target.closest(".post-menu-btn");
  const clickedCommentMenuBtn = e.target.closest(".comment-menu-btn");
  const clickedInsidePostMenu = e.target.closest(".post-menu");
  const clickedInsideCommentMenu = e.target.closest(".comment-menu");

  // Si on clique ailleurs que dans un menu ou son bouton
  if (
    !clickedPostMenuBtn &&
    !clickedCommentMenuBtn &&
    !clickedInsidePostMenu &&
    !clickedInsideCommentMenu
  ) {
    document.querySelectorAll(".post-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });

    document.querySelectorAll(".comment-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }
});

// =======================================
// SAUVEGARDE DE LA MODIFICATION
// =======================================

saveEditBtn.addEventListener("click", async () => {
  const newContent = editInput.value.trim();
  const newImage = editImageInput.files[0];
  const removeImage = removeImageCheckbox.checked;

  if (!newContent) return;

  try {
    let url = "";
    let method = "POST";

    const formData = new FormData();
    formData.append("content", newContent);

    if (editingType === "post") {
      url = `${API_BASE}/posts/${editingId}`;

      if (newImage) {
        formData.append("image", newImage);
      }

      if (removeImage) {
        formData.append("remove_image", "1");
      }

      // Laravel spoof PUT
      formData.append("_method", "PUT");
    }

    if (editingType === "comment") {
      url = `${API_BASE}/comments/${editingId}`;
      method = "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) throw new Error();

      closeEditModal();
      await fetchMyComments();
      return;
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error();

    closeEditModal();
    await fetchMyPosts();
  } catch (error) {
    console.error("Erreur modification:", error);
  }
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

cancelEditBtn.addEventListener("click", closeEditModal);

// ====================================
// FERMETURE DU MODAL SI CLIC EXTÉRIEUR
// ====================================

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// ======================================
// OUVERTURE DU MODAL DE CRÉATION DE POST
// ======================================

const sidebarPostBtn = document.getElementById("post-btn");

if (sidebarPostBtn) {
  sidebarPostBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openPostModal();
  });
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

// ouverture du menu mobile
const openMenu = () => {
  // Si la recherche est ouverte, on la ferme pour éviter les chevauchements
  if (mobileSearch && !mobileSearch.classList.contains("hidden")) {
    mobileSearch.classList.add("hidden");
  }
  sidebar.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

// fermeture du menu mobile
const closeMenu = () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  document.body.style.overflow = "auto";
};

if (menuBtn) menuBtn.addEventListener("click", openMenu);
if (closeBtn) closeBtn.addEventListener("click", closeMenu);
if (overlay) overlay.addEventListener("click", closeMenu);

// =========================
// BARRE DE RECHERCHE MOBILE
// =========================

if (searchTrigger && mobileSearch) {
  searchTrigger.addEventListener("click", () => {
    // Si le menu burger est ouvert, on le ferme d'abord
    if (!sidebar.classList.contains("-translate-x-full")) {
      closeMenu();
    }

    // Alterne l'affichage de la barre de recherche
    mobileSearch.classList.toggle("hidden");

    // Focus automatique sur l'input pour ouvrir le clavier mobile
    if (!mobileSearch.classList.contains("hidden")) {
      const input = mobileSearch.querySelector("input");
      if (input) input.focus();
    }
  });
}

// fermeture automatique du menu lorsqu'on clique sur un lien
document.querySelectorAll(".sidebar-item").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
