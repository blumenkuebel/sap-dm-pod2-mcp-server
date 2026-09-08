# $BaseValueHelpInputMixinSettings

`sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpInputMixinSettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `forceUpperCase` | boolean | Yes | Whether to force the input value to uppercase. Different control types may handle this differently and may still track internal values in lower or mixed case. Default `true`. |
| `selectionChange` | sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin.SelectionChangeHandler | Yes | An event handler for the selection change event. This event is fired after a new selection has been validated. |
| `valueHelpPageSize` | number | Yes | The number of items per page to display in the value help dialog. Default 20 items. |
