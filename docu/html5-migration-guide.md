# HTML5 → POD 2.0 Migration Guide

> **Purpose**: Mechanical rewrites for every common HTML5 pattern that has a POD 2.0 UI5 equivalent. Reach for this after `migrate_widget` has produced `MIGRATION_INVENTORY.md` — for each inventory row of Cat 21-28, look up the "before/after" here.

## Golden rules

1. Every `fetch(...)` becomes `ODataV4Client` or `ApiClient*` — no exceptions inside a POD 2.0 plugin unless the target is a non-DM service and the customer explicitly confirms.
2. Every Chart.js / d3 / plotly / echarts call is REMOVED and re-implemented per `chart-migration-map.md`.
3. Every module-level `let`/`var` becomes a private field on the widget class (`#privateName`).
4. Every `setInterval` gets a stored handle (`this.#nIntervalId`) and matching `clearInterval` in `onExit()`.
5. Every inline `onclick=`/`onchange=` becomes `attachPress`/`attachChange` on the UI5 control.
6. Every locale-hardcoded string (`'de-DE'`, `'en-GB'`) becomes `DateFormat` / `NumberFormat` driven by `sap/ui/core/Configuration.getLanguage()`.
7. Every `.toFixed(N)` becomes `NumberFormat.getFloatInstance({minFractionDigits:N,maxFractionDigits:N}).format(value)`.
8. Every `console.log` becomes `sap/base/Log` (Logger).
9. Every emoji glyph used as an icon (`🟢🟡🔴🔔`) becomes `sap-icon://` with `sap.ui.core.ValueState` for color + `tooltip=` for accessibility.
10. Every hard-coded threshold (`if (val > 20)`) becomes a widget property (see `property-editors.md`).
11. Every instance referenced from a binding `formatter:` closure (`NumberFormat`, `DateFormat`, `ODataV4Client`, `JSONModel`) is created inside `_createView()` **before** the view tree is built — NOT in `onInit()`. `_createView()` runs before `onInit()`, and UI5 evaluates formatter closures during control construction (see `common-mistakes-lifecycle.md` #M66). Use an idempotent `_ensureRuntime()` helper called from both hooks for defensive parity.
12. `_createView()` is invoked with **no arguments** — read the widget's config via `this.getConfig()` inside the method (see `common-mistakes-lifecycle.md` #M65).

> **UI5 API verification from within a POD plugin dir**: use `pod2-mcp-server.get_ui5_api({ symbol: "…" })` (or `search_ui5_api` when the class name is unclear). The UI5 API is bundled offline in the server — no `ui5.yaml`/`webapp/` needed in the plugin dir, no external MCP server. See `usage/CLAUDE.md` §"UI5 API lookup". Never `WebFetch` `https://ui5.sap.com/#/api/<Class>` — that URL is a SPA shell with no API payload.

## Rewrite recipes

### 1. `fetch()` → `ODataV4Client` (MDO)

Detection: `fetch(`, `XMLHttpRequest`, `$.ajax`, `axios.`.

❌ Before:
```js
const r = await fetch(`http://localhost:3737/api/oee?period=${p}`,
    { signal: AbortSignal.timeout(3000) });
