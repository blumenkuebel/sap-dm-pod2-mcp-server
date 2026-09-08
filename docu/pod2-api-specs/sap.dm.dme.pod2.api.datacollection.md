# datacollection

`sap.dm.dme.pod2.api.datacollection`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `allowMultipleCollection` | boolean | No | Allow multiple data collection. |
| `current` | boolean | No | Indicates if data collection group's version is current. |
| `description` | string | No | he description of the data collection group. |
| `group` | string | No | This data collection group's name. |
| `parameters` | Array.<sap.dm.dme.pod2.api.datacollection.DataCollectionParameter> | No | Data collection parameters. |
| `passFailGroup` | boolean | No | Indicates if a data collection group is a pass fail group. |
| `passFailNumber` | number | Yes | Specifies how many normal parameters of the data collection group must have values outside the minimum or maximum limits to fail this data collection group. |
| `plant` | string | No | The plant. |
| `status` | string | No | The data collection group's status. |
| `step` | Object | No | The The routing step where data is collected. |
| `version` | string | No | The data collection group's version. |
