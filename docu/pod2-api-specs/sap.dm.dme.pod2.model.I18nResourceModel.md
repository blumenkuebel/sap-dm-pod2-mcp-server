# I18nResourceModel

`sap.dm.dme.pod2.model.I18nResourceModel`

A custom ResourceModel that enforces asynchronous loading while still allowing synchronous access to the
translated strings. This class should be used in place of ResourceModel by all Widgets and Actions, as well as
the POD Context.

Calls to `I18nResourceModel.getText()` will log a warning if the bundle has not yet been loaded to
indicate potential race conditions. In the case of widgets with custom translations, the framework will await
the loading of the bundle before rendering the widget. In cases where a race condition may be present,
`await oI18nResourceModel.getResourceBundle()` can be used to ensure the bundle has been loaded before
calling `getText()`.

## Constructor

```
new I18nResourceModel (vSettings)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vSettings` | string | sap.dm.dme.pod2.model.$I18nResourceModelSettings | No | The settings object for the model, or a string to be used as the bundleName in an otherwise-default `oData` object. The `async` property will be ignored and is forcibly set to `true`. |

## Members

### _oResourceBundle :sap.base.i18n.ResourceBundle

The underlying resource bundle as managed by the parent class.

### _oResourceBundle :sap.dm.dme.pod2.model.ResourceBundleInternal

## Methods

### (async) enhanceForProcessIndustry (sBundleName) → {Promise.<void>}

Enhances the model with industry-specific overrides. If `/plant/industryType` is not "PROCESS",
nothing will be done. It is assumed that the default translations for the I18nResourceModel provide
terminology for discrete industries, while terminology specific to process industries is applied as an
enhancement.

If plant information has not been loaded yet, overrides will be applied once the necessary information is
available.

It is important to note that model enhancement replaces the underlying ResourceBundle rather than modifying
it in-place, so any existing references to the bundle object will become stale.
`I18nResourceModel.getText()` can be used instead of `oResourceBundle.getText()` to
ensure the current bundle is always used.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sBundleName` | string | No | The name of the bundle to use for the overrides. By convention this is usually the same as the bundle name used to create the resource model, but with a "pi_" prefix, though this is not a requirement. |

**Returns:** Promise.<void> - Promise.<void>

### getText) (sKey, …aArgsopt) → {string}

An equivalent to `ResourceBundle.getText()` for direct, synchronous access to the
I18nResourceModel's translation strings.

Modifications to the model (such as applying industry-specific enhancements) may replace the underlying
ResourceBundle rather that modifying it in-place, causing references to the bundle to become stale. This
function allows synchronous access to the current underlying bundle while maintaining parity with the
placeholder substitution provided by `ResourceBundle.getText()`.

If the model is accessed before the underlying ResourceBundle has loaded, the untranslated key will be
returned and a warning will be logged to indicate a potential race condition.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with `sap.base.i18n.ResourceBundle#getText()`. |

**Returns:** string - string

**See also:** [https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.resource.ResourceModel%23constructor](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.resource.ResourceModel%2523constructor)
