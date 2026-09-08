# WorkListDelegate

`sap.dm.dme.pod2.context.data.WorkListDelegate`

Data delegate for modifiying properties of `ModelPath.WorkList`.

This class is responsible for refreshing the work list based on the selected filter values and loading new
pages as needed. The delegate will automatically subscribe to the notifications topics `SFC_START`,
`SFC_SIGNOFF`, and `SFC_COMPLETE` and refresh the list as needed.

## Constructor

```
new WorkListDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRefreshOptions` | sap.dm.dme.pod2.context.data.WorkListDelegate.RefreshOptions | Yes |  |

## Methods

### (async, static) fetchNextPage () → {Promise.<void>}

Fetch the next page of work list items and append them to the current work list.

The items fetched are determined by the current work list filter, and paging is determined by the number
of work list items that have already been fetched in combination with the `/workList/pageSize`
model property.

**Returns:** Promise.<void> - Promise.<void>

### (static) getLatestFilter () → {sap.dm.dme.pod2.context.WorkListFilter}

Returns the filter most recently used to refresh the work list.

**Returns:** sap.dm.dme.pod2.context.WorkListFilter - [sap.dm.dme.pod2.context.WorkListFilter](sap.dm.dme.pod2.context.WorkListFilter.md)

### (async, static) refresh) (oRefreshOptionsopt) → {Promise.<void>}

Performs a foreground work list refresh by clearing the work list and fetching the first page of items for
the current filters.

This function is typically called when the user clicks "Go" on the filter bar, via an Action, or when
the sorting criteria has been changed.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRefreshOptions` | sap.dm.dme.pod2.context.data.WorkListDelegate.RefreshOptions | Yes |  |

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refreshIfContainsSfc (aSfcs) → {Promise.<void>}

Refreshes the worklist only if it contains the given SFCs. If the worklist does not contain any of the given
SFCs, the worklist will not be refreshed.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aSfcs` | Array.<string> | No | List of SFCs to check for in the worklist. |

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refreshInBackground) (oRefreshOptionsopt) → {Promise.<void>}

Refresh the current work list items in the background, without clearing the list or showing busy indicators.

This function is typically called when a notification is received indicating that the work list contents are
stale (ie. if a different user processed an item).

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRefreshOptions` | sap.dm.dme.pod2.context.data.WorkListDelegate.BackgroundRefreshOptions | Yes |  |

**Returns:** Promise.<void> - Promise.<void>

### (async, static) refreshStaleSfcs (vSfcs) → {Promise.<void>}

Refreshes only the work list items known to be stale as specified by the caller. Unspecified work list items
will not be modified.

This function is generally preferred to `refreshIfContainsSfc` because an SFC could be pushed
out of the sorting order due to state changes, which could cause the work list item to "disappear".

Currently this behavior only supports work center and operation activity-based work list items. For order-
based work list items the call will be redirected to `refreshIfContainsSfc`.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `vSfcs` | string | Array.<string> | No | One or more SFCs to check for in the worklist. If present in the work list, the corresponding work list items will be refreshed. |

**Returns:** Promise.<void> - Promise.<void>

### BackgroundRefreshOptions ()

Work list fetch options for a background refresh in which the filter and sorting criteria have not changed.

### RefreshOptions ()

Work list fetch options for a foreground refresh which may have different filter or sorting criteria.

The sorting criteria will be based on the current value of `ModelPath.WorkListSorting`.
