# ReportedQuantityTableWidget

`sap.dm.dme.pod2.widget.quantityconfirmation.ReportedQuantityTableWidget`

**Extends:** [sap.dm.dme.pod2.widget.core.TableWidget](sap.dm.dme.pod2.widget.core.TableWidget.md)

## Constructor

```
new ReportedQuantityTableWidget ()
```

## Members

### (static) ALWAYS_EXCLUDE_PROPERTIES :Array.<string>

Properties that are always excluded from the properties list.

### (static) BINDABLE_PROPERTIES :Array.<string>

### (static) EXCLUDE_EVENTS :Array.<string>

This can be overridden by subclasses to specify which events of the underlying SAPUI5 control should be
excluded from the POD Designer. If not defined, no events are excluded.

### (static) EXCLUDE_PROPERTIES :Array.<string>

### (static) INCLUDE_EVENTS :Array.<string>

### (static) INCLUDE_PROPERTIES :Array.<string>

This can be overridden by subclasses to specify which properties of the underlying SAPUI5 control should be
exposed in the POD Designer. If not defined, all properties are included.

### (static) PROPERTY_CATEGORY_OVERRIDE :Object.<string, string>

This can be overridden by subclasses to remap the category of a property. The name will be the property name
and the value will be the new category name.

### (static) STORABLE_PROPERTY :string

This can be overridden by subclasses to specify a property on the control that should be stored in the POD
context when it changes. For example the Switch control can configure the "state" property to get stored in
the POD context. A variable path property will be exposed that allows the user to specify where the value
should be stored in the POD context.

### (static) VariablePathPropertyId :string

ID of the property that configures the POD context path where the value of the control will be stored when it
changes. This is used if the widget has a STORABLE_PROPERTY defined.

### constructor :TypeOf.<sap.dm.dme.pod2.widget.core.TableWidget>

## Methods

### _addWidgetToView) (oAggregation, oWidget, iIndexopt)

Method to be implemented by subclasses to add a child widget's view to its view. This method is called by
the addWidget method.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oAggregation` | sap.dm.dme.pod2.widget.metadata.WidgetAggregation | No | The aggregation to add the widget to. |
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to add. |
| `iIndex` | number | Yes | (Optional) The index to insert the widget at. If not provided, the widget is added to the end. |

### _constructReasonCodePath (oReasonCode, aAllReasonCodes) → {string}

Constructs a slash-and-new-line delimited string path from the parent reason
code(s) to the selected reason code. This is used to display the reason code
hierarchy in the popover.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oReasonCode` | sap.dm.dme.pod2.api.internal.plant.ResourceReasonCodeNode | No |  |
| `aAllReasonCodes` | Array.<sap.dm.dme.pod2.api.internal.plant.ResourceReasonCodeNode> | No |  |

**Returns:** string - string

### _createCell (oColumnConfig) → {sap.ui.core.Control}

Given a column configuration, create the control to show in the cell of the table for that column.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oColumnConfig` | object | No | The column configuration. |

**Returns:** sap.ui.core.Control - sap.ui.core.Control

### _createColumn (oColumnConfig) → {sap.m.Column}

Creates a column for the table based on the configuration. Can be overridden in subclasses to provide custom
logic.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oColumnConfig` | sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig | No | The configuration for the column. |

**Returns:** sap.m.Column - sap.m.Column

### _createDateCell (oColumnConfig, vBinding, fnFormatter) → {sap.m.Text}

Creates a date cell for the table. Can be overridden in subclasses to provide custom logic.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oColumnConfig` | sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig | No | The column configuration. |
| `vBinding` | string | sap.ui.base.ManagedObject.PropertyBindingInfo | No | The bind path for the cell. |
| `fnFormatter` | function | No | The formatter function to use for the cell. |

**Returns:** sap.m.Text - sap.m.Text

### _createIdentifierCell (oColumnConfig, vBindPath) → {sap.m.ObjectIdentifier}

Creates an identifier cell for the table. Can be used by subclasses to create object identifier cells
for the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oColumnConfig` | sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig | No | The column configuration. |
| `vBindPath` | string | sap.ui.base.ManagedObject.PropertyBindingInfo | No | The bind path on the model. |

