import { json, err, readJson, isAdmin } from "../../../_lib/auth.js";
import { isRole, isMod, uniq, validIds, loadUser, saveUser } from "../../../_lib/access.js";

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
