# Common Mistakes — ⚙️ Configuration & Properties

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #14: Missing onExit() — Timer/Dialog/Listener Cleanup ❌

### The Problem

`Widget.destroy()` automatically calls `PodContext.unsubscribeAll(this)` **before** calling `onExit()` — so PodContext subscriptions are always cleaned up by the framework when the widget is destroyed. Manual `PodContext.unsubscribe()` calls in `onExit()` are redundant (but harmless).

What is **not** auto-cleaned and therefore still requires `onExit()`:
- `setInterval` / `setTimeout` handles
- Dynamically created dialogs and popovers
- DOM event listeners added manually
- Abort controllers for in-flight fetch calls
- Other non-PodContext cleanup

### ✅ What the framework auto-handles

```javascript
async onInit() {
    await super.onInit();
    if (PodContext.isRunMode()) {
        PodContext.subscribe(ModelPath.SelectedOperationActivities, this._onChange, this);
        PodContext.subscribe(ModelPath.CurrentResource, this._onResource, this);
    }
}
// ✅ No onExit() needed just for PodContext unsubscribe.
// Widget.destroy() calls PodContext.unsubscribeAll(this) automatically.
```

> **Note:** This only holds when you pass `this` (the widget) as the `bindContext` — the standard pattern. If you use a different object as bindContext, `unsubscribeAll(this)` won't cover it.

### ❌ WRONG — Leaking timers and dialogs

```javascript
async onInit() {
    await super.onInit();
    this.#iTimer = setInterval(() => this._poll(), 5000);
    this.#oDialog = new Dialog({ title: "My Dialog" });
}
// No onExit() — timer keeps firing after widget is gone; dialog is never destroyed
```

### ✅ CORRECT — Clean up what the framework doesn't

```javascript
async onInit() {
    await super.onInit();
    this.#iTimer = setInterval(() => this._poll(), 5000);
    this.#oDialog = new Dialog({ title: "My Dialog", afterClose: () => this.#oDialog?.destroy() });
}

onExit() {
    super.onExit();
    clearInterval(this.#iTimer);
    this.#oDialog?.destroy();
    this.#oDialog = null;
}
```

### Complete onExit() Checklist

When implementing `onExit()`, ensure you clean up:

✅ `clearInterval` / `clearTimeout` for every timer  
✅ Destroy any dialogs/popovers created in `onInit()` (also cover the `afterClose` path)  
✅ Remove DOM event listeners added via `addEventListener`  
✅ Abort in-flight fetch calls via `AbortController`  

You do **not** need to manually call `PodContext.unsubscribe()` for the standard `PodContext.subscribe(path, cb, this)` pattern — the framework does it for you.

### Multiple Subscriptions + Timer Example

```javascript
class MyWidget extends ControlWidget {
    #iTimerId = null;

    async onInit() {
        await super.onInit();
        if (PodContext.isRunMode()) {
            PodContext.subscribe(ModelPath.SelectedOperationActivities, this._onOpsChange, this);
            PodContext.subscribe(ModelPath.CurrentResource, this._onResourceChange, this);
            this.#iTimerId = setInterval(() => this._pollStatus(), 5000);
        }
    }

    onExit() {
        super.onExit();
        // PodContext cleanup is automatic — no unsubscribe calls needed.
        // Clear the timer the framework doesn't know about:
        if (this.#iTimerId) {
            clearInterval(this.#iTimerId);
            this.#iTimerId = null;
        }
    }
}
```

### Prevention Checklist

Before submitting widget code:

- [ ] `onExit()` exists and calls `super.onExit()`
- [ ] Every `setInterval`/`setTimeout` is cleared in `onExit()`
- [ ] Every dialog/popover created in `onInit()` is destroyed in `onExit()` or `afterClose`
- [ ] No DOM event listeners left dangling

### See Also

