/**
 * Footer component logic
 */
function initializeFooter() {
    const button = document.querySelector('.back-to-top-btn');
    const footer = document.querySelector('.footer');
    if (!button || !footer) return;

    if (window.__backToTopObserver) {
        window.__backToTopObserver.disconnect();
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            button.classList.toggle('visible', entry.isIntersecting);
        },
        { threshold: 0.2 }
    );

    observer.observe(footer);
    window.__backToTopObserver = observer;

    button.addEventListener('click', (event) => {
        event.preventDefault();
        const heroSection = document.querySelector('#hero');
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        if (heroSection) {
            const top = heroSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
