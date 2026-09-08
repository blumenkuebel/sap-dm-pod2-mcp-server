# processengine

`sap.dm.dme.pod2.api.internal.processengine`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `key` | string | No | The key of the production process definition to start. |
| `async` | boolean | No | Indicates if the production process should be started asynchronously. If true, then after the production process is started the call will return immediately with the process information. If false, then the call will wait until the production process is completed and return the result returned by the production process. |
| `triggerFrom` | string | No | Which system triggered the process. For PODs this is always "pod". |
| `passUserId` | boolean | No | Causes Process Engine to pass user ID in the request header to DME services. For PODs this is always set to true. |
| `sourceName` | string | No | The name of the source system that triggered the process. For PODs this is the name of the POD. |
| `parameters` | Object.<string, any> | Yes | Parameters to be passed to the production process. |