- [Widget Lifecycle](widget-patterns-core.md#controlwidget-pattern-for-single-controls) — complete lifecycle documentation
- [PodContext subscribe/unsubscribe](subscribe-patterns.md#the-subscribe-pattern-complete) — subscribe/unsubscribe documentation
- [Mistake #15](common-mistakes-setup.md#mistake-15-not-destroying-dynamic-dialogspopovers) / [Mistake #19](common-mistakes-lifecycle.md#mistake-19-not-destroying-dialogs-in-afterclose-) — dialog destruction patterns

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

**See also:** [widget-patterns.md - GrowingJSONModel](widget-patterns-advanced.md#growingpagination-pattern-for-tablewidget)

---

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

**Error**: Using `EXCLUDE_PROPERTIES` where `INCLUDE_PROPERTIES` (or vice versa) is the right tool, or adding properties to a list that has no effect.

**Found in**: Custom POD 2.0 widgets extending `ControlWidget` or `TableWidget`.

### Understanding the two designer-panel patterns

| Pattern | Type | Purpose | Use When |
|---------|------|---------|----------|
| `static EXCLUDE_PROPERTIES` | static | **Hide** specific properties from POD Designer property panel | Blacklist: most properties visible, a few hidden |
| `static INCLUDE_PROPERTIES` | static | **Show only** specific properties in POD Designer property panel | Whitelist: tight control, only named properties visible |

Both are static class properties read by `ControlWidget` via `_findClassProperty()` (walks the prototype chain). Only one should be used at a time.

> **`IGNORE_TABLE_PROPERTIES` does nothing.** This instance property appears in some framework widgets but is never read by `TableWidget._createTable()`. The table constructor already auto-filters all non-`sap.m.Table` properties by checking `Table.getMetadata().getAllSettings()` — no manual exclusion list is needed.

### ❌ WRONG — Blacklisting properties that the designer should show

```javascript
class MyWidget extends ControlWidget {
    static EXCLUDE_PROPERTIES = [
        "growing",           // ❌ if you DO want users to configure this
        "printButtonVisible" // ❌ if this is a valid designer option
    ];
}
```

### ✅ CORRECT — Blacklist approach (hide a few, show the rest)

```javascript
class MyWidget extends ControlWidget {
    static EXCLUDE_PROPERTIES = [
        ...ControlWidget.ALWAYS_EXCLUDE_PROPERTIES, // inherit the framework defaults
        "growing",           // ✅ always programmatic, hide from designer
        "growingThreshold"   // ✅ always programmatic, hide from designer
    ];
}
```

### ✅ CORRECT — Whitelist approach (show only named properties)

```javascript
class MyWidget extends ControlWidget {
    static INCLUDE_PROPERTIES = [
        "alternateRowColors",
        "backgroundDesign",
        "visible",
        "width"
    ];
}
```

### Decision Tree

```
Do you want most properties visible and only a few hidden?
├─ YES → use EXCLUDE_PROPERTIES (blacklist)
└─ NO  → use INCLUDE_PROPERTIES (whitelist, show only named ones)

Is the property widget-specific and not an sap.m.Table property?
└─ No action needed — TableWidget._createTable() auto-filters non-Table properties.
   IGNORE_TABLE_PROPERTIES has no effect.
```

### Prevention

1. Know whether your intent is "hide a few" (EXCLUDE) or "show only these" (INCLUDE)
2. Never use both on the same class
3. Do not add `IGNORE_TABLE_PROPERTIES` — it is not read by the framework

---

---

## Mistake #32: Widget Metadata i18n Keys — Use Named Prefix (`<widgetName>.displayName`, etc.)

**Error #1**: All custom extensions land in the **same** group ("CUSTOMER", "Examples", …) in
the POD Designer Widget Palette, regardless of what the request spec said in `Category`.

**Error #2**: i18n bundles use an **inconsistent key style** for the widget metadata trio:
`displayName=…` and `description=…` end up *without* prefix, but `widget.category=…` *with*
prefix — purely because old example bundles mixed both styles.

These are the same family of bug: the widget metadata trio (`displayName`, `description`,
`category`) is the **single source of truth** the POD Designer reads when displaying a
widget tile in its palette. All three must come from `POD2_EXTENSION_EXAMPLE.md` (Extension Name,
Description, Category) and all three must use a **named prefix** (`<widgetName>.`) derived
from the widget's short name in camelCase.

### The Convention (one rule for the whole trio)

| Field         | Spec field in `POD2_EXTENSION_EXAMPLE.md` | i18n key (example: widget "Coating")           | Read in widget code via                   |
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

This compiles and runs, but it's a code smell that propagates through every extension the
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
# i18n.properties (and all present locale bundles — same key set!)
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

- All three values come from `POD2_EXTENSION_EXAMPLE.md` — never hardcoded from the example
- All three i18n keys use a **named prefix** derived from the widget’s short name (camelCase) — e.g. `coating.displayName`, `coating.description`, `coating.category`
- The same key set appears in **all 3 locale bundles** (`i18n.properties`, `i18n_de.properties`,
  `i18n_en.properties`)
- Translate `displayName` / `description` per locale; **do not translate `category`** unless
  the customer explicitly asked for it (otherwise the same extension shows up under different
  group names per language → looks broken in mixed-locale teams)
- The widget reads each value via `getI18nText("<widgetName>.…")` from the matching static accessor
- This convention applies **uniformly** regardless of whether the extension has 1 widget or N widgets — no special-casing needed

### Multi-Widget Plugins

When a extension registers **multiple widgets** in `extension.json`, each widget already has
its own unique named prefix — no special-casing needed:

```properties
# Extension with 2 widgets — each uses its own camelCase widget name as prefix
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
the extension has.

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
grep -E '^(Extension Name|Name|Description|Category):' POD2_EXTENSION_EXAMPLE.md   # spec
grep -hE '^[a-z]+\.(displayName|description|category)' i18n/*.properties     # bundle

# Verify the widget code reads named-prefixed keys (anti-pattern: generic "widget.")
grep -nE 'getI18nText\("widget\.' widget/
```

If any of these checks return hits, fix them — the convention is `<widgetName>.` prefix
everywhere.

### Prevention

- ✅ Read `Plugin Name`, `Description`, `Category` from the spec **before** writing the i18n bundles
- ✅ Derive the camelCase widget name from the extension name (e.g. `Step Status` → `stepStatus`)
- ✅ Use the `<widgetName>.` prefix consistently — `stepStatus.displayName`, `stepStatus.description`, `stepStatus.category`
- ✅ Verify all present locale bundles carry the same key set
- ✅ When referencing an example, look at the **structure** (`getI18nText("<widgetName>.…")`),
  not the legacy values
- ❌ Don't keep unprefixed `displayName=` / `description=` from older examples
- ❌ Don't use the generic `widget.*` prefix — it is deprecated
- ❌ Don't hardcode `<widgetName>.category=CUSTOMER` regardless of spec
- ❌ Don't use the extension name as the category — `Coating` is not a category, `Customer` is
- ❌ Don't translate `category` unless the customer explicitly asked for it

### Related

- [Mistake #2: Binding Syntax in WidgetProperty Metadata](common-mistakes-setup.md#mistake-2-binding-syntax-in-widgetproperty-metadata) — same family: i18n must come from the right source
- [Mistake #30: Wrong German i18n — "SFC" Instead of "PSN"](common-mistakes-i18n.md#mistake-30-wrong-german-i18n--sfc-instead-of-psn---) — same family: bundle values matter


---

---
