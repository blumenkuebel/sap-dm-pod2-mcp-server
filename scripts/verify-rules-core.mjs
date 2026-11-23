// Fact-verification evaluator for the rule registry (Tier A — machine-checkable).
//
// Evaluates each rule's `verification.checks[]` against the BUNDLED specs
// (docu/ui5-api-specs, docu/pod2-api-specs, docu/sap-dm-api-specs) by reusing the
// server's own spec readers from dist/helpers.js. Pure + importable: the gate test
// and the dev viewer both call verifyAll().
//
// Verdict per rule: "pass" (all checks hold) | "fail" (a check is contradicted —
// the rule's stated fact is no longer true in the current specs → obsolete/wrong) |
// "unverifiable" (a check could not be evaluated, e.g. library not bundled or an
// enum whose members the spec does not list).

import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const helpers = await import(pathToFileURL(path.join(ROOT, "dist", "helpers.js")).href);

const {
  getUi5ApiSpecFile,
  pickUi5Symbol,
  sliceUi5Symbol,
  getPod2ApiDocFiles,
  getSapDmApiFiles,
  listEndpoints,
  matchOperation,
  readFileContent,
} = helpers;

const ui5SpecCache = new Map();
function loadUi5(symbol) {
  const file = getUi5ApiSpecFile(symbol);
  if (!file) return null;
  if (!ui5SpecCache.has(file)) ui5SpecCache.set(file, JSON.parse(readFileContent(file)));
  return ui5SpecCache.get(file);
}

/** Version the checks actually ran against (on-disk truth, not config.ts). */
export function checkedAgainst() {
  let ui5Version = "unknown";
  try {
    const metaPath = path.join(ROOT, "docu", "ui5-api-specs", "_meta.json");
    ui5Version = JSON.parse(readFileContent(metaPath)).version ?? "unknown";
  } catch {
    /* bundle may be absent */
  }
  let dmRelease = "unknown";
  try {
    const v = readFileContent(path.join(ROOT, "docu", "sap-dm-api-specs", "VERSION.md"));
    dmRelease = v.match(/\b(\d{4})\b/)?.[1] ?? "unknown";
  } catch {
    /* ignore */
  }
  return { ui5Version, dmRelease };
}

function enumMemberNames(symbol) {
  // Enum members live in the symbol's top-level `properties` array, named fully
  // (e.g. "sap.m.ValueColor.Good"). Return their short names.
  if (!Array.isArray(symbol.properties)) return null;
  return symbol.properties.map((p) => String(p.name).split(".").pop());
}

/** Evaluate one SpecCheck → "pass" | "fail" | "unverifiable" (+ detail). */
export function evaluateCheck(check) {
  const d = (verdict, detail) => ({ verdict, detail });
  switch (check.kind) {
    case "ui5SymbolExists": {
      const spec = loadUi5(check.symbol);
      if (!spec) return d("unverifiable", `library for ${check.symbol} not bundled`);
      const found = !!pickUi5Symbol(spec, check.symbol);
      return found === check.present
        ? d("pass")
        : d("fail", `${check.symbol} present=${found}, expected ${check.present}`);
    }
    case "ui5AggregationType": {
      const spec = loadUi5(check.symbol);
      if (!spec) return d("unverifiable", `library for ${check.symbol} not bundled`);
      const sym = pickUi5Symbol(spec, check.symbol);
      if (!sym) return d("unverifiable", `symbol ${check.symbol} absent`);
      const aggs = sliceUi5Symbol(sym, "aggregations").aggregations ?? [];
      const agg = aggs.find((a) => a.name === check.aggregation);
      if (!agg) return d("fail", `aggregation ${check.aggregation} not found on ${check.symbol}`);
      return agg.type === check.type
        ? d("pass")
        : d("fail", `${check.symbol}.${check.aggregation} type=${agg.type}, expected ${check.type}`);
    }
    case "ui5PropertyExists": {
      const spec = loadUi5(check.symbol);
      if (!spec) return d("unverifiable", `library for ${check.symbol} not bundled`);
      const sym = pickUi5Symbol(spec, check.symbol);
      if (!sym) return d("unverifiable", `symbol ${check.symbol} absent`);
      const props = (sliceUi5Symbol(sym, "properties").properties ?? []).map((p) => p.name);
      const found = props.includes(check.property);
      return found === check.present
        ? d("pass")
        : d("fail", `${check.symbol}.${check.property} present=${found}, expected ${check.present}`);
    }
    case "ui5EnumMember": {
      const spec = loadUi5(check.enumSymbol);
      if (!spec) return d("unverifiable", `library for ${check.enumSymbol} not bundled`);
      const sym = pickUi5Symbol(spec, check.enumSymbol);
      if (!sym) return check.present ? d("fail", `enum ${check.enumSymbol} absent`) : d("pass");
      const members = enumMemberNames(sym);
      if (!members) return d("unverifiable", `enum ${check.enumSymbol} lists no members in the spec`);
      const found = members.includes(check.member);
      return found === check.present
        ? d("pass")
        : d("fail", `${check.enumSymbol}.${check.member} present=${found}, expected ${check.present}`);
    }
    case "pod2ClassExists": {
      const files = getPod2ApiDocFiles().map((f) => path.basename(f));
      const found = files.includes(`${check.fqn}.md`);
      return found === check.present
        ? d("pass")
        : d("fail", `POD2 class ${check.fqn} present=${found}, expected ${check.present}`);
    }
    case "restEndpointExists": {
      const files = getSapDmApiFiles();
      const file = files.find((f) => path.basename(f).includes(check.service));
      if (!file) return d("unverifiable", `REST service "${check.service}" not bundled`);
      const spec = JSON.parse(readFileContent(file));
      const op = matchOperation(spec, `${check.method} ${check.path}`);
      const found = !!op;
      return found === check.present
        ? d("pass")
        : d("fail", `${check.method} ${check.path} present=${found}, expected ${check.present}`);
    }
    default:
      return d("unverifiable", `unknown check kind "${check.kind}"`);
  }
}

/** Aggregate a rule's checks into one verdict. */
export function verifyRule(rule) {
  const checks = rule.verification?.checks ?? [];
  const results = checks.map((c) => ({ check: c, ...evaluateCheck(c) }));
  const failures = results.filter((r) => r.verdict === "fail");
  const unverifiable = results.filter((r) => r.verdict === "unverifiable");
  const verdict = failures.length ? "fail" : unverifiable.length ? "unverifiable" : "pass";
  return { id: rule.id, method: rule.verification?.method, verdict, results, failures, unverifiable };
}

/** Verify every rule that carries Tier-A checks. */
export function verifyAll(rules) {
  return rules.filter((r) => (r.verification?.checks?.length ?? 0) > 0).map(verifyRule);
}
