#!/usr/bin/env node
/**
 * Fetch SAP DM public REST OpenAPI specs into docu/sap-dm-api-specs/.
 *
 * ⚠️  SAP-proprietary output. This script ships NO SAP content. It downloads the OpenAPI
 *     (Swagger) JSON for SAP DM public REST services from YOUR OWN licensed source and
 *     writes them into the local, git-ignored `docu/sap-dm-api-specs/` folder.
 *
 * Two acquisition paths (both require your own SAP credentials — see README):
 *
 *   A) SAP Business Accelerator Hub (api.sap.com): browse the "SAP Digital Manufacturing"
 *      package, open each API, and download its OpenAPI JSON manually into
 *      docu/sap-dm-api-specs/<service>.json. (Login required; ToU apply.)
 *
 *   B) Your own DM tenant: many services expose their OpenAPI at a stable path on the
 *      API gateway host. This script automates path (B) when you provide a base URL and a
 *      bearer token. VERIFY the URL pattern against your tenant before trusting output.
 *
 * Usage:
 *   SAP_DM_TOKEN=<bearer> \
 *   node scripts/fetch-rest-specs.mjs --base-url https://api.<region>.dmc.cloud.sap \
 *        [--services order,sfc,material,...] [--pattern "{base}/{service}/openapi.json"] \
 *        [--release <YYMM>]
 *
 * Service list resolution (first match wins):
 *   1. --services a,b,c
 *   2. docu/sap-dm-api-specs/services.txt   (one service slug per line, '#' comments ok)
 *   3. existing *.json filenames already in docu/sap-dm-api-specs/  (re-fetch for a new release)
 *
 * Release (YYMM, e.g. 2601, 2608): recorded in docu/sap-dm-api-specs/VERSION.md.
 *   --release 2608  or  env SAP_DM_RELEASE.  Default: DEFAULT_RELEASE (sync with config.ts).
 */

import { writeFile, readFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "docu", "sap-dm-api-specs");
const SERVICES_FILE = join(OUT_DIR, "services.txt");

// Keep in sync with src/config.ts DEFAULT_DM_RELEASE
const DEFAULT_RELEASE = "2608";
// Verify against your tenant. {base} = --base-url, {service} = service slug.
const DEFAULT_PATTERN = "{base}/{service}/openapi.json";

function parseArgs(argv) {
  const opts = {
    baseUrl: null,
    services: null,
    pattern: DEFAULT_PATTERN,
    release: process.env.SAP_DM_RELEASE || DEFAULT_RELEASE,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base-url") opts.baseUrl = argv[++i];
    else if (a === "--services") opts.services = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--pattern") opts.pattern = argv[++i];
    else if (a === "--release") opts.release = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log("Usage: SAP_DM_TOKEN=<bearer> node scripts/fetch-rest-specs.mjs --base-url <host> [--services a,b] [--pattern '{base}/{service}/openapi.json'] [--release <YYMM>]");
      process.exit(0);
    }
  }
  return opts;
}

async function resolveServices(explicit) {
  if (explicit && explicit.length) return explicit;
  if (existsSync(SERVICES_FILE)) {
    const txt = await readFile(SERVICES_FILE, "utf8");
    const list = txt.split("\n").map((l) => l.replace(/#.*$/, "").trim()).filter(Boolean);
    if (list.length) return list;
  }
  if (existsSync(OUT_DIR)) {
    const list = (await readdir(OUT_DIR))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
    if (list.length) return list;
  }
  return [];
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const token = process.env.SAP_DM_TOKEN;

  const services = await resolveServices(opts.services);
  if (!opts.baseUrl || services.length === 0) {
    console.error("Cannot fetch REST specs — SAP-proprietary content is not shipped with this repo.");
    console.error("");
    console.error("Provide your own licensed source:");
    console.error("  A) SAP Business Accelerator Hub (api.sap.com): download each API's OpenAPI JSON");
    console.error("     manually into docu/sap-dm-api-specs/<service>.json  (login required).");
    console.error("  B) Your own DM tenant, automated by this script:");
    console.error("       SAP_DM_TOKEN=<bearer> node scripts/fetch-rest-specs.mjs \\");
    console.error("         --base-url https://api.<region>.dmc.cloud.sap \\");
    console.error("         --services order,sfc,material,inventory,nonconformance");
    console.error("");
    console.error("     Or list the service slugs (one per line) in docu/sap-dm-api-specs/services.txt.");
    if (!opts.baseUrl) console.error("\n  Missing: --base-url");
    if (services.length === 0) console.error("  Missing: service list (--services / services.txt / existing *.json)");
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  console.log(`Release:  ${opts.release}`);
  console.log(`Base URL: ${opts.baseUrl}`);
  console.log(`Pattern:  ${opts.pattern}`);
  console.log(`Services: ${services.length}`);
  if (!token) console.warn("WARN: SAP_DM_TOKEN not set — requests may return 401.");
  console.log("");

  const headers = token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" };
  let ok = 0, fail = 0;
  for (const service of services) {
    const url = opts.pattern.replace("{base}", opts.baseUrl.replace(/\/$/, "")).replace("{service}", service);
    process.stdout.write(`  → ${service}: ${url} ... `);
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      await writeFile(join(OUT_DIR, `${service}.json`), JSON.stringify(json, null, 2), "utf8");
      console.log("ok");
      ok++;
    } catch (e) {
      console.log(`SKIP (${e.message})`);
      fail++;
    }
  }

  // Record which release this spec set represents.
  const now = new Date().toISOString().slice(0, 10);
  const versionDoc = [
    "# SAP DM REST OpenAPI specs — local snapshot",
    "",
    `**SAP DM release**: ${opts.release}`,
    `**Fetched**: ${now}`,
    `**Source base URL**: ${opts.baseUrl}`,
    "",
    "⚠️ SAP-proprietary. Not redistributed by this repo (git-ignored). Governed by the",
    "applicable SAP terms of use / license.",
    "",
    `Services fetched this run: ${ok} ok, ${fail} skipped.`,
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "VERSION.md"), versionDoc, "utf8");

  console.log("");
  console.log(`Done. ${ok} ok, ${fail} skipped. Recorded release ${opts.release} in VERSION.md.`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
