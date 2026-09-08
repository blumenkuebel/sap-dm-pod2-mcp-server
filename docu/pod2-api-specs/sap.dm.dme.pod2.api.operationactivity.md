# operationactivity

`sap.dm.dme.pod2.api.operationactivity`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No | The plant to get work centers for. |
| `operationActivity` | string | Yes | Only return the operation activity with the specified name. |
| `version` | string | Yes | Only return operation activities with the specified version. |
| `currentVersion` | boolean | Yes | Only display current (or non-current) versions. |
| `type` | "NORMAL_OPERATION" \| "SPECIAL_OPERATION" | Yes | Only return operation activities of the given type. |
| `resourceType` | string | Yes | Restrict the results to a specific resource type. |
| `status` | string | Yes | Only return operations matching the given status. |
| `page` | number | Yes |  |
| `pageSize` | number | Yes |  |
| `sortBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
