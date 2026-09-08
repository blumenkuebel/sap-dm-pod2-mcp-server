import { FastMCP } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
import { DOCU_DIR, POD2_API_SPECS_DIR, SAP_DM_API_SPECS_DIR } from "../config.js";
import { readFileContent, tryReadFileContent, safePath, getPatternDocFiles, getPod2ApiDocFiles, getSapDmApiFiles, missingSpecsMessage } from "../helpers.js";

export function registerResources(server: FastMCP): void {
  server.addResource({
    uri: "pod2://patterns/index",
    name: "pattern-index",
    description: "POD2 Pattern Index – Quick reference organized by widget type, use case, technical pattern, and complexity.",
    mimeType: "text/markdown",
    load: async () => {
      const filePath = path.join(DOCU_DIR, "PATTERN-INDEX.md");
      const text = fs.existsSync(filePath)
        ? readFileContent(filePath)
        : "[PATTERN-INDEX.md not found]";
      return { text };
    },
  });

  server.addResource({
    uri: "pod2://patterns/basics",
    name: "docu-basics",
    description: "POD2 Development Fundamentals – Architecture, Best Practices, plugin structure, and coding patterns.",
    mimeType: "text/markdown",
    load: async () => ({
      text: tryReadFileContent(path.join(DOCU_DIR, "basics.md"))
        ?? "[Error: basics.md not found in docu/]",
    }),
  });

  server.addResource({
    uri: "pod2://api/index",
    name: "api-index",
    description: "POD2 API Reference Index – Overview of all classes, namespaces, and type definitions.",
    mimeType: "text/markdown",
    load: async () => {
      const indexPath = path.join(POD2_API_SPECS_DIR, "index.md");
      const text = fs.existsSync(indexPath)
        ? readFileContent(indexPath)
        : (getPod2ApiDocFiles().length === 0
            ? missingSpecsMessage("POD2 API documentation", "docu/pod2-api-specs/")
            : `[API index not found. ${getPod2ApiDocFiles().length} API doc files available. Use list_api_docs tool.]`);
      return { text };
    },
  });

  server.addResourceTemplate({
    uriTemplate: "pod2://patterns/{name}",
    name: "pattern-doc",
    description: "Individual pattern documentation file (e.g. widget-patterns, common-mistakes, advanced-patterns)",
    mimeType: "text/markdown",
    arguments: [
      { name: "name", description: "Pattern doc name (without .md)", required: true },
    ],
    load: async ({ name }) => {
      let filePath = safePath(DOCU_DIR, name);
      if (filePath && !fs.existsSync(filePath)) {
        const altPath = safePath(DOCU_DIR, name + ".md");
        if (altPath) filePath = altPath;
      }
      if (!filePath || !fs.existsSync(filePath)) {
        return {
          text: `[Error: Pattern doc "${name}" not found. Available: ${getPatternDocFiles().map((f) => f.replace(".md", "")).join(", ")}]`,
        };
      }
      return { text: readFileContent(filePath) };
    },
  });

  server.addResourceTemplate({
    uriTemplate: "pod2://api/{className}",
    name: "api-doc",
    description: "Individual POD2 API documentation file – e.g. sap.dm.dme.pod2.action.Action",
    mimeType: "text/markdown",
    arguments: [
      { name: "className", description: "Full class name (dot or slash notation)", required: true },
    ],
    load: async ({ className }) => {
      if (getPod2ApiDocFiles().length === 0) {
        return { text: missingSpecsMessage("POD2 API documentation", "docu/pod2-api-specs/") };
      }
      let filePath = safePath(POD2_API_SPECS_DIR, className);
      if (!filePath) {
        return { text: "[Error: Access denied – path escapes the docs directory]" };
      }
      if (!fs.existsSync(filePath) && !className.endsWith(".md")) {
        const altPath = safePath(POD2_API_SPECS_DIR, className + ".md");
        if (altPath) filePath = altPath;
      }
      if (!fs.existsSync(filePath)) {
        return { text: `[Error: API doc "${className}" not found. Use list_api_docs to see available classes.]` };
      }
      return { text: readFileContent(filePath) };
    },
  });

  server.addResourceTemplate({
    uriTemplate: "pod2://rest-api/{serviceName}",
    name: "rest-api",
    description: "SAP DM REST API OpenAPI specification (JSON) – e.g. order, sfc, material",
    mimeType: "application/json",
    arguments: [
      { name: "serviceName", description: "Service name (e.g. order, sfc, material)", required: true },
    ],
    load: async ({ serviceName }) => {
      const candidates = [
        `sapdme_${serviceName}.json`,
        `sapfnd_${serviceName}.json`,
        `${serviceName}.json`,
      ];
      for (const candidate of candidates) {
        const filePath = safePath(SAP_DM_API_SPECS_DIR, candidate);
        if (filePath && fs.existsSync(filePath)) {
          return { text: readFileContent(filePath) };
        }
      }
      const allFiles = getSapDmApiFiles();
      const matches = allFiles.filter((f) => f.toLowerCase().includes(serviceName.toLowerCase()));
      return {
        text: matches.length > 0
          ? `[REST API "${serviceName}" not found exactly. Did you mean: ${matches.join(", ")}?]`
          : `[REST API "${serviceName}" not found. Use list_rest_apis to see available specs.]`,
      };
    },
  });
}
