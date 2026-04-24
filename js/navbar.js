function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    bindNavbarAnchorScroll();
    bindMobileMenu();

    // Re-bind the theme toggle specifically inside the newly loaded navbar
    initTheme();
}

function bindNavbarAnchorScroll() {
    // Prevent duplicate bindings when components are re-injected.
    if (window.__navbarAnchorBound) return;
    window.__navbarAnchorBound = true;

    document.addEventListener('click', async (event) => {
        const navLink = event.target.closest('.nav-links a[href^="#"]');
        if (!navLink) return;

        event.preventDefault();

        const hash = navLink.getAttribute('href');
        if (!hash) return;

        // If user is in archive view, restore home sections first.
        if (window.location.hash === '#projects-archive' && typeof window.routeToHome === 'function') {
            await window.routeToHome(null, false);
        }

        const target = document.querySelector(hash);
        if (!target) return;

        // Keep target heading visible below fixed navbar.
        const navbarEl = document.querySelector('.navbar');
        const navbarHeight = navbarEl ? navbarEl.offsetHeight : 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

        window.history.pushState(null, '', hash);
        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: 'smooth'
        });
    });
}

function bindMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.nav-menu');
    const menuIcon = menuButton ? menuButton.querySelector('i') : null;
    if (!menuButton || !menu) return;

    if (window.__mobileMenuOutsideClickHandler) {
        document.removeEventListener('click', window.__mobileMenuOutsideClickHandler);
    }
    if (window.__mobileMenuResizeHandler) {
        window.removeEventListener('resize', window.__mobileMenuResizeHandler);
    }

    const setMenuState = (isOpen) => {
        menu.classList.toggle('active', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
        if (menuIcon) {
            menuIcon.classList.toggle('fa-bars', !isOpen);
            menuIcon.classList.toggle('fa-xmark', isOpen);
        }
    };

    setMenuState(false);

    menuButton.addEventListener('click', () => {
        const isOpen = menu.classList.contains('active');
        setMenuState(!isOpen);
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    window.__mobileMenuOutsideClickHandler = (event) => {
        if (window.innerWidth > 768) return;
        if (!menu.classList.contains('active')) return;
        if (event.target.closest('.mobile-menu-btn') || event.target.closest('.nav-menu')) return;
        setMenuState(false);
    };
    document.addEventListener('click', window.__mobileMenuOutsideClickHandler);

    window.__mobileMenuResizeHandler = () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    };
    window.addEventListener('resize', window.__mobileMenuResizeHandler);
}
