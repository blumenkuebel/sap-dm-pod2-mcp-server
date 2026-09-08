# Filter

`sap.dm.dme.pod2.notification.Filter`

A class to create simple or logical filters

## Constructor

```
new Filter ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the property in the message object, using dot notation. |
| `sValue` | string | No | The value to compare against. |

## Members

### ComparisonOperator :Enum.<string>

ComparisonOperator

### LogicalOperator :Enum.<string>

LogicalOperator

## Methods

### (static) equals (sPath, sValue) → {ComparisonFilter}

Create a filter with an equals condition

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sPath` | string | No | The path to the property in the message object, using dot notation. |
| `sValue` | string | No | The value to compare against. |

**Returns:** ComparisonFilter - ComparisonFilter

### AbstractFilter ()

Represents a filter which can either be a comparison filter or a logical filter.

### ComparisonFilter ()

A simple comparison filter to apply a condition to a property value. This is used to filter messages based on
specific criteria. An example of a comparison filter is: { op: "EQ", path: "plant", value: "1010" }.

If the object is nested, you can use dot notation to access the property, for example:
{ op: "EQ", path: "address.city", value: "Waterloo" }
will match with the object:
{ address: { city: "Waterloo" } }
but will not match
{ address: { city: "Kitchener" } } nor { address: "Waterloo" }.

### LogicalFilter ()

A logical filter composed of multiple sub-filters to apply 'and' or 'or' logic. This is used to combine
multiple comparison filters. An example of a logical filter is:
{ op: "AND", filters: [
{ op: "EQ", path: "plant", value: "1010" },
{ op: "EQ", path: "status", value: "active" }
] }
