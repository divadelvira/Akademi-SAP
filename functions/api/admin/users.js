import { json, err, isAdmin } from "../../_lib/auth.js";
import { loadUser, pendingRequests } from "../../_lib/access.js";
import { redemptions, getSettings } from "../../_lib/shop.js";

export async function onRequestGet({ env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const { keys } = await env.DATA.list({ prefix: "user:" });
  // shortcut: KV list + one get per user is fine up to a few hundred users; store a roster in metadata or D1 beyond that.
  const users = await Promise.all(keys.map(async (k) => {
    const name = k.name.slice(5), u = await loadUser(env, name);
    return { name, admin: u?.admin === true, role: u?.role ?? null, roles: u?.roles ?? [], mods: u?.mods ?? [] };
  }));
  users.sort((a, b) => a.name.localeCompare(b.name));
  const [requests, rdm, settings] = await Promise.all([pendingRequests(env), redemptions(env), getSettings(env)]);
  return json({ users, requests, redemptions: rdm, settings });
}
