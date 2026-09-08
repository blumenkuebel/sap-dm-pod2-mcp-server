import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";

// In-process client for exercising the per-area tool modules. REST/UI5/MDO
// specs are git-ignored and may be absent on CI, so those tests accept either
// a populated result OR the tool's graceful-degradation message.
async function connect() {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return { client };
}

function textOf(res) {
  assert.ok(Array.isArray(res.content), "expected content array");
  return res.content.map((c) => (c.type === "text" ? c.text : "")).join("\n");
}

// True when the tool responded with its "specs not shipped" degradation notice.
function isDegraded(text) {
  return /not available on this deployment|SERVER DEGRADED|No UI5 API bundle/i.test(text);
}

// ── api-docs (docu/pod2-api-specs/ is shipped with the repo) ─────────────

test("get_api_doc resolves the 'Widget' alias to the class doc", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_api_doc", arguments: { name: "Widget" } });
  assert.equal(res.isError ?? false, false);
  assert.match(textOf(res), /Widget/);
  await client.close();
});

test("get_api_doc reports nothing found for an unknown class", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_api_doc",
    arguments: { name: "ZzzNoSuchClass" },
  });
  assert.match(textOf(res), /No API documentation found|Did you mean/i);
  await client.close();
});

test("list_api_docs groups results and honors a filter", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "list_api_docs", arguments: { filter: "widget" } });
  assert.equal(res.isError ?? false, false);
  assert.match(textOf(res), /widget/i);
  await client.close();
});

test("search_api_docs finds matches for a class term", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "search_api_docs", arguments: { query: "PodContext" } });
  assert.match(textOf(res), /files with matches|No matches/i);
  await client.close();
});

test("get_api_index returns the index content", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_api_index", arguments: {} });
  assert.ok(textOf(res).length > 0);
  await client.close();
});

// ── rest-api (docu/sap-dm-api-specs/ is git-ignored) ─────────────────────

test("list_rest_apis lists services or reports graceful degradation", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "list_rest_apis", arguments: {} });
  assert.match(textOf(res), /OpenAPI|REST API|not available/i);
  await client.close();
});

test("get_rest_api summary returns an endpoint overview when specs exist", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_rest_api",
    arguments: { serviceName: "sfc", summary: true },
  });
  const text = textOf(res);
  if (!isDegraded(text) && (res.isError ?? false) === false) {
    assert.match(text, /Endpoints|#|No REST API specification/i);
  }
  await client.close();
});

test("search_rest_apis responds coherently", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "search_rest_apis", arguments: { query: "sfc" } });
  assert.ok(textOf(res).length > 0);
  await client.close();
});

// ── ui5-api (docu/ui5-api-specs/ is git-ignored) ─────────────────────────

test("list_ui5_libraries lists libraries or reports a missing bundle", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "list_ui5_libraries", arguments: {} });
  assert.match(textOf(res), /libraries|No UI5 API bundle/i);
  await client.close();
});

test("search_ui5_api finds symbols when the bundle exists", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "search_ui5_api", arguments: { query: "ComboBox" } });
  const text = textOf(res);
  if ((res.isError ?? false) === false) {
    assert.match(text, /ComboBox|symbol|match/i);
  } else {
    assert.match(text, /No UI5 API bundle/i);
  }
  await client.close();
});

test("get_ui5_api summary slice returns metadata when the bundle exists", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_ui5_api",
    arguments: { symbol: "sap.m.ComboBox", section: "summary" },
  });
  const text = textOf(res);
  if ((res.isError ?? false) === false) {
    assert.match(text, /sap\.m\.ComboBox|properties|methods|summary/i);
  } else {
    assert.match(text, /No bundled UI5 library|No UI5 API bundle/i);
  }
  await client.close();
});

// ── mdo (docu/sap-dm-mdo-specs/ is git-ignored) ──────────────────────────

test("list_mdo_entities lists entities or reports missing metadata", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "list_mdo_entities", arguments: {} });
  assert.match(textOf(res), /entity types|not available/i);
  await client.close();
});

test("get_mdo_entity returns an entity or a graceful message", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_mdo_entity", arguments: { entityName: "ORDER" } });
  const text = textOf(res);
  if (!isDegraded(text) && (res.isError ?? false) === false) {
    assert.match(text, /ORDER|Did you mean/i);
  }
  await client.close();
});

// ── examples (examples/ is shipped with the repo) ────────────────────────

test("list_examples lists the bundled reference plugins", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "list_examples", arguments: {} });
  assert.equal(res.isError ?? false, false);
  assert.match(textOf(res), /Customer\./);
  await client.close();
});

test("get_example returns source for a known plugin", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_example",
    arguments: { plugin: "Customer.HelloWorld" },
  });
  assert.equal(res.isError ?? false, false);
  assert.ok(textOf(res).length > 0);
  await client.close();
});

test("get_example rejects path traversal in the plugin name", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_example", arguments: { plugin: "../src" } });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /traversal|not found/i);
  await client.close();
});

test("get_example reports an unknown plugin with the available list", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_example", arguments: { plugin: "NopePlugin" } });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /not found|Available/i);
  await client.close();
});
