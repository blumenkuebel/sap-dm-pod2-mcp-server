# $MaterialProperties

`sap.dm.dme.pod2.context.type.$MaterialProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `material` | string | No |  |
| `version` | string | No |  |
| `currentVersion` | boolean | No | True if this is the current version of this material, false if a newer version should be used instead. |
| `description` | string | No |  |
| `localeDescriptions` | Array.<sap.dm.dme.pod2.context.type.Material.LocaleDescription> | Yes |  |
| `materialType` | sap.dm.dme.pod2.enumeration.MaterialType | No |  |
| `procurementType` | sap.dm.dme.pod2.enumeration.ProcurementType | Yes |  |
| `status` | sap.dm.dme.pod2.enumeration.MaterialStatus | No |  |
| `unitOfMeasure` | string | Yes |  |
| `lotSize` | number | Yes |  |
| `quantityRestriction` | sap.dm.dme.pod2.enumeration.MaterialQuantityRestriction | Yes |  |
| `incrementBatchNumber` | sap.dm.dme.pod2.enumeration.IncrementBatchNumberType | Yes |  |
| `mrpController` | string | Yes |  |
| `erpBackflushing` | boolean | Yes |  |
| `modifiedAtDate` | Date | Yes |  |
| `createdAtDate` | Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |
