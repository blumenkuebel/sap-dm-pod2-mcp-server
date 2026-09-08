# NumberFormatter

`sap.dm.dme.pod2.datacollection.formatter.NumberFormatter`

Utility class for number formatting operations.

## Constructor

```
new NumberFormatter ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fValue` | number | No | The value to format. Must be a number. |
| `oOptions` | NumberFormatOptions | Yes | Formatting options. |

## Methods

### (static) formatFloat) (fValue, oOptionsopt) → {string}

Formats a floating-point number for the current locale.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fValue` | number | No | The value to format. Must be a number. |
| `oOptions` | NumberFormatOptions | Yes | Formatting options. |

**Returns:** string - string

**Example:**

```javascript
NumberFormatter.formatFloat(1234.56); // Returns "1,234.560"NumberFormatter.formatFloat(1234.56, { maxFractionDigits: 2 }); // Returns "1,234.56"
```

### (static) parse (sValue) → {number}

Parses a number string for the current locale.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sValue` | string | No | The value to parse. |

**Returns:** number - number

**Example:**

```javascript
NumberFormatter.parse("1,234.56"); // Returns 1234.56NumberFormatter.parse("invalid"); // Returns NaN
```

### NumberFormatOptions ()
