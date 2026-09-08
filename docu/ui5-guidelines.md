# SAPUI5 Coding Guidelines (POD 2 curated)

> **Curated from** the SAPUI5 SDK "Guidelines for Developers" corpus as delivered by
> the external `@ui5/mcp-server`'s `get_guidelines` tool. Sections about CAP integration,
> `index.html` bootstrap with `sap/ui/core/ComponentSupport`, and inline-script CSP
> rules are **omitted** — POD 2 hosts the UI5 shell for you, so plugins never own an
> `index.html`, never sit inside a CAP project, and never bootstrap a Component
> themselves. What remains is the ~4 KB that actually applies to POD 2 plugin code.
>
> **Version pin**: matches SAP DM's UI5 target (see [`ui5-api-specs/VERSION.md`](ui5-api-specs/VERSION.md)).
>
> **Complements** [`basics.md`](basics.md) §0 (Prime Directive: Standard Controls Before Custom).
> Where §0 governs *which* control to pick, this doc governs *how* the code around that pick
> should be shaped.

---

## §1 — Coding Guidelines

### Dependency loading (never globals)

- **NEVER** access UI5 framework objects via global paths (`sap.m.Button`, `sap.ui.core.Element`,
  `jQuery.sap.*`). Every module the code touches must be explicitly declared:

  - **JavaScript**: `sap.ui.define([...], (...) => { ... })` at the top of every file (this is also what registers the file as a UI5 module). Dynamic imports via `sap.ui.require([...], (...) => { ... })`.
  - **TypeScript**: ES6 `import` statements (POD 2 plugins are JS-only today — this applies only if SAP DM ever greenlights TS pods).
  - **XML views**:
    - For controls, the XML namespace declaration is enough — the template engine autoloads control classes (`<m:Button/>`).
    - For programmatic API (formatters, types, helpers) declare a `core:require` directive:
      ```xml
      <ObjectListItem
          core:require="{
              Currency: 'sap/ui/model/type/Currency'
          }"
          number="{ parts: ['invoice>Price', 'view>/currency'], type: 'Currency' }"
      />
      ```
    - Reference: SAPUI5 SDK topic *"Require Modules in XML View and Fragment"*.

- **Cross-reference (POD 2-specific detections)**: [`common-mistakes-imports.md`](common-mistakes-imports.md) covers
  the concrete traps — M36 (deprecated pseudo-module enum imports), M41 (non-existent module paths
  like `sap/m/Item`), M57 (`sap.f.Header` guessed-namespace trap). The generic rule above is what
  those specific detections enforce.

### Data binding beats formatters

- **ALWAYS** wire controls to data or i18n models via bindings (`"{path>...}"`, `{i18n>...}`, expression bindings `"{= ${x} > 0 }"`).
- **ALWAYS** prefer built-in binding types with `formatOptions` over hand-written formatter functions:
  - **First choice**: `sap.ui.model.odata.type.*` (e.g. `Decimal`, `String`, `DateTime`, `Boolean`).
    These types work with **any** model — not only OData models. They also handle parsing +
    validation + i18n formatting in one.
  - **Second choice**: `sap.ui.model.type.*` (e.g. `DateInterval`, `FileSize`) — only when no
    equivalent OData type exists.
  - **Custom formatter functions**: only for genuinely bespoke business logic that no built-in
    type covers.
  - Example: for a thousands-separator number → `sap.ui.model.odata.type.Decimal` with
    `formatOptions: { groupingEnabled: true }`. **Not** a hand-rolled formatter.
- **Cross-reference**: [`common-mistakes-ui.md`](common-mistakes-ui.md) M17 (formatter vs. expression binding)
  documents the same principle at the mechanical level.

### i18n `.properties` files must stay in sync

- **ALWAYS** apply every key change to **every** locale file. Adding a key to `i18n.properties` also
  requires adding it to `i18n_en.properties`, `i18n_de.properties`, `i18n_en_US.properties`.
- **Cross-reference (POD 2-specific)**: [`common-mistakes-i18n.md`](common-mistakes-i18n.md) —
  the SAP DM DE-plant translation contract (SFC → PSN) is a POD 2-specific extension of this generic rule
  (see M30). i18n keys stay in English; only user-facing values translate.

---

## §2 — TypeScript Event Handler Types (UI5 ≥ 1.115.0)

