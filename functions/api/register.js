import { hashPassword, signSession, sessionCookie, json, err, readJson, safeEqual, USERNAME_RE } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  const b = await readJson(request);
  if (!b) return err("Data tidak valid", 400);
  const name = String(b.username ?? "").toLowerCase();
  const password = String(b.password ?? "");
  if (!USERNAME_RE.test(name)) return err("Username 3-32 karakter: huruf, angka, _ . -", 400);
  if (password.length < 8) return err("Password minimal 8 karakter", 400);
  if (!env.INVITE_CODE || !safeEqual(String(b.invite ?? ""), env.INVITE_CODE)) return err("Kode undangan salah", 403);
  // shortcut: get-then-put is not atomic, so simultaneous signups of one name can race; fine for invite-only
  if (await env.DATA.get(`user:${name}`)) return err("Username sudah dipakai", 409);
  await env.DATA.put(`user:${name}`, JSON.stringify(await hashPassword(password)));
  const token = await signSession(name, env.SESSION_SECRET);
  return json({ user: name }, 200, { "Set-Cookie": sessionCookie(token) });
}
