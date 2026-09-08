# Migration Suspect List — Easy-to-Miss Features

> **Purpose**: When migrating an existing POD 2.0 widget/plugin (or refactoring 3rd-party code), agents systematically overlook small-but-critical UX features. This file is the canonical **"things to look for"** checklist.
>
> **Usage**: Loaded by the `migrate_widget` MCP prompt during the **Feature Inventory** phase. Every category here MUST be actively scanned in the source code; matches MUST be recorded in `MIGRATION_INVENTORY.md`.

---

## Why this exists

Anecdotal evidence (real customer migration, June 2026):

> *"Der Agent war anfangs sehr zuversichtlich und hat losgelegt. Das Ergebnis war fast sofort lauffähig — das Problem war, dass viele kleine Features nicht übernommen wurden. Es fing an beim Input-Errorstate, ging über i18n-Zahlenformatierung bis zu Summenzeilen in Tabellen."*

The agent took the **happy path** of the source code and treated everything else as "details". That is exactly the failure mode this checklist prevents.

---

## How to use this list (for the migration agent)

For EACH category below:

1. Execute the **Detection Patterns** against every source file (grep/regex/AST).
2. For EACH hit, create an entry in `MIGRATION_INVENTORY.md` with: `id`, `category`, `sourceFile:line`, `snippet`, `description`, `target-pattern` (filled in Phase 3).
3. After implementation, mark each entry in `MIGRATION_VERIFICATION.md` as ✅ migrated / ⚠️ intentionally dropped (with reason) / ❌ open.

> **Forbidden**: silently skipping a category. If a category does not apply, say so explicitly in the inventory.

---

## Category 1 — Input Validation State (valueState)

**Why often missed**: Looks like cosmetic UI styling; agents focus on "the validation logic" and forget to wire up the visual feedback.

**Detection patterns**:

- `.setValueState(`
- `.setValueStateText(`
- `valueState:`
- `valueStateText:`
- `state: "Error" | "Warning" | "Success"`

**POD 2.0 target pattern**:
- Input/ComboBox/DatePicker: keep `setValueState("Error"|"Warning"|"Success"|"None")` and `setValueStateText(<i18n message>)`.
- For binding-based state: bind `valueState` and `valueStateText` to the view model.
- Use `sap.ui.core.ValueState` enum constants — not magic strings — when imported.

**Reference**: `docu/form-patterns.md`, `docu/common-mistakes.md`.

---

## Category 2 — Error / Success / Warning Messages

**Why often missed**: Agents convert all messages into a single `MessageToast.show("…")` losing the severity distinction.

**Detection patterns**:

- `MessageToast.show(`
- `MessageBox.error(` / `.warning(` / `.information(` / `.success(` / `.confirm(`
- `MessageHistory` references (POD 2.0)

**POD 2.0 target pattern**:
- Persistent/blocking errors → `MessageBox.error` or `MessageHistory.showError`.
- Soft confirmations → `MessageToast.show`.
- Confirm dialogs → `MessageBox.confirm` with `onClose` callback.
- Preserve the **severity** of every message — never down-grade an error to a toast.

---

## Category 3 — Number Formatting / i18n Number Parsing

**Why often missed**: Source uses `Number(x)`, `x.toFixed(2)`, or string concatenation. Locale-aware formatting is invisible until a German user sees `1.234,56` rendered as `1234.56`.

**Detection patterns**:

- `Number(`, `parseFloat(`, `parseInt(`
- `.toFixed(`
- `NumberFormat.getFloatInstance` / `getIntegerInstance` / `getCurrencyInstance`
- `formatter:` referencing numbers
- String concatenations like `"...: " + value` where value is numeric

**POD 2.0 target pattern**:
- Use `sap.ui.core.format.NumberFormat.getFloatInstance({...})` with locale.
- For bindings: use `type: "sap.ui.model.type.Float"` with `formatOptions`.
- For currencies/quantities: use `Unit` type or `NumberFormat.getUnitInstance`.
- **Never** concatenate raw numbers into i18n strings — use placeholders `{0}`, `{1}` and `ResourceBundle.getText(key, [arg0, arg1])`.

---

## Category 4 — Date / Time Formatting

**Why often missed**: Same as numbers — `new Date().toString()` looks fine to the agent but breaks localisation.

**Detection patterns**:

- `new Date(`
- `.toISOString(` / `.toLocaleString(`
- `DateFormat.getDateInstance` / `getTimeInstance` / `getDateTimeInstance`
- `DateTimeUtils` (POD 2.0 helper)

**POD 2.0 target pattern**:
- Use `sap.dm.dme.pod2.DateTimeUtils` for plant-time-zone aware formatting.
- For bindings: `type: "sap.ui.model.type.Date"` or `DateTime`.
- Always pass through plant time zone — never assume UTC or browser-local.

---

## Category 5 — Table Aggregations (Sum / Count / Avg, Footer-Row)

**Why often missed**: Aggregations live in `_recalculate*()`-style helpers and in column header VBoxes; agents copy the column definitions but skip the helper.

**Detection patterns**:

- `_recalculate` / `recalc` / `updateTotals` / `sumRow` / `aggregate`
- `.reduce(` over table arrays
- `totalWidth`, `totalWeight`, `sumX`, `countX` model paths
- Column headers containing `VBox` with extra text below the title (sum display)
- `<Toolbar slot="footer">` patterns

**POD 2.0 target pattern**:
- Keep the `_recalculate*` helper but make it idempotent.
- Bind footer/header cells to model paths (`/table/totalX`) — never set text directly.
- For dynamic state (e.g. total exceeds maximum → red): bind `state` of `ObjectStatus` to a `widthState` model path with `"Success" | "Warning" | "Error"`.

