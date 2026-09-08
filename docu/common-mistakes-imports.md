# Common Mistakes — 📦 Imports & Dependencies

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #6: Missing View ID in _createView() ❌ → ✅

**Error**: `"getView method returned a view with a different ID than configuration"`

```javascript
// ❌ WRONG - No ID passed to view
_createView() {
    return new VBox({
        items: [new Text({ text: "Hello" })]
    });
}

// ✅ CORRECT - Pass oConfig.id as FIRST parameter
_createView() {
    const oConfig = this.getConfig();

    if (!oConfig || !oConfig.id) {
        return new VBox({
            items: [new Text({ text: "Configuration error" })]
        });
    }

    // Pass ID as first parameter (UI5 constructor pattern)
    return new VBox(oConfig.id, {
        items: [new Text({ text: "Hello" })]
    });
}
```

**Why this happens**: POD 2.0 requires the view ID to match the widget configuration ID for proper lifecycle management.

**See also**: [Mistake #31](#mistake-31-control-id-must-be-first-constructor-argument) — the related anti-pattern when the ID *is* available but assigned the wrong way (via `setId()` or as `{ id: ... }` in the settings object).

---

---

## Mistake #7: No Defensive Type Checking ❌ → ✅

**Error**: `Cannot read property 'map' of undefined`

```javascript
// ❌ WRONG - Assumes data is always an array
_onResourceChanged(aResources, sPath) {
    const list = aResources.map(r => r.resource).join(", ");
    this._oText.setText(list);
}

// ✅ CORRECT - Always validate types!
_onResourceChanged(aResources, sPath) {
    // Step 1: Coerce to array type
    const resources = Array.isArray(aResources) ? aResources : [];

    // Step 2: Use optional chaining for properties
    const list = resources.length > 0
        ? resources.map(r => r?.resource || "Unknown").join(", ")
        : "No resources selected";

    // Step 3: Safely update UI
    if (this._oText) {
        this._oText.setText(list);
    }
}
```

**Why this happens**: PodContext can send `undefined`, `null`, `[]`, or non-array types depending on state.

---

---

## Mistake #8: Invalid extension.json Structure ❌ → ✅

**Error**: `"Failed to create custom extensions: Error encountered when processing the extension components file"`

```javascript
// ❌ WRONG - Extra metadata fields cause upload failure
{
  "name": "My Plugin",           // ❌ NOT SUPPORTED
  "description": "...",           // ❌ NOT SUPPORTED
  "version": "1.0.0",             // ❌ NOT SUPPORTED
  "provider": "Acme Corp",        // ❌ NOT SUPPORTED
  "widgets": [...]
}

// ✅ CORRECT - ONLY widgets and actions arrays!
{
  "widgets": [
    {
      "modulePath": "custom/pod2/example/plugins/mywidget",
      "type": "custom.pod2.example.plugins.mywidget"
    }
  ],
  "actions": []
}
```

**Why this happens**: SAP DM Extension Center only accepts `widgets` and `actions` arrays. All other fields cause parsing errors.

---

---

## Mistake #9: Spreading Parent Properties in getDefaultConfig() ❌ → ✅

**Error**: `"/production/process/execute" is of type string, expected sap.m.InputType for property "type"`

This error occurs when dragging and dropping the widget in POD Designer or opening the properties panel.

```javascript
// ❌ WRONG - Spreading parent properties can cause type conflicts!
static getDefaultConfig() {
    const oParentConfig = super.getDefaultConfig();
    const oParentProperties = oParentConfig?.properties || {};

    return {
        properties: {
            ...oParentProperties,  // 💥 May introduce "type" or other reserved properties!
            myProperty: "default"
        }
    };
}

// ✅ CORRECT - Direct property definition (Official SAP pattern)
static getDefaultConfig() {
    return {
        properties: {
            myProperty: "default"  // Simple, direct, no spreading
        }
    };
}
```

**Why this happens**: 
1. Parent classes may have properties like `"type"`, `"enabled"`, `"visible"` that conflict with SAPUI5 control properties
2. When property editors create controls (like `sap.m.Input`), they expect `type` to be an `InputType` enum, not a string
3. Spreading parent properties introduces these conflicts into your widget configuration

**Critical Rule**: 
- **NEVER spread parent properties** - Official SAP documentation never shows this pattern
- Define your widget's properties directly and simply
- If you need runtime default handling for missing properties, override `getPropertyValue()` instead

**Additional Pattern - Runtime Default Coalescing** (from official SAP docs):
```javascript
// Override getPropertyValue to handle missing properties at runtime
getPropertyValue(sName) {
    const vValue = super.getPropertyValue(sName);
    switch (sName) {
        case "myProperty":
            // Return default if value is absent/undefined
            return vValue || "defaultValue";
    }
    return vValue;
}
```

**Source**: SAP Help Portal - "Add Widget Properties" documentation
https://help.sap.com/docs/help/95abdf318cec40bb84bc487fdaa03691/8dbdab1343184bf19ed36cf26f6aaf08.html

---

---

## Mistake #11: Third-Party Library Loading Fails ❌ → ✅

**Error**: `ReferenceError: moment is not defined` or library not available even after script loads

When including third-party libraries (moment.js, lodash, etc.) in POD 2.0 plugins:

```javascript
// ❌ WRONG - Async loading, library not ready when used
jQuery.sap.includeScript("path/to/moment.min.js");
this.#moment = moment;  // 💥 moment is undefined!

// ❌ WRONG - UI5 module system doesn't work with non-AMD libraries
sap.ui.define([
    "myPlugin/thirdPartyLib/moment.min"  // 💥 Doesn't export properly
], (moment) => {
    // moment is undefined
});

// ❌ WRONG - Script loads but UMD detects AMD loader and calls define() instead
const script = document.createElement("script");
script.src = "path/to/moment.min.js";
document.head.appendChild(script);
// moment.js sees define.amd and uses AMD pattern, not setting window.moment!

// ✅ CORRECT - Use Function() constructor to bypass AMD detection
#loadExternalLibraries() {
    // Get base path for plugin resources
    let sBasePath = "";
    try {
        const sModuleUrl = sap.ui.require.toUrl("my/plugin/namespace/plugins/MyWidget");
        sBasePath = sModuleUrl.substring(0, sModuleUrl.lastIndexOf("/"));
    } catch (e) {
        console.error("Failed to resolve base path", e);
        return;
    }

    // Helper to load script with AMD bypassed
    const loadScriptNoAmd = (url, libName) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, false); // Synchronous
            xhr.send(null);

            if (xhr.status === 200) {
                // Function() constructor shadows 'define', 'exports', 'module'
                // This forces UMD libraries to use global export pattern
                const executor = new Function("define", "exports", "module", xhr.responseText);
                executor.call(window, undefined, undefined, undefined);
                console.log(libName + " loaded (AMD bypassed)");
                return true;
            }
        } catch (e) {
            console.error("Failed to load " + libName, e);
        }
        return false;
    };

    // Load libraries
    loadScriptNoAmd(sBasePath + "/thirdPartyLib/moment.min.js", "moment.js");
    loadScriptNoAmd(sBasePath + "/thirdPartyLib/lodash.min.js", "lodash");

    // Now safe to reference globals
    this.#moment = (typeof window.moment !== "undefined") ? window.moment : null;
    this.#_ = (typeof window._ !== "undefined") ? window._ : null;
}
```

**File Structure for Third-Party Libraries:**
```
plugins/
├── YourWidget.js
├── i18n/
└── thirdPartyLib/          # Include libraries here
    ├── moment.min.js
    └── lodash.min.js
```

**Why AMD bypass is needed**: Libraries like moment.js use UMD (Universal Module Definition) which detects AMD loaders via `define.amd`. Since SAPUI5 uses an AMD loader, the library calls `define()` instead of setting `window.moment`. The `new Function("define", ...)` approach creates a scope where `define` is shadowed with `undefined`, forcing the library to use the global export pattern.

---

---

## Mistake #36: Deprecated SAPUI5 Pseudo-Module Enum Imports

**Severity:** ⚠️ Warning (deprecation console noise, will break in future SAPUI5 versions)

**Added:** 2026-06-18

**Category:** Import Patterns

### The Problem

SAPUI5 previously exposed enum types (like `ListSeparators`, `ButtonType`, `ValueState`) as standalone AMD modules. This is now **deprecated**. Importing them directly produces console warnings and will eventually break.

### Detection

Scan all `sap.ui.define([...])` dependency arrays for imports like:
- `"sap/m/ListSeparators"`
- `"sap/m/ButtonType"`
- `"sap/m/ListMode"`
- `"sap/m/ListType"`
- `"sap/m/FlexAlignItems"`
- `"sap/ui/core/ValueState"`
- `"sap/ui/core/MessageType"`
- etc.

Rule: If the import path is `"sap/m/<Name>"` or `"sap/ui/core/<Name>"` where `<Name>` starts with uppercase AND is NOT a known Control class (Button, Input, Table, List, Dialog, etc.) → it is likely a deprecated enum import.

### Known Deprecated Pseudo-Modules (EXHAUSTIVE — see `deprecated-imports.md`)

> **IMPORTANT:** The complete, exhaustive list is in `docu/deprecated-imports.md`.
> Load it via: `get_pattern_doc({ name: "deprecated-imports" })`
> It contains exact grep commands for reliable detection.

**`sap/m/` enums (48 total):** BackgroundDesign, ButtonType, DeviationIndicator, DialogRoleType, DialogType, FlexAlignItems, FlexAlignSelf, FlexDirection, FlexJustifyContent, FlexRendertype, FlexWrap, FrameType, GenericTileMode, HeaderLevel, IBarHTMLTag, ImageMode, InputTextFormatMode, InputType, LabelDesign, LinkConversion, ListGrowingDirection, ListHeaderDesign, ListKeyboardMode, ListMode, ListSeparators, ListType, LoadState, MenuButtonMode, OverflowToolbarPriority, PageBackgroundDesign, PlacementType, PopinDisplay, PopinLayout, QuickViewGroupElementType, RatingIndicatorVisualMode, ScreenSize, SelectType, Size, SplitAppMode, StandardTileType, SwipeDirection, SwitchType, TileSizeBehavior, ToolbarDesign, ToolbarStyle, ValueColor, ValueCSSColor, WrappingType.

**`sap/ui/core/` enums (24 total):** AccessibleLandmarkRole, BarColor, BusyIndicatorSize, CSSColor, CSSSize, Dock, HorizontalAlign, IconColor, ImeMode, IndicationColor, InvisibleMessageMode, MessageType, OpenState, Orientation, Priority, ScrollBarAction, Scrolling, SortOrder, TextAlign, TextDirection, TitleLevel, ValueState, VerticalAlign, Wrapping.

### ❌ Wrong (deprecated)

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/m/List",
    "sap/m/ListSeparators",  // ❌ DEPRECATED pseudo-module
    "sap/m/ButtonType"       // ❌ DEPRECATED pseudo-module
], function(Widget, List, ListSeparators, ButtonType) {
    // ...
    new List({ showSeparators: ListSeparators.None });
    new Button({ type: ButtonType.Emphasized });
});
```

### ✅ Correct

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/m/List",
    "sap/m/library"  // ✅ Import the library module
], function(Widget, List, mLibrary) {
    const { ListSeparators, ButtonType } = mLibrary;  // ✅ Destructure enums
    // ...
    new List({ showSeparators: ListSeparators.None });
    new Button({ type: ButtonType.Emphasized });
});
```

