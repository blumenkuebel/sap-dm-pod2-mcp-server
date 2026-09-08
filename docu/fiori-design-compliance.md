# Fiori Design Compliance for HTML5 Migrations

> **Purpose**: Every widget produced by `migrate_widget({sourceFormat: "html5", ...})` ends up next to first-party SAP DM widgets in a POD 2.0 page. This doc is the positive Fiori design canon the migrator must satisfy — the target aesthetic, complementing the negative M61 CSS-ban (`common-mistakes-ui.md`) and Cat 29 Standard-First bias (`migration-suspect-list.md`).

---

## Design goal

The output must be visually indistinguishable from a native SAP DM widget sitting next to it in the same POD page. If a plant supervisor notices that "this widget looks different" — different icon set, different padding rhythm, different color semantics, different typography scale — the migration has failed even if the plugin runs without errors. Off-brand visual is a shipping defect, no different than a broken data binding.

The Fiori Design System is the target canon, not the HTML5 source's original design. When source and Fiori conflict — HTML5 used red/yellow/green emoji dots for status, Fiori uses `sap.ui.core.IconColor` + `sap-icon://status-*`; source used a hand-tuned `1.5rem` font-size, Fiori has a native typography scale via `sap.m.Title level=` and `NumericContent` — **Fiori wins**. The user gets a chance in Phase 5c to explicitly approve source-preserved deviations, but the default is the Fiori standard. This is the same rule as the Prime Directive ([`basics.md` §0](basics.md#§0-prime-directive-standard-controls-before-custom)), one level of abstraction higher — where §0 says "which control", this doc says "what the control must look like".

---

## Canonical resources — verify at implementation time

The migrator must consult these when a design choice is unclear. All are `WebFetch`-able (public SAP resources):

| Resource | URL | When to consult |
|---|---|---|
| Fiori for Web (root) | `https://experience.sap.com/fiori-design-web/` | Any layout/pattern/control question — start here. |
| Controls A-Z | `https://experience.sap.com/fiori-design-web/controls-a-z/` | Pick a specific control (Card, Panel, Toolbar, Dialog, MessageBox, …). |
| Patterns (Object Page, List Report, Dynamic Page, Analytical List Page, Overview Page, …) | `https://experience.sap.com/fiori-design-web/patterns/` | Structural decision: full-page layout, drill-down flow, filter+list+detail. |
| Foundation (colors, typography, spacing, iconography) | `https://experience.sap.com/fiori-design-web/foundation/` | Any color / font-size / spacing / icon question. |
| Icon Explorer | `https://ui5.sap.com/1.136.0/test-resources/sap/m/demokit/iconExplorer/webapp/index.html` | Pick the exact `sap-icon://<name>` — never guess. |
| Theme Parameters API | `https://ui5.sap.com/1.136.0/#/api/sap.ui.core.theming.Parameters` | If a legitimate brand-color exception is needed (rare, requires M61 `standard-only: exception` marker). |
| SAP DM shell context | `https://help.sap.com/docs/SAP_DIGITAL_MANUFACTURING/` | Confirm what the POD host renders (shell bar, plant selector, page header) so the widget does NOT duplicate any of it (see M59). |

The `get_ui5_api` tool is the primary way to check per-control API — the URLs above are for design conventions that the API reference doesn't encode.

---

## Fiori design decision table

Look up the design shape here **before** writing any XML. Parallel to the Chart→control decision table in `dashboard-patterns.md`, but for layout/structure/messaging decisions.