**Returns:** sap.m.ObjectIdentifier - sap.m.ObjectIdentifier

### _createListItem (oConfig) → {sap.m.ColumnListItem}

Creates a template for rendering each row in the table. Base implementation creates an sap.m.ColumnListItem
which provides cells aggregation to configure what's shown in each column. Can be overridden in subclasses
to provide custom logic.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oConfig` | sap.dm.dme.pod2.widget.WidgetConfig | No | The widget configuration. |

**Returns:** sap.m.ColumnListItem - sap.m.ColumnListItem

### _createQuantityBulletChartCell (oBindPaths) → {sap.suite.ui.microchart.BulletMicroChart}

Creates a quantity bullet chart cell for the table using a BulletMicroChart.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oBindPaths` | sap.dm.dme.pod2.widget.core.TableWidget.QuantityBulletChartBindings | No | The model paths required for the control. |

**Returns:** sap.suite.ui.microchart.BulletMicroChart - sap.suite.ui.microchart.BulletMicroChart

### _createReasonCodePopover () → {sap.m.Popover}

Creates a popover to display the current scrap reason code.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Popover - sap.m.Popover

### _createSortingDialog (aColumnConfigs) → {sap.m.ViewSettingsDialog}

Creates the dialog to change the table sorting options. When a new selection is confirmed,
`_onSort` will be called.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aColumnConfigs` | Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig> | No |  |

**Returns:** sap.m.ViewSettingsDialog - sap.m.ViewSettingsDialog

### _createTable (oConfig, mSettings) → {sap.m.Table}

Override the parent's _createTable method to pass in default mSettings for this widget.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oConfig` | sap.dm.dme.pod2.widget.WidgetConfig | No | The table configuration. |
| `mSettings` | sap.m.$TableSettings | No | Additional settings for the table. |

**Returns:** sap.m.Table - sap.m.Table

### _createTextCell (oColumnConfig, vBindPath) → {sap.m.Text}

