# Common Mistakes — ⚙️ Configuration & Properties

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #14: Missing onExit() Unsubscribe - Memory Leak! ❌

### The Problem

PodContext subscriptions must be cleaned up in `onExit()`. Failure to unsubscribe causes memory leaks.

### ❌ WRONG - Memory leak

```javascript
async onInit() {
    await super.onInit();
    if (PodContext.isRunMode()) {
        // Subscribing to PodContext events
        PodContext.subscribe(
            ModelPath.SelectedOperationActivities,
            this._onSelectionChange,
            this
        );
    }
}
// ❌ Missing onExit()! Subscription persists after plugin destroyed
```

**What happens:**
1. User opens plugin → subscription registered
2. User closes plugin → widget destroyed BUT subscription still active
3. Context changes → callback fires on destroyed widget → errors
4. Memory leak accumulates with each open/close cycle

### ✅ CORRECT - Always unsubscribe

```javascript
async onInit() {
    await super.onInit();
    if (PodContext.isRunMode()) {
        PodContext.subscribe(
            ModelPath.SelectedOperationActivities,
            this._onSelectionChange,
            this
        );
    }
}

onExit() {
    super.onExit();
    if (PodContext.isRunMode()) {
        // MUST unsubscribe from ALL subscriptions
        PodContext.unsubscribe(
            ModelPath.SelectedOperationActivities,
            this._onSelectionChange,
            this
        );
    }
    
    // Clean up private fields
    this.#oLog = null;
    this.#oModel = null;
}
```

### Why This Matters

**Production impact:**
- Memory leaks accumulate as users open/close plugins repeatedly
- Callbacks fire on destroyed widgets → runtime errors
- Production systems degrade over time
- Hard to debug - symptoms appear hours after deployment

**Real scenario:**
```
User workflow: Open plugin → Close → Open → Close (10x per day)
After 1 week: 50 orphaned subscriptions
Result: Browser slowdown, errors, crashes
```

### Complete Cleanup Checklist

When implementing `onExit()`, ensure you:

✅ Unsubscribe from ALL PodContext subscriptions  
✅ Call `super.onExit()` first  
✅ Nullify private fields (`#oLog`, `#oModel`, etc.)  
✅ Clear intervals/timeouts if used  
✅ Destroy any manual event listeners  
✅ Clean up file upload controls  
✅ Abort pending async operations if possible  

### Multiple Subscriptions Example

```javascript
class MyWidget extends ControlWidget {
    #oLog = Logger.getLogger("my.widget");
    #oModel = new JSONModel({});
    #iTimerId = null;

    async onInit() {
        await super.onInit();
        
        if (PodContext.isRunMode()) {
            // Multiple subscriptions
            PodContext.subscribe(
                ModelPath.SelectedOperationActivities,
                this._onOperationsChange,
                this
            );
            
            PodContext.subscribe(
                ModelPath.CurrentResource,
                this._onResourceChange,
                this
            );
            
            // Timer for polling
            this.#iTimerId = setInterval(() => {
                this._pollStatus();
            }, 5000);
        }
    }

    onExit() {
        super.onExit();
        
        if (PodContext.isRunMode()) {
            // Unsubscribe ALL subscriptions
            PodContext.unsubscribe(
                ModelPath.SelectedOperationActivities,
                this._onOperationsChange,
                this
            );
            
            PodContext.unsubscribe(
                ModelPath.CurrentResource,
                this._onResourceChange,
                this
            );
        }
        
        // Clear timer
        if (this.#iTimerId) {
            clearInterval(this.#iTimerId);
            this.#iTimerId = null;
        }
        
        // Clean up private fields
        this.#oLog = null;
        this.#oModel = null;
    }
}
```

### TableWidget Special Case

TableWidget has built-in subscription management for table data, but **custom subscriptions still need manual cleanup**:

