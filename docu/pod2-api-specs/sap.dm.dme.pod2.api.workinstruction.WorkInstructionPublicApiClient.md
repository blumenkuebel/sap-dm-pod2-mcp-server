# WorkInstructionPublicApiClient

`sap.dm.dme.pod2.api.workinstruction.WorkInstructionPublicApiClient`

## Constructor

```
new WorkInstructionPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.workinstruction.GetAttachedWorkInstructionsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getAttachedWorkInstructions) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.workinstruction.AttachedWorkInstruction>>}

Retrieves the list of work instructions based on the passed context. Reference to at least one of the objects
should be passed apart from the plant. API returns empty list if only plant is provided. When SFC is provided
as a parameter then list of attached work instructions is determined based on current SFC state.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.workinstruction.GetAttachedWorkInstructionsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.workinstruction.AttachedWorkInstruction>> - Promise.<Array.<[sap.dm.dme.pod2.api.workinstruction.AttachedWorkInstruction](sap.dm.dme.pod2.api.workinstruction.md#.AttachedWorkInstruction)>>

**See also:** [https://api.sap.com/api/sapdme_workinstruction/path/get_v1_attachedworkinstructions](https://api.sap.com/api/sapdme_workinstruction/path/get_v1_attachedworkinstructions)

### (async) getWorkInstructions) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.workinstruction.WorkInstruction>>}

Reads a work instruction based on the passed key fields - plant, work instruction name, and work instruction
version.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.workinstruction.GetWorkInstructionsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.workinstruction.WorkInstruction>> - Promise.<Array.<[sap.dm.dme.pod2.api.workinstruction.WorkInstruction](sap.dm.dme.pod2.api.workinstruction.md#.WorkInstruction)>>

**See also:** [https://api.sap.com/api/sapdme_workinstruction/path/get_v1_workinstructions](https://api.sap.com/api/sapdme_workinstruction/path/get_v1_workinstructions)
