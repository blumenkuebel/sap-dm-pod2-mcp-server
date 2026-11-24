// Gate test for the fact-verification harness. Part of `npm test`.
//
// Asserts every Tier-A rule (verification.method ui5-api/pod2-api/rest-api with checks)
// currently PASSES against the bundled specs. When a spec update invalidates a fact, the
// rule's verdict flips to fail/unverifiable and this test goes red — forcing a review and
// a lifecycle.status update. That red build IS the obsolescence signal.
//
// It does NOT judge Tier-B rules (behavior/convention/manual) — those carry no checks.

import { test } from "node:test";
import assert from "node:assert/strict";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { verifyRule } from "../scripts/verify-rules-core.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { RULES } = await import(pathToFileURL(path.join(ROOT, "dist", "rules", "registry.js")).href);

const TIER_A = new Set(["ui5-api", "pod2-api", "rest-api"]);
const TIER_B = new Set(["behavior", "convention", "manual", "framework-source"]);

test("schema hygiene: checks only on Tier-A methods; Tier-B carries no checks", () => {
  for (const r of RULES) {
    const v = r.verification;
    if (!v) continue;
    const hasChecks = (v.checks?.length ?? 0) > 0;
    if (hasChecks) {
      assert.ok(TIER_A.has(v.method), `${r.id}: has checks but method "${v.method}" is not Tier-A`);
    }
    if (TIER_B.has(v.method)) {
      assert.ok(!hasChecks, `${r.id}: Tier-B method "${v.method}" must not carry machine checks`);
    }
  }
});

test("every Tier-A rule passes fact verification against the bundled specs", () => {
  const tierA = RULES.filter((r) => (r.verification?.checks?.length ?? 0) > 0);
  assert.ok(tierA.length > 0, "expected at least one seeded Tier-A rule");
  for (const r of tierA) {
    const res = verifyRule(r);
    assert.equal(
      res.verdict,
      "pass",
      `${r.id} verdict=${res.verdict} (obsolete/wrong fact?): ` +
        [...res.failures, ...res.unverifiable].map((x) => x.detail).join("; "),
    );
  }
});

test("seeded Tier-A rules record the spec snapshot they were authored against", () => {
  for (const r of RULES) {
    if ((r.verification?.checks?.length ?? 0) === 0) continue;
    assert.ok(
      r.verification.authoredAgainst?.dmRelease || r.verification.authoredAgainst?.ui5Version,
      `${r.id}: Tier-A rule must record verification.authoredAgainst`,
    );
  }
});
