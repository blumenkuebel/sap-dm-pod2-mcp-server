# DataCollectionDelegate

`sap.dm.dme.pod2.datacollection.context.data.DataCollectionDelegate`

Data delegate for modifiying `ModelPath.OperationActivities`.

This class is responsible for refreshing the operation activity list based on the selected worklist item. The
delegate will automatically subscribe to changes in the selected worklist item and the notifications topics
SFC_START, SFC_SIGNOFF, and SFC_COMPLETE.

## Constructor

```
new DataCollectionDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `request` | sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsRequest | Yes | Optional request object to use for fetching data collection groups. If not provided, a request object will be created based on the current POD Context. |
| `force` | boolean | Yes | Refresh the data even if the request information has not changed. |

## Methods

### (async, static) refreshGroups) (oOptionsopt) → {Promise.<void>}

Refreshes the data collection groups.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `request` | sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsRequest | Yes | Optional request object to use for fetching data collection groups. If not provided, a request object will be created based on the current POD Context. |
| `force` | boolean | Yes | Refresh the data even if the request information has not changed. |

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refreshLog () → {Promise.<void>}

Updates the data collection parameters based on the currently selected group.

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refreshLoggedData () → {Promise.<Array.<sap.dm.dme.pod2.context.data.DataCollectionDelegate.ParameterCollection>>}

Refreshes the logged data collections for the currently selected worklist item.

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.data.DataCollectionDelegate.ParameterCollection>> - Promise.<Array.<[sap.dm.dme.pod2.context.data.DataCollectionDelegate.ParameterCollection](sap.dm.dme.pod2.context.data.DataCollectionDelegate.md#.ParameterCollection)>>
