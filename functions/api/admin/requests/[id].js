import { json, err, readJson, isAdmin } from "../../../_lib/auth.js";
import { uniq, loadUser, saveUser } from "../../../_lib/access.js";

export async function onRequestPost({ request, env, data, params }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  if (!b || (b.action !== "approve" && b.action !== "reject")) return err("Aksi tidak valid", 400);
  const req = await env.DATA.get(`req:${params.id}`, "json");
  if (!req) return err("Permintaan tidak ditemukan", 404);
  if (b.action === "approve") {
    const u = await loadUser(env, req.user);
    if (u) {
      if (req.type === "switch") { u.role = req.target; u.roles = u.roles.filter((r) => r !== req.target); }
      else if (req.type === "role") u.roles = uniq([...u.roles, req.target]);
      else u.mods = uniq([...u.mods, req.target]);
      await saveUser(env, req.user, u);
    }
  }
  await env.DATA.delete(`req:${params.id}`);
  return json({ ok: true });
}
