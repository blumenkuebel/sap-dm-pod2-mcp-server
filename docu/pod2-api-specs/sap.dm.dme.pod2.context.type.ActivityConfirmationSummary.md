# ActivityConfirmationSummary

`sap.dm.dme.pod2.context.type.ActivityConfirmationSummary`

Represents an activity summary in the POD context.

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$ActivityConfirmationSummaryProperties](sap.dm.dme.pod2.context.type.$ActivityConfirmationSummaryProperties.md)

## Constructor

```
new ActivityConfirmationSummary (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$ActivityConfirmationSummaryProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$ActivityConfirmationSummaryProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `activityId` | string | No | The unique identifier for the activity. |
| `activityText` | string | No | The description or name of the activity. |
| `sequence` | number | No | The sequence number of the activity. |
| `actualQuantity` | number | No | The actual quantity processed. |
| `actualQuantityUom` | sap.dm.dme.pod2.context.type.UnitOfMeasure | No | The unit of measure of the actual quantity. |
| `targetQuantity` | number | No | The target quantity to be processed. |
| `targetQuantityUom` | sap.dm.dme.pod2.context.type.UnitOfMeasure | No | The unit of measure of the target quantity. |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.ActivityConfirmationSummary}

Alternate constructor with built-in mapping from the internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.activityconfirmation.ActivitySummary | No |  |

**Returns:** sap.dm.dme.pod2.context.type.ActivityConfirmationSummary - [sap.dm.dme.pod2.context.type.ActivityConfirmationSummary](sap.dm.dme.pod2.context.type.ActivityConfirmationSummary.md)