**Example from migration source**:
```js
const totalWidth = aItems.reduce((sum, item) => sum + Number(item.width || 0), 0);
this._oViewModel.setProperty("/table/totalWidth", totalWidth.toFixed(2));
this._oViewModel.setProperty("/table/widthState",
    totalWidth <= maxWidth ? "Success" : "Error");
```

---

## Category 6 — Color-Coded Status (ObjectStatus, valueState, Icon colors)

**Why often missed**: Looks decorative. The agent migrates the `text:` binding but drops the `state:` binding.

**Detection patterns**:

- `new ObjectStatus(`
- `state: "Success" | "Warning" | "Error" | "Information" | "None" | "Indication<N>"`
- `state: "{...}"` (state bound to model path — important!)
- `inverted: true`
- `Icon` with `color:` property

**POD 2.0 target pattern**:
- Preserve ALL `state` bindings AND their model-path companions.
- Keep `inverted` flag (badge-style) if present.
- For dynamic colors: bind to a dedicated model path (`/x/state`), update via `setProperty` in business logic.

---

## Category 7 — Busy / Loading States

**Why often missed**: Agents drop `BusyIndicator.show/hide` because the migrated code "feels synchronous". The result: long REST calls freeze the UI silently.

**Detection patterns**:

- `BusyIndicator.show` / `.hide`
- `setBusy(true)` / `setBusy(false)`
- `busy:` binding
- `busyIndicatorDelay`

**POD 2.0 target pattern**:
- Always wrap async work in try/finally with `setBusy(false)` in the `finally` block.
- Or bind `busy: "{view>/loading}"` and toggle the model.
- See common-mistakes M23.

```js
this.setBusy(true);
try {
    await this._doWork();
} finally {
    this.setBusy(false);   // MUST be in finally
}
```

---

## Category 8 — State Machines (cascading flags)

**Why often missed**: A source widget often uses 4–6 boolean flags that depend on each other (e.g. `enabled`, `lockSaveEnabled`, `unlockEnabled`, `delete`, `table.enabled`). Agents migrate the flags individually and lose the transition logic.

**Detection patterns**:

- Multiple `setProperty("/x/enabled", …)` calls in the same handler
- Status string comparisons: `if (status === "ENABLED")` / `"DISABLED"` / `"PRODUCTIVE"` / `"ACTIVE"`
- Switch/case on a status field
- Functions named `_updateUiState`, `_refreshButtons`, `_applyStatus`

**POD 2.0 target pattern**:
- **Centralize** state transitions in a single `_applyStatus(status)` method.
- Document each state → flag-matrix in a JSDoc comment.
- Consider a state-enum (`const STATUS = Object.freeze({ ENABLED: "ENABLED", … });`).

---

## Category 9 — Calculated Fields (live formulas)

**Why often missed**: Formula is hidden in a `liveChange` handler; agent migrates the field but loses the recalculation trigger.

**Detection patterns**:

- `Math.PI` / `Math.pow` / `Math.sqrt` / `Math.round` etc. in event handlers
- Numeric formulas referencing multiple model paths
- Handlers named `_recalculate*`, `_compute*`, `_derive*`

**POD 2.0 target pattern**:
- Keep the formula intact (copy verbatim, then refactor).
- Wire ALL trigger events: `liveChange`, `change`, plus initial calculation on data load.
- For tables: recalculate **for all rows** after any inner/outer change — not just the edited row.

---

## Category 10 — Cross-Field Validation

**Why often missed**: Validation that depends on TWO fields (e.g. `inner < outer`) is often buried after the per-field validation and gets dropped.

**Detection patterns**:

- Conditions referencing two distinct `setProperty`/`getProperty` paths inside an `if`
- Error messages mentioning "must be less than" / "must be greater than" / "before" / "after"
- Validation helpers named `_validateConsistency`, `_validateCross`

**POD 2.0 target pattern**:
- Centralize in `_validateAll()` → calls per-field + cross-field; returns boolean.
- Highlight BOTH fields with red `valueState` simultaneously.
- Run cross-field validation on every change of either side.

---

## Category 11 — Range Validation (min/max from config)

**Why often missed**: Source pulls min/max from a config object (e.g. `fetchConfigData.SetPointConfigs.CUTTING_INNER_DIAMETER_MIN`). Agents drop the config wiring and hard-code limits or skip validation.

**Detection patterns**:

- `MIN` / `MAX` constants compared in `if` blocks
- `SetPointConfigs`, `config.limits.*`, `*_MIN_*`, `*_MAX_*`
- Magic numbers in validation handlers (often a sign of inlined config)

**POD 2.0 target pattern**:
- Resolve config via the existing extension API (Setpoints, Custom Data, etc.) and store under `this._oConfig` once.
- Use `Number(this._oConfig.minX)` / `Number(this._oConfig.maxX)` in validation — never hard-code.
- Surface limits in error messages: `"must be between {0} and {1}"` with placeholders.

---

## Category 12 — Dynamic List Options (per-row ComboBox items)

**Why often missed**: A ComboBox inside a table row sometimes has **row-specific** option lists (e.g. orderOptions filtered per material). Agents flatten this to a single global list.

**Detection patterns**:

- `orderOptions` / `itemsForRow` / `options` as a property on a row model
- `path: "view>orderOptions"` (binding to the row, not the global model)
- Logic that builds option arrays inside a `.map(...)` over rows

**POD 2.0 target pattern**:
- Preserve per-row option arrays in the row model.
- Bind ComboBox `items` to the row-local path (`view>orderOptions`).
- Re-build options whenever the parent data changes.

---

## Category 13 — Bulk Operations (Add-N, Multi-Select-Action)

**Why often missed**: A "++" button with a count input is small and easy to mistake for a debug helper. It is usually a real user feature.

**Detection patterns**:

- Button with `text: "++"` / `"+N"` / icon `add-product`
- Counter input adjacent to action buttons
- Handler with a `for (let i = 0; i < count; i++)` loop creating rows

**POD 2.0 target pattern**:
- Migrate the counter input AND the bulk handler.
- Respect max-position limits (`if (count + length > max) showError(…)`).
- Keep the selection-aware insertion (insert after selected row, fall back to end).

---

## Category 14 — Row Reordering (Up / Down / Drag&Drop)

**Why often missed**: Up/Down arrow buttons in a toolbar look "optional" but are essential when row order is business-relevant.

**Detection patterns**:

- Buttons with icons `navigation-up-arrow` / `navigation-down-arrow`
- Handlers named `_onUpRow`, `_onDownRow`, `_moveRow*`
- `indexOfItem` + array swap patterns
- `dragAndDropConfig`

**POD 2.0 target pattern**:
- Preserve reorder handlers AND re-numbering loop (`items.forEach((item, idx) => item.position = idx + 1)`).
- Maintain selection across the move (re-select the moved row).
- For DnD: keep `sap.ui.core.dnd.DragDropInfo` config.

---

## Category 15 \u2014 Tooltips & Accessibility

**Why often missed**: `tooltip` and `ariaLabel` properties look like decoration; agents drop them.

**Detection patterns**:

- `tooltip:`
- `ariaLabel:` / `ariaLabelledBy:`
- `placeholder:` (especially i18n-bound)
- `ariaDescribedBy:`

**POD 2.0 target pattern**:
- **All** interactive controls keep their tooltip/aria.
- Bind to i18n keys, never hard-code.
- Add tooltips to icon-only buttons even if absent in source (improvement).

---

## Category 16 \u2014 Keyboard Shortcuts / Hotkeys

**Why often missed**: Hotkeys are wired via `attachBrowserEvent` or POD2 Hotkey API and easy to overlook.

**Detection patterns**:

- `attachBrowserEvent("keydown", \u2026)` / `"keyup"` / `"keypress"`
- `KeyCodes.` references
- POD2: `getHotkeyService` / hotkey patterns
- `event.preventDefault()` in keyboard handlers

**POD 2.0 target pattern**:
- See `docu/hotkey-patterns.md`.
- Migrate to POD2 hotkey service when target environment supports it.

---

## Category 17 \u2014 Auto-Trigger on Init (initial lookup / pre-fill)

**Why often missed**: A line at the end of `_createView` triggers an initial data fetch via a synthetic event. Agents miss this and ship a widget that requires manual refresh.

**Detection patterns**:

- Handler invocations at the end of `_createView` / `onInit` / `onAfterRendering`
- Synthetic event objects (`{ getParameter: () => \u2026, getSource: () => \u2026 }`)
- Calls to `setTimeout(\u2026, 0)` after construction

**POD 2.0 target pattern**:
- Move initial fetch into `onInit` (or a dedicated `_loadInitial()` called from `onInit`).
- Prefer Promise/await over synthetic events.

---

## Category 18 \u2014 Visibility / Permission Properties

**Why often missed**: Widget properties like `showDeleteButton` configure visibility from the POD designer. Agents see "another property" and may forget to wire it to the actual UI element.

**Detection patterns**:

- `getProperties()` entries with BooleanPropertyEditor
- `visible: this.getPropertyValue("show\u2026")`
- `visible: "{\u2026}"` bindings

**POD 2.0 target pattern**:
- Preserve EVERY widget property in `getProperties()`.
- Wire `visible` / `enabled` to the property value via `getPropertyValue`.
- Provide a sensible default in `getDefaultConfig()`.

---

## Category 19 \u2014 Empty / Loading / Error Templates

**Why often missed**: Source uses `noDataText`, custom empty-state, or skeleton; agent leaves the table as-is and gets a blank canvas in production.

**Detection patterns**:

- `noDataText:`
- `IllustratedMessage`
- `setNoDataText`
- Conditional rendering: `if (items.length === 0) { \u2026 }`

**POD 2.0 target pattern**:
- Set `noDataText` to an i18n key (`{i18nX>noData}`).
- For loading: use `busy: true` instead of swapping content.
- For error: render an `IllustratedMessage` with retry button.

---

## Category 20 \u2014 Cleanup Lifecycle (`onExit`, unsubscribe, destroy)

**Why often missed**: Source might leak subscriptions. Even if it does \u2014 the migration MUST clean up. Common-mistakes #1 covers this.

**Detection patterns**:

- `PodContext.subscribe` without a matching `unsubscribe` in `onExit`
- `setInterval` / `setTimeout` retained as instance refs
- Dialogs without `afterClose: () => destroy()` (see common-mistakes M19)

**POD 2.0 target pattern**:
- For every `subscribe(\u2026)`: matching `unsubscribe(\u2026)` with the SAME callback reference.
- For dialogs: `afterClose: function() { this.destroy(); }`.
- For timers: clear in `onExit`.

---

## Bonus: Hidden Bugs to FIX during migration (not just preserve)

These are bugs in the source code that the migration agent should fix rather than faithfully reproduce. Flag each in `MIGRATION_INVENTORY.md` with category `BUG` and propose a fix in `MIGRATION_MAPPING.md`.

### B1 \u2014 Tagged-Template misuse on `getI18nText`

Pattern (in pseudo-code): `this.getI18nText("some.key")` followed *without a comma* by a template literal in backticks. This is a **tagged-template** invocation, not a function call \u2014 the value is dropped and the i18n key is called as the tag function.

**Example (from a real migration):**

```text
MessageBox.error(this.getI18nText("coating.error.maxPos") `${iMaxPositions}`);
```

