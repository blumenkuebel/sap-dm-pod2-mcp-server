# WidgetRegistry

`sap.dm.dme.pod2.widget.WidgetRegistry`

## Constructor

```
new WidgetRegistry ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | No | The widget class to retrieve the description for. |

## Methods

### (static) getDescription (oWidgetClass) → {string}

Gets the description of a widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | No | The widget class to retrieve the description for. |

**Returns:** string - string

### (static) getDisplayName (oWidgetClass) → {string}

Gets the display name of a widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | No | The widget class to retrieve the display name for. |

**Returns:** string - string

### (static) getDisplayNameByType (sWidgetType) → {string}

Gets the display name of a widget by its type.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWidgetType` | string | No | The widget type. |

**Returns:** string - string

### (static) getType (oWidgetClass) → {string|null}

Gets the type of a Widget class.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | sap.dm.dme.pod2.widget.Widget | No |  |

**Returns:** string|null - string |  null

### (static) getWidget (sWidgetType) → {TypeOf.<sap.dm.dme.pod2.widget.Widget>|null}

Gets a Widget class by type.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWidgetType` | string | No | The type of the widget. |

**Returns:** TypeOf.<sap.dm.dme.pod2.widget.Widget>|null - TypeOf.<[sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)> |  null

### (static) getWidgets () → {Object.<string, TypeOf.<sap.dm.dme.pod2.widget.Widget>>}

Gets a list of all registered Widget classes.

**Returns:** Object.<string, TypeOf.<sap.dm.dme.pod2.widget.Widget>> - Object.<string, TypeOf.<[sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)>>

### (static) isCore (oWidgetClass) → {boolean}

Checks if the given widget is a core widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | sap.dm.dme.pod2.widget.Widget | No |  |

**Returns:** boolean - boolean

### (static) isCustom (oWidgetClass) → {boolean}

Checks if the given widget is a custom widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetClass` | TypeOf.<sap.dm.dme.pod2.widget.Widget> | sap.dm.dme.pod2.widget.Widget | No |  |

**Returns:** boolean - boolean
