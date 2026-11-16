import { json, err, readJson, isAdmin } from "../../../_lib/auth.js";

// Body {action:'done'}: the reward was handed over.
export async function onRequestPost({ request, env, data, params }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  if (b?.action !== "done") return err("Aksi tidak valid", 400);
  const rec = await env.DATA.get(`rdm:${params.id}`, "json");
  if (!rec) return err("Penukaran tidak ditemukan", 404);
  const out = { ...rec, done: true, doneAt: Date.now() };
  await env.DATA.put(`rdm:${params.id}`, JSON.stringify(out), { metadata: out });
  return json({ redemption: out });
}
