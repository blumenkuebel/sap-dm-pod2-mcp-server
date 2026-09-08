import { FastMCP, UserError } from "fastmcp";
import * as fs from "node:fs";
import { z } from "zod";
import { DOCU_DIR } from "../config.js";
import { getPatternDocFiles, readFileContent, safePath, searchFiles, formatSearchResults, READONLY_ANNOTATIONS } from "../helpers.js";

export function registerDocsTools(server: FastMCP): void {
  server.addTool({
    name: "list_pattern_docs",
    annotations: READONLY_ANNOTATIONS,
    description: "Lists all available POD2 pattern documentation files (widget-patterns, advanced-patterns, common-mistakes-*, etc.) with descriptions.",
    parameters: undefined,
    execute: async () => {
      const files = getPatternDocFiles();
      const descriptions: Record<string, string> = {
        "advanced-patterns.md": "11 advanced enterprise patterns (custom toolbars, authorization, dynamic columns, error handling with retry, async popovers, optimistic UI, master-detail navigation, warning dialogs, no-data messages, table selection, JSDoc extensibility)",
        "basics.md": "POD2 Development Fundamentals – Architecture, Best Practices, plugin structure",
        "binding-patterns.md": "Data binding patterns (multi-part, expression, formatter classes)",
        "cache-patterns.md": "Caching strategies for API data and computed values",
        "common-mistakes.md": "Index + preamble only — mistake content is split into category files. Load a category file directly (e.g. common-mistakes-setup, common-mistakes-lifecycle) to reduce tokens.",
        "common-mistakes-setup.md": "Setup & file generation mistakes: namespace, extension.json structure, flat layout, zip packaging (#0, #1, #1B, #2, #15, #16)",
        "common-mistakes-lifecycle.md": "Lifecycle & memory mistakes: onExit/unsubscribe, dialog destruction, model init order, BusyIndicator, i18nCustomModel, wrong base class, ComponentWidget bootstrap trap (#3-#5, #19, #33, #35, #39, #50)",
        "common-mistakes-imports.md": "Imports & dependencies mistakes: PodContext path, PlacementType, ModelPath constants, third-party libs, deprecated SAPUI5 enum imports, non-existent module paths (#6-#9, #11, #36-#38, #41, #57)",
        "common-mistakes-ui.md": "UI & bindings mistakes: binding syntax in WidgetProperty metadata, styleClass, expression binding, view ID, multi-part binding null checks (#10, #12-#13, #17, #20, #28, #31, #42, #43, #52-#56, #58-#63)",
        "common-mistakes-config.md": "Configuration & properties mistakes: PropertyEditor defaults, callback parameter order, property exclusion, CustomPanel vs sap.m.Panel, widget metadata i18n keys (#14, #18, #21-#22, #25-#26, #32)",
        "common-mistakes-data.md": "Data, state & TableWidget mistakes: column/cell index mismatch, GrowingJSONModel paging, selection sync with PodContext, SFC status types (#23-#24, #27, #29, #34, #51)",
        "common-mistakes-i18n.md": "Internationalization mistakes: German SFC→PSN translation, widget metadata i18n key naming (#30)",
        "migration-suspect-list.md": "29-category checklist of easy-to-miss UX features plus 11 hidden source-code bug patterns — used by the migrate_widget prompt",
        "dashboard-patterns.md": "Blueprint for POD 2.0 monitoring dashboards — plain Widget shell, Prime-directive, Chart→control decision table, KPI tile row, drill-down, auto-refresh, empty/loading/error states",
        "fiori-design-compliance.md": "Positive SAP Fiori design canon for HTML5 migrations — Fiori design decision table, canonical Design Guideline URLs, typography/color/spacing rules",
        "chart-migration-map.md": "Mapping table: every Chart.js / d3 / plotly / echarts / apexcharts chart type → SAPUI5 target control",
        "html5-migration-guide.md": "Mechanical before/after rewrites for HTML5 → POD 2.0 migrations: fetch → ODataV4Client, setInterval → Timer pattern, etc.",
        "complete-patterns.md": "Complete end-to-end widget implementation examples",
        "delegate-architecture.md": "8 official data delegates (WorkList, DataCollection, etc.)",
        "dialog-patterns.md": "Dialog creation, lifecycle, and destruction patterns",
        "extension-json-schema.md": "extension.json manifest – JSON schema, naming conventions, file structure, common mistakes",
        "error-handling.md": "Error handling, retry patterns, and user feedback",
        "form-patterns.md": "Form validation, input handling, and submit patterns",
        "glossary.md": "POD2 terminology and concept definitions",
        "namespace-update.md": "Namespace migration guide (sap.dm.dme → pod2)",
        "PATTERN-INDEX.md": "Quick-reference index by widget type, use case, and complexity",
        "pod2-api-reference.md": "Coarse POD2 API overview (handwritten summary). For accurate, detailed class docs use get_api_doc instead.",
        "pod2-public-api-pattern.md": "REST API calling pattern – RestClient, ApiPaths, PodContext usage for custom widgets/actions",
        "production-errors.md": "Common production errors and their solutions",
        "sapdm-api-reference.md": "Coarse SAP DM REST API overview (handwritten summary). For accurate specs use get_rest_api instead.",
        "sap-dm-languages.md": "SAP DM i18n language reference — all 28 supported UI languages with ISO 639-1 codes",
        "tablecell-patterns.md": "13 table cell types (text, date, status, actions, charts)",
        "tablewidget-complete.md": "Complete TableWidget guide with pagination and selection sync",
        "tree-patterns.md": "Tree control patterns (hierarchical data display)",
        "mdo-extractor-reference.md": "MDO Extractor OData V4 entity reference",
        "property-editors.md": "PropertyEditor types (StringPropertyEditor, BooleanPropertyEditor, EnumPropertyEditor)",
        "subscribe-patterns.md": "PodContext subscribe/unsubscribe lifecycle – ModelPath, isRunMode(), memory leak prevention",
        "widget-patterns.md": "Router index only — load widget-patterns-core or widget-patterns-advanced directly.",
        "widget-patterns-core.md": "Core widget type templates: ControlWidget, LayoutWidget, TableWidget, ContentHandler, EXCLUDE_PROPERTIES, i18n",
        "widget-patterns-advanced.md": "Advanced widget patterns: SAP DM API integration (RestClient/ApiPaths), custom events, GrowingJSONModel, ComponentWidget, IntegrationWidget",
        "worklist-data-structure.md": "Worklist item data structure – all 45+ fields returned per SFC with types, descriptions, anonymized example JSON",
        "ui5-guidelines.md": "Curated SAPUI5 coding guidelines — dependency loading rules, data-binding-first, i18n locale-sync, TypeScript event-handler types, Fiori Form pattern",
      };
      const listing = files.map((f) => {
        const desc = descriptions[f] || "";
        return `  📄 ${f.replace(".md", "")}${desc ? ` — ${desc}` : ""}`;
      });
      return `POD2 Pattern Documentation (${files.length} files):\n\n${listing.join("\n")}\n\n→ Use 'get_pattern_doc' with the name (without .md) to read a specific file.`;
    },
  });

  server.addTool({
    name: "get_pattern_doc",
    annotations: READONLY_ANNOTATIONS,
    description: "Returns the full content of a POD2 pattern documentation file. Use `summary: true` to get a table of contents (headings only) before committing to loading a large file. Use `section` to load one specific section. Use names like 'widget-patterns-core', 'common-mistakes-lifecycle', 'advanced-patterns', etc.",
    parameters: z.object({
      name: z.string().describe("Document name without .md extension (e.g. 'widget-patterns-core', 'common-mistakes-setup', 'common-mistakes-lifecycle', 'advanced-patterns', 'basics')"),
      section: z.string().optional().describe("Optional: Return only the section matching this heading (case-insensitive substring match on any heading level ## or ###). Example: 'Mistake #33' to get just that mistake block."),
      summary: z.boolean().optional().describe("Optional: If true, return only the table of contents (all headings) instead of full content. Use this to orient yourself before loading a large file."),
    }),
    execute: async ({ name, section, summary }) => {
      const safeName = safePath(DOCU_DIR, name + ".md");
      const safeNameNoExt = safePath(DOCU_DIR, name);

      const candidates: string[] = [];
      if (safeNameNoExt && fs.existsSync(safeNameNoExt)) candidates.push(safeNameNoExt);
      if (safeName && fs.existsSync(safeName)) candidates.push(safeName);

      if (candidates.length === 0) {
        if (!safeName && !safeNameNoExt) {
          throw new UserError(`[Error: Invalid path "${name}" – path traversal not allowed.]`);
        }
        const files = getPatternDocFiles();
        const lowerName = name.toLowerCase();
        const fuzzy = files.filter((f) => f.toLowerCase().includes(lowerName));
        if (fuzzy.length > 0) {
          return `Exact match for "${name}" not found.\n\nDid you mean one of these?\n${fuzzy.map((m) => `  • ${m.replace(".md", "")}`).join("\n")}\n\nUse the exact name to get the document.`;
        }
        const isDegraded = getPatternDocFiles().length === 0;
        const suffix = isDegraded
          ? `\n\n⚠️ **SERVER DEGRADED**: the pattern-docs directory is empty on this deployment.`
          : "";
        throw new UserError(`No pattern documentation found for "${name}".\n\nUse 'list_pattern_docs' to see all available files.${suffix}`);
      }

      const filePath = candidates[candidates.length - 1];
      let content = readFileContent(filePath);

      if (summary && content) {
        const headings = extractSectionHeadings(content);
        return `Table of contents for "${name}" (${content.split("\n").length} lines total):\n\n${headings.join("\n")}\n\n→ Use get_pattern_doc({ name: "${name}", section: "<heading>" }) to load a specific section.`;
      }

      if (section && content) {
        const extracted = extractSection(content, section);
        if (extracted) {
          content = extracted;
        } else {
          const sections = extractSectionHeadings(content);
          return `Section "${section}" not found in "${name}".\n\nAvailable sections:\n${sections.map((s) => `  • ${s}`).join("\n")}`;
        }
      }

      return content;
    },
  });

  server.addTool({
    name: "search_docs",
    annotations: READONLY_ANNOTATIONS,
    description: "Full-text search across all POD2 pattern documentation files (widget-patterns, common-mistakes-*, advanced-patterns, basics, etc.).",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive)"),
      maxResults: z.number().optional().describe("Maximum number of files to return (default: 20)"),
    }),
    execute: async ({ query, maxResults }) => {
      const max = maxResults ?? 20;
      const docFiles = getPatternDocFiles();
      const matches = searchFiles(DOCU_DIR, docFiles, query, max);
      if (matches.length === 0) {
        return `No matches for "${query}" in pattern documentation.\n\nTip: Try 'search_api_docs' for API reference or 'search_all' for cross-search.`;
      }
      const formatted = formatSearchResults(matches);
      return `Documentation search for "${query}" – ${matches.length} files with matches:\n\n${formatted.join("\n\n")}`;
    },
  });
}

function extractSection(content: string, sectionQuery: string): string | null {
  const lines = content.split("\n");
  const lowerQuery = sectionQuery.toLowerCase();
  let startIdx = -1;
  let startLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const heading = match[2].trim();
      if (heading.toLowerCase().includes(lowerQuery)) {
        startIdx = i;
        startLevel = level;
        break;
      }
    }
  }

  if (startIdx === -1) return null;

  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+/);
    if (match && match[1].length <= startLevel) {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx, endIdx).join("\n").trim();
}

function extractSectionHeadings(content: string): string[] {
  const lines = content.split("\n");
  const headings: string[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const heading = match[2].trim();
      headings.push(`${"  ".repeat(level - 1)}${heading}`);
    }
  }
  return headings;
}
