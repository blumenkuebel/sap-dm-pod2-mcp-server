# WorkCenterMultiInput

`sap.dm.dme.pod2.valuehelp.WorkCenterMultiInput`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpMultiInput](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpMultiInput.md)

## Constructor

```
new WorkCenterMultiInput (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.$WorkCenterMultiInputSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.$WorkCenterMultiInputSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `_oSelection` | sap.dm.dme.pod2.context.type.WorkCenter | No | The selected object. This property should be treated as protected and only accessed/modified directly by the control. Use `getValue`, `setValue`, `getSelection`, and `setSelection` instead. |

## Methods

### addSelection (oSelection) → {Promise.<void>}

Adds a new selection token.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oSelection` | Object | No |  |

**Returns:** Promise.<void> - Promise.<void>

### addToken (vToken) → {Promise.<void>}

Overrides the base function to coalesce and validate a new token if necessary.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vToken` | sap.m.Token | string | No |  |

**Returns:** Promise.<void> - Promise.<void>

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store suggestion items.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### getKeys () → {Array.<string>}

Returns an array of keys for the current tokens.

**Returns:** Array.<string> - Array.<string>

### getRequired () → {boolean}

Override to infer required state from the associated label, if one exists. This accounts for scenarios where
the control is put in a mandatory FilterGroupItem, but was not instantiated with `required` set to
true.

**Returns:** boolean - boolean

### setDummyTokens (aKeys)

Set dummy tokens to the control for design-time previews with no validation.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aKeys` | Array.<string> | No |  |

### setError (sError)

Set (or clear) the error state of the control.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sError` | string | null | No | The error text to be displayed. If falsey, the error will be cleared. |

### setTokens (aTokens) → {Promise.<void>}

Overrides the base function to coalesce and validate the new tokens.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aTokens` | Array.<(sap.m.Token|string)> | No | An array of tokens or object keys. |

**Returns:** Promise.<void> - Promise.<void>

### SelectionChangeHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.dm.dme.pod2.valuehelp.WorkCenterMultiInput$SelectionChangeEvent | No |  |
