import * as path from "node:path";
import * as url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const VERSION = "1.0.0";
export const PORT = parseInt(process.env.PORT ?? "3001", 10);

// Base dir is the project root (one level up from src/)
export const BASE_DIR = path.resolve(__dirname, "..");

export const DOCU_DIR = path.join(BASE_DIR, "docu");
export const POD2_API_SPECS_DIR = path.join(DOCU_DIR, "pod2-api-specs");
export const SAP_DM_API_SPECS_DIR = path.join(DOCU_DIR, "sap-dm-api-specs");
export const UI5_API_SPECS_DIR = path.join(DOCU_DIR, "ui5-api-specs");
export const ARCHIVE_DIR = path.join(DOCU_DIR, "_import");

// Pinned OpenUI5 (Apache-2.0) version for the bundled docu/ui5-api-specs/ snapshot.
// Regenerate with `npm run update-ui5-api-specs`; audit with `npm run check-ui5-api-freshness`.
export const DEFAULT_UI5_VERSION = "1.136.15";

// SAP DM ships in release waves (format YYMM, e.g. 2601, 2608). The SAP-proprietary specs
// (sap-dm-api-specs / sap-dm-mdo-specs) are release-bound and are NOT shipped with this repo —
// fetch them for a chosen release via `npm run prepare:specs`
// (override with `--release <YYMM>` or the SAP_DM_RELEASE env var). Keep this default in sync
// with the DEFAULT_RELEASE constant in the scripts/ helpers.
export const DEFAULT_DM_RELEASE = process.env.SAP_DM_RELEASE ?? "2608";

export type LogLevel = "debug" | "info" | "warn" | "error";

export const LOG_LEVEL: LogLevel = (() => {
  const val = (process.env.LOG_LEVEL ?? "info").toLowerCase();
  return (["debug", "info", "warn", "error"].includes(val) ? val : "info") as LogLevel;
})();
