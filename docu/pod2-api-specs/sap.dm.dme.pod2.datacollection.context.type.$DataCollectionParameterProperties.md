# $DataCollectionParameterProperties

`sap.dm.dme.pod2.datacollection.context.type.$DataCollectionParameterProperties`

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
