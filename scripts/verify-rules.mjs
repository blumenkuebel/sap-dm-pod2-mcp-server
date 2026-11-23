#!/usr/bin/env node
// Dev viewer for the fact-verification harness (NOT a CI gate — that is
// test/verify-rules.test.js). Prints each Tier-A rule's verdict against the
// bundled specs.
//
// Usage:  npm run build && node scripts/verify-rules.mjs

import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { verifyAll, checkedAgainst } from "./verify-rules-core.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { RULES } = await import(pathToFileURL(path.join(ROOT, "dist", "rules", "registry.js")).href);

const ca = checkedAgainst();
console.log(`Fact verification — checked against UI5 ${ca.ui5Version}, SAP DM ${ca.dmRelease}\n`);

const results = verifyAll(RULES);
const icon = { pass: "✅ PASS", fail: "❌ FAIL", unverifiable: "❔ UNVERIFIABLE" };
let pass = 0,
  fail = 0,
  unv = 0;
for (const r of results) {
  if (r.verdict === "pass") pass++;
  else if (r.verdict === "fail") fail++;
  else unv++;
  const detail =
    r.verdict === "pass" ? "" : "  → " + [...r.failures, ...r.unverifiable].map((x) => x.detail).join("; ");
  console.log(`${icon[r.verdict].padEnd(16)} ${r.id} (${r.method})${detail}`);
}
console.log(`\n${results.length} Tier-A rules — ${pass} pass, ${fail} fail, ${unv} unverifiable`);
process.exit(fail ? 1 : 0);
