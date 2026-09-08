# SplitAction

`sap.dm.dme.pod2.action.sfc.SplitAction`

Action to split an SFC.

**Extends:** [sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)

## Constructor

```
new SplitAction ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | The action context. |

## Members

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

### _createDialog (oActionContext) → {sap.dm.dme.pod2.control.PodDialog}

Creates and configures the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | The action context. |

**Returns:** sap.dm.dme.pod2.control.PodDialog - [sap.dm.dme.pod2.control.PodDialog](sap.dm.dme.pod2.control.PodDialog.md)

### _createFormControl () → {sap.ui.layout.form.SimpleForm}

Creates the form control for the action.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.ui.layout.form.SimpleForm - sap.ui.layout.form.SimpleForm

### _getGenerateNamesRequest () → {sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest}

Creates the payload for the generate API (Execution v2).

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest - [sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest](sap.dm.dme.pod2.api.internal.sfc.md#.GenerateSfcNamesRequest)

### _getModel () → {sap.ui.model.json.JSONModel}

Gets the model for the action.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### _getSplitRequest () → {sap.dm.dme.pod2.api.execution.SplitSfcRequest}

Creates the payload for the split API (Execution v2 primary).

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.execution.SplitSfcRequest - [sap.dm.dme.pod2.api.execution.SplitSfcRequest](sap.dm.dme.pod2.api.execution.md#.SplitSfcRequest)

### (async) _onGenerateButtonPress ()

Handles the press event of the generate button.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### _onSfcSplitError (oRequest, oError)

Processes error during SFC split.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.SplitSfcRequest | No | The payload for the split API. |
| `oError` | Error | No | The error object from the split API. |

### _onSfcSplitSuccess (oRequest, oResponse)

Processes a successful SFC split.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.SplitSfcRequest | No | The payload for the split API. |
| `oResponse` | sap.dm.dme.pod2.api.execution.SplitSfcResponse | No | The response from the split API. |

### (async) _onSplitButtonPress ()

Handles the press event of the split button.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### (async) _splitSfc (oRequest)

Splits the SFC.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.SplitSfcRequest | No | The request for the split API. |

### _updateModelFromWorklistItem ()

Populate the model data from the last selected worklist item.

If no work list item is selected, an error will be thrown.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### execute (oActionContext) → {Promise.<void>}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | The action context. |

**Returns:** Promise.<void> - Promise.<void>

### getConfig () → {sap.dm.dme.pod2.action.ActionConfig}

Gets the action configuration object which controls the behavior of the action. The configuration object is
configured in the POD Designer.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.action.ActionConfig - [sap.dm.dme.pod2.action.ActionConfig](sap.dm.dme.pod2.action.md#.ActionConfig)

### getI18nText) (sKey, …aArgsopt) → {string}

Get the i18n translation for a given key and placeholders. This method will first check the class's
I18nResourceModel, then fall back to PodContext.getI18nText() if a match is not found.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel#getText](sap.dm.dme.pod2.model.I18nResourceModel.md#getText)

### getId () → {string}

Gets the unique identifier for the action.

**Returns:** string - string

### getPodRuntime () → {sap.dm.dme.pod2.runtime.PodRuntime}

Gets the POD runtime object. The POD runtime object provides access to the POD's runtime environment
including which pages, dialogs, widgets, and actions are currently active.

**Returns:** sap.dm.dme.pod2.runtime.PodRuntime - [sap.dm.dme.pod2.runtime.PodRuntime](sap.dm.dme.pod2.runtime.PodRuntime.md)

### getProperties () → {Array.<sap.dm.dme.pod2.action.metadata.ActionProperty>}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.dm.dme.pod2.action.metadata.ActionProperty> - Array.<[sap.dm.dme.pod2.action.metadata.ActionProperty](sap.dm.dme.pod2.action.metadata.ActionProperty.md)>

### getPropertyValue (sPropertyId) → {any}

Gets a configuration property value.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPropertyId` | string | No | The ID of the property. |

**Returns:** any - any

### onExit? () → {void|Promise.<void>}

If declared, this function is called after all actions in a sequence have been executed.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** void|Promise.<void> - void |  Promise.<void>

### onInit ()

Initializes the internal model based on the currently selected work list item.

If no work list item is selected, an error is thrown indicating that prerequisites are not met.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### onInit? () → {void|Promise.<void>}

If declared, this function is called after all actions in a sequence have been instantiated but before the
first action is executed. Actions are initialized and awaited in order.

It is recommended to snapshot all values used by the action from the POD Context during this step, since they
may change while earlier actions in the sequence execute.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** void|Promise.<void> - void |  Promise.<void>

### setPropertyValue (sPropertyId, vValue)

Sets a configuration property value.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPropertyId` | string | No | The ID of the property. |
| `vValue` | any | No | The value to set. |

### (static) getHelpUrl () → {string}

Gets the help URL for the action.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string
