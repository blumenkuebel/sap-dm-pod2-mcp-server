# DataTypePublicApiClient

`sap.dm.dme.pod2.api.datatype.DataTypePublicApiClient`

## Constructor

```
new DataTypePublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datatype.GetDataTypesRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

## Methods

### (async) getDataTypes) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.datatype.PageDataTypeResponse>}

Gets a paginated list of data types by plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datatype.GetDataTypesRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

**Returns:** Promise.<sap.dm.dme.pod2.api.datatype.PageDataTypeResponse> - Promise.<[sap.dm.dme.pod2.api.datatype.PageDataTypeResponse](sap.dm.dme.pod2.api.datatype.md#.PageDataTypeResponse)>

**See also:** [https://api.sap.com/api/sapdme_datatype/path/getDataTypes](https://api.sap.com/api/sapdme_datatype/path/getDataTypes)
