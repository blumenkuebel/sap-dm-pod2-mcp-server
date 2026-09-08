# WorkInstructionElement

`sap.dm.dme.pod2.context.type.WorkInstructionElement`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$WorkInstructionElementProperties](sap.dm.dme.pod2.context.type.$WorkInstructionElementProperties.md)

## Constructor

```
new WorkInstructionElement (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `type` | sap.dm.dme.pod2.enumeration.WorkInstructionType | No |  |
| `sequence` | number | No |  |
| `description` | string | Yes |  |
| `newWindow` | boolean | Yes |  |
| `fileName` | string | Yes |  |
| `mimeType` | string | Yes |  |
| `url` | string | Yes |  |
| `fileExternalUrl` | string | Yes |  |
| `text` | string | Yes |  |
| `erpFilename` | string | Yes |  |
| `metadataCategory` | string | Yes |  |
| `metadataComponent` | string | Yes |  |
| `metadataRefDes` | string | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkInstructionElement}

Alternate constructor with built-in mapping from the public API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.workinstruction.WorkInstructionElement | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkInstructionElement - [sap.dm.dme.pod2.context.type.WorkInstructionElement](sap.dm.dme.pod2.context.type.WorkInstructionElement.md)
