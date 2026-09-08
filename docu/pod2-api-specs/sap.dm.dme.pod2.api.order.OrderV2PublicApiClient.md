# OrderV2PublicApiClient

`sap.dm.dme.pod2.api.order.OrderV2PublicApiClient`

API client functions for the public v2 Order REST API.

A shared instance can be accessed by callers as `ApiClient.order.v2`.

## Constructor

```
new OrderV2PublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.v2.GetOrderRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getOrder) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.order.v2.Order>}

Finds order data by plant and order using the v2 API.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.v2.GetOrderRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.order.v2.Order> - Promise.<[sap.dm.dme.pod2.api.order.v2.Order](sap.dm.dme.pod2.api.order.v2.md#.Order)>

**See also:** [https://api.sap.com/api/sapdme_order_v2](https://api.sap.com/api/sapdme_order_v2)