| Design shape | First choice | Second choice | Never build by hand |
|---|---|---|---|
| Full-page widget with header + filter bar + content + footer | `sap.f.DynamicPage` (`title`+`header`+`content`+`footer`) | `sap.m.Page` (simpler) | Hand-drawn `VBox` with header + filter composition |
| Section header (title + counter + toolbar) | `sap.m.Panel` with `headerText` + `headerToolbar` | `sap.m.Toolbar` above the content | Bespoke `HBox` with `Title` + `ObjectStatus` + right-aligned buttons |
| Card-like content region (metric + chart + label) | `sap.f.Card` with `sap.f.cards.NumericHeader` / `Header` | `sap.m.Panel` (fallback if `Card` unavailable) | `sap.m.Panel backgroundDesign="Solid"` hand-styled |
| Group of related cards on one row | `sap.f.GridContainer` with responsive `layout` | `sap.ui.layout.Grid` | `HBox wrap="Wrap"` + custom `min-width` CSS (M61) |
| Actions row at top of widget / dialog | `sap.m.OverflowToolbar` (auto-overflow at S/M) | `sap.m.Toolbar` | Hand-drawn `HBox` with right-aligned buttons |
| Object-list + detail drill-down | `sap.f.FlexibleColumnLayout` | `sap.m.SplitContainer` (bounded) or `sap.m.NavContainer` two pages | Manual `VBox` swap via `visible=` toggle |
| Empty / no-data state | `sap.m.IllustratedMessage` (`illustrationType` from `sap.m.IllustratedMessageType`) | `sap.m.Text` with i18n key + inline `sap-icon://document` | Plain-text "No data" placeholder |
| Loading state | Widget-scoped `oView.setBusy(true)` (M33) | Region-scoped `oPanel.setBusy(true)` | Manual spinner GIF / CSS animation |
| Error state (in-view, non-blocking) | `sap.m.MessageStrip type="Error"` above the affected region | `sap.m.MessageStrip type="Warning"` | Inline `Text.text="Error: …"` |
| Blocking confirmation before destructive action | `sap.m.MessageBox.confirm({onClose:…})` | `sap.m.Dialog` with `type="Standard"` + explicit buttons | Bespoke `Dialog` with hand-drawn buttons |
| Transient positive feedback ("Saved") | `sap.m.MessageToast.show(sMsg)` | (none) | Custom fade-out banner |
| Blocking error / warning message | `sap.m.MessageBox.error(sMsg)` / `.warning(sMsg)` | `sap.m.MessageBox.information(sMsg)` for non-error info | `alert()`, `console.log`, `MessageBox.show` with generic icon |
| Icon selection | `sap-icon://<exact-name>` from Icon Explorer (link above) | `sap.f.Avatar` for user/entity avatars | Emoji glyph (Cat 26 / M62), external icon font, PNG import |

Row-per-decision. For every layout choice the migrator makes in Phase 4, the `MIGRATION_MAPPING.md` mapping row must cite either a decision-table row or a one-sentence justification for deviating.

---

## Typography, color, spacing — the semantic controls do the work

The four levers below cover >95 % of visual needs. Reach for a plugin CSS class only after all four have been ruled out (and then via an M61 `standard-only: exception` marker).

### Typography

- **Page / section titles** → `sap.m.Title level="H4"/"H5"/"H6"` — Fiori-tokenized sizing, correct semantic HTML.
- **KPI numbers** → `sap.m.NumericContent` (tile-scale) or `sap.f.cards.NumericHeader.number` (card-scale) or `sap.m.ObjectNumber emphasized="true"` (inline emphasis). Never `Text` + a size class.
- **Body text** → `sap.m.Text` (default typography), `sap.m.Label` (form label), `sap.m.FormattedText` (safe-markdown subset). No plugin `font-size`.
- **Reference**: M61 whitelist + `experience.sap.com/fiori-design-web/foundation/#typography`.

Concrete before/after:

```xml
<!-- HTML5 source style (WRONG for POD 2.0) -->
<Text text="Order Progress" class="lmSectionTitle" />
<Text text="82 %"           class="lmKpiBig" />

<!-- Fiori-native (RIGHT) -->
<Title text="{i18n>section.orderProgress}" level="H5" />
<ObjectNumber number="82" unit="%" emphasized="true" state="Success" />
```

### Color

All color choices are **semantic**, not literal:

- **State (success/warning/error/neutral)** → `sap.ui.core.ValueState` on `ObjectStatus`/`MessageStrip`/`Input.valueState`.
- **Icon color** → `sap.ui.core.IconColor` (`Positive`, `Negative`, `Critical`, `Neutral`) — see M53 for enum nuances.
- **Microchart value color** → `sap.m.ValueColor` (`Good`, `Error`, `Critical`, `Neutral`).
- **Brand color for a widget property choice** (rare) → `sap.ui.core.theming.Parameters.get(...)` reading a Fiori theme parameter — never a hex literal.
- **Never**: `Icon.color="#0070F2"`, `<span style="color:red">`, `class="lmTextSuccess"` with a hand-tuned CSS var. See M61.

Concrete before/after:

```xml
<!-- HTML5 source style (WRONG) -->
<Icon src="sap-icon://message-success" color="#107E3E" />
<Text text="OK" class="lmTextSuccess" />

<!-- Fiori-native (RIGHT) -->
<Icon src="sap-icon://message-success" color="Positive" />
<ObjectStatus text="{i18n>status.ok}" state="Success" />
```

### Spacing

