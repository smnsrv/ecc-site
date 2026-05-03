import assert from "node:assert/strict";
import test from "node:test";
import { articleKeysFromData, buildHash, parseAppHash } from "./hashRoute.js";

const keys = ["household", "metal", "plastic_pipes_fittings"];

test("parseAppHash: пустой хеш → главная", () => {
  assert.equal(parseAppHash("", keys).page, "home");
  assert.equal(parseAppHash("#", keys).page, "home");
  assert.equal(parseAppHash("#/", keys).page, "home");
});

test("parseAppHash: разделы", () => {
  assert.equal(parseAppHash("#/services", keys).page, "services");
  assert.equal(parseAppHash("#/about", keys).page, "about");
  assert.equal(parseAppHash("#/contacts", keys).page, "contacts");
  assert.equal(parseAppHash("#/certification-stages", keys).page, "certification-stages");
});

test("parseAppHash: услуга по id", () => {
  const p = parseAppHash("#/service/2", keys);
  assert.equal(p.page, "service");
  assert.equal(p.serviceId, 2);
});

test("parseAppHash: we-certify и статья", () => {
  assert.equal(parseAppHash("#/we-certify", keys).page, "we-certify");
  assert.equal(parseAppHash("#/we-certify", keys).articleKey, null);
  const d = parseAppHash("#/we-certify/household", keys);
  assert.equal(d.page, "we-certify");
  assert.equal(d.articleKey, "household");
});

test("parseAppHash: неизвестный ключ статьи → список", () => {
  const p = parseAppHash("#/we-certify/unknown_xyz", keys);
  assert.equal(p.page, "we-certify");
  assert.equal(p.articleKey, null);
});

test("parseAppHash: admin", () => {
  assert.equal(parseAppHash("#/admin", keys).admin, true);
});

test("parseAppHash: legacy hash", () => {
  const p = parseAppHash("#we-certify-article-household", keys);
  assert.equal(p.page, "we-certify");
  assert.equal(p.articleKey, "household");
  assert.equal(p.legacyHash, true);
});

test("buildHash: основные маршруты", () => {
  assert.equal(buildHash("home"), "#/");
  assert.equal(buildHash("services"), "#/services");
  assert.equal(buildHash("service", { id: 4 }), "#/service/4");
  assert.equal(buildHash("we-certify", { articleKey: "metal" }), "#/we-certify/metal");
  assert.equal(buildHash("we-certify", {}), "#/we-certify");
});

test("articleKeysFromData", () => {
  const k = articleKeysFromData({ a: {}, b: {} });
  assert.deepEqual(k.sort(), ["a", "b"]);
});
