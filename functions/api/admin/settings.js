import { json, err, readJson, isAdmin } from "../../_lib/auth.js";
import { getSettings } from "../../_lib/shop.js";

// Body {wa}: admin WhatsApp number for checkout and reward claims. Empty clears it.
export async function onRequestPut({ request, env, data }) {
  if (!(await isAdmin(env, data.user))) return err("Khusus admin", 403);
  const b = await readJson(request);
  if (typeof b?.wa !== "string") return err("Data tidak valid", 400);
  const wa = b.wa.replace(/\D/g, "").replace(/^0/, "62");
  if (wa && !/^\d{8,15}$/.test(wa)) return err("Nomor WhatsApp tidak valid", 400);
  const s = { ...(await getSettings(env)), wa };
  await env.DATA.put("settings", JSON.stringify(s));
  return json(s);
}
