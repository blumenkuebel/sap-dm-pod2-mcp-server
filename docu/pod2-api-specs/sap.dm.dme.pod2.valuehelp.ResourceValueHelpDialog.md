# ResourceValueHelpDialog

`sap.dm.dme.pod2.valuehelp.ResourceValueHelpDialog`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog.md)

## Constructor

```
new ResourceValueHelpDialog (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.$ResourceValueHelpDialogSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `Formatters` | Object.<string, function(any): string> | No | @static Formatters for each property which is not displayed as-is in the value help table. |
| `Properties` | Object.<string, sap.m.$ColumnSettings> | No | @static The properties for the dialog as well as property-specific column settings. |
| `_oStatusSubscription` | sap.dm.dme.pod2.notification.SubscriptionContext | Yes | Subscription to resource status change notifications |

## Methods

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store the value help items and item count.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### ConfirmHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.dm.dme.pod2.valuehelp.ResourceValueHelpDialog$ConfirmEvent | No |  |
