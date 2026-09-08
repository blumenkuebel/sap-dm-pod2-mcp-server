# Resource

`sap.dm.dme.pod2.context.type.Resource`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$ResourceProperties](sap.dm.dme.pod2.context.type.$ResourceProperties.md)

## Constructor

```
new Resource (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `resource` | string | No |  |
| `description` | string | No |  |
| `status` | sap.dm.dme.pod2.enumeration.ResourceStatus | No |  |
| `resourceTypes` | Array.<sap.dm.dme.pod2.context.type.ResourceType> | Yes |  |
| `processResource` | boolean | Yes |  |
| `pendingStatus` | string | Yes |  |
| `resourceReasonCodeRef` | string | Yes |  |
| `pendingResourceReasonCode` | string | Yes |  |
| `setupState` | string | Yes |  |
| `efficiency` | number | Yes |  |
| `sfcLimit` | number | Yes |  |
| `immediateStatusChange` | boolean | Yes |  |
| `inQueueCapacity` | number | Yes |  |
| `outQueueCapacity` | number | Yes |  |
| `inQueueManagement` | string | Yes |  |
| `outQueueManagement` | string | Yes |  |
| `erpInternalId` | string | Yes |  |
| `erpCapacityCategory` | string | Yes |  |
| `forceDispatch` | boolean | Yes |  |
| `requestItem` | string | Yes |  |
| `defaultEngine` | string | Yes |  |
| `createdAtDate` | Date | Yes |  |
| `modifiedAtDate` | Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |
| `workCenter` | string | Yes | The work center this resource is a member of. Not all APIs provide this information, so it should be validated and coalesced via API call on an as-needed basis. |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.Resource}

Alternate constructor with built-in mapping from the internal OData response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.plant.Resource | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Resource - [sap.dm.dme.pod2.context.type.Resource](sap.dm.dme.pod2.context.type.Resource.md)
