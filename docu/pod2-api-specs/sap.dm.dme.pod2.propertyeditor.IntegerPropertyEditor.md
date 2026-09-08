# IntegerPropertyEditor

`sap.dm.dme.pod2.propertyeditor.IntegerPropertyEditor`

Property editor for integer properties.

**Extends:** [sap.dm.dme.pod2.propertyeditor.StringPropertyEditor](sap.dm.dme.pod2.propertyeditor.StringPropertyEditor.md)

## Constructor

```
new IntegerPropertyEditor (oPropertyAccessor, sProperty, iDefaultopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oPropertyAccessor` | sap.dm.dme.pod2.propertyeditor.$PropertyAccessor | No | The widget, action, or other object which satisfies the $PropertyAccessor interface. |
| `sProperty` | string | No | The property name. |
| `iDefault` | number | Yes | The default value. |

## Methods

### _createLabel) (sDisplayName, sDescriptionopt) → {sap.m.Label}

Called by the Property that this editor is associated with to create its Label.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sDisplayName` | string | No | The display name of the property, to be used as the Label text. |
| `sDescription` | string | Yes | The description for the property, to be used as the Label tooltip. If omitted, the display name will be used as the tooltip. If the PropertyEditor's Control does not have its own tooltip, it will be assigned the same tooltip as the Label. |

**Returns:** sap.m.Label - sap.m.Label

### _getI18nText) (sKey, …aArgsopt) → {string}

Gets translated text.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flatted for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

### _getPropertyAccessor () → {sap.dm.dme.pod2.propertyeditor.$PropertyAccessor}

Gets the property accessor this editor is modifying.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.propertyeditor.$PropertyAccessor - [sap.dm.dme.pod2.propertyeditor.$PropertyAccessor](sap.dm.dme.pod2.propertyeditor.$PropertyAccessor.md)

### _getPropertyValue () → {any}

Internal method provided for subclasses to retrieve the property's value.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** any - any

### getLabel () → {sap.m.Label}

Gets the label for this property editor's control.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Label - sap.m.Label

### getPropertyId () → {string}

Gets the ID of the property being edited.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### setVisible (bVisible)

Sets the visibility of the property editor.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bVisible` | boolean | No | True to show the property editor, false to hide it. |
