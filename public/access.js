(function () {
  // shortcut: lock is UI-only; app.js ships all content to every logged-in user. Move content behind an API if it must be secret.
  var A = window.__access;
  if (!A) return;
  A.requests = A.requests || [];
  var warned = {};
  function warn(n) { if (!warned[n]) { warned[n] = 1; console.warn('access.js: hook missing: ' + n); } }
  function q(sel) { return document.querySelector(sel); }
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function roleById(id) { for (var i = 0; i < ROLES.length; i++) if (ROLES[i].id === id) return ROLES[i]; return null; }

  var extra = A.roles || [];
  function granted(id) { return id === A.role || extra.indexOf(id) >= 0; }

  var ok = {};
  if (!A.admin) {
    [A.role].concat(extra).forEach(function (id) {
      var r = id && roleById(id);
      if (r) ['w', 'g', 'p'].forEach(function (k) { r[k].forEach(function (m) { ok[m] = 1; }); });
    });
    (A.mods || []).forEach(function (m) { ok[m] = 1; });
  }
  function allowed(id) { return A.admin || !!ok[id]; }

  function pending(type, target) {
    for (var i = 0; i < A.requests.length; i++) { var r = A.requests[i]; if (r.type === type && r.target === target) return r; }
    return null;
  }
  function post(url, body) {
    return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return [r.ok, d]; }); });
  }
  // Sends a request; on success records it and calls done(); on failure shows the error on the button.
  function request(btn, type, target, done) {
    btn.disabled = true;
    post('/api/requests', { type: type, target: target }).then(function (x) {
      if (x[0] && x[1].request) { if (!pending(type, target)) A.requests.push(x[1].request); done(); }
      else { btn.textContent = x[1].error || 'Gagal, coba lagi'; setTimeout(function () { btn.disabled = false; }, 1500); }
    }).catch(function () { btn.textContent = 'Jaringan bermasalah'; btn.disabled = false; });
  }
  function reqBtn(type, target, label, cls) {
    var p = pending(type, target);
    return '<button class="btn ' + (cls || 'pri') + '" data-req="' + type + '" data-t="' + h(target) + '"' + (p ? ' disabled' : '') + '>' + (p ? 'Menunggu persetujuan admin' : label) + '</button>';
  }
  function bindReq(root, done) {
    root.querySelectorAll('[data-req]').forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); request(b, b.dataset.req, b.dataset.t, done); };
    });
  }

  // Active role: keep S.role if granted, else fall back to the primary role.
  if (!A.admin && A.role && !granted(S.role)) { S.role = A.role; save(); }

  // ---- no role yet: full-page picker
  function needsPicker() { return !A.admin && !A.role; }
  function picker() {
    var v = q('#view'); if (!v) return;
    var sel = null;
    v.innerHTML = '<div class="eyebrow">Langkah pertama</div><h1>Pilih role kamu</h1><p class="lead">Role menentukan modul yang terbuka untukmu. Pilihan ini sekali saja; mengganti role nanti lewat persetujuan admin.</p>' +
      RGRP.map(function (g) {
        return '<h2>' + h(g[1]) + '</h2><div class="rolegrid">' + ROLES.filter(function (r) { return r.grp === g[0]; }).map(function (r) {
          return '<a href="#" class="rolecard" data-r="' + r.id + '"><span class="row"><b>' + h(r.t) + '</b></span><small>' + h(r.d) + '</small><span class="cnt"><span class="pill rel-w">' + r.w.length + ' inti</span><span class="pill rel-g">' + r.g.length + ' general</span><span class="pill rel-p">' + r.p.length + ' pendukung</span></span></a>';
        }).join('') + '</div>';
      }).join('') +
      '<div style="position:sticky;bottom:0;padding:12px 0;background:var(--bg,var(--surface))"><p id="pkMsg" style="color:#b00020;font-size:13px;margin:0 0 6px"></p><button class="btn pri" id="pkGo" disabled style="width:100%">Pilih role dulu</button></div>';
    var go = q('#pkGo');
    v.querySelectorAll('[data-r]').forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault(); sel = a.dataset.r;
        v.querySelectorAll('[data-r]').forEach(function (x) { x.classList.toggle('on', x === a); });
        go.disabled = false; go.textContent = 'Pilih ' + roleById(sel).t;
      };
    });
    go.onclick = function () {
      go.disabled = true;
      post('/api/role', { role: sel }).then(function (x) {
        if (x[0] || x[1].error === 'Role sudah dipilih') location.reload();
        else { q('#pkMsg').textContent = x[1].error || 'Gagal'; go.disabled = false; }
      }).catch(function () { q('#pkMsg').textContent = 'Jaringan bermasalah'; go.disabled = false; });
    };
  }

  // ---- module lock page
  var rm = window.renderModule;
  if (typeof rm === 'function') {
    window.renderModule = function (id) {
      if (allowed(id)) return rm.apply(this, arguments);
      var m = MOD[id], v = q('#view'); if (!m || !v) return rm.apply(this, arguments);
      var draw = function () {
        v.innerHTML = '<header class="pagehero"><div class="eyebrow">' + h(m.code) + ' · Terkunci</div><h1>' + h(m.title) + '</h1><p class="lead">' + m.sum + '</p></header>' +
          '<div class="callout warn"><b>🔒 Modul ini di luar role kamu.</b>Minta akses ke admin untuk membuka materi dan kuis modul ini. Simulator, studi kasus, dan flashcard tetap terbuka.</div>' +
          '<div class="row" style="margin-top:14px">' + reqBtn('mod', id, 'Minta akses ke admin') + '<a class="btn ghost" href="#modul">← Katalog modul</a></div>';
        bindReq(v, draw);
      };
      draw();
    };
  } else warn('renderModule');

  // ---- locked pill on module cards
  var mc = window.modCard;
  if (typeof mc === 'function') {
    window.modCard = function (m) {
      var s = mc.apply(this, arguments);
      if (allowed(m.id)) return s;
      return s.replace('class="card modcard"', 'class="card modcard" style="opacity:.6"')
        .replace('<span class="row" style="gap:4px">', '<span class="row" style="gap:4px"><span class="pill warn">🔒 Terkunci</span>');
    };
  } else warn('modCard');

  // ---- roles pages
  var rr = window.renderRoles;
  if (typeof rr === 'function') {
    window.renderRoles = function () { rr.apply(this, arguments); var n = q('#noRole'); if (n) n.remove(); };
  } else warn('renderRoles');

  var rd = window.renderRoleDetail;
  if (typeof rd === 'function') {
    window.renderRoleDetail = function (id) {
      rd.apply(this, arguments);
      var b = q('#pickRole'); if (!b || A.admin) return;
      if (granted(id)) { b.textContent = 'Jadikan jalur aktif'; return; }
      var again = function () { window.renderRoleDetail(id); };
      var box = document.createElement('span');
      box.className = 'row';
      box.innerHTML = reqBtn('switch', id, 'Minta ganti ke role ini') + reqBtn('role', id, 'Minta sebagai role tambahan', 'ghost');
      b.replaceWith(box);
      bindReq(box, again);
    };
  } else warn('renderRoleDetail');

  // ---- home: add-on suggestions
  function suggestions() {
    var ar = roleById(S.role); if (!ar || A.admin) return [];
    var count = {};
    ROLES.forEach(function (x) {
      if (x.id === ar.id) return;
      if (!(x.grp === ar.grp || x.w.some(function (m) { return ar.w.indexOf(m) >= 0; }))) return;
      ['w', 'g', 'p'].forEach(function (k) { x[k].forEach(function (m) { if (!allowed(m)) count[m] = (count[m] || 0) + 1; }); });
    });
    return Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 6);
  }
  var rh = window.renderHome;
  if (typeof rh === 'function') {
    window.renderHome = function () {
      rh.apply(this, arguments);
      var ids = suggestions(), v = q('#view'); if (!ids.length || !v) return;
      var sec = document.createElement('section');
      var draw = function () {
        sec.innerHTML = '<h2>Saran modul add-on</h2><p class="muted" style="max-width:72ch">Modul di luar role-mu yang sering dipakai role sejenis. Minta akses ke admin bila perlu.</p><div class="grid g3">' +
          ids.map(function (id) {
            var m = MOD[id];
            return '<div class="card modcard"><div class="top"><span class="code">' + h(m.code) + ' · ' + h(m.dur) + '</span><span class="pill warn">🔒 Terkunci</span></div><h3>' + h(shortT(m)) + '</h3><p>' + m.sum + '</p>' + reqBtn('mod', id, 'Minta akses', 'sm') + '</div>';
          }).join('') + '</div>';
        bindReq(sec, draw);
      };
      draw(); v.appendChild(sec);
    };
  } else warn('renderHome');

  // ---- boot: re-render with hooks in place; keep the picker in front while no role is set.
  if (typeof route === 'function') {
    route();
    if (needsPicker()) {
      picker();
      // app.js's hashchange listener holds the original route(); ours runs after it.
      window.addEventListener('hashchange', picker);
    }
  } else warn('route');
})();
