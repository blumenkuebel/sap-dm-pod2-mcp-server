# TimeRange

`sap.dm.dme.pod2.context.type.TimeRange`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$TimeRangeProperties](sap.dm.dme.pod2.context.type.$TimeRangeProperties.md)

## Constructor

```
new TimeRange (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$TimeRangeProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$TimeRangeProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `startDate` | sap.ui.core.date.UI5Date \| Date | No |  |
| `endDate` | sap.ui.core.date.UI5Date \| Date | Yes | If omitted, the consuming function is responsible for any fallback logic. An absent endDate will often be treated as the current timestamp. |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata
