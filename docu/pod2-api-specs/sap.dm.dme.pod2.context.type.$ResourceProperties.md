# $ResourceProperties

`sap.dm.dme.pod2.context.type.$ResourceProperties`

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
