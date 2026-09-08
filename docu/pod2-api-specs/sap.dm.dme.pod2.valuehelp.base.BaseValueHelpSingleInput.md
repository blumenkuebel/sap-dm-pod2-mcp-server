# BaseValueHelpSingleInput

`sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin.md)

## Constructor

```
new BaseValueHelpSingleInput (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `_sValidationInput` | string | No | The input string that was most recently validated (whether it was valid or not). |
| `_oSelection` | Object | No | The selected object. This property should be treated as protected and only accessed/modified directly by the control. Use `getValue`, `setValue`, `getSelection`, and `setSelection` for external access. |
| `_oValidationPromise` | Promise.<boolean> | No | The most recent (or pending) validation promise. |

## Methods

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store suggestion items.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### getRequired () → {boolean}

Override to infer required state from the associated label, if one exists. This accounts for scenarios where
the control is put in a mandatory FilterGroupItem, but was not instantiated with `required` set to
true.

**Returns:** boolean - boolean

### getSelection () → {Promise.<(Object|null)>}

Returns the current selection object. The returned promise will only resolve once the current value has been
validated.

If the promise resolves to `null`, the value is either invalid or empty. The value state properties
of the control can be checked to determine the reason for the invalid state.

**Returns:** Promise.<(Object|null)> - Promise.<(Object|null)>

**Example:**

```javascript
const oSelection = await oValueHelpInput.getSelection();if (!oSelection && oValueHelpInput.getValueState() === ValueState.Error) {   MessageHistory.showError(oValueHelpInput.getValueStateText());   return;}
```

### setError (sError)

Set (or clear) the error state of the control.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sError` | string | null | No | The error text to be displayed. If falsey, the error will be cleared. |

### setSelection (oSelection) → {Promise.<void>}

Sets the current selection object and updates the input value to match. If the new selection does not match the
current `_sValidationInput`, it may need to be re-validated depending on subclass conditions.

If additional validation beyond coalescing the full object is required, the subclass should override the
`_validateSelection` function.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oSelection` | Object | null | No | The new selection object, or `null` to clear the current selection. |

**Returns:** Promise.<void> - Promise.<void>

### setValue (sValue) → {sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput}

Override to clear/validate the selection when the value string is changed programmatically.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sValue` | string | No |  |

**Returns:** sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput - [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpSingleInput.md)
