# ProcessOrderPublicApiClient

`sap.dm.dme.pod2.api.processorder.ProcessOrderPublicApiClient`

## Constructor

```
new ProcessOrderPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetGoodsIssueSummaryRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getGoodsIssueSummary) (oRequest, oOptionsopt) → {Promise.<GetGoodsIssueSummaryResponse>}

Goods Issue Summary

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GetGoodsIssueSummaryRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<GetGoodsIssueSummaryResponse> - Promise.<GetGoodsIssueSummaryResponse>

**See also:** [https://api.sap.com/api/sapdme_processorder/path/goodsSummaryV2](https://api.sap.com/api/sapdme_processorder/path/goodsSummaryV2)

### (async) goodsIssue) (oRequest, oOptionsopt) → {Promise.<GoodsIssueResponse>}

Performs goods issue.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | GoodsIssueRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<GoodsIssueResponse> - Promise.<GoodsIssueResponse>

**See also:** [https://api.sap.com/api/sapdme_processorder/path/post_v1_goodsissue](https://api.sap.com/api/sapdme_processorder/path/post_v1_goodsissue)
