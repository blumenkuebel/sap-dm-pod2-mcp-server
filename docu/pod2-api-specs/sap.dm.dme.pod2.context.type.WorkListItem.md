# WorkListItem

`sap.dm.dme.pod2.context.type.WorkListItem`

A single item in a work center-based or operation activity-based work list.

**Extends:** [sap.dm.dme.pod2.context.type.BaseWorkListItem](sap.dm.dme.pod2.context.type.BaseWorkListItem.md)

**Implements:** [sap.dm.dme.pod2.context.type.$WorkListItemProperties](sap.dm.dme.pod2.context.type.$WorkListItemProperties.md)

## Constructor

```
new WorkListItem (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sfc` | string | No | The SFC ID. |
| `material` | string | No |  |
| `materialDescription` | string | No |  |
| `materialVersion` | string | No |  |
| `routing` | string | No |  |
| `routingVersion` | string | No |  |
| `routingType` | sap.dm.dme.pod2.enumeration.RoutingType | No |  |
| `order` | string | No |  |
| `orderBatchNumber` | string | Yes |  |
| `sfcBatchNumber` | string | Yes |  |
| `sfcStatusCode` | sap.dm.dme.pod2.enumeration.SFCStatusCode | No |  |
| `sfcStatusDescription` | string | Yes |  |
| `sfcQuantity` | number | Yes |  |
| `orderPlannedStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `orderScheduledStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customFields` | Object.<string, string> | No |  |
| `materialGroup` | string | Yes |  |
| `routingSequence` | string | Yes |  |
| `orderType` | string | Yes |  |
| `workCenter` | string | Yes |  |
| `rmaNumber` | string | Yes |  |
| `processLot` | string | Yes |  |
| `priority` | string | Yes |  |
| `sfcQuantityInQueue` | number | Yes |  |
| `sfcQuantityInWork` | number | Yes |  |
| `sfcQuantityCompletePending` | number | Yes |  |
| `sfcCompletePending` | boolean | Yes |  |
| `sfcStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `sfcDateQueued` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `sfcDueDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `orderScheduledCompletionDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `shopFloorScheduledStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `shopFloorScheduledCompletionDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `operationScheduledStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `operationScheduledCompletionDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `operationPlannedStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `operationPlannedCompletionDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `operationActivity` | string | No |  |
| `operationActivityDescription` | string | Yes |  |
| `operationActivityGroup` | string | Yes |  |
| `stepId` | string | No |  |
| `resource` | string | Yes |  |
| `resourceSchedule` | string | Yes |  |
| `customer` | string | Yes |  |
| `customerOrder` | string | Yes |  |
| `laboredOperators` | Array | No |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### applySfcData (oSfcData)

Merge properties from the public /sfcData API into this work list item.

This function is primarily used to update a stale work list item. If this object is used within a model, it
is typically best practice to clone the object first and replace the original so that model changes are
correctly propagated.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oSfcData` | sap.dm.dme.pod2.api.sfc.SfcDataResponse | No |  |

### getIdentifier () → {string}

Builds a composite key string for the work list item to easily identify matching/duplicate items using a Set.

The exact format of the identifier string is subject to change, and should only be used for runtime
comparisons. The format is not guaranteed to be stable across versions and should not be persisted.

**Returns:** string - string

### validate ()

Override to validate against the SFCStatusCode enum.

### (static) _parseLaboredOperators (sLaboredOperators) → {Array.<string>}

The labored operators field is not returned as valid JSON. Instead, the format is:

`"Tuple<email1@sap.com, email2@sap.com, email3@sap.com>"`

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sLaboredOperators` | string | No |  |

**Returns:** Array.<string> - Array.<string>

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkListItem}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.worklist.WorkListItem | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkListItem - [sap.dm.dme.pod2.context.type.WorkListItem](sap.dm.dme.pod2.context.type.WorkListItem.md)
