# POD2 Enumerations Reference

> **Source:** `sap.dm.dme.pod2.enumeration.*` (plus `…batch.enumeration`,
> `…datacollection.enumeration`, `…timetracking.action`) — enumerations from the POD 2.0
> runtime library.
>
> ⚠️ **Everything in this file is POD-framework-internal.** Every enum below is the value
> set the **POD 2.0 UI framework uses internally**. These are **not** the SAP Digital
> Manufacturing **Public API / REST** values and do **not** necessarily match them — same
> concept, different value space. Treat this file as a reference for *framework-internal*
> code (binding against POD models, framework comparisons), **not** as the contract for data
> you send to or receive from the Public API.
>
> - When you read or write data via the **Public API / REST**, use the values from that
>   API's own spec — use the `get_rest_api` tool or
>   [`sap-dm-rest-services-overview.md`](sap-dm-rest-services-overview.md), not the keys here.
> - **Worklist data** likewise carries **Public-API** values. The clearest trap is SFC
>   status: the internal [`SFCStatus`](#sfcstatus-internal-framework-enum) enum is a broad
>   catch-all, while a worklist item exposes the business status as
>   [`sfcStatusCode`](#sfcstatuscode-public-api-worklist-business-status) (canonical:
>   [`worklist-data-structure.md`](worklist-data-structure.md#status-codes-reference)).
>   The same internal-vs-business split applies, in principle, to the other enums too.
> - Values here are taken from the framework source (`Object.freeze({…})`); the official
>   JSDoc bundle lists the enum **names** but not their members, so individual values are
>   **not** independently verified against SAP documentation.

---

## Import Pattern

```js
sap.ui.define([
  "sap/dm/dme/pod2/enumeration/WorkListType"
], (WorkListType) => {

  // Worklist items expose sfcStatusCode (a Public-API code string), NOT the internal SFCStatus enum.
  // Compare against the business code — see SFCStatusCode / worklist-data-structure.md.
  if (item.sfcStatusCode === "403") { /* Active */ }

  const type = WorkListType.WorkCenter;
});
```

> **Best Practice:** For the enums listed below, import the enum module and use the
> constant rather than a bare string literal — it is type-safe and refactorable. (The one
> exception is the **business SFC status on worklist items**: that arrives as a Public-API
> code string in `sfcStatusCode`, e.g. `"403"`, and is compared as such — it is not the
> internal `SFCStatus` enum. See the warning under [SFCStatus](#sfcstatus-internal-framework-enum).)

---

## Core Enumerations

### SFCStatus (internal framework enum)

**Module:** `sap/dm/dme/pod2/enumeration/SFCStatus`
**Registered as:** `sap.dm.dme.pod2.enumeration.SFCStatus`

> ⚠️ **SFC status is the biggest internal-vs-business trap** (the file-level warning above
> applies to every enum, but this one bites most often). `SFCStatus` is a framework-internal
> catch-all; a worklist item's business status is the Public-API
> [`sfcStatusCode`](#sfcstatuscode-public-api-worklist-business-status) /
> [`worklist-data-structure.md`](worklist-data-structure.md#status-codes-reference).
>
> - The business SFC statuses are only: New, In Queue, Active, Hold, Done, Scrapped, Invalid.
> - Several keys here (`COMPLETED`, `FORMATMSG`, `PARSEMSG`, `PRODUCTIVE`, `SCHEDULED_DOWN`,
>   `ENABLED`, `OPEN` …) are internal/cross-domain and do **not** correspond to a business
>   SFC status. In particular **`COMPLETED` is an internal key — there is no “Completed”
>   business SFC status; the business term is `Done`.**
> - When filtering worklist items, compare against the **business code** (`sfcStatusCode`,
>   e.g. `"403"`), not against an internal `SFCStatus` key.

The full internal enum (`Object.freeze`), as defined in the framework:

| Key | Value |
|-----|-------|
| `ALL` | `"ALL"` |
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |
| `FROZEN` | `"FROZEN"` |
| `ENABLED` | `"ENABLED"` |
| `DISABLED` | `"DISABLED"` |
| `DONE` | `"DONE"` |
| `OPEN` | `"OPEN"` |
| `CLOSED` | `"CLOSED"` |
| `DISCARDED` | `"DISCARDED"` |
| `PRODUCTIVE` | `"PRODUCTIVE"` |
| `SCHEDULED_DOWN` | `"SCHEDULED_DOWN"` |
| `UNSCHEDULED_DOWN` | `"UNSCHEDULED_DOWN"` |
| `IN_QUEUE` | `"IN_QUEUE"` |
| `ACTIVE` | `"ACTIVE"` |
| `DONE_HOLD` | `"DONE_HOLD"` |
| `SCRAPPED` | `"SCRAPPED"` |
| `INVALID` | `"INVALID"` |
| `DELETED` | `"DELETED"` |
| `RETURNED` | `"RETURNED"` |
| `GOLDEN_UNIT` | `"GOLDEN_UNIT"` |
| `UNKNOWN` | `"UNKNOWN"` |
| `UNLOADED` | `"UNLOADED"` |
| `ENGINEERING` | `"ENGINEERING"` |
| `FORMATMSG` | `"FORMATMSG"` |
| `PARSEMSG` | `"PARSEMSG"` |
| `DATEFORMATMSG` | `"DATEFORMATMSG"` |
| `PARTIALLY_RELEASED` | `"PARTIALLY_RELEASED"` |
| `RELEASED` | `"RELEASED"` |
| `NOT_RELEASABLE` | `"NOT_RELEASABLE"` |
| `NOT_IN_EXECUTION` | `"NOT_IN_EXECUTION"` |
| `COMPLETED` | `"COMPLETED"` (internal only — **not** a business SFC status) |
| `PARTIALLY_CREATED` | `"PARTIALLY_CREATED"` |
| `MULTIPLE` | `"MULTIPLE"` (UI display: multiple statuses) |

---

### SFCStatusCode (Public-API Worklist business status)

The business SFC status on a worklist item is **not** an internal
[`SFCStatus`](#sfcstatus-internal-framework-enum) key — it arrives as a Public-API code
string in `sfcStatusCode` (e.g. `"403"` = Active), with `sfcStatusDescription` alongside.

👉 **Canonical, complete list:**
[`worklist-data-structure.md` → Status Codes Reference](worklist-data-structure.md#status-codes-reference)
(codes `401`–`411`). Not duplicated here — keep that one table as the single source of truth.

> Business codes `401`–`411` are a different value space from the internal `SFCStatus` enum
> above, which additionally carries cross-domain/internal keys (`COMPLETED`, `PRODUCTIVE`,
> `FORMATMSG` …) that never appear as a worklist SFC status. In particular there is **no
> “Completed” business status** — the business term for a finished SFC is `Done` (`405`).

---

### WorkListType
**Module:** `sap/dm/dme/pod2/enumeration/WorkListType`

Determines how the worklist is grouped/loaded:

| Key | Value | Description |
|-----|-------|-------------|
| `WorkCenter` | `"WorkCenter"` | Worklist grouped by work center |
| `OperationActivity` | `"OperationActivity"` | Worklist by operation activity |
| `ProcessOrder` | `"ProcessOrder"` | Worklist by process order (Process Industry) |
| `ProductionOrder` | `"ProductionOrder"` | Worklist by production order (Discrete) |

---

### WorkListFilterInputType
**Module:** `sap/dm/dme/pod2/enumeration/WorkListFilterInputType`

| Key | Value | Description |
|-----|-------|-------------|
| `SFC` | `"SFC"` | Filter input is SFC-based |
| `ProcessLot` | `"ProcessLot"` | Filter input is Process Lot-based |

---

### OperationActivityStatus
**Module:** `sap/dm/dme/pod2/enumeration/OperationActivityStatus`

| Key | Value |
|-----|-------|
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |

---

### ResourceStatus
**Module:** `sap/dm/dme/pod2/enumeration/ResourceStatus`

| Key | Value | Description |
|-----|-------|-------------|
| `ENABLED` | `"ENABLED"` | Resource is enabled |
| `DISABLED` | `"DISABLED"` | Resource is disabled |
| `PRODUCTIVE` | `"PRODUCTIVE"` | Resource is producing |
| `SCHEDULED_DOWN` | `"SCHEDULED_DOWN"` | Planned downtime |
| `UNSCHEDULED_DOWN` | `"UNSCHEDULED_DOWN"` | Unplanned downtime |
| `UNKNOWN` | `"UNKNOWN"` | Status unknown |

> ⚠️ **MDO Extractor: numeric ERP codes in `RESOURCE.STATUS`.** The POD2 framework enum above
> uses text values. However, the **MDO Extractor** (`RESOURCE.STATUS`) delivers a *mixed* value
> space depending on data origin:
>
> | MDO value | Meaning | Origin |
> |-----------|---------|--------|
> | `"301"` | ENABLED | ERP-migrated resource (dominant in most tenants) |
> | `"1"` | DISABLED | ERP-migrated resource |
> | `"5"` | SCHEDULED_DOWN | ERP-migrated resource |
> | `"ENABLED"` | Enabled | SAP DM native resource |
> | `"DISABLED"` | Disabled | SAP DM native resource |
> | `"SCHEDULED_DOWN"` | Planned downtime | SAP DM native resource |
>
> When filtering or comparing against `RESOURCE.STATUS` in **MDO queries**, do **not** assume
> text values only — a filter like `STATUS eq 'ENABLED'` will miss the majority of resources
> on ERP-migrated tenants where `"301"` is the dominant value. Filter against both:
> ```js
> $filter=STATUS eq 'ENABLED' or STATUS eq '301'
> ```
> The `ResourceStatus` enum is correct for **POD2 framework-internal comparisons** (Worklist
> data, PodContext); only MDO Extractor raw queries are affected.

---

### RoutingType
**Module:** `sap/dm/dme/pod2/enumeration/RoutingType`

| Key | Value | Description |
|-----|-------|-------------|
| `PRODUCTION` | `"U"` | Standard production routing |
| `PRODUCTION_RECIPE` | `"V"` | Production recipe |
| `NC` | `"N"` | Nonconformance routing |
| `SPECIAL` | `"C"` | Special routing |
| `DISPOSITION` | `"D"` | Disposition routing |
| `SFC` | `"S"` | SFC-specific routing |
| `SHOP_ORDER` | `"H"` | Shop order routing |
| `SHOPORDER_SPECIFIC_RECIPE` | `"I"` | Shop order specific recipe |
| `CONFIGURABLE` | `"G"` | Configurable routing |
| `SERVICE_ORDER_ROUTING` | `"R"` | Service order routing |

> ⚠️ **MDO Extractor uses Klartext names, not ERP codes.** The single-letter values above
> (`"U"`, `"H"`, `"D"`, …) are what the **POD2 framework** stores internally and what
> appears in **Worklist item** `routingType` (e.g. `routingType: "H"`). The **MDO Extractor**
> (`ROUTING.ROUTING_TYPE`) delivers full text names instead:
>
> | MDO `ROUTING_TYPE` value | Corresponding enum key |
> |--------------------------|------------------------|
> | `"PRODUCTION"` | `RoutingType.PRODUCTION` (`"U"`) |
> | `"SHOP_ORDER"` | `RoutingType.SHOP_ORDER` (`"H"`) |
> | `"DISPOSITION"` | `RoutingType.DISPOSITION` (`"D"`) |
> | `"SPECIAL"` | `RoutingType.SPECIAL` (`"C"`) |
> | `"NC"` | `RoutingType.NC` (`"N"`) |
> | `"PRODUCTION_RECIPE"` | `RoutingType.PRODUCTION_RECIPE` (`"V"`) |
> | `"SHOPORDER_SPECIFIC_RECIPE"` | `RoutingType.SHOPORDER_SPECIFIC_RECIPE` (`"I"`) |
>
> When filtering MDO data use the Klartext names:
> ```js
> $filter=ROUTING_TYPE eq 'PRODUCTION'   // MDO query
> ```
> When comparing against Worklist item `routingType`, use the single-letter ERP code:
> ```js
> item.routingType === RoutingType.SHOP_ORDER  // "H"
> ```

---

### RoutingStatus
**Module:** `sap/dm/dme/pod2/enumeration/RoutingStatus`

| Key | Value |
|-----|-------|
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |

---

### MaterialType
**Module:** `sap/dm/dme/pod2/enumeration/MaterialType`

| Key | Value |
|-----|-------|
| `CONFIGURABLE` | `"CONFIGURABLE"` |
| `FINISHED` | `"FINISHED"` |
| `GENERAL` | `"GENERAL"` |
| `NONSTOCK` | `"NONSTOCK"` |
| `NONVALUATED` | `"NONVALUATED"` |
| `OPERATING_SUPPLIES` | `"OPERATING_SUPPLIES"` |
| `PACKAGING` | `"PACKAGING"` |
| `RETURNABLE_PACKAGING` | `"RETURNABLE_PACKAGING"` |
| `SEMIFINISHED_PRODUCT` | `"SEMIFINISHED_PRODUCT"` |
| `SERVICE` | `"SERVICE"` |
| `SERVICES` | `"SERVICES"` |
| `SOFTWARE_NONVALUATED` | `"SOFTWARE_NONVALUATED"` |
| `SPARE_PARTS` | `"SPARE_PARTS"` |
| `TRADING_GOODS` | `"TRADING_GOODS"` |
| `RAW` | `"RAW"` |
| `CUSTOM` | `"CUSTOM"` |
| `PRT` | `"PRT"` |
| `PIPELINE` | `"PIPELINE"` |

---

### MaterialQuantityRestriction
**Module:** `sap/dm/dme/pod2/enumeration/MaterialQuantityRestriction`

| Key | Value | Description |
|-----|-------|-------------|
| `ONLY_1_0` | `"O"` | Quantity must be exactly 1.0 |
| `WHOLE_NUMBER` | `"W"` | Quantity must be a whole number |
| `ANY_NUMBER` | `"A"` | Any quantity allowed |

---

### ProcurementType
**Module:** `sap/dm/dme/pod2/enumeration/ProcurementType`

| Key | Value |
|-----|-------|
| `MANUFACTURED` | `"MANUFACTURED"` |
| `PURCHASED` | `"PURCHASED"` |
| `MANUFACTURED_PURCHASED` | `"MANUFACTURED_PURCHASED"` |

---

### WorkCenterCategory
**Module:** `sap/dm/dme/pod2/enumeration/WorkCenterCategory`

| Key | Value |
|-----|-------|
| `NONE` | `"NONE"` |
| `CELL` | `"CELL"` |
| `CELL_GROUP` | `"CELL_GROUP"` |
| `LINE` | `"LINE"` |
| `LINE_GROUP` | `"LINE_GROUP"` |
| `BUILDING` | `"BUILDING"` |

> ⚠️ **MDO Extractor: additional `LEVEL*` values in `WORKCENTER.CATEGORY`.** The enum above
> lists the POD2 framework-known values. Live MDO data additionally delivers `"LEVEL0"`,
> `"LEVEL1"`, `"LEVEL2"`, `"LEVEL3"` (ERP work-center hierarchy levels) that are **not**
> present in the `WorkCenterCategory` enum constants. When filtering or displaying
> `WORKCENTER.CATEGORY` from MDO queries, account for these extra values:
>
> | MDO value | Description |
> |-----------|-------------|
> | `"NONE"` | No category (enum: `WorkCenterCategory.NONE`) |
> | `"CELL"` | Single machine or station (enum: `WorkCenterCategory.CELL`) |
> | `"CELL_GROUP"` | Group of cells (enum: `WorkCenterCategory.CELL_GROUP`) |
> | `"LINE"` | Production line (enum: `WorkCenterCategory.LINE`) |
> | `"LINE_GROUP"` | Group of lines (enum: `WorkCenterCategory.LINE_GROUP`) |
> | `"BUILDING"` | Building (enum: `WorkCenterCategory.BUILDING`) |
> | `"LEVEL0"` | ERP hierarchy level 0 — no enum constant |
> | `"LEVEL1"` | ERP hierarchy level 1 — no enum constant |
> | `"LEVEL2"` | ERP hierarchy level 2 — no enum constant |
> | `"LEVEL3"` | ERP hierarchy level 3 — no enum constant |
>
> Use a `switch`/`default` or `?.` guard when mapping MDO category values to UI labels.

---

### WorkInstructionType
**Module:** `sap/dm/dme/pod2/enumeration/WorkInstructionType`

| Key | Value | Description |
|-----|-------|-------------|
| `TEXT` | `"TEXT"` | Plain text instruction |
| `FILE` | `"FILE"` | File attachment |
| `URL` | `"URL"` | External URL |
| `HEADER_TEXT` | `"HEADER_TEXT"` | Header text |
| `LOCAL_FILE` | `"LOCAL_FILE"` | Local file |
| `STREAMING` | `"STREAMING"` | Streaming content (video) |

---

### WorkInstructionStatus
**Module:** `sap/dm/dme/pod2/enumeration/WorkInstructionStatus`

| Key | Value |
|-----|-------|
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |

---

### GoodsReceiptType
**Module:** `sap/dm/dme/pod2/enumeration/GoodsReceiptType`

| Key | Value | Description |
|-----|-------|-------------|
| `FINISHED_GOODS` | `"N"` | Finished goods |
| `CO_PRODUCTS` | `"C"` | Co-products |
| `BY_PRODUCTS` | `"B"` | By-products |

---

### IncrementBatchNumberType
**Module:** `sap/dm/dme/pod2/enumeration/IncrementBatchNumberType`

| Key | Value | Description |
|-----|-------|-------------|
| `NONE` | `"NONE"` | No auto-increment |
| `DAILY` | `"DAILY"` | Increment daily |
| `ORDER` | `"ORDER"` | Increment per order |
| `SHIFT` | `"SHIFT"` | Increment per shift |

---

## UI/Styling Enumerations

### ContentDensity
**Module:** `sap/dm/dme/pod2/enumeration/ContentDensity`

| Key | Value | Description |
|-----|-------|-------------|
| `Compact` | `"Compact"` | Compact mode (desktop) |
| `Cozy` | `"Cozy"` | Cozy mode (touch) |
| `System` | `"System"` | System default |

---

### CSSLayoutType
**Module:** `sap/dm/dme/pod2/enumeration/CSSLayoutType`

| Key | Value |
|-----|-------|
| `Flow` | `"Flow"` |
| `Flex` | `"Flex"` |

---

### FontStyle
**Module:** `sap/dm/dme/pod2/enumeration/FontStyle`

| Key | Value |
|-----|-------|
| `Normal` | `"normal"` |
| `Italic` | `"italic"` |
| `Oblique` | `"oblique"` |

---

### FontWeight
**Module:** `sap/dm/dme/pod2/enumeration/FontWeight`

| Key | Value |
|-----|-------|
| `Normal` | `"normal"` |
| `Bold` | `"bold"` |
| `Bolder` | `"bolder"` |
| `Lighter` | `"lighter"` |

---

### MarginSize
**Module:** `sap/dm/dme/pod2/enumeration/MarginSize`

| Key | Value |
|-----|-------|
| `None` | `"None"` |
| `Tiny` | `"Tiny"` |
| `Small` | `"Small"` |
| `Medium` | `"Medium"` |
| `Large` | `"Large"` |

---

## BOM Enumerations

### BomComponentType
**Module:** `sap/dm/dme/pod2/enumeration/BomComponentType`

| Key | Value | Description |
|-----|-------|-------------|
| `NORMAL` | `"NORMAL"` | Standard component |
| `TEST` | `"TEST"` | Test component |
| `PHANTOM` | `"PHANTOM"` | Phantom component (pass-through) |
| `CO_PRODUCT` | `"CO_PRODUCT"` | Co-product |
| `BY_PRODUCT` | `"BY_PRODUCT"` | By-product |

---

### BomStatus
**Module:** `sap/dm/dme/pod2/enumeration/BomStatus`

| Key | Value |
|-----|-------|
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |

---

### MaterialStatus
**Module:** `sap/dm/dme/pod2/enumeration/MaterialStatus`

| Key | Value |
|-----|-------|
| `FROZE` | `"FROZE"` |
| `HOLD` | `"HOLD"` |
| `NEW` | `"NEW"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `RELEASABLE` | `"RELEASABLE"` |

---

## Batch Enumerations

### BatchCharacteristicDataType
**Module:** `sap/dm/dme/pod2/batch/enumeration/BatchCharacteristicDataType`

| Key | Value | Description |
|-----|-------|-------------|
| `CHAR` | `"CHAR"` | Character/String value |
| `NUM` | `"NUM"` | Numeric value |
| `DATE` | `"DATE"` | Date value |
| `TIME` | `"TIME"` | Time value |

---

## Time Tracking Enumerations

### UserOption
**Module:** `sap/dm/dme/pod2/timetracking/action/UserOption`

| Key | Value | Description |
|-----|-------|-------------|
| `default` | `"default"` | Default user option |
| `singleUser` | `"singleUser"` | Single user clock in/out |
| `multipleUser` | `"multipleUser"` | Multiple users clock in/out |

---

## Data Collection Enumerations

### DataCollectionGroupStatus
**Module:** `sap/dm/dme/pod2/datacollection/enumeration/DataCollectionGroupStatus`

| Key | Value |
|-----|-------|
| `NEW` | `"NEW"` |
| `RELEASABLE` | `"RELEASABLE"` |
| `OBSOLETE` | `"OBSOLETE"` |
| `HOLD` | `"HOLD"` |

---

### DataCollectionParameterType
**Module:** `sap/dm/dme/pod2/datacollection/enumeration/DataCollectionParameterType`

| Key | Value | Description |
|-----|-------|-------------|
| `NUMBER` | `"NUMBER"` | Numeric parameter |
| `TEXT` | `"TEXT"` | Text parameter |
| `BOOLEAN` | `"BOOLEAN"` | Boolean parameter |
| `DATA_FIELD_LIST` | `"DATA_FIELD_LIST"` | Value from a data field list |

---

## Usage Examples

### Filtering by SFC Status

Worklist items expose **`sfcStatusCode`** (a Public-API business code), not the internal
`SFCStatus` enum. Compare against the code — see
[SFCStatusCode](#sfcstatuscode-public-api-worklist-business-status) and the canonical
[`worklist-data-structure.md`](worklist-data-structure.md#status-codes-reference).

```js
// "403" = Active (see the SFCStatusCode table)
const activeItems = workListItems.filter(
  item => item.sfcStatusCode === "403"
);
```

### Checking Work List Type
```js
sap.ui.define([
  "sap/dm/dme/pod2/context/PodContext",
  "sap/dm/dme/pod2/context/ModelPath",
  "sap/dm/dme/pod2/enumeration/WorkListType"
], (PodContext, ModelPath, WorkListType) => {
  
  const currentType = PodContext.get(ModelPath.WorkListType);
  
  if (currentType === WorkListType.ProcessOrder) {
    // Process Industry logic
  }
});
```

### Conditional Logic by Industry Type
```js
sap.ui.define([
  "sap/dm/dme/pod2/context/PodContext",
  "sap/dm/dme/pod2/enumeration/GoodsReceiptType"
], (PodContext, GoodsReceiptType) => {
  
  if (PodContext.isProcessIndustry()) {
    // Show co-products/by-products options
    const types = [GoodsReceiptType.FINISHED_GOODS, GoodsReceiptType.CO_PRODUCTS, GoodsReceiptType.BY_PRODUCTS];
  }
});
```

---

## Quick Reference: All Module Paths

```
sap/dm/dme/pod2/enumeration/BomComponentType
sap/dm/dme/pod2/enumeration/BomStatus
sap/dm/dme/pod2/enumeration/CSSLayoutType
sap/dm/dme/pod2/enumeration/ContentDensity
sap/dm/dme/pod2/enumeration/FontStyle
sap/dm/dme/pod2/enumeration/FontWeight
sap/dm/dme/pod2/enumeration/GoodsReceiptType
sap/dm/dme/pod2/enumeration/IncrementBatchNumberType
sap/dm/dme/pod2/enumeration/MarginSize
sap/dm/dme/pod2/enumeration/MaterialQuantityRestriction
sap/dm/dme/pod2/enumeration/MaterialStatus
sap/dm/dme/pod2/enumeration/MaterialType
sap/dm/dme/pod2/enumeration/OperationActivityStatus
sap/dm/dme/pod2/enumeration/ProcurementType
sap/dm/dme/pod2/enumeration/ResourceStatus
sap/dm/dme/pod2/enumeration/RoutingStatus
sap/dm/dme/pod2/enumeration/RoutingType
sap/dm/dme/pod2/enumeration/SFCStatus
sap/dm/dme/pod2/enumeration/SFCStatusCode
sap/dm/dme/pod2/enumeration/WorkCenterCategory
sap/dm/dme/pod2/enumeration/WorkInstructionStatus
sap/dm/dme/pod2/enumeration/WorkInstructionType
sap/dm/dme/pod2/enumeration/WorkListFilterInputType
sap/dm/dme/pod2/enumeration/WorkListType
sap/dm/dme/pod2/batch/enumeration/BatchCharacteristicDataType
sap/dm/dme/pod2/datacollection/enumeration/DataCollectionGroupStatus
sap/dm/dme/pod2/datacollection/enumeration/DataCollectionParameterType
sap/dm/dme/pod2/timetracking/action/UserOption
```
