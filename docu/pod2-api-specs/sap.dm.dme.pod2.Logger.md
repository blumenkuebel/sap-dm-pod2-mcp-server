# Logger

`sap.dm.dme.pod2.Logger`

## Members

### (static) LevelNames :Object.<number, string>

Map of log level names by log level value.

### (static) Level :Enum.<number>

Enumeration for log levels.

## Methods

### debug) (sMessage, …aArgsopt)

Logs a message if the log level is set to DEBUG or higher.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### error) (sMessage, …aArgsopt)

Logs a message if the log level is set to ERROR or higher.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### fatal) (sMessage, …aArgsopt)

Logs a message if the log level is set to FATAL or higher.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### info) (sMessage, …aArgsopt)

Logs a message if the log level is set to INFO or higher.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### trace) (sMessage, …aArgsopt)

Logs a message if the log level is set to TRACE or ALL.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### warn) (sMessage, …aArgsopt)

Logs a message if the log level is set to WARN or higher.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sMessage` | string | No |  |
| `aArgs` | any | Yes | Additional values to include with the logged message |

### (static) getLogger (sComponent) → {sap.dm.dme.pod2.Logger}

Returns a logger instance for the given component. If a logger for the given sComponent path already exists,
it will be reused.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sComponent` | string | No | The module path for which to get the logger |

**Returns:** sap.dm.dme.pod2.Logger - [sap.dm.dme.pod2.Logger](sap.dm.dme.pod2.Logger.md)
