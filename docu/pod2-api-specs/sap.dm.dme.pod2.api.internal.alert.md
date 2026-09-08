# alert

`sap.dm.dme.pod2.api.internal.alert`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `Name` | string | No | The alert type name. |
| `Description` | string | No | The alert type description. |
| `ManagingType` | string | No | The managing type. |
| `ManagingService` | string | No | The managing service. |
| `SeveritySetName` | string | No | The severity set name. |
| `StatusSetName` | string | No | The status set name. |
| `Actions` | Array.<sap.dm.dme.pod2.api.internal.alert.AlertTypeAction> | No | The alert type actions. |
| `StatusSet` | sap.dm.dme.pod2.api.internal.alert.StatusSet | No | The alert type status set. |
| `SeveritySet` | sap.dm.dme.pod2.api.internal.alert.SeveritySet | No | The alert type severity set. |
| `Descriptions` | Array.<sap.dm.dme.pod2.api.internal.alert.Translation> | No | The localized alert type descriptions. |
| `Deduplication` | sap.dm.dme.pod2.api.internal.alert.Deduplication | No | The alert type deduplication settings. |
