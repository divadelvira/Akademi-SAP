(function () {
  // shortcut: lock is UI-only; app.js ships all content to every logged-in user. Move content behind an API if it must be secret.
  var A = window.__access;
  if (!A) return;
  A.requests = A.requests || [];
  var LOCK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
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
  // ---- cart: modules and extra roles are "bought" together; checkout sends one batch request + opens admin WhatsApp.
  S.cart = Array.isArray(S.cart) ? S.cart.filter(function (c) { return !pending(c.type, c.target) && !(c.type === 'mod' ? allowed(c.target) : granted(c.target)); }) : [];
  function inCart(type, target) { return S.cart.some(function (c) { return c.type === type && c.target === target; }); }
  function itemName(c) { var m = c.type === 'mod' ? MOD[c.target] : roleById(c.target); return m ? (c.type === 'mod' ? m.code + ' · ' + shortT(m) + ' (modul)' : m.t + ' (role tambahan)') : c.target; }
  function cartBtn(type, target, cls) {
    if (pending(type, target)) return '<button class="btn ' + (cls || '') + '" disabled>Menunggu persetujuan admin</button>';
    var on = inCart(type, target);
    return '<button class="btn ' + (cls || '') + (on ? ' ghost' : '') + '" data-cart="' + type + '" data-t="' + h(target) + '" aria-pressed="' + on + '">' + (on ? '✓ Di keranjang · hapus' : '+ Tambah ke keranjang') + '</button>';
  }
  function setCart(c) { S.cart = c; save(); fab(); }
  function bindCart(root, redraw) {
    root.querySelectorAll('[data-cart]').forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault(); var type = b.dataset.cart, t = b.dataset.t;
        setCart(inCart(type, t) ? S.cart.filter(function (c) { return !(c.type === type && c.target === t); }) : S.cart.concat([{ type: type, target: t }]));
        redraw();
      };
    });
  }
  function waLink(text) { return 'https://wa.me/' + A.wa + '?text=' + encodeURIComponent(text); }
  function fab() {
    var f = q('#cartFab');
    if (!S.cart.length || A.admin) { if (f) f.remove(); return; }
    if (!f) { f = document.createElement('button'); f.id = 'cartFab'; f.className = 'cart-fab'; f.onclick = openCart; document.body.appendChild(f); }
    f.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/></svg> Keranjang <b>' + S.cart.length + '</b>';
  }
  function modal(cls, html) {
    var d = document.createElement('dialog'); d.className = 'sheet ' + cls; d.innerHTML = html;
    d.addEventListener('close', function () { d.remove(); });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    document.body.appendChild(d); d.showModal(); return d;
  }
  function openCart() {
    var items = S.cart.slice();
    var msg = 'Halo admin JACIWEY, saya ' + A.user + ' mau beli akses Akademi SAP:\n' + items.map(function (c) { return '- ' + itemName(c); }).join('\n') + '\nTotal: ' + items.length + ' item. Terima kasih!';
    var d = modal('cart', '<h2>Keranjang</h2><p class="muted">Checkout mengirim permintaan akses ke admin' + (A.wa ? ' dan membuka chat WhatsApp admin untuk konfirmasi.' : '. Admin menyetujuinya di panel admin.') + '</p><ul class="cart-list">' +
      items.map(function (c, i) { return '<li><span>' + h(itemName(c)) + '</span><button class="btn ghost sm" data-rm="' + i + '" aria-label="Hapus ' + h(itemName(c)) + '">Hapus</button></li>'; }).join('') + '</ul>' +
      '<div class="sheet-f">' + (A.wa ? '<a class="btn pri" id="cartGo" target="_blank" rel="noopener" href="' + waLink(msg) + '">Checkout via WhatsApp</a>' : '<button class="btn pri" id="cartGo">Kirim permintaan ke admin</button>') +
      '<button class="btn ghost" data-close>Tutup</button></div><p class="cart-msg" role="status"></p>');
    d.querySelectorAll('[data-rm]').forEach(function (b) { b.onclick = function () { setCart(S.cart.filter(function (_, i) { return i !== +b.dataset.rm; })); d.close(); route(); if (S.cart.length) openCart(); }; });
    var go = d.querySelector('#cartGo');
    go.onclick = function (e) {
      if (go.dataset.busy) { e.preventDefault(); return; }
      go.dataset.busy = '1'; // the WhatsApp link still opens in its new tab; the requests are recorded here
      if (!A.wa) e.preventDefault();
      post('/api/requests', { items: items }).then(function (x) {
        if (!x[0]) { d.querySelector('.cart-msg').textContent = x[1].error || 'Gagal, coba lagi'; delete go.dataset.busy; return; }
        x[1].requests.forEach(function (r) { if (!pending(r.type, r.target)) A.requests.push(r); });
        setCart([]); route();
        d.querySelector('.cart-list').outerHTML = '<p class="cart-ok">Permintaan terkirim. Status: <b>Menunggu persetujuan admin</b>.</p>';
        go.remove();
      }).catch(function () { d.querySelector('.cart-msg').textContent = 'Jaringan bermasalah, coba lagi'; delete go.dataset.busy; });
    };
  }

  function bindReq(root, done) {
    root.querySelectorAll('[data-req]').forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); request(b, b.dataset.req, b.dataset.t, done); };
    });
  }

  // Active role: keep S.role if granted, else fall back to the primary role.
  if (!A.admin && A.role && !granted(S.role)) { S.role = A.role; save(); }

  // ---- no role yet: browse roles, catalog and module previews; everything else waits for the one-time pick.
  function needsRole() { return !A.admin && !A.role; }
  if (needsRole() && S.role) { S.role = null; save(); }
  var pickNote = '<div class="callout"><b>Pilih role dulu</b>Role menentukan modul yang terbuka untukmu. Lihat-lihat role dan preview modul dulu, lalu buka detail role dan klik "Pilih role ini". Pilihan ini sekali saja; mengganti role nanti lewat persetujuan admin.</div>';
  function gate() {
    var v = q('#view'); if (!v) return;
    v.innerHTML = '<h1>Pilih role dulu</h1>' + pickNote + '<div class="row" style="margin-top:14px"><a class="btn pri" href="#role">Lihat semua role</a><a class="btn ghost" href="#modul">Katalog modul</a></div>';
  }

  // ---- module lock page
  var rm = window.renderModule;
  if (typeof rm === 'function') {
    window.renderModule = function (id) {
      if (allowed(id)) return rm.apply(this, arguments);
      var m = MOD[id], v = q('#view'); if (!m || !v) return rm.apply(this, arguments);
      var draw = function () {
        var bab = (m.lessons || []).map(function (l, i) { return '<li>Bab ' + (i + 1) + '. ' + h(l.t) + '</li>'; }).join('');
        v.innerHTML = '<header class="pagehero"><div class="eyebrow">' + h(m.code) + (needsRole() ? ' · Preview' : ' · Terkunci') + '</div><h1>' + h(m.title) + '</h1><p class="lead">' + m.sum + '</p></header>' +
          (needsRole() ? pickNote : '<div class="callout warn"><b>' + LOCK + ' Modul ini di luar role kamu.</b>Tambahkan ke keranjang lalu checkout ke admin untuk membuka materi dan kuis modul ini. Simulator, studi kasus, dan flashcard tetap terbuka.</div>') +
          (bab ? '<h2>Isi modul</h2><ol class="prose">' + bab + '</ol>' : '') +
          '<div class="row" style="margin-top:14px">' + (needsRole() ? '<a class="btn pri" href="#role">Pilih role</a>' : cartBtn('mod', id, 'pri')) + '<a class="btn ghost" href="#modul">← Katalog modul</a></div>';
        bindCart(v, draw);
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
      return s.replace('class="card modcard"', 'class="card modcard dim"')
        .replace('<span class="row" style="gap:4px">', '<span class="row" style="gap:4px"><span class="pill warn">' + LOCK + ' Terkunci</span>');
    };
  } else warn('modCard');

  // ---- roles pages
  var rr = window.renderRoles;
  if (typeof rr === 'function') {
    window.renderRoles = function () {
      rr.apply(this, arguments); var n = q('#noRole'); if (n) n.remove();
      var v = q('#view'); if (needsRole() && v) v.insertAdjacentHTML('afterbegin', pickNote);
    };
  } else warn('renderRoles');

  var rd = window.renderRoleDetail;
  if (typeof rd === 'function') {
    window.renderRoleDetail = function (id) {
      rd.apply(this, arguments);
      var b = q('#pickRole'); if (!b || A.admin) return;
      if (needsRole()) {
        var r = roleById(id), sure = false, nb = b.cloneNode(false);
        nb.textContent = 'Pilih role ini'; b.replaceWith(nb);
        nb.onclick = function () {
          if (!sure) { sure = true; nb.textContent = 'Yakin pilih ' + r.t + '? Klik lagi (sekali saja)'; return; }
          nb.disabled = true;
          post('/api/role', { role: id }).then(function (x) {
            if (x[0] || x[1].error === 'Role sudah dipilih') { location.hash = 'beranda'; location.reload(); }
            else { nb.textContent = x[1].error || 'Gagal, coba lagi'; nb.disabled = false; sure = false; }
          }).catch(function () { nb.textContent = 'Jaringan bermasalah'; nb.disabled = false; sure = false; });
        };
        return;
      }
      if (granted(id)) { b.textContent = 'Jadikan jalur aktif'; return; }
      var again = function () { window.renderRoleDetail(id); };
      var box = document.createElement('span');
      box.className = 'row';
      box.innerHTML = cartBtn('role', id, 'pri') + reqBtn('switch', id, 'Minta ganti ke role ini', 'ghost');
      b.replaceWith(box);
      bindReq(box, again); bindCart(box, again);
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
        sec.innerHTML = '<h2>Saran modul add-on</h2><p class="muted" style="max-width:72ch">Modul di luar role-mu yang sering dipakai role sejenis. Tambahkan ke keranjang bila perlu.</p><div class="grid g3">' +
          ids.map(function (id) {
            var m = MOD[id];
            return '<div class="card modcard"><div class="top"><span class="code">' + h(m.code) + ' · ' + h(m.dur) + '</span><span class="pill warn">' + LOCK + ' Terkunci</span></div><h3>' + h(shortT(m)) + '</h3><p>' + m.sum + '</p>' + cartBtn('mod', id, 'sm') + '</div>';
          }).join('') + '</div>';
        bindCart(sec, draw);
      };
      draw(); v.appendChild(sec);
    };
  } else warn('renderHome');

  // ---- EXP snapshot for the admin's per-user view; voucher status from the server.
  var sv = window.save;
  window.save = function () { try { S.xp = expState(); } catch (e) {} return sv.apply(this, arguments); };
  if (S.wallet && S.wallet.red && A.done.length) {
    S.wallet.red.forEach(function (v) { if (A.done.indexOf(v.code) >= 0) v.st = 'Sudah diproses JACIWEY'; });
    save();
  }

  // ---- rewards: server-checked redeem + coupons + receipt; EXP tables are admin-only.
  function flush() {
    var v = localStorage.getItem('sapAkademiV2');
    return v === null ? Promise.resolve() : fetch('/api/progress', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'text/plain' }, body: v });
  }
  function redeem(body, btn, msgEl) {
    var fail = function (t) { if (msgEl) msgEl.textContent = t; else btn.textContent = t; btn.disabled = false; };
    btn.disabled = true; if (msgEl) msgEl.textContent = '';
    return flush().then(function () { return post('/api/redeem', body); }).then(function (x) {
      if (!x[0]) return fail(x[1].error || 'Gagal, coba lagi');
      var W = S.wallet, v = x[1].entry; W.spent += v.cost; W.red.unshift(v); save();
      window.renderReward(); if (typeof renderNav === 'function') renderNav('reward');
      receipt(v);
    }).catch(function () { fail('Jaringan bermasalah'); });
  }
  function receipt(v) {
    var when = new Date(v.at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    var msg = 'Halo admin JACIWEY, saya mau klaim reward Akademi SAP.\nKode: ' + v.code + '\nReward: ' + v.t + '\nKoin: ' + v.cost + '\nUser: ' + A.user + '\nTanggal: ' + when;
    modal('receipt', '<div class="eyebrow">Struk penukaran</div><h2>' + h(v.t) + '</h2><dl>' +
      '<dt>Kode voucher</dt><dd><code>' + h(v.code) + '</code></dd><dt>Koin dipakai</dt><dd>' + fmtN(v.cost) + ' koin</dd>' +
      '<dt>Sisa koin</dt><dd>' + fmtN(expState().coins) + ' koin</dd><dt>Tanggal</dt><dd>' + h(when) + '</dd><dt>Akun</dt><dd>' + h(A.user) + '</dd><dt>Status</dt><dd>' + h(v.st) + '</dd></dl>' +
      '<p class="muted">' + (A.wa ? 'Klaim lewat WhatsApp admin. Pesannya sudah berisi kode voucher ini.' : 'Tunjukkan kode ini ke admin JACIWEY untuk diproses.') + '</p>' +
      '<div class="sheet-f">' + (A.wa ? '<a class="btn pri" target="_blank" rel="noopener" href="' + waLink(msg) + '">Klaim via WhatsApp</a>' : '') + '<button class="btn ghost" data-close>Tutup</button></div>');
  }
  var ADMIN_ONLY = ['Rincian EXP', 'Nilai setiap aktivitas', 'EXP per role'];
  var rwd = window.renderReward;
  if (typeof rwd === 'function') {
    window.renderReward = function () {
      rwd.apply(this, arguments);
      var v = q('#view'); if (!v) return;
      if (!A.admin) v.querySelectorAll('h2').forEach(function (t) {
        if (ADMIN_ONLY.indexOf(t.textContent.trim()) < 0) return;
        for (var n = t.nextElementSibling; n && n.tagName !== 'H2';) { var nx = n.nextElementSibling; n.remove(); n = nx; }
        t.remove();
      });
      var w = v.querySelector('.wallet');
      if (w) {
        w.insertAdjacentHTML('afterend', '<form class="coupon" id="cpForm"><label for="cpCode">Punya kode kupon dari admin?</label><div class="coupon-row"><input id="cpCode" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="32" placeholder="Contoh: KPN-AB12CD" required><button class="btn">Pakai kupon</button></div><p class="cp-msg" role="status"></p></form>');
        var f = q('#cpForm');
        f.onsubmit = function (e) { e.preventDefault(); redeem({ coupon: q('#cpCode').value }, f.querySelector('button'), f.querySelector('.cp-msg')); };
      }
      v.querySelectorAll('[data-rw]').forEach(function (b) {
        b.onclick = function () {
          var x = REWARDS.find(function (y) { return y[0] === b.dataset.rw; });
          if (!x || expState().coins < x[2]) return;
          if (b.dataset.ok !== '1') { b.dataset.ok = '1'; b.textContent = 'Yakin tukar ' + fmtN(x[2]) + ' koin?'; b.classList.add('warnbtn'); return; }
          redeem({ reward: x[0] }, b);
        };
      });
      v.querySelectorAll('table code').forEach(function (c) {
        var e = S.wallet.red.find(function (r) { return r.code === c.textContent; }); if (!e) return;
        var b = document.createElement('button'); b.className = 'linkbtn'; b.title = 'Lihat struk'; b.append(c.cloneNode(true));
        b.onclick = function () { receipt(e); }; c.replaceWith(b);
      });
    };
  } else warn('renderReward');

  // ---- gate the rest until a role is picked (home lands on the role list)
  if (needsRole()) {
    window.renderHome = function () { window.renderRoles(); };
    ['renderSimHome', 'renderQuizHome', 'renderCards', 'renderCaseHome', 'renderReport', 'renderPath'].forEach(function (n) {
      if (typeof window[n] === 'function') window[n] = gate; else warn(n);
    });
  }

  // ---- boot: re-render with hooks in place.
  fab();
  if (typeof route === 'function') route(); else warn('route');
})();
