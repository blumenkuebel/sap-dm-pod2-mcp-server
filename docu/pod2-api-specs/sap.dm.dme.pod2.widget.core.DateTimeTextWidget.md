# DateTimeTextWidget

`sap.dm.dme.pod2.widget.core.DateTimeTextWidget`

A widget to display a formatted date or date range.

**Extends:** [sap.dm.dme.pod2.widget.core.TextWidget](sap.dm.dme.pod2.widget.core.TextWidget.md)

## Constructor

```
new DateTimeTextWidget ()
```

## Members

### (static) ALWAYS_EXCLUDE_PROPERTIES :Array.<string>

Properties that are always excluded from the properties list.

### (static) BINDABLE_PROPERTIES :Array.<string>

Subclasses can redefine this static variable to contain a list of property names that can contain a binding
expression. If a property is in this list, the POD Designer will allow the user to enter a binding expression
for the property value.

### DisplayFormat :Enum.<string>

### (static) EXCLUDE_EVENTS :Array.<string>

This can be overridden by subclasses to specify which events of the underlying SAPUI5 control should be
excluded from the POD Designer. If not defined, no events are excluded.

### EXCLUDE_PROPERTIES :Array.<string>

### (static) INCLUDE_EVENTS :Array.<string>

This can be overridden by subclasses to specify which events of the underlying SAPUI5 control should be
exposed in the POD Designer. If not defined, all events are included.

### (static) INCLUDE_PROPERTIES :Array.<string>

This can be overridden by subclasses to specify which properties of the underlying SAPUI5 control should be
exposed in the POD Designer. If not defined, all properties are included.

### (static) PROPERTY_CATEGORY_OVERRIDE :Object.<string, sap.dm.dme.pod2.propertyeditor.PropertyCategory>

### PropertyId :Enum.<string>

### (static) STORABLE_PROPERTY :string

This can be overridden by subclasses to specify a property on the control that should be stored in the POD
context when it changes. For example the Switch control can configure the "state" property to get stored in
the POD context. A variable path property will be exposed that allows the user to specify where the value
should be stored in the POD context.

### (static) VariablePathPropertyId :string

ID of the property that configures the POD context path where the value of the control will be stored when it
changes. This is used if the widget has a STORABLE_PROPERTY defined.

### constructor :TypeOf.<sap.dm.dme.pod2.widget.Widget>

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

### _formatDates (oDateFormat, oDate1, oDate2) → {string}

Formats the dates. If only one date is provided, it is formatted as a single date. If two dates are
provided, they are formatted as a date range.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oDateFormat` | sap.ui.core.format.DateFormat | No | The date format instance |
| `oDate1` | sap.ui.core.date.UI5Date | Date | No | The first date |
| `oDate2` | sap.ui.core.date.UI5Date | Date | No | The second date |

**Returns:** string - string

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

### _getWidgetPropertyEditor (oProperty) → {sap.dm.dme.pod2.propertyeditor.PropertyEditor|null}

Gets the property editor for the given widget property.

This is called once for each metadata-driven widget property, and can be overridden to replace specific
property editors.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperty` | sap.ui.base.ManagedObject.MetadataOptions.Property | No | The SAPUI5 property metadata. |

**Returns:** sap.dm.dme.pod2.propertyeditor.PropertyEditor|null - [sap.dm.dme.pod2.propertyeditor.PropertyEditor](sap.dm.dme.pod2.propertyeditor.PropertyEditor.md) |  null

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

### _removeWidgetFromView (sAggregationId, oWidget)

Method to be implemented by subclasses to remove a child widget from the view.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sAggregationId` | String | No | The name of the aggregation to remove the widget from. |
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The child widget to remove. |

### _updateText ()

Updates the text with the currently configured dates.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

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

### getType () → {string}

Gets the type of the widget.

**Returns:** string - string

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

### (static) getDefaultConfig () → {sap.dm.dme.pod2.widget.DefaultWidgetConfig}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.dm.dme.pod2.widget.DefaultWidgetConfig - [sap.dm.dme.pod2.widget.DefaultWidgetConfig](sap.dm.dme.pod2.widget.md#.DefaultWidgetConfig)

### (static) getIcon () → {string}

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** string - string
