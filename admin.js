/* ============================================================
   NICNEL PLANT & EQUIPMENT - ADMIN.JS
   Self-serve stock editor. Password-protected (simple client
   gate). Reads/writes the same localStorage fleet as stock.js.
   ============================================================ */

(function () {
    'use strict';

    var PASS_SALT = 'nicnel';
    var ADMIN_PASS = 'nicnel2026';
    var SESSION_KEY = 'nicnel_admin_session';

    function hash(pass, salt) {
        // minimal non-cryptographic obfuscation (client-side only)
        var str = (pass || '') + (salt || '');
        var h = 2166136261;
        for (var i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        return (h >>> 0).toString(16);
    }

    function isAuthed() {
        return sessionStorage.getItem(SESSION_KEY) === hash(ADMIN_PASS, PASS_SALT);
    }

    function login() {
        var input = document.getElementById('adminPass');
        if (!input) return;
        if (input.value === ADMIN_PASS) {
            sessionStorage.setItem(SESSION_KEY, hash(ADMIN_PASS, PASS_SALT));
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('editorScreen').style.display = 'block';
            loadEditor();
        } else {
            alert('Incorrect password.');
        }
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('editorScreen').style.display = 'none';
    }

    function loadEditor() {
        var rows = document.getElementById('rows');
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
            { v: '', t: '(No photo — use icon)' },
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

        var catSel = document.createElement('select');
        cats.forEach(function (c) {
            var o = document.createElement('option');
            o.value = c;
            o.textContent = c;
            if ((item.category || 'Excavators') === c) o.selected = true;
            catSel.appendChild(o);
        });

        var imgSel = document.createElement('select');
        IMAGES.forEach(function (im) {
            var o = document.createElement('option');
            o.value = im.v;
            o.textContent = im.t;
            if ((item.image || '') === im.v) o.selected = true;
            imgSel.appendChild(o);
        });

        var select = document.createElement('select');
        ['available', 'coming', 'order'].forEach(function (s) {
            var o = document.createElement('option');
            o.value = s;
            o.textContent = NICNEL.statusLabel(s);
            if (item.status === s) o.selected = true;
            select.appendChild(o);
        });

        var cellCat = document.createElement('td');
        cellCat.appendChild(catSel);
        var cellSelect = document.createElement('td');
        cellSelect.appendChild(select);
        var cellImg = document.createElement('td');
        cellImg.appendChild(imgSel);

        var inpModel = document.createElement('input');
        inpModel.value = item.model || '';
        inpModel.className = 'w-model';
        var inpSpec = document.createElement('input');
        inpSpec.value = item.spec || '';
        inpSpec.className = 'w-spec';
        var inpNote = document.createElement('input');
        inpNote.value = item.note || '';
        inpNote.className = 'w-note';

        var cellModel = document.createElement('td');
        cellModel.className = 'cell-model';
        cellModel.appendChild(inpModel);
        var cellSpec = document.createElement('td');
        cellSpec.appendChild(inpSpec);
        var cellNote = document.createElement('td');
        cellNote.appendChild(inpNote);

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'del';
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.title = 'Delete machine';
        var cellAct = document.createElement('td');
        cellAct.className = 'cell-act';
        cellAct.appendChild(delBtn);

        delBtn.addEventListener('click', function () {
            tr.remove();
        });

        [cellCat, cellSelect, cellModel, cellSpec, cellImg, cellNote, cellAct].forEach(function (c) { tr.appendChild(c); });
        return tr;
    }

    function collect() {
        var out = [];
        document.querySelectorAll('#rows .item-row').forEach(function (tr) {
            var model = tr.querySelector('.w-model').value.trim();
            var spec = tr.querySelector('.w-spec').value.trim();
            var note = tr.querySelector('.w-note').value.trim();
            var selAll = tr.querySelectorAll('select');
            var category = selAll[0].value;
            var status = selAll[1].value;
            var image = selAll[2].value;
            if (!model) return;
            out.push({
                id: tr.dataset.id,
                model: model,
                category: category,
                spec: spec,
                status: status,
                note: note,
                image: image,
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
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(function () { btn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }, 1800);
    }

    function addRow() {
        var tr = rowHTML({
            id: 'new-' + Date.now(),
            model: '',
            spec: '',
            status: 'available',
            note: ''
        });
        document.getElementById('rows').appendChild(tr);
        tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tr.querySelector('.w-model').focus();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var loginBtn = document.getElementById('loginBtn');
        var passInput = document.getElementById('adminPass');
        if (loginBtn) loginBtn.addEventListener('click', login);
        if (passInput) {
            passInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') login();
            });
        }

        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        var saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.addEventListener('click', save);

        var saveBtn2 = document.getElementById('saveBtn2');
        if (saveBtn2) saveBtn2.addEventListener('click', save);

        var addBtn = document.getElementById('addBtn');
        if (addBtn) addBtn.addEventListener('click', addRow);

        if (isAuthed()) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('editorScreen').style.display = 'block';
            loadEditor();
        }
    });
})();