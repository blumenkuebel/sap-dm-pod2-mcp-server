# POD2 Enumerations Reference

> **Source:** `sap.dm.dme.pod2.enumeration.*` — All framework enumerations extracted from the POD 2.0 runtime library.

---

## Import Pattern

```js
sap.ui.define([
  "sap/dm/dme/pod2/enumeration/SFCStatus",
  "sap/dm/dme/pod2/enumeration/WorkListType"
], (SFCStatus, WorkListType) => {
  
  if (item.sfcStatus === SFCStatus.ACTIVE) { /* ... */ }
  
  const type = WorkListType.WorkCenter;
});
```

> **Best Practice:** Always import the enum module and use the constant. Never use string literals like `"ACTIVE"` — they are not type-safe and can't be refactored.

---

## Core Enumerations

### SFCStatus
**Module:** `sap/dm/dme/pod2/enumeration/SFCStatus`
**Registered as:** `sap.dm.dme.pod2.enumeration.SFCStatus`

| Key | Value | Description |
|-----|-------|-------------|
| `ALL` | `"ALL"` | Filter: all statuses |
| `NEW` | `"NEW"` | Newly created |
| `IN_QUEUE` | `"IN_QUEUE"` | Queued for processing |
| `ACTIVE` | `"ACTIVE"` | Currently being processed |
| `HOLD` | `"HOLD"` | On hold |
| `DONE` | `"DONE"` | Processing complete |
| `DONE_HOLD` | `"DONE_HOLD"` | Done but on hold |
| `COMPLETED` | `"COMPLETED"` | Fully completed |
| `SCRAPPED` | `"SCRAPPED"` | Scrapped |
| `DELETED` | `"DELETED"` | Deleted |
| `RETURNED` | `"RETURNED"` | Returned |
| `GOLDEN_UNIT` | `"GOLDEN_UNIT"` | Golden unit |
| `INVALID` | `"INVALID"` | Invalid |
| `FROZEN` | `"FROZEN"` | Frozen state |
| `RELEASABLE` | `"RELEASABLE"` | Ready to release |
| `RELEASED` | `"RELEASED"` | Released |
| `PARTIALLY_RELEASED` | `"PARTIALLY_RELEASED"` | Partially released |
| `NOT_RELEASABLE` | `"NOT_RELEASABLE"` | Not releasable |
| `NOT_IN_EXECUTION` | `"NOT_IN_EXECUTION"` | Not in execution |
| `PARTIALLY_CREATED` | `"PARTIALLY_CREATED"` | Partially created |
| `OBSOLETE` | `"OBSOLETE"` | Obsolete |
| `ENABLED` | `"ENABLED"` | Enabled |
| `DISABLED` | `"DISABLED"` | Disabled |
| `OPEN` | `"OPEN"` | Open |
| `CLOSED` | `"CLOSED"` | Closed |
| `DISCARDED` | `"DISCARDED"` | Discarded |
| `PRODUCTIVE` | `"PRODUCTIVE"` | Productive |
| `SCHEDULED_DOWN` | `"SCHEDULED_DOWN"` | Scheduled downtime |
| `UNSCHEDULED_DOWN` | `"UNSCHEDULED_DOWN"` | Unscheduled downtime |
| `UNKNOWN` | `"UNKNOWN"` | Unknown |
| `UNLOADED` | `"UNLOADED"` | Unloaded |
| `ENGINEERING` | `"ENGINEERING"` | Engineering state |
| `MULTIPLE` | `"MULTIPLE"` | Multiple statuses (UI display) |

---

### SFCStatusCode
**Module:** `sap/dm/dme/pod2/enumeration/SFCStatusCode`

Numeric status codes used in some API responses:

| Key | Value | Maps to SFCStatus |
|-----|-------|-------------------|
| `NEW` | `"401"` | NEW |
| `IN_QUEUE` | `"402"` | IN_QUEUE |
| `ACTIVE` | `"403"` | ACTIVE |
| `HOLD` | `"404"` | HOLD |
| `COMPLETED` | `"405"` | COMPLETED |
| `SCRAPPED` | `"407"` | SCRAPPED |
| `MULTIPLE` | `"MULTIPLE"` | MULTIPLE |

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
```js
sap.ui.define([
  "sap/dm/dme/pod2/enumeration/SFCStatus"
], (SFCStatus) => {
  
  const activeItems = workListItems.filter(
    item => item.sfcStatus === SFCStatus.ACTIVE
  );
});
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
