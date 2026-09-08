# UomPublicApiClient

`sap.dm.dme.pod2.api.uom.UomPublicApiClient`

## Constructor

```
new UomPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetUomRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getUom) (oRequest, oOptionsopt) → {Promise.<GetUomResponse>}

Get a unit of measure using unitCode.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetUomRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<GetUomResponse> - Promise.<GetUomResponse>

**See also:** [https://api.sap.com/api/sapdme_uom/path/getUomUsingGET_2](https://api.sap.com/api/sapdme_uom/path/getUomUsingGET_2)
