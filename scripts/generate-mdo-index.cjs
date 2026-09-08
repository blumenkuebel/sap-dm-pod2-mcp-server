#!/usr/bin/env node
/**
 * Generates a Markdown index from the MDO Extractor OData V4 $metadata XML.
 *
 * ⚠️  SAP-proprietary input/output. This script does NOT ship any SAP content. It converts
 *     a `$metadata` document that YOU exported from your own SAP DM tenant into the local,
 *     git-ignored `docu/sap-dm-mdo-specs/` folder.
 *
 * Usage: node scripts/generate-mdo-index.cjs [--release <YYMM>]
 * Input:  docu/sap-dm-mdo-specs/metadata.xml
 * Output: docu/sap-dm-mdo-specs/index.md  (+ docu/mdo-extractor-reference.md, git-ignored)
 */

const fs = require('fs');
const path = require('path');

// Keep in sync with src/config.ts DEFAULT_DM_RELEASE
const DEFAULT_RELEASE = "2608";

let release = process.env.SAP_DM_RELEASE || DEFAULT_RELEASE;
for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--release") release = process.argv[++i];
    else if (process.argv[i] === "--help" || process.argv[i] === "-h") {
        console.log("Usage: node scripts/generate-mdo-index.cjs [--release <YYMM>]");
        process.exit(0);
    }
}

const BASE_DIR = path.resolve(__dirname, '..');
const METADATA_PATH = path.join(BASE_DIR, 'docu/sap-dm-mdo-specs/metadata.xml');
const OUTPUT_PATH = path.join(BASE_DIR, 'docu/sap-dm-mdo-specs/index.md');
const DOCU_ROOT_COPY = path.join(BASE_DIR, 'docu/mdo-extractor-reference.md');

if (!fs.existsSync(METADATA_PATH)) {
    console.error("MDO $metadata not found: " + METADATA_PATH);
    console.error("");
    console.error("Export the MDO Extractor OData V4 $metadata from your own SAP DM tenant, e.g.:");
    console.error("  GET https://api.<region>.dmc.cloud.sap/dmci/v4/extractor/$metadata");
    console.error("and save it as docu/sap-dm-mdo-specs/metadata.xml, then re-run this script.");
    process.exit(1);
}

const xml = fs.readFileSync(METADATA_PATH, 'utf-8');

if (!/<edmx:Edmx|<Edmx/i.test(xml)) {
    console.error("Invalid MDO $metadata: " + METADATA_PATH);
    console.error("");
    console.error("The file does not contain an OData EDMX document. Content found:");
    console.error("  " + xml.slice(0, 200).trim());
    console.error("");
    console.error("This usually means the export request failed (e.g. an expired or invalid");
    console.error("bearer token) and the error response was saved instead of the real $metadata.");
    console.error("Get a fresh bearer token and re-run the export (see README Step 4).");
    process.exit(1);
}

