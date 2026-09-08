# MaterialPublicApiClient

`sap.dm.dme.pod2.api.material.MaterialPublicApiClient`

## Constructor

```
new MaterialPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetMaterialsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getMaterials) (oRequest, oOptionsopt) → {Promise.<Tuple.<Array.<GetMaterialsResponse>, number>>}

Finds materials by plant; or by plant and material; or by plant, material, and version.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetMaterialsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Tuple.<Array.<GetMaterialsResponse>, number>> - Promise.<Tuple.<Array.<GetMaterialsResponse>, number>>

**See also:** [https://api.sap.com/api/sapdme_material/path/findMaterialsByPlantUsingGET_2](https://api.sap.com/api/sapdme_material/path/findMaterialsByPlantUsingGET_2)
