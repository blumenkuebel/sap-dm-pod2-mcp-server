# $SfcMultiInputSettings

`sap.dm.dme.pod2.valuehelp.$SfcMultiInputSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$SfcMultiInputDataAccess | Yes | The SFC data access implementation to provide suggestions and value help options. |
| `valueHelpDialogClass` | TypeOf.<sap.dm.dme.pod2.valuehelp.SfcValueHelpDialog> | Yes | The value help dialog class to be used for selecting SFCs. |
| `selectionChange` | sap.dm.dme.pod2.valuehelp.SfcMultiInput.SelectionChangeHandler | Yes | An event handler for the selection change event. This event is fired after a new selection has been validated. |
