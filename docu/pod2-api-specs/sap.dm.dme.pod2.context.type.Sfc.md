# Sfc

`sap.dm.dme.pod2.context.type.Sfc`

A common SFC object structure with optional contextual values.

The populated optional fields may vary greatly depending on the API used to fetch the data.

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$SfcProperties](sap.dm.dme.pod2.context.type.$SfcProperties.md)

## Constructor

```
new Sfc (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$SfcProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$SfcProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sfc` | string | No |  |
| `status` | sap.dm.dme.pod2.enumeration.SfcStatus | Yes |  |
| `quantity` | number | Yes |  |
| `order` | string | Yes |  |
| `material` | string | Yes |  |
| `materialVersion` | string | Yes |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.Sfc}

Alternate constructor with built-in mapping from the internal OData response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.plant.Sfc | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Sfc - [sap.dm.dme.pod2.context.type.Sfc](sap.dm.dme.pod2.context.type.Sfc.md)
