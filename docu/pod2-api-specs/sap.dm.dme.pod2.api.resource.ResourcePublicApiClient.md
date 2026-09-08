# ResourcePublicApiClient

`sap.dm.dme.pod2.api.resource.ResourcePublicApiClient`

## Constructor

```
new ResourcePublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.resource.GetResourceTypesRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getResourceTypes) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.resource.ResourceType>>}

Gets the resource types for a plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.resource.GetResourceTypesRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.resource.ResourceType>> - Promise.<Array.<[sap.dm.dme.pod2.api.resource.ResourceType](sap.dm.dme.pod2.api.resource.md#.ResourceType)>>

**See also:** [https://api.sap.com/api/sapdme_resourcetype/path/readUsingGET](https://api.sap.com/api/sapdme_resourcetype/path/readUsingGET)

### (async) getResources) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.resource.Resource>>}

Gets the resources for a plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.resource.GetResourcesRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.resource.Resource>> - Promise.<Array.<[sap.dm.dme.pod2.api.resource.Resource](sap.dm.dme.pod2.api.resource.md#.Resource)>>

**See also:** [https://api.sap.com/api/sapdme_plant_resource_v2/path/getResourcesUsingGET_1](https://api.sap.com/api/sapdme_plant_resource_v2/path/getResourcesUsingGET_1)