const { orders } = await r.json();
```

✅ After (import block + method):
```js
sap.ui.define([
    "sap/dm/dme/pod2/api/ODataV4Client",
    "sap/base/Log"
], (ODataV4Client, Log) => {
    async _loadOee(sPlant, sPeriod) {
        try {
            const oClient = new ODataV4Client("/dmci/v4/extractor/");
            return await oClient.getAllPages("/OEE", {
                $filter: `PLANT eq '${sPlant}' and PERIOD_TYPE eq '${sPeriod}'`,
                $select: "WORK_CENTER,RESOURCE,LOADING_TIME,RUNNING_TIME,NET_PRODUCTION_TIME"
            });
        } catch (e) {
            Log.error("[Dashboard] failed to load OEE", e);
            throw e; // let caller show MessageStrip
        }
    }
```

Notes: confirm the exact API surface with `get_api_doc({name: "sap.dm.dme.pod2.api.ODataV4Client"})`. Never keep `AbortSignal.timeout` — the client handles request timeouts. MDO views (`SAP_MDO_OEE_V`, …) map 1:1 to MDO entities (`OEE`, `DOWNTIME`, …) — see `mdo-extractor-reference.md`.

### 2. `setInterval` → Timer pattern

Detection: `setInterval(`, `setTimeout(` (recurring).

❌ Before:
```js
setInterval(tryLoadLiveData, 30000);
setInterval(tick, 1000);
```

✅ After:
```js
class DashboardWidget extends LayoutWidget {
    #nRefreshTimer;
    #nClockTimer;

    onInit() {
        this.#nRefreshTimer = setInterval(() => this._safeRefresh(), 30_000);
        this.#nClockTimer   = setInterval(() => this._tick(), 1_000);
    }

    _safeRefresh() {
        if (this._isRunning()) return; // guard against overlap
        this._loadAll().catch(e => Log.error("[Dashboard] auto-refresh failed", e));
    }

    onExit() {
        if (this.#nRefreshTimer) { clearInterval(this.#nRefreshTimer); this.#nRefreshTimer = undefined; }
        if (this.#nClockTimer)   { clearInterval(this.#nClockTimer);   this.#nClockTimer   = undefined; }
        super.onExit();
    }
}
```

Cross-ref: `widget-patterns-core.md` §Timer & Interval Management.

### 3. Module-level `let`/`var` → private fields

Detection: `^\s*(let|var|const)\s+\w+\s*=` at script-block root; `window.foo = ...`; `Object.defineProperty(window, "foo", ...)`.

❌ Before:
```js
let visibleWC = new Set(WCS);
let currentPeriod = "today";
let currentOrder = "all";
Object.defineProperty(window, "visibleRes", {
    get() { return [...visibleWC].flatMap(wc => WC_META[wc].resources); }
});
```

✅ After:
```js
class DashboardWidget extends LayoutWidget {
    #visibleWC = new Set();       // initialised from PodContext plant filter
    #currentPeriod = "today";
    #currentOrder = "all";

    get _visibleRes() {
        return [...this.#visibleWC].flatMap(wc => this._wcMeta[wc].resources);
    }
}
```

Rationale: module-level mutable state is **shared across all widget instances** on the same POD → cross-instance contamination (B4 in `migration-suspect-list.md`). If state must be shared BETWEEN widget and action, use a Context singleton (see `Customer.Coating/context/CoatingContext.js`).

### 4. Inline `onclick=` / `document.addEventListener` → UI5 event handlers

Detection: `on(click|change|input|keydown|submit)=` attributes in markup; `document.addEventListener(`.

❌ Before:
```html
<button onclick="manualRefresh()">↻</button>
<select onchange="applyPeriod()">…</select>
```
```js
document.addEventListener("click", closeDropdown);
```

✅ After:
```js
const oBtn = new Button(oConfig.id + "--refresh", {
    icon: "sap-icon://refresh",
    tooltip: this.getI18nText("dashboard.refresh")
});
oBtn.attachPress(this._manualRefresh, this);

const oSel = new Select({ /* items … */ });
oSel.attachChange(this._applyPeriod, this);
```

The `attach*` methods automatically detach when the control is destroyed with the view. If you attach a document-level listener, track its function reference on a private field and remove it in `onExit`.

### 5. `.toFixed(N)` → `NumberFormat`

Detection: `\.toFixed\(`.

❌ Before:
```js
const s = (running / loading * 100).toFixed(1) + " %";
const q = qty.toFixed(2) + " ST";
```

✅ After (import `sap/ui/core/format/NumberFormat`):
```js
// Once, in _createView() BEFORE building the view (M66) — NOT in onInit(),
// which runs AFTER _createView() and would leave formatter closures reading
// this.#oPctFmt === undefined at first render:
this.#oPctFmt = NumberFormat.getFloatInstance({minFractionDigits:1, maxFractionDigits:1});
this.#oQtyFmt = NumberFormat.getFloatInstance({minFractionDigits:2, maxFractionDigits:2});

// At the call site:
const s = `${this.#oPctFmt.format(running / loading * 100)} %`;
const q = `${this.#oQtyFmt.format(qty)} ${this.getI18nText("unit.piece")}`;
```

Unit suffixes come from i18n (`unit.piece` → `ST` in `_de`, `PC` in `_en`).

### 6. `toLocaleTimeString('de-DE')` → `DateFormat`
Detection: `toLocaleTimeString(`, `toLocaleDateString(`, `'de-DE'`/`'en-GB'`/`'en-US'` literals.

❌ Before:
```js
const s = new Date().toLocaleTimeString('de-DE',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' });
```

✅ After (import `sap/ui/core/format/DateFormat`):
```js
// Once, in _createView() BEFORE building the view (M66) — the DateFormat instance
// is captured by any {path:"…", formatter: v => this.#oTimeFmt.format(v)} closure
// during control construction, which runs before onInit():
this.#oTimeFmt = DateFormat.getTimeInstance({ style: "medium" }); // respects UI5 locale
const s = this.#oTimeFmt.format(new Date());
```

The UI5 locale comes from `sap/ui/core/Configuration.getLanguage()` — set by the shell. For date-string parsing (source has `"30.06.2026"`): use `DateFormat.getDateInstance({pattern:"dd.MM.yyyy"}).parse(s)` — but prefer real `Date` objects in the model.

### 7. Emoji icons → `sap-icon://` + `ValueState`

Detection: single-character emoji in text content, especially in buttons/spans styled as icons.

❌ Before:
```html
<button>🔔</button>
<span>🟢 Live</span>
<span>🟡 Fallback-Daten</span>
```

✅ After:
```js
const oBell = new Button({
    icon: "sap-icon://bell",
    tooltip: this.getI18nText("dashboard.notifications")
});
const oLive = new HBox({ items: [
    new Icon({ src: "sap-icon://status-positive", color: IconColor.Positive }),
    new Text({ text: this.getI18nText("dashboard.status.live") })
]});
```

Emoji glyphs fail accessibility (screen readers), don't respect theme colors, and rely on the OS font stack. Icon library reference: `get_ui5_api({ symbol: "sap/ui/core/IconPool" })`. Common mappings: 🔔→`bell`, 🟢→`status-positive` (`IconColor.Positive`), 🟡→`status-critical` (`IconColor.Critical`), 🔴→`status-negative` (`IconColor.Negative`), 📊→`bar-chart`/`line-chart`, 📋→`clipboard`.

### 8. Chart.js `new Chart(...)` → UI5 chart

Detection: `new Chart(`, `Chart.defaults`, `Chart.register`, `<script src=".*chart\.js">`.

Look up the specific target in `chart-migration-map.md`. Short version: horizontal bar (order progress) → `sap.suite.ui.microchart.BulletMicroChart`; sparkline (DC series) → `LineMicroChart` + `LineMicroChartEmphasizedPoint` for out-of-spec points; multi-metric → `sap.viz.ui5.controls.VizFrame`.

❌ Before:
```js
CR["orderChart"] = new Chart(ctx, {
    type: "bar",
    data: { labels: ["Actual","Planned"],
            datasets: [{data:[tA,tP], backgroundColor:["#0070F2","#E8743B"]}]},
    options: { indexAxis: "y", /* … */ }
});
```

✅ After (BulletMicroChart in an order card; imports `sap/suite/ui/microchart/BulletMicroChart`, `BulletMicroChartData`, `ValueColor`):
```js
const oProgress = new BulletMicroChart({
    size: "M",
    scale: this.getI18nText("unit.piece"),
    actual:     new BulletMicroChartData({ value: tA, color: ValueColor.Good }),
    thresholds: [ new BulletMicroChartData({ value: tP, color: ValueColor.Neutral }) ]
});
```

Never keep the Chart.js registry (`CR[id].destroy()`) — UI5 lifecycles handle disposal.

### 9. `console.log` → `sap/base/Log`

Detection: `console\.(log|error|warn|info|debug)`.

❌ Before:
```js
console.error("Failed to load OEE", e);
```

✅ After (import `sap/base/Log`):
```js
Log.error("[Dashboard] failed to load OEE", e);
```

Namespace log lines with a component tag (`[Dashboard]`) so grepping the browser console over multiple widgets stays sane.

### 10. Hard-coded thresholds → widget properties

Detection: `if (val > 20 && val < 90) { … "crit" … }` — literal numeric thresholds in conditionals.

❌ Before:
```js
const oeeClass = v => v >= 65 ? "pos" : v >= 30 ? "crit" : "neg";
```

✅ After — declare widget properties (see `property-editors.md`):
```js
static getConfigProperties() {
    return [
        { name: "oeeGoodThreshold", type: "int", defaultValue: 65,
          propertyEditor: new IntegerPropertyEditor() },
        { name: "oeeWarningThreshold", type: "int", defaultValue: 30,
          propertyEditor: new IntegerPropertyEditor() }
    ];
}

_oeeState(v) {
    const good = this.getConfig().oeeGoodThreshold;
    const warn = this.getConfig().oeeWarningThreshold;
    return v >= good ? ValueState.Success : v >= warn ? ValueState.Warning : ValueState.Error;
}
```

Now the plant supervisor can tune thresholds in POD Designer without a redeploy.

## Anti-patterns (never do this)- Wrap the entire HTML5 source in a `sap.ui.core.HTML` control and call it a migration. Bypasses lifecycle, breaks theming, kills accessibility, blocks POD Designer preview.
- Load Chart.js via CDN at runtime — offline breaks, CSP prevents it, POD Designer preview fails.
- Port `chart.destroy()` — UI5 handles disposal; keeping it references a non-existent instance.
- Faithfully reproduce `.toFixed(1)` because "the source had it" — that IS the bug you are fixing.
- Copy comments like `// alle 60s` — they usually lie (source might actually be 30s). Recompute from the real interval.
- Show progress with `sap/m/BusyIndicator` — use the widget's built-in busy state / `LayoutWidget` busy API (see `common-mistakes-lifecycle.md` #M33).

## Cross-references

- `dashboard-patterns.md` — target dashboard shape (§"Fiori-native rendering rule: look native to SAP DM")
- `fiori-design-compliance.md` — positive Fiori design canon + Phase 5c review checklist
- `chart-migration-map.md` — chart library ↔ UI5 mapping
- `migration-suspect-list.md` Cat 21-28 — detection anchors
- `widget-patterns-core.md` §Timer, §Custom Controls, §i18n
- `common-mistakes-lifecycle.md` #M33 — busy-state rules
- `common-mistakes-data.md` #M34 — NumberFormat pattern
- `property-editors.md` — thresholds via properties
- `mdo-extractor-reference.md` — MDO entity reference

Cross-refs: `dashboard-patterns.md` (target-shape decision table), `chart-migration-map.md` (chart control mapping), `common-mistakes-ui.md` #M60 (no custom KPI-tile controls) / #M61 (no plugin CSS).