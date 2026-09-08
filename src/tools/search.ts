import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as path from "node:path";
import { DOCU_DIR, POD2_API_SPECS_DIR, SAP_DM_API_SPECS_DIR } from "../config.js";
import {
  getPod2ApiDocFiles,
  getPatternDocFiles,
  getSapDmApiFiles,
  getUi5ApiIndexFile,
  flattenUi5Index,
  readFileContent,
  searchFiles,
  READONLY_ANNOTATIONS,
  type Ui5Index,
} from "../helpers.js";

const MDO_INDEX_DIR = path.join(DOCU_DIR, "sap-dm-mdo-specs");
const MDO_INDEX_FILE = "index.md";

/** Counts UI5 symbols whose name contains at least one query token (public API). */
function searchUi5Symbols(query: string, max: number): { name: string; kind: string }[] {
  const indexFile = getUi5ApiIndexFile();
  if (!indexFile) return [];
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return [];
  let index: Ui5Index;
  try {
    index = JSON.parse(readFileContent(indexFile)) as Ui5Index;
  } catch {
    return [];
  }
  const all = flattenUi5Index(index.symbols);
  const hits = all.filter((n) => {
    if (!n.name) return false;
    if (n.visibility && n.visibility !== "public") return false;
    const lower = n.name.toLowerCase();
    return tokens.some((t) => lower.includes(t));
  });
  hits.sort((a, b) => a.name.localeCompare(b.name));
  return hits.slice(0, max).map((n) => ({ name: n.name, kind: n.kind ?? "symbol" }));
}

export function registerSearchTools(server: FastMCP): void {
  server.addTool({
    name: "search_all",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Full-text search across ALL POD2 content: pattern documentation, POD2 API reference, SAP DM REST API specs, SAPUI5 API symbols, and MDO entities. Uses TF-IDF-like relevance scoring (filename, heading and density boosts) for docs/API/REST, and symbol-name matching for UI5. Multi-token queries default to OR semantics (`mode: 'any'`); switch to `mode: 'all'` to require every token in the file (higher precision, lower recall).",
    parameters: z.object({
      query: z
        .string()
        .describe("Search term (case-insensitive). Multi-word queries are tokenized; tokens are matched per line."),
      maxResultsPerArea: z.number().optional().describe("Maximum number of file matches per area (default: 5)"),
      mode: z
        .enum(["any", "all"])
        .optional()
        .describe(
          "'any' (default) = OR-match (file needs ≥1 token); 'all' = AND-match (file must contain every token). Use 'all' for precise multi-word queries like 'PodContext subscribe' to filter out files mentioning only one of the terms.",
        ),
    }),
    execute: async ({ query, maxResultsPerArea, mode }, { log }) => {
      const max = maxResultsPerArea ?? 5;
      const searchMode = mode ?? "any";
      const sections: string[] = [];
      log.debug("search_all", { query, mode: searchMode, maxResultsPerArea: max });

      const patternMatches = searchFiles(DOCU_DIR, getPatternDocFiles(), query, max, 0, searchMode);
      if (patternMatches.length > 0) {
        const lines = patternMatches.map(
          (m) => `  📄 ${m.file.replace(".md", "")} (${m.matchCount} matches, score ${m.score.toFixed(1)})`,
        );
        sections.push(
          `📚 Pattern Documentation (${patternMatches.length} files):\n${lines.join("\n")}\n  → Use 'get_pattern_doc' or 'search_docs' for details`,
        );
      }

      const apiMatches = searchFiles(POD2_API_SPECS_DIR, getPod2ApiDocFiles(), query, max, 0, searchMode);
      if (apiMatches.length > 0) {
        const lines = apiMatches.map(
          (m) => `  📄 ${m.file.replace(".md", "")} (${m.matchCount} matches, score ${m.score.toFixed(1)})`,
        );
        sections.push(
          `📖 POD2 API Reference (${apiMatches.length} classes):\n${lines.join("\n")}\n  → Use 'get_api_doc' or 'search_api_docs' for details`,
        );
      }

      const restMatches = searchFiles(SAP_DM_API_SPECS_DIR, getSapDmApiFiles(), query, max, 0, searchMode);
      if (restMatches.length > 0) {
        const lines = restMatches.map(
          (m) => `  📄 ${m.file.replace(".json", "")} (${m.matchCount} matches, score ${m.score.toFixed(1)})`,
        );
        sections.push(
          `🔌 SAP DM REST APIs (${restMatches.length} services):\n${lines.join("\n")}\n  → Use 'get_rest_api' or 'search_rest_apis' for details`,
        );
      }

      const ui5Matches = searchUi5Symbols(query, max);
      if (ui5Matches.length > 0) {
        const lines = ui5Matches.map((m) => `  📄 ${m.name} (${m.kind})`);
        sections.push(
          `🎨 SAPUI5 API (${ui5Matches.length} symbols):\n${lines.join("\n")}\n  → Use 'get_ui5_api' or 'search_ui5_api' for details`,
        );
      }

      const mdoMatches = searchFiles(MDO_INDEX_DIR, [MDO_INDEX_FILE], query, 1, 0, searchMode);
      if (mdoMatches.length > 0) {
        sections.push(
          `📊 SAP DM MDO Entities (${mdoMatches[0].matchCount} matches in index):\n  → Use 'get_mdo_entity' or 'search_mdo_entities' for details`,
        );
      }

      if (sections.length === 0) {
        const isDegraded =
          getPatternDocFiles().length === 0 &&
          getPod2ApiDocFiles().length === 0 &&
          getSapDmApiFiles().length === 0 &&
          getUi5ApiIndexFile() === null;
        if (isDegraded) {
          throw new Error(
            `⚠️ **SERVER DEGRADED**: no content areas are populated on this deployment. Pattern docs, API specs, REST specs, and UI5 API are all empty (expected at docu/**). Search cannot verify "${query}" — this is a deployment misconfiguration, not "not found".`,
          );
        }
        const hint =
          searchMode === "all" ? `\n\nTip: try 'mode: "any"' for broader matches (≥1 token instead of all).` : "";
        return `No matches for "${query}" across any content area.${hint}`;
      }

      const modeNote = searchMode === "all" ? " [mode: all – every token required]" : "";
      log.debug("search_all done", { areasWithMatches: sections.length });
      return `Cross-search for "${query}"${modeNote} – found in ${sections.length} area(s):\n\n${sections.join("\n\n")}`;
    },
  });
}
