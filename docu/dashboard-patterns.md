# Dashboard Patterns

> **Purpose**: Blueprint for POD 2.0 monitoring/analytics dashboards — the widget shape you reach for when the source is an HTML5 line-monitor / KPI board / OEE view. Complements [`widget-patterns-core.md`](widget-patterns-core.md) (Timer, Custom Controls), [`widget-patterns-advanced.md`](widget-patterns-advanced.md) (ObjectStatus, Custom Widget Events), [`tablecell-patterns.md`](tablecell-patterns.md) (BulletMicroChart, LineMicroChart), and [`chart-migration-map.md`](chart-migration-map.md) (per-chart mapping).

---

## When to use this pattern

- Live line / work-center monitoring, OEE, downtime, KPI dashboards
- Multi-metric read-only surfaces with drill-down (Overview → Detail)
- Auto-refresh cadence (5-60s poll), NOT event-triggered

If the source is a single chart, a single table, or an editable form — this is the wrong pattern. Reach for `widget-patterns-core.md` (single-purpose widget) or `chart-migration-map.md` (chart-only).

---

## Prime Directive (dashboard scope): standard control BEFORE composite BEFORE custom control

> **Specialisation of [`basics.md`](basics.md) §0 — Prime Directive: Standard Controls Before Custom.**
>
> Before extending, compositing, or CSS-styling anything: name the standard UI5 control that already does 80 % of it — then justify (in `MIGRATION_MAPPING.md`) why that control was rejected. Silence = pick the standard.

This is the dashboard-scoped statement of the general **Escalation Ladder** in [`basics.md`](basics.md) §0. If the first-choice control is too small for the source, climb the ladder — search alternatives, then escalate within the family (see the "Escalate to" column below), then compose (`f:content` fragment inside a `sap.f.Card`), and only THEN — after team alignment and with a `// standard-only: exception — <reason>` marker — consider a custom control. `basics.md` §0 is the canonical rule; everything below is its dashboard specialisation.

The HTML5 migrator's default bias goes the other way: presented with a hand-built KPI card, it happily reproduces the composition in `VBox` + `ObjectStatus` + `Text` + custom CSS. That is visually functional, semantically off-brand, and doubles the CSS surface. Fiori theme tokens don't propagate into hand-drawn compositions; PropertyEditor bindings feel less natural; every screen looks *close to* Fiori but not on-brand.

The fix is a hard **standard-first bias**: look up the row in the [Chart→control decision table](#chart→control-decision-table) below **before** you write XML. **Read the Slots column BEFORE the First choice column** — the rule is "the SMALLEST standard control that fits ALL source fields", not "the first-choice control from the row that matched the primary KPI". If the source composite has more fields than the first-choice control has slots, escalate to the row named in the "Escalate to" column. If you cannot use any standard control, `MIGRATION_MAPPING.md` gets a one-sentence justification field. Empty justification = Phase-5 gate failure.

Related anti-patterns and their standard replacements are enumerated as **Cat 29** in `migration-suspect-list.md` (S1–S7 anti-patterns) and as common-mistakes **M60–M63** and **M70** in `common-mistakes-ui.md` — all specialisations of `basics.md` §0.

---

## Fiori-native rendering rule: look native to SAP DM

> **Complements — does not replace — the [Prime Directive](basics.md#§0-prime-directive-standard-controls-before-custom). Where the Prime Directive governs *which control* to pick, this rule governs *what the pick must look like*.**
>
> The output must be visually indistinguishable from a native SAP DM widget sitting next to it in the same POD 2.0 page.

Every widget the migrator produces ends up next to first-party widgets — if it uses a different icon set (emoji, Material, Font Awesome), a different typography scale (`font-size:1.5rem`), a different card padding (hand-tuned `Panel`), or a different color semantics (hex literals instead of `ValueState`), the plant supervisor immediately sees "third-party plugin". Off-brand visual is a shipping defect.

**Load `fiori-design-compliance.md` at Phase 1 alongside `dashboard-patterns.md`.** It contains the positive Fiori design canon: a Fiori design decision table for Card vs. Panel / DynamicPage vs. Page / MessageBox vs. Strip vs. Toast / IllustratedMessage empty states / sap-icon iconography, canonical Fiori Design Guideline URLs (`experience.sap.com/fiori-design-web/`), typography/color/spacing rules — and the 10-checkbox Phase 5c compliance review that every HTML5 migration must pass before sign-off. The negative M61 CSS-ban tells the migrator what NOT to do; `fiori-design-compliance.md` tells it what the output must LOOK like.

When source and Fiori conflict — the HTML5 used red/yellow/green emoji dots, Fiori uses `sap.ui.core.IconColor` + `sap-icon://status-*`; the source had a hand-tuned `1.5rem` font-size, Fiori has a native scale via `sap.m.Title level=` — **Fiori wins**. The user gets a chance in Phase 5c to explicitly approve source-preserved deviations.

---

## Anatomy of a dashboard

```
┌────────────────────────────────────────────────────────────────┐
│  Line Monitor — <plant>            [Live] 14:03:22   [Refresh] │  ← header region
├────────────────────────────────────────────────────────────────┤
│  Plant: <combo>   Period: <today|shift|week>   [Apply]         │  ← filter bar
├────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ OEE 82% │ │ Avail   │ │ Perf    │ │ Quality │              │  ← KPI tile row
│  │ Success │ │ 91%     │ │ 88%     │ │ 99.2%   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
├────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │ OEE trend (line)    │  │ Downtime (donut)    │             │  ← chart row
│  └─────────────────────┘  └─────────────────────┘             │
├────────────────────────────────────────────────────────────────┤
│  Work Center table (drill-down on row press)                   │  ← table row
└────────────────────────────────────────────────────────────────┘
    Home > WorkCenter WC-01                                          ← breadcrumb → detail
```

Each region maps to exactly one UI5 building block — see the table below.

---

## Building blocks (mapping table)

| Region                        | UI5 control                                                                                     | Notes                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Header (title + clock + refresh) | `CustomHBox` + `CustomText` + Button                                                         | See `widget-patterns-core.md` §Custom Controls            |
| Filter bar                    | `sap.m.Toolbar` + `ComboBox` / `SegmentedButton`                                                | Shared filter state via widget-scoped model               |
| KPI tile row                  | `CustomVBox` + `ObjectStatus`                                                                   | See Pattern 2 below                                       |
| Chart card                    | `sap.suite.ui.microchart.*` or `sap.viz.ui5.controls.VizFrame`                                  | See `chart-migration-map.md`                              |
| Data table with footer        | `sap.m.Table` + column footer                                                                   | Aggregates go into `<Column footer>`                      |
| Drill-down navigation         | `sap.m.NavContainer`                                                                            | See Pattern 3                                             |
| Auto-refresh                  | `Timer` from POD 2.0 utils                                                                      | See `widget-patterns-core.md` §Timer                      |
| Empty / loading / error       | `sap.m.IllustratedMessage` + `oView.setBusy()` + `sap.m.MessageStrip`                           | See Pattern 6                                             |
| Live-status pill              | `HBox` + `sap.ui.core.Icon` + `sap.m.Text` (with `ValueState`)                                  | See Pattern 7                                             |

---

## Pattern 1 — Plain `Widget` shell (default) — NOT `ComponentWidget`, NOT `LayoutWidget` in most cases

**Default base class for a dashboard migration: `sap.dm.dme.pod2.widget.Widget`.** Everything else has hidden cost.

- **`Widget`** — plain POD 2.0 widget. Runs the first time you upload. Use this unless you have a specific reason not to.
- **`LayoutWidget`** — only use when you actually wrap OTHER POD widgets as children (layout container that hosts nested widgets). Not needed to compose your own UI5 controls.
- **`ComponentWidget`** — do NOT use for HTML5 migrations. Its bootstrap chain has six cascading pitfalls (Component.js path, POD base component, Component-preload MIME, `IAsyncContentCreation`, async `rootView`, host router). See **common-mistake #50** for the full trap list. Only use when you are wrapping an existing standalone SAPUI5 Component.

### Widget lifecycle order (read this before Pattern 3+)

The POD 2.0 framework calls hooks in this order — **know it before you decide where instances go**:

```
constructor()  →  _createView()  →  onInit()
                         │                │
                UI5 evaluates       Now safe to seed models,
                binding formatter   PodContext.subscribe(...),
                closures IMMEDIATELY start Timer, etc.
                during control ctor.
```

**Consequence**: anything referenced from a binding `formatter:` closure (a `NumberFormat`, `DateFormat`, `ODataV4Client`, `JSONModel`, `_pctFmt`, …) MUST already exist when `_createView()` builds the control that owns the binding. If you initialise it later in `onInit()`, the first formatter call fires against `undefined` and throws — see **common-mistake #M66**.

`_createView()` is invoked by the framework with **no arguments** — the config is read via `this.getConfig()` inside the method. Do NOT declare `_createView(oConfig) { … }` — `oConfig` would be `undefined` at runtime. See **common-mistake #M65**.

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/NumberFormat",
    "sap/m/VBox",
    "sap/base/Log"
], (Widget, PodContext, ModelPath, I18nResourceModel, JSONModel, NumberFormat, VBox, Log) => {
    "use strict";

    class DashboardWidget extends Widget {

        static #oI18nModel = new I18nResourceModel("customer.custom.extensions.dashboard.i18n.i18n");
        static getI18nModel()   { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("dashboard.displayName"); }
        static getIcon()        { return "sap-icon://line-chart"; }
        static getCategory()    { return this.getI18nText("dashboard.category"); }
        static getDescription() { return this.getI18nText("dashboard.description"); }

        #oModel;
        #oPctFmt;
        #oQtyFmt;
        #nRefreshTimer;

        /**
         * Idempotent runtime helper. Everything referenced by a binding formatter
         * MUST be initialised here — this method is called from BOTH _createView()
         * (early, before controls are built) AND onInit() (defensive parity).
         */
        _ensureRuntime() {
            if (!this.#oPctFmt) {
                this.#oPctFmt = NumberFormat.getFloatInstance({ minFractionDigits: 1, maxFractionDigits: 1 });
                this.#oQtyFmt = NumberFormat.getFloatInstance({ minFractionDigits: 2, maxFractionDigits: 2 });
            }
            if (!this.#oModel) {
                this.#oModel = new JSONModel({
                    lastRefresh: null,
                    kpis:        { oee: 0, availability: 0, performance: 0, quality: 0 },
                    rows:        [],
                    error:       null
                });
            }
        }

        // _createView() runs BEFORE onInit(). Build the view tree here — and be sure
        // every binding-referenced instance already exists (see _ensureRuntime above).
        // The framework passes NO arguments — read config via this.getConfig(). (M65)
        _createView() {
            this._ensureRuntime();                               // must run BEFORE any control ctor with formatter bindings (M66)
            const oConfig = this.getConfig();                    // NOT _createView(oConfig) — that parameter is undefined (M65)

            const oRoot = new VBox(oConfig.id, {
                items: [
                    this._buildHeader(),
                    this._buildFilterBar(),
                    this._buildKpiRow(),
                    this._buildDetailArea()   // NavContainer, see Pattern 3
                ]
            });
            oRoot.setModel(this.#oModel);
            return oRoot;
        }

        onInit() {
            super.onInit();
            this._ensureRuntime();                               // idempotent — no-op if _createView already ran; defensive parity
            this.getPodRuntime().getView().setModel(DashboardWidget.getI18nModel(), "i18nDashboard");

            // Plant subscribe — see Pattern 5 for the correct ModelPath constant and value shape.
            PodContext.subscribe(ModelPath.Plant, this._onPlantChange, this);
        }

        onExit() {
            PodContext.unsubscribe(ModelPath.Plant, this._onPlantChange, this);
            if (this.#nRefreshTimer) { clearInterval(this.#nRefreshTimer); this.#nRefreshTimer = undefined; }
            super.onExit();
        }
    }
    return DashboardWidget;
});
```

Cross-ref: `widget-patterns-core.md` §Widget, `common-mistakes-lifecycle.md` #M50 (why not ComponentWidget), #M65 (`_createView()` takes no args), #M66 (`_createView()` runs before `onInit()`), `common-mistakes-ui.md` #M58 (why not `sap.m.App` at root), #M64 (MessageStrip.link aggregates Link, not Button).

---

## Pattern 2 — KPI tile row

**Default choice: `sap.m.GenericTile` + `sap.m.TileContent` + `sap.m.NumericContent`.** This is one line of XML per tile, Fiori-tokenized out of the box, and supports `valueColor` (`Good`/`Critical`/`Error`/`Neutral`) + `indicator` (`Up`/`Down`/`None`) via bound properties — no custom control needed.

```xml
<GenericTile header="{i18nDashboard>dashboard.kpi.oee}" frameType="OneByOne"
             press=".onOeeTilePress">
    <TileContent unit="%">
        <NumericContent value="{path: 'lm>/kpis/oee'}"
                        scale=""
                        indicator="{= ${lm>/kpis/oeeTrend} }"
                        valueColor="{= ${lm>/kpis/oee} >= ${config>/oeeGoodThreshold}
                                     ? 'Good'
                                     : ${lm>/kpis/oee} >= ${config>/oeeWarningThreshold}
                                       ? 'Critical'
                                       : 'Error' }" />
    </TileContent>
