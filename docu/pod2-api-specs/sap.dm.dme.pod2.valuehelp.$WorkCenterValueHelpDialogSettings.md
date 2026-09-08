# $WorkCenterValueHelpDialogSettings

`sap.dm.dme.pod2.valuehelp.$WorkCenterValueHelpDialogSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.valuehelp.WorkCenterValueHelpDialog.ConfirmHandler | Yes | An event handler for the confirm event. This event is fired when the table selection has been confirmed. |
| `initialSelections` | Array.<sap.dm.dme.pod2.context.type.WorkCenter> | Yes | In multi-select mode only, the initial work centers which should be selected. |
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$WorkCenterValueHelpDialogDataAccess | Yes | The work center data access implementation to populate the dialog. This property should not be changed after the dialog is instantiated. If not provided, the default behavior is [sap.dm.dme.pod2.valuehelp.AllPlantWorkCenters](sap.dm.dme.pod2.valuehelp.AllPlantWorkCenters.md). |
