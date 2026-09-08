# WorkInstructionDelegate

`sap.dm.dme.pod2.context.data.WorkInstructionDelegate`

Data delegate for modifying `ModelPath.WorkInstructions`.

This class is responsible for refreshing the work instruction list based on the selected operation activity
work item. The delegate will automatically subscribe to changes in the selected operation activity work item.

## Constructor

```
new WorkInstructionDelegate ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWorkInstructionId` | string | No | The work instruction ID to load elements for. |

## Methods

### (async, static) init () → {Promise.<void>}

Initial setup for the delegate, including PodContext subscriptions.

If the delegate has not yet been initialized this function will be called automatically when
`refresh` is first invoked.

**Returns:** Promise.<void> - Promise.<void>

### (async, static) loadWorkInstructionElements (sWorkInstructionId) → {Promise.<Array.<sap.dm.dme.pod2.context.type.WorkInstructionElement>>}

Loads work instruction elements for a specific work instruction on-demand.

This method is called when a user selects a work instruction for viewing,
loading only the elements for that specific work instruction instead of
loading all elements for all work instructions upfront.

This two-step loading approach (metadata first via findByContext with
skipWorkInstructionElementsReading, then elements on-demand) significantly
improves performance by avoiding large upfront data transfers (5MB+).

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sWorkInstructionId` | string | No | The work instruction ID to load elements for. |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.context.type.WorkInstructionElement>> - Promise.<Array.<[sap.dm.dme.pod2.context.type.WorkInstructionElement](sap.dm.dme.pod2.context.type.WorkInstructionElement.md)>>

### (async, static) refresh) (oOptionsopt) → {Promise.<void>}

Refreshes the work instructions.

The loading state is set immediately before fetching data, allowing the UI to display a loading indicator
while keeping any existing data visible until new data arrives. This provides better user experience
by showing immediate feedback without a jarring blank state.

Race condition handling: If a refresh is called while another is pending, the previous request is cancelled
via AbortController and the new request takes precedence ("last one wins"). Stale responses are discarded
using request ID tracking to ensure only the most recent data is displayed.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `request` | sap.dm.dme.pod2.api.internal.workinstruction.FindByContextRequest | Yes | Optional request object to use for fetching work instructions. If not provided, a request object will be created based on the current POD Context. |
| `force` | boolean | Yes | Refresh the data even if the request information has not changed. |

**Returns:** Promise.<void> - Promise.<void>
