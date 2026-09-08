# CurrentVersionBoms

`sap.dm.dme.pod2.valuehelp.CurrentVersionBoms`

Data access strategy which queries for BOM information at the current plant. Only the current version of each BOM
is fetched.

**Implements:** [sap.dm.dme.pod2.valuehelp.$BomValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$BomValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Bom](sap.dm.dme.pod2.context.type.Bom.md)

## Constructor

```
new CurrentVersionBoms ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sBom` | string | No |  |

## Methods

### (async) coalesceSingle (sBom) → {Promise.<sap.dm.dme.pod2.context.type.Bom>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sBom` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.Bom> - Promise.<[sap.dm.dme.pod2.context.type.Bom](sap.dm.dme.pod2.context.type.Bom.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Bom>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$BomFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Bom>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.Bom](sap.dm.dme.pod2.context.type.Bom.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Bom>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Bom>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Bom](sap.dm.dme.pod2.context.type.Bom.md)>>
