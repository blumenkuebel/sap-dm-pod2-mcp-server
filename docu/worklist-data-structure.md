# Worklist Item Data Structure

> Complete reference of all fields returned per SFC in the POD 2.0 Worklist.
> Use this when building custom widgets that consume Worklist data via the `WorkListDelegate`.

## Overview

The POD 2.0 Worklist returns an array of items, each representing one SFC at a specific operation/step. Each item contains **45+ fields** covering identification, status, quantities, scheduling, and custom extensions.

**Access pattern in widgets:**
```javascript
// Via WorkListDelegate subscription
this.subscribe("WorkListSelectEvent", this._onWorkListSelect, this);

// Selected items from PodContext
const selectedItems = this.getPodContext().getSelectedWorkListItems();
```

---

## Field Reference

### Core Identification

| Field | Type | Description |
|-------|------|-------------|
| `sfc` | string | Shop Floor Control number (unique production unit identifier) |
| `material` | string | Material number |
| `materialDescription` | string | Human-readable material description |
| `materialVersion` | string | Material version (e.g. "ERP001") |
| `materialGroup` | string \| null | Material group classification |

### Routing & Operation

| Field | Type | Description |
|-------|------|-------------|
| `routing` | string | Routing ID |
| `routingVersion` | string | Routing version |
| `routingType` | string | Routing type (e.g. "H" = Header) |
| `routingSequence` | string \| null | Routing sequence identifier |
| `operationActivity` | string | Operation activity ID |
| `operationActivityDescription` | string \| null | Description of the operation activity |
| `operationActivityGroup` | string | Operation activity group |
| `stepId` | string | Step ID within the routing (e.g. "0020", "0030") |

### Order Information

| Field | Type | Description |
|-------|------|-------------|
| `order` | string | Production order number |
| `orderBatchNumber` | string | Order batch number (empty string if none) |
| `orderType` | string | Order type (e.g. "Production") |
| `orderPlannedStartDate` | string (ISO 8601) | Order planned start date |
| `orderScheduledStartDate` | string (ISO 8601) | Order scheduled start date |
| `orderScheduledCompletionDate` | string (ISO 8601) | Order scheduled completion date |

### SFC Status & Quantities

| Field | Type | Description |
|-------|------|-------------|
| `sfcStatusCode` | string | Status code (e.g. "401" = New, "402" = InQueue, "403" = Active, "405" = Done) |
| `sfcStatusDescription` | string | Human-readable status (e.g. "InQueue", "Active", "New") |
| `sfcQuantity` | number | Total SFC quantity |
| `sfcQuantityInQueue` | number | Quantity currently in queue |
| `sfcQuantityInWork` | number \| null | Quantity currently in work |
| `sfcQuantityCompletePending` | string | Quantity pending completion (note: string type!) |
| `sfcCompletePending` | boolean | Whether SFC has pending completion |

### SFC Dates

| Field | Type | Description |
|-------|------|-------------|
| `sfcStartDate` | string (ISO 8601) \| null | When the SFC was started |
| `sfcDateQueued` | string (ISO 8601) | When the SFC was queued at this operation |
| `sfcDueDate` | string (ISO 8601) | SFC due date |

### Operation Scheduling

| Field | Type | Description |
|-------|------|-------------|
| `operationScheduledStartDate` | string (ISO 8601) | Scheduled operation start |
| `operationScheduledCompletionDate` | string (ISO 8601) | Scheduled operation completion |
| `operationPlannedStartDate` | string (ISO 8601) | Planned operation start |
| `operationPlannedCompletionDate` | string (ISO 8601) | Planned operation completion |
| `shopFloorScheduledStartDate` | string (ISO 8601) \| null | Shop floor scheduled start |
| `shopFloorScheduledCompletionDate` | string (ISO 8601) \| null | Shop floor scheduled completion |

### Resource & Work Center

| Field | Type | Description |
|-------|------|-------------|
| `workCenter` | string | Work center ID |
| `resource` | string \| null | Assigned resource |
| `resourceSchedule` | string \| null | Resource schedule information |

### Priority & Miscellaneous

| Field | Type | Description |
|-------|------|-------------|
| `priority` | string | Priority value (e.g. "500" = normal, lower = higher priority) |
| `processLot` | string \| null | Process lot identifier |
| `rmaNumber` | string \| null | Return Material Authorization number |
| `customer` | string \| null | Customer reference |
| `customerOrder` | string \| null | Customer order reference |

### Custom Fields

| Field | Type | Description |
|-------|------|-------------|
| `customFields` | object | Key-value pairs of custom field data. Keys follow pattern `ENTITY.FIELDNAME` |

### Operators

| Field | Type | Description |
|-------|------|-------------|
| `laboredOperators` | array | List of operators who have worked on this SFC |

---

## Anonymized Example JSON

