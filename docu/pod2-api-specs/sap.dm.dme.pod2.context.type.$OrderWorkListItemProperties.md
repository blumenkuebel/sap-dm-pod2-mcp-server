# $OrderWorkListItemProperties

`sap.dm.dme.pod2.context.type.$OrderWorkListItemProperties`

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
