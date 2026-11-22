import { FastMCP } from "fastmcp";
import * as path from "node:path";
import { readFileContent, READONLY_ANNOTATIONS } from "../helpers.js";
import { extractSection } from "./docs.js";
import { DOCU_DIR } from "../config.js";

export function registerValidateTools(server: FastMCP): void {
  server.addTool({
    name: "validate_project",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Validates the POD2 extension in the current working directory against ALL latest standards: common-mistakes (by category, including architectural-conformance anti-patterns — manual fetch/XHR, model-scraping vs PodContext, lifecycle bypass, timeout/polling, DOM-painted UI, global monkey-patching, and reaching into/driving other widgets' controls), SAP DM REST API versions (v1/v2/v3), POD2 Public/Internal API usage, ModelPath/PodContext consistency, MDO/OData. Includes an Architectural Conformance Gate that flags interceptor/rogue-automation widgets. Returns a short ORCHESTRATION INDEX (read it in full first) — the agent then loads each phase's detail on demand via get_pattern_doc({ name: \"validate-project-instructions\", section: \"Phase N\" }) and writes a timestamped VALIDATION-REPORT.",
    parameters: undefined,
    execute: async () => {
      const docPath = path.join(DOCU_DIR, "validate-project-instructions.md");
      const content = readFileContent(docPath);
      if (!content) {
        throw new Error("ERROR: Could not load validation instructions from docu/validate-project-instructions.md");
      }
      // Return only the orchestration index. The full workflow is ~50 KB and would be
      // truncated by the host to a small preview, so the agent loads each phase on demand
      // via get_pattern_doc(section: "Phase N"). Fall back to the whole file if the index
      // section is ever renamed/removed — never hard-fail.
      const index = extractSection(content, "Orchestration Index");
      return index ?? content;
    },
  });
}