```json
{
  "sfc": "SFC_EXAMPLE_001",
  "material": "MAT-001-EXAMPLE",
  "materialDescription": "Example Material Description",
  "materialVersion": "ERP001",
  "routing": "ROUTING_001",
  "routingVersion": "ERP001",
  "routingType": "H",
  "order": "ORDER_001",
  "orderBatchNumber": "",
  "sfcStatusCode": "402",
  "sfcStatusDescription": "In Queue",
  "sfcQuantity": 20,
  "orderPlannedStartDate": "2025-01-15T22:00:00.000Z",
  "customFields": {
    "SHOP_ORDER.CUSTOM_FIELD_1": "value1"
  },
  "materialGroup": null,
  "routingSequence": null,
  "orderType": "Production",
  "workCenter": "WC_EXAMPLE",
  "rmaNumber": null,
  "processLot": null,
  "priority": "500",
  "sfcQuantityInQueue": 20,
  "sfcQuantityInWork": null,
  "sfcQuantityCompletePending": "0",
  "sfcCompletePending": false,
  "sfcStartDate": null,
  "sfcDateQueued": "2025-02-13T15:45:44.000Z",
  "sfcDueDate": "2025-01-29T22:00:00.000Z",
  "orderScheduledStartDate": "2025-01-16T10:00:00.000Z",
  "orderScheduledCompletionDate": "2025-01-29T22:00:00.000Z",
  "shopFloorScheduledStartDate": null,
  "shopFloorScheduledCompletionDate": null,
  "operationScheduledStartDate": "2025-01-18T22:00:00.000Z",
  "operationScheduledCompletionDate": "2025-01-18T22:00:00.000Z",
  "operationPlannedStartDate": "2025-01-16T22:00:00.000Z",
  "operationPlannedCompletionDate": "2025-01-16T22:00:00.000Z",
  "operationActivity": "OP_ACTIVITY_001",
  "operationActivityDescription": null,
  "operationActivityGroup": "OP_GROUP_001",
  "stepId": "0020",
  "resource": null,
  "resourceSchedule": null,
  "customer": null,
  "customerOrder": null,
  "laboredOperators": []
}
```

---

## Status Codes Reference

| Code | Description | Usage Context |
|------|-------------|---------------|
| `401` | New | SFC created and released but not started at any operation |
| `402` | InQueue | SFC completed an operation or placed in queue at an operation |
| `403` | Active | SFC started at operation activity/phase, visible in POD |
| `404` | Hold | SFC on hold, cannot continue until hold is released |
| `405` | Done | SFC reached final operation or completed last operation |
| `406` | Done(Hold) | SFC completed but with hold status |
| `407` | Scrapped | SFC has been scrapped during production |
| `408` | Invalid | SFC has zero quantity (serialized, split, or merged) |
| `409` | Deleted | SFC has been deleted from the system |
| `410` | Returned | SFC returned to previous operation |
| `411` | Golden Unit | SFC designated as reference/golden unit |

> **Note:** In a typical Worklist view, you'll primarily see codes `402` (InQueue) and `403` (Active).

---

## Usage in Custom Widgets

### Accessing Worklist Data

```javascript
// In your widget controller:
_onWorkListSelect(event) {
  const selectedItems = event.getParameter("selectedItems") || [];
  
  // Each item has the full structure above
  selectedItems.forEach(item => {
    const sfc = item.sfc;
    const material = item.material;
    const status = item.sfcStatusCode;
    const quantity = item.sfcQuantity;
    const customData = item.customFields;
  });
}
```

### Filtering by Status

```javascript
// Get only items in queue
const inQueueItems = worklistItems.filter(
  item => item.sfcStatusCode === "402"
);

// Get active/in-work items
const activeItems = worklistItems.filter(
  item => item.sfcStatusCode === "403"
);

// Get new (not yet started) items
const newItems = worklistItems.filter(
  item => item.sfcStatusCode === "401"
);
```

### Working with Custom Fields

```javascript
// Custom fields use ENTITY.FIELDNAME pattern
const density = item.customFields["SHOP_ORDER.DENSITY"];
const customValue = item.customFields["SHOP_ORDER.MY_CUSTOM_FIELD"];
```

### Date Handling

```javascript
// All dates are ISO 8601 strings – parse with DateTimeUtils
const dueDate = sap.dm.dme.pod2.DateTimeUtils.parseDate(item.sfcDueDate);
const isOverdue = new Date(item.sfcDueDate) < new Date();
```

---

## Notes

- **All date fields** are ISO 8601 UTC strings (ending with `Z`)
- **`sfcQuantityCompletePending`** is a string (not number!) – parse before arithmetic
- **`priority`** is a string – lower numeric value = higher priority
- **`customFields`** keys follow the pattern `ENTITY_TYPE.FIELD_NAME` (e.g. `SHOP_ORDER.DENSITY`)
- **Null values** are common for optional scheduling fields (shopFloor*, resource, etc.)
- **`laboredOperators`** is typically empty until operators badge in