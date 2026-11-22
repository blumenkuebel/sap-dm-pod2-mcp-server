import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getGuidelinesText, getCapabilitiesText } from "./guidelines-text.js";
import { extractSection, extractSectionHeadings } from "./docs.js";
import { READONLY_ANNOTATIONS } from "../helpers.js";

export function registerGuidelinesTools(server: FastMCP): void {
  server.addTool({
    name: "get_pod2_guidelines",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the essential POD2 development guidelines, rules, AND a complete catalog of all available tools with usage examples. Call this ONCE at the start of any POD2-related task. The full text is ~24 KB; if your host truncates it, use `summary: true` for the section list, then `section` to load one section (e.g. 'Meta Rules', 'Architecture Rules', 'Tool Catalog').",
    parameters: z.object({
      section: z
        .string()
        .optional()
        .describe(
          "Optional: return only the section whose heading matches this (case-insensitive substring on any # / ## heading).",
        ),
      summary: z
        .boolean()
        .optional()
        .describe("Optional: if true, return only the list of section headings instead of the full text."),
    }),
    execute: async ({ section, summary }) => {
      const text = getGuidelinesText();
      if (summary) {
        const headings = extractSectionHeadings(text);
        return `POD2 guidelines — section list (${text.split("\n").length} lines total):\n\n${headings.join("\n")}\n\n→ Load one with get_pod2_guidelines({ section: "<heading>" }).`;
      }
      if (section) {
        const extracted = extractSection(text, section);
        if (extracted) return extracted;
        const headings = extractSectionHeadings(text);
        return `Section "${section}" not found.\n\nAvailable sections:\n${headings.map((s) => `  • ${s}`).join("\n")}`;
      }
      return text;
    },
  });

  server.addTool({
    name: "list_capabilities",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns a structured overview of ALL capabilities of this MCP server: tools, resources, prompts, and available REST API services. Use this if you are unsure what tools are available or how to find specific information.",
    parameters: undefined,
    execute: async () => getCapabilitiesText(),
  });
}
