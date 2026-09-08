# BaseValueHelpDialog

`sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog`

**Extends:** [sap.dm.dme.pod2.control.PodDialog](sap.dm.dme.pod2.control.PodDialog.md)

## Constructor

```
new BaseValueHelpDialog (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `_oBasicSearch` | sap.m.SearchField | No |  |
| `_oFilterBar` | sap.ui.comp.filterbar.FilterBar | No |  |
| `_iFilterChangeTimeout` | number | No |  |
| `_oTable` | sap.m.Table | No |  |

## Methods

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store the value help items and item count.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### CancelHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Button$PressEvent | No |  |

### ConfirmHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog$ConfirmEvent | No |  |
