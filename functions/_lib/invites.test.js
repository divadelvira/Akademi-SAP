import { test } from "node:test";
import assert from "node:assert/strict";
import * as invites from "../api/invites.js";
import * as register from "../api/register.js";

function kv() {
  const m = new Map();
  return {
    async get(k, type) { const e = m.get(k); return e === undefined ? null : type === "json" ? JSON.parse(e.v) : e.v; },
    async put(k, v, o = {}) { m.set(k, { v, metadata: o.metadata }); },
    async delete(k) { m.delete(k); },
    async list({ prefix }) { return { keys: [...m].filter(([k]) => k.startsWith(prefix)).map(([name, e]) => ({ name, metadata: e.metadata })) }; },
  };
}
const env = () => ({ DATA: kv(), SESSION_SECRET: "s" });
const signup = (e, username, invite) =>
  register.onRequestPost({ env: e, request: new Request("http://x/api/register", { method: "POST", body: JSON.stringify({ username, password: "password1", invite }) }) });

test("only admins can create or list invites", async () => {
  const e = env();
  await e.DATA.put("user:bob", JSON.stringify({ salt: "", hash: "" }));
  assert.equal((await invites.onRequestPost({ env: e, data: { user: "bob" } })).status, 403);
  assert.equal((await invites.onRequestGet({ env: e, data: { user: "bob" } })).status, 403);
});

test("invite is single-use and expires", async () => {
  const e = env();
  await e.DATA.put("user:diva", JSON.stringify({ salt: "", hash: "", admin: true }));
  const { code, expires } = await (await invites.onRequestPost({ env: e, data: { user: "diva" } })).json();
  assert.ok(expires - Date.now() <= 1800e3 && expires - Date.now() > 1790e3);
  assert.deepEqual((await (await invites.onRequestGet({ env: e, data: { user: "diva" } })).json()).invites.map((i) => i.code), [code]);
  assert.equal((await signup(e, "ani", code)).status, 200);
  assert.equal((await signup(e, "budi", code)).status, 403);
  assert.equal((await signup(e, "budi", "nope")).status, 403);

  const old = await (await invites.onRequestPost({ env: e, data: { user: "diva" } })).json();
  await e.DATA.put(`invite:${old.code}`, JSON.stringify({ expires: Date.now() - 1 }));
  assert.equal((await signup(e, "budi", old.code)).status, 403);
});
