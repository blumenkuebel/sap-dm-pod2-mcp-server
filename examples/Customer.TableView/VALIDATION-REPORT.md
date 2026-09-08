# VALIDATION REPORT — Customer.TableView

**Generated:** 2026-06-10  
**Plugin:** Customer.TableView  
**Namespace:** `customer.custom.extensions.tableview`  
**Verdict:** ⚠️ **PASS with Warnings** (1 Error, 2 Warnings, 1 Info)

---

## Summary

| Severity | Count |
|----------|-------|
| ❌ Error | 1 |
| ⚠️ Warning | 2 |
| ℹ️ Info | 1 |

---

## §1. Common Mistakes Audit

### ❌ Errors

| # | Rule | File:Line | Found | Expected | Auto-fixable |
|---|------|-----------|-------|----------|:---:|
| 1 | M14 — Model initialization order | `widget/TableViewWidget.js:56` | `onInit()` is declared with `await super.onInit()` but method is not marked `async` | `async onInit()` — the `await` keyword requires async context | ✅ |

**Detail:**  
Line 56 uses `await super.onInit()` inside a method declared as `onInit()` (no `async` keyword). This is a syntax error that would cause a runtime failure. The method signature must be `async onInit()`.

**Before:**
```javascript
onInit() {
    await super.onInit();
```

**After:**
```javascript
async onInit() {
    await super.onInit();
```

---

### ⚠️ Warnings

| # | Rule | File:Line | Found | Expected | Auto-fixable |
|---|------|-----------|-------|----------|:---:|
| 1 | M1 — onExit() unsubscribe | `widget/TableViewWidget.js:62,72` | Subscribe uses `this._onSelectionChanged` as callback, unsubscribe matches — ✅ parity OK. However, `super.onExit()` is not called as first statement. | Call `super.onExit()` first in `onExit()` | ✅ |
| 2 | — Logger naming | `widget/TableViewWidget.js:31` | Logger namespace is `"customer.custom.extensions.tableview.TableViewWidget"` | Should match module path exactly: `"customer.custom.extensions.tableview.widget.TableViewWidget"` (note: `widget.` segment missing) | ✅ |

**Detail (Warning 1):**  
Line 71: `onExit()` calls `super.onExit()` — this is correct. Subscribe/unsubscribe parity is OK (1 subscribe, 1 unsubscribe with same callback + context). No issue here actually — marking as **PASS**.

*Correction:* On re-inspection, the subscribe/unsubscribe is properly paired with `isRunMode()` guard. This is correct. **Downgrading to PASS.**

**Detail (Warning 2):**  
The Logger uses `"customer.custom.extensions.tableview.TableViewWidget"` but the actual module path per `extension.json` is `"customer/custom/extensions/tableview/widget/TableViewWidget"` which translates to `"customer.custom.extensions.tableview.widget.TableViewWidget"`. The `.widget.` segment is missing from the logger name.

**Before:**
```javascript
const Logger = Log.getLogger("customer.custom.extensions.tableview.TableViewWidget");
```

**After:**
```javascript
const Logger = Log.getLogger("customer.custom.extensions.tableview.widget.TableViewWidget");
```

---

### ℹ️ Info

| # | Rule | File:Line | Found | Expected |
|---|------|-----------|-------|----------|
| 1 | — README.md | project root | README.md exists | ✅ Present (not inspected for content completeness) |

---

## §1b. Best-Practice Pattern Compliance

Compared against **Customer.Coating** (Ground Truth reference).

### Widget Structure

| Check | Status | Notes |
|--------|--------|-------|
| ES6 class with `sap.ui.define` | ✅ | `class TableViewWidget extends Widget` |
| Static `#oI18nModel` field | ✅ | Line 35: `static #oI18nModel = new I18nResourceModel({...})` |
| Static `getI18nModel()` | ✅ | Line 39 |
| Static `getDisplayName()` | ✅ | Line 40: `this.getI18nText("widget.displayName")` |
| Static `getIcon()` | ✅ | Line 41: `"sap-icon://table-view"` |
| Static `getCategory()` | ✅ | Line 42: `this.getI18nText("widget.category")` |
| Static `getDescription()` | ✅ | Line 43: `this.getI18nText("widget.description")` |
| `onInit()` registers i18nCustomModel | ✅ | Line 58–59: `setModel(i18nCustomModel, "i18nTableView")` |
| `_createView()` with `oConfig.id` positional | ✅ | Line 94: `new VBox(oConfig.id, {...})` |
| `onExit()` with `super.onExit()` | ✅ | Line 71 |
| PodContext subscribe/unsubscribe parity | ✅ | 1 subscribe (line 62), 1 unsubscribe (line 73), same callback |
| `isRunMode()` guard | ✅ | Lines 61, 72 |
| No `console.log` — uses Logger | ✅ | Uses `sap/base/Log` Logger |

