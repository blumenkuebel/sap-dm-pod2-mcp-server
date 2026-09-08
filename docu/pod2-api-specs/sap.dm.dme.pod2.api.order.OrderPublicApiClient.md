# OrderPublicApiClient

`sap.dm.dme.pod2.api.order.OrderPublicApiClient`

API client functions for the public v1 Order REST API.

A shared instance can be accessed by callers as `ApiClient.order`.

## Constructor

```
new OrderPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.FindOrdersRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Members

### v2 :sap.dm.dme.pod2.api.order.OrderV2PublicApiClient

## Methods

### (async) findOrders) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.order.FindOrdersResponse>}

Finds a list of orders for a given plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.FindOrdersRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.order.FindOrdersResponse> - Promise.<[sap.dm.dme.pod2.api.order.FindOrdersResponse](sap.dm.dme.pod2.api.order.md#.FindOrdersResponse)>

**See also:** [https://api.sap.com/api/sapdme_order/path/get_v1_orders_list](https://api.sap.com/api/sapdme_order/path/get_v1_orders_list)

### (async) getCustomFieldDefinitions) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.order.GetCustomFieldDefinitionsResponse>}

Retrieves a list of custom field definitions for the order by plant.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.GetCustomFieldDefinitionsRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.order.GetCustomFieldDefinitionsResponse> - Promise.<[sap.dm.dme.pod2.api.order.GetCustomFieldDefinitionsResponse](sap.dm.dme.pod2.api.order.md#.GetCustomFieldDefinitionsResponse)>

**See also:** [https://api.sap.com/api/sapdme_order/path/getCustomFieldDefinitions](https://api.sap.com/api/sapdme_order/path/getCustomFieldDefinitions)

### (async) getOrder) (oRequest, oOptionsopt) → {Promise.<sap.dm.dme.pod2.api.order.Order>}

Finds order data by plant and order.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.GetOrderRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<sap.dm.dme.pod2.api.order.Order> - Promise.<[sap.dm.dme.pod2.api.order.Order](sap.dm.dme.pod2.api.order.md#.Order)>

**See also:** [https://api.sap.com/api/sapdme_order/path/get_v1_orders](https://api.sap.com/api/sapdme_order/path/get_v1_orders)

### (async) updateCustomFieldValues) (oRequest, oOptionsopt) → {Promise.<void>}

Updates custom values for the given order.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.order.UpdateCustomValuesRequest | No | The request parameters. |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<void> - Promise.<void>

**See also:** [https://api.sap.com/api/sapdme_order/path/patch_v1_orders_customValues](https://api.sap.com/api/sapdme_order/path/patch_v1_orders_customValues)
