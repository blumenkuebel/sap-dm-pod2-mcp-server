# Routing

`sap.dm.dme.pod2.context.type.Routing`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$RoutingProperties](sap.dm.dme.pod2.context.type.$RoutingProperties.md)

## Constructor

```
new Routing (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `routing` | string | No |  |
| `routingType` | sap.dm.dme.pod2.enumeration.RoutingType | No | Routing type using the one-letter type code as per the RoutingType enum. |
| `routingVersion` | string | No |  |
| `currentVersion` | boolean | No |  |
| `description` | string | No |  |
| `status` | sap.dm.dme.pod2.enumeration.RoutingStatus | No |  |
| `relaxedFlow` | boolean | No |  |
| `entryRoutingStep` | string | No |  |
| `temporaryRouter` | boolean | No |  |
| `taskListType` | string | No |  |
| `hasBeenReleased` | boolean | No |  |
| `erpAutoGr` | boolean | No |  |
| `quantityValidation` | boolean | No |  |
| `modifiedAtDate` | Date | Yes |  |
| `createdAtDate` | Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromInternalODataResponse (oRecord) → {sap.dm.dme.pod2.context.type.Routing}

Alternate constructor with built-in mapping from the internal OData response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.internal.product.ODataRouting | No |  |

**Returns:** sap.dm.dme.pod2.context.type.Routing - [sap.dm.dme.pod2.context.type.Routing](sap.dm.dme.pod2.context.type.Routing.md)
