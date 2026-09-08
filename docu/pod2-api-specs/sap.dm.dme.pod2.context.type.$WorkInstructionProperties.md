# $WorkInstructionProperties

`sap.dm.dme.pod2.context.type.$WorkInstructionProperties`

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
