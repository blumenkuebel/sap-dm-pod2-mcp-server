# WorkCenterSingleInput

`sap.dm.dme.pod2.valuehelp.WorkCenterSingleInput`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput.md)

## Constructor

```
new WorkCenterSingleInput (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.$WorkCenterSingleInputSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.$WorkCenterSingleInputSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `_oSelection` | sap.dm.dme.pod2.context.type.WorkCenter | No | The selected object. This property should be treated as protected and only accessed/modified directly by the control. Use `getValue`, `setValue`, `getSelection`, and `setSelection` instead. |

## Methods

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store suggestion items.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### getRequired () → {boolean}

Override to infer required state from the associated label, if one exists. This accounts for scenarios where
the control is put in a mandatory FilterGroupItem, but was not instantiated with `required` set to
true.

**Returns:** boolean - boolean

### setError (sError)

Set (or clear) the error state of the control.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sError` | string | null | No | The error text to be displayed. If falsey, the error will be cleared. |

### setValue (sValue) → {sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput}

Override to clear/validate the selection when the value string is changed programmatically.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sValue` | string | No |  |

**Returns:** sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput - [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput.md)

### SelectionChangeHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.dm.dme.pod2.valuehelp.WorkCenterSingleInput$SelectionChangeEvent | No |  |
