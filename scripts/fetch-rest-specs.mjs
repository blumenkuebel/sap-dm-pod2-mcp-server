#!/usr/bin/env node
/**
 * Fetch SAP DM REST OpenAPI specs into docu/sap-dm-api-specs/.
 *
 * ⚠️  SAP-proprietary output. This script ships NO SAP content. It downloads the OpenAPI
 *     JSON for SAP DM public REST services from YOUR OWN licensed source and writes them
 *     into the local, git-ignored `docu/sap-dm-api-specs/` folder.
 *
 * ─── Mode A: SAP Business Accelerator Hub (recommended) ──────────────────────
 *   Downloads all active SAP DM REST API specs automatically. Converts Swagger 2.0 →
 *   OpenAPI 3.0 inline. No tenant URL or bearer token needed — only your api.sap.com
 *   credentials (API key + browser session cookie).
 *
 *   SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE=<cookie> \
 *   node scripts/fetch-rest-specs.mjs --hub [--statuses ACTIVE,BETA] [--release 2608]
 *
 *   How to get credentials:
 *     API key :  api.sap.com → profile → Settings → show API Key
 *     Cookie  :  DevTools (F12) → Network → any request to api.sap.com → copy Cookie header
 *
 * ─── Mode B: Your own DM tenant ───────────────────────────────────────────────
 *   Fetches from your tenant's API gateway using a bearer token.
 *   Use this when you need a specific tenant-bound spec version or want to pick services
 *   individually.
 *
 *   SAP_DM_TOKEN=<bearer> node scripts/fetch-rest-specs.mjs \
 *     --base-url https://api.<region>.dmc.cloud.sap \
 *     --services order,sfc,material \
 *     [--pattern "{base}/{service}/openapi.json"] \
 *     [--release 2608]
 *
 *   Service list resolution (first match wins):
 *     1. --services a,b,c
 *     2. docu/sap-dm-api-specs/services.txt  (one slug per line, '#' comments ok)
 *     3. existing *.json filenames in docu/sap-dm-api-specs/  (re-fetch for new release)
 *
 * Release (YYMM e.g. 2608): recorded in docu/sap-dm-api-specs/VERSION.md.
 *   --release 2608  or  env SAP_DM_RELEASE.  Default: DEFAULT_RELEASE (sync with config.ts).
 */

import { writeFile, readFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "docu", "sap-dm-api-specs");
const SERVICES_FILE = join(OUT_DIR, "services.txt");

// Keep in sync with src/config.ts DEFAULT_DM_RELEASE
const DEFAULT_RELEASE = "2608";
// Verify URL pattern against your tenant before trusting output.
const DEFAULT_PATTERN = "{base}/{service}/openapi.json";

const HUB_HOST = "api.sap.com";
const HUB_PACKAGE = "SAPDigitalManufacturingCloud";
const HUB_CATALOG = `/odata/1.0/catalog.svc/APIContent.APIs?$filter=ParentTechnicalName%20eq%20'${HUB_PACKAGE}'&$format=json&$top=500`;
const HUB_SPEC = (id) => `/odata/1.0/catalog.svc/APIContent.APIs('${id}')/$value?type=JSON&attachment=true`;

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    hub: false,
    hubKey: process.env.SAP_API_HUB_KEY || null,
    hubCookie: process.env.SAP_API_HUB_COOKIE || null,
    hubStatuses: ["ACTIVE"],
    baseUrl: null,
    services: null,
    pattern: DEFAULT_PATTERN,
    release: process.env.SAP_DM_RELEASE || DEFAULT_RELEASE,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--hub") opts.hub = true;
    else if (a === "--hub-key") opts.hubKey = argv[++i];
    else if (a === "--hub-cookie") opts.hubCookie = argv[++i];
    else if (a === "--statuses") opts.hubStatuses = argv[++i].split(",").map((s) => s.trim().toUpperCase());
    else if (a === "--base-url") opts.baseUrl = argv[++i];
    else if (a === "--services") opts.services = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--pattern") opts.pattern = argv[++i];
    else if (a === "--release") opts.release = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log(
        "Mode A (Hub): SAP_API_HUB_KEY=<k> SAP_API_HUB_COOKIE=<c> node scripts/fetch-rest-specs.mjs --hub [--statuses ACTIVE,BETA] [--release YYMM]\n" +
        "Mode B (Tenant): SAP_DM_TOKEN=<t> node scripts/fetch-rest-specs.mjs --base-url <host> --services a,b [--pattern '{base}/{service}/openapi.json'] [--release YYMM]"
      );
      process.exit(0);
    }
  }
  return opts;
}

