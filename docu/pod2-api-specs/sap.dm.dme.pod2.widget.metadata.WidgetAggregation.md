# WidgetAggregation

`sap.dm.dme.pod2.widget.metadata.WidgetAggregation`

Metadata for a widget aggregation. An aggregation is a named collection of child widgets.

## Constructor

```
new WidgetAggregation (mSettings)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `mSettings` | sap.dm.dme.pod2.widget.metadata.$WidgetAggregationSettings | No | The settings for the aggregation. |

## Methods

### getDescription () → {string}

Gets the description of the aggregation.

**Returns:** string - string

### getDisplayName () → {string}

Gets the display name of the aggregation.

**Returns:** string - string

### getId () → {string}

Gets the ID of the aggregation.

**Returns:** string - string

### isMultiple () → {boolean}

Check if the aggregation can contain multiple child widgets or just a single child widget.

**Returns:** boolean - boolean
