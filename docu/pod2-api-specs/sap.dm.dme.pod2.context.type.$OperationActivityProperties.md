# $OperationActivityProperties

`sap.dm.dme.pod2.context.type.$OperationActivityProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityGroup` | string | Yes | Referred to as "operation" in process industry. |
| `stepId` | string | No |  |
| `workCenter` | string | Yes |  |
| `resource` | string | Yes |  |
| `quantity` | number | Yes |  |
| `quantityComplete` | number | Yes |  |
| `quantityInQueue` | number | Yes |  |
| `quantityInWork` | number | Yes |  |
| `scheduleStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `scheduleEndDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `statusNew` | boolean | No |  |
| `statusBypassed` | boolean | No |  |
| `statusInQueue` | boolean | No |  |
| `statusInQueueReject` | boolean | No |  |
| `statusInQueueRework` | boolean | No |  |
| `statusInWork` | boolean | No |  |
| `statusInWorkReject` | boolean | No |  |
| `statusInWorkRework` | boolean | No |  |
| `statusComplete` | boolean | No |  |
| `statusCompletePending` | boolean | No |  |
| `statusCompletePendingRework` | boolean | No |  |
| `statusCompletePendingReject` | boolean | No |  |
| `statusEmpty` | boolean | No |  |
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityVersion` | string | No |  |
| `stepDescription` | string | Yes |  |
| `routing` | string | No |  |
| `routingVersion` | string | No |  |
| `routingSequence` | number | Yes |  |
| `routingType` | string | Yes |  |
| `resourceType` | string | Yes |  |
| `sfc` | string | No | Referred to as "charge" in process industry. |
| `sfcStepHandle` | string | Yes |  |
| `material` | string | No |  |
| `materialVersion` | string | No |  |
| `info` | string | Yes |  |
| `display` | boolean | No |  |
| `previouslyStarted` | boolean | No |  |
| `priority` | string | No |  |
| `processLot` | string | Yes |  |
| `quantityCompletePending` | number | Yes |  |
| `quantityReject` | number | Yes |  |
| `queuedDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `dueDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `plannedEndDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `plannedStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `opSplitId` | number | Yes |  |
| `reworkFlag` | string | Yes |  |
| `splitId` | string | Yes |  |
| `splitQuantity` | number | Yes |  |
| `laboredOperators` | Array.<string> | Yes |  |
