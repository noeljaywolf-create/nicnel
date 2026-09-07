/* ============================================================
   NICNEL PLANT & EQUIPMENT - STOCK.JS
   Machine fleet / stock catalogue + rendering helpers.
   The admin page (admin.html) edits this data via localStorage.
   ============================================================ */

window.NICNEL = window.NICNEL || {};

/* Default fleet shown on the public site.
   status: 'available' | 'coming' | 'order'                       */
window.NICNEL_STOCK = [
    {
        id: 'hx1000l',
        model: 'HX1000L',
        category: 'Excavators',
        spec: 'Mining-scale · 100.2 t operating weight · 630 hp · 6.8 m³ bucket',
        status: 'order',
        image: 'assets/portfolio-9.jpg',
        alt: 'HD Hyundai HX1000L mining excavator',
        note: 'Import lead time around 8–12 weeks'
    },
    {
        id: 'hx520l',
        model: 'HX520L + Vibro Ripper',
        category: 'Excavators',
        spec: '52-ton class · hard-rock Vibro Ripper package',
        status: 'available',
        image: 'assets/service-4.jpg',
        alt: 'HD Hyundai HX520L excavator',
        note: 'Ripper attachment available'
    },
    {
        id: 'hx380l',
        model: 'HX380L',
        category: 'Excavators',
        spec: '38-ton class · general earthworks and mining',
        status: 'available',
        image: 'assets/portfolio-7.jpg',
        alt: 'HD Hyundai HX380L excavator'
    },
    {
        id: 'hl980',
        model: 'HL980',
        category: 'Loaders',
        spec: 'Wheel loader · high-lift loading duties',
        status: 'available',
        image: 'assets/portfolio-11.jpg',
        alt: 'HD Hyundai HL980 wheel loader'
    },
    {
        id: 'ha45',
        model: 'HA45 ADT',
        category: 'Haulage',
        spec: '45-ton articulated dump truck · haul and dump',
        status: 'available',
        image: 'assets/portfolio-8.jpg',
        alt: 'HD Hyundai HA45 articulated dump truck'
    },
    {
        id: 'hg170',
        model: 'HG170',
        category: 'Graders',
        spec: 'Motor grader · road building and finishing',
        status: 'coming',
        image: 'assets/portfolio-10.jpg',
        alt: 'HD Hyundai HG170 motor grader',
        note: 'Next import — reserve yours now'
    },
    {
        id: 'dump-truck',
        model: '8-Ton Dump Truck',
        category: 'Haulage',
        spec: 'Rigid dumper for site, quarry and mine duties',
        status: 'available',
        image: 'assets/service-2.jpg',
        alt: 'Nicnel 8-ton dump truck'
    },
    {
        id: 'skid-steer',
        model: 'Skid Steer Loader',
        category: 'Loaders',
        spec: 'Compact loader for tight sites and yards',
        status: 'available',
        image: '',
        alt: 'Compact skid steer loader'
    },
    {
        id: 'forklift',
        model: 'Forklift 3–8 t',
        category: 'Forklifts',
        spec: 'Warehouse and yard material handling',
        status: 'available',
        image: '',
        alt: 'Forklift material handling'
    }
];

