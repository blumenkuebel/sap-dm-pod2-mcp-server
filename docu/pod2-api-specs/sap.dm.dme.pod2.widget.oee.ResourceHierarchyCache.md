# ResourceHierarchyCache

`sap.dm.dme.pod2.widget.oee.ResourceHierarchyCache`

Static cache for resource hierarchy data across widgets.

## Constructor

```
new ResourceHierarchyCache ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aMembers` | Array.<sap.dm.dme.pod2.api.internal.plant.WorkCenterMember> | No | Array of all members |

## Methods

### (static) _transformWorkCenterMembers (aMembers) → {Array.<sap.dm.dme.pod2.widget.oee.WorkCenterMember>}

Gets transformed members not in OEE hierarchy

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aMembers` | Array.<sap.dm.dme.pod2.api.internal.plant.WorkCenterMember> | No | Array of all members |

**Returns:** Array.<sap.dm.dme.pod2.widget.oee.WorkCenterMember> - Array.<[sap.dm.dme.pod2.widget.oee.WorkCenterMember](sap.dm.dme.pod2.widget.oee.md#.WorkCenterMember)>
