# NumberFormatter

`sap.dm.dme.pod2.formatter.NumberFormatter`

Utility class for number formatting operations.

## Constructor

```
new NumberFormatter ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fValue` | number | No | The value to format. Must be a number. |
| `oOptions` | sap.dm.dme.pod2.formatter.NumberFormatter.NumberFormatOptions | Yes | Formatting options. |

## Methods

### (static) formatFloat) (fValue, oOptionsopt) → {string}

Formats a floating-point number for the current locale.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `fValue` | number | No | The value to format. Must be a number. |
| `oOptions` | sap.dm.dme.pod2.formatter.NumberFormatter.NumberFormatOptions | Yes | Formatting options. |

**Returns:** string - string

**Example:**

```javascript
NumberFormatter.formatFloat(1234.56); // Returns "1,234.560"NumberFormatter.formatFloat(1234.56, { maxFractionDigits: 2 }); // Returns "1,234.56"
```

### (static) formatInteger (iValue) → {string}

Formats an integer for the current locale.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `iValue` | number | No | The value to format. Must be a number. |

**Returns:** string - string

### (static) formatQuantity, oOptionsopt) (nValue, sUomopt, oOptionsopt) → {string}

Converts input data (number) into a locale-based formatted string based on UOM and format options
passed. Only the formatted value is included in the output.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `nValue` | number | No | Value to format. Must be a number (already parsed if originally a string). |
| `sUom` | string | Yes | Unit of measurement (e.g., EA, KG). |
| `oOptions` | sap.dm.dme.pod2.formatter.NumberFormatter.NumberFormatOptions | Yes | Format options object. If the UOM indicates a whole number type unit (each, pieces, etc.) then zero fraction digits will be used and this parameter will be ignored. |

**Returns:** string - string

### (static) formatQuantityWithUom, oOptionsopt) (nValue, sUomopt, oOptionsopt) → {string}

Converts input data (number) into a locale-based formatted string based on UOM and format options
passed. Both the value and unit of measure are included in the output.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `nValue` | number | No | Value to format. Must be a number (already parsed if originally a string). |
| `sUom` | string | Yes | Unit of measurement (e.g., EA, KG). |
| `oOptions` | sap.dm.dme.pod2.formatter.NumberFormatter.NumberFormatOptions | Yes | Format options object. If the UOM indicates a whole number type unit (each, pieces, etc.) then zero fraction digits will be used and this parameter will be ignored. |

**Returns:** string - string

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
