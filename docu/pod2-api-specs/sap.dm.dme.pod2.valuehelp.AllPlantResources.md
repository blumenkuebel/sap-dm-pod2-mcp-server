# AllPlantResources

`sap.dm.dme.pod2.valuehelp.AllPlantResources`

Data access strategy which queries for resource information without pre-fetching the entire list.

**Implements:** [sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)

## Constructor

```
new AllPlantResources ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sResource` | string | No |  |

## Methods

### (async) coalesceSingle (sResource) → {Promise.<sap.dm.dme.pod2.context.type.Resource>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sResource` | string | No |  |

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

### getResourceTypes () → {Promise.<Array.<sap.dm.dme.pod2.context.type.ResourceType>>}

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.ResourceType>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.ResourceType](sap.dm.dme.pod2.context.type.ResourceType.md)>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Resource>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Resource>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)>>
