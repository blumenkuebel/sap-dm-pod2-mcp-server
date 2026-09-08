# AllPlantSfcs

`sap.dm.dme.pod2.valuehelp.AllPlantSfcs`

Data access strategy which queries for SFC information without pre-fetching the entire list.

**Implements:** [sap.dm.dme.pod2.valuehelp.$SfcValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$SfcValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpMultiInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpMultiInputDataAccess.md), [sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)

## Constructor

```
new AllPlantSfcs ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputs` | Array.<string> | No |  |

## Methods

### (async) coalesceMulti (aInputs) → {Promise.<sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.<sap.dm.dme.pod2.context.type.Sfc>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputs` | Array.<string> | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.<sap.dm.dme.pod2.context.type.Sfc>> - Promise.<[sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult](sap.dm.dme.pod2.valuehelp.$CoalesceMultiResult.md).<[sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)>>

### (async) coalesceSingle (sSfc) → {Promise.<sap.dm.dme.pod2.context.type.Sfc>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSfc` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.Sfc> - Promise.<[sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Sfc>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$SfcFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Sfc>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Sfc>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Sfc>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)>>
