# Action

`sap.dm.dme.pod2.action.Action`

An action is a reusable piece of logic that can be triggered by a widget as a result of some user interaction
(an event) such as a button click. Actions can be used to perform a wide variety of tasks such as updating the
UI, making API calls, or navigating to a different page. Actions are configured in the POD Designer on a widget
event.

Actions can be synchronous or asynchronous.

If an action is synchronous, the execute method should return void or some value.
If an action is asynchronous, it should return a Promise from its execute method.

Subclasses of Action:

Must implement the execute instance method.
Must implement the getDisplayName static method.
Should implement the getDescription static method.
Can implement an onInit instance method to perform any initialization logic.
Can implement an onExit instance method to perform any cleanup logic.
Can implement the getI18nModel static method if it has its own i18n properties file.
Can implement the getHelpUrl static method to provide a link to help documentation in the POD Designer.
Can implement the getProperties instance method to define configurable properties for the action.

**Extends:** [sap.dm.dme.pod2.PodObject](sap.dm.dme.pod2.PodObject.md)

**Implements:** [sap.dm.dme.pod2.propertyeditor.$PropertyAccessor](sap.dm.dme.pod2.propertyeditor.$PropertyAccessor.md)

## Constructor

```
new Action (oActionConfig)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionConfig` | sap.dm.dme.pod2.action.ActionConfig | No | The action configuration. |

## Members

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

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

### (static) getWidgetReferenceProperties () → {string|Array.<string>|undefined}

Gets a list of action property names where the value is a reference to a widget ID. When the referenced
widget's ID is changed then any actions referencing that widget will also be automatically changed.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string|Array.<string>|undefined - string |  Array.<string> |  undefined
