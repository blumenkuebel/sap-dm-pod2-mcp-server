# WorkCenter

`sap.dm.dme.pod2.context.type.WorkCenter`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$WorkCenterProperties](sap.dm.dme.pod2.context.type.$WorkCenterProperties.md)

## Constructor

```
new WorkCenter (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$WorkCenterProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$WorkCenterProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `workCenter` | string | No |  |
| `description` | string | Yes |  |
| `category` | sap.dm.dme.pod2.enumeration.WorkCenterCategory | Yes |  |
| `status` | "ENABLED" \| "DISABLED" | Yes |  |
| `maxPeople` | number | Yes |  |
| `minPeople` | number | Yes |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |
| `isErp` | boolean | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkCenter}

Alternate constructor with built-in mapping from the public API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.workcenter.WorkCenter | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkCenter - [sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkCenter}

Alternate constructor with built-in mapping from the plant.svc OData response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.plant.WorkCenter | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkCenter - [sap.dm.dme.pod2.context.type.WorkCenter](sap.dm.dme.pod2.context.type.WorkCenter.md)
