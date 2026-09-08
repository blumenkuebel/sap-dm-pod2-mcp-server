# workinstruction

`sap.dm.dme.pod2.api.workinstruction`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `stepId` | string | No | The step ID to which the work instruction is attached. |
| `operationActivity` | string | No | The name of the operation activity to which the work instruction is attached. |
| `workInstruction` | string | No | The name of the work instruction. |
| `status` | sap.dm.dme.pod2.enumeration.WorkInstructionStatus | No | The status of the work instruction. |
| `currentVersion` | boolean | No | If true, then this is the current version of the work instruction. |
| `sequence` | number | No | The sequence of the attachment point. |
| `url` | string | No | The URL that defines where the work instruction data is found. |
| `version` | string | No | The version of the work instruction. |
| `description` | string | No | The description of the work instruction. |
| `instructionData` | string | No | The actual instruction (plain text or HTML). |
| `types` | Array.<sap.dm.dme.pod2.enumeration.WorkInstructionType> | No | List of work instruction element types. |
| `workInstructionElements` | Array.<sap.dm.dme.pod2.api.workinstruction.WorkInstructionElement> | No | List of work instruction elements. |
