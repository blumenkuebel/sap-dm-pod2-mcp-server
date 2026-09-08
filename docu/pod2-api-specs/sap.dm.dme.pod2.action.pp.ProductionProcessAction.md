# ProductionProcessAction

`sap.dm.dme.pod2.action.pp.ProductionProcessAction`

Action to call a production process in Process Engine.

**Extends:** [sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)

## Constructor

```
new ProductionProcessAction (oActionConfig)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionConfig` | sap.dm.dme.pod2.action.ActionConfig | No |  |

## Members

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

### _getParameterValue (oParameter) → {any}

Gets the raw value of a parameter. The value can either be variable (e.g. PLANT or SFC), a constant, or an
expression that contains a mix of text and bind expressions.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oParameter` | sap.dm.dme.pod2.action.pp.ProductionProcessAction.ParameterConfig | No | The production process parameter to get the value for. |

**Returns:** any - any

### _getRequestParameters () → {Object.<string, any>}

Returns the production process parameters to be used in the request.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Object.<string, any> - Object.<string, any>

### _initializeParameters () → {Object.<string, any>}

Gets the parameters to pass to the production process.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Object.<string, any> - Object.<string, any>

### (async) execute (oActionContext) → {Promise.<void>}

Calls the Process Engine to start the configured production process.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | Contains the context for the action including the widget it was triggered from and the SAPUI5 event object. |

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

Gets the properties for the action.

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

Define an onInit method to be called before the action is executed to retrieve the parameters from the
PodContext. This cannot be done in execute method because the PodContext may have changed by the time the
action is executed.

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

Gets the URL to the help page for this action.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### Endpoint ()

Information about the endpoint to call the production process.

### ParameterConfig ()

Configuration object for the ProductionProcessAction configuration property "parameters" which stores information
about the parameters to pass to the production process.

### ProductionProcessConfig ()

Configuration object for the ProductionProcessAction configuration property "productionProcess" which stores
information about the production process to call in process engine.

### TriggerConfig ()

Configuration object for the ProductionProcessAction configuration property "trigger" which stores information
about the trigger to use to call the production process.