(function () {
    'use strict';

    var STORAGE_KEY = 'nicnel_stock_v1';
    var WHATSAPP = '263772335063';

    function assetPath(src) {
        if (!src) return '';
        if (/^(https?:)?\/\//.test(src)) return src;
        return src;
    }

    /* Edits made in admin.html live in this browser's localStorage.
       Visiting site visitors see the shipped defaults in stock.js. */
    function getStock() {
        var saved = null;
        try {
            saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        } catch (e) { /* ignore corrupt cache */ }
        return Array.isArray(saved) && saved.length ? saved : window.NICNEL_STOCK;
    }

    function setStock(items) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function resetStock() {
        window.localStorage.removeItem(STORAGE_KEY);
    }

    function statusLabel(status) {
        return {
            available: 'Available Now',
            coming: 'Coming In',
            order: 'Made to Order'
        }[status] || 'Available Now';
    }

    function categoryIcon(category) {
        var c = String(category || '').toLowerCase();
        if (c.indexOf('excavator') > -1) return 'fa-excavator';
        if (c.indexOf('loader') > -1 || c.indexOf('skid') > -1) return 'fa-truck-monster';
        if (c.indexOf('haulage') > -1) return 'fa-truck-moving';
        if (c.indexOf('grader') > -1) return 'fa-road';
        if (c.indexOf('forklift') > -1) return 'fa-warehouse';
        return 'fa-truck';
    }

    /* Pre-filled WhatsApp price request for one machine. */
    function quoteHref(item) {
        var text = 'Hello Nicnel Plant & Equipment!' +
            '\n\nI\u2019m interested in the ' + item.model +
            ' (' + item.category + ').' +
            '\n' + item.spec +
            '\n\nPlease send me pricing and availability. Thank you.';
        return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
    }

    function cardHTML(item) {
        var icon = categoryIcon(item.category);
        var media = item.image
            ? '<div class="equipment-card__media" style="background-image:linear-gradient(rgba(0,44,95,0.30),rgba(0,44,95,0.55)),url(\''
                + assetPath(item.image) + '\');" role="img" aria-label="' + (item.alt || item.model) + '"></div>'
            : '<div class="equipment-card__media equipment-card__media--icon"><i class="fas ' + icon + '"></i></div>';

        return '<article class="equipment-card reveal">'
            + media
            + '<div class="equipment-card__body">'
            + '<span class="equip-badge equip-badge--' + item.status + '">'
            + '<i class="fas fa-circle"></i> ' + statusLabel(item.status) + '</span>'
            + '<h3>' + item.model + '</h3>'
            + '<p class="equipment-card__cat">' + item.category + '</p>'
            + '<p class="equipment-card__spec">' + item.spec + '</p>'
            + (item.note ? '<p class="equipment-card__note">' + item.note + '</p>' : '')
            + '<div class="equipment-card__actions">'
            + '<a class="btn btn--primary btn--full" href="' + quoteHref(item) + '" target="_blank" rel="noopener">'
            + '<i class="fab fa-whatsapp"></i> Request Price</a>'
            + '<a class="btn btn--outline btn--full" href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">'
            + '<i class="fas fa-spinner"></i> Check Availability</a>'
            + '</div>'
            + '</div>'
            + '</article>';
    }

    function renderFilterGrid(grid, filters) {
        if (!grid) return;
        grid.innerHTML = filters
            .map(function (f) {
                return '<button class="equip-filter' + (f.active ? ' active' : '') + '" data-filter="' + f.value + '">' + f.label + '</button>';
            })
            .join('');
    }

    function renderGrid(containerId, filterValue) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var stock = getStock();
        var list = stock;
        if (filterValue && filterValue !== 'all') {
            list = stock.filter(function (item) {
                return item.category === filterValue;
            });
        }

        container.innerHTML = list.length
            ? list.map(cardHTML).join('')
            : '<p class="equipment-card__empty">No machines in this category yet — contact us for the latest stock.</p>';

        /* re-trigger reveal animation */
        if ('IntersectionObserver' in window && window.NICNEL_REVEAL) {
            window.NICNEL_REVEAL();
        }
    }

    function wireFilters(containerId, gridId) {
        var row = document.getElementById(containerId);
        if (!row) return;
        row.addEventListener('click', function (e) {
            var btn = e.target.closest('.equip-filter');
            if (!btn) return;
            row.querySelectorAll('.equip-filter').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderGrid(gridId, btn.getAttribute('data-filter'));
        });
    }

    function initEquipment(gridId, filtersRowId) {
        var categories = ['All', 'Excavators', 'Loaders', 'Haulage', 'Graders', 'Forklifts'];
        var filters = categories.map(function (c, i) {
            var value = c === 'All' ? 'all' : c;
            return { label: c, value: value, active: i === 0 };
        });
        renderFilterGrid(document.getElementById(filtersRowId), filters);
        wireFilters(filtersRowId, gridId);
        renderGrid(gridId, 'all');
    }

    window.NICNEL = {
        STORAGE_KEY: STORAGE_KEY,
        WHATSAPP: WHATSAPP,
        getStock: getStock,
        setStock: setStock,
        resetStock: resetStock,
        statusLabel: statusLabel,
        quoteHref: quoteHref,
        renderGrid: renderGrid,
        initEquipment: initEquipment
    };
})();