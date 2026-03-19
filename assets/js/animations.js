// ========================================
// INTERSECTION OBSERVER POUR ANIMATIONS AU SCROLL
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Configuration de l'Intersection Observer
    const observerOptions = {
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: '0px 0px -100px 0px' // Déclenche 100px avant que l'élément soit visible
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            // Quand l'élément devient visible
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // ========================================
    // ANIMER LES SECTIONS
    // ========================================

    // Titre et description des sections
    const sectionTitles = document.querySelectorAll(
        '.skills-header h2, .skills-header p, .section-project h2'
    );
    sectionTitles.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });

    // ========================================
    // ANIMER LES CARTES DE COMPÉTENCES
    // ========================================

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(element => {
        element.classList.add('card-animate');
        observer.observe(element);
    });

    // ========================================
    // ANIMER LES CARTES DE PROJETS
    // ========================================

    const projectCards = document.querySelectorAll('.feature');
    projectCards.forEach(element => {
        element.classList.add('card-animate');
        observer.observe(element);
    });

    // ========================================
    // ANIMER LES SKILL TAGS
    // ========================================

    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(element => {
        element.classList.add('skill-tag-animate');
        observer.observe(element);
    });

    // ========================================
    // ANIMER LES CARTES DE CONTACT
    // ========================================

    const contactCards = document.querySelectorAll('.section-contact .card');
    contactCards.forEach(element => {
        element.classList.add('card-animate');
        observer.observe(element);
    });

    // ========================================
    // ANIMER LE HERO (texte et terminal)
    // IMPORTANT: Faire ça en dernier pour éviter les conflits
    // ========================================

    // Attendre que tout soit chargé
    window.addEventListener('load', function () {
        const heroTitle = document.querySelector('.presentation h1');
        const heroText = document.querySelector('.presentation p.lead');
        const buttons = document.querySelectorAll('.presentation .btn');
        const terminal = document.querySelector('.terminal-container');

        // Afficher immédiatement le héro
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
            heroTitle.classList.add('fade-in', 'in-view');
        }

        if (heroText) {
            setTimeout(() => {
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateY(0)';
                heroText.classList.add('fade-in', 'in-view');
            }, 100);
        }

        buttons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
                btn.classList.add('fade-in', 'in-view');
            }, 200 + (index * 100));
        });

        if (terminal) {
            setTimeout(() => {
                terminal.style.opacity = '1';
                terminal.style.transform = 'translateX(0)';
                terminal.classList.add('fade-in', 'in-view');
            }, 300);
        }
    });

    // ========================================
    // SMOOTH SCROLL POUR LES ANCRES
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ne pas interférer avec les contrôles Bootstrap
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// FONCTION POUR AJOUTER DES ANIMATIONS DYNAMIQUEMENT
// ========================================

function animateOnScroll(selector, animationClass = 'card-animate') {
    const elements = document.querySelectorAll(selector);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    elements.forEach(element => {
        element.classList.add(animationClass);
        observer.observe(element);
    });
}

animateOnScroll('.ma-classe', 'fade-in');


// Gestion de l'accordéon
document.querySelectorAll('[data-accordion-trigger]').forEach(button => {
    button.addEventListener('click', function () {
        const item = this.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('active');

        // Fermer tous les autres items
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = '0';
            }
        });

        // Toggle l'item actuel
        if (isOpen) {
            item.classList.remove('active');
            content.style.maxHeight = '0';
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// Re-adjust height on window resize
window.addEventListener('resize', () => {
    document.querySelectorAll('.accordion-item.active').forEach(item => {
        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});