# PodContextVariable

`sap.dm.dme.pod2.context.PodContextVariable`

Provides methods to get the values of variables from the POD context. These variables can be used in input
parameter configurations to reference dynamic values from the POD context. The values of these variables are
determined at runtime based on the current state of the POD context such as the currently selected work list
item, filter values, etc. It encapsulates fallback logic to accommodate different POD layouts and workflows.

## Constructor

```
new PodContextVariable ()
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `material` | string | No | The material name. |
| `version` | string | No | The material version. |
