# Common Mistakes — 💾 Lifecycle & Memory

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #3: Wrong PodContext Import Path ❌ → ✅

**Error**: `404 - Failed to load PodContext.js`

```javascript
// ❌ WRONG - These paths don't exist!
import PodContext from "sap/dm/dme/pod2/model/PodContext";
import ModelPath from "sap/dm/dme/pod2/model/ModelPath";

// ✅ CORRECT - Use context/ not model/
import PodContext from "sap/dm/dme/pod2/context/PodContext";
import ModelPath from "sap/dm/dme/pod2/context/ModelPath";
```

**Why this happens**: SAP moved these to the `context/` package but many examples still show the old path.

---

---

## Mistake #4: Passing Default Value to StringPropertyEditor ❌ → ✅

**Issue**: Passing a default value as the 3rd parameter to `StringPropertyEditor` can cause issues.

```javascript
// ❌ WRONG - Don't pass default value to property editor
new StringPropertyEditor(
    this,
    "apiEndpoint",
    "/production/process/execute"  // ❌ Don't pass this!
)

// ✅ CORRECT - Let default come from getDefaultConfig()
new StringPropertyEditor(
    this,
    "apiEndpoint"  // Only 2 parameters!
)
```

**Why**: Default values should be defined in `getDefaultConfig()` and handled by `getPropertyValue()`, not passed to the property editor constructor.

**Official SAP Pattern:**
```javascript
// Define default in getDefaultConfig()
static getDefaultConfig() {
    return {
        properties: {
            apiEndpoint: "/production/process/execute"
        }
    };
}

// Handle runtime defaults in getPropertyValue()
getPropertyValue(sName) {
    const vValue = super.getPropertyValue(sName);
    switch (sName) {
        case "apiEndpoint":
            return vValue || "/production/process/execute";
    }
    return vValue;
}
```

---

---

## Mistake #5: Wrong Callback Parameter Order ❌ → ✅

**Error**: `TypeError: aResources.map is not a function`

```javascript
// ❌ WRONG - Parameters in wrong order!
PodContext.subscribe(ModelPath.FilterResources, (sPath, aResources) => {
    // sPath is actually the DATA array!
    // aResources is actually the PATH string!
    const list = aResources.map(r => r.resource); // 💥 CRASH!
});

// ✅ CORRECT - Data FIRST, path SECOND
PodContext.subscribe(ModelPath.FilterResources, (aResources, sPath) => {
    // aResources is the DATA (first parameter)
    // sPath is the PATH (second parameter)
    const resources = Array.isArray(aResources) ? aResources : [];
    const list = resources.map(r => r?.resource || "Unknown");
});
```

**Critical Rule**: Callback signature is `(newValue, path)` NOT `(path, newValue)`!

**Why this happens**: Most frameworks use (path, value) order, but PodContext uses (value, path).

---

---

## Mistake #19: Not Destroying Dialogs in afterClose ⭐⭐⭐⭐⭐

**Problem**: Dialog remains in memory after closing, causing memory leaks. Applies to `sap.m.Dialog`, `sap.m.Popover`, and `sap.dm.dme.pod2.dialog.PodDialog` alike — anything opened dynamically and not destroyed leaks.

**Fix**: Always destroy in `afterClose`.

```javascript
// ❌ WRONG - generic Dialog, no afterClose destroy
const oDialog = new Dialog({ /* ... */ });
oDialog.open();  // Never destroyed!

// ❌ WRONG - PodDialog, afterClose without destroy
new PodDialog({
    title: "My Dialog",
    afterClose: () => {
        // Dialog still exists in memory!
    }
});

// ✅ CORRECT - generic Dialog
const oDialog = new Dialog({
    afterClose: () => { oDialog.destroy(); }
});
oDialog.open();

// ✅ CORRECT - PodDialog
new PodDialog({
    title: "My Dialog",
    afterClose: () => this.destroy()  // Clean up!
});
```

**Why Critical:** Every dialog instance without `destroy()` leaks memory. In long-running POD sessions, this accumulates. The same rule applies to popovers opened via `.openBy(...)` and to fragments loaded via `Fragment.load(...)` — if you construct it dynamically, you must destroy it in `afterClose`.

**See also:** [dialog-patterns.md#standalone-dialog-handler-pattern](dialog-patterns.md#standalone-dialog-handler-pattern)

---

---

## Mistake #33: BusyIndicator in Actions via View Instead of `sap/ui/core/BusyIndicator`

**Error**: BusyIndicator in an Action either has no visible effect or blocks the entire POD page.

**Found in**: Custom Execution Actions that show a loading state during API calls.

**Critical**: Actions do **not** have their own widget view. `this.getPodRuntime().getView()` returns the **POD Shell view** — not any widget's view.

### ❌ WRONG — View-based BusyIndicator in an Action

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/api/ApiClient"
], (Action, ApiClient) => {
    "use strict";

    class MyExecutionAction extends Action {
        async execute(oActionContext) {
            const oView = this.getPodRuntime().getView();
            oView.setBusyIndicatorDelay(0);
            oView.setBusy(true);  // 💥 Blocks entire POD or does nothing!
            try {
                await ApiClient.internal.processengine.start(request);
            } finally {
                oView.setBusy(false);
            }
        }
    }
    return MyExecutionAction;
});
```

### ✅ CORRECT — Use `sap/ui/core/BusyIndicator` in Actions

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/ui/core/BusyIndicator"      // ✅ Import global BusyIndicator
], (Action, ApiClient, BusyIndicator) => {
    "use strict";

    class MyExecutionAction extends Action {
        async execute(oActionContext) {
            BusyIndicator.show(0);  // ✅ Global overlay, immediate, no delay
            try {
                await ApiClient.internal.processengine.start(request);
            } finally {
                BusyIndicator.hide();  // ✅ Always clean up
            }
        }
    }
    return MyExecutionAction;
});
```

### Decision Matrix — There Are Exactly Two Cases

| Context | Required Pattern | Import | Scope |
|---|---|---|---|
| **Widget** (onInit, _createView, event handler, async method) | `const oView = this.getView(); oView.setBusyIndicatorDelay(0); oView.setBusy(true/false);` | — | Widget area only |
| **Action** (`execute()`) | `BusyIndicator.show(0)` / `BusyIndicator.hide()` | `"sap/ui/core/BusyIndicator"` | Global overlay |

**No other patterns are allowed.** In particular:

- ❌ `this.setBusy(...)` — `Widget` does NOT have a `setBusy()` method (TypeError or no-op).
- ❌ `oView.setBusy(true)` **without** a preceding `oView.setBusyIndicatorDelay(0)` — UI5 default is a 1000ms delay, which causes a perceived "no feedback" UX. Delay 0 is mandatory.
- ❌ Inline `new BusyIndicator(...)` from `sap/m/BusyIndicator` as a sub-control inside a widget — overkill; the view-level busy state (`getView().setBusy()`) is the supported mechanism.
- ❌ Single-control busy in a widget (`oTable.setBusy()`, `oList.setBusy()`, etc.) — use the widget view instead.

### The Verbatim Widget Pattern (mandatory)

```javascript
async _doSomethingAsync() {
    const oView = this.getView();
    oView.setBusyIndicatorDelay(0);   // ✅ MUST — delay 0
    oView.setBusy(true);              // ✅ MUST — via getView()
    try {
        await ApiClient.internal.someEndpoint(oRequest);
    } catch (oError) {
        this.#oLog.error("...", oError);
        MessageHistory.showError(oError.message);
    } finally {
        oView.setBusy(false);         // ✅ MUST — in finally
    }
}
```