</GenericTile>
```

Threshold constants come from widget properties (see `property-editors.md`, `common-mistakes-config.md` for property editor patterns). Never inline magic numbers — cat 28.

Full standard-control catalog for other dashboard shapes: [§Chart→control decision table](#chart→control-decision-table) below.

### When NOT a KPI tile

- **KPI card with title + subtitle + big value + unit + trend** → `sap.f.Card` + `sap.f.cards.NumericHeader`. See the decision table row "Info card".
- **Single percentage vs. 100 %** → `sap.suite.ui.microchart.HarveyBallMicroChart` inside a `sap.f.Card`. Not a GenericTile.
- **Progress toward a numeric target** → `sap.suite.ui.microchart.BulletMicroChart` inside a `GenericTile` frameType `TwoByOne`.
- **Totals footer row under a table** → a row of small `GenericTile` frameType `OneByHalf` (each with a `NumericContent`), NOT a hand-built `HBox` of big-number VBoxes.

### Slot map — when to escalate `GenericTile` → `sap.f.Card` + `NumericHeader`

`GenericTile` is deliberately compact — it exposes exactly:

| Slot | Type | Notes |
|---|---|---|
| `header` | text | primary tile title (bound to i18n) |
| `subheader` | text | secondary title / period / context |
| `frameType` | enum | `OneByOne` / `TwoByOne` / `OneByHalf` |
| `TileContent.unit` | text | unit displayed to the right of the number |
| `TileContent.footer` | text | small caption below the content |
| `NumericContent.value` | float | the ONE big number |
| `NumericContent.scale` | text | short scale suffix (`k`, `M`, `%`) |
| `NumericContent.valueColor` | enum | `Good`/`Critical`/`Error`/`Neutral` |
| `NumericContent.indicator` | enum | `Up`/`Down`/`None` (trend arrow) |
| `NumericContent.icon` | string | optional `sap-icon://…` |

That's it. **One big number, one unit, one trend, one status color.** If the source tile carries any of the following, `GenericTile` is the WRONG target — escalate to `sap.f.Card` + `NumericHeader`:

- A progress bar / mini-chart alongside the big number
- Two or more label/value pairs (e.g. Planned / Good / Scrap absolutes)
- A sub-text describing sub-state ("Multiple orders in progress", "3 resources active")
- A status pill / badge ("OEE-relevant", "Under maintenance")
- More than one contextual line under the number (period + resource count + last-refresh)

`sap.f.Card` + `sap.f.cards.NumericHeader` exposes the full slot map below — every field above has a documented home:

```xml
<f:Card>
    <f:header>
        <fcard:NumericHeader
            title="{i18nDashboard>dashboard.card.oee}"                <!-- primary label            -->
            subtitle="{i18nDashboard>dashboard.card.oee.subtitle}"    <!-- period / resource context -->
            number="{path:'lm>/kpis/oee'}"                            <!-- big number (float)        -->
            scale="%"                                                 <!-- short scale suffix        -->
            unitOfMeasurement="{i18nDashboard>dashboard.unit.pct}"    <!-- unit line under number    -->
            state="{= ${lm>/kpis/oee} >= 85 ? 'Good' : 'Critical' }"  <!-- number color              -->
            trend="{lm>/kpis/oeeTrend}"                               <!-- Up/Down/None arrow         -->
            details="{i18nDashboard>dashboard.card.oee.details}"      <!-- sub-text (e.g. resource count) -->
            statusText="{i18nDashboard>dashboard.card.oee.status}">   <!-- status pill (10 chars max) -->
            <fcard:sideIndicators>
                <fcard:NumericSideIndicator title="{i18nDashboard>dashboard.card.availability}"
                                            number="{lm>/kpis/availability}" unit="%" state="Good"/>
                <fcard:NumericSideIndicator title="{i18nDashboard>dashboard.card.performance}"
                                            number="{lm>/kpis/performance}"  unit="%" state="Good"/>
            </fcard:sideIndicators>
        </fcard:NumericHeader>
    </f:header>

    <!-- Optional: a progress bar / microchart / mini-table lives in the body -->
    <f:content>
        <ProgressIndicator percentValue="{lm>/kpis/oee}"
                           state="{= ${lm>/kpis/oee} >= 85 ? 'Success' : 'Warning' }"
                           displayValue="{= ${lm>/kpis/oee} + ' % of target' }"/>
    </f:content>
</f:Card>
```

Namespaces: `xmlns:f="sap.f"`, `xmlns:fcard="sap.f.cards"`.

Slots exposed by `NumericHeader` (10 total):

| Slot | Type | Purpose |
|---|---|---|
| `title` | text | primary label |
| `subtitle` | text | secondary label / period / context |
| `number` | float | big number (raw numeric — see M62) |
| `scale` | text | short unit suffix appended to number (`k`, `M`, `%`) |
| `unitOfMeasurement` | text | separate line below the number for a longer unit |
| `state` | enum | `Good`/`Neutral`/`Critical`/`Error` — colors the number |
| `trend` | enum | `Up`/`Down`/`None` — trend arrow next to number |
| `details` | text | free sub-text line (e.g. "3 orders in progress") |
| `statusText` | text | short status pill in the header corner (10-char cap in Fiori spec) |
| `sideIndicators` | 0..2 × `sap.f.cards.NumericSideIndicator` | side-mounted sub-KPIs, each with `title`/`number`/`unit`/`state` |

Slots exposed by `sap.f.cards.NumericSideIndicator`:

| Slot | Type |
|---|---|
| `title` | text |
| `number` | float |
| `unit` | text |
| `state` | enum (`Good`/`Neutral`/`Critical`/`Error`) |

If the source carries **more than 2 sub-KPIs**, escalate one more step: put the additional metrics in the `f:content` slot as a `sap.m.Table` / `sap.ui.layout.Grid` of small `sap.m.ObjectStatus` rows. Do NOT drop them silently — see **common-mistake #M70**.

### Custom control ONLY when

A `<Name>Control.js` (extending `CustomVBox` or similar) is justified only when ALL of these hold:
1. The composite encapsulates **reusable behavior** — an event, a state machine, non-trivial rendering — not just a template.
2. The same composite appears 3+ times, with the same interactive contract.
3. No standard control from the decision table below fits without lossy compromise.

If the class body is only `set*` forwarders to `Title` / `ObjectStatus` / `Text`, it's a template — **use a fragment or an inline composite, not a control class**. Common-mistake **#M60** documents this trap.

Detection: `grep -rn 'extend("sap/dm/dme/pod2/control/CustomVBox"' widget/control/` — inspect each hit. If the body is set-forwarders only, refactor to `GenericTile` / `NumericContent` / `NumericHeader`.

---

## Chart→control decision table

Look up the data shape here **before** writing any XML. The migrator's Phase 3 mapping doc MUST cite a row from this table (or a one-sentence justification for deviating).

**Read the "Slots" column before the "First choice" column.** The rule is *"the smallest standard control that fits ALL source fields"* — not *"the first-choice control from the row that matched the primary KPI"*. If the source composite carries more fields than the first-choice control has slots, escalate to the row named in "Escalate to" — **do NOT silently drop fields**. See **common-mistake #M70** for the full information-preservation contract.

