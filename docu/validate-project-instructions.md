# Validate Project — Agent Instructions

> **Internal note**: this file is the **single source of truth** for the validation workflow used by both
> - the MCP **tool** `validate_project`
> - the MCP **prompt** `validate_project`
>
> Both surfaces load this file at runtime via `helpers.readFileContent()`.
> Edit this file to update the validation logic — no rebuild needed for content changes.

---

Validate the POD 2.0 plugin in the **current working directory** against the latest pod2-mcp-server standards.

Scope is **always full** — every applicable rule must be checked.

---

## Phase 0 — Discovery

1. **Verify it is a POD 2.0 plugin project**: `extension.json` MUST exist in the working directory root. If not, abort with a clear error message.
2. List the project tree (skip `node_modules/`, `.git/`, `dist/`, `.scaffold-done`, `VALIDATION-REPORT.md`).
3. Identify the plugin structure:
   - `extension.json`
   - `widget/*.js` (zero or one widget)
   - `action/*.js` (zero or more actions)
   - `context/*.js` (zero or one context singleton)
   - `util/*.js` (helpers)
   - `i18n/i18n*.properties` (4 expected: default, _de, _en, _en_US)
   - `README.md`, `POD2_PLUGIN_EXAMPLE.md` (optional)

## Phase 1 — Load MCP Knowledge Base

Call these MCP tools in order:

