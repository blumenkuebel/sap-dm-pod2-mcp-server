# SAP Digital Manufacturing API Reference

**Version**: 1.1.0  
**Last Updated**: 2026-08-05  
**API Specs Location**: [sap-dm-api-specs/](sap-dm-api-specs/)

This document provides a comprehensive reference to all SAP Digital Manufacturing REST APIs available for POD plugin integration.

---

## 📋 Table of Contents

1. [Use-Case → Service Index](#use-case--service-index)
2. [Overview](#overview)
3. [Authentication & Base URLs](#authentication--base-urls)
4. [Core Production APIs](#core-production-apis)
5. [Material & BOM APIs](#material--bom-apis)
6. [Data Collection & Quality APIs](#data-collection--quality-apis)
7. [Inventory & Logistics APIs](#inventory--logistics-apis)
8. [Process Manufacturing APIs](#process-manufacturing-apis)
9. [Configuration & Master Data APIs](#configuration--master-data-apis)
10. [Integration & Document APIs](#integration--document-apis)
11. [Issue Resolution & Problem Solving APIs](#issue-resolution--problem-solving-apis)
12. [OEE Analytics APIs](#oee-analytics-apis)
13. [Manufacturing Data Object (MDO) APIs](#manufacturing-data-object-mdo-apis)
14. [Common Patterns & Examples](#common-patterns--examples)

---

## Use-Case → Service Index

Quick lookup: **"I need to do X — which API/service?"**. Use this table to jump straight to the right service before diving into specs.

### Production Execution

| Use Case | Service | Key Endpoint | Spec File |
|----------|---------|--------------|-----------|
| Read SFC details (status, qty, route) | `sfc` | `GET /sfcs?plant=&sfc=` | `sapdme_sfc.json` |
| Start SFC at operation/resource | `sfc` | `POST /sfcs/start` | `sapdme_sfc.json` |
| Complete SFC at operation | `sfc` | `POST /sfcs/complete` | `sapdme_sfc.json` |
| Split / merge / scrap SFC | `sfc` | `POST /sfcs/split \| /merge \| /scrap` | `sapdme_sfc.json` |
| Serialize / relabel SFC | `sfc` | `POST /sfcs/serialize \| /relabel` | `sapdme_sfc.json` |
| Read order details | `order` | `GET /v1/orders` | `sapdme_order.json` |
| List orders with filters | `order` | `GET /v1/orders/list` | `sapdme_order.json` |
| Release order for production | `order` | `POST /v1/orders/release` | `sapdme_order.json` |
| Update order custom values | `order` | `PATCH /v1/orders/customValues` | `sapdme_order.json` |
| Book quantity confirmation (yield/scrap/rework) | `quantityConfirmation` | `POST /quantityConfirmation/v1/...` | `sapdme_quantityConfirmation.json` |
| Confirm activity (labor) on SFC | `activityConfirmation` | `POST /activity/v1/...` | `sapdme_activityConfirmation.json` |
| Read operation/activity master data | `operation` / `operationactivity` | `GET /operation/v1/...` | `sapdme_operation.json` |
| Comprehensive production operations (v2) | `production_v2` | `/production/v2/*` | `sapdme_production_v2.json` |

### Assembly & Components

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Assemble component to SFC | `assembly` | `sapdme_assembly.json` |
| Unassemble / replace component | `assembly` | `sapdme_assembly.json` |
| Read BOM for material | `bom` | `sapdme_bom.json` |
| Read routing (operation sequence) | `routing` | `sapdme_routing.json` |

### Material Master & Inventory

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Read / search materials | `material` | `sapdme_material.json` |
| Manage material groups | `materialgroup` | `sapdme_materialgroup.json` |
| Manage batches & traceability | `batch` | `sapdme_batch.json` (v2) |
| Inventory levels and movements | `inventory` | `sapdme_inventory.json` (v2) |
| Stage materials for operation | `staging` | `sapdme_staging.json` (v2) |
| Logistics & movements | `logistics` | `sapdme_logistics.json` |
| Manage packing units | `packingunit` | `sapdme_packingunit.json` |
| Track WIP inventory | `wip` | `sapdme_wip.json` |

### Data Collection & Quality

| Use Case | Service | Key Endpoint | Spec File |
|----------|---------|--------------|-----------|
| Log data collection (in-WIP) | `datacollection` | `POST /log` | `sapdme_datacollection.json` |
| Log standalone data collection (non-WIP) | `datacollection` | `POST /standalone/log` | `sapdme_datacollection.json` |
| Read DC group definitions | `datacollection` | `GET /dataCollectionGroups` | `sapdme_datacollection.json` |
| Create / update quality inspection | `qualityinspection` | `/qualityinspection/v1/...` | `sapdme_qualityinspection.json` |
| Report nonconformance (defect) | `nonconformance` | `/nonconformance/v1/...` | `sapdme_nonconformance.json` |
| Manage NC codes / groups | `nonconformancecode` / `nonconformancegroup` | — | `sapdme_nonconformancecode.json` |
| Electronic Batch Records (EBR) | `ebr` | `/ebr/v1/...` | `sapdme_ebr.json` |
| Classification (characteristics) | `classification` | `/classification/v1/...` | `sapdme_classification.json` |
| Custom data fields / types | `datafields` / `datatype` | — | `sapdme_datafields.json` |

### Process Manufacturing

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Manage process orders | `processorder` | `sapdme_processorder.json` (v2) |
| Manage process lots | `processlot` | `sapdme_processlot.json` (v2) |
| Define recipes | `recipe` | `sapdme_recipe.json` |
| Recipe execution order | `reo` | `sapdme_reo.json` |
| Equipment setpoints | `setpoint_v3` | `sapdme_setpoint_v3.json` |
| General process manufacturing | `process_manufacturing` | `sapdme_process_manufacturing.json` |

### Resources, Tools, Work Centers

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Manage plant master data | `plant` | `sapdme_plant.json` |
| Define resources (machines) | `plant_resource_v2` | `sapdme_plant_resource_v2.json` |
| Manage work centers | `plant_workcenter_v2` | `sapdme_plant_workcenter_v2.json` |
| Resource types | `resourcetype` | `sapdme_resourcetype.json` |
| Manage tools | `tool` | `sapdme_tool.json` (v2) |
| Plant certifications | `plant_certification` | `sapdme_plant_certification.json` |
| Asset models | `asset_model` | `sapdme_asset_model.json` |

### Users, Shifts, Labor

| Use Case | Service | Spec File |
|----------|---------|-----------|
| User accounts & permissions | `user` | `sapdme_user.json` |
| Production shifts & calendars | `shift` | `sapdme_shift.json` |
| Labor time tracking | `labor` | `sapdme_labor.json` |
| Workforce skill profiles (OData V4) | `labors` | `sapdme_labors.json` |
| Time tracking (attendance, direct/indirect labor) | `timetracking` / `timetracking_odata` | `sapdme_timetracking.json` |

### Configuration & Master Data

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Import / export POD configuration | `pod` | `sapdme_pod.json` |
| Manage Units of Measure | `uom` | `sapdme_uom.json` |
| Configure number ranges | `numbering` | `sapdme_numbering.json` |
| Standard rates / values | `standardrate` / `standardvalue` | `sapdme_standardrate.json` |
| Mark "last" indicator on items | `lastindicator` | `sapdme_lastindicator.json` |

### Documents, Print, Notification

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Attach documents (files) to entities | `document_v2` | `sapfnd_document_v2.json` |
| Work instructions on operations | `workinstruction` | `sapdme_workinstruction.json` |
| Print labels / documents | `print` | `sapfnd_print.json` |
| Manage printers | `printer` | `sapfnd_printer.json` |
| Send / receive integration messages | `integrationMessage` | `sapdme_integrationMessage.json` |
| User notifications | `notification` | `sapdme_notification.json` |
| Electronic signatures (OData V4) | `signature` | `sapfnd_signature.json` |
| Alerts (OData V4) | `alerts` | `sapdme_alerts.json` |

### Issue Resolution

| Use Case | Service | Spec File |
|----------|---------|-----------|
| Create / read shop-floor issues | `issues` (OData V4) | `sapdme_issues.json` |
| Problem-solving processes (8D / custom) | `psp` (OData V4) | `sapdme_psp.json` |

### OEE, Analytics

| Use Case | Service | Spec File |
|----------|---------|-----------|
| OEE metrics & reason codes | `oee` | `sapdme_oee.json` |
| OEE analytics (KPIs, availability, downtime) | `oee_analytics` (Swagger 2.0) | `sapdmi_vishleshki.json` |

### Analytics & Reporting (read-only)

| Use Case | Service | Spec File |
|----------|---------|-----------|
| **Bulk read for analytics / reporting (53 entities, OData V4)** | `MDO Extractor` | see `sap-dm-mdo-specs/index.md` |
| Read ORDER, SFC, MATERIAL, BOM, ROUTING, OEE, DOWNTIME, NON_CONFORMANCE … in bulk | `MDO Extractor` | `dmci/v4/extractor/` |

> 💡 **Tip:** For analytical / reporting queries (filters, joins, aggregations) use the **MDO Extractor** (`list_mdo_entities`, `get_mdo_entity`). For transactional operations (start, complete, confirm) use the regular REST APIs above.

---

## Overview

SAP Digital Manufacturing provides 77+ REST APIs covering all aspects of manufacturing execution. These APIs use OAuth 2.0 authentication and follow consistent patterns for requests and responses.

### API Categories

| Category | Count | Examples |
|----------|-------|----------|
| Production Execution | 15 | SFC, Orders, Operations, Assembly, Activity/Quantity Confirmation |
| Material Management | 12 | Materials, BOMs, Routings, Batches, Inventory, Staging |
| Quality & Data Collection | 8 | Data Collection, Quality Inspection, Nonconformance, EBR |
| Process Manufacturing | 6 | Process Orders, Process Lots, Recipes, Setpoints |
| Configuration | 17 | Resources, Work Centers, Tools, Shifts, Users, POD, Alerts, Labor |
| Integration | 14 | Documents, Printing, Work Instructions, Notifications, Signatures |
| Issue Resolution | 2 | Issues, Problem-Solving Processes (8D) |
| OEE Analytics | 1 | OEE Analytics (KPIs, availability, quality, performance) |

---

## Authentication & Base URLs

### OAuth 2.0 Authentication

```http
POST https://{subdomain}.authentication.{tokenHost}/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={clientId}&client_secret={clientSecret}
```

### Region Hosts

| Environment | Host |
|-------------|------|
| Europe (Frankfurt) | `eu10.dmc.cloud.sap` |
| Europe (Netherlands) | `eu20.dmc.cloud.sap` |
| US East (Virginia) | `us10.dmc.cloud.sap` |
| US West (Washington) | `us20.dmc.cloud.sap` |
| Test EU10 | `test.eu10.dmc.cloud.sap` |
| Test EU20 | `test.eu20.dmc.cloud.sap` |
| Test US10 | `test.us10.dmc.cloud.sap` |
| Test US20 | `test.us20.dmc.cloud.sap` |

### Base URL Pattern

```
https://api.{regionHost}/{service}/v{version}
```

---

## Core Production APIs

### 1. Shop Floor Control (SFC) API
**Spec**: `sapdme_sfc.json`, `sapdme_sfc_v2.json` | **Base**: `/sfc/v1`

Start, complete, serialize, relabel, split, merge, scrap SFCs.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sfcs/start` | Start SFCs at operation/resource |
| POST | `/sfcs/complete` | Complete SFCs at operation |
| POST | `/sfcs/serialize` | Serialize SFCs |
| POST | `/sfcs/relabel` | Relabel SFCs |
| POST | `/sfcs/split` | Split SFC into multiple |
| POST | `/sfcs/merge` | Merge multiple SFCs |
| POST | `/sfcs/scrap` | Scrap SFCs |
| GET | `/sfcs` | Get SFC details |

### 2. Order API
**Spec**: `sapdme_order.json`, `sapdme_order_v2.json` | **Base**: `/order/v1`

Define material to produce, production dates, quantities, components, and operation sequences.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/orders` | Find order by plant and order number |
| GET | `/v1/orders/list` | Retrieve order list with filters |
| POST | `/v1/orders/release` | Release orders for production |
| PATCH | `/v1/orders/customValues` | Update order custom values |

### 3. Activity Confirmation API
**Spec**: `sapdme_activityConfirmation.json` | **Base**: `/activity/v1`

Confirm activities performed on SFCs (labor, yield, scrap, rework).

### 4. Quantity Confirmation API
**Spec**: `sapdme_quantityConfirmation.json` | **Base**: `/quantityConfirmation/v1`

Confirm quantities (yield, scrap, rework) at operations.

### 5. Assembly API
**Spec**: `sapdme_assembly.json` | **Base**: `/assembly/v1`

Assemble/unassemble components to SFCs during production.

### 6. Operation API
**Spec**: `sapdme_operation.json`, `sapdme_operationactivity.json` | **Base**: `/operation/v1`

Define manufacturing operations and activities.

### 7. Production API v2
**Spec**: `sapdme_production_v2.json` | **Base**: `/production/v2`

Comprehensive production operations endpoint.

---

## Material & BOM APIs

### 8. Material API
**Spec**: `sapdme_material.json` | **Base**: `/material/v1`

Create, search, and update materials with routing, BOM, storage location, lot size, UOM, custom values.

### 9. Bill of Material (BOM) API
**Spec**: `sapdme_bom.json` | **Base**: `/bom/v2`

Define material components required for production.

### 10. Routing API
**Spec**: `sapdme_routing.json` | **Base**: `/routing/v1`

Define operation sequences for production.

### 11. Batch API
**Spec**: `sapdme_batch.json`, `sapdme_batch_v2.json` | **Base**: `/batch/v1`

Manage material batches and batch traceability.

### 12. Material Group API
**Spec**: `sapdme_materialgroup.json` | **Base**: `/materialgroup/v1`

Group materials for easier management.

---

## Data Collection & Quality APIs

### 13. Data Collection API
**Spec**: `sapdme_datacollection.json` | **Base**: `/datacollection/v1`

Collect data values at various manufacturing process points.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/log` | Log data collection parameter values |
| POST | `/standalone/log` | Log standalone/non-WIP data collection |
| GET | `/dataCollectionGroups` | Get data collection groups |

### 14. Quality Inspection API
**Spec**: `sapdme_qualityinspection.json`, `sapdme_qualityinspection_v2.json` | **Base**: `/qualityinspection/v1`

Create and manage quality inspections for SFCs.

### 15. Nonconformance API
**Spec**: `sapdme_nonconformance.json` | **Base**: `/nonconformance/v1`

Report and manage nonconformances (defects, issues).

### 16. Nonconformance Code/Group APIs
**Specs**: `sapdme_nonconformancecode.json`, `sapdme_nonconformancegroup.json`

Define and manage nonconformance codes and groups.

### 17. Electronic Batch Record (EBR) API
**Spec**: `sapdme_ebr.json` | **Base**: `/ebr/v1`

Create and manage electronic batch records for regulated industries.

### 18. Classification API
**Spec**: `sapdme_classification.json` | **Base**: `/classification/v1`

Classify materials and objects with characteristics.

### 19. Data Fields API
**Spec**: `sapdme_datafields.json` | **Base**: `/datafield/v1`

Define custom data fields for various entities.

### 20. Data Type API
**Spec**: `sapdme_datatype.json` | **Base**: `/datatype/v1`

Define custom data types.

---

## Inventory & Logistics APIs

### 21. Inventory API
**Spec**: `sapdme_inventory.json`, `sapdme_inventory_v2.json` | **Base**: `/inventory/v1`

Manage inventory levels, locations, and movements.

### 22. Staging API
**Spec**: `sapdme_staging.json`, `sapdme_staging_v2.json` | **Base**: `/staging/v1`

Stage materials for production operations.

### 23. Logistics API
**Spec**: `sapdme_logistics.json` | **Base**: `/logistics/v1`

Manage logistics operations and material movements.

### 24. Packing Unit API
**Spec**: `sapdme_packingunit.json` | **Base**: `/packingunit/v1`

Create and manage packing units for materials.

### 25. WIP (Work in Process) API
**Spec**: `sapdme_wip.json` | **Base**: `/wip/v1`

Track work in process inventory.

---

## Process Manufacturing APIs

### 26. Process Order API
**Spec**: `sapdme_processorder.json`, `sapdme_processorder_v2.json` | **Base**: `/processorder/v1`

Manage process manufacturing orders.

### 27. Process Lot API
**Spec**: `sapdme_processlot.json`, `sapdme_processlot_v2.json` | **Base**: `/processlot/v1`

Manage process manufacturing lots.

### 28. Recipe API
**Spec**: `sapdme_recipe.json` | **Base**: `/recipe/v1`

Define and manage manufacturing recipes.

### 29. Setpoint API v3
**Spec**: `sapdme_setpoint_v3.json` | **Base**: `/setpoint/v3`

Manage equipment setpoints for process control.

### 30. Process Manufacturing API
**Spec**: `sapdme_process_manufacturing.json` | **Base**: `/process-manufacturing/v1`

General process manufacturing operations.

### 31. REO (Recipe Execution Order) API
**Spec**: `sapdme_reo.json` | **Base**: `/reo/v1`

Execute recipes in specific order.

---

## Configuration & Master Data APIs

### 32. Plant API
**Spec**: `sapdme_plant.json` | **Base**: `/plant/v1`

Manage plant master data.

### 33. Plant Resource API v2
**Spec**: `sapdme_plant_resource_v2.json` | **Base**: `/resource/v2`

Define and manage plant resources (machines, equipment).

### 34. Work Center API
**Spec**: `sapdme_plant_workcenter_v2.json`, `sapdme_plant_workcenter_v3.json` | **Base**: `/workcenter/v2`

Define and manage work centers.

### 35. Resource Type API
**Spec**: `sapdme_resourcetype.json` | **Base**: `/resourcetype/v1`

Define resource types for classification.

### 36. Tool API
**Spec**: `sapdme_tool.json`, `sapdme_tool_v2.json` | **Base**: `/tool/v1`

Manage tools used in production.

### 37. Shift API
**Spec**: `sapdme_shift.json` | **Base**: `/shift/v1`

Define production shifts and calendars.

### 38. User API
**Spec**: `sapdme_user.json` | **Base**: `/user/v1`

Manage user accounts and permissions.

### 39. POD Configuration API
**Spec**: `sapdme_pod.json` | **Base**: `/pod/v1`

Create, import, export POD configurations.

### 40. Unit of Measure (UOM) API
**Spec**: `sapdme_uom.json` | **Base**: `/uom/v1`

Manage units of measure.

### 41. Numbering API
**Spec**: `sapdme_numbering.json`, `sapdme_numbering_identifier_config.json` | **Base**: `/numbering/v1`

Configure number ranges for entities.

### 42. Standard Rate/Value APIs
**Specs**: `sapdme_standardrate.json`, `sapdme_standardvalue.json`

Define standard rates and values for costing.

### 43. Plant Certification API
**Spec**: `sapdme_plant_certification.json`

Manage plant certifications.

### 44. Asset Model API
**Spec**: `sapdme_asset_model.json` | **Base**: `/asset-model/v1`

Define asset models for equipment.

### 45. Labor API
**Spec**: `sapdme_labor.json` | **Base**: `/labor/v1`

Track labor time and activities.

### 46. Labor Management API
**Spec**: `sapdme_labors.json` | **Base**: `/labor/v1`  
**Type**: OData V4

View and evaluate workforce skill profiles under a supervisor for a plant to support efficient labor planning and skill-based task assignment.

### 47. Time Tracking API
**Spec**: `sapdme_timetracking.json`, `sapdme_timetracking_odata.json` | **Base**: `/timetracking/v1`

Track time for operations and activities. The OData V4 variant provides record management for attendance, direct/indirect labor, and production time.

### 48. Last Indicator API
**Spec**: `sapdme_lastindicator.json` | **Base**: `/lastindicator/v1`

Mark items as last in sequence.

### 49. OEE (Overall Equipment Effectiveness) APIs
**Specs**: `sapdme_oee.json`, `sapdme_oee_resourcereasoncode.json`  
**Base**: `/oee/v1`

Calculate and track OEE metrics and reason codes.

### 50. Alert Management API
**Spec**: `sapdme_alerts.json` | **Base**: `/alerts`  
**Type**: OData V4

Notify users about events requiring their attention. Create and update alerts manually or automatically.

---

## Integration & Document APIs

### 51. Document API v2
**Spec**: `sapfnd_document_v2.json` | **Base**: `/document/v2`

Attach and manage documents (files) to entities.

### 52. Work Instruction API
**Spec**: `sapdme_workinstruction.json`, `sapdme_workinstruction_file.json` | **Base**: `/workinstruction/v1`

Create and attach work instructions to operations.

### 53. Print API
**Spec**: `sapfnd_print.json` | **Base**: `/print/v1`

Print labels and documents.

### 54. Printer API
**Spec**: `sapfnd_printer.json` | **Base**: `/printer/v1`

Manage printer configurations.

### 55. Notification API
**Spec**: `sapdme_notification.json` | **Base**: `/notification/v1`

Send and manage notifications to users.

### 56. Integration Message API
**Spec**: `sapdme_integrationMessage.json` | **Base**: `/integration/v1`

Send and receive integration messages.

### 57. Electronic Signature API
**Spec**: `sapfnd_signature.json` | **Base**: `/electronicsignature/v1`  
**Type**: OData V4

Maintain and make available electronic signatures. Signature records become a permanent part of the product history with context, reason, and signatory.

---

## Issue Resolution & Problem Solving APIs

### 58. Issues API
**Spec**: `sapdme_issues.json` | **Base**: `/odata/v4/IssueService`  
**Type**: OData V4

Create and read issues in SAP Digital Manufacturing for Issue Resolution. Issues reference generic product defects or process-related challenges observed on the shop floor.

### 59. Problem-Solving Process (PSP) API
**Spec**: `sapdme_psp.json` | **Base**: `/odata/v4/ProblemSolvingProcessService`  
**Type**: OData V4

Create, read, and update problem-solving processes using either the standard 8D methodology or a custom methodology. Define containment actions, identify root causes, and specify corrective and preventive measures.

---

## OEE Analytics APIs

### 60. OEE Analytics API
**Spec**: `sapdmi_vishleshki.json` | **Base**: `/oee/v1`  
**Type**: Swagger 2.0

Calculate availability, quality, and performance KPIs. Provides time element duration by type, raw availability loss information, and production summary with yield and scrap.

---

## Manufacturing Data Object (MDO) APIs

### 61. DMCI Extractor Service (MDO)
**Spec**: `sap-dm-mdo-specs/metadata.xml` (OData V4 $metadata)  
**Base URL**: `https://api.{regionHost}/dmci/v4/extractor/`  
**Type**: OData V4

The Manufacturing Data Object (MDO) Extractor Service provides read access to the SAP DM data model for reporting, analytics, and integration scenarios. It exposes all core manufacturing entities as OData V4 entity sets with navigation properties for cross-entity queries.

**Key Entity Sets:**

| Entity Set | Description |
|-----------|-------------|
| `PLANT` | Plant master data |
| `ORDER` | Production orders |
| `SFC` | Shop Floor Control numbers |
| `MATERIAL` | Material master data |
| `RESOURCE` | Production resources |
| `WORKCENTER` | Work centers |
| `ROUTING` | Routings |
| `ROUTING_STEP` | Routing steps/operations |
| `BOM` | Bills of Material |
| `BOM_COMPONENT` | BOM components |
| `ALTERNATE_BOM_COMPONENT` | Alternate BOM components |
| `OPERATION_ACTIVITY` | Operation activities |
| `SFC_ASSEMBLY` | SFC assembly records |
| `SFC_ASSEMBLY_EVENTS` | Assembly event history |
| `SFC_PRODUCTION_EVENTS` | Production event history |
| `SFC_STEP_STATUS` | SFC step status |
| `SFC_HIERARCHY` | SFC parent/child relationships |
| `SFC_SCRAP` | Scrap records |
| `NON_CONFORMANCE` | Nonconformance records |
| `NON_CONFORMANCE_CODE` | NC codes |
| `DATA_COLLECTION` | Data collection records |
| `STANDARD_RATE` | Standard rates |
| `STANDARD_VALUE_TARGET` | Standard value targets |
| `OEE` | OEE metrics |
| `OEE_REASON_CODE` | OEE reason codes |
| `DOWNTIME` | Downtime records |
| `TOOL` | Tool records |
| `WORK_INSTRUCTION` | Work instructions |
| `WORK_INSTRUCTION_VIEW_LOG` | WI view logs |
| `ORDER_SCHEDULE` | Order schedules |
| `ORDER_CUSTOM_DATA` | Order custom data fields |
| `MATERIAL_TEXT` | Material descriptions |
| `MATERIAL_CUSTOM_DATA` | Material custom data |
| `MATERIAL_GROUP_MEMBERS` | Material group assignments |

**Example - Query Orders with Expansion:**
```
GET /dmci/v4/extractor/ORDER?$filter=PLANT_ID eq 'PLANT_1'&$expand=SFCS,MATERIALS&$top=50
```

**Example - Get SFC Production Events:**
```
GET /dmci/v4/extractor/SFC_PRODUCTION_EVENTS?$filter=PLANT_ID eq 'PLANT_1' and SFC_ID eq 'SFC001'
```

---

## Common Patterns & Examples

### Error Response Structure

All APIs return consistent error responses:

```json
{
  "code": "400",
  "message": "The HTTP request is bad or invalid",
  "causeMessage": "Material MAT001 not found",
  "correlationId": "12345-67890-abcde"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

### Example: Calling API from POD Widget

```javascript
import PodContext from "sap/dm/dme/pod2/context/PodContext";

class MyWidget extends Widget {
    async _fetchSfcDetails(sSfc) {
        const oContext = PodContext.getContext();
        const sPlant = oContext.plant;
        const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
        
        const oResponse = await fetch(`${sBaseUrl}/sfcs?plant=${sPlant}&sfc=${sSfc}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oContext.token}`
            }
        });
        
        if (!oResponse.ok) {
            throw new Error(`HTTP ${oResponse.status}: ${oResponse.statusText}`);
        }
        return await oResponse.json();
    }
}
```

### Example: Pagination

```http
GET /v1/materials/list?plant=PLANT_1&page=0&size=20
```

Response:
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}
```

---

## API Spec Files Reference

All 77 API specification files are available in [sap-dm-api-specs/](sap-dm-api-specs/):

| Category | Files |
|----------|-------|
| Activity Confirmation | `sapdme_activityConfirmation.json` |
| Alerts | `sapdme_alerts.json` |
| Assembly | `sapdme_assembly.json` |
| Asset Model | `sapdme_asset_model.json` |
| Batch | `sapdme_batch.json`, `sapdme_batch_v2.json` |
| BOM | `sapdme_bom.json` |
| Classification | `sapdme_classification.json` |
| Data Collection | `sapdme_datacollection.json` |
| Data Fields | `sapdme_datafields.json` |
| Data Type | `sapdme_datatype.json` |
| EBR | `sapdme_ebr.json` |
| Integration Message | `sapdme_integrationMessage.json` |
| Inventory | `sapdme_inventory.json`, `sapdme_inventory_v2.json` |
| Issues | `sapdme_issues.json` |
| Labor | `sapdme_labor.json`, `sapdme_labors.json` |
| Last Indicator | `sapdme_lastindicator.json` |
| Logistics | `sapdme_logistics.json` |
| Material | `sapdme_material.json` |
| Material Group | `sapdme_materialgroup.json` |
| Nonconformance | `sapdme_nonconformance.json`, `sapdme_nonconformance_v2.json` |
| Nonconformance Code | `sapdme_nonconformancecode.json` |
| Nonconformance Group | `sapdme_nonconformancegroup.json` |
| Notification | `sapdme_notification.json` |
| Numbering | `sapdme_numbering.json`, `sapdme_numbering_identifier_config.json` |
| OEE | `sapdme_oee.json`, `sapdme_oee_resourcereasoncode.json` |
| Operation | `sapdme_operation.json`, `sapdme_operationactivity.json` |
| Order | `sapdme_order.json`, `sapdme_order_v2.json` |
| Packing Unit | `sapdme_packingunit.json` |
| Plant | `sapdme_plant.json` |
| Plant Certification | `sapdme_plant_certification.json` |
| Plant Resource v2 | `sapdme_plant_resource_v2.json` |
| Plant Work Center | `sapdme_plant_workcenter_v2.json`, `sapdme_plant_workcenter_v3.json` |
| POD | `sapdme_pod.json` |
| Problem-Solving Process | `sapdme_psp.json` |
| Process Manufacturing | `sapdme_process_manufacturing.json` |
| Process Lot | `sapdme_processlot.json`, `sapdme_processlot_v2.json` |
| Process Order | `sapdme_processorder.json`, `sapdme_processorder_v2.json` |
| Production v2 | `sapdme_production_v2.json` |
| Quality Inspection | `sapdme_qualityinspection.json`, `sapdme_qualityinspection_v2.json` |
| Quantity Confirmation | `sapdme_quantityConfirmation.json` |
| Recipe | `sapdme_recipe.json` |
| REO | `sapdme_reo.json` |
| Resource Type | `sapdme_resourcetype.json` |
| Routing | `sapdme_routing.json` |
| Setpoint v3 | `sapdme_setpoint_v3.json` |
| SFC | `sapdme_sfc.json`, `sapdme_sfc_v2.json` |
| Shift | `sapdme_shift.json` |
| Staging | `sapdme_staging.json`, `sapdme_staging_v2.json` |
| Standard Rate | `sapdme_standardrate.json` |
| Standard Value | `sapdme_standardvalue.json` |
| Time Tracking | `sapdme_timetracking.json`, `sapdme_timetracking_odata.json` |
| Tool | `sapdme_tool.json`, `sapdme_tool_v2.json` |
| UOM | `sapdme_uom.json` |
| User | `sapdme_user.json` |
| WIP | `sapdme_wip.json` |
| Work Instruction | `sapdme_workinstruction.json`, `sapdme_workinstruction_v2.json`, `sapdme_workinstruction_file.json` |
| Document v2 | `sapfnd_document_v2.json` |
| Electronic Signature | `sapfnd_signature.json` |
| Print | `sapfnd_print.json` |
| Printer | `sapfnd_printer.json` |
| OEE Analytics | `sapdmi_vishleshki.json` |

---

## Best Practices

### 1. Authentication
- ✅ Cache OAuth tokens until expiry
- ✅ Handle 401 responses by refreshing token
- ❌ Don't request new token for every API call
- ❌ Don't hardcode credentials in widget code

### 2. Error Handling
- ✅ Always handle errors with try/catch
- ✅ Show user-friendly messages via MessageToast
- ❌ Don't silently swallow errors

### 3. Performance
- ✅ Use list endpoints with pagination
- ✅ Cache frequently accessed data
- ✅ Use async endpoints for long operations
- ❌ Don't fetch all records without pagination

### 4. Data Validation
- ✅ Validate input before API calls
- ✅ Check required fields
- ✅ Handle null/undefined values
- ❌ Don't trust user input without validation

---

## See Also

- [POD 2.0 API Reference](pod2-api-reference.md) - POD framework APIs
- [Widget Patterns](widget-patterns.md) - Widget implementation patterns
- [Common Mistakes](common-mistakes.md) - Common POD plugin errors
- [SAP Digital Manufacturing API Documentation](https://help.sap.com/docs/sap-digital-manufacturing/operations-guide/prepare-for-api-integration)

---

**Document Version**: 1.1.0  
**Last Updated**: 2026-08-05  
**Maintained by**: POD Plugin Skill Team