Note the **space + backticks** after `getI18nText(\u2026)`. This is a parser-level trap.

**Fix:** use proper placeholder substitution via the i18n bundle:

```js
MessageBox.error(this.getI18nText("coating.error.maxPos", [iMaxPositions]));
// i18n.properties: coating.error.maxPos=Maximum allowed positions is {0}
```

### B2 \u2014 Undeclared globals from DOM IDs

Pattern: code references `innerInput.setValueState(\u2026)` without `this.` or a `byId` lookup. UI5 leaks element IDs into the global scope; the code "works" but is fragile under strict mode / iframes / multiple instances.

**Fix:** resolve via `this.byId(\u2026)` or keep instance refs (private class fields `this.#oInnerInput = new Input({\u2026})`).

### B3 \u2014 Async function without proper error handling

Pattern: `async` handler with `try` but no `catch`, only `finally`. Errors propagate as unhandled promise rejections. Always add `catch (e) { Logger.error(\u2026, e); MessageBox.error(\u2026); }`.

### B4 \u2014 Module-level `let` outside the class

Pattern: `let toolNumber, oTable, getSelectedItemData, emptyModel, \u2026` at the module level (outside the class). These act as **singletons across all widget instances** \u2192 cross-instance contamination.

**Fix:** move to private class fields (`#toolNumber`) or local handler variables.

### B5 \u2014 Comparing numeric SFC status

Pattern: `if (sfcStatusCode === 401)`. The current API delivers SFC status as a string, so `=== "401"` is required. See common-mistakes M29.

### B6 \u2014 Hard-coded dates in tooltips or labels

Pattern: `title="Fallback-Daten (30.06.2026)"` \u2014 a specific calendar date pasted into markup. **Fix:** derive from a real timestamp (`DateFormat.getDateInstance().format(dLastRefreshed)`).

### B7 \u2014 Static "N sec ago" strings

Pattern: `"Zuletzt vor 7 Sekunde(n)"` or `"7 sec ago"` rendered as literal HTML without any actual elapsed-time computation. **Fix:** compute from a stored `Date` reference; format via a duration helper or refresh the label on the same interval that reloads the data.

### B8 \u2014 Comment vs. code drift on intervals

Pattern: `// Auto-refresh alle 60s` above `setInterval(fn, 30_000)`. **Fix:** re-derive the interval from the actual constant; move the constant into a widget property so the comment lie becomes structurally impossible.

### B9 \u2014 `setInterval` handle never stored

Pattern: `setInterval(fn, 30_000)` at script root \u2014 the returned handle is discarded, so nothing can `clearInterval` it. In a POD 2.0 widget this leaks the timer past `onExit`. **Fix:** store as `this.#nIntervalId` and clear in `onExit()` (Cat 20).

### B10 \u2014 `AbortSignal.timeout(...)` on fetch

Pattern: `fetch(url, { signal: AbortSignal.timeout(3000) })`. **Fix:** the entire `fetch` block is being replaced with `ODataV4Client` (Cat 22) \u2014 request-level timeout/retry is handled by the client; the `AbortSignal.timeout` disappears.

### B11 \u2014 Non-existent AMD module paths guessed from the class name

Pattern: `"sap/m/Item"` / `"sap/m/Icon"` / `"sap/m/HTML"` etc. in the `sap.ui.define([...])` import block. The class name is `sap.m.Item` but the module lives in `sap/ui/core/Item` \u2014 the wrong path gives a **404 at plugin-load time**, silently breaking the widget with

```
Error loading custom module \u2026 \u2014 Error: ModuleError: Failed to resolve dependencies of
'\u2026/widget/<Name>Widget.js' -> 'sap/m/Item.js': failed to load 'sap/m/Item.js' \u2026 404
```

Agents that "derive" the module path from the fully-qualified class name are especially prone during HTML5 migrations (Chart.js labels \u2192 `sap.m.Icon`, dropdown items \u2192 `sap.m.Item`, custom overlays \u2192 `sap.m.HTML`).

**Fix**: use the canonical AMD path from `get_ui5_api` \u2014 `module` field in the response. Trap list: `Item`, `Icon`, `ListItem`, `Element`, `Control`, `Fragment`, `HTML` all live in `sap/ui/core/`, not `sap/m/`. See common-mistake **#41** for the full mapping.

### B12 \u2014 Loader method name vs. body divergence

Pattern: a method named `_load<Entity>` whose body loads a **different** entity \u2014 typically caused by copy-paste when a plugin has multiple `_load*` methods and the developer forgets to change the OData path.

**Example (a real bug caught during migration review):**

```js
/** Load recent downtime events from MDO DOWNTIME entity. */
async _loadDowntime() {
    //   $select: "WORKCENTER,START_DATE_TIME,...,REASON_CODE"       // JSDoc says DOWNTIME
    const aRows = this._fixture("DATA_COLLECTION");                  // body loads DATA_COLLECTION
    this.#oJSONModel.setProperty("/dcParameters", aRows);            // and writes to the DC path
}
```

The widget "works" because the DC data appears \u2014 but there is no DOWNTIME data anywhere, the DC data appears twice (via `_loadDataCollection` too if it exists), and the JSDoc lies. The bug survives review because the widget renders correctly.

**Fix**: ensure the method name, the JSDoc, the OData `$path` in `getAllPages("/\u2026", \u2026)`, and the JSONModel target path all refer to the same entity. When a plugin has multiple `_load*` methods, cross-check names and bodies before shipping.

**Detection heuristic**: for every `async _load<Entity>()` method, the body should contain either `"/<Entity>"` as an OData path OR `_fixture("<Entity>")`, matching the method name (case-insensitive, `snake_case` OK). Divergence \u2192 flag.

---

