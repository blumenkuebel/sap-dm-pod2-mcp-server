import { FastMCP } from "fastmcp";
import { VERSION, PORT } from "./config.js";
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

const server = new FastMCP({
  name: "sap-dm-pod2-mcp-server",
  version: VERSION as `${number}.${number}.${number}`,
  authenticate: async (request) => {
    if (!AUTH_TOKEN) return {}; // auth disabled
    if (!request) return {}; // stdio transport is not network-exposed
    const raw = request.headers["authorization"];
    const headerValue = Array.isArray(raw) ? raw[0] : raw;
    const provided = headerValue?.startsWith("Bearer ")
      ? headerValue.slice("Bearer ".length)
      : headerValue;
    if (!provided || provided !== AUTH_TOKEN) return null; // -> 401 Unauthorized
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

const isStdio = process.argv.includes("--stdio");

server.start({
  transportType: isStdio ? "stdio" : "httpStream",
  httpStream: { port: PORT },
});

if (!isStdio) {
  console.log(`sap-dm-pod2-mcp-server v${VERSION} listening on port ${PORT}`);
  console.log(`Auth: ${AUTH_TOKEN ? "enabled (Bearer token required)" : "disabled (set MCP_AUTH_TOKEN to require a Bearer token)"}`);
}
