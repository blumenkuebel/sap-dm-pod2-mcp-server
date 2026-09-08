# $WorkCenterMultiInputSettings

`sap.dm.dme.pod2.valuehelp.$WorkCenterMultiInputSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpMultiInputSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$WorkCenterSingleInputDataAccess | Yes | The work center data access implementation to provide suggestions and value help options. If a data access instance is provided, `enforceUserAssignment` will have no effect. If not provided the default behavior will be based on the value of `enforceUserAssignment`. |
| `selectionChange` | sap.dm.dme.pod2.valuehelp.WorkCenterMultiInput.SelectionChangeHandler | Yes | An event handler for the selection change event. This event is fired after a new selection has been validated. |
| `enforceUserAssignment` | boolean | Yes | Whether to validate the user's assignment to the work center. Default `false`.  This setting has no effect if `dataAccess` is provided. |