## Category 21 \u2014 Chart Libraries (Chart.js / d3 / plotly / echarts / apexcharts)

**Why often missed**: HTML5 dashboards commonly load Chart.js from a CDN. Agents "keep the visual" by porting Chart.js configuration verbatim into a POD 2.0 plugin \u2014 which then breaks POD Designer preview, CSP, and offline mode.

**Detection patterns**:

- `new Chart(` / `Chart.register` / `Chart.defaults` / `<script src=".*chart\.js"`
- `d3.select(` / `d3.scaleLinear(` / `import * as d3`
- `Plotly.newPlot(` / `Plotly.react(`
- `echarts.init(` / `echarts.registerTheme`
- `apexcharts` / `new ApexCharts(`
- Chart registry patterns: `CR[id].destroy()`, `Chart.instances`

**line_monitor.html anchors**:
- `:635` \u2014 `function destroyChart(id){if(CR[id]){CR[id].destroy();...}}`
- `:995` \u2014 `CR['orderChart']=new Chart(...)`
- `:1089` \u2014 `CR[sid]=new Chart(cv,{...})`

**POD 2.0 target pattern**:
- Every chart type is mapped in `chart-migration-map.md`.
- Never keep Chart.js \u2014 remove the `<script>` tag; remove imports; remove the registry.
- Chart destruction is handled by UI5 lifecycle \u2014 do NOT port `chart.destroy()`.

**Reference**: `chart-migration-map.md`, `tablecell-patterns.md` \u00a7BulletMicroChart / \u00a7LineMicroChart.

---

## Category 22 \u2014 Native `fetch` / `XMLHttpRequest` / `$.ajax` / `axios`

**Why often missed**: A migration agent may keep the `fetch` call "temporarily" and never wire the widget to `ODataV4Client`. Result: broken CORS, broken auth, silent 401 in production.

**Detection patterns**:

- `fetch(` (native)
- `XMLHttpRequest`, `xhr.open(`
- `$.ajax(`, `$.get(`, `$.post(`
- `axios.` (any method)

**line_monitor.html anchors**:
- `:669` \u2014 `await fetch('http://localhost:3737/api/oee?period=\u2026', { signal: AbortSignal.timeout(3000) })` \u2014 target: `ODataV4Client` against MDO `OEE` entity.

**MDO view \u2192 MDO entity map** (populate more rows as needed):
| Source view name | MDO entity |
|---|---|
| `SAP_MDO_OEE_V` | `OEE` |
| `SAP_MDO_ORDER_V` | `ORDER` |
| `SAP_MDO_SFC_V` | `SFC` |
| `SAP_MDO_DOWNTIME_V` | `DOWNTIME` |
| `SAP_MDO_DATA_COLLECTION_V` | `DATA_COLLECTION` |
| `SAP_MDO_STANDARD_RATE_V` | `STANDARD_RATE` |

**POD 2.0 target pattern**:
- For MDO views: `sap/dm/dme/pod2/api/ODataV4Client` \u2014 see `basics.md` \u00a7"OData V4 for Custom Queries" and `mdo-extractor-reference.md`.
- For SAP DM REST APIs: `ApiClient.rest.<service>.<method>` \u2014 see `pod2-public-api-pattern.md`.
- Never inline URL literals \u2014 go through the API clients.

**Reference**: `html5-migration-guide.md` \u00a7"fetch() \u2192 ODataV4Client", `mdo-extractor-reference.md`.

---

## Category 23 \u2014 Module-Level Mutable State (`let` / `var` at script root, `window.*` writes)

**Why often missed**: In a plain HTML page module-level `let` is idiomatic. In a POD 2.0 widget module, the same code becomes a **cross-instance singleton** \u2014 two widgets on the same POD trample each other.

**Detection patterns**:

- `^\s*(let|var|const)\s+\w+\s*=` at `<script>` block root (any assignment outside a function/class body)
- `window\.[a-zA-Z_]+\s*=`
- `Object\.defineProperty\(window,`
- Any read of `window.foo` where `foo` was written earlier in the module

**line_monitor.html anchors**:
- `:604-609` \u2014 `let visibleWC = new Set(WCS); let currentWC = null; let currentPeriod = 'today'; let currentOrder = 'all'; let activeTab = 'produktion'; let activeDetailTab = 'dProd';`
- `:649-650` \u2014 `let autoRefreshTimer = null; let liveDataMode = false;`
- `:758-760` \u2014 `Object.defineProperty(window, 'visibleRes', { get() { \u2026 } })`

**POD 2.0 target pattern**:
- Private class fields on the widget: `#currentPeriod = "today"`, `#visibleWorkCenters = new Set()`.
- If state must be shared **between widget and action(s)**: a Context singleton \u2014 see `Customer.Coating/context/CoatingContext.js`.
- Computed getters replace `Object.defineProperty(window,\u2026)` \u2014 as getter methods on the class.

**Related bug**: B4 (module-level `let` outside class).

**Reference**: `html5-migration-guide.md` \u00a7"Module-level let \u2192 private fields".

---

## Category 24 \u2014 Custom `<div>`-based Gantt / Timeline (CSS `left:%` + `width:%`)

**Why often missed**: A CSS Gantt has no obvious UI5 analogue. Agents copy the CSS and call it "done" \u2014 which breaks theming, accessibility, and POD Designer preview.

**Detection patterns**:

- CSS class names matching `/gantt|timeline|now-line|schedule-bar/`
- Inline `style="left:*%"` combined with `style="width:*%"` stacked in rows
- CSS rules with `.gantt-track`, `.gantt-cell`, `.dt-bar` (downtime), `.now-line`