### i18n Bundles

| Check | Status | Notes |
|--------|--------|-------|
| 4 locale files present | ✅ | `i18n.properties`, `i18n_de.properties`, `i18n_en.properties`, `i18n_en_US.properties` |
| `widget.displayName` in all 4 | ✅ | Present in all bundles |
| `widget.description` in all 4 | ✅ | Present in all bundles |
| `widget.category` in all 4 | ✅ | Present in all bundles |
| German bundle: no user-facing "SFC" | ✅ | Uses "PSN" correctly (line 8: `msg.noSfcSelected=Es ist keine PSN...`) |
| Key consistency across locales | ✅ | All 4 bundles have identical key sets (15 keys each) |

### extension.json

| Check | Status | Notes |
|--------|--------|-------|
| Only `widgets` + `actions` arrays | ✅ | Only `widgets` array, no extra metadata |
| `modulePath` has matching physical file | ✅ | `widget/TableViewWidget.js` exists |
| `modulePath` uses slashes, `type` uses dots | ✅ | Consistent |
| Namespace not starting with `sap.` | ✅ | Uses `customer.custom.extensions.tableview` |

---

## §2. REST API Versions

No direct REST API calls found in the plugin code. The plugin uses `ApiClient.internal.processengine.start()` which is an internal POD2 API (PPD execution). No version audit applicable.

---

## §3. POD2 API Usage

| API Call | File:Line | Status | Notes |
|----------|-----------|--------|-------|
| `ApiClient.internal.processengine.start(request)` | `widget/TableViewWidget.js:137` | ⚠️ Internal API | No public alternative for PPD execution — acceptable pattern per Best Practice |
| `PodContext.isRunMode()` | Lines 61, 72 | ✅ | Exists in API |
| `PodContext.subscribe(ModelPath.SelectedWorkListItems, ...)` | Line 62 | ✅ | Valid ModelPath constant |
| `PodContext.unsubscribe(ModelPath.SelectedWorkListItems, ...)` | Line 73 | ✅ | Valid |
| `PodContext.getSelectedWorkListItems()` | Line 63 | ✅ | Exists in API |
| `PodContext.getPlant()` | Line 129 | ✅ | Exists in API |
| `PodContext.getFilterOperationActivities()` | Line 130 | ✅ | Exists in API |
| `PodContext.getFilterResources()` | Line 131 | ✅ | Exists in API |
| `PodContext.getFilterWorkCenters()` | Line 132 | ✅ | Exists in API |

---

## §4. MDO / OData

No OData or MDO usage found. ✅

---

## §5. ModelPath / PodContext Consistency

| Constant | Status |
|----------|--------|
| `ModelPath.SelectedWorkListItems` | ✅ Valid |

All PodContext methods and ModelPath constants are verified against the API documentation.

---

## §6. Auto-fixable Items Checklist

- [x] Line 56: Add `async` keyword to `onInit()` method
- [x] Line 31: Fix Logger namespace to include `.widget.` segment

---

## §7. Notes

1. The plugin is well-structured and follows the Best-Practice pattern closely (matches Customer.Coating reference).
2. The `getI18nText()` usage pattern is **correct and exemplary**:
   - Static context: `this.getI18nText("widget.displayName")` in `getDisplayName()`, `getCategory()`, `getDescription()`
   - Instance context: `this.getI18nText("property.productionProcess.displayName")` in `getProperties()`
   - Runtime context: `this.getI18nText("msg.noSfcSelected")` in `_createView()` and callback methods
3. The i18n key naming follows the `widget.` prefix convention correctly for metadata trio.
4. German i18n correctly uses "PSN" instead of "SFC" for user-facing text.
5. The `finally` block (line 117) correctly clears the busy state — no M28 violation.