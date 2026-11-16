(function () {
  var KEY = 'sapAkademiV2', USER = 'sapUser';
  var ls = window.localStorage, rawSet = Storage.prototype.setItem;
  function login() { location.href = '/login'; }
  function put(body) {
    return fetch('/api/progress', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }).catch(function () {});
  }
  function widget(user, admin, notif) {
    // styled by .who in app.css; lives in the sidebar so it never covers content
    var d = document.createElement('div');
    d.className = 'who';
    var n = document.createElement('span');
    n.textContent = user;
    var b = document.createElement('button');
    b.textContent = 'Keluar';
    b.onclick = function () {
      fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(function () {}).then(function () {
        ls.removeItem(KEY); ls.removeItem(USER); login();
      });
    };
    d.append(n);
    if (admin) {
      var a = document.createElement('a');
      a.href = '/admin';
      a.textContent = 'Admin';
      // pending access requests + rewards waiting to be handed over
      if (notif) { var nb = document.createElement('b'); nb.className = 'nbadge'; nb.textContent = notif; nb.title = notif + ' notifikasi baru'; a.append(nb); }
      d.append(a);
    }
    d.append(b);
    (document.querySelector('#side .navwrap') || document.body).appendChild(d);
  }
  fetch('/api/progress', { credentials: 'same-origin' }).then(function (r) {
    if (r.status === 401) { login(); return null; }
    return r.json();
  }).then(function (d) {
    if (!d) return;
    var local = ls.getItem(KEY), mark = ls.getItem(USER);
    if (typeof d.progress === 'string') rawSet.call(ls, KEY, d.progress);
    else if (local !== null && (mark === null || mark === d.user)) put(local);
    else ls.removeItem(KEY);
    rawSet.call(ls, USER, d.user);

    var timer;
    Storage.prototype.setItem = function (k, v) {
      rawSet.call(this, k, v);
      if (this === ls && k === KEY) {
        clearTimeout(timer);
        timer = setTimeout(function () { timer = undefined; put(String(v)); }, 1000);
      }
    };
    addEventListener('pagehide', function () {
      if (timer === undefined) return;
      clearTimeout(timer);
      var v = ls.getItem(KEY);
      if (v !== null) navigator.sendBeacon('/api/progress', new Blob([v], { type: 'text/plain' }));
    });
    widget(d.user, d.admin, d.notif);
    window.__access = { user: d.user, admin: !!d.admin, role: d.role || null, roles: d.roles || [], mods: d.mods || [], requests: d.requests || [], wa: d.wa || null, done: d.done || [] };
    // app.js reads localStorage synchronously at its top, so it loads last; access.js wraps its renderers after.
    var s = document.createElement('script');
    s.src = '/app.js';
    s.onload = function () {
      var a = document.createElement('script');
      a.src = '/access.js';
      document.body.appendChild(a);
    };
    document.body.appendChild(s);
  }).catch(login);
})();
