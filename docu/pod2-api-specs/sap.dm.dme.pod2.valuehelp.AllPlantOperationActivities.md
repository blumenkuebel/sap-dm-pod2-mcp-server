# AllPlantOperationActivities

`sap.dm.dme.pod2.valuehelp.AllPlantOperationActivities`

Data access strategy which queries for operation activity information without pre-fetching the entire list. Only
the current version of each operation activity is fetched.

**Implements:** [sap.dm.dme.pod2.valuehelp.$OperationActivityValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$OperationActivityValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)

## Constructor

```
new AllPlantOperationActivities ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sOperationActivity` | string | No |  |

## Methods

### (async) coalesceSingle (sOperationActivity) → {Promise.<sap.dm.dme.pod2.context.type.OperationActivityMaster>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sOperationActivity` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.OperationActivityMaster> - Promise.<[sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$OperationActivityFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)>>
