# Bom

`sap.dm.dme.pod2.context.type.Bom`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$BomProperties](sap.dm.dme.pod2.context.type.$BomProperties.md)

## Constructor

```
new Bom (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bom` | string | No |  |
| `bomType` | sap.dm.dme.pod2.enumeration.BomType | No |  |
| `bomVersion` | string | No |  |
| `currentVersion` | boolean | No |  |
| `description` | string | Yes |  |
| `bomTemplate` | boolean | No |  |
| `status` | sap.dm.dme.pod2.enumeration.BomStatus | No |  |
| `released` | boolean | No |  |
| `erpBom` | string | No |  |
| `baseQuantity` | number | Yes |  |
| `baseUom` | string | Yes |  |
| `dataTypeRef` | string | Yes |  |
| `modifiedAtDate` | Date | Yes |  |
| `createdAtDate` | Date | Yes |  |
| `changedAtDate` | Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.Bom}

Alternate constructor with built-in mapping from the internal OData response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.product.Bom | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Bom - [sap.dm.dme.pod2.context.type.Bom](sap.dm.dme.pod2.context.type.Bom.md)
