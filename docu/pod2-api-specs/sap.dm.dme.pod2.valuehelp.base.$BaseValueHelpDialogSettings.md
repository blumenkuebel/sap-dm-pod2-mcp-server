# $BaseValueHelpDialogSettings

`sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpDialogSettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `cancel` | sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog.CancelHandler | Yes | An event handler for the cancel event. This event is fired when the user exits the dialog without making a selection. |
| `confirm` | sap.dm.dme.pod2.valuehelp.base.BaseValueHelpDialog.ConfirmHandler | Yes | An event handler for the confirm event. This event is fired when the table selection has been confirmed. |
| `dataAccess` | sap.dm.dme.pod2.valuehelp.base.$ValueHelpDialogDataAccess | Yes | The data access instance for the dialog. Providing an alternate data access object allows customization of the dialog contents. |
| `initialSearch` | string | Yes | The initial value of the basic search field. |
| `initialSelections` | Array.<Object> | Yes | In multi-select mode only, the initial items which should be selected. |
| `multiSelect` | boolean | Yes | Whether the value help dialog should allow multiple selections. This may not be changed after the control has been instantiated. Default is false (single-select mode). |
| `pageSize` | number | Yes | The number of items per page to display in the value help table. Default 20 items. |
| `sortBy` | string | Yes | The object property to sort by. |
| `sortDescending` | boolean | Yes |  |
