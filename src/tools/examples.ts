import { FastMCP, UserError } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";
import { BASE_DIR } from "../config.js";
import { readFileContent, safePath, isTextFile, READONLY_ANNOTATIONS } from "../helpers.js";

const EXAMPLES_DIR = path.join(BASE_DIR, "examples");

export function registerExamplesTools(server: FastMCP): void {
  server.addTool({
    name: "list_examples",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Lists all available POD2 reference example plugins with their file structure. These are production-grade Ground Truth examples showing correct patterns for Widgets, Actions, Context singletons, and i18n.",
    parameters: undefined,
    execute: async () => {
      if (!fs.existsSync(EXAMPLES_DIR)) {
        throw new Error("[No examples directory found]");
      }
      const entries = fs
        .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("."));
      if (entries.length === 0) {
        return "No example plugins found in examples/";
      }
      const sections: string[] = [];
      for (const dir of entries) {
        const pluginDir = path.join(EXAMPLES_DIR, dir.name);
        const files = listPluginFiles(pluginDir, "");
        const readmePath = path.join(pluginDir, "README.md");
        let description = "";
        if (fs.existsSync(readmePath)) {
          const content = readFileContent(readmePath);
          const lines = content.split("\n");
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith("#")) {
              description = line;
              break;
            }
          }
        }
        sections.push(
          `📦 **${dir.name}**${description ? ` – ${description}` : ""}\n` + files.map((f) => `  ${f}`).join("\n"),
        );
      }
      return `POD2 Reference Examples (${entries.length} plugins):\n\n${sections.join("\n\n")}\n\n→ Use 'get_example' with plugin name and optional file path to read source code.`;
    },
  });

  server.addTool({
    name: "get_example",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the source code of a specific file from a POD2 reference example plugin. Use to see production-grade Ground Truth code patterns. If no file specified, returns all files concatenated.",
    parameters: z.object({
      plugin: z
        .string()
        .describe("Plugin directory name (e.g. 'Customer.Coating', 'Customer.TableView', 'Customer.Utils')"),
      file: z
        .string()
        .optional()
        .describe(
          "Optional: specific file path within the plugin (e.g. 'widget/CoatingWidget.js', 'action/CoatingValidationAction.js', 'extension.json')",
        ),
    }),
    execute: async ({ plugin, file }) => {
      const pluginPath = safePath(EXAMPLES_DIR, plugin);
      if (!pluginPath) {
        throw new UserError(`[Error: Invalid plugin name "${plugin}" – path traversal not allowed.]`);
      }
      if (!fs.existsSync(pluginPath)) {
        const available = fs.existsSync(EXAMPLES_DIR)
          ? fs
              .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
              .filter((d) => d.isDirectory() && !d.name.startsWith("."))
              .map((d) => d.name)
          : [];
        throw new UserError(`Plugin "${plugin}" not found.\n\nAvailable: ${available.join(", ") || "(none)"}`);
      }
      if (file) {
        const filePath = safePath(pluginPath, file);
        if (!filePath) {
          throw new UserError(`[Error: Invalid file path "${file}" – path traversal not allowed.]`);
        }
        if (!fs.existsSync(filePath)) {
          const allFiles = listPluginFiles(pluginPath, "");
          return `File "${file}" not found in ${plugin}.\n\nAvailable files:\n${allFiles.join("\n")}`;
        }
        return `// ═══ ${plugin}/${file} ═══\n\n${readFileContent(filePath)}`;
      }
      const allFiles = listPluginFiles(pluginPath, "");
      const textFiles = allFiles.filter((f) => isTextFile(f) || f.endsWith(".json") || f.endsWith(".properties"));
      const sections: string[] = [];
      for (const relFile of textFiles) {
        const absPath = path.join(pluginPath, relFile);
        if (fs.existsSync(absPath)) {
          const content = readFileContent(absPath);
          sections.push(`// ═══ ${relFile} ═══\n\n${content}`);
        }
      }
      return `# ${plugin} – Complete Source (${textFiles.length} files)\n\n${sections.join("\n\n" + "─".repeat(70) + "\n\n")}`;
    },
  });
}

function listPluginFiles(dir: string, prefix: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...listPluginFiles(path.join(dir, entry.name), relPath));
    } else {
      results.push(relPath);
    }
  }
  return results;
}
