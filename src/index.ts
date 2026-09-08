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

// stderr-only so the stdio transport's stdout JSON-RPC channel stays clean
class StderrLogger implements Logger {
  #enabled(level: LogLevel): boolean {
    return LEVELS[level] >= LEVELS[LOG_LEVEL];
  }
  #ts(): string {
    return new Date().toLocaleTimeString("de-DE", { hour12: false });
  }
  debug(...args: unknown[]): void {
    if (this.#enabled("debug")) console.error(`[${this.#ts()}] [DEBUG]`, ...args);
  }
  info(...args: unknown[]): void {
    if (this.#enabled("info")) console.error(`[${this.#ts()}] [INFO]`, ...args);
  }
  warn(...args: unknown[]): void {
    if (this.#enabled("warn")) console.error(`[${this.#ts()}] [WARN]`, ...args);
  }
  error(...args: unknown[]): void {
    if (this.#enabled("error")) console.error(`[${this.#ts()}] [ERROR]`, ...args);
  }
  log(...args: unknown[]): void {
    if (this.#enabled("info")) console.error(`[${this.#ts()}] [LOG]`, ...args);
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
      const provided = headerValue?.startsWith("Bearer ")
        ? headerValue.slice("Bearer ".length)
        : headerValue;
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
    logger.info(`sap-dm-pod2-mcp-server v${VERSION} listening on port ${PORT}`);
    logger.info(`Auth: ${AUTH_TOKEN ? "enabled (Bearer token required)" : "disabled (set MCP_AUTH_TOKEN to require a Bearer token)"}`);
  }
}

// Start only when run directly, not when imported (e.g. by tests).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}
