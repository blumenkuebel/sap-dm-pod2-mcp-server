# Downtime

`sap.dm.dme.pod2.oeetransaction.context.type.Downtime`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.oeetransaction.context.type.$DowntimeProperties](sap.dm.dme.pod2.oeetransaction.context.type.$DowntimeProperties.md)

## Constructor

```
new Downtime (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.oeetransaction.context.type.$DowntimeProperties | No | An object that satisfies sap.dm.dme.pod2.oeetransaction.context.type.$DowntimeProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No |  |
| `plant` | string | No |  |
| `resource` | string | Yes |  |
| `status` | number | Yes |  |
| `reasonCode` | string | Yes |  |
| `reasonCodeId` | string | Yes |  |
| `reasonCodeDescription` | string | Yes |  |
| `markParentDown` | boolean | No |  |
| `startDate` | sap.ui.core.date.UI5Date \| Date | No |  |
| `endDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `comments` | string | Yes |  |
| `timeElementType` | string | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata
