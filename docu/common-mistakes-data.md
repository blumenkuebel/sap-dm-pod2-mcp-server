# Common Mistakes — 🔄 Data, State & TableWidget

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #23: Forgetting to Clear Busy State on Error ❌ → ✅

**Error**: Widget stuck in busy state after error

**Why It's Wrong**: Without `finally`, busy indicator stays visible if operation throws error.

### ❌ WRONG - No finally block
```javascript
async _refresh() {
    const oView = this.getView();
    oView.setBusy(true);
    
    try {
        await ApiClient.getData(oRequest);
        oView.setBusy(false);  // ❌ Never reached if error!
    } catch (oError) {
        MessageHistory.showError(oError.message);
        // ❌ Busy state still true!
    }
}
```

### ✅ CORRECT - Use finally
```javascript
async _refresh() {
    const oView = this.getView();
    oView.setBusyIndicatorDelay(0);
    oView.setBusy(true);
    
    try {
        const oData = await ApiClient.getData(oRequest);
        this._oModel.setData(oData);
    } catch (oError) {
        MessageHistory.showError(oError.message);
    } finally {
        oView.setBusy(false);  // ✅ Always executes!
    }
}
```

---

---

## Mistake #24: Not Handling Expected API Error Codes ❌ → ✅

**Error**: Showing error messages for expected "no data" scenarios

**Why It's Wrong**: Some error codes represent normal conditions (like "no pending buyoffs"), not errors.

### ❌ WRONG - All errors treated the same
```javascript
try {
    const aLogs = await ApiClient.findBuyoffLogs(oRequest);
    this._oModel.setData(aLogs);
} catch (oError) {
    // ❌ Shows error even for "no data" case
    MessageHistory.showError(oError.message);
}
```

### ✅ CORRECT - Handle specific error codes
```javascript
try {
    const aLogs = await ApiClient.findBuyoffLogs(oRequest);
    this._oModel.setData(aLogs);
} catch (oError) {
    // Expected case: no data available
    if (oError?.body?.error?.code === "sfc.notInCompletePending") {
        this.#oLog.info("No buyoff logs found");  // Info, not error
        this._oModel.setData([]);
        return;  // Don't show error to user
    }
    
    // Unexpected errors
    this.#oLog.error("Failed to fetch buyoff logs", oError);
    MessageHistory.showError(oError.message);
}
```

**Common SAP DM Error Codes:**
- `sfc.notInCompletePending` - No pending data (handle as empty result)
- `sfc.notFound` - SFC doesn't exist (show error)
- `operation.alreadyStarted` - Duplicate operation (show info message)

---

---

## Mistake #27: Missing Selection Synchronization with PodContext

**Error**: Table selections not synced with PodContext selections

**Found in**: Production POD 2.0 worklist table widgets

### ❌ WRONG - No bidirectional sync

```javascript
class MyTableWidget extends TableWidget {
    async onInit() {
        // Only subscribe, but don't sync table to PodContext
        PodContext.subscribe(ModelPath.SelectedWorkListItems, () => {
            // Missing: _syncSelectionsWithPodContext()
        }, this);
    }
    
    _onSelectionChange(oEvent) {
        // Only update PodContext, no sync logic
        const aSelected = this.getTable().getSelectedContexts()
            .map(ctx => ctx.getObject());
        PodContext.setSelectedWorkListItems(aSelected);  // ❌ Loses existing selections!
    }
}
```

**Problems**:
- External selection changes don't reflect in table
- Multi-select scenarios break
- Selection order not preserved
- User loses selections when clicking

### ✅ CORRECT - Complete bidirectional sync

