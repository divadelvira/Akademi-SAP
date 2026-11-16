import { test } from "node:test";
import assert from "node:assert/strict";
import { kv } from "./testkv.js";
import { hashPassword, verifyPassword } from "./auth.js";
import * as pw from "../api/password.js";
import * as adminUser from "../api/admin/users/[name].js";

const env = async () => {
  const e = { DATA: kv() };
  await e.DATA.put("user:ani", JSON.stringify({ ...(await hashPassword("lama-1234")), role: "wh", admin: false }));
  await e.DATA.put("user:diva", JSON.stringify({ ...(await hashPassword("x-12345678")), admin: true }));
  return e;
};
const call = (fn, e, user, body, params) =>
  fn({ env: e, data: { user }, params, request: new Request("http://x/", { method: "POST", body: JSON.stringify(body ?? {}) }) });
const rec = async (e, n) => JSON.parse(await e.DATA.get(`user:${n}`));

test("change password: ok swaps hash and keeps fields", async () => {
  const e = await env();
  assert.equal((await call(pw.onRequestPost, e, "ani", { current: "lama-1234", password: "baru-5678" })).status, 200);
  const r = await rec(e, "ani");
  assert.ok(await verifyPassword("baru-5678", r));
  assert.ok(!(await verifyPassword("lama-1234", r)));
  assert.equal(r.role, "wh");
  assert.equal(r.admin, false);
});

test("change password: wrong current 403, short 400", async () => {
  const e = await env();
  assert.equal((await call(pw.onRequestPost, e, "ani", { current: "salah", password: "baru-5678" })).status, 403);
  assert.equal((await call(pw.onRequestPost, e, "ani", { current: "lama-1234", password: "pendek" })).status, 400);
  assert.ok(await verifyPassword("lama-1234", await rec(e, "ani")));
});

test("admin reset: non-admin 403, admin gets working temp password, unknown 404", async () => {
  const e = await env();
  assert.equal((await call(adminUser.onRequestPost, e, "ani", {}, { name: "ani" })).status, 403);
  assert.equal((await call(adminUser.onRequestPost, e, "diva", {}, { name: "nobody" })).status, 404);
  const r = await call(adminUser.onRequestPost, e, "diva", {}, { name: "ani" });
  const d = await r.json();
  assert.equal(r.status, 200);
  assert.equal(d.password.length, 10);
  const u = await rec(e, "ani");
  assert.ok(await verifyPassword(d.password, u));
  assert.equal(u.role, "wh");
});
