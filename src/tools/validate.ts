import { FastMCP } from "fastmcp";
import * as path from "node:path";
import { readFileContent, READONLY_ANNOTATIONS } from "../helpers.js";
import { DOCU_DIR } from "../config.js";

export function registerValidateTools(server: FastMCP): void {
  server.addTool({
    name: "validate_project",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Validates the POD2 plugin in the current working directory against ALL latest standards: common-mistakes (#0-#32+), SAP DM REST API versions (v1/v2/v3), POD2 Public/Internal API usage, ModelPath/PodContext consistency, MDO/OData. Returns full validation instructions — the agent then executes the 6-phase workflow and writes VALIDATION-REPORT.md.",
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
