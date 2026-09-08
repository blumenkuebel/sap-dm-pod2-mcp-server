# Chart Migration Map

> **Purpose**: When migrating from an HTML5 source (`sourceFormat: "html5"`), every `new Chart(...)` / `d3.select(...)` / `Plotly.newPlot(...)` / `echarts.init(...)` MUST be replaced with a SAPUI5 target control. This file is the canonical mapping. Load via `get_pattern_doc({name: "chart-migration-map"})` during migrate_widget Phase 1.

## Golden rule

Chart libraries are NEVER copied into shipped POD 2.0 plugins. The `<script>` tag, `import Chart from 'chart.js'`, and any `chart.destroy()` are Phase 5 residue errors (see `validate-project-instructions.md` §HTML5 Residue). A shipped plugin's runtime dependency graph is UI5 only.

## Verifying the target control

For every mapping below, verify the target with the SAPUI5 MCP server before committing the rewrite:

- `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` — for VizFrame charts
- `get_ui5_api({ symbol: "sap.suite.ui.microchart.<Name>" })` — for microcharts
- `get_ui5_api({ symbol: "sap.gantt.simple.GanttChartWithTable" })` — for Gantt

> **From a POD plugin dir** the tool errors with *"Unable to locate a UI5 project"* — use `get_ui5_api` (bundled offline, no `projectDir` needed) for workarounds (search POD2 docs first, temporary UI5 stub project outside the plugin root, or `ui5.sap.com/api/<class>`).

If the API reference call fails, the target does not exist at the project's UI5 version — record this in `MIGRATION_MAPPING.md` and consult the user before falling back.

### Required library dependencies

Every mapped target pulls in a library that MUST appear in `manifest.json` `sap.ui5.dependencies.libs`:

| UI5 target namespace | Library key |
|---|---|
| `sap.viz.ui5.controls.*` | `sap.viz` |
| `sap.suite.ui.microchart.*` | `sap.suite.ui.microchart` |
| `sap.suite.ui.commons.*` | `sap.suite.ui.commons` |
| `sap.gantt.simple.*` | `sap.gantt` |

Omitting these dependencies causes the widget to fail loading in POD Designer with a silent module-resolution error — see `common-mistakes-setup.md` §Library Dependencies.

---

## Chart.js → UI5

| Chart.js type | UI5 target | API reference query | When to fall back |
|---|---|---|---|
| `bar` (vertical) | `sap.viz.ui5.controls.VizFrame` `vizType: "column"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | Never — always VizFrame for multi-bar column charts. |
| `horizontalBar` / `bar` with `indexAxis: 'y'` (multi-row) | `sap.viz.ui5.controls.VizFrame` `vizType: "bar"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | Never for a full chart. |
| Single horizontal bar with one target line (KPI vs target) | `sap.suite.ui.microchart.BulletMicroChart` | `get_ui5_api({ symbol: "sap.suite.ui.microchart.BulletMicroChart" })` | This IS a bullet chart — do not use VizFrame here. Applies to `line_monitor.html` `orderChart` when it renders one actual vs one target. |
| `line` (multi-point series, data-heavy) | `sap.viz.ui5.controls.VizFrame` `vizType: "line"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | Use LineMicroChart instead when <30 data points AND no legend needed AND rendered inside a cell/tile. |
| `line` (sparkline, <30 points, no legend, inside cell/tile) | `sap.suite.ui.microchart.LineMicroChart` | `get_ui5_api({ symbol: "sap.suite.ui.microchart.LineMicroChart" })` | If legend or hover-drill required → VizFrame. |
| `line` with min/max **reference lines** (dashed) | `sap.viz.ui5.controls.VizFrame` with reference lines via `feedItems` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | For sparkline-shaped case: `sap.suite.ui.microchart.LineMicroChart` + `sap.suite.ui.microchart.LineMicroChartEmphasizedPoint` for out-of-spec points. When both min AND max lines are needed AND data is a single trace → `sap.suite.ui.microchart.AreaMicroChart` (range visualisation). Applies to `line_monitor.html` `sparkline`. |
| `doughnut` / `pie` (2+ segments) | `sap.viz.ui5.controls.VizFrame` `vizType: "donut"` / `"pie"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | Never for multi-segment. |
| Single-percentage KPI ring (one value vs 100%) | `sap.suite.ui.microchart.HarveyBallMicroChart` | `get_ui5_api({ symbol: "sap.suite.ui.microchart.HarveyBallMicroChart" })` | If 2+ segments → donut VizFrame. |
| `radar` / `radialBar` (single-value gauge) | `sap.suite.ui.microchart.RadialMicroChart` | `get_ui5_api({ symbol: "sap.suite.ui.microchart.RadialMicroChart" })` | Multi-metric radar → VizFrame `vizType: "radar"`. |
| `radar` (multi-metric) | `sap.viz.ui5.controls.VizFrame` `vizType: "radar"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | Never. |
| `bubble` / `scatter` | `sap.viz.ui5.controls.VizFrame` `vizType: "scatter"` / `"bubble"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | No microchart equivalent — always VizFrame. |
| `chartjs-gauge` plugin | `sap.suite.ui.microchart.RadialMicroChart` | `get_ui5_api({ symbol: "sap.suite.ui.microchart.RadialMicroChart" })` | `sap.suite.ui.commons.LinearGaugeChart` may be deprecated — check via `get_ui5_api` before using. |
| `mixed` (bar + line combo) | `sap.viz.ui5.controls.VizFrame` `vizType: "dual_line_column"` | `get_ui5_api({ symbol: "sap.viz.ui5.controls.VizFrame" })` | For small tiles: two overlaid microcharts (LineMicroChart on top of ColumnMicroChart). |

