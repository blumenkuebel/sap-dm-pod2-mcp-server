# widget

`sap.dm.dme.pod2.widget`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the widget within the POD config. If provided as a default, it is important to ensure the same ID is not used more than once. |
| `properties` | Object.<string, any> | Yes | The properties map for the widget, as configured in the Properties Panel in the POD Designer. |
| `aggregations` | Object.<string, Array.<sap.dm.dme.pod2.widget.WidgetConfig>> | Yes | Default aggregations to add when widget is created. |
| `events` | Object.<string, Array.<sap.dm.dme.pod2.action.ActionConfig>> | Yes | Default event configurations to add when widget is created. |

**See also:** [sap.dm.dme.pod2.widget.WidgetConfig](sap.dm.dme.pod2.widget.md#.WidgetConfig), [sap.dm.dme.pod2.widget.Widget.getDefaultConfig](sap.dm.dme.pod2.widget.Widget.md#.getDefaultConfig)
