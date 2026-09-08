import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  safePath,
  isTextFile,
  listEndpoints,
  matchOperation,
  collectRefs,
  sliceOperation,
  searchFiles,
  formatSearchResults,
  readFileContent,
  tryReadFileContent,
  listFilesRecursive,
  missingSpecsMessage,
  getCacheStats,
  dirListingCache,
  CACHE_MAX_ENTRIES,
} from "../dist/helpers.js";
import { extractSection, extractSectionHeadings } from "../dist/tools/docs.js";

// ── safePath (path-traversal guard) ──────────────────────────────────────

test("safePath resolves a child path inside the base", () => {
  assert.equal(safePath("/base", "file.md"), path.resolve("/base", "file.md"));
  assert.equal(safePath("/base", "sub", "file.md"), path.resolve("/base/sub/file.md"));
});

test("safePath normalizes '..' segments that stay inside the base", () => {
  assert.equal(safePath("/base", "sub/../file.md"), path.resolve("/base/file.md"));
});

test("safePath returns null when the path escapes the base", () => {
  assert.equal(safePath("/base", "../secret"), null);
  assert.equal(safePath("/base", "../../etc/passwd"), null);
});

test("safePath returns null for an absolute path outside the base", () => {
  assert.equal(safePath("/base", "/etc/passwd"), null);
});

test("safePath allows the base directory itself", () => {
  assert.equal(safePath("/base"), path.resolve("/base"));
});

test("safePath rejects a sibling directory that shares the base name as a prefix", () => {
  // "/base-evil" starts with "/base" textually but is NOT inside it.
  assert.equal(safePath("/base", "../base-evil/secret"), null);
  assert.equal(safePath("/base", "../baseline"), null);
});

// ── isTextFile ────────────────────────────────────────────────────────────

test("isTextFile recognizes known text extensions", () => {
  assert.equal(isTextFile("/x/readme.md"), true);
  assert.equal(isTextFile("/x/data.json"), true);
  assert.equal(isTextFile("/x/style.css"), true);
});

test("isTextFile rejects binary/unknown extensions", () => {
  assert.equal(isTextFile("/x/logo.png"), false);
  assert.equal(isTextFile("/x/archive.zip"), false);
});

test("isTextFile treats manifest files and dotfiles as text", () => {
  assert.equal(isTextFile("/x/extension.json"), true);
  assert.equal(isTextFile("/x/manifest.json"), true);
  assert.equal(isTextFile("/x/.gitignore"), true);
});

// ── OpenAPI slicing (listEndpoints / matchOperation) ─────────────────────

const SPEC = {
  swagger: "2.0",
  info: { title: "t", version: "1" },
  paths: {
    "/sfcs/split": {
      post: { operationId: "splitSfc", responses: {} },
      get: { operationId: "getSfc", responses: {} },
      parameters: [{ name: "ignored" }],
    },
    "/materials": {
      get: { operationId: "listMaterials", responses: {} },
    },
  },
  definitions: {},
};

test("listEndpoints returns only real (path, method) pairs", () => {
  const eps = listEndpoints(SPEC);
  assert.equal(eps.length, 3);
  assert.ok(eps.every((e) => ["get", "post"].includes(e.method)));
  assert.ok(!eps.some((e) => e.method === "parameters"));
});

test("matchOperation matches 'METHOD /path' form", () => {
  const hit = matchOperation(SPEC, "POST /sfcs/split");
  assert.equal(hit.method, "post");
  assert.equal(hit.path, "/sfcs/split");
});

test("matchOperation returns candidates for an ambiguous path-only selector", () => {
  const res = matchOperation(SPEC, "/sfcs/split");
  assert.equal(res.path, null);
  assert.equal(res.candidates.length, 2);
});

test("matchOperation resolves a unique path-only selector", () => {
  const hit = matchOperation(SPEC, "/materials");
  assert.equal(hit.method, "get");
  assert.equal(hit.path, "/materials");
});

test("matchOperation matches by operationId", () => {
  const hit = matchOperation(SPEC, "splitSfc");
  assert.equal(hit.path, "/sfcs/split");
  assert.equal(hit.method, "post");
});

