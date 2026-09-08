#!/usr/bin/env node
// Snapshot the **OpenUI5** (Apache-2.0) API JSON specs into docu/ui5-api-specs/.
//
// OpenUI5 is licensed under the Apache License 2.0, so — unlike the proprietary SAPUI5 SDK
// (ui5.sap.com) — these generated specs MAY be redistributed, provided the Apache-2.0
// LICENSE and NOTICE stay alongside them (this script writes both into the output folder).
//
// Usage:
//   node scripts/update-ui5-api-specs.mjs [--version 1.136.15] [--libs sap.m,sap.ui.core,...]
//
// Defaults: version = DEFAULT_VERSION (SAP DM POD 2.0 UI5 target); libs = the OpenUI5
//           libraries relevant to SAP DM POD 2.0.
//
// Source endpoints (OpenUI5 demokit / SDK):
//   - https://sdk.openui5.org/<ver>/docs/api/api-index.json          (search index)
//   - https://sdk.openui5.org/<ver>/test-resources/sap/<lib-slashes>/designtime/apiref/api.json (per lib)
//
// NOTE: Only libraries that ship with OpenUI5 are available. SAPUI5-only libraries
//       (sap.suite.*, sap.ui.comp, sap.ushell, sap.viz, sap.chart, sap.gantt, sap.ndc,
//       sap.insights, …) are proprietary and are intentionally NOT fetched here.

import { writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "docu", "ui5-api-specs");

const OPENUI5_BASE = "https://sdk.openui5.org";
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

const APACHE_LICENSE_URL = "https://www.apache.org/licenses/LICENSE-2.0.txt";

function parseArgs(argv) {
  const opts = { version: DEFAULT_VERSION, libs: DEFAULT_LIBS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--version") opts.version = argv[++i];
    else if (arg === "--libs") opts.libs = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/update-ui5-api-specs.mjs [--version X.Y.Z] [--libs sap.m,sap.ui.core,...]");
      process.exit(0);
    }
  }
  return opts;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function humanBytes(path) {
  try {
    const s = await stat(path);
    if (s.size >= 1024 * 1024) return `${(s.size / 1024 / 1024).toFixed(1)} MB`;
    return `${(s.size / 1024).toFixed(1)} KB`;
  } catch { return "?"; }
}

async function writeLicenseAndNotice(version) {
  // Apache-2.0 license text (required alongside redistributed OpenUI5 material).
  try {
    const license = await fetchText(APACHE_LICENSE_URL);
    await writeFile(join(OUT_DIR, "LICENSE"), license, "utf8");
    console.log("     wrote LICENSE (Apache-2.0)");
  } catch (e) {
    console.warn(`     WARN: could not fetch Apache-2.0 license text (${e.message}); write docu/ui5-api-specs/LICENSE manually from ${APACHE_LICENSE_URL}`);
  }
  const notice = [
    "OpenUI5",
    "Copyright (c) 2009-present SAP SE or an SAP affiliate company and OpenUI5 contributors.",
    "",
    "This product includes software developed by SAP SE and the OpenUI5 project",
    "(https://github.com/SAP/openui5), licensed under the Apache License, Version 2.0.",
    "",
    `The API metadata in this directory was generated from OpenUI5 ${version}`,
    `(source: ${OPENUI5_BASE}/${version}/).`,
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "NOTICE"), notice, "utf8");
  console.log("     wrote NOTICE");
}