- **Between controls in a form/panel** → `sapUiTinyMargin{Top,Bottom,Begin,End}` / `sapUiSmallMargin*` / `sapUiMediumMargin*` — theme-aware, RTL-safe.
- **Inside a card / section** → the container control provides its own padding; adding margin is usually wrong.
- **Between cards in a grid** → `sap.f.GridContainer` layout properties, not `HBox` gaps.
- **Never**: `.addStyleClass("lmSmallSpacing")` with a plugin-owned class. See M61 whitelist.

### Iconography

- Only `sap-icon://<name>` from the Icon Explorer (URL above). Never emoji (Cat 26). Never external icon fonts (Font Awesome, Material Icons). Never PNG-as-icon.
- Common mappings from HTML5 → sap-icon: bell → `bell` · search → `search` · check → `accept` · close → `decline` · warning → `alert` / `status-critical` · info → `hint` · settings → `action-settings`.
- Every icon-only `Button` / `Icon` needs a `tooltip=` (Cat 15) for accessibility.

Concrete before/after:

```xml
<!-- HTML5 source style (WRONG) -->
<Text text="🔔 3 alerts" />
<Button icon="fa-cog" press=".onSettings" />

<!-- Fiori-native (RIGHT) -->
<HBox alignItems="Center">
    <Icon src="sap-icon://bell" tooltip="{i18n>tt.alerts}" />
    <ObjectNumber number="3" state="Warning" class="sapUiTinyMarginBegin" />
</HBox>
<Button icon="sap-icon://action-settings" tooltip="{i18n>tt.settings}" press=".onSettings" />
```

---

## Anti-patterns from a design perspective

Cat 29's S1-S7 anti-patterns viewed through the **visual design** lens (not the code lens). Each has the same fix as Cat 29 but explains **why it hurts visually**:

- **A widget that "looks fine" but uses a different icon set** breaks the plant supervisor's mental model — the icons in this widget signify different actions than the identical-looking icons in the neighboring native widget. Fix: `sap-icon://` only, Icon Explorer as the reference.
- **A KPI tile with different padding than the neighboring native tiles** reads as "third-party plugin" instead of "part of SAP DM". The tile IS a third-party plugin — the goal is that this is not visible. Fix: `sap.m.GenericTile` + `TileContent` + `NumericContent` (Cat 29 S1 / M60).
- **Custom color palettes for chart series** create visual chaos across the POD — every plugin picks its own reds and greens, the operator has to context-switch between meaning-systems. Fix: `sap.m.ValueColor` semantic aliases, or theme parameters.
- **Hand-tuned typography** (`font-size: 1.5rem; font-weight: 700`) breaks on the next theme update — Horizon-2027 will move typography tokens. Fix: `sap.m.NumericContent` / `sap.m.ObjectNumber emphasized="true"` / `sap.m.Title level=` (Cat 29 S7 / M61).
- **A self-owned shell bar / plant label / notification bell** duplicates what POD already renders. Fix: widget renders body only (M59).
- **A custom Gantt** with `<div>` bars and hand-positioned icons "looks like the source". Native users expect `sap.gantt.simple.GanttChartWithTable` interactions (drag, zoom, dependency arrows). Fix: `sap.gantt` for real; `BulletMicroChart` for the simplified case (Cat 24 / S2).
- **Custom "Loading…" placeholder text** where a busy indicator or `IllustratedMessage` should be. Fix: `oView.setBusy(true)` (M33) / `sap.m.IllustratedMessage`.
- **Untranslated German strings** in JS ("Zuletzt vor 7 Sek.") are a design defect, not just an i18n bug — a Fiori widget always speaks the user's language. Fix: 4 i18n bundles per plugin (M30, Cat 27).

---

## Verification during Phase 5c

`migrate_widget` Phase 5c is a **manual visual review** — the agent walks this 10-checkbox list and emits the result in `MIGRATION_VERIFICATION.md`. Any unchecked box requires a one-sentence justification (or the plugin returns to Phase 4).