test("matchOperation returns a null result when nothing matches", () => {
  const res = matchOperation(SPEC, "does-not-exist");
  assert.equal(res.operation, null);
  assert.deepEqual(res.candidates, []);
});

// ── collectRefs / sliceOperation ─────────────────────────────────────────

test("collectRefs gathers transitive definition names, cycle-safe", () => {
  const spec = {
    definitions: {
      A: { properties: { b: { $ref: "#/definitions/B" } } },
      B: { properties: { self: { $ref: "#/definitions/B" }, c: { $ref: "#/definitions/C" } } },
      C: { type: "string" },
    },
  };
  const visited = new Set();
  collectRefs(spec.definitions.A, spec, visited);
  assert.deepEqual([...visited].sort(), ["B", "C"]);
});

test("sliceOperation keeps only the reachable definitions and single path", () => {
  const spec = {
    swagger: "2.0",
    info: { title: "t", version: "1" },
    host: "example",
    basePath: "/api",
    paths: {
      "/x": { post: { responses: { 200: { schema: { $ref: "#/definitions/Used" } } } } },
      "/y": { get: { responses: {} } },
    },
    definitions: {
      Used: { type: "object" },
      Unused: { type: "object" },
    },
  };
  const slice = sliceOperation(spec, "/x", "post", spec.paths["/x"].post);
  assert.deepEqual(Object.keys(slice.paths), ["/x"]);
  assert.ok("Used" in slice.definitions);
  assert.ok(!("Unused" in slice.definitions));
  assert.equal(slice.host, "example");
});

// ── searchFiles (TF scoring + word boundaries) ───────────────────────────

let TMP;
test("searchFiles setup: write fixtures", () => {
  TMP = fs.mkdtempSync(path.join(os.tmpdir(), "pod2-search-"));
  fs.writeFileSync(
    path.join(TMP, "widget-patterns.md"),
    "# Widget Patterns\nUse ControlWidget for a widget.\nMore widget details here.",
  );
  fs.writeFileSync(
    path.join(TMP, "dialog.md"),
    "# Dialog\nDialog lifecycle and destruction.\nA transaction is not an action here.",
  );
});

test("searchFiles ranks the filename+heading match highest", () => {
  const results = searchFiles(TMP, ["widget-patterns.md", "dialog.md"], "widget");
  assert.ok(results.length >= 1);
  assert.equal(results[0].file, "widget-patterns.md");
  assert.ok(results[0].score > 0);
});

test("searchFiles uses word boundaries ('action' must not match 'transaction')", () => {
  const results = searchFiles(TMP, ["dialog.md"], "action");
  // 'action' appears as a whole word once ("an action"), but not inside "transaction"
  assert.equal(results.length, 1);
  assert.equal(results[0].matchCount, 1);
});

test("searchFiles mode 'all' requires every token", () => {
  const any = searchFiles(TMP, ["widget-patterns.md", "dialog.md"], "widget dialog", 20, 8, "any");
  const all = searchFiles(TMP, ["widget-patterns.md", "dialog.md"], "widget dialog", 20, 8, "all");
  assert.equal(any.length, 2); // each file has one of the tokens
  assert.equal(all.length, 0); // no file has both tokens
});

test("searchFiles returns [] for an empty query", () => {
  assert.deepEqual(searchFiles(TMP, ["dialog.md"], "   "), []);
});