```javascript
class MyTableWidget extends TableWidget {
    #oLog = Logger.getLogger("my.table");

    async onInit() {
        await super.onInit();
        
        if (PodContext.isRunMode()) {
            // TableWidget manages its own table subscriptions
            // But custom subscriptions need cleanup!
            PodContext.subscribe(
                ModelPath.CurrentWorkCenter,
                this._onWorkCenterChange,
                this
            );
        }
    }

    onExit() {
        super.onExit(); // ✅ Cleans up TableWidget's internal subscriptions
        
        if (PodContext.isRunMode()) {
            // ✅ Clean up YOUR custom subscriptions
            PodContext.unsubscribe(
                ModelPath.CurrentWorkCenter,
                this._onWorkCenterChange,
                this
            );
        }
        
        this.#oLog = null;
    }
}
```

### Common Patterns

**Pattern 1: Guard with isRunMode()**
```javascript
onExit() {
    super.onExit();
    
    // ✅ BEST PRACTICE: Same guard as onInit()
    if (PodContext.isRunMode()) {
        PodContext.unsubscribe(/* ... */);
    }
    
    // Always clean up fields (no guard needed)
    this.#oLog = null;
    this.#oModel = null;
}
```

**Pattern 2: Defensive unsubscribe**
```javascript
onExit() {
    super.onExit();
    
    // ✅ Unsubscribe even if not sure it was subscribed
    // (PodContext.unsubscribe() is safe to call multiple times)
    if (PodContext.isRunMode()) {
        PodContext.unsubscribe(
            ModelPath.SelectedOperationActivities,
            this._onSelectionChange,
            this
        );
    }
}
```

### How to Verify

**1. Check every subscribe has matching unsubscribe**
```bash
# Quick check in your widget file
grep -n "PodContext.subscribe" MyWidget.js
grep -n "PodContext.unsubscribe" MyWidget.js
# Should have same count!
```

**2. Ensure onExit() exists**
```javascript
// Every widget with subscribe() MUST have onExit()
async onInit() {
    PodContext.subscribe(/* ... */);
}

onExit() { // ← MUST exist!
    super.onExit();
    PodContext.unsubscribe(/* ... */);
}
```

**3. Test memory leaks**
```
1. Open browser dev tools → Memory tab
2. Take heap snapshot
3. Open plugin → Close plugin → Repeat 10x
4. Take another heap snapshot
5. Compare: Check for retained widget instances
```

### Prevention Checklist

Before submitting widget code:

- [ ] Every `PodContext.subscribe()` has matching `unsubscribe()`
- [ ] `onExit()` method exists and calls `super.onExit()`
- [ ] All private fields nullified in `onExit()`
- [ ] Timers/intervals cleared in `onExit()`
- [ ] Same `isRunMode()` guard in both `onInit()` and `onExit()`
- [ ] Tested: Open → Close → Open → Close (no errors)

### See Also

