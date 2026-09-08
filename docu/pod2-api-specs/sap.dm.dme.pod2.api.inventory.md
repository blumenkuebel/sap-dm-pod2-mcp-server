# inventory

`sap.dm.dme.pod2.api.inventory`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `batchNumber` | string | No | The batch number of the stock |
| `handlingUnit` | string | No | The handling unit number of the innermost package |
| `inventoryId` | string | No | The inventory ID of the stock |
| `inventoryIds` | Array.<string> | No | The inventory IDs of the stocks. You can query a maximum of 50 inventory IDs at one time. |
| `material` | string | No | The material of the stock |
| `materialVersion` | string | No | The material version of the stock |
| `plant` | string | No | The plant of the stock |
| `productionSupplyArea` | string | No | The production supply area of the stock |
| `reservedOperation` | string | No | The operation for which the stock is reserved |
| `reservedOrder` | string | No | The order for which the stock is reserved |
| `serialNumber` | string | No | The serial number of the stock |
| `stockRetrieveScope` | string | No | Specify if you want to retrieve stocks with zero quantity. A stock with zero quantity includes but is not limited to stock that once exists in the system, but have zero on-hand quantity due to various reasons. There are 3 possible options:  'ALL': all stock lines are displayed, including stocks with or without non-zero quantity; 'NO_ZERO_STOCK' (default): only stocks with non-zero quantity are displayed; 'ZERO_STOCK': only stocks with zero quantity are displayed. |
| `batchesWithStatus` | boolean | No | Determines whether the restricted status is enabled in the 'status' property. If set to 'true', the status can be one of the following: 'UNRESTRICTED', 'RESTRICTED', 'QUALITY_INSPECTION' or 'BLOCKED'. If set to 'false' (default), the status can be 'AVAILABLE', 'HOLD' or 'QUARANTINE'. We recommend setting it to 'true' for greater flexibility and improved usability. Default value : false |
| `status` | Array.<string> | No | The status of the stock. The stock has different statuses depending on the value of the 'batchesWithStatus' property. If the ‘batchesWithStatus’ property is not provided or set to 'false' (default), there are 3 possible statuses (To be deprecated): 'AVAILABLE', 'HOLD' or 'QUARANTINE'. If the 'batchesWithStatus' property is set to 'true', there are 4 possible statuses:  'UNRESTRICTED': It corresponds to 'AVAILABLE'. 'RESTRICTED': It also corresponds to 'AVAILABLE'. 'QUALITY_INSPECTION': It corresponds to 'QUARANTINE'. 'BLOCKED': It corresponds to 'HOLD'. |
| `storageBin` | string | No | The storage bin where the stock is stored at the production supply area |
| `storageLocation` | string | No | The storage location of the inventory |
| `salesOrder` | string | No | The sales order for which the stock is allocated or delivered. |
| `salesOrderItem` | string | No | The sales order item for which the stock is allocated or delivered. If you provide the salesOrderItem, you also need to specify the salesOrder. |
| `page` | number | No | The page number you want to query. Number 0 is the first page. |
| `size` | number | No | The page size determines how many stocks are displayed in one page. Default page size is 20. |
| `sort` | string | No | The retrieved stocks can be sorted by using one or more of the following fields: 'inventoryId', 'storageLocation', 'productionSupplyArea', 'storageBin', 'handlingUnit', 'batchNumber' and 'serialNumber'. For example, https:///inventory/v1/inventories?plant=&sort=inventoryId,asc&sort=productionSupplyArea,desc. |
