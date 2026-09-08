# BomPublicApiClient

`sap.dm.dme.pod2.api.bom.BomPublicApiClient`

## Constructor

```
new BomPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetBomsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getBoms) (oRequest, oOptionsopt) → {Promise.<Array.<GetBomsResponse>>}

Find BOM.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetBomsRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<GetBomsResponse>> - Promise.<Array.<GetBomsResponse>>

**See also:** [https://api.sap.com/api/sapdme_bom/path/findBomByPlantAndNameAndTypeUsingGET](https://api.sap.com/api/sapdme_bom/path/findBomByPlantAndNameAndTypeUsingGET)