- [Widget Lifecycle](widget-patterns-core.md#controlwidget-pattern-for-single-controls) - Complete lifecycle documentation
- [PodContext API](pod2-api-reference.md#podcontext) - subscribe/unsubscribe documentation
- [TableWidget Pattern](widget-patterns.md#tablewidget) - Complete TableWidget with onExit()

---

---

## Mistake #18: Not Incrementing Page in GrowingJSONModel ⭐⭐⭐⭐⭐

**Problem**: Using GrowingJSONModel but always fetching page 0

**Fix**: Increment page counter

```javascript
// ❌ WRONG - Always fetches page 0!
async _fetchPostings() {
    const oResponse = await API.get({ page: 0, size: 20 });
    return oResponse;
}

// ✅ CORRECT - Increments page
#iPage = 0;

async _fetchPostings() {
    const iPage = this.#iPage++;  // Increment!
    const oResponse = await API.get({ page: iPage, size: 20 });
    return [oResponse.items, oResponse.totalCount];
}
```

**Why Critical:** Essential for pagination to work - without incrementing, same page loads repeatedly.

**See also:** [widget-patterns.md - GrowingJSONModel](widget-patterns.md#tablewidget-with-growingjsonmodel-pagination-pattern)

---

---

## Mistake #21: Using sap.m.Panel Instead of CustomPanel ❌ → ✅ (CRITICAL!)

**Error**: Widget not draggable in POD Designer

**Why It's Wrong**: Regular `sap.m.Panel` doesn't support POD Designer drag-and-drop. Must use `CustomPanel` for Designer compatibility.

### ❌ WRONG - Using sap.m.Panel
```javascript
import Panel from "sap/m/Panel";

_createView() {
    return new Panel({  // ❌ Not Designer-compatible!
        content: [/* controls */]
    });
}
```

### ✅ CORRECT - Using CustomPanel
```javascript
import CustomPanel from "sap/dm/dme/pod2/control/CustomPanel";
import CustomVBox from "sap/dm/dme/pod2/control/CustomVBox";

_createView() {
    return new CustomPanel({
        id: this.getId(),  // CRITICAL: Pass widget ID
        width: "100%",
        height: "100%",
        content: [
            new CustomVBox({
                paddingTop: "Small",
                items: [/* controls */]
            })
        ]
    });
}
```

**When to Use:**
- ✅ Top-level container: CustomPanel
- ✅ Layout containers: CustomVBox
- ✅ Regular controls inside: Use standard sap.m controls

---

---

## Mistake #22: Using toast() for Persistent Notifications ❌ → ✅

**Error**: Important messages disappear before user sees them

**Why It's Wrong**: `MessageHistory.toast()` is temporary. Use `showSuccess()`/`showError()` for important messages.

### ❌ WRONG - Toast for operation completion
```javascript
async _onExecute() {
    try {
        await ApiClient.execute(oRequest);
        MessageHistory.toast("Operation completed");  // ❌ Disappears!
    } catch (oError) {
        MessageHistory.toast(oError.message);  // ❌ Error disappears!
    }
}
```

### ✅ CORRECT - Persistent messages
```javascript
async _onExecute() {
    // Pre-validation with toast (temporary)
    if (!this._validateInput()) {
        MessageHistory.toast("Please fill required fields");  // ✅ Temporary guidance
        return;
    }
    
    try {
        await ApiClient.execute(oRequest);
        MessageHistory.showSuccess("Operation completed successfully");  // ✅ Persistent
    } catch (oError) {
        MessageHistory.showError(oError.message);  // ✅ Persistent
    }
}
```

### Decision Matrix

| Scenario | Method | Reason |
|----------|--------|--------|
| API success | `showSuccess()` | Persistent audit trail |
| API error | `showError()` | User needs to review/act |
| Validation failure | `showError()` | Needs user action |
| Info message | `toast()` | Temporary, low importance |
| "No items selected" | `toast()` | Temporary guidance |

---

---

## Mistake #25: Subscribing to Multiple Paths with Multiple Calls ❌ → ✅

**Error**: Code duplication and multiple callbacks for related data

**Why It's Wrong**: When multiple ModelPaths affect the same widget state, subscribe to all with one callback.

### ❌ WRONG - Multiple subscribe calls
```javascript
onInit() {
    PodContext.subscribe(
        ModelPath.SelectedWorkListItems,
        this._refresh,
        this
    );
    PodContext.subscribe(
        ModelPath.SelectedOperationActivities,
        this._refresh,
        this
    );
    PodContext.subscribe(
        ModelPath.FilterOperationActivities,
        this._refresh,
        this
    );
}
```

### ✅ CORRECT - Array subscription
```javascript
onInit() {
    // Subscribe to multiple paths with one callback
    PodContext.subscribe([
        ModelPath.SelectedWorkListItems,
        ModelPath.SelectedOperationActivities,
        ModelPath.FilterOperationActivities
    ], this._refresh, this);
}

onExit() {
    // Must unsubscribe with same array
    PodContext.unsubscribe([
        ModelPath.SelectedWorkListItems,
        ModelPath.SelectedOperationActivities,
        ModelPath.FilterOperationActivities
    ], this._refresh, this);
}
```

**Benefits:**
- ✅ Single callback handles all changes
- ✅ Cleaner code, less duplication
- ✅ Production pattern from SAP widgets

---

---

## Mistake #26: Using Wrong Property Exclusion Pattern

**Error**: Using EXCLUDE_PROPERTIES when you need IGNORE_TABLE_PROPERTIES or vice versa

**Found in**: Production POD 2.0 worklist widgets

### Understanding the Three Patterns

| Pattern | Type | Purpose | Use When |
|---------|------|---------|----------|
| EXCLUDE_PROPERTIES | static | Hide from POD Designer | Blacklist properties from property panel |
| INCLUDE_PROPERTIES | static | Show in POD Designer | Whitelist properties for property panel |
| IGNORE_TABLE_PROPERTIES | instance | Skip in table constructor | Properties used by widget but not sap.m.Table |

### ❌ WRONG - Excluding property that table needs

```javascript
class MyTableWidget extends TableWidget {
    static EXCLUDE_PROPERTIES = [
        "pageSize",  // ❌ Wrong! Widget still uses it internally
        "printButtonVisible"  // ❌ Wrong! Not a table property at all
    ];
}
```

**Problems**:
- If table constructor needs `pageSize`, excluding it breaks functionality
- If property is widget-specific (not table-specific), wrong pattern used

### ✅ CORRECT - Use right pattern for each property

```javascript
class OrderListTableWidget extends TableWidget {
    // Exclude from POD Designer property panel (user can't configure)
    static EXCLUDE_PROPERTIES = [
        ...TableWidget.EXCLUDE_PROPERTIES,
        "growing",           // ✅ Table property, hide from designer
        "growingThreshold"   // ✅ Table property, hide from designer
    ];
    
    // Don't pass to sap.m.Table constructor (widget-specific config)
    IGNORE_TABLE_PROPERTIES = [
        "pageSize",          // ✅ Widget uses it, but not for table constructor
        "printButtonVisible",  // ✅ Widget property, not table property
        "printConfigOrder",  // ✅ Custom config, not table property
        "printConfigLabel"   // ✅ Custom config, not table property
    ];
}
```

### Decision Tree

```
Is the property a standard sap.m.Table property?
├─ YES: Is it for user configuration?
│  ├─ YES: Don't exclude it
│  └─ NO: Use EXCLUDE_PROPERTIES (hide from designer)
└─ NO: Is it widget-specific configuration?
   └─ YES: Use IGNORE_TABLE_PROPERTIES (skip in constructor)
```

### Example Scenarios

**Scenario 1: Page Size**
- Property Purpose: Widget uses for pagination logic
- Not a sap.m.Table constructor property
- Solution: `IGNORE_TABLE_PROPERTIES`

**Scenario 2: Growing Table Settings**
- Property Purpose: sap.m.Table constructor properties
- Don't want user to configure (programmatic control)
- Solution: `EXCLUDE_PROPERTIES`

**Scenario 3: Print Button Config**
- Property Purpose: Widget toolbar configuration
- Has nothing to do with table
- Solution: `IGNORE_TABLE_PROPERTIES`

### ✅ CORRECT - Complete Example

```javascript
class ProductionTableWidget extends TableWidget {
    // Whitelist approach (tight control)
    static INCLUDE_PROPERTIES = [
        "alternateRowColors",
        "backgroundDesign",
        "inset",
        "visible",
        "width"
    ];
    
    // Widget-specific properties (not for table constructor)
    IGNORE_TABLE_PROPERTIES = [
        "pageSize",
        "refreshInterval",
        "showToolbar",
        "customActions"
    ];
}
```

### Prevention:
1. Understand property purpose
2. Check if property belongs to sap.m.Table API
3. Use EXCLUDE/INCLUDE for designer control
4. Use IGNORE_TABLE_PROPERTIES for widget-specific config
5. Never mix approaches without understanding

---

---

## Mistake #32: Widget Metadata i18n Keys — Use Named Prefix (`<widgetName>.displayName`, etc.)

**Error #1**: All custom plugins land in the **same** group ("CUSTOMER", "Examples", …) in
the POD Designer Widget Palette, regardless of what the request spec said in `Category`.

**Error #2**: i18n bundles use an **inconsistent key style** for the widget metadata trio:
`displayName=…` and `description=…` end up *without* prefix, but `widget.category=…` *with*
prefix — purely because old example bundles mixed both styles.

These are the same family of bug: the widget metadata trio (`displayName`, `description`,
`category`) is the **single source of truth** the POD Designer reads when displaying a
widget tile in its palette. All three must come from `POD2_PLUGIN_EXAMPLE.md` (Plugin Name,
Description, Category) and all three must use a **named prefix** (`<widgetName>.`) derived
from the widget's short name in camelCase.

### The Convention (one rule for the whole trio)

| Field         | Spec field in `POD2_PLUGIN_EXAMPLE.md` | i18n key (example: widget "Coating")           | Read in widget code via                   |
|---------------|----------------------------------------|------------------------------------------------|-------------------------------------------|
| Display name  | `Plugin Name` / `Name`                 | `coating.displayName` | `static getDisplayName() { return this.getI18nText("coating.displayName"); }` |
| Description   | `Description`                          | `coating.description` | `static getDescription() { return this.getI18nText("coating.description"); }` |
| Category      | `Category`                             | `coating.category`    | `static getCategory()    { return this.getI18nText("coating.category"); }`    |

The prefix is always the **widget's short name in camelCase** — e.g. `coating.*`,
`stepStatus.*`, `helloWorld.*`, `tableView.*`. This clearly separates widget metadata
from action metadata (`validationAction.*`, `executionAction.*`) and avoids collisions
in multi-widget plugins. The generic `widget.*` prefix is **deprecated** and must not be
used.

### What `Category` Actually Is

- A **collective grouping label** in the POD Designer Widget Palette
- Typically a customer name, a product line, a department: `Customer`, `Acme Corp`,
  `Production`, `Quality`, `Customer Extensions`, …
- Multiple plugins of the same customer **share** the category — that's the point
- Used only externally (POD Designer UI), never read by code

### ❌ WRONG #1 — Mixed key style (legacy / inconsistent)

```properties
# i18n.properties — DON'T mix prefixed and unprefixed keys for the same trio
displayName=Step Status                      # ❌ no prefix
description=Change the Step Status of an SFC.  # ❌ no prefix
widget.category=EXAMPLES                     # ✅ correct — but inconsistent with above
```

```javascript
// Widget code mirrors the broken style
static getDisplayName()  { return this.getI18nText("displayName"); }   // ❌
static getDescription()  { return this.getI18nText("description"); }   // ❌
static getCategory()     { return this.getI18nText("widget.category"); } // ✅
```

This compiles and runs, but it's a code smell that propagates through every plugin the
agent generates afterwards (the agent copies the example's mixed style verbatim).

### ❌ WRONG #2 — Copy-paste the example value, ignore the spec

```properties
# i18n.properties (wrong key, hardcoded value carried over from old examples)
category=CUSTOMER
```

```javascript
static getCategory() { return this.getI18nText("category"); }  // ❌ legacy key
```

Symptoms:
- Spec said `Category: Acme Corp` → POD Designer still shows the widget under `CUSTOMER`
- Two customers' plugins end up under the same group
- Inconsistent key naming (`category` vs `widget.category`) across plugins

### ✅ CORRECT — All three keys with named prefix, values from the spec

```properties
# i18n.properties (and all 4 locale bundles — same key set!)
coating.displayName=Coating
coating.description=Thickness Calculation in Coating Process
coating.category=Customer

# Action metadata uses its own prefix per action
validationAction.displayName=Coating Validation Action
executionAction.displayName=Coating Execution Action

# Widget UI strings keep the same named prefix
coating.title.sfcs=Selected SFCs
coating.col.sfc=SFC
coating.label.area=Area (m²)
```

```javascript
class CoatingWidget extends Widget {
    static #oI18nModel = new I18nResourceModel({
        bundleName: "customer.custom.extensions.coating.i18n.i18n"
    });

    static getI18nModel()    { return this.#oI18nModel; }
    static getDisplayName()  { return this.getI18nText("coating.displayName"); }
    static getDescription()  { return this.getI18nText("coating.description"); }
    static getCategory()     { return this.getI18nText("coating.category"); }
    static getIcon()         { return "sap-icon://process"; }
}
```

If the spec says:
- `Plugin Name: Step Status` → `stepStatus.displayName=Step Status`
- `Description: Change the Step Status of an SFC.` → `stepStatus.description=Change the Step Status of an SFC.`
- `Category: EXAMPLES` → `stepStatus.category=EXAMPLES`

### The Rule

- All three values come from `POD2_PLUGIN_EXAMPLE.md` — never hardcoded from the example
- All three i18n keys use a **named prefix** derived from the widget’s short name (camelCase) — e.g. `coating.displayName`, `coating.description`, `coating.category`
- The same key set appears in **all 4 locale bundles** (`i18n.properties`, `i18n_de.properties`,
  `i18n_en.properties`, `i18n_en_US.properties`)
- Translate `displayName` / `description` per locale; **do not translate `category`** unless
  the customer explicitly asked for it (otherwise the same plugin shows up under different
  group names per language → looks broken in mixed-locale teams)
- The widget reads each value via `getI18nText("<widgetName>.…")` from the matching static accessor
- This convention applies **uniformly** regardless of whether the plugin has 1 widget or N widgets — no special-casing needed

### Multi-Widget Plugins

When a plugin registers **multiple widgets** in `extension.json`, each widget already has
its own unique named prefix — no special-casing needed:

```properties
# Plugin with 2 widgets — each uses its own camelCase widget name as prefix
filterableWorkList.displayName=Filterable Work List
filterableWorkList.description=...
filterableWorkList.category=Customer

statusMonitor.displayName=Status Monitor
statusMonitor.description=...
statusMonitor.category=Customer
```

```javascript
// FilterableWorkListWidget
static getDisplayName() { return this.getI18nText("filterableWorkList.displayName"); }

// StatusMonitorWidget
static getDisplayName() { return this.getI18nText("statusMonitor.displayName"); }
```

The convention is uniform: **always `<widgetName>.*`**, regardless of how many widgets
the plugin has.

### Why the Trio Pattern Matters

The widget's static metadata accessors (`getDisplayName()`, `getDescription()`,
`getCategory()`, `getIcon()`) are what the POD Designer reads to render a widget tile
in its palette. They are also the only place where i18n keys appear *outside* the
runtime UI controls. Keeping them in their own logical group via the named prefix:

1. Mirrors the structure already used for runtime labels (`coating.title.*`, `coating.col.*`).
2. Cleanly separates **widget** metadata from **action** metadata in shared bundles.
3. Lets a quick audit `grep '^coating\.' i18n/*.properties` show the entire widget surface.
4. Stops the agent from "inheriting" mixed styles when copying from a reference example.
5. Naturally extends to multi-widget plugins without any rule changes.

### Detection / Quick Audit

```bash
# Find legacy / unprefixed metadata keys — they should use a named prefix
grep -rnE '^(displayName|description|category)=' i18n/

# Find old generic "widget." prefix (should be a named prefix now)
grep -rn '^widget\.' i18n/

# Compare the spec values with the bundle values
grep -E '^(Plugin Name|Name|Description|Category):' POD2_PLUGIN_EXAMPLE.md   # spec
grep -hE '^[a-z]+\.(displayName|description|category)' i18n/*.properties     # bundle

# Verify the widget code reads named-prefixed keys (anti-pattern: generic "widget.")
grep -nE 'getI18nText\("widget\.' widget/
```

If any of these checks return hits, fix them — the convention is `<widgetName>.` prefix
everywhere.

### Prevention

- ✅ Read `Plugin Name`, `Description`, `Category` from the spec **before** writing the i18n bundles
- ✅ Derive the camelCase widget name from the plugin name (e.g. `Step Status` → `stepStatus`)
- ✅ Use the `<widgetName>.` prefix consistently — `stepStatus.displayName`, `stepStatus.description`, `stepStatus.category`
- ✅ Verify all 4 locale bundles carry the same key set
- ✅ When referencing an example, look at the **structure** (`getI18nText("<widgetName>.…")`),
  not the legacy values
- ❌ Don't keep unprefixed `displayName=` / `description=` from older examples
- ❌ Don't use the generic `widget.*` prefix — it is deprecated
- ❌ Don't hardcode `<widgetName>.category=CUSTOMER` regardless of spec
- ❌ Don't use the plugin name as the category — `Coating` is not a category, `Customer` is
- ❌ Don't translate `category` unless the customer explicitly asked for it

### Related

- [Mistake #2: Binding Syntax in WidgetProperty Metadata](#mistake-2-binding-syntax-in-widgetproperty-metadata) — same family: i18n must come from the right source
- [Mistake #30: Wrong German i18n — "SFC" Instead of "PSN"](#mistake-30-wrong-german-i18n--sfc-instead-of-psn) — same family: bundle values matter


---

---
