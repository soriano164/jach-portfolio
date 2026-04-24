/**
 * Anime.js Morphing Logic for Projects Section
 */
function initializeProjects() {
    initGeometricMorph();
    initOrganicBlob();
    initTechMorph();
    initWaveMorph();
    initCrystalMorph();

    bindProjectViewer();
    bindProjectDots();
}

/** Project 1: Filter Turbulence Morph (Anime.js V3 adapted) */
function initGeometricMorph() {
    // 1. Animate SVG Filter properties
    anime({
        targets: ['#displacementFilter feTurbulence', '#displacementFilter feDisplacementMap'],
        baseFrequency: 0.05,
        scale: 15,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 2000
    });

    // 2. Animate Polygon points
    anime({
        targets: '.p1-shape',
        points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 2000
    });
}

/** Project 2: Abstract Spiky Polygon Morph (Anime.js Docs Demo) */
function initOrganicBlob() {
    const el = document.querySelector('.p2-shape');
    if (!el) return;

    function generatePoints() {
        const total = anime.random(4, 64);
        const r1 = anime.random(4, 56);
        const r2 = 56;
        const isOdd = n => n % 2;
        let pStr = '';
        for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
            const r = isOdd(i) ? r1 : r2;
            const a = (2 * Math.PI * i / l) - Math.PI / 2;
            const x = 152 + Math.round(r * Math.cos(a));
            const y = 56 + Math.round(r * Math.sin(a));
            pStr += `${x},${y} `;
        }
        return pStr.trim();
    }

    function animateRandomPoints() {
        anime({
            targets: el,
            points: generatePoints(),
            easing: 'easeInOutCirc',
            duration: 500,
            complete: animateRandomPoints
        });
    }

    animateRandomPoints();
}

/** Project 3: Motion Path Dynamics (Suzuka Circuit) */
function initTechMorph() {
    const pathEls = document.querySelectorAll('.p3-path');
    const carEls = document.querySelectorAll('.p3-car');
    if (!pathEls.length || !carEls.length) return;

    const pairCount = Math.min(pathEls.length, carEls.length);

    for (let i = 0; i < pairCount; i++) {
        const pathEl = pathEls[i];
        const carEl = carEls[i];

        // Prevent stacked/reused animations after route transitions.
        anime.remove(pathEl);
        anime.remove(carEl);

        // Keep path always visible; avoid full redraw states that can look blank.
        pathEl.style.strokeDasharray = '';
        pathEl.style.strokeDashoffset = '0';

        const path = anime.path(pathEl);

        anime({
            targets: carEl,
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            easing: 'linear',
            duration: 5000,
            loop: true
        });
    }
}

/** Project 4: Waveform Morph */
function initWaveMorph() {
    const el = document.querySelector('.p4-shape');
    const target = document.querySelector('.p4-target');
    if (!el || !target) return;

    anime({
        targets: el,
        d: [
            { value: target.getAttribute('d') },
            { value: el.getAttribute('d') }
        ],
        easing: 'easeInOutSine',
        duration: 1500,
        loop: true,
        direction: 'alternate'
    });
}

/** Project 5: Crystal Morph */
function initCrystalMorph() {
    const el = document.querySelector('.p5-shape');
    const target = document.querySelector('.p5-target');
    if (!el || !target) return;

    anime({
        targets: el,
        points: [
            { value: target.getAttribute('points') },
            { value: el.getAttribute('points') }
        ],
        easing: 'easeInOutCirc',
        duration: 2000,
        loop: true,
        direction: 'alternate'
    });
}