```javascript
class OrderListTableWidget extends TableWidget {
    async onInit() {
        // Subscribe to external selection changes
        PodContext.subscribe(ModelPath.SelectedWorkListItems, () => {
            this._syncSelectionsWithPodContext();  // ✅ Sync table to match PodContext
        }, this);
        
        // Initial sync
        this._syncSelectionsWithPodContext();  // ✅ Critical!
    }
    
    /**
     * Sync table selections to match PodContext (external → table)
     */
    _syncSelectionsWithPodContext() {
        const oTable = this.getTable();
        const aSelectedWorkListItems = PodContext.getSelectedWorkListItems();
        const aSelectedIdentifiers = Array.isArray(aSelectedWorkListItems) ?
            aSelectedWorkListItems.map((oWorkListItem) => oWorkListItem.getIdentifier()) :
            [];

        oTable.getItems().forEach((oListItem) => {
            const oWorkListItem = oListItem.getBindingContext().getObject();
            oListItem.setSelected(aSelectedIdentifiers.includes(oWorkListItem.getIdentifier()));
        });
    }
    
    /**
     * Handle user selection in table (table → external)
     */
    _onSelectionChange(oEvent) {
        const aCurrentPodContextSelection = PodContext.getSelectedWorkListItems() || [];
        const aCurrentTableSelection = this.getTable().getSelectedContexts()
            .map((oContext) => oContext.getObject());

        const aNewSelection = [];
        const oSelectedIdentifiers = new Set(
            aCurrentTableSelection.map((oItem) => oItem.getIdentifier())
        );
        
        // Preserve existing selections that are still selected
        for (const oWorkListItem of aCurrentPodContextSelection) {
            if (oSelectedIdentifiers.has(oWorkListItem.getIdentifier())) {
                aNewSelection.push(oWorkListItem);
            }
        }

        // Add newly selected items
        if (oEvent.getParameter("selected")) {
            const aModifiedListItems = oEvent.getParameter("listItems")
                .map((oListItem) => oListItem.getBindingContext().getObject());
            aNewSelection.push(...aModifiedListItems);
        }

        PodContext.setSelectedWorkListItems(aNewSelection);
    }
    
    /**
     * Handle item press without losing multi-selection
     */
    _onItemPress(oEvent) {
        const oListItem = oEvent.getParameter("listItem");
        const oPressedWorkListItem = oListItem.getBindingContext().getObject();

        // Keep other selections, move clicked item to end (most recent)
        const aSelectedWorkListItems = PodContext.getSelectedWorkListItems() ?? [];
        const sSelectedIdentifier = oPressedWorkListItem.getIdentifier();
        const aNewSelections = [];

        for (const oSelectedWorkListItem of aSelectedWorkListItems) {
            if (oSelectedWorkListItem.getIdentifier() !== sSelectedIdentifier) {
                aNewSelections.push(oSelectedWorkListItem);
            }
        }
        aNewSelections.push(oPressedWorkListItem);
        PodContext.setSelectedWorkListItems(aNewSelections);
    }
    
    onExit() {
        super.onExit();
        
        // Critical: Unsubscribe
        PodContext.unsubscribe(
            ModelPath.SelectedWorkListItems,
            this._syncSelectionsWithPodContext,
            this
        );
    }
}
```

### Key Points:
1. **Bidirectional**: PodContext → table AND table → PodContext
2. **Initial sync**: Call `_syncSelectionsWithPodContext()` in `onInit()`
3. **Preserve selections**: Don't discard existing selections on change
4. **Item press**: Special handling to keep multi-select
5. **Use Set**: Efficient identifier lookup
6. **Always unsubscribe**: Prevent memory leaks

### Prevention:
1. Always implement `_syncSelectionsWithPodContext()`
2. Subscribe AND call sync in `onInit()`
3. Preserve existing selections in `_onSelectionChange()`
4. Handle `_onItemPress()` separately from selection change
5. Use identifiers (not object references) for comparison
6. Test multi-select scenarios

---

---

## Mistake #29: SFC Status as Number Instead of String ❌ → ✅

**Error**: Status filters return empty results, status comparisons silently fail — no exception, no warning.

**Found in**: Worklist filtering, status-driven UI logic, conditional rendering

**Critical**: SFC status fields are **strings**, not numbers — even though the values *look* numeric (e.g. `"401"`, `"402"`).