| Data shape | First choice | Slots (documented) | Escalate to if slots insufficient | Never build by hand |
|---|---|---|---|---|
| Single percentage vs. 100 % | `sap.suite.ui.microchart.HarveyBallMicroChart` in `sap.f.Card` | 1 percentage (0-100) + Card header/subtitle | "Info card" row (adds status/details/sideIndicators) | `sap.m.ProgressIndicator` inside a hand-drawn card |
| Progress toward a numeric target | `sap.suite.ui.microchart.BulletMicroChart` in `GenericTile` frameType `TwoByOne` | 1 actual + 1 target + 1 forecast + threshold ranges + tile header/subheader/footer | "Card with content" row (adds `sideIndicators`, `details`) | `<div>` track + %-width overlay |
| KPI tile (title + big number + unit + trend) | `GenericTile` frameType `OneByOne` + `TileContent` + `NumericContent` | `header`, `subheader`, `footer`, 1× `NumericContent` (`value`/`scale`/`valueColor`/`indicator` — one big number only) | "Info card" row if you need a **second sub-KPI, status text, or progress bar** | Custom control extending `CustomVBox` (see M60) |
| Info card (label + big value + unit + trend + subtitle + up to 2 sub-KPIs + status text) | `sap.f.Card` + `sap.f.cards.NumericHeader` | `title`, `subtitle`, `number`, `scale`, `unitOfMeasurement`, `state`, `trend`, `details`, `statusText`, `sideIndicators` (0-2 × `NumericSideIndicator` with `title`/`number`/`unit`/`state`) | "Card with content" row (adds progress bar / chart / table in the Card body) | `sap.m.Panel` + `VBox` + `ObjectStatus` with `class="lmKpiBig"` (see M61) |
| Card with content (header + progress bar / microchart / table in body) | `sap.f.Card` + `sap.f.cards.NumericHeader` + `content:` free control (`ProgressIndicator`, `BulletMicroChart`, `LineMicroChart`, small `Table`) | all `NumericHeader` slots above, plus a free UI5 control in the `content` aggregation (progress bar, chart, mini-table) | Split into 2 Cards side-by-side, OR promote to its own view/tab | Custom control that wraps a header + body composite (M60) |
| Timeline / 24h availability strip | one `BulletMicroChart` per resource, each in its own tile | 1 actual bar per resource + threshold ranges; one row per resource | `sap.gantt.simple.GanttChartWithTable` (if drag/zoom needed) | `renderType="Div"` %-bars + absolute-positioned icons (see M62 · Cat 24) |
| Sparkline over ≤30 points | `sap.suite.ui.microchart.LineMicroChart` (M55 pattern A) | N points (x/y), optional emphasized points, min/max lines, threshold; tile header via enclosing `GenericTile` | `sap.suite.ui.microchart.AreaMicroChart` (for min/max range shading) | `min → latest → max` Text row |
| Totals footer under a table | Row of small `GenericTile` frameType `OneByHalf` | one `NumericContent` per tile (`value` + `valueColor` + optional `scale`) | "Info card" row per totals column if each total needs sub-KPIs or status | `VBox` + `Text class="lmKpiBig"` × N (see M61) |
| PASS / FAIL status (single item) | `sap.m.ObjectStatus state="Success"/"Error"` with `sap-icon` | 1 text + 1 `state` + 1 icon | `sap.m.ObjectMarker` (adds `type=`), or a full "Info card" row if the status carries counts | Custom span + inline color |
| Trend arrow (Up / Down / None) | `NumericContent.indicator` + `valueColor` | 1 enum from `DeviationIndicator` (`Up`/`Down`/`None`) + `valueColor` | Full `NumericHeader.trend` (part of "Info card" row) | Custom SVG / emoji arrows |
| Chart with per-shape click (drill-down) | `sap.viz.ui5.controls.VizFrame` (has selection events) | dataset via `FlattenedDataset`, feed items, `selectData`/`deselectData` events with datum in payload | — (VizFrame is the escalation target for microcharts that need per-shape click) | `Fragment.load` popover keyed off a microchart shape (see M63) |
| Grouped grid of cards / KPI tiles | `sap.f.GridContainer` with `items` (responsive breakpoints built-in) | responsive breakpoints (S/M/L/XL) + gap; items are any Card/GenericTile/GenericHeader | `sap.ui.layout.Grid` (older layout with explicit column spans) | `HBox wrap="Wrap"` with a custom `min-width` CSS class (see M61) |

The migrator's Phase-3 output must reference the row picked (`"per dashboard-patterns.md §Chart→control decision table row 'KPI tile'"`). If the row's first choice is rejected, write ONE sentence in `MIGRATION_MAPPING.md` explaining why.

---

## Pattern 3 — Drill-down (Overview ↔ Detail)

Two approaches — pick by scope:

### A) NavContainer with two pages — widget-internal drill-down

Use when overview and detail live inside the **same** widget.

```javascript
import NavContainer from "sap/m/NavContainer";
import Page         from "sap/m/Page";

_buildDetailArea() {
    this.#oOverviewPage = new Page({ title: "Overview", content: [ this._buildWorkCenterTable() ] });
    this.#oDetailPage   = new Page({ title: "Detail",   showNavButton: true,
                                     navButtonPress: () => this.#oNav.back(),
                                     content: [ this._buildDetailContent() ] });
    this.#oNav = new NavContainer({ pages: [ this.#oOverviewPage, this.#oDetailPage ] });
    return this.#oNav;
}

_showDetail(sWorkCenter) {
    this._loadDetail(sWorkCenter);          // fills detail model
    this.#oNav.to(this.#oDetailPage);
}
```

### B) Custom Widget Events — cross-widget drill-down

Use when the detail lives in a **different** widget on the same POD page. Emit a widget event from the dashboard and let the detail widget subscribe. See `widget-patterns-advanced.md` §Custom Widget Events for the complete emit/subscribe contract.

**Rule of thumb**:
- Overview + detail in one widget → A (`NavContainer`)
- Overview widget + detail widget on the same POD page → B (Custom Widget Events)

---

## Pattern 4 — Auto-refresh with unified spinner

Start with the canonical `Timer` pattern from `widget-patterns-core.md` §Timer:

```javascript
import Timer from "sap/dm/dme/pod2/util/Timer";
import Log   from "sap/base/Log";

#oTimer;

async _startAutoRefresh() {
    this.#oTimer = new Timer({
        interval: this.getConfig().properties.refreshIntervalMs || 30000,
        callback: () => this._refresh()
    });
    this.#oTimer.start();
}

onExit() {
    if (this.#oTimer) { this.#oTimer.stop(); this.#oTimer = null; }
}
```

### One spinner for the whole dashboard

**Not** one `BusyIndicator` per tile — one widget-scoped busy for all parallel loads (M33):