**line_monitor.html anchors**:
- CSS block at `:148-153` \u2014 `.gantt-track { overflow:visible; }`
- Render fn near `:1149-1206` \u2014 computes `nowMin / 1440 * 100` percentage, iterates hourly tick labels `['00:00', \u2026 '22:00']`.

**POD 2.0 target pattern**:
- **Primary target**: `sap.gantt.GanttChart` / `sap.gantt.simple.GanttChartWithTable` \u2014 verify with `get_ui5_api`.
- **Fallback (bespoke composite)** \u2014 only when all of: <5 rows, no dependency arrows, no drag/resize, time-slice bars only. Shape: VBox of row HBoxes, each HBox with a track composed of `ProgressIndicator` + inner FlexItemData positioning.
- Full fallback rules in `chart-migration-map.md` \u00a7"Custom div-Gantt".

**Note**: A dashboard reference plugin is deliberately NOT shipped as an example — the temptation to reproduce every dashboard shape as a custom control / composite is exactly the anti-pattern this category catches. Follow `dashboard-patterns.md` §"Chart→control decision table" instead.

**Reference**: `chart-migration-map.md`.

---

## Category 25 \u2014 Inline `onclick=` / `onchange=` / `document.addEventListener`

**Why often missed**: An agent may transliterate `onclick="foo()"` to a UI5 method named `foo()` but forget to `attachPress`, resulting in a dead button.

**Detection patterns**:

- `on(click|change|input|keydown|submit|mousedown|mouseup|focus|blur)=` HTML attributes
- `document\.addEventListener\(`
- `element\.addEventListener\(` in inline scripts
- `window\.addEventListener\(` at module root

**line_monitor.html anchors**:
- `:260` \u2014 `<button ... onclick="manualRefresh()">\u21bb</button>`
- `:288-298` \u2014 dropdown / filter click handlers on multiple buttons and inputs
- `:314-317` \u2014 tab buttons `onclick="setTab('produktion', this)"`
- `:330` \u2014 `<a onclick="goBack()">\u2190 Main Page</a>`
- `:727` \u2014 `document.addEventListener('click', closeDropdown)`

**POD 2.0 target pattern**:
- UI5 controls with `attachPress` / `attachChange` / `attachLiveChange`: bind to widget methods via `oControl.attachPress(this._onFoo, this)`.
- Auto-clean when the view is destroyed. No manual `detach` needed except if you attach on `document` (rare \u2014 track the fn reference and remove in `onExit`).
- Never inject inline event attributes into `sap.ui.core.HTML`.

**Reference**: `html5-migration-guide.md` \u00a7"Inline onclick \u2192 attachPress".

---

## Category 26 \u2014 Emoji glyphs used as icons

**Why often missed**: Emoji "just work" in a browser but fail accessibility (no screen-reader label), theming (no dark-mode contrast), and print. They also depend on the OS font stack and can render differently on Windows/macOS/Linux.

**Detection patterns**:

- Single-character emoji in text content of `<button>` / `<span>` / `<div>` used as an icon (regex `[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]`)
- Emoji inside JS string literals used for status: `'\ud83d\udfe2 Live'`, `'\ud83d\udfe1 Fallback'`, `'\ud83d\udd34 Offline'`
- Emoji inside i18n bundle values

**line_monitor.html anchors**:
- `:259` \u2014 shell-bar `\ud83d\udd14`
- `:271`, `:336` \u2014 page-header `\ud83d\udd14 0`
- `:654` \u2014 `'\ud83d\udfe2 Live'` / `'\ud83d\udfe1 Fallback-Daten (30.06.2026)'`
- `:662` \u2014 `'Offline \u2013 Fallback'` (this one is text, not emoji, but same category \u2014 visual status without icon)
- Buttons: `\ud83d\udd0d \ud83c\udfa7 \ud83c\udfed \ud83d\udccd \ud83d\udc64 \u2753` in the shell bar (search / call / plant / location / user / help)

**POD 2.0 target pattern**:
- `sap-icon://` from the SAP icon font \u2014 plus a `tooltip` for accessibility.
- Status glyphs \u2192 `sap.ui.core.IconColor` (`Positive`, `Critical`, `Negative`, `Neutral`) on an `Icon` or via `sap.m.ObjectStatus` `state`.
- Common mappings:
  | Emoji | sap-icon | Color |
  |---|---|---|
  | \ud83d\udd14 | `bell` | (none) |
  | \ud83d\udfe2 | `status-positive` | `Positive` |
  | \ud83d\udfe1 | `status-critical` | `Critical` |
  | \ud83d\udd34 | `status-negative` | `Negative` |
  | \ud83d\udd0d | `search` | (none) |
  | \ud83d\udcca | `bar-chart` / `line-chart` | (none) |
  | \ud83d\udccb | `clipboard` | (none) |
  | \ud83c\udfed | `factory` | (none) |
  | \ud83d\udc64 | `person-placeholder` | (none) |

**Reference**: `html5-migration-guide.md` \u00a7"Emoji icons \u2192 sap-icon", `get_ui5_api({ symbol: "sap/ui/core/IconPool" })`.

---

## Category 27 \u2014 Locale hard-coded (`toLocaleTimeString('de-DE')`, `DD.MM.YYYY` strings)

**Why often missed**: Source-code timestamp formatting frequently hard-codes `'de-DE'` \u2014 invisible until an English-speaking user sees `1.234,56` where they expect `1,234.56`.

**Detection patterns**:

- `toLocaleString\(` / `toLocaleDateString\(` / `toLocaleTimeString\(` with literal locale
- `'de-DE'` / `'en-GB'` / `'en-US'` / `'fr-FR'` etc. anywhere in JS
- Date strings baked as `DD.MM.YYYY` in data literals
- Chart tooltip titles containing a specific calendar date (e.g. `"29.06.2026"`)

