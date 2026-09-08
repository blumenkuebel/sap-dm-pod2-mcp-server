#!/usr/bin/env node
// Snapshot the **OpenUI5** (Apache-2.0) API JSON specs into docu/ui5-api-specs/.
//
// OpenUI5 is licensed under the Apache License 2.0, so — unlike the proprietary SAPUI5 SDK
// (ui5.sap.com) — these generated specs MAY be redistributed, provided the Apache-2.0
// LICENSE and NOTICE stay alongside them (this script writes both into the output folder).
//
// Usage:
//   node scripts/update-ui5-api-specs.mjs [--version 1.136.15] [--libs sap.m,sap.ui.core,...] [--source sapui5]
//
// --source sapui5   Fetch from ui5.sap.com (proprietary SAPUI5) instead of sdk.openui5.org.
//                   Unlocks all SAP-only libs (sap.chart, sap.viz, sap.gantt, sap.suite.*…).
//                   ⚠️ Proprietary — for local use only under your SAP license. The output is
//                   git-ignored and must not be redistributed.
//
// Defaults: version = DEFAULT_VERSION (SAP DM POD 2.0 UI5 target); libs = the OpenUI5
//           libraries relevant to SAP DM POD 2.0.
//
// Source endpoints:
//   OpenUI5:  https://sdk.openui5.org/<ver>/docs/api/api-index.json
//   SAPUI5:   https://ui5.sap.com/<ver>/docs/api/api-index.json
//   Per-lib:  <base>/<ver>/test-resources/sap/<lib-slashes>/designtime/apiref/api.json
//
// NOTE: Only libraries that ship with OpenUI5 are available via --source openui5 (default).
//       SAPUI5-only libraries (sap.suite.*, sap.ui.comp, sap.ushell, sap.viz, sap.chart,
//       sap.gantt, sap.ndc, sap.insights, …) require --source sapui5.

import { writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "docu", "ui5-api-specs");

const OPENUI5_BASE = "https://sdk.openui5.org";
const SAPUI5_BASE  = "https://ui5.sap.com";
const DEFAULT_VERSION = "1.136.15";

// OpenUI5-only libraries relevant to SAP DM POD 2.0.
const DEFAULT_LIBS = [
  "sap.m",
  "sap.ui.core",
  "sap.ui.layout",
  "sap.f",
  "sap.ui.table",
  "sap.ui.unified",
  "sap.tnt",
  "sap.uxap",           // ObjectPageLayout — detail layouts (OpenUI5)
  "sap.ui.integration", // Integration Cards (OpenUI5)
];

// Additional SAPUI5-only libs available with --source sapui5
const SAPUI5_EXTRA_LIBS = [
  "sap.suite.ui.microchart",
  "sap.viz",
  "sap.chart",
  "sap.gantt",
  "sap.ndc",
  "sap.insights",
  "sap.suite.ui.commons",
  "sap.ui.comp",
  "sap.suite.ui.generic.template",
  "sap.ui.integration",
  "sap.uxap",
];

function parseArgs(argv) {
  const opts = { version: DEFAULT_VERSION, libs: null, source: "openui5" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--version") opts.version = argv[++i];
    else if (arg === "--libs") opts.libs = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (arg === "--source") opts.source = argv[++i].toLowerCase();
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/update-ui5-api-specs.mjs [--version X.Y.Z] [--libs sap.m,...] [--source openui5|sapui5]");
      process.exit(0);
    }
  }
  if (!opts.libs) {
    opts.libs = opts.source === "sapui5"
      ? [...new Set([...DEFAULT_LIBS, ...SAPUI5_EXTRA_LIBS])]
      : DEFAULT_LIBS;
  }
  return opts;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function humanBytes(path) {
  try {
    const s = await stat(path);
    if (s.size >= 1024 * 1024) return `${(s.size / 1024 / 1024).toFixed(1)} MB`;
    return `${(s.size / 1024).toFixed(1)} KB`;
  } catch { return "?"; }
}

