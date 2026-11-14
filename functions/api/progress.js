import { json, err } from "../_lib/auth.js";
import { loadUser, pendingRequests } from "../_lib/access.js";

const MAX = 256 * 1024;

export async function onRequestGet({ env, data }) {
  const [progress, u, all] = await Promise.all([env.DATA.get(`progress:${data.user}`), loadUser(env, data.user), pendingRequests(env)]);
  const requests = all.filter((r) => r.user === data.user).map(({ id, type, target, at }) => ({ id, type, target, at }));
  return json({ user: data.user, admin: u?.admin === true, progress, role: u?.role ?? null, roles: u?.roles ?? [], mods: u?.mods ?? [], requests });
}

async function save({ request, env, data }) {
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX) return err("Data terlalu besar", 413);
  try { JSON.parse(body); } catch { return err("Data bukan JSON", 400); }
  await env.DATA.put(`progress:${data.user}`, body);
  return new Response(null, { status: 204 });
}
export const onRequestPut = save;
export const onRequestPost = save; // sendBeacon
