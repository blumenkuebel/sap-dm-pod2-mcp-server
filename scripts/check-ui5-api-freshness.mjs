#!/usr/bin/env node
// Freshness check for the bundled OpenUI5 (Apache-2.0) API JSON snapshot.
//
// Compares each `docu/ui5-api-specs/<lib>.api.json` against the live
// `sdk.openui5.org/<TARGET_VERSION>/test-resources/<slashed>/designtime/apiref/api.json`.
// Exits 1 if any library is out of date or if the pinned version is no longer
// available; exits 0 when everything matches.
//
// The pinned target version is read from `../src/config.ts` (`DEFAULT_UI5_VERSION`),
// keeping runtime and script in sync without a shared config the compiled server
// would drag into its dist output.

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE_DIR = join(__dirname, "..", "docu", "ui5-api-specs");
const CONFIG_PATH = join(__dirname, "..", "src", "config.ts");

const OPENUI5_BASE = "https://sdk.openui5.org";

async function readTargetVersion() {
  const src = await readFile(CONFIG_PATH, "utf8");
  const match = src.match(/DEFAULT_UI5_VERSION\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new Error(`Could not read DEFAULT_UI5_VERSION from ${CONFIG_PATH}`);
  }
  return match[1];
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  if (!existsSync(BUNDLE_DIR)) {
    console.error(`Bundle directory not found: ${BUNDLE_DIR}`);
    console.error(`Run \`npm run update-ui5-api-specs\` first.`);
    process.exit(1);
  }

  const targetVersion = await readTargetVersion();
  console.log(`Target OpenUI5 version (from config.ts): ${targetVersion}`);
  console.log(`Source: ${OPENUI5_BASE}/${targetVersion}/`);
  console.log("");

  // Check the SDK is still serving the pinned version.
  let versionInfo = null;
  try {
    versionInfo = await fetchJson(`${OPENUI5_BASE}/versionoverview.json`);
  } catch (e) {
    console.error(`WARN: could not fetch versionoverview.json (${e.message})`);
  }

  if (versionInfo) {
    const active = versionInfo.activeVersion || versionInfo.active || "?";
    const entries = Array.isArray(versionInfo.versions) ? versionInfo.versions : [];
    const targetMinor = targetVersion.split(".").slice(0, 2).join(".");
    const line = entries.find((v) => typeof v.version === "string" && v.version.startsWith(targetMinor + "."));
    console.log(`SDK activeVersion: ${active}`);
    if (line) {
      const supportNote = [line.support, line.lts ? "LTS" : null].filter(Boolean).join(", ");
      console.log(`Pinned minor line ${targetMinor}.x: ${supportNote}${line.eom ? ` (${line.eom})` : ""}`);
    }
    console.log("");
  }

  // Iterate bundled files.
  const files = (await readdir(BUNDLE_DIR))
    .filter((f) => f.endsWith(".api.json"))
    .sort();
  if (files.length === 0) {
    console.error("No bundled UI5 API JSON found.");
    process.exit(1);
  }

  const rows = [];
  let stale = 0;
  let missing = 0;

  for (const file of files) {
    const lib = file.replace(/\.api\.json$/, "");
    const localPath = join(BUNDLE_DIR, file);
    let localVersion = "?";
    let localSymbols = 0;
    try {
      const localSpec = JSON.parse(await readFile(localPath, "utf8"));
      localVersion = localSpec.version ?? "?";
      localSymbols = Array.isArray(localSpec.symbols) ? localSpec.symbols.length : 0;
    } catch (e) {
      rows.push({ lib, local: "read-error", remote: "-", status: `❌ ${e.message}` });
      stale++;
      continue;
    }

    const slashLib = lib.replace(/\./g, "/");
    const url = `${OPENUI5_BASE}/${targetVersion}/test-resources/${slashLib}/designtime/apiref/api.json`;
    let remoteVersion = "?";
    let remoteSymbols = 0;
    let status = "";
    try {
      const remoteSpec = await fetchJson(url);
      remoteVersion = remoteSpec.version ?? "?";
      remoteSymbols = Array.isArray(remoteSpec.symbols) ? remoteSpec.symbols.length : 0;
      if (remoteVersion === localVersion && remoteSymbols === localSymbols) {
        status = "✓ up-to-date";
      } else if (remoteVersion === localVersion) {
        status = `⚠ symbol count drift (${localSymbols} → ${remoteSymbols})`;
        stale++;
      } else {
        status = `❌ stale (bundled ${localVersion}, remote ${remoteVersion})`;
        stale++;
      }
    } catch (e) {
      status = `❌ fetch-error: ${e.message}`;
      missing++;
    }

    rows.push({
      lib,
      local: `${localVersion} (${localSymbols} sym)`,
      remote: `${remoteVersion} (${remoteSymbols} sym)`,
      status,
    });
  }

  // Print table
  const libWidth = Math.max(...rows.map((r) => r.lib.length), 15);
  const localWidth = Math.max(...rows.map((r) => r.local.length), 15);
  const remoteWidth = Math.max(...rows.map((r) => r.remote.length), 15);
  const header = `${"Library".padEnd(libWidth)}  ${"Bundled".padEnd(localWidth)}  ${"Remote (target)".padEnd(remoteWidth)}  Status`;
  console.log(header);
  console.log("-".repeat(header.length));
  for (const r of rows) {
    console.log(`${r.lib.padEnd(libWidth)}  ${r.local.padEnd(localWidth)}  ${r.remote.padEnd(remoteWidth)}  ${r.status}`);
  }
  console.log("");

  const total = rows.length;
  const ok = total - stale - missing;
  console.log(`${ok}/${total} up-to-date, ${stale} stale, ${missing} unreachable.`);

  if (stale > 0 || missing > 0) {
    console.log("");
    console.log("→ Refresh with: npm run update-ui5-api-specs -- --version " + targetVersion);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
