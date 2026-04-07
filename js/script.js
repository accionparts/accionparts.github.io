// ============================================
// ACCION PARTS — Premium Interactions Engine
// ============================================

(function() {
    'use strict';

    // ── Navbar scroll effect ────────────────
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ── Mobile hamburger menu ───────────────
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Smooth scroll for anchor links ──────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── AOS Init (with scroll-up replay) ────
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,      // re-animate on scroll up!
            offset: 60,
            mirror: true,     // animate out when scrolling past
            anchorPlacement: 'top-bottom'
        });
    }

    // ── Stat counter animation ──────────────
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        const speed = 60;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / speed;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            }
            updateCounter();
        });
    }

    // Observe stats bar — re-trigger counter every time it enters viewport
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsBar);
    }

    // ── Contact form → WhatsApp redirect ────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fd = new FormData(contactForm);
            const name = fd.get('nombre') || '';
            const company = fd.get('empresa') || '';
            const city = fd.get('localidad') || '';
            const message = fd.get('mensaje') || '';

            let waText = `Hola, soy ${name}`;
            if (company) waText += ` de ${company}`;
            if (city) waText += ` (${city})`;
            waText += `. ${message || 'Quiero más información sobre sus productos.'}`;

            const waUrl = `https://wa.me/543755598210?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
        });
    }

    // ── Parallax-like effect on hero ─────────
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                const heroContent = heroSection.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scroll * 0.15}px)`;
                    heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
                }
            }
        }, { passive: true });
    }

    // ── Carousel Auto-Slider and Drag ────────
    const bannerTrack = document.getElementById('bannerTrack');
    if (bannerTrack) {
        const slides = bannerTrack.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;
        let sliderInterval;
        let isDragging = false;
        let startX = 0;
        let endX = 0;

        function moveToSlide(index) {
            if (index >= totalSlides) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = totalSlides - 1;
            } else {
                currentSlide = index;
            }
            const offset = currentSlide * -100;
            bannerTrack.style.transform = `translateX(${offset}%)`;
        }

        function nextSlide() { moveToSlide(currentSlide + 1); }
        function prevSlide() { moveToSlide(currentSlide - 1); }

        function startAuto() {
            if (totalSlides > 1) {
                clearInterval(sliderInterval);
                sliderInterval = setInterval(nextSlide, 3500);
            }
        }

        function stopAuto() {
            clearInterval(sliderInterval);
        }

        // Iniciar Slider Automático
        startAuto();

        // ── Lógica de arrastre (Touch & Mouse Swipe) ──
        function handleSwipe() {
            const threshold = 40; // Pixeles mínimos para detectar deslizamiento
            if (startX - endX > threshold) {
                nextSlide();
            } else if (endX - startX > threshold) {
                prevSlide();
            }
        }

        // Eventos táctiles (Celulares y Tablets)
        bannerTrack.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
            stopAuto();
        }, { passive: true });

        bannerTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
            startAuto();
        }, { passive: true });

        // Eventos de Mouse (Computadora)
        const container = bannerTrack.parentElement;
        container.addEventListener('mousedown', (e) => {
            startX = e.screenX;
            isDragging = true;
            stopAuto();
            container.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                endX = e.screenX;
                isDragging = false;
                handleSwipe();
                startAuto();
                container.style.cursor = 'grab';
            }
        });
        
        // Evitar comportamientos raros al sacar el mouse 
        window.addEventListener('mouseleave', () => {
             if (isDragging) {
                isDragging = false;
                startAuto();
                container.style.cursor = 'grab';
             }
        });
    }

})();
