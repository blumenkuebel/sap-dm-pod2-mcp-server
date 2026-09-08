# $ResourceSingleInputSettings

`sap.dm.dme.pod2.valuehelp.$ResourceSingleInputSettings`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings](sap.dm.dme.pod2.valuehelp.base.$BaseValueHelpSingleInputSettings.md)

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `dataAccess` | sap.dm.dme.pod2.valuehelp.$ResourceSingleInputDataAccess | Yes | The resource data access implementation to provide suggestions and value help options. If a data access instance is provided, `restrictToWorkCenters` will have no effect. If not provided the default behavior will be based on the value of `restrictToWorkCenters`. |
| `selectionChange` | sap.dm.dme.pod2.valuehelp.ResourceSingleInput.SelectionChangeHandler | Yes | An event handler for the selection change event. This event is fired after a new selection has been validated. |
| `restrictToWorkCenters` | sap.dm.dme.pod2.context.type.WorkCenter \| Array.<(sap.dm.dme.pod2.context.type.WorkCenter \| string)> \| sap.ui.base.ManagedObject.PropertyBindingInfo \| string | Yes | A work center object, work center name, Array of work centers/names, or a model binding that resolves to one of the accepted types. The resolved value will be implicitly tranformed to an array of work center names.  Resources will only be exposed if they are a member of the indicated work center(s). If not provided, all resources for the current plant will be available for selection.  If the value (or binding) changes, the current selection will be validated against the new restrictions.  This setting has no effect if `dataAccess` is specified explicitly. |