// Parse EntitySets from EntityContainer
const entitySets = [];
const entitySetRegex = /<EntitySet Name="([^"]+)" EntityType="([^"]+)">/g;
let match;
while ((match = entitySetRegex.exec(xml)) !== null) {
    const name = match[1];
    const type = match[2];

    // Find navigation properties for this entity set
    const setStart = match.index;
    const setEnd = xml.indexOf('</EntitySet>', setStart);
    const setBlock = xml.substring(setStart, setEnd);

    const navProps = [];
    const navRegex = /NavigationPropertyBinding Path="([^"]+)" Target="([^"]+)"/g;
    let navMatch;
    while ((navMatch = navRegex.exec(setBlock)) !== null) {
        navProps.push({ path: navMatch[1], target: navMatch[2] });
    }

    entitySets.push({ name, type, navProps });
}

// Parse EntityTypes with their properties
const entityTypes = [];
const typeRegex = /<EntityType Name="([^"]+)">([\s\S]*?)<\/EntityType>/g;
while ((match = typeRegex.exec(xml)) !== null) {
    const name = match[1];
    const body = match[2];

    // Parse Key
    const keys = [];
    const keyRegex = /<PropertyRef Name="([^"]+)"\/>/g;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(body)) !== null) {
        keys.push(keyMatch[1]);
    }

    // Parse Properties
    const props = [];
    const propRegex = /<Property Name="([^"]+)" Type="([^"]+)"([^/]*)\/?>/g;
    let propMatch;
    while ((propMatch = propRegex.exec(body)) !== null) {
        const propName = propMatch[1];
        const propType = propMatch[2];
        const attrs = propMatch[3];
        const nullable = attrs.includes('Nullable="false"') ? false : true;
        props.push({ name: propName, type: propType, nullable, isKey: keys.includes(propName) });
    }

    // Parse NavigationProperties
    const navs = [];
    const navPropRegex = /<NavigationProperty Name="([^"]+)" Type="([^"]+)"([^/]*)\/?>/g;
    let navPropMatch;
    while ((navPropMatch = navPropRegex.exec(body)) !== null) {
        navs.push({ name: navPropMatch[1], type: navPropMatch[2] });
    }

    entityTypes.push({ name, keys, props, navs });
}

// Generate Markdown
let md = `# SAP DM MDO Extractor Service — Entity Reference

**Service URL**: \`https://api.{regionHost}/dmci/v4/extractor/\`
**Protocol**: OData V4
**Namespace**: \`sap.mdo\`
**SAP DM release**: ${release}
**Generated**: ${new Date().toISOString().split('T')[0]}

This index documents all entity types exposed by the DMCI Extractor Service for reporting, analytics, and integration.

---

## Entity Sets Overview

| # | Entity Set | Key Fields | Properties | Navigations |
|---|-----------|------------|------------|-------------|
`;

entityTypes.forEach((et, i) => {
    const keyStr = et.keys.join(', ');
    md += `| ${i + 1} | [\`${et.name}\`](#${et.name.toLowerCase()}) | ${keyStr} | ${et.props.length} | ${et.navs.length} |\n`;
});

md += `\n---\n\n## Entity Type Details\n\n`;

// Generate detail section for each entity type
entityTypes.forEach((et) => {
    md += `### ${et.name}\n\n`;

    // Properties table
    if (et.props.length > 0) {
        md += `| Property | Type | Key | Nullable |\n`;
        md += `|----------|------|-----|----------|\n`;
        et.props.forEach(p => {
            const typeShort = p.type.replace('Edm.', '');
            md += `| \`${p.name}\` | ${typeShort} | ${p.isKey ? '🔑' : ''} | ${p.nullable ? 'Yes' : 'No'} |\n`;
        });
    }

    // Navigation properties
    if (et.navs.length > 0) {
        md += `\n**Navigation Properties:**\n`;
        et.navs.forEach(n => {
            const targetType = n.type.replace('Collection(sap.mdo.', '').replace('sap.mdo.', '').replace(')', '');
            const isCollection = n.type.startsWith('Collection(');
            md += `- \`${n.name}\` → ${targetType}${isCollection ? ' (many)' : ' (one)'}\n`;
        });
    }

    md += `\n---\n\n`;
});

// Add common query examples
md += `## Common OData Query Examples

### Filter by Plant
\`\`\`
GET /dmci/v4/extractor/ORDER?$filter=PLANT_ID eq 'PLANT_1'
\`\`\`

### Expand Related Entities
\`\`\`
GET /dmci/v4/extractor/SFC?$filter=PLANT_ID eq 'PLANT_1'&$expand=ORDERS,MATERIALS
\`\`\`

### Select Specific Fields
\`\`\`
GET /dmci/v4/extractor/MATERIAL?$select=MATERIAL_ID,DESCRIPTION,VERSION&$filter=PLANT_ID eq 'PLANT_1'
\`\`\`

### Pagination
\`\`\`
GET /dmci/v4/extractor/ORDER?$top=50&$skip=100&$count=true
\`\`\`

### Order By
\`\`\`
GET /dmci/v4/extractor/SFC_PRODUCTION_EVENTS?$orderby=CREATED_DATE_TIME desc&$top=100
\`\`\`

### Nested Expansion
\`\`\`
GET /dmci/v4/extractor/ORDER?$expand=SFCS($expand=SFC_STEP_STATUSS)&$filter=PLANT_ID eq 'PLANT_1'
\`\`\`

---

## See Also

- [SAP DM API Reference](../sapdm-api-reference.md) — All REST/OData APIs
- [Raw $metadata XML](metadata.xml) — Full OData V4 EDMX schema
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, md, 'utf-8');

// Also copy to docu root for MCP server pattern docs visibility (git-ignored — SAP-derived)
fs.writeFileSync(DOCU_ROOT_COPY, md, 'utf-8');

console.log(`✅ Generated MDO index (release ${release}): ${OUTPUT_PATH}`);
console.log(`   Also copied to: ${DOCU_ROOT_COPY}`);
console.log(`   - ${entityTypes.length} entity types documented`);
console.log(`   - ${entityTypes.reduce((sum, et) => sum + et.props.length, 0)} total properties`);
console.log(`   - ${entityTypes.reduce((sum, et) => sum + et.navs.length, 0)} total navigation properties`);
