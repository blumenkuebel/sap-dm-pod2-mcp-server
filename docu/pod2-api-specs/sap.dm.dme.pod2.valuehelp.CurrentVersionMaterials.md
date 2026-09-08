# CurrentVersionMaterials

`sap.dm.dme.pod2.valuehelp.CurrentVersionMaterials`

Data access strategy which queries for material information at the current plant. Only the current version of
each Material is fetched.

**Implements:** [sap.dm.dme.pod2.valuehelp.$MaterialValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$MaterialValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)

## Constructor

```
new CurrentVersionMaterials ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMaterial` | string | No |  |

## Methods

### (async) coalesceSingle (sMaterial) → {Promise.<sap.dm.dme.pod2.context.type.Material>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMaterial` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.Material> - Promise.<[sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Material>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$MaterialFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Material>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Material>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Material>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)>>
