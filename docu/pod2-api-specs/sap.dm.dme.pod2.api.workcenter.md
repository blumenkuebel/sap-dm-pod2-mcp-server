# workcenter

`sap.dm.dme.pod2.api.workcenter`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No | The plant to get work centers for. |
| `workCenter` | string | Yes | Only return the work center with the provided name. |
| `assignedUser` | string | Yes | Only return work centers the provided user is assigned to. |
| `resourceMembers` | Array.<string> | Yes | Only return work centers that are parent to one of the provided resource names. |
