# $PropertySettings

`sap.dm.dme.pod2.propertyeditor.$PropertySettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `displayName` | string | Yes | The localized label text. This is typically mandatory, however some PropertyEditor types may override it. |
| `description` | string | Yes | A localized tooltip explaining the property. If omitted, the displayName will also be used as the description. Some PropertyEditor types may override this value. |
| `propertyEditor` | sap.dm.dme.pod2.propertyeditor.PropertyEditor | No | The PropertyEditor responsible for providing this property's control and configuration value. |
