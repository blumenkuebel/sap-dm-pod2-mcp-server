# $BaseOperationWorkItemProperties

`sap.dm.dme.pod2.context.type.$BaseOperationWorkItemProperties`

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
