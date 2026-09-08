# $DataCollectionGroupProperties

`sap.dm.dme.pod2.datacollection.context.type.$DataCollectionGroupProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `group` | string | No |  |
| `description` | string | No |  |
| `version` | string | No |  |
| `status` | sap.dm.dme.pod2.datacollection.enumeration.DataCollectionGroupStatus | No |  |
| `current` | boolean | No | Indicates if data collection group's version is current. |
| `parameters` | Array.<sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter> | No | Data collection parameters. |
| `allDataCollected` | boolean | No | Indicates if all data collection parameters have been collected. |
| `timesProcessed` | number | No | Number of times the data collection group has been processed. |
| `hasDataCollected` | boolean | No | Indicates if any data has been collected for this group. |
| `measuredCount` | number | No | The count of measured data points. |
| `allowMultipleCollection` | boolean | No | Allow multiple data collection. |
| `passFailGroup` | boolean | No | Indicates if a data collection group is a pass fail group. |
| `passFailNumber` | number | Yes | Specifies how many normal parameters of the data collection group must have values outside the minimum or maximum limits to fail this data collection group. |
| `sfc` | string | No |  |
| `order` | string | No |  |
| `resource` | string | No |  |
| `workCenter` | string | No |  |
| `operationActivity` | string | No |  |
| `operationActivityVersion` | string | No |  |
| `stepId` | string | No |  |
| `routing` | string | No |  |
| `routingVersion` | string | No |  |
