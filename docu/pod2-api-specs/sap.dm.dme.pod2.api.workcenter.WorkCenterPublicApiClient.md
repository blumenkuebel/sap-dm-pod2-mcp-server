# WorkCenterPublicApiClient

`sap.dm.dme.pod2.api.workcenter.WorkCenterPublicApiClient`

## Constructor

```
new WorkCenterPublicApiClient ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.workcenter.GetWorkCentersRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

## Methods

### (async) getWorkCenters) (oRequest, oOptionsopt) → {Promise.<Array.<sap.dm.dme.pod2.api.workcenter.WorkCenter>>}

Gets the work centers matching the provided criteria.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRequest` | sap.dm.dme.pod2.api.workcenter.GetWorkCentersRequest | No |  |
| `oOptions` | RequestInit | Yes | @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit |

**Returns:** Promise.<Array.<sap.dm.dme.pod2.api.workcenter.WorkCenter>> - Promise.<Array.<[sap.dm.dme.pod2.api.workcenter.WorkCenter](sap.dm.dme.pod2.api.workcenter.md#.WorkCenter)>>

**See also:** [https://api.sap.com/api/sapdme_plant_workCenter_v2/path/getWorkCentersUsingGET_1](https://api.sap.com/api/sapdme_plant_workCenter_v2/path/getWorkCentersUsingGET_1)
