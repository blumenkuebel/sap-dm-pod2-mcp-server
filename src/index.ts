import { fileURLToPath } from "node:url";
import { timingSafeEqual } from "node:crypto";
import { FastMCP, type Logger } from "fastmcp";
import { VERSION, PORT, LOG_LEVEL, type LogLevel } from "./config.js";
import { registerGuidelinesTools } from "./tools/guidelines.js";
import { registerDocsTools } from "./tools/docs.js";
import { registerApiDocsTools } from "./tools/api-docs.js";
import { registerRestApiTools } from "./tools/rest-api.js";
import { registerUi5ApiTools } from "./tools/ui5-api.js";
import { registerSearchTools } from "./tools/search.js";
import { registerExamplesTools } from "./tools/examples.js";
import { registerMdoTools } from "./tools/mdo.js";
import { registerValidateTools } from "./tools/validate.js";
import { registerResources } from "./resources/docs.js";
import { registerPrompts } from "./prompts/generators.js";

// Optional bearer-token auth for the HTTP transport. Enabled only when
// MCP_AUTH_TOKEN is set; empty/unset disables auth (local dev / stdio).
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN?.trim();

// Length-independent constant-time comparison to avoid leaking the token via timing.
function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

// ANSI color helpers — no external dependency needed
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  magenta:"\x1b[35m",
  white:  "\x1b[37m",
  gray:   "\x1b[90m",
};

const LEVEL_STYLE: Record<string, string> = {
  DEBUG: `${C.gray}[DEBUG]${C.reset}`,
  INFO:  `${C.green}[INFO]${C.reset} `,
  WARN:  `${C.yellow}[WARN]${C.reset} `,
  ERROR: `${C.red}${C.bold}[ERROR]${C.reset}`,
  LOG:   `${C.blue}[LOG]${C.reset}  `,
};

// stderr-only so the stdio transport's stdout JSON-RPC channel stays clean
class StderrLogger implements Logger {
  #enabled(level: LogLevel): boolean {
    return LEVELS[level] >= LEVELS[LOG_LEVEL];
  }
  #ts(): string {
    return `${C.gray}${new Date().toLocaleTimeString("de-DE", { hour12: false })}${C.reset}`;
  }
  #fmt(label: string, args: unknown[]): string {
    return `${this.#ts()} ${LEVEL_STYLE[label]} ${args.map(String).join(" ")}`;
  }
  debug(...args: unknown[]): void {
    if (this.#enabled("debug")) console.error(this.#fmt("DEBUG", args));
  }
  info(...args: unknown[]): void {
    if (this.#enabled("info")) console.error(this.#fmt("INFO", args));
  }
  warn(...args: unknown[]): void {
    if (this.#enabled("warn")) console.error(this.#fmt("WARN", args));
  }
  error(...args: unknown[]): void {
    if (this.#enabled("error")) console.error(this.#fmt("ERROR", args));
  }
  log(...args: unknown[]): void {
    if (this.#enabled("info")) console.error(this.#fmt("LOG", args));
  }
}

const logger = new StderrLogger();

const INSTRUCTIONS = [
  "SAP Digital Manufacturing POD2 plugin development knowledge base.",
  "Discovery-first workflow: start with `get_pod2_guidelines` / `list_capabilities`, then narrow down.",
  "For patterns use get_pattern_doc; for class APIs use get_api_doc (accurate) over the coarse *-api-reference docs;",
  "for REST specs prefer get_rest_api with `endpoint` or `summary: true` (full specs can exceed 250 KB);",
  "for SAPUI5 controls use search_ui5_api then get_ui5_api with a `section` slice.",
  "Use search_all when unsure which content area holds the answer.",
  "All tools are read-only and serve bundled, offline content.",
].join(" ");

export function createServer(): FastMCP {
  const server = new FastMCP({
    name: "sap-dm-pod2-mcp-server",
    version: VERSION as `${number}.${number}.${number}`,
    instructions: INSTRUCTIONS,
    logger,
    authenticate: async (request) => {
      if (!AUTH_TOKEN) return {}; // auth disabled
      if (!request) return {}; // stdio transport is not network-exposed
      const raw = request.headers["authorization"];
      const headerValue = Array.isArray(raw) ? raw[0] : raw;
      const provided = headerValue?.startsWith("Bearer ") ? headerValue.slice("Bearer ".length) : headerValue;
      if (!provided || !constantTimeEquals(provided, AUTH_TOKEN)) return null; // -> 401 Unauthorized
      return {};
    },
    health: {
      enabled: true,
      path: "/health",
      message: "ok",
    },
  });

  registerGuidelinesTools(server);
  registerDocsTools(server);
  registerApiDocsTools(server);
  registerRestApiTools(server);
  registerUi5ApiTools(server);
  registerSearchTools(server);
  registerExamplesTools(server);
  registerMdoTools(server);
  registerValidateTools(server);

  registerResources(server);
  registerPrompts(server);

  return server;
}

function startServer(): void {
  const server = createServer();
  const isStdio = process.argv.includes("--stdio");

  server.start({
    transportType: isStdio ? "stdio" : "httpStream",
    httpStream: { port: PORT },
  });

  if (!isStdio) {
    const banner = [
      "",
      `${C.cyan}${C.bold}  ██████╗  ██████╗ ██████╗ ██████╗ ${C.reset}`,
      `${C.cyan}${C.bold}  ██╔══██╗██╔═══██╗██╔══██╗╚════██╗${C.reset}`,
      `${C.cyan}${C.bold}  ██████╔╝██║   ██║██║  ██║ █████╔╝${C.reset}`,
      `${C.cyan}${C.bold}  ██╔═══╝ ██║   ██║██║  ██║██╔═══╝ ${C.reset}`,
      `${C.cyan}${C.bold}  ██║     ╚██████╔╝██████╔╝███████╗${C.reset}`,
      `${C.cyan}${C.bold}  ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝${C.reset}`,
      "",
      `${C.bold}  SAP Digital Manufacturing · POD2 MCP Server${C.reset}`,
      `${C.gray}  ─────────────────────────────────────────────${C.reset}`,
      `${C.green}  ✓${C.reset} Version  ${C.bold}v${VERSION}${C.reset}`,
      `${C.green}  ✓${C.reset} Port     ${C.bold}${PORT}${C.reset}`,
      `${C.green}  ✓${C.reset} Auth     ${C.bold}${AUTH_TOKEN ? "enabled (Bearer token)" : "disabled"}${C.reset}`,
      "",
    ].join("\n");
    process.stderr.write(banner);
  }
}

// Start only when run directly, not when imported (e.g. by tests).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}
