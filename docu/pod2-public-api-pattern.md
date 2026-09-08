# POD 2.0 – REST API Calling Pattern (Custom Widgets/Actions)

## Summary

This document describes the correct way to call SAP Digital Manufacturing REST APIs from custom POD 2.0 Widgets and Actions. This was discovered through trial-and-error and source code analysis of the POD 2.0 framework.

---

## The Official Pattern

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/api/RestClient",
    "sap/dm/dme/pod2/api/ApiPaths",
    "sap/dm/dme/pod2/context/PodContext"
], (RestClient, ApiPaths, PodContext) => {

    // Build URL using ApiPaths constant + service path + endpoint
    const sUrl = ApiPaths.API_GATEWAY_MS_PATH + "/processLot/v1/processLot";
    // Result: "fnd/api-gateway-ms/processLot/v1/processLot"

    // GET with query parameters
    const oResult = await RestClient.get(sUrl, {
        plant: PodContext.getPlant(),
        processLot: "MY-LOT-001"
    });

    // POST with request body
    const oResult = await RestClient.post(sUrl, {
        plant: PodContext.getPlant(),
        number: "MY-LOT-001",
        members: []
    });

    // DELETE with query parameters in URL
    const sDeleteUrl = sUrl + "?plant=" + encodeURIComponent(sPlant) + "&processLot=" + encodeURIComponent(sNumber);
    await RestClient.delete(sDeleteUrl);
});
```

---

## Key Components

### 1. RestClient (`sap/dm/dme/pod2/api/RestClient`)

The framework-provided HTTP client. **Automatically handles:**
- OAuth 2.0 Bearer token (authentication)
- CSRF token
- App Router prefix (`/sapdmdmepod2/~{session-guid}~/`)
- Standard SAP DM headers

**Methods:**
| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `get(sUrl, oQueryParams?, oOptions?)` | GET request with query params |
| `post` | `post(sUrl, vBody, oOptions?)` | POST with JSON body |
| `put` | `put(sUrl, vBody, oOptions?)` | PUT with JSON body |
| `patch` | `patch(sUrl, vBody, oOptions?)` | PATCH with JSON body |
| `delete` | `delete(sUrl, oOptions?)` | DELETE request |
| `fetch` | `fetch(sUrl, oOptions?)` | Raw fetch with DM headers |

### 2. ApiPaths (`sap/dm/dme/pod2/api/ApiPaths`)

Frozen enum of internal service paths:

```javascript
const ApiPaths = Object.freeze({
    ACTIVITY_CONFIRMATION_MS_PATH: "dme/activityconfirmation-ms",
    ALERTS_MS_PATH: "dme/alerts-ms",
    API_GATEWAY_MS_PATH: "fnd/api-gateway-ms",
    ASSEMBLY_MS_PATH: "dme/assembly-ms",
    BARCODE_ODATA_PATH: "fnd-barcode-srv",
    DATA_COLLECTION_MS_PATH: "dme/datacollection-ms",
    DEMAND_MS_PATH: "dme/demand-ms",
    DEMAND_ODATA_PATH: "dme/demand.svc",
    DOCUMENT_MS_PATH: "fnd/document-ms",
    EPD_VISUALIZATION_PATH: "EPD_visualization",
    INVENTORY_MS_PATH: "dme/inventory-ms",
    INVENTORY_ODATA_PATH: "dme/inventory.svc",
    OEE_TRANSACTION_API_PATH: "dm-oee-transaction-api",
    PLANT_MS_PATH: "dme/plant-ms",
    PLANT_ODATA_PATH: "dme/plant.svc",
    PODFOUNDATION_MS_PATH: "dme/podfoundation-ms",
    PROCESSENGINE_MS_PATH: "dmi/pe",
    PRODUCT_MS_PATH: "dme/product-ms",
    PRODUCT_ODATA_PATH: "dme/product.svc",
    QUALITYINSPECTION_MS_PATH: "dme/qualityinspection-ms",
    SERVICEREGISTRY_MS_PATH: "fnd/serviceregistry-ms",
    SFCEXECUTION_MS_PATH: "dme/sfcexecution-ms",
    SFCEXECUTION_MS_V2_PATH: "dme/dm-execution-api",
    SFCEXECUTION_ODATA_PATH: "dme/sfcexecution.svc",
    SIGNATURE_MS_PATH: "fnd/signature-ms",
    TIMETRACKING_MS_PATH: "dme/timetracking-ms",
    WORKINSTRUCTION_MS_PATH: "dme/workinstruction-ms",
    WORKLIST_MS_PATH: "dme/worklist-ms",
    WORKLIST_ODATA_PATH: "dme/worklist.svc"
});
```

### 3. PodContext (`sap/dm/dme/pod2/context/PodContext`)

Provides plant and user context:
- `PodContext.getPlant()` → current plant ID
- `PodContext.getUserId()` → current user
- `PodContext.getPlantTimeZone()` → plant timezone

---

## URL Resolution: How It Works

### The POD 2.0 execution URL structure:
```
https://{tenant}.execution.{region}.web.dmc.cloud.sap/sapdmdmepod2/~{session-guid}~/{service-path}/{api-version}/{endpoint}
```

### Example (SFC API):
```
https://<tenant>.execution.<region>.web.dmc.cloud.sap
  /sapdmdmepod2/~e0114c14-767a-452a-8ceb-b73ece380c00~
  /fnd/api-gateway-ms/sfc/v1/sfcData
  ?plant=1030&sfc=9200000061
