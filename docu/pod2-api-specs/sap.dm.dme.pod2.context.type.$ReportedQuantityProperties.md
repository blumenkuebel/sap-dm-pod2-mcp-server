# $ReportedQuantityProperties

`sap.dm.dme.pod2.context.type.$ReportedQuantityProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `yieldQuantity` | number | Yes | The yield quantity value. |
| `yieldUnitOfMeasure` | sap.dm.dme.pod2.context.type.UnitOfMeasure | Yes | The unit of measure for the yield quantity. |
| `yieldActivityLogId` | string | Yes | The yield activity log ID. |
| `scrapQuantity` | number | Yes | The scrap quantity value. |
| `scrapUnitOfMeasure` | sap.dm.dme.pod2.context.type.UnitOfMeasure | Yes | The unit of measure for the scrap quantity. |
| `scrapActivityLogId` | string | Yes | The scrap activity log ID. |
| `scrapReasonCode` | string | Yes | The scrap reason code. |
| `scrapReasonCodes` | Array.<string> | Yes | Additional scrap reason codes. |
| `scrapReasonCodeDescription` | string | Yes | The scrap reason code description. |
| `resource` | string | No | The resource ID. |
| `resourceDescription` | string | Yes | The resource description. |
| `userId` | string | No | The user ID of the user who posted the reported quantity. |
| `status` | string | Yes | The quantity confirmation status (e.g., "POSTED_IN_DM"). |
| `postingDate` | sap.ui.core.date.UI5Date \| Date | Yes | The posting date and time. |
| `createdDate` | sap.ui.core.date.UI5Date \| Date | No | The creation date and time. |
