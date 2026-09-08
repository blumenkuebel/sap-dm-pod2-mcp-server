# $OperationActivityValueHelpDialogSettings

`sap.dm.dme.pod2.valuehelp.$OperationActivityValueHelpDialogSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.valuehelp.OperationActivityValueHelpDialog.ConfirmHandler | Yes | An event handler for the confirm event. This event is fired when the table selection has been confirmed. |
| `initialSelections` | Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster> | Yes | In multi-select mode only, the initial operation activities which should be selected. |
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$OperationActivityValueHelpDialogDataAccess | Yes | The operation activity data access implementation to populate the dialog. This property should not be changed after the dialog is instantiated. If not provided, the default behavior is sap.dm.dme.pod2.valuehelp.AllPlantOperationActivitys. |