**line_monitor.html anchors**:
- `:642` \u2014 `new Date().toLocaleTimeString('de-DE', {hour, minute, second: '2-digit'})`
- `:654` \u2014 `'\ud83d\udfe2 Live \u00b7 ' + new Date().toLocaleTimeString('de-DE')`
- `:662` \u2014 `new Date().toLocaleTimeString('de-DE')`
- `:1198` \u2014 `title="${now.toLocaleTimeString('en-GB')}"` \u2014 **inconsistent locale in the same file**
- `:1101` \u2014 Chart tooltip title `"29.06.2026"` (hard-coded string, related to B6)

**POD 2.0 target pattern**:
- `sap.ui.core.format.DateFormat.getTimeInstance({style: "medium"})` \u2014 respects the UI5 locale.
- Locale comes from `sap/ui/core/Configuration.getLanguage()` (set by the POD shell).
- Numbers: `sap.ui.core.format.NumberFormat.getFloatInstance({minFractionDigits, maxFractionDigits})` \u2014 respects the UI5 locale for decimal separator and grouping.

**Related**: Cat 3 (Number formatting), Cat 4 (Date/time), M34 (locale-aware number parsing).

**Reference**: `html5-migration-guide.md` \u00a7"toLocaleTimeString \u2192 DateFormat".

---

## Category 28 \u2014 Threshold constants inlined in conditionals (magic numbers)

**Why often missed**: A threshold like "OEE \u2265 65 % is good" is a plant/customer setting, not a physical constant. Hard-coding it means the customer cannot tune the dashboard without a redeploy.

**Detection patterns**:

- Ternary chains with 3+ literal numeric thresholds: `v >= 65 ? 'pos' : v >= 30 ? 'crit' : 'neg'`
- Multiple call sites with the same magic number (`>20`, `>10`, `<90` appearing repeatedly)
- Class-name helpers `oeeClass(v)`, `scrapClass(v)`, `availabilityClass(v)` with literal thresholds inside

**line_monitor.html anchors**:
- `:617` \u2014 `const oeeClass = v => v >= 65 ? 'pos' : v >= 30 ? 'crit' : 'neg'`
- `:874`, `:989`, `:1355`, `:1358`, `:1401`, `:1468` \u2014 scrap-rate thresholds `sr > 20` / `sr > 10` (six sites)
- `:890` \u2014 availability thresholds `mn >= 99.9` / `mn >= 99`
- `:1330` \u2014 good-qty ratio thresholds `>= 0.9` / `>= 0.7`
- `:1491` \u2014 `avgSc > 15` \u2192 red

**POD 2.0 target pattern**:
- Declare widget properties (see `property-editors.md`): `oeeGoodThreshold`, `oeeWarningThreshold`, `scrapCritThreshold`, `scrapWarnThreshold`, etc.
- `getConfigProperties()` returns them with sensible defaults (65, 30, 20, 10, 99.9, 99, ...).
- The class-name / state helper reads from `this.getConfig()` at render time.

**Reference**: `property-editors.md`.

---

## Category 29 — Custom composite where a standard SAPUI5 control exists

> **Specialisation of [`basics.md`](basics.md) §0 — Prime Directive: Standard Controls Before Custom.** Cat 29 catches the ladder-skip at the composite level — rung 3 (compose standard controls) got replaced by "build a fake standard control out of `VBox` + `Text` + `ObjectStatus` + custom CSS". The 4-rung Escalation Ladder (search alternatives → escalate within family → compose → custom only after team alignment) covers every one of the S1-S7 anti-patterns below; each has a rung-2 or rung-3 replacement.

**Why often missed**: The migrator's default bias is to reproduce a hand-built HTML5 component (KPI card, timeline strip, "last-indicator" panel, table-totals row) as a composition of `VBox` + `Text` + `ObjectStatus` + custom CSS. Fiori theme tokens don't propagate into hand-drawn compositions, PropertyEditor bindings feel less natural, and the plugin ends up visually *close to* Fiori but off-brand. A real HTML5 dashboard migration had to iterate through six refactor rounds — each round swapped more of the hand-built widget body for pure standard controls, halved the CSS, and deleted a whole custom control class. The suspect list below is the post-mortem of those rounds.

**Prime Directive pointer**: The 80%-rule prose lives once, in [`basics.md`](basics.md) §0. Cat 29 is the migration-scoped enforcement of that rule — see §0 for the full 4-rung Escalation Ladder wording.

**Detection patterns (`S1`–`S7` from a real migration post-mortem)**:

