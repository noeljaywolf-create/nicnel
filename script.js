/* ============================================================
   NICNEL PLANT & EQUIPMENT - SCRIPT.JS
   Professional interactions & animations
   ============================================================ */

(function () {
    'use strict';

    /* ===== MOBILE MENU ===== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* ===== HEADER SCROLL STATE ===== */
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('header--scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ===== SCROLL REVEAL ANIMATIONS ===== */
    let revealObserver = null;

    function setupReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        if (revealElements.length) {
            if (revealObserver) revealObserver.disconnect();

            if ('IntersectionObserver' in window) {
                revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.12,
                    rootMargin: '0px 0px -40px 0px'
                });

                revealElements.forEach(el => revealObserver.observe(el));
            } else {
                // Fallback: show everything
                revealElements.forEach(el => el.classList.add('in-view'));
            }
        }
    }

    setupReveal();

    // Exposed so freshly-rendered cards (e.g. equipment page) can animate too
    window.NICNEL_REVEAL = setupReveal;

    /* ===== COUNT-UP STATS ===== */
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        const duration = 1600;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(eased * target);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        const statNumbers = statsGrid.querySelectorAll('[data-count]');

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(animateCount);
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });

        statsObserver.observe(statsGrid);
    }

    /* ===== PORTFOLIO FILTERING ===== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const show = filter === 'all' || category === filter;

                    if (show) {
                        card.classList.remove('hide');
                        card.style.animation = 'none';
                        // Force reflow to restart animation
                        void card.offsetWidth;
                        card.style.animation = '';
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    /* ===== CONTACT FORM ===== */
    const contactForm = document.getElementById('contactForm');
    const WHATSAPP_NUMBER = (window.NICNEL && window.NICNEL.WHATSAPP) || '263772335063';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!name || !email) {
                alert('Please fill in your name and email address.');
                return;
            }

            const phone = (document.getElementById('phone') || {}).value?.trim() || '';
            const interestEl = document.getElementById('interest');
            const interest = interestEl ? interestEl.options[interestEl.selectedIndex]?.text || '' : '';
            const message = (document.getElementById('message') || {}).value.trim() || '';

            const lines = [
                'New enquiry from the Nicnel website:',
                '',
                'Name: ' + name,
                'Email: ' + email,
                'Phone: ' + (phone || 'Not provided'),
                'Interested in: ' + (interest || 'General enquiry')
            ];
            if (message) lines.push('Message: ' + message);
            lines.push('', 'Please respond with pricing / details. Thank you.');

            const body = lines.join('\n');
            const waURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(body);

            const button = contactForm.querySelector('button[type="submit"]');
            const originalHTML = button.innerHTML;

            // open WhatsApp to send the enquiry straight to Nicnel
            window.open(waURL, '_blank', 'noopener');

            button.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp…';
            button.style.background = '#25D366';
            button.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.35)';

            setTimeout(() => {
                contactForm.reset();
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.style.boxShadow = '';
            }, 3000);
        });
    }

    /* ===== HERO ANIMATION (first paint) ===== */
    // Ensure the hero content animates in on load even without scroll
    const heroBadge = document.querySelector('.hero__badge');
    if (heroBadge) {
        // The reveal class handles it via observer; nothing extra needed.
    }

})();
