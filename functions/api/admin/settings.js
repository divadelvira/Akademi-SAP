import { json, err, readJson, isAdmin } from "../../_lib/auth.js";
import { getSettings } from "../../_lib/shop.js";
import { REWARDS, EXP } from "../../_lib/catalog.js";

const int = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;

// Body {wa?, prices?, exp?}; at least one.
// wa: admin WhatsApp number for checkout and reward claims, empty clears it.
// prices: {rewardId: coins}. exp: {max, free, w:{activity: weight}}; weights only set each activity's share of max.
export async function onRequestPut({ request, env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  if (!b || (b.wa === undefined && b.prices === undefined && b.exp === undefined)) return err("Data tidak valid", 400);
  const s = await getSettings(env);
  if (b.wa !== undefined) {
    if (typeof b.wa !== "string") return err("Data tidak valid", 400);
    const wa = b.wa.replace(/\D/g, "").replace(/^0/, "62");
    if (wa && !/^\d{8,15}$/.test(wa)) return err("Nomor WhatsApp tidak valid", 400);
    s.wa = wa;
  }
  if (b.prices !== undefined) {
    const p = b.prices;
    if (!p || typeof p !== "object" || !REWARDS.every((r) => int(p[r.id], 1, 100000))) return err("Harga reward harus 1–100.000 koin", 400);
    s.prices = Object.fromEntries(REWARDS.map((r) => [r.id, p[r.id]]));
  }
  if (b.exp !== undefined) {
    const x = b.exp, keys = Object.keys(EXP.w);
    // max >= 5000 keeps the pool positive after flashcards (2 per card) and free missions are taken out.
    if (!x || !int(x.max, 5000, 1000000) || !int(x.free, 0, 100) || !x.w || !keys.every((k) => int(x.w[k], 0, 1000)) || keys.every((k) => !x.w[k]))
      return err("EXP tidak valid: total 5.000–1.000.000, misi 0–100, bobot 0–1.000 (minimal satu > 0)", 400);
    s.exp = { max: x.max, free: x.free, w: Object.fromEntries(keys.map((k) => [k, x.w[k]])) };
  }
  await env.DATA.put("settings", JSON.stringify(s));
  return json(s);
}
