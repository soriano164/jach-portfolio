/**
 * Theme toggle logic (Light/Dark mode)
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
        if (typeof window.updateHeroPortraitByTheme === 'function') {
            window.updateHeroPortraitByTheme(savedTheme);
        }
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateIcon('dark');
        if (typeof window.updateHeroPortraitByTheme === 'function') {
            window.updateHeroPortraitByTheme('dark');
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateIcon('light');
        if (typeof window.updateHeroPortraitByTheme === 'function') {
            window.updateHeroPortraitByTheme('light');
        }
    }

    // Toggle event
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        if (typeof window.updateHeroPortraitByTheme === 'function') {
            window.updateHeroPortraitByTheme(newTheme);
        }
    });

    function updateIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
}