For `sap/ui/core/` enums:

```javascript
sap.ui.define([
    "sap/ui/core/library"
], function(coreLibrary) {
    const { ValueState, MessageType } = coreLibrary;
    // ...
});
```

### Auto-fixable

Yes — mechanical replacement:
1. Remove the deprecated import from the dependency array
2. Add `"sap/m/library"` (or `"sap/ui/core/library"`) if not already present
3. Add `const { EnumName } = mLibrary;` at the top of the function body
4. All existing usages of the enum remain unchanged

### Why It Matters

- Console floods with deprecation warnings (noise for debugging)
- SAPUI5 team may remove pseudo-modules in a future major version
- Performance: loading one library module is cheaper than N individual enum modules

### Related

- [Mistake #12: Wrong PlacementType Import](common-mistakes-ui.md#mistake-12-wrong-placementtype-import) — specific case of the same pattern
- SAP UI5 Best Practices for Loading Modules documentation


---

---

## Mistake #37: Tagged-Template Misuse on `getI18nText` (Hidden Bug)

**Pattern (BUG)**: an i18n call followed by a template literal **without a comma**:

```js
// BUG — this is a tagged-template invocation, NOT a function call + concatenation:
MessageBox.error(this.getI18nText("error.maxPos") `${maxPositions}`);

// equally broken (silently swallows the value):
MessageBox.error(this.getI18nText("error.maxwidth") `${configMaxWidth}`);
```

The space between `)` and `` ` `` triggers JavaScript's tagged-template syntax. The result: `getI18nText` is invoked as the tag function and the runtime substitution is dropped.

### ✅ Correct

Use parameter substitution via the i18n bundle's placeholder syntax:

```js
// In the i18n bundle: error.maxPos=Maximum allowed positions is {0}
MessageBox.error(this.getI18nText("error.maxPos", [maxPositions]));
```

Or use ordinary string concatenation (less recommended but works):

```js
MessageBox.error(this.getI18nText("error.maxPos") + " " + maxPositions);
```

### Why it matters

The bug is invisible during development — the message still looks "almost right" because the i18n text is rendered, just without the dynamic part. Translators and reviewers will not catch it. The fix requires recognising the **space + backtick** parser quirk.

### Detection pattern (validation)

Regex: `getI18nText\([^)]*\)\s*\\``