### Why This Happens

1. Developers copy `setBusy()` from generic UI5 controller examples (where `this.setBusy()` works) into a `Widget` subclass (where it does NOT).
2. Developers copy `setBusy()` from Widget code into Actions.
3. `this.getPodRuntime().getView()` in an Action returns the POD Shell root view — not any widget view.
4. The Action base class does NOT have `getView()` — only `getPodRuntime()`.

### Detection

```bash
# Action-side findings (M33 — Error)
grep -rnE "\.setBusy\(" action/
grep -rnE "getPodRuntime\(\)\.getView\(\)" action/

# Widget-side findings (M33 — Error)
grep -rnE "this\.setBusy\(" widget/                            # forbidden (Widget has no setBusy)
grep -rnE "new BusyIndicator\(" widget/                        # forbidden (inline anti-pattern)
grep -rnE "sap/m/BusyIndicator" widget/                        # forbidden (import of the wrong class)

# Missing setBusyIndicatorDelay(0) before setBusy(true) — Warning
grep -B1 "setBusy(true)" widget/ | grep -v "setBusyIndicatorDelay"
```

Any hit → replace with the canonical pattern shown above (Widget) or `BusyIndicator.show(0)` / `BusyIndicator.hide()` (Action).

### Prevention

- ✅ In **Widgets**: **always** the three-line preamble — `const oView = this.getView(); oView.setBusyIndicatorDelay(0); oView.setBusy(true);`
- ✅ In **Actions**: always `sap/ui/core/BusyIndicator` (global, no view needed)
- ✅ Always `try/finally` for `oView.setBusy(false)` / `BusyIndicator.hide()`
- ✅ `setBusyIndicatorDelay(0)` / `BusyIndicator.show(0)` — delay 0 for immediate display
- ❌ Don't `this.setBusy(...)` in a Widget — there is no such method
- ❌ Don't `getPodRuntime().getView().setBusy()` in Actions
- ❌ Don't `new BusyIndicator(...)` as a sub-control inside a widget
- ❌ Don't `oTable.setBusy()` / `oList.setBusy()` as a substitute for `oView.setBusy()` in widget code
- ❌ Don't forget `.hide()` / `setBusy(false)` — stuck indicators are a UX disaster

### Related

