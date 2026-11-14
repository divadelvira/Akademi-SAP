import { test } from "node:test";
import assert from "node:assert/strict";
import { kv } from "./testkv.js";
import * as register from "../api/register.js";
import * as progress from "../api/progress.js";
import * as role from "../api/role.js";
import * as requests from "../api/requests.js";
import * as adminUsers from "../api/admin/users.js";
import * as adminUser from "../api/admin/users/[name].js";
import * as adminReq from "../api/admin/requests/[id].js";

const env = async () => {
  const e = { DATA: kv(), SESSION_SECRET: "s" };
  await e.DATA.put("user:diva", JSON.stringify({ salt: "", hash: "", admin: true }));
  await e.DATA.put("user:ani", JSON.stringify({ salt: "", hash: "", role: "wh" }));
  await e.DATA.put("user:nora", JSON.stringify({ salt: "", hash: "" }));
  return e;
};
const call = (fn, e, user, body, params) =>
  fn({ env: e, data: { user }, params, request: new Request("http://x/", { method: "POST", body: JSON.stringify(body ?? {}) }) });
const prog = async (e, user) => (await call(progress.onRequestGet, e, user)).json();
const ask = async (e, type, target, user = "ani") => (await (await call(requests.onRequestPost, e, user, { type, target })).json()).request;
const decide = (e, id, action) => call(adminReq.onRequestPost, e, "diva", { action }, { id });

test("register leaves role empty; user picks it once after login", async () => {
  const e = await env();
  await e.DATA.put("invite:abcdef", JSON.stringify({ expires: Date.now() + 1e5 }));
  const ok = await call(register.onRequestPost, e, null, { username: "budi", password: "password1", invite: "abcdef", role: "inv" });
  assert.equal(ok.status, 200);
  assert.equal((await prog(e, "budi")).role ?? null, null);
  assert.equal((await call(role.onRequestPost, e, "budi", { role: "inv" })).status, 200);
  assert.equal((await prog(e, "budi")).role, "inv");
});

test("/api/role works once", async () => {
  const e = await env();
  assert.equal((await call(role.onRequestPost, e, "nora", { role: "nope" })).status, 400);
  assert.equal((await call(role.onRequestPost, e, "nora", { role: "wh" })).status, 200);
  assert.equal((await call(role.onRequestPost, e, "nora", { role: "inv" })).status, 409);
  assert.equal((await prog(e, "nora")).role, "wh");
});

test("mod request: approve unlocks it, request is gone", async () => {
  const e = await env();
  const req = await ask(e, "mod", "fi-gl");
  assert.deepEqual((await prog(e, "ani")).requests, [req]);
  assert.equal((await decide(e, req.id, "approve")).status, 200);
  const p = await prog(e, "ani");
  assert.deepEqual(p.mods, ["fi-gl"]);
  assert.deepEqual(p.requests, []);
  assert.equal((await decide(e, req.id, "approve")).status, 404);
  assert.equal((await call(requests.onRequestPost, e, "ani", { type: "mod", target: "fi-gl" })).status, 400);
});

test("reject removes the request without granting", async () => {
  const e = await env();
  const req = await ask(e, "mod", "pp");
  assert.equal((await decide(e, req.id, "reject")).status, 200);
  const p = await prog(e, "ani");
  assert.deepEqual([p.mods, p.requests], [[], []]);
});

test("role and switch approvals", async () => {
  const e = await env();
  await decide(e, (await ask(e, "role", "inv")).id, "approve");
  let p = await prog(e, "ani");
  assert.deepEqual([p.role, p.roles], ["wh", ["inv"]]);
  await decide(e, (await ask(e, "switch", "inv")).id, "approve");
  p = await prog(e, "ani");
  assert.deepEqual([p.role, p.roles], ["inv", []]);
});

test("duplicate request is deduped; bad requests are 400", async () => {
  const e = await env();
  const a = await ask(e, "mod", "pp"), b = await ask(e, "mod", "pp");
  assert.equal(a.id, b.id);
  assert.equal((await prog(e, "ani")).requests.length, 1);
  for (const body of [{ type: "x", target: "pp" }, { type: "mod", target: "nope" }, { type: "role", target: "nope" }, { type: "switch", target: "wh" }, { type: "role", target: "wh" }])
    assert.equal((await call(requests.onRequestPost, e, "ani", body)).status, 400);
});

test("admin routes are admin-only", async () => {
  const e = await env();
  const req = await ask(e, "mod", "pp");
  const p = { name: "ani", id: req.id };
  assert.equal((await call(adminUsers.onRequestGet, e, "ani")).status, 403);
  assert.equal((await call(adminUser.onRequestPut, e, "ani", {}, p)).status, 403);
  assert.equal((await call(adminReq.onRequestPost, e, "ani", { action: "approve" }, p)).status, 403);
  assert.deepEqual((await prog(e, "ani")).mods, []);
});

test("admin lists users and PUT validates ids", async () => {
  const e = await env();
  await ask(e, "mod", "pp");
  const list = await (await call(adminUsers.onRequestGet, e, "diva")).json();
  assert.deepEqual(list.users.map((u) => u.name), ["ani", "diva", "nora"]);
  assert.equal(list.requests.length, 1);
  const put = (body, name = "ani") => call(adminUser.onRequestPut, e, "diva", body, { name });
  assert.equal((await put({ role: "nope" })).status, 400);
  assert.equal((await put({ roles: ["nope"] })).status, 400);
  assert.equal((await put({ mods: ["nope"] })).status, 400);
  assert.equal((await put({ role: "wh" }, "ghost")).status, 404);
  const ok = await put({ role: "wh", roles: ["wh", "inv", "inv"], mods: ["pp", "pp"] });
  assert.deepEqual(await ok.json(), { name: "ani", role: "wh", roles: ["inv"], mods: ["pp"] });
});