---

---

## Mistake #38: Undeclared DOM-ID Globals Instead of `this.byId` (Hidden Bug)

**Pattern (BUG)**: code references a UI5 control by **its DOM id** as an undeclared global:

```js
new Input({
    id: "innerInput",          // ← id set as positional or named property
    ...
});

// … later, somewhere else in the widget:
innerInput.setValueState("Error");      // ❌ global ref, no `this.`, no `byId`
outerInput.setValueStateText("…");      // ❌
```

UI5 (in non-strict mode) leaks DOM `id` attributes into the global `window` scope. This "works" by accident but is **fragile**:

- breaks under strict mode / module bundlers
- breaks when the widget is instantiated more than once (id collision)
- breaks under iframes / shadow-DOM hosts
- collides with other globals (`name`, `length`, ...)

### ✅ Correct

Hold the control reference in a private class field:

```js
class MyWidget extends Widget {
    /** @type {sap.m.Input} */
    #oInnerInput;
    /** @type {sap.m.Input} */
    #oOuterInput;

    _createView() {
        this.#oInnerInput = new Input({
            value: "{view>/diameter/inner}",
            …
        });
        this.#oOuterInput = new Input({
            value: "{view>/diameter/outer}",
            …
        });
        …
    }

    onDiameterChange() {
        this.#oInnerInput.setValueState("Error");
        this.#oOuterInput.setValueState("Error");
    }
}
```

