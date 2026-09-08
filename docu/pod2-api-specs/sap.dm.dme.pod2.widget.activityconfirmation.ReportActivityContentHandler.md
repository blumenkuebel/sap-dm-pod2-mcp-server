# ReportActivityContentHandler

`sap.dm.dme.pod2.widget.activityconfirmation.ReportActivityContentHandler`

## Constructor

```
new ReportActivityContentHandler ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.DatePicker$ChangeEvent | No | The change event object |

## Members

### _aCustomFieldJson :Array.<Object>

### _oConfirmButton :sap.m.Button

### _oDialog :sap.m.Dialog

### _oModel :sap.ui.model.json.JSONModel

### oForm :sap.ui.layout.form.SimpleForm

### sSpanConstant :string

## Methods

### _getConfirmationRequest () → {sap.dm.dme.pod2.api.internal.activityconfirmation.ConfirmActivityRequest}

Builds the request object for activity confirmation.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.internal.activityconfirmation.ConfirmActivityRequest - [sap.dm.dme.pod2.api.internal.activityconfirmation.ConfirmActivityRequest](sap.dm.dme.pod2.api.internal.activityconfirmation.md#.ConfirmActivityRequest)

### _onChangePostingDate (oEvent)

Handles posting date change events

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.DatePicker$ChangeEvent | No | The change event object |

### _onChangeUom (oEvent)

Handles UOM selection change events

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Select$ChangeEvent | No | The change event object |

### (async) _onConfirmButtonPress ()

Called when confirm button is pressed. Handles posting logic and warnings.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### _onCustomFieldChange (oEvent)

Handles the change event for the custom field input.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.InputBase$ChangeEvent | No | The event object. |

### _onErrorPostActivityConfirmation (oError)

Handles errors during posting of activity confirmation.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oError` | Error | No | The error object. |

### _onQuantityChange (oEvent)

Handles quantity change events

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.InputBase$ChangeEvent | No | The change event object |

### _onSuccessPostActivityConfirmation ()

Handles successful posting of activity confirmation.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### _updateConfirmButtonStatus ()

Enables or disables the confirm button based on form validation and quantity input.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### _updateCustomFieldData (sCustomFieldId, sValue)

Updates the custom field JSON array with the given value for the specified custom field ID.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sCustomFieldId` | string | No | The custom field ID. |
| `sValue` | string | No | The value to set. |

### _validateCustomField (sValue) → {boolean}

Validates value to ensure it contains only valid characters.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sValue` | string | No | The value to validate. |

**Returns:** boolean - boolean

### createActivityListFormContentWithUom (oConfig, oActivitySummary, iIndex) → {Array}

Creates form content for an activity with UOM selection

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oConfig` | sap.dm.dme.pod2.widget.activityconfirmation.ActivityConfirmationConfig | No | Configuration object containing settings |
| `oActivitySummary` | sap.dm.dme.pod2.context.type.ActivityConfirmationSummary | No | Activity data object |
| `iIndex` | number | No | Index of the activity in the list |

**Returns:** Array - Array

### (async) createForm () → {Promise.<sap.ui.layout.form.SimpleForm>}

Fetches and sets the UOM map, then creates the form content for each activity summary and custom fields.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Promise.<sap.ui.layout.form.SimpleForm> - Promise.<sap.ui.layout.form.SimpleForm>

### (async) openAsDialog (oData)

Opens the content as a dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oData` | sap.dm.dme.pod2.widget.activityconfirmation.ActivityConfirmationData | No | Data to populate the model. |

### setModelData (oData)

Sets the model values based on the provided data.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oData` | sap.dm.dme.pod2.widget.activityconfirmation.ActivityConfirmationData | No | Data to populate the model. |
