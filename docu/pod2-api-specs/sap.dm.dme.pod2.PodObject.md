# PodObject

`sap.dm.dme.pod2.PodObject`

Base class for first-class object types within the POD Framework. Types that inherit this class can provide
their own localized text and are available in the POD Designer.

This base class is primarily responsible for shared functionality of Widgets and Actions.

**Extends:** [sap.dm.dme.pod2.PodObject](sap.dm.dme.pod2.PodObject.md)

## Constructor

```
new PodObject ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with sap.base.i18n.ResourceBundle#getText(). |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.PodObject>

## Methods

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

### (static) getDescription () → {string}

Gets a description of the object type. The description is shown as a tooltip or subtitle in the POD Designer.

The returned value should be a localized string.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### (abstract) (abstract, static) getDisplayName () → {string}

Gets the display name to show in the POD Designer.

The returned value should be a localized string.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### (static) getHelpUrl () → {string|null}

Called by the framework to get a link to the help page for the object type. If a URL is returned, an icon
will be added linking to the relevant documentation.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string|null - string |  null

### (static) getI18nModel () → {sap.dm.dme.pod2.model.I18nResourceModel|null}

Optionally override this function to provide type-specific localized texts. Calls to
`this.getI18nText` will check the returned model before falling back to the top-level PodContext
resource model.

Resource models should use the `sap.dm.dme.pod2.model.I18nResourceModel` class. It is
recommended to instantiate the model as a static property on your subclass so it is created immediately
when the class is first loaded.

Alternatively, the sap.dm.dme.pod2.PodObject#getI18nBundleName function offers a less verbose
but also less flexible way to provide custom translations.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.model.I18nResourceModel|null - [sap.dm.dme.pod2.model.I18nResourceModel](sap.dm.dme.pod2.model.I18nResourceModel.md) |  null

**Example:**

```javascript
class MyWidget extends Widget {   static #oI18nModel = new I18nResourceModel("sap.dm.dme.pod2.myWidgets.i18n.i18n");   static getI18nModel() {       return this.#oI18nModel;   }   // Other methods...}
```

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel](sap.dm.dme.pod2.model.I18nResourceModel.md)

### (static) getI18nModelSettings () → {string|sap.dm.dme.pod2.model.$I18nResourceModelSettings}

An optional shorthand method for providing localized texts. This function returns either a resource bundle
name, or an object that fulfils [sap.dm.dme.pod2.model.$I18nResourceModelSettings](sap.dm.dme.pod2.model.$I18nResourceModelSettings.md).

If `getI18nModel` is implemented by the subclass then overriding this function will have no
effect.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string|sap.dm.dme.pod2.model.$I18nResourceModelSettings - string |  [sap.dm.dme.pod2.model.$I18nResourceModelSettings](sap.dm.dme.pod2.model.$I18nResourceModelSettings.md)

**Example:**

```javascript
// To use a single bundle with no industry-specific overrides.static getI18nModelSettings() {   return "sap.dm.dme.pod2.myWidgets.i18n.i18n";}// Alternate return type, indicating a second bundle is available for process industry terminology// with the inferred bundle name "sap.dm.dme.pod2.myWidgets.i18n.pi_i18n".static getI18nModelSettings() {   return {       bundleName: "sap.dm.dme.pod2.myWidgets.i18n.i18n",       processBundleAvailable: true   };}
```

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel](sap.dm.dme.pod2.model.I18nResourceModel.md)

### (static) getI18nText) (sKey, …aArgsopt) → {string}

Get the i18n translation for a given key and placeholders.

This method will first check the class's I18nResourceModel, then fall back to PodContext.getI18nText() if a
match is not found.

If the class's I18nResourceModel has not loaded yet, a warning will be logged indicating the potential race
condition. If you need a localized string before the constructor is invoked, you should either:

Use a model binding instead of getting the text programmatically.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel#getText](sap.dm.dme.pod2.model.I18nResourceModel.md#getText)
