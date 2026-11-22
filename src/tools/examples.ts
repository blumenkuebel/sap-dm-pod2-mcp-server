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
      "Lists all available POD2 reference example extensions with their file structure. These are production-grade Ground Truth examples showing correct patterns for Widgets, Actions, Context singletons, and i18n.",
    parameters: undefined,
    execute: async () => {
      if (!fs.existsSync(EXAMPLES_DIR)) {
        throw new Error("[No examples directory found]");
      }
      const entries = fs
        .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("."));
      if (entries.length === 0) {
        return "No example extensions found in examples/";
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
      return `POD2 Reference Examples (${entries.length} extensions):\n\n${sections.join("\n\n")}\n\n→ Use 'get_example' with the extension name (the \`plugin\` parameter) and optional file path to read source code.`;
    },
  });

  server.addTool({
    name: "get_example",
    annotations: READONLY_ANNOTATIONS,
    description:
      "Returns the source code of a specific file from a POD2 reference example extension. Use to see production-grade Ground Truth code patterns. With no `file`, returns all files concatenated when the extension is small, otherwise a file manifest (with sizes) so you can fetch files individually — pass `all: true` to force the full concatenation.",
    parameters: z.object({
      plugin: z
        .string()
        .describe("Extension directory name (e.g. 'Customer.Coating', 'Customer.TableView', 'Customer.Utils')"),
      file: z
        .string()
        .optional()
        .describe(
          "Optional: specific file path within the extension (e.g. 'widget/CoatingWidget.js', 'action/CoatingValidationAction.js', 'extension.json')",
        ),
      all: z
        .boolean()
        .optional()
        .describe(
          "Optional: if true, force the full concatenation of every file even when large (may be truncated by the host). Default concatenates only small extensions and otherwise returns a manifest.",
        ),
    }),
    execute: async ({ plugin, file, all }) => {
      const pluginPath = safePath(EXAMPLES_DIR, plugin);
      if (!pluginPath) {
        throw new UserError(`[Error: Invalid extension name "${plugin}" – path traversal not allowed.]`);
      }
      if (!fs.existsSync(pluginPath)) {
        const available = fs.existsSync(EXAMPLES_DIR)
          ? fs
              .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
              .filter((d) => d.isDirectory() && !d.name.startsWith("."))
              .map((d) => d.name)
          : [];
        throw new UserError(`Extension "" not found.\n\nAvailable: ${available.join(", ") || "(none)"}`);
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

      // Guard against dumping a large extension whole (the host may truncate an
      // oversized result). Below the threshold, or when all:true is passed,
      // concatenate everything; otherwise return a manifest to fetch piecemeal.
      const CONCAT_LIMIT = 24_000;
      const sized = textFiles.map((relFile) => {
        const absPath = path.join(pluginPath, relFile);
        const bytes = fs.existsSync(absPath) ? fs.statSync(absPath).size : 0;
        return { relFile, absPath, bytes };
      });
      const total = sized.reduce((s, f) => s + f.bytes, 0);

      if (!all && total > CONCAT_LIMIT) {
        const manifest = sized
          .sort((a, b) => a.relFile.localeCompare(b.relFile))
          .map((f) => `  ${f.relFile} — ${f.bytes} bytes`)
          .join("\n");
        return `# ${plugin} — ${textFiles.length} files, ~${Math.round(total / 1000)} KB total (too large to dump whole)\n\n${manifest}\n\n→ Fetch one file: get_example({ plugin: "${plugin}", file: "<path>" })\n→ Force the full concatenation anyway: get_example({ plugin: "${plugin}", all: true })`;
      }

      const sections: string[] = [];
      for (const { relFile, absPath } of sized) {
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
