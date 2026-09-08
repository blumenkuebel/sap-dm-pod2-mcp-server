# POD 2.0 Widget & Action Development – Context & Best Practices

> This document serves as the central context for POD 2.0 plugin development.
> For the API reference use the tools `get_api_doc` or `search_api_docs`.

---

## §0 — Prime Directive: Standard Controls Before Custom

**Whenever a UI requirement seems not to fit a control, the answer is almost always another SAPUI5 control — not a new one.**

> **Scope: this is the top-level rule for EVERY POD 2 UI decision, not just migrations or dashboards.**
> It applies equally to greenfield widgets, custom actions with dialogs, form-based CRUD widgets, table decorations, filter bars, master-detail navigation, POD Designer property editors, and every HTML5→POD 2.0 migration. Whenever a widget, action, dialog, fragment, or property editor is about to instantiate a `.extend(...)` subclass, hand-tune a `Panel`, or ship a `widget/css/*.css` file, §0 governs the decision. The specialisations (M60, M61, Cat 29, M70) name the migration-flavoured symptoms but the ladder itself is universal.
>
> **Related agent-behavior rules**: the domain rule below is the UI-choice counterpart to the two meta-rules delivered by `get_pod2_guidelines` — **Reasoning-First** (post plan before non-trivial edits) and **Source-or-Silence** (verify every POD 2 / UI5 fact via MCP, never invent). Neither replaces the other: Reasoning-First / Source-or-Silence tell the agent *how* to think; §0 tells it *what to build*.
>
> **Related code-shape rules**: for UI5 coding conventions (dependency loading, data binding, i18n locale sync, Fiori Form pattern), load [`ui5-guidelines.md`](ui5-guidelines.md) via `get_ui5_guidelines`. §0 governs *which* control; those guidelines govern *how the code around that control should look*.

Custom controls (`.extend(...)`, `sap/ui/core/Control` subclasses, hand-built composites imitating a Fiori pattern) belong to the small tail of legitimate cases where the standard library genuinely has no coverage. That tail exists, but it is much smaller than a first-time reading suggests. Reach for it **only after alignment with the Fiori/UX or dev enablement team** — never on the first pass, never silently, never as a shortcut around a slot that "doesn't quite fit".

**The Escalation Ladder — climb rung by rung, top to bottom:**

1. **Search for an alternative standard control.**
   Widen the query beyond the first hit: use `get_ui5_api` for named guesses, `pod2-mcp-server.search_all` for pattern-based lookup, and the decision tables in [`dashboard-patterns.md`](dashboard-patterns.md) and [`chart-migration-map.md`](chart-migration-map.md). A single standard control's slot map (e.g. `sap.f.cards.NumericHeader` with `title` / `subtitle` / `number` / `scale` / `unitOfMeasurement` / `state` / `trend` / `details` / `statusText` / `sideIndicators`) is usually wider than the first-hit control (`sap.m.GenericTile`).

2. **Escalate within the standard family** — smaller control → larger control that carries the same primary role but exposes more slots.
   `sap.m.GenericTile` → `sap.f.Card` + `sap.f.cards.NumericHeader`. `sap.m.Panel` → `sap.f.Card`. `sap.m.Text` → `sap.m.ObjectStatus` or `sap.m.ObjectNumber`. `sap.m.ProgressIndicator` → `sap.suite.ui.microchart.BulletMicroChart`. Follow the **Escalate-to** column in [`dashboard-patterns.md`](dashboard-patterns.md) §"Chart→control decision table".

3. **Compose standard controls** — put a smaller standard control in the `content` / `items` / free-form slot of a larger one.
   `sap.f.Card` + `NumericHeader` in `header:` + `sap.m.ProgressIndicator` in `content:`. `sap.m.Panel` + `sap.ui.layout.Grid` + N × `sap.m.ObjectStatus`. `sap.f.GridContainer` + N × `sap.f.Card`. Composition — **not** `.extend(...)` — covers virtually every UI need beyond a single control.

