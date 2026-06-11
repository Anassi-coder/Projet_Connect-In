const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchTrigger = document.getElementById('search-trigger');
const mobileSearch = document.getElementById('mobile-search-bar');

const openMenu = () => {
    if (mobileSearch && !mobileSearch.classList.contains('hidden')) mobileSearch.classList.add('hidden');
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);

if (searchTrigger && mobileSearch) {
    searchTrigger.addEventListener('click', () => {
        if (!sidebar.classList.contains('-translate-x-full')) closeMenu();
        mobileSearch.classList.toggle('hidden');
        if (!mobileSearch.classList.contains('hidden')) {
            const input = mobileSearch.querySelector('input');
            if (input) input.focus();
        }
    });
}