async function writeVersionDoc(version, libs, sapui5Base = null) {
  const isSapui5 = !!sapui5Base;
  const sourceBase = isSapui5 ? sapui5Base : OPENUI5_BASE;
  const now = new Date().toISOString().slice(0, 10);
  const rows = [];
  for (const f of (await readdir(OUT_DIR)).sort()) {
    if (!f.endsWith(".json")) continue;
    rows.push(`| \`${f}\` | ${await humanBytes(join(OUT_DIR, f))} |`);
  }
  const header = isSapui5
    ? "# SAPUI5 API Reference — local snapshot (proprietary, NOT redistributed)"
    : "# OpenUI5 API Reference — bundled snapshot";
  const licenseNote = isSapui5
    ? "**License**: SAP proprietary — for local use under your own SAP license only. This directory is git-ignored."
    : "**License**: Apache-2.0 (see `LICENSE` and `NOTICE` in this folder)";
  const redistNote = isSapui5
    ? ["⚠️ **Do not commit or redistribute** this directory. It was generated from the",
       `proprietary SAPUI5 SDK at ${sapui5Base}/${version}/ under your SAP license.`]
    : ["This directory holds a snapshot of the OpenUI5 API reference used by the ",
       "`list_ui5_libraries`, `search_ui5_api`, and `get_ui5_api` tools. It is git-ignored ",
       "(local use only). OpenUI5 is Apache-2.0 — see https://github.com/SAP/openui5."];
  const notIncluded = isSapui5 ? [] : [
    "## Not included (SAPUI5-only, proprietary)",
    "",
    "Libraries that do not ship with OpenUI5 are intentionally omitted: `sap.suite.*`, ",
    "`sap.ui.comp`, `sap.ushell`, `sap.viz`, `sap.chart`, `sap.gantt`, `sap.ndc`, ",
    "`sap.insights`, `sap.suite.ui.generic.template`. Use `--source sapui5` to fetch them locally.",
    "",
  ];
  const body = [
    header,
    "",
    `**Version pinned to**: ${version}`,
    `**Last updated**: ${now}`,
    `**Source**: ${sourceBase}/${version}/`,
    licenseNote,
    "",
    ...redistNote,
    "",
    "## Update procedure",
    "",
    "SAP DM POD 2.0 currently targets UI5 `1.136.x`. When SAP DM upgrades:",
    "",
    "```bash",
    isSapui5
      ? `npm run update-ui5-api-specs -- --version <new-version> --source sapui5`
      : `npm run update-ui5-api-specs -- --version <new-version>`,
    "```",
    "",
    "## Files",
    "",
    "| File | Size |",
    "|---|---|",
    ...rows,
    "",
    `## Bundled libraries (${isSapui5 ? "SAPUI5" : "OpenUI5 only"})`,
    "",
    ...libs.map((l) => `- \`${l}\``),
    "",
    "**`api-index.json`** is the full symbol tree used for cross-library search. The ",
    "per-library `<lib>.api.json` files carry the full class metadata (properties, methods, ",
    "events, aggregations, associations, descriptions).",
    "",
    ...notIncluded,
  ].filter(l => l !== undefined).join("\n");
  await writeFile(join(OUT_DIR, "VERSION.md"), body, "utf8");
}

async function main() {
  const { version, libs, source } = parseArgs(process.argv.slice(2));
  const isSapui5 = source === "sapui5";
  const base = isSapui5 ? SAPUI5_BASE : OPENUI5_BASE;

  console.log(`Target:    ${isSapui5 ? "SAPUI5 (proprietary — local use only)" : "OpenUI5 (Apache-2.0)"} ${version}`);
  if (isSapui5) console.log("⚠️  Output is git-ignored and must NOT be redistributed.");
  console.log(`Libraries: ${libs.join(", ")}`);
  console.log(`Output:    ${OUT_DIR}`);
  console.log("");

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  // 1. api-index.json — the search index
  const indexUrl = `${base}/${version}/docs/api/api-index.json`;
  console.log(`  → ${indexUrl}`);
  const index = await fetchJson(indexUrl);
  await writeFile(join(OUT_DIR, "api-index.json"), JSON.stringify(index), "utf8");
  console.log(`     wrote api-index.json (${await humanBytes(join(OUT_DIR, "api-index.json"))})`);

  // 2. per-library api.json
  let libOk = 0, libFail = 0;
  for (const lib of libs) {
    const slashLib = lib.replace(/\./g, "/");
    const url = `${base}/${version}/test-resources/${slashLib}/designtime/apiref/api.json`;
    console.log(`  → ${url}`);
    try {
      const spec = await fetchJson(url);
      const outPath = join(OUT_DIR, `${lib}.api.json`);
      await writeFile(outPath, JSON.stringify(spec), "utf8");
      console.log(`     wrote ${lib}.api.json (${await humanBytes(outPath)}, version ${spec.version || "?"}, ${spec.symbols?.length ?? 0} symbols)`);
      libOk++;
    } catch (e) {
      console.warn(`     SKIP ${lib}: ${e.message}`);
      libFail++;
    }
  }

  // 3. _meta.json (read by the MCP server to report source correctly) + VERSION.md
  const meta = { source: isSapui5 ? "sapui5" : "openui5", version, fetched: new Date().toISOString().slice(0, 10), libs };
  await writeFile(join(OUT_DIR, "_meta.json"), JSON.stringify(meta, null, 2), "utf8");
  await writeVersionDoc(version, libs, isSapui5 ? base : null);
  console.log(`     wrote VERSION.md`);

  console.log("");
  console.log(`Done. Libraries: ${libOk} ok, ${libFail} skipped.`);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
