import { FastMCP } from "fastmcp";
import * as path from "node:path";
import { readFileContent, READONLY_ANNOTATIONS } from "../helpers.js";
import { DOCU_DIR } from "../config.js";

export function registerValidateTools(server: FastMCP): void {
  server.addTool({
    name: "validate_project",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Validates the POD2 extension in the current working directory against ALL latest standards: common-mistakes (by category, including architectural-conformance anti-patterns — manual fetch/XHR, model-scraping vs PodContext, lifecycle bypass, timeout/polling, DOM-painted UI, global monkey-patching, and reaching into/driving other widgets' controls), SAP DM REST API versions (v1/v2/v3), POD2 Public/Internal API usage, ModelPath/PodContext consistency, MDO/OData. Includes an Architectural Conformance Gate that flags interceptor/rogue-automation widgets. Returns full validation instructions — the agent then executes the phased workflow and writes VALIDATION-REPORT.md.",
    parameters: undefined,
    execute: async () => {
      const docPath = path.join(DOCU_DIR, "validate-project-instructions.md");
      const content = readFileContent(docPath);
      if (!content) {
        throw new Error("ERROR: Could not load validation instructions from docu/validate-project-instructions.md");
      }
      return content;
    },
  });
}
