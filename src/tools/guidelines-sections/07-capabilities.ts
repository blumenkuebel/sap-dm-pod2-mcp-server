// Section 7: CAPABILITIES_TEXT (for list_capabilities tool)

import type { ContentCounts } from "./05-tool-catalog.js";

export function buildCapabilities(c: ContentCounts): string {
  return `# POD2 MCP Server — Capabilities Overview

## Tools (19)

| # | Tool | Purpose |
|---|------|---------|
| 1 | \`get_pod2_guidelines\` | Rules, conventions, tool catalog — call **once** at start |
| 2 | \`list_capabilities\` | This overview |
| 3 | \`list_pattern_docs\` | All ${c.patternDocs} pattern doc names + descriptions |
| 4 | \`get_pattern_doc\` | Full doc, single section (\`section\` param), or TOC (\`summary: true\`) |
| 5 | \`search_docs\` | TF-IDF search across pattern docs |
| 6 | \`get_api_index\` | POD2 API class index (${c.apiClasses} classes). Use \`filter\` to narrow. |
| 7 | \`get_api_doc\` | Full doc for one API class (short aliases supported) |
| 8 | \`list_api_docs\` | Browse API classes (namespace filter + pagination) |
| 9 | \`search_api_docs\` | Search across API reference |
| 10 | \`list_rest_apis\` | All ${c.restApis} SAP DM REST API specs grouped by prefix |
| 11 | \`get_rest_api\` | OpenAPI spec for one service (\`summary\` mode available) |
| 12 | \`search_rest_apis\` | Search endpoints across all REST specs |
| 13 | \`list_examples\` | ${c.examples} reference example plugins with file structure |
| 14 | \`get_example\` | Source from a reference plugin (use \`file\` param for one file) |
| 15 | \`list_mdo_entities\` | MDO Extractor OData V4 entity list |
| 16 | \`get_mdo_entity\` | One MDO entity definition |
| 17 | \`search_mdo_entities\` | Search MDO entities |
| 18 | \`search_all\` | Cross-search: patterns + API + REST |
| 19 | \`validate_project\` | Full plugin validation → VALIDATION-REPORT.md |

---

## Prompts (5)

| Prompt | Use |
|--------|-----|
| \`create_widget\` | Generate Widget + i18n + extension.json entry |
| \`create_action\` | Generate Action (validation/execution/standalone) |
| \`create_extension\` | Generate full plugin (10 files) — reads POD2_PLUGIN_TEMPLATE.md |
| \`migrate_widget\` | Migrate existing POD 2.0 widget with feature-loss prevention |
| \`validate_project\` | Validate plugin in cwd against all standards |

---

## Resources (6 URIs)

| URI | Description |
|-----|-------------|
| \`pod2://patterns/index\` | Pattern index |
| \`pod2://patterns/basics\` | Development fundamentals |
| \`pod2://patterns/{name}\` | Any pattern doc by name |
| \`pod2://api/index\` | POD2 API class index |
| \`pod2://api/{className}\` | One API class doc |
| \`pod2://rest-api/{serviceName}\` | OpenAPI spec for a SAP DM service |

---

## SAP DM REST API Services (${c.restApis})

Use these names with \`get_rest_api({ serviceName: "..." })\`:

**Production:** \`sfc\`, \`order\`, \`operationactivity\`, \`assembly\`, \`activityConfirmation\`, \`quantityConfirmation\`, \`production_v2\`
**Material:** \`material\`, \`bom\`, \`routing\`, \`batch\`, \`materialgroup\`
**Process Mfg:** \`processorder\`, \`processlot\`, \`process_manufacturing\`, \`recipe\`, \`setpoint_v3\`, \`reo\`
**Inventory:** \`inventory\`, \`staging\`, \`logistics\`, \`packingunit\`, \`wip\`
**Quality:** \`datacollection\`, \`qualityinspection\`, \`nonconformance\`, \`nonconformancecode\`, \`nonconformancegroup\`, \`ebr\`, \`classification\`
**Config:** \`plant\`, \`resourcetype\`, \`tool\`, \`shift\`, \`user\`, \`pod\`, \`uom\`, \`numbering\`, \`standardrate\`, \`standardvalue\`, \`labor\`, \`timetracking\`, \`oee\`, \`asset_model\`
**Integration:** \`workinstruction\`, \`workinstruction_file\`, \`notification\`, \`integrationMessage\`
**Foundation:** \`print\` (sapfnd), \`printer\` (sapfnd), \`document_v2\` (sapfnd), \`signature\` (sapfnd)
**Analytics:** \`alerts\`, \`issues\`, \`psp\`, \`oee\`

---

## Common Workflows

**Find a REST endpoint:** \`search_rest_apis({ query: "X" })\` → \`get_rest_api({ serviceName: "...", summary: true })\` → full spec

**Create a plugin:** \`get_pod2_guidelines\` → \`get_pattern_doc({ name: "widget-patterns-core" })\` → \`get_example({ plugin: "Customer.Coating" })\` → \`create_extension\` prompt

**Call a REST API from widget:** \`get_pattern_doc({ name: "pod2-public-api-pattern" })\` — MUST READ before using RestClient

**Validate an existing plugin:** \`validate_project\` tool or prompt
`;
}
