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

// ── validate_project (index slice) + on-demand phase loading ──────────────

// The tool must return the small orchestration index, NOT the whole 50 KB file
// (an oversized tool result gets truncated by the host to a preview, which was
// the root cause of inconsistent validation runs).
test("validate_project returns the small orchestration index, not the full workflow", async () => {
  const { client } = await connect();
  const res = await client.callTool({ name: "validate_project", arguments: {} });
  assert.equal(res.isError ?? false, false);
  const text = textOf(res);
  assert.match(text, /Orchestration Index/);
  assert.match(text, /VALIDATION-REPORT_/); // filename convention surfaced in the index
  assert.match(text, /never overwrite/i); // prior-report guardrail surfaced in the index
  assert.ok(text.length < 8000, `index should be small, got ${text.length} chars`);
  assert.ok(!text.includes("M0 / M15"), "Phase 3 detail must NOT be inlined in the index");
  await client.close();
});

// Each phase string listed in the index table must resolve to a non-empty slice.
// Guards against a future heading rename silently breaking on-demand loading.
test("every phase in the index resolves via get_pattern_doc section loading", async () => {
  const { client } = await connect();
  const sections = [
    "Phase 0",
    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 3b",
    "Phase 3c",
    "Phase 3d",
    "Phase 4",
    "Phase 5",
    "Phase 6",
  ];
  for (const section of sections) {
    const res = await client.callTool({
      name: "get_pattern_doc",
      arguments: { name: "validate-project-instructions", section },
    });
    const text = textOf(res);
    assert.ok(
      text.length > 0 && !/not found/i.test(text),
      `section "${section}" did not resolve to a slice`,
    );
    // extractSection stops at the next equal-or-higher heading, so a phase slice
    // must not bleed into the following phase.
    assert.ok(text.includes(section), `slice for "${section}" should contain its own heading`);
  }
  await client.close();
});

test("Phase 3 slice does not bleed into Phase 3b", async () => {
  const { client } = await connect();
  const res = await client.callTool({
    name: "get_pattern_doc",
    arguments: { name: "validate-project-instructions", section: "Phase 3" },
  });
  const text = textOf(res);
  assert.match(text, /Common Mistakes Audit/);
  assert.ok(!text.includes("Best-Practice Pattern Audit"), "Phase 3 must stop before Phase 3b");
  await client.close();
});

// Intentional tool/prompt divergence: the PROMPT still emits the whole workflow
// (prompt content expands into the conversation and is not truncated).
test("validate_project PROMPT still loads the full workflow, not just the index", async () => {
  const { client } = await connect();
  const res = await client.getPrompt({ name: "validate_project", arguments: {} });
  const text = res.messages
    .map((m) => (typeof m.content?.text === "string" ? m.content.text : ""))
    .join("\n");
  assert.match(text, /Orchestration Index/); // index is part of the file too
  assert.match(text, /Phase 6 — Chat Summary/); // a late-phase marker only present in the full file
  assert.ok(text.length > 20000, `prompt should carry the full file, got ${text.length} chars`);
  await client.close();
});
