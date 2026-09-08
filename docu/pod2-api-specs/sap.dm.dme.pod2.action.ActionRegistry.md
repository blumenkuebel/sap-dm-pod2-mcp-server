# ActionRegistry

`sap.dm.dme.pod2.action.ActionRegistry`

Contains the list of all registered actions. During runtime, only the actions that are used in the current POD
config will be loaded and registered based on their "actionType" property. During design-time all actions will be
loaded.

## Constructor

```
new ActionRegistry ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sActionType` | string | No | The type of the action to retrieve. |

## Methods

### (static) getAction (sActionType) → {TypeOf.<sap.dm.dme.pod2.action.Action>|null}

Retrieves an action class from the registry.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sActionType` | string | No | The type of the action to retrieve. |

**Returns:** TypeOf.<sap.dm.dme.pod2.action.Action>|null - TypeOf.<[sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)> |  null

### (static) getActionType (oActionClass) → {string|null}

Retrieves the action type for a given action class.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionClass` | TypeOf.<sap.dm.dme.pod2.action.Action> | No | The action class to retrieve the type for. |

**Returns:** string|null - string |  null

### (static) getActions () → {Object.<string, TypeOf.<sap.dm.dme.pod2.action.Action>>}

Gets all registered actions.

**Returns:** Object.<string, TypeOf.<sap.dm.dme.pod2.action.Action>> - Object.<string, TypeOf.<[sap.dm.dme.pod2.action.Action](sap.dm.dme.pod2.action.Action.md)>>

### (static) getDescription (oActionClass) → {string}

Gets the description for a given action class.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionClass` | TypeOf.<sap.dm.dme.pod2.action.Action> | No |  |

**Returns:** string - string

### (static) getDisplayName (oActionClass) → {string}

Gets the display name for a given action class.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionClass` | TypeOf.<sap.dm.dme.pod2.action.Action> | No |  |

**Returns:** string - string

### (static) isCore (oActionClass) → {boolean}

Checks if the given action is a core built-in action.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionClass` | TypeOf.<sap.dm.dme.pod2.action.Action> | No |  |

**Returns:** boolean - boolean

### (static) isCustom (oActionClass) → {boolean}

Checks if the given action is a custom action.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionClass` | TypeOf.<sap.dm.dme.pod2.action.Action> | No |  |

**Returns:** boolean - boolean