function bindProjectViewer() {
    // 1. Inject Modal Globally into the Body Root
    // This perfectly escapes any nested CSS transform logic, caching traps, or component injection conflicts.
    let modal = document.querySelector('#project-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-panel">
                <button class="modal-close" aria-label="Close Modal"><i class="fa-solid fa-xmark"></i></button>
                <div id="modal-media-container"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 2. Attach global delegated event listener uniquely
    if (!window.__projectViewerBound) {
        window.__projectViewerBound = true;

        document.addEventListener('click', (e) => {
            // Handle View Project trigger click (button or full overlay region)
            const trigger = e.target.closest('.btn-zoom, .project-overlay');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation(); // Stop parent frameworks from hijacking the click

                const card = trigger.closest('.project-card');
                const overlay = document.querySelector('#project-modal');
                const modalContainer = document.querySelector('#modal-media-container');

                if (card && overlay && modalContainer) {
                    const imgEl = card.querySelector('.project-img');
                    if (!imgEl) return;
                    const mediaNode = imgEl.querySelector('svg, img');
                    if (!mediaNode) return;

                    // Clone into modal so original card media is never removed.
                    modalContainer.innerHTML = '';
                    const modalMedia = mediaNode.cloneNode(true);
                    modalContainer.appendChild(modalMedia);
                    overlay.classList.add('active');
                    document.body.classList.add('modal-open');

                    if (mediaNode.tagName.toLowerCase() === 'svg') {
                        animateModalSvg(modalContainer);
                    }
                }
                return;
            }

            // Handle lightbox dismissal
            if (e.target.closest('.modal-close') || (e.target.classList && e.target.classList.contains('modal-overlay'))) {
                const overlay = document.querySelector('#project-modal');
                const modalContainer = document.querySelector('#modal-media-container');
                if (overlay && overlay.classList.contains('active')) {
                    overlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    setTimeout(() => {
                        // Cleanup modal media after close.
                        if (modalContainer) {
                            modalContainer.innerHTML = '';
                        }
                    }, 300);
                }
            }
        });
    }
}

function animateModalSvg(container) {
    const modalSvg = container.querySelector('svg');
    if (!modalSvg) return;

    const poly1 = modalSvg.querySelector('.p1-shape');
    const poly2 = modalSvg.querySelector('.p2-shape');
    const path3 = modalSvg.querySelector('.p3-path');
    const car3 = modalSvg.querySelector('.p3-car');

    if (poly1) {
        anime.remove(poly1);
        anime({
            targets: poly1,
            points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            duration: 2000
        });
    }

    if (poly2) {
        anime.remove(poly2);

        function generatePoints() {
            const total = anime.random(4, 64);
            const r1 = anime.random(4, 56);
            const r2 = 56;
            const isOdd = n => n % 2;
            let pStr = '';
            for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
                const r = isOdd(i) ? r1 : r2;
                const a = (2 * Math.PI * i / l) - Math.PI / 2;
                const x = 152 + Math.round(r * Math.cos(a));
                const y = 56 + Math.round(r * Math.sin(a));
                pStr += `${x},${y} `;
            }
            return pStr.trim();
        }

        (function animateRandomPoints() {
            anime({
                targets: poly2,
                points: generatePoints(),
                easing: 'easeInOutCirc',
                duration: 500,
                complete: animateRandomPoints
            });
        })();
    }

    if (path3 && car3) {
        anime.remove(path3);
        anime.remove(car3);
        path3.style.strokeDasharray = '';
        path3.style.strokeDashoffset = '0';

        const path = anime.path(path3);
        anime({
            targets: car3,
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            easing: 'linear',
            duration: 5000,
            loop: true
        });
    }
}

function bindProjectDots() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    if (!cards.length) return;

    let dotsContainer = document.querySelector('.projects-dots');
    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'projects-dots';
        grid.insertAdjacentElement('afterend', dotsContainer);
    } else {
        dotsContainer.innerHTML = '';
    }

    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'project-dot';
        dot.setAttribute('aria-label', `Go to project ${index + 1}`);
        dot.addEventListener('click', () => {
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.project-dot'));

    const setActiveDot = () => {
        const left = grid.scrollLeft;
        let activeIndex = 0;
        let minDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft - left);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
    };

    grid.addEventListener('scroll', setActiveDot, { passive: true });
    setActiveDot();
}