> POD 2 plugins are **JavaScript-only** today — no `@ui5/ts-interface-generator`, no `ui5-tooling-transpile`.
> This section is a forward-looking reference for when SAP DM greenlights TS pods.

- **Rule**: for any control event handler, import and use the specific event type from the control's
  module. The type is named `<ControlName>$<EventName>Event` — note the `Event` suffix.
- **Example**: for the `press` event of `sap.m.Button`:
  ```ts
  import Button, { Button$PressEvent } from "sap/m/Button";

  public onPress(event: Button$PressEvent): void {
      // event.getParameter(...) is fully typed — no cast needed
  }
  ```
- **Version compatibility**:
  - UI5 ≥ 1.115.0 (SAP DM's 1.136.x qualifies): **MUST** use the specific event type.
  - UI5 < 1.115.0: use `import Event from "sap/ui/base/Event"` as the generic fallback.

---

## §3 — Form Pattern (Fiori)

- **NEVER** use `sap.ui.layout.form.SimpleForm` unless the user explicitly requests it. It looks
  simpler up front but breaks responsive column layout and loses semantic form-element structure.
- **ALWAYS** use the explicit four-part composition:
  - `sap.ui.layout.form.Form` — the container
  - `sap.ui.layout.form.FormContainer` — a grouping (title + fields)
  - `sap.ui.layout.form.FormElement` — one label + one or more fields
  - `sap.ui.layout.form.ColumnLayout` — as the `layout:` — responsive column count

- **Responsive column defaults** on `ColumnLayout`:
  - **M** screens → 2 columns
  - **L** screens → 3 columns
  - **XL** screens → 4 columns

  Only override when the user asks for a different density.

- **POD 2 property-editor forms** are a **parallel API**, not the same one. `WidgetProperty` /
  `ActionProperty` in POD 2 use `PropertyEditor` classes (StringPropertyEditor, EnumPropertyEditor,
  …) for the POD Designer's property panel. See [`property-editors.md`](property-editors.md).
  The `sap.ui.layout.form.Form` pattern applies to forms **rendered inside a widget's `_createView()`**
  (data-entry forms for the operator, not designer-time metadata).

---

## §4 — Related Reading

- [`basics.md`](basics.md) §0 — the Prime Directive (standard controls before custom). Load first.
  These guidelines specialise §0 for UI-code shape; §0 governs the higher-level "which control".
- [`common-mistakes-imports.md`](common-mistakes-imports.md) — the concrete detection catalogue
  behind "never use globals / use sap.ui.define" (M36 pseudo-modules, M41 non-existent modules,
  M57 guessed namespaces).
- [`common-mistakes-ui.md`](common-mistakes-ui.md) — the mechanical UI-binding pitfalls (M17
  formatter-vs-expression, M28 multi-part binding null checks, and the M60/M61/M70 umbrellas).
- [`common-mistakes-i18n.md`](common-mistakes-i18n.md) — POD 2-specific i18n rules (SFC→PSN,
  key naming, multi-locale file discipline).
- [`fiori-design-compliance.md`](fiori-design-compliance.md) — the visual-fidelity companion.
  These guidelines say *how the code should be shaped*; that doc says *what the rendered result
  should look like*.

---

## What is deliberately NOT covered here

The full SAPUI5 SDK Guidelines doc (as returned by `@ui5/mcp-server` `get_guidelines`) contains
several sections that do **not** apply to POD 2 plugins and are intentionally omitted:

- **CAP integration** (`app/` layout, `cds compile`, `cds-plugin-ui5`, `cds watch` from CAP root,
  `ui5-middleware-simpleproxy`) — POD 2 plugins do not sit inside CAP projects.
- **HTML bootstrap** (`sap/ui/core/ComponentSupport` in `index.html`, `data-sap-ui-*` attributes) —
  POD 2 hosts the UI5 shell; plugins never own an `index.html`.
- **CSP inline-script rules** — irrelevant because plugins have no `<script>` blocks of their own.
- **Local `ui5 serve` behavior** — POD 2 plugin development doesn't use `ui5 serve`; deployment
  is a ZIP upload to SAP DM.
- **`run_ui5_linter` invocation** — POD 2 has its own `validate_project` tool that covers the
  linter's POD-relevant rules (M36, deprecated APIs) plus POD 2-specific detections the linter
  cannot know about.

If you need any of the omitted content, invoke the external `@ui5/mcp-server` in parallel — the
two servers do not conflict (see the [README.md](../../README.md) migration note under v5.14.0).
