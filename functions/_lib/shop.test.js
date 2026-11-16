import { test } from "node:test";
import assert from "node:assert/strict";
import { kv } from "./testkv.js";
import * as progress from "../api/progress.js";
import * as redeem from "../api/redeem.js";
import * as requests from "../api/requests.js";
import * as coupons from "../api/admin/coupons.js";
import * as adminUsers from "../api/admin/users.js";
import * as adminUser from "../api/admin/users/[name].js";
import * as rdmDone from "../api/admin/redemptions/[id].js";
import * as settings from "../api/admin/settings.js";

const env = async (coins = 0) => {
  const e = { DATA: kv() };
  await e.DATA.put("user:diva", JSON.stringify({ admin: true }));
  await e.DATA.put("user:ani", JSON.stringify({ role: "wh" }));
  await e.DATA.put("progress:ani", JSON.stringify({ les: {}, wallet: { conv: coins * 5, spent: 0, red: [] }, xp: { total: coins * 5 } }));
  return e;
};
const call = (fn, e, user, body, params, url = "http://x/") =>
  fn({ env: e, data: { user }, params, request: new Request(url, { method: "POST", body: JSON.stringify(body ?? {}) }) });
const res = async (r) => [r.status, await r.json()];
const prog = async (e, user = "ani") => (await call(progress.onRequestGet, e, user)).json();
const wallet = async (e) => JSON.parse(await e.DATA.get("progress:ani")).wallet;

test("redeem a reward: enough coins deducts and records; too few is refused", async () => {
  const e = await env(400);
  const [s, d] = await res(await call(redeem.onRequestPost, e, "ani", { reward: "ps" }));
  assert.equal(s, 200);
  assert.equal(d.coins, 100);
  assert.match(d.entry.code, /^JCW-[0-9A-F]{7}$/);
  assert.equal((await wallet(e)).spent, 300);
  assert.equal((await wallet(e)).red[0].code, d.entry.code);
  assert.equal((await call(redeem.onRequestPost, e, "ani", { reward: "ps" })).status, 409);
  assert.equal((await call(redeem.onRequestPost, e, "ani", { reward: "nope" })).status, 404);
  assert.equal((await prog(e, "diva")).notif, 1);
});

test("coupon: admin creates, user redeems once, coins deducted", async () => {
  const e = await env(100);
  assert.equal((await call(coupons.onRequestPost, e, "ani", { reward: "x", cost: 1 })).status, 403);
  assert.equal((await call(coupons.onRequestPost, e, "diva", { reward: "", cost: 1 })).status, 400);
  const [, { coupon }] = await res(await call(coupons.onRequestPost, e, "diva", { reward: "Mentoring 30 menit", cost: 80, code: "mentor-1" }));
  assert.equal(coupon.code, "MENTOR-1");
  assert.equal((await call(coupons.onRequestPost, e, "diva", { reward: "y", cost: 1, code: "MENTOR-1" })).status, 409);
  const [s, d] = await res(await call(redeem.onRequestPost, e, "ani", { coupon: " mentor-1 " }));
  assert.equal(s, 200);
  assert.deepEqual([d.entry.t, d.entry.cost, d.coins], ["Mentoring 30 menit", 80, 20]);
  assert.equal((await call(redeem.onRequestPost, e, "ani", { coupon: "MENTOR-1" })).status, 404);
  const [, list] = await res(await call(coupons.onRequestGet, e, "diva"));
  assert.equal(list.coupons[0].usedBy, "ani");
});

test("coupon costing more than the balance is refused and stays unused", async () => {
  const e = await env(10);
  await call(coupons.onRequestPost, e, "diva", { reward: "Besar", cost: 50, code: "BIG1" });
  assert.equal((await call(redeem.onRequestPost, e, "ani", { coupon: "BIG1" })).status, 409);
  assert.equal(JSON.parse(await e.DATA.get("coupon:BIG1")).usedBy, undefined);
  assert.equal((await wallet(e)).spent, 0);
});

test("admin marks a redemption done; user sees it, admin count drops", async () => {
  const e = await env(200);
  const [, { entry }] = await res(await call(redeem.onRequestPost, e, "ani", { reward: "cv" }));
  assert.deepEqual((await prog(e)).done, []);
  assert.equal((await call(rdmDone.onRequestPost, e, "diva", { action: "done" }, { id: entry.code })).status, 200);
  assert.deepEqual((await prog(e)).done, [entry.code]);
  assert.equal((await prog(e, "diva")).notif, 0);
  assert.equal((await call(rdmDone.onRequestPost, e, "ani", { action: "done" }, { id: entry.code })).status, 403);
});

test("cart checkout: batch request skips owned items and dedupes", async () => {
  const e = await env();
  const [s, d] = await res(await call(requests.onRequestPost, e, "ani", { items: [{ type: "mod", target: "fi-gl" }, { type: "mod", target: "fi-gl" }, { type: "role", target: "wh" }, { type: "role", target: "inv" }] }));
  assert.equal(s, 200);
  assert.deepEqual(d.requests.map((r) => r.target), ["fi-gl", "fi-gl", "inv"]);
  assert.equal(new Set(d.requests.map((r) => r.id)).size, 2);
  assert.equal((await prog(e)).requests.length, 2);
  assert.equal((await prog(e, "diva")).notif, 2);
  assert.equal((await call(requests.onRequestPost, e, "ani", { items: [{ type: "switch", target: "inv" }] })).status, 400);
  assert.equal((await call(requests.onRequestPost, e, "ani", { items: [] })).status, 400);
});

test("admin user detail shows EXP snapshot, coins and redemptions; settings store WA", async () => {
  const e = await env(400);
  await call(redeem.onRequestPost, e, "ani", { reward: "cl" });
  assert.equal((await call(adminUser.onRequestGet, e, "ani", null, { name: "ani" })).status, 403);
  const [, d] = await res(await call(adminUser.onRequestGet, e, "diva", null, { name: "ani" }));
  assert.deepEqual(d.wallet, { conv: 2000, spent: 50, earned: 400, coins: 350 });
  assert.equal(d.xp.total, 2000);
  assert.equal(d.redeemed[0].t, "Cover Letter");
  assert.equal((await call(settings.onRequestPut, e, "diva", { wa: "0812-3456-7890" })).status, 200);
  assert.equal((await call(settings.onRequestPut, e, "diva", { wa: "12" })).status, 400);
  assert.equal((await prog(e)).wa, "6281234567890");
  const [, all] = await res(await call(adminUsers.onRequestGet, e, "diva"));
  assert.equal(all.redemptions.length, 1);
  assert.equal(all.settings.wa, "6281234567890");
});
