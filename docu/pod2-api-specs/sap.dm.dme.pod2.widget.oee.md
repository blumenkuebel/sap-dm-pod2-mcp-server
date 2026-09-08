# oee

`sap.dm.dme.pod2.widget.oee`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No | The unique identifier of the resource hierarchy node |
| `isBottleneck` | boolean | No | Whether this resource is a bottleneck |
| `bottleneckMultiplier` | number | No | The bottleneck multiplier value |
| `nodeStatus` | "ENABLED" \| "DISABLED" | No | The status of the hierarchy resource |
| `childNodes` | Array.<sap.dm.dme.pod2.widget.oee.OeeMember> | Yes | Array of child hierarchy nodes |
| `resourceName` | string | Yes | Resource name extracted from resource (added during transformation) |
