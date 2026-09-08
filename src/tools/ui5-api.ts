import { FastMCP, UserError } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import { DEFAULT_UI5_VERSION, DOCU_DIR } from "../config.js";
import {
  readFileContent,
  safePath,
  getUi5ApiLibraries,
  getUi5ApiIndexFile,
  getUi5ApiSpecFile,
  flattenUi5Index,
  pickUi5Symbol,
  nearUi5Candidates,
  sliceUi5Symbol,
  READONLY_ANNOTATIONS,
  type Ui5Index,
  type Ui5LibSpec,
  type Ui5SymbolSection,
} from "../helpers.js";

function readUi5Meta(): { source: string; version: string } {
  try {
    const metaPath = path.join(DOCU_DIR, "ui5-api-specs", "_meta.json");
    if (fs.existsSync(metaPath)) {
      const m = JSON.parse(fs.readFileSync(metaPath, "utf8")) as { source?: string; version?: string };
      return { source: m.source ?? "openui5", version: m.version ?? DEFAULT_UI5_VERSION };
    }
  } catch {
    /* ignore */
  }
  return { source: "openui5", version: DEFAULT_UI5_VERSION };
}

function assertBundledVersion(version: string | undefined): string | null {
  if (!version || version === DEFAULT_UI5_VERSION) return null;
  return (
    `Bundled UI5 version is ${DEFAULT_UI5_VERSION}; you asked for ${version}. ` +
    `The bundle ships one version at a time — see docu/ui5-api-specs/VERSION.md ` +
    `for the update procedure (run \`npm run update-ui5-api-specs -- --version <ver>\`).`
  );
}

