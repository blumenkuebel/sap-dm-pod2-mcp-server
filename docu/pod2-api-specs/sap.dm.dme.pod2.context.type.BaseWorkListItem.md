# BaseWorkListItem

`sap.dm.dme.pod2.context.type.BaseWorkListItem`

Common properties and functions which are shared across work list item types.

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

## Constructor

```
new BaseWorkListItem ()
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sfc` | string | No | The SFC ID. |
| `material` | string | No |  |
| `materialDescription` | string | No |  |
| `materialVersion` | string | No |  |
| `routing` | string | No |  |
| `routingVersion` | string | No |  |
| `routingType` | sap.dm.dme.pod2.enumeration.RoutingType | No |  |
| `order` | string | No |  |
| `orderBatchNumber` | string | Yes |  |
| `sfcBatchNumber` | string | Yes |  |
| `sfcStatusCode` | sap.dm.dme.pod2.enumeration.SFCStatusCode | No |  |
| `sfcStatusDescription` | string | Yes |  |
| `sfcQuantity` | number | Yes |  |
| `orderPlannedStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `orderScheduledStartDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customFields` | Object.<string, string> | No |  |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (abstract) (abstract) getIdentifier () → {string}

Builds a composite key string for the work list item to easily identify matching/duplicate items using a Set.

The exact format of the identifier string is subject to change, and should only be used for runtime
comparisons. The format is not guaranteed to be stable across versions and should not be persisted.

**Returns:** string - string

### validate ()

Override to validate against the SFCStatusCode enum.
