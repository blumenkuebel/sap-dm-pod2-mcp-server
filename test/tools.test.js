import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";

// In-process client/server pair (no port, no subprocess) for exercising tool,
// resource and prompt behaviour against the bundled docu/ content.
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

// ── get_pattern_doc ──────────────────────────────────────────────────────

test("get_pattern_doc returns full content for a known doc", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_pattern_doc", arguments: { name: "basics" } });
  assert.equal(res.isError ?? false, false);
  assert.ok(textOf(res).length > 100);
  await client.close();
});

test("get_pattern_doc summary:true returns a table of contents", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_pattern_doc",
    arguments: { name: "basics", summary: true },
  });
  const text = textOf(res);
  assert.match(text, /Table of contents/i);
  await client.close();
});

test("get_pattern_doc reports available sections when a section is missing", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_pattern_doc",
    arguments: { name: "basics", section: "__no_such_section__" },
  });
  const text = textOf(res);
  assert.match(text, /not found/i);
  assert.match(text, /Available sections/i);
  await client.close();
});

test("get_pattern_doc suggests fuzzy matches for a partial name", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "get_pattern_doc", arguments: { name: "widget" } });
  const text = textOf(res);
  assert.match(text, /Did you mean|widget-patterns/i);
  await client.close();
});

test("get_pattern_doc rejects path traversal with an error", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_pattern_doc",
    arguments: { name: "../package" },
  });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /traversal|Invalid path|No pattern documentation/i);
  await client.close();
});

// ── search_docs ──────────────────────────────────────────────────────────

test("search_docs finds matches for a common term", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "search_docs", arguments: { query: "widget" } });
  const text = textOf(res);
  assert.match(text, /files with matches/i);
  await client.close();
});

test("search_docs reports no matches for a nonsense term", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "search_docs",
    arguments: { query: "zzzqqxnomatchtoken" },
  });
  assert.match(textOf(res), /No matches/i);
  await client.close();
});

// ── search_all ───────────────────────────────────────────────────────────

test("search_all finds cross-area matches", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "search_all", arguments: { query: "widget" } });
  assert.equal(res.isError ?? false, false);
  assert.match(textOf(res), /Cross-search|area/i);
  await client.close();
});

test("search_all mode 'all' narrows multi-token results", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "search_all",
    arguments: { query: "widget lifecycle", mode: "all" },
  });
  assert.equal(res.isError ?? false, false);
  assert.ok(textOf(res).length > 0);
  await client.close();
});

// ── resources & prompts ──────────────────────────────────────────────────

test("resource pod2://patterns/index is readable", async () => {
  const { client } = await connect();
  const res = await client.readResource({ uri: "pod2://patterns/index" });
  assert.ok(Array.isArray(res.contents) && res.contents.length > 0);
  assert.ok((res.contents[0].text ?? "").length > 0);
  await client.close();
});

test("prompt create_widget renders with provided arguments", async () => {
  const { client } = await connect();
  const res = await client.getPrompt({
    name: "create_widget",
    arguments: { namespace: "acme.demo", widgetName: "MyWidget", widgetType: "ControlWidget" },
  });
  assert.ok(Array.isArray(res.messages) && res.messages.length > 0);
  const text = res.messages.map((m) => (typeof m.content?.text === "string" ? m.content.text : "")).join("\n");
  assert.match(text, /acme\.demo|MyWidget/);
  await client.close();
});
