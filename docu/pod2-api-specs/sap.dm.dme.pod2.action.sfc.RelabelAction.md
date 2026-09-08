# RelabelAction

`sap.dm.dme.pod2.action.sfc.RelabelAction`

Action to relabel an SFC.

**Extends:** [sap.dm.dme.pod2.action.sfc.SfcExecutionAction](sap.dm.dme.pod2.action.sfc.SfcExecutionAction.md)

## Constructor

```
new RelabelAction ()
```

## Members

### (static) DefaultPropertyValues :Object.<string, boolean>

Default values for Relabel configuration.

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### PropertyId :Enum.<string>

### constructor :TypeOf.<sap.dm.dme.pod2.action.sfc.RelabelAction>

## Methods

### _createDialog () → {sap.dm.dme.pod2.control.PodDialog}

Creates and configures the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.control.PodDialog - [sap.dm.dme.pod2.control.PodDialog](sap.dm.dme.pod2.control.PodDialog.md)

### _createDialogContent () → {sap.m.VBox}

Creates the content for the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.VBox - sap.m.VBox

### _getDialog () → {sap.m.Dialog}

Gets the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Dialog - sap.m.Dialog

### _getGenerateNamesRequest () → {sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest}

Creates the payload for the generateNames API.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest - [sap.dm.dme.pod2.api.internal.sfc.GenerateSfcNamesRequest](sap.dm.dme.pod2.api.internal.sfc.md#.GenerateSfcNamesRequest)

### _getRelabelRequest () → {sap.dm.dme.pod2.api.execution.RelabelSfcRequest|null}

Creates the payload for the relabel API.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.execution.RelabelSfcRequest|null - [sap.dm.dme.pod2.api.execution.RelabelSfcRequest](sap.dm.dme.pod2.api.execution.md#.RelabelSfcRequest) |  null

### _getRequest () → {sap.dm.dme.pod2.api.execution.SfcExecutionRequest}

Get the base request object for SFC execution APIs.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.execution.SfcExecutionRequest - [sap.dm.dme.pod2.api.execution.SfcExecutionRequest](sap.dm.dme.pod2.api.execution.md#.SfcExecutionRequest)

### _onRelabelSfcError (oRequest, oError)

Processes a failed SFC relabel.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.RelabelSfcRequest | No | The payload for the relabel API. |
| `oError` | Error | No | The error object. |

### _onRelabelSfcSuccess (oRequest)

Processes a successful SFC relabel.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.RelabelSfcRequest | No | The payload for the relabel API. |

### _refreshWorkList) (oOptionsopt)

Refreshes the work list after a successful start, signoff, or complete request.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `processLot` | string | Yes | The process lot identifier (when action is process-lot based) |
| `sfcs` | Array.<string> | Yes | The list of SFC identifiers |

### (async) _relabelSfc (oRequest)

Relabels the SFC.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.execution.RelabelSfcRequest | No | The payload for the relabel API. |

### _validateSfcName (oControl) → {boolean}

Validates the input control by checking the value against its binding type.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oControl` | sap.dm.dme.pod2.control.CustomInput | No | The control to validate. |

**Returns:** boolean - boolean

### execute (oActionContext) → {void|Promise.<void>}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | The action context. |

**Returns:** void|Promise.<void> - void |  Promise.<void>

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

### getProcessLot () → {string}

Gets the currently selected process lot from the PodContext or throws an error if it is missing.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

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

### getQuantity) (bQuantityRequiredopt) → {number|undefined}

Gets the quantity of SFCs to process from the PodContext. If the quantity is not provided, an error is thrown
if the quantity is required.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bQuantityRequired` | boolean | Yes | Whether the quantity is required. |

**Returns:** number|undefined - number |  undefined

### getResource () → {string}

Gets the currently selected resource from the PodContext or throws an error if it is missing.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### getSfcs) (fnFilteropt) → {Array.<string>}

Gets the currently selected SFC(s) from the PodContext or throws an error if they are missing.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fnFilter` | sap.dm.dme.pod2.action.sfc.SfcExecutionAction.SfcFilter | null | Yes | The filter function to apply to the selected work list items. Items that do not pass the filter are not included in the result. If the list is empty after filtering, an error is thrown. |

**Returns:** Array.<string> - Array.<string>

### getStepDetail () → {sap.dm.dme.pod2.api.execution.StepDetail}

Gets the currently selected step details (operation activity and step ID) from the PodContext based on the
currently selected operation activity, with fallback for the operation activity filter.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.execution.StepDetail - [sap.dm.dme.pod2.api.execution.StepDetail](sap.dm.dme.pod2.api.execution.md#.StepDetail)

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
