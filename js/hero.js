function initializeHero() {
    const typingElement = document.getElementById('hero-typing-text');
    if (!typingElement) return;

    const textToType = "Emerging creative designer with a strong visual sense. Crafting aesthetic and meaningful experiences.";
    let i = 0;
    
    // Clear initial content
    typingElement.textContent = "";

    function typeWriter() {
        if (i < textToType.length) {
            typingElement.textContent += textToType.charAt(i);
            i++;
            // Randomize typing speed slightly for realism
            const speed = Math.random() * 50 + 30; 
            setTimeout(typeWriter, speed);
        }
    }

    // Start typing after a short delay (post AOS fade-up)
    setTimeout(typeWriter, 1200);

    initializeHeroMockupLoading();
}

function getHeroPortraitByTheme(theme) {
    return theme === 'dark'
        ? 'assets/img/girl_portrait_dark.png'
        : 'assets/img/girl_portrait_light.png';
}

function updateHeroPortraitByTheme(theme) {
    const mockupImg = document.querySelector('.mockup-img');
    if (!mockupImg || !mockupImg.classList.contains('mockup-loaded')) return;

    const portraitSrc = getHeroPortraitByTheme(theme);
    mockupImg.style.backgroundImage =
        `linear-gradient(135deg, rgba(8, 12, 24, 0.35), rgba(8, 12, 24, 0.1)), url('${portraitSrc}')`;
}

window.updateHeroPortraitByTheme = updateHeroPortraitByTheme;

function initializeHeroMockupLoading() {
    const mockupImg = document.querySelector('.mockup-img');
    const mockupLines = document.querySelector('.mockup-lines');
    if (!mockupImg) return;

    // Reset state on component reinjection.
    mockupImg.classList.remove('mockup-loaded');
    mockupImg.classList.add('mockup-loading');
    if (mockupLines) mockupLines.classList.add('mockup-lines-loading');

    const portraitSources = [
        'assets/img/girl_portrait_light.png',
        'assets/img/girl_portrait_dark.png'
    ];
    const preloader = new Image();
    const startTime = Date.now();
    const minimumSkeletonMs = 5000;

    preloader.onload = () => {
        const elapsed = Date.now() - startTime;
        const wait = Math.max(minimumSkeletonMs - elapsed, 0);
        setTimeout(() => {
            mockupImg.classList.add('mockup-loaded');
            mockupImg.classList.remove('mockup-loading');
            if (mockupLines) mockupLines.classList.remove('mockup-lines-loading');
            updateHeroPortraitByTheme(currentTheme);
        }, wait);
    };

    preloader.onerror = () => {
        // Fallback still reveals the block even if image fails.
        mockupImg.classList.add('mockup-loaded');
        mockupImg.classList.remove('mockup-loading');
        if (mockupLines) mockupLines.classList.remove('mockup-lines-loading');
    };

    // Preload both theme portraits so the toggle swaps instantly.
    portraitSources.forEach((src) => {
        const img = new Image();
        img.src = src;
    });

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    preloader.src = currentTheme === 'dark'
        ? 'assets/img/girl_portrait_dark.png'
        : 'assets/img/girl_portrait_light.png';
}
