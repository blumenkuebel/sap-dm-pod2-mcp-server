# PodRuntime

`sap.dm.dme.pod2.runtime.PodRuntime`

## Constructor

```
new PodRuntime (oPodDesigneropt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oPodDesigner` | sap.dm.dme.pod2.designer.PodDesigner | Yes | Passed in if the POD is running in POD Designer. |

## Methods

### findWidgetConfig (fnCompare) → {Tuple.<sap.dm.dme.pod2.widget.WidgetConfig, sap.dm.dme.pod2.widget.WidgetConfig>|Tuple.<null, null>}

Searches the POD config for a widget matching the given criteria. Iteration will stop once the first match
is found (`true` returned by `fnCompare`).

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fnCompare` | sap.dm.dme.pod2.runtime.PodRuntime.FindWidgetConfigComparator | No |  |

**Returns:** Tuple.<sap.dm.dme.pod2.widget.WidgetConfig, sap.dm.dme.pod2.widget.WidgetConfig>|Tuple.<null, null> - Tuple.<[sap.dm.dme.pod2.widget.WidgetConfig](sap.dm.dme.pod2.widget.md#.WidgetConfig), [sap.dm.dme.pod2.widget.WidgetConfig](sap.dm.dme.pod2.widget.md#.WidgetConfig)> |  Tuple.<null, null>

### forEachActionConfig (fnCallback)

Executes a callback for each action configuration in the POD.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fnCallback` | sap.dm.dme.pod2.runtime.PodRuntime.ForEachActionConfigCallback | No |  |

### forEachWidget (fnCallback)

Executes a callback for each widget in the POD, across all instantiated pages and dialogs. Note that widgets
will only be instantiated if they are on a page in the current navigation history or in an open dialog.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fnCallback` | sap.dm.dme.pod2.runtime.PodRuntime.ForEachWidgetCallback | No |  |

### forEachWidgetConfig (fnCallback)

Executes a callback for each widget configuration in the POD, regardless of whether it has been instantiated.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fnCallback` | sap.dm.dme.pod2.runtime.PodRuntime.ForEachWidgetConfigCallback | No |  |

### getCurrentPage () → {sap.m.Page}

Gets the current page.

**Returns:** sap.m.Page - sap.m.Page

### getCurrentPageWidget () → {sap.dm.dme.pod2.widget.layout.PageWidget}

Gets the current page widget.

**Returns:** sap.dm.dme.pod2.widget.layout.PageWidget - [sap.dm.dme.pod2.widget.layout.PageWidget](sap.dm.dme.pod2.widget.layout.PageWidget.md)

### getPodConfig () → {sap.dm.dme.pod2.runtime.PodConfig}

Gets the configuration of the currently loaded POD.

**Returns:** sap.dm.dme.pod2.runtime.PodConfig - [sap.dm.dme.pod2.runtime.PodConfig](sap.dm.dme.pod2.runtime.md#.PodConfig)

### getView () → {sap.m.App}

**Returns:** sap.m.App - sap.m.App

### getWidget (sId) → {sap.dm.dme.pod2.widget.Widget}

Gets a Widget by ID.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sId` | String | No | The ID of the Widget. |

**Returns:** sap.dm.dme.pod2.widget.Widget - [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)

### getWidgetForView (oView) → {sap.dm.dme.pod2.widget.Widget}

Gets the corresponding Widget for a view (SAPUI5 control) that was created by a Widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oView` | sap.ui.core.Element | No |  |

**Returns:** sap.dm.dme.pod2.widget.Widget - [sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)

### getWidgetsForViews (aViews) → {Array.<sap.dm.dme.pod2.widget.Widget>}

Gets the corresponding Widgets for an array of views (SAPUI5 controls) which were created by a Widget.

The order of the returned array matches that of the input array.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aViews` | Array.<sap.ui.core.Element> | No |  |

**Returns:** Array.<sap.dm.dme.pod2.widget.Widget> - Array.<[sap.dm.dme.pod2.widget.Widget](sap.dm.dme.pod2.widget.Widget.md)>

### (async) navigateBack () → {Promise.<void>}

Navigates back to the previous page in the navigation history.

This method includes protection against nested navigation calls that can occur if
navigation occurs while already navigating.

**Returns:** Promise.<void> - Promise.<void>

### (async) navigateToPage (sPageId) → {Promise.<void>}

Navigates to a page. If already on the provided page, no navigation will occur.

This method includes protection against nested navigation calls that can occur if
navigation occurs while already navigating.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPageId` | string | No | The ID of the page to navigate to. |

**Returns:** Promise.<void> - Promise.<void>

### (async) navigateToWidget (sWidgetId) → {Promise.<void>}

Navigates to a widget by its ID. This performs navigation to the page/dialog containing the widget as well
as changing the active tab of any tab bars containing the target widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWidgetId` | string | No | The ID of the widget to navigate to. |

**Returns:** Promise.<void> - Promise.<void>

### (async) navigateToWidgetByType (sWidgetType) → {Promise.<void>}

Navigates to a widget by its type string. This performs page navigation to the page/dialog containing the
widget as well as changing the active tab of any tab bars containing the target widget.

Only exact matches of the type string will result in navigation. Subclasses should be specified explicitly
by their type string, not the parent's type.

If multiple widgets with the specified type are present in the POD, the first one found will be navigated to.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWidgetType` | string | No | The type string of the widget to navigate to. |

**Returns:** Promise.<void> - Promise.<void>

### (async) showDialog (sDialogId) → {Promise.<void>}

Creates and opens a dialog root widget if it is not already open.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sDialogId` | string | No | The ID of the dialog to show. |

**Returns:** Promise.<void> - Promise.<void>

### FindWidgetConfigComparator (oWidgetConfig) → {boolean}

Used to search for a matching widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetConfig` | sap.dm.dme.pod2.widget.WidgetConfig | No |  |

**Returns:** boolean - boolean

### ForEachActionConfigCallback (oActionConfig, oContext)

Executed once for each action configuration in the POD.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oActionConfig` | sap.dm.dme.pod2.action.ActionConfig | No |  |
| `widgetConfig` | sap.dm.dme.pod2.widget.WidgetConfig | No | The widget config that the action belongs to. |
| `event` | string | No | The widget event that the action is assigned to. |

### ForEachWidgetCallback (oWidget)

Executed once for each instantiated widget.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No |  |

### ForEachWidgetConfigCallback (oWidgetConfig)

Executed once for each widget configuration in the POD.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidgetConfig` | sap.dm.dme.pod2.widget.WidgetConfig | No |  |
