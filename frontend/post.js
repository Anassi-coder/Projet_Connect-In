function openPostModal() {
  if (document.getElementById("post-modal-overlay")) return;

  const overlay = document.createElement("div");

  overlay.id = "post-modal-overlay";

  overlay.className =
    "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

  document.body.appendChild(overlay);

  const modal = document.createElement("div");
  modal.className = "bg-white rounded-2xl p-6 w-full max-w-lg";

  overlay.appendChild(modal);

  const title = document.createElement("h2");
  title.textContent = "Créer un post";
  title.className = "text-black text-xl font-bold mb-4";

  modal.appendChild(title);

  const textarea = document.createElement("textarea");
  textarea.className =
    "w-full border rounded-xl p-3 text-black resize-none focus:outline-none";
  textarea.rows = 4;
  textarea.placeholder = "Écris ton post ici...";

  modal.appendChild(textarea);

  // input file caché
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.className = "hidden";

  modal.appendChild(imageInput);

  // bouton choisir image
  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.innerHTML = `<i class="fa-solid fa-image"></i> Ajouter une image`;
  imageButton.className =
    "mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black flex items-center gap-2 transition";

  modal.appendChild(imageButton);

  imageButton.addEventListener("click", () => {
    imageInput.click();
  });

  // nom du fichier
  const fileName = document.createElement("p");
  fileName.className = "text-sm text-gray-500 mt-2";
  fileName.textContent = "Aucune image sélectionnée";

  modal.appendChild(fileName);

  // preview image
  const imagePreview = document.createElement("img");
  imagePreview.className =
    "hidden mt-3 rounded-xl max-h-64 object-cover border";
  modal.appendChild(imagePreview);

  // bouton supprimer image
  const removeImageBtn = document.createElement("button");
  removeImageBtn.textContent = "Supprimer l'image";
  removeImageBtn.className =
    "hidden mt-2 text-sm text-red-500 hover:text-red-600";

  modal.appendChild(removeImageBtn);

  imageInput.addEventListener("change", () => {
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];

      fileName.textContent = "Image sélectionnée : " + file.name;

      imagePreview.src = URL.createObjectURL(file);
      imagePreview.classList.remove("hidden");

      removeImageBtn.classList.remove("hidden");
    } else {
      fileName.textContent = "Aucune image sélectionnée";
      imagePreview.classList.add("hidden");
      removeImageBtn.classList.add("hidden");
    }
  });

  removeImageBtn.addEventListener("click", () => {
    imageInput.value = "";

    fileName.textContent = "Aucune image sélectionnée";

    imagePreview.classList.add("hidden");

    removeImageBtn.classList.add("hidden");
  });

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex justify-end gap-3 mt-4";

  modal.appendChild(buttonsContainer);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Annuler";
  cancelBtn.className =
    "px-4 py-2 rounded-xl border text-black hover:bg-gray-100";

  buttonsContainer.appendChild(cancelBtn);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Publier";
  submitBtn.className =
    "px-4 py-2 rounded-xl bg-black text-white hover:opacity-80";

  buttonsContainer.appendChild(submitBtn);

  cancelBtn.addEventListener("click", () => {
    overlay.remove();
  });

  submitBtn.addEventListener("click", async () => {
    const content = textarea.value.trim();
    if (!content) return;

    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("content", content);

    if (imageInput.files[0]) {
      formData.append("image_path", imageInput.files[0]);
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
      }

      overlay.remove();

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}
