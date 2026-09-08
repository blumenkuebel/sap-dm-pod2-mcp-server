# Common Mistakes — 🎨 UI & Bindings

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #10: Using "class" Instead of "styleClass" ❌ → ✅

**Error**: `Assertion failed: ManagedObject.apply: encountered unknown setting 'class' for class 'sap.m.VBox'`

```javascript
// ❌ WRONG - "class" is not a valid UI5 property!
return new VBox(oConfig.id, {
    width: "90%",
    class: "sapUiSmallMargin",  // 💥 ERROR!
    items: [/* controls */]
});

// ✅ CORRECT - Use addStyleClass() method instead
return new VBox(oConfig.id, {
    width: "90%",
    items: [/* controls */]
}).addStyleClass("sapUiSmallMargin");

// ✅ ALSO CORRECT - Multiple classes
return new VBox(oConfig.id, {
    width: "90%",
    items: [/* controls */]
}).addStyleClass("sapUiSmallMargin").addStyleClass("sapUiTinyMarginTop");
```

**Why this happens**: Unlike HTML where `class` is an attribute, UI5 controls don't have a `class` property. Use the `addStyleClass()` method to add CSS classes.

> **M61 umbrella extends this**: `addStyleClass()` is mechanically correct, but the class string must come from the M61 whitelist (`sapUi*`, `sapM*`, `sapTnt*`, `sapF*`, `sapUxAP*`, `sapUshell*`). A plugin-owned class name like `"myCustomClass"` is an M61 error — see M61 for the whitelist, replacements (utility classes for spacing, semantic controls for typography), and the `standard-only: exception — <reason>` marker syntax.

---

---

## Mistake #12: Wrong PlacementType Import ❌ → ✅

**Error**: `Module "sap/ui/core/library" failed to load`

```javascript
// ❌ WRONG - PlacementType is NOT in sap.ui.core!
import coreLibrary from "sap/ui/core/library";
const { PlacementType } = coreLibrary;

// Usage - causes errors
new Popover({
    placement: PlacementType.Auto  // 💥 PlacementType is undefined!
});

// ✅ CORRECT - Import PlacementType directly from sap.m
import PlacementType from "sap/m/PlacementType";

// Usage - works correctly
new Popover({
    placement: PlacementType.Auto      // ✅ PlacementType.Auto
    // Other values: PlacementType.Bottom, PlacementType.Top, etc.
});
```

**Why this happens**: PlacementType is part of the sap.m library, not sap.ui.core. Many SAPUI5 enums live in the library that defines the controls using them.

**Critical Rule**:
- ✅ Import PlacementType from `"sap/m/PlacementType"`
- ❌ DON'T import from `"sap/ui/core/library"`
- Use directly as enum: `PlacementType.Auto`, `PlacementType.Bottom`, `PlacementType.Top`, etc.

**Other Common Enum Imports:**
```javascript
// Correct imports for commonly used enums
import ButtonType from "sap/m/ButtonType";         // Button types
import ListMode from "sap/m/ListMode";             // List selection modes
import MessageType from "sap/m/MessageType";       // Message types
import ValueState from "sap/ui/core/ValueState";   // Value states (this one IS in core)
```

