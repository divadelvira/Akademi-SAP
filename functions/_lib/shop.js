import { COIN_RATE } from "./catalog.js";

export const parseProgress = (s) => { try { return (s && JSON.parse(s)) || {}; } catch { return {}; } };
// Same formula as expState() in app.js: converted EXP / rate, minus coins already spent.
export const coinsOf = (p) => Math.floor((p.wallet?.conv || 0) / COIN_RATE) - (p.wallet?.spent || 0);
export const newCode = (prefix, n) => `${prefix}-${crypto.randomUUID().replace(/-/g, "").slice(0, n).toUpperCase()}`;
export const COUPON_RE = /^[A-Z0-9-]{4,32}$/;

async function listMeta(env, prefix) {
  const { keys } = await env.DATA.list({ prefix });
  return keys.map((k) => k.metadata).filter(Boolean).sort((a, b) => b.at - a.at);
}
export const redemptions = (env) => listMeta(env, "rdm:");
export const coupons = (env) => listMeta(env, "coupon:");
export const getSettings = async (env) => (await env.DATA.get("settings", "json")) ?? {};
