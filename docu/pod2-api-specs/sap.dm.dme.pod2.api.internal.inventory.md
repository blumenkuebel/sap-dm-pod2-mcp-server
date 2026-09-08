# inventory

`sap.dm.dme.pod2.api.internal.inventory`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No | The batch ID. |
| `batchNumber` | string | No | The batch number. |
| `material` | string | No | The material ID. |
| `source` | sap.dm.dme.pod2.enumeration.BatchSource | No | The source of the batch. |
| `status` | sap.dm.dme.pod2.enumeration.BatchStatus | No | The status of the batch. |
| `erpSent` | boolean | No | Indicates if the batch has been sent to ERP. |
| `plant` | string | Yes | The plant ID. |
| `supplier` | string | Yes | The account number of the vendor. |
| `batchBySupplier` | string | Yes | The batch number provided by the vendor. |
| `countryOfOrigin` | string | Yes | An ISO country code that specifies the material's country of origin. It normally indicates in which country the material is manufactured. |
| `regionOfOrigin` | string | Yes | An ISO region code that specifies the material's region of origin. It normally indicates in which region the material is manufactured. |
| `classificationAssigned` | boolean | Yes | Indicates if the batch has a classification assigned. |
| `grUsed` | boolean | Yes | Indicates if Goods Receipt is used. |
| `restricted` | boolean | Yes | Indicates if the batch is in restricted-use. The default value is 'false'. |
| `manufacturingDateTime` | string | Yes | The manufacturing date and time. |
| `lastGoodsReceiptDateTime` | string | Yes | The last goods receipt date and time. |
| `shelfLifeExpirationDate` | string | Yes | The shelf life expiration date of the batch in UTC. Format (ISO-8601): yyyy-MM-dd'T'HH:mm:ss'Z'. |
| `batchAvailabilityDate` | string | Yes | The availability date of the batch. It indicates when the batch becomes available for use. Format (ISO-8601): yyyy-MM-dd |
| `createdDateTime` | string | No | The date and time when the batch was created. |
| `modifiedDateTime` | string | No | The date and time when the batch was last modified. |
