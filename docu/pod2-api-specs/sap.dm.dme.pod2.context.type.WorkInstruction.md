# WorkInstruction

`sap.dm.dme.pod2.context.type.WorkInstruction`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$WorkInstructionProperties](sap.dm.dme.pod2.context.type.$WorkInstructionProperties.md)

## Constructor

```
new WorkInstruction (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (internal reference) - Required for on-demand element loading via WorkInstructionDelegate.loadWorkInstructionElements() |
| `workInstruction` | string | No |  |
| `description` | string | No |  |
| `version` | string | No |  |
| `currentVersion` | boolean | No |  |
| `status` | sap.dm.dme.pod2.enumeration.WorkInstructionStatus | No |  |
| `sequence` | number | Yes |  |
| `operationActivity` | string | Yes |  |
| `stepId` | string | Yes |  |
| `url` | string | Yes |  |
| `instructionData` | string | Yes |  |
| `types` | Array.<sap.dm.dme.pod2.enumeration.WorkInstructionType> | Yes | Array of element types without element data - populated when skipWorkInstructionElementsReading is used |
| `workInstructionElements` | Array.<sap.dm.dme.pod2.context.type.WorkInstructionElement> | No | Array of full element data - may be empty when skipWorkInstructionElementsReading is used, loaded on-demand when needed |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromAttachedWorkInstructionsResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkInstruction}

Alternate constructor with built-in mapping from the public /attachedworkinstructions API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.workinstruction.AttachedWorkInstruction | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkInstruction - [sap.dm.dme.pod2.context.type.WorkInstruction](sap.dm.dme.pod2.context.type.WorkInstruction.md)

**See also:** [https://api.sap.com/api/sapdme_workinstruction/path/get_v1_attachedworkinstructions](https://api.sap.com/api/sapdme_workinstruction/path/get_v1_attachedworkinstructions)

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkInstruction}

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.workinstruction.WorkInstructionListItem | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkInstruction - [sap.dm.dme.pod2.context.type.WorkInstruction](sap.dm.dme.pod2.context.type.WorkInstruction.md)

### (static) fromWorkInstructionsResponse (oRecord) → {sap.dm.dme.pod2.context.type.WorkInstruction}

Alternate constructor with built-in mapping from the public /workinstructions API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.workinstruction.WorkInstruction | No |  |

**Returns:** sap.dm.dme.pod2.context.type.WorkInstruction - [sap.dm.dme.pod2.context.type.WorkInstruction](sap.dm.dme.pod2.context.type.WorkInstruction.md)

**See also:** [https://api.sap.com/api/sapdme_workinstruction/path/get_v1_workinstructions](https://api.sap.com/api/sapdme_workinstruction/path/get_v1_workinstructions)