```

### What the developer provides:
```javascript
const sUrl = "fnd/api-gateway-ms/sfc/v1/sfcData";
//           ↑ NO leading slash! Relative path only.
```

### What RestClient does automatically:
1. Prepends the App Router prefix: `/sapdmdmepod2/~{guid}~/`
2. Adds authentication headers (Bearer token)
3. Adds CSRF token for POST/PUT/DELETE
4. Resolves against the current host

---

## URL Pattern for Public APIs via API Gateway

For any SAP DM Public REST API (available on `api.sap.com`), use the API Gateway path:

```javascript
const sUrl = ApiPaths.API_GATEWAY_MS_PATH + "/{serviceName}/{version}/{endpoint}";
```

### Common API Services:

| Service | URL Pattern | Example |
|---------|-------------|---------|
| SFC | `fnd/api-gateway-ms/sfc/v1/...` | `/sfcs`, `/sfcData` |
| Order | `fnd/api-gateway-ms/order/v1/...` | `/orders` |
| Process Lot | `fnd/api-gateway-ms/processLot/v1/...` | `/processLot` |
| Material | `fnd/api-gateway-ms/material/v1/...` | `/materials` |
| Inventory | `fnd/api-gateway-ms/inventory/v1/...` | `/inventory` |
| Data Collection | `fnd/api-gateway-ms/datacollection/v1/...` | `/log` |

---

## Common Mistakes

### ❌ WRONG: Using absolute API URL (causes CORS)
```javascript
// CORS ERROR! Different origin!
const sUrl = "https://api.test.eu20.dmc.cloud.sap/processLot/v1/processLot";
await RestClient.post(sUrl, oPayload);
```

### ❌ WRONG: Using leading slash (bypasses App Router)
```javascript
// 404! App Router prefix missing!
const sUrl = "/fnd/api-gateway-ms/processLot/v1/processLot";
await RestClient.post(sUrl, oPayload);
```

### ❌ WRONG: Using PodContext.getContext() (doesn't exist)
```javascript
// TypeError! getContext() is not a function!
const oContext = PodContext.getContext();
const sToken = oContext.token;
```

### ❌ WRONG: Manual token/auth handling
```javascript
// UNNECESSARY! RestClient handles auth automatically!
await fetch(sUrl, {
    headers: { "Authorization": "Bearer " + token }
});
```

### ❌ WRONG: Using this.setBusy() on Widget
```javascript
// TypeError! Widget doesn't have setBusy()!
this.setBusy(true);
```

### ✅ CORRECT: The verbatim Widget busy pattern (mandatory)
```javascript
// Always this exact three-line preamble:
const oView = this.getView();
oView.setBusyIndicatorDelay(0);   // MUST — avoid the default 1000ms delay
oView.setBusy(true);              // MUST — via getView(), never this.setBusy()
try {
    // ... async work
} finally {
    oView.setBusy(false);         // MUST — in finally
}
```

See [common-mistakes.md #33](common-mistakes.md#mistake-33-busyindicator-in-actions-via-view-instead-of-sapuicorebusyindicator) for the full rule (Widget vs. Action).

### ✅ CORRECT: The official pattern
```javascript
import RestClient from "sap/dm/dme/pod2/api/RestClient";
import ApiPaths from "sap/dm/dme/pod2/api/ApiPaths";

