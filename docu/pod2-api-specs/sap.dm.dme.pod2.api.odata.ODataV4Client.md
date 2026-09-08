# ODataV4Client

`sap.dm.dme.pod2.api.odata.ODataV4Client`

Functions for fetching data from OData V4 services.

For all MDO entity sets, see
https://help.sap.com/docs/sap-digital-manufacturing/insights/manufacturing-data-objects

## Constructor

```
new ODataV4Client (sServiceUrl, iMaxPageopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sServiceUrl` | string | No | The base URL for the OData service. |
| `iMaxPage` | number | Yes | The maximum number of records to return in a single request. This value may be enforced by the OData service, and should be set accordingly. |

## Methods

### getAllPages, oOptionsopt) (sPath, oODataParamsopt, oOptionsopt) → {Promise.<Array.<any>>}

Gets all records for the specified entity set. This may result in multiple requests to the server due to the
configured maximum page size.

This method may fetch a large amount of data, and should be used with caution. Ensure that appropriate
filters are used where possible.

For example, to get all work centers in plant 1010:

   const oMdoClient = ODataV4Client.getMdoClient();
   const aAllWorkcenters = await oMdoClient.getAllPages("/Workcenter", {
       $filter: "Plant eq '1010' and IsDeleted eq 'false'",
       $select: 'Plant,Workcenter,Description',
       $orderby: 'Workcenter'
   });

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the OData entity set, ie. "/Workcenter". |
| `oODataParams` | sap.dm.dme.pod2.api.odata.ODataV4Client.ODataParameters | Yes | A map of URL parameters, for example { $top: 10, $skip: 0 } |
| `oOptions` | RequestInit | Yes | See [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) |

**Returns:** Promise.<Array.<any>> - Promise.<Array.<any>>

### getByKey, oOptionsopt) (sPath, oPredicateMap, oQueryParamsopt, oOptionsopt) → {Promise.<any>}

Fetches a single entry from the OData service.

For example, to make a request to `/Workcenter(Plant='1010',Workcenter='MIXING')`:

   const oMdoClient = ODataV4Client.getMdoClient();
   const oWorkcenter = oMdoClient.getByKey("/Workcenter", { Plant: "1010", Workcenter: "MIXING" });

If you already have a complete URL, use [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) instead.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the OData entity set, ie. "/Workcenter". |
| `oPredicateMap` | Object.<string, string> | No | A map of key-value pairs used to build the key predicate portion of the OData URL. |
| `oQueryParams` | object | Yes | See [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) |
| `oOptions` | RequestInit | Yes | See [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) |

**Returns:** Promise.<any> - Promise.<any>

### getCount) (sPath, oODataParams, oOptionsopt) → {Promise.<number>}

Gets the $count for an OData entity set.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the OData entity set, ie. "/Workcenter". |
| `oODataParams` | sap.dm.dme.pod2.api.odata.ODataV4Client.ODataParameters | No | A map of URL parameters, for example { $filter: "Plant eq '1010'" }. |
| `oOptions` | RequestInit | Yes | See [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) |

**Returns:** Promise.<number> - Promise.<number>

### (async) getPage) (sPath, oODataParams, oOptionsopt) → {Promise.<Tuple.<Array, number>>}

Gets a single page of records for the specified OData entity set.

For example, to fetch page 5, at 50 records per page:

   const oMdoClient = ODataV4Client.getMdoClient();
   const aAllWorkcenters = await oMdoClient.getPage("/Workcenter", {
       $top: 50,
       $skip: 200,
       $filter: "Plant eq '1010' and IsDeleted eq 'false'",
       $select: 'Plant,Workcenter,Description',
       $orderby: 'Workcenter'
   });

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the OData entity set, ie. "/Workcenter". |
| `oODataParams` | sap.dm.dme.pod2.api.odata.ODataV4Client.ODataParameters | No | A map of URL parameters, for example { $top: 10, $skip: 0 }. "$top" must be provided. |
| `oOptions` | RequestInit | Yes | See [sap.dm.dme.pod2.api.RestClient.get](sap.dm.dme.pod2.api.RestClient.md#.get) |

**Returns:** Promise.<Tuple.<Array, number>> - Promise.<Tuple.<Array, number>>

### (static) getOrderBy (aSorting) → {string}

Converts a normalized sorting array to an OData $orderby string.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSorting` | Array.<sap.dm.dme.pod2.widget.core.TableWidget.Sorting> | No |  |

**Returns:** string - string

### ODataParameters ()

OData query parameters.
