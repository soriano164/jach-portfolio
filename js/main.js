/**
 * Core initialization engine
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Determine system / stored theme on load synchronously if possible, or initialize it.
    if (typeof initTheme === 'function') {
        initTheme();
    }

    // Handle deep-linking to the archive instance synchronously before render loops
    if (window.location.hash === '#projects-archive') {
        const mainEl = document.querySelector('main');
        const heroEl = document.querySelector('[data-component="hero"]');
        const navEl = document.querySelector('[data-component="navbar"]');
        const footEl = document.querySelector('[data-component="footer"]');
        
        if (heroEl) heroEl.style.display = 'none';
        if (navEl) navEl.style.display = 'none';
        if (footEl) footEl.style.display = 'none';
        
        if (mainEl) mainEl.innerHTML = '<div data-component="projects-archive"></div>';
    }

    // Load components first
    await loadAllComponents();

    // Initialize Animations
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
    
    // Bind native Browser Back/Forward navigation loops to our transition mechanics naturally
    window.addEventListener('popstate', () => {
        if (window.location.hash === '#projects-archive') {
            window.routeToArchive(null, true);
        } else {
            window.routeToHome(null, true);
        }
    });
});

/**
 * Loads all HTML parts tagged with data-component recursively.
 */
async function loadAllComponents() {
    const components = document.querySelectorAll('[data-component]');
    
    const loadPromises = Array.from(components).map(async (container) => {
        const componentName = container.getAttribute('data-component');
        const filePath = `web/${componentName}.html`;
        
        try {
            const response = await fetch(filePath, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Could not load ${filePath}`);
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Fire specific initialization functions based on component
            initializeComponentScript(componentName);

        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    });

    await Promise.all(loadPromises);
}

/**
 * Triggers the associated JS init function given a component name
 */
function initializeComponentScript(name) {
    if (name === 'navbar' && typeof initializeNavbar === 'function') {
        initializeNavbar();
    }
    if (name === 'hero' && typeof initializeHero === 'function') {
        initializeHero();
    }
    if (name === 'projects' && typeof initializeProjects === 'function') {
        initializeProjects();
    }
    // Recycle project handler when navigating to the archive since identical logic components function implicitly.
    if (name === 'projects-archive' && typeof initializeProjects === 'function') {
        initializeProjects();
    }
    if (name === 'footer' && typeof initializeFooter === 'function') {
        initializeFooter();
    }
}

// Global SPA Routing Mechanisms
window.routeToArchive = async function(event, isPopState = false) {
    if (event) event.preventDefault();
    
    // Inject valid history state gracefully changing URL hash to mimic external navigation
    if (!isPopState) {
        window.history.pushState(null, '', '#projects-archive');
    }
    
    const mainEl = document.querySelector('main');
    const heroEl = document.querySelector('[data-component="hero"]');
    const navEl = document.querySelector('[data-component="navbar"]');
    const footEl = document.querySelector('[data-component="footer"]');
    
    // Smooth transition outward
    mainEl.style.opacity = '0';
    if (heroEl) heroEl.style.opacity = '0';
    if (navEl) navEl.style.opacity = '0';
    if (footEl) footEl.style.opacity = '0';
    
    setTimeout(async () => {
        // Strip out exterior pages to maximize space solely for projects isolation
        if (heroEl) heroEl.style.display = 'none';
        if (navEl) navEl.style.display = 'none';
        if (footEl) footEl.style.display = 'none';
        
        // Core injection logic replacing homepage scope
        mainEl.innerHTML = '<div data-component="projects-archive"></div>';
        await loadAllComponents();
        window.scrollTo({ top: 0, behavior: 'auto' });
        
        if (typeof AOS !== 'undefined') AOS.refreshHard();
        
        mainEl.style.opacity = '1';
    }, 400);
};

window.routeToHome = async function(event, isPopState = false) {
    if (event) event.preventDefault();
    
    // Remove the hash cleanly restoring native naked URL
    if (!isPopState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    
    const mainEl = document.querySelector('main');
    const heroEl = document.querySelector('[data-component="hero"]');
    const navEl = document.querySelector('[data-component="navbar"]');
    const footEl = document.querySelector('[data-component="footer"]');
    
    mainEl.style.opacity = '0';
    
    setTimeout(async () => {
        // Restore all structural components visually
        if (heroEl) heroEl.style.display = '';
        if (navEl) navEl.style.display = '';
        if (footEl) footEl.style.display = '';
        
        setTimeout(() => { 
            if (heroEl) heroEl.style.opacity = '1'; 
            if (navEl) navEl.style.opacity = '1'; 
            if (footEl) footEl.style.opacity = '1'; 
        }, 50);
        
        // Strip archive safely and inject core blocks identically simulating index load states
        mainEl.innerHTML = `
            <div data-component="about"></div>
            <div data-component="projects"></div>
            <div data-component="contact"></div>
        `;
        await loadAllComponents();
        
        // Allow structural render delay to map destination anchor precisely
        setTimeout(() => {
            const projectsSection = document.querySelector('#projects');
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const sectionTop = projectsSection ? projectsSection.getBoundingClientRect().top + window.scrollY : 0;
            // Keep the section heading comfortably visible below the fixed navbar.
            window.scrollTo({ top: Math.max(sectionTop - navbarHeight - 24, 0), behavior: 'auto' });
        }, 100);
        
        if (typeof AOS !== 'undefined') AOS.refreshHard();
        
        mainEl.style.opacity = '1';
    }, 400);
};
