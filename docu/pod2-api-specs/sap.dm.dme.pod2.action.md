# action

`sap.dm.dme.pod2.action`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No | The unique identifier of the action. |
| `action` | string | No | The action's type string, used to get the corresponding class from [sap.dm.dme.pod2.action.ActionRegistry](sap.dm.dme.pod2.action.ActionRegistry.md). |
| `properties` | Object.<string, any> | Yes | The properties map for the action, as configured in the Properties Panel in the POD Designer. |
