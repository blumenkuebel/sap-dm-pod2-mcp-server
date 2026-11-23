#!/usr/bin/env node
// Generates docu/rules-registry.md (agent-facing) from the single source of truth
// src/rules/registry.ts (compiled to dist/rules/registry.js).
//
// The registry holds per-rule METADATA (severity, downgradability, provenance). The
// detection grep + before→after fix for each rule stays in its common-mistakes-* entry —
// this table links to it and never duplicates it.
//
// Usage:  npm run build && node scripts/generate-rules-registry.mjs
// Run after any edit to src/rules/registry.ts. test/rules-registry.test.js fails if the
// committed docu/rules-registry.md is stale.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docu", "rules-registry.md");
const registryUrl = pathToFileURL(path.join(ROOT, "dist", "rules", "registry.js"));

const CATEGORY_DOC = {
  setup: "common-mistakes-setup.md",
  lifecycle: "common-mistakes-lifecycle.md",
  imports: "common-mistakes-imports.md",
  ui: "common-mistakes-ui.md",
  config: "common-mistakes-config.md",
  data: "common-mistakes-data.md",
  i18n: "common-mistakes-i18n.md",
  "html5-migration": "html5-migration-guide.md",
};

function numKey(id) {
  const m = id.match(/^M(\d+)/);
  return m ? [0, +m[1], id] : [1, 0, id];
}
function cell(s) {
  return String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export async function buildMarkdown() {
  const { RULES } = await import(registryUrl.href);
  const rules = [...RULES].sort((a, b) => {
    const [ag, an, ai] = numKey(a.id), [bg, bn, bi] = numKey(b.id);
    return ag - bg || an - bn || ai.localeCompare(bi);
  });

  const count = (s) => rules.filter((r) => r.provenance.status === s).length;
  const unverified = rules.filter((r) => r.provenance.status === "unverified").map((r) => r.id);
  const inferred = rules.filter((r) => r.provenance.status === "inferred").map((r) => r.id);

  const sevIcon = { error: "🔴 Error", warning: "⚠️ Warning", info: "ℹ️ Info" };
  const provIcon = { verified: "✅ verified", inferred: "🧩 inferred", unverified: "❓ unverified" };

  const rows = rules.map((r) => {
    const doc = CATEGORY_DOC[r.category];
    const idLink = r.anchor ? `[${r.id}](${doc}#${r.anchor})` : r.id;
    const down = r.downgradable ? "yes" : "**no**";
    const src = r.provenance.source ? ` — ${cell(r.provenance.source)}` : "";
    return `| ${idLink} | ${cell(r.title)} | ${r.category} | ${sevIcon[r.severity]} | ${down} | ${provIcon[r.provenance.status]}${src} |`;
  });

  return `# Rules Registry

> **Generated file — do not edit by hand.** Single source of truth: \`src/rules/registry.ts\`.
> Regenerate with \`npm run generate-rules-registry\`. This table holds per-rule **metadata**
> (severity, downgradability, provenance). The **detection grep + before→after fix** for each rule
> lives in its linked \`common-mistakes-*\` entry — this file never duplicates it.

## Provenance audit

Each rule's grounding:

- **✅ verified** — backed by a citable SAP source (help.sap.com, \`pod2-api-specs\`, REST specs, UI5 API).
- **🧩 inferred** — derived from the project reference examples, **not yet SAP-doc confirmed**. These
  are the audit targets: the same reverse-from-example origin that produced the wrong M6/M21 rules.
- **❓ unverified** — no cited source yet. Cleanup backlog.

| Status | Count |
|---|---:|
| ✅ verified | ${count("verified")} |
| 🧩 inferred | ${count("inferred")} |
| ❓ unverified | ${count("unverified")} |
| **total** | **${rules.length}** |

**🧩 inferred (confirm against SAP docs or demote):** ${inferred.join(", ") || "—"}

**❓ unverified (cite a source or re-test):** ${unverified.join(", ")}

> When an agent cites a rule whose status is **inferred** or **unverified**, it must report the finding
> with a provenance caveat (the rule is not SAP-confirmed) — see \`validate-project-instructions.md\` Phase 3.

## Catalog

Severity is the rule's **true** severity; \`downgradable: no\` means a suppression marker cannot lower it.
\`Audit list\` in \`src/rules/registry.ts\` records which Phase 3 group sweeps the code (a rule may be
swept under Errors yet be Warning-grade, e.g. M66/M70/M72).

| ID | Title | Category | Severity | Downgradable | Provenance |
|----|-------|----------|----------|:------------:|------------|
${rows.join("\n")}
`;
}

// Run as CLI (not when imported by the test).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const md = await buildMarkdown();
  fs.writeFileSync(OUT, md);
  console.log(`wrote ${path.relative(ROOT, OUT)} (${md.length} bytes)`);
}
