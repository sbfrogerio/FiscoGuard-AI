/* ============================================================
   FISCOGUARD AI — Main JavaScript
   Scroll Reveal · Navbar Scroll · Mobile Menu · Form Handler
   ============================================================ */

(function () {
    'use strict';

    // --- Scroll Reveal (Intersection Observer) ---
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    // --- Navbar Scroll Effect ---
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 80) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Mobile Menu Toggle ---
    function initMobileMenu() {
        const toggle = document.getElementById('menuBtn');
        const links = document.getElementById('menu');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');

            const isExpanded = toggle.classList.contains('active');
            toggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close on link click
        links.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                toggle.classList.remove('active');
                links.classList.remove('open');
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });
    }

    // --- Active Nav Link Highlight ---
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.menu a[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach((link) => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-80px 0px -50% 0px',
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    // --- Phone Mask ---
    function initPhoneMask() {
        const phoneInput = document.getElementById('telefone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
            } else if (value.length > 3) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }

            e.target.value = value;
        });
    }

    // --- Form Submit Handler ---
    function initFormHandler() {
        const form = document.getElementById('leadForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const perfil = document.getElementById('perfil').value;

            // Basic validation
            if (!nome || !email || !telefone || !perfil) {
                e.preventDefault();
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                return;
            }

            // Save to localStorage (optional for UX on thank-you page)
            localStorage.setItem('fiscoguard_lead', JSON.stringify({
                nome,
                email,
                telefone,
                perfil,
                timestamp: new Date().toISOString()
            }));

            // No e.preventDefault() here means the browser will naturally POST 
            // the data to the form's action URL (FormSubmit).
        });
    }

    // --- Parallax Subtle Effect on Hero ---
    function initParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual || window.innerWidth < 768) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
        });
    }

    // --- Init All ---
    function init() {
        initScrollReveal();
        initNavbarScroll();
        initMobileMenu();
        initSmoothScroll();
        initActiveNavLink();
        initPhoneMask();
        initFormHandler();
        initParallax();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
