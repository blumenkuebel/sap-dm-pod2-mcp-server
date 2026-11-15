#!/usr/bin/env node
// Checks that POD2 API import paths used in docu/*.md resolve against the generated
// ground truth in docu/pod2-api-specs/.
//
// Scope (deliberately narrow — see docu/_QA-IMPROVEMENT-PLAN notes / plan):
//   - Only slash-notation imports under `sap/dm/dme/pod2/...` are scanned.
//   - A reference is a HARD ERROR only when it is PROVABLY wrong: the imported leaf class
//     name exists in the ground truth at a DIFFERENT path. Then we can suggest the real one.
//   - A leaf that exists nowhere is NOT reported — the ground truth is a generated JSDoc
//     snapshot and is known to be incomplete ("missing from spec" ≠ "does not exist").
//   - Method names are NOT checked (spec gaps make that too noisy to be trustworthy).
//
// Resolution is two-stage (both required, else ~58% false positives):
//   (a) class file:   `<fqn>.md` exists in pod2-api-specs/
//   (b) ns member:    leaf is a `### (static[, constant]) Leaf` entry inside `<parentNs>.md`
//                     (enums/constants live inside their namespace file, not as own files)
//
// Intentional WRONG examples in the docs (lines marked ❌ / "WRONG" / "don't exist") are
// skipped — those teach the mistake on purpose and must not be flagged.
//
// Usage:  node scripts/check-doc-api-refs.mjs [docuDir] [specsDir]
// Exit 0 = no hard errors, 1 = provable wrong import path(s). Also exported for the test suite.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DOCU_DIR = path.resolve(__dirname, "..", "docu");
export const DEFAULT_SPECS_DIR = path.resolve(__dirname, "..", "docu", "pod2-api-specs");

const POD2_PREFIX = "sap.dm.dme.pod2";
// Matches a slash-notation import path under the pod2 namespace, e.g.
//   sap/dm/dme/pod2/context/PodContext
const IMPORT_PATH_RE = /sap\/dm\/dme\/pod2\/[A-Za-z0-9/$]+/g;
// A member heading inside a namespace file: "### (static, constant) Foo :Enum.<string>"
// or "### (static) Bar ...". We capture the first identifier after the modifiers.
const NS_MEMBER_RE = /^###\s+(?:\((?:static|abstract)(?:,\s*constant)?\)\s+)*([A-Za-z_$][\w$]*)/;

