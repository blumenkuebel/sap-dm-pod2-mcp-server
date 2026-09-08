# RoutingPublicApiClient

`sap.dm.dme.pod2.api.routing.RoutingPublicApiClient`

## Constructor

```
new RoutingPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.routing.GetRoutingRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

## Methods

### (async) getRouting) (oRequest, oOptionsopt) → {Promise.<(sap.dm.dme.pod2.api.routing.RoutingResponse|null)>}

Finds a routing by plant, routing name, routing type, and optional routing version.
If a version is not present, the current routing version will be returned.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.routing.GetRoutingRequest | No |  |
| `oOptions` | RequestInit | Yes |  |

**Returns:** Promise.<(sap.dm.dme.pod2.api.routing.RoutingResponse|null)> - Promise.<([sap.dm.dme.pod2.api.routing.RoutingResponse](sap.dm.dme.pod2.api.routing.md#.RoutingResponse)|null)>

**See also:** [https://api.sap.com/api/sapdme_routing/path/findRoutingByPlantAndNameAndTypeUsingGET_1](https://api.sap.com/api/sapdme_routing/path/findRoutingByPlantAndNameAndTypeUsingGET_1)
