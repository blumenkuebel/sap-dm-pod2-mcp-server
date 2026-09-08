# Pod

`sap.dm.dme.pod2.context.type.Pod`

Information about the current POD.

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.context.type.$PodProperties](sap.dm.dme.pod2.context.type.$PodProperties.md)

## Constructor

```
new Pod (oProperties)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oProperties` | sap.dm.dme.pod2.context.type.$PodProperties | No | An object that satisfies sap.dm.dme.pod2.context.type.$PodProperties |

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | string | No | The POD ID. |
| `description` | string | No | The POD description. |
| `dirty` | boolean | No | True if the current POD configuration has been modified since the last save. |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata
