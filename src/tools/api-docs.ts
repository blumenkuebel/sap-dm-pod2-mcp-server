import { FastMCP, UserError } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import { POD2_API_SPECS_DIR } from "../config.js";
import {
  getPod2ApiDocFiles,
  readFileContent,
  safePath,
  searchFiles,
  formatSearchResults,
  missingSpecsMessage,
  READONLY_ANNOTATIONS,
} from "../helpers.js";
import { extractSection, extractSectionHeadings } from "./docs.js";

const POD2_SPECS_LABEL = "POD2 API documentation";
const POD2_SPECS_DIR_REL = "docu/pod2-api-specs/";

const API_ALIASES: Record<string, string> = {
  widget: "sap.dm.dme.pod2.widget.Widget",
  action: "sap.dm.dme.pod2.action.Action",
  podcontext: "sap.dm.dme.pod2.context.PodContext",
  actioncontext: "sap.dm.dme.pod2.action.ActionContext",
  actionregistry: "sap.dm.dme.pod2.action.ActionRegistry",
  podobject: "sap.dm.dme.pod2.PodObject",
  logger: "sap.dm.dme.pod2.Logger",
  datetimeutils: "sap.dm.dme.pod2.DateTimeUtils",
  component: "sap.dm.dme.pod2.base.Component",
  controller: "sap.dm.dme.pod2.base.Controller",
  apiclient: "sap.dm.dme.pod2.api.ApiClient",
  apierror: "sap.dm.dme.pod2.api.ApiError",
  restclient: "sap.dm.dme.pod2.api.RestClient",
  sfcclient: "sap.dm.dme.pod2.api.sfc.SfcPublicApiClient",
  sfcpublicapiclient: "sap.dm.dme.pod2.api.sfc.SfcPublicApiClient",
  orderclient: "sap.dm.dme.pod2.api.order.OrderPublicApiClient",
  orderpublicapiclient: "sap.dm.dme.pod2.api.order.OrderPublicApiClient",
  materialclient: "sap.dm.dme.pod2.api.material.MaterialPublicApiClient",
  materialpublicapiclient: "sap.dm.dme.pod2.api.material.MaterialPublicApiClient",
  resourceclient: "sap.dm.dme.pod2.api.resource.ResourcePublicApiClient",
  resourcepublicapiclient: "sap.dm.dme.pod2.api.resource.ResourcePublicApiClient",
  workcenterclient: "sap.dm.dme.pod2.api.workcenter.WorkCenterPublicApiClient",
  inventoryclient: "sap.dm.dme.pod2.api.inventory.InventoryPublicApiClient",
  bomclient: "sap.dm.dme.pod2.api.bom.BomPublicApiClient",
  assemblyclient: "sap.dm.dme.pod2.api.assembly.AssemblyPublicApiClient",
  datacollectionclient: "sap.dm.dme.pod2.api.datacollection.DataCollectionPublicApiClient",
  workinstructionclient: "sap.dm.dme.pod2.api.workinstruction.WorkInstructionPublicApiClient",
  operationactivityclient: "sap.dm.dme.pod2.api.operationactivity.OperationActivityPublicApiClient",
  processorderclient: "sap.dm.dme.pod2.api.processorder.ProcessOrderPublicApiClient",
  uomclient: "sap.dm.dme.pod2.api.uom.UomPublicApiClient",
  odatav2client: "sap.dm.dme.pod2.api.odata.ODataV2Client",
  odatav4client: "sap.dm.dme.pod2.api.odata.ODataV4Client",
  worklistdelegate: "sap.dm.dme.pod2.context.data.WorkListDelegate",
  datacollectiondelegate: "sap.dm.dme.pod2.context.data.DataCollectionDelegate",
  operationactivitydelegate: "sap.dm.dme.pod2.context.data.OperationActivityDelegate",
  workinstructiondelegate: "sap.dm.dme.pod2.context.data.WorkInstructionDelegate",
  quantityconfirmationdelegate: "sap.dm.dme.pod2.context.data.QuantityConfirmationDelegate",
  activityconfirmationdelegate: "sap.dm.dme.pod2.context.data.ActivityConfirmationDelegate",
  goodsreceiptdelegate: "sap.dm.dme.pod2.context.data.GoodsReceiptDelegate",
  actionproperty: "sap.dm.dme.pod2.action.metadata.ActionProperty",
};

function resolveAlias(name: string): string | null {
  if (name.includes(".")) return null;
  const key = name.toLowerCase();
  return API_ALIASES[key] ?? null;
}

export function registerApiDocsTools(server: FastMCP): void {
  server.addTool({
    name: "get_api_doc",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the API documentation (Markdown) for a specific POD2 class or namespace. Accepts either dot notation (e.g. 'sap.dm.dme.pod2.action.Action') or convenient short aliases (e.g. 'Widget', 'PodContext', 'SfcClient', 'OrderClient'). Large class docs can exceed 30 KB — use `summary: true` for a headings-only table of contents, or `section` to load one section (e.g. 'Methods', 'Properties', a specific method name), then fetch more as needed.",
    parameters: z.object({
      name: z
        .string()
        .describe(
          "Class name or short alias. Examples: 'Widget', 'Action', 'PodContext', 'SfcClient' OR full path 'sap.dm.dme.pod2.widget.Widget'",
        ),
      section: z
        .string()
        .optional()
        .describe(
          "Optional: return only the section whose heading matches this (case-insensitive substring on any ## / ### heading). E.g. 'Methods', 'Properties', or a specific member name.",
        ),
      summary: z
        .boolean()
        .optional()
        .describe(
          "Optional: if true, return only the table of contents (all headings) instead of the full doc. Use to orient before loading a large class doc.",
        ),
    }),
    execute: async ({ name, section, summary }) => {
      if (getPod2ApiDocFiles().length === 0) {
        throw new UserError(missingSpecsMessage(POD2_SPECS_LABEL, POD2_SPECS_DIR_REL));
      }
      const aliased = resolveAlias(name);
      const effective = aliased ?? name;

      const safeFile = safePath(POD2_API_SPECS_DIR, effective + ".md");
      const safeFileSlash = safePath(POD2_API_SPECS_DIR, effective.replace(/\//g, ".") + ".md");
      const safeFileRaw = safePath(POD2_API_SPECS_DIR, effective);

      const candidates = [safeFileRaw, safeFile, safeFileSlash].filter(Boolean) as string[];

      for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
          const content = readFileContent(filePath);
          if (summary && content) {
            const headings = extractSectionHeadings(content);
            return `Table of contents for "${name}" (${content.split("\n").length} lines total):\n\n${headings.join("\n")}\n\n→ Use get_api_doc({ name: "${name}", section: "<heading>" }) to load a specific section.`;
          }
          if (section && content) {
            const extracted = extractSection(content, section);
            if (extracted) return extracted;
            const headings = extractSectionHeadings(content);
            return `Section "${section}" not found in "${name}".\n\nAvailable sections:\n${headings.map((s) => `  • ${s}`).join("\n")}`;
          }
          return content;
        }
      }

      if (candidates.length === 0) {
        throw new UserError(`[Error: Invalid path "${name}" – path traversal not allowed.]`);
      }

      const apiFiles = getPod2ApiDocFiles();
      const lowerName = name.toLowerCase();
      const fuzzy = apiFiles.filter((f) => f.toLowerCase().includes(lowerName));

      if (fuzzy.length > 0) {
        return `Exact match for "${name}" not found.\n\nDid you mean one of these?\n${fuzzy
          .slice(0, 15)
          .map((m) => `  • ${m.replace(".md", "")}`)
          .join(
            "\n",
          )}${fuzzy.length > 15 ? `\n  ... and ${fuzzy.length - 15} more` : ""}\n\nUse the full name to get the documentation.`;
      }

      throw new UserError(
        `No API documentation found for "${name}".\n\nUse 'list_api_docs' to see all available documentation.`,
      );
    },
  });

  server.addTool({
    name: "list_api_docs",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Lists all available POD2 API documentation files with optional namespace filter. Groups by namespace. Supports pagination.",
    parameters: z.object({
      filter: z
        .string()
        .optional()
        .describe("Optional filter to narrow results (e.g. 'action', 'widget', 'context', 'api', 'PodContext')"),
      offset: z.number().optional().describe("Pagination offset – skip this many results (default: 0)"),
      limit: z.number().optional().describe("Pagination limit – return at most this many results (default: 100)"),
    }),
    execute: async ({ filter, offset, limit }) => {
      const apiFiles = getPod2ApiDocFiles();
      if (apiFiles.length === 0) {
        return missingSpecsMessage(POD2_SPECS_LABEL, POD2_SPECS_DIR_REL);
      }
      const filtered = filter ? apiFiles.filter((f) => f.toLowerCase().includes(filter.toLowerCase())) : apiFiles;

      if (filtered.length === 0) {
        return filter
          ? `No API docs matching "${filter}".\n\nAll ${apiFiles.length} docs available. Try without filter or use a broader term.`
          : "No API documentation files found in docu/pod2-api-specs/.";
      }

      const start = offset ?? 0;
      const max = limit ?? 100;
      const page = filtered.slice(start, start + max);
      const hasMore = start + max < filtered.length;

      const byNamespace = new Map<string, string[]>();
      for (const file of page) {
        const name = file.replace(".md", "");
        const parts = name.split(".");
        const ns = parts.slice(0, Math.min(5, parts.length - 1)).join(".");
        if (!byNamespace.has(ns)) byNamespace.set(ns, []);
        byNamespace.get(ns)!.push(name);
      }

      const sections: string[] = [];
      for (const [ns, names] of byNamespace) {
        sections.push(`📦 ${ns}\n${names.map((n) => `  • ${n}`).join("\n")}`);
      }

      const paginationInfo = hasMore
        ? `\n\n→ Showing ${start + 1}–${start + page.length} of ${filtered.length}. Use offset: ${start + max} to see more.`
        : "";

      return `API Documentation${filter ? ` (filter: "${filter}")` : ""} – ${filtered.length} files:\n\n${sections.join("\n\n")}${paginationInfo}`;
    },
  });

  server.addTool({
    name: "search_api_docs",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Full-text search across all POD2 API reference documentation (Markdown files). Returns matching files with context lines.",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive) – e.g. class name, method name, property name"),
      maxResults: z.number().optional().describe("Maximum number of files to return (default: 20)"),
    }),
    execute: async ({ query, maxResults }) => {
      const max = maxResults ?? 20;
      const apiFiles = getPod2ApiDocFiles();
      if (apiFiles.length === 0) {
        return missingSpecsMessage(POD2_SPECS_LABEL, POD2_SPECS_DIR_REL);
      }
      const allFiles = ["index.md", ...apiFiles];
      const matches = searchFiles(POD2_API_SPECS_DIR, allFiles, query, max);

      if (matches.length === 0) {
        return `No matches for "${query}" in API docs.\n\nTip: Try 'list_api_docs' to see available documentation, or 'search_all' for cross-search.`;
      }

      const formatted = formatSearchResults(matches);
      return `API docs search for "${query}" – ${matches.length} files with matches:\n\n${formatted.join("\n\n")}`;
    },
  });

  server.addTool({
    name: "get_api_index",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the POD2 API documentation index. Without a filter it returns a compact namespace overview (class counts per namespace) to stay small; pass `filter` to list the actual classes in a namespace (e.g. 'widget', 'api', 'context'), or `full: true` to get the entire index table.",
    parameters: z.object({
      filter: z
        .string()
        .optional()
        .describe(
          "Optional: return only lines containing this string (case-insensitive). E.g. 'widget' to see all widget classes, 'api' for API clients.",
        ),
      full: z
        .boolean()
        .optional()
        .describe(
          "Optional: if true, return the entire index table (~45 KB). Prefer a filter or the default overview — the full table may be truncated by the host.",
        ),
    }),
    execute: async ({ filter, full }) => {
      const indexPath = path.join(POD2_API_SPECS_DIR, "index.md");
      if (!fs.existsSync(indexPath)) {
        throw new UserError(missingSpecsMessage(POD2_SPECS_LABEL, POD2_SPECS_DIR_REL));
      }
      const text = readFileContent(indexPath);

      if (filter) {
        const lowerFilter = filter.toLowerCase();
        const lines = text.split("\n");
        const filtered = lines.filter((line) => {
          if (line.startsWith("#")) return true;
          return line.toLowerCase().includes(lowerFilter);
        });
        const result = filtered.join("\n").trim();
        return `API index (filter: "${filter}") – ${filtered.filter((l) => !l.startsWith("#")).length} matching entries:\n\n${result}`;
      }

      if (full) {
        return text;
      }

      // Default: compact namespace overview instead of the full 505-row table,
      // which the host may truncate. Group classes by their namespace prefix.
      const counts = new Map<string, number>();
      for (const m of text.matchAll(/\]\((sap\.dm\.dme\.pod2\.[a-zA-Z]+)/g)) {
        counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
      }
      const header = text.split("\n").slice(0, 6).join("\n");
      const overview = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([ns, n]) => `  ${ns.replace("sap.dm.dme.pod2.", "")} — ${n}`)
        .join("\n");
      return `${header}\n\nNamespaces (class count — load one with get_api_index({ filter: "<namespace>" })):\n\n${overview}\n\n→ get_api_index({ filter: "widget" }) lists classes; get_api_index({ full: true }) returns the entire table; get_api_doc({ name: "<Class>" }) opens one class.`;
    },
  });
}
