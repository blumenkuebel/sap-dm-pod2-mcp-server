# RestClient

`sap.dm.dme.pod2.api.RestClient`

A simple REST client for making HTTP requests which:

Adds necessary Digital Manufacturing headers.
Handles CSRF tokens.
Handles session timeouts.
Handles error responses.

## Constructor

```
new RestClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

## Methods

### (static) delete) (sUrl, oOptionsopt) → {Promise.<any>}

Make a DELETE request.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

### (async, static) fetch) (sUrl, oOptionsopt) → {Promise.<any>}

Custom fetch method that adds the necessary Digital Manufacturing headers.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

**See also:** [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

### (static) get, oOptionsopt) (sUrl, oQueryParamsopt, oOptionsopt) → {Promise.<any>}

Make a GET request with query parameters.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `oQueryParams` | object | Yes |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

### (static) patch) (sUrl, vRequestBody, oOptionsopt) → {Promise.<any>}

Make a PATCH request, defaulting to "application/json" if not set in oOptions.headers and stringifying
vRequestBody if it is not already a string.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `vRequestBody` | object | string | FormData | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

### (static) post) (sUrl, vRequestBody, oOptionsopt) → {Promise.<any>}

Make a POST request, defaulting to "application/json" if not set in oOptions.headers and stringifying
vRequestBody if it is not already a string.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `vRequestBody` | object | string | FormData | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

### (static) put) (sUrl, vRequestBody, oOptionsopt) → {Promise.<any>}

Make a PUT request, defaulting to "application/json" if not set in oOptions.headers and stringifying
vRequestBody if it is not already a string.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sUrl` | string | No |  |
| `vRequestBody` | object | string | FormData | No |  |
| `oOptions` | sap.dm.dme.pod2.api.RestClientRequestInit | Yes |  |

**Returns:** Promise.<any> - Promise.<any>

### FullResponse ()
