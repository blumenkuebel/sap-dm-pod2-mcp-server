# $OperationActivityMasterProperties

`sap.dm.dme.pod2.context.type.$OperationActivityMasterProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityVersion` | string | No |  |
| `currentVersion` | boolean | No |  |
| `description` | string | No |  |
| `operationActivityType` | "NORMAL_OPERATION" \| "SPECIAL_OPERATION" | No |  |
| `status` | sap.dm.dme.pod2.enumeration.OperationActivityStatus | No |  |
| `resourceType` | string | Yes |  |
| `defaultResource` | string | Yes |  |
| `workCenter` | string | Yes |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |
