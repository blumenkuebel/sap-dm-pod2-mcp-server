import { FastMCP } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import { SAP_DM_API_SPECS_DIR } from "../config.js";
import { getSapDmApiFiles, readFileContent, safePath, listEndpoints, matchOperation, sliceOperation, missingSpecsMessage } from "../helpers.js";

const REST_SPECS_LABEL = "SAP DM REST API specifications";
const REST_SPECS_DIR_REL = "docu/sap-dm-api-specs/";

export function registerRestApiTools(server: FastMCP): void {
  server.addTool({
    name: "list_rest_apis",
    description: "Lists all available SAP DM REST API specifications (OpenAPI JSON files). These cover order, sfc, material, inventory, batch, and many more services.",
    parameters: undefined,
    execute: async () => {
      const files = getSapDmApiFiles();
      if (files.length === 0) {
        throw new Error(missingSpecsMessage(REST_SPECS_LABEL, REST_SPECS_DIR_REL));
      }
      const sapdme: string[] = [];
      const sapfnd: string[] = [];
      const other: string[] = [];
      for (const f of files) {
        const name = f.replace(".json", "");
        if (name.startsWith("sapdme_")) sapdme.push(name.replace("sapdme_", ""));
        else if (name.startsWith("sapfnd_")) sapfnd.push(name.replace("sapfnd_", ""));
        else other.push(name);
      }
      const sections: string[] = [];
      if (sapdme.length > 0) sections.push(`📦 SAP DM APIs (${sapdme.length}):\n${sapdme.map((n) => `  • ${n}`).join("\n")}`);
      if (sapfnd.length > 0) sections.push(`📦 SAP Foundation APIs (${sapfnd.length}):\n${sapfnd.map((n) => `  • ${n}`).join("\n")}`);
      if (other.length > 0) sections.push(`📦 Other (${other.length}):\n${other.map((n) => `  • ${n}`).join("\n")}`);
      return `SAP DM REST API Specifications (${files.length} OpenAPI files):\n\n${sections.join("\n\n")}\n\n→ Use 'get_rest_api' with the service name to inspect a spec. **Prefer the compact modes** to avoid dumping 150+ KB:\n   • \`get_rest_api({ serviceName: 'sfc', endpoint: 'POST /sfcs/split' })\` — one operation + its refs closure (~10 KB)\n   • \`get_rest_api({ serviceName: 'sfc', summary: true })\` — paths + one-line descriptions only (~2 KB)\n   Full spec (no options) is only appropriate when you truly need everything.`;
    },
  });

  server.addTool({
    name: "get_rest_api",
    description: "Returns the OpenAPI specification for a SAP DM REST API service. Prefer 'endpoint' for a single-operation slice with its transitive #/definitions closure (typical size <10 KB); use 'summary' for a paths-only overview (~2 KB); omit both only when you truly need the full spec (can exceed 250 KB).",
    parameters: z.object({
      serviceName: z.string().describe("Service name (e.g. 'order', 'sfc', 'material', 'inventory', 'batch', 'processorder', 'operationactivity'). Combine with 'endpoint' or 'summary' unless you truly need the entire spec."),
      endpoint: z.string().optional().describe("Return only one operation plus its transitive #/definitions closure. Accepts: 'METHOD /path' (e.g. 'POST /sfcs/split'), '/path' (unique method wins), or an operationId. Recommended over the full spec whenever you only need one endpoint. Overrides 'summary'."),
      summary: z.boolean().optional().describe("If true, returns only paths and their descriptions instead of the full spec (default: false). Ignored when 'endpoint' is set."),
    }),
    execute: async ({ serviceName, endpoint, summary }) => {
      if (getSapDmApiFiles().length === 0) {
        throw new Error(missingSpecsMessage(REST_SPECS_LABEL, REST_SPECS_DIR_REL));
      }
      const candidates = [
        `sapdme_${serviceName}.json`,
        `sapfnd_${serviceName}.json`,
        `${serviceName}.json`,
      ];

      let foundFile: string | null = null;
      let foundFileBase: string | null = null;
      for (const candidate of candidates) {
        const filePath = safePath(SAP_DM_API_SPECS_DIR, candidate);
        if (filePath && fs.existsSync(filePath)) {
          foundFile = filePath;
          foundFileBase = candidate.replace(".json", "");
          break;
        }
      }

      if (!foundFile) {
        const allFiles = getSapDmApiFiles();
        const lowerName = serviceName.toLowerCase();
        const matches = allFiles.filter((f) => f.toLowerCase().includes(lowerName));
        if (matches.length === 1) {
          const resolvedPath = safePath(SAP_DM_API_SPECS_DIR, matches[0]);
          if (resolvedPath) {
            foundFile = resolvedPath;
            foundFileBase = matches[0].replace(".json", "");
          }
        } else if (matches.length > 1) {
          return `Multiple API specs match "${serviceName}":\n${matches.map((m) => `  • ${m.replace(".json", "")}`).join("\n")}\n\nPlease be more specific.`;
        } else {
          throw new Error(`No REST API specification found for "${serviceName}".\n\nUse 'list_rest_apis' to see all available specs.`);
        }
      }

      if (!foundFile) {
        throw new Error(`[Error: Could not resolve path for "${serviceName}"]`);
      }

      const content = readFileContent(foundFile);

      if (endpoint) {
        try {
          const spec = JSON.parse(content);
          const match = matchOperation(spec, endpoint);
          if (!match.operation) {
            const all = listEndpoints(spec);
            const ambiguous = "candidates" in match ? match.candidates : [];
            const candidateLines = (ambiguous.length > 0
              ? ambiguous.map((c) => {
                  const op = all.find((e) => e.path === c.path && e.method === c.method)?.operation;
                  const desc = op?.summary || op?.description || "";
                  return `  ${c.method.toUpperCase()} ${c.path}${desc ? ` — ${desc}` : ""}`;
                })
              : all.slice(0, 10).map((e) => {
                  const desc = e.operation.summary || e.operation.description || "";
                  return `  ${e.method.toUpperCase()} ${e.path}${desc ? ` — ${desc}` : ""}`;
                })
            );
            const preface = ambiguous.length > 0
              ? `Endpoint "${endpoint}" is ambiguous — multiple methods on that path:`
              : `No endpoint matching "${endpoint}" in service "${foundFileBase}". First ${Math.min(all.length, 10)} of ${all.length} endpoints:`;
            throw new Error(`${preface}\n${candidateLines.join("\n")}\n\nExpected forms: "POST /sfcs/split" | "/sfcs/split" | "getSfcData" (operationId).`);
          }
          const slice = sliceOperation(spec, match.path, match.method, match.operation);
          const defsCount = Object.keys(slice.definitions || {}).length;
          const header = `// Slice of ${foundFileBase} — ${match.method.toUpperCase()} ${match.path} + ${defsCount} #/definitions/* (transitive closure).\n// For the full spec omit 'endpoint'; for a paths-only overview use 'summary: true'.\n`;
          return header + JSON.stringify(slice, null, 2);
        } catch (e) {
          throw new Error(`[Error: failed to slice endpoint "${endpoint}" from ${foundFileBase}: ${(e as Error).message}]`);
        }
      }

      if (summary) {
        try {
          const spec = JSON.parse(content);
          const specInfo = spec.info || {};
          const paths = spec.paths || {};
          const lines: string[] = [];
          lines.push(`# ${specInfo.title || serviceName}`);
          if (specInfo.description) lines.push(`\n${specInfo.description}`);
          if (specInfo.version) lines.push(`\nVersion: ${specInfo.version}`);
          lines.push(`\n## Endpoints (${Object.keys(paths).length}):\n`);
          for (const [pathStr, methods] of Object.entries(paths)) {
            for (const [method, details] of Object.entries(methods as Record<string, unknown>)) {
              if (["get", "post", "put", "patch", "delete"].includes(method)) {
                const d = details as { summary?: string; description?: string };
                const desc = d.summary || d.description || "";
                lines.push(`  ${method.toUpperCase()} ${pathStr}${desc ? ` — ${desc}` : ""}`);
              }
            }
          }
          lines.push(`\n→ Fetch one endpoint (schemas + refs, ~10 KB) with: get_rest_api({ serviceName: "${foundFileBase?.replace(/^(sapdme|sapfnd)_/, "")}", endpoint: "METHOD /path" })`);
          return lines.join("\n");
        } catch {
          // fall through to raw content
        }
      }

      return content;
    },
  });

  server.addTool({
    name: "search_rest_apis",
    description: "Search across SAP DM REST API specifications for endpoints, parameters, or schemas matching a query.",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive) – e.g. endpoint path, parameter name, schema name"),
      maxResults: z.number().optional().describe("Maximum number of files to return (default: 10)"),
    }),
    execute: async ({ query, maxResults }) => {
      const max = maxResults ?? 10;
      const lowerQuery = query.toLowerCase();
      const apiFiles = getSapDmApiFiles();
      if (apiFiles.length === 0) {
        return missingSpecsMessage(REST_SPECS_LABEL, REST_SPECS_DIR_REL);
      }
      const results: { file: string; matches: string[] }[] = [];

      for (const file of apiFiles) {
        if (results.length >= max) break;
        const fullPath = path.join(SAP_DM_API_SPECS_DIR, file);
        if (!fs.existsSync(fullPath)) continue;
        try {
          const content = readFileContent(fullPath);
          const spec = JSON.parse(content);
          const matchingPaths: string[] = [];
          if (spec.paths) {
            for (const [pathStr, methods] of Object.entries(spec.paths)) {
              for (const [method, details] of Object.entries(methods as Record<string, unknown>)) {
                if (["get", "post", "put", "patch", "delete"].includes(method)) {
                  const d = details as { summary?: string; description?: string; operationId?: string };
                  const searchable = `${pathStr} ${d.summary || ""} ${d.description || ""} ${d.operationId || ""}`.toLowerCase();
                  if (searchable.includes(lowerQuery)) {
                    matchingPaths.push(`${method.toUpperCase()} ${pathStr}${d.summary ? ` — ${d.summary}` : ""}`);
                  }
                }
              }
            }
          }
          if (matchingPaths.length > 0) {
            results.push({ file: file.replace(".json", ""), matches: matchingPaths.slice(0, 5) });
          }
        } catch {
          // skip unparseable
        }
      }

      if (results.length === 0) {
        return `No REST API endpoints matching "${query}".\n\nTip: Try 'list_rest_apis' to see available services, or use broader search terms.`;
      }

      const formatted = results.map((r) => {
        const serviceShort = r.file.replace(/^(sapdme|sapfnd)_/, "");
        const firstMatch = r.matches[0];
        const methodPathOnly = firstMatch.replace(/ — .*$/, "");
        const hint = `    → Fetch details: get_rest_api({ serviceName: "${serviceShort}", endpoint: "${methodPathOnly}" })`;
        return `  📄 ${r.file} (${r.matches.length} matches):\n${r.matches.map((m) => `    ${m}`).join("\n")}\n${hint}`;
      });

      return `REST API search for "${query}" – ${results.length} services with matches:\n\n${formatted.join("\n\n")}`;
    },
  });
}
