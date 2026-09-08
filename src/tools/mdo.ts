import { FastMCP } from "fastmcp";
import * as fs from "node:fs";
import { z } from "zod";
import { DOCU_DIR } from "../config.js";
import { readFileContent, missingSpecsMessage } from "../helpers.js";
import * as path from "node:path";

const MDO_DIR = path.join(DOCU_DIR, "sap-dm-mdo-specs");
const MDO_INDEX = path.join(MDO_DIR, "index.md");
const MDO_SPECS_LABEL = "SAP DM MDO Extractor metadata";
const MDO_SPECS_DIR_REL = "docu/sap-dm-mdo-specs/";

let entityCache: Map<string, { startLine: number; endLine: number; navigations: number; properties: number }> | null = null;

function ensureEntityIndex(): Map<string, { startLine: number; endLine: number; navigations: number; properties: number }> {
  if (entityCache) return entityCache;
  const map = new Map<string, { startLine: number; endLine: number; navigations: number; properties: number }>();
  if (!fs.existsSync(MDO_INDEX)) {
    entityCache = map;
    return map;
  }
  const content = readFileContent(MDO_INDEX);
  const lines = content.split("\n");
  const counts = new Map<string, { properties: number; navigations: number }>();
  for (const line of lines) {
    const m = line.match(/^\|\s*\d+\s*\|\s*\[`([A-Z0-9_]+)`\][^|]*\|[^|]*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/);
    if (m) {
      counts.set(m[1], { properties: parseInt(m[2], 10), navigations: parseInt(m[3], 10) });
    }
  }
  let inDetails = false;
  let currentEntity: string | null = null;
  let currentStart = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##\s+Entity Type Details/i)) {
      inDetails = true;
      continue;
    }
    if (!inDetails) continue;
    const sectionEnd = line.match(/^##\s+/);
    if (sectionEnd && !line.match(/^##\s+Entity Type Details/i)) {
      if (currentEntity) {
        const c = counts.get(currentEntity) ?? { properties: 0, navigations: 0 };
        map.set(currentEntity, { startLine: currentStart, endLine: i - 1, ...c });
        currentEntity = null;
      }
      inDetails = false;
      continue;
    }
    const h3 = line.match(/^###\s+([A-Z0-9_]+)\s*$/);
    if (h3) {
      if (currentEntity) {
        const c = counts.get(currentEntity) ?? { properties: 0, navigations: 0 };
        map.set(currentEntity, { startLine: currentStart, endLine: i - 1, ...c });
      }
      currentEntity = h3[1];
      currentStart = i;
    }
  }
  if (currentEntity) {
    const c = counts.get(currentEntity) ?? { properties: 0, navigations: 0 };
    map.set(currentEntity, { startLine: currentStart, endLine: lines.length - 1, ...c });
  }
  entityCache = map;
  return map;
}

function getEntityText(entityName: string): string | null {
  const map = ensureEntityIndex();
  const entry = map.get(entityName.toUpperCase());
  if (!entry) return null;
  const content = readFileContent(MDO_INDEX);
  const lines = content.split("\n");
  return lines.slice(entry.startLine, entry.endLine + 1).join("\n").trim();
}

export function registerMdoTools(server: FastMCP): void {
  server.addTool({
    name: "list_mdo_entities",
    description: "Lists all SAP DM MDO Extractor (OData V4) entity types with property and navigation counts. The MDO Extractor exposes 53+ analytical entities (ORDER, SFC, MATERIAL, ROUTING, BOM, NON_CONFORMANCE, OEE, DOWNTIME, etc.) for reporting and integration use cases.",
    parameters: undefined,
    execute: async () => {
      if (!fs.existsSync(MDO_INDEX)) {
        throw new Error(missingSpecsMessage(MDO_SPECS_LABEL, MDO_SPECS_DIR_REL));
      }
      const map = ensureEntityIndex();
      if (map.size === 0) {
        throw new Error("[No MDO entities could be parsed from index.md]");
      }
      const lines = [
        `SAP DM MDO Extractor – ${map.size} entity types (OData V4):`,
        "",
        "Service URL: https://api.{regionHost}/dmci/v4/extractor/",
        "Namespace:   sap.mdo",
        "",
        "| Entity | Properties | Navigations |",
        "|--------|-----------:|------------:|",
      ];
      const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
      for (const [name, info] of sorted) {
        lines.push(`| \`${name}\` | ${info.properties} | ${info.navigations} |`);
      }
      lines.push("");
      lines.push("→ Use 'get_mdo_entity' with the entity name (e.g. 'ORDER', 'SFC', 'MATERIAL') for the full property list.");
      lines.push("→ Use 'search_mdo_entities' for full-text search across all entities.");
      return lines.join("\n");
    },
  });

  server.addTool({
    name: "get_mdo_entity",
    description: "Returns the full property list, types, key fields and navigations for a specific SAP DM MDO entity (e.g. 'ORDER', 'SFC', 'MATERIAL'). Case-insensitive. Includes all properties with OData types (String, Decimal, DateTimeOffset, etc.).",
    parameters: z.object({
      entityName: z.string().describe("Entity name (case-insensitive, e.g. 'ORDER', 'SFC', 'MATERIAL', 'ROUTING', 'BOM', 'NON_CONFORMANCE')"),
    }),
    execute: async ({ entityName }) => {
      if (!fs.existsSync(MDO_INDEX)) {
        throw new Error(missingSpecsMessage(MDO_SPECS_LABEL, MDO_SPECS_DIR_REL));
      }
      const upperName = entityName.toUpperCase();
      const text = getEntityText(upperName);
      if (text) return text;
      const map = ensureEntityIndex();
      const fuzzy = [...map.keys()].filter((k) => k.includes(upperName) || upperName.includes(k));
      if (fuzzy.length > 0) {
        return `Entity "${entityName}" not found exactly.\n\nDid you mean one of these?\n${fuzzy.slice(0, 15).map((n) => `  • ${n}`).join("\n")}`;
      }
      throw new Error(`Entity "${entityName}" not found.\n\nUse 'list_mdo_entities' to see all ${map.size} available entities.`);
    },
  });

  server.addTool({
    name: "search_mdo_entities",
    description: "Searches across all SAP DM MDO entity definitions for matching property names, types, or entity names. Returns the entity names that contain the query and a snippet of the matching properties.",
    parameters: z.object({
      query: z.string().describe("Search term (case-insensitive) – e.g. property name like 'BATCH_NUMBER', type like 'DateTimeOffset', or partial entity name"),
      maxResults: z.number().optional().describe("Maximum number of entities to return (default: 15)"),
    }),
    execute: async ({ query, maxResults }) => {
      if (!fs.existsSync(MDO_INDEX)) {
        throw new Error(missingSpecsMessage(MDO_SPECS_LABEL, MDO_SPECS_DIR_REL));
      }
      const max = maxResults ?? 15;
      const lowerQuery = query.toLowerCase();
      const map = ensureEntityIndex();
      const results: { entity: string; snippet: string[]; matchCount: number }[] = [];
      for (const entityName of map.keys()) {
        const text = getEntityText(entityName);
        if (!text) continue;
        const lines = text.split("\n");
        const matchingLines: string[] = [];
        for (const line of lines) {
          if (line.toLowerCase().includes(lowerQuery)) {
            matchingLines.push(line.trim());
          }
        }
        if (matchingLines.length > 0) {
          results.push({ entity: entityName, snippet: matchingLines.slice(0, 5), matchCount: matchingLines.length });
        }
      }
      results.sort((a, b) => {
        const aHit = a.entity.toLowerCase().includes(lowerQuery) ? 1 : 0;
        const bHit = b.entity.toLowerCase().includes(lowerQuery) ? 1 : 0;
        if (aHit !== bHit) return bHit - aHit;
        return b.matchCount - a.matchCount;
      });
      const limited = results.slice(0, max);
      if (limited.length === 0) {
        return `No MDO entities or properties match "${query}".\n\nTip: Try 'list_mdo_entities' to see available entities.`;
      }
      const sections = limited.map((r) =>
        `📦 \`${r.entity}\` (${r.matchCount} matches):\n${r.snippet.map((l) => `  ${l}`).join("\n")}`,
      );
      return `MDO entity search for "${query}" – ${limited.length} entities with matches:\n\n${sections.join("\n\n")}`;
    },
  });
}
