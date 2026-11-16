import { json, err, readJson, hashPassword, verifyPassword } from "../_lib/auth.js";
import { loadUser, saveUser } from "../_lib/access.js";

// shortcut: sessions are stateless HMAC cookies, so other devices stay logged in until their cookie expires; add a per-user session version if that matters.
export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request);
  if (!b) return err("Data tidak valid", 400);
  if (typeof b.password !== "string" || b.password.length < 8) return err("Password baru minimal 8 karakter", 400);
  const u = await loadUser(env, data.user);
  if (!u || typeof b.current !== "string" || !(await verifyPassword(b.current, u))) return err("Password lama salah", 403);
  await saveUser(env, data.user, { ...u, ...(await hashPassword(b.password)) });
  return json({ ok: true });
}
