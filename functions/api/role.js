import { json, err, readJson } from "../_lib/auth.js";
import { isRole, loadUser, saveUser } from "../_lib/access.js";

export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request);
  if (!b || !isRole(b.role)) return err("Pilih role", 400);
  const u = await loadUser(env, data.user);
  if (!u) return err("User tidak ditemukan", 404);
  if (u.role) return err("Role sudah dipilih", 409);
  await saveUser(env, data.user, { ...u, role: b.role });
  return json({ role: b.role });
}