- [Mistake #23: Forgetting to Clear Busy State on Error](common-mistakes-data.md#mistake-23-forgetting-to-clear-busy-state-on-error---)
- [SAP UI5 API: sap.ui.core.BusyIndicator](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.BusyIndicator)

---

---

## Mistake #35: Missing i18nCustomModel Registration in `onInit()` ❌ → ✅

**Error**: The POD 2.0 framework cannot resolve i18n keys from the extension's bundle. `{i18nMyWidget>myWidget.title}` bindings silently show the raw key instead of the translated text. `getI18nText()` calls in the widget return the key as-is.

**Found in**: Any widget that has an `I18nResourceModel` defined as a static field but forgets to register it on the POD view in `onInit()`.

**Critical**: Without this registration, the POD 2.0 framework has no way to resolve your extension's i18n keys. The static `I18nResourceModel` only works for **programmatic** lookups (`this.getI18nText("...")`) inside the widget class itself — it does NOT automatically become available for `{i18nXxx>...}` bindings in the UI or for the framework's internal metadata resolution (widget displayName, description, category in the POD Designer palette).

### ❌ WRONG — I18nResourceModel defined but not registered on POD view

```javascript
class MyWidget extends Widget {
    static #oI18nModel = new I18nResourceModel({
        bundleName: "customer.custom.extension.mywidget.i18n.i18n"
    });

    static getI18nModel() { return this.#oI18nModel; }

    async onInit() {
        await super.onInit();
        // ❌ Missing: model not registered on POD view!
        // getI18nText() works inside this class,
        // but {i18nMyWidget>...} bindings are broken
    }
}
```

### ✅ CORRECT — Register on POD view in `onInit()` with a unique model name

```javascript
class MyWidget extends Widget {
    static #oI18nModel = new I18nResourceModel({
        bundleName: "customer.custom.extension.mywidget.i18n.i18n"
    });

    static getI18nModel() { return this.#oI18nModel; }

    async onInit() {
        await super.onInit();

        // Register i18n custom model for this extension on the POD view.
        // This is REQUIRED for the POD 2.0 framework to access
        // extension i18n keys (bindings, metadata, POD Designer palette).
        this.getPodRuntime().getView().setModel(
            MyWidget.getI18nModel(),
            "i18nMyWidget"  // ✅ Convention: "i18n" + PascalCase widget name
        );
    }
}
```

### Naming Convention

| Widget class | Model name |
|---|---|
| `CoatingWidget` | `"i18nCoating"` |
| `TableViewWidget` | `"i18nTableView"` |
| `HelloWorldWidget` | `"i18nHelloWorld"` |
| `StepStatusWidget` | `"i18nStepStatus"` |

The pattern is: `"i18n"` + PascalCase widget short name (without the `Widget` suffix). This avoids collisions with other widgets' models on the same POD view. For **multi-widget plugins** this gives each widget its own model (e.g. `i18nCoating` AND `i18nHelloWorld` side-by-side) — see the Multi-Widget Plugins section below.

### Why This Matters

1. **POD Designer palette** reads `getDisplayName()` / `getDescription()` / `getCategory()` — those static methods call `getI18nText()` which internally needs the model registered to function correctly in all framework contexts.
2. **Bindings** like `text: "{i18nCoating>coating.title.sfcs}"` in the widget's view only work if the model is set on the POD view.
3. **Lifecycle**: must happen in `onInit()` (not in `_createView()`) because `getPodRuntime()` may not be available earlier.

### Detection

```bash
# Check if onInit() contains the setModel registration
grep -nE "setModel.*i18n" widget/

# Verify the model name follows convention ("i18n" + PascalCase)
grep -nE "\"i18n[A-Z]" widget/
```

If the widget has a static `#oI18nModel` but no `setModel(...)` call in `onInit()` → missing registration.

### Prevention

- ✅ In EVERY widget that has `static #oI18nModel`: add the `setModel` call in `onInit()`
- ✅ Use the naming convention: `"i18n" + PascalCase widget short name` (multi-widget plugins register one model per widget)
- ✅ Place it right after `await super.onInit()` — before any other logic
- ❌ Don't skip it "because getI18nText works without it" — bindings and framework metadata access will break
- ❌ Don't use a generic name like `"i18n"` — it will collide with other plugins / the framework's own i18n model

### Multi-Widget Plugins

When a extension registers **multiple widgets** in `extension.json`, each widget registers its **own** custom i18n model on the POD view — one per widget, uniform with the M32 `<widgetName>.` key convention. No special-casing needed:

```javascript
// Extension with 2 widgets — each widget's onInit() registers its own i18n model.
// The model names are namespaced by widget, so there is no collision.

class CoatingWidget extends Widget {
    async onInit() {
        await super.onInit();
        this.getPodRuntime().getView().setModel(
            CoatingWidget.getI18nModel(),
            "i18nCoating"  // ✅ widget-scoped
        );
    }
}

class HelloWorldWidget extends Widget {
    async onInit() {
        await super.onInit();
        this.getPodRuntime().getView().setModel(
            HelloWorldWidget.getI18nModel(),
            "i18nHelloWorld"  // ✅ widget-scoped — different name, no collision
        );
    }
}
```

Both widgets can share the **same** bundle (`bundleName: "customer.custom.extension.myplugin.i18n.i18n"`) if their i18n keys use the per-widget prefix from M32 (`coating.*` / `helloWorld.*`). The convention is uniform: **always `i18n<WidgetShortName>`**, regardless of how many widgets the extension has.

### Related

- [Mistake #32: Widget Metadata i18n Keys](common-mistakes-config.md#mistake-32-widget-metadata-i18n-keys--use-named-prefix-widgetnamedisplayname-etc) — the keys that the framework reads from the registered model
- [usage/CLAUDE.md Critical Rule #9](../../usage/CLAUDE.md) — `i18nCustomModel` registration is listed as a critical rule
- See all 3 reference examples: `Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView` — they all register the model in `onInit()`


---

---


## Mistake #39: Wrong Base Class — LayoutWidget Instead of Widget

**Error**: Widget crashes immediately on load. Console shows errors about missing Control class, undefined constructor parameters, or `Cannot read properties of undefined` during framework introspection.

**Found in**: Custom widgets that extend `LayoutWidget` (or `ControlWidget`) instead of `Widget`.

**Critical**: This is the **#1 crash cause** for widgets that load but immediately fail. `LayoutWidget` is an internal framework class for POD Designer **container widgets** (VBox, HBox, ObjectPageLayout) that host OTHER widgets inside their aggregations. It expects a `ControlClass` argument in the constructor (`super(ControlClass, oConfig)`) and has a completely different lifecycle than content widgets.

### WRONG — Extending LayoutWidget for a content widget

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/LayoutWidget",  // WRONG base class!
    "sap/dm/dme/pod2/context/PodContext"
], (LayoutWidget, PodContext) => {
    "use strict";

    class MyWidget extends LayoutWidget {  // CRASH!
        async onInit() {
            // Missing super.onInit() - double crash!
            this._buildUI();
        }
    }
    return MyWidget;
});
```

### CORRECT — Extend Widget for content widgets

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",        // Correct base class
    "sap/dm/dme/pod2/context/PodContext"
], (Widget, PodContext) => {
    "use strict";

    class MyWidget extends Widget {          // Content widget
        async onInit() {
            await super.onInit();            // MUST call super.onInit()
            this._buildUI();
        }
    }
    return MyWidget;
});
```

### Base Class Decision Matrix

| Use Case | Base Class | Import Path |
|---|---|---|
| **Custom content widget** (forms, tables, displays) | `Widget` | `sap/dm/dme/pod2/widget/Widget` |
| **Custom component widget** (wraps a UI5 Component) | `ComponentWidget` | `sap/dm/dme/pod2/widget/ComponentWidget` |
| **Custom integration widget** (iFrame/external) | `IntegrationWidget` | `sap/dm/dme/pod2/widget/IntegrationWidget` |
| **Framework-only: layout container** (VBox, HBox) | `LayoutWidget` | Never use in custom extensions |
| **Framework-only: metadata-driven table** | `ControlWidget` | Never use in custom extensions |

**Rule:** If your widget renders its own UI via `_createView()`, it MUST extend `Widget`. Period.

### The `await super.onInit()` Contract

The `Widget.onInit()` base method performs critical framework initialization:
- Registers the widget instance with the POD runtime
- Sets up the view container and ID generation
- Prepares the `getPodRuntime()` / `getView()` / `getI18nText()` infrastructure

**Without `await super.onInit()`:**
- `this.getView()` returns `undefined` — `setBusy()` crashes
- `this.getPodRuntime()` may not be ready
- `this.getI18nText()` may fail silently
- PodContext convenience methods may not work in the widget context

### Additional Anti-Patterns

```javascript
// Missing await - timing issues
async onInit() {
    super.onInit();  // Missing await! Framework init may not be complete
    this._buildUI();
}

// Calling super.onInit() AFTER your own logic
async onInit() {
    this._buildUI();       // getView() is undefined here!
    await super.onInit();  // Too late
}
```

### Why This Happens

1. **AI hallucination**: LLMs sometimes suggest `LayoutWidget` because it sounds like "a widget with layout" — but it means the opposite (a widget that IS a layout container for other widgets).
2. **Autocomplete confusion**: IDEs may suggest `LayoutWidget` or `ControlWidget` from the import list.
3. **Copy from framework internals**: Developers see SAP's built-in WorkListTableWidget extending ControlWidget and think custom widgets should too. Built-in widgets use different (internal) base classes.

### Detection

```bash
# Find wrong base class imports
grep -rnE "LayoutWidget|ControlWidget" widget/
grep -rnE "extends (LayoutWidget|ControlWidget)" widget/

# Find missing super.onInit()
grep -A5 "async onInit" widget/ | grep -v "super.onInit"
```

### Prevention

- Always extend `Widget` from `sap/dm/dme/pod2/widget/Widget` for custom content widgets
- Always `await super.onInit()` as the FIRST line in `onInit()`
- Reference: ALL examples (`Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView`) extend `Widget`
- Never extend `LayoutWidget` or `ControlWidget` in custom extensions
- Never omit `await` before `super.onInit()`
- Never put logic before `await super.onInit()` that depends on `getView()` or `getPodRuntime()`

### Related

- [Mistake #35: Missing i18nCustomModel Registration in onInit()](#mistake-35-missing-i18ncustommodel-registration-in-oninit---) — depends on super.onInit() completing first
- [Widget Patterns (widget-patterns-core.md)](widget-patterns-core.md) — canonical Widget structure
- All reference examples: `Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView`

---

## Mistake #50: `ComponentWidget` for HTML5 migrations — don't (six cascading pitfalls) ❌ → ✅ (use plain `Widget`)

### Symptom

Attempting to build a POD 2.0 dashboard on top of `sap.dm.dme.pod2.widget.ComponentWidget` triggers a six-step chain of runtime errors, each masked by the next:

1. `404 on widget/Component.js` — the loader searches under the extension namespace root, not under `widget/`.
2. `does not extend sap.dm.dme.pod2.base.Component` — extending plain `sap.ui.core.UIComponent` is rejected.
3. `404 on Component-preload.js` served as `application/json` — strict-MIME blocks the JSON error envelope.
4. `IAsyncContentCreation must be implemented` — required whenever `createContent()` is async.
5. Component renders empty — `manifest.rootView` loads async after the `ComponentContainer` render cycle.
6. `sap.m.routing.Router` conflicts with the POD host's hash router.

Cost: 6 iterations before the widget shows anything.

### Why it's wrong (for HTML5 dashboards)

`ComponentWidget` is designed for wrapping an **existing standalone SAPUI5 Component** (its own `Component.js`, `manifest.json`, routing, MVC structure). For a green-field HTML5-migration extension, this shape is massive overkill and its bootstrap chain is unforgiving.

The recommended shape is **plain `Widget`** with MVC + views + fragments + `JSONModel` built inline in `_createView()`. No Component, no manifest, no routing. Works on the first try.

### ✅ Correct — use plain `Widget`

```js
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/ui/model/json/JSONModel",
    "sap/m/VBox"
], (Widget, JSONModel, VBox) => {
    class DashboardWidget extends Widget {
        onInit() {
            super.onInit();
            this.#oModel = new JSONModel({ /* … */ });
        }
        _createView() {
            const oConfig = this.getConfig();               // M65 — _createView() takes no arguments
            return new VBox(oConfig.id, {
                items: [ /* header, KPI row, tabs, charts — all direct UI5 controls */ ]
            }).setModel(this.#oModel, "dashboard");
        }
    }
    return DashboardWidget;
});
```

For multi-view drill-down: return a `sap.m.NavContainer` root with two pages (see M58 for why NOT `sap.m.App`).

### If you must use `ComponentWidget` (rare — wrapping an existing standalone UI5 Component)

All six pitfalls must be handled explicitly:

1. **`getComponentName()` must match the ZIP path.** If `Component.js` lives at `widget/Component.js` and your namespace is `customer.custom.extensions.myWidget`, return `"customer.custom.extensions.myWidget.widget"` — with the trailing `.widget`.
2. **Component must extend `sap.dm.dme.pod2.base.Component`**, not `sap.ui.core.UIComponent`.
3. **Ship a `Component-preload.js` placeholder** (or explicitly disable preload via `manifest.sap.ui5.componentPreload: false`) so strict-MIME 404 recovery doesn't crash the load.
4. **Declare `IAsyncContentCreation`** in `metadata.interfaces` when `createContent()` returns a Promise.
5. **Use `createContent()` returning the root control synchronously**, not `manifest.rootView`. The former runs inside the render cycle; the latter does not.
6. **Do NOT instantiate `sap.m.routing.Router`** inside an embedded POD component — the host owns the hash router. Use `NavContainer` for in-widget navigation instead.

### Related

- M58 — `sap.m.App` at widget root (same root cause: standalone-app assumptions).
- M59 — self-owned shell bar / header (redundant when POD provides one).
- `widget-patterns-advanced.md` §"ComponentWidget Pattern" — should be re-read WITH the caveats above.

### Detection pattern (validation)

- `grep -rn 'extends ComponentWidget\|"sap/dm/dme/pod2/widget/ComponentWidget"' widget/` — flag as ⚠️ Warning; require an explicit README note "this widget wraps an existing UI5 Component named X" to remain a plain warning; otherwise recommend refactor to plain `Widget`.

---

## Mistake #65: `_createView()` receives NO arguments — get widget config via `this.getConfig()` ❌ → ✅ (RUNTIME undefined-access)

### Symptom

At the first render pass of a widget declared as `_createView(oConfig) { … }`:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'id')
    at line: new NavContainer(oConfig.id, {...})
```

The widget fails to build its root control; the POD renderer catches the throw and shows an empty tile. Any code path that reads `oConfig.<x>` inside `_createView` hits the same undefined.

### Why it's wrong

The POD 2.0 framework calls `_createView()` with **no arguments**. The parameter list of `_createView` is a subclass-controlled signature — declaring `_createView(oConfig) { … }` binds `oConfig` to `undefined` at the first invocation. The correct way to read the widget's config **inside `_createView`** is `this.getConfig()` (defined on `sap.dm.dme.pod2.widget.Widget`).

The Ground-Truth reference `Customer.Coating/widget/CoatingWidget.js` gets this right — it opens with `_createView() { const oConfig = this.getConfig(); … }`. Older versions of `dashboard-patterns.md` showed the wrong signature in Pattern 1; that has been corrected as of 2026-07-07 (M65 batch).

### ❌ Wrong

```js
class DashboardWidget extends Widget {
    _createView(oConfig) {                            // ✗ oConfig is undefined at runtime
        return new VBox(oConfig.id, {                 // ✗ TypeError: Cannot read properties of undefined (reading 'id')
            items: [ /* … */ ]
        });
    }
}
```

### ✅ Correct

```js
class DashboardWidget extends Widget {
    _createView() {                                   // ✓ no arguments
        const oConfig = this.getConfig();             // ✓ read config from the widget instance
        return new VBox(oConfig.id, {                 // ✓ M6 — oConfig.id or this.getId() as positional first arg
            items: [ /* … */ ]
        });
    }
}
```

### Detection pattern (validation)

- `grep -rnE '_createView\s*\(\s*[a-zA-Z_]' widget/` — any hit is a hard finding. `_createView()` must be argumentless.
- Verify that the corrected method body contains `this.getConfig()` (else `oConfig.id` will be undefined too).

Auto-fixable: **yes** (mechanical two-step):
1. Rewrite `_createView(oConfig)` → `_createView()`.
2. Insert `const oConfig = this.getConfig();` as the first statement in the method body.

### Related

- `sap.dm.dme.pod2.widget.Widget.md` §`_createView` — the abstract method has no parameters. Its docstring was clarified as of 2026-07-07 to explicitly name `this.getConfig()` as the config source.
- M6 — the returned root control must receive `oConfig.id` or `this.getId()` as its first positional constructor argument (both are equivalent at runtime).
- M66 — related lifecycle trap; `_createView()` runs BEFORE `onInit()`, so binding-referenced instances must exist before `_createView` builds the view.
- `Customer.Coating/widget/CoatingWidget.js` — Ground-Truth example of the correct pattern.

---

## Mistake #66: `_createView()` runs BEFORE `onInit()` — initialise binding-referenced instances early ❌ → ✅ (RUNTIME formatter-throws)

### Symptom

At the first render pass of a widget with `formatter:` closures in its bindings:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'format')
    at binding formatter: v => this.#oPctFmt.format(this._num(v))
```

Common variants:
- `Cannot read properties of undefined (reading 'format')` — `NumberFormat` / `DateFormat` instance was `undefined` when the binding first evaluated.
- `Cannot read properties of undefined (reading 'get')` — `ODataV4Client` instance was `undefined`.
- `Cannot read properties of undefined (reading 'setProperty')` — `JSONModel` instance was `undefined` when the formatter tried to write derived state.

### Why it's wrong

The POD 2.0 widget lifecycle order is:

```
constructor()  →  _createView()  →  onInit()
                        │                │
              UI5 evaluates       Now safe to seed models,
              binding formatter   PodContext.subscribe(...),
              closures IMMEDIATELY start Timer, etc.
              during control ctor.
```

UI5 evaluates `formatter:` closures **during control construction** — the moment `new NumericContent({ value: { path:"…", formatter: v => this.#oPctFmt.format(v) } })` runs, the closure fires against whatever the initial model value is. If `this.#oPctFmt` is still initialised in `onInit()` (which runs LATER), the very first formatter call reads `undefined` and throws.

The Coating reference example does **not** hit this trap because it initialises `NumberFormat` lazily inside handler code (`_getNumberFormat()`, called from `liveChange` — never from a construction-time binding). Dashboard widgets are different: they have many read-only bindings with formatter closures in the view tree, all of which fire on the initial render pass.

### ✅ Correct — `_ensureRuntime()` helper, called from `_createView()` first

```js
class DashboardWidget extends Widget {

    #oModel;
    #oPctFmt;
    #oQtyFmt;
    #oMdo;

    /**
     * Idempotent runtime bootstrap. Every field referenced by a `formatter:` closure
     * or by a `sap.ui.model.*` binding path MUST be created here.
     */
    _ensureRuntime() {
        if (!this.#oPctFmt) {
            this.#oPctFmt = NumberFormat.getFloatInstance({ minFractionDigits: 1, maxFractionDigits: 1 });
            this.#oQtyFmt = NumberFormat.getFloatInstance({ minFractionDigits: 2, maxFractionDigits: 2 });
        }
        if (!this.#oModel) {
            this.#oModel = new JSONModel({ kpis: { oee: 0 }, rows: [] });
        }
        if (!this.#oMdo) {
            this.#oMdo = new ODataV4Client("/dmci/v4/extractor/");
        }
    }

    _createView() {
        this._ensureRuntime();                          // ✓ before any control ctor with a formatter binding
        const oConfig = this.getConfig();               // M65
        const oRoot = new VBox(oConfig.id, {
            items: [
                new NumericContent({
                    value: {
                        path:      "/kpis/oee",
                        formatter: v => this.#oPctFmt.format(v)   // ✓ this.#oPctFmt now defined
                    }
                })
            ]
        });
        oRoot.setModel(this.#oModel);
        return oRoot;
    }

    onInit() {
        super.onInit();
        this._ensureRuntime();                          // ✓ idempotent — no-op after _createView; defensive parity
        PodContext.subscribe(ModelPath.Plant, this._onPlantChange, this);
    }
}
```

### ❌ Wrong — instances created in `onInit()` are undefined during `_createView()`'s binding evaluation

```js
onInit() {
    super.onInit();
    this.#oPctFmt = NumberFormat.getFloatInstance({minFractionDigits:1, maxFractionDigits:1});   // ✗ too late
    this.#oModel  = new JSONModel({...});                                                        // ✗ too late
}

_createView() {
    return new NumericContent({
        value: { path: "/kpis/oee", formatter: v => this.#oPctFmt.format(v) }                    // ✗ this.#oPctFmt is undefined
    });
}
```

### Idempotency contract

`_ensureRuntime()` must be **idempotent** — a `_createView()` that has already run must be a no-op on the second call from `onInit()`. Use `if (!this.#oField) { … }` guards on every branch. This gives two benefits:

1. `_createView()` can be re-invoked by the POD framework in some layout scenarios (config changes, redraws) without leaking instances.
2. If a future refactor accidentally initialises a field in `onInit()` too, the guard still holds and no double-init occurs.

### Detection pattern (validation)

Combined grep — a widget where a `#o…` field is assigned in `onInit()` AND read from a binding formatter is a hit:

```bash
# Fields assigned in onInit() to a formatter-producing factory:
awk '/onInit\s*\(/,/^\s{4}}/ { print }' widget/*.js \
  | grep -nE 'this\.#o[A-Z]\w*\s*=\s*(NumberFormat|DateFormat|ODataV4Client|new JSONModel)'

# Same field referenced from a binding formatter:
grep -nE 'formatter:\s*[^,)]*this\.#o[A-Z]' widget/*.js
```

A file that produces hits in **both** greps is a candidate defect. Confirm by running the widget and watching the console — a `Cannot read properties of undefined (reading 'format'|'get'|'getProperty')` at first render confirms M66.

Auto-fixable: **semi-mechanical**. The safe rewrite is:
1. Extract the field-initialisations from `onInit()` into a new `_ensureRuntime()` method with `if (!this.#oX) { … }` guards.
2. Insert `this._ensureRuntime();` as the first statement of both `_createView()` and `onInit()`.
3. Leave any non-idempotent side-effects (subscribe / Timer.start / setModel-on-view) in `onInit()` — those genuinely belong after view construction.

The validator flags M66 as **⚠️ Warning** rather than **❌ Error** because a widget with zero formatter closures in its view tree is unaffected. Dashboards, KPI tiles, and any view built from `NumericContent`/`ObjectStatus`/`Text` with computed values are ALL affected.

### Related

- `dashboard-patterns.md` §Pattern 1 — canonical lifecycle diagram and `_ensureRuntime` helper.
- `html5-migration-guide.md` §5, §6 — the "Once, in onInit:" comment on `NumberFormat`/`DateFormat` was corrected as of 2026-07-07 to "Once, in `_createView()` before building the view".
- M65 — `_createView()` takes no arguments (same batch).
- `Customer.Coating` — does not exhibit M66 because it initialises `NumberFormat` lazily inside handlers, never inside a construction-time binding. Dashboards can't take that shortcut.

---

## Mistake #75: Control lookup, event wiring, and timers started from `_createView()` instead of `onInit()` ❌ → ✅

### Symptom

`_createView()` does more than build and return the view. It also schedules initialization work —
classically `window.setTimeout(() => this._install(), 0)` — where `_install()` then searches the
running page for other controls (`ElementRegistry.forEach`, a `_find("SomeId")` helper), calls
`attachEvent`/`attachPress` on them, and starts `setInterval` timers. The `setTimeout(…, 0)` is a tell:
the code needs the rest of the app to exist, so it defers itself one tick past view construction.

### Why it's wrong

`_createView()` is a **pure view factory**. The framework calls it to obtain the root control; it runs
*before* `onInit()` and is the wrong place for side effects. The lifecycle contract is:

- **`_createView()`** — construct and return the view. No timers, no cross-widget lookups, no subscriptions.
- **`onInit()`** — `await super.onInit()`, then register models, `PodContext.subscribe`, start timers,
  wire handlers. This is where the widget is fully live.
- **`onExit()`** — tear down exactly what `onInit()` set up.

Side effects smuggled into `_createView()` (via `setTimeout`) run outside that contract: `super.onInit()`
may not have run, there is no symmetric teardown point, and the `setTimeout(…, 0)` is really a guess that
"by the next tick the page will be ready" — which is the polling anti-pattern M76 in disguise. Worse, the
lookup usually targets **another widget's generated control IDs**, which is itself fragile across releases.

### ❌ Wrong

```js
_createView() {
    const oRoot = new VBox(this.getConfig().id, { /* ... */ });
    window.setTimeout(() => this._install(), 0);   // ✗ side-effect deferred out of the lifecycle
    return oRoot;
}
_install() {
    this._table = this._find("SomeStandardListId");  // ✗ cross-widget lookup
    this._table.attachEvent("updateFinished", this._onUpdate, this);
    this._timer = window.setInterval(() => this._poll(), 300);  // ✗ timer started from _createView path
}
```

### ✅ Correct

```js
_createView() {
    return new VBox(this.getConfig().id, { /* build the view only */ });
}
async onInit() {
    await super.onInit();                                  // ✓ contract first
    this.getPodRuntime().getView().setModel(MyWidget.getI18nModel(), "i18nMyWidget");
    PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);  // ✓ react, don't poll
}
onExit() {
    PodContext.unsubscribeAll(this);
    super.onExit();
}
```

If the widget genuinely must observe another widget, model the dependency through `PodContext`
(shared state + `subscribe`), not by scraping the other widget's controls after a `setTimeout`.

### Rule of thumb

- `_createView()` returns a view and nothing else. Any `setTimeout`, `attachEvent`, `ElementRegistry`,
  or `setInterval` reached from it is M75.
- Initialization with side effects → `onInit()` after `await super.onInit()`. Teardown → `onExit()`.
- A `setTimeout(…, 0)` "to wait until things are ready" is a code smell for both M75 and M76.

### Detection pattern (validation)

- `grep -nE 'setTimeout\s*\(' widget/*.js plugin/*.js` — any `setTimeout` whose body is invoked from, or
  scheduled inside, `_createView()` (trace the called method). A `setTimeout(fn, 0)` at the end of
  `_createView()` is a hard finding.
- `grep -nE 'ElementRegistry|\battachEvent\s*\(|\.attachPress\s*\(|setInterval\s*\(' widget/*.js plugin/*.js`
  then confirm whether the enclosing method is reached from `_createView()` rather than `onInit()`.
- Hard finding (Error) — it is a lifecycle contract break, not a style choice.

### Related

- M65 — `_createView()` takes no arguments. M66 — `_createView()` runs before `onInit()`.
- M39 — `await super.onInit()` contract.
- M74 — cross-widget model scraping; M76 — the `setTimeout`/poll timing anti-pattern.
- `basics.md` §Widget Lifecycle; `dashboard-patterns.md` §Pattern 1 (lifecycle box).

---

## Mistake #76: Fixed timeouts and polling loops to coordinate async work instead of awaiting a signal ❌ → ✅

### Symptom

The widget coordinates asynchronous steps by **waiting a while and hoping**: a `sleep(ms)` helper
(`new Promise(r => setTimeout(r, ms))`), busy-wait loops (`while (!ready && Date.now() - start < MAX) { await sleep(POLL_MS); }`),
`setInterval` pollers that re-check page state every few hundred ms, and a wall of tuning constants
(`WAIT_CODE_MS`, `NETWORK_IDLE_MS`, `CODES_LOAD_MS`, `NATIVE_FALLBACK_MS`, …). Correctness depends on
the timeouts being "long enough" on the operator's hardware and network.

### Why it's wrong

Every real completion in POD has an explicit signal you can await instead of guessing a duration:

- An API/OData call **returns a promise** — `await` it (M73 gives you a client whose promise resolves on the real response).
- A context value arrives — `PodContext.getWhenAvailable(path)` resolves exactly when it is set; `PodContext.subscribe` fires on every change.
- A control finishes loading/rendering — await its one-shot event (`updateFinished`, `dataReceived`, …) via a promise that resolves in the handler, not a timer.

Fixed timeouts are simultaneously **too short** (flaky failures on a slow network — the step hadn't
finished) and **too long** (dead time added to every operation on a fast one). Polling loops burn the UI
thread and still race. The pile of `*_MS` constants is the symptom: each one is a duration that should
have been an awaited event. This also tends to co-occur with M75 (a `setTimeout(…,0)` to "wait for the
page") and M78 (polling `observer.inflight()` instead of awaiting the request's own promise).

### ❌ Wrong

```js
const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));

async _waitNetworkIdle() {                         // ✗ guess that quiet ms == done
    const start = Date.now();
    while (Date.now() - start < NETWORK_IDLE_MAX_MS) {
        if (observer.inflight() > 0) { /* ... */ }
        else if (Date.now() - quietSince >= NETWORK_IDLE_MS) { return; }
        await sleep(POLL_MS);
    }
}
await this._pressAdd();
await this._waitNetworkIdle();                      // ✗ hope the log finished
```

### ✅ Correct

```js
// ✓ Await the operation's own completion signal
const oResult = await ApiClient.nonConformance.logNc({ /* ... */ });   // promise resolves on the real response
// ✓ Await a context value instead of polling for it
const oSelection = await PodContext.getWhenAvailable(ModelPath.SelectedWorkListItems);
// ✓ Await a one-shot control event instead of a timer
const bLoaded = await new Promise((resolve) => {
    const fn = () => { oTable.detachEvent("updateFinished", fn, this); resolve(true); };
    oTable.attachEvent("updateFinished", fn, this);
});
```

### Rule of thumb

- Don't sleep to synchronize — `await` the promise / `getWhenAvailable` / the one-shot event that marks completion.
- A growing list of `*_MS` / `*_TIMEOUT` tuning constants is a design smell: each is an awaited signal in disguise.
- A single short `setTimeout` to defer to the next tick is occasionally legitimate; `sleep()` chained through a business flow is not.

### Detection pattern (validation)

- `grep -nE 'const\s+sleep\s*=|=>\s*new Promise\([^)]*setTimeout|new Promise\([^)]*setTimeout' widget/*.js plugin/*.js` — a `sleep`/delay-promise helper used for coordination.
- `grep -nE 'while\s*\([^)]*Date\.now\(\)' widget/*.js plugin/*.js` — busy-wait-until-timeout loops.
- `grep -nE 'setInterval\s*\(' widget/*.js plugin/*.js` used to re-check page/state (vs. a legitimate live-monitoring pull with a stored handle cleared in `onExit`).
- `grep -nE '_(MS|TIMEOUT|DELAY)\b|WAIT_[A-Z_]*_MS|IDLE_MS' widget/*.js plugin/*.js` — the tell-tale constant wall.
- Hard finding (Error) when timeouts/polling coordinate a flow that has an awaitable signal.

### Related

- M73 — use a client whose promise resolves on the real response (then you can `await` it).
- M74 / M75 — `PodContext.subscribe`/`getWhenAvailable` and the `_createView` `setTimeout` smell.
- M78 — polling `inflight()` of a patched XHR is the same anti-pattern against intercepted traffic.
- `get_api_doc({ name: "PodContext" })` §`getWhenAvailable` / §`subscribe`.

---

## Mistake #79: Discovering another widget's controls (global registry, generated IDs, identity-by-appearance, private internals) ❌ → ✅

### Symptom

The widget locates controls it does not own. It scans the global control registry
(`ElementRegistry.forEach(...)`), looks them up by another widget's **generated ID**
(`_find("NonconformanceDataEntry1-addButton")`), identifies them by **rendered text or label**
(`cell.getText() === "Log NC"`, a `Label` whose text is `"attachments"`, `getLabelFor()`), and reaches
into **private framework internals** (`control.bIsDestroyed`, `row.mBindingContexts`,
`sap.ui.getCore().applyChanges()`, `control.getDomRef()`). It has effectively reverse-engineered a handle
to a sibling widget's internal tree.

### Why it's wrong

A POD2 widget owns **its own** control subtree (the one `_createView()` returns) and nothing else. Every
anchor used above is non-contractual and release-fragile:

- **Generated IDs** (`...Page1-addButton`) are an implementation detail of the standard widget. They
  change between releases and are not an API — a rename silently breaks the lookup, with no compile error.
- **Identity by rendered text/label** (`=== "Log NC"`, `=== "attachments"`) couples you to UI copy and
  therefore to the active **language** — the widget breaks the moment the operator runs in German (`"Log NC"` → a translated label), or when SAP rewords a button.
- **`ElementRegistry.forEach`** walks *every* control on the page — O(n) over foreign state, and whatever
  it returns is whatever happens to be rendered right now.
- **Private internals** (`bIsDestroyed`, `mBindingContexts`, `getDomRef`, forcing `applyChanges`) are not
  public API; they can change or disappear without notice.

If a widget legitimately needs to coordinate with another component, the channel is **shared state in
`PodContext`** (publish/subscribe), not a scavenged handle to its controls. Needing a foreign control at
all is the signal that the design belongs in an Action, a Production Process, or PodContext — not in a
widget that pokes the DOM/tree of its neighbours. (See also M74: the same applies to *reading* a neighbour's model.)

<!-- doc-consistency-off -->
### ❌ Wrong

```js
_install() {
    this._addButton = this._find("NonconformanceDataEntry1-addButton");   // ✗ foreign generated ID
    this._codeTable = this._find("NonconformanceCodeList1");
}
_find(sSuffix) {
    let found = null;
    ElementRegistry.forEach((c) => {                                      // ✗ scan the whole page
        if (!found && c.getId && c.getId().endsWith(sSuffix)) { found = c; }
    });
    return found;
}
_findLogButton(oRow) {
    return oRow.getCells().find((c) =>
        c.isA("sap.m.Button") && c.getText() === "Log NC") || null;       // ✗ identity by (localized!) text
}
if (!oButton.bIsDestroyed) { /* ... */ }                                  // ✗ private internals
```
<!-- doc-consistency-on -->

### ✅ Correct

```js
// ✓ Coordinate through shared state — never by grabbing a neighbour's controls.
import PodContext from "sap/dm/dme/pod2/context/PodContext";
import ModelPath from "sap/dm/dme/pod2/context/ModelPath";

PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelection, this);
const oItem = PodContext.getLastSelectedWorkListItem();
// Your widget drives only the controls it created in _createView(), addressed by this.getConfig().id + own refs.
```

If the requirement cannot be met without touching another widget, stop and re-model it (Action / Production
Process / a shared `PodContext` value) — and raise it with the user rather than scavenging control handles.

### Rule of thumb

- A widget addresses only controls **it created**. No `ElementRegistry.forEach`, no `_find("<otherWidgetId>")`.
- Never identify a control by its rendered text/label — that is language- and copy-dependent.
- Never touch `bIsDestroyed`, `mBindingContexts`, `getDomRef()`, or force `applyChanges()` on foreign controls.
- Cross-widget coordination = `PodContext` publish/subscribe, full stop.

### Detection pattern (validation)

- `grep -rnE 'ElementRegistry|Core\.byId\(|sap\.ui\.getCore\(\)\.byId' widget/ action/ context/ util/ plugin/` — global control discovery.
- A `_find(...)`/`_byId(...)` helper that scans the registry and is called with a **string that is not this widget's own `getConfig().id`** — hard finding.
- `grep -rnE 'getText\(\)\s*===|getTitle\(\)\s*===|=== *"[A-Za-z].*"' widget/*.js plugin/*.js` near an `.isA(` / `getCells()` walk — identity by rendered text.
- `grep -rnE '\.bIsDestroyed|\.mBindingContexts|\.getDomRef\(\)|getCore\(\)\.applyChanges\(' widget/ action/ context/ util/ plugin/` — private-internal access.
- Hard finding (Error). Feeds the Phase 3d architectural gate.

### Related

- M80 — mutating the foreign controls you discovered; M81 — firing synthetic events at them.
- M74 — reading a neighbour's **model** (the data analogue of this control analogue).
- M75 — the `_createView()`/`setTimeout` wiring that usually sets these foreign refs up.
- `basics.md` §0 Prime Directive & §Widget boundaries; `get_api_doc({ name: "PodContext" })`.

---

## Mistake #80: Mutating another widget's controls or state (`setVisible`/`setEnabled`/`setSelected`/`setValue`, force-enable, data-tagging) ❌ → ✅

### Symptom

Having discovered a foreign control (M79), the widget **changes** it: hides a standard button
(`oLogButton.setVisible(false)` — "removing" a button by its description), toggles selections on the
standard tables (`setMode`, `setSelected`, `removeSelections`, `setBusy`), **re-enables a button the
standard deliberately disabled** (`FORCE_ENABLE_ADD` → `oAddButton.setEnabled(true)`), writes into a
foreign input (`oQuantityInput.setValue(...)`), or stamps its own custom data onto foreign controls
(`oControl.data("multiLogNc...", ...)`).

### Why it's wrong

The owning widget is the single writer of its controls' state. When an outsider mutates them:

- **State desyncs from the owner's model.** `setSelected(true)` / `setValue(...)` on another widget's
  control changes the control but not that widget's backing model or its validation — the two now disagree,
  and the owner may overwrite or mis-submit on its next render.
- **Force-enabling is bypassing a guard.** `setEnabled(true)` on a button the standard disabled defeats the
  validation that disabled it — you are pushing the standard flow into a state it declared invalid. Even if
  "the handler re-validates", you have made the UI lie to the operator and coupled to internal guard logic.
- **Hiding/showing foreign controls** (`setVisible`) fights the owner, which will restore visibility on its
  own lifecycle events — producing flicker and race conditions (hence the polling that usually accompanies it, M76).
- **`control.data(...)` on foreign controls** mutates objects you don't own and leaks your namespace into
  another widget's control tree.

The only state a widget may write is its **own** controls + `PodContext` (via the documented setters).
To influence a standard operation, call the **public API / Action** that performs it — do not hand-drive
the standard widget's controls.

<!-- doc-consistency-off -->
### ❌ Wrong

```js
// ✗ "Remove" the standard row button by hiding it
const oLogButton = this._findLogButton(oRow);
if (oLogButton) { oLogButton.setVisible(false); }

// ✗ Re-enable a button the standard validation disabled
if (!this._addButton.getEnabled() && FORCE_ENABLE_ADD) { this._addButton.setEnabled(true); }

// ✗ Drive the standard tables' selection + write into the standard input
oTable.setMode(ListMode.MultiSelect);
oRow.setSelected(true);
oQuantityInput.setValue(String(nQty));
oControl.data("multiLogNcRole", "codes", true);        // ✗ tag a foreign control
```
<!-- doc-consistency-on -->

### ✅ Correct

```js
// ✓ Perform the operation through its public API / Action — the standard widget updates itself.
const oResult = await ApiClient.nonConformance.logNc({ sfc: PodContext.getLastSelectedWorkListItem().sfc, /* ... */ });
// ✓ Share intent via PodContext; let each widget own its own controls.
PodContext.setSelectedWorkListItems(aItems);
// Your widget mutates ONLY the controls it created in _createView().
```

### Rule of thumb

- Write only your **own** controls and `PodContext` (documented setters). Never `set*`/`removeSelections`/`setBusy` a control another widget created.
- Want a standard button's effect? Call the API/Action behind it — don't `firePress`/force-enable the button.
- Never `setEnabled(true)` to defeat a disabled-by-validation control; never `control.data(...)` a foreign control.

### Detection pattern (validation)

- `grep -rnE '\.(setVisible|setEnabled|setSelected|setValue|setText|setBusy|setMode|removeSelections|setIncludeItemInSelection|setRememberSelections)\(' widget/ action/ context/ util/ plugin/` — for each hit, confirm the receiver is a control the widget **created** (its own field assigned in `_createView`), not one obtained via M79 discovery. Mutating a discovered/foreign control is the hard finding.
- `grep -rnE 'FORCE[_A-Z]*ENABLE|setEnabled\(\s*true\s*\)' widget/*.js plugin/*.js` near a foreign button ref — force-enabling.
- `grep -rnE '\.data\(\s*["'"'"']' widget/ action/ context/ util/ plugin/` where the receiver is a foreign control — namespace-stamping.
- Hard finding (Error). Feeds the Phase 3d architectural gate.

### Related

- M79 — how the foreign control was found; M81 — faking events into it.
- M33 — a widget drives busy state on its **own** view, never a foreign table.
- `pod2-public-api-pattern.md` — calling the operation instead of hand-driving the UI.

---

## Mistake #81: Firing synthetic events / simulating DOM interaction on another widget's controls ❌ → ✅

### Symptom

The widget fakes operator input into controls it does not own: `oTable.fireSelectionChange({...})`,
`oInput.fireLiveChange({...})` / `fireChange({...})`, `oButton.firePress()` fired from code, and — when
the fired event isn't enough — a synthesized real DOM click via `oButton.getDomRef().click()` (often with
`sap.ui.getCore().applyChanges()` first to force a render). It is driving the standard UI as if a human
were clicking it, to make the standard handlers run.

### Why it's wrong

Firing a control's event from outside **lies to that control's owner**: the owner's handler runs with an
event the framework never dispatched, carrying parameters you hand-crafted (`{ listItem, selected, … }`),
with no guarantee they match the control's real state. `getDomRef().click()` is worse — it depends on the
control being rendered right now, reaches past the UI5 layer to the raw DOM, and is inherently timing-racy
(hence the `applyChanges()` and the fallback timers, M76). Business operations triggered this way bypass
the proper entry point: the standard widget runs a code path that was meant to be reached by genuine user
interaction, so any precondition the real interaction would have established may be missing.

The correct trigger for a business operation is its **public API / Action**, not a counterfeit event on
someone else's button. The correct way to reflect a selection is the `PodContext` setter, not
`fireSelectionChange` on a foreign table.

<!-- doc-consistency-off -->
### ❌ Wrong

```js
// ✗ Fake a selection event on the standard table
oTable.fireSelectionChange({ listItem: oRow, listItems: [oRow], selected: true, selectAll: false });

// ✗ Fire the standard button's press from code, then simulate a real DOM click
oButton.firePress();
sap.ui.getCore().applyChanges();
oButton.getDomRef().click();

// ✗ Push a value into a foreign input by faking its change events
oQuantityInput.fireLiveChange({ value: s, newValue: s });
oQuantityInput.fireChange({ value: s, newValue: s });
```
<!-- doc-consistency-on -->

### ✅ Correct

```js
// ✓ Trigger the operation directly; do not impersonate the user on a foreign control.
await ApiClient.nonConformance.logNc({ /* ... */ });        // the real entry point
// ✓ Reflect selection via the documented setter — the owning widget reacts through its own binding.
PodContext.setSelectedWorkListItems(aItems);
// ✓ Fire events only on controls YOU created, and only as your own handlers' public contract allows.
```

### Rule of thumb

- Never call `fire*` on a control another widget created, and never `getDomRef().click()` / dispatch raw DOM events to drive the UI.
- Trigger business logic through the public API / Action, not by pressing the standard button for the user.
- `fire*` is legitimate only on your **own** controls, with the parameters the framework itself would send.

### Detection pattern (validation)

- `grep -rnE '\.(firePress|fireSelectionChange|fireChange|fireLiveChange|firePress|fireSelect|fireItemPress)\(' widget/ action/ context/ util/ plugin/` — for each, confirm the receiver is a control the widget created; firing on a discovered/foreign control is the hard finding.
- `grep -rnE '\.getDomRef\(\)\s*\.click\(|\b(dom|domRef|oDom|el)\.click\(|dispatchEvent\(|new (MouseEvent|KeyboardEvent|PointerEvent)\(' widget/ action/ context/ util/ plugin/` — simulated DOM interaction (chained `getDomRef().click()` **or** the split `const dom = ctrl.getDomRef(); dom.click();` form).
- Hard finding (Error). Feeds the Phase 3d architectural gate.

### Related

- M79 / M80 — discovering and mutating the foreign control this event is fired at.
- M78 — intercepting `firePress` (the mirror image: overriding vs. invoking).
- M76 — the `applyChanges()` + fallback-timer dance that props up synthetic clicks.
- `pod2-public-api-pattern.md` — the real operation entry points.

---

## Mistake #84: Mutable instance state on public `this._x` fields instead of true-private `#` fields ⚠️ → ✅

### Symptom

The widget keeps **all** of its runtime state on `this._`-prefixed properties — `this._active`,
`this._queue`, `this._driving`, `this._pendingLog`, `this._selectedCodes`, … — assigned ad hoc across many
methods, with **no** ECMAScript private (`#`) fields and no declared field set. The `_` is a naming
convention only; every one of these is a fully public, enumerable, externally-writable property.

### Why it's wrong

`this._x` is **not** encapsulation — it is a hint. Any other widget, the POD framework, or a future
subclass can read and overwrite `this._active`/`this._queue`; nothing enforces the "private" intent. True
private fields (`#active`, `#queue`) are enforced by the engine: inaccessible outside the class, not
enumerable, and collision-proof. Beyond access control, a widget that scatters dozens of undeclared
`this._x` assignments across its methods has **no single place that lists its state** — fields blink into
existence on first assignment, lifetimes are implicit, and nothing distinguishes "coordination flag" from
"cached control ref" from "business data". This is the per-instance analogue of the module-level mutable
state the HTML5 residue check flags (Cat 23 / B4): the fix for both is a declared, encapsulated field set.

> **Calibration — not every `this._x` is a finding.** A handful of `this._x` fields in an otherwise clean
> widget is ordinary UI5 style and should NOT be flagged on its own. M84 is a ⚠️ Warning that fires on the
> *pattern at scale*: a widget whose entire state model is undeclared `this._x` with **zero** `#` fields —
> typically dozens of distinct `this._x =` assignments. Report it once, at the class level, as a
> refactoring recommendation — do not emit one finding per property.

### ❌ Wrong

```js
class MyWidget extends Widget {
    _createView() {
        this._active = false;          // ✗ undeclared, public, scattered
        this._queue = [];
        this._driving = false;
        this._pendingLog = null;
        // ...dozens more across many methods; no field ever declared, no `#` anywhere
    }
}
```

### ✅ Correct

```js
class MyWidget extends Widget {
    // ✓ Declared, engine-enforced private state — one place that lists what the widget holds
    #active = false;
    #queue = [];
    #driving = false;
    #pendingLog = null;

