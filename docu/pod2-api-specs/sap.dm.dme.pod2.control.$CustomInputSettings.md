# $CustomInputSettings

`sap.dm.dme.pod2.control.$CustomInputSettings`

**Extends:** [sap.dm.dme.pod2.control.$CustomInputBaseSettings](sap.dm.dme.pod2.control.$CustomInputBaseSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `forceUpperCase` | boolean | Yes | Whether to force the input value to uppercase. This affects the visual representation of the input value and the value returned by the `getValue` method, however the internal string remains unchanged and mixed/lower-case values may still be propagated to model bindings. Default `false`. |
| `height` | string | Yes | The height of the input field, e.g. "2rem", "50px". If not set, the default height will be used. |
