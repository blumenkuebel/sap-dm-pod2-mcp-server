import { FastMCP } from "fastmcp";
import { z } from "zod";
import { DOCU_DIR, POD2_API_SPECS_DIR, SAP_DM_API_SPECS_DIR } from "../config.js";
import {
  getPod2ApiDocFiles,
  getPatternDocFiles,
  getSapDmApiFiles,
  searchFiles,
} from "../helpers.js";

export function registerSearchTools(server: FastMCP): void {
  server.addTool({
    name: "search_all",
    description: "Full-text search across ALL POD2 content: pattern documentation, API reference, and SAP DM REST API specs. Uses TF-IDF-like relevance scoring (filename, heading and density boosts). Multi-token queries default to OR semantics (`mode: 'any'`); switch to `mode: 'all'` to require every token in the file (higher precision, lower recall).",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive). Multi-word queries are tokenized; tokens are matched per line."),
      maxResultsPerArea: z.number().optional().describe("Maximum number of file matches per area (default: 5)"),
      mode: z.enum(["any", "all"]).optional().describe("'any' (default) = OR-match (file needs ≥1 token); 'all' = AND-match (file must contain every token). Use 'all' for precise multi-word queries like 'PodContext subscribe' to filter out files mentioning only one of the terms."),
    }),
    execute: async ({ query, maxResultsPerArea, mode }) => {
      const max = maxResultsPerArea ?? 5;
      const searchMode = mode ?? "any";
      const sections: string[] = [];

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

      if (sections.length === 0) {
        const isDegraded =
          getPatternDocFiles().length === 0 &&
          getPod2ApiDocFiles().length === 0 &&
          getSapDmApiFiles().length === 0;
        if (isDegraded) {
          throw new Error(
            `⚠️ **SERVER DEGRADED**: no content areas are populated on this deployment. Pattern docs, API specs, and REST specs are all empty (expected at docu/**). Search cannot verify "${query}" — this is a deployment misconfiguration, not "not found".`,
          );
        }
        const hint = searchMode === "all"
          ? `\n\nTip: try 'mode: "any"' for broader matches (≥1 token instead of all).`
          : "";
        return `No matches for "${query}" across any content area.${hint}`;
      }

      const modeNote = searchMode === "all" ? " [mode: all – every token required]" : "";
      return `Cross-search for "${query}"${modeNote} – found in ${sections.length} area(s):\n\n${sections.join("\n\n")}`;
    },
  });
}
