# $StorageLocationValueHelpDialogSettings

`sap.dm.dme.pod2.valuehelp.$StorageLocationValueHelpDialogSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.valuehelp.StorageLocationValueHelpDialog.ConfirmHandler | Yes | An event handler for the confirm event. This event is fired when the table selection has been confirmed. |
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$StorageLocationValueHelpDialogDataAccess | Yes | The data access implementation to populate the dialog. If not provided, the default is sap.dm.dme.pod2.valuehelp.StorageLocationValueHelpDataAccess |