/** True if a doc line (or its surrounding marker) denotes an intentional "wrong" example. */
export function isNegativeExample(line) {
  return /❌|🚫|\bWRONG\b|do(?:es)?\s*n['o]t\s+exist|don't exist|NEVER\b/i.test(line);
}

/** Leaf (last dot-segment) of a FQN or an "a/b/c" path. */
function leafOf(dotted) {
  const parts = dotted.split(".");
  return parts[parts.length - 1];
}

/** A FQN segment that names a class/type (UpperCamel or $Type), not a lowercase namespace. */
function isClassLeaf(leaf) {
  return /^[A-Z$]/.test(leaf);
}

/**
 * Build the ground-truth index from pod2-api-specs/*.md.
 * Returns { classFqns:Set, leafToFqns:Map<string,string[]>, nsMembers:Map<string,Set> }.
 */
export function buildGroundTruthIndex(specsDir = DEFAULT_SPECS_DIR) {
  const classFqns = new Set();
  const leafToFqns = new Map();
  const nsMembers = new Map();

  if (!fs.existsSync(specsDir)) {
    return { classFqns, leafToFqns, nsMembers };
  }

  const files = fs.readdirSync(specsDir).filter((f) => f.endsWith(".md") && f !== "index.md");

  for (const file of files) {
    const fqn = file.slice(0, -3); // strip ".md"
    classFqns.add(fqn);

    const leaf = leafOf(fqn);
    if (!leafToFqns.has(leaf)) leafToFqns.set(leaf, []);
    leafToFqns.get(leaf).push(fqn);

    // A lowercase last segment marks a namespace-stub file whose members are enums/constants.
    if (!isClassLeaf(leaf)) {
      const members = new Set();
      const content = fs.readFileSync(path.join(specsDir, file), "utf-8");
      for (const line of content.split("\n")) {
        const m = line.match(NS_MEMBER_RE);
        if (m) members.add(m[1]);
      }
      nsMembers.set(fqn, members);
    }
  }
  return { classFqns, leafToFqns, nsMembers };
}

/**
 * Resolve one slash-notation import path against the ground truth.
 * Returns { status, candidates? }:
 *   "class-file" | "ns-member" → resolves fine (no finding)
 *   "wrong-path"               → leaf exists elsewhere (hard error); candidates = real FQNs
 *   "unknown"                  → not resolvable and not provably wrong (ignore)
 */
export function resolveImport(slashPath, index) {
  const fqn = slashPath.replace(/\//g, ".");
  const leaf = leafOf(fqn);

  if (index.classFqns.has(fqn)) return { status: "class-file" };

  const parentNs = fqn.slice(0, fqn.lastIndexOf("."));
  if (index.nsMembers.get(parentNs)?.has(leaf)) return { status: "ns-member" };

  // lowercase leaf or stray segment → namespace/path fragment, not a class → noise
  if (!isClassLeaf(leaf)) return { status: "unknown" };

  // Same class name exists at a different path → provably wrong import path.
  if (index.leafToFqns.has(leaf)) {
    return { status: "wrong-path", candidates: index.leafToFqns.get(leaf) };
  }

  // Leaf exists nowhere → could be a spec gap (like DateTimeUtils.localeDate) or fiction.
  // Not provable → ignore.
  return { status: "unknown" };
}

/**
 * Scan docu/*.md for POD2 slash-notation imports whose path is provably wrong.
 * Returns a flat array of { file, line, ref, severity:"error", suggestion, message }.
 * Does not throw, does not print.
 */
export function checkDocApiRefs(docuDir = DEFAULT_DOCU_DIR, specsDir = DEFAULT_SPECS_DIR) {
  const index = buildGroundTruthIndex(specsDir);
  const findings = [];

  const mdFiles = fs
    .readdirSync(docuDir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !f.startsWith("_"));

  for (const file of mdFiles) {
    const lines = fs.readFileSync(path.join(docuDir, file), "utf-8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      // Skip intentional "wrong" examples (❌ / WRONG / "don't exist"), including the case
      // where the marker is on the line just above the import inside a code block.
      if (isNegativeExample(rawLine) || (i > 0 && isNegativeExample(lines[i - 1]))) continue;

      IMPORT_PATH_RE.lastIndex = 0;
      let m;
      while ((m = IMPORT_PATH_RE.exec(rawLine)) !== null) {
        const slashPath = m[0];
        const res = resolveImport(slashPath, index);
        if (res.status !== "wrong-path") continue;

        const suggestion = res.candidates[0].replace(/\./g, "/");
        const leaf = leafOf(res.candidates[0]);
        findings.push({
          file,
          line: i + 1,
          ref: slashPath,
          severity: "error",
          suggestion,
          message: `Class '${leaf}' exists at ${res.candidates.join(", ")}, not at the imported path.`,
        });
      }
    }
  }
  return findings;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const docuDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DOCU_DIR;
  const specsDir = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_SPECS_DIR;
  const findings = checkDocApiRefs(docuDir, specsDir);
  const errors = findings.filter((f) => f.severity === "error");

  if (errors.length === 0) {
    console.log(`✅ No wrong POD2 API import paths in ${docuDir}`);
    process.exit(0);
  }
  console.error(`❌ ${errors.length} wrong POD2 API import path(s) in ${docuDir}:\n`);
  for (const e of errors) {
    console.error(`  ${e.file}:${e.line}  ${e.ref}`);
    console.error(`      → use  ${e.suggestion}`);
  }
  console.error(`\n→ These paths fail to load at runtime. Fix the import path in the doc.`);
  process.exit(1);
}
