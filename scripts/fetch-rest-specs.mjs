#!/usr/bin/env node
/**
 * Fetch SAP DM REST OpenAPI specs into docu/sap-dm-api-specs/.
 *
 * ⚠️  SAP-proprietary output. This script ships NO SAP content. It downloads the OpenAPI
 *     JSON for SAP DM public REST services from the SAP Business Accelerator Hub and writes
 *     them into the local, git-ignored `docu/sap-dm-api-specs/` folder.
 *
 * Usage:
 *   SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE=<cookie> \
 *   node scripts/fetch-rest-specs.mjs [--statuses ACTIVE,BETA] [--release <label>]
 *
 * How to get credentials:
 *   API key :  api.sap.com → profile → Settings → show API Key  (or SAP_API_HUB_KEY env var)
 *   Cookie  :  DevTools (F12) → Network → any api.sap.com request → copy Cookie header
 *              (or SAP_API_HUB_COOKIE env var)
 *
 * SAP DM is SaaS: the Business Accelerator Hub always serves the current release, so this
 * script always downloads the newest specs — there is no version selection. The optional
 * --release label is only recorded in VERSION.md for your own reference; if omitted, the
 * fetch date is used instead.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "docu", "sap-dm-api-specs");

const HUB_HOST = "api.sap.com";
const HUB_PACKAGE = "SAPDigitalManufacturingCloud";
const HUB_CATALOG = `/odata/1.0/catalog.svc/APIContent.APIs?$filter=ParentTechnicalName%20eq%20'${HUB_PACKAGE}'&$format=json&$top=500`;
const HUB_SPEC = (id) => `/odata/1.0/catalog.svc/APIContent.APIs('${id}')/$value?type=JSON&attachment=true`;

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    hubKey: process.env.SAP_API_HUB_KEY || null,
    hubCookie: process.env.SAP_API_HUB_COOKIE || null,
    hubStatuses: ["ACTIVE"],
    release: process.env.SAP_DM_RELEASE || null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--hub-key") opts.hubKey = argv[++i];
    else if (a === "--hub-cookie") opts.hubCookie = argv[++i];
    else if (a === "--statuses") opts.hubStatuses = argv[++i].split(",").map((s) => s.trim().toUpperCase());
    else if (a === "--release") opts.release = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE=<cookie> node scripts/fetch-rest-specs.mjs\n" +
        "  [--statuses ACTIVE,BETA]  lifecycle filter (default: ACTIVE)\n" +
        "  [--release <label>]       optional label for VERSION.md (default: fetch date; SaaS always serves newest)"
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
  const bodyParam = op.parameters.find((p) => p.in === "body");
  const formParams = op.parameters.filter((p) => p.in === "formData");
  const otherParams = op.parameters.filter((p) => p.in !== "body" && p.in !== "formData");

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
  if (spec.openapi) return spec;
  if (spec.swagger !== "2.0") return spec;

  const out = JSON.parse(JSON.stringify(spec));
  out.openapi = "3.0.0";
  delete out.swagger;

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
    out._urlPath = urlPath;
  }
  // servers with variables (newer format)
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

  for (const pathKey in out.paths) {
    for (const method in out.paths[pathKey]) {
      if (HTTP_METHODS.has(method)) convertBodyParams(out.paths[pathKey][method]);
    }
  }
  patchRefs(out);

  const urlPath = out._urlPath || "";
  delete out._urlPath;
  if (urlPath && out.paths) {
    const newPaths = {};
    for (const [k, v] of Object.entries(out.paths)) {
      newPaths[k.startsWith(urlPath) ? k : urlPath + k] = v;
    }
    out.paths = newPaths;
  }

  return out;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.hubKey) {
    console.error("Cannot fetch REST specs — API key required.\n");
    console.error("  SAP_API_HUB_KEY=<key> npm run fetch-rest-specs\n");
    console.error("Get your API key: api.sap.com → profile → Settings → show API Key");
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  // Build artifact list: catalog (needs cookie) or fall back to existing files
  let artifactIds = [];

  if (opts.hubCookie) {
    console.log("Fetching catalog from SAP Business Accelerator Hub...");
    const catalogHeaders = { Cookie: opts.hubCookie, Accept: "application/json" };
    const catalogRes = await httpsGet(HUB_HOST, HUB_CATALOG, catalogHeaders);
    if (catalogRes.body.trimStart().startsWith("<")) {
      console.error("Catalog returned HTML — cookie is missing or expired. Continuing without catalog (using existing artifact list).");
    } else {
      const catalog = JSON.parse(catalogRes.body);
      const all = catalog.d?.results ?? catalog.d ?? [];
      const filtered = all.filter((a) => opts.hubStatuses.includes((a.State || "").toUpperCase()));
      artifactIds = filtered.map((a) => a.Name || a.ID).filter(Boolean);
      console.log(`Catalog: ${all.length} total, ${artifactIds.length} match [${opts.hubStatuses.join(",")}]`);
    }
  }

  // Fall back: derive artifact IDs from existing JSON files already in OUT_DIR
  if (artifactIds.length === 0 && existsSync(OUT_DIR)) {
    const { readdir } = await import("node:fs/promises");
    const existing = (await readdir(OUT_DIR)).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
    if (existing.length) {
      artifactIds = existing;
      console.log(`No catalog available — using ${artifactIds.length} artifact IDs from existing files.`);
    }
  }

  if (artifactIds.length === 0) {
    console.error("No artifact IDs available. Provide SAP_API_HUB_COOKIE to fetch the catalog, or run once with existing files present.");
    process.exit(1);
  }

  console.log(`Release label:  ${opts.release ?? "current (SaaS — newest available)"}`);
  console.log("");

  let ok = 0, fail = 0;
  for (const id of artifactIds) {
    process.stdout.write(`  → ${id} ... `);
    try {
      const downloadHeaders = { apikey: opts.hubKey, Accept: "application/json" };
      if (opts.hubCookie) downloadHeaders.Cookie = opts.hubCookie;
      const res = await httpsGet(HUB_HOST, HUB_SPEC(id), downloadHeaders);
      if (res.body.trimStart().startsWith("<")) {
        throw new Error("HTML response — API key invalid or expired (refresh at api.sap.com → Settings → API Key)");
      }
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

  const now = new Date().toISOString().slice(0, 10);
  const versionDoc = [
    "# SAP DM REST OpenAPI specs — local snapshot",
    "",
    `**SAP DM release**: ${opts.release ?? `current (SaaS — newest available as of ${now})`}`,
    `**Fetched**: ${now}`,
    `**Source**: SAP Business Accelerator Hub (package: ${HUB_PACKAGE})`,
    "",
    "⚠️ SAP-proprietary. Not redistributed by this repo (git-ignored). Governed by the",
    "applicable SAP terms of use / license.",
    "",
    `Services fetched this run: ${ok} ok, ${fail} skipped.`,
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "VERSION.md"), versionDoc, "utf8");

  console.log("");
  console.log(`Done. ${ok} ok, ${fail} skipped. Recorded in VERSION.md.`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
