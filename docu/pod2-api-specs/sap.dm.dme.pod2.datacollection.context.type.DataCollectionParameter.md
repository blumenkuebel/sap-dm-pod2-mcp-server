# DataCollectionParameter

`sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter`

**Extends:** [sap.dm.dme.pod2.context.PodContextObject](sap.dm.dme.pod2.context.PodContextObject.md)

**Implements:** [sap.dm.dme.pod2.datacollection.context.type.$DataCollectionParameterProperties](sap.dm.dme.pod2.datacollection.context.type.$DataCollectionParameterProperties.md)

## Constructor

```
new DataCollectionParameter (oProperties)
```

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `name` | string | No |  |
| `description` | string | No |  |
| `sequence` | number | No |  |
| `prompt` | string | Yes |  |
| `status` | "ENABLED" \| "DISABLED" | No |  |
| `type` | string | No |  |
| `targetValue` | number | Yes |  |
| `maxValue` | number | Yes |  |
| `minValue` | number | Yes |  |
| `unitOfMeasure` | string | Yes |  |
| `requiredDataEntries` | number | No |  |
| `trueValueName` | string | Yes |  |
| `falseValueName` | string | Yes |  |
| `listTypeDataField` | string | Yes |  |
| `nonConformanceCode` | string | Yes |  |
| `overrideMinMax` | boolean | No | Boolean value to indicate if override possible for min/max value. |
| `autoLogNonConformance` | boolean | No | Flag indicating if a nonconformance should be logged automatically. |
| `value` | string | Yes | The value entered for data collection. |
| `comment` | string | Yes |  |
| `attachments` | Array.<sap.dm.dme.pod2.datacollection.api.datacollection.ParameterAttachment> | Yes |  |
| `errorMessage` | string | Yes | The validation error message for the data collection parameter. |
| `isValidated` | boolean | Yes | Flag indicating if the parameter has been validated or not. |

## Members

### constructor :TypeOf.<sap.dm.dme.pod2.context.PodContextObject>

### (static) metadata :sap.dm.dme.pod2.context.PodContextObject.Metadata

## Methods

### (static) fromApiResponse (oRecord) → {sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter}

Alternate constructor with built-in mapping from the public API response.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oRecord` | sap.dm.dme.pod2.api.datacollection.DataCollectionParameter | No |  |

**Returns:** sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter - [sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter](sap.dm.dme.pod2.datacollection.context.type.DataCollectionParameter.md)
