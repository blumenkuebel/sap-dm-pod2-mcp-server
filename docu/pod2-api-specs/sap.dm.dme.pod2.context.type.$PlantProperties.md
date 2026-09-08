# $PlantProperties

`sap.dm.dme.pod2.context.type.$PlantProperties`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `plant` | string | No | The plant ID. |
| `description` | string | No | The plant description. |
| `createdDateTime` | number | No | The date and time the plant was created, as a Unix timestamp. |
| `modifiedDateTime` | number | No | The date and time the plant was last modified, as a Unix timestamp. |
| `timeZone` | string | No | The time zone of the plant, in IANA format (e.g. "America/Los_Angeles"). |
| `isLocal` | boolean | No |  |
| `erpTimeZone` | string | No | The ERP system's time zone, in IANA format (e.g. "America/Los_Angeles"). |
| `integrationMode` | string | No | The integration mode of the plant e.g. S4HANA_CLOUD. |
| `erpLanguage` | string | No | The ERP system's language. |
| `erpDestination` | string | Yes | The name of the destination configured in the SAP Cloud Platform for connecting to the ERP system. |
| `ewmDestination` | string | Yes | The name of the destination configured in the SAP Cloud Platform for connecting to the EWM system. |
| `ewmProgramId` | string | Yes | The program ID for the EWM system. |
| `eccLogicalSystem` | string | Yes | The ECC logical system name. |
| `client` | string | Yes | The client number of the ERP system. |
| `miiSystem` | string | Yes | The MII system name. |
| `meSystem` | string | No | The Manufacturing Execution system name. |
| `industryType` | string | No | The industry type: "DISCRETE", "PROCESS". |
| `fsmScenarioZero` | boolean | No | Whether FSM is enabled for the plant. |
| `materialUpversion` | boolean | No | Whether material upversion is enabled for the plant. |