const sUrl = ApiPaths.API_GATEWAY_MS_PATH + "/processLot/v1/processLot";
const oResult = await RestClient.post(sUrl, {
    plant: PodContext.getPlant(),
    number: "LOT-001",
    members: []
});
```

---

## Complete Example: Process Lot API Utility

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/api/RestClient",
    "sap/dm/dme/pod2/api/ApiPaths",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/Logger"
], (RestClient, ApiPaths, PodContext, Logger) => {
    "use strict";

    class ProcessLotApi {

        static _buildUrl(sEndpoint) {
            return ApiPaths.API_GATEWAY_MS_PATH + "/processLot/v1" + sEndpoint;
        }

        static async getProcessLot(sNumber) {
            return RestClient.get(
                ProcessLotApi._buildUrl("/processLot"),
                { plant: PodContext.getPlant(), processLot: sNumber }
            );
        }

        static async createProcessLot(sNumber) {
            return RestClient.post(
                ProcessLotApi._buildUrl("/processLot"),
                { plant: PodContext.getPlant(), number: sNumber, members: [] }
            );
        }

        static async deleteProcessLot(sNumber) {
            const sPlant = PodContext.getPlant();
            const sUrl = ProcessLotApi._buildUrl("/processLot") +
                "?plant=" + encodeURIComponent(sPlant) +
                "&processLot=" + encodeURIComponent(sNumber);
            return RestClient.delete(sUrl);
        }

        static async addMembers(sNumber, aSfcs) {
            const sPlant = PodContext.getPlant();
            return RestClient.post(
                ProcessLotApi._buildUrl("/processLot/members"),
                {
                    plant: sPlant,
                    number: sNumber,
                    members: aSfcs.map(s => ({ sfc: { plant: sPlant, sfc: s } }))
                }
            );
        }

        static async removeMembers(sNumber, aSfcs) {
            const sPlant = PodContext.getPlant();
            return RestClient.post(
                ProcessLotApi._buildUrl("/processLot/removeMembers"),
                {
                    plant: sPlant,
                    number: sNumber,
                    members: aSfcs.map(s => ({ sfc: { plant: sPlant, sfc: s } }))
                }
            );
        }
    }

    return ProcessLotApi;
});
```

---

## Discovery Process (for reference)

This pattern was discovered through the following steps:

1. `PodContext.getContext()` → **does not exist** in POD 2.0
2. `RestClient` with relative path `/processLot/v1/processLot` → **404** (missing App Router prefix)
3. Absolute URL `https://api.*.dmc.cloud.sap/...` → **CORS blocked** (cross-origin)
4. `window.location.pathname` regex hack → **worked** but fragile
5. Framework source analysis found `ApiPaths.API_GATEWAY_MS_PATH` → **official pattern**, clean solution

The key insight: `RestClient` automatically prepends the App Router prefix (`/sapdmdmepod2/~{guid}~/`) when given a **relative path without leading slash** (e.g., `fnd/api-gateway-ms/...`).

---

## EventType — WebSocket Notification Events

Import: `"sap/dm/dme/pod2/notification/EventType"`

Used with `PodNotificationWebSocket.subscribe({ eventType: EventType.X, ... })`.

`EventType` is an `Enum.<string>`: the **keys** are the constant names you
reference in code (`EventType.SFC_START`), the **values** are the accepted event
strings sent by the runtime. `get_api_doc` for the enum itself returns nothing —
inspect the live members via the `pod2://api/sap.dm.dme.pod2.notification`
resource, or iterate `Object.keys(EventType)` at runtime.

