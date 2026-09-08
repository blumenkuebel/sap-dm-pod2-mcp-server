# DataFieldsPublicApiClient

`sap.dm.dme.pod2.api.datafields.DataFieldsPublicApiClient`

## Constructor

```
new DataFieldsPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datafields.GetDataFieldsRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

## Methods

### (async) getDataFieldsOptions) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.datafields.PageDataFieldResponse>}

Gets paginated list of data fields by plant

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datafields.GetDataFieldsRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

**Returns:** Promise.<sap.dm.dme.pod2.api.datafields.PageDataFieldResponse> - Promise.<[sap.dm.dme.pod2.api.datafields.PageDataFieldResponse](sap.dm.dme.pod2.api.datafields.md#.PageDataFieldResponse)>

**See also:** [https://api.sap.com/api/sapdme_datafields/path/getDataFields](https://api.sap.com/api/sapdme_datafields/path/getDataFields)
