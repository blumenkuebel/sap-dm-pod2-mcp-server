# POD2 Plugin Development Rules

> Agent-facing rules for POD 2.0 plugin development. **Claude Code** auto-loads this file (`CLAUDE.md`) each session; **other agents** (Cline, Cursor, …) must be told *"read CLAUDE.md"* at the start of every conversation. This is the single source of agent-facing rules.
> Modes: **Scaffold** (no `.scaffold-done`) and **Iterate** (with `.scaffold-done`).
> Full runtime tool catalog → `get_pod2_guidelines` on `sap-dm-pod2-mcp-server` (call once, first thing).

---

## 🧠 Reasoning-First — but not Confirmation-Every-Step

Two categories of work, two behaviors. The mandatory `Changed:` report is what makes "just do it" safe.

### 1. Just do it, then report — default for most changes
Additive or reversible changes proceed **without asking**: new i18n key, new `subscribe`, extra form field, extra validation check, refactor within a single file, styling / labels / tooltips / `valueState` on existing controls. Do the work, then report.

### 2. Stop and confirm — direction-shaping or destructive
Post a **3-line max** proposal, end the turn with **no further tool calls**, wait for the user's next message. **Silence is NOT consent.**

Applies to:
- **Scaffold Mode** (one halt before the sequence below)
- **Migration Mode phase gates** (see Migration section — those take precedence)
- Deleting or renaming an existing file
- Non-additive change to `extension.json` (removing/renaming a registration, changing `modulePath` / `type`)
- Ambiguous request (agent has more than one valid interpretation)
- New architectural piece (new Context, new widget type, new REST client, pattern not yet used in the plugin)

Format: `Proposal: <what and why, 1–2 sentences>. Files: <list>. OK?` → STOP.

### 3. Report obligation — non-negotiable, both categories

Every response that modifies files MUST end with:

```
Changed:
- <file> — <what changed>
- <file> — <what changed>
Behavior: <one sentence describing the effective change>
```

Read-only tools (MCP `get_*` / `list_*` / `search_*`, file reads) may be called any time without a proposal.

**Scope escalation:** If a category-1 change turns out to need a category-2 action mid-work (e.g. a rename becomes necessary), STOP and post a proposal at that point.

---

## 📚 Source-or-Silence (no hallucination)

> **Do NOT invent** API names, class paths, method signatures, properties, REST endpoints, or import paths from training memory when an MCP server can verify them. MCP servers + workspace code are the **single source of truth**.

**Verify before writing any of these:**
- POD2 / SAP DM API class, method, namespace, import path → `sap-dm-pod2-mcp-server` (`get_api_doc`, `get_pattern_doc`, `search_api_docs`)
- Generic UI5 control / property / event → `sap-dm-pod2-mcp-server` (`get_ui5_api`, `search_ui5_api`, `list_ui5_libraries`)
- REST endpoint or request/response shape → `sap-dm-pod2-mcp-server.get_rest_api`
- Pattern (subscribe, dialog, form, table, action lifecycle, …) → `get_pattern_doc`
- MDO entity field → `sap-dm-pod2-mcp-server.get_mdo_entity`
- Any pattern not present in workspace `examples/` — check MCP first

**When neither MCP nor workspace has the answer:** say so explicitly and offer (a) clarification question or (b) an explicit assumption marked as such. Never fill gaps with plausible-sounding invention.

**Source attribution:** For non-trivial framework facts in answers, briefly cite the source (e.g. *"per `get_api_doc({className: "…PodContext"})`"* or *"per `get_ui5_api({symbol: "sap.m.ComboBox"})`"*). For uncertain claims this is MUST — no source → likely invented.

### 🔧 UI5 API lookup

UI5-Lookup läuft komplett über `sap-dm-pod2-mcp-server`. Kein `ui5.yaml`/`webapp/` im Plugin-Verzeichnis nötig, keine externen MCP-Server, keine Workarounds:

