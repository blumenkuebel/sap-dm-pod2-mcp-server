# CurrentVersionRoutings

`sap.dm.dme.pod2.valuehelp.CurrentVersionRoutings`

Data access strategy which queries for routing information at the current plant. Only the current version of
each routing is fetched.

**Implements:** [sap.dm.dme.pod2.valuehelp.$RoutingValueHelpDialogDataAccess](sap.dm.dme.pod2.valuehelp.$RoutingValueHelpDialogDataAccess.md), [sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess](sap.dm.dme.pod2.valuehelp.base.$ValueHelpSingleInputDataAccess.md), [sap.dm.dme.pod2.context.type.Routing](sap.dm.dme.pod2.context.type.Routing.md)

## Constructor

```
new CurrentVersionRoutings ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sRouting` | string | No |  |

## Methods

### (async) coalesceSingle (sRouting) → {Promise.<sap.dm.dme.pod2.context.type.Routing>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sRouting` | string | No |  |

**Returns:** Promise.<sap.dm.dme.pod2.context.type.Routing> - Promise.<[sap.dm.dme.pod2.context.type.Routing](sap.dm.dme.pod2.context.type.Routing.md)>

### (async) getPage (oOptions) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Routing>, number>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `top` | number | No |  |
| `skip` | number | No |  |
| `orderBy` | string | Yes |  |
| `sortDescending` | boolean | Yes |  |
| `criteria` | sap.dm.dme.pod2.valuehelp.$RoutingFilterCriteria | Yes |  |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.context.type.Routing>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.context.type.Routing](sap.dm.dme.pod2.context.type.Routing.md)>, number>>

### (async) getSuggestions (sSearch) → {Promise.<Array.<sap.dm.dme.pod2.context.type.Routing>>}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSearch` | string | No |  |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.Routing>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.Routing](sap.dm.dme.pod2.context.type.Routing.md)>>
