# OrderWorkListItem

`sap.dm.dme.pod2.context.type.OrderWorkListItem`

A single item in an order-based work list.

**Extends:** [sap.dm.dme.pod2.context.type.BaseWorkListItem](sap.dm.dme.pod2.context.type.BaseWorkListItem.md)

**Implements:** [sap.dm.dme.pod2.context.type.$OrderWorkListItemProperties](sap.dm.dme.pod2.context.type.$OrderWorkListItemProperties.md)

## Constructor

```
new OrderWorkListItem (oProperties)
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
| `orderExecutionStatus` | sap.dm.dme.pod2.enumeration.ExecutionStatus | Yes |  |
| `orderReleaseStatus` | sap.dm.dme.pod2.enumeration.ReleaseStatus | Yes |  |
| `orderPlannedCompleteDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `orderQuantityPlanned` | number | Yes |  |
| `orderQuantityPlannedInProductionUom` | number | Yes |  |
| `orderQuantityCompleted` | number | Yes |  |
| `orderQuantityCompletedInProductionUom` | number | Yes |  |
| `sfcBatchNumber` | string | Yes |  |
| `sfcQuantityInProductionUom` | number | Yes |  |
| `sfcQuantityCompleted` | number | Yes |  |
| `sfcQuantityCompletedInProductionUom` | number | Yes |  |
| `baseCommercialUom` | string | Yes |  |
| `productionCommercialUom` | string | Yes |  |
| `erpAutoGRStatus` | boolean | Yes |  |
| `coAndByProductsIndicator` | string | Yes |  |
| `bom` | string | Yes |  |
| `bomType` | string | Yes |  |
| `bomVersion` | string | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### getIdentifier () → {string}

Builds a composite key string for the work list item to easily identify matching/duplicate items using a Set.

The exact format of the identifier string is subject to change, and should only be used for runtime
comparisons. The format is not guaranteed to be stable across versions and should not be persisted.

**Returns:** string - string

### validate ()

Override to validate against the SFCStatusCode enum.

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.OrderWorkListItem}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.worklist.OrderWorkListItem | No |  |

**Returns:** sap.dm.dme.pod2.context.type.OrderWorkListItem - [sap.dm.dme.pod2.context.type.OrderWorkListItem](sap.dm.dme.pod2.context.type.OrderWorkListItem.md)