| # | Custom composite the agent built | Standard replacement | Grep target |
|---|---|---|---|
| S1 | `KpiTileControl extends CustomVBox` (Title + ObjectStatus + Text) driven by threshold helpers | `sap.m.GenericTile` frameType `OneByOne` + `TileContent` + `NumericContent` (`indicator: Up/Down/None`, `valueColor: Good/Critical/Error/Neutral`) | `widget/control/*Tile*.js`, `extend("sap/dm/dme/pod2/control/CustomVBox"` used as a KPI display |
| S2 | Div-based Gantt / timeline (`<HBox renderType="Div" width="X%"/>` + absolute-positioned icons + hour-tick axis) | `sap.m.GenericTile` `TwoByOne` + `sap.suite.ui.microchart.BulletMicroChart` — or real `sap.gantt.simple.GanttChartWithTable` if interactive editing is needed | `renderType="Div"` with `width="{= ... + '%'}"`, `position:absolute` in the plugin CSS |
| S3 | Hand-built "data collection" cards: `Panel` + `Toolbar` + `VBox` + `ObjectStatus class="lmKpiBig"` + big Text row for min→latest→max (chart-substitute) | `sap.f.Card` + `sap.f.cards.NumericHeader` + `sap.suite.ui.microchart.LineMicroChart` using M55 Pattern A (`points="{path:'lm>samples'}"` + implicit `<LineMicroChartPoint x="{lm>x}" y="{lm>y}"/>` child template) | fragment comments saying "sparkline deferred", inline `min/latest/max HBox` as a chart substitute |
| S4 | 3-cell target/actual/needed KPI cluster inside a Panel (VBox+Text+`lmKpiBig` × 3) + `ProgressIndicator` + formula footer text | `sap.f.Card` + `NumericHeader` (`number = "actual / target"`, `state`, `trend`) + `sap.suite.ui.microchart.RadialMicroChart` (`percentage = pct`) — matches `chart-migration-map.md` "single-percentage KPI" row | any `Panel` where three sibling `VBox`es each contain one big number + one label |
| S5 | "Last indicator" small info card: `Panel backgroundDesign="Solid"` + `Text class="lmLabel"` + `HBox` with `ObjectStatus class="lmKpiBig"` + Text for age/target range | `sap.f.Card` + `NumericHeader` (`title=name`, `subtitle=targetRange`, `number=latest`, `unitOfMeasurement=unit`, `state`, `trend`, `details=ageText`) | any `Panel` containing exactly one big number + one unit + one age string |
| S6 | "Totals" row under a table — `HBox class="lmTotalsRow"` with 3-4× `VBox class="lmTotalCell"` containing `Text class="lmKpiBig"` + `Text class="lmLabel"` | Row of small `sap.m.GenericTile` frameType `OneByHalf` + `NumericContent` (unit via `TileContent.unit`, `valueColor` from state) | any `HBox` at the bottom of a Table where each cell is one big number + one label |
| S7 | Custom CSS reproducing Fiori typography (`.lmKpiBig{font-size:1.5rem;font-weight:700}`, `.lmKpiSub`, `.lmValueBig`, `.lmValue`, `.lmTextSuccess/Error`) applied to plain `Text`/`ObjectStatus` — **and more broadly**, ANY `widget/css/*.css` file without a documented `includeStyleSheet`/`css!` loader call, ANY inline `style="..."` in XML, ANY `sap.ui.core.HTML` with `<style>` or `style=`, ANY `addStyleClass("<non-Fiori-prefix>Foo")`. | Use the semantic control instead: `sap.m.ObjectNumber emphasized="true"` for prominent numbers, `NumericContent` for tile-scale numbers, `ObjectStatus state=` for good/error colouring, `sapUi{Tiny,Small,Medium,Large}Margin*` for spacing. Fiori theme tokens handle sizing. **See common-mistake M61** for the full umbrella rule (whitelist, exception marker, complete grep list). | See M61 §"Detection patterns" for the six grep commands (physical CSS file / dead-CSS-loader / HTML-with-style / inline style / non-whitelisted addStyleClass / non-whitelisted class=). |

**POD 2.0 target pattern**:
- Lookup: `dashboard-patterns.md` §"Chart→control decision table" — must be cited (or explicitly deviated with a justification) for every KPI-tile / info-card / timeline / totals-row composite in `MIGRATION_MAPPING.md`.
- Data-model discipline: keep raw numerics (`float`/`int`) in the view model; add a separate `*Text` string field only if a `Text.text` binding still consumes it. See `dashboard-patterns.md` §"Data-model discipline".
- Custom control emission: allowed **only** when the composite encapsulates reusable behavior (event, state machine, non-trivial rendering) AND the same composite appears 3+ times AND no standard control from the decision table fits. Template convenience belongs in fragments, not in a control class. See M60.
- Orphan i18n gate: every replaced composite typically frees 3-6 i18n keys — grep and delete in the same commit. See `dashboard-patterns.md` §"Orphan-i18n gate".

**Related**:
- Cat 21 (Chart libs) — the microcharts used as replacements.
- Cat 24 (Custom div-Gantt) — S2 is the same anti-pattern surfaced from a different angle.
- Cat 28 (Magic thresholds) — S1/S4 both hardcode thresholds in the composite; the replacement moves them to widget properties.
- Common-mistakes **M60** (custom control as template), **M61** (custom CSS reproducing Fiori tokens), **M62** (pre-formatted strings block standard controls), **M63** (fragment popover keyed off a microchart shape).
- `dashboard-patterns.md` §"Prime Directive (dashboard scope): standard control BEFORE composite BEFORE custom control".
- `fiori-design-compliance.md` — positive Fiori design canon. Cat 29 says WHAT to replace (the composite → the standard control); `fiori-design-compliance.md` says WHY the standard control looks right (Fiori Design Guidelines) and how the migrator verifies the result in Phase 5c.

---

## Output Contract

After completing the inventory phase, the agent MUST produce a summary like:

> *"Found N features across 29 categories (Cat 1: K\u00d7 valueState, Cat 5: K\u00d7 table aggregation, Cat 8: 1\u00d7 N-state machine, Cat 21: K\u00d7 charts, Cat 22: K\u00d7 fetch, Cat 29: K\u00d7 custom-composite-vs-standard-control, \u2026) plus B BUGs. See `MIGRATION_INVENTORY.md`."*

For **`sourceFormat: "pod2"`** migrations, Cat 21-28 usually yield zero hits and Cat 29 is optional \u2014 state `"Cat N: 0 hits."` explicitly rather than skipping.
For **`sourceFormat: "html5"`** migrations, Cat 21-29 are the MOST IMPORTANT categories \u2014 they represent what a POD 1.0/HTML5 source cannot express natively, and specifically Cat 29 catches the migrator's default composition bias.

After implementation, the verification report MUST contain one row per inventory item with status \u2705 / \u26a0\ufe0f / \u274c and \u2014 for any \u274c \u2014 a justification (or the item gets re-opened).