### Field Reference (from `worklist-data-structure.md`)

| Field                   | Type   | Example values                                                  |
|-------------------------|--------|-----------------------------------------------------------------|
| `sfcStatusCode`         | string | `"401"` New, `"402"` In Queue, `"403"` Active, `"405"` Done     |
| `sfcStatusDescription`  | string | `"New"`, `"In Queue"`, `"Active"`, `"Done"`                     |
| `sfcStatus` (worklist API) | string | `"401"`, `"402"`, ...                                        |

See also: [`docu/pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md`](pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md) — `sfcStatus` is documented as `string`.

### ❌ WRONG - Treating status as a number

```javascript
// Filter returns nothing — strict equality fails because "402" !== 402
const aInQueue = aWorkListItems.filter(i => i.sfcStatusCode === 402);

// Numeric comparisons fail or produce unexpected results
if (oItem.sfcStatusCode > 400) {
    // ❌ String "401" is NOT > number 400 in strict mode
}

// Coercing to Number breaks against API source-of-truth
const aActive = aWorkListItems.filter(
    i => Number(i.sfcStatusCode) === 403  // ❌ Fragile, masks type bugs
);

// Switch with numeric cases never matches
switch (oItem.sfcStatusCode) {
    case 401: /* ❌ never reached */ break;
    case 402: /* ❌ never reached */ break;
}
```

### ✅ CORRECT - Compare as strings

```javascript
// Strict string equality — matches what the API returns
const aInQueue = aWorkListItems.filter(i => i.sfcStatusCode === "402");
const aActive  = aWorkListItems.filter(i => i.sfcStatusCode === "403");
const aNew     = aWorkListItems.filter(i => i.sfcStatusCode === "401");
const aDone    = aWorkListItems.filter(i => i.sfcStatusCode === "405");

// Use a constant map to avoid magic strings
const SFC_STATUS = Object.freeze({
    NEW:      "401",
    IN_QUEUE: "402",
    ACTIVE:   "403",
    DONE:     "405"
});

const aActiveItems = aWorkListItems.filter(
    oItem => oItem.sfcStatusCode === SFC_STATUS.ACTIVE
);

// Switch with string cases works as expected
switch (oItem.sfcStatusCode) {
    case SFC_STATUS.NEW:      /* ✅ */ break;
    case SFC_STATUS.IN_QUEUE: /* ✅ */ break;
    case SFC_STATUS.ACTIVE:   /* ✅ */ break;
    case SFC_STATUS.DONE:     /* ✅ */ break;
}
```

### Why This Happens

1. The status codes (`401`, `402`, `403`, `405`) **look** like integers — many devs auto-assume they are numbers.
2. The SAP DM APIs return them as **JSON strings** (e.g. `"sfcStatus": "402"`).
3. With `===` (strict equality), `"402" === 402` is `false` — so filters return empty arrays **without throwing any error**.
4. Result: silent failures that are hard to spot in code review and only show up as "the table is suddenly empty" in production.

### Detection / Quick Audit

```bash
# Find suspicious numeric comparisons against status fields
grep -nE 'sfcStatus(Code)?\s*===?\s*[0-9]+' src/

# Find Number() coercion of status
grep -nE 'Number\(\s*[^)]*sfcStatus' src/
```

If any hit shows up — fix it to a string comparison.

### Prevention

- ✅ Always **quote** status codes as strings: `"401"`, never `401`
- ✅ Define a `const` enum/`Object.freeze({...})` map and reference that everywhere
- ✅ Use `===` (strict equality) so type bugs surface in code review
- ✅ Cross-reference `docu/worklist-data-structure.md` whenever you touch status logic
- ❌ Don't `Number(item.sfcStatusCode)` — it hides the type-mismatch bug
- ❌ Don't write `> 400` / `< 405` style numeric range checks against status

### Related

