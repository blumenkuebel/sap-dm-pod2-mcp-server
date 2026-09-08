# workinstruction

`sap.dm.dme.pod2.api.internal.workinstruction`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sfcs` | Array.<sap.dm.dme.pod2.api.internal.SfcId> | Yes | List of SFC names for the work instructions search. |
| `operations` | Array.<Partial.<sap.dm.dme.pod2.api.internal.OperationId>> | Yes | List of operation names for the work instructions search. The operation activity version is optional. |
| `resource` | sap.dm.dme.pod2.api.internal.plant.ResourceId | Yes | Resource name for the work instructions search. |
| `routing` | sap.dm.dme.pod2.api.internal.product.RoutingId | Yes | Routing for the work instructions search. |
| `routingStep` | sap.dm.dme.pod2.api.internal.product.RoutingStepId | Yes | Routing step for the work instructions search. |
| `skipWorkInstructionElementsReading` | boolean | Yes | When true, skips loading work instruction element data for performance optimization. The response will contain metadata (id, workInstruction, version, etc.) and a types array (summary of element types), but workInstructionElements will be empty. Elements can be loaded on-demand via findWorkInstructionElements() when needed. This significantly reduces response size (from 5MB+ to a few KB) when listing many work instructions. |
