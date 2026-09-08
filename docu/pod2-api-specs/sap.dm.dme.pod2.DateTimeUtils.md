# DateTimeUtils

`sap.dm.dme.pod2.DateTimeUtils`

Utility class for date and time operations in the plant time zone.

## Constructor

```
new DateTimeUtils ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oDate` | sap.ui.core.date.UI5Date | Date | Yes | A UI5Date or window.Date object. JS Date objects will be converted to a UI5Date object which considers the plant time zone. If omitted, the current date is used. |

## Methods

### (static) endOfDay) (oDateopt) → {sap.ui.core.date.UI5Date|Date}

Get a UI5Date object for 23:59:59.999 in the plant time zone for the given day.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oDate` | sap.ui.core.date.UI5Date | Date | Yes | A UI5Date or window.Date object. JS Date objects will be converted to a UI5Date object which considers the plant time zone. If omitted, the current date is used. |

**Returns:** sap.ui.core.date.UI5Date|Date - sap.ui.core.date.UI5Date |  Date

### (static) fromODataDateString (sDate) → {Date|sap.ui.core.date.UI5Date|null}

Converts an OData date string ("/Date(1623668012060)/") to a JavaScript UI5Date object. If parsing fails,
null will be returned.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sDate` | string | No |  |

**Returns:** Date|sap.ui.core.date.UI5Date|null - Date |  sap.ui.core.date.UI5Date |  null

### (static) now () → {sap.ui.core.date.UI5Date|Date}

Returns a `UI5Date` object representing the current date and time in the plant's timezone.

This function or `UI5Date.getInstance()` must be used in place of `new Date()`
in all cases where the time zone is relevant.

**Returns:** sap.ui.core.date.UI5Date|Date - sap.ui.core.date.UI5Date |  Date

### (static) startOfDay) (oDateopt) → {sap.ui.core.date.UI5Date|Date}

Get a UI5Date object for 00:00:00.000 in the plant time zone for the given day.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oDate` | sap.ui.core.date.UI5Date | Date | Yes | A UI5Date or window.Date object. JS Date objects will be converted to a UI5Date object which considers the plant time zone. If omitted, the current date is used. |

**Returns:** sap.ui.core.date.UI5Date|Date - sap.ui.core.date.UI5Date |  Date