---

## d3 / plotly / echarts / apexcharts → UI5

| Source pattern | UI5 target | Notes |
|---|---|---|
| d3 `select(...).append('rect')` bar chart | Same as Chart.js bar row above | VizFrame `vizType: "column"` / `"bar"`. |
| d3 `line()` chart | Same as Chart.js line row above | Apply the >30 points / legend rule. |
| d3 heatmap | `sap.suite.ui.commons.HeatmapChart` (verify — may be deprecated) | If deprecated: bespoke composite (Grid + colour-mapped cells). |
| d3 chord / sankey / bespoke force layout | No direct UI5 equivalent | See "bespoke" decision below. |
| plotly `bar` / `scatter` / `heatmap` | VizFrame equivalents (`column`, `scatter`, plus heatmap note above) | |
| echarts `line` / `bar` / `radar` | VizFrame equivalents | |
| echarts `gauge` | `sap.suite.ui.microchart.RadialMicroChart` | |
| apexcharts `donut` / `radialBar` | `HarveyBallMicroChart` / `RadialMicroChart` | Single-value semantics — same rule as Chart.js. |

**State**: d3 is often used for bespoke visualisations that have no UI5 equivalent. In that case the migration decision is between:
1. **Simplify** to a supported chart type (e.g. a force-directed status graph becomes a `sap.m.List` of status rows).
2. **Bespoke composite** — `VBox` + `Icon` + `Text` driven by data (see `advanced-patterns.md` for the status-board pattern).
3. **Consult** — mark the feature as `⚠️ Bespoke composite required — consult user` in `MIGRATION_MAPPING.md` and stop.

---

## Custom `div`-based Gantt / timeline → UI5

**Detection**: HTML with CSS classes matching `.gantt` / `.timeline` / `.now-line` and inline `style="left:X%;width:Y%"` blocks stacked in rows.

**Primary target**: `sap.gantt.simple.GanttChartWithTable`.
Verify via `get_ui5_api({ symbol: "sap.gantt.simple.GanttChartWithTable" })`.

### Fallback — bespoke composite

**ONLY** if ALL these hold:

1. Source has <5 rows.
2. NO dependency arrows between bars.
3. NO drag/resize interactivity.
4. Bars represent time slices (not tasks with hierarchical structure).

Fallback shape: `VBox` of rows, each row a `HBox` containing:

- Row label (`sap.m.Text`).
- Track: `sap.m.HBox` with `sap.m.ProgressIndicator` (the "productive" green band) overlaid with additional `sap.m.HBox` items positioned by `layoutData: new sap.m.FlexItemData({growFactor: ...})` (downtime segments).
- A "now-line" approximated by two `HBox` children with growFactors matching `now` and `1440-now` (assuming minute-of-day scale).

**State clearly**: if any fallback rule is violated → use `sap.gantt.simple.GanttChartWithTable`. The bespoke composite is a UX compromise, not a preference.

