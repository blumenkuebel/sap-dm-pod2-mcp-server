# OperationActivityDelegate

`sap.dm.dme.pod2.context.data.OperationActivityDelegate`

Data delegate for modifiying `ModelPath.OperationActivities`.

This class is responsible for refreshing the operation activity/phase list based on the selected worklist item.
The delegate will automatically subscribe to changes in the selected worklist item and the notifications topics
SFC_START, SFC_SIGNOFF, SFC_COMPLETE, OPERATION_START, and OPERATION_COMPLETE.

## Constructor

```
new OperationActivityDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `force` | boolean | Yes | Use true to force a refresh even if the last refresh was recent. If not provided then defaults to false. |

## Methods

### (async, static) refresh) (oOptionsopt) → {Promise.<void>}

Refreshes the operation activity list based on the selected worklist item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `force` | boolean | Yes | Use true to force a refresh even if the last refresh was recent. If not provided then defaults to false. |

**Returns:** Promise.<void> - Promise.<void>

### (static) selectNextOperationActivity ()

Selects the next operation activity that isn't completed from the current list.
