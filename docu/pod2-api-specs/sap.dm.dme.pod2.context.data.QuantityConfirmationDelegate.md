# QuantityConfirmationDelegate

`sap.dm.dme.pod2.context.data.QuantityConfirmationDelegate`

Data delegate for modifiying `ModelPath.ReportedQuantityItems`.

This class is responsible for refreshing the reported quantities based on the selected worklist item.

## Constructor

```
new QuantityConfirmationDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `abortPendingRequest` | boolean | Yes | If true, aborts any pending request in favor of sending a new one. Otherwise, the pending request is allowed to complete and the new request is skipped. |
| `page` | number | Yes | The page number to fetch. If not provided, defaults to 0. |
| `size` | number | Yes | The number of items to fetch per page. If not provided, defaults to 20. |
| `force` | boolean | Yes | Use true to force a refresh even if the last refresh was recent. If not provided then defaults to false. |

## Methods

### (async, static) fetchNextPage () → {Promise.<void>}

Fetches the next page of reported quantities based on the current page size.

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refresh) (oOptionsopt) → {Promise.<void>}

Refreshes the list of reported quantities based on the selected work list item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `abortPendingRequest` | boolean | Yes | If true, aborts any pending request in favor of sending a new one. Otherwise, the pending request is allowed to complete and the new request is skipped. |
| `page` | number | Yes | The page number to fetch. If not provided, defaults to 0. |
| `size` | number | Yes | The number of items to fetch per page. If not provided, defaults to 20. |
| `force` | boolean | Yes | Use true to force a refresh even if the last refresh was recent. If not provided then defaults to false. |

**Returns:** Promise.<void> - Promise.<void>
