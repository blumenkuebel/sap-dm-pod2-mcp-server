# StatusIcon Control

## Overview

`sap.dm.dme.pod2.control.StatusIcon` is a custom UI5 control that extends `sap.ui.core.Icon` to visually represent SFC (Shop Floor Control) status codes in the worklist. It automatically binds icon, color, and tooltip based on the SFC status.

## Module Path

```
sap/dm/dme/pod2/control/StatusIcon
```

## Dependencies

| Module | Purpose |
|--------|---------|
| `sap/ui/core/library` | Base `Icon` control |
| `sap/ui/core/theming/Parameters` | Theme-aware colors |
| `sap/dm/dme/pod2/context/PodContext` | i18n text retrieval |
| `sap/dm/dme/pod2/context/type/Sfc` | Status code to status key mapping |
| `sap/dm/dme/pod2/enumeration/SFCStatusCode` | Status code constants |

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bindPath` | `string` | `null` | The OData model path to bind the status code from (e.g., `sfcStatusCode`) |

## Metadata

```js
metadata: {
    dnd: {
        draggable: true,
        droppable: true
    },
    properties: {
        bindPath: {
            type: "string",
            group: "Other",
            defaultValue: null
        }
    }
}
```

## Status Mapping

### Icons

| SFC Status Code | Icon URI | Visual |
|-----------------|----------|--------|
| `NEW` | `sap-icon://rhombus-milestone-2` | ◇ Diamond/Rhombus |
| `IN_QUEUE` | `sap-icon://circle-task-2` | ◎ Circle |
| `ACTIVE` | `sap-icon://color-fill` | ■ Filled square |
| `HOLD` | `sap-icon://status-negative` | ✗ Negative/Error |
| `SCRAPPED` | `sap-icon://status-negative` | ✗ Negative/Error |
| `COMPLETED` | `sap-icon://complete` | ✓ Checkmark |
| `MULTIPLE` | `sap-icon://overflow` | ⋯ Overflow dots |
| *Unknown/Other* | `sap-icon://question-mark` | ? Question mark |

### Colors (Theme-Aware)

| SFC Status Code | Theme Parameter | Typical Color |
|-----------------|-----------------|---------------|
| `NEW` | `sapNeutralColor` | Grey |
| `IN_QUEUE` | `sapInformativeColor` | Blue |
| `ACTIVE` | `sapPositiveColor` | Green |
| `COMPLETED` | `sapPositiveColor` | Green |
| `HOLD` | `sapNegativeColor` | Red |
| `SCRAPPED` | `sapNegativeColor` | Red |
| `MULTIPLE` | `sapInformativeColor` | Blue |
| *Unknown/Other* | *(empty string)* | Default/inherit |

### Tooltips (i18n)

Tooltips are resolved via `PodContext.getI18nText()` using the pattern:

```
status.sfc.<STATUS_KEY>
```

Where `<STATUS_KEY>` is derived from `Sfc.sfcStatusCodeToStatusKey(statusCode)`. If the status code is unknown, the key `status.sfc.UNKNOWN` is used.

## Usage in XML Views

```xml
<core:StatusIcon
    xmlns:core="sap.dm.dme.pod2.control"
    bindPath="{sfcStatusCode}" />
```

> **Note:** The control automatically strips the curly braces `{}` from the `bindPath` value during construction if they are present.

## How It Works

1. **Construction**: When instantiated, the control parses the `bindPath` and strips any binding syntax (`{...}`)
2. **Property Binding**: It creates three property bindings (`src`, `color`, `tooltip`) all pointing to the same model path but with different formatters
3. **Formatters**: Each formatter maps the raw status code string to the appropriate visual representation
4. **Theming**: Colors are resolved at runtime via `sap/ui/core/theming/Parameters.get()`, ensuring they adapt when themes change

## Internal Architecture

```
StatusIcon (extends sap.ui.core.Icon)
│
├── bindProperty("src")     → formatter: statusCode → icon URI
├── bindProperty("color")   → formatter: statusCode → theme color
└── bindProperty("tooltip") → formatter: statusCode → i18n text
```

## Drag & Drop Support

The control has drag & drop enabled in its metadata:
```js
dnd: {
    draggable: true,
    droppable: true
}
```

This allows the StatusIcon to participate in drag-and-drop interactions within the worklist (e.g., reordering or moving SFCs).

## Related Enumerations

See `sap/dm/dme/pod2/enumeration/SFCStatusCode` for the full list of status code constants:
- `NEW`
- `IN_QUEUE`
- `ACTIVE`
- `HOLD`
- `SCRAPPED`
- `COMPLETED`
- `MULTIPLE`

## Related Documentation

- [Worklist Data Structure](./worklist-data-structure.md)
- [Enumerations Reference](./enumerations-reference.md)
- [Widget Patterns](./widget-patterns.md)