import { json, err, readJson } from "../_lib/auth.js";
import { isRole, isMod, loadUser, allowedMods, pendingRequests } from "../_lib/access.js";

// Returns [status, request|error message]. `pend` is updated so a batch dedupes within itself.
async function add(env, user, u, pend, type, target) {
  const ok = type === "mod" ? isMod : type === "role" || type === "switch" ? isRole : null;
  if (!ok || !ok(target)) return [400, "Permintaan tidak valid"];
  const has = type === "mod" ? allowedMods(u).has(target)
    : type === "role" ? u.role === target || u.roles.includes(target)
    : u.role === target;
  if (has) return [409, "Sudah punya akses"];
  const dup = pend.find((r) => r.user === user && r.type === type && r.target === target);
  if (dup) return [200, { id: dup.id, type, target, at: dup.at }];
  const req = { id: crypto.randomUUID().replace(/-/g, "").slice(0, 12), user, type, target, at: Date.now() };
  await env.DATA.put(`req:${req.id}`, JSON.stringify(req), { metadata: req });
  pend.push(req);
  return [200, { id: req.id, type, target, at: req.at }];
}

// Body {type, target} for one request, or {items:[{type,target}]} for a cart checkout (mod/role only).
export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request);
  const u = await loadUser(env, data.user);
  if (!u) return err("User tidak ditemukan", 404);
  const pend = await pendingRequests(env);
  if (Array.isArray(b?.items)) {
    if (!b.items.length || b.items.length > 50 || b.items.some((i) => i?.type !== "mod" && i?.type !== "role")) return err("Keranjang tidak valid", 400);
    const out = [];
    for (const i of b.items) {
      const [s, r] = await add(env, data.user, u, pend, i.type, i.target);
      if (s === 400) return err(r, 400);
      if (s === 200) out.push(r); // already owned: skip
    }
    return json({ requests: out });
  }
  const [s, r] = await add(env, data.user, u, pend, b?.type, b?.target);
  return s === 200 ? json({ request: r }) : err(r, s === 409 ? 400 : s);
}
