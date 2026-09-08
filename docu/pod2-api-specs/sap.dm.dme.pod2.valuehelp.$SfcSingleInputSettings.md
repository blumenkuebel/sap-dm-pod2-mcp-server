# $SfcSingleInputSettings

`sap.dm.dme.pod2.valuehelp.$SfcSingleInputSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$SfcSingleInputDataAccess | Yes | The SFC data access implementation to provide suggestions and value help options. |
| `valueHelpDialogClass` | TypeOf.<sap.dm.dme.pod2.valuehelp.SfcValueHelpDialog> | Yes | The value help dialog class to be used for selecting SFCs. |
| `selectionChange` | sap.dm.dme.pod2.valuehelp.SfcSingleInput.SelectionChangeHandler | Yes | An event handler for the selection change event. This event is fired after a new selection has been validated. |
