import { test } from "node:test";
import assert from "node:assert/strict";
import { checkDocLinks, slugify, collectAnchors } from "../scripts/check-doc-links.mjs";

/** Stable key independent of line number: "file → target". */
const keyOf = (d) => `${d.file} → ${d.target}`;

test("slugify matches GitHub heading-anchor rules", () => {
  assert.equal(slugify("ALTERNATE_BOM_COMPONENT"), "alternate_bom_component"); // underscores kept
  assert.equal(slugify("SFCStatusCode (Public-API Worklist business status)"), "sfcstatuscode-public-api-worklist-business-status");
  assert.equal(slugify("Status Codes Reference"), "status-codes-reference");
  assert.equal(slugify("A / B"), "a--b"); // space-slash-space → double hyphen
  assert.equal(slugify("`code` heading"), "code-heading"); // ticks dropped
});

test("collectAnchors deduplicates repeated headings", () => {
  const anchors = collectAnchors("# Dup\n## Dup\n### Other");
  assert.ok(anchors.has("dup"));
  assert.ok(anchors.has("dup-1"));
  assert.ok(anchors.has("other"));
});

test("no dead internal doc links", () => {
  const dead = checkDocLinks();
  assert.deepEqual(
    dead.map(keyOf).sort(),
    [],
    `Dead internal doc link(s) found — fix the target or the anchor:\n${dead
      .map((d) => `  ${d.file}:${d.line} [${d.kind}] → ${d.target}`)
      .join("\n")}`,
  );
});

