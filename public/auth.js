(function () {
  var KEY = 'sapAkademiV2', USER = 'sapUser';
  var ls = window.localStorage, rawSet = Storage.prototype.setItem;
  function login() { location.href = '/login'; }
  function put(body) {
    return fetch('/api/progress', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }).catch(function () {});
  }
  function widget(user, admin) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:50;display:flex;align-items:center;gap:8px;padding:4px 4px 4px 10px;background:var(--surface);border:1px solid var(--line);border-radius:99px;font-size:12px;opacity:.85;max-width:60vw';
    var n = document.createElement('span');
    n.textContent = user;
    n.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    var b = document.createElement('button');
    b.textContent = 'Keluar';
    b.style.cssText = 'font:inherit;padding:3px 10px;border-radius:99px;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer';
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
      a.style.cssText = b.style.cssText + ';text-decoration:none';
      d.append(a);
    }
    d.append(b);
    document.body.appendChild(d);
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
    widget(d.user, d.admin);
    // app.js reads localStorage synchronously at its top, so it loads last.
    var s = document.createElement('script');
    s.src = '/app.js';
    document.body.appendChild(s);
  }).catch(login);
})();
