# UnitOfMeasure

`sap.dm.dme.pod2.context.type.UnitOfMeasure`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$UnitOfMeasureProperties](sap.dm.dme.pod2.context.type.$UnitOfMeasureProperties.md)

## Constructor

```
new UnitOfMeasure (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$UnitOfMeasureProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$UnitOfMeasureProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `uom` | string | No | Unit of measure code |
| `internalUom` | string | No | Internal value of unit of measure |
| `shortText` | string | No | Short text for unit of measure |
| `longText` | string | No | Long text for unit of measure |
| `isPrimary` | boolean | No | Is primary unit of measure |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalApiResponse (oResponse) → {sap.dm.dme.pod2.context.type.UnitOfMeasure}

Creates a UnitOfMeasure instance from an API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oResponse` | sap.dm.dme.pod2.api.internal.product.UnitOfMeasure | No | The API response object |

**Returns:** sap.dm.dme.pod2.context.type.UnitOfMeasure - [sap.dm.dme.pod2.context.type.UnitOfMeasure](sap.dm.dme.pod2.context.type.UnitOfMeasure.md)
