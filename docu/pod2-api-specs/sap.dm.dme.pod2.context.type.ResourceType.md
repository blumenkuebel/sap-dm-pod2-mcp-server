# ResourceType

`sap.dm.dme.pod2.context.type.ResourceType`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$ResourceTypeProperties](sap.dm.dme.pod2.context.type.$ResourceTypeProperties.md)

## Constructor

```
new ResourceType (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$ResourceTypeProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$ResourceTypeProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `resourceType` | string | No |  |
| `description` | string | No |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.ResourceType}

Alternate constructor with built-in mapping from the public API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.resource.ResourceType | No |  |

**Returns:** sap.dm.dme.pod2.context.type.ResourceType - [sap.dm.dme.pod2.context.type.ResourceType](sap.dm.dme.pod2.context.type.ResourceType.md)

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.ResourceType}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | object | No |  |

**Returns:** sap.dm.dme.pod2.context.type.ResourceType - [sap.dm.dme.pod2.context.type.ResourceType](sap.dm.dme.pod2.context.type.ResourceType.md)