test("searchFiles teardown", () => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

test("formatSearchResults renders file, count and relevance", () => {
  const out = formatSearchResults([
    { file: "a.md", matchCount: 2, score: 12.5, lines: ["Line 1: foo", "Line 2: bar"] },
  ]);
  assert.equal(out.length, 1);
  assert.match(out[0], /a\.md/);
  assert.match(out[0], /2 matches/);
  assert.match(out[0], /relevance: 12\.5/);
});

// ── extractSection / extractSectionHeadings ──────────────────────────────

const DOC = [
  "# Title",
  "intro",
  "## Mistake #33",
  "body 33 line 1",
  "body 33 line 2",
  "### Sub of 33",
  "sub body",
  "## Mistake #34",
  "body 34",
].join("\n");

test("extractSection returns a block up to the next same-or-higher heading", () => {
  const section = extractSection(DOC, "Mistake #33");
  assert.match(section, /## Mistake #33/);
  assert.match(section, /body 33 line 2/);
  assert.match(section, /### Sub of 33/); // nested lower-level heading is included
  assert.ok(!section.includes("Mistake #34"));
});

test("extractSection returns null when the heading is absent", () => {
  assert.equal(extractSection(DOC, "Mistake #99"), null);
});

test("extractSectionHeadings lists all headings with indentation by level", () => {
  const headings = extractSectionHeadings(DOC);
  assert.ok(headings.includes("Title"));
  assert.ok(headings.some((h) => h.trim() === "Mistake #33"));
  assert.ok(headings.some((h) => h.startsWith("    ") && h.trim() === "Sub of 33"));
});

// ── readFileContent / tryReadFileContent (TTL cache) ─────────────────────

test("readFileContent reads a file and serves the cached copy within the TTL", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pod2-read-"));
  const file = path.join(dir, "note.md");
  try {
    fs.writeFileSync(file, "original");
    assert.equal(readFileContent(file), "original");

    // Overwrite on disk; within the TTL the cached value must still win.
    fs.writeFileSync(file, "changed");
    assert.equal(readFileContent(file), "original");
    assert.ok(getCacheStats().filesCached >= 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("readFileContent throws for a missing file", () => {
  assert.throws(() => readFileContent("/no/such/file-xyz.md"), /File not found/);
});

test("tryReadFileContent returns null instead of throwing for a missing file", () => {
  assert.equal(tryReadFileContent("/no/such/file-xyz.md"), null);
});

// ── listFilesRecursive (filters, recursion, graceful absence) ────────────

test("listFilesRecursive returns [] for an absent directory", () => {
  assert.deepEqual(listFilesRecursive("/no/such/dir-xyz"), []);
});

test("listFilesRecursive skips dotfiles and excluded dirs, and recurses with prefixes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pod2-tree-"));
  try {
    fs.writeFileSync(path.join(root, "a.md"), "a");
    fs.writeFileSync(path.join(root, ".hidden"), "h");
    fs.mkdirSync(path.join(root, "sub"));
    fs.writeFileSync(path.join(root, "sub", "b.md"), "b");
    fs.mkdirSync(path.join(root, "node_modules"));
    fs.writeFileSync(path.join(root, "node_modules", "dep.js"), "x");

    const files = listFilesRecursive(root).sort();
    assert.deepEqual(files, ["a.md", "sub/b.md"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("listFilesRecursive serves a cached copy on the second call", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pod2-tree2-"));
  try {
    fs.writeFileSync(path.join(root, "a.md"), "a");
    const first = listFilesRecursive(root);

    // A file added after the first (cached) call must not appear within the TTL.
    fs.writeFileSync(path.join(root, "b.md"), "b");
    const second = listFilesRecursive(root);
    assert.deepEqual(second, first);
    assert.equal(second.length, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// ── dirListingCache LRU eviction ─────────────────────────────────────────

test("dirListingCache evicts the oldest entries once it exceeds CACHE_MAX_ENTRIES", () => {
  dirListingCache.clear();
  // Fill to the cap with stale entries; the very first is the oldest.
  for (let i = 0; i < CACHE_MAX_ENTRIES; i++) {
    dirListingCache.set(`stale-${i}`, { files: [], ts: i });
  }
  assert.equal(dirListingCache.size, CACHE_MAX_ENTRIES);

  // A real listing inserts one more entry and triggers eviction.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pod2-evict-"));
  try {
    fs.writeFileSync(path.join(root, "a.md"), "a");
    listFilesRecursive(root);
    assert.ok(dirListingCache.size <= CACHE_MAX_ENTRIES);
    assert.equal(dirListingCache.has("stale-0"), false); // oldest was dropped
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    dirListingCache.clear();
  }
});

// ── missingSpecsMessage ──────────────────────────────────────────────────

test("missingSpecsMessage embeds the label and the git-ignored directory", () => {
  const msg = missingSpecsMessage("POD2 API documentation", "docu/pod2-api-specs/");
  assert.match(msg, /POD2 API documentation/);
  assert.match(msg, /docu\/pod2-api-specs\//);
  assert.match(msg, /prepare:specs|update-ui5-api-specs|fetch-rest-specs/);
});
