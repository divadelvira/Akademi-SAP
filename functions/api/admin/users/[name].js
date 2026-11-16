import { json, err, readJson, isAdmin, hashPassword } from "../../../_lib/auth.js";
import { isRole, isMod, uniq, validIds, loadUser, saveUser } from "../../../_lib/access.js";
import { COIN_RATE } from "../../../_lib/catalog.js";
import { parseProgress, coinsOf, redemptions } from "../../../_lib/shop.js";

// One user's EXP and reward picture. xp is the expState() snapshot the app saves with progress.
export async function onRequestGet({ env, data, params }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const u = await loadUser(env, params.name);
  if (!u) return err("User tidak ditemukan", 404);
  const [p, rdm] = await Promise.all([env.DATA.get(`progress:${params.name}`).then(parseProgress), redemptions(env)]);
  const w = p.wallet || {}, done = new Set(rdm.filter((r) => r.done).map((r) => r.id));
  return json({
    name: params.name, admin: u.admin === true, role: u.role ?? null, roles: u.roles, mods: u.mods, xp: p.xp ?? null,
    wallet: { conv: w.conv || 0, spent: w.spent || 0, earned: Math.floor((w.conv || 0) / COIN_RATE), coins: coinsOf(p) },
    redeemed: (w.red || []).map((v) => ({ code: v.code, t: v.t, cost: v.cost, at: v.at, done: done.has(v.code) })),
  });
}

export async function onRequestPut({ request, env, data, params }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  if (!b) return err("Data tidak valid", 400);
  const u = await loadUser(env, params.name);
  if (!u) return err("User tidak ditemukan", 404);
  const { role = null, roles = [], mods = [] } = b;
  if ((role !== null && !isRole(role)) || !validIds(roles, isRole) || !validIds(mods, isMod)) return err("Role atau modul tidak valid", 400);
  const out = { role, roles: uniq(roles).filter((r) => r !== role), mods: uniq(mods) };
  await saveUser(env, params.name, { ...u, ...out });
  return json({ name: params.name, ...out });
}

export async function onRequestPost({ env, data, params }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const u = await loadUser(env, params.name);
  if (!u) return err("User tidak ditemukan", 404);
  const password = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  await saveUser(env, params.name, { ...u, ...(await hashPassword(password)) });
  return json({ name: params.name, password });
}
