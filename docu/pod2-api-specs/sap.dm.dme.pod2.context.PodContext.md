# PodContext

`sap.dm.dme.pod2.context.PodContext`

The PodContext class represents the shared application state. While many widgets will contain their own internal
models and data, the PodContext facilitates shared data and communication between separate widgets, actions, and
other modules.

This class contains:

An authoritative model for shared application state
Getter and setter functions for core properties of this model (based on the `ModelPath` enumeration)
Functions for subscribing to changes to model properties and events
Functions to fetch and refresh core entities such as the work list

See the [sap.dm.dme.pod2.context.ModelPath](sap.dm.dme.pod2.context.md#.ModelPath) enumeration for a list of core model paths. The values for the
core model paths can be accessed via `PodContext.get` or the associated getter function, however they
may only be modified via the associated setter function. Not all core properties have public setter functions.

Custom values may be set with `PodContext.set`, and should always be given sufficiently unique keys.

## Constructor

```
new PodContext ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oControl` | sap.ui.core.Control | No | The control to call "setModel" on. |

## Methods

### (static) applyCoreModelsTo (oControl)

Applies all core/top-level models to the given control.

The following models will be set:

default - The main POD Context model. This model Will not be set if the control already has a
default (unnamed) model.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oControl` | sap.ui.core.Control | No | The control to call "setModel" on. |

### (static) clearWorkList ()

Resets the work list to an empty state.

### (static) get (sModelPath) → {any}

Gets the current value from the Pod Context Model for the given Model Path.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sModelPath` | string | No | The Model Path to get the value for. |

**Returns:** any - any

### (static) getActivityConfirmationSummaryList () → {Array.<sap.dm.dme.pod2.context.type.ActivityConfirmationSummary>|undefined}

Gets the activity confirmation summary list.

**Returns:** Array.<sap.dm.dme.pod2.context.type.ActivityConfirmationSummary>|undefined - Array.<[sap.dm.dme.pod2.context.type.ActivityConfirmationSummary](sap.dm.dme.pod2.context.type.ActivityConfirmationSummary.md)> |  undefined

### (static) getExecutionSFCQuantity () → {number|undefined}

Gets the quantity to be processed when starting/completing an SFC.

**Returns:** number|undefined - number |  undefined

### (static) getFieldCombinations () → {Array|undefined}

Gets the field combinations for quality inspection.

**Returns:** Array|undefined - Array |  undefined

### (static) getFilterInputType () → {sap.dm.dme.pod2.enumeration.WorkListFilterInputType|undefined}

Gets the input type (SFC or Process Lot) for the work list filter.

**Returns:** sap.dm.dme.pod2.enumeration.WorkListFilterInputType|undefined - [sap.dm.dme.pod2.enumeration.WorkListFilterInputType](sap.dm.dme.pod2.enumeration.md#.WorkListFilterInputType) |  undefined

### (static) getFilterMaterials () → {Array.<sap.dm.dme.pod2.context.type.Material>|undefined}

Gets the selected materials.

**Returns:** Array.<sap.dm.dme.pod2.context.type.Material>|undefined - Array.<[sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)> |  undefined

### (static) getFilterOperationActivities () → {Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>|undefined}

Gets the selected operation activities.

**Returns:** Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster>|undefined - Array.<[sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)> |  undefined

### (static) getFilterResources () → {Array.<sap.dm.dme.pod2.context.type.Resource>|undefined}

Gets the selected resources.

**Returns:** Array.<sap.dm.dme.pod2.context.type.Resource>|undefined - Array.<[sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)> |  undefined

### (static) getFilterSfcs () → {Array.<string>|undefined}

Gets the selected SFC in the work list filter.

**Returns:** Array.<string>|undefined - Array.<string> |  undefined

### (static) getFilterWorkCenters () → {Array.<sap.dm.dme.pod2.context.type.WorkCenter>|undefined}

Get the selected work centers. In single-select scenarios, an array with one element will be returned.

**Returns:** Array.<sap.dm.dme.pod2.context.type.WorkCenter>|undefined - Array.<[sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)> |  undefined

### (static) getI18nModel () → {sap.dm.dme.pod2.model.I18nResourceModel}

**Returns:** sap.dm.dme.pod2.model.I18nResourceModel - [sap.dm.dme.pod2.model.I18nResourceModel](sap.dm.dme.pod2.model.I18nResourceModel.md)

### (static) getI18nText) (sKey, …aArgsopt) → {string}

Performs synchronous translation using the main POD Context I18nModel
(`PodContext.getI18nModel()`).

This function is shorthand for `PodContext.getI18nModel().getText()`.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No |  |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel#getText](sap.dm.dme.pod2.model.I18nResourceModel.md#getText)

### (static) getIndustryType () → {string}

**Returns:** string - string

### (static) getInspectionFieldCombinations () → {Array|undefined}

Gets the field combinations for quality inspection.

**Returns:** Array|undefined - Array |  undefined

### (static) getLastSelectedOperationActivity () → {sap.dm.dme.pod2.context.type.BaseOperationWorkItem|null}

Gets the last selected operation activity work item. Gets the last operation activity in the current
selection. This is the most recently selected item.

**Returns:** sap.dm.dme.pod2.context.type.BaseOperationWorkItem|null - [sap.dm.dme.pod2.context.type.BaseOperationWorkItem](sap.dm.dme.pod2.context.type.BaseOperationWorkItem.md) |  null

### (static) getLastSelectedWorkListItem () → {sap.dm.dme.pod2.context.type.BaseWorkListItem|null}

Gets the last selected worklist item. Gets the last item in the current selection. This is the most recently
selected item.

**Returns:** sap.dm.dme.pod2.context.type.BaseWorkListItem|null - [sap.dm.dme.pod2.context.type.BaseWorkListItem](sap.dm.dme.pod2.context.type.BaseWorkListItem.md) |  null

### (static) getOperationActivities () → {Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem>|undefined}

Gets the current list of operation activities for the current SFC/Process Lot.

**Returns:** Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem>|undefined - Array.<[sap.dm.dme.pod2.context.type.BaseOperationWorkItem](sap.dm.dme.pod2.context.type.BaseOperationWorkItem.md)> |  undefined

### (static) getOperationActivitiesLoading () → {boolean}

Gets whether the operation activity/phase list is currently loading.

**Returns:** boolean - boolean

### (static) getPlant () → {string}

Returns the plant number for the current plant.

To get all information about the current plant, call `PodContext.get(ModelPath.Plant);` instead.

**Returns:** string - string

### (static) getPlantTimeZone () → {string}

**Returns:** string - string

### (static) getPodId () → {string}

**Returns:** string - string

### (static) getPodRuntime () → {sap.dm.dme.pod2.runtime.PodRuntime}

**Returns:** sap.dm.dme.pod2.runtime.PodRuntime - [sap.dm.dme.pod2.runtime.PodRuntime](sap.dm.dme.pod2.runtime.PodRuntime.md)

### (static) getReportedQuantityCount () → {number|undefined}

Gets the count of reported quantities for the selected work list item.

**Returns:** number|undefined - number |  undefined

### (static) getReportedQuantityItems () → {Array.<sap.dm.dme.pod2.context.type.ReportedQuantity>|undefined}

Gets the list of reported quantities for the selected work list item.

**Returns:** Array.<sap.dm.dme.pod2.context.type.ReportedQuantity>|undefined - Array.<[sap.dm.dme.pod2.context.type.ReportedQuantity](sap.dm.dme.pod2.context.type.ReportedQuantity.md)> |  undefined

### (static) getReportedQuantityLoading () → {boolean|undefined}

Gets the loading status of the reported quantities for the selected work list item.

**Returns:** boolean|undefined - boolean |  undefined

### (static) getSelectedOperationActivities () → {Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem>|undefined}

Gets the list of selected operation activity work items.

**Returns:** Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem>|undefined - Array.<[sap.dm.dme.pod2.context.type.BaseOperationWorkItem](sap.dm.dme.pod2.context.type.BaseOperationWorkItem.md)> |  undefined

### (static) getSelectedWorkInstruction () → {sap.dm.dme.pod2.context.type.WorkInstruction|undefined}

Get the selected work instruction.

**Returns:** sap.dm.dme.pod2.context.type.WorkInstruction|undefined - [sap.dm.dme.pod2.context.type.WorkInstruction](sap.dm.dme.pod2.context.type.WorkInstruction.md) |  undefined

### (static) getSelectedWorkListItems () → {Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem>|undefined}

Gets the currently selected worklist items.

**Returns:** Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem>|undefined - Array.<[sap.dm.dme.pod2.context.type.BaseWorkListItem](sap.dm.dme.pod2.context.type.BaseWorkListItem.md)> |  undefined

### (static) getSignatureHistory (sSignatureWidgetId) → {Array.<sap.dm.fnd.pod2.signature.context.type.Signature>|undefined}

Get signature history for a particualar signature widget

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sSignatureWidgetId` | string | No |  |

**Returns:** Array.<sap.dm.fnd.pod2.signature.context.type.Signature>|undefined - Array.<sap.dm.fnd.pod2.signature.context.type.Signature> |  undefined

### (static) getUserId () → {string}

Gets the currently logged in user's ID.

**Returns:** string - string

### (static) getWhenAvailable (sModelPath) → {Promise.<any>}

Returns a Promise that resolves when the model value at the given path becomes defined and non-null. If the
value is already defined and non-null, the Promise will be resolved immediately.

This function should be used in place of `get` when it is uncertain whether a value
has been set for the first time yet, but you know that some other component is going to populate it.

If you need to know about all changes to a path, it is recommended to check the current value with
`get` and then subscribe to future changes with `subscribe`.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sModelPath` | string | No | The Model Path to get the value for. |

**Returns:** Promise.<any> - Promise.<any>

### (static) getWorkInstructions () → {Array.<sap.dm.dme.pod2.context.type.WorkInstruction>|undefined}

**Returns:** Array.<sap.dm.dme.pod2.context.type.WorkInstruction>|undefined - Array.<[sap.dm.dme.pod2.context.type.WorkInstruction](sap.dm.dme.pod2.context.type.WorkInstruction.md)> |  undefined

### (static) getWorkInstructionsLoading () → {boolean}

Gets the loading status of the work instructions.

**Returns:** boolean - boolean

### (static) getWorkListCount () → {number}

Gets the total count of work list items.

**Returns:** number - number

### (static) getWorkListItems () → {Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem>}

Gets the list of work list items.

**Returns:** Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem> - Array.<[sap.dm.dme.pod2.context.type.BaseWorkListItem](sap.dm.dme.pod2.context.type.BaseWorkListItem.md)>

### (static) getWorkListLoading () → {boolean}

Gets the loading status of the work list.

**Returns:** boolean - boolean

### (static) getWorkListPageSize () → {number}

Gets the number of work list items to be fetched when pagination occurs.

**Returns:** number - number

### (static) getWorkListSorting () → {Array.<sap.dm.dme.pod2.context.type.Sorting>}

Gets the work list sort criteria.

**Returns:** Array.<sap.dm.dme.pod2.context.type.Sorting> - Array.<[sap.dm.dme.pod2.context.type.Sorting](sap.dm.dme.pod2.context.type.Sorting.md)>

### (static) getWorkListType () → {sap.dm.dme.pod2.enumeration.WorkListType|undefined}

Gets the current work list type.

**Returns:** sap.dm.dme.pod2.enumeration.WorkListType|undefined - [sap.dm.dme.pod2.enumeration.WorkListType](sap.dm.dme.pod2.enumeration.md#.WorkListType) |  undefined

### (static) isDesignMode () → {boolean}

**Returns:** boolean - boolean

### (static) isDiscreteIndustry () → {boolean}

**Returns:** boolean - boolean

### (static) isProcessIndustry () → {boolean}

**Returns:** boolean - boolean

### (static) isRunMode () → {boolean}

**Returns:** boolean - boolean

### (static) resolveBinding) (vBinding, oControlopt) → {any}

Resolves a property binding object or binding string for the global POD Context models or the specified
control. For strings that contain bindings or binding expressions, the values will be substituted while
literal text will remain unmodified.

For example: "Plant is {/plant/plant}, industry type is {/plant/industryType}!"
Will return: "Plant is 1010, industry type is DISCRETE!"

The expression can also contain calculations:
"Work list count plus 42 is {= ${/workListCount} + 42 }"

The expression can contain logic:
"{=${/execution/operationActivity/lastSelected/statusComplete} ? 'green': 'red'}"

The expression can contain standard formatters:
{
path: '/workList/lastSelected/orderScheduledStartDate',
type: 'sap.ui.model.type.Date',
formatOptions: { pattern: 'yyyy/MM/dd' }
}

If the input string only contains a single binding or binding expression, the returned value will be of the
same type as the resolved model property. If any characters are present outside of the binding expression,
the resolved values will be coerced to a string.

If a string is expected, callers should use
`String(Utilities.resolveBinding(oControl, sInput))` to ensure consistency. Otherwise the
input of "{= ${/workListCount} + 42 }" being a number may cause unexpected results when compared to the
output of "{= ${/workListCount} + 42 } items" being a string.

If a value is expected to be of the original model property's type (ie. a number, UI5Date, WorkCenter, etc.),
then the caller should perform appropriate input and output validation. For example by trimming the input
to account for trailing spaces in the binding string which may cause string coercion, and by using a
`typeof` or `instanceof` check on the result.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vBinding` | string | sap.ui.base.ManagedObject.PropertyBindingInfo | No | The binding string or binding info object. |
| `oControl` | sap.ui.core.Element | Yes | The control to resolve the binding for. By default the POD Runtime's main application view is used. |

**Returns:** any - any

**See also:** [https://sapui5.hana.ondemand.com/sdk/#/topic/e2e6f4127fe4450ab3cf1339c42ee832](https://sapui5.hana.ondemand.com/sdk/#/topic/e2e6f4127fe4450ab3cf1339c42ee832)

### (static) set (sModelPath, vValue) → {boolean}

Sets a custom property to the PodContextModel. For paths that are part of the core `ModelPath`
enumeration, the appropriate setter should be used instead.

For example, instead of `PodContext.set(ModelPath.FilterWorkCenters, [])` use
`PodContext.setFilterWorkCenters([])`.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sModelPath` | string | No | The path of the property to set. |
| `vValue` | any | No | The new value to be set for this property. |

**Returns:** boolean - boolean

### (static) setActivityConfirmationSummaryList (oActivityConfirmationSummaryList)

Sets the activity confirmation summary list.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActivityConfirmationSummaryList` | Array.<sap.dm.dme.pod2.context.type.ActivityConfirmationSummary> | No | The activity summaries. |

### (static) setExecutionSFCQuantity (iQuantity)

Sets the quantity to be processed when starting/completing an SFC.
Pass `null` to clear the field.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `iQuantity` | number | null | No |  |

### (static) setFieldCombinations (aInputValues)

Sets the field combinations for quality inspection.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputValues` | Array | No |  |

### (static) setFilterInputType (sInputType)

Sets the input type (SFC or Process Lot) for the work list filter.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sInputType` | sap.dm.dme.pod2.enumeration.WorkListFilterInputType | No |  |

### (static) setFilterMaterials (aMaterials)

Sets the selected materials.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aMaterials` | Array.<sap.dm.dme.pod2.context.type.Material> | No |  |

### (static) setFilterOperationActivities (aOperationActivities)

Sets the selected operation activity.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aOperationActivities` | Array.<sap.dm.dme.pod2.context.type.OperationActivityMaster> | No |  |

### (static) setFilterProcessLot (sProcessLot)

Sets the selected process lot in the work list filter.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sProcessLot` | string | No |  |

### (static) setFilterResources (aResources)

Sets the selected resources.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aResources` | Array.<sap.dm.dme.pod2.context.type.Resource> | No |  |

### (static) setFilterSfcs (aSfcs)

Sets the selected SFC in the work list filter.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSfcs` | Array.<string> | No |  |

### (static) setFilterWorkCenters (aWorkCenters)

Set the selected work centers. In single-select scenarios, an array with one element should be set.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aWorkCenters` | Array.<sap.dm.dme.pod2.context.type.WorkCenter> | No |  |

### (static) setInspectionFieldCombinations (aInputValues)

Sets the field combinations for quality inspection.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aInputValues` | Array | No |  |

### (static) setOperationActivities (aOperationActivities)

Sets the list of operation activities for the current SFC/Process Lot.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aOperationActivities` | Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem> | No |  |

### (static) setOperationActivitiesLoading (bLoading)

Sets whether the operation activity/phase list is currently loading.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bLoading` | boolean | No |  |

### (static) setReportedQuantityCount (iCount)

Sets the count of reported quantities for the selected work list item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `iCount` | number | No |  |

### (static) setReportedQuantityItems (aItems)

Sets the list of reported quantities for the selected work list item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aItems` | Array.<sap.dm.dme.pod2.context.type.ReportedQuantity> | No |  |

### (static) setReportedQuantityLoading (bLoading)

Sets the loading status of the reported quantities for the selected work list item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bLoading` | boolean | No |  |

### (static) setSelectedOperationActivities (aOperationActivities)

Sets the list of selected operation activity work items.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aOperationActivities` | Array.<sap.dm.dme.pod2.context.type.BaseOperationWorkItem> | No |  |

### (static) setSelectedWorkInstruction (oWorkInstruction)

Set the selected work instruction.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWorkInstruction` | sap.dm.dme.pod2.context.type.WorkInstruction | No |  |

### (static) setSelectedWorkListItems (aWorkListItems)

Sets the currently selected worklist items.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aWorkListItems` | Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem> | No | An array of worklist items, or an empty array to clear the selection. |

### (static) setWorkInstructions (aWorkInstructions)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aWorkInstructions` | Array.<sap.dm.dme.pod2.context.type.WorkInstruction> | No |  |

### (static) setWorkInstructionsLoading (bLoading)

Sets the loading status of the work instructions so that UI elements can set their busy state accordingly.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bLoading` | boolean | No |  |

### (static) setWorkListCount (iCount)

Sets the total count of work list items.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `iCount` | number | No |  |

### (static) setWorkListItems (aItems)

Sets the list of work list items.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aItems` | Array.<sap.dm.dme.pod2.context.type.BaseWorkListItem> | No |  |

### (static) setWorkListLoading (bLoading)

Sets the loading status of the work list so that UI elements can set their busy state accordingly.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bLoading` | boolean | No |  |

### (static) setWorkListPageSize (iPageSize)

Sets the number of work list items to be fetched when pagination occurs.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `iPageSize` | number | No |  |

### (static) setWorkListSorting (aSorting)

Sets the work list sort criteria.

Plain objects with `sortBy` and `descending` properties may also be provided.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSorting` | Array.<(sap.dm.dme.pod2.context.type.Sorting|sap.dm.dme.pod2.widget.core.TableWidget.Sorting)> | No |  |

### (static) setWorkListType (sType)

Sets the current work list type.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sType` | sap.dm.dme.pod2.enumeration.WorkListType | No |  |

### (static) subscribe (vModelPath, fnCallback, oBindContext)

Subscribe to be notified when the model is changed

If one ModelPath is subscribed to, fnCallback will be provided the new value and the respective model
path as arguments when the property changes.

If subscribing to multiple paths, fnCallback will be called once if any of the watched properties
change. The callback will be provided a `Map<string,any>` of all subscribed
values as the first argument, with a `Map<string,boolean>` indicating which of the
values have changed as the second argument.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vModelPath` | String | Array.<String> | No | The model path, or an Array of model paths. |
| `fnCallback` | function | No | The callback function. |
| `oBindContext` | Object | No | When the callback is called, the 'this' context will be set to this object. |

### (static) unsubscribe (vModelPath, fnCallback, oBindContext)

Unsubscribes from model changes.

Arguments should match those provided to subscribe. If multiple paths were provided, aModelPaths
will be compared by value and does not have to be the exact same array object.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vModelPath` | String | Array.<String> | No | The model path, or an Array of model paths. |
| `fnCallback` | function | No | The callback function. |
| `oBindContext` | Object | No | When the callback is called, the 'this' context will be set to this object. |

### (static) unsubscribeAll (oBindContext)

Unsubscribes from all model changes for the given context. The context is typically the Widget ('this'),
making this an easy way to clean up all of a widget's subscriptions when it is destroyed.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oBindContext` | Object | No | When the callback is called, the 'this' object will be set to this object. |