**Related**: This is a specific case of [Mistake #36 (Deprecated SAPUI5 Pseudo-Module Enum Imports)](common-mistakes-imports.md#mistake-36-deprecated-sapui5-pseudo-module-enum-imports) — see #36 for the umbrella rule about picking direct enum modules over library imports.

---

---

## Mistake #13: Wrong ModelPath Constants ❌ → ✅

**Error**: `Cannot read property 'resource' of undefined` or no subscription triggered

```javascript
// ❌ WRONG - These ModelPath constants DON'T EXIST!
PodContext.subscribe(
    ModelPath.SelectedWorkListItem,  // 💥 Doesn't exist!
    (oItem, sPath) => {
        console.log(oItem.sfc);  // oItem is undefined
    },
    this
);

PodContext.subscribe(
    ModelPath.SelectedSfc,  // 💥 Doesn't exist!
    (sSfc, sPath) => {
        console.log(sSfc);  // Never fires
    },
    this
);

// ✅ CORRECT - Use exact constant names (PLURAL for arrays!)
PodContext.subscribe(
    ModelPath.SelectedWorkListItems,  // ✅ Note: Items (plural)!
    (aItems, sPath) => {
        // aItems is an ARRAY
        const resources = Array.isArray(aItems) ? aItems : [];
        resources.forEach(oItem => {
            console.log(oItem.sfc);
        });
    },
    this
);

// Get all work list items (also returns array)
PodContext.subscribe(
    ModelPath.WorkListItems,  // ✅ Items (plural)
    (aItems, sPath) => {
        console.log(`Total items: ${aItems.length}`);
    },
    this
);
```

**Why this happens**: 
1. Work list related paths return **arrays** (plural names), not single items
2. There is no `SelectedWorkListItem` (singular) constant
3. ModelPath constant names must match EXACTLY what's defined in the framework

**Critical Rules**:
- ✅ `ModelPath.SelectedWorkListItems` - Returns **array** of selected items
- ✅ `ModelPath.WorkListItems` - Returns **array** of all items
- ✅ `ModelPath.WorkListCount` - Returns **number**
- ✅ `ModelPath.WorkListLoading` - Returns **boolean**
- ❌ `ModelPath.SelectedWorkListItem` - Doesn't exist!
- ❌ `ModelPath.SelectedSfc` - Doesn't exist!

**Correct Usage Pattern:**
```javascript
// Subscribe to selected work list items
PodContext.subscribe(
    ModelPath.SelectedWorkListItems,
    this._onWorkListSelectionChanged,
    this
);

_onWorkListSelectionChanged(aSelectedItems, sPath) {
    // ALWAYS validate - may be undefined, null, or empty array
    const items = Array.isArray(aSelectedItems) ? aSelectedItems : [];
    
    if (items.length === 0) {
        // No selection
        return;
    }
    
    // Process selected items
    items.forEach(oItem => {
        const sSfc = oItem.sfc;
        const sResource = oItem.resource;
        // ... use data
    });
}
```

**How to Find Correct Constants:**
1. Always check [references/pod2-api-reference.md](pod2-api-reference.md#modelpath-constants) for exact constant names
2. Look for "Items" (plural) suffix for arrays
3. Check return type (array vs single object vs primitive)
4. Use TypeScript definitions or JSDoc if available

**Common ModelPath Constants (Correct Names):**
```javascript
// Work List (arrays)
ModelPath.SelectedWorkListItems   // Array of selected items
ModelPath.WorkListItems           // Array of all items
ModelPath.WorkListCount           // Number
ModelPath.WorkListLoading         // Boolean

// Resources (arrays)
ModelPath.FilterResources         // Array of selected resources
ModelPath.CurrentResource         // Single resource object

// Operations
ModelPath.CurrentOperation        // Single operation object
ModelPath.SelectedOperationActivities // Array
```

**Prevention:**
- ✅ Check API reference before using any ModelPath constant
- ✅ Use `Array.isArray()` to validate array responses
- ✅ Test subscriptions to ensure they fire
- ❌ DON'T assume singular/plural naming without verification

---

---

## Mistake #17: Formatter Instead of Expression Binding

**Problem**: Unnecessary complexity for simple conditional

```javascript
// ❌ WRONG - Overkill
_formatVisible(s) { return s === 'TEXT'; }
visible: { formatter: this._formatVisible }

// ✅ CORRECT
visible: "{= ${type} === 'TEXT' }"
```

---

---

## Mistake #20: Column/Cell Index Mismatch ⭐⭐⭐⭐

**Problem**: Dynamic columns added at different indices than cells

**Fix**: Use same index for both

```javascript
// ❌ WRONG - Indices don't match!
aColumns.push(customColumn);      // Added at end
aCells.splice(2, 0, customCell);  // Inserted at index 2 - MISMATCH!

// ✅ CORRECT - Same index
const iIdx = aColumns.length - 1;
aColumns.splice(iIdx, 0, customColumn);
aCells.splice(iIdx, 0, customCell);  // Same index!
```

**Why Critical:** Mismatched indices cause cells to appear in wrong columns, breaking table layout.

**See also:** [advanced-patterns.md#3-dynamic-column-creation](advanced-patterns.md#3-dynamic-column-creation)

---

---

## Mistake #28: Multi-Part Bindings Without Defensive Checks

**Error**: Formatters crash on null/undefined values in multi-part bindings

**Found in**: Production POD 2.0 date range and composite cells

### ❌ WRONG - No null checks

```javascript
_createPlannedDateRangeCell() {
    return new Text({
        text: {
            parts: [
                { path: "orderPlannedStartDate" },
                { path: "orderPlannedCompleteDate" }
            ],
            formatter: (oStartDate, oEndDate) => {
                // ❌ Crashes if dates are null/undefined!
                return `${DateTimeUtils.localeDate(oStartDate)} – ${DateTimeUtils.localeDate(oEndDate)}`;
            }
        }
    });
}
```

**Problems**:
- Crashes when data is incomplete
- Shows "undefined – undefined"
- Poor user experience
- Production runtime errors

### ✅ CORRECT - Always validate parameters

```javascript
_createPlannedDateRangeCell() {
    return new Text({
        text: {
            parts: [
                { path: "orderPlannedStartDate" },
                { path: "orderPlannedCompleteDate" }
            ],
            formatter: (oStartDate, oEndDate) => {
                // ✅ CRITICAL: Defensive null checking
                if (!oStartDate || !oEndDate) {
                    return "";  // Return empty string, not error
                }
                return `${DateTimeUtils.localeDate(oStartDate)} – ${DateTimeUtils.localeDate(oEndDate)}`;
            }
        }
    });
}
```

### More Examples

**Quantity with UOM**:
```javascript
// ❌ WRONG
formatter: (fQty, sUom) => {
    return `${fQty} ${sUom}`;  // ❌ Shows "undefined undefined"
}

// ✅ CORRECT
formatter: (fQty, sUom) => {
    if (fQty == null) return "";  // ✅ Handle null/undefined
    return `${fQty} ${sUom || ""}`.trim();  // ✅ Handle missing UOM
}
```

**Material with Description**:
```javascript
// ❌ WRONG
formatter: (sMaterial, sDesc) => {
    return `${sMaterial} - ${sDesc}`;  // ❌ Shows "undefined - undefined"
}

// ✅ CORRECT
formatter: (sMaterial, sDesc) => {
    if (!sMaterial) return "";  // ✅ No material, no display
    return sMaterial ? `${sMaterial} - ${sDesc || ""}` : "";  // ✅ Handle missing description
}
```

**Status with Error Message**:
```javascript
// ❌ WRONG
formatter: (sStatus, sError) => {
    if (sStatus === "ERROR") {
        return sError;  // ❌ Might be undefined!
    }
    return StatusFormatter.getStatusText(sStatus);
}

// ✅ CORRECT
formatter: (sStatus, sError) => {
    if (sStatus === "ERROR") {
        return sError || this.getI18nText("unknownError");  // ✅ Fallback
    }
    return StatusFormatter.getStatusText(sStatus);
}
```

### Defensive Formatter Checklist

```javascript
formatter: (param1, param2, param3) => {
    // 1. Check for null/undefined
    if (param1 == null) return "";
    
    // 2. Provide fallbacks for optional params
    const sValue2 = param2 || "default";
    
    // 3. Validate before complex operations
    if (!Array.isArray(param3) || param3.length === 0) {
        return "";
    }
    
    // 4. Use optional chaining for objects
    const sName = param1?.name || "";
    
    // 5. Return empty string (not null/undefined)
    return result || "";
}
```

### Rule of Thumb:
- **ALWAYS** validate ALL formatter parameters
- Return empty string `""` instead of null/undefined
- Use `||` for fallback values
- Use `?.` for optional chaining
- Test with incomplete data

### Prevention:
1. Add null checks at start of every formatter
2. Return empty string for invalid data
3. Use optional chaining for nested properties
4. Provide sensible defaults
5. Test with incomplete/missing data

---

---

## Mistake #31: Control ID Must Be First Constructor Argument

**Error**: `"getView method returned a view with a different ID than configuration"`,
silent ID mismatch, broken POD lifecycle, or `sap.ui.getCore().byId(...)` lookups returning the wrong control.

This is the **sibling pitfall** to [#6](#mistake-6-missing-view-id-in-_createview--).
Even when the developer remembers that `_createView()` needs `oConfig.id`, the ID is often
attached the wrong way: via `setId()`, via the settings object, or only after the control
has already been built. All three are broken.

### ❌ WRONG #1 — ID set AFTER construction via setter

```javascript
_createView() {
    const oConfig = this.getConfig();
    const oText = new Text({ text: "Hello" });
    oText.setId(oConfig.id);   // 💥 too late – already registered under generated ID
    return oText;
}
```

### ❌ WRONG #2 — ID inside the settings object instead of as positional argument

```javascript
_createView() {
    const oConfig = this.getConfig();
    return new Text({
        id: oConfig.id,        // 💥 NOT equivalent to the positional sId argument
        text: "Hello"
    });
}
```

### ❌ WRONG #3 — Building first, assigning later via reference

```javascript
_createView() {
    const oConfig = this.getConfig();
    const oView = new VBox({
        items: [new Text({ text: "Hello" })]
    });
    oView.setId(oConfig.id);   // 💥 same problem – generated ID already issued
    return oView;
}
```

### ✅ CORRECT — `sId` is the FIRST positional constructor argument

```javascript
_createView() {
    const oConfig = this.getConfig();
    if (!oConfig || !oConfig.id) {
        return new Text({ text: "Configuration error" });
    }
    return new Text(oConfig.id, {     // ← positional sId, NOT a property
        text: "Hello"
    });
}
```

For containers it's the same rule:

```javascript
return new VBox(oConfig.id, {         // ← positional sId
    items: [new Text({ text: "Hello" })]
});
```

### Why This Matters

UI5's `ManagedObject` constructor signature is `new Control(sId, mSettings)`.
The first **positional string argument** is treated specially:

1. It is registered immediately in the global element registry (`sap.ui.getCore().byId()`).
2. POD 2.0 calls `getView()` *right after* `_createView()` returns and matches the
   view's ID against the widget configuration ID.
3. `setId()` after construction renames the registry entry — by the time the rename
   happens, POD may already have asserted on the old (generated) ID.
4. `{ id: "..." }` inside `mSettings` is **not** the same code path as the positional
   argument. UI5 does accept it as a fallback, but the timing differs and POD's
   matcher can fail intermittently.

### The Rule

- ✅ `new Control(oConfig.id, { ... })` — always positional, always first
- ❌ `new Control({ id: oConfig.id, ... })` — never as a settings property
- ❌ `oControl.setId(oConfig.id)` — never via setter, never after construction
- ❌ Storing the control in a variable, then calling `setId()` on the variable

### Detection / Quick Audit

If you see any of these patterns in `_createView()` (or any method called from it),
fix immediately:

```bash
# Anti-pattern 1: setId() called anywhere in widget code
grep -nE '\.setId\(' widget/

# Anti-pattern 2: id as a settings property
grep -nE '^\s*id\s*:\s*oConfig\.id' widget/

# Anti-pattern 3: build-then-setId in two statements
grep -nB2 '\.setId(oConfig\.id)' widget/
```

Any hit is a bug — convert it to the positional form.

### Prevention

- ✅ When generating widgets, always emit the constructor in the form
  `new <Control>(oConfig.id, { ... })` directly, in a single statement.
- ✅ Never split the ID into a separate `setId()` call.
- ✅ Never put `id:` inside `mSettings`.
- ✅ Validate `oConfig.id` exists before using it; fall back to a no-ID control
  with an error message rather than passing `undefined` as the first argument.

### Related

- [Mistake #6: Missing View ID in `_createView()`](#mistake-6-missing-view-id-in-_createview--) — the case when no ID is passed at all
- [Mistake #21: `sap.m.Panel` vs `CustomPanel`](#mistake-21-using-sapmpanel-instead-of-custompanel----critical) — also shows the `id: this.getId()` settings-property style; for `CustomPanel` constructor the positional form is preferred wherever supported

---

## Mistake #42: Custom control (`.extend(...)`) without `renderer` — 404 during plugin load ❌ → ✅ (RUNTIME 404)

**Symptom (verbatim)**:

```
Failed to load resource: the server responded with a status of 404 ()
Uncaught ModuleError: failed to load
'customer/custom/extensions/<name>/widget/kpi/<Name>Renderer.js'
from …/dme/podfoundation-ms/Extensions/Customer.<Name>/N/files/widget/kpi/<Name>Renderer.js: 404
```

**Why it's wrong**: When you call `<BaseControl>.extend("customer.custom.extensions.<name>.widget.<Name>", { metadata: { ... } })` and do NOT provide a `renderer` in the metadata block, UI5 assumes the class has its own custom renderer and issues a synchronous HTTP GET for `<Name>Renderer.js` next to the source file. In a POD 2.0 plugin that file does not exist → hard 404 → the entire widget module fails to load.

Extending a POD 2.0 layout container (`CustomVBox`, `CustomHBox`, `CustomPanel`, `CustomText`) is the common case — you almost never need a new renderer, because the composite children in `init()` already handle rendering via the parent's aggregation.

### ❌ WRONG

```js
const FilterableChip = CustomVBox.extend("customer.custom.extensions.dashboard.widget.chip.FilterableChip", {
    metadata: {
        properties: {
            label:    { type: "string",  defaultValue: "" },
            selected: { type: "boolean", defaultValue: false }
        },
        events: { toggle: {} }
    },
    init() { /* builds Icon + Text + press handler */ }
    // ❌ no `renderer` → UI5 tries to GET FilterableChipRenderer.js → 404
});
```

### ✅ CORRECT — inherit the parent's renderer

```js
const FilterableChip = CustomVBox.extend("customer.custom.extensions.dashboard.widget.chip.FilterableChip", {
    metadata: {
        properties: {
            label:    { type: "string",  defaultValue: "" },
            selected: { type: "boolean", defaultValue: false }
        },
        events: { toggle: {} }
    },

    // Inherit the parent renderer — tells UI5 NOT to lookup a separate
    // <Name>Renderer.js at load time.
    renderer: CustomVBox.getMetadata().getRenderer(),

    init() { /* builds Icon + Text + press handler */ }
});
```

> Only extend `CustomVBox` / `CustomHBox` when the composite has real reusable **behavior** (events, state machine, non-trivial rendering). A pure display grouping (Title + ObjectStatus, big-number tile, KPI card) MUST use a standard control — see **M60** for the anti-pattern.

Alternative: if you truly want no rendering (headless model helper wrapped as a control), use `renderer: {}` or `renderer: null` — both suppress the auto-lookup.

### Why inline `render` works

The `render` property inside the passed-in `renderer` object (or the object itself as the renderer's render function) is discovered synchronously at `extend()` time. UI5's fallback lookup for `<Name>Renderer.js` only fires when the metadata contains no `renderer` key at all.

### Rule of thumb

- Custom composite/layout control (children built in `init()`) → `renderer: <Parent>.getMetadata().getRenderer()`
- Custom control with custom DOM output → provide `renderer: { apiVersion: 2, render(oRm, oControl) { … } }`
- Custom control that never renders (invisible helper) → `renderer: {}` or `renderer: null`

### Detection pattern (validation)

- `grep -rn "\.extend(" widget/ context/ util/` — find every `.extend(...)` call.
- For each hit, check the passed object contains a `renderer:` key OR the file has an accompanying `<Name>Renderer.js`. If neither → ❌ Error.

### Related

- [Mistake #41: Non-existent module paths](common-mistakes-imports.md#mistake-41-non-existent-module-paths-sapmitem-sapmicon----runtime-404--plugin-fails-to-load) — same failure mode (404 during plugin load), different trap.

---

## Mistake #43: Passing a `String` where a UI5 property expects `float` / `int` ❌ → ✅ (RUNTIME type-mismatch)

**Symptom (verbatim)**:

```
Refresh failed - Error: "1" is of type string, expected float for property "x"
of Element sap.suite.ui.microchart.LineMicroChartPoint#__point0
    at m.validateProperty (ManagedObject-dbg.js:1636:11)
    at m.setProperty (ManagedObject-dbg.js:1493:17)
    …
```

**Why it's wrong**: `sap.ui.base.ManagedObject.validateProperty()` performs strict type checking. Numeric properties (`float`, `int`) reject strings — even when the string parses cleanly to a number. `LineMicroChartPoint.x` and `.y`, `BulletMicroChartData.value`, `ProgressIndicator.percentValue` and many others are `float`. Passing a string like `"1"` or `String(iValue)` throws.

This trap is especially common during HTML5 migrations: the source uses `String(x)` for CSS positioning (`style="left:${String(pct)}%"`) — an agent transliterates that to UI5 microchart coordinates without changing the cast.

### ❌ WRONG

```js
new LineMicroChartPoint({ x: String(sample.t), y: sample.v })
// runtime: "1" is of type string, expected float for property "x"
```

```js
new BulletMicroChartData({ value: "" + iActual, color: ValueColor.Good })
// runtime: type-mismatch on `value`
```

### ✅ CORRECT

```js
new LineMicroChartPoint({ x: Number(sample.t), y: Number(sample.v) })
```

```js
new BulletMicroChartData({ value: iActual, color: ValueColor.Good })
```

For values coming from backend JSON: OData v4 always delivers numeric fields as JS numbers already — the trap is passing them through `String(...)` or template-literal interpolation (`` `${val}` `` becomes a string) before handing them to the control.

### Rule of thumb

- Look up every UI5 microchart/gauge property type via `get_ui5_api({ symbol: "<sap.class.name>" })` — check the `type` field.
- If it's `float` / `int` / `boolean` — pass native JS values, never coerce to string first.
- `.toFixed(N)` returns a string — for **display** it's fine (via NumberFormat is better), but never feed it back into a numeric property.

### Detection pattern (validation)

- `grep -rnE 'new (LineMicroChartPoint|BulletMicroChartData|RadialMicroChart|ProgressIndicator)\(\{[^)]*(x|y|value|percentValue):\s*String\(' widget/ action/ context/`
- `grep -rnE 'new (LineMicroChartPoint|BulletMicroChartData)\(\{[^)]*(x|y|value):\s*"' widget/`
- Template literals: `grep -rnE '(x|y|value):\s*`\$' widget/` — flag interpolation into numeric props.

### Related

- Cat 3 (Number Formatting) in `migration-suspect-list.md` — `.toFixed` is fine for display, wrong for numeric properties.

---

## Mistake #52: XML aggregation wrapper `<items>` triggers phantom 404 on `sap/m/items.js` ❌ → diagnostic pattern

### Symptom

```
Uncaught ModuleError: failed to load 'sap/m/items.js' — script load error, 404
```

Or the equivalent for any lowercase-plural aggregation name: `sap/m/pages.js`, `sap/m/cells.js`, `sap/m/content.js`.

### Why it's misleading

`<items>` is the **default aggregation** name of many `sap.m` container controls (e.g. `IconTabBar.items`, `VBox.items`, `Select.items`). Placing children inside `<items>…</items>` is perfectly valid XML view syntax.

The 404 is **not** the real error. UI5's XML view parser hit a hard error somewhere earlier in the view (missing `IAsyncContentCreation`, unknown property, invalid namespace, model not yet available, …) and — during **recovery** — tries to resolve `items` as a **class name** (`sap.m.items`), which of course does not exist.

**The `sap/m/items.js` 404 is always a cascade of an earlier fatal error higher up in the console.** Fixing "items" changes nothing — you have to look above.

### ❌ Wrong response

Removing the `<items>` wrapper produces a different fatal:

```
Cannot add direct child without default aggregation defined for control sap.m.IconTabBar
```

…because `<items>` IS the correct wrapper. You go in circles.

### ✅ Correct diagnosis

1. **Scroll ABOVE the `sap/m/items.js:404` message in the browser console.** The first non-recovery error is the real cause.
2. Common real causes we've seen: `IAsyncContentCreation` missing on an async component; unknown property attribute; namespace typo (`xmlns:mc="sap.suite.ui.microchart"` — dots instead of slashes); wrong module path (see M41).
3. Only once the earlier error is fixed does the `sap/m/items.js` 404 disappear.

### Detection pattern (validation)

- `grep -rnE "sap/m/(items|pages|cells|content|columns|rows)\.js" widget/ action/ context/ util/` — should return zero hits in shipped source. If the error appears at runtime, the real cause is in the browser console **above** the 404.

### Related

- M41 — genuine invalid module paths.
- M50 — ComponentWidget bootstrap chain (a common source of "earlier" fatal that triggers this cascade).

---

## Mistake #53: Microchart color property — `ValueColor` vs `ValueCSSColor` vs `IconColor` are NOT interchangeable ❌ → ✅ (RUNTIME parser rejection)

### Symptom

```
"Good" is not of type sap.ui.core.CSSColor nor of type sap.ui.core.IconColor
Value 'var(--sapPositiveColor)' is not valid for type 'sap.m.ValueColor'
```

Same-looking `color` properties on visually similar controls reject each other's enum values.

### The trap table

| Class · property | Type | Accepts | Rejects |
|---|---|---|---|
| `sap.suite.ui.microchart.BulletMicroChartData.color` | `sap.m.ValueColor` | `"Good"`, `"Error"`, `"Critical"`, `"Neutral"` only | CSS colors (`"#0070F2"`), CSS vars (`var(--sapPositiveColor)`), `IconColor.*` |
| `sap.suite.ui.microchart.LineMicroChartLine.color` | `sap.m.ValueCSSColor` (union of `ValueColor` + `sap.ui.core.CSSColor`) | Docs say semantic aliases AND CSS colors. **In UI5 v1.136.15 the parser rejects `"Good"/"Error"/…` and only accepts CSS values.** | see left |
| `sap.suite.ui.microchart.RadialMicroChart.valueColor` | `sap.m.ValueColor` | same as BulletMicroChartData | CSS colors |
| `sap.ui.core.Icon.color` | `sap.ui.core.CSSColor` (with `IconColor` implicit) | `"Positive"`, `"Negative"`, `"Critical"`, `"Neutral"`, hex, CSS var | `"Good"`, `"Error"` — those are `ValueColor`, NOT `IconColor` |
| `sap.m.ObjectStatus.state` | `sap.ui.core.ValueState` | `"None"`, `"Success"`, `"Warning"`, `"Error"`, `"Information"` | `"Good"`, `"Positive"` |

### ❌ Wrong

```js
new BulletMicroChartData({ value: 42, color: "var(--sapPositiveColor)" }) // ✗ ValueColor rejects CSS
new LineMicroChartLine({ points: [...], color: "Good" })                   // ✗ v1.136 parser rejects semantic
new Icon({ src: "sap-icon://bell", color: "Good" })                        // ✗ IconColor is "Positive", not "Good"
```

### ✅ Correct

```js
new BulletMicroChartData({ value: 42, color: ValueColor.Good })            // sap.m.ValueColor enum
new LineMicroChartLine({ points: [...], color: "var(--sapPositiveColor)" })// CSS-var fallback in v1.136
new Icon({ src: "sap-icon://bell", color: IconColor.Positive })            // sap.ui.core.IconColor enum
new ObjectStatus({ text: "OK", state: ValueState.Success })                // sap.ui.core.ValueState enum
```

### Rule of thumb

- Always look up the property type via `get_ui5_api` — the `type` field tells you which enum applies.
- **Never guess** — `Good`/`Positive`/`Success` look interchangeable but belong to three different enums.
- For microchart colors that need to follow the theme, use CSS variables: `var(--sapPositiveColor)`, `var(--sapNegativeColor)`, `var(--sapCriticalColor)`, `var(--sapNeutralColor)`.

### Detection pattern (validation)

- `grep -rnE 'BulletMicroChartData\([^)]*color:\s*"var\(' widget/` — ValueColor with CSS var (wrong).
- `grep -rnE 'LineMicroChartLine\([^)]*color:\s*"(Good|Error|Critical|Neutral)"' widget/` — semantic on Line in strict-parser versions.
- `grep -rnE 'Icon\([^)]*color:\s*"(Good|Error)"' widget/` — ValueColor on IconColor property.

---

## Mistake #54: `LineMicroChartPoint` has no `color` or `emphasized` property — use `LineMicroChartEmphasizedPoint` ❌ → ✅ (RUNTIME unknown-setting)

### Symptom

```
unknown setting 'emphasized' for class sap.suite.ui.microchart.LineMicroChartPoint
"Good" is not of type sap.ui.core.CSSColor nor of type sap.ui.core.IconColor
```

### Why it's wrong

`sap.suite.ui.microchart.LineMicroChartPoint` in UI5 v1.136+ has **only two properties**: `x` and `y`. Older documentation (and stale code snippets) show `color`, `emphasized`, `show` — those live on the separate subclass `sap.suite.ui.microchart.LineMicroChartEmphasizedPoint`.

### ✅ Correct

For plain points:

```js
sap.ui.define([
    "sap/suite/ui/microchart/LineMicroChart",
    "sap/suite/ui/microchart/LineMicroChartLine",
    "sap/suite/ui/microchart/LineMicroChartPoint"
], (LineMicroChart, LineMicroChartLine, LineMicroChartPoint) => {
    new LineMicroChartLine({
        points: aData.map(d => new LineMicroChartPoint({ x: Number(d.t), y: Number(d.v) }))
    });
});
```

For per-point highlighting (out-of-spec markers, min/max emphasis):

```js
sap.ui.define([
    "sap/suite/ui/microchart/LineMicroChartEmphasizedPoint"
], (LineMicroChartEmphasizedPoint) => {
    new LineMicroChartEmphasizedPoint({
        x: 5, y: 42, color: "var(--sapNegativeColor)", emphasized: true, show: true
    });
});
```

### Rule of thumb

- Base `Point` = data only (`x`, `y`).
- `EmphasizedPoint` extends Point with `color` / `emphasized` / `show`.
- Mix both types in the same `LineMicroChartLine.points` aggregation if only some points need emphasis.

### Detection pattern (validation)

- `grep -rnE 'new LineMicroChartPoint\(\{[^)]*(color|emphasized|show):' widget/` — property on base Point class.

---

## Mistake #55: List-binding template conflict — attribute binding AND `<aggregation>` wrapper on the same aggregation ❌ → ✅ (RUNTIME assertion)

### Symptom

```
Assertion failed: list bindings support only a single template object
```

### ❌ Wrong

```xml
<mc:LineMicroChartLine points="{lm>samples}">
    <mc:points>
        <mc:LineMicroChartPoint x="{lm>x}" y="{lm>y}"/>
    </mc:points>
</mc:LineMicroChartLine>
```

Two bindings are given for the default aggregation `points`:
1. Attribute-style `points="{lm>samples}"` — implicit template from the child element.
2. Aggregation wrapper `<mc:points>` with an explicit `<LineMicroChartPoint>` template.

UI5 sees two templates → assertion.

### ✅ Correct — pick ONE of these:

**A) Attribute binding + implicit child template (concise):**

```xml
<mc:LineMicroChartLine points="{path: 'lm>samples'}">
    <mc:LineMicroChartPoint x="{lm>x}" y="{lm>y}"/>
</mc:LineMicroChartLine>
```

**B) Aggregation wrapper + explicit template (verbose but explicit):**

```xml
<mc:LineMicroChartLine>
    <mc:points>
        <mc:LineMicroChartPoint x="{lm>x}" y="{lm>y}"
            binding="{path: 'lm>samples'}"/>
    </mc:points>
</mc:LineMicroChartLine>
```

**C) Factory-based binding in the controller (dynamic):**

```js
oLine.bindAggregation("points", {
    path: "lm>samples",
    factory: (sId, oCtx) => new LineMicroChartPoint({ x: oCtx.getProperty("t"), y: oCtx.getProperty("v") })
});
```

### Detection pattern (validation)

- `grep -Pzo '(?s)<[^>]+\s(items|points|content|cells|columns|pages)="\{[^"]+\}"[^>]*>.*?<(mc|f|m|core):\1>' view/*.xml` — attribute+wrapper on the same aggregation.

---

## Mistake #56: `sap.m.FlexAlignItems` / `FlexJustifyContent` values have NO `Flex` prefix ❌ → ✅ (RUNTIME [FUTURE FATAL])

### Symptom

```
[FUTURE FATAL] Value 'FlexStart' is not valid for type 'sap.m.FlexAlignItems'
```

### Why it's wrong

CSS convention is `flex-start`, `flex-end`, `space-between`. **UI5 enum values drop the `flex-` prefix** and use PascalCase — even though the enum type is called `FlexAlignItems` / `FlexJustifyContent`.

### The value list

**`sap.m.FlexAlignItems`**: `Start`, `Center`, `End`, `Stretch`, `Baseline`, `Inherit`.
**`sap.m.FlexJustifyContent`**: `Start`, `Center`, `End`, `SpaceBetween`, `SpaceAround`, `SpaceEvenly`, `Inherit`.
**`sap.m.FlexAlignSelf`**: `Auto`, `Start`, `Center`, `End`, `Stretch`, `Baseline`.

### ❌ Wrong

```js
new HBox({ alignItems: "FlexStart" })          // ✗
new HBox({ justifyContent: "FlexSpaceBetween" }) // ✗
```

### ✅ Correct

```js
const { FlexAlignItems, FlexJustifyContent } = mLibrary;
new HBox({ alignItems: FlexAlignItems.Start, justifyContent: FlexJustifyContent.SpaceBetween });
// Or with string literals (equivalent):
new HBox({ alignItems: "Start", justifyContent: "SpaceBetween" });
```

### Detection pattern (validation)

- `grep -rnE '"(FlexStart|FlexEnd|FlexCenter|FlexBaseline|FlexSpaceBetween|FlexSpaceAround|FlexSpaceEvenly)"' widget/ view/`

---

## Mistake #58: `sap.m.App` as widget root — absolute-positioned to viewport, breaks embedded POD widget ❌ → ✅

### Symptom

Widget renders but appears invisible or covers the whole POD page; content overflow behaves oddly.

### Why it's wrong

`sap.m.App` (and `sap.m.SplitApp`) is a **top-level shell control** — its root element is `position: fixed` / occupies the whole viewport. When embedded inside a POD widget slot (which has bounded height/width from the POD layout container), `sap.m.App` breaks out of that slot.

The POD runtime **already renders the outer shell** (SAP Fiori shell bar, page container, side navigation). A widget must render only its own body region.

### ✅ Correct — use `sap.m.NavContainer` directly

```js
_createView() {
    const oConfig = this.getConfig();                    // M65
    const oNav = new NavContainer(oConfig.id, {
        pages: [ this._buildOverviewPage(), this._buildDetailPage() ]
    });
    return oNav;
}
```

For a single-view widget, return the root layout directly (VBox / CustomPanel / Form) — no NavContainer needed.

### Related controls to avoid at widget root

| Wrong | Why | Right |
|---|---|---|
| `sap.m.App` | viewport-absolute shell | `sap.m.NavContainer` (multi-view) OR direct layout root (single view) |
| `sap.m.SplitApp` | viewport shell for master-detail | Two widgets side-by-side in the POD layout, OR `sap.m.SplitContainer` with bounded height |
| `sap.tnt.ToolPage` | full-page tools app | Not applicable — POD provides the frame |
| `sap.f.ShellBar` | app-level shell bar | POD already renders one — see M59 |

### Detection pattern (validation)

- `grep -rn 'new App\|"sap/m/App"' widget/`
- `grep -rn 'new SplitApp\|"sap/m/SplitApp"' widget/`

---

## Mistake #59: Widget-owned shell bar / header is redundant — POD runtime already renders the outer shell ❌ → ✅ (UX + accessibility)

### Symptom

The rendered widget has a second app title bar / shell bar / plant label / notification bell sitting inside the POD's own shell — two logo rows, two clocks, duplicated navigation.

### Why it's wrong

POD 2.0 runtime is responsible for:
- SAP Fiori launchpad shell (top blue bar with logo, plant label, notification icon, user avatar).
- Page header (breadcrumb, page title).
- Left/right side content (worklist, tool panel).

A widget renders **only its own body region** inside the POD's layout container. Duplicating any of the above:
- Doubles focus stops for screen readers.
- Wastes vertical real estate.
- Makes plant switching visually confusing (the widget's plant label lags the POD one).

### ✅ Correct

Start your `_createView` with a **content-only root** (VBox / Form / CustomPanel). No `sap.f.ShellBar`, no `sap.tnt.ToolHeader`, no self-owned title with plant label.

If you need a section title INSIDE the widget body: use `sap.m.Title` (H4/H5) or `sap.m.Panel` with `headerText` — that's a section header, not an app shell.

### Anti-pattern examples to avoid

```js
new ShellBar({ title: "Line Monitor", showNotifications: true, ... })       // ✗ POD has one
new ToolHeader({ content: [ /* logo */, /* clock */, /* avatar */ ] })      // ✗ POD has one
new Bar({ contentLeft: [ new Image("logo") ], contentRight: [ /* avatar */ ] }) // ✗ POD has one
```

### Related

- M58 (`sap.m.App` at root — same root cause: assuming standalone-app shape).
- Cat 26 (Emoji-as-icon) — often accompanies self-owned shell bars in HTML5 sources.

---

## Mistake #60: Custom control class for pure display composition — use `GenericTile` / `NumericContent` / `NumericHeader` instead ❌ → ✅

> **Specialisation of [`basics.md`](../basics.md) §0 — Prime Directive: Standard Controls Before Custom.** Rung 4 (custom control) requires team alignment + the `// standard-only: exception — <reason>` marker; a plain `.extend(CustomVBox, {...})` for a template hits before rung 4 without ever climbing 1-3. This mistake catches the ladder-skip.

### Symptom

A new `widget/control/<Name>Control.js` gets emitted for what is really just a template (title + big value + subtitle + colored state). The class body is only `set*` forwarders to inner `Title` / `ObjectStatus` / `Text` — no events, no state machine, no non-trivial rendering.

### Why it's wrong

The migrator's default bias is composition-heavy. But a KPI-tile-shaped composite has a Fiori-tokenized standard: `sap.m.GenericTile` + `TileContent` + `NumericContent`. It renders 80 % of what the composite does — with correct sizing, typography, hover, keyboard focus, and theme colors baked in.

A custom control is justified **only** when ALL three hold:
1. It encapsulates **reusable behavior** — an event, a state machine, non-trivial rendering — not just a template.
2. The same composite appears 3+ times with the same interactive contract.
3. No row in `dashboard-patterns.md` §"Chart→control decision table" fits without lossy compromise.

Otherwise: use a fragment (`XMLView` snippet) or inline the standard control.

### ❌ Wrong

```js
// widget/control/KpiTileControl.js — 90 LOC of nothing
sap.ui.define([
    "sap/dm/dme/pod2/control/CustomVBox",
    "sap/m/Title", "sap/m/ObjectStatus"
], (CustomVBox, Title, ObjectStatus) => "use strict";
    return CustomVBox.extend("customer.custom.extensions.lm.widget.control.KpiTileControl", {
        metadata: { properties: { title: "string", value: "string", state: "sap.ui.core.ValueState" } },
        init() {
            this._oTitle  = new Title();
            this._oStatus = new ObjectStatus();
            this.addItem(this._oTitle).addItem(this._oStatus);
        },
        setTitle(s) { this.setProperty("title", s, true); this._oTitle.setText(s || ""); return this; },
        setValue(s) { this.setProperty("value", s, true); this._oStatus.setText(s || ""); return this; },
        setState(s) { this.setProperty("state", s, true); this._oStatus.setState(s || "None"); return this; }
    });
);
```

### ✅ Correct — inline `GenericTile` + `NumericContent`

```xml
<GenericTile header="{i18n>dashboard.kpi.oee}" frameType="OneByOne" press=".onOeeTilePress">
    <TileContent unit="%">
        <NumericContent value="{dashboard>/kpis/oee}"
                        indicator="{dashboard>/kpis/oeeTrend}"
                        valueColor="{= ${dashboard>/kpis/oee} >= ${config>/oeeGoodThreshold}
                                     ? 'Good'
                                     : ${dashboard>/kpis/oee} >= ${config>/oeeWarningThreshold}
                                       ? 'Critical' : 'Error' }" />
    </TileContent>
</GenericTile>
```

No new class file. Fiori tokens propagate. `indicator` handles trend arrows. `valueColor` handles semantic coloring.

### Detection pattern (validation)

- `grep -rn 'extend("sap/dm/dme/pod2/control/CustomVBox"' widget/control/` — inspect each hit.
- For each: if the class body contains only `set<Prop>` forwarders that delegate to inner `Title`/`Text`/`ObjectStatus`/`Icon`, refactor to `GenericTile`+`NumericContent` / `sap.f.Card`+`NumericHeader` (see `dashboard-patterns.md` §"Chart→control decision table").
- Fragment convenience is fine — a `<XMLFragment>` file with the composite XML is NOT a violation.

### Related

- `dashboard-patterns.md` §"Chart→control decision table", §"Prime Directive (dashboard scope)".
- `migration-suspect-list.md` Cat 29 (S1 anti-pattern).
- M42 (custom control without `renderer` — same underlying "custom control mis-emission" family).

---

## Mistake #61: No plugin-owned CSS surface — Fiori standard controls only ❌ → ✅ (STYLING BAN)

> **Specialisation of [`basics.md`](../basics.md) §0 — Prime Directive: Standard Controls Before Custom.** Custom CSS is the most common way developers try to skip the Escalation Ladder — instead of climbing to a larger standard control that already carries the desired visual, they paint the missing style onto a smaller one. Every M61 finding is really a "which standard control was NOT climbed to?" question.

### Scope — umbrella rule

Every one of the following is a hard error unless the offending line carries a `// standard-only: exception — <one-sentence reason>` marker (see §Exception marker below):

- **No physical `widget/css/*.css` file** unless the widget's `init()` (or a Component `init()`) contains a documented stylesheet loader call: `sap.ui.core.IconPool.registerStyleSheet(...)`, `jQuery.sap.includeStyleSheet(...)` (deprecated but works), or `sap.ui.require(["...css!..."], ...)`. **A CSS file with no loader is dead code** — a real HTML5→POD 2.0 migration shipped ~200 LOC of `widget/css/style.css` with 20 classes and 60 `class="lm*"` XML attributes; **none of it was ever loaded at runtime**. The plugin still looked correct because Fiori theme + `sapUi*Margin*` utility classes already covered the rendering. Delete the file AND strip every `class="lm*"` attribute in the same commit.
- **No `sap.ui.core.HTML` control** with `content` containing `<style` or `style=`. Exception: pass-through of trusted rich text from i18n (`content="{i18n>rich.text}"`) with an explicit marker.
- **No inline `style="..."` attribute** in an XML view / fragment.
- **No `addStyleClass("<non-Fiori-prefix>Foo")` / `class="<non-Fiori-prefix>Foo"`** with a plugin-owned class name. Whitelist below.
- **Fiori-token duplication** (`font-size:1.5rem`, `font-weight:700`, `color:var(--sap*Color)` in any `.css`) — still an error, now as a subset of this umbrella.

### Whitelist — allowed styleClass / class values

Only these prefixes are legitimate on `addStyleClass()` / `class=`:

| Prefix | Purpose |
|---|---|
| `sapUiTiny*` / `sapUiSmall*` / `sapUiMedium*` / `sapUiLarge*` | `Margin[Top/Bottom/Begin/End]`, `Padding[…]`, `Gap[…]` — spacing utilities, theme-aware, RTL-safe |
| `sapMH1..H6`, `sapMText*` | Typography helpers when a semantic control (e.g. `sap.m.Title`) doesn't fit |
| `sapUiForceWidthAuto`, `sapUiSizeCompact`, `sapUiSizeCozy` | Layout helpers |
| `sapUiGlobalBackgroundColor*`, `sapMPageBackground` | Background helpers |
| `sapM*`, `sapTnt*`, `sapF*`, `sapUxAP*`, `sapUshell*` | Framework-specific class strings — verify individual strings via `get_ui5_api` + `get_guidelines` |

Anything outside this whitelist → M61 error.

### ✅ Standard-control replacements

| Custom CSS use | Standard control |
|---|---|
| Big prominent number | `sap.m.ObjectNumber emphasized="true"` |
| Big tile-scale number | `sap.m.NumericContent` inside `sap.m.TileContent` |
| Big card-scale number | `sap.f.cards.NumericHeader` `number=` |
| Good/error text color | `sap.m.ObjectStatus state="Success"/"Error"` |
| Small label above a value | `sap.m.Label` (auto-styled) or `NumericHeader.subtitle` |
| Trend arrow | `NumericContent.indicator` (Up/Down/None) |
| Custom margin (`.lmSmallSpacing` etc.) | `sapUiTinyMarginEnd` / `sapUiSmallMarginTop` / … — theme-aware, RTL-safe |
| Custom card border / separator | `sap.m.Panel`, `sap.f.Card`, or `sap.m.ToolbarSeparator` — theme-consistent |
| Grouped grid of cards | `sap.f.GridContainer` (first choice) or `sap.ui.layout.Grid` (second) — NEVER `HBox wrap="Wrap"` with custom min-width CSS |
| Multi-line rich text | `sap.m.FormattedText` (safe-markdown subset). `sap.ui.core.HTML` only if `FormattedText` insufficient AND exception marker present |
| Icon color | `sap.ui.core.IconColor` enum only — no `Icon.color = "<hex>"` / `"var(--...)"` |
| Custom hover | Wrap the target in a real interactive control (`sap.m.Button type="Transparent"`) — no `:hover` CSS |
| Custom animation | `sap.m.BusyIndicator` / `NumericContent.animateTextChange` / built-in fade properties only |

### Detection patterns (validation — Phase 5b Residue Gate uses these)

```bash
# Physical CSS file present (any hit is suspect — check for loader next)
find widget/ -name "*.css" -not -path "*/node_modules/*" 2>/dev/null

# CSS file exists but no loader call anywhere in widget JS — dead code
{ find widget/ -name "*.css" -not -path "*/node_modules/*" 2>/dev/null | grep -q . ; } && \
  ! grep -rq 'includeStyleSheet\|createStyleSheet\|IconPool\.registerStyleSheet\|css!' widget/ 2>/dev/null && \
  echo "DEAD CSS: widget/css/ exists but no loader call — delete or add loader"

# HTML control with inline <style> or style= in content string
grep -rnE 'new HTML\s*\(\s*\{[^}]*content:\s*"[^"]*<style'   widget/ 2>/dev/null
grep -rnE 'new HTML\s*\(\s*\{[^}]*content:\s*"[^"]*style='    widget/ 2>/dev/null

# Inline style= in view/fragment XML
grep -rnE 'style="[^"]+"' widget/ view/ *.view.xml *.fragment.xml 2>/dev/null

# Non-whitelisted addStyleClass strings
grep -rnE 'addStyleClass\("[^"]+' widget/ 2>/dev/null | \
  grep -vE 'addStyleClass\("(sapUi|sapM|sapTnt|sapF|sapUxAP|sapUshell)[A-Z]'

# Non-whitelisted class= in view/fragment XML
grep -rnE 'class="[^"]+"' widget/ view/ *.view.xml *.fragment.xml 2>/dev/null | \
  grep -vE 'class="(sapUi|sapM|sapTnt|sapF|sapUxAP|sapUshell)[A-Z]'
```

### Exception marker

Legitimate exceptions (verified with `get_ui5_api` that no standard control covers the requirement) must carry an inline marker:

```js
// standard-only: exception — logo SVG from CMS, no standard control renders trusted HTML from a URL
new HTML({ content: sTrustedCmsSnippet });
```

Validator behavior:
- **Missing marker** → M61 error.
- **Present marker** → Info-level finding; validator surfaces the reason text as a "Notes" row in `VALIDATION-REPORT.md`.
- Marker must be on the SAME line as, or the line directly ABOVE, the offending code (same convention as `validate: ignore` / `validate: info-only`).

### Related

- M10 (`class:` vs `addStyleClass`) — mechanical form; M61 extends it with the whitelist and the umbrella scope.
- M60 (custom control for template) — often co-occurs (both anti-patterns come from the same composition bias).
- Cat 29 §S7 — same rule, from the HTML5-migration angle.
- `dashboard-patterns.md` §"Chart→control decision table" — the "grouped grid of cards" row (row 8) documents the `sap.f.GridContainer` alternative to `HBox wrap="Wrap"` + custom min-width CSS.
- `validate-project-instructions.md` Rule 3 — M61 is a hard finding that Rule 2's auto-downgrade does NOT touch.

---

## Mistake #62: View model stores pre-formatted strings — blocks all numeric standard controls ❌ → ✅

### Symptom

The migrator writes the JSONModel with values pre-concatenated to strings:

```js
this.#oModel = new JSONModel({
    kpis: {
        oee:            "85.4 %",     // ✗ string; NumericContent.value needs float
        plannedTotal:   "12 PC",       // ✗ string; ditto
        avgCycleTime:   "1.5 h"        // ✗ string
    }
});
```

Downstream: `<NumericContent value="{lm>/kpis/oee}"/>` fails M43 (`"85.4 %" is of type string, expected float`), so the migrator "solves" it by using a `Text` control with a class — hitting M61.

### ✅ Correct — raw numerics in the model, formatting via bindings or NumberFormat

```js
this.#oModel = new JSONModel({
    kpis: {
        oee:            85.4,     // ✓ float
        oeeUnit:        "%",      // ✓ string — feeds TileContent.unit
        plannedTotal:   12,       // ✓ int
        plannedUnit:    "PC",     // ✓ string
        avgCycleTime:   1.5,      // ✓ float
        avgCycleUnit:   "h"
    }
});
```

Then:

```xml
<NumericContent value="{lm>/kpis/oee}" scale="{lm>/kpis/oeeUnit}"/>
<TileContent unit="{lm>/kpis/plannedUnit}">
    <NumericContent value="{lm>/kpis/plannedTotal}"/>
</TileContent>
```

For a plain `Text`, format via a NumberFormat-backed formatter (never `.toFixed()` — see M34/M43):

```js
new Text({
    text: { path: "lm>/kpis/oee",
            formatter: v => this.#oPctFmt.format(v) + " %" }
})
```

### Rule

- Raw numerics ALWAYS in the model. `float` / `int` — never `string`.
- Add a separate `<field>Text` string field **only if** a plain `Text.text` binding still consumes it. If no consumer, delete.
- Unit strings are separate fields (`*Unit`), not concatenated into the value.

### Detection pattern (validation)

- `grep -rnE '\{path:\s*"[^"]+/kpis/[^"]+",\s*formatter' widget/` — flag if the source path stores strings.
- `grep -rn 'toFixed\(' widget/` — see M43 detection.
- Runtime: any `NumericContent`/`NumericHeader` `value=` that fails silently to `NaN` in POD → check the model shape.

### Related

- M43 (type mismatch on numeric properties — this is the upstream cause).
- M34 (`parseFloat` on user input — same locale-parsing family, opposite direction).
- Cat 3 (i18n number formatting).

---

## Mistake #63: `Fragment.load` popover keyed off a microchart shape — microcharts have no click-drill ❌ → ✅

### Symptom

The migrator generates `onDowntimePress` + `DowntimePopover.fragment.xml` to click through icon-marks on a fake Gantt or a sparkline. After swapping the fake Gantt for a `BulletMicroChart`, the popover handler and fragment become **dead code** — microcharts don't fire per-shape press events.

### Why it's wrong

Microcharts (`BulletMicroChart`, `LineMicroChart`, `HarveyBallMicroChart`, `RadialMicroChart`, `AreaMicroChart`) are read-only mini-visualisations. They expose a **whole-chart** `press` event, not per-shape / per-point events. Wiring a popover to individual points "works" only by accident (e.g. picking the whole chart's center).

### ✅ Correct — choose based on the interaction requirement

- **Click on a specific chart shape (bar, point, segment) → drill-down**:
  Use `sap.viz.ui5.controls.VizFrame`. It has proper selection events (`selectData`, `deselectData`) with the datum in the event payload. Not a microchart.

- **Show details for the item behind a microchart tile**:
  Attach `press` to the enclosing `sap.m.GenericTile` (whole-tile press). Fire a widget-scoped drill-down event; details render in a `sap.m.NavContainer` detail page OR a `sap.m.Table` row-press adjacent to the microchart.

- **Table + microchart in the same row**:
  The microchart lives inside a `ColumnListItem` cell; the `rowPress` handler receives the row's binding context and opens whatever details view you need. Microchart itself has no handler.

### ❌ Wrong

```js
// Widget attempts per-point drill-down on a LineMicroChart
this._oLineChart.attachPress((oEvent) => {
    Fragment.load({ name: "…/DowntimePopover", controller: this })
        .then(oPopover => oPopover.openBy(oEvent.getSource()));
    // ✗ oEvent.getSource() is the LineMicroChart, NOT the pressed point
});
```

### ✅ Correct — VizFrame for per-shape click

```js
this._oVizFrame.attachSelectData((oEvent) => {
    const oDatum = oEvent.getParameter("data")[0].data;
    // oDatum = { PLANT: "…", RESOURCE: "…", DURATION: 143 }
    Fragment.load({ name: "…/DowntimePopover", controller: this })
        .then(oPopover => {
            this._oPopoverModel.setData(oDatum);
            oPopover.openBy(this._oVizFrame);
        });
});
```

### Detection pattern (validation)

- `grep -rn 'Fragment\\.load' widget/ | xargs -I{} sh -c "grep -l LineMicroChart\\|BulletMicroChart\\|HarveyBallMicroChart\\|RadialMicroChart\\|AreaMicroChart {}"` — popover load in a file that also uses a microchart is suspect.
- After a Cat 29 refactor (composite → microchart): grep for popover fragment names referenced ONLY by the widget's dead handler — those handler + fragment pairs must be deleted.

### Related

- `chart-migration-map.md` §"Interactivity NOT supported by microcharts".
- Cat 29 §S2 (fake Gantt with per-icon click) — S2 refactor commonly leaves M63 dead code behind.
- `widget-patterns-advanced.md` §"Custom Widget Events" for cross-widget drill-down.

---

## Mistake #64: `sap.m.MessageStrip.link` aggregates `sap.m.Link`, NOT `sap.m.Button` ❌ → ✅ (RUNTIME aggregation type-check)

### Symptom

At the first render of a widget that shows an error `MessageStrip` with an inline "Retry":

```
Uncaught Error: "Element sap.m.Button#__button10" is not valid
for aggregation "link" of Element sap.m.MessageStrip#__strip1
```

Widget renders without the strip, or with the strip but without the retry action — depending on where the throw lands.

### Why it's wrong

`sap.m.MessageStrip.link` is a **0..1 aggregation of type `sap.m.Link`** (see `get_ui5_api({ symbol: "sap.m.MessageStrip" })` → `aggregations.link.type = "sap.m.Link"`). The aggregation is type-checked strictly on `set`; passing any other control class throws.

Semantically the "call to action" on a `MessageStrip` is a **link**, not a button. `MessageStrip` is an inline banner — a full `sap.m.Button` next to the message text would compete with the strip's own visual hierarchy. UI5 enforces the semantic via the aggregation type.

### ❌ Wrong

```js
import Button from "sap/m/Button";

new MessageStrip({
    type: "Error",
    text: "{/error}",
    link: new Button({ text: "Retry", press: () => this._refresh() })   // ✗ throws — aggregation is sap.m.Link
});
```

### ✅ Correct

```js
import Link from "sap/m/Link";

new MessageStrip({
    type: "Error",
    text: "{/error}",
    link: new Link({ text: "Retry", press: () => this._refresh() })     // ✓ Link, not Button
});
```

If you genuinely need a button-shaped action next to the error message, don't stuff it into `MessageStrip.link` — put a separate `sap.m.Button` in the surrounding `VBox`/`HBox`, adjacent to the strip.

### Detection pattern (validation)

- `grep -rnE 'link:\s*new Button' widget/ action/` — any hit inside a `new MessageStrip(...)` call is a hard finding.
- Broader (multi-line): `grep -rnB2 'new Button\(' widget/ | grep -B1 'link:'` — flag matches whose preceding context contains `new MessageStrip(`.

Auto-fixable: yes (mechanical: replace `"sap/m/Button"` import with `"sap/m/Link"` for the specific import binding used inside the MessageStrip constructor, and rename `new Button(` → `new Link(` at that call site).

### Related

- `dashboard-patterns.md` §Pattern 6 — canonical empty/loading/error surface. The example was corrected as of 2026-07-07 (M64 batch).
- `get_ui5_api({ symbol: "sap.m.MessageStrip" })` — authoritative aggregation table.
- M52 / M55 — other cases where UI5 aggregation strictness bites during rendering.

---

## Mistake #70: Silent information loss via standard-control bias ❌ → ✅ (SEMANTIC — no runtime error, invisible until visual review)

> **Specialisation of [`basics.md`](../basics.md) §0 — Prime Directive: Standard Controls Before Custom.** M70 catches the misread of the ladder as "pick the first-choice standard control" — instead of "climb rung 2 (escalate within the family) when rung 1's control has fewer slots than the source needs". The rule is *"the SMALLEST standard control that fits ALL source fields"* — a fit check, not a lookup.

### Symptom

The Phase 3 mapping (or the developer's first draft) picks `sap.m.GenericTile` for every KPI-tile-shaped composite in the source, citing "Standard-First / dashboard-patterns.md decision table row 'KPI tile'". After deploy, the user notices tiles have become **detail-poor** — progress bars, sub-KPIs, contextual sub-text, status pills, resource counts, period context, or A/P/Q sub-metrics from the HTML5 source are gone. `MIGRATION_VERIFICATION.md` still shows ✅ across the coverage matrix.

Zero runtime errors. Zero validator hits from the "not real Fiori" side (M60/M61/Cat 29). The migrator picked a standard control, so every negative check passes — but the delivered widget renders less information than the source, without ever telling the user which fields were dropped.

### Why it's wrong

The Prime Directive is **"the smallest standard control that fits ALL source fields"** — not **"the first-choice control from the row that matched the primary KPI"**. When the decision table lists `GenericTile` as first choice for "KPI tile (title + big number + unit + trend)", that row applies **only** when the source composite carries exactly those slots (title, big number, unit, trend). A source tile carrying **also** a progress bar, a sub-KPI, and a status pill is a different data shape — the "Info card" row (`sap.f.Card` + `NumericHeader`) — even though the primary KPI still looks like the "KPI tile" row.

Silence at the mapping step reads as **"nothing to drop"** to downstream reviewers. That's the trap: the migrator makes an implicit "primary KPI wins" trade-off without surfacing it. The user then has to catch it visually at deploy time — after the fact, with no diff to point at.

This is the UI-layer analogue of the **Source-or-Silence** meta-rule (`CLAUDE.md` §"Source attribution"): if you can't verify that all source fields land in target slots, you MUST mark the delta explicitly.

### ✅ Correct — inventory FIRST, then pick the smallest control that fits ALL fields

For each source composite, in Phase 3 (before writing any XML), write the following block into `MIGRATION_MAPPING.md`:

```markdown
## Composite: source/renderWorkCentre .wc-card

Source fields (from HTML5 template):
- wc                       → work-center identifier
- description              → resource name
- currentOrder             → active order number
- ordersCompletedRatio     → e.g. "3 / 5"
- progressBar (0-100 %)
- statusText               → e.g. "OEE-relevant"
- lastRefresh              → ISO timestamp

Candidate target: sap.m.GenericTile + NumericContent
- Slots covered: header (wc) · subheader (description) · NumericContent.value (ordersCompletedRatio primary) · NumericContent.footer (lastRefresh)
- Slots MISSING: currentOrder, progressBar, statusText

Decision:
- Escalating to "Info card" row (sap.f.Card + NumericHeader).
- Full coverage:
    title            = wc
    subtitle         = description
    number           = ratio-numerator (or ordersCompletedRatio computed)
    details          = "Order: " + currentOrder
    statusText       = statusText
    f:content        = <ProgressIndicator percentValue="{progressBar}"/>
- Cite: dashboard-patterns.md §"Slot map — when to escalate GenericTile → sap.f.Card + NumericHeader"
```

**Three legal outcomes for a field that does not fit** the first-choice control — NEVER silent drop:

1. **Escalate** to the next-larger standard control (follow the "Escalate to" column in the decision table). Preferred outcome.
2. **List the field explicitly** in `MIGRATION_MAPPING.md` under `### Intentionally dropped` with a one-sentence business justification, and STOP for user confirmation (Category-2 halt — same protocol as `sourceFormat === "html5"` Phase 2 contract).
3. **Add a `f:content` fragment** in the Card body for the field that doesn't fit a NumericHeader slot (e.g. `sap.m.ProgressIndicator` for the progress bar). This is NOT a custom control emission — see M60 for the boundary.

### ❌ Wrong — pick GenericTile, keep the primary KPI, silently drop the rest

```xml
<!-- Source: 7 fields on the work-center card. Target: only 4 rendered. -->
<GenericTile header="{lm>/wc/id}" subheader="{lm>/wc/description}" frameType="OneByOne">
    <TileContent unit="orders" footer="{lm>/wc/lastRefresh}">
        <NumericContent value="{lm>/wc/completedRatio}" scale="/{lm>/wc/totalOrders}"/>
    </TileContent>
</GenericTile>
<!--
  Dropped without a MIGRATION_MAPPING.md entry:
    - currentOrder (which order is running RIGHT NOW)
    - progressBar (visual completion)
    - statusText ("OEE-relevant" pill)
  MIGRATION_VERIFICATION.md still shows ✅ because the mapping row cited the decision-table row.
  Real defect: the tile renders less than the HTML5 source, and no one told the user.
-->
```

### Field-coverage table — mandatory Phase 5 artifact

`MIGRATION_VERIFICATION.md` MUST include a **Field-coverage table** between the "Coverage Matrix" and the "HTML5 Residue Gate" sections. One row per migrated composite:

```markdown
## Field-coverage report (M70)

| Source composite | Source fields | Target control | Rendered slots | Dropped fields | User-approved? |
|---|---|---|---|---|---|
| `renderWorkCentre .wc-card` | wc, description, currentOrder, completedRatio, progressBar, statusText, lastRefresh | `sap.f.Card` + `NumericHeader` + `content:ProgressIndicator` | title, subtitle, number, scale, details, statusText, `f:content` | — | ✅ full coverage |
| `renderKpiRow .kpi-cell` | label, value, unit, subValue1, subValue2, trend | `sap.m.GenericTile` + `NumericContent` | header, TileContent.unit, NumericContent.value, NumericContent.indicator | `subValue1`, `subValue2` | ❌ NOT APPROVED — escalate to Info card |
```

**Sign-off rule**: any row with `❌ NOT APPROVED` or a non-empty **Dropped fields** column and no user confirmation blocks Phase-5 sign-off. Two legal resolutions: escalate the target control (preferred), or add the dropped fields to `### Intentionally dropped` in `MIGRATION_MAPPING.md` with user sign-off.

### Detection pattern (validation)

M70 is **semantic**, so pure grep isn't enough. Two mechanical checks + one manual check:

1. **`MIGRATION_MAPPING.md` presence of source-field inventory per composite**:
   ```bash
   # For each composite referenced under a Cat 29 or KPI-tile heading,
   # verify the mapping block lists "Source fields:" AND "Slots covered:".
   grep -nE '^## Composite:|^Source fields:|^Slots covered:|^Slots MISSING:' MIGRATION_MAPPING.md
   ```
   If a `## Composite:` heading exists WITHOUT the three follow-up lines → M70 gate failure (mapping was silence).

2. **`MIGRATION_VERIFICATION.md` presence of the Field-coverage report**:
   ```bash
   grep -c '^## Field-coverage report' MIGRATION_VERIFICATION.md
   ```
   `0` → M70 gate failure (verification silent about slot coverage).

3. **Manual visual walk-through** (Phase 5c companion): open the HTML5 source side-by-side with the deployed widget and confirm every source field has a home in a target slot. Any invisible field is a M70 finding regardless of what the tables say.

Auto-fixable: **NO** — the resolution is either escalate to a larger standard control (structural change) or user-approved drop with business justification (out-of-band decision).

### Related

- **M60** — custom control class for pure display composition. M70's escalation ladder tops out at `f:content` fragments and mini-tables — NEVER a custom control class just to inject the missing fields.
- **M61** — no plugin CSS surface. Escalation to `NumericHeader` + `f:content` is a slot-map change, not a styling change; do NOT solve M70 by adding CSS to squeeze more fields into a `GenericTile`.
- **M62** — view-model raw-number discipline. `NumericHeader.number` and `NumericSideIndicator.number` both require floats, not pre-formatted strings — if the view model was pre-formatted, M62 gets in M70's way.
- **Cat 29** (`migration-suspect-list.md`) — "Custom composite where a standard SAPUI5 control exists". Cat 29 catches composites that should have been standard-first; M70 catches the follow-on where a standard-first choice was made but the target is too small for the source.
- **`dashboard-patterns.md`** §"Chart→control decision table" (Slots + Escalate-to columns), §"Slot map — when to escalate GenericTile → sap.f.Card + NumericHeader" — the authoritative slot inventories.
- **Meta-rule**: silence in the migrator is information loss. This is the UI-slot analogue of `CLAUDE.md` §"Source attribution" — either the mapping proves full coverage or it explicitly documents the delta.

---

---