export function registerUi5ApiTools(server: FastMCP): void {
  server.addTool({
    name: "list_ui5_libraries",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Lists all bundled SAPUI5 libraries (from `docu/ui5-api-specs/`) with symbol counts per library. Start here to discover which library owns which control. UI5 version is pinned in the bundle — see docu/ui5-api-specs/VERSION.md.",
    parameters: undefined,
    execute: async () => {
      const libs = getUi5ApiLibraries();
      if (libs.length === 0) {
        throw new UserError(
          "No UI5 API bundle found at docu/ui5-api-specs/. Run `npm run update-ui5-api-specs` to snapshot it.",
        );
      }
      const { source, version: metaVersion } = readUi5Meta();
      const sourceLabel = source === "sapui5" ? "SAPUI5 (full bundle, proprietary)" : "OpenUI5 (Apache-2.0)";
      const rows: string[] = [];
      let indexVersion = metaVersion;
      const indexFile = getUi5ApiIndexFile();
      if (indexFile) {
        try {
          const idx = JSON.parse(readFileContent(indexFile)) as Ui5Index & { version?: string };
          if (idx.version) indexVersion = idx.version;
        } catch {
          /* ignore */
        }
      }
      for (const lib of libs) {
        const p = getUi5ApiSpecFile(lib);
        let symbolCount = 0;
        let libVersion = "?";
        if (p) {
          try {
            const spec = JSON.parse(readFileContent(p)) as Ui5LibSpec;
            symbolCount = spec.symbols?.length ?? 0;
            libVersion = spec.version ?? "?";
          } catch {
            /* keep zeros */
          }
        }
        rows.push(`  • ${lib.padEnd(28)} — ${String(symbolCount).padStart(4)} symbols (v${libVersion})`);
      }
      return (
        `Bundled UI5 libraries — source: ${sourceLabel}, version: ${indexVersion}, ${libs.length} libraries:\n\n` +
        rows.join("\n") +
        `\n\n→ Cross-library search: search_ui5_api({ query: "..." })` +
        `\n→ Fetch a symbol: get_ui5_api({ symbol: "sap.m.ComboBox" })`
      );
    },
  });

  server.addTool({
    name: "search_ui5_api",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Search across ALL bundled SAPUI5 libraries for symbols (classes, namespaces, enums, interfaces) matching a query. Substring, case-insensitive. Use this when you don't yet know the exact class name — then feed the result into get_ui5_api. Version pinned by the bundle.",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive substring) — e.g. 'ComboBox', 'Table', 'placement'"),
      maxResults: z.number().optional().describe("Maximum matches to return (default: 25). Cross-library."),
      visibility: z
        .enum(["public", "restricted", "protected", "all"])
        .optional()
        .describe("Filter by visibility (default: public)."),
      kind: z
        .enum(["class", "namespace", "enum", "interface", "function", "typedef", "all"])
        .optional()
        .describe("Filter by symbol kind (default: all)."),
      version: z
        .string()
        .optional()
        .describe("UI5 version (advisory; the bundle ships one pinned version — see docu/ui5-api-specs/VERSION.md)."),
    }),
    execute: async ({ query, maxResults, visibility, kind, version }, { log }) => {
      const vNote = assertBundledVersion(version);
      const indexFile = getUi5ApiIndexFile();
      if (!indexFile) {
        throw new UserError("No UI5 API bundle found. Run `npm run update-ui5-api-specs` first.");
      }
      const max = maxResults ?? 25;
      const vis = visibility ?? "public";
      const wantedKind = kind ?? "all";
      const lowerQuery = query.toLowerCase();
      const index = JSON.parse(readFileContent(indexFile)) as Ui5Index;
      const all = flattenUi5Index(index.symbols);
      const hits = all.filter((n) => {
        if (!n.name) return false;
        if (!n.name.toLowerCase().includes(lowerQuery)) return false;
        if (vis !== "all" && n.visibility && n.visibility !== vis) return false;
        if (wantedKind !== "all" && n.kind && n.kind !== wantedKind) return false;
        return true;
      });
      hits.sort((a, b) => {
        const scoreOf = (s: string) => {
          const l = s.toLowerCase();
          if (l === lowerQuery) return 1000;
          if (l.endsWith("." + lowerQuery)) return 500;
          if (l.endsWith(lowerQuery)) return 250;
          if (l.includes(lowerQuery)) return 100;
          return 0;
        };
        const d = scoreOf(b.name) - scoreOf(a.name);
        if (d !== 0) return d;
        return a.name.localeCompare(b.name);
      });
      if (hits.length === 0) {
        return (
          `No UI5 symbols matching "${query}" (kind=${wantedKind}, visibility=${vis}). Try list_ui5_libraries to see what is bundled.` +
          (vNote ? `\n\n${vNote}` : "")
        );
      }
      log.debug("search_ui5_api", { query, matches: hits.length });
      const shown = hits.slice(0, max);
      const lines = shown.map((n) => {
        const flags: string[] = [];
        if (n.deprecated) flags.push("deprecated");
        if (n.experimental) flags.push("experimental");
        const flagStr = flags.length > 0 ? ` [${flags.join(", ")}]` : "";
        const lib = n.lib ? ` @${n.lib}` : "";
        const kindStr = n.kind ? ` (${n.kind})` : "";
        return `  ${n.name}${kindStr}${lib}${flagStr}`;
      });
      const truncated =
        hits.length > shown.length ? `\n  … and ${hits.length - shown.length} more (raise maxResults)` : "";
      const firstHit = shown[0].name;
      const hint = `\n\n→ Details: get_ui5_api({ symbol: "${firstHit}" })   (add \`section: "properties"|"methods"|"events"|"aggregations"|"summary"\` to slice)`;
      return (
        `UI5 API search for "${query}" — ${shown.length}${hits.length > shown.length ? `/${hits.length}` : ""} match${hits.length === 1 ? "" : "es"}:\n\n` +
        lines.join("\n") +
        truncated +
        hint +
        (vNote ? `\n\n${vNote}` : "")
      );
    },
  });

  server.addTool({
    name: "get_ui5_api",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the full metadata for a SAPUI5 symbol (properties, methods, events, aggregations, associations, description) from the offline bundle. Prefer the `section` param to slice — a full sap.m.Table is 60 KB+, a properties-only slice is ~2 KB.",
    parameters: z.object({
      symbol: z
        .string()
        .describe(
          "Fully-qualified UI5 symbol name — e.g. 'sap.m.ComboBox', 'sap.ui.core.mvc.View', 'sap.suite.ui.microchart.BulletMicroChart'",
        ),
      section: z
        .enum(["summary", "properties", "methods", "events", "aggregations", "associations", "constructor"])
        .optional()
        .describe(
          "Return only one section. 'summary' gives counts + first-paragraph description (~1 KB). Omit for the full symbol.",
        ),
      version: z.string().optional().describe("UI5 version (advisory; the bundle ships one pinned version)."),
    }),
    execute: async ({ symbol, section, version }) => {
      const vNote = assertBundledVersion(version);
      const specFile = getUi5ApiSpecFile(symbol);
      if (!specFile) {
        const libs = getUi5ApiLibraries();
        throw new UserError(
          `No bundled UI5 library covers "${symbol}". ` +
            `Bundled libraries: ${libs.join(", ")}.\n\n` +
            `→ Try search_ui5_api({ query: "${symbol.split(".").pop() ?? symbol}" }) to find candidates.` +
            (vNote ? `\n\n${vNote}` : ""),
        );
      }
      const spec = JSON.parse(readFileContent(specFile)) as Ui5LibSpec;
      const sym = pickUi5Symbol(spec, symbol);
      if (!sym) {
        const near = nearUi5Candidates(spec, symbol);
        const list = near.length > 0 ? near.map((n) => `  • ${n}`).join("\n") : "  (no near matches in this library)";
        throw new UserError(
          `Symbol "${symbol}" not found in ${spec.library ?? "?"} (v${spec.version ?? "?"}). ` +
            `Top candidates in the same library:\n${list}\n\n` +
            `→ Cross-library search: search_ui5_api({ query: "${symbol.split(".").pop() ?? symbol}" })` +
            (vNote ? `\n\n${vNote}` : ""),
        );
      }
      const slice = sliceUi5Symbol(sym, section as Ui5SymbolSection | undefined);
      const suffix = section ? ` — section: ${section}` : "";
      const header =
        `// UI5 API — ${symbol} @${spec.library ?? "?"} v${spec.version ?? "?"}${suffix}\n` +
        (section
          ? `// Omit \`section\` for the full symbol.\n`
          : `// Slice with \`section\`: summary | properties | methods | events | aggregations | associations | constructor\n`);
      return header + JSON.stringify(slice, null, 2) + (vNote ? `\n\n// Note: ${vNote}` : "");
    },
  });

  server.addTool({
    name: "get_ui5_guidelines",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the POD 2-curated SAPUI5 coding guidelines (from docu/ui5-guidelines.md). Covers dependency loading rules (never globals, always `sap.ui.define`/`core:require`), data-binding-first with `sap.ui.model.odata.type.*`, i18n locale-sync contract, TypeScript event-handler types (`<Ctrl>$<Event>Event`), and the Fiori Form pattern (`Form` + `ColumnLayout`, not `SimpleForm`). Complements the Prime Directive in basics.md §0 — §0 governs which control to pick, this doc governs how the surrounding code is shaped. CAP / index.html bootstrap / ComponentSupport rules are intentionally omitted (POD 2 hosts the UI5 shell).",
    parameters: undefined,
    execute: async () => {
      const p = safePath(DOCU_DIR, "ui5-guidelines.md");
      if (!p || !fs.existsSync(p)) {
        throw new Error("ui5-guidelines.md not found in docu/. This is a bundled file — the deployment is corrupt.");
      }
      return readFileContent(p);
    },
  });
}