> ⚠️ **The table below is illustrative, NOT authoritative.** The runtime
> `EventType` enum is the single source of truth. Event strings and version
> suffixes drift between releases — e.g. the runtime resolves `SFC_START` to
> `sap.dsc.dm.Sfc.Started.v3` (not `.v1`), and additional events such as
> `sap.dsc.dm.TimeRecord.Started.v1` / `sap.dsc.dm.TimeRecord.Stopped.v1` exist
> that are not listed here. **Never hardcode these strings.** Build any
> dropdown/validation from `Object.keys(EventType)` at runtime so it always
> matches the deployed enum.

### Event List (illustrative — verify against the runtime enum)

| Constant | Event String | Description |
|----------|-------------|-------------|
| `BACKFLUSH_FAILURE_MSG` | `sap.dsc.dm.Backflushing.FailureMessage.v1` | Backflush failure |
| `CUSTOM` | `sap.dsc.dm.GENERIC.MESSAGE.v1` | Custom/generic message (PPD trigger) |
| `DATA_COLLECTION` | `sap.dsc.dm.Sfc.DataCollected.v3` | Data collected |
| `GOODS_RECEIPT_COMPLETED` | `sap.dsc.dm.GoodsReceipt.Completed.v1` | GR completed |
| `GOODS_RECEIPT_REQUESTED` | `sap.dsc.dm.GoodsReceipt.Requested.v1` | GR requested |
| `NC_LOG` | `sap.dsc.dm.NonConformanceIncident.Logged.v2` | NC incident logged |
| `OPERATION_COMPLETE` | `sap.dsc.dm.Sfc.OperationActivity.Completed.v2` | Operation completed |
| `OPERATION_START` | `sap.dsc.dm.Sfc.OperationActivity.Started.v1` | Operation started |
| `PP_ACTION` | `sap.dsc.dm.ProcessEngine.ProcessStateChanged.v1` | PPD state changed |
| `PP_END` | `sap.dsc.dm.ProcessEngine.ProcessEnded.v1` | PPD ended |
| `PP_START` | `sap.dsc.dm.ProcessEngine.ProcessStarted.v1` | PPD started |
| `RESOURCE_STATUS_CHANGE` | `sap.dsc.dm.plant.Resource.Status.Updated.v1` | Resource status changed |
| `SFC_COMPLETE` | `sap.dsc.dm.Sfc.Completed.v1` | SFC completed |
| `SFC_DISPOSITION` | `sap.dsc.dm.Sfc.Dispositioned.v1` | SFC dispositioned (v1) |
| `SFC_DISPOSITION_V2` | `sap.dsc.dm.Sfc.Dispositioned.v2` | SFC dispositioned (v2) |
| `SFC_SELECT` | `sap.dsc.dm.Sfc.Selected.v1` | SFC selected |
| `SFC_SIGNOFF` | `sap.dsc.dm.Sfc.SignedOff.v1` | SFC signed off |
| `SFC_START` | `sap.dsc.dm.Sfc.Started.v1` | SFC started |
| `SIGNATURE_CREATED` | `sap.dsc.dm.Signature.Created.v1` | Digital signature created |
| `WD_SCALE` | `sap.dsc.dm.WeighDispense.ScaleMessage.v1` | Weigh/Dispense scale msg |

### Subscribe Example

`subscribe()` takes an **options object** — the message handler is `onMessage`
(NOT `callback`), and there is no `listener` key. It returns a
`SubscriptionContext`; keep the reference and call `.unsubscribe()` on it in
`onExit()`. (For conditional/lifecycle-managed subscriptions, prefer
`ManagedSubscription` instead.)

```javascript
sap.ui.define([
  "sap/dm/dme/pod2/notification/PodNotificationWebSocket",
  "sap/dm/dme/pod2/notification/EventType",
  "sap/dm/dme/pod2/notification/Filter",
  "sap/dm/dme/pod2/context/PodContext"
], (PodNotificationWebSocket, EventType, Filter, PodContext) => {

  // Subscribe to SFC start events — store the returned SubscriptionContext
  this._oSfcStartSub = PodNotificationWebSocket.subscribe({
    eventType: EventType.SFC_START,
    onMessage: (message) => this._onSfcStarted(message),
    filter: Filter.equals("plant", PodContext.getPlant()),
    description: "MyWidget"
  });

  // Subscribe to custom PPD events (see "Custom events" below)
  this._oCustomSub = PodNotificationWebSocket.subscribe({
    eventType: EventType.CUSTOM,
    onMessage: (message) => this._onCustomEvent(message),
    description: "MyWidget"
  });

  // Unsubscribe in onExit() via the stored SubscriptionContext
  onExit() {
    this._oSfcStartSub?.unsubscribe();
    this._oCustomSub?.unsubscribe();
    super.onExit();
  }
});
```

