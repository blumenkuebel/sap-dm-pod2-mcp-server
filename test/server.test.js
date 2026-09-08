import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";

// Drives the built server over an in-process transport — no port, no subprocess.
// Its purpose is to catch FastMCP API drift when the dependency is upgraded.
async function connect() {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return { client };
}

test("registers tools, resources, and prompts", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  assert.ok(tools.length >= 20, `expected many tools, got ${tools.length}`);
  const names = tools.map((t) => t.name);
  for (const expected of ["get_pod2_guidelines", "get_pattern_doc", "search_all", "get_ui5_api"]) {
    assert.ok(names.includes(expected), `missing tool: ${expected}`);
  }
  const { resources } = await client.listResources();
  assert.ok(resources.length > 0, "expected at least one resource");
  const { prompts } = await client.listPrompts();
  assert.ok(prompts.some((p) => p.name === "create_widget"), "missing prompt: create_widget");
  await client.close();
});

test("tools advertise read-only annotations", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  const guide = tools.find((t) => t.name === "get_pod2_guidelines");
  assert.equal(guide?.annotations?.readOnlyHint, true);
  assert.equal(guide?.annotations?.openWorldHint, false);
  await client.close();
});

test("get_pod2_guidelines returns text content", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_pod2_guidelines", arguments: {} });
  assert.equal(res.isError ?? false, false);
  assert.ok(Array.isArray(res.content) && res.content[0]?.type === "text");
  assert.ok(res.content[0].text.length > 0);
  await client.close();
});
