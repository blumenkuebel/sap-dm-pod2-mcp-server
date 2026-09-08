# WidgetProperty

`sap.dm.dme.pod2.widget.metadata.WidgetProperty`

**Extends:** [sap.dm.dme.pod2.propertyeditor.Property](sap.dm.dme.pod2.propertyeditor.Property.md)

## Constructor

```
new WidgetProperty (mSettings)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `mSettings` | sap.dm.dme.pod2.propertyeditor.$WidgetPropertySettings | No | The settings for the property. |

## Methods

### getCategory () → {string}

**Returns:** string - string

### getDescription () → {string}

Gets the description of the property. This is displayed as a tooltip in the POD Designer property editor.

**Returns:** string - string

### getDisplayName () → {string}

Gets the display name of the property.

**Returns:** string - string

### getId () → {string}

Gets the ID of the property.

**Returns:** string - string

### getPropertyEditor () → {sap.dm.dme.pod2.propertyeditor.PropertyEditor}

Gets the PropertyEditor responsible for editing this property.

**Returns:** sap.dm.dme.pod2.propertyeditor.PropertyEditor - [sap.dm.dme.pod2.propertyeditor.PropertyEditor](sap.dm.dme.pod2.propertyeditor.PropertyEditor.md)