```javascript
async _refresh() {
    if (this.#bLoading) return;                // debounce manual clicks
    this.#bLoading = true;
    const oView = this.getView();
    oView.setBusyIndicatorDelay(0);
    oView.setBusy(true);
    try {
        const [aKpis, aRows] = await Promise.all([
            this._loadKpis(),
            this._loadRows()
        ]);
        this.#oModel.setProperty("/kpis",        aKpis);
        this.#oModel.setProperty("/rows",        aRows);
        this.#oModel.setProperty("/lastRefresh", new Date());
        this.#oModel.setProperty("/liveState",   "Success");
        this.#oModel.setProperty("/error",       null);
    } catch (oErr) {
        Log.error("Dashboard refresh failed", oErr);
        this.#oModel.setProperty("/liveState", "Error");
        this.#oModel.setProperty("/error", oErr.message);
    } finally {
        oView.setBusy(false);
        this.#bLoading = false;
    }
}
```

### Silent auto-refresh failures

Since the user isn't necessarily looking, use `sap.m.MessageStrip` at the top of the dashboard — **not** a `MessageToast`. Bind visibility to `/error`.

### Last-refresh timestamp

Bind a `CustomText` in the header to `/lastRefresh` via a formatter using `sap.ui.core.format.DateFormat.getTimeInstance()` — never `toLocaleTimeString('de-DE')`, see anti-patterns below.

---

## Pattern 5 — Data loading via ODataV4Client (MDO)

For analytics use the MDO Extractor — see `basics.md` §"OData V4 for Custom Queries" and `mdo-extractor-reference.md` for entity coverage. **Never** `fetch()` directly.

```javascript
import ODataV4Client from "sap/dm/dme/pod2/api/ODataV4Client";
import PodContext    from "sap/dm/dme/pod2/context/PodContext";
import ModelPath     from "sap/dm/dme/pod2/context/ModelPath";
import Log           from "sap/base/Log";

// 1) Track the plant reactively — the callback receives a Plant OBJECT (not a string).
// The correct constant is ModelPath.Plant, NOT ModelPath.SelectedPlant (that doesn't exist).
// See common-mistake #M51.
onInit() {
    super.onInit();
    PodContext.subscribe(ModelPath.Plant, this._onPlantChange, this);

    // subscribe fires only on change — read once to seed:
    const oInitialPlant = PodContext.get(ModelPath.Plant);
    if (oInitialPlant) this._onPlantChange(oInitialPlant, ModelPath.Plant);
}

_onPlantChange(oPlant /* { plant, timeZone, industryType } */, sPath) {
    if (!oPlant || !oPlant.plant) return;
    this.#sPlant    = oPlant.plant;
    this.#sTimeZone = oPlant.timeZone;
    this._refresh();
}

onExit() {
    PodContext.unsubscribe(ModelPath.Plant, this._onPlantChange, this);
    super.onExit();
}

// 2) Use the tracked plant in every MDO call.
async _loadOee(sPeriod) {
    const oClient = new ODataV4Client("/dmci/v4/extractor/");
    const aData   = await oClient.getAllPages("/OEE", {
        $filter: `PLANT eq '${this.#sPlant}' and PERIOD_TYPE eq '${sPeriod}'`,
        $select: "WORK_CENTER,RESOURCE,LOADING_TIME,RUNNING_TIME," +
                 "NET_PRODUCTION_TIME,NET_OPERATING_TIME,VALUE_OPERATING_TIME"
    });
    return aData;
}
```

Every MDO call: `await` + `try/catch` + widget-scoped `setBusy(true) … setBusy(false)` in a `finally` block. Cross-ref: `html5-migration-guide.md` for mechanical `fetch()` → `ODataV4Client` rewrites, `common-mistakes-data.md` #M51 for the Plant subscribe pitfalls, `model-paths.md` for the full ModelPath constants table.

---

## Pattern 6 — Empty / Loading / Error states

Three canonical surfaces on every dashboard region:

```javascript
import IllustratedMessage     from "sap/m/IllustratedMessage";
import IllustratedMessageType from "sap/m/IllustratedMessageType";
import MessageStrip           from "sap/m/MessageStrip";
import Link                   from "sap/m/Link";           // MessageStrip.link is 0..1 of sap.m.Link — NOT sap.m.Button (M64)

_buildErrorStrip() {
    return new MessageStrip({
        showIcon:    true,
        showCloseButton: true,
        type:        "Error",
        text:        "{/error}",
        visible:     { path: "/error", formatter: e => !!e },
        close:       () => this.#oModel.setProperty("/error", null),
        link:        new Link({ text: "Retry", press: () => this._refresh() })
    });
}

_buildEmptyState() {
    return new IllustratedMessage({
        illustrationType: IllustratedMessageType.NoData,
        title:            "{i18n>DASHBOARD.EMPTY.TITLE}",
        description:      "{i18n>DASHBOARD.EMPTY.TEXT}",
        visible: { path: "/rows/length", formatter: n => n === 0 }
    });
}

// Loading: widget-scoped setBusy — see Pattern 4. No per-tile BusyIndicator.
```

Rules:

- **Loading**: `oView.setBusy(true)` with `setBusyIndicatorDelay(0)` (M33). Never instantiate `sap.m.BusyIndicator` inside a widget.
- **Empty**: `IllustratedMessage` inside the region that would have shown data.
- **Error**: single `MessageStrip` at the top of the dashboard with retry.

---

## Pattern 7 — Live-status pill

Small pill in the header — "Live" / "Fallback data (HH:MM:SS)" / "Offline":