- [ ] **Icon set** — every `Icon.src` / `Button.icon` uses `sap-icon://<name>` from the Fiori Icon Explorer. No emoji, no PNG imports, no external icon fonts.
- [ ] **Color semantics** — every color choice comes from `sap.ui.core.ValueState` / `sap.ui.core.IconColor` / `sap.m.ValueColor`. No hex literals, no CSS vars, no plugin CSS classes for color — unless a `standard-only: exception` marker justifies it.
- [ ] **Typography hierarchy** — page/section titles use `sap.m.Title level="H4"/"H5"/"H6"` (or `NumericHeader.title`); numeric values use `NumericContent` / `ObjectNumber emphasized="true"`. No `Text` with a size class.
- [ ] **Card vs. Panel** — content that groups a metric + chart + label uses `sap.f.Card`. Content that groups a form or a table uses `sap.m.Panel`. No `Panel` styled to fake a card.
- [ ] **Page container** — full-page widgets use `sap.f.DynamicPage` (with `title`+`header`+`content`+`footer`) or `sap.m.Page`. Embedded widgets return a bounded layout root — never `sap.m.App` (M58).
- [ ] **Empty / no-data / error surfaces** — `sap.m.IllustratedMessage` with a semantic `illustrationType`. Never a plain-text "No data" placeholder.
- [ ] **Messaging** — `sap.m.MessageBox.{confirm,warning,error,information}` for blocking; `MessageStrip` for in-view persistent; `MessageToast` for transient positive. Never `console.log`, never a bespoke dialog for standard flows.
- [ ] **Responsive** — the widget renders correctly at S / M / L breakpoints. Fiori layout controls (`GridContainer`, `DynamicPage`, `FlexibleColumnLayout`) do this by default; hand-built `HBox`/`VBox` compositions may not.
- [ ] **Accessibility** — every icon-only `Icon`/`Button` has a `tooltip=`. Every `Table`/`List` has a semantic `noDataText`. Every user-facing `sap-icon://` conveying state has an aria-label.
- [ ] **Localisation** — all four locale bundles present (`i18n.properties`, `_de`, `_en`, `_en_US`); German applies M30 (SFC → PSN); no hard-coded German strings in JS (Cat 27); dates/numbers via `DateFormat`/`NumberFormat` (M34, M43).

**Report format** in `MIGRATION_VERIFICATION.md`:

```markdown
## Phase 5c — Fiori design compliance review

| # | Check | Result | Justification (if not ✅) |
|---|---|---|---|
| 1 | Icon set — sap-icon:// only | ✅ | — |
| 2 | Color semantics — ValueState/IconColor/ValueColor | ✅ | — |
| 3 | Typography hierarchy — Title level=/NumericContent | ✅ | — |
| 4 | Card vs. Panel | ✅ | — |
| 5 | Page container | ✅ | — |
| 6 | Empty/no-data/error — IllustratedMessage | ✅ | — |
| 7 | Messaging — MessageBox/Strip/Toast | ✅ | — |
| 8 | Responsive S/M/L | ✅ | — |
| 9 | Accessibility — tooltip/aria/noDataText | ✅ | — |
| 10 | Localisation — 4 bundles, M30, DateFormat/NumberFormat | ✅ | — |
```

Zero ⚠️ / ❌ required for sign-off (or explicit user approval per row).

---

## Deviation protocol

When Fiori and the HTML5 source genuinely conflict — a customer brand-color that legal signed off on, a plant-specific status color scheme baked into training material — the migrator MUST NOT silently ship the deviation. The path is:

1. In Phase 4, apply the Fiori canon by default (semantic control, semantic color).
2. In Phase 5c, note the specific rows in `MIGRATION_VERIFICATION.md` where the source diverges.
3. Prompt the user with the concrete diff (screenshot or XML excerpt) and ask: "Preserve source, or accept Fiori default?"
4. If preserve: add an M61 `standard-only: exception` marker on the specific control and cite the user approval in `MIGRATION_MAPPING.md`.
5. If accept: no further action — Fiori is already applied.

Silent preservation without a marker is a Phase-5 gate failure.

---

## Related docs

- [`dashboard-patterns.md`](dashboard-patterns.md) — §"Prime Directive (dashboard scope)" (composition-bias fix); §"Chart→control decision table" (chart-shape choices).
- [`chart-migration-map.md`](chart-migration-map.md) — chart-library → SAPUI5 target control.
- [`html5-migration-guide.md`](html5-migration-guide.md) — mechanical before/after rewrites (fetch → OData, setInterval → Timer, etc.).
- [`common-mistakes-ui.md`](common-mistakes-ui.md) — M53 microchart color enum nuances, M56 FlexAlignItems values, M58 `sap.m.App` viewport-shell, M59 widget-owned shell duplication, M60 custom control template, M61 CSS-ban umbrella, M63 microchart-shape popover.
- [`common-mistakes-i18n.md`](common-mistakes-i18n.md) — M30 SFC → PSN German translation.
- [`migration-suspect-list.md`](migration-suspect-list.md) — Cat 26 emoji-as-icon, Cat 27 hard-coded locale, Cat 29 Standard-First bias (S1-S7).
