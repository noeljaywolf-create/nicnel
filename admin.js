/* ============================================================
   NICNEL PLANT & EQUIPMENT - ADMIN.JS
   Self-serve stock editor for admin.html.

   Security notes
   - No password is stored or compared in plain text. The login
     verifies a salted SHA-256 digest using the Web Crypto API.
   - Failed login attempts are rate-limited with a 15-minute lockout.
   - On static hosting this is a client-side gate: it stops casual
     or accidental edits but cannot replace a real server-side
     login. For production, host a backend-controlled CMS and
     protect admin.html behind server authentication.
   ============================================================ */

(function () {
    'use strict';

    var PASS_SALT = 'Z5QNP9Kx2wV7mT4c';
    var PASS_HASH = 'b165872bc1231a8006846143fc8809e32d623d767aa29c8316a0a00a5d52f8e0';
    var SESSION_KEY = 'nicnel_admin_session';
    var LOCK_KEY = 'nicnel_admin_lock';
    var MAX_ATTEMPTS = 5;
    var LOCK_MS = 15 * 60 * 1000; // 15 minutes

    /* ---------- crypto helpers ---------- */

    function cryptoAvailable() {
        return window.crypto && window.crypto.subtle && window.TextEncoder;
    }

    function sha256Hex(str) {
        return crypto.subtle
            .digest('SHA-256', new TextEncoder().encode(str))
            .then(function (buf) {
                var bytes = new Uint8Array(buf);
                var hex = '';
                for (var i = 0; i < bytes.length; i++) {
                    hex += ('0' + bytes[i].toString(16)).slice(-2);
                }
                return hex;
            });
    }

    /* constant-time compare to avoid leaking the digest length/timing */
    function safeEqual(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    }

    /* ---------- login state ---------- */

    function isAuthed() {
        try {
            return safeEqual(sessionStorage.getItem(SESSION_KEY) || '', PASS_HASH);
        } catch (e) {
            return false;
        }
    }

    function lockInfo() {
        try {
            return JSON.parse(localStorage.getItem(LOCK_KEY)) || null;
        } catch (e) {
            return null;
        }
    }

    function isLocked() {
        var lock = lockInfo();
        if (!lock) return false;
        return lock.fails >= MAX_ATTEMPTS && (Date.now() - lock.first) < LOCK_MS;
    }

    function lockRemaining() {
        var lock = lockInfo();
        if (!lock) return 0;
        var left = LOCK_MS - (Date.now() - lock.first);
        return left > 0 ? Math.ceil(left / 60000) : 0;
    }

    function recordFailure() {
        var lock = lockInfo();
        var now = Date.now();
        if (!lock || (now - lock.first) >= LOCK_MS) {
            lock = { fails: 1, first: now };
        } else {
            lock.fails += 1;
        }
        try {
            localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
        } catch (e) { /* storage unavailable - ignore */ }
    }

    function clearLock() {
        try {
            localStorage.removeItem(LOCK_KEY);
        } catch (e) { /* ignore */ }
    }

    function showLoginError(msg) {
        var el = document.getElementById('loginError');
        if (el) {
            el.style.display = 'block';
            el.textContent = msg;
        }
    }

    function hideLoginError() {
        var el = document.getElementById('loginError');
        if (el) {
            el.style.display = 'none';
            el.textContent = '';
        }
    }

    function enterEditor() {
        hideLoginError();
        clearLock();
        try {
            sessionStorage.setItem(SESSION_KEY, PASS_HASH);
        } catch (e) { /* ignore */ }
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('editorScreen').style.display = 'block';
        loadEditor();
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('editorScreen').style.display = 'none';
        hideLoginError();
    }

    function login() {
        var input = document.getElementById('adminPass');
        if (!input) return;

        hideLoginError();

        if (isLocked()) {
            showLoginError('Too many failed attempts. Try again in about ' + lockRemaining() + ' min.');
            input.select();
            return;
        }

        var pwd = input.value || '';

        if (!cryptoAvailable()) {
            showLoginError('Secure login unavailable in this browser. Use a modern browser over HTTPS.');
            return;
        }

        sha256Hex(pwd + PASS_SALT).then(function (digest) {
            if (safeEqual(digest, PASS_HASH)) {
                enterEditor();
                input.value = '';
            } else {
                recordFailure();
                var lock = lockInfo();
                var remaining = lock && lock.fails >= MAX_ATTEMPTS
                    ? ' Locked for about ' + lockRemaining() + ' min.'
                    : '';
                showLoginError('Incorrect password.' + remaining);
                input.select();
            }
        });
    }

    /* ---------- editor ---------- */

    function loadEditor() {
        var rows = document.getElementById('rows');
        if (!rows) return;
        rows.innerHTML = '';
        NICNEL.getStock().forEach(function (item) {
            rows.appendChild(rowHTML(item));
        });
    }

    function rowHTML(item) {
        var tr = document.createElement('tr');
        tr.className = 'item-row';
        tr.dataset.id = item.id || '';

        var cats = ['Excavators', 'Loaders', 'Haulage', 'Graders', 'Forklifts'];
        var IMAGES = [
            { v: '', t: '(No photo - use icon)' },
            { v: 'assets/portfolio-9.jpg', t: 'HX1000L (mining)' },
            { v: 'assets/service-4.jpg', t: 'HX520L' },
            { v: 'assets/portfolio-7.jpg', t: 'HX380L' },
            { v: 'assets/portfolio-11.jpg', t: 'HL980 loader' },
            { v: 'assets/portfolio-8.jpg', t: 'HA45 ADT' },
            { v: 'assets/portfolio-10.jpg', t: 'HG170 grader' },
            { v: 'assets/service-2.jpg', t: 'Dump truck' },
            { v: 'assets/portfolio-6.jpg', t: 'ADT / haulage' },
            { v: 'assets/service-1.jpg', t: 'HX1000AL' }
        ];

        var mkSelect = function (opts, selected) {
            var sel = document.createElement('select');
            opts.forEach(function (o) {
                var el = document.createElement('option');
                el.value = o.v;
                el.textContent = o.t;
                if (selected === o.v) el.selected = true;
                sel.appendChild(el);
            });
            return sel;
        };

        var catSel = mkSelect(cats.map(function (c) { return { v: c, t: c }; }), item.category || 'Excavators');
        var imgSel = mkSelect(IMAGES, item.image || '');
        var statusSel = mkSelect(
            ['available', 'coming', 'order'].map(function (s) {
                return { v: s, t: NICNEL.statusLabel(s) };
            }),
            item.status || 'available'
        );

        var mkInput = function (cls, val, max) {
            var inp = document.createElement('input');
            inp.value = val || '';
            inp.className = cls;
            inp.maxLength = max;
            return inp;
        };

        var inpModel = mkInput('w-model', item.model, 60);
        var inpSpec = mkInput('w-spec', item.spec, 200);
        var inpNote = mkInput('w-note', item.note, 160);

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'del';
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.title = 'Delete machine';
        delBtn.addEventListener('click', function () { tr.remove(); });

        var cellAct = document.createElement('td');
        cellAct.className = 'cell-act';
        cellAct.appendChild(delBtn);

        [
            wrap(catSel), wrap(statusSel), wrap(inpModel),
            wrap(inpSpec), wrap(imgSel), wrap(inpNote), cellAct
        ].forEach(function (c) { tr.appendChild(c); });

        return tr;
    }

    function wrap(node) {
        var td = document.createElement('td');
        td.appendChild(node);
        return td;
    }

    function collect() {
        var out = [];
        document.querySelectorAll('#rows .item-row').forEach(function (tr) {
            var selAll = tr.querySelectorAll('select');
            var model = tr.querySelector('.w-model').value.trim();
            var spec = tr.querySelector('.w-spec').value.trim();
            var note = tr.querySelector('.w-note').value.trim();
            if (!model) return;
            out.push({
                id: tr.dataset.id,
                model: model.slice(0, 60),
                category: selAll[0].value,
                status: selAll[1].value,
                image: selAll[2].value,
                spec: spec.slice(0, 200),
                note: note.slice(0, 160),
                alt: model + ' - Nicnel stock'
            });
        });
        return out;
    }

    function save() {
        var items = collect();
        if (!items.length) {
            alert('Add at least one machine before saving.');
            return;
        }
        NICNEL.setStock(items);
        var btn = document.getElementById('saveBtn');
        var orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(function () { btn.innerHTML = orig; }, 1800);
    }

    function addRow() {
        var tr = rowHTML({ id: 'new-' + Date.now(), model: '', spec: '', note: '', status: 'available' });
        document.getElementById('rows').appendChild(tr);
        tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tr.querySelector('.w-model').focus();
    }

    /* ---------- boot ---------- */

    document.addEventListener('DOMContentLoaded', function () {
        var passInput = document.getElementById('adminPass');
        if (passInput) {
            passInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') login();
            });
        }
        var loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.addEventListener('click', login);

        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        var saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.addEventListener('click', save);

        var saveBtn2 = document.getElementById('saveBtn2');
        if (saveBtn2) saveBtn2.addEventListener('click', save);

        var addBtn = document.getElementById('addBtn');
        if (addBtn) addBtn.addEventListener('click', addRow);

        if (isAuthed()) {
            enterEditor();
        }
    });
})();