import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkDocApiRefs,
  buildGroundTruthIndex,
  resolveImport,
  isNegativeExample,
} from "../scripts/check-doc-api-refs.mjs";

/** Stable key independent of line number: "file → ref". */
const keyOf = (f) => `${f.file} → ${f.ref}`;

test("buildGroundTruthIndex loads the committed POD2 specs", () => {
  const index = buildGroundTruthIndex();
  // Guard against a silently-empty spec dir (would make the gate pass vacuously).
  assert.ok(index.classFqns.size > 100, "expected the committed pod2-api-specs/ to be present");
  assert.ok(index.classFqns.has("sap.dm.dme.pod2.context.PodContext"));
});

test("resolveImport: correct class path resolves", () => {
  const index = buildGroundTruthIndex();
  assert.equal(resolveImport("sap/dm/dme/pod2/context/PodContext", index).status, "class-file");
});

test("resolveImport: enum/constant resolves as namespace member", () => {
  const index = buildGroundTruthIndex();
  // WorkListType lives inside enumeration.md, ModelPath inside context.md — not as own files.
  assert.equal(resolveImport("sap/dm/dme/pod2/enumeration/WorkListType", index).status, "ns-member");
  assert.equal(resolveImport("sap/dm/dme/pod2/context/ModelPath", index).status, "ns-member");
});

test("resolveImport: wrong path is detected with a suggestion", () => {
  const index = buildGroundTruthIndex();
  const res = resolveImport("sap/dm/dme/pod2/model/PodContext", index);
  assert.equal(res.status, "wrong-path");
  assert.ok(res.candidates.includes("sap.dm.dme.pod2.context.PodContext"));
});

test("resolveImport: unknown leaf (possible spec gap) is NOT flagged", () => {
  const index = buildGroundTruthIndex();
  // A name that exists nowhere must be "unknown", never "wrong-path" — the spec is incomplete.
  assert.equal(resolveImport("sap/dm/dme/pod2/nowhere/TotallyMadeUpClass", index).status, "unknown");
});

test("isNegativeExample recognises intentional WRONG examples", () => {
  assert.ok(isNegativeExample("// ❌ WRONG - These paths don't exist!"));
  assert.ok(isNegativeExample("These paths don't exist"));
  assert.equal(isNegativeExample('import X from "sap/dm/dme/pod2/context/PodContext";'), false);
});

test("no wrong POD2 API import paths in docu", () => {
  const findings = checkDocApiRefs();
  const errors = findings.filter((f) => f.severity === "error");
  assert.deepEqual(
    errors.map(keyOf).sort(),
    [],
    `Wrong POD2 API import path(s) — fix the doc:\n${errors
      .map((e) => `  ${e.file}:${e.line} ${e.ref}  → use ${e.suggestion}`)
      .join("\n")}`,
  );
});
