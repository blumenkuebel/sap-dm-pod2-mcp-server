# OperationActivityMaster

`sap.dm.dme.pod2.context.type.OperationActivityMaster`

An operation activity (discrete industry) or phase (process industry).

This class represents the master data record for an operation activity/phase, not a specific item of work
(SFC/charge) at that activity/phase.

Not to be confused with an operation activity group/operation, which may consist of multiple operation
activities/phases.

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$OperationActivityMasterProperties](sap.dm.dme.pod2.context.type.$OperationActivityMasterProperties.md)

## Constructor

```
new OperationActivityMaster (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `operationActivity` | string | No | Referred to as "phase" in process industry. |
| `operationActivityVersion` | string | No |  |
| `currentVersion` | boolean | No |  |
| `description` | string | No |  |
| `operationActivityType` | "NORMAL_OPERATION" \| "SPECIAL_OPERATION" | No |  |
| `status` | sap.dm.dme.pod2.enumeration.OperationActivityStatus | No |  |
| `resourceType` | string | Yes |  |
| `defaultResource` | string | Yes |  |
| `workCenter` | string | Yes |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromApiResponse (oRecord) → {sap.dm.dme.pod2.context.type.OperationActivityMaster}

Alternate constructor with built-in mapping from the public or internal API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.operationactivity.OperationActivity | sap.dm.dme.pod2.api.internal.product.Operation | No |  |

**Returns:** sap.dm.dme.pod2.context.type.OperationActivityMaster - [sap.dm.dme.pod2.context.type.OperationActivityMaster](sap.dm.dme.pod2.context.type.OperationActivityMaster.md)
