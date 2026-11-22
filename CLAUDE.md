# CLAUDE.md – sap-dm-pod2-mcp-server

## Purpose

An MCP server that provides AI assistants with everything needed to develop **SAP Digital Manufacturing POD 2.0** extensions: pattern documentation, API reference, REST API specs, SAPUI5 API, code examples, and validation workflows.

Not an official SAP product — independent community project.

---

## Tech Stack

- **Language**: TypeScript, Node.js ≥ 22
- **MCP Framework**: [FastMCP](https://github.com/punkpeye/fastmcp) v4
- **Transports**: HTTP Stream (default, port 3001) + stdio
- **Build**: `tsc` → `dist/`
- **Tests**: Node.js built-in `node:test`

---

## Project Structure

```
sap-dm-pod2-mcp-server/
├── src/
│   ├── index.ts              ← FastMCP init + transport startup + optional bearer auth
│   ├── config.ts             ← Paths, VERSION, PORT, LOG_LEVEL, release defaults
│   ├── helpers.ts            ← File I/O, caching, TF-IDF search, OpenAPI slicing
│   ├── logging.ts            ← Log level helpers
│   ├── tools/                ← 9 tool modules (guidelines, docs, api-docs, rest-api,
│   │                           ui5-api, search, examples, mdo, validate)
│   ├── resources/docs.ts     ← 3 static resources + 3 URI templates
│   └── prompts/generators.ts ← 5 code-generation prompts
├── docu/
│   ├── *.md                  ← Hand-written pattern & reference docs (MIT, committed)
│   ├── pod2-api-specs/       ← POD2 API class docs, Apache-2.0, SAP-samples (committed)
│   ├── sap-dm-api-specs/     ← REST OpenAPI specs (SAP-proprietary, git-ignored)
│   ├── ui5-api-specs/        ← SAPUI5 API metadata (SAP-proprietary, git-ignored)
│   └── sap-dm-mdo-specs/     ← MDO Extractor metadata (SAP-proprietary, git-ignored)
├── scripts/                  ← Spec fetch/extract scripts + check-doc-links.mjs (doc cross-link checker)
├── test/                     ← helpers.test.js, tools.test.js, server.test.js, tool-modules.test.js, doc-links.test.js
└── examples/                 ← Production-grade reference extensions
    ├── Customer.Coating/
    ├── Customer.HelloWorld/
    ├── Customer.TableView/
    ├── Customer.Utils/
    └── Customer.SoundAlert/
```

---

## Current Spec Snapshot (as of 2026-09-08)

| Spec | Version / Release | Files |
|---|---|---|
| POD2 API Reference | SAP DM 2608 | 505 class docs + `index.md` |
| SAP DM REST OpenAPI | SAP DM 2608 | 82 specs (81 ok on last fetch) |
| SAPUI5 API Reference | 1.151.0 | 18 libraries (sap.m, sap.ui.core, …) |
| MDO Extractor | fetched | `metadata.xml` + `index.md` |

> SAP DM targets UI5 `1.136.x` at runtime. The fetched specs (1.151.0) are a newer SDK version — for production extensions always verify the actual version via `sap.ui.version` in the Fiori launchpad.

---

## Available Tools (23 total)

| Category | Tools |
|---|---|
| Guidelines & Capabilities | `get_pod2_guidelines`, `list_capabilities`, `get_ui5_guidelines` |
| Pattern Docs | `list_pattern_docs`, `get_pattern_doc`, `search_docs` |
| POD2 API | `get_api_doc`, `list_api_docs`, `search_api_docs`, `get_api_index` |
| SAP DM REST API | `list_rest_apis`, `get_rest_api`, `search_rest_apis` |
| SAPUI5 API | `list_ui5_libraries`, `search_ui5_api`, `get_ui5_api` |
| Examples | `list_examples`, `get_example` |
| MDO Extractor | `list_mdo_entities`, `get_mdo_entity`, `search_mdo_entities` |
| Validation | `validate_project` |
| Cross-area | `search_all` |

**Resources (6):** `pod2://patterns`, `pod2://basics`, `pod2://api-index` + 3 URI templates  
**Prompts (5):** `create_widget`, `create_action`, `create_extension`, `migrate_widget`, `validate_project`

---

## Development Commands

```bash
npm run build          # TypeScript → dist/
npm run typecheck      # Type-check without building
npm test               # Build + run tests
npm start              # HTTP on port 3001
npm run start:stdio    # stdio transport
npm run lint           # ESLint
npm run format         # Prettier (write)
npm run check-doc-links # Verify docu/ internal cross-links (also part of npm test)
```

### Spec Generation

```bash
# Update SAPUI5 API (determine version via sap.ui.version in Fiori launchpad):
npm run update-ui5-api-specs -- --source sapui5 --version <version>
npm run check-ui5-api-freshness

# Fetch SAP DM REST specs (SAP Business Accelerator Hub credentials):
SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE='<cookie>' npm run fetch-rest-specs

# Fetch MDO metadata + generate index:
SAP_DM_TOKEN=<token> curl -H "Authorization: Bearer $SAP_DM_TOKEN" \
  "https://api.<region>.dmc.cloud.sap/dmci/v4/extractor/\$metadata" \
  -o docu/sap-dm-mdo-specs/metadata.xml
npm run generate-mdo-index

# Update POD2 API reference (JSDoc bundle from SAP-samples):
npm run extract-docs -- /path/to/jsdoc-pod2-<YYMM>/docs --release <YYMM>
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | HTTP listen port |
| `MCP_AUTH_TOKEN` | — | Bearer auth for HTTP transport (unset = no auth, local dev). `/health` stays public. |
| `LOG_LEVEL` | `info` | `debug` / `info` / `warn` / `error` |
| `SAP_DM_RELEASE` | `2608` | SAP DM release wave (YYMM) |
| `SAP_API_HUB_KEY` | — | API key for `fetch-rest-specs` (never commit) |
| `SAP_DM_TOKEN` | — | Bearer token for `generate-mdo-index` (never commit) |

---

## MCP Client Configuration

### HTTP Stream
```json
{
  "mcpServers": {
    "sap-dm-pod2": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

### stdio
```json
{
  "mcpServers": {
    "sap-dm-pod2": {
      "command": "node",
      "args": ["/path/to/sap-dm-pod2-mcp-server/dist/index.js", "--stdio"]
    }
  }
}
```

---

## Key Architecture Notes

### Content Hierarchy for Agents
When developing POD2 extensions, use tools in this priority order:
1. `get_pod2_guidelines` — core rules, always read first
2. `get_pattern_doc` / `search_docs` — pattern docs for concrete patterns
3. `get_api_doc` / `get_ui5_api` — API reference for specific classes
4. `get_rest_api` — REST endpoints when SAP DM backend calls are needed
5. `get_example` — reference extensions for production-grade code

### §0 Prime Directive
**Standard SAPUI5 controls before custom controls.** Always walk the escalation ladder:
1. Search for a standard control → 2. Escalate within the standard family → 3. Compose standard controls → 4. Custom control (ONLY after team alignment + machine-readable marker)

### `validate_project` workflow loading (tool vs. prompt)
The validation workflow is a single file, `docu/validate-project-instructions.md`, loaded by two surfaces:
- The **prompt** `validate_project` returns the **whole file** (prompt content expands into the conversation and is not truncated).
- The **tool** `validate_project` returns **only the `## Orchestration Index` section** (sliced via `extractSection` from `src/tools/docs.ts`), with a fallback to the whole file if that section is ever missing. An oversized tool result is truncated by the host to a small preview — returning the 50 KB file whole meant agents saw only the first ~2 KB and skipped phases. The agent reads the index, then loads each phase on demand via `get_pattern_doc({ name: "validate-project-instructions", section: "Phase N" })`.

This divergence is **intentional** and guarded by tests in `test/tool-modules.test.js` (index is small; every indexed phase slices to a non-empty block; the prompt still carries the full file). Do not "fix" the tool to return the whole file.

### Git-ignored Directories
`docu/sap-dm-api-specs/`, `docu/ui5-api-specs/`, `docu/sap-dm-mdo-specs/` are SAP-proprietary and not committed. The server starts without them — tools that require them return a clear explanatory message.

### Documentation Maintenance Rules
When editing anything under `docu/`, follow these rules (each prevents a defect class found in past QA):

1. **No dead cross-links.** After changing, splitting, renaming, or renumbering any `docu/*.md`, run `npm run check-doc-links` (also enforced by `test/doc-links.test.js` in `npm test`). Internal links use GitHub heading-slug anchors — when you change a heading, fix every link that targets it.
2. **No counts in prose.** Never write fixed numbers like "28 mistakes", "23 enums", "39 model paths" into doc text or tool descriptions — they go stale. List categories or say "by category" instead.
3. **Single source of truth.** Don't copy a code snippet or table into a second file. Keep it in the one canonical doc for that topic and link to it from elsewhere (e.g. cell types → `tablecell-patterns.md`, bindings → `binding-patterns.md`, mistakes → `common-mistakes-<category>.md`, REST calling → `pod2-public-api-pattern.md`).
4. **Keep `src/tools/docs.ts` in sync with `docu/`.** When you add, delete, or repurpose a `docu/*.md`, update its entry in the `list_pattern_docs` description map so the description matches the file's actual content (a deleted file must have no entry; a repurposed file must not keep its old description).
5. **Preserve the `validate-project-instructions.md` phase contract.** The tool slices `## Orchestration Index`, and the index points agents at each phase by its exact `## Phase N` heading string. If you rename, add, or remove a phase heading, update the index's phase map to match — `test/tool-modules.test.js` asserts every indexed phase resolves to a non-empty slice, so a drift fails `npm test`. Keep per-rule detection greps + fixes in the `common-mistakes-*` category docs (single source of truth); Phase 3 is only an audit-trigger list that points at them.

### Authentication (HTTP)
Optional via `MCP_AUTH_TOKEN`. Without a token set: no auth (for localhost dev). The `/health` endpoint is always public.

---

## Registration in Claude Code

```bash
# HTTP (server must be running):
claude mcp add --scope user --transport http sap-dm-pod2 http://localhost:3001/mcp

# stdio:
claude mcp add --scope user sap-dm-pod2 node /path/to/dist/index.js --stdio
```

---

## License

MIT — © 2026 sap-dm-pod2-mcp-server contributors.  
POD2 API specs: Apache-2.0 (SAP-samples).  
SAPUI5 / SAP DM specs: SAP-proprietary, not redistributed.
