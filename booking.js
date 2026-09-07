/* ============================================================
   NICNEL PLANT & EQUIPMENT - BOOKING.JS
   Demo-booking modal + sticky mobile quick-action bar.
   Opens a pre-filled WhatsApp message (and optional Calendly
   link when NICNEL_BOOKING_URL is set in stock.js).
   ============================================================ */

(function () {
    'use strict';

    var WHATSAPP = (window.NICNEL && window.NICNEL.WHATSAPP) || '263772335063';
    var CALENDLY = window.NICNEL_BOOKING_URL || '';
    var PHONE_LINK = 'tel:+263242758914';

    var SERVICES = [
        'Equipment Demo',
        'Purchase / Pricing',
        'Plant Hire',
        'Heavy Haulage',
        'Mining & Quarry',
        'Farming & Earthworks',
        'Field Service / Spares',
        'Made to Order'
    ];

    var TIMES = ['Any time', 'Morning (08:00\u201312:00)', 'Afternoon (12:00\u201316:00)'];

    function escapeHTML(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function machineOptions() {
        if (window.NICNEL && typeof window.NICNEL.machineOptions === 'function') {
            return window.NICNEL.machineOptions();
        }
        return [];
    }

    function isAdminPage() {
        return window.location.pathname.indexOf('admin.html') !== -1;
    }

    function buildWidget() {
        if (document.getElementById('nbWidget') || isAdminPage()) return;

        var machines = machineOptions();
        var machineOpts = ['Not sure / other'].concat(machines)
            .map(function (m) { return '<option>' + escapeHTML(m) + '</option>'; })
            .join('');
        var serviceOpts = SERVICES
            .map(function (s) { return '<option>' + escapeHTML(s) + '</option>'; })
            .join('');
        var timeOpts = TIMES
            .map(function (t) { return '<option>' + escapeHTML(t) + '</option>'; })
            .join('');

        var today = new Date().toISOString().split('T')[0];
        var calButton = CALENDLY
            ? '<a class="btn btn--dark btn--full" href="' + CALENDLY + '" target="_blank" rel="noopener noreferrer"><i class="far fa-calendar-alt"></i> Choose a Live Slot</a>'
            : '';

        var widget = document.createElement('div');
        widget.id = 'nbWidget';
        widget.innerHTML =
            '<div class="nb-bar" id="nbBar" style="display:none">'
            + '<a class="nb-bar__btn" href="' + PHONE_LINK + '"><i class="fas fa-phone-alt"></i> Call</a>'
            + '<a class="nb-bar__btn" href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>'
            + '<button type="button" class="nb-bar__btn nb-bar__cta" data-open-booking><i class="far fa-calendar-check"></i> Book Demo</button>'
            + '</div>'
            + '<div class="nb-overlay" id="nbOverlay">'
            + '<div class="nb-modal" role="dialog" aria-modal="true" aria-label="Book a demo">'
            + '<button type="button" class="nb-close" data-close-booking aria-label="Close"><i class="fas fa-times"></i></button>'
            + '<div class="nb-modal__head">'
            + '<span class="eyebrow">Book a Demo</span>'
            + '<h3>Schedule Your Visit</h3>'
            + '<p>Pick your preferred day and we\u2019ll confirm by WhatsApp or email \u2014 usually within a few hours.</p>'
            + '</div>'
            + '<form id="bookingForm" novalidate>'
            + '<div class="form-row"><label for="bName">Full Name *</label>'
            + '<input type="text" id="bName" placeholder="Full name" maxlength="80" required></div>'
            + '<div class="form-row"><label for="bEmail">Email or WhatsApp *</label>'
            + '<input type="text" id="bEmail" placeholder="you@company.com or +263 ..." maxlength="120" required></div>'
            + '<div class="form-row"><label for="bPhone">Phone Number</label>'
            + '<input type="tel" id="bPhone" placeholder="+263 ..." maxlength="30"></div>'
            + '<div class="form-row"><label for="bService">What would you like to do? *</label>'
            + '<select id="bService" required><option value="">Select an option</option>' + serviceOpts + '</select></div>'
            + '<div class="form-row"><label for="bMachine">Machine (if known)</label>'
            + '<select id="bMachine">' + machineOpts + '</select></div>'
            + '<div class="form-row"><label for="bSite">Site / Location</label>'
            + '<input type="text" id="bSite" placeholder="e.g. Mine site, Harare" maxlength="120"></div>'
            + '<div class="form-row form-row--pair">'
            + '<div><label for="bDate">Preferred Date *</label>'
            + '<input type="date" id="bDate" min="' + today + '" required></div>'
            + '<div><label for="bTime">Preferred Time</label>'
            + '<select id="bTime">' + timeOpts + '</select></div>'
            + '</div>'
            + '<div class="form-row"><label for="bMsg">Anything else?</label>'
            + '<textarea id="bMsg" placeholder="Tell us what you want to see or discuss" maxlength="600"></textarea></div>'
            + calButton
            + '<button type="submit" class="btn btn--primary btn--lg btn--full">'
            + '<i class="fab fa-whatsapp"></i> Send Booking Request</button>'
            + '</form>'
            + '</div>'
            + '</div>';

        document.body.appendChild(widget);
    }

    function openBooking() {
        var overlay = document.getElementById('nbOverlay');
        if (!overlay) return;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        var date = document.getElementById('bDate');
        if (date && !date.value) date.value = new Date().toISOString().split('T')[0];
    }

    function closeBooking() {
        var overlay = document.getElementById('nbOverlay');
        if (!overlay) return;
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function buildMessage(fields) {
        var lines = [
            'Demo / booking request from the website:',
            '',
            'Name: ' + fields.name,
            'Contact: ' + fields.email,
            'Phone: ' + (fields.phone || 'Not provided'),
            'Service: ' + fields.service,
            'Machine: ' + fields.machine,
            'Site/Location: ' + (fields.site || 'To confirm'),
            'Preferred date: ' + fields.date,
            'Preferred time: ' + fields.time
        ];
        if (fields.msg) lines.push('Message: ' + fields.msg);
        lines.push('', 'Please confirm availability. Thank you!');
        return lines.join('\n');
    }

    function wireEvents() {
        document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
            btn.addEventListener('click', openBooking);
        });
        document.querySelectorAll('[data-close-booking]').forEach(function (btn) {
            btn.addEventListener('click', closeBooking);
        });

        var overlay = document.getElementById('nbOverlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeBooking();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeBooking();
            });
        }

        var form = document.getElementById('bookingForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('bName').value.trim();
            var email = document.getElementById('bEmail').value.trim();
            if (!name || !email) {
                alert('Please fill in your name and contact details.');
                return;
            }

            var fields = {
                name: name,
                email: email,
                phone: document.getElementById('bPhone').value.trim(),
                service: document.getElementById('bService').value,
                machine: document.getElementById('bMachine').value,
                site: document.getElementById('bSite').value.trim(),
                date: document.getElementById('bDate').value,
                time: document.getElementById('bTime').value,
                msg: document.getElementById('bMsg').value.trim()
            };

            var body = buildMessage(fields);
            var waURL = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(body);
            window.open(waURL, '_blank', 'noopener');

            var sb = form.querySelector('button[type="submit"]');
            var orig = sb.innerHTML;
            sb.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp\u2026';
            sb.style.background = '#25D366';
            setTimeout(function () {
                closeBooking();
                form.reset();
                sb.innerHTML = orig;
                sb.style.background = '';
            }, 2500);
        });

        var bar = document.getElementById('nbBar');
        if (bar) bar.style.display = 'flex';
    }

    function init() {
        buildWidget();
        var overlay = document.getElementById('nbOverlay');
        if (overlay) {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
        wireEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();