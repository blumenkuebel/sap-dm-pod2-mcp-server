# ActivityConfirmationDelegate

`sap.dm.dme.pod2.context.data.ActivityConfirmationDelegate`

Data delegate for managing activity confirmations and summaries.

## Constructor

```
new ActivityConfirmationDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `force` | boolean | Yes | Force refresh even if request is unchanged. |
| `clear` | boolean | Yes | Clear the list before refreshing. This ensures that no stale data is shown while the new data is being fetched. |

## Methods

### (async, static) refreshActivitySummaries) (oOptionsopt) → {Promise.<void>}

Fetches activity summaries for the last selected operation and work list item.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `force` | boolean | Yes | Force refresh even if request is unchanged. |
| `clear` | boolean | Yes | Clear the list before refreshing. This ensures that no stale data is shown while the new data is being fetched. |

**Returns:** Promise.<void> - Promise.<void>
