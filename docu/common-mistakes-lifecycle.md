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

**See also:** [form-patterns.md#poddialog-extension](form-patterns.md#poddialog-extension)

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

- [Mistake #23: Forgetting to Clear Busy State on Error](#mistake-23-forgetting-to-clear-busy-state-on-error)
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

        // Register i18n custom model for this plugin on the POD view.
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

When a plugin registers **multiple widgets** in `extension.json`, each widget registers its **own** custom i18n model on the POD view — one per widget, uniform with the M32 `<widgetName>.` key convention. No special-casing needed:

```javascript
// Plugin with 2 widgets — each widget's onInit() registers its own i18n model.
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

Both widgets can share the **same** bundle (`bundleName: "customer.custom.extension.myplugin.i18n.i18n"`) if their i18n keys use the per-widget prefix from M32 (`coating.*` / `helloWorld.*`). The convention is uniform: **always `i18n<WidgetShortName>`**, regardless of how many widgets the plugin has.

### Related

- [Mistake #32: Widget Metadata i18n Keys](#mistake-32-widget-metadata-i18n-keys--use-named-prefix-widgetnamedisplayname-etc) — the keys that the framework reads from the registered model
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
| **Framework-only: layout container** (VBox, HBox) | `LayoutWidget` | Never use in custom plugins |
| **Framework-only: metadata-driven table** | `ControlWidget` | Never use in custom plugins |

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
- Never extend `LayoutWidget` or `ControlWidget` in custom plugins
- Never omit `await` before `super.onInit()`
- Never put logic before `await super.onInit()` that depends on `getView()` or `getPodRuntime()`

### Related

- [Mistake #35: Missing i18nCustomModel Registration in onInit()](#mistake-35-missing-i18ncustommodel-registration-in-oninit) — depends on super.onInit() completing first
- [Widget Patterns (widget-patterns-core.md)](widget-patterns-core.md) — canonical Widget structure
- All reference examples: `Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView`

---

## Mistake #50: `ComponentWidget` for HTML5 migrations — don't (six cascading pitfalls) ❌ → ✅ (use plain `Widget`)

### Symptom

Attempting to build a POD 2.0 dashboard on top of `sap.dm.dme.pod2.widget.ComponentWidget` triggers a six-step chain of runtime errors, each masked by the next:

1. `404 on widget/Component.js` — the loader searches under the plugin namespace root, not under `widget/`.
2. `does not extend sap.dm.dme.pod2.base.Component` — extending plain `sap.ui.core.UIComponent` is rejected.
3. `404 on Component-preload.js` served as `application/json` — strict-MIME blocks the JSON error envelope.
4. `IAsyncContentCreation must be implemented` — required whenever `createContent()` is async.
5. Component renders empty — `manifest.rootView` loads async after the `ComponentContainer` render cycle.
6. `sap.m.routing.Router` conflicts with the POD host's hash router.

Cost: 6 iterations before the widget shows anything.

### Why it's wrong (for HTML5 dashboards)

`ComponentWidget` is designed for wrapping an **existing standalone SAPUI5 Component** (its own `Component.js`, `manifest.json`, routing, MVC structure). For a green-field HTML5-migration plugin, this shape is massive overkill and its bootstrap chain is unforgiving.

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
        return new VBox(oConfig.id, {                 // ✓ M6 — oConfig.id is the required positional first arg
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
- M6 — the returned root control must receive `oConfig.id` as its first positional constructor argument.
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

---
