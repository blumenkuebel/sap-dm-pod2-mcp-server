# context

`sap.dm.dme.pod2.context`

## Members

### (static, constant) ModelPath :Enum.<string>

### (static, constant) PodContextMetadata :Map.<string, sap.dm.dme.pod2.context.PodContextMetadataEntry>

A Map of ModelPath to type metadata. The standard POD Context objects must always use the defined type object
to ensure predictable behavior for data that is shared between widgets.

The types are either a primitive-type string ("string"/"number"/"boolean") or a Class type. Values set to the
ModelPath indicated by the corresponding key are validated against the type specified in this map.

### PodContextMetadataEntry
