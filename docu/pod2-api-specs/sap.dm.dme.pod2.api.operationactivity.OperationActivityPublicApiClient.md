# OperationActivityPublicApiClient

`sap.dm.dme.pod2.api.operationactivity.OperationActivityPublicApiClient`

## Constructor

```
new OperationActivityPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.operationactivity.GetOperationActivitiesRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getOperationActivities) (oRequest, oOptionsopt) → {Promise.<Tuple.<Array.<sap.dm.dme.pod2.api.operationactivity.OperationActivity>, number>>}

Gets the operation activities matching the provided criteria and paging.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.operationactivity.GetOperationActivitiesRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Tuple.<Array.<sap.dm.dme.pod2.api.operationactivity.OperationActivity>, number>> - Promise.<Tuple.<Array.<[sap.dm.dme.pod2.api.operationactivity.OperationActivity](sap.dm.dme.pod2.api.operationactivity.md#.OperationActivity)>, number>>

**See also:** [https://api.sap.com/api/sapdme_operationactivity/path/read](https://api.sap.com/api/sapdme_operationactivity/path/read)
