# $WidgetAggregationSettings

`sap.dm.dme.pod2.widget.metadata.$WidgetAggregationSettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No | The aggregation ID. A widget type cannot have multiple aggregations with the same ID. |
| `displayName` | string | No | The localized name of the aggregation. |
| `description` | string | Yes | A localized tooltip explaining the aggregation. If omitted, the displayName will be used as the description. |
| `multiplicity` | sap.dm.dme.pod2.widget.metadata.AggregationMultiplicity | Yes | The number of child widgets the aggregation can contain. By default an aggregation can contain multiple child widgets (AggregationMultiplicity.Many). |
