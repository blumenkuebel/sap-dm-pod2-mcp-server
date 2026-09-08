# AllPlantWorkCenters

`sap.dm.dme.pod2.valuehelp.AllPlantWorkCenters`

Data access strategy which queries for work center information without pre-fetching the entire list.

**Implements:** [sap.dm.dme.pod2.valuehelp.base.$ValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md), [sap.dm.dme.pod2.valuehelp.$WorkCenterFilterCriteria](sap.dm.dme.pod2.valuehelp.$WorkCenterFilterCriteria.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpMultiInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpMultiInputDataAccess.md), [sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)

## Constructor

```
new AllPlantWorkCenters ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputs` | Array.<string> | No |  |

## Methods

### (async) coalesceMulti (aInputs) → {Promise.<sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.<sap.dm.dme.pod2.context.type.WorkCenter>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputs` | Array.<string> | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.<sap.dm.dme.pod2.context.type.WorkCenter>> - Promise.<[sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult](sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.md).<[sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)>>

### (async) coalesceSingle (sWorkCenter) → {Promise.<sap.dm.dme.pod2.context.type.WorkCenter>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWorkCenter` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.WorkCenter> - Promise.<[sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.WorkCenter>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$WorkCenterFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.WorkCenter>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.WorkCenter>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.WorkCenter>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)>>