Creates a text cell for the table. Can be used by subclasses to create text cells for the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oColumnConfig` | sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig | No | The column configuration. |
| `vBindPath` | string | sap.ui.base.ManagedObject.PropertyBindingInfo | No | The bind path on the model. |

**Returns:** sap.m.Text - sap.m.Text

### _createToolbar () → {sap.m.Toolbar}

Creates the header toolbar for the table. By default, the toolbar contains the content returned by
`_createToolbarContent`.

To create a table with no header toolbar, override this function to return `null`.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Toolbar - sap.m.Toolbar

### _createToolbarContent () → {Array.<sap.ui.core.Control>}

Creates the content of the header toolbar. By default this is a title with the configured
`headerText` property on the left, and a sorting button on the right.

Subclasses can override this function to add additional controls. It is recommended to add extra controls
either before or after the toolbar spacer.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.ui.core.Control> - Array.<sap.ui.core.Control>

**Example:**

```javascript
_createToolbarContent() {   let aControls = super._createToolbarContent();   // Remove the sorting button.   aControls = aControls.filter((oControl) => !oControl.getId().endsWith("sort"));   // Add a new button on the right side of the toolbar, but before any default controls.   const iSpacerIndex = aControls.findIndex((oControl) => oControl instanceof ToolbarSpacer);   aControls.splice(iSpacerIndex + 1, 0, new Button({       icon: "sap-icon://activate",       tooltip: "Custom Button",       press: () => {}   });   return aControls;}
```

### _createToolbarTitle () → {sap.m.Title}

Create the toolbar title for the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Title - sap.m.Title

### _getCountPath () → {string}

Returns the binding path for the total number of items.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### _getItemBindingInfo (oTable, oTemplate) → {sap.ui.base.ManagedObject.AggregationBindingInfo}

Returns the default binding info to be passed to `bindItems`.
A subclass can override this function to modify the default returned by
`super._getItemBindingInfo` or return an entirely different object.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oTable` | sap.m.Table | No | The table being bound. |
| `oTemplate` | sap.m.ListItemBase | No | The list item template constructed by `_createListItem` and `_createCell`. |

**Returns:** sap.ui.base.ManagedObject.AggregationBindingInfo - sap.ui.base.ManagedObject.AggregationBindingInfo

**See also:** [https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.base.ManagedObject.AggregationBindingInfo%23properties](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.base.ManagedObject.AggregationBindingInfo%2523properties)

### _getLayoutDataPropertyEditor (oProperty, oPropertyAccessor) → {sap.dm.dme.pod2.propertyeditor.PropertyEditor|null}

Gets the property editor for the layout data property.

This is called once for each metadata-driven layout data property, and can be overridden to replace or omit
specific properties.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperty` | sap.ui.base.ManagedObject.MetadataOptions.Property | No | The SAPUI5 property metadata. |
| `oPropertyAccessor` | sap.dm.dme.pod2.propertyeditor.$PropertyAccessor | No | The accessor that the property editor should use. For layout data the parent widget typically provides property editors which modify a child widget's layout data configuration. |

**Returns:** sap.dm.dme.pod2.propertyeditor.PropertyEditor|null - [sap.dm.dme.pod2.propertyeditor.PropertyEditor](sap.dm.dme.pod2.propertyeditor.PropertyEditor.md) |  null

### _getModel () → {sap.ui.model.Model}

Gets the model to use for the table. This method can be overridden in subclasses to provide custom logic. By
default uses the model from PodContext.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.ui.model.Model - sap.ui.model.Model

### _getModelPath () → {string}

Returns the model path for the table list items.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### _getSortableColumns () → {Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig>}

Gets the list of fields that can be sorted by.

By default, this is a filtered list of the columns returned by the class's static `getFields`
function where the field's `sortable` property is set to `true`.

Subclasses may override this function to return a different or modified list.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig> - Array.<[sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig](sap.dm.dme.pod2.widget.core.TableWidget.md#.ColumnConfig)>

### (async) _handleEvent (sEventId, oEvent) → {Promise.<void>}

Calls all the actions that were configured on the given event.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sEventId` | string | No | The ID of the event to run the actions for. |
| `oEvent` | sap.ui.base.Event | No | The SAPUI5 event object passed to the event. |

**Returns:** Promise.<void> - Promise.<void>

**Example:**

```javascript
// Create a simple button attached to a widget eventconst oButton1 = new Button({   text: "Go",   press: (oEvent) => this._handleEvent("press", oEvent)});// Create a button attached to a widget event which prevents multiple concurrent executions of the same// action sequence.let bRunning = false;const oButton2 = new Button({   text: "Go",   press: (oEvent) => {       bRunning = true;       this._handleEvent("press", oEvent).finally(() => { bRunning = false; });   }});
```

### _isControlValueValid () → {boolean}

Hook called by #updatePodContext before writing the control's current value to the POD context.

Subclasses can override this to prevent invalid values from being stored. The default implementation
always returns true.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** boolean - boolean

### (async) _onChangeReasonCodeButtonPress (oEvent)

Handles the press event of the "Change Reason Code" button. Opens a dialog to select a new scrap
reason code.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Button$PressEvent | No |  |

### (async) _onReasonCodeLinkPress (oEvent)

Handles the press event of the reason code link. Opens a popover with the reason code hierarchy.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Link$PressEvent | No | The event object. |

### _onSort (aSorting)

Called when sorting criteria changes.

This function must be implemented by subclasses if sorting is supported, unless
`_createSortingDialog` has been overridden with custom logic.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSorting` | Array.<sap.dm.dme.pod2.widget.core.TableWidget.Sorting> | No |  |

### _removeWidgetFromView (sAggregationId, oWidget)

Method to be implemented by subclasses to remove a child widget from the view.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sAggregationId` | String | No | The name of the aggregation to remove the widget from. |
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to remove. |

### _updateTableColumns (aColumnConfigs)

Re-creates the table columns and cells to reflect configuration changes.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aColumnConfigs` | Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig> | No |  |

### containsWidget (oWidget) → {boolean}

Recurisively checks if this widget contains the given child widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to check for. |

**Returns:** boolean - boolean

### findChildWidget (oWidget) → {Tuple.<string, number>}

Locates a direct child of this widget within its aggregations.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to look for. |

**Returns:** Tuple.<string, number> - Tuple.<string, number>

### getAggregation (sAggregationId) → {sap.dm.dme.pod2.widget.metadata.WidgetAggregation|null}

Gets the aggregation metadata for the given aggregation ID.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sAggregationId` | String | No | The ID of the aggregation to get. |

**Returns:** sap.dm.dme.pod2.widget.metadata.WidgetAggregation|null - [sap.dm.dme.pod2.widget.metadata.WidgetAggregation](sap.dm.dme.pod2.widget.metadata.WidgetAggregation.md) |  null

### getAggregations () → {Array.<sap.dm.dme.pod2.widget.metadata.WidgetAggregation>|null}

Gets the aggregations supported by the widget. Aggregations are lists that can contain other widgets.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.dm.dme.pod2.widget.metadata.WidgetAggregation>|null - Array.<[sap.dm.dme.pod2.widget.metadata.WidgetAggregation](sap.dm.dme.pod2.widget.metadata.WidgetAggregation.md)> |  null

### getChildWidgets (sAggregationId) → {Array.<sap.dm.dme.pod2.widget.Widget>}

Gets the child widgets for the given aggregation.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sAggregationId` | string | No | The ID of the aggregation to get the child widgets for. |

**Returns:** Array.<sap.dm.dme.pod2.widget.Widget> - Array.<[sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)>

### getConfig () → {sap.dm.dme.pod2.widget.WidgetConfig}

Gets the configuration information for the widget instance.

**Returns:** sap.dm.dme.pod2.widget.WidgetConfig - [sap.dm.dme.pod2.widget.WidgetConfig](sap.dm.dme.pod2.widget.md#.WidgetConfig)

### getDroppedAggregationId (oEvent) → {string|null}

Widgets with multiple aggregations should override this function to allow child widgets to be dropped on
different regions of the parent to be added to the respective aggregation.

When a widget is dropped onto this widget, this method is used to determine which aggregation the new child
should be added to. Subclasses should override this function to return the correct aggregation ID based on
the drop event parameter.

If this method is not overridden, `null` will be returned and the calling function is responsible
for the fallback behavior (typically defaulting to the first aggregation returned by
`getAggregations()`).

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.ui.core.dnd.DropInfo$DropEvent | No | The drag and drop SAPUI5 event. |

**Returns:** string|null - string |  null

### getI18nText) (sKey, …aArgsopt) → {string}

Get the i18n translation for a given key and placeholders. This method will first check the class's
I18nResourceModel, then fall back to PodContext.getI18nText() if a match is not found.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sKey` | string | No | The translation key. |
| `aArgs` | any | Array.<any> | Yes | Arguments for placeholder substitution. The values will be coerced to strings during substitution, and Arrays will be flattened for parity with sap.base.i18n.ResourceBundle#getText(). |

**Returns:** string - string

**See also:** [sap.dm.dme.pod2.model.I18nResourceModel#getText](sap.dm.dme.pod2.model.I18nResourceModel.md#getText)

### getId () → {string}

Gets the ID of the widget.

**Returns:** string - string

### getLayoutDataConfig () → {Object.<string, any>|null}

Gets the layout data configuration for the widget.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Object.<string, any>|null - Object.<string, any> |  null

### getLayoutDataPropertiesForChild (oChildWidget) → {Array.<sap.dm.dme.pod2.widget.metadata.LayoutDataProperty>|null}

Gets the properties for the LayoutData to configure for a child of this widget. The layout properties
are determined by the type of parent (this widget) and the aggregation the child is part of.

This is used by POD Designer to configure the layout data properties of a child widget.

By default, the properties returned are based on the layout data type's metadata. This function can
be overridden to filter, omit, or replace the metadata-driven properties.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oChildWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to create WidgetProperty objects for. |

**Returns:** Array.<sap.dm.dme.pod2.widget.metadata.LayoutDataProperty>|null - Array.<[sap.dm.dme.pod2.widget.metadata.LayoutDataProperty](sap.dm.dme.pod2.widget.metadata.LayoutDataProperty.md)> |  null

### getLayoutDataPropertyValue (sName) → {any|null}

Gets a layout data configuration property value.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sName` | String | No | The name of the LayoutData property to get the value for. |

**Returns:** any|null - any |  null

### getParentWidget () → {sap.dm.dme.pod2.widget.Widget}

Gets the parent widget that contains this widget.

**Returns:** sap.dm.dme.pod2.widget.Widget - [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)

### getPodRuntime () → {sap.dm.dme.pod2.runtime.PodRuntime}

**Returns:** sap.dm.dme.pod2.runtime.PodRuntime - [sap.dm.dme.pod2.runtime.PodRuntime](sap.dm.dme.pod2.runtime.PodRuntime.md)

### getPropertyValue (sName) → {any}

Design time method for reading a widget configuration property.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sName` | string | No | The property name. |

**Returns:** any - any

### getRootWidget () → {sap.dm.dme.pod2.widget.Widget}

Gets the PageWidget or DialogWidget that is the root widget in the widget hierarchy.

**Returns:** sap.dm.dme.pod2.widget.Widget - [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)

### getSorting () → {Array.<sap.dm.dme.pod2.widget.core.TableWidget.Sorting>}

Returns the current sorting settings for the table. For tables which only support sorting by a single
field, this will always be an array with 1 element.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.dm.dme.pod2.widget.core.TableWidget.Sorting> - Array.<[sap.dm.dme.pod2.widget.core.TableWidget.Sorting](sap.dm.dme.pod2.widget.core.TableWidget.md#.Sorting)>

### getTable () → {sap.m.Table}

Gets the sap.m.Table control. Method provided to subclasses to access the created table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Table - sap.m.Table

### getType () → {string}

Gets the type of the widget.

**Returns:** string - string

### getView () → {sap.ui.core.Element}

Gets the view (an SAPUI5 control) for the widget.

**Returns:** sap.ui.core.Element - sap.ui.core.Element

### hasAggregations () → {boolean}

Checks if the widget has any aggregations.

**Returns:** boolean - boolean

### hasChildWidgets () → {boolean}

Checks if the widget has any child widgets.

**Returns:** boolean - boolean

### isVisible () → {boolean}

Shorthand for `sap.dm.dme.pod2.Utilities.isVisible(oWidget.getView())`.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** boolean - boolean

### onExit ()

Overridable method to clean up the widget. This method is called when the widget is destroyed.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### scrollIntoView) (oOptionsopt)

Shorthand for `sap.dm.dme.pod2.Utilities.scrollIntoView(oWidget.getView(), oOptions)`.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oOptions` | object | Yes | Options to be passed to HTMLElement.scrollIntoView |

**See also:** [https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

### setLayoutDataPropertyValue (sProperty, vValue)

Sets a layout data configuration property value and update the UI.

This function may only be called in design mode.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sProperty` | string | No | The name of the LayoutData property to set the value for. |
| `vValue` | any | No | The value to set for the layout data property. |

### (static) getCategory () → {string}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string

### (static) getDefaultConfig () → {sap.dm.dme.pod2.widget.core.TableWidget.DefaultConfig}

Overrides the getDefaultConfig method to return a default configuration that configures the table with the
default columns and properties.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.widget.core.TableWidget.DefaultConfig - [sap.dm.dme.pod2.widget.core.TableWidget.DefaultConfig](sap.dm.dme.pod2.widget.core.TableWidget.md#.DefaultConfig)

### (static) getFields () → {Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig>}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig> - Array.<[sap.dm.dme.pod2.widget.core.TableWidget.ColumnConfig](sap.dm.dme.pod2.widget.core.TableWidget.md#.ColumnConfig)>

### (static) getIcon () → {string}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string
