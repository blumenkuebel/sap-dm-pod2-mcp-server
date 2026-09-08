# $WorkListItemProperties

`sap.dm.dme.pod2.context.type.$WorkListItemProperties`

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