```
sap-dm-pod2-mcp-server.list_ui5_libraries()                       // welche Bibliotheken sind gebundelt?
sap-dm-pod2-mcp-server.search_ui5_api({ query: "ComboBox" })      // Klasse suchen, wenn Name unklar
sap-dm-pod2-mcp-server.get_ui5_api({ symbol: "sap.m.ComboBox" })  // Full class metadata
sap-dm-pod2-mcp-server.get_ui5_api({ symbol: "sap.m.ComboBox", section: "properties" })  // 2 KB slice
```

Die Daten sind offline gebundelt im Server (`docu/ui5-api-specs/`, gepinnt auf SAP DM's UI5-Zielversion — see [`ui5-api-specs/VERSION.md`](../docu/ui5-api-specs/VERSION.md)). Same JSON schema wie die SAPUI5-SDK selbst konsumiert.

Citation-Form: `[verified via get_ui5_api({symbol: "sap.m.GenericTile"})]`.

**Never do this**

- ❌ `WebFetch` on `https://ui5.sap.com/#/api/<Class>` — that URL is a SPA shell; `WebFetch` sees only the page title, no API. Use `get_ui5_api` (bundled JSON = same data the SDK loads at runtime).
- ❌ Add `ui5.yaml` / `webapp/` / `package.json` to the plugin root — those files break the POD upload (M0/M15/M2).
- ❌ Invent an import path or method signature from memory — always call `get_ui5_api` first.

---

## 🧭 Mode Detection (first step every conversation)

Check for `.scaffold-done` in the working directory:
- **absent** → **SCAFFOLD MODE** (initial generation)
- **present** → **ITERATION MODE** (patch existing plugin)

---

## 🚀 SCAFFOLD MODE (one time per plugin)

Goal: complete, deployable first draft. UI fine-tuning happens in Iteration after the user has seen the rendered POD.

**Discussion (category-2 halt).** Read `POD2_PLUGIN_TEMPLATE.md`, ask ≤3 clarifying questions (widget type, API pattern, scope), post `Proposal: … Files: … OK?`, STOP. Do NOT debate UI layout details — unverifiable until deployed.

**Execution (after user "go"):**
1. `get_pod2_guidelines` — full rules + tool catalog
2. Load prep docs: `get_pattern_doc` for `extension-json-schema`, `widget-patterns-core`, `subscribe-patterns`, `property-editors`
3. `get_example({ plugin: "Customer.HelloWorld" })` (minimal) or `Customer.Coating` (full Best-Practice)
4. Load **all seven `common-mistakes-*` docs**: `setup`, `lifecycle`, `imports`, `ui`, `config`, `data`, `i18n` (split for token efficiency)
5. Generate all files: `extension.json`, `context/`, `widget/`, `action/`, `i18n/`, `README.md`
6. **Self-Audit** (visible chat output — do NOT skip):
   - **6a. Common-Mistakes walk-through** — for every numbered mistake in the seven files loaded above: ✅ avoided / ❌ found in `<file>` → fix / ⚪ N/A. Reference mistake numbers.
   - **6b. Hallucination check** — for each generated file, list every non-trivial import, POD2/UI5 API usage, REST endpoint, control property. For each, state the verification source (`[verified via sap-dm-pod2-mcp-server.get_api_doc({…})]`, `[verified via get_ui5_api({symbol:"…"})]`, `[verified in examples/…]`, or `[unverified — assumption]`). Every `[unverified]` must be resolved via MCP or surfaced explicitly.
7. Verify against Post-Scaffold Checklist (below)
8. Create `.scaffold-done` marker with current timestamp — switches future sessions to Iteration Mode
9. End with `Changed:` report and: *"First draft complete. Pack as ZIP, upload to SAP DM, place on a POD page, then come back for iteration."*

---

## 🔁 ITERATION MODE

The user has deployed the plugin and now describes what to refine (often with a screenshot).

- Reversible/additive change (category 1) → patch immediately, end with `Changed:` block.
- Ambiguous, rename/delete, non-additive `extension.json`, new architectural piece → category-2 halt.
- **Patch only what was asked.** Never regenerate untouched files. Preserve existing i18n keys, comments, custom logic.
- Never re-run the Scaffold sequence. Never call the `create_extension` prompt in iteration.
- Update `README.md` when functionality, file structure, configuration, or usage changes — it must reflect the current state.

---

## 🔧 MCP Servers — Quick Reference

**`sap-dm-pod2-mcp-server`** (HTTP, `http://localhost:3001/mcp` — or the deployed BTP endpoint) — 23 tools · 5 prompts · 6 resource URIs.

Call `get_pod2_guidelines` once at start — it returns the full tool catalog and workflows. Use `list_capabilities` if you need the overview again. Key tool groups: patterns (`get_pattern_doc`, `search_docs`), POD2 API (`get_api_doc`, `search_api_docs`), UI5 API (`get_ui5_api`, `search_ui5_api`, `list_ui5_libraries`), REST (`get_rest_api`, `search_rest_apis`), examples (`get_example`), MDO (`get_mdo_entity`), cross-search (`search_all`), validation (`validate_project`).

Prompts: `create_widget`, `create_action`, `create_extension` (reads `POD2_PLUGIN_TEMPLATE.md`), `migrate_widget`, `validate_project`. Invocation syntax is agent-specific — see the Agent-Specific Notes in `usage/README.md`.

> **`sapui5-mcp-server` is no longer needed** — UI5 API tools (`get_ui5_api`, `search_ui5_api`, `list_ui5_libraries`) are native in `sap-dm-pod2-mcp-server`, backed by a bundled offline JSON at `docu/ui5-api-specs/`. Remove `sapui5-mcp-server` from your MCP config if you had it registered.

---

## ⚡ Critical Rules (Top Mistakes)

> **Prime Directive (UI control choice)**: Before extending, compositing, or CSS-styling anything, name the standard SAPUI5 control that already does 80 % of it. Custom controls / hand-built CSS only after the 4-rung Escalation Ladder rules out every standard fit. Canonical: [`basics.md` §0](../docu/basics.md). Specialisations: M60, M61 (no plugin CSS), M70, and Cat 29 in `migration-suspect-list.md`.

1. **Namespaces must NOT start with `sap/`** — use `customer.custom.extension.<name>`
2. **Namespace = extension.json** (`modulePath`/`type`) — NOT the folder name
3. **Always `unsubscribe`** in `onExit()` (which must exist and call `super.onExit()`) — memory leaks otherwise
4. **PlacementType** from `"sap/m/PlacementType"` (NOT `sap/ui/core/library`)
5. **PodContext** from `"sap/dm/dme/pod2/context/PodContext"` (not `model/`)
6. **i18n**: always 4 locale files — `i18n.properties`, `i18n_de.properties`, `i18n_en.properties`, `i18n_en_US.properties`. In `i18n_de.properties` translate user-facing **SFC → PSN** (German SAP DM standard); code/keys keep `sfc`.
7. **Logger** instead of `console.log`
8. **Form layout**: prefer `sap/ui/layout/form/Form` + `FormContainer` + `FormElement` + `ResponsiveGridLayout`
9. **i18nCustomModel**: register in `widget.onInit()` via `getPodRuntime().getView().setModel(MyWidget.getI18nModel(), "i18n<WidgetShortName>")` — model name is `i18n` + PascalCase widget short name (e.g. `i18nCoating`). Multi-widget plugins register one model per widget (e.g. `i18nCoating` AND `i18nHelloWorld` side-by-side — no collision, mirrors the M32 per-widget key prefix).
10. **Flat layout**: `extension.json`, `widget/`, `action/`, `context/`, `i18n/`, `README.md` go **directly in the working directory (= project root = ZIP root)**. NEVER wrap in a `<PluginName>/` or `<namespace>/` folder. `modulePath` is a logical UI5 module name, independent of physical location.
11. **Public-API-First — internal/app-router APIs need explicit confirmation**: Solve every requirement with the **public** SAP DM REST APIs first (`RestClient` + `ApiPaths`, the `*PublicApiClient`s, or `ApiClient.<domain>`). NEVER hard-wire an **internal / app-router** endpoint into plugin source — an execution host (`*.execution.*.web.dmc.cloud.sap`), a `~GUID~` path, or a `dmi/cdt` / `dim/destinations` prefix (this is the surface `sap-dm-api-mcp-server.call_internal_api` queries — a **discovery tool for the agent, not plugin code**). If no public API fits: say which you checked, then **ask for explicit confirmation** (category-2 halt) before writing an internal call. Exception: `ApiClient.internal.processengine.start(...)` is a documented framework API and is **allowed** — it is not an "internal API" in this sense.

---

## ✅ Post-Scaffold Checklist

- [ ] `extension.json` registers every widget/action with correct `modulePath` and `type`
- [ ] Flat layout verified (no wrapper folder)
- [ ] Every `subscribe()` has a matching `unsubscribe()` in `onExit()`; JSONModels initialized before controls; dialogs destroyed in `afterClose`
- [ ] All 4 i18n locale files present; `_de` translates SFC → PSN
- [ ] Self-Audit 6a and 6b performed and shown in chat; no `[unverified]` entries left silent
- [ ] `README.md` generated in example style
- [ ] `.scaffold-done` marker created

---

## Migration of an EXISTING Widget or HTML5 App

Two source formats are supported:

**A) Existing POD 2.0 widget** (3rd-party plugin, refactor to Best-Practice):
1. Place source into `./legacy/` (or similar)
2. Invoke the `migrate_widget` MCP prompt with `sourceDir: "./legacy"`, `sourceFormat: "pod2"` (invocation syntax → Agent-Specific Notes in `usage/README.md`)
3. The prompt enforces a strict phased workflow with **mandatory artifacts** (`MIGRATION_INVENTORY.md`, `MIGRATION_MAPPING.md`, `MIGRATION_VERIFICATION.md`) — see `migration-suspect-list.md` for the 29-category checklist (Cat 1-20 apply for pure POD 2.0 refactor; Cat 29 is the "custom composite where a standard SAPUI5 control exists" umbrella)

