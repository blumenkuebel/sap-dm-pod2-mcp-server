# Validate Project — Agent Instructions

> **Internal note**: this file is the **single source of truth** for the validation workflow used by both
> - the MCP **tool** `validate_project`
> - the MCP **prompt** `validate_project`
>
> Both surfaces load this file at runtime via `helpers.readFileContent()`.
> Edit this file to update the validation logic — no rebuild needed for content changes.
>
> **Tool vs. prompt (intentional divergence — do NOT "fix" the tool to return the whole file):**
> the **tool** returns only the `## Orchestration Index` section (sliced via `extractSection`) because
> an oversized tool result is truncated by the host to a small preview — the agent then loads each
> phase on demand. The **prompt** returns this whole file (prompt content expands into the
> conversation and is not truncated).

---

Validate the POD 2.0 extension in the **current working directory** against the latest pod2-mcp-server standards.

Scope is **always full** — every applicable rule must be checked.

> **Prerequisites — load before Phase 0:**
> The meta-rules from `get_pod2_guidelines` (**Source-or-Silence** and **Reasoning-First**) apply to
> this entire workflow. Call `get_pod2_guidelines` first if you haven't already done so this session.

---

## Orchestration Index

> **READ THIS ENTIRE INDEX FIRST — then execute the phases in order.**
> This is all you get from the `validate_project` **tool**. The per-phase detail is NOT in this
> result; load each phase on demand with `get_pattern_doc` (see the table). Do not improvise a phase
> you have not loaded — if a phase's detail is not in your context yet, load it before acting on it.

**How to load a phase.** Call:

```
get_pattern_doc({ name: "validate-project-instructions", section: "<Phase string>" })
```

Use the **exact** `section` strings from the table below. `section` matching returns one heading
block only, so `Phase 3b`, `Phase 3c`, `Phase 3d` are **separate** loads from `Phase 3` — load each
one you need; do not assume `Phase 3` includes them.

**Report filename (surfaced here so it is never missed).**
Write findings to a **new** file at working-directory root named:

```
VALIDATION-REPORT_{ProjectName}_{YYYYMMDD-HHMM}.md
```

- `{ProjectName}` — PascalCase short name: the widget class name with the `Widget` suffix dropped
  (e.g. `CoatingWidget` → `Coating`); if no widget, the first action class name; else the working
  directory name.
- `{YYYYMMDD-HHMM}` — the UTC date+time you capture in **Phase 0 step 1** by running
  `date -u +%Y%m%d-%H%M`. **Run the command and use its exact output — never estimate or round the
  time.** E.g. if the command prints `20270303-0905`, the file is `…_20270303-0905.md`.
- Example shape (placeholder digits, not a value to copy): `VALIDATION-REPORT_Coating_YYYYMMDD-HHMM.md`.
  (Full header/section templates: Phase 5.)

**Prior-report guardrail (do this in Phase 0, before any analysis).**
If one or more `VALIDATION-REPORT_*.md` already exist in the working directory, **read the most
recent one first** and decide whether a fresh run is warranted (e.g. source changed since it was
written). **Always write a NEW timestamped file — never overwrite** an existing report, and never
write a bare `VALIDATION-REPORT.md`.

**Phase map.**

| `section` to load | Scope |
|---|---|
| `Phase 0` | Discovery — confirm it is a POD 2.0 extension; prior-report check; identify structure. |
| `Phase 1` | Load the MCP knowledge base (guidelines, all `common-mistakes-*`, basics, REST/API lists, reference example). |
| `Phase 2` | Read the extension source (full text of every relevant file). |
| `Phase 3` | Common-mistakes audit — the audit-trigger list by severity; greps + fixes come from the `common-mistakes-*` docs loaded in Phase 1. |
| `Phase 3b` | Best-practice pattern audit (structural comparison against reference examples). |
| `Phase 3c` | User customizations & severity mapping (respect intentional deviations / markers). |
| `Phase 3d` | Architectural conformance gate (interceptor / rogue-automation). |
| `Phase 4` | API-versions audit (REST v1/v2/v3, POD2 Public/Internal, MDO/OData, ModelPath↔PodContext). |
| `Phase 5` | Write `VALIDATION-REPORT.md` — verbatim header, disclaimer, summary, finding format, section order. |
| `Phase 6` | Chat summary. |

> **Prerequisite for every phase:** the meta-rules from `get_pod2_guidelines`
> (**Source-or-Silence**, **Reasoning-First**) apply throughout. Call `get_pod2_guidelines` first if
> you have not already this session. Scope is **always full** — every applicable rule is checked.
> Abort conditions: no `extension.json` → abort; invalid JSON → single-error report.

---

## Phase 0 — Discovery

1. **Capture the report timestamp — run this command now and keep the exact output:**
   ```
   date -u +%Y%m%d-%H%M
   ```
   This single value (e.g. the command prints `20270303-0905`) is the report's `{YYYYMMDD-HHMM}`. Use it
   **verbatim** in the filename (Phase 5) and derive the header's `{YYYY-MM-DD HH:MM}` from the **same**
   output — do NOT estimate, round, or reuse a session start time. If you cannot run a shell command,
   obtain the current UTC time some other concrete way; never type a guessed time.
2. **Verify it is a POD 2.0 extension project**: `extension.json` MUST exist in the working directory root. If not, abort with a clear error message.
3. List the project tree (skip `node_modules/`, `.git/`, `dist/`, `.scaffold-done`, `VALIDATION-REPORT.md`).
4. **Prior-report check** (see the Orchestration Index guardrail): if any `VALIDATION-REPORT_*.md` already exists, read the most recent one first and decide whether a fresh run is warranted; always write a NEW file with the timestamp from step 1 — never overwrite.
5. Identify the extension structure:
   - `extension.json`
   - `widget/*.js` (zero or one widget)
   - `action/*.js` (zero or more actions)
   - `context/*.js` (zero or one context singleton)
   - `util/*.js` (helpers)
   - `i18n/i18n*.properties` (4 expected: default, _de, _en, _en_US)
   - `README.md`, `POD2_EXTENSION_EXAMPLE.md` (optional)

## Phase 1 — Load MCP Knowledge Base

Call these MCP tools in order:

1. `get_pod2_guidelines` — load the canonical rules
2. Load common mistakes by category (load all 7 — each is 100-1400 lines, much cheaper than the old monolith). **Load the full file for each category — the range hints below are a rough guide, not an exhaustive inventory; new mistakes are added continuously up to #70 (with intentional gaps).**
   - `get_pattern_doc({ name: "common-mistakes-setup" })` — Setup / extension.json / namespace (#0, #1, #1B, #2, #15, #16, …)
   - `get_pattern_doc({ name: "common-mistakes-lifecycle" })` — Lifecycle / subscribe / dialogs / base classes / `_createView` (#3–#5, #14, #19, #33, #35, #39, #50, #65, #66, #75, #76, …)
   - `get_pattern_doc({ name: "common-mistakes-imports" })` — Imports / module paths / defensive coding / global-patching (#6–#9, #11, #36–#38, #41, #57, #71, #78, …)
   - `get_pattern_doc({ name: "common-mistakes-ui" })` — UI / bindings / control choice / M60/M61/M70 umbrellas / DOM-UI (#10, #12–#13, #17, #20, #28, #31, #42–#43, #52–#64, #70, #77, …)
   - `get_pattern_doc({ name: "common-mistakes-config" })` — Configuration / properties / i18n metadata (#18, #21–#22, #25–#26, #32, …)
   - `get_pattern_doc({ name: "common-mistakes-data" })` — Data / OData / models / PodContext-vs-model / manual-fetch (#23–#24, #27, #29, #34, #51, #72, #73, #74, …)
   - `get_pattern_doc({ name: "common-mistakes-i18n" })` — i18n (#30, #40, …)
3. `get_pattern_doc({ name: "basics" })` — architecture & best practices
4. `get_pattern_doc({ name: "extension-json-schema" })` — extension.json contract
5. `get_pattern_doc({ name: "subscribe-patterns" })` — PodContext subscribe/unsubscribe lifecycle
6. `get_pattern_doc({ name: "basics", section: "0. Namespace Cheatsheet" })` — namespace conventions + upload namespace
7. `get_pattern_doc({ name: "deprecated-imports" })` — **exhaustive** deprecated enum list for M36 detection
8. `list_rest_apis` — current SAP DM REST API services with version info (v1/v2/v3)
9. `list_api_docs({ namespace: "sap.dm.dme.pod2.api", limit: 200 })` — current Public/Internal POD2 API surface
10. `get_example({ plugin: "Customer.Coating" })` — Best-Practice reference implementation (Ground Truth for Phase 3b)

## Phase 2 — Read Extension Source

Read every relevant file (full text):
- `extension.json`
- All `*.js` files
- All `*.properties` files
- `README.md` if present

## Phase 3 — Common Mistakes Audit (every applicable rule)

**Every applicable rule must be checked** — scope is always full. This phase is the **audit trigger
list**: which mistake codes to check, grouped by severity. The **detection grep + before→after fix
for each code lives in the `common-mistakes-*` category docs you already loaded in Phase 1** (and, for
the `HTML5-*` residue codes, in `html5-migration-guide.md`). Do not duplicate or re-derive the greps
here — open the cited doc for the code you are checking. The category routing is:

- **setup / extension.json / namespace** → `common-mistakes-setup.md`
- **lifecycle / subscribe / dialogs / base classes / `_createView`** → `common-mistakes-lifecycle.md`
- **imports / module paths / defensive coding / global-patching** → `common-mistakes-imports.md`
- **UI / bindings / control choice / DOM-UI** → `common-mistakes-ui.md`
- **configuration / properties / i18n metadata** → `common-mistakes-config.md`
- **data / OData / models / PodContext-vs-model / manual-fetch** → `common-mistakes-data.md`
- **i18n** → `common-mistakes-i18n.md`

For each finding, cite the doc reference + the source line. Group findings by severity exactly as
below.

### Classification Criteria

Use these test-questions to assign or verify every finding's severity:

- **❌ Error** — at least one is true: (1) extension load fails (404 / ModuleError); (2) throws an
  exception at normal runtime use; (3) core feature is 100 % non-operative (not "only sometimes");
  (4) breaks the POD framework contract in a way that is never acceptable (wrong lifecycle, wrong ID
  ownership, wrong aggregation type); (5) structurally broken — no runtime exception but the feature
  always produces wrong results.
- **⚠️ Warning** — works in the happy path, but: fails only in certain locales / tenants /
  environments; causes gradual degradation (memory leak, stale state); is deprecated and will break
  in a future SAP DM or SAPUI5 version; is fragile in production but passes in dev; raises risk
  without being directly faulty.
- **ℹ️ Info** — code is correct and will stay correct; improvement is for maintainability or style
  only.

### Errors (must-fix — these are broken in current SAP DM)

Check each of these codes (load the cited category doc for the grep + fix). Severity notes that
differ from the default are called out inline:

- **M0 / M15** — extension.json placement & layout (root = ZIP root; no `webapp/` or namespace wrapper).
- **M2** — extension.json schema (required per entry: `modulePath` + `type`; optional widget metadata: `name`, `description`, `supportsProductionProcess`).
- **M3** — `PodContext` / `ModelPath` import path (`sap/dm/dme/pod2/context/*`, not legacy `…/model/*`).
- **M5** — subscribe callback parameter order must be `(newValue, path)`.
- **M6** — `_createView()` returns the root control with `oConfig.id` as **positional first** arg.
- **M14** — JSONModel initialised inside `_createView()` before bound controls are built.
- **M21** — top-level container must be `CustomPanel`, not plain `sap.m.Panel`.
- **M29** — SFC status compared as **string** (`=== "401"`), never a number.
- **M31** — control ID must be the **first positional** constructor arg (no `setId`, no `{id:…}`).
- **M32** — widget metadata i18n trio uses the **named `<widgetName>.` prefix** (NOT the legacy
  `widget.` prefix, NOT unprefixed). A correct camelCase `<widgetName>.` prefix is **not a finding**;
  flag only legacy/unprefixed keys or a widget/bundle key mismatch. (`common-mistakes-config.md`)
- **M41** — base/abstract UI5 classes (`Item`, `Icon`, `ListItem`, `Element`, `Control`, `Fragment`,
  `HTML`) import from `sap/ui/core/*`, not `sap/m/*` (else runtime 404 at extension load).
- **M42** — custom `.extend()` control without a `renderer` key → runtime 404; add the renderer.
- **M43** — native numeric value passed to a UI5 `float`/`int` property (not a string).
- **M64** — `sap.m.MessageStrip.link` aggregates `sap.m.Link`, not `sap.m.Button`.
- **M65** — `_createView()` takes **no** args; read config via `this.getConfig()`.
- **M71** — correct notification-subscribe keys (`onMessage`, `EventType.*`) and `Logger.warn` (no
  `.warning()`). (`common-mistakes-imports.md`)
- **M33** — BusyIndicator: exactly two allowed patterns (Widget `oView.setBusy`, Action
  `BusyIndicator.show/hide`); anything else is an Error. (`common-mistakes-lifecycle.md`)
- **M70** — silent information loss via standard-control bias (applies only when
  `sourceFormat === "html5"`; checks `MIGRATION_MAPPING.md` / `MIGRATION_VERIFICATION.md` coverage).
  ⚠️ Warning-grade exception — checked here because it only applies to html5-origin code; NOT
  auto-fixable. (`common-mistakes-ui.md`)
- **M37** — tagged-template literal used with `getI18nText()`; dynamic expressions silently
  collapse to the literal `"[object Object]"`. (`common-mistakes-imports.md`)
- **M51** — `ModelPath.SelectedPlant` is referenced but does not exist; causes "Model path is
  required" exception at subscribe time. (`common-mistakes-data.md`)
- **M53** — MicroChart color value uses wrong enum class (e.g. `BulletMicroChartColor.Good`
  instead of `ValueColor.Good`); runtime parser rejection at render. (`common-mistakes-ui.md`)
- **M54** — `LineMicroChartPoint` constructed with unknown property (e.g. `emphasized` or `color`
  on a type that does not support them); runtime "unknown setting" error. (`common-mistakes-ui.md`)
- **M55** — list-binding template conflict: a named template object and an anonymous template used
  together; runtime assertion "single template object" at render. (`common-mistakes-ui.md`)

> **M66** (binding-referenced instance initialised in `onInit()` — ⚠️ Warning) and **M72** (internal /
> app-router API hard-wired into extension source — ⚠️ Warning) are lower-severity but checked here;
> see `common-mistakes-lifecycle.md` / `common-mistakes-data.md`.
>
> **M73–M81 (Architectural conformance — interceptor / rogue-automation)** are hard Errors and feed the
> **Phase 3d gate** (≥3 distinct fire → `❌ NOT CONFORMANT`). These are **nine distinct checks** in two
> clusters — load their canonical entries for the greps + fixes and scan `widget/ action/ context/ util/`
> **plus any non-standard source folder**:
> - *self-level abuse* — **M73** manual `fetch`/`XMLHttpRequest`, **M74** shared context (plant/SFC/order)
>   read from a model path vs `PodContext`, **M75** control lookup/timers in `_createView()` vs `onInit()`,
>   **M76** fixed timeouts/polling vs an awaited signal, **M77** hand-built DOM UI vs standard controls,
>   **M78** monkey-patching global `XMLHttpRequest`/`fetch`/`firePress`.
> - *foreign-widget abuse* — **M79** discovering, **M80** mutating, **M81** firing synthetic events at
>   another widget's controls.
>
> (`common-mistakes-{data,lifecycle,imports,ui}.md`.) **M74 also feeds the Phase 4d audit** — a widget
> that uses shared context but makes zero `PodContext.*` calls is an M74 finding, not "✅ no findings".
> None of M73–M81 downgrade under `validate: info-only` (see Phase 3c).

### Warnings (should-fix — works but legacy / risky)

Check each code (grep + fix in the cited category doc):

- **M1** — every `PodContext.subscribe` has a matching `unsubscribe` in `onExit()` (same callback ref).
- **M4** — no 3rd default arg on `StringPropertyEditor` (defaults belong in `getDefaultConfig()`).
- **M7** — `PlacementType` from `sap/m/PlacementType`, not `sap/ui/core/library`.
- **M8** — every `ModelPath.X` exists (flag non-existent like `SelectedWorkListItem` singular, `SelectedSfc`).
- **M9** — no `this.getResourceBundle()` on Widget (use `getI18nText()` / manual `ResourceBundle`).
- **M10** — control settings use `.addStyleClass(...)`, not `class: "…"`.
- **M11** — no `jQuery.sap.includeScript` / `<script>` AMD bypass.
- **M13** — trivial equality in a `formatter:` → prefer expression binding `{= … }`.
- **M16** — no hard-coded `"No data"`; use state-aware text.
- **M18** — GrowingJSONModel increments its page counter per fetch.
- **M19** — `new Dialog(`/`new PodDialog(` destroyed in `afterClose`.
- **M20** — TableWidget dynamic columns/cells spliced at the same index.
- **M22** — 3+ `subscribe` calls with one callback → array form.
- **M23** — `setBusy(true)` always paired with `setBusy(false)` in a `finally`.
- **M24** — expected error codes handled specifically, not via a generic error display.
- **M26** — non-Table properties not placed in `EXCLUDE_PROPERTIES` vs `IGNORE_TABLE_PROPERTIES`.
- **M27** — TableWidget subscribing to `SelectedWorkListItems` syncs selections (initial + on change).
- **M28** — multi-part binding formatters null-check each part.
- **M30** — German i18n values use `PSN` for user-facing `SFC`; `PSN` absent from en bundles. Code ids stay `sfc`.
- **M34** — locale-aware number parse/format for **user input** (`Input.getValue()`), not `parseFloat`/`toString`.
  NOT a finding on dot-formatted backend JSON values. (`common-mistakes-data.md` / Coating reference)
- **M36** — deprecated SAPUI5 pseudo-module enum imports → **MUST load**
  `get_pattern_doc({ name: "deprecated-imports" })` (the exhaustive list + exact greps) and run those
  greps verbatim; do not guess. Fix = destructure the enum from `sap/m/library` / `sap/ui/core/library`.
- **M38** — DOM element IDs or class names assembled from concatenated `this.oPluginId` / controller
  string in a global `document.getElementById`-style lookup; fragile across multi-tenant deployments.
  (`common-mistakes-imports.md`)
- **M56** — `FlexAlignItems.FlexStart` / `FlexJustifyContent.FlexStart` used instead of
  `FlexAlignItems.Start` / `FlexJustifyContent.Start`; currently silently ignored but marked
  `[FUTURE FATAL]` — will throw in an upcoming SAPUI5 version. (`common-mistakes-ui.md`)
- **M62** — pre-formatted display strings (e.g. `"5 PC"`) stored in OData model and passed directly
  to a UI5 `float`/`int` property; correct per M43 check only incidentally (the model value is a
  string), but blocks downstream numeric processing. (`common-mistakes-ui.md`)
- **M84** — mutable instance state on public `this._x` fields vs true-private `#` fields. Report **once,
  at class level** (fires on the pattern at scale, ~15+ `this._x` with near-zero `#`); NOT in the Phase 3d
  gate. (`common-mistakes-lifecycle.md` #M84)

### Info (consider — modernization)

- **M25** — `MessageHistory.toast()` for important persistent messages → suggest `showSuccess`/`showError`.
- Spreading parent properties in `getDefaultConfig()`: never for Widget/ControlWidget; required for
  TableWidget/LayoutWidget.

### HTML5 Residue (Errors + Warnings — critical for plugins produced by `sourceFormat: "html5"` migrations)

These indicate the migration agent left HTML5-origin idioms in the produced extension. They correspond
**1:1 to the `migrate_widget` Phase 5b Residue Gate** — a validator run on a shipped extension should
produce zero of these. Detection greps + fixes live in `html5-migration-guide.md` (section numbers below)
and the `common-mistakes-*` docs; the `(Cat NN)` tag is the migration-guide category.

**Errors** (block sign-off):

- **HTML5-CHART** — Chart.js / d3 / plotly / echarts / apexcharts in shipped code (Cat 21) →
  re-implement per `chart-migration-map.md` (VizFrame / microcharts / GanttChart).
- **HTML5-FETCH** — native `fetch` / `XMLHttpRequest` / `$.ajax` / `axios` in shipped code (Cat 22) →
  `ODataV4Client` / `ApiClient.<ns>.<method>` (`html5-migration-guide.md` §1). Migration-residue sibling
  of **M73** — cross-reference, don't double-report the fix.
- **HTML5-INLINE-HANDLER** — inline `onclick=`/`onchange=` / `document.addEventListener` (Cat 25) →
  `attachPress`/`attachChange` (`html5-migration-guide.md` §4).
- **HTML5-CHART-SCRIPT-TAG** — chart-lib `<script>` tag or `import chart.js` → blocks POD Designer
  preview & CSP; hard fail.

**Warnings** (should-fix — likely correctness or UX bug):

- **HTML5-TOFIXED** — `.toFixed(N)` for numeric display (Cat 3 / M34) → `NumberFormat.getFloatInstance`.
- **HTML5-MODULE-STATE** — module-level `let`/`var` mutable state outside the class body (Cat 23 / B4) →
  private `#` fields or Context singleton properties.
- **HTML5-EMOJI-ICON** — emoji glyphs as icons in JS strings (Cat 26) → `sap-icon://…` + `IconColor` +
  `tooltip` (`html5-migration-guide.md` §7).
- **HTML5-LOCALE-LITERAL** — hard-coded locale literal (`'de-DE'`, `'en-US'`, …) in JS (Cat 27) →
  `DateFormat` with locale from `Configuration.getLanguage()`.
- **HTML5-TIMER-HANDLE** — `setInterval` without a stored handle (Cat 20 / B9) → store `#nIntervalId` +
  `clearInterval` in `onExit()`.
- **HTML5-TIMER-CLEANUP** — `setInterval` without `clearInterval` in the same file (Cat 20) → clear in
  `onExit()`.
- **HTML5-MAGIC-THRESHOLD** — ternary threshold chains with 3+ literal numbers (Cat 28) → widget
  properties via `getConfigProperties()` (`property-editors.md`).

Report structure: in the report, add a new section **"§1c. HTML5 Residue"** (between "§1b. Best-Practice
Pattern Compliance" and "§2. REST API Versions"). Always emit the section — if empty, write
`— no findings —` so downstream reviewers get a stable signal that the check ran.

---

## Phase 3b — Best-Practice Pattern Audit (structural comparison against reference examples)

This phase compares the extension's **architecture and code patterns** against the Best-Practice standard defined in `docu/basics.md`, `docu/widget-patterns-core.md`, and the production-grade reference example `Customer.Coating`.

### Load reference material

1. `get_pattern_doc({ name: "basics" })` — if not already loaded in Phase 1
2. `get_example({ plugin: "Customer.Coating" })` — load the full reference implementation as Ground Truth

### Structural checks (compare extension structure ↔ reference)

For each component type present in the extension, verify it follows the Best-Practice pattern:

#### Widget (if present)

| Check | Expected (from Coating reference) | Severity |
|---|---|---|
| ES6 class with `sap.ui.define` | `class <Name>Widget extends Widget { ... }` OR `extends <FrameworkWidget>` (e.g. `WorkListTableWidget`) | ❌ Error if missing |
| Static `#oI18nModel` field | `static #oI18nModel = new I18nResourceModel({ bundleName: "..." })` | ❌ Error |
| Static accessor set | `getI18nModel()`, `getDisplayName()`, `getIcon()`, `getCategory()`, `getDescription()` — all present | ❌ Error if any missing |
| `onInit()` registers i18nCustomModel | `setModel(...)` with name `"i18n<WidgetShortName>"` (e.g. `i18nCoating`, `i18nHelloWorld`). Multi-widget plugins register ONE model per widget (e.g. `i18nCoating` AND `i18nHelloWorld` side-by-side) — NOT a finding. Flag ONLY: missing `setModel`, or a generic `"i18n"` / other non-canonical name. | ⚠️ Warning (M35) — only for the flag cases |
| `_createView()` with `oConfig.id` positional | Root control gets `new <Control>(oConfig.id, { ... })` | ❌ Error (M6/M31) |
| `onExit()` with `super.onExit()` | Present and calls super | ⚠️ Warning if missing |
| PodContext subscribe/unsubscribe parity | Count subscribes == count unsubscribes in `onExit()` | ⚠️ Warning |
| No `console.log` — uses Logger or `sap/base/Log` | grep for `console.log` / `console.error` | ⚠️ Warning |
| Form layout uses Form/FormContainer/FormElement/ResponsiveGridLayout (if forms exist) | Not using raw VBox for form-like inputs | ℹ️ Info |
| Backend/API calls in widget | ✅ **ALLOWED** — Widgets MAY fetch data at runtime (e.g. `ApiClient`, `RestClient`, `fetch()`). The Coating example happens to not do this, but it is **NOT a pattern violation**. Only flag if the call clearly belongs in an Action (user-triggered business logic like Start/Complete/Serialize). Data retrieval for display purposes is legitimate widget behavior. | — (not a finding) |

#### Action(s) (if present)

| Check | Expected (from Coating Validation/Execution reference) | Severity |
|---|---|---|
| ES6 class with `sap.ui.define` | `class <Name>Action extends Action { ... }` | ❌ Error |
| Static `#oI18nModel` + `getI18nModel()` + `getDisplayName()` + `getDescription()` | All four present | ❌ Error if any missing |
| `execute(oActionContext)` method | Present, either sync or async | ❌ Error |
| Validation Action throws Error on failure | `throw new Error(this.getI18nText("..."))` pattern | ⚠️ Warning if validation action never throws |
| Execution Action uses try/catch | Wraps API calls with proper error handling | ⚠️ Warning |
| Uses Context singleton for data sharing (if Widget+Action present) | Imports and uses `<Name>Context` for cross-component state | ℹ️ Info |

#### Context singleton (if present)

| Check | Expected (from Coating reference) | Severity |
|---|---|---|
| Static class (no `new`, no constructor instance) | All methods are `static` | ⚠️ Warning |
| Frozen UI element IDs and message keys | `static #uiElements = Object.freeze({...})` or `static #msg = Object.freeze({...})` | ℹ️ Info |
| Typed PodContext wrappers | Uses `PodContext.getCustomProperty()` / `setCustomProperty()` with explicit path constants | ℹ️ Info |

#### i18n bundles

| Check | Expected | Severity |
|---|---|---|
| 4 locale files present | `i18n.properties`, `i18n_de.properties`, `i18n_en.properties`, `i18n_en_US.properties` | ❌ Error if <4 |
| Widget metadata trio: `<widgetName>.displayName`, `<widgetName>.description`, `<widgetName>.category` | Camelcase per-widget prefix (e.g. `coating.*`, `helloWorld.*`) in ALL 4 bundles. Multi-widget plugins have one trio per widget — NOT a finding. Flag ONLY: literal `widget.` prefix, or unprefixed `displayName=` | ❌ Error (M32) — only for the flag cases |
| Action metadata uses action prefix | `validationAction.displayName=...`, `executionAction.displayName=...` | ⚠️ Warning if unprefixed |
| German bundle: no user-facing "SFC" | Should use "PSN" | ⚠️ Warning (M30) |
| Key consistency across locales | Same key set in all 4 bundles (no keys missing in one locale) | ⚠️ Warning |
| **Hardcoded user-facing strings vs i18n** | Every operator-visible string comes from `getI18nText(...)` — NOT a literal in `text:`/`setText(...)`/`setTooltip(...)`/`MessageBox.*`/`MessageToast.show(...)`. See the systemic-i18n sweep below. | ⚠️ Warning (systemic → escalate — see below) |

**Systemic i18n sweep (promote from note to finding).** The common "it works, it's just English" case hides a real defect: the German operator sees English, and the fix is not one line. Run a concrete sweep, not a vibe check:

1. **Hardcoded user-facing string inventory**:
   ```
   grep -rnE 'text:\s*"[^"]|setText\(\s*"[^"]|setTooltip\(\s*"[^"]|placeholder:\s*"[^"]|MessageToast\.show\(\s*"|MessageBox\.(warning|error|confirm|information|success)\(\s*"' widget/ action/ context/ util/ plugin/
   ```
   Exclude obvious non-UI literals (CSS, icon URIs `sap-icon://…`, model paths). Each remaining hit is a user-facing string that is not translatable.
2. **Unused-bundle-key cross-check**: for every key in `i18n.properties`, `grep` the JS for `getI18nText("<key>"`. Keys defined in the bundle but never read (while the JS hardcodes the same text as a literal) are the tell-tale of "someone added keys, then bypassed them".
3. **Severity escalation**: a handful of stray literals → ⚠️ Warning, listed. But when the sweep shows the **widget is systemically English-hardcoded** — most user-facing strings are literals AND/OR bundle keys exist but are unused AND/OR fewer than the 4 required locale bundles are present — report it as a **single consolidated ❌ Error-grade i18n finding** ("i18n is not wired: N user-facing literals, M unused bundle keys, K/4 locale bundles"), because the widget cannot be operated in a non-English plant. Cross-reference M30/M32/M35; do not quote a count in any doc text (report counts live in `VALIDATION-REPORT.md`, which is generated per-run, not in the instructions).

#### extension.json

| Check | Expected | Severity |
|---|---|---|
| Widget entries: required `modulePath` + `type`; allowed optional: `name`, `description`, `supportsProductionProcess` | No other extra fields | ❌ Error (M2) |
| Every `modulePath` has matching physical file | `widget/<X>.js` / `action/<Y>.js` must exist at those relative paths | ❌ Error |
| `modulePath` uses slashes, `type` uses dots — both consistent | Same base path, just `/` vs `.` | ❌ Error |
| Namespace convention: `customer.custom.extension.<name>` or `customer/custom/extension/<name>` | NOT starting with `sap.` or `sap/` | ❌ Error |

#### README.md

| Check | Expected (compare against Coating README via `get_example`) | Severity |
|---|---|---|
| README.md exists | At project root | ⚠️ Warning if missing |
| Contains at minimum: Title, Description, Components table, Project structure | Compare section headers | ℹ️ Info |

### How to report Best-Practice findings

Add findings to the same `VALIDATION-REPORT.md` under a new section **"§1b. Best-Practice Pattern Compliance"** (between §1 Common Mistakes and §2 REST API Versions), using the same format:
- File, line, found, expected, severity, auto-fixable flag.
- Reference `docu/basics.md` or `docu/widget-patterns-core.md` as the doc source.

---

## Phase 3c — User Customizations & Severity Mapping (RESPECT INTENTIONAL DEVIATIONS)

Not every deviation from the default Best-Practice is a bug. A user may **intentionally** use a non-standard control or pick a different pattern for good reasons. The validator **must respect** these decisions and never aggressively flag them as auto-fixable errors.

**Exception**: styling deviations (`sap/ui/core/HTML` with `<style>`, inline `style=`, extension CSS files, non-whitelisted `addStyleClass`) are NOT respected by Rule 2's auto-downgrade — see M61 umbrella. They require the explicit `// standard-only: exception — <reason>` marker documented below.

### How to detect intentional deviations

Apply these rules **before** finalizing the severity of any finding:

#### Rule 1 — Inline marker tags (highest precedence)

If the line that triggers a finding (or a comment block immediately above it, within ~10 lines) contains one of these markers, change the finding's behavior:

| Marker | Effect |
|---|---|
| `// validate: ignore — <reason>` | Drop the finding entirely. Do NOT report it. |
| `// validate: info-only — <reason>` | Report the finding but force severity to **ℹ️ Info** and `Auto-fixable: NO`. |
| `// validate: accepted-deviation — <reason>` | Same as `info-only`, but include the `<reason>` text verbatim as a "Notes" field in the report entry. |

The reason text after the em-dash is optional but strongly encouraged. Match the markers case-insensitively. They may also appear in `/* ... */` block comments.

> **These markers are proprietary to this validator — by design, not an oversight.** The `validate: …` family (and the `standard-only: exception — <reason>` marker for M60/M61/M43/M77/Cat 29) is specific to `pod2-mcp-server`. There is no `accepted-deviation` directive in ESLint or `@ui5/linter`. The *shape* is deliberately borrowed from them — a line comment with a trailing `— <reason>` / `-- <reason>` rationale (cf. ESLint `// eslint-disable-next-line <rule> -- <reason>`, `@ui5/linter` `// ui5lint-disable-next-line <rule> -- <reason>`) — but the verbs and the three-way severity model (`ignore` = drop, `info-only` = force Info, `accepted-deviation` = force Info **+ verbatim Notes**) have no external equivalent and are intentionally bespoke. Do not expect ESLint/ui5-linter disable comments to be honored here, and do not emit the `validate:`/`standard-only:` markers expecting any other tool to read them.

#### Rule 2 — Explanatory comment heuristic (auto-downgrade)

If a code-level finding (e.g. inline CSS, `class` instead of `addStyleClass`, an unusual control choice) is **directly preceded by a multi-line comment block** that:
- spans at least 2 lines, AND
- mentions a justification keyword: `because`, `intentional`, `customization`, `customer`, `design decision`, `do not change`, `keep as is`, `bewusst`, `absichtlich`, `weil`, `Kunde`, `customizing`, …

→ **Auto-downgrade** the finding from Error/Warning to **ℹ️ Info** and force `Auto-fixable: NO`.

Reasoning: a developer who took the time to write a multi-line "why" comment knew what they were doing. Don't second-guess them.

#### Rule 3 — What stays a hard finding regardless of markers

Some checks are about **broken** code, not preferences. These cannot be downgraded by markers:

- **M0 / M2 / M15 — extension.json structural validity** (broken upload)
- **M3 — wrong PodContext import path** (404 at runtime)
- **M5 — wrong subscribe callback parameter order** (TypeError)
- **M14 — model not initialized before bindings** (broken binding)
- **M29 — SFC status as number** (silent filter failure)
- **M31 — control ID via setId/property** (POD lifecycle assertion fails)
- **M41 — non-existent AMD module path** (`sap/m/Item`, `sap/m/Icon`, … — 404 at extension-load; whole widget never registers)
- **M42 — custom control `.extend()` without `renderer` in metadata** (`<Name>Renderer.js` 404 at extension-load)
- **M43 — String passed to UI5 numeric property** (`validateProperty` throws at first refresh — feature dead)
- **M60 — custom control class for pure display composition** (a template masquerading as a control — see M60)
- **M61 — extension CSS surface** (physical `widget/css/*.css` without loader / inline `style="..."` / `HTML` with `<style>` / non-Fiori-prefix `addStyleClass` or `class=`). Dead CSS specifically — a `.css` file with no `includeStyleSheet`/`createStyleSheet`/`IconPool.registerStyleSheet`/`css!` call — is treated as broken code because a real migration shipped ~200 LOC of never-loaded CSS.
- **Cat 29** — custom composite where a standard SAPUI5 control exists (S1-S7)
- API version Errors when the used version no longer exists in `list_rest_apis`
- **M73 — manual `fetch`/`XMLHttpRequest` to SAP DM endpoints** (bypasses POD auth/version/proxy — fragile across tenants/releases)
- **M74 — shared context read from a model path instead of `PodContext`** (reads another widget's internal model structure; empty/stale/wrong off the happy path)
- **M75 — control lookup / timers / event wiring from `_createView()`** (lifecycle contract break — runs before `onInit`, no symmetric teardown)
- **M76 — fixed timeouts / polling to coordinate async** (flaky-or-slow by construction where an awaitable signal exists)
- **M77 — hand-built DOM UI instead of standard controls** (same class as M60/M61 — downgradable ONLY by `standard-only: exception — <reason>`, see below, NOT by `info-only`)
- **M78 — monkey-patching global `XMLHttpRequest`/`fetch`/`firePress`** (mutates browser-wide state; corrupts other consumers; couples to standard internals)
- **M79 — discovering another widget's controls** (global registry / foreign generated IDs / identity-by-localized-text / private internals — non-contractual, breaks across releases and languages)
- **M80 — mutating another widget's controls/state** (`setVisible`/`setEnabled`/`setSelected`/`setValue`, force-enabling a disabled-by-validation control, `data()`-tagging foreign controls — desyncs the owner, bypasses its guards)
- **M81 — firing synthetic events / simulated DOM clicks at another widget's controls** (`fire*`, `getDomRef().click()` — counterfeit input that bypasses the real operation entry point)

For these, the marker `validate: ignore` is still respected (user takes the risk explicitly), but `info-only` does NOT downgrade — the underlying code is genuinely broken/non-conformant in production. (M77, like M60/M61, is not downgraded by `info-only` at all — use the `standard-only: exception — <reason>` marker below.)

**M61 exception marker** — an intentional deviation from the CSS ban is expressed as:

```js
// standard-only: exception — <one-sentence reason, e.g. "trusted CMS HTML snippet, no standard control renders external HTML">
new HTML({ content: sTrustedCmsSnippet });
```

Rule 2's `validate: info-only` marker does NOT downgrade M61/M60/Cat 29 findings — use the explicit `standard-only: exception — <reason>` marker instead. The validator surfaces the reason text as a "Notes" row in `VALIDATION-REPORT.md`.

### Auto-fixable: strict definition

A finding is `Auto-fixable: YES` only when ALL of the following hold:

1. The fix is **textually mechanical** (regex/exact replacement, no semantic judgment needed).
2. The replacement has **a single canonical form** (no choice between alternatives).
3. **No marker** (`validate: …`) on or near the line.
4. **No multi-line explanatory comment** above the finding.
5. The check is from the "broken code" list above (Rule 3) OR a low-risk modernization (e.g. `displayName=` → `<widgetName>.displayName=`, `model/PodContext` → `context/PodContext`).

Anything else → `Auto-fixable: NO`. The user can still apply the fix manually based on the report.

### What user customizations typically look like

These are the kinds of patterns where the markers/heuristic protect intentional decisions:

| Pattern | Why a user might keep it |
|---|---|
| `sap/ui/core/HTML` with inline `<style>` | ❌ **Not allowed** — M61 umbrella. Requires `// standard-only: exception — <reason>` marker AND a spec-verified justification that no standard control (`sap.m.FormattedText`, `sap.m.Text`, `sap.m.Panel`, …) fits. Missing marker → M61 error, not downgradable. |
| Hard-coded color values (`#6a6d70`) in JS/XML | ❌ **Not allowed** — M61. Use `sap.m.ObjectStatus state=`, `sap.ui.core.IconColor`, or a CSS variable (`var(--sapPositiveColor)`) on a semantic control. |
| Custom event handlers in addition to PodContext | ✅ Domain-specific business logic that PodContext doesn't model |
| Direct `fetch()` to a non-DM service | ✅ Calling a non-SAP-DM backend (e.g. plant MES) |
| Polling intervals (`setInterval`) | ✅ Live monitoring where pull is the only option — but store the handle in a private field and clear in `onExit` (Cat 20 / M9) |
| `class:` in mSettings (instead of `.addStyleClass()`) | ❌ Almost never intentional — M10 real bug, do flag |
| `.addStyleClass("<extension-prefix>Foo")` — non-Fiori class name | ❌ **Not allowed** — M61 whitelist. Use `sapUi{Tiny,Small,Medium,Large}Margin*` utility classes or refactor to a semantic control. |
| `widget/css/*.css` file | ❌ **Not allowed by default** — M61. A CSS file without a documented stylesheet loader call (`includeStyleSheet` / `IconPool.registerStyleSheet` / `css!`) is dead code. Delete the file AND every `class="lm*"` attribute referencing it. |

### How to format respected deviations in the report

Under section §1 / §1b, use a sub-heading per finding type. For info-only findings:

```markdown
### ℹ️ Info

#### M-INLINE-CSS — Inline CSS in `widget/MyWidget.js:118`
- **Found:** `<span style="font-size:0.75rem;color:#6a6d70;...">`
- **Status:** ℹ️ Intentional — `validate: info-only` marker present
- **Notes:** "intentional UI customization — UI5 helper classes don't match required visual weight"
- **Auto-fixable:** NO (user customization)
```

Be transparent: still surface the finding so the user has visibility, but make it crystal-clear that no action is required and no auto-fix will touch it.

---

## Phase 3d — Architectural Conformance Gate

The M73–M81 findings (Phase 3) describe the same underlying failure from different angles: an extension
built **against** the POD framework rather than **with** it. Two clusters: **self-level abuse** — hand-rolled
requests (M73), model scraping (M74), lifecycle bypass (M75), timeout-driven coordination (M76), DOM-painted
UI (M77), global monkey-patching (M78); and **foreign-widget abuse** — discovering (M79), mutating (M80), and
firing synthetic events at (M81) *another widget's* controls. Individually each is an Error. **Together they
define a widget class** the report must name explicitly, so a functioning-but-rogue extension can never read
as a pass.

### Gate rule

Count how many **distinct** mistakes among `{ M73, M74, M75, M76, M77, M78, M79, M80, M81 }` produced at least one finding.

- **≥ 3 distinct** → the **Architectural Conformance Gate FAILS**. The extension is an
  **interceptor / rogue-automation** pattern, not a conformant POD2 widget.
- **1–2** → no gate line; the individual Errors stand on their own.

A gate failure is not auto-fixable and is **not** downgradable by any marker — it is a verdict about the
extension's architecture, not about one line. (`validate: ignore` on an individual Mn still removes that
Mn from the gate count; if that drops the count below 3, the gate no longer fires — the user has explicitly
accepted those risks.)

### What a gate failure emits

When the gate fails, this exact verdict line MUST appear in **two** places:

1. At the **top of the `VALIDATION-REPORT.md` Summary block** (above the counts table):

   ```
   ❌ ARCHITECTURAL CONFORMANCE: interceptor / rogue-automation pattern — not a conformant POD2 widget
      (M73–M81: <list the IDs that fired>). This extension drives/observes the standard POD UI, other
      widgets' controls, and browser globals instead of using PodContext, the API clients, the widget
      lifecycle, and standard controls. A green surface-level result does NOT make it ready.
      Re-architect per the cited mistakes before upload.
   ```

2. As the **first line of the Phase 6 chat summary**, before the verdict/counts.

When the gate fails, the Summary verdict is **❌ NOT CONFORMANT** (stronger than "NOT READY — N errors")
and the overall result can never be "READY", regardless of how many surface checks pass.

### Report placement

Add a short section **"§1d. Architectural Conformance Gate"** immediately after §1c, listing which of
M73–M81 fired (with file:line pointers back to the §1 entries) and the gate verdict (PASS / FAIL). Always
emit the section — if fewer than 3 fired, write `— gate PASSED (N of M73–M81 fired; threshold 3) —` so the
check is visibly present.

---

## Phase 4 — API Versions Audit (CRITICAL — explicit requirement)

### 4·0) Outbound data-access inventory (DO THIS FIRST — "None" is a claim you must earn)

Before the version/client checks below, build a **complete inventory of every outbound data access**, by ANY
mechanism — not just the `ApiClient`/`RestClient` ones. A raw `fetch`, a patched `XMLHttpRequest`, an OData
read, or a scraped resource-timing URL **is an API call**; the fact that it does not go through a typed client
does not make it "no API usage". Scan `widget/ action/ context/ util/` **plus any non-standard folder** (e.g.
`plugin/`):

```
grep -rnE '\bfetch\s*\(|XMLHttpRequest|\.responseText|\$\.ajax|axios\.|ODataV[24]Client|RestClient|ApiClient\.|performance\.getEntriesByType|\.open\s*\(\s*["'"'"'](GET|POST|PUT|PATCH|DELETE)' <scan-set>
```

For each hit record: **mechanism** (typed client / raw `fetch` / XHR / patched-global / OData / perf-timing),
**target** (service + entity/endpoint, even if only observed at runtime — e.g. the `NonConformanceCodes` OData
entity set, or a `.../log` POST), and **direction** (issued by this widget vs. observed/intercepted from another
component).

**Consistency gate — the §2/§3/§4 sections and the Phase 6 summary MUST NOT report "None / no API calls / PodContext not used" if this inventory is non-empty.** If outbound access exists but none of it goes through a typed client, that is NOT "None" — it is the **M73 / M74 / M78 finding itself**, and §2/§3 must say so explicitly, e.g.:

> "REST/POD2 API findings: the widget performs outbound data access via raw `fetch`/patched `XMLHttpRequest` (see §1 M73/M78) instead of `ApiClient`/`RestClient` — there is no versioned-client call to audit **because the extension bypasses the client layer**. This is a finding, not a clean bill."

Only when the inventory is genuinely empty (no outbound access of any kind) may a section read "None".

### 4a) SAP DM REST APIs (v1 / v2 / v3)

1. Scan extension code for any of these patterns:
   - URL strings: `/dm/<service>/v1/...`, `/dm/<service>/v2/...`, `/dm/<service>/v3/...`
   - `ApiClient.rest.<service>.<method>` (or any `RestClient` usage)
   - Plain `fetch("...")` / `XMLHttpRequest` to SAP DM URLs (including URLs assembled at runtime or observed via interception — carry these over from the 4·0 inventory; a call whose version cannot be extracted is still reported as "un-versioned raw call → M73", never dropped)
2. Build a set of (service, version-used) tuples.
3. Cross-check against `list_rest_apis`. For each service:
   - **Highest version available in specs > version used by extension** → ⚠️ **Warning** "Upgrade recommended: vX → vY"
   - **Only newer version exists in specs (legacy version no longer documented)** → ❌ **Error** "Used version no longer documented — likely deprecated"
   - **Used version matches latest** → ✅ Info "Up-to-date"
4. For each used endpoint, optionally call `get_rest_api({ serviceName, summary: true })` and verify endpoint path/fields/response shape.

Reference table (always re-confirm via `list_rest_apis`):
- batch: v1+v2→prefer v2; inventory: v1+v2→prefer v2; order: v1+v2→prefer v2
- processlot: v1+v2→prefer v2; processorder: v1+v2→prefer v2; production: only v2→v1=ERROR
- qualityinspection: v1+v2→prefer v2; sfc: v1+v2→prefer v2; staging: v1+v2→prefer v2
- tool: v1+v2→prefer v2; plant_resource: only v2; plant_workcenter: v2+v3→prefer v3
- setpoint: only v3; document(sapfnd): only v2

### 4b) POD2 Public / Internal APIs

1. Find every `ApiClient.<ns>.<method>(...)` call.
2. `get_api_doc` for each class → verify method exists + signature + no `@deprecated`.
3. `ApiClient.internal.<...>` calls — decide severity by whether a **public alternative exists**:
   - **NOT a finding** when NO public alternative exists. Canonical case: `ApiClient.internal.processengine.start(...)` is the REQUIRED pattern for PPD execution (see `get_pod2_guidelines` Section 3, "Option 1: Production Process via ApiClient") and is used by every reference example (`Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView`, `Customer.Utils`). Do NOT flag as a warning. Other public-less internals fall in the same bucket (e.g. `internal.plant.isUserAssignedToWorkCenter`, `internal.oee.*`, `internal.qualityInspection.*`, `internal.workinstruction.*`).
   - **Flag as ⚠️ Warning** ONLY when a matching Public API exists — verify by checking `mcp-server/docu/pod2-api-specs/` for `sap.dm.dme.pod2.api.<ns>.<Ns>PublicApiClient.md` (e.g. `internal.sfc.getSfc` → public `SfcPublicApiClient.getSfc`). When a public equivalent is found, emit: `"Internal API — public alternative available at ApiClient.<ns>.<method>(...). Migrate."`
   - When in doubt (no `PublicApiClient` file for the namespace), default to NOT-a-finding — treat the Section 3 stance as precedent.

### 4c) MDO / OData

1. Find `ODataV2Client`/`ODataV4Client`, `/odata/v2/`/`/odata/v4/` URLs, MDO entity names.
2. OData V2 → ⚠️ Warning (legacy). MDO entities → cross-check `mdo-extractor-reference`.
3. **Raw OData access counts too.** An OData entity set queried via raw `fetch`/`XMLHttpRequest` with `$filter`/`$expand`/`$select` query options (e.g. a `.../NonConformanceCodes?$filter=…` GET assembled by hand) is OData usage — report the entity + that it bypasses `ODataV4Client` (M73), do not record it as "no OData usage". Carry these from the 4·0 inventory.

### 4d) ModelPath / PodContext consistency

1. Extract all `ModelPath.<X>` and `PodContext.<method>(...)`.
2. Cross-check `get_api_doc` for PodContext. Flag non-existent → ❌ Error. Deprecated → ⚠️ Warning.
3. **PodContext-avoidance check (M74) — absence is not conformance.** If the extension consumes shared
   context (any reference to SFC, plant, order, work center, or the current selection) but has **zero**
   `PodContext.*` calls — typically because it scrapes `getProperty("/workList/...")`, `"/plant/..."`,
   `"/filter/..."`, or borrows another widget's model via `someControl.getModel()` — do **not** report
   "✅ No findings". Report **M74** (❌ Error) and note that this §5 section is passing only because the
   widget bypasses PodContext entirely. Cross-link the §1 M74 entry.

---

## Phase 5 — Write `VALIDATION-REPORT.md`

**Filename:** `VALIDATION-REPORT_{ProjectName}_{YYYYMMDD-HHMM}.md`

- `{ProjectName}` — PascalCase short name of the extension: the widget class name (e.g. `CoatingWidget` → `Coating`), or if no widget is present, the first action class name. If neither is determinable, use the working directory name.
- `{YYYYMMDD-HHMM}` — **the exact value you captured in Phase 0 step 1** (`date -u +%Y%m%d-%H%M`). Do
  NOT recompute or estimate it here; reuse that one value so the filename and the 5a header agree.
- Example shape (placeholder — replace both the name and the digits): `VALIDATION-REPORT_{ProjectName}_YYYYMMDD-HHMM.md`

Create the file at working-directory root using the **exact structure and templates** below.
Every section must appear in order, even when empty (write `— no findings —`).

---

### 5a) Report header (verbatim structure, fill in the placeholders)

Replace `{YYYY-MM-DD HH:MM}` with the UTC time you captured in Phase 0 step 1 (same instant as the
filename — just reformatted with dashes and a space, e.g. `20270303-0905` → `2027-03-03 09:05`). Do not
recompute or estimate it. Also fill `{PluginDisplayName}`, `{namespace}`, `{modulePath}`.

```markdown
# VALIDATION REPORT — {PluginDisplayName}

**Generated:** {YYYY-MM-DD HH:MM} UTC  
**Validator:** pod2-mcp-server `validate_project`  
**Extension:** `{namespace}` ({modulePath of first widget or action})
```

---

### 5b) Disclaimer (immediately after header, before Summary — verbatim)

```markdown
---

> **Community Disclaimer** — This report was generated by **sap-dm-pod2-mcp-server**,
> an independent community project. It is **not an official SAP product**.
> The analysis is based on heuristic pattern matching and static code inspection.
> **No claim is made as to completeness or correctness.**
> Findings may be false positives; genuine issues may go undetected.
> Always validate against the official SAP documentation and test in your environment.
> This report does not constitute a certification, audit, or official SAP review.

---
```

---

### 5c) Summary

```markdown
## Summary

**Verdict:** {verdict — see verdicts below}

| Severity | Count |
|----------|-------|
| 🔴 Errors | {n} |
| ⚠️ Warnings | {n} |
| ℹ️ Info | {n} |

| Gate | Result |
|------|--------|
| Architectural Conformance | ✅ PASS / ❌ FAIL ({comma-separated Mx that fired}) |
| Auto-fixable items | {n} of {total findings} |
```

**Verdict strings (use exactly one):**

| Situation | Verdict line |
|---|---|
| Gate fails (≥ 3 of M73–M81) | `❌ NOT CONFORMANT — interceptor / rogue-automation pattern. Re-architect before upload.` |
| Errors present, gate passes | `❌ NOT READY — {n} error(s) must be fixed before upload.` |
| No errors, warnings present | `⚠️ REVIEW REQUIRED — {n} warning(s). No blocking errors.` |
| No errors, no warnings | `✅ READY — no blocking findings.` |

When the gate fails, also insert this block **above** the Summary heading (before the counts table):

```markdown
> ❌ **ARCHITECTURAL CONFORMANCE FAILED** — interceptor / rogue-automation pattern
> ({comma-separated Mx}: {one-line each}).
> A green surface-level result does NOT make it upload-ready. Re-architect per the cited mistakes.
```

---

### 5d) Finding format

Use this template for **every** finding in §1, §1b, §1c. Number errors sequentially per section
(`ERROR-1`, `ERROR-2`, … `WARN-1`, `WARN-2`, … `INFO-1`, …). Restart numbering in each section.

```markdown
### {icon} {TYPE}-{n} · {M-code} — {Short title}

**File:** `{relative/path/to/file.js}:{line}` {(+ additional locations if >1)}  
**Severity:** {Error (Hard) | Error (Auto-fixable) | Warning | Info}  
**Rule:** {doc name, e.g. `common-mistakes-lifecycle.md` #M80}

{One-paragraph description of what was found, with an inline code snippet showing the offending lines.}

**Why it's wrong:** {One or two sentences — the concrete runtime or architectural consequence.}

**Solution options:**
- {Option A — preferred approach}
- {Option B — if applicable}

**Auto-fixable:** {YES · `before → after` snippet / NO}
```

Icon mapping:

| Severity | Icon |
|---|---|
| Error (Hard) | 🔴 |
| Error (Auto-fixable) | 🔴 |
| Warning | ⚠️ |
| Info | ℹ️ |

For **info-only / accepted-deviation findings** (Rule 1 markers), add:

```markdown
**Status:** ℹ️ Intentional — `validate: info-only` / `accepted-deviation` marker present  
**Notes:** "{verbatim reason from marker}"
```

---

### 5e) Section order

Emit sections in this order. Always include every section header; write `— no findings —` when empty.

```
§1    Common Mistakes        (Errors first, then Warnings, then Info; M73–M81 belong here as Errors)
§1b   Best-Practice Pattern Compliance
§1c   HTML5 Residue
§1d   Architectural Conformance Gate   (always: PASS or FAIL + which of M73–M81 fired)
§2    REST API Versions                (table: service | used version | latest | status)
§3    POD2 API Usage                   (table: class | method | status)
§4    MDO / OData
§5    ModelPath / PodContext
§6    Auto-fixable Checklist           (checkbox list — one line per auto-fixable finding)
§7    Notes                            (open remarks, intentional deviations summary)
§8    References                       (table — see template below)
```

**§8 References template** — collect every doc, pattern, and rule that was cited anywhere in the report
and emit them as a single table. One row per distinct source. Sort by doc name, then by rule ID.

```markdown
## §8 References

| Source | Rule / Section | Cited for |
|--------|---------------|-----------|
| `common-mistakes-data.md` | #M73 | ERROR-1 — manual fetch to SAP DM endpoint |
| `common-mistakes-lifecycle.md` | #M79, #M80, #M81 | ERROR-2–4 — rogue-automation anti-patterns |
| `pod2-public-api-pattern.md` | §RestClient + ApiPaths | WARN-1 — correct REST client usage |
| `subscribe-patterns.md` | §PodContext.subscribe | WARN-2 — subscribe/unsubscribe lifecycle |
| `get_rest_api({ serviceName: "…" })` | — | §2 REST API version audit |
```

Rules: every `common-mistakes-*.md` rule cited in §1/§1b/§1c, every pattern doc referenced in
"Solution options", and every `get_rest_api` / `get_api_doc` call used in §2/§3 must appear here.
Merge multiple rules from the same file into one row (comma-separate the rule IDs).
If no external references were cited, write `— no external references —`.

---

**Gate-fail rule (unchanged):** When the gate fails, the verdict is **❌ NOT CONFORMANT** and MUST NOT
read "READY". M73–M81 findings are never auto-fixable.

**Cross-section consistency (MUST hold).** The report cannot contradict itself. If §1 carries an
M73/M74/M78 finding (raw fetch/XHR, model-scraping, or patched globals), then §2/§3/§4/§5 MUST NOT
say "None / no API calls / PodContext not used" — state that outbound access exists but bypasses the
client layer, and point back to the §1 finding. A reviewer must never read "None" in §2 while §1
documents a `fetch`/XHR to a SAP DM endpoint.

## Phase 6 — Chat Summary

Post short summary: verdict + counts + top-3 must-fix + auto-fixable count + pointer to report file. **When the Phase 3d gate FAILS, the FIRST line of the summary is the Architectural Conformance verdict** (`❌ interceptor / rogue-automation pattern — not a conformant POD2 widget (M73–M81: …)`), before the counts.

---

## Conventions

- Only flag broken/risky things. No padding.
- Prefer code snippets. Show before→after.
- Cite doc reference + line number.
- Auto-fixable = TRUE only for mechanical fixes without ambiguity.
- Preserve developer comments/style.
- Don't run fixes — only report.

## Abort conditions

- No `extension.json` → abort.
- Invalid JSON → single-error report.