Or, when controls live in a UI5 view, use `this.byId("innerInput")`.

### Detection pattern (validation)

Regex over widget files: an identifier whose name matches a `new <Control>({ id: "<same>" })` definition is referenced **without** `this.` / `that.` / `byId(`.

---

## Mistake #41: Non-existent module paths (`sap/m/Item`, `sap/m/Icon`, …) ❌ → ✅ (RUNTIME 404 — plugin fails to load)

**Symptom (verbatim)**:

```
Error loading custom module customer/custom/extensions/<name>/widget/<Name>Widget from
extension Customer.<Name> — Error: ModuleError: Failed to resolve dependencies of
'…/widget/<Name>Widget.js' -> 'sap/m/Item.js': failed to load 'sap/m/Item.js'
from https://sapui5.hana.ondemand.com/1.136.15/resources/sap/m/Item.js: 404
```

**Why it's wrong**: Several UI5 classes have a `sap.<lib>.<Name>` fully-qualified name that does **not** match a physical module. The AMD path lives in a different library.

Agents that "guess" the module path from the class name (`sap.m.Item` → `sap/m/Item`) hit a hard 404 at plugin-load time — the whole widget never registers.

### The trap list (known cases)

| Wrong path (guessed) | Correct AMD path | Notes |
|---|---|---|
| `sap/m/Item` | `sap/ui/core/Item` | Base `Item` lives in `sap.ui.core`. `sap.m.SelectItem` etc. are subclasses. |
| `sap/m/Icon` | `sap/ui/core/Icon` | The `Icon` control lives in `sap.ui.core`. |
| `sap/m/ListItem` | `sap/ui/core/ListItem` | Same shape as `Item`. |
| `sap/m/Element` | `sap/ui/core/Element` | Base class — never in `sap/m`. |
| `sap/m/Control` | `sap/ui/core/Control` | Base class. |
| `sap/m/Fragment` | `sap/ui/core/Fragment` | Fragment lives in `sap.ui.core`. |
| `sap/m/HTML` | `sap/ui/core/HTML` | The `HTML` control lives in `sap.ui.core`. |

