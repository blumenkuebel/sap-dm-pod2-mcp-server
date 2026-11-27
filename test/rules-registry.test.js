// Consistency tests for the rule registry (src/rules/registry.ts, compiled to dist/).
//
// These guard the single source of truth against the exact structural defects found in the
// 2026-11-23 audit: registry↔doc drift, orphaned Phase 3 codes, double-classification,
// downgrade-list divergence, and missing provenance. They do NOT assert that a rule is factually
// correct — that stays a human audit (tracked via provenance.status).

import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { slugify } from "../scripts/check-doc-links.mjs";
import { buildMarkdown } from "../scripts/generate-rules-registry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCU = path.join(ROOT, "docu");

const { RULES } = await import(pathToFileURL(path.join(ROOT, "dist", "rules", "registry.js")).href);

const CATEGORY_DOC = {
  setup: "common-mistakes-setup.md",
  lifecycle: "common-mistakes-lifecycle.md",
  imports: "common-mistakes-imports.md",
  ui: "common-mistakes-ui.md",
  config: "common-mistakes-config.md",
  data: "common-mistakes-data.md",
  i18n: "common-mistakes-i18n.md",
};

function read(file) {
  return fs.readFileSync(path.join(DOCU, file), "utf8");
}

/** Anchors a markdown file exposes (GitHub slug + -1/-2 dedup), mirroring collectAnchors. */
function anchorsOf(file) {
  const seen = new Map();
  const set = new Set();
  for (const line of read(file).split("\n")) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (!m) continue;
    let slug = slugify(m[1]);
    if (seen.has(slug)) {
      const n = seen.get(slug) + 1;
      seen.set(slug, n);
      slug = `${slug}-${n}`;
    } else seen.set(slug, 0);
    set.add(slug);
  }
  return set;
}

