# LanguageAction

`sap.dm.dme.pod2.action.core.LanguageAction`

Action that lets shop-floor operators change the POD UI language without leaving the POD. When triggered,
it opens a dialog listing the supported languages with a search field for filtering. Selecting one shows
a confirmation dialog warning that unsaved progress will be lost; on confirm, the page reloads so SAPUI5
picks up the new locale natively. The action owns no i18n bundle management code.

**Extends:** [sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)

## Constructor

```
new LanguageAction ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sLocale` | string | No | The locale that the operator chose. |

## Members

### (static) EnabledPropertyId :string

ID of the property that configures whether the action is enabled or disabled. The default is true.

### (static) LANGUAGES_PROPERTY :string

Property ID for the configurable language allowlist.

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

### (async, protected) _applyLanguage (sLocale) → {Promise.<void>}

Applies the new locale to the portal's personalization service (ie. user-specific settings) and refreshes
the browser tab. Language override URL parameters are removed to ensure the new setting takes effect.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sLocale` | string | No | The locale that the operator chose. |

**Returns:** Promise.<void> - Promise.<void>

### (protected) _createConfirmDialog (sLocale) → {sap.m.Dialog}

Creates the confirmation dialog shown before the page reloads.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sLocale` | string | No | The locale that the operator selected. |

**Returns:** sap.m.Dialog - sap.m.Dialog

### (protected) _createPickerDialog () → {sap.m.Dialog}

Creates the dialog that lists supported locales with a search field for filtering.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Dialog - sap.m.Dialog

### (protected) _navigate (sUrl)

Navigates the browser to the given URL.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |

### (protected) _onLanguageSelect (sLocale)

Handler for selecting a locale from the picker. If the selected locale matches the current
locale, cancels the action. Otherwise opens the confirmation dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sLocale` | string | No | The locale that the operator selected. |

### (protected) _onPickerCancel ()

Cancels the picker: aborts the action context and resolves the execute promise.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### execute (oActionContext) → {Promise.<void>}

Opens the language picker dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionContext` | sap.dm.dme.pod2.action.ActionContext | No | The action execution context. |

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

Returns the configurable properties for this action. The "languages" property is a multi-choice
allowlist of locales to show in the picker. Empty = show all supported languages.

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
