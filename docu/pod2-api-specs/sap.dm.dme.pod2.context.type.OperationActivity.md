# OperationActivity

`sap.dm.dme.pod2.context.type.OperationActivity`

An operation activity/phase in a work center workflow.

**Extends:** [sap.dm.dme.pod2.context.type.BaseOperationWorkItem](sap.dm.dme.pod2.context.type.BaseOperationWorkItem.md)

**Implements:** [sap.dm.dme.pod2.context.type.$OperationActivityProperties](sap.dm.dme.pod2.context.type.$OperationActivityProperties.md)

## Constructor

```
new OperationActivity (oProperties)
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
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityVersion` | string | No |  |
| `stepDescription` | string | Yes |  |
| `routing` | string | No |  |
| `routingVersion` | string | No |  |
| `routingSequence` | number | Yes |  |
| `routingType` | string | Yes |  |
| `resourceType` | string | Yes |  |
| `sfc` | string | No | Referred to as "charge" in process industry. |
| `sfcStepHandle` | string | Yes |  |
| `material` | string | No |  |
| `materialVersion` | string | No |  |
| `info` | string | Yes |  |
| `display` | boolean | No |  |
| `previouslyStarted` | boolean | No |  |
| `priority` | string | No |  |
| `processLot` | string | Yes |  |
| `quantityCompletePending` | number | Yes |  |
| `quantityReject` | number | Yes |  |
| `queuedDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `dueDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `plannedEndDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `plannedStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `opSplitId` | number | Yes |  |
| `reworkFlag` | string | Yes |  |
| `splitId` | string | Yes |  |
| `splitQuantity` | number | Yes |  |
| `laboredOperators` | Array.<string> | Yes |  |

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

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.OperationActivity}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.worklist.OperationActivity | No |  |

**Returns:** sap.dm.dme.pod2.context.type.OperationActivity - [sap.dm.dme.pod2.context.type.OperationActivity](sap.dm.dme.pod2.context.type.OperationActivity.md)
