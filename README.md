# sap-dm-pod2-mcp-server

An MCP (Model Context Protocol) server for **SAP Digital Manufacturing POD 2.0** extension development.

Provides AI assistants with access to pattern documentation, API references, REST API specs, UI5 API, code examples, and validation workflows — everything needed to build, review, and migrate POD 2.0 plugins.

Built with [FastMCP](https://github.com/punkpeye/fastmcp) — supports both **HTTP Stream** and **stdio** transports.

> **Disclaimer.** This is an independent, community-maintained project. It is **not an official
> SAP product** and is **not affiliated with, sponsored, or endorsed by SAP**. "SAP",
> "SAP Digital Manufacturing", "SAPUI5", and related names are trademarks of SAP SE, used here
> only for identification. **SAP provides no support** for this project — issues and questions
> go through this repository, not SAP support channels.

> **Note on bundled content.** This repository ships the hand-written pattern & reference docs and the reference example plugins under MIT. It also ships the **POD2 API reference** (`docu/pod2-api-specs/`), generated from the POD 2.0 JSDoc bundle SAP publishes under **Apache-2.0**, and the UI5 API bundle generated from **OpenUI5** (Apache-2.0) — each carries its own LICENSE/NOTICE. It does **not** redistribute tenant-bound SAP specs (SAP DM REST OpenAPI specs, MDO metadata) — those are release-bound SAP content you fetch locally for your own licensed release. See [Bring your own SAP specs](#bring-your-own-sap-specs).

---

## Capabilities

| Category | Count | Details |
|---|---|---|
| Tools | 23 | Guidelines, docs, API refs, REST specs, UI5 API, examples, MDO, validation, search |
| Resources | 6 | Pattern index, basics, API index + 3 URI templates |
| Prompts | 5 | create_widget, create_action, create_extension, migrate_widget, validate_project |

### Tools

| Tool | Description |
|---|---|
| `get_pod2_guidelines` | Core development rules, widget types, coding standards |
| `list_capabilities` | Overview of all tools, resources, and prompts |
| `list_pattern_docs` | Index of all pattern documentation files |
| `get_pattern_doc` | Read a specific pattern doc (common-mistakes, widget-patterns, etc.) |
| `search_docs` | Full-text search across pattern documentation |
| `get_api_doc` | API reference for a POD2 class (e.g. Widget, Action, PodContext) |
| `list_api_docs` | List POD2 API class docs |
| `search_api_docs` | Search API reference docs |
| `get_api_index` | Browse all API classes and namespaces |
| `list_rest_apis` | List SAP DM REST API specifications *(requires fetched specs)* |
| `get_rest_api` | OpenAPI spec for a service (e.g. order, sfc, material) |
| `search_rest_apis` | Search across REST API specs |
| `list_ui5_libraries` | List bundled OpenUI5 libraries |
| `search_ui5_api` | Search OpenUI5 symbols across all libraries |
| `get_ui5_api` | Full metadata for a UI5 class (properties, methods, events) |
| `get_ui5_guidelines` | Curated SAPUI5 coding guidelines |
| `list_examples` | List reference example plugins with file structure |
| `get_example` | Read source code from a reference plugin |
| `list_mdo_entities` | List SAP DM MDO Extractor OData V4 entities *(requires fetched specs)* |
| `get_mdo_entity` | Full property list for an MDO entity |
| `search_mdo_entities` | Search MDO entity definitions |
| `validate_project` | Validate a POD2 plugin against all standards |
| `search_all` | Cross-area search: pattern docs + API specs + REST specs |

---

## Installation

```bash
git clone <repo>
cd sap-dm-pod2-mcp-server
npm install
npm run build
```

**Requirements:** Node.js ≥ 22

The server starts and runs fine with no SAP specs present — the tools that need them
return a clear *"run `npm run prepare:specs`"* message instead of crashing. To enable the
full API/REST/MDO/UI5 tooling, fetch the specs for your release (next section).

---

## Bring your own SAP specs

SAP Digital Manufacturing ships in **release waves** (format `YYMM`, e.g. `2601`, `2608`).

The **POD2 API reference** (`docu/pod2-api-specs/`) is generated from the POD 2.0 JSDoc bundle
SAP publishes under **Apache-2.0** and is **shipped with this repo** (with its own
LICENSE/NOTICE/VERSION.md). You only need to re-run `extract-docs` to refresh or bump it to a
different release wave. The current release bundles are published at
[SAP-samples/…/documentation](https://github.com/SAP-samples/digital-manufacturing-extension-samples/tree/main/documentation)
(files named `jsdoc-pod2-<YYMM>.zip`).

The **REST OpenAPI specs** and **MDO metadata** are tenant-bound SAP content and are **not**
redistributed — you fetch or generate them locally from sources you are licensed to use; they
land in `docu/` (git-ignored) and are loaded at runtime.

```bash
npm run prepare:specs                     # default release (see DEFAULT_DM_RELEASE)
npm run prepare:specs -- --release 2608   # or a specific YYMM wave
```

`prepare:specs` runs three generators:

| Script | Produces | Source |
|---|---|---|
| `extract-docs` | `docu/pod2-api-specs/` (POD2 API class docs) | POD2 JSDoc bundle (Apache-2.0, SAP-samples) — shipped; re-run to refresh/bump release |
| `generate-mdo-index` | `docu/sap-dm-mdo-specs/` (MDO index) | MDO Extractor `$metadata` (your tenant) |
| `update-ui5-api-specs` | `docu/ui5-api-specs/` (OpenUI5, Apache-2.0) | fetched from `sdk.openui5.org` |

The **REST OpenAPI specs** are fetched via the SAP Business Accelerator Hub. Requires an [api.sap.com](https://api.sap.com) API key and a browser session cookie:

```bash
SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE=<cookie> npm run fetch-rest-specs -- --hub
```

Get credentials: `api.sap.com` → profile → Settings → show API Key; cookie via DevTools (F12) → Network → any api.sap.com request → copy Cookie header. Specs are converted from Swagger 2.0 to OpenAPI 3.0 automatically.

**Choosing / bumping the release.** Set the release once via the `SAP_DM_RELEASE` env var
(default: `DEFAULT_DM_RELEASE` in [`src/config.ts`](src/config.ts)), or per-invocation with
`--release <YYMM>`. Each fetched spec set records its release in a `VERSION.md` inside its
directory, so you can update 2605 → 2608 → … and see which wave is loaded.

Only OpenUI5 libraries are bundled by `update-ui5-api-specs`; SAPUI5-only libraries
(`sap.suite.*`, `sap.ui.comp`, `sap.chart`, `sap.gantt`, …) are intentionally omitted. Audit
the pinned OpenUI5 version with `npm run check-ui5-api-freshness`.

---

## Usage

### HTTP Stream (default)

```bash
npm start
# Server running at http://localhost:3001/mcp
# Health: http://localhost:3001/health
```

Custom port:

```bash
PORT=8080 npm start
```

### stdio

```bash
npm run start:stdio
```

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

## Development

```bash
npm run typecheck   # Type-check without building
npm run build       # Compile TypeScript → dist/
npm start           # HTTP on port 3001
npm run start:stdio # stdio transport

# Spec generators (see "Bring your own SAP specs")
npm run prepare:specs             # POD2 API docs (refresh) + MDO index + OpenUI5
npm run fetch-rest-specs          # REST OpenAPI (needs --base-url + SAP_DM_TOKEN)
npm run check-ui5-api-freshness   # audit pinned OpenUI5 version
```

Documentation files in `docu/` and examples in `examples/` are loaded at runtime — no rebuild needed after editing them (60s cache TTL).

---

## Project Structure

```
sap-dm-pod2-mcp-server/
├── src/
│   ├── index.ts              ← FastMCP init + transport startup
│   ├── config.ts             ← Paths, version, port, log level
│   ├── helpers.ts            ← File I/O, caching, TF-IDF search, OpenAPI slicing
│   ├── logging.ts            ← Log level helpers
│   ├── tools/                ← 9 tool modules
│   ├── resources/docs.ts     ← 3 static resources + 3 URI templates
│   └── prompts/generators.ts ← 5 code-generation prompts
├── docu/                     ← Pattern docs (shipped) + fetched specs (git-ignored)
│   ├── *.md                  ← Hand-written pattern & reference docs (MIT, shipped)
│   ├── pod2-api-specs/       ← POD2 API class docs (Apache-2.0, SAP-samples) — shipped
│   ├── sap-dm-api-specs/     ← REST API OpenAPI specs — fetched locally, not shipped
│   ├── ui5-api-specs/        ← OpenUI5 API bundle (Apache-2.0) — generated locally
│   └── sap-dm-mdo-specs/     ← MDO Extractor metadata — fetched locally, not shipped
├── scripts/                  ← Spec fetch/extract generators (prepare:specs, fetch-rest-specs, …)
├── examples/                 ← Production-grade reference plugins
│   ├── Customer.Coating/
│   ├── Customer.HelloWorld/
│   ├── Customer.TableView/
│   ├── Customer.Utils/
│   └── Customer.SoundAlert/
├── package.json
└── tsconfig.json
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | HTTP listen port |
| `LOG_LEVEL` | `info` | Log verbosity: `debug`, `info`, `warn`, `error` |
| `SAP_DM_RELEASE` | `2608` | SAP DM release wave (`YYMM`) used when fetching/generating specs |
| `SAP_DM_TOKEN` | — | Bearer token for `fetch-rest-specs` (never committed) |

---

## License

Licensed under the [MIT License](LICENSE) — © 2026 sap-dm-pod2-mcp-server contributors.

Third-party attributions are collected in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md):

- **Pattern & reference documentation** (`docu/*.md`) — portions adapted from
  [KevinHunter12/SAP_DM_AI_POD_SKILL](https://github.com/KevinHunter12/SAP_DM_AI_POD_SKILL) (MIT).
- **POD2 API reference** (`docu/pod2-api-specs/`) — generated from the POD 2.0 JSDoc bundle in
  [SAP-samples/digital-manufacturing-extension-samples](https://github.com/SAP-samples/digital-manufacturing-extension-samples) (Apache-2.0); the folder carries its own LICENSE + NOTICE.
- **OpenUI5 API metadata** (`docu/ui5-api-specs/`, when generated) — from
  [OpenUI5](https://github.com/SAP/openui5) (Apache-2.0); the folder carries its own LICENSE + NOTICE.

Tenant-bound SAP specs (SAP DM REST OpenAPI, MDO metadata) are **not** covered by this license
and are **not** redistributed here — you obtain them under the applicable SAP terms of use for
your own release. See [Bring your own SAP specs](#bring-your-own-sap-specs).