> The `onMessage` handler receives a single message payload
> (`NotificationPayload`). The old `{ callback, listener }` shape and a static
> `PodNotificationWebSocket.unsubscribe({...})` do **not** exist — a handler wired
> that way never fires.

### Custom events

You **cannot register your own event type**. To send/receive an
application-specific event, use the built-in `EventType.CUSTOM` channel
(`sap.dsc.dm.GENERIC.MESSAGE.v1`) with a free-form payload, and differentiate
messages on the receiving side with a `Filter` on payload fields (e.g.
`Filter.equals("plant", ...)`). Inventing a new event-string constant will never
match anything.

### WebSocket Message Payloads

**SFC Execution events** (`SFC_START`, `SFC_SIGNOFF`, `SFC_COMPLETE`):
```javascript
{
  type: "SFC_START",
  plant: "P100",
  sfc: "SFC001",
  sfcs: ["SFC001"],
  resource: "RES01",
  operation: "OP010",
  workCenter: "WC01",
  stepId: "...",
  shopOrder: "ORD001",
  router: "R1",
  routerType: "...",
  routerVersion: "001",
  reportingStep: "..."
}
```

**Custom PPD event** (`CUSTOM` / `PP_ACTION`):
```javascript
{
  type: "CUSTOM",
  plant: "P100",
  // ... any custom payload from Production Process Designer
}
```

**Resource status change** (`RESOURCE_STATUS_CHANGE`):
```javascript
{
  type: "RESOURCE_STATUS_CHANGE",
  plant: "P100",
  resource: "RES01",
  status: "PRODUCTIVE"  // ResourceStatus enum value
}
```

---

## Related Framework Classes

| Class | Import Path | Purpose |
|-------|-------------|---------|
| `RestClient` | `sap/dm/dme/pod2/api/RestClient` | HTTP client with auto-auth |
| `ApiPaths` | `sap/dm/dme/pod2/api/ApiPaths` | Service path constants |
| `PodContext` | `sap/dm/dme/pod2/context/PodContext` | Plant, user, state |
| `PodNotificationWebSocket` | `sap/dm/dme/pod2/notification/PodNotificationWebSocket` | WebSocket notifications |
| `EventType` | `sap/dm/dme/pod2/notification/EventType` | Notification event constants |
| `Logger` | `sap/dm/dme/pod2/Logger` | Logging (no console.log!) — methods are `trace/debug/info/warn/error/fatal`. There is **no `warning()`** method; `oLog.warning(...)` throws a `TypeError` at runtime. |
| `Widget` | `sap/dm/dme/pod2/widget/Widget` | Widget base class |
| `Action` | `sap/dm/dme/pod2/action/Action` | Action base class |

### Referencing a dialog from a widget

`PodRuntime.showDialog(sDialogId)` opens a dialog by ID, and
`PodRuntime.getDialogIds()` returns the list of configured dialog IDs (use it to
populate a picker). To let a user pick a dialog **from a widget**, declare a
normal `WidgetProperty` and back it with a `SelectPropertyEditor`, seeding the
items from `getDialogIds()`:

```javascript
import WidgetProperty from "sap/dm/dme/pod2/widget/metadata/WidgetProperty";
import SelectPropertyEditor from "sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor";

// in getProperties() — `this` is the property accessor:
new WidgetProperty(this, "dialog",
  new SelectPropertyEditor(this, "dialog", this.getPodRuntime().getDialogIds()));
```

> `getWidgetReferenceProperties()` is a **static method on `Action`**, not on
> `Widget`. A widget referencing a dialog just uses the `WidgetProperty` +
> `SelectPropertyEditor` pattern above.