---

## Legend & interactivity mapping

| Source pattern | UI5 target |
|---|---|
| Chart.js `onClick(event, elements) { ... }` | VizFrame: `attachSelectData` → widget method that fires a custom widget event (see `widget-patterns-advanced.md` §Custom Widget Events) for cross-widget drill-down. Microcharts: `press` event. |
| Chart.js custom tooltip | VizFrame default `TooltipRenderer` via `sap.viz.ui5.controls.common.feeds.FeedItem` — the default is usually sufficient. |
| Chart.js `legend.display: false` | VizFrame `vizProperties.legend.visible = false`. |
| Chart.js `hover` / `mousemove` tooltip on d3 | VizFrame built-in tooltip — do NOT re-implement with `mouseover` DOM handlers. |

---

## ⚠️ Numeric properties reject strings

`LineMicroChartPoint.x` / `.y`, `BulletMicroChartData.value`, `RadialMicroChart.percentage`, `ProgressIndicator.percentValue` and every `sap.viz` feed value are declared as `float` / `int`. UI5's `validateProperty` throws at construction if you pass a string, even one that parses cleanly:

```
Error: "1" is of type string, expected float for property "x"
of Element sap.suite.ui.microchart.LineMicroChartPoint#__point0
```

Never pipe values through `String(...)`, `"" + val`, `` `${val}` `` (template literal), or `.toFixed(N)` before feeding them into a numeric chart property. `.toFixed` in particular is a string result — appropriate for display via `Text.text`, wrong for `x`/`y`/`value`. Use `Number(val)` explicitly if the source is a string. See common-mistake **#43**.

## Interactivity NOT supported by microcharts

Microcharts are read-only mini-visualisations. If the source has:
- hover tooltips with rich content,
- click-to-drill-down that opens a dialog,
- zoom or pan,
- brush / range selection,

then use `sap.viz.ui5.controls.VizFrame` (or `sap.gantt.simple.GanttChartWithTable` for time data), NOT a microchart. The `press` event on a microchart is a single-click hook only — no coordinate, no series identity.

### Decision flowchart

For any source chart, walk this in order and stop at the first match:

1. Is this a Gantt / timeline with time-axis bars? → `sap.gantt.simple.GanttChartWithTable` (or bespoke composite if all four fallback gates hold).
2. Is this a single actual-vs-target horizontal bar? → `BulletMicroChart`.
3. Is this a single-value ring/gauge? → `HarveyBallMicroChart` (percentage) or `RadialMicroChart` (gauge).
4. Is this a sparkline (<30 points, no legend, in-cell)? → `LineMicroChart` (or `AreaMicroChart` for range trace).
5. Does it need any interactivity from the microchart-unsupported list above? → `VizFrame`.
6. Everything else multi-series → `VizFrame` with the appropriate `vizType`.
7. No `vizType` fits → simplify, bespoke composite, or consult.

---

## Anti-patterns

- Bundling Chart.js / d3 / plotly / echarts into the plugin ZIP — POD 2.0 plugins are UI5-native only. Any `node_modules/chart.js` or `libs/chart.min.js` in the shipped tree is a hard fail.
- `sap.ui.core.HTML` wrapping a `<canvas>` rendered by Chart.js loaded via CDN — this is HTML5 residue, blocks POD Designer preview, and breaks in offline mode.
- Iframing an external dashboard for a chart — use `IntegrationWidget` only for entire external UIs, not single charts (see `widget-patterns-advanced.md`).
- Building a Gantt out of `sap.ui.core.HTML` blocks with absolute-positioned divs — always prefer `sap.gantt.simple.GanttChartWithTable` for anything non-trivial. The bespoke composite above is a last resort with strict gates.
- Copying the source library's `destroy()` calls into the UI5 widget `destroy()` override — VizFrame and microcharts are cleaned up by the UI5 lifecycle automatically. Only aggregations you added yourself need explicit cleanup.
- Emulating a donut with `sap.m.ProgressIndicator` rotated by CSS — use `HarveyBallMicroChart`.

---

## Known v1.136+ parser strictness (UI5 evolves — verify per release)

Real runtime rejections caught against UI5 v1.136.15. These are *parser* / *type-validation* strictness quirks that older docs / snippets miss.

