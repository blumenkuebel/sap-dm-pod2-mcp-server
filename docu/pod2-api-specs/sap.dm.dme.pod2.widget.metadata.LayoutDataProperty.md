# LayoutDataProperty

`sap.dm.dme.pod2.widget.metadata.LayoutDataProperty`

Class that provides metadata for each layout data property. A parent widget will define layout data properties
for its child widgets.

For example a Splitter will define layout data properties for child widgets to specify things like the size of
splitter areas.

**Extends:** [sap.dm.dme.pod2.propertyeditor.Property](sap.dm.dme.pod2.propertyeditor.Property.md)

## Constructor

```
new LayoutDataProperty ()
```

## Methods

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
