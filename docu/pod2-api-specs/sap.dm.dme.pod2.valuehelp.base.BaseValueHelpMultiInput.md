# BaseValueHelpMultiInput

`sap.dm.dme.pod2.valuehelp.base.BaseValueHelpMultiInput`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin](sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin.md)

## Constructor

```
new BaseValueHelpMultiInput (sIdopt, mSettingsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | string | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings | Yes | If not a string, the first argument will be used as mSettings instead. |
| `mSettings` | sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings | Yes |  |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `_oPendingValidations` | Map.<string, Promise.<any>> | No | A map of pending validations, where the key is the key of the object being validated. Multiple tokens may be validated in parallel, and as each promise settles it should remove itself from the map. |
| `_oPreviousSelectionChangeKeys` | Array.<string> | No | An array of keys from the previous fired selection change event, used to filter out duplicate events. |

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

### getSelections () → {Promise.<Array.<Object>>}

Returns the current selection objects. The returned promise will only resolve once the current values have been
validated.

If the promise resolves to `[]`, the selection is either invalid or empty. The value state properties
of the control can be checked to determine the reason for the invalid state.

**Returns:** Promise.<Array.<Object>> - Promise.<Array.<Object>>

**Example:**

```javascript
const aSelections = await oValueHelpInput.getSelections();if (!aSelections.length && oValueHelpInput.getValueState() === ValueState.Error) {   MessageHistory.showError(oValueHelpInput.getValueStateText());   return;}
```

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

### setSelections (aSelections) → {Promise.<void>}

Updates the tokens to match the provided array of selection objects.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSelections` | Array.<Object> | No |  |

**Returns:** Promise.<void> - Promise.<void>

### setTokens (aTokens) → {Promise.<void>}

Overrides the base function to coalesce and validate the new tokens.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aTokens` | Array.<(sap.m.Token|string)> | No | An array of tokens or object keys. |

**Returns:** Promise.<void> - Promise.<void>