### Microchart color property nuances

| Class · property | Type declared | v1.136 parser accepts | v1.136 parser REJECTS |
|---|---|---|---|
| `BulletMicroChartData.color` | `sap.m.ValueColor` | `"Good"`, `"Error"`, `"Critical"`, `"Neutral"` (or the enum constants) | CSS colors (`"#0070F2"`), CSS variables (`"var(--sapPositiveColor)"`), `IconColor.*` values |
| `LineMicroChartLine.color` | `sap.m.ValueCSSColor` (union of `ValueColor` + `CSSColor`) | **CSS values only** — `"var(--sapPositiveColor)"`, hex, named CSS colors | `"Good"`, `"Error"`, `"Critical"`, `"Neutral"` (semantic aliases rejected despite the union type) |
| `RadialMicroChart.valueColor` | `sap.m.ValueColor` | semantic aliases only | CSS values |
| `Icon.color` | `sap.ui.core.CSSColor` (implicit `IconColor`) | `"Positive"`, `"Negative"`, `"Critical"`, `"Neutral"`, hex, CSS var | `"Good"`, `"Error"` — those belong to `ValueColor`, NOT `IconColor` |
| `ObjectStatus.state` | `sap.ui.core.ValueState` | `"None"`, `"Success"`, `"Warning"`, `"Error"`, `"Information"` | `"Good"`, `"Positive"` |

**Recommendation for LineMicroChartLine specifically** — use theme-following CSS variables:

```js
new LineMicroChartLine({
    points: aData.map(d => new LineMicroChartPoint({ x: Number(d.t), y: Number(d.v) })),
    color:  "var(--sapPositiveColor)"   // ✓ works in v1.136+; theme-aware
    // NOT color: "Good" — semantic alias rejected by v1.136 parser
});
```

Full details in `common-mistakes-ui.md` #M53.

### Point classes are NOT interchangeable

`sap.suite.ui.microchart.LineMicroChartPoint` has ONLY `x` and `y` in v1.136+. For per-point highlighting, use `sap.suite.ui.microchart.LineMicroChartEmphasizedPoint` (which adds `color`, `emphasized`, `show`).

```js
// ✗ WRONG — unknown setting error
new LineMicroChartPoint({ x: 5, y: 42, color: "var(--sapNegativeColor)", emphasized: true });

// ✓ CORRECT — use the emphasized subclass
new LineMicroChartEmphasizedPoint({ x: 5, y: 42, color: "var(--sapNegativeColor)", emphasized: true });
```

Mix both types freely inside the same `LineMicroChartLine.points` aggregation. Details in `common-mistakes-ui.md` #M54.

### Numeric properties reject stringified inputs

`.x`, `.y`, `.value`, `.percentValue` on microchart classes are declared `float` — passing `String(5)` or `"5"` fails with `"5" is of type string, expected float`. Always `Number(x)` before feeding into a microchart point/data element. Details in `common-mistakes-ui.md` #M43.

### list-binding template conflict

Cannot combine attribute-style `points="{path: '...'}"` with an inner `<mc:points>` aggregation wrapper — UI5 sees two templates and asserts. Details in `common-mistakes-ui.md` #M55.

### Verification per release

When migrating against a newer UI5 release, re-verify these traps by calling `get_ui5_api({ symbol: "sap.suite.ui.microchart.LineMicroChartLine" })` — the `properties[].type` fields tell you what the parser will accept in that version.

---

## Cross-references

- `dashboard-patterns.md` — dashboard shell hosting these charts (§"Known parser pitfalls in v1.136+")
- `fiori-design-compliance.md` — positive Fiori design canon (chart series colors follow `sap.m.ValueColor`, iconography from `sap-icon://` only)
- `html5-migration-guide.md` — the mechanical rewrite recipe per line
- `tablecell-patterns.md` §BulletMicroChart, §LineMicroChart — embedded in table cells
- `widget-patterns-advanced.md` §Custom Widget Events — chart-click drill-down
- `advanced-patterns.md` — bespoke composite decision reference
- `validate-project-instructions.md` §HTML5 Residue — Phase 5 residue rules
- `common-mistakes-ui.md` #M43, #M52-#M56 — parser-strictness traps for UI5 v1.136+
- `get_ui5_api` — verify every target control at implementation time
