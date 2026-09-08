# SfcPublicApiClient

`sap.dm.dme.pod2.api.sfc.SfcPublicApiClient`

Public API for the Shop Floor Control Production Activities.

## Constructor

```
new SfcPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.GetSfcDataRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getSfcData) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.sfc.SfcDataResponse>}

Retrieves SFC data based on either the SFC ID or the serial number.
Returns the status, BOM, quantity, order, material, routing, and routing steps of the SFC.
Either `sfc` or `serialNumber` must be provided in the request.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.GetSfcDataRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.SfcDataResponse> - Promise.<[sap.dm.dme.pod2.api.sfc.SfcDataResponse](sap.dm.dme.pod2.api.sfc.md#.SfcDataResponse)>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/get_sfcData](https://api.sap.com/api/sapdme_sfc/path/get_sfcData)

### (async) getSfcDetail) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.sfc.SfcDetail>}

Gets SFC detail by plant and SFC.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.GetSfcDetailRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.SfcDetail> - Promise.<[sap.dm.dme.pod2.api.sfc.SfcDetail](sap.dm.dme.pod2.api.sfc.md#.SfcDetail)>

**See also:** [https://help.sap.com/docs/sap-digital-manufacturing/apis/shop-floor-control-production-activities](https://help.sap.com/docs/sap-digital-manufacturing/apis/shop-floor-control-production-activities)

### (async) getSfcs) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.sfc.SfcListItem>>}

Retrieves a SFC centric work list and its children SFC steps.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.GetSfcsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.sfc.SfcListItem>> - Promise.<Array.<[sap.dm.dme.pod2.api.sfc.SfcListItem](sap.dm.dme.pod2.api.sfc.md#.SfcListItem)>>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/getSfcWorkListUsingGET](https://api.sap.com/api/sapdme_sfc/path/getSfcWorkListUsingGET)

### (async) getSfcsCount) (oRequest, oOptionsopt) → {Promise.<number>}

Retrieves the number of SFCs in the work list matching the provided criteria.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.GetSfcsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<number> - Promise.<number>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/getSfcWorkListCountUsingGET](https://api.sap.com/api/sapdme_sfc/path/getSfcWorkListCountUsingGET)

### (async) sfcComplete (oRequest) → {Promise.<sap.dm.dme.pod2.api.sfc.SfcCompleteResponse>}

Completes an SFC.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.SfcCompleteRequest | No | The request parameters. |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.SfcCompleteResponse> - Promise.<[sap.dm.dme.pod2.api.sfc.SfcCompleteResponse](sap.dm.dme.pod2.api.sfc.md#.SfcCompleteResponse)>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/post_sfcs_complete](https://api.sap.com/api/sapdme_sfc/path/post_sfcs_complete)

### (async) sfcSignoff (oRequest) → {Promise.<sap.dm.dme.pod2.api.sfc.SfcSignoffResponse>}

Signoff one or more SFCs at an operation activity and resource.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.SfcSignoffRequest | No | The request parameters. |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.SfcSignoffResponse> - Promise.<[sap.dm.dme.pod2.api.sfc.SfcSignoffResponse](sap.dm.dme.pod2.api.sfc.md#.SfcSignoffResponse)>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/post_sfcs_signoff](https://api.sap.com/api/sapdme_sfc/path/post_sfcs_signoff)

### (async) sfcStart (oRequest) → {Promise.<sap.dm.dme.pod2.api.sfc.SfcStartResponse>}

Starts one or more SFCs at an operation activity and resource.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.SfcStartRequest | No | The start SFC request object. |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.SfcStartResponse> - Promise.<[sap.dm.dme.pod2.api.sfc.SfcStartResponse](sap.dm.dme.pod2.api.sfc.md#.SfcStartResponse)>

**See also:** [https://api.sap.com/api/sapdme_sfc/path/post_sfcs_start](https://api.sap.com/api/sapdme_sfc/path/post_sfcs_start)

### (async) updateSfcBatch (oRequest) → {Promise.<sap.dm.dme.pod2.api.sfc.UpdateSfcBatchResponse>}

Update SFC default batch ID with a given batch ID. The given batch ID is checked for validity against valid
batch IDs based on the SFC material.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.sfc.UpdateSfcBatchRequest | No | The request parameters. |

**Returns:** Promise.<sap.dm.dme.pod2.api.sfc.UpdateSfcBatchResponse> - Promise.<[sap.dm.dme.pod2.api.sfc.UpdateSfcBatchResponse](sap.dm.dme.pod2.api.sfc.md#.UpdateSfcBatchResponse)>

**See also:** [https://api.sap.com/api/sapdme_sfc/resource/createPodConfigurationUsingPOST](https://api.sap.com/api/sapdme_sfc/resource/createPodConfigurationUsingPOST)

**See also:** [https://api.sap.com/api/sapdme_sfc/overview](https://api.sap.com/api/sapdme_sfc/overview)
