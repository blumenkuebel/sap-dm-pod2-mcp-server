# Material

`sap.dm.dme.pod2.context.type.Material`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$MaterialProperties](sap.dm.dme.pod2.context.type.$MaterialProperties.md)

## Constructor

```
new Material (oProperties)
```

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

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.Material}

Alternate constructor with built-in mapping from the MDO response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.product.Material | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Material - [sap.dm.dme.pod2.context.type.Material](sap.dm.dme.pod2.context.type.Material.md)

### LocaleDescription ()
