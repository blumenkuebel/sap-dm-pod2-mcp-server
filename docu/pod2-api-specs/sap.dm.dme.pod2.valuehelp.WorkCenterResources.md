# WorkCenterResources

`sap.dm.dme.pod2.valuehelp.WorkCenterResources`

Data access strategy which pre-fetches a list of resources for the specified work centers and does not expose
other resources.

**Implements:** [sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)

## Constructor

```
new WorkCenterResources (aWorkCenters)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aWorkCenters` | Array.<string> | No |  |

## Methods

### (async) coalesceSingle (sInput) → {Promise.<sap.dm.dme.pod2.context.type.Resource>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sInput` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.Resource> - Promise.<[sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Resource>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$ResourceFilterCriteria | Yes |  |
| `requestOptions` | RequestInit | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Resource>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)>, number>>

### (async) getResourceTypes () → {Promise.<Array.<sap.dm.dme.pod2.context.type.ResourceType>>}

Returns only the resource types which are possible for the restricted set of resources.

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.ResourceType>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.ResourceType](sap.dm.dme.pod2.context.type.ResourceType.md)>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Resource>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Resource>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)>>

### getWorkCenters () → {Array.<string>}

Returns the list of work centers this instance is restricted to.

**Returns:** Array.<string> - Array.<string>

### (async, static) workCenterHasResource (sWorkCenter, sResource) → {Promise.<boolean>}

Resolves to true if the given resource is a member of the given work center.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWorkCenter` | string | No |  |
| `sResource` | string | No |  |

**Returns:** Promise.<boolean> - Promise.<boolean>