```javascript
import HBox      from "sap/m/HBox";
import Icon      from "sap/ui/core/Icon";
import Text      from "sap/m/Text";
import Log       from "sap/base/Log";

_buildLiveStatusPill() {
    const oIcon = new Icon({
        src:        "sap-icon://circle-task-2",
        color:      { path: "/liveState",
                      formatter: s => ({ Success: "Good", Warning: "Critical", Error: "Negative" }[s]) }
    });
    const oText = new Text({
        text: { parts: ["/liveState", "/lastRefresh"],
                formatter: (s, d) => s === "Success" ? "Live"
                                   : s === "Warning" ? `Fallback data (${d ? d.toLocaleTimeString() : "-"})`
                                   : "Offline" }
    });
    return new HBox({ items: [ oIcon, oText ], alignItems: "Center" });
}
```

Icon color is bound via `sap.ui.core.ValueState` semantic keys (`Good` / `Critical` / `Negative`) — **never** a hex literal. See anti-pattern below and `common-mistakes-i18n.md` Cat 27 "hardcoded locale and color".

---

## Anti-patterns (Do NOT copy from HTML5 source)

Every anti-pattern below has a mechanical rewrite recipe in `html5-migration-guide.md`.

- Chart.js `<script>` tag, `new Chart(...)`, `chart.destroy()` — every UI5 chart is lifecycle-managed by the framework. See `chart-migration-map.md`.
- CSS `<div>`-Gantt with `left:%` / `width:%` — use `sap.gantt.GanttChart` or the fallback rules in `chart-migration-map.md`.
- Module-level `let currentPeriod = 'today'` — use widget private fields (`#sCurrentPeriod`).
- Inline `onclick="..."` in HTML strings — use `attachPress` on UI5 controls.
- Emoji glyphs (green/yellow/red dots, bell) — use `sap-icon://` with `sap.ui.core.ValueState` for color.
- Hard-coded `toLocaleTimeString('de-DE')` — use `sap.ui.core.format.DateFormat` + `sap.ui.getCore().getConfiguration().getLanguage()`.
- `.toFixed(2)` — use `sap.ui.core.format.NumberFormat.getFloatInstance({minFractionDigits:2,maxFractionDigits:2})`.
- `console.log` / `console.error` — use `sap/base/Log`.
- `fetch("/dmci/...")` — use `ODataV4Client` or the appropriate POD 2.0 API client.
- **No plugin CSS at all — see M61 umbrella.** No `widget/css/*.css` file, no inline `style="..."`, no `sap.ui.core.HTML` with `<style>`, no `addStyleClass("<plugin-prefix>Foo")`. If you already wrote `widget/css/*.css`, delete it: a real migration shipped ~200 LOC of CSS that was **never loaded at runtime** — every `class="lm*"` attribute rendered nothing because no `includeStyleSheet` call existed. Use `sapUi{Tiny,Small,Medium,Large}Margin*` utility classes for spacing and semantic controls (`ObjectNumber emphasized`, `NumericContent`, `ObjectStatus state`) for everything else.

---

## Reference implementations

For the widget shell, i18n bundle layout, subscribe/unsubscribe parity, and busy-indicator pattern, use these plugins as Ground Truth:

- `Customer.Coating` — plain `Widget` + Actions + Context singleton + full i18n bundle set. Load via `get_example({ plugin: "Customer.Coating" })`.
- `Customer.TableView` — plain `Widget` with configurable properties + `PodContext.subscribe`. Load via `get_example({ plugin: "Customer.TableView" })`.

There is **no dedicated dashboard reference plugin** — dashboards are just plain `Widget`s that follow the patterns above and pull data via `ODataV4Client`. The decision table in this document and `chart-migration-map.md` are the canonical target shapes; hand-built composites (custom `*TileControl` classes, `<Panel><VBox>` KPI groups, plugin CSS) are anti-patterns even if they look tempting during migration.

File layout for a dashboard-shaped plugin (flat — no wrapper folder inside the plugin root):

```
widget/
  <Name>Widget.js            # plain Widget + auto-refresh + MDO load
context/
  <Name>Context.js           # shared filter state (plant, period)
i18n/
  i18n.properties
  i18n_de.properties
  i18n_en.properties
  i18n_en_US.properties
extension.json
README.md
```

`widget/kpi/*Control.js` or `widget/control/*Tile*.js` MUST NOT exist — see M60 for the anti-pattern write-up.

---

## Data-model discipline that unblocks the standard controls

The main reason the migrator falls back to hand-built composites is that it pre-formats numbers into strings with units concatenated (`"12 PC"`, `"85 %"`, `"1.5 h"`) — which then cannot feed `NumericContent.value` (needs `float`) or `NumericHeader.number` + `unitOfMeasurement` (needs a numeric-and-unit split). See M43 for the underlying type-mismatch error.

**Rule**: In the widget's view model, keep raw numerics **always**. Add a separate `*Text` string field **only if** a plain `Text.text` binding still consumes the pre-formatted string; otherwise omit.

```js
// ✓ correct — feeds standard controls
this.#oModel = new JSONModel({
    kpis: {
        oee:      85.4,      // float — feeds NumericContent.value
        oeeUnit:  "%",       // string — feeds TileContent.unit / NumericContent.scale
        oeeTrend: "Up"       // "Up" | "Down" | "None" — feeds NumericContent.indicator
    },
    orders: {
        plannedTotal:     12,           // int — feeds NumericContent.value in totals-row tile
        plannedTotalText: "12 PC"       // string — ONLY if some Text.text still uses it; else DELETE
    }
});
```

Detection heuristic (add to Phase-5 grep): every `*Text` model field must have at least one `Text text="{...*Text}"` binding — else drop it.

---

## Orphan-i18n gate (Phase 5 residue)

