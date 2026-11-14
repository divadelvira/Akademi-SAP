import { ROLES, MODS } from "./catalog.js";

export const isRole = (id) => ROLES.some((r) => r.id === id);
export const isMod = (id) => MODS.some((m) => m.id === id);
export const uniq = (a) => [...new Set(a)];
export const validIds = (a, ok) => Array.isArray(a) && a.every((x) => typeof x === "string" && ok(x));

export async function loadUser(env, name) {
  const u = await env.DATA.get(`user:${name}`, "json");
  return u && { ...u, roles: u.roles ?? [], mods: u.mods ?? [] };
}

// Modules a user may open: union of w+g+p of their roles, plus individually unlocked ones.
export function allowedMods(u) {
  const out = new Set(u.mods);
  for (const id of [u.role, ...u.roles]) {
    const r = ROLES.find((x) => x.id === id);
    if (r) for (const m of [...r.w, ...r.g, ...r.p]) out.add(m);
  }
  return out;
}

export async function pendingRequests(env) {
  const { keys } = await env.DATA.list({ prefix: "req:" });
  return keys.map((k) => k.metadata).filter(Boolean).sort((a, b) => a.at - b.at);
}

export async function saveUser(env, name, u) {
  await env.DATA.put(`user:${name}`, JSON.stringify(u));
}