/** Parse the Phase 3 severity lists in validate-project-instructions.md into id→list membership. */
function phase3Lists() {
  const lines = read("validate-project-instructions.md").split("\n");
  const slice = (a, b) => {
    let s = -1,
      e = lines.length;
    for (let i = 0; i < lines.length; i++) {
      if (s < 0 && a.test(lines[i])) {
        s = i;
        continue;
      }
      if (s >= 0 && b.test(lines[i])) {
        e = i;
        break;
      }
    }
    return lines.slice(s, e).join("\n");
  };
  const mCodes = (block) => {
    const ids = new Set();
    for (const b of block.matchAll(/\*\*([^*]+)\*\*/g)) {
      const t = b[1];
      for (const r of t.matchAll(/M(\d+)\s*[–-]\s*M(\d+)/g)) for (let n = +r[1]; n <= +r[2]; n++) ids.add("M" + n);
      for (const m of t.matchAll(/M(\d+)[A-Z]?/g)) ids.add("M" + m[1]);
    }
    return ids;
  };
  const errors = slice(/^### Errors/, /^### Warnings/);
  const warnings = slice(/^### Warnings/, /^### Info/);
  const info = slice(/^### Info/, /^### HTML5 Residue/);
  const html5 = slice(/^### HTML5 Residue/, /^## Phase 3b/);
  return {
    errors: mCodes(errors),
    warnings: mCodes(warnings),
    info: mCodes(info),
    html5: new Set([...html5.matchAll(/\b(HTML5-[A-Z-]+)\b/g)].map((m) => m[1])),
  };
}

/** M-codes the "cannot be downgraded" lists mark as non-downgradable. */
function downgradeList(file, startRe, endRe) {
  const lines = read(file).split("\n");
  let s = -1,
    e = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (s < 0 && startRe.test(lines[i])) {
      s = i;
      continue;
    }
    if (s >= 0 && endRe && endRe.test(lines[i])) {
      e = i;
      break;
    }
  }
  const block = lines.slice(s, e).join("\n");
  const ids = new Set();
  for (const line of block.split("\n")) {
    const lm = line.match(/^- \**((?:M\d+[A-Z]?[/, –-]*)+)/);
    if (!lm) continue;
    for (const r of lm[1].matchAll(/M(\d+)\s*[–-]\s*M(\d+)/g)) for (let n = +r[1]; n <= +r[2]; n++) ids.add("M" + n);
    for (const m of lm[1].matchAll(/M(\d+)[A-Z]?/g)) ids.add("M" + m[1]);
  }
  return ids;
}

test("every rule has a unique id", () => {
  const ids = RULES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate rule id in registry");
});

test("every rule anchor resolves to a heading in its category doc", () => {
  const cache = new Map();
  for (const r of RULES) {
    if (!r.anchor) continue; // HTML5-* have no owning heading
    const file = CATEGORY_DOC[r.category];
    assert.ok(file, `${r.id}: category "${r.category}" has no mistake doc but a non-null anchor`);
    if (!cache.has(file)) cache.set(file, anchorsOf(file));
    assert.ok(
      cache.get(file).has(r.anchor),
      `${r.id}: anchor "${r.anchor}" not found in ${file} (registry↔doc drift — heading renamed?)`,
    );
  }
});

test("no M-code enumerated in Phase 3 is missing from the registry (no dangling refs)", () => {
  const lists = phase3Lists();
  const known = new Set(RULES.map((r) => r.id));
  for (const [listName, set] of Object.entries(lists)) {
    for (const id of set) {
      if (id === "M73" && listName === "html5") continue; // M73 is a cross-ref in the HTML5 block
      assert.ok(known.has(id), `${id} is listed under Phase 3 "${listName}" but has no registry entry`);
    }
  }
});

test("each M-code sits in exactly one Phase 3 severity list, matching rule.auditList", () => {
  const lists = phase3Lists();
  for (const r of RULES) {
    if (!r.id.startsWith("M")) continue;
    const membership = ["errors", "warnings", "info"].filter((k) => lists[k].has(r.id));
    assert.ok(membership.length <= 1, `${r.id} is double-classified across Phase 3 lists: ${membership.join(", ")}`);
    const actual = membership[0] ?? "none";
    assert.equal(
      r.auditList,
      actual,
      `${r.id}: registry.auditList="${r.auditList}" but Phase 3 places it in "${actual}"`,
    );
  }
});

test("HTML5-* rules match the Phase 3 HTML5 Residue list", () => {
  const lists = phase3Lists();
  const regH5 = new Set(RULES.filter((r) => r.id.startsWith("HTML5-")).map((r) => r.id));
  for (const id of lists.html5) {
    if (id === "M73") continue;
    assert.ok(regH5.has(id), `${id} listed under Phase 3 HTML5 Residue but missing from registry`);
  }
});

test("downgradability is consistent with both 'cannot be downgraded' lists", () => {
  // Hub list is the canonical mirror of rule.downgradable === false.
  const hub = downgradeList("common-mistakes-index.md", /^### What CANNOT be downgraded/, /^## /);
  const nonDowngradable = new Set(RULES.filter((r) => r.id.startsWith("M") && !r.downgradable).map((r) => r.id));
  for (const id of hub) {
    if (!RULES.some((r) => r.id === id)) continue; // ignore retired numbers in prose
    assert.ok(
      nonDowngradable.has(id),
      `${id} is in the hub "cannot be downgraded" list but registry marks it downgradable`,
    );
  }
  for (const id of nonDowngradable) {
    assert.ok(
      hub.has(id),
      `${id} is downgradable:false in registry but absent from the hub "cannot be downgraded" list`,
    );
  }
  // Validator "broken code" list must be a SUBSET of non-downgradable (catches the dangerous drift
  // direction without forcing the two differently-scoped lists to be identical).
  const broken = downgradeList("validate-project-instructions.md", /cannot be downgraded by markers/, /^## /);
  for (const id of broken) {
    if (!RULES.some((r) => r.id === id)) continue;
    assert.ok(
      nonDowngradable.has(id),
      `${id} is in the validator "broken code" list but registry marks it downgradable`,
    );
  }
});

test("every rule carries a provenance status; verified requires a source", () => {
  for (const r of RULES) {
    assert.ok(
      ["verified", "inferred", "unverified"].includes(r.provenance.status),
      `${r.id}: invalid provenance.status`,
    );
    if (r.provenance.status === "verified") {
      assert.ok(
        r.provenance.source && r.provenance.source.trim().length > 0,
        `${r.id}: provenance.status="verified" requires a non-empty source`,
      );
    }
    assert.ok(r.severityReason && r.severityReason.trim().length > 0, `${r.id}: missing severityReason`);
  }
});

test("docu/rules-registry.md is up to date with the registry", async () => {
  const committed = fs.readFileSync(path.join(DOCU, "rules-registry.md"), "utf8");
  const regenerated = await buildMarkdown();
  assert.equal(
    committed,
    regenerated,
    "docu/rules-registry.md is stale — run `npm run generate-rules-registry` and commit the result",
  );
});