// ─── HTTPS helper (no external deps) ─────────────────────────────────────────

function httpsGet(hostname, reqPath, headers, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) return reject(new Error("Too many redirects"));
    const req = https.request({ hostname, path: reqPath, method: "GET", headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        try {
          const u = new URL(res.headers.location, `https://${hostname}`);
          return httpsGet(u.hostname, u.pathname + u.search, headers, depth + 1).then(resolve).catch(reject);
        } catch { return reject(new Error(`Invalid redirect: ${res.headers.location}`)); }
      }
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve({ statusCode: res.statusCode, body });
        else reject(new Error(`HTTP ${res.statusCode} for ${reqPath}: ${body.slice(0, 200)}`));
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// ─── Swagger 2.0 → OpenAPI 3.0 conversion ────────────────────────────────────

function patchRefs(obj) {
  if (typeof obj !== "object" || obj === null) return;
  for (const k in obj) {
    if (k === "$ref" && typeof obj[k] === "string")
      obj[k] = obj[k].replace("#/definitions/", "#/components/schemas/");
    else patchRefs(obj[k]);
  }
}

function convertBodyParams(op) {
  if (!op.parameters?.length) return;
  const bodyParams = op.parameters.filter((p) => p.in === "body" || p.in === "formData");
  const otherParams = op.parameters.filter((p) => p.in !== "body" && p.in !== "formData");

  const bodyParam = bodyParams.find((p) => p.in === "body");
  const formParams = bodyParams.filter((p) => p.in === "formData");

  if (bodyParam) {
    op.requestBody = {
      description: bodyParam.description || "",
      required: bodyParam.required || false,
      content: { "application/json": { schema: bodyParam.schema } },
    };
  } else if (formParams.length) {
    const props = {};
    const req = [];
    for (const fp of formParams) {
      props[fp.name] = { type: fp.type || "string", description: fp.description };
      if (fp.required) req.push(fp.name);
    }
    op.requestBody = {
      required: req.length > 0,
      content: { "multipart/form-data": { schema: { type: "object", properties: props, ...(req.length ? { required: req } : {}) } } },
    };
  }
  if (otherParams.length) op.parameters = otherParams;
  else delete op.parameters;
}

const HTTP_METHODS = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace"]);

function swaggerToOpenApi(spec) {
  if (spec.openapi) return spec; // Already OpenAPI 3.x
  if (spec.swagger !== "2.0") return spec; // Unknown format, pass through

  const out = JSON.parse(JSON.stringify(spec));
  out.openapi = "3.0.0";
  delete out.swagger;

  // definitions → components/schemas
  if (out.definitions) {
    out.components = { schemas: out.definitions };
    delete out.definitions;
  }

  // servers from x-servers (old format with templates)
  if (spec["x-servers"]?.[0]?.templates?.regionHost?.enum) {
    const tmpl = spec["x-servers"][0];
    const urlPath = tmpl.url.substring(tmpl.url.indexOf("}") + 1);
    out.servers = tmpl.templates.regionHost.enum.map((h) => ({
      url: `https://api.${h}`,
      description: h.substring(0, h.indexOf(".dmc")),
    }));
    delete out["x-servers"];
    out._urlPath = urlPath; // stash for path-prefix step
  }
  // servers with variables (new format)
  else if (spec.servers?.[0]?.variables?.regionHost?.enum) {
    const s = spec.servers[0];
    const urlPath = s.url.substring(s.url.indexOf("}") + 1);
    out.servers = s.variables.regionHost.enum.map((h) => ({
      url: `https://api.${h}`,
      description: h.substring(0, h.indexOf(".dmc")),
    }));
    out._urlPath = urlPath;
  }
  // Plain host/basePath
  else if (spec.host) {
    const scheme = spec.schemes?.[0] ?? "https";
    out.servers = [{ url: `${scheme}://${spec.host}${spec.basePath || ""}` }];
    out._urlPath = spec.basePath || "";
  }
  delete out.host;
  delete out.basePath;
  delete out.schemes;
  delete out.consumes;
  delete out.produces;

  // Convert body params and patch $refs
  for (const pathKey in out.paths) {
    for (const method in out.paths[pathKey]) {
      if (HTTP_METHODS.has(method)) convertBodyParams(out.paths[pathKey][method]);
    }
  }
  patchRefs(out);

  // Prefix all paths with the base URL path (e.g. /sapdme_material)
  const urlPath = out._urlPath || "";
  delete out._urlPath;
  if (urlPath && out.paths) {
    const newPaths = {};
    for (const [k, v] of Object.entries(out.paths)) {
      const prefixed = k.startsWith(urlPath) ? k : urlPath + k;
      newPaths[prefixed] = v;
    }
    out.paths = newPaths;
  }

  return out;
}

// ─── Mode A: Hub download ─────────────────────────────────────────────────────

async function fetchFromHub(opts) {
  const key = opts.hubKey;
  const cookie = opts.hubCookie;

  if (!key || !cookie) {
    console.error("Hub mode requires SAP_API_HUB_KEY and SAP_API_HUB_COOKIE.");
    console.error("  API key : api.sap.com → profile → Settings → show API Key");
    console.error("  Cookie  : DevTools (F12) → Network → any api.sap.com request → copy Cookie header");
    if (!key) console.error("  Missing: SAP_API_HUB_KEY (or --hub-key)");
    if (!cookie) console.error("  Missing: SAP_API_HUB_COOKIE (or --hub-cookie)");
    process.exit(1);
  }

  console.log("Fetching catalog from SAP Business Accelerator Hub...");
  const catalogRes = await httpsGet(HUB_HOST, HUB_CATALOG, { Cookie: cookie, Accept: "application/json" });

  if (catalogRes.body.trimStart().startsWith("<")) {
    console.error("Catalog returned HTML — cookie is missing or expired. Refresh your api.sap.com session.");
    process.exit(1);
  }

  const catalog = JSON.parse(catalogRes.body);
  const all = catalog.d?.results ?? catalog.d ?? [];
  const filtered = all.filter((a) => opts.hubStatuses.includes((a.State || "").toUpperCase()));

  console.log(`APIs in package: ${all.length} total, ${filtered.length} match status filter [${opts.hubStatuses.join(",")}]`);
  console.log(`Release: ${opts.release}`);
  console.log("");

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  let ok = 0, fail = 0;
  for (const api of filtered) {
    const id = api.Name || api.ID;
    if (!id) { console.error(`  [SKIP] Entry without ID: ${JSON.stringify(api)}`); fail++; continue; }

    process.stdout.write(`  → ${id} ... `);
    try {
      const res = await httpsGet(HUB_HOST, HUB_SPEC(id), { apikey: key, Cookie: cookie, Accept: "application/json" });
      const raw = JSON.parse(res.body);
      const converted = swaggerToOpenApi(raw);
      await writeFile(join(OUT_DIR, `${id}.json`), JSON.stringify(converted, null, 2), "utf8");
      console.log("ok");
      ok++;
    } catch (e) {
      console.log(`SKIP (${e.message})`);
      fail++;
    }
  }

  return { ok, fail, source: `SAP Business Accelerator Hub (package: ${HUB_PACKAGE})` };
}

// ─── Mode B: Tenant gateway ───────────────────────────────────────────────────

async function resolveServices(explicit) {
  if (explicit?.length) return explicit;
  if (existsSync(SERVICES_FILE)) {
    const txt = await readFile(SERVICES_FILE, "utf8");
    const list = txt.split("\n").map((l) => l.replace(/#.*$/, "").trim()).filter(Boolean);
    if (list.length) return list;
  }
  if (existsSync(OUT_DIR)) {
    const list = (await readdir(OUT_DIR)).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
    if (list.length) return list;
  }
  return [];
}

async function fetchFromTenant(opts) {
  const token = process.env.SAP_DM_TOKEN;
  const services = await resolveServices(opts.services);

  if (!opts.baseUrl || services.length === 0) {
    console.error("Tenant mode requires --base-url and a service list.");
    console.error("");
    console.error("Tip: --hub mode downloads all 79 services automatically from api.sap.com (no bearer token needed).");
    console.error("");
    if (!opts.baseUrl) console.error("  Missing: --base-url https://api.<region>.dmc.cloud.sap");
    if (!services.length) console.error("  Missing: --services order,sfc,... or docu/sap-dm-api-specs/services.txt");
    process.exit(1);
  }

  console.log(`Release:  ${opts.release}`);
  console.log(`Base URL: ${opts.baseUrl}`);
  console.log(`Pattern:  ${opts.pattern}`);
  console.log(`Services: ${services.length}`);
  if (!token) console.warn("WARN: SAP_DM_TOKEN not set — requests may return 401.");
  console.log("");

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  const headers = token
    ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
    : { Accept: "application/json" };

  let ok = 0, fail = 0;
  for (const service of services) {
    const url = opts.pattern
      .replace("{base}", opts.baseUrl.replace(/\/$/, ""))
      .replace("{service}", service);
    process.stdout.write(`  → ${service}: ${url} ... `);
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const converted = swaggerToOpenApi(raw);
      await writeFile(join(OUT_DIR, `${service}.json`), JSON.stringify(converted, null, 2), "utf8");
      console.log("ok");
      ok++;
    } catch (e) {
      console.log(`SKIP (${e.message})`);
      fail++;
    }
  }

  return { ok, fail, source: opts.baseUrl };
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.hub && !opts.baseUrl) {
    console.error("Cannot fetch REST specs — SAP-proprietary content is not shipped with this repo.\n");
    console.error("Run with --hub to download all active specs from the SAP Business Accelerator Hub:");
    console.error("  SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE=<cookie> node scripts/fetch-rest-specs.mjs --hub\n");
    console.error("Get credentials: api.sap.com → profile → Settings → show API Key");
    console.error("  Cookie: DevTools (F12) → Network → any api.sap.com request → copy Cookie header");
    process.exit(1);
  }

  const { ok, fail, source } = opts.hub
    ? await fetchFromHub(opts)
    : await fetchFromTenant(opts);

  const now = new Date().toISOString().slice(0, 10);
  const versionDoc = [
    "# SAP DM REST OpenAPI specs — local snapshot",
    "",
    `**SAP DM release**: ${opts.release}`,
    `**Fetched**: ${now}`,
    `**Source**: ${source}`,
    "",
    "⚠️ SAP-proprietary. Not redistributed by this repo (git-ignored). Governed by the",
    "applicable SAP terms of use / license.",
    "",
    `Services fetched this run: ${ok} ok, ${fail} skipped.`,
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "VERSION.md"), versionDoc, "utf8");

  console.log("");
  console.log(`Done. ${ok} ok, ${fail} skipped. Release ${opts.release} recorded in VERSION.md.`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
