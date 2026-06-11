// Sélection des éléments
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchTrigger = document.getElementById('search-trigger');
const mobileSearch = document.getElementById('mobile-search-bar');

// Fonctions de gestion du menu
const openMenu = () => {
    // Ferme la recherche mobile si elle est ouverte
    if (mobileSearch && !mobileSearch.classList.contains('hidden')) {
        mobileSearch.classList.add('hidden');
    }
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
};

const closeMenu = () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Réactive le scroll
};

// Événements
if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);

// Gestion de la recherche sur mobile
if (searchTrigger && mobileSearch) {
    searchTrigger.addEventListener('click', () => {
        // Ferme le menu si on ouvre la recherche
        if (!sidebar.classList.contains('-translate-x-full')) {
            closeMenu();
        }
        mobileSearch.classList.toggle('hidden');
        if (!mobileSearch.classList.contains('hidden')) {
            const input = mobileSearch.querySelector('input');
            if (input) input.focus();
        }
    });
}

// Fermeture avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
        if (mobileSearch) mobileSearch.classList.add('hidden');
    }
});