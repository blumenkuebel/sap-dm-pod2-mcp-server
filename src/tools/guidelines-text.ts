// Guidelines text assembler — counts are computed lazily (per call) from the
// actual directory contents so they:
//   1. reflect any files added/removed between server restarts, AND
//   2. reflect a docs-remount that happens after startup (e.g. a lagging
//      volume attach). If we froze them at import time, list_capabilities
//      would keep reporting 0 for the whole process lifetime.

import * as fs from "node:fs";
import * as path from "node:path";
import { BASE_DIR, DOCU_DIR, POD2_API_SPECS_DIR, SAP_DM_API_SPECS_DIR } from "../config.js";
import { SECTION_META_RULES } from "./guidelines-sections/00-meta-rules.js";
import { SECTION_ARCHITECTURE } from "./guidelines-sections/01-architecture.js";
import { SECTION_BEST_PRACTICE } from "./guidelines-sections/02-best-practice.js";
import { SECTION_API_PATTERNS } from "./guidelines-sections/03-api-patterns.js";
import { SECTION_KEY_APIS } from "./guidelines-sections/04-key-apis-imports.js";
import { buildToolCatalog, type ContentCounts } from "./guidelines-sections/05-tool-catalog.js";
import { SECTION_REST_SERVICES } from "./guidelines-sections/06-rest-services.js";
import { buildCapabilities } from "./guidelines-sections/07-capabilities.js";

function countFiles(dir: string, ext: string): number {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext) && f !== "index.md").length;
}

function countExamples(examplesDir: string): number {
  if (!fs.existsSync(examplesDir)) return 0;
  return fs.readdirSync(examplesDir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .length;
}

function computeCounts(): ContentCounts {
  return {
    patternDocs: countFiles(DOCU_DIR, ".md"),
    apiClasses: countFiles(POD2_API_SPECS_DIR, ".md"),
    restApis: countFiles(SAP_DM_API_SPECS_DIR, ".json"),
    examples: countExamples(path.join(BASE_DIR, "examples")),
  };
}

const DEGRADED_BANNER = [
  "⚠️  **SERVER DEGRADED** — the docs volume is missing or empty on this deployment.",
  "",
  "Doc-lookup tools (`get_api_doc`, `get_pattern_doc`, `list_rest_apis`, `search_all`) will",
  'return "not found" for legitimate POD2 identifiers until `mcp-server/docu/` and',
  '`mcp-server/examples/` are restored. **Do NOT interpret those "not found" replies as',
  "evidence that a symbol doesn't exist upstream** — it means the server can't verify it.",
  "See `BTP-DEPLOYMENT.md` for the deploy contract.",
  "",
  "---",
  "",
].join("\n");

function isDegraded(c: ContentCounts): boolean {
  return c.patternDocs === 0 || c.apiClasses === 0 || c.restApis === 0;
}

export function getGuidelinesText(): string {
  const counts = computeCounts();
  const body = [
    SECTION_META_RULES,
    SECTION_ARCHITECTURE,
    SECTION_BEST_PRACTICE,
    SECTION_API_PATTERNS,
    SECTION_KEY_APIS,
    buildToolCatalog(counts),
    SECTION_REST_SERVICES,
  ].join("\n\n---\n\n");
  return isDegraded(counts) ? DEGRADED_BANNER + body : body;
}

export function getCapabilitiesText(): string {
  const counts = computeCounts();
  const body = buildCapabilities(counts);
  return isDegraded(counts) ? DEGRADED_BANNER + body : body;
}

// Back-compat exports so existing importers that read the module-level
// constant still work. These are one-shot snapshots at first import —
// prefer the getters above for anything user-facing.
export const GUIDELINES_TEXT = getGuidelinesText();
export const CAPABILITIES_TEXT = getCapabilitiesText();
