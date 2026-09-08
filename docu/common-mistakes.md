# Common Mistakes and Fixes

Quick reference guide to POD plugin development pitfalls organized by category.

---

## Prime Directive — Standard Controls Before Custom

> **When a UI requirement seems not to fit a control, the answer is almost always another SAPUI5 control — not a new one.** The full rule (Escalation Ladder: search alternatives → escalate within family → compose → custom only after team alignment) lives in [`basics.md`](basics.md) §0.
>
> **Scope: EVERY POD 2 UI decision** — greenfield widgets, actions with dialogs, form-based CRUD, table decorations, filter bars, POD Designer property editors, and every migration. Not just dashboards; not just HTML5 refactors.
>
> **M60, M61, Cat 29, and M70 are all specialisations of this one rule** — each covers a specific way the ladder gets skipped. Load `basics.md` §0 first when the plugin's UI shape is under discussion; treat those mistakes as concrete detections of the same underlying bias.

---

**Latest Update (2026-07-24 · M72 Public-API-First guardrail)**: Guardrail against blurring the two "internals". Plugin source must use the **public** SAP DM REST APIs (`RestClient` + `ApiPaths`, `*PublicApiClient`); **internal / app-router** endpoints (execution host `*.execution.*.web.dmc.cloud.sap`, `~GUID~` paths, `dmi/cdt` / `dim/destinations`) — the surface `sap-dm-api-mcp-server.call_internal_api` queries for agent-side discovery — must NOT be hard-wired into a plugin without explicit user confirmation, and only after no public API fits. `ApiClient.internal.processengine.start(...)` is a documented framework API and stays allowed (it is NOT what the rule restricts). Also reflected in `get_pod2_guidelines` §Public-API-First and `usage/CLAUDE.md` Critical Rule #11.
- **M72** — Hard-wiring an internal/app-router API into plugin source instead of the public REST API. Detection grep in Phase 3 (below) and `common-mistakes-data.md`.
**Previous Update (2026-07-17 · M71 notification-subscribe & Logger API-shape traps)**: Field report from real plugin development against the runtime caught two silent API-shape bugs plus doc drift. `PodNotificationWebSocket.subscribe()` takes an options object with `onMessage` (NOT `callback`/`listener`) — a mis-keyed handler compiles but never fires; there is no static `PodNotificationWebSocket.unsubscribe({...})` (keep the returned `SubscriptionContext` and call `.unsubscribe()`). `sap.dm.dme.pod2.Logger` has `warn()`, not `warning()` — `oLog.warning(...)` throws `TypeError` at runtime (distinct from `MessageBox.warning`, which is correct). The `EventType` table in `pod2-public-api-pattern.md` is now marked non-authoritative (runtime enum is the source of truth; suffixes drift, e.g. `SFC_START` → `Sfc.Started.v3`); build pickers from `Object.keys(EventType)`. Custom events use `EventType.CUSTOM` + payload `Filter`, not a hand-invented event type. Also documented `PodRuntime.getDialogIds()` and clarified `getWidgetReferenceProperties()` is Action-only.
- **M71** — Wrong notification-subscribe keys (`callback`/`listener` → `onMessage`) & non-existent `Logger.warning()` → `warn()`. Fixed in `pod2-public-api-pattern.md`, `subscribe-patterns.md`, and two `archive/` pattern files.
**Previous Update (2026-07-07 · v5.12.9 · M70 information-preservation contract)**: Real-world observation from an HTML5 → POD 2.0 dashboard migration: the migrator picked `sap.m.GenericTile` for every KPI-tile-shaped composite (citing the decision table's "KPI tile" row as "First choice"), silently dropped 7 categories of source fields (progress bars, sub-KPIs, status pills, sub-text, resource counts, period context, A/P/Q sub-metrics), and marked `MIGRATION_VERIFICATION.md` ✅ across the board. Zero runtime errors; zero validator hits from the standard-first side (M60/M61/Cat 29). The user caught it visually after deploy. This release makes the trade-off explicit at the mapping step.
- **M70** — Silent information loss via standard-control bias. The rule is "the SMALLEST standard control that fits ALL source fields", not "the first-choice control from the row that matched the primary KPI". Every source composite gets a source-fields inventory + slot-coverage check in `MIGRATION_MAPPING.md`; every migrated composite gets a row in a new `## Field-coverage report` table in `MIGRATION_VERIFICATION.md`. Any dropped field without user sign-off blocks Phase-5.
- **`dashboard-patterns.md` §"Chart→control decision table"** — rewritten with two new columns: **Slots (documented)** and **Escalate to if slots insufficient**. Every row now spells out the target control's slot capacity so the migrator picks by fit, not by primary-KPI match. New "Card with content" row for header + progress-bar/microchart/table composites (the escalation target of `NumericHeader`).
- **`dashboard-patterns.md` §Pattern 2** — new "Slot map — when to escalate `GenericTile` → `sap.f.Card` + `NumericHeader`" section with the full 10-slot `NumericHeader` map (including previously undocumented `statusText` and `sideIndicators` × 2 × `NumericSideIndicator`) and a canonical XML example covering every slot.
- **`migrate_widget` Phase 3** — mandatory `## Composite:` block per KPI-tile / info-card / card-with-content in `MIGRATION_MAPPING.md` listing source fields, slots covered, slots missing, and (if any missing) escalation decision. Silence = mapping bug.
- **`migrate_widget` Phase 5** — new `## Field-coverage report` artifact in `MIGRATION_VERIFICATION.md` (between "Coverage Matrix" and "HTML5 Residue Gate") with one row per migrated composite. Non-empty "Dropped fields" without user approval blocks sign-off.
- **`validate-project-instructions.md` Phase 3** — new M70 gate (Warning): checks `MIGRATION_MAPPING.md` for `## Composite:` + `Source fields:` + `Slots covered:` triples, and `MIGRATION_VERIFICATION.md` for the `## Field-coverage report` section. Semantic finding — NOT auto-fixable.
**Previous Update (2026-07-07 · v5.12.8 · M64–M66 post-scaffold traps)**: Three runtime errors caught during the first deploy of a real HTML5→POD 2.0 dashboard migration — all three are generic POD 2.0 traps, all three now documented as first-class Common Mistakes. The `dashboard-patterns.md` §Pattern 1 lifecycle box, §Pattern 6 error strip, and `html5-migration-guide.md` §5/§6 comments were the sources of the confusion and have been corrected in the same commit.
- **M64** — `sap.m.MessageStrip.link` aggregates `sap.m.Link`, NOT `sap.m.Button`. Aggregation type-check throws `"Element sap.m.Button#…" is not valid for aggregation "link"` at render. Fix: `new Link({ text: "Retry", press: … })`. `dashboard-patterns.md` §Pattern 6 example was Button — now Link.
- **M65** — `_createView()` receives **no arguments**. Declaring `_createView(oConfig) { … }` binds `oConfig` to `undefined` at runtime → `TypeError: Cannot read properties of undefined (reading 'id')`. Fix: `_createView() { const oConfig = this.getConfig(); … }`. `dashboard-patterns.md` §Pattern 1 signature was wrong; the Widget API doc `_createView` section now names `this.getConfig()` explicitly.
- **M66** — `_createView()` runs **before** `onInit()`. UI5 evaluates `formatter:` closures **during control construction**, so anything referenced from a binding (`NumberFormat`, `DateFormat`, `ODataV4Client`, `JSONModel`) MUST already exist when `_createView` builds the view. Fix: idempotent `_ensureRuntime()` helper called from both `_createView()` (first) and `onInit()` (defensive parity). `html5-migration-guide.md` §5/§6 `// Once, in onInit:` comment was misleading — now `// Once, in _createView(), before building the view:`.
- `validate-project-instructions.md` Phase 3 gains three new detection greps (M64/M65/M66) so the self-audit flags all three at Phase 3 instead of first deploy.
**Previous Update (2026-07-07 · v5.12.5 CSS ban)**: **M61 rewritten as an umbrella "no plugin CSS surface" rule** — every `widget/css/*.css` file requires a documented stylesheet loader call (`includeStyleSheet` / `IconPool.registerStyleSheet` / `css!`), no inline `style=` in XML, no `sap.ui.core.HTML` with `<style>`, no `addStyleClass("<non-Fiori-prefix>Foo")`. Fiori whitelist: `sapUi*`, `sapM*`, `sapTnt*`, `sapF*`, `sapUxAP*`, `sapUshell*`. Legitimate exceptions require the explicit `// standard-only: exception — <reason>` marker (not the generic `validate: info-only`). `Customer.Coating` reference example refactored — `sap/ui/core/HTML` + inline `<span style=…>` hint replaced with `sap.m.Text` + `sapUiSmallText` + `sapUiTinyMarginTop`. `dashboard-patterns.md` decision table gets an 8th row (`sap.f.GridContainer` for card grids). `validate-project-instructions.md` retracts the "inline CSS is a legitimate customization" carve-out. `migrate_widget` Phase 3 gains a no-plugin-CSS emission rule; Phase 5b Residue Gate adds five new detection greps + verification-table rows.
**Previous Update (2026-07-07 · Cat 29 + M60-M63)**: Real-world HTML5→POD 2.0 migration post-mortem — the migrator overwhelmingly picks composition where a standard KPI/microchart control exists, and hides it behind a custom CSS class that pretends to be theme-tokenized. New rules to fix the bias:
- **Cat 29** in `migration-suspect-list.md` — "Custom composite where a standard SAPUI5 control exists" with seven anti-pattern rows (S1-S7 from a real migration), each with grep detection and a standard-control replacement.
- **M60** — Custom control class for pure display composition (`extend("...CustomVBox")` with only set-forwarders) → use `sap.m.GenericTile` + `NumericContent`.
- **M61** — Custom CSS reproducing Fiori tokens (`.lmKpiBig{font-size:1.5rem;font-weight:700}`) → use the semantic control (`sap.m.ObjectNumber emphasized`, `NumericContent`, `NumericHeader`, `ObjectStatus state`).
- **M62** — View model stores pre-formatted strings (`"85.4 %"`) that block numeric standard-control properties — always keep raw floats/ints.
- **M63** — `Fragment.load` popover keyed off a microchart shape — microcharts have no per-shape click; use `sap.viz.ui5.controls.VizFrame` or an adjacent table row-press.
- `dashboard-patterns.md` has a new **§"Prime directive: standard control BEFORE composite BEFORE custom control"** and a **§"Chart→control decision table"** the migrate_widget prompt now cites in Phase 3 as a hard gate.
- Phase 5b Residue Gate adds four new checks (M60/M61/M63/orphan-i18n) plus the orphan-i18n grep helper.

**Previous Update (2026-07-07 · M50-M59 batch)**: Real-world HTML5→POD 2.0 migration traps against SAP DM 2026-07 (UI5 v1.136.15). M50 ComponentWidget bootstrap chain (6 cascading pitfalls — use plain `Widget`); M51 `ModelPath.SelectedPlant` does not exist (use `ModelPath.Plant`; callback receives a Plant object); M52 `sap/m/items.js` phantom 404 (recovery cascade from an earlier fatal — look higher in console); M53 microchart color property nuances (`ValueColor` vs `ValueCSSColor` vs `IconColor`); M54 `LineMicroChartPoint` has no `color`/`emphasized` (use `LineMicroChartEmphasizedPoint`); M55 list-binding template conflict (attribute-binding + `<aggregation>` wrapper); M56 `FlexAlignItems` values have no `Flex` prefix; M57 `sap.f.Header` does not exist (`sap.f.cards.Header`); M58 `sap.m.App` as widget root breaks embedded slot; M59 widget-owned shell bar is redundant.
**Previous Update (2026-07-07 · morning)**: Added #41 (Non-existent module paths — `sap/m/Item`, `sap/m/Icon` etc. cause runtime 404 during plugin load; base `Item`/`Icon`/`Control`/`Fragment`/`HTML` live in `sap/ui/core`, not `sap/m`), #42 (Custom control via `.extend()` without a `renderer` in metadata — UI5 falls back to loading `<Name>Renderer.js` and hits a 404), #43 (Passing a `String` to a UI5 numeric property — `LineMicroChartPoint.x` etc. reject strings with `"1" is of type string, expected float`). Added #39 (Wrong Base Class — LayoutWidget instead of Widget causes immediate crash; also covers missing `await super.onInit()`). Added #40 (Unescaped curly braces/single quotes in i18n — `formatMessage: pattern syntax error`).
**Previous Update (2026-06-30)**: Clarified #32 — the i18n prefix for widget metadata is now **always the widget's camelCase short name** (e.g. `coating.displayName`, `stepStatus.category`). The generic `widget.*` prefix is deprecated. All reference examples already follow this convention.
**Previous Update (2026-06-24)**: Tightened #33 — the Widget pattern is now spelled out as a verbatim three-line preamble (`const oView = this.getView(); oView.setBusyIndicatorDelay(0); oView.setBusy(true);`). `this.setBusy(...)`, inline `new BusyIndicator(...)` from `sap/m/BusyIndicator`, and single-control workarounds (`oTable.setBusy()`) are now explicit anti-patterns. `setBusyIndicatorDelay(0)` is mandatory, not optional.
**Previous Update (2026-06-11)**: Added #33 (BusyIndicator in Actions — use `sap/ui/core/BusyIndicator`, not view-based `setBusy()`), #34 (locale-aware number parsing — never `parseFloat()` user input), #35 (i18nCustomModel registration is mandatory in `onInit()`). Also added the **Marking Intentional Deviations** section below.
**Previous Update (2026-06-08)**: Added #31 (Control ID must be first constructor argument), #32 (don't hardcode the `Category` from examples – use the spec value).
**Previous Update (2026-05-22)**: Added #29 (SFC status is a string), #30 (i18n: "SFC" stays in code, becomes "PSN" in German UI).

---

## Marking Intentional Deviations (read this before fixing anything)

Not every deviation from a default Best-Practice in this catalog is a bug. A user may **intentionally** style a UI element with inline CSS, use a non-standard control, or pick a different pattern for good reasons (brand colors, pixel-precise visuals, customer-specific business logic, …).

When the validator (`validate_project` tool/prompt) finds such a deviation, it should **report** it for visibility — but it should **not** auto-fix it without the user's explicit consent. Three inline marker tags signal intent:

| Marker | Effect |
|---|---|
| `// validate: ignore — <reason>` | Drop the finding entirely. Do NOT report it. |
| `// validate: info-only — <reason>` | Report but force severity to **ℹ️ Info** and `Auto-fixable: NO`. |
| `// validate: accepted-deviation — <reason>` | Same as `info-only`, plus the reason text appears verbatim as a "Notes" field in the report. |

The reason text after the em-dash is optional but **strongly encouraged** — it documents the *why* for future readers (humans and AI agents).

### When to use which marker

- **`ignore`** — when the finding is genuinely irrelevant for this code path (e.g. a vendored 3rd-party file you can't change; a one-line shim that's about to be deleted).
- **`info-only`** — the most common case. The pattern is intentional and the user accepts visibility in the report but no auto-fix.
- **`accepted-deviation`** — when an architectural decision deviates from the default (e.g. polling instead of subscribe). Helpful for code reviews months later.

### Examples

```javascript
// validate: accepted-deviation — polling required, plant MES has no push channel
setInterval(() => this._refresh(), 30_000);
```

```javascript
// validate: accepted-deviation — customer brand color from design system, applied via
// theme parameter (NOT inline style)
const BRAND_COLOR = "#FF6F00";   // used only via sap.ui.core.theming.Parameters.get()
```

```javascript
// validate: ignore — vendored library, do not modify
const oldStyle = require("legacy/lib");
```

**Styling deviations use a different marker.** `sap/ui/core/HTML` with `<style>`, inline `style=`, plugin CSS files, and non-Fiori-prefix `addStyleClass` are governed by the **M61 umbrella** — they are NOT downgradable by `validate: info-only`. To keep an intentional deviation, use the dedicated marker:

```javascript
// standard-only: exception — logo SVG served from CMS, no standard control renders trusted HTML from URL
new HTML({ content: sTrustedCmsSnippet });
```

Missing marker → M61 error. Present marker → Info-level finding with the reason surfaced as a "Notes" row. See `common-mistakes-ui.md` §"Mistake #61" for the full rule.

### Heuristic safety net (no marker needed)

If a code-level finding is **directly preceded by a multi-line comment block (≥2 lines)** that contains a justification keyword (`because`, `intentional`, `customization`, `customer`, `bewusst`, `weil`, `Kunde`, …), the validator will **automatically** downgrade the finding to **ℹ️ Info** and disable auto-fix.

**Important carve-out**: this heuristic downgrade does NOT apply to M61 (plugin CSS surface), M60 (custom control template), M43 (String → numeric property), or Cat 29 (custom composite vs. standard control) — those are Rule-3 hard findings that require the specific `standard-only: exception — <reason>` marker instead of a free-form justification comment.

Example of a legitimate downgrade under the heuristic (polling instead of subscribe):

```javascript
// The plant MES exposes only a poll interface. Push via WebSocket / MessageBroker
// is not available; a subscribe pattern is therefore impossible. This 30s interval
// matches the MES data-refresh cadence and is stopped in onExit().
this.#nRefreshTimer = setInterval(() => this._refresh(), 30_000);
```

### What CANNOT be downgraded

Some checks are about **broken** code, not preferences. They cannot be silenced by `info-only` or the heuristic — only by an explicit `validate: ignore` (where the user knowingly takes the risk) or, for M60/M61/M43/Cat 29, the dedicated `standard-only: exception — <reason>` marker:

- M0 / M2 / M15 — `extension.json` structural validity (broken upload)
- M3 — wrong `PodContext` import path (404 at runtime)
- M5 — wrong subscribe callback parameter order (TypeError)
- M14 — model not initialized before bindings (broken binding)
- M29 — SFC status as number (silent filter failure)
- M31 — control ID via `setId()` / property (POD lifecycle assertion fails)
- M39 — wrong base class LayoutWidget/ControlWidget (immediate crash on load)
- M41 — non-existent AMD module path (`sap/m/Item`, `sap/m/Icon`, … — 404 at plugin-load)
- M42 — custom control `.extend()` without `renderer` in metadata (404 at plugin-load)
- M43 — String passed to UI5 numeric property (`validateProperty` throws)
- M60 — custom control class for pure display composition (template masquerading as control)
- M61 — plugin CSS surface (physical `.css` without loader / inline `style=` / `HTML` with `<style>` / non-Fiori-prefix `addStyleClass`)
- M64 — `MessageStrip.link` aggregation type-check (only accepts `sap.m.Link`)
- M65 — `_createView(oConfig)` — `oConfig` is undefined at runtime; use `this.getConfig()`
- M70 — silent information loss via standard-control bias (missing `## Composite:` mapping block or missing `## Field-coverage report` in verification)
- Cat 29 — custom composite where a standard SAPUI5 control exists (S1-S7)
- API version Errors when the used version no longer exists in `list_rest_apis`

For everything else, the markers and heuristic apply. See the validator's `Phase 3c — User Customizations & Severity Mapping` section in `docu/validate-project-instructions.md` for the full rules.

---

## Things That Are NOT Mistakes (common false positives)

The following patterns are sometimes flagged by overly strict comparison against the `Customer.Coating` reference example, but they are **perfectly valid** and must NOT be treated as findings:

| Pattern | Why it's valid |
|---|---|
| **Backend/API calls in a Widget** (`ApiClient`, `RestClient`, `fetch()`) | Widgets MAY load display data at runtime. Coating happens to not do this (it relies on PodContext data set by Actions), but this is just one valid architecture — not a universal rule. Only flag if the call is clearly *business logic* that belongs in an Action (Start/Complete/Serialize/ReportQuantity). |
| **`async onInit()` or `async _createView()` with `await`** | The framework explicitly supports async lifecycle methods for data loading. |
| **Helper/utility modules in `util/`** | Not every plugin needs a Context singleton. Simple helpers are fine. |
| **More files than Coating** | Coating is a mid-complexity reference. Larger plugins may have additional util modules, multiple actions, or sub-views. |
| **Different control choices** (e.g. `sap.m.List` instead of manual VBox) | As long as the root control gets `oConfig.id` as first positional arg, the specific control choice is up to the developer. |

> **Rule of thumb for validators:** The reference examples demonstrate *one correct way* — not *the only correct way*. If a pattern works at runtime, follows the lifecycle contract, and doesn't hit a known mistake from the catalog below, it is valid.

---

## Category Index

> **Note**: Mistake content is split into category files for efficient loading.
> Load only the category you need — each file is ~200-500 lines.

**🚀 Setup & File Generation** ([`common-mistakes-setup.md`](common-mistakes-setup.md))
> Namespace, extension.json structure, flat file layout, zip packaging (#0, #1, #1B, #2, #15, #16)

**💾 Lifecycle & Memory** ([`common-mistakes-lifecycle.md`](common-mistakes-lifecycle.md))
> onExit/unsubscribe, dialog destruction, model init order, BusyIndicator, i18nCustomModel, wrong base class, ComponentWidget bootstrap trap, _createView() no-args, _createView() runs before onInit() (#3-#5, #19, #33, #35, #39, #50, #65, #66)

**📦 Imports & Dependencies** ([`common-mistakes-imports.md`](common-mistakes-imports.md))
> PodContext import path, PlacementType, ModelPath constants, third-party libs, deprecated SAPUI5 enum imports, non-existent module paths, sap.f.Header namespace trap, notification-subscribe `onMessage` key & `Logger.warn()` (#6-#9, #11, #36-#38, #41, #57, #71)

**🎨 UI & Bindings** ([`common-mistakes-ui.md`](common-mistakes-ui.md))
> styleClass (`class` vs `addStyleClass`), expression binding, view ID, multi-part binding null checks, control IDs, custom control renderer, numeric property type mismatch, XML aggregation phantom 404, microchart color enum nuances, EmphasizedPoint vs Point, list-binding template conflict, FlexAlignItems value naming, viewport-shell root controls, redundant widget-owned shell, custom-control-as-template, Fiori-token CSS reproduction, pre-formatted-string view model, microchart-shape popover, MessageStrip.link aggregates Link, information loss via standard-control bias, M60/M61/M70 umbrellas (#10, #12-#13, #17, #20, #28, #31, #42, #43, #52-#56, #58, #59, #60-#64, #70)

**⚙️ Configuration & Properties** ([`common-mistakes-config.md`](common-mistakes-config.md))
> PropertyEditor defaults, callback parameter order, property exclusion, CustomPanel vs sap.m.Panel, widget metadata i18n keys, PodContext onExit unsubscribe deep-dive (#14 — canonical lifecycle rule; #1 is a summary stub), GrowingJSONModel paging (#18) (#14, #18, #21-#22, #25-#26, #32)

**🔄 Data, State & TableWidget** ([`common-mistakes-data.md`](common-mistakes-data.md))
> Column/cell index mismatch, GrowingJSONModel paging, selection sync with PodContext, SFC status types, locale-aware number parsing, ModelPath.Plant callback receives an object, internal/app-router API hard-wired into plugin source (#23-#24, #27, #29, #34, #51, #72)

**🌍 Internationalization** ([`common-mistakes-i18n.md`](common-mistakes-i18n.md))
> German SFC→PSN translation, MessageFormat escaping (braces/quotes) (#30, #40)

---

> **To load mistake content**, use `get_pattern_doc` with a category file name:
> - `common-mistakes-setup` — namespace, extension.json, file layout
> - `common-mistakes-lifecycle` — onExit, dialogs, BusyIndicator
> - `common-mistakes-imports` — import paths, deprecated imports
> - `common-mistakes-ui` — bindings, styleClass, control IDs
> - `common-mistakes-config` — properties, CustomPanel, metadata
> - `common-mistakes-data` — TableWidget, selection sync, number parsing
> - `common-mistakes-i18n` — German translations