### ❌ WRONG

```js
sap.ui.define([
    "sap/m/Select",
    "sap/m/Item",     // ❌ 404 at runtime
    "sap/m/Icon"      // ❌ 404 at runtime
], (Select, Item, Icon) => {
    // ...
    new Select({
        items: [ new Item({ key: "TODAY", text: "Today" }) ] // fails before reaching this line
    });
});
```

### ✅ CORRECT

```js
sap.ui.define([
    "sap/m/Select",
    "sap/ui/core/Item",   // ✅ base Item is in sap.ui.core
    "sap/ui/core/Icon"    // ✅ Icon control is in sap.ui.core
], (Select, Item, Icon) => {
    new Select({
        items: [ new Item({ key: "TODAY", text: "Today" }) ]
    });
});
```

### Verification rule (mandatory)

Before shipping any import, verify the module path via `get_ui5_api({ symbol: "<sap.class.name>" })` — the `module` field in the response is the AMD path (with slashes). Do NOT derive the module path from the fully-qualified class name.

> **From a POD plugin dir** the tool errors with *"Unable to locate a UI5 project"* — use `get_ui5_api` (bundled offline, no `projectDir` needed) for the three workarounds (search POD2 docs / stub-project / `ui5.sap.com/api`).

For POD2 classes: `pod2-mcp-server.get_api_doc({ name: "<sap.dm.dme.pod2.class.name>" })`.

### Detection pattern (validation)

- `grep -rnE '"sap/m/(Item|Icon|ListItem|Element|Control|Fragment|HTML)"' widget/ action/ context/ util/` → runtime-404 candidates.

### Related

- Cat 21-28 (HTML5 migration) — agents converting HTML5 sources are especially prone to this because Chart.js "labels are text on icons" naturally maps to `sap.m.Icon`.
- M36 (deprecated enum pseudo-modules) — same class of failure mode, different trap.

---

## Mistake #57: `sap.f.Header` and other guessed-namespace controls don't exist ❌ → ✅ (RUNTIME 404)

### Symptom

```
failed to load 'sap/f/Header.js' from …/resources/sap/f/Header.js: 404
```

### Why it's wrong

Extension of M41's trap-family. A card header slot in `sap.f.Card` is `sap.f.cards.Header` — under the **`cards` sub-namespace**, not at the `sap.f` top level. Agents that see `sap.f.Card` and derive `sap.f.Header` by pattern-matching hit a 404.

### The extended trap list (append to M41)

| Wrong (guessed) | Correct AMD path | Notes |
|---|---|---|
| `sap/f/Header` | `sap/f/cards/Header` | Card header lives in the `cards/` sub-namespace. |
| `sap/f/NumericHeader` | `sap/f/cards/NumericHeader` | Same. |
| `sap/f/CardBase` | `sap/f/CardBase` | This one DOES exist at the top of `sap.f` — check API before renaming. |
| `sap/m/Card` | `sap/f/Card` | `Card` is in `sap.f`, not `sap.m` — despite `sap.m` hosting most containers. |
| `sap/m/GridContainer` | `sap/f/GridContainer` | Same reasoning. |
| `sap/tnt/Header` | `sap/tnt/ToolHeader` | The class is called `ToolHeader`, not `Header`. |

### ✅ Correct

```js
sap.ui.define([
    "sap/f/Card",
    "sap/f/cards/Header",            // ✓ under cards/
    "sap/f/cards/NumericHeader"      // ✓ under cards/
], (Card, CardHeader, NumericHeader) => { /* … */ });
```

### Workaround when in doubt

