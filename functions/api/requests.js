import { json, err, readJson } from "../_lib/auth.js";
import { isRole, isMod, loadUser, allowedMods, pendingRequests } from "../_lib/access.js";

export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request);
  const { type, target } = b ?? {};
  const ok = type === "mod" ? isMod : type === "role" || type === "switch" ? isRole : null;
  if (!ok || !ok(target)) return err("Permintaan tidak valid", 400);
  const u = await loadUser(env, data.user);
  if (!u) return err("User tidak ditemukan", 404);
  const has = type === "mod" ? allowedMods(u).has(target)
    : type === "role" ? u.role === target || u.roles.includes(target)
    : u.role === target;
  if (has) return err("Sudah punya akses", 400);
  const dup = (await pendingRequests(env)).find((r) => r.user === data.user && r.type === type && r.target === target);
  if (dup) return json({ request: { id: dup.id, type, target, at: dup.at } });
  const req = { id: crypto.randomUUID().replace(/-/g, "").slice(0, 12), user: data.user, type, target, at: Date.now() };
  await env.DATA.put(`req:${req.id}`, JSON.stringify(req), { metadata: req });
  return json({ request: { id: req.id, type, target, at: req.at } });
}