1. `get_pod2_guidelines` — load the canonical rules
2. Load common mistakes by category (load all 7 — each is 100-1400 lines, much cheaper than the old monolith). **Load the full file for each category — the range hints below are a rough guide, not an exhaustive inventory; new mistakes are added continuously up to #70 (with intentional gaps).**
   - `get_pattern_doc({ name: "common-mistakes-setup" })` — Setup / extension.json / namespace (#0, #1, #1B, #2, #15, #16, …)
   - `get_pattern_doc({ name: "common-mistakes-lifecycle" })` — Lifecycle / subscribe / dialogs / base classes / `_createView` (#3–#5, #14, #19, #33, #35, #39, #50, #65, #66, …)
   - `get_pattern_doc({ name: "common-mistakes-imports" })` — Imports / module paths / defensive coding (#6–#9, #11, #36–#38, #41, #57, …)
   - `get_pattern_doc({ name: "common-mistakes-ui" })` — UI / bindings / control choice / M60/M61/M70 umbrellas (#10, #12–#13, #17, #20, #28, #31, #42–#43, #52–#64, #70, …)
   - `get_pattern_doc({ name: "common-mistakes-config" })` — Configuration / properties / i18n metadata (#18, #21–#22, #25–#26, #32, …)
   - `get_pattern_doc({ name: "common-mistakes-data" })` — Data / OData / models (#23–#24, #27, #29, #34, #51, …)
   - `get_pattern_doc({ name: "common-mistakes-i18n" })` — i18n (#30, #40, …)
3. `get_pattern_doc({ name: "basics" })` — architecture & best practices
4. `get_pattern_doc({ name: "extension-json-schema" })` — extension.json contract
5. `get_pattern_doc({ name: "subscribe-patterns" })` — PodContext subscribe/unsubscribe lifecycle
6. `get_pattern_doc({ name: "namespace-update" })` — current namespace conventions
7. `get_pattern_doc({ name: "deprecated-imports" })` — **exhaustive** deprecated enum list for M36 detection
8. `list_rest_apis` — current SAP DM REST API services with version info (v1/v2/v3)
9. `list_api_docs({ namespace: "sap.dm.dme.pod2.api", limit: 200 })` — current Public/Internal POD2 API surface
10. `get_example({ plugin: "Customer.Coating" })` — Best-Practice reference implementation (Ground Truth for Phase 3b)

## Phase 2 — Read Plugin Source

Read every relevant file (full text):
- `extension.json`
- All `*.js` files
- All `*.properties` files
- `README.md` if present

## Phase 3 — Common Mistakes Audit (every applicable rule)

For each rule in the common-mistakes category files, run a concrete detection. Group findings by severity:

### Errors (must-fix — these are broken in current SAP DM)

- **M0 / M15 — extension.json placement & layout**
  - extension.json MUST sit at project root (= ZIP root)
  - NO `webapp/` folder, NO namespace-folder wrapper
  - Folders `widget/`, `action/`, `context/`, `i18n/` directly at root
- **M2 — extension.json schema**
  - ONLY `widgets` and `actions` arrays. No `name`, `description`, `version`, `provider`, `license` fields.
  - Each entry has `modulePath` (slashes) and `type` (dots), consistent.
- **M3 — PodContext / ModelPath import path**
  - MUST be `sap/dm/dme/pod2/context/PodContext` and `sap/dm/dme/pod2/context/ModelPath`
  - NOT `sap/dm/dme/pod2/model/...` (legacy, broken)
- **M5 — Subscribe callback parameter order**
  - Callback signature MUST be `(newValue, path)` — NOT `(path, newValue)`. Detect via `PodContext.subscribe(...)` lambda inspection.
- **M6 — `_createView()` returns view with ID**
  - The returned root control MUST receive `oConfig.id` as **positional** first constructor argument.
- **M14 — Model initialization order**
  - If `_createView()` creates controls with bindings (`{/...}`), the JSONModel MUST be initialized **inside `_createView()`** before those controls are constructed (or guarded with `if (!this.#oModel) this._initializeModel()`).
- **M21 — `sap.m.Panel` vs `CustomPanel`**
  - For top-level layout containers, `sap.dm.dme.pod2.control.CustomPanel` is required (POD-Designer-compatible). Plain `sap.m.Panel` will not be draggable.
- **M29 — SFC status as string**
  - Comparisons like `sfcStatusCode === 401` (number) MUST be `=== "401"` (string). Same for filters, switch cases.
- **M31 — Control ID must be FIRST positional arg**
  - Detect anti-patterns: `oControl.setId(oConfig.id)`, `{ id: oConfig.id, ... }` in mSettings, build-then-setId in two statements.
- **M41 — Non-existent AMD module path (runtime 404 during plugin load)**
  - Certain UI5 class names live in `sap.ui.core`, NOT in `sap.m`. Guessing the AMD path from the fully-qualified class name (`sap.m.Item` → `sap/m/Item`) hits a hard 404 at plugin-load time — the entire widget never registers.
  - **Detection (Error, auto-fixable)**: `grep -rnE '"sap/m/(Item|Icon|ListItem|Element|Control|Fragment|HTML)"' widget/ action/ context/ util/`
  - **Fix (mechanical)**: replace the module string with `sap/ui/core/<Name>` — the destructured variable name in the factory callback stays the same.

    | Wrong | Correct |
    |---|---|
    | `"sap/m/Item"` | `"sap/ui/core/Item"` |
    | `"sap/m/Icon"` | `"sap/ui/core/Icon"` |
    | `"sap/m/ListItem"` | `"sap/ui/core/ListItem"` |
    | `"sap/m/Element"` | `"sap/ui/core/Element"` |
    | `"sap/m/Control"` | `"sap/ui/core/Control"` |
    | `"sap/m/Fragment"` | `"sap/ui/core/Fragment"` |
    | `"sap/m/HTML"` | `"sap/ui/core/HTML"` |

  - **Rule of thumb**: base/abstract UI5 classes (`Item`, `Icon`, `Element`, `Control`, `Fragment`, `HTML`) live in `sap.ui.core`. Only `sap.m` derivatives (`SelectItem`, `ObjectStatus`, `Text`, `Table`, `Button`, …) use `sap/m/*` paths.
  - **Verification during authoring**: for any UI5 module, call `get_ui5_api({ symbol: "<sap.class.name>" })` — the `module` field in the response is the canonical AMD path.
- **M42 — Custom control (`.extend()`) without `renderer` in metadata** → ❌ Error (runtime 404, hard fail)
  - Any `<BaseControl>.extend("customer.custom.extensions.<name>.<...>.<Name>", {...})` call that does NOT provide a `renderer` key inside the second argument triggers UI5's fallback `<Name>Renderer.js` module load → 404 → plugin fails to register.
  - **Detection**: `grep -rn "\.extend(" widget/ context/ util/` — for each hit, verify the settings object has either `renderer: <Parent>.getMetadata().getRenderer()`, `renderer: {...}`, `renderer: null`, or an accompanying `<Name>Renderer.js` file on disk.
  - **Fix**: for composite controls that inherit visuals (`CustomVBox`/`CustomHBox`/`CustomPanel` subclasses), add `renderer: <Parent>.getMetadata().getRenderer()`. For headless helpers, `renderer: {}` or `renderer: null`.
  - Auto-fixable: yes (mechanical) for composite/layout subclasses; NO for controls that genuinely need custom DOM output.
- **M43 — String passed to UI5 numeric property (`float` / `int`)** → ❌ Error (runtime `validateProperty` throw)
  - Numeric UI5 properties reject strings even when the string parses cleanly to a number. Common victims: `LineMicroChartPoint.x` / `.y`, `BulletMicroChartData.value`, `ProgressIndicator.percentValue`, `sap.viz.ui5.controls.*` feed values.
  - **Detection**:
    - `grep -rnE 'new (LineMicroChartPoint|BulletMicroChartData|RadialMicroChart)\(\{[^)]*(x|y|value):\s*String\(' widget/ action/ context/`
    - `grep -rnE 'new (LineMicroChartPoint|BulletMicroChartData)\(\{[^)]*(x|y|value):\s*"' widget/`
    - Template literals feeding numeric props: `grep -rnE '(x|y|value|percentValue):\s*\`' widget/`
  - **Fix**: pass native numeric values. Convert with `Number(...)` if the source is a string. Never use `.toFixed()` results as numeric-property inputs — `.toFixed` returns a string, appropriate only for display.
  - Auto-fixable: yes (mechanical `String(x)` → `Number(x)` / `"" + x` → `x`).

- **M64 — `sap.m.MessageStrip.link` aggregates `sap.m.Link`, not `sap.m.Button`** → ❌ Error (runtime aggregation type-check)
  - `MessageStrip.link` is a 0..1 aggregation of type `sap.m.Link`. Passing a `sap.m.Button` throws `"Element sap.m.Button#…" is not valid for aggregation "link" of Element sap.m.MessageStrip#…` at first render.
  - **Detection (Error, auto-fixable)**:
    - `grep -rnE 'link:\s*new Button' widget/ action/`
    - Broader (multi-line, catches split-arg style): `grep -rn -B1 -A6 'new MessageStrip' widget/ action/ | grep -E 'link:\s*new Button'`
  - **Fix (mechanical)**: replace the import `"sap/m/Button"` bound to that call site with `"sap/m/Link"`, and `new Button(` → `new Link(` inside the `MessageStrip` constructor. Do NOT globally rename Button → Link — only the reference inside the MessageStrip.link value.
  - Reference: `common-mistakes-ui.md` #M64, `dashboard-patterns.md` §Pattern 6.

- **M65 — `_createView()` receives NO arguments — read config via `this.getConfig()`** → ❌ Error (runtime `TypeError: Cannot read properties of undefined`)
  - The POD 2.0 framework calls `_createView()` with an empty argument list. Declaring `_createView(oConfig) { … }` binds `oConfig` to `undefined` at runtime — the widget crashes on the first render pass.
  - **Detection (Error, auto-fixable)**:
    - `grep -rnE '_createView\s*\(\s*[a-zA-Z_]' widget/` — any hit inside a `widget/*.js` file (i.e. an argument-carrying `_createView` signature) is a hard finding.
  - **Fix (mechanical, two-step)**:
    1. Rewrite `_createView(oConfig)` → `_createView()`.
    2. Insert `const oConfig = this.getConfig();` as the first statement in the method body.
  - Verify the body still references `oConfig.id` for M6 conformance. If the body never used the parameter, delete the argument only.
  - Reference: `common-mistakes-lifecycle.md` #M65, `sap.dm.dme.pod2.widget.Widget.md` §`_createView`, `Customer.Coating/widget/CoatingWidget.js` (Ground Truth).

- **M66 — Binding-referenced instance initialised in `onInit()` — `_createView()` runs first** → ⚠️ Warning (runtime `TypeError: Cannot read properties of undefined (reading 'format' | 'get' | …)`)
  - `_createView()` runs BEFORE `onInit()`. UI5 evaluates `formatter:` closures **during control construction** — a `formatter: v => this.#oPctFmt.format(v)` closure fires against `this.#oPctFmt === undefined` at the first render pass if `#oPctFmt` was initialised in `onInit()`.
  - **Detection (Warning — a widget with zero formatter closures is unaffected)**:
    1. Fields assigned in `onInit()` to formatter-producing factories:
       ```
       awk '/onInit\s*\(/,/^\s{4}}/ { print }' widget/*.js \
         | grep -nE 'this\.#o[A-Z]\w*\s*=\s*(NumberFormat|DateFormat|ODataV4Client|new JSONModel)'
       ```
    2. Same field referenced from a binding formatter:
       ```
       grep -nE 'formatter:\s*[^,)]*this\.#o[A-Z]' widget/*.js
       ```
    - A file that produces hits in **both** greps is a candidate defect. Confirm at runtime — a `Cannot read properties of undefined (reading 'format'|'get'|'getProperty')` at first render confirms M66.
  - **Fix (semi-mechanical)**:
    1. Extract field-initialisations from `onInit()` into a new `_ensureRuntime()` method with `if (!this.#oX) { … }` guards for idempotency.
    2. Insert `this._ensureRuntime();` as the first statement of both `_createView()` and `onInit()`.
    3. Leave any non-idempotent side-effects (`PodContext.subscribe`, `Timer.start`, `setModel` on the widget view) in `onInit()` — those genuinely belong after view construction.
  - Auto-fixable: **NO** (multi-step refactor with idempotency guards — flag for human review). The finding text in the report MUST cite the exact `formatter:` closure(s) that read the un-initialised field.
  - Reference: `common-mistakes-lifecycle.md` #M66, `dashboard-patterns.md` §Pattern 1 (lifecycle box + `_ensureRuntime` helper), `html5-migration-guide.md` §5, §6 (comment now reads "Once, in `_createView()` before building the view").

- **M71 — Wrong notification-subscribe keys & non-existent `Logger.warning()`** → ❌ Error (handler silently never fires / runtime `TypeError`)
  - Two independent API-shape traps, both silent until runtime. See `common-mistakes-imports.md` #M71.
  - **Detection**:
    - `grep -rn -A6 'PodNotificationWebSocket\.subscribe' widget/ action/ context/ util/ | grep -E 'callback:|listener:'` — any hit is wrong; the handler key is `onMessage` and there is no `listener` key. Auto-fix: rename `callback:` → `onMessage:`, delete `listener:`.
    - `grep -rnE '\.subscribe\(\s*\{' widget/ action/ context/ util/ | ...` then confirm `eventType:` uses an `EventType.*` constant, not a hardcoded string.
    - `grep -rnE '(Log|oLog|logger|#oLog)\.warning\(' widget/ action/ context/ util/` — `Logger` has no `warning()`; replace with `.warn(`. **Do NOT** flag `MessageBox.warning(` — that is a different (correct) class.
  - Auto-fixable: **YES** (mechanical rename for both `onMessage` and `warn`).
  - Reference: `common-mistakes-imports.md` #M71, `pod2-public-api-pattern.md` §Subscribe Example, `get_api_doc({ name: "PodNotificationWebSocket" })` / `get_api_doc({ name: "Logger" })`.


- **M72 — Internal / app-router API hard-wired into plugin source (public-API-first)** → ⚠️ Warning (works in one tenant, breaks across tenants/releases)
  - Plugin source calls an unversioned internal surface (execution host, `~GUID~`, `dmi/cdt` / `dim/destinations`) instead of a public REST API. Such surfaces are for agent-side discovery (`sap-dm-api-mcp-server.call_internal_api`), not plugin code. See `common-mistakes-data.md` #M72.
  - **Detection**:
    - `grep -rnE '\.execution\.[a-z0-9-]+\.web\.dmc\.cloud\.sap|~[A-Za-z0-9-]+~|dmi/cdt|dim/destinations' widget/ action/ context/ util/` — any hit is a finding. **Do NOT** flag `ApiClient.internal.processengine` — that is a documented framework API, not an app-router call.
  - Auto-fixable: **NO** — requires finding the equivalent public REST API (`search_rest_apis`) or explicit user confirmation to keep the internal call.
  - Reference: `common-mistakes-data.md` #M72, `get_pod2_guidelines` §Public-API-First, `pod2-public-api-pattern.md`.


- **M70 — Silent information loss via standard-control bias** → ⚠️ Warning (semantic — no runtime error, invisible until visual review)
  - The migrator picked a standard control (typically `sap.m.GenericTile`) for a source composite that carries more fields than the target has slots, and dropped the delta silently. `MIGRATION_VERIFICATION.md` shows ✅ across the coverage matrix. Runtime works. Deploy renders less than the source.
  - **Detection (Warning — applies only when `sourceFormat === "html5"`)**: three mechanical checks (a **plus** a manual visual walk-through in Phase 5c).
    1. **`MIGRATION_MAPPING.md` presence of source-field inventory per composite**:
       ```
       grep -c '^## Composite:' MIGRATION_MAPPING.md
       grep -c '^Source fields:' MIGRATION_MAPPING.md
       grep -c '^Slots covered:' MIGRATION_MAPPING.md
       ```
       If `## Composite:` count > 0 AND (`Source fields:` count < `## Composite:` count OR `Slots covered:` count < `## Composite:` count) → **M70 gate failure**: some composite mapping is silent about its field inventory.
    2. **`MIGRATION_VERIFICATION.md` presence of the Field-coverage report**:
       ```
       grep -c '^## Field-coverage report' MIGRATION_VERIFICATION.md
       ```
       `0` → **M70 gate failure**: verification is silent about slot coverage.
    3. **Cross-check**: for every migrated composite, verify the `## Field-coverage report` row has an empty **Dropped fields** column OR a `User-approved?` value of `✅`. Any row with non-empty Dropped fields AND non-`✅` approval → gate failure.
  - **Fix**: three legal outcomes for each finding — NEVER silent drop:
    1. **Escalate** the target control (e.g. `GenericTile` → `sap.f.Card` + `NumericHeader`, following the "Escalate to" column in `dashboard-patterns.md` §"Chart→control decision table").
    2. **List the field explicitly** in `MIGRATION_MAPPING.md` under `### Intentionally dropped` with a business justification, and record user approval in the Field-coverage report.
    3. **Add a `f:content` fragment** in the Card body (e.g. `sap.m.ProgressIndicator` for the progress bar) — NOT a custom control emission (that would be M60).
  - Auto-fixable: **NO** — the resolution is either a structural change (escalate target control) or an out-of-band user decision (approved drop).
  - Reference: `common-mistakes-ui.md` #M70, `dashboard-patterns.md` §"Chart→control decision table" (Slots + Escalate-to columns), §"Slot map — when to escalate `GenericTile` → `sap.f.Card` + `NumericHeader`" (10-slot map for the escalation target).
- **M32 — Widget metadata i18n trio with `<widgetName>.` prefix (named prefix)**
  - `<widgetName>` = the widget's camelCase short name (e.g. `coating`, `helloWorld`, `stepStatus`, `tableView`). Example: for a `CoatingWidget`, the required keys are `coating.displayName`, `coating.description`, `coating.category`.
  - **NOT a finding** — do **NOT** flag: any camelCase `<widgetName>.` prefix that matches the widget's short name. This IS the required form. Multi-widget plugins have one trio **per widget** in the same bundle (e.g. `coating.*` AND `helloWorld.*` side-by-side) — this is uniform, correct, and MUST NOT be flagged. Never expect the literal string `widget.` — that is the DEPRECATED form.
  - **Flag as Error** only when: (a) bundles use legacy unprefixed keys (`displayName=`, `description=`, `category=` with no prefix at all), **OR** (b) bundles use the deprecated generic `widget.` prefix, **OR** (c) the widget code reads keys that don't exist in the bundles (widget/bundle mismatch).
  - The widget code MUST read these via `getI18nText("<widgetName>.displayName" / "<widgetName>.description" / "<widgetName>.category")`. All four locale bundles (`i18n.properties`, `i18n_de.properties`, `i18n_en.properties`, `i18n_en_US.properties`) MUST contain the trio.
  - The values MUST come from `POD2_PLUGIN_EXAMPLE.md` (or `POD2_PLUGIN_TEMPLATE.md`) verbatim — flag suspicious copy-paste like `<widgetName>.category=CUSTOMER` if the spec says something else.

### Warnings (should-fix — works but legacy / risky)

- **M1 — `onExit()` unsubscribe**
  - Every `PodContext.subscribe(...)` MUST have a matching `PodContext.unsubscribe(...)` in `onExit()` with the SAME callback reference. Count subscribe vs unsubscribe occurrences.
- **M4 — StringPropertyEditor default value**
  - Don't pass a 3rd default argument; defaults belong in `getDefaultConfig()` / `getPropertyValue()`.
- **M7 — PlacementType import**
  - `PlacementType` from `sap/m/PlacementType`, NOT from `sap/ui/core/library`.
- **M8 — Wrong ModelPath constants**
  - Cross-check every `ModelPath.X` against `get_api_doc({ className: "sap.dm.dme.pod2.context.PodContext" })` and `sap.dm.dme.pod2.context`. Specifically flag non-existent ones like `SelectedWorkListItem` (singular), `SelectedSfc`, etc.
- **M9 — getResourceBundle()**
  - `this.getResourceBundle()` doesn't exist on Widget. Either use `getI18nText()` via I18nResourceModel, or load `sap/base/i18n/ResourceBundle` manually in `onInit`.
- **M10 — `class:` vs `addStyleClass()`**
  - In control settings, `class: "..."` is invalid; use `.addStyleClass("...")`.
- **M11 — Third-party library AMD bypass**
  - Direct `jQuery.sap.includeScript` or `<script>` tag injection without AMD shadowing → flag.
- **M13 — Expression vs Formatter for trivial conditions**
  - `formatter: () => x === 'X'` for simple equality → suggest expression binding `{= ${x} === 'X' }`.
- **M16 — No-data text**
  - Hard-coded `"No data"` without state-aware text → suggest dynamic explanation.
- **M18 — GrowingJSONModel page increment**
  - If GrowingJSONModel used: ensure page counter `#iPage` is incremented per fetch (not always 0).
- **M19 — Dialogs without `afterClose: () => destroy()`**
  - Detect `new Dialog(` / `new PodDialog(` without destroy in afterClose.
- **M20 — Column / cell index mismatch in TableWidget**
  - For dynamic columns: same index splice for columns and cells.
- **M22 — Multiple subscribe calls vs array form**
  - 3+ separate `PodContext.subscribe(...)` calls with the same callback → suggest array form `PodContext.subscribe([...], cb, this)`.
- **M23 — Forgetting `finally` to clear busy state**
  - `oView.setBusy(true)` must always have a matching `setBusy(false)` in a `finally` block.
- **M24 — Generic error display for expected error codes**
  - `catch` blocks that show error message for `sfc.notInCompletePending` etc. → suggest specific handling.
- **M26 — EXCLUDE_PROPERTIES vs IGNORE_TABLE_PROPERTIES misuse**
  - Cross-check whether widget-specific (non-Table) properties are in EXCLUDE_PROPERTIES instead of IGNORE_TABLE_PROPERTIES.
- **M27 — Missing `_syncSelectionsWithPodContext` for TableWidget**
  - If subscribing to `SelectedWorkListItems`, the table must sync (initial + on change) and `_onSelectionChange` must preserve existing selections.
- **M28 — Multi-part bindings without null checks**
  - Formatters using multiple parts MUST defensively check each parameter (`if (!a || !b) return ""`).
- **M30 — German i18n: SFC vs PSN**
  - In `i18n_de.properties`: ANY user-facing `SFC` literal in the value (right-hand side of `=`) MUST be `PSN`. Code identifiers stay `sfc`.
  - The reverse: `i18n.properties` / `i18n_en.properties` / `i18n_en_US.properties` should NOT contain `PSN`.
- **M33 — BusyIndicator: two strict patterns (Widget vs. Action)** → ❌ Error
  - There are **exactly two** allowed busy-indicator patterns. Anything else is a finding:
    1. **Widget code** (`widget/*.js`): the verbatim three-line preamble
       ```javascript
       const oView = this.getView();
       oView.setBusyIndicatorDelay(0);
       oView.setBusy(true);
       // ... try / finally with oView.setBusy(false);
       ```
    2. **Action code** (`action/*.js`): `BusyIndicator.show(0)` / `BusyIndicator.hide()` imported from `"sap/ui/core/BusyIndicator"`.
  - **Action-side findings** (Error, auto-fixable):
    - `grep -rnE '\.setBusy\(' action/` — any hit
    - `grep -rnE 'getPodRuntime\(\)\.getView\(\)' action/` — any hit
    - Replace with `BusyIndicator.show(0)` / `BusyIndicator.hide()`. Add `"sap/ui/core/BusyIndicator"` to the dependency array.
  - **Widget-side findings** (Error, auto-fixable):
    - `grep -rnE 'this\.setBusy\(' widget/` — Widget has no `setBusy()` method; this is a runtime error. Replace with `this.getView().setBusy(...)`.
    - `grep -rnE 'new BusyIndicator\(' widget/` — inline `new BusyIndicator(...)` from `sap/m/BusyIndicator` as a sub-control is an anti-pattern; use `oView.setBusy()` on the widget view instead.
    - `grep -rnE 'sap/m/BusyIndicator' widget/` — import of `sap/m/BusyIndicator` in widget code is forbidden (use `getView().setBusy()`).
    - `grep -rnE '\.setBusy\(\s*true\s*\)' widget/` followed by a check that the preceding line is `setBusyIndicatorDelay(0)` — if missing, this is a **Warning** (perceived "no feedback" UX due to 1000ms default delay). Auto-fix: insert `oView.setBusyIndicatorDelay(0);` before `oView.setBusy(true);`.
    - Single-control busy on tables/lists in widget code (e.g. `oTable.setBusy(`, `oList.setBusy(`) when there is no clear reason — **Warning**, replace with `oView.setBusy()`. NOTE: single-control busy on a separate dialog/popover controller is legitimate and must NOT be flagged.
  - Reference: [`docu/common-mistakes.md` #33](common-mistakes.md#mistake-33-busyindicator-in-actions-via-view-instead-of-sapuicorebusyindicator).
  - Auto-fixable: yes (all variants are mechanical).
- **M34 — `parseFloat()` on user input breaks localized number formats** → ⚠️ Warning (silent data loss in non-`en-*` locales)
  - In any `widget/*.js`: `parseFloat(oInput.getValue())`, `Number(oInput.getValue())`, or `parseFloat(o<X>Input.getValue())` is locale-blind and silently truncates German `"1,5"` to `1`.
  - Same for **display**: `(num).toString()` followed by `setValue()` / `setText()` shows English-format dots in a German UI.
  - Required pattern: a `_getNumberFormat()` / `_parseNumber()` / `_formatNumber()` helper trio using `sap/ui/core/format/NumberFormat` (see Coating widget reference).
  - Detection:
    - `grep -nE 'parseFloat\(\s*[^)]*\.getValue\(\)' widget/`
    - `grep -nE 'Number\(\s*[^)]*\.getValue\(\)' widget/`
    - `grep -nE '\.setValue\(\s*[^)]*\.toString\(\)' widget/`
    - `grep -nE '\.setText\(\s*[^)]*\.toString\(\)' widget/`
  - **NOT a finding**: `parseFloat()` on JSON strings from the backend (`entry.Min`, `oResponse.Quantity`, …). JSON values are always dot-formatted by spec — locale-aware parse would actually break them. Only flag values that come from `Input.getValue()` / dialog text fields / user-typed sources.
  - Auto-fixable: yes for the trivial case (`parseFloat(x.getValue())` → `this._parseNumber(x.getValue())`), but only if a `_parseNumber` helper already exists in the widget. If the helper is missing, mark `Auto-fixable: NO` and let the user introduce the helpers manually (multi-step refactor).

- **M36 — Deprecated SAPUI5 pseudo-module enum imports** → ⚠️ Warning (deprecation console noise, will break in future UI5)
  - **MUST load:** `get_pattern_doc({ name: "deprecated-imports" })` — this is the **exhaustive reference** with exact lists and grep commands.
  - **Detection:** Run the EXACT grep commands from `deprecated-imports.md` against the plugin source. Do NOT use heuristics or guessing. The doc contains complete lists for both `sap/m/` and `sap/ui/core/` deprecated enums.
  - **Common findings:** `ButtonType`, `InputType`, `ListSeparators`, `ListMode`, `PlacementType`, `ValueState`, `MessageType`, `TextAlign`, `FlexAlignItems`, etc.
  - **Important:** Do NOT confuse enum pseudo-modules with Control classes! `sap/m/Button` is a Control (valid). `sap/m/ButtonType` is an enum (deprecated). The `deprecated-imports.md` doc lists BOTH deprecated enums AND valid controls explicitly.
  - Fix: Replace `import X from "sap/m/X"` with `import mLibrary from "sap/m/library"; const { X } = mLibrary;`
  - For `sap/ui/core/` enums: `import coreLibrary from "sap/ui/core/library"; const { ValueState } = coreLibrary;`
  - Auto-fixable: Yes (mechanical replacement of import + destructure from library).

### Info (consider — modernization)

- **M25 — `MessageHistory.toast()` for important persistent messages** → suggest `showSuccess` / `showError`.
- **Spreading parent properties in `getDefaultConfig()` for Widget/ControlWidget** → never; for TableWidget/LayoutWidget → required.

### HTML5 Residue (Errors + Warnings — critical for plugins produced by `sourceFormat: "html5"` migrations)

These findings indicate the migration agent left source-code idioms from the HTML5 origin in the produced plugin. They correspond 1:1 to the `migrate_widget` Phase 5b Residue Gate — a validator run on a shipped plugin should produce zero of these.

**Errors** (block sign-off):

- **HTML5-CHART — Chart.js / d3 / plotly / echarts / apexcharts in shipped widget code** (Cat 21)
  - Detection: `grep -rnE 'new Chart\(|Chart\.register|Chart\.defaults|d3\.|Plotly\.|echarts\.init|ApexCharts' widget/ action/ context/ util/`
  - Fix: re-implement per `chart-migration-map.md` (VizFrame / microcharts / GanttChart).
- **HTML5-FETCH — Native `fetch(...)` / `XMLHttpRequest` / `$.ajax` / `axios` in shipped widget code** (Cat 22)
  - Detection: `grep -rnE 'fetch\s*\(|XMLHttpRequest|\$\.ajax|axios\.' widget/ action/ context/ util/`
  - Fix: `ODataV4Client` for MDO, `ApiClient.<ns>.<method>` for SAP DM REST. See `html5-migration-guide.md` §1.
- **HTML5-INLINE-HANDLER — Inline `onclick=` / `onchange=` / `document.addEventListener` in shipped widget code** (Cat 25)
  - Detection: `grep -rnE 'onclick=|onchange=|oninput=|document\.addEventListener\(' widget/ action/ context/ util/`
  - Fix: `attachPress` / `attachChange` on UI5 controls. See `html5-migration-guide.md` §4.
- **HTML5-CHART-SCRIPT-TAG — Chart-lib `<script>` tag or `import chart.js`** — blocks POD Designer preview & CSP; hard fail.

**Warnings** (should-fix — likely correctness or UX bug):

- **HTML5-TOFIXED — `.toFixed(N)` for numeric display** (Cat 3 / M34)
  - Detection: `grep -rnE '\.toFixed\(' widget/ action/ context/ util/`
  - Fix: `NumberFormat.getFloatInstance({minFractionDigits:N, maxFractionDigits:N})`.
- **HTML5-MODULE-STATE — Module-level `let` / `var` mutable state outside class body** (Cat 23 / B4)
  - Detection: `grep -rnE '^\s*(let|var)\s+\w+\s*=' widget/ action/ context/ util/`
  - Fix: private class fields (`#name`) or Context singleton properties.
- **HTML5-EMOJI-ICON — Emoji glyphs used as icons in JS strings** (Cat 26)
  - Detection: `grep -rnE '[🔴🟢🟡🟠🔔🔍🎧🏭📍👤❓📊📋]' widget/ action/ context/ util/`
  - Fix: `sap-icon://<name>` + `sap.ui.core.IconColor` + `tooltip`. Mapping table in `html5-migration-guide.md` §7.
- **HTML5-LOCALE-LITERAL — Hard-coded locale literal (`'de-DE'` / `'en-GB'` / `'en-US'`) in JS** (Cat 27)
  - Detection: `grep -rnE "'de-DE'|'en-GB'|'en-US'|'fr-FR'" widget/ action/ context/ util/`
  - Fix: `sap.ui.core.format.DateFormat` — locale comes from `Configuration.getLanguage()`.
- **HTML5-TIMER-HANDLE — `setInterval` without a stored handle** (Cat 20 / B9)
  - Detection: `grep -rnE 'setInterval\s*\(' widget/ action/ context/ util/` — flag lines that do NOT match `#\w+\s*=\s*setInterval`.
  - Fix: `this.#nIntervalId = setInterval(...)` + matching `clearInterval` in `onExit()`.
- **HTML5-TIMER-CLEANUP — `setInterval` without `clearInterval` anywhere in same file** (Cat 20)
  - Detection: files containing `setInterval` but NOT `clearInterval`.
  - Fix: clear in `onExit()`.
- **HTML5-MAGIC-THRESHOLD — Ternary threshold chains with 3+ literal numbers** (Cat 28)
  - Detection: `grep -rnE '>=?\s*\d+\s*\?[^:]+:\s*[^?]+>=?\s*\d+\s*\?' widget/`
  - Fix: widget properties via `getConfigProperties()`. See `property-editors.md`.

Report structure: in `VALIDATION-REPORT.md`, add a new section **"§1c. HTML5 Residue"** (between "§1b. Best-Practice Pattern Compliance" and "§2. REST API Versions"). Always emit the section — if empty, write `— no findings —` so downstream reviewers get a stable signal that the check ran.

---

## Phase 3b — Best-Practice Pattern Audit (structural comparison against reference examples)

This phase compares the plugin's **architecture and code patterns** against the Best-Practice standard defined in `docu/basics.md`, `docu/widget-patterns-core.md`, and the production-grade reference example `Customer.Coating`.

### Load reference material

1. `get_pattern_doc({ name: "basics" })` — if not already loaded in Phase 1
2. `get_example({ plugin: "Customer.Coating" })` — load the full reference implementation as Ground Truth

### Structural checks (compare plugin structure ↔ reference)

For each component type present in the plugin, verify it follows the Best-Practice pattern:

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

#### extension.json

| Check | Expected | Severity |
|---|---|---|
| Only `widgets` + `actions` arrays | No extra metadata fields | ❌ Error (M2) |
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

**Exception**: styling deviations (`sap/ui/core/HTML` with `<style>`, inline `style=`, plugin CSS files, non-whitelisted `addStyleClass`) are NOT respected by Rule 2's auto-downgrade — see M61 umbrella. They require the explicit `// standard-only: exception — <reason>` marker documented below.

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
- **M41 — non-existent AMD module path** (`sap/m/Item`, `sap/m/Icon`, … — 404 at plugin-load; whole widget never registers)
- **M42 — custom control `.extend()` without `renderer` in metadata** (`<Name>Renderer.js` 404 at plugin-load)
- **M43 — String passed to UI5 numeric property** (`validateProperty` throws at first refresh — feature dead)
- **M60 — custom control class for pure display composition** (a template masquerading as a control — see M60)
- **M61 — plugin CSS surface** (physical `widget/css/*.css` without loader / inline `style="..."` / `HTML` with `<style>` / non-Fiori-prefix `addStyleClass` or `class=`). Dead CSS specifically — a `.css` file with no `includeStyleSheet`/`createStyleSheet`/`IconPool.registerStyleSheet`/`css!` call — is treated as broken code because a real migration shipped ~200 LOC of never-loaded CSS.
- **Cat 29** — custom composite where a standard SAPUI5 control exists (S1-S7)
- API version Errors when the used version no longer exists in `list_rest_apis`

For these, the marker `validate: ignore` is still respected (user takes the risk explicitly), but `info-only` does NOT downgrade — the underlying code is genuinely broken in production.

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
| `.addStyleClass("<plugin-prefix>Foo")` — non-Fiori class name | ❌ **Not allowed** — M61 whitelist. Use `sapUi{Tiny,Small,Medium,Large}Margin*` utility classes or refactor to a semantic control. |
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

## Phase 4 — API Versions Audit (CRITICAL — explicit requirement)

### 4a) SAP DM REST APIs (v1 / v2 / v3)

1. Scan plugin code for any of these patterns:
   - URL strings: `/dm/<service>/v1/...`, `/dm/<service>/v2/...`, `/dm/<service>/v3/...`
   - `ApiClient.rest.<service>.<method>` (or any `RestClient` usage)
   - Plain `fetch("...")` / `XMLHttpRequest` to SAP DM URLs
2. Build a set of (service, version-used) tuples.
3. Cross-check against `list_rest_apis`. For each service:
   - **Highest version available in specs > version used by plugin** → ⚠️ **Warning** "Upgrade recommended: vX → vY"
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

### 4d) ModelPath / PodContext consistency

1. Extract all `ModelPath.<X>` and `PodContext.<method>(...)`.
2. Cross-check `get_api_doc` for PodContext. Flag non-existent → ❌ Error. Deprecated → ⚠️ Warning.

---

## Phase 5 — Write `VALIDATION-REPORT.md`

Create at working-directory root. Structure: Summary table → §1 Common Mistakes (Errors/Warnings/Info with File:Line, Found, Expected, Doc-ref, Auto-fixable flag) → §2 REST API Versions table → §3 POD2 API Usage table → §4 MDO/OData → §5 ModelPath/PodContext → §6 Auto-fixable items checklist → §7 Notes.

## Phase 6 — Chat Summary

Post short summary: verdict + counts + top-3 must-fix + auto-fixable count + pointer to report file.

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
