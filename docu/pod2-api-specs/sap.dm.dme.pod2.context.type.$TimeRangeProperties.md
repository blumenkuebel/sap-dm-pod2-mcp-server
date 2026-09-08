# $TimeRangeProperties

`sap.dm.dme.pod2.context.type.$TimeRangeProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `startDate` | sap.ui.core.date.UI5Date \| Date | No |  |
| `endDate` | sap.ui.core.date.UI5Date \| Date | Yes | If omitted, the consuming function is responsible for any fallback logic. An absent endDate will often be treated as the current timestamp. |
