# SfcExecutionAction

`sap.dm.dme.pod2.action.sfc.SfcExecutionAction`

Base class for StartAction, SignoffAction, and CompleteAction.

**Extends:** [sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)

## Constructor

```
new SfcExecutionAction ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `processLot` | string | Yes | The process lot identifier (when action is process-lot based) |
| `sfcs` | Array.<string> | Yes | The list of SFC identifiers |

## Members

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

### _getRequest () → {sap.dm.dme.pod2.api.execution.SfcExecutionRequest}

Get the base request object for SFC execution APIs.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.api.execution.SfcExecutionRequest - [sap.dm.dme.pod2.api.execution.SfcExecutionRequest](sap.dm.dme.pod2.api.execution.md#.SfcExecutionRequest)

### _refreshWorkList) (oOptionsopt)

Refreshes the work list after a successful start, signoff, or complete request.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `processLot` | string | Yes | The process lot identifier (when action is process-lot based) |
| `sfcs` | Array.<string> | Yes | The list of SFC identifiers |

### (abstract) (abstract) execute (oActionContext) → {void|Promise.<void>}

To be implemented by the sub-classes to execute the logic for the action. This method can either be
synchronous or asynchronous.

Synchronous actions may have the following outcomes:

The function runs to completion or returns without throwing an error, indicating successful execution.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | Contains the context for the action including the widget it was triggered from and the SAPUI5 event object. |

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

Gets the properties (if any) of the action. The properties are used to configure the action in the POD
Designer.

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

### SfcFilter (oItem) → {boolean}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oItem` | sap.dm.dme.pod2.context.type.WorkListItem | No | The work list item to filter. |

**Returns:** boolean - boolean