4. **Custom control — ONLY after team alignment, and only when 1–3 all failed.**
   Two conditions must both hold: (a) at least one senior team member from Fiori/UX or dev enablement has reviewed the case and confirmed no standard control or composition covers it; (b) the reason is recorded next to the `.extend(...)` call using the machine-readable marker:
   ```javascript
   // standard-only: exception — <reason>: aligned with <team/person>, <ticket-or-note>
   sap.ui.core.Control.extend("customer.custom.extensions.<name>.<name>Control", { ... });
   ```
   The `<reason>` MUST name the team/person consulted and either a ticket ID or a one-sentence note recording the decision. The generic `// validate: info-only` marker is **not** sufficient — this is a Rule-3 hard finding (see [`common-mistakes.md`](common-mistakes.md) §"What CANNOT be downgraded"). Missing marker → **M60/M61/Cat 29** error.

**Legitimate custom-control cases** — the tail is genuinely narrow: reusable behaviour with an event/state-machine contract used ≥3× in the same plugin (never a pure template — that's a fragment), a genuinely novel input surface that no existing UI5 control provides, or a compatibility shim for a legacy DOM component that the customer explicitly requires. Everything else — every KPI tile shape, every card layout, every chart-that-fits-a-microchart, every table decoration — is composition, not inheritance.

**The specialisations of this directive** (do not silence any of them):

- **M60** — custom control class for pure display composition. A `.extend(CustomVBox, {...})` whose body is only `setTitle`/`setValue` forwarders is a fragment masquerading as a control. Use `sap.m.GenericTile` + `NumericContent` or a Fragment.
- **M61** — plugin CSS surface. A `widget/css/*.css` file, `sap/ui/core/HTML` with `<style>`, or a non-Fiori-prefix `addStyleClass` is a workaround for "the standard control doesn't look quite right" — the correct answer is to escalate to a standard control that already looks that way (or to use `sapUi*Margin*` utility classes).
- **Cat 29** — custom composite where a standard SAPUI5 control exists. Seven anti-patterns caught in real migrations, each with a standard-control replacement.
- **M70** — silent information loss via standard-control bias. The rule is "the SMALLEST standard control that fits ALL source fields" — a first-choice pick that carries fewer slots than the source composite must escalate (rung 2), not silently drop fields.

If in doubt, ask. The cost of a five-minute question to the UI5 team is much smaller than shipping a custom control that competes with Fiori for the next five years.

---

## 0. Namespace Cheatsheet (READ FIRST)

POD 2.0 mixes two notations. Use this table to avoid confusion:

| Where it appears | Notation | Example | Notes |
|---|---|---|---|
| **`sap.ui.define([…])` imports** | slash-separated module paths | `"sap/dm/dme/pod2/widget/Widget"` | UI5 module loader |
| **`extension.json` `modulePath`** | slash-separated, no `.js` | `"customer/custom/extension/widget/MyWidget"` | Path inside ZIP |
| **`extension.json` `type`** | dot-separated, fully qualified | `"customer.custom.extension.widget.MyWidget"` | Logical type ID |
| **API doc filenames** | dot-separated | `sap.dm.dme.pod2.widget.Widget.md` | For `get_api_doc(name)` |
| **PodContext keys** | slash-separated, freely chosen | `"/myCompany/myPlugin/state"` | Just unique per plugin |

**Rules:**
- **Custom namespaces** for your plugins MUST NOT start with `sap/` or `sap.` (reserved for SAP).
- The directory/folder name is **irrelevant** for the namespace — what counts is what is in `extension.json`.
- `modulePath` and `type` are two views of the **same path** — slash vs dot separated.

> Old POD 1.0 / legacy refs (`sap.dm.dme.pod2`) still appear in API docs because they are the framework's internal name. Your custom code uses your own namespace (e.g. `customer.custom.extension.*`).

---

## 1. Core Concept

POD 2.0 plugin development is an extension mechanism for the SAP Digital Manufacturing (SAP DM) Fiori/UI5 framework. Plugins are uploaded as **Extensions** to SAP DM and become configurable through the **POD 2.0 Designer** (WYSIWYG editor).

There are two plugin types:

| Type | Purpose | Base Class |
|------|---------|------------|
| **Widget** | Visual UI component in the POD | `sap/dm/dme/pod2/widget/Widget` |
| **Action** | Business logic triggered by events | `sap/dm/dme/pod2/action/Action` |

---

## 2. Architecture Rules

### Widgets and Actions are independent

- A Widget must **never instantiate or reference** an Action directly.
- Both plugin types are only logically linked by the end user in the POD 2.0 Designer.
- Widgets define **Events** (e.g. `buttonPress`) to which the user assigns Action sequences.

### Data Exchange via PodContext

When data exchange between Actions and Widgets is needed, it happens through **PodContext** (`sap/dm/dme/pod2/context/PodContext`):

```javascript
// Set a value (e.g. in an Action)
PodContext.set("/myNamespace/myProperty", oValue);

// Read a value (e.g. in a Widget)
const oValue = PodContext.get("/myNamespace/myProperty");

// React to changes
PodContext.subscribe("/myNamespace/myProperty", (oNewValue) => { /* ... */ });
```

> **Important:** Always call `PodContext.unsubscribe()` when the component is destroyed (in `onExit()`).

### Widgets MAY Load Data at Runtime

Widgets are **allowed** to make backend calls (via `ApiClient`, `RestClient`, `fetch()`, etc.) to load display data. This is common for:

- Loading configuration/reference data in `onInit()`
- Refreshing data on PodContext changes (subscribe callbacks)
- Polling for live status updates
- Fetching dropdown options, validation rules, or metadata

The architectural separation rule only prohibits Widgets from **executing business logic that belongs in an Action** (e.g. Start SFC, Complete Phase, Report Quantity). Data retrieval for display purposes is perfectly valid in a Widget.

> **Note:** The `Customer.Coating` example happens to not make backend calls in its widget (it uses PodContext data set by Actions), but this is just one possible pattern — not a universal constraint.

### Context Class as Singleton Pattern

For centralized configuration and a unified mapping structure between Actions and Widgets, a **Context class** is recommended:

- Acts as a **Singleton** (static `get`/`set` methods)
- Used by both plugin types via dependency injection
- Serves as interface between individual Actions and Widgets

> **Example:** See Section 12 "Best Practice Pattern" below for the complete Context Singleton pattern.

---

## 3. Mandatory: Internationalization (i18n)

All plugins **must** support multiple languages. The following i18n files are required:

```
i18n/
├── i18n.properties          (Fallback)
├── i18n_de.properties       (German)
├── i18n_en.properties       (English)
└── i18n_en_US.properties    (English US)
```

Usage in code:
```javascript
// In Widget/Action:
this.getI18nText("myKey");
this.getI18nText("myKeyWithParams", sValue1, sValue2);
```

> For details see the "Internationalization" patterns in `widget-patterns-core` (i18n section).

---

## 4. Project Structure

### Recommended Folder Structure

```
myExtension/
├── extension.json           (Required – plugin registration)
├── widget/
│   └── MyWidget.js          (Widget class)
├── action/
│   └── MyAction.js          (Action class)
├── context/
│   └── MyContext.js          (Context class / Singleton)
├── util/
│   └── Helper.js            (Helper functions)
├── libs/
│   └── thirdparty.min.js    (Third-party libraries)
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
```

### extension.json

Every extension must contain an `extension.json` in the root:

```json
{
    "widgets": [
        {
            "modulePath": "myCompany/extension/widget/MyWidget",
            "type": "myCompany.extension.widget.MyWidget"
        }
    ],
    "actions": [
        {
            "modulePath": "myCompany/extension/action/MyAction",
            "type": "myCompany.extension.action.MyAction"
        }
    ]
}
```

> **Caution:** Namespaces starting with `sap/` are reserved and will cause upload errors.

---

## 5. Third-Party Libraries

The framework supports third-party libraries:

- Place the library as a `*.js` file in the `libs/` folder
- Import via dependency injection (`sap.ui.define`)

> **Note:** Third-party libraries are placed as minified `.js` files in the `libs/` folder of the extension and imported via `sap.ui.define`.

---

## 6. Configurable Properties

Plugins can offer configurable settings to the user in the POD Designer:

| Plugin Type | Property Class | Import Path |
|-------------|---------------|-------------|
| Widget | `WidgetProperty` | `sap/dm/dme/pod2/widget/metadata/WidgetProperty` |
| Action | `ActionProperty` | `sap/dm/dme/pod2/action/metadata/ActionProperty` |

Built-in Property Editors:
- `BooleanPropertyEditor` – Checkbox
- `StringPropertyEditor` – Text field
- `SelectPropertyEditor` – Dropdown
- Custom Property Editors possible (see `property-editors` pattern doc)

```javascript
getProperties() {
    return [
        new WidgetProperty({
            displayName: this.getI18nText("propLabel"),
            description: this.getI18nText("propDescription"),
            category: "General",
            propertyEditor: new BooleanPropertyEditor(this, "myProperty")
        })
    ];
}
```

---

## 7. Widget Lifecycle

| Phase | Method | Notes |
|-------|--------|-------|
| Create view | `_createView()` | Can be async, returns a UI5 Control |
| Initialization | `onInit()` | After view creation |
| Property change | `setPropertyValue(name, value)` | For live preview in Designer |
| Destruction | `onExit()` | Clean up subscriptions here! |

---

## 8. Action Lifecycle

| Phase | Method | Notes |
|-------|--------|-------|
| Initialization | `onInit()` | Optional, can be async |
| Execution | `execute(oActionContext)` | Can be sync or async (Promise) |
| Abort | `oActionContext.abort()` | Stops the action sequence |
| Cleanup | `onExit()` | Optional |

---

## 9. Best Practices

### Code Style
- **ES6+ classes** with `sap.ui.define` for modules
- **Private fields** (`#field`) for internal state
- **JSDoc comments** for all public methods

### PodContext
- Use **unique namespace** paths (e.g. `/myCompany/myProperty`)
- **Never** mutate shared objects directly – always clone and re-set
- Clean up subscriptions in `onExit()`

### Error Handling
- Use `Logger` instead of `console.log`:
  ```javascript
  const oLog = Logger.getLogger("myCompany.extension.MyWidget");
  oLog.info("Widget initialized");
  oLog.error("Failed to load data", oError);
  ```
- In Actions: throwing an error stops the entire action sequence
- In Actions: use `abort()` for intentional cancellations (e.g. dialog cancel)

### Packaging
- Extension as ZIP/TAR/TGZ (< 5 MB)
- `extension.json` must be in the archive root
- Upload via **Manage PODs 2.0 → Extensions → Create**

---

## 10. Framework: Built-in Widgets & Actions

The POD 2.0 Framework (`framework/src/sap/dm/dme/pod2/`) contains numerous **standard Widgets and Actions** available directly in the POD Designer. Before creating a custom plugin, check if the functionality already exists.

### Standard Widgets

| Category | Path | Description |
|----------|------|-------------|
| **WorkList** | `widget/worklist/` | Work list (SFCs, Orders) |
| **Order** | `widget/order/` | Order details |
| **SFC** | `widget/sfc/` | SFC information |
| **Assembly** | `widget/assembly/` | Assembly overview |
| **Data Collection** | `widget/datacollection/` | Data collection |
| **Quantity Confirmation** | `widget/quantityconfirmation/` | Quantity confirmation |
| **Work Instruction** | `widget/workinstruction/` | Work instructions |
| **Activity Confirmation** | `widget/activityconfirmation/` | Activity confirmation |
| **Goods Receipt** | `widget/goodsreceipt/` | Goods receipt |
| **Timer** | `widget/timer/` | Timer display |
| **Filter** | `widget/filter/` | Filter control |
| **Notification** | `widget/notification/` | Notifications (WebSocket) |
| **Layout** | `widget/layout/` | Layout containers |
| **Core** | `widget/core/` | Base widgets |

**Widget Base Classes:**
- `Widget` – Standard base class (recommended for custom widgets)
- `ControlWidget` – For widgets based on a single UI5 control
- `ComponentWidget` – For legacy compatibility with POD 1.0 components
- `IntegrationWidget` – For embedded web applications (e.g. React)
- `LayoutWidget` – For container widgets

### Standard Actions

| Category | Path | Included Actions |
|----------|------|-----------------|
| **SFC** | `action/sfc/` | StartAction, CompleteAction, SignoffAction, SplitAction, SerializeAction, SfcExecutionAction |
| **Phase** | `action/phase/` | StartPhaseAction, CompletePhaseAction |
| **Dialog** | `action/dialog/` | ShowDialogAction, CloseDialogAction |
| **Navigation** | `action/page/` | NavigateToPageAction, NavigateBackAction, NavigateToWidgetAction |
| **Badge** | `action/badge/` | BadgeInAction, BadgeOutAction |
| **Batch** | `action/batch/` | CreateBatchAction |
| **Core** | `action/core/` | BusyIndicatorAction, ConfirmAction, LogoutAction, MessageBoxAction |
| **WorkList** | `action/worklist/` | RefreshWorkListAction, RefreshOperationActivitiesAction |
| **Data Collection** | `action/datacollection/` | LogDataCollectionGroupAction, NextDataCollectionGroupAction, RefreshDataCollectionGroupsAction |
| **Quantity** | `action/quantityconfirmation/` | ReportQuantityAction |
| **Order** | `action/order/` | UpdateAlternateResourceAction |
| **Production Process** | `action/pp/` | ProductionProcessAction |

### API Clients

The framework provides ready-made API clients for accessing SAP DM APIs:

| API Client | Import Path | Purpose |
|------------|-------------|---------|
| `SfcPublicApiClient` | `sap/dm/dme/pod2/api/sfc/SfcPublicApiClient` | SFC operations |
| `OrderPublicApiClient` | `sap/dm/dme/pod2/api/order/OrderPublicApiClient` | Order API |
| `MaterialPublicApiClient` | `sap/dm/dme/pod2/api/material/MaterialPublicApiClient` | Material master data |
| `ResourcePublicApiClient` | `sap/dm/dme/pod2/api/resource/ResourcePublicApiClient` | Resource API |
| `WorkCenterPublicApiClient` | `sap/dm/dme/pod2/api/workcenter/WorkCenterPublicApiClient` | Work center API |
| `InventoryPublicApiClient` | `sap/dm/dme/pod2/api/inventory/InventoryPublicApiClient` | Inventory management |
| `BomPublicApiClient` | `sap/dm/dme/pod2/api/bom/BomPublicApiClient` | Bill of materials API |
| `AssemblyPublicApiClient` | `sap/dm/dme/pod2/api/assembly/AssemblyPublicApiClient` | Assembly API |
| `DataCollectionPublicApiClient` | `sap/dm/dme/pod2/api/datacollection/DataCollectionPublicApiClient` | Data collection API |
| `WorkInstructionPublicApiClient` | `sap/dm/dme/pod2/api/workinstruction/WorkInstructionPublicApiClient` | Work instructions API |
| `OperationActivityPublicApiClient` | `sap/dm/dme/pod2/api/operationactivity/OperationActivityPublicApiClient` | Operation activities API |
| `ProcessOrderPublicApiClient` | `sap/dm/dme/pod2/api/processorder/ProcessOrderPublicApiClient` | Process order API |
| `UomPublicApiClient` | `sap/dm/dme/pod2/api/uom/UomPublicApiClient` | Unit of measure API |
| `ODataV2Client` | `sap/dm/dme/pod2/api/odata/ODataV2Client` | Generic OData V2 client |
| `ODataV4Client` | `sap/dm/dme/pod2/api/odata/ODataV4Client` | Generic OData V4 client |

> **Tip:** Use the tools `get_api_doc` and `search_api_docs` for complete documentation of each API client. Use `search_rest_apis` to search the REST API specifications.

---

## 11. Framework Samples

The framework folder (`framework/samples/extensions/`) contains official sample extensions: `ClockWidget`, `ConsoleLogAction`, `CustomWorkListTableWidget`, and React integration samples (`TicTacToeWidget`, `WorkListFilterDisplayWidget`). The framework supports embedded React apps via `IntegrationWidget`.

---

## 12. Recommended Plugin Pattern (Best Practice)

The following pattern is the **reviewed best practice reference** for POD 2.0 plugins. New plugins should follow this structure.

### Pattern: Validation → Execution with Singleton Context

```
MyPlugin/
├── extension.json
├── README.md
├── widget/{Name}Widget.js              ← UI component
├── action/{Name}ValidationAction.js    ← Validation (before execution)
├── action/{Name}ExecutionAction.js     ← Business logic
├── context/{Name}Context.js            ← Singleton for data exchange
└── i18n/ (4 files)
```

**Flow in POD Designer:**
1. User clicks button in Widget → Event is triggered
2. **ValidationAction** checks preconditions (e.g. "Is an SFC selected?")
3. On error: `throw new Error(...)` → Action sequence stops, error message appears
4. **ExecutionAction** performs the actual logic (e.g. API call)
5. Data exchange between Widget and Actions via **Context Singleton**

### Context Class (Singleton Pattern)

The context class encapsulates PodContext access and defines UI element IDs and message keys:

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/context/PodContext",
], (PodContext) => {
    "use strict";

    class MyContext {
        // Frozen object for UI element IDs
        static #uiElements = Object.freeze({
            INPUT_NAME: "myPlugin.input.name",
        });
        static get uiElements() { return this.#uiElements; }

        // Frozen object for i18n message keys
        static #msg = Object.freeze({
            NO_ITEM_SELECTED: "msg.noItemSelected",
            CALL_FAILED:      "msg.callFailed",
        });
        static get msg() { return this.#msg; }

        // Typed PodContext access methods
        static setName(value)  { PodContext.set("/myCompany/myPlugin/name", value); }
        static getName()       { return PodContext.get("/myCompany/myPlugin/name"); }
    }

    return MyContext;
});
```

### Validation Action (Skeleton)

```javascript
sap.ui.define([
    "myCompany/extension/context/MyContext",
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
], (MyContext, Action, PodContext, I18nResourceModel) => {
    "use strict";

    class MyValidationAction extends Action {
        static #oI18nModel = new I18nResourceModel({ bundleName: "myCompany.extension.i18n.i18n" });
        static getI18nModel()   { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("validationAction.displayName"); }
        static getDescription() { return this.getI18nText("validationAction.description"); }

        execute(oActionContext) {
            const aItems = PodContext.getSelectedWorkListItems();
            if (!aItems || aItems.length === 0) {
                throw new Error(this.getI18nText(MyContext.msg.NO_ITEM_SELECTED));
            }
            // Further validations...
        }
    }

    return MyValidationAction;
});
```

### Widget (Skeleton)

```javascript
sap.ui.define([
    "myCompany/extension/context/MyContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    // ... UI5 Controls
], (MyContext, I18nResourceModel, Widget, PodContext /*, ... */) => {
    "use strict";

    class MyWidget extends Widget {
        static #oI18nModel = new I18nResourceModel({ bundleName: "myCompany.extension.i18n.i18n" });
        static getI18nModel()   { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("myWidget.displayName"); } // See M32 — <widgetName>.* prefix required
        static getIcon()        { return "sap-icon://action"; }
        static getCategory()    { return this.getI18nText("myWidget.category"); }
        static getDescription() { return this.getI18nText("myWidget.description"); }

        onInit() {
            // Initialization: load data, set context
        }

        _createView() {
            const oConfig = this.getConfig();
            // Create and return UI5 controls
            // return new VBox(oConfig.id, { items: [...] });
        }

        onExit() {
            // Clean up subscriptions
        }
    }

    return MyWidget;
});
```

---

## 13. Pattern Documentation

Comprehensive pattern documentation is available for detailed implementation guidance:

| Document | Content |
|----------|---------|
| `widget-patterns-core` | Core widget type templates (ControlWidget, LayoutWidget, TableWidget, ContentHandler, i18n) |
| `widget-patterns-advanced` | Advanced patterns (API integration, pagination, complex cells, ComponentWidget, IntegrationWidget) |
| `advanced-patterns` | 11 advanced enterprise patterns (toolbars, authorization, dynamic columns, error handling with retry, etc.) |
| `common-mistakes-*` | 38 documented mistakes split into 7 category files — load only the relevant category |
| `form-patterns` | Form validation, input handling, submit patterns |
| `binding-patterns` | Data binding (multi-part, expression, formatter classes) |
| `tablecell-patterns` | 13 table cell types (text, date, status, actions, charts) |
| `tablewidget-complete` | Complete TableWidget guide with pagination and selection sync |
| `dialog-patterns` | Dialog creation, lifecycle, and destruction |
| `error-handling` | Error handling, retry patterns, user feedback |
| `delegate-architecture` | 8 official data delegates (WorkList, DataCollection, etc.) |
| `PATTERN-INDEX` | Quick-reference index by widget type, use case, and complexity |

> **Tip:** Use `get_pattern_doc({ name: "...", summary: true })` to get the table of contents before loading a large file, or `list_pattern_docs` for an overview of all available pattern documents.

---

## 14. Available Resources

| Resource | URI / Tool | Content |
|----------|-----------|---------|
| This file | `pod2://patterns/basics` | Context & Best Practices |
| Pattern Index | `pod2://patterns/index` | Quick-reference by widget type, use case |
| Pattern Docs | Tool: `get_pattern_doc` | Widget patterns, common mistakes, etc. |
| Pattern List | Tool: `list_pattern_docs` | All 44 pattern documents |
| Pattern Search | Tool: `search_docs` | Full-text search in pattern docs |
| API Index | Tool: `get_api_index` | Overview of all POD2 classes/namespaces |
| API Detail | Tool: `get_api_doc` | Complete class documentation (485 classes) |
| API Search | Tool: `search_api_docs` | Full-text search in API reference |
| REST APIs | Tool: `get_rest_api` | OpenAPI specification for a SAP DM service |
| REST List | Tool: `list_rest_apis` | All 79 REST API specs |
| REST Search | Tool: `search_rest_apis` | Search for endpoints in REST APIs |
| Cross-Search | Tool: `search_all` | Full-text search across all areas |
| Guidelines | Tool: `get_pod2_guidelines` | Compact rules (call once at start) |
| Widget Prompt | Prompt: `create_widget` | Widget generation following best practice |
| Action Prompt | Prompt: `create_action` | Action generation following best practice |
| Extension Prompt | Prompt: `create_extension` | Complete extension generation |

