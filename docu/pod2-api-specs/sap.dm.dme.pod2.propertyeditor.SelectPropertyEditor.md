# SelectPropertyEditor

`sap.dm.dme.pod2.propertyeditor.SelectPropertyEditor`

A property editor represented by a Select (dropdown) control.

The most common usage is to provide an object indicating key-value pairs representing dropdown menu (Select)
items. For example, a widget property that represent different UI layouts might provide the following:

   {
       layout1: this.getI18nText("layout1"),
       layout2: this.getI18nText("layout2"),
       layout3: this.getI18nText("layout3")
   }

If the Select options are an enumeration, you may want to use
[sap.dm.dme.pod2.propertyeditor.EnumPropertyEditor](sap.dm.dme.pod2.propertyeditor.EnumPropertyEditor.md) instead.

**Extends:** [sap.dm.dme.pod2.propertyeditor.PropertyEditor](sap.dm.dme.pod2.propertyeditor.PropertyEditor.md)

## Constructor

```
new SelectPropertyEditor (oPropertyAccessor, sPropertyId, vItemsopt, sDefaultKeyopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oPropertyAccessor` | sap.dm.dme.pod2.propertyeditor.$PropertyAccessor | No | The widget, action, or other object which satisfies the $PropertyAccessor interface. |
| `sPropertyId` | string | No | The ID of the property to edit. |
| `vItems` | Object.<string, string> | Array.<string> | Yes | The items to show in the Select. If an object, the keys are used as the keys and the values as the text. If an array of strings, each element of the array is used for both the key and text.  If omitted, no Items will be created, allowing you to bind the items aggregation to a model using sap.dm.dme.pod2.propertyeditor.SelectPropertyEditor#getControl. |
| `sDefaultKey` | string | Yes | The key which should be selected by default, if not already set for the Widget. |

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

### _setPropertyValue (vValue)

Internal method provided for subclasses to set the property's value.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vValue` | any | No | The new value for the widget property. |

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
