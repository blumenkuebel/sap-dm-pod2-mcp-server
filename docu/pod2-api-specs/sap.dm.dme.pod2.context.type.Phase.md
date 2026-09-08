# Phase

`sap.dm.dme.pod2.context.type.Phase`

An operation activity/phase in an order-based workflow.

**Extends:** [sap.dm.dme.pod2.context.type.BaseOperationWorkItem](sap.dm.dme.pod2.context.type.BaseOperationWorkItem.md)

**Implements:** [sap.dm.dme.pod2.context.type.$PhaseProperties](sap.dm.dme.pod2.context.type.$PhaseProperties.md)

## Constructor

```
new Phase (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityGroup` | string | Yes | Referred to as "operation" in process industry. |
| `stepId` | string | No |  |
| `workCenter` | string | Yes |  |
| `resource` | string | Yes |  |
| `quantity` | number | Yes |  |
| `quantityComplete` | number | Yes |  |
| `quantityInQueue` | number | Yes |  |
| `quantityInWork` | number | Yes |  |
| `scheduleStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `scheduleEndDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `statusNew` | boolean | No |  |
| `statusBypassed` | boolean | No |  |
| `statusInQueue` | boolean | No |  |
| `statusInQueueReject` | boolean | No |  |
| `statusInQueueRework` | boolean | No |  |
| `statusInWork` | boolean | No |  |
| `statusInWorkReject` | boolean | No |  |
| `statusInWorkRework` | boolean | No |  |
| `statusComplete` | boolean | No |  |
| `statusCompletePending` | boolean | No |  |
| `statusCompletePendingRework` | boolean | No |  |
| `statusCompletePendingReject` | boolean | No |  |
| `statusEmpty` | boolean | No |  |
| `description` | string | Yes |  |
| `actualStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `actualEndDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `userAuthorizedForWorkCenter` | boolean | No |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### getIdentifier () → {string}

Builds a composite key string for the work item to easily identify matching/duplicate items using a Set.

The exact format of the identifier string is subject to change, and should only be used for runtime
comparisons. The format is not guaranteed to be stable across versions and should not be persisted.

**Returns:** string - string

### getStatusCount () → {number}

Gets the number of statuses that are true for this operation activity.

**Returns:** number - number

### isActive () → {boolean}

Indicates if the operation activity/phase has any "active"/"in work" statuses.

**Returns:** boolean - boolean

### isComplete () → {boolean}

Indicates if the operation activity/phase has any "complete" statuses.

**Returns:** boolean - boolean

### isCompletePending () → {boolean}

Returns true if the status is Complete Pending, Complete Pending Rework, or Complete Pending Reject.

**Returns:** boolean - boolean

### isInQueue () → {boolean}

Indicates if the operation activity/phase has any "in queue" statuses.

**Returns:** boolean - boolean

### isInWork () → {boolean}

Returns true if the status is In Work, In Work Rework, or In Work Reject.

**Returns:** boolean - boolean

### isNewOrInQueue () → {boolean}

Returns true if the status is New, In Queue, In Queue Rework, or In Queue Reject.

**Returns:** boolean - boolean

### isOnlyCompletePending () → {boolean}

Returns true if the status is Complete Pending, Complete Pending Rework, or Complete Pending Reject and no
others.

**Returns:** boolean - boolean

### isOnlyInWork () → {boolean}

Returns true if the status is In Work, In Work Rework, or In Work Reject and no others.

**Returns:** boolean - boolean

### isOnlyNewOrInQueue () → {boolean}

Returns true if the status is New, In Queue, In Queue Rework, or In Queue Reject and no others.

**Returns:** boolean - boolean

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.Phase}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.worklist.Phase | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Phase - [sap.dm.dme.pod2.context.type.Phase](sap.dm.dme.pod2.context.type.Phase.md)
