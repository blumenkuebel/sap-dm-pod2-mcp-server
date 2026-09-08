import { FastMCP } from "fastmcp";
import { getGuidelinesText, getCapabilitiesText } from "./guidelines-text.js";

export function registerGuidelinesTools(server: FastMCP): void {
  server.addTool({
    name: "get_pod2_guidelines",
    description: "Returns the essential POD2 development guidelines, rules, AND a complete catalog of all available tools with usage examples. Call this ONCE at the start of any POD2-related task.",
    parameters: undefined,
    execute: async () => getGuidelinesText(),
  });

  server.addTool({
    name: "list_capabilities",
    description: "Returns a structured overview of ALL capabilities of this MCP server: tools, resources, prompts, and available REST API services. Use this if you are unsure what tools are available or how to find specific information.",
    parameters: undefined,
    execute: async () => getCapabilitiesText(),
  });
}