- [`docu/worklist-data-structure.md`](worklist-data-structure.md) — full SFC status code table
- [`docu/pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md`](pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md) — `sfcStatus: string`
- [Mistake #7: No Defensive Type Checking](common-mistakes-imports.md#mistake-7-no-defensive-type-checking) — same family of "silent type" bugs

---

---

## Mistake #34: `parseFloat()` on User Input Breaks Localized Number Formats

**Error**: `parseFloat("1,5")` returns `1` (not `1.5`). German / French / Spanish users enter `"1,5"` and the widget silently truncates to `1`, or rejects the value as invalid. Switch comma → dot in the user's input and everything works again — proving the bug is locale-related.

**Found in**: Any widget that takes numeric user input via `sap.m.Input` (manual measurements, quantities, prices, dimensions, …).

**Critical**: SAP DM is deployed in production plants worldwide. The browser/POD locale is **not always English**. A custom plugin that hard-codes `parseFloat()` works only in `en-*` locales and silently breaks in `de-*`, `fr-*`, `es-*`, `it-*`, `pt-*`, etc.

### Why JavaScript's `parseFloat()` Is Locale-Blind

```javascript
parseFloat("1.5")    // → 1.5    (English: dot decimal)
parseFloat("1,5")    // → 1      (German: comma decimal — TRUNCATED!)
parseFloat("1.234,5") // → 1.234 (German thousands separator confuses it — TRUNCATED at the comma)
parseFloat("1,234.5") // → 1     (English thousands separator confuses it — TRUNCATED at the comma)
```

`parseFloat()` and `Number(str)` always use **dot as decimal separator** and have no notion of locale. They are NOT safe for user-facing input.

The same blind spot applies to formatting:

```javascript
(1.5).toString()                  // → "1.5"    (always dot)
(1.5).toLocaleString("de-DE")     // → "1,5"   (locale-aware)
```

### ❌ WRONG — `parseFloat()` on user input

```javascript
// User types "1,5" in the input field (German locale)
const sValue = oInput.getValue();        // "1,5"
const num = parseFloat(sValue);          // 💥 1 — comma is treated as end-of-number
if (num > 0.5) {
    // never reached for German users entering "0,7"
}

// Same for any value pulled from an Input control
const area  = parseFloat(this._oAreaInput.getValue());     // "12,5" → 12 — silent data loss
const speed = parseFloat(this._oSpeedInput.getValue());    // "1.234,5" → 1.234 — wrong order of magnitude
```

Symptoms:
- User enters `0,7` → app reads `0` → "Value too small" or wrong calculation
- User enters `1.234,5` (German thousand separator) → app reads `1.234` → off by 1000×
- App **doesn't crash** — silently produces wrong results
- "Works on my machine" (English locale) → ships → fails in production at the German plant

### ❌ ALSO WRONG — `.toString()` for display

```javascript
const calculatedThickness = 12.5;
oInput.setValue(calculatedThickness.toString());     // "12.5" — wrong for German UI
oOutput.setText(`${calculatedThickness} µm`);         // template literals also use toString()
```

A German user sees `12.5` next to standard SAP DM screens that show `12,5`. The plugin looks like a foreign body.

### ✅ CORRECT — Use UI5's `NumberFormat` for both parse and format

UI5 provides `sap/ui/core/format/NumberFormat`, which is **locale-aware** and uses the same locale as the surrounding POD UI.

```javascript
sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    // …
], (NumberFormat, …) => {
    "use strict";

    class MyWidget extends Widget {
        // Lazy-init a single NumberFormat instance, reuse for parse + format
        _getNumberFormat() {
            if (!this._oNumberFormat) {
                this._oNumberFormat = NumberFormat.getFloatInstance({
                    groupingEnabled: false   // optional: hide thousand separators
                });
            }
            return this._oNumberFormat;
        }

        // Format a number → display string in the user's locale
        _formatNumber(value) {
            if (value === "" || value === null || value === undefined) return "";
            const num = typeof value === "number" ? value : Number(value);
            if (isNaN(num)) return String(value);
            return this._getNumberFormat().format(num);    // 1.5 → "1,5" (de) or "1.5" (en)
        }

        // Parse a display string → number, locale-aware
        _parseNumber(valueStr) {
            if (!valueStr) return NaN;
            const result = this._getNumberFormat().parse(valueStr);   // "1,5" (de) → 1.5
            return (result === null || result === undefined) ? NaN : result;
        }

        _onInputChange() {
            // ALWAYS go through _parseNumber — never parseFloat() / Number() on user input
            const value = this._parseNumber(this._oInput.getValue());
            if (isNaN(value)) {
                this._oInput.setValueState("Error");
                return;
            }
            // … use value
        }
    }
});
```

### When to Use Native vs Locale-Aware Parsing

| Source | Format | Use … |
|---|---|---|
| **User input** (Input control, dialog field, text-area) | locale-dependent | `NumberFormat.parse()` |
| **Display in UI** (setValue, setText, table cell) | locale-dependent | `NumberFormat.format()` |
| **API/REST JSON payload** (`{ thickness: 12.5 }`) | always dot — JSON spec | `parseFloat()` / `Number()` is **fine** |
| **Internal config / constants** (Min/Max from server) | always dot when comes from JSON | `parseFloat()` / `Number()` is **fine** |
| **Arithmetic** with already-parsed numbers | already number | use directly, no re-parse |

The rule: **anything the user typed or sees** → through `NumberFormat`. Anything that came over the wire as JSON or is hard-coded in the source → native `parseFloat` is OK because JSON has no locale.

### Subtle Gotcha — JSON Server Values Are Always Dots

When the backend returns `{ "min": "0.5", "max": "2.0" }`, those strings always use **dots** (JSON spec). Don't run them through `NumberFormat.parse()` — that would fail in German locale because `parse("0.5")` in German expects `0,5`!

```javascript
// Server-side string "0.5" coming from a JSON Production Process response
const minStr = entry.Min;  // "0.5" — JSON, always dot

// ❌ WRONG — locale-aware parse on a JSON value
const min = this._parseNumber(minStr);   // German locale: NaN!

// ✅ CORRECT — native parse on JSON values (always dots)
const min = parseFloat(minStr);          // 0.5

// Then if you want to DISPLAY it to the user:
const displayMin = this._formatNumber(min);   // German: "0,5", English: "0.5"
```

### Detection / Quick Audit

```bash
# Find suspicious parseFloat / Number() on user-input-derived values
grep -nE 'parseFloat\(\s*[^)]*\.getValue\(\)' widget/
grep -nE 'parseFloat\(\s*o[A-Z][a-zA-Z]+Input' widget/
grep -nE 'Number\(\s*[^)]*\.getValue\(\)' widget/

# Find raw .toString() used for display in setValue/setText
grep -nE '\.setValue\(\s*[^)]*\.toString\(\)' widget/
grep -nE '\.setText\(\s*[^)]*\.toString\(\)' widget/

# Find template literals with raw numbers (potential display issue)
grep -nE 'setText\(\s*`[^`]*\$\{[^}]*\}' widget/
```

If hits in the first three groups → migrate to `_parseNumber()`. Hits in the last two need a `_formatNumber()` wrapper.

### Prevention

- ✅ Define `_getNumberFormat()`, `_parseNumber()`, `_formatNumber()` helpers in every widget that reads numeric input
- ✅ Use `NumberFormat.getFloatInstance()` (or `getIntegerInstance()`, `getCurrencyInstance()`, `getPercentInstance()` as needed)
- ✅ Use `_parseNumber()` for **all** values from `Input.getValue()`
- ✅ Use `_formatNumber()` for **all** values written via `setValue()` / `setText()`
- ✅ JSON data from the backend stays raw (`parseFloat` is fine on dot-formatted JSON strings)
- ❌ Never `parseFloat(oInput.getValue())` on user input
- ❌ Never `Number(oInput.getValue())` either — same blind spot
- ❌ Never `.toString()` for display of a number in the UI — use `_formatNumber()`
- ❌ Don't mix locales: pick one `NumberFormat` instance per widget and reuse it

### Related

- [SAP UI5 API: sap.ui.core.format.NumberFormat](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.format.NumberFormat) — official documentation
- [Mistake #7: No Defensive Type Checking](common-mistakes-imports.md#mistake-7-no-defensive-type-checking) — same family of "silent type" bugs
- [Mistake #28: Multi-Part Bindings Without Defensive Checks](#mistake-28-multi-part-bindings-without-defensive-checks) — defensive null/undefined for formatter inputs
- See `examples/Customer.Coating/widget/CoatingWidget.js` — full reference implementation of `_getNumberFormat` / `_parseNumber` / `_formatNumber`

---

## Mistake #51: `ModelPath.SelectedPlant` does not exist — use `ModelPath.Plant`, callback receives a Plant OBJECT (not a string) ❌ → ✅ (RUNTIME "Model path is required")

### Symptom

```
Error: Model path is required at PodContext.subscribe
```

Or the callback receives `undefined` where a plant string was expected, and downstream code silently no-ops.

### Why it's wrong

Two common misconceptions:

**(a) The constant name.** Agents guess `ModelPath.SelectedPlant` by analogy with `ModelPath.SelectedWorkListItems`. It does not exist — the plant model path is `ModelPath.Plant`. Reading a non-existent property returns `undefined`, and `PodContext.subscribe(undefined, cb, this)` throws "Model path is required".

**(b) The callback value shape.** `PodContext.subscribe(ModelPath.Plant, cb)` fires with a **Plant object**, not a plant string:

```js
{ plant: "PLANT_A", timeZone: "Europe/Berlin", industryType: "DISCRETE" }
```

Treating the argument as a string (`if (newPlant === "PLANT_A")`) silently fails.

### ❌ Wrong

```js
onInit() {
    super.onInit();
    // ✗ ModelPath.SelectedPlant is undefined
    PodContext.subscribe(ModelPath.SelectedPlant, this._onPlantChange, this);
}
_onPlantChange(newValue, path) {
    // ✗ newValue is an object; toUpperCase() throws
    this.#sPlant = newValue.toUpperCase();
}
```

### ✅ Correct

```js
onInit() {
    super.onInit();
    PodContext.subscribe(ModelPath.Plant, this._onPlantChange, this);
    // Initial read (subscribe fires only on CHANGE, not on subscribe):
    const oInitialPlant = PodContext.get(ModelPath.Plant);
    if (oInitialPlant) this._onPlantChange(oInitialPlant, ModelPath.Plant);
}

_onPlantChange(oPlant, sPath) {
    // ✓ oPlant is { plant, timeZone, industryType } — extract the field you need.
    if (!oPlant || !oPlant.plant) { return; }
    this.#sPlant = oPlant.plant;
    this.#sTimeZone = oPlant.timeZone;
    this._refresh();
}

onExit() {
    PodContext.unsubscribe(ModelPath.Plant, this._onPlantChange, this);
    super.onExit();
}
```

### Rule of thumb

- **Always** look up the shape via `get_api_doc({ name: "sap.dm.dme.pod2.context.ModelPath" })` and `get_api_doc({ name: "sap.dm.dme.pod2.context.PodContext" })` — never guess constant names.
- `subscribe` callback signature is `(newValue, path)` (M5) — but `newValue` is the model-path-specific type. For `ModelPath.Plant` it's a Plant **object**; for `ModelPath.SelectedWorkListItems` it's an **array**; for `ModelPath.SelectedOperation` it's a **string**. Consult the ModelPath docs table.
- Reference: `docu/model-paths.md` — canonical table of every `ModelPath.*` constant and its value type.

### Detection pattern (validation)

- `grep -rnE 'ModelPath\.SelectedPlant' widget/ action/ context/ util/` — non-existent constant.
- `grep -rnE 'ModelPath\.Plant[),\s]' widget/ | xargs -I{} sh -c "grep -A5 {} widget/*.js | grep -E '\.toUpperCase\(\)|===\\s*\"[A-Z_]+\"'"` — callback that treats Plant as a string.

### Related

- M5 (Wrong Callback Parameter Order — `(newValue, path)`, not `(path, newValue)`).
- M13 (Wrong ModelPath Constants — companion for all other typo-prone paths).
- `docu/model-paths.md` (canonical constants table).
- `docu/subscribe-patterns.md`.

---

## Mistake #72: Hard-wiring an INTERNAL / app-router API into plugin source instead of the public REST API ❌ → ✅

### Symptom

The plugin works in one tenant, then breaks in another (or after a release) with 404 / HTML login-redirect / auth errors. The code calls an **execution / app-router host** — a URL containing `*.execution.*.web.dmc.cloud.sap`, a `~GUID~` path segment, or a `dmi/cdt` / `dim/destinations` service prefix — copied from a browser or from an agent's `call_internal_api` exploration.

### Why it's wrong

Those are **internal, unversioned, per-deployment** surfaces the Fiori UIs use. The host, the `~GUID~`, and the service paths are not a stable contract — they differ across tenants and change between releases. They are fine for **agent-side discovery/diagnosis** (`sap-dm-api-mcp-server.call_internal_api` exists exactly for that), but that tool's results are **not plugin code**. A shipped plugin must go through the **public SAP DM REST APIs** (versioned, documented in `list_rest_apis` / `get_rest_api`), which POD proxies with correct auth via `RestClient` + `ApiPaths` and the typed `*PublicApiClient`s.

> **Not this mistake:** `ApiClient.internal.processengine.start(...)` is a **documented POD2 framework API** for triggering a Production Process — it is the *correct* Option-1 pattern and is fully allowed. "Internal API" here means raw calls to app-router execution hosts, NOT the `ApiClient.internal.*` namespace.

<!-- doc-consistency-off -->
### ❌ Wrong

```js
// ✗ Hard-coded execution host + ~GUID~ + dmi/cdt path lifted from the browser / call_internal_api
const sUrl = "https://acme-dm.execution.eu20-quality.web.dmc.cloud.sap"
    + "/sapdmdmiproductionProcessDesigner/~a1b2c3~/dmi/cdt/v1.0/odata/ShopFloors";
const oResult = await RestClient.get(sUrl);   // breaks in the next tenant / release
```
<!-- doc-consistency-on -->

### ✅ Correct

```js
import RestClient from "sap/dm/dme/pod2/api/RestClient";
import ApiPaths from "sap/dm/dme/pod2/api/ApiPaths";
// ✓ Public, versioned REST API via the gateway path — POD handles host + auth
const sUrl = ApiPaths.API_GATEWAY_MS_PATH + "/sfc/v1/sfcData";
const oResult = await RestClient.get(sUrl, { plant: PodContext.getPlant(), sfc: "..." });
```

If — and only if — no public API can satisfy the requirement:
1. State which public services you checked (`search_rest_apis`, `list_rest_apis`) and why none fit.
2. Present the internal call and get **explicit user confirmation** before writing it into the plugin. Silence is not consent.

### Rule of thumb

- **Public-API-First.** Verify a public endpoint exists (`search_rest_apis` / `get_rest_api`) before reaching for anything internal.
- Never paste an execution-host URL, a `~GUID~`, or a `dmi/cdt` path into plugin source.
- `ApiClient.internal.processengine.start(...)` (PPD trigger) is allowed and unaffected by this rule.

### Detection pattern (validation)

- `grep -rnE '\.execution\.[a-z0-9-]+\.web\.dmc\.cloud\.sap|~[A-Za-z0-9-]+~|dmi/cdt|dim/destinations' widget/ action/ context/ util/` — internal/app-router surface hard-wired into plugin source.

### Related

- `get_pod2_guidelines` §"Public-API-First" (API-patterns section).
- `docu/pod2-public-api-pattern.md` (the correct `RestClient` + `ApiPaths` pattern).
- Option 1 vs Option 2 API-call table (PPD trigger vs direct public REST).

---

---
