# $WorkCenterProperties

`sap.dm.dme.pod2.context.type.$WorkCenterProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No |  |
| `workCenter` | string | No |  |
| `description` | string | Yes |  |
| `category` | sap.dm.dme.pod2.enumeration.WorkCenterCategory | Yes |  |
| `status` | "ENABLED" \| "DISABLED" | Yes |  |
| `maxPeople` | number | Yes |  |
| `minPeople` | number | Yes |  |
| `createdAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `modifiedAtDate` | sap.ui.core.date.UI5Date \| Date | Yes |  |
| `customValues` | Object.<string, string> | Yes |  |
| `isErp` | boolean | Yes |  |
