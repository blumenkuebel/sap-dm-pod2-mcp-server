# AssemblyPublicApiClient

`sap.dm.dme.pod2.api.assembly.AssemblyPublicApiClient`

## Constructor

```
new AssemblyPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | AssembleComponentRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) assembleComponent) (oRequest, oOptionsopt) → {Promise.<object>}

Adds a component.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | AssembleComponentRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<object> - Promise.<object>

**See also:** [https://api.sap.com/api/sapdme_assembly/resource/post_assembledComponents](https://api.sap.com/api/sapdme_assembly/resource/post_assembledComponents)

### (async) getAssembledComponents) (oRequest, oOptionsopt) → {Promise.<Array.<GetAssembledComponentsResponse>>}

Retrieves the components already assembled.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetAssembledComponentsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<GetAssembledComponentsResponse>> - Promise.<Array.<GetAssembledComponentsResponse>>

**See also:** [https://api.sap.com/api/sapdme_assembly/path/get_assembledComponents](https://api.sap.com/api/sapdme_assembly/path/get_assembledComponents)

### (async) getPlannedComponents) (oRequest, oOptionsopt) → {Promise.<Array.<GetPlannedComponentsResponse>>}

Retrieves the planned component list.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetPlannedComponentsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<GetPlannedComponentsResponse>> - Promise.<Array.<GetPlannedComponentsResponse>>

**See also:** [https://api.sap.com/api/sapdme_assembly/path/get_plannedComponents](https://api.sap.com/api/sapdme_assembly/path/get_plannedComponents)
