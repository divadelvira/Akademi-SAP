import { json, err, readJson } from "../_lib/auth.js";
import { REWARDS } from "../_lib/catalog.js";
import { parseProgress, coinsOf, newCode, COUPON_RE } from "../_lib/shop.js";

// Body {reward:id} or {coupon:code}. The client flushes its progress first, so the stored wallet is current.
export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request);
  let item, coupon, key;
  if (typeof b?.reward === "string") {
    item = REWARDS.find((r) => r.id === b.reward);
    if (!item) return err("Reward tidak ditemukan", 404);
  } else if (typeof b?.coupon === "string") {
    const code = b.coupon.trim().toUpperCase();
    key = `coupon:${code}`;
    coupon = COUPON_RE.test(code) ? await env.DATA.get(key, "json") : null;
    if (!coupon || coupon.usedBy) return err("Kode kupon salah atau sudah dipakai", 404);
    item = { id: "kupon", t: coupon.reward, cost: coupon.cost };
  } else return err("Permintaan tidak valid", 400);

  const p = parseProgress(await env.DATA.get(`progress:${data.user}`));
  const have = coinsOf(p);
  if (have < item.cost) return err(`Koin tidak cukup: butuh ${item.cost}, saldo ${have}`, 409);

  const at = Date.now();
  const entry = { code: newCode("JCW", 7), id: item.id, t: item.t, cost: item.cost, at, st: "Menunggu konfirmasi JACIWEY", ...(coupon && { coupon: coupon.code }) };
  // shortcut: KV has no transactions, so two redeems in the same instant could both pass the checks; move to D1 if that ever matters.
  if (coupon) { const used = { ...coupon, usedBy: data.user, usedAt: at }; await env.DATA.put(key, JSON.stringify(used), { metadata: used }); }
  const w = { conv: 0, spent: 0, ...p.wallet };
  p.wallet = { ...w, spent: w.spent + item.cost, red: [entry, ...(w.red || [])] };
  await env.DATA.put(`progress:${data.user}`, JSON.stringify(p));
  const rec = { id: entry.code, user: data.user, t: item.t, cost: item.cost, at, done: false, ...(coupon && { coupon: coupon.code }) };
  await env.DATA.put(`rdm:${rec.id}`, JSON.stringify(rec), { metadata: rec });
  return json({ entry, coins: have - item.cost });
}
