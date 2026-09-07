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

    /* ===== BOOKING SYSTEM + QUICK CTA BAR ===== */
    const BOOKING = {
        whatsapp: (window.NICNEL && window.NICNEL.WHATSAPP) || '263772335063',
        calendly: window.NICNEL_BOOKING_URL || '',
        phone: '+263242758914',
        phoneLink: 'tel:+263242758914',
        email: 'nicnel@nicnel.co.zw'
    };

    const SERVICES = [
        'Equipment Demo',
        'Purchase / Pricing',
        'Plant Hire',
        'Heavy Haulage',
        'Mining & Quarry',
        'Farming & Earthworks',
        'Field Service / Spares',
        'Made to Order'
    ];

    const TIMES = ['Any time', 'Morning (08:00–12:00)', 'Afternoon (12:00–16:00)'];

    function bookingMachineOptions() {
        if (window.NICNEL && typeof window.NICNEL.machineOptions === 'function') {
            return window.NICNEL.machineOptions();
        }
        return [];
    }

    function buildBookingWidget() {
        if (document.getElementById('nbWidget')) return;
        if (window.location.pathname.indexOf('admin.html') !== -1) return;

        const machines = bookingMachineOptions();
        const machineOpts = ['Not sure / other']
            .concat(machines)
            .map(m => '<option>' + m + '</option>')
            .join('');

        const today = new Date().toISOString().split('T')[0];
        const calButton = BOOKING.calendly
            ? '<a class="btn btn--dark btn--full" href="' + BOOKING.calendly + '" target="_blank" rel="noopener noreferrer"><i class="far fa-calendar-alt"></i> Choose a Live Slot</a>'
            : '';

        const widget = document.createElement('div');
        widget.id = 'nbWidget';
        widget.innerHTML = `
            <div class="nb-bar" id="nbBar" style="display:none">
                <a class="nb-bar__btn" href="${BOOKING.phoneLink}"><i class="fas fa-phone-alt"></i> Call</a>
                <a class="nb-bar__btn" href="https://wa.me/${BOOKING.whatsapp}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                <button type="button" class="nb-bar__btn nb-bar__cta" data-open-booking><i class="far fa-calendar-check"></i> Book Demo</button>
            </div>

            <div class="nb-overlay" id="nbOverlay">
                <div class="nb-modal" role="dialog" aria-modal="true" aria-label="Book a demo">
                    <button type="button" class="nb-close" data-close-booking aria-label="Close"><i class="fas fa-times"></i></button>
                    <div class="nb-modal__head">
                        <span class="eyebrow">Book a Demo</span>
                        <h3>Schedule Your Visit</h3>
                        <p>Pick your preferred day and we'll confirm by WhatsApp or email — usually within a few hours.</p>
                    </div>
                    <form id="bookingForm" novalidate>
                        <div class="form-row">
                            <label for="bName">Full Name *</label>
                            <input type="text" id="bName" placeholder="Full name" required>
                        </div>
                        <div class="form-row">
                            <label for="bEmail">Email or WhatsApp *</label>
                            <input type="text" id="bEmail" placeholder="you@company.com or +263 ..." required>
                        </div>
                        <div class="form-row">
                            <label for="bPhone">Phone Number</label>
                            <input type="tel" id="bPhone" placeholder="+263 ...">
                        </div>
                        <div class="form-row">
                            <label for="bService">What would you like to do? *</label>
                            <select id="bService" required>
                                <option value="">Select an option</option>
                                ${SERVICES.map(s => '<option>' + s + '</option>').join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label for="bMachine">Machine (if known)</label>
                            <select id="bMachine">
                                ${machineOpts}
                            </select>
                        </div>
                        <div class="form-row">
                            <label for="bSite">Site / Location</label>
                            <input type="text" id="bSite" placeholder="e.g. Mine site, Harare">
                        </div>
                        <div class="form-row form-row--pair">
                            <div>
                                <label for="bDate">Preferred Date *</label>
                                <input type="date" id="bDate" min="${today}" required>
                            </div>
                            <div>
                                <label for="bTime">Preferred Time</label>
                                <select id="bTime">
                                    ${TIMES.map(t => '<option>' + t + '</option>').join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <label for="bMsg">Anything else?</label>
                            <textarea id="bMsg" placeholder="Tell us what you want to see or discuss"></textarea>
                        </div>
                        ${calButton}
                        <button type="submit" class="btn btn--primary btn--lg btn--full">
                            <i class="fab fa-whatsapp"></i> Send Booking Request
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        widget.style.display = 'block';
    }

    function openBooking() {
        const overlay = document.getElementById('nbOverlay');
        if (overlay) {
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            const date = document.getElementById('bDate');
            if (date && !date.value) date.value = new Date().toISOString().split('T')[0];
        }
    }

    function closeBooking() {
        const overlay = document.getElementById('nbOverlay');
        if (overlay) {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    }

    function showStickyBar() {
        const bar = document.getElementById('nbBar');
        if (bar) bar.style.display = 'flex';
    }

    function wireBooking() {
        buildBookingWidget();
        if (!document.getElementById('nbWidget')) return;

        document.querySelectorAll('[data-open-booking]').forEach(btn => {
            btn.addEventListener('click', openBooking);
        });
        document.querySelectorAll('[data-close-booking]').forEach(btn => {
            btn.addEventListener('click', closeBooking);
        });

        const overlay = document.getElementById('nbOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeBooking();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeBooking();
            });
        }

        // Sticky bottom bar on mobile; CTA buttons anywhere open booking
        const form = document.getElementById('bookingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('bName').value.trim();
                const email = document.getElementById('bEmail').value.trim();
                if (!name || !email) {
                    alert('Please fill in your name and contact details.');
                    return;
                }

                const phone = document.getElementById('bPhone').value.trim();
                const service = document.getElementById('bService').value;
                const machine = document.getElementById('bMachine').value;
                const site = document.getElementById('bSite').value.trim();
                const date = document.getElementById('bDate').value;
                const time = document.getElementById('bTime').value;
                const msg = document.getElementById('bMsg').value.trim();

                const lines = [
                    'Demo / booking request from the website:',
                    '',
                    'Name: ' + name,
                    'Contact: ' + email,
                    'Phone: ' + (phone || 'Not provided'),
                    'Service: ' + service,
                    'Machine: ' + machine,
                    'Site/Location: ' + (site || 'To confirm'),
                    'Preferred date: ' + date,
                    'Preferred time: ' + time
                ];
                if (msg) lines.push('Message: ' + msg);
                lines.push('', 'Please confirm availability. Thank you!');

                const body = lines.join('\n');
                const waURL = 'https://wa.me/' + BOOKING.whatsapp + '?text=' + encodeURIComponent(body);
                window.open(waURL, '_blank', 'noopener');

                const sb = form.querySelector('button[type="submit"]');
                const orig = sb.innerHTML;
                sb.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp…';
                sb.style.background = '#25D366';
                setTimeout(() => {
                    closeBooking();
                    form.reset();
                    sb.innerHTML = orig;
                    sb.style.background = '';
                }, 2500);
            });
        }

        showStickyBar();
    }

    // init after DOM ready if we're not on a raw asset
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireBooking);
    } else {
        wireBooking();
    }

})();