    _createView() {
        this.#active = false;
        // ...all mutations go through the declared # fields
        return new VBox(this.getConfig().id, { /* ... */ });
    }
}
```

### Rule of thumb

- Encapsulated runtime state = `#` fields, declared at the top of the class. `this._x` is a convention, not privacy.
- Declare the field set in one place so the widget's state is legible; don't let fields appear implicitly on first assignment.
- A few `this._x` is fine; an entire state model of undeclared `this._x` with no `#` fields is the M84 pattern.

### Detection pattern (validation)

- `grep -coE 'this\._[a-zA-Z]+\s*=' widget/*.js plugin/*.js` (count of `this._x` assignments) and `grep -cE 'this\.#|#[a-zA-Z_]+\s*=' widget/*.js plugin/*.js` (count of `#` fields). A widget with **many** `this._x =` assignments (rule of thumb: 15+ distinct) and **zero/near-zero** instance `#` fields → one class-level ⚠️ Warning.
- Do NOT enumerate per-property findings; do NOT flag a widget that already uses `#` fields for its state, nor one with only a few `this._x`.
- Warning (code-quality / encapsulation) — not in the Phase 3d gate.

### Related

- `html5-migration-guide.md` Cat 23 / B4 — module-level mutable state (the static analogue; same fix).
- `basics.md` §Widget skeleton — declared private fields in the reference widgets.
- M79/M80 — some of these `this._x` fields hold scavenged foreign-control refs (a second problem on top of the encapsulation one).

---

---
