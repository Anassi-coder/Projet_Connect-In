document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchTrigger = document.getElementById('search-trigger');
    const mobileSearch = document.getElementById('mobile-search-bar');

    // --- Déconnexion ---
    const logoutIcon = document.querySelector('.fa-power-off');
    const logoutBtn = logoutIcon ? logoutIcon.closest('a') : null;
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('authToken');
            try {
                await fetch('http://localhost/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Erreur déconnexion:', error);
            }
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        });
    }

    // --- Gestion du Menu Mobile ---
    const toggleMenu = (isOpen) => {
        if (isOpen) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Empêche le scroll
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Réactive le scroll
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

    // --- Gestion de la recherche mobile ---
    if (searchTrigger && mobileSearch) {
        searchTrigger.addEventListener('click', () => {
            mobileSearch.classList.toggle('hidden');
            if (!mobileSearch.classList.contains('hidden')) {
                mobileSearch.querySelector('input')?.focus();
            }
        });
    }

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMenu(false);
            mobileSearch?.classList.add('hidden');
        }
    });
});