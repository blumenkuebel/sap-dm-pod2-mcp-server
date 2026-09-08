# $BatchNumberValueHelpDialogSettings

`sap.dm.dme.pod2.valuehelp.$BatchNumberValueHelpDialogSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.valuehelp.BatchNumberValueHelpDialog.ConfirmHandler | Yes | An event handler for the confirm event. This event is fired when the table selection has been confirmed. |
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$BatchNumberValueHelpDialogDataAccess | Yes | The data access implementation to populate the dialog. If not provided, the default is sap.dm.dme.pod2.valuehelp.BatchNumberValueHelpDataAccess |
| `material` | string | Yes | The material to use for the default dataAccess strategy, if none is provided. |
| `plant` | string | Yes | The plant to use for the default dataAccess strategy, if none is provided. |