async function writeVersionDoc(version, libs) {
  const now = new Date().toISOString().slice(0, 10);
  const rows = [];
  for (const f of (await readdir(OUT_DIR)).sort()) {
    if (!f.endsWith(".json")) continue;
    rows.push(`| \`${f}\` | ${await humanBytes(join(OUT_DIR, f))} |`);
  }
  const body = [
    "# OpenUI5 API Reference — bundled snapshot",
    "",
    `**Version pinned to**: ${version}`,
    `**Last updated**: ${now}`,
    `**Source**: ${OPENUI5_BASE}/${version}/`,
    "**License**: Apache-2.0 (see `LICENSE` and `NOTICE` in this folder)",
    "",
    "This directory holds a snapshot of the **OpenUI5** API reference used by the ",
    "`list_ui5_libraries`, `search_ui5_api`, and `get_ui5_api` tools. Because OpenUI5 is ",
    "Apache-2.0 licensed, this snapshot may be committed and redistributed together with the ",
    "accompanying `LICENSE`/`NOTICE`.",
    "",
    "## Update procedure",
    "",
    "SAP DM POD 2.0 currently targets UI5 `1.136.x`. When SAP DM upgrades:",
    "",
    "```bash",
    "npm run update-ui5-api-specs -- --version <new-version>",
    "git add docu/ui5-api-specs/",
    "git commit -m 'Bump bundled OpenUI5 API to <new-version>'",
    "```",
    "",
    "## Files",
    "",
    "| File | Size |",
    "|---|---|",
    ...rows,
    "",
    "## Bundled libraries (OpenUI5 only)",
    "",
    ...libs.map((l) => `- \`${l}\``),
    "",
    "**`api-index.json`** is the full symbol tree used for cross-library search. The ",
    "per-library `<lib>.api.json` files carry the full class metadata (properties, methods, ",
    "events, aggregations, associations, descriptions).",
    "",
    "## Not included (SAPUI5-only, proprietary)",
    "",
    "Libraries that do not ship with OpenUI5 are intentionally omitted: `sap.suite.*`, ",
    "`sap.ui.comp`, `sap.ushell`, `sap.viz`, `sap.chart`, `sap.gantt`, `sap.ndc`, ",
    "`sap.insights`, `sap.suite.ui.generic.template`. If your plugin uses one of these, ",
    "consult the proprietary SAPUI5 SDK under your own SAP license.",
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "VERSION.md"), body, "utf8");
}

async function main() {
  const { version, libs } = parseArgs(process.argv.slice(2));
  console.log(`Target: OpenUI5 ${version}`);
  console.log(`Libraries: ${libs.join(", ")}`);
  console.log(`Output: ${OUT_DIR}`);
  console.log("");

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  // 1. api-index.json — the search index
  const indexUrl = `${OPENUI5_BASE}/${version}/docs/api/api-index.json`;
  console.log(`  → ${indexUrl}`);
  const index = await fetchJson(indexUrl);
  await writeFile(join(OUT_DIR, "api-index.json"), JSON.stringify(index), "utf8");
  console.log(`     wrote api-index.json (${await humanBytes(join(OUT_DIR, "api-index.json"))})`);

  // 2. per-library api.json — per-lib failures are non-fatal (OpenUI5 lib availability varies by version)
  let libOk = 0, libFail = 0;
  for (const lib of libs) {
    const slashLib = lib.replace(/\./g, "/");
    const url = `${OPENUI5_BASE}/${version}/test-resources/${slashLib}/designtime/apiref/api.json`;
    console.log(`  → ${url}`);
    try {
      const spec = await fetchJson(url);
      const outPath = join(OUT_DIR, `${lib}.api.json`);
      await writeFile(outPath, JSON.stringify(spec), "utf8");
      console.log(`     wrote ${lib}.api.json (${await humanBytes(outPath)}, version ${spec.version || "?"}, ${spec.symbols?.length ?? 0} symbols)`);
      libOk++;
    } catch (e) {
      console.warn(`     SKIP ${lib}: ${e.message} (not available in OpenUI5 ${version}?)`);
      libFail++;
    }
  }

  // 3. LICENSE + NOTICE (Apache-2.0 attribution) and VERSION.md
  await writeLicenseAndNotice(version);
  await writeVersionDoc(version, libs);
  console.log(`     wrote VERSION.md`);

  console.log("");
  console.log(`Done. Libraries: ${libOk} ok, ${libFail} skipped.`);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