`sap.m.Panel` with `headerText` and `content` covers 95% of "card-like section" needs and has none of these namespace traps. Prefer it if you don't specifically need `sap.f.Card`'s numeric-header rendering.

### Detection pattern (validation)

- `grep -rnE '"sap/f/(Header|NumericHeader)"' widget/ action/ context/ util/` — Card-Header under wrong path.
- `grep -rnE '"sap/m/(Card|GridContainer)"' widget/ action/ context/ util/` — sap.f control under sap.m.
- `grep -rn '"sap/tnt/Header"' widget/` — should be `ToolHeader`.

### Verification rule (mandatory)

Always call `get_ui5_api({ symbol: "<sap.class.name>" })` — the `module` field is the canonical AMD path. Never derive it from the class name by string manipulation.

### Related

- M41 — base traps (`sap/m/Item`, `sap/m/Icon`, `sap/m/HTML`).
- M59 — self-owned shell/header is usually the wrong idea in a POD widget anyway.

---

---
## Mistake #71: Wrong notification-subscribe keys & non-existent `Logger.warning()` ❌ → ✅ (HANDLER NEVER FIRES / RUNTIME TypeError)

Two independent API-shape traps, both confirmed against `get_api_doc`, both silent until runtime.

### 71a — `PodNotificationWebSocket.subscribe()` uses `onMessage`, not `callback`/`listener`

The method takes a single **options object**. The message handler key is `onMessage`; there is **no** `callback` and **no** `listener` key, and there is no static `PodNotificationWebSocket.unsubscribe({...})`. Wiring a handler as `{ callback, listener }` compiles fine and the handler simply **never fires** — the hardest kind of bug to spot.

#### ❌ WRONG
<!-- doc-consistency-off -->
```javascript
PodNotificationWebSocket.subscribe({
    eventType: EventType.SFC_START,
    callback: this._onSfcStarted,   // ← ignored — never called
    listener: this                  // ← not a real key
});
```
<!-- doc-consistency-on -->

#### ✅ CORRECT
```javascript
import EventType from "sap/dm/dme/pod2/notification/EventType";
import Filter from "sap/dm/dme/pod2/notification/Filter";

// subscribe() returns a SubscriptionContext — keep it and unsubscribe in onExit()
this._oSub = PodNotificationWebSocket.subscribe({
    eventType: EventType.SFC_START,
    onMessage: (message) => this._onSfcStarted(message),
    filter: Filter.equals("plant", PodContext.getPlant()),
    description: "MyWidget"
});
// onExit(): this._oSub?.unsubscribe();
```

Also: `eventType` must be an `EventType` enum constant, never a hardcoded string, and you cannot invent a new event type — use `EventType.CUSTOM` + a payload `Filter` for app-specific events. The `EventType` enum is the single source of truth; the hand-maintained table in `pod2-public-api-pattern.md` is illustrative only (version suffixes drift, e.g. runtime `SFC_START` → `Sfc.Started.v3`). Build any dropdown from `Object.keys(EventType)`.

### 71b — `Logger` has `warn()`, not `warning()`

`sap.dm.dme.pod2.Logger` exposes `trace/debug/info/warn/error/fatal`. There is **no `warning()`** — `oLog.warning(...)` throws `TypeError: oLog.warning is not a function` the first time that branch executes.

<!-- doc-consistency-off -->
```javascript
this.#oLog.warning("…");  // ❌ TypeError at runtime
this.#oLog.warn("…");     // ✅
```
<!-- doc-consistency-on -->

(Note: `sap.m.MessageBox.warning(...)` IS correct — that is a different class. This trap is only about `Logger`.)

### Detection pattern (validation)

- `grep -rn "callback:\|listener:" <plugin>/**/*.js` near a `PodNotificationWebSocket.subscribe(` → replace with `onMessage:` and drop `listener:`.
- `grep -rn "\.warning(" <plugin>/**/*.js` → any `Logger`/`oLog` receiver must become `.warn(`; leave `MessageBox.warning(` alone.

### Related

- `pod2-public-api-pattern.md` §EventType / §Subscribe Example — full options-object shape and custom-event guidance.
- `subscribe-patterns.md` §WebSocket — `PodContext.subscribe(path, callback, context)` is a *different* API where positional `callback` IS correct; don't confuse the two.

---