Every time a bespoke composite is replaced with a standard control, 3–6 i18n keys become orphan (`.gantt.tooltip.*`, `.dc.trend.*`, `.perf.targetSfcs.desc`, `.perf.loadingTime`). Orphans grow the German-translation debt without bound.

**Rule**: after each standardisation pass, grep every i18n key against widget + fragments. Orphan keys must be deleted from **all 4 locale files** in the same commit.

```bash
# From plugin root — run before every commit that changes a fragment/view.
prefix="dashboard"   # replace with the plugin's i18n prefix (widget short-name)
for key in $(grep -oE "^${prefix}\\.[a-zA-Z0-9._]+" i18n/i18n.properties | sort -u); do
    refs=$(grep -rn "\\b${key}\\b" widget/ --include='*.js' --include='*.xml' --include='*.fragment.xml' 2>/dev/null | wc -l)
    if [ "$refs" -eq 0 ]; then echo "ORPHAN: $key"; fi
done
```

Zero output required. Any hit → delete the key from all four locale files (`i18n.properties`, `i18n_de.properties`, `i18n_en.properties`, `i18n_en_US.properties`) in the same commit. This is a Phase-5 gate; see `migration-suspect-list.md` Cat 29.

---

## Known parser pitfalls in UI5 v1.136+

Runtime traps caught in real HTML5→POD 2.0 migrations against SAP DM 2026-07 (UI5 v1.136.15). All of these have detailed common-mistake entries:

| # | Trap | Symptom | Fix reference |
|---|---|---|---|
| M50 | `ComponentWidget` bootstrap chain (6 cascading errors) | 404 on `Component.js` / `Component-preload.js`, `IAsyncContentCreation` missing, `Router` conflict | Use plain `Widget` — see Pattern 1 |
| M51 | `ModelPath.SelectedPlant` doesn't exist; callback receives Plant object | `Error: Model path is required` / silent no-op on `newValue.toUpperCase()` | Use `ModelPath.Plant`, extract `oPlant.plant` — see Pattern 5 |
| M52 | Phantom 404 on `sap/m/items.js` | Downstream cascade of an EARLIER parser error | Look higher in browser console — real cause is above |
| M53 | Microchart color enum mismatch | `"Good" is not of type sap.ui.core.CSSColor` / `Value 'var(--sapPositiveColor)' is not valid for type 'sap.m.ValueColor'` | `BulletMicroChartData.color`=`ValueColor` semantic only; `LineMicroChartLine.color`=CSS-var only in v1.136; `Icon.color`=`IconColor` (`Positive`, not `Good`) |
| M54 | `LineMicroChartPoint.color` / `.emphasized` don't exist | `unknown setting 'emphasized' for class …LineMicroChartPoint` | Use `LineMicroChartEmphasizedPoint` for highlighted points |
| M55 | List-binding template conflict | `Assertion failed: list bindings support only a single template object` | Attribute-binding OR `<aggregation>` wrapper, never both |
| M56 | `FlexAlignItems.FlexStart` doesn't exist | `[FUTURE FATAL] Value 'FlexStart' is not valid for type 'sap.m.FlexAlignItems'` | Values are `Start`, `Center`, `End`, `Stretch`, `Baseline` — no `Flex` prefix |
| M57 | `sap.f.Header` / `sap/f/Header` doesn't exist | 404 on `sap/f/Header.js` | Card header is `sap/f/cards/Header`; or use `sap.m.Panel` |
| M58 | `sap.m.App` at widget root breaks embedded slot | Widget invisible or covers whole POD page | Use `sap.m.NavContainer` directly, or return the layout root as-is |
| M59 | Widget-owned shell / header / plant label | Two shell bars, duplicate focus stops, wasted space | POD renders the outer shell — widget renders body only |

Refer to the linked mistake numbers in `common-mistakes-imports.md`, `common-mistakes-ui.md`, `common-mistakes-data.md`, `common-mistakes-lifecycle.md` for the full symptom/why/fix/detection story per trap.

> **UI5 API verification from within a POD plugin**: use `pod2-mcp-server.get_ui5_api({ symbol: "…" })` — the UI5 API is bundled offline in the server, so no `ui5.yaml` + `webapp/` project is needed (POD plugins deliberately don't have that). See `usage/CLAUDE.md` §"UI5 API lookup".

---

## Related docs

- [`fiori-design-compliance.md`](fiori-design-compliance.md) — positive Fiori design canon (decision table for Card vs. Panel etc., Design Guideline URLs, Phase 5c review checklist)
- [`chart-migration-map.md`](chart-migration-map.md) — chart control mapping
- [`html5-migration-guide.md`](html5-migration-guide.md) — mechanical rewrites from HTML5 source
- [`widget-patterns-core.md`](widget-patterns-core.md) §Timer, §Custom Controls, §LayoutWidget
- [`widget-patterns-advanced.md`](widget-patterns-advanced.md) §ObjectStatus, §Custom Widget Events
- [`tablecell-patterns.md`](tablecell-patterns.md) §BulletMicroChart, §LineMicroChart
- [`subscribe-patterns.md`](subscribe-patterns.md)
- [`basics.md`](basics.md) §OData V4 for Custom Queries
- [`mdo-extractor-reference.md`](mdo-extractor-reference.md)
- [`property-editors.md`](property-editors.md)
- [`common-mistakes-lifecycle.md`](common-mistakes-lifecycle.md) #M33 (BusyIndicator)
- [`common-mistakes-i18n.md`](common-mistakes-i18n.md) Cat 27 (hardcoded locale and color)
