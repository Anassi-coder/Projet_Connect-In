document.addEventListener('DOMContentLoaded', () => {
    // On récupère les deux inputs (Desktop et Mobile)
    const searchInputs = [
        document.querySelector('header input[type="text"]'), // Desktop
        document.querySelector('#mobile-search-bar input')   // Mobile
    ];

    searchInputs.forEach(input => {
        if (!input) return;

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    handleSearchRouting(query);
                }
            }
        });
    });
});

/**
 * Gère la direction de la recherche selon la page où l'on se trouve
 */
function handleSearchRouting(query) {
    // Si on n'est PAS sur l'accueil (ex: Aide, Profil, etc.)
    if (!window.location.pathname.includes('accueil.html')) {
        // Redirection vers l'accueil avec le paramètre dans l'URL
        window.location.href = `accueil.html?search=${encodeURIComponent(query)}`;
    } else {
        // Si on est déjà sur l'accueil, on laisse accueil.js gérer ou on recharge avec le paramètre
        // La méthode la plus simple pour éviter les conflits de fonctions est de recharger l'URL
        window.location.href = `accueil.html?search=${encodeURIComponent(query)}`;
    }
}

/**
 * Note : La fonction performSearch n'est plus nécessaire ici 
 * car c'est fetchPosts() dans accueil.js qui va lire l'URL 
 * et faire l'appel API proprement.
 */