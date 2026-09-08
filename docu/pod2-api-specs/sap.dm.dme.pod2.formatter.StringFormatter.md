# StringFormatter

`sap.dm.dme.pod2.formatter.StringFormatter`

General-purpose string formatters.

## Constructor

```
new StringFormatter ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aStrings` | Array.<string> | No |  |

## Methods

### (static) joinWithAnd (aStrings) → {string}

A locale-sensitive equivalent to `aStrings.join(", ")` with "and" before the last item (or the
locale equivalent).

For example, `Tuple<"a", "b", "c" >` becomes "a, b, and c" in most English locales.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aStrings` | Array.<string> | No |  |

**Returns:** string - string

### (static) joinWithOr (aStrings) → {string}

A locale-sensitive equivalent to `aStrings.join(", ")` with "or" before the last item (or the
locale equivalent).

For example, `Tuple<"a", "b", "c" >` becomes "a, b, or c" in most English locales.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `aStrings` | Array.<string> | No |  |

**Returns:** string - string

### (static) toUpperCase (sValue) → {string}

Converts a string to uppercase while preserving the lowercase eszett character (ß).

Unlike `String.prototype.toUpperCase()`, this method does not expand ß to SS,
which is required for ERP business object identifiers.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sValue` | string | No |  |

**Returns:** string - string
