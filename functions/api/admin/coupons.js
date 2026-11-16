import { json, err, readJson, isAdmin } from "../../_lib/auth.js";
import { coupons, newCode, COUPON_RE } from "../../_lib/shop.js";

export async function onRequestGet({ env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  return json({ coupons: await coupons(env) });
}

// Body {reward, cost, code?}. One coupon = one use.
export async function onRequestPost({ request, env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  const reward = typeof b?.reward === "string" ? b.reward.trim() : "";
  const cost = b?.cost;
  if (!reward || reward.length > 120) return err("Isi nama reward (maks. 120 karakter)", 400);
  if (!Number.isInteger(cost) || cost < 0 || cost > 100000) return err("Harga koin harus angka bulat 0–100000", 400);
  const code = b.code ? String(b.code).trim().toUpperCase() : newCode("KPN", 6);
  if (!COUPON_RE.test(code)) return err("Kode 4–32 karakter: huruf, angka, atau -", 400);
  if (await env.DATA.get(`coupon:${code}`)) return err("Kode sudah ada", 409);
  const c = { code, reward, cost, at: Date.now(), by: data.user };
  await env.DATA.put(`coupon:${code}`, JSON.stringify(c), { metadata: c });
  return json({ coupon: c });
}

export async function onRequestDelete({ request, env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const code = new URL(request.url).searchParams.get("code") || "";
  if (!COUPON_RE.test(code)) return err("Kode tidak valid", 400);
  await env.DATA.delete(`coupon:${code}`);
  return json({ ok: true });
}
