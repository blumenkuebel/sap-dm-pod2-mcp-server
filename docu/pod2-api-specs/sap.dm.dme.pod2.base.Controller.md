# Controller

`sap.dm.dme.pod2.base.Controller`

**Extends:** [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)

## Constructor

```
new Controller ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flatted for parity with sap.base.i18n.ResourceBundle#getText(). |

## Methods

### getConfiguration () → {object}

**Returns:** object - object

### getI18nText) (sKey, …aArgsopt) → {string}

Gets the translated text for the given key. Bundles are checked based on the return value of the
sap.dm.dme.pod2.widget.Widget#getI18nModel method, with the PodContext i18n bundle as a fallback.

To check manifest bundles instead, override this function in the controller.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flatted for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

### getWidget () → {sap.dm.dme.pod2.widget.Widget}

Allows a Controller to access properties and functions of the Widget instance to which it belongs.

The Widget instance is retrieved from the owner component's "getWidget" function, if one exists. For widgets of
type [sap.dm.dme.pod2.widget.ComponentWidget](sap.dm.dme.pod2.widget.ComponentWidget.md) this function is defined in
[sap.dm.dme.pod2.base.Component](sap.dm.dme.pod2.base.Component.md).

If there is no owner component or the owner component does not have a "getWidget" function, the view hierarchy
will traversed upward until the nearest widget is found. If no widget is found, an error is thrown.

**Returns:** sap.dm.dme.pod2.widget.Widget - [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)
