# ApiError

`sap.dm.dme.pod2.api.ApiError`

An error thrown by the API client when a request fails.

## Constructor

```
new ApiError (oOptions, oErrorOptionsopt)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `message` | string | No |  |
| `status` | number | Yes |  |
| `body` | any | Yes |  |
| `headers` | Headers | Yes |  |

## Members

### body :any

The response body.

### headers :Headers

The response headers.

### status :number

The HTTP response status code.