**B) HTML5 monitoring / dashboard app** (Chart.js / d3 / plotly / echarts + `fetch` + inline handlers):
1. Place source `.html` (+ optional `.css`/`.js`) into `./legacy/` (or similar)
2. Invoke `migrate_widget` with `sourceDir: "./legacy"`, `sourceFormat: "html5"`
3. The prompt additionally preloads `dashboard-patterns.md`, `chart-migration-map.md`, `fiori-design-compliance.md`, and `html5-migration-guide.md` as the target-shape reference. There is **no dedicated dashboard example plugin** — hand-built KPI-tile controls / composite widgets are the anti-pattern the standard-first bias exists to prevent; see M60 (no custom control for pure display) and M61 (no plugin CSS).
4. Categories 21-28 of the suspect list are the most important: chart libs → SAPUI5 charts, native `fetch` → `ODataV4Client`, module-level `let` → private fields, custom `<div>`-Gantt → `sap.gantt.GanttChart`, inline handlers → `attachPress`, emoji → `sap-icon://`, hard-coded locale → `DateFormat`, magic thresholds → widget properties
5. Phase 5 adds a **Residue Gate**: zero `fetch(`, `.toFixed(`, `setInterval` without stored handle, module-level `let`, `document.addEventListener`, `console.log`, emoji-as-icon, hard-coded locale allowed in the produced plugin

For both formats: after the inventory phase the agent posts the **Output Contract sentence** and STOPS — confirm before Phase 3. These phase gates take precedence over the generic Reasoning-First halt (§ Category 2).

> POD 1.0 migration is not yet supported — file a request if you need it.

---

_sap-dm-pod2-mcp-server v1.0.0 · CLAUDE.md v8.0 (single-file; agent-agnostic — Claude Code auto-loads; other agents "read CLAUDE.md")_
