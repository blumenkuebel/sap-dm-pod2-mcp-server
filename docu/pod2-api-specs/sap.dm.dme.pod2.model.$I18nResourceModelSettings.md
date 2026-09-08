# $I18nResourceModelSettings

`sap.dm.dme.pod2.model.$I18nResourceModelSettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bundleName` | string | No |  |
| `processBundleAvailable` | boolean | Yes | `true` if a "pi_" prefixed bundle is available with terminology specific to process industry. |
| `industryOverride` | "DISCRETE" \| "PROCESS" | Yes | Allows overriding the plant-level terminology setting for a specific model instance. |
| `enhanceWith` | Array.<sap.base.i18n.ResourceBundle> \| Array.<Object> | Yes |  |
| `supportedLocales` | Array.<string> | Yes |  |
| `fallbackLocale` | string | Yes |  |

**See also:** [https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.resource.ResourceModel%23constructor](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.resource.ResourceModel%2523constructor)