---

## 15. Step-by-Step: Creating a New Plugin

### Checklist

1. **Choose namespace** – e.g. `myCompany.myProject` (must NOT start with `sap/`!)
2. **Create folder structure:**
   ```
   MyPlugin/
   ├── extension.json
   ├── context/MyPluginContext.js
   ├── widget/MyPluginWidget.js
   ├── action/MyPluginValidationAction.js
   ├── action/MyPluginExecutionAction.js
   └── i18n/ (4 files)
   ```
3. **Create `extension.json`** with correct `modulePath` and `type` entries
4. **Create Context Singleton** with `uiElements`, `msg`, and typed PodContext access
5. **Implement Widget**: `_createView()`, `onInit()`, `onExit()` with cleanup
6. **Implement ValidationAction**: precondition checks, `throw new Error(...)` on failure
7. **Implement ExecutionAction**: API calls, context updates, try/catch
8. **Create i18n files** (properties, _de, _en, _en_US)
9. **Test** in POD Designer: place widget, link events to actions
10. **Package** as ZIP/TAR/TGZ (< 5 MB, `extension.json` in root!)
11. **Upload** via Manage PODs 2.0 → Extensions → Create

---

## 16. Common Errors & Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Upload fails: "Invalid namespace" | Namespace starts with `sap/` | Use custom namespace (e.g. `myCompany/`) |
| Upload fails: "extension.json not found" | `extension.json` not in ZIP root | Create ZIP so `extension.json` is at top level |
| Widget/Action not visible in Designer | Wrong `type`/`modulePath` in `extension.json` | `type` must match class name, `modulePath` must match file path |
| Memory leak / Widget unresponsive | `PodContext.subscribe()` without `unsubscribe()` | Always clean up in `onExit()` |
| ZIP too large (> 5 MB) | Unnecessary files (node_modules, .git) | Only package code files, minify third-party libs |
| "Module not found" at runtime | Wrong import path in `sap.ui.define` | Path must match `modulePath` in `extension.json` |
| Static fields (`#field`) don't work | Outdated UI5 runtime | Only available from UI5 1.96+; use closure pattern as fallback |
| Action sequence stops without error | `throw` without `Error` object | Always use `throw new Error("message")` |
| Shared object unexpectedly modified | Direct mutation of PodContext objects | Clone objects before setting: `PodContext.set(key, {...obj})` |
| i18n texts not displayed | Wrong `I18nResourceModel` path | Path must match namespace + `i18n.i18n` |

