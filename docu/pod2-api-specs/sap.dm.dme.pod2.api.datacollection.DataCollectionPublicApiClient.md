# DataCollectionPublicApiClient

`sap.dm.dme.pod2.api.datacollection.DataCollectionPublicApiClient`

## Constructor

```
new DataCollectionPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getDataCollectionGroups) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsResponse>>}

Gets the data collection groups for an SFC.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsResponse>> - Promise.<Array.<[sap.dm.dme.pod2.api.datacollection.GetDataCollectionGroupsResponse](sap.dm.dme.pod2.api.datacollection.md#.GetDataCollectionGroupsResponse)>>

**See also:** [https://api.sap.com/api/sapdme_datacollection/path/findDataCollectionGroupsUsingGET](https://api.sap.com/api/sapdme_datacollection/path/findDataCollectionGroupsUsingGET)

### (async) logDataCollectionGroup) (oRequest, oOptionsopt) → {Promise.<object>}

Logs parameters for a data collection group.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.datacollection.LogDataCollectionGroupRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<object> - Promise.<object>

**See also:** [https://api.sap.com/api/sapdme_datacollection/path/logDataCollectionUsingPOST](https://api.sap.com/api/sapdme_datacollection/path/logDataCollectionUsingPOST)
