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

const server = new FastMCP({
  name: "sap-dm-pod2-mcp-server",
  version: VERSION as `${number}.${number}.${number}`,
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
}