---

## 17. API Client Usage (Examples)

### Query SFC Data

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/api/sfc/SfcPublicApiClient",
    "sap/dm/dme/pod2/Logger",
], (SfcPublicApiClient, Logger) => {
    "use strict";

    const oLog = Logger.getLogger("myCompany.extension.MyAction");

    class MyAction extends Action {
        async execute(oActionContext) {
            try {
                const oSfcClient = new SfcPublicApiClient();
                const aResults = await oSfcClient.getSfcDetails({
                    plant: "PLANT1",
                    sfc: "SFC-001"
                });
                oLog.info("SFC details loaded", aResults);
            } catch (oError) {
                oLog.error("Failed to load SFC details", oError);
                throw new Error(this.getI18nText("msg.sfcLoadFailed"));
            }
        }
    }

    return MyAction;
});
```

### Query Order Data

```javascript
const oOrderClient = new OrderPublicApiClient();
const oOrder = await oOrderClient.getOrder({
    plant: "PLANT1",
    order: "ORD-001"
});
```

### Read Material Master Data

```javascript
const oMaterialClient = new MaterialPublicApiClient();
const oMaterial = await oMaterialClient.getMaterial({
    plant: "PLANT1",
    material: "MAT-001"
});
```

### OData V4 for Custom Queries

```javascript
const oODataClient = new ODataV4Client();
const oResponse = await oODataClient.get({
    servicePath: "/sap/opu/odata4/sap/my_service/",
    entitySet: "MyEntitySet",
    filter: "$filter=status eq 'ACTIVE'"
});
```

> **Tip:** Use `get_api_doc` with the respective client name (e.g. `sap.dm.dme.pod2.api.sfc.SfcPublicApiClient`) for complete method documentation.
