import * as fs from "node:fs";
import * as path from "node:path";
import { POD2_API_SPECS_DIR, SAP_DM_API_SPECS_DIR, UI5_API_SPECS_DIR, DOCU_DIR } from "./config.js";

// ═══════════════════════════════════════════════════════════════════════
// Caching
// ═══════════════════════════════════════════════════════════════════════

export const CACHE_TTL_MS = 60_000; // 1 minute
export const CACHE_MAX_ENTRIES = 500;

const fileContentCache = new Map<string, { content: string; ts: number }>();
export const dirListingCache = new Map<string, { files: string[]; ts: number }>();

function evictOldest(cache: Map<string, { ts: number; [key: string]: unknown }>): void {
  if (cache.size <= CACHE_MAX_ENTRIES) return;
  const entries = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts);
  const toRemove = Math.max(1, Math.floor(cache.size * 0.1));
  for (let i = 0; i < toRemove; i++) {
    cache.delete(entries[i][0]);
  }
}

export function getCacheStats() {
  return {
    filesCached: fileContentCache.size,
    dirsCached: dirListingCache.size,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Path Validation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Resolves and validates that a path stays within the allowed base directory.
 * Returns the resolved absolute path, or null if the path escapes the base.
 */
export function safePath(baseDir: string, ...segments: string[]): string | null {
  const resolved = path.resolve(baseDir, ...segments);
  const normalizedBase = path.resolve(baseDir);
  if (!resolved.startsWith(normalizedBase + path.sep) && resolved !== normalizedBase) {
    return null;
  }
  return resolved;
}

// ═══════════════════════════════════════════════════════════════════════
// File Reading
// ═══════════════════════════════════════════════════════════════════════

/**
 * Reads a file with caching (TTL + LRU). Throws if the file does not exist
 * or cannot be read. Callers are responsible for catching and converting
 * the error into the appropriate MCP error response (e.g. `isError: true`).
 */
export function readFileContent(filePath: string): string {
  const now = Date.now();
  const cached = fileContentCache.get(filePath);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.content;

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  fileContentCache.set(filePath, { content, ts: now });
  evictOldest(fileContentCache);
  return content;
}

/**
 * Safe variant of readFileContent that returns null instead of throwing.
 * Useful for optional reads (e.g. README detection, fuzzy fallbacks).
 */
export function tryReadFileContent(filePath: string): string | null {
  try {
    return readFileContent(filePath);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Missing SAP-proprietary specs — graceful degradation
// ═══════════════════════════════════════════════════════════════════════

/**
 * SAP-proprietary spec sets (REST OpenAPI, MDO metadata)
 * are NOT shipped with this repo — they are release-bound SAP content the user
 * fetches locally via `npm run prepare:specs`. When the corresponding directory
 * is absent, tools should emit this clear, actionable message instead of a bare
 * "not found" (which reads like a bug) or a confusing empty result.
 *
 * @param label   Human-readable name of the missing spec set (e.g. "POD2 API documentation").
 * @param relDir  The git-ignored directory that should hold it (e.g. "docu/pod2-api-specs/").
 */
export function missingSpecsMessage(label: string, relDir: string): string {
  return (
    `${label} is not available on this deployment (\`${relDir}\` is empty or missing).\n\n` +
    `This is expected: SAP-proprietary specs are release-bound and are NOT shipped with this repo.\n` +
    `Fetch your own licensed copy for a release, then restart the server:\n\n` +
    `    npm run prepare:specs                # default SAP DM release\n` +
    `    npm run prepare:specs -- --release 2601   # or a specific YYMM wave\n\n` +
    `See the README ("Bring your own SAP specs") for the acquisition paths.`
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Directory Listing
// ═══════════════════════════════════════════════════════════════════════

const EXCLUDED_DIRS = new Set(["node_modules", "dist", "build", ".git"]);

export function listFilesRecursive(dir: string, prefix = ""): string[] {
  const now = Date.now();
  const cacheKey = `${dir}|${prefix}`;
  const cached = dirListingCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.files;

  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(path.join(dir, entry.name), relPath));
    } else {
      results.push(relPath);
    }
  }

  dirListingCache.set(cacheKey, { files: results, ts: now });
  evictOldest(dirListingCache);
  return results;
}

// ═══════════════════════════════════════════════════════════════════════
// File Type Detection
// ═══════════════════════════════════════════════════════════════════════

const TEXT_EXTENSIONS = new Set([
  ".js", ".ts", ".jsx", ".tsx", ".json", ".xml", ".html", ".css",
  ".less", ".scss", ".md", ".txt", ".properties", ".yaml", ".yml",
  ".sh", ".bat", ".cmd", ".ps1", ".cfg", ".ini", ".env",
  ".gitignore", ".npmrc", ".eslintrc",
]);

export function isTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;
  const basename = path.basename(filePath);
  if (basename === "extension.json" || basename === "manifest.json") return true;
  if (basename.startsWith(".") && !ext) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════════════════
// Domain Helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns all .md files in docu/pod2-api-specs/ (excluding index.md).
 */
export function getPod2ApiDocFiles(): string[] {
  const cacheKey = "__pod2ApiDocFiles__";
  const now = Date.now();
  const cached = dirListingCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.files;

  if (!fs.existsSync(POD2_API_SPECS_DIR)) return [];
  const files = fs
    .readdirSync(POD2_API_SPECS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "index.md" && f !== "VERSION.md")
    .sort();

  dirListingCache.set(cacheKey, { files, ts: now });
  return files;
}

/**
 * Returns all .md files in docu/ root (pattern docs, guides, etc.)
 * Excludes subdirectories.
 */
export function getPatternDocFiles(): string[] {
  const cacheKey = "__patternDocFiles__";
  const now = Date.now();
  const cached = dirListingCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.files;

  if (!fs.existsSync(DOCU_DIR)) return [];
  const files = fs
    .readdirSync(DOCU_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".md"))
    .map((d) => d.name)
    .sort();

  dirListingCache.set(cacheKey, { files, ts: now });
  return files;
}

/**
 * Returns all .json files in docu/sap-dm-api-specs/.
 */
export function getSapDmApiFiles(): string[] {
  const cacheKey = "__sapDmApiFiles__";
  const now = Date.now();
  const cached = dirListingCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.files;

  if (!fs.existsSync(SAP_DM_API_SPECS_DIR)) return [];
  const files = fs
    .readdirSync(SAP_DM_API_SPECS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  dirListingCache.set(cacheKey, { files, ts: now });
  return files;
}

// ═══════════════════════════════════════════════════════════════════════
// Search – TF-IDF-like Scoring
// ═══════════════════════════════════════════════════════════════════════

export interface SearchMatch {
  file: string;
  matchCount: number;
  score: number; // TF-IDF-like relevance score
  lines: string[]; // formatted "Line N: content" strings
}

/**
 * Tokenizes a query into individual search terms.
 *
 * Behaviour: Multi-word queries are split into tokens. A file is included
 * if it contains AT LEAST ONE of the tokens (OR semantics). Files that
 * match more tokens score higher because each token contributes to the
 * total score in `computeScore`.
 */
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Returns true when `token` appears as a whole word (or identifier segment)
 * in `text`. Uses word-boundary logic: a match is valid only when not
 * immediately surrounded by alphanumeric characters or underscores/dots.
 * This prevents "action" from matching inside "transaction" or "sap.m.Action".
 */
function matchesWordBoundary(text: string, token: string): boolean {
  // Fast path: if token is not present at all, skip the regex
  const idx = text.indexOf(token);
  if (idx === -1) return false;

  const before = idx > 0 ? text[idx - 1] : " ";
  const after = idx + token.length < text.length ? text[idx + token.length] : " ";
  const wordChar = /[\w.]/;

  // Check first occurrence — if it's at a word boundary, we're done
  if (!wordChar.test(before) && !wordChar.test(after)) return true;

  // Fall back to regex for remaining occurrences
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\w.])${escaped}(?![\\w.])`, "i").test(text);
}

/**
 * Computes a heuristic TF-based relevance score for a file. Despite the
 * "TF-IDF-like" naming used elsewhere, this is pure TF + boosts; no
 * inverse-document-frequency component is applied.
 *
 * - Term frequency: each token occurrence in a line adds 1 (or 3 in headings)
 * - Title/heading bonus: matches in first 5 lines or in `#`-headings: +3 each
 * - Filename bonus: each token contained in the filename: +5
 * - Density: matchCount / lineCount, scaled by 10 (rewards short focused files)
 */
function computeScore(
  file: string,
  contentLines: string[],
  tokens: string[],
): { score: number; matchCount: number; matchLines: string[] } {
  const lowerFile = file.toLowerCase();
  let score = 0;
  let matchCount = 0;
  const matchLines: string[] = [];

  // Filename bonus
  for (const token of tokens) {
    if (matchesWordBoundary(lowerFile, token)) {
      score += 5;
    }
  }

  // Content scoring
  for (let i = 0; i < contentLines.length; i++) {
    const lowerLine = contentLines[i].toLowerCase();
    let lineMatches = false;

    for (const token of tokens) {
      if (matchesWordBoundary(lowerLine, token)) {
        lineMatches = true;
        // Title/heading bonus (first 5 lines or lines starting with #)
        const isHeading = i < 5 || contentLines[i].trimStart().startsWith("#");
        score += isHeading ? 3 : 1;
        matchCount++;
      }
    }

    if (lineMatches) {
      matchLines.push(`Line ${i + 1}: ${contentLines[i].trim()}`);
    }
  }

  // Density bonus: shorter files with many matches rank higher
  if (contentLines.length > 0 && matchCount > 0) {
    const density = matchCount / contentLines.length;
    score += density * 10;
  }

  return { score, matchCount, matchLines };
}

/**
 * Search-mode for multi-token queries.
 * - `"any"` (default): file is included if it contains AT LEAST ONE token (high recall).
 * - `"all"`: file is included only if it contains ALL tokens at least once (higher precision).
 */
export type SearchMode = "any" | "all";

/**
 * Search for a query across a list of files with TF-IDF-like scoring.
 * Results are sorted by relevance score (highest first).
 *
 * @param mode `"any"` (default) for OR-semantics, `"all"` for AND-semantics across tokens.
 */
export function searchFiles(
  baseDir: string,
  files: string[],
  query: string,
  maxFiles: number = 20,
  maxLinesPerFile: number = 8,
  mode: SearchMode = "any",
): SearchMatch[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const results: SearchMatch[] = [];

  for (const file of files) {
    const fullPath = path.join(baseDir, file);
    if (!isTextFile(fullPath) && !fullPath.endsWith(".json")) continue;
    if (!fs.existsSync(fullPath)) continue;

    try {
      const content = readFileContent(fullPath);
      const contentLines = content.split("\n");

      // Quick pre-check: cheap substring test to skip files with no token presence at all.
      // The precise word-boundary check happens inside computeScore.
      const lowerContent = content.toLowerCase();
      const hasSubstringMatch =
        mode === "all"
          ? tokens.every((t) => lowerContent.includes(t))
          : tokens.some((t) => lowerContent.includes(t));
      if (!hasSubstringMatch) continue;

      const { score, matchCount, matchLines } = computeScore(
        file,
        contentLines,
        tokens,
      );

      if (matchCount > 0) {
        results.push({
          file,
          matchCount,
          score,
          lines: matchLines.slice(0, maxLinesPerFile),
        });
      }
    } catch (err) {
      // Skip unreadable files (logged at debug level by callers if needed)
      void err;
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxFiles);
}

/**
 * Format search results into a readable string.
 */
export function formatSearchResults(matches: SearchMatch[], maxLinesShown: number = 5): string[] {
  return matches.map((m) => {
    const overflow = m.matchCount > maxLinesShown ? `\n    ... and ${m.matchCount - maxLinesShown} more` : "";
    const scoreStr = m.score > 0 ? ` [relevance: ${m.score.toFixed(1)}]` : "";
    return `  📄 ${m.file} (${m.matchCount} matches${scoreStr}):\n${m.lines.map((l) => `    ${l}`).join("\n")}${overflow}`;
  });
}

// ═══════════════════════════════════════════════════════════════════════
// OpenAPI (Swagger 2.0) endpoint slicing
// ═══════════════════════════════════════════════════════════════════════
//
// The SAP DM spec files are Swagger 2.0 (`#/definitions/*`) — the whole
// corpus was checked in the v5.13.1 investigation. No OpenAPI-3 branch.
// A full spec can exceed 250 KB (`sapdme_inventory.json`); a single-endpoint
// slice with its transitive `$ref` closure is typically < 10 KB.

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;

export type OpenApiOperation = {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: unknown[];
  responses?: Record<string, unknown>;
  security?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type OpenApiSpec = {
  swagger?: string;
  openapi?: string;
  info?: Record<string, unknown>;
  host?: string;
  basePath?: string;
  schemes?: string[];
  consumes?: string[];
  produces?: string[];
  paths?: Record<string, Record<string, OpenApiOperation>>;
  definitions?: Record<string, unknown>;
  securityDefinitions?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  responses?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Iterate every (path, method, operation) triple in a Swagger 2.0 spec.
 * Skips vendor extensions and non-method keys (parameters, etc.).
 */
export function listEndpoints(
  spec: OpenApiSpec,
): Array<{ path: string; method: string; operation: OpenApiOperation }> {
  const out: Array<{ path: string; method: string; operation: OpenApiOperation }> = [];
  const paths = spec.paths || {};
  for (const [pathStr, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== "object") continue;
    for (const [method, op] of Object.entries(methods)) {
      if (!(HTTP_METHODS as readonly string[]).includes(method)) continue;
      out.push({ path: pathStr, method, operation: op as OpenApiOperation });
    }
  }
  return out;
}

/**
 * Match an `endpoint` selector against a spec. Accepted forms:
 *   - `"POST /sfcs/split"`   → method + path
 *   - `"/sfcs/split"`        → path only; unique method wins, else null
 *   - `"getSfcData"`         → operationId
 * Case-insensitive method match; path is compared literally.
 * Returns the matched operation or null if the selector is ambiguous
 * (multiple candidates) or absent.
 *
 * The `candidates` field on a null result carries the ambiguous set so
 * the caller can render a helpful error listing.
 */
export function matchOperation(
  spec: OpenApiSpec,
  endpoint: string,
):
  | { path: string; method: string; operation: OpenApiOperation }
  | { path: null; method: null; operation: null; candidates: Array<{ path: string; method: string }> } {
  const all = listEndpoints(spec);
  const trimmed = endpoint.trim();

  // Form 1: "METHOD /path"
  const methodPathMatch = trimmed.match(/^([A-Za-z]+)\s+(\/.+)$/);
  if (methodPathMatch) {
    const method = methodPathMatch[1].toLowerCase();
    const pathStr = methodPathMatch[2];
    const hit = all.find((e) => e.method === method && e.path === pathStr);
    if (hit) return hit;
    return { path: null, method: null, operation: null, candidates: [] };
  }

  // Form 2: "/path" (no method) — unique-method-wins semantics
  if (trimmed.startsWith("/")) {
    const onPath = all.filter((e) => e.path === trimmed);
    if (onPath.length === 1) return onPath[0];
    return {
      path: null,
      method: null,
      operation: null,
      candidates: onPath.map((e) => ({ path: e.path, method: e.method })),
    };
  }

  // Form 3: operationId
  const byOpId = all.find((e) => e.operation.operationId === trimmed);
  if (byOpId) return byOpId;

  return { path: null, method: null, operation: null, candidates: [] };
}

/**
 * Walk any JSON subtree and collect every Swagger-2.0 `#/definitions/<Name>`
 * name referenced (directly or transitively). Cycle-safe.
 *
 * `visited` is mutated: pass a fresh Set and read it back after the call.
 */
export function collectRefs(node: unknown, spec: OpenApiSpec, visited: Set<string>): void {
  if (node === null || node === undefined) return;
  if (typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, spec, visited);
    return;
  }
  const obj = node as Record<string, unknown>;
  const ref = obj.$ref;
  if (typeof ref === "string" && ref.startsWith("#/definitions/")) {
    const name = ref.slice("#/definitions/".length);
    if (!visited.has(name)) {
      visited.add(name);
      const definitions = spec.definitions || {};
      if (Object.prototype.hasOwnProperty.call(definitions, name)) {
        collectRefs(definitions[name], spec, visited);
      }
    }
    return;
  }
  for (const value of Object.values(obj)) collectRefs(value, spec, visited);
}

/**
 * Build a stand-alone Swagger 2.0 slice: preserves the spec envelope
 * (swagger/info/host/basePath/schemes/consumes/produces/securityDefinitions),
 * limits `paths` to a single `{ [path]: { [method]: operation } }` pair,
 * and includes only the `definitions` reachable from that operation.
 *
 * `$ref` values are NOT resolved inline — clients still see the Swagger shape.
 */
export function sliceOperation(
  spec: OpenApiSpec,
  path: string,
  method: string,
  operation: OpenApiOperation,
): OpenApiSpec {
  const visited = new Set<string>();
  collectRefs(operation, spec, visited);

  const definitions: Record<string, unknown> = {};
  const specDefs = spec.definitions || {};
  for (const name of visited) {
    if (Object.prototype.hasOwnProperty.call(specDefs, name)) {
      definitions[name] = specDefs[name];
    }
  }

  const slice: OpenApiSpec = {
    swagger: spec.swagger,
    info: spec.info,
    host: spec.host,
    basePath: spec.basePath,
    schemes: spec.schemes,
    consumes: spec.consumes,
    produces: spec.produces,
    paths: { [path]: { [method]: operation } },
    definitions,
  };

  // Only carry securityDefinitions if the operation actually references security.
  if (operation.security && operation.security.length > 0 && spec.securityDefinitions) {
    slice.securityDefinitions = spec.securityDefinitions;
  }

  // Drop undefined top-level keys so the JSON stays clean.
  for (const key of Object.keys(slice)) {
    if ((slice as Record<string, unknown>)[key] === undefined) {
      delete (slice as Record<string, unknown>)[key];
    }
  }

  return slice;
}

// ═══════════════════════════════════════════════════════════════════════
// SAPUI5 API — bundled snapshot access
// ═══════════════════════════════════════════════════════════════════════
//
// The `docu/ui5-api-specs/` bundle holds one `api-index.json` (search tree
// of every symbol) plus one `<lib>.api.json` per bundled library. The
// per-library files carry the full class metadata (properties, methods,
// events, aggregations, associations) with the exact schema returned by
// `sapui5-mcp-server.get_api_reference` — see VERSION.md in the bundle.

export type Ui5IndexNode = {
  name: string;
  kind?: string;
  lib?: string;
  visibility?: string;
  deprecated?: boolean;
  experimental?: boolean | { since?: string; text?: string };
  displayName?: string;
  nodes?: Ui5IndexNode[];
};

export type Ui5Index = {
  library?: string;
  version?: string;
  symbols?: Ui5IndexNode[];
  [key: string]: unknown;
};

export type Ui5Symbol = {
  kind?: string;
  name: string;
  basename?: string;
  resource?: string;
  module?: string;
  export?: string;
  static?: boolean;
  visibility?: string;
  since?: string;
  extends?: string;
  implements?: string[];
  description?: string;
  deprecated?: unknown;
  experimental?: unknown;
  "ui5-metadata"?: {
    stereotype?: string;
    properties?: unknown[];
    aggregations?: unknown[];
    associations?: unknown[];
    events?: unknown[];
    dnd?: unknown;
    designtime?: unknown;
    [key: string]: unknown;
  };
  constructor?: unknown;
  events?: unknown[];
  methods?: unknown[];
  [key: string]: unknown;
};

export type Ui5LibSpec = {
  "$schema-ref"?: string;
  version?: string;
  library?: string;
  symbols?: Ui5Symbol[];
  defaultComponent?: string;
  [key: string]: unknown;
};

/**
 * Returns every bundled library name (`sap.m`, `sap.ui.core`, …) — derived
 * from files in `docu/ui5-api-specs/`. Cached like other dir listings.
 */
export function getUi5ApiLibraries(): string[] {
  const cacheKey = "__ui5ApiLibs__";
  const now = Date.now();
  const cached = dirListingCache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) return cached.files;

  if (!fs.existsSync(UI5_API_SPECS_DIR)) return [];
  const files = fs
    .readdirSync(UI5_API_SPECS_DIR)
    .filter((f) => f.endsWith(".api.json"))
    .map((f) => f.replace(/\.api\.json$/, ""))
    .sort();

  dirListingCache.set(cacheKey, { files, ts: now });
  return files;
}

/**
 * Resolves a fully-qualified symbol name (e.g. `sap.m.ComboBox`,
 * `sap.ui.core.mvc.View`, `sap.suite.ui.microchart.BulletMicroChart`) to
 * its bundled library file path. Walks the dotted name from the longest
 * matching prefix downward — so deep symbols like `sap.ui.core.mvc.View`
 * still resolve to `sap.ui.core.api.json`.
 *
 * Returns null when no bundled library covers this symbol.
 */
export function getUi5ApiSpecFile(symbolOrLib: string): string | null {
  const libs = new Set(getUi5ApiLibraries());
  const parts = symbolOrLib.split(".");
  for (let i = parts.length; i > 0; i--) {
    const candidate = parts.slice(0, i).join(".");
    if (libs.has(candidate)) {
      const p = safePath(UI5_API_SPECS_DIR, `${candidate}.api.json`);
      if (p && fs.existsSync(p)) return p;
    }
  }
  return null;
}

/**
 * Return the path to the bundled api-index.json (search index), or null
 * if the bundle is missing.
 */
export function getUi5ApiIndexFile(): string | null {
  const p = safePath(UI5_API_SPECS_DIR, "api-index.json");
  if (p && fs.existsSync(p)) return p;
  return null;
}

/**
 * Flatten the recursive Ui5IndexNode tree into an array. Used by search.
 */
export function flattenUi5Index(nodes: Ui5IndexNode[] | undefined): Ui5IndexNode[] {
  if (!nodes || !Array.isArray(nodes)) return [];
  const out: Ui5IndexNode[] = [];
  const stack: Ui5IndexNode[] = [...nodes];
  while (stack.length > 0) {
    const node = stack.pop()!;
    out.push(node);
    if (node.nodes && Array.isArray(node.nodes)) {
      for (const child of node.nodes) stack.push(child);
    }
  }
  return out;
}

/**
 * Lookup a symbol by exact name in a library spec's `symbols[]`. Returns
 * null on miss.
 */
export function pickUi5Symbol(spec: Ui5LibSpec, symbolName: string): Ui5Symbol | null {
  if (!spec.symbols || !Array.isArray(spec.symbols)) return null;
  return spec.symbols.find((s) => s.name === symbolName) ?? null;
}

/**
 * Return the top-10 nearest symbol names in a library spec — used to build
 * a helpful error when the exact name misses.
 */
export function nearUi5Candidates(spec: Ui5LibSpec, target: string): string[] {
  if (!spec.symbols || !Array.isArray(spec.symbols)) return [];
  const lower = target.toLowerCase();
  const scored: Array<{ name: string; score: number }> = [];
  for (const s of spec.symbols) {
    if (!s.name) continue;
    const ln = s.name.toLowerCase();
    let score = 0;
    if (ln === lower) score = 1000;
    else if (ln.endsWith(lower)) score = 500;
    else if (ln.includes(lower)) score = 100;
    else {
      // Levenshtein-lite: count shared prefix chars
      let i = 0;
      while (i < ln.length && i < lower.length && ln[i] === lower[i]) i++;
      score = i * 5;
    }
    if (score > 0) scored.push({ name: s.name, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map((c) => c.name);
}

/**
 * Section-slice a Ui5Symbol. Sections match the SDK's own tab structure
 * plus a `summary` short-form.
 *
 * The full symbol from the `sap.m` library averages ~15 KB (some, like
 * `sap.m.Table`, are 60 KB+); a section slice is typically 1–5 KB.
 */
export type Ui5SymbolSection = "summary" | "properties" | "methods" | "events" | "aggregations" | "associations" | "constructor";

export function sliceUi5Symbol(symbol: Ui5Symbol, section?: Ui5SymbolSection): unknown {
  if (!section) return symbol;

  const meta = symbol["ui5-metadata"] || {};

  const common = {
    name: symbol.name,
    kind: symbol.kind,
    basename: symbol.basename,
    module: symbol.module,
    extends: symbol.extends,
    visibility: symbol.visibility,
    since: symbol.since,
  };

  switch (section) {
    case "summary": {
      // Description first paragraph only — the raw text is HTML, so pick to the first </p>.
      const desc = typeof symbol.description === "string" ? symbol.description : "";
      const firstPara = desc.split(/<\/p>/i)[0].replace(/<[^>]+>/g, "").trim();
      return {
        ...common,
        description: firstPara || undefined,
        propertyCount: Array.isArray(meta.properties) ? meta.properties.length : 0,
        methodCount: Array.isArray(symbol.methods) ? symbol.methods.length : 0,
        eventCount: Array.isArray(symbol.events) ? symbol.events.length : (Array.isArray(meta.events) ? meta.events.length : 0),
        aggregationCount: Array.isArray(meta.aggregations) ? meta.aggregations.length : 0,
        associationCount: Array.isArray(meta.associations) ? meta.associations.length : 0,
      };
    }
    case "properties":
      return { ...common, properties: meta.properties ?? [] };
    case "methods":
      return { ...common, methods: symbol.methods ?? [] };
    case "events":
      // In the UI5 JSON schema `events` may live either at the top level
      // or under `ui5-metadata.events`. Prefer top-level (richer data).
      return {
        ...common,
        events: (symbol.events && symbol.events.length > 0) ? symbol.events : (meta.events ?? []),
      };
    case "aggregations":
      return { ...common, aggregations: meta.aggregations ?? [] };
    case "associations":
      return { ...common, associations: meta.associations ?? [] };
    case "constructor":
      return { ...common, constructor: symbol.constructor };
    default:
      return symbol;
  }
}