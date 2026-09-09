# sap-dm-pod2-mcp-server

An MCP (Model Context Protocol) server for **SAP Digital Manufacturing POD 2.0** extension development.

Provides AI assistants with access to pattern documentation, API references, REST API specs, UI5 API, code examples, and validation workflows — everything needed to build, review, and migrate POD 2.0 plugins.

Built with [FastMCP](https://github.com/punkpeye/fastmcp) — supports both **HTTP Stream** and **stdio** transports.

> **Disclaimer.** This is an independent, community-maintained project. It is **not an official
> SAP product** and is **not affiliated with, sponsored, or endorsed by SAP**. "SAP",
> "SAP Digital Manufacturing", "SAPUI5", and related names are trademarks of SAP SE, used here
> only for identification. **SAP provides no support** for this project — issues and questions
> go through this repository, not SAP support channels.

> **Note on bundled content.** This repository ships the hand-written pattern & reference docs and the reference example plugins under MIT. It also ships the **POD2 API reference** (`docu/pod2-api-specs/`), generated from the POD 2.0 JSDoc bundle SAP publishes under **Apache-2.0**. The SAPUI5 API metadata is fetched locally from the SAPUI5 SDK under your own SAP license. It does **not** redistribute tenant-bound SAP specs (SAP DM REST OpenAPI specs, MDO metadata) — those are release-bound SAP content you fetch locally for your own licensed release. See [Step 3: Load the REST API specifications](#step-3-load-the-rest-api-specifications).

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
| `list_ui5_libraries` | List bundled SAPUI5 libraries |
| `search_ui5_api` | Search SAPUI5 symbols across all libraries |
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

## Getting started

Follow these steps in order.

### Step 1: Install the server

```bash
git clone <repo>
cd sap-dm-pod2-mcp-server
npm install
npm run build
```

**Requirements:** Node.js ≥ 22


The server can start without SAP specifications. Tools that require them
return a clear message explaining which preparation command is missing.

### Step 2: Prepare the SAPUI5 API reference

SAPUI5 is the preferred UI framework for POD 2.0 extensions. Fetch the API metadata for
the UI5 version used by your SAP Digital Manufacturing system:

```bash
npm run update-ui5-api-specs -- --source sapui5
```

The metadata is written to the `docu/ui5-api-specs/` directory and is used by
the `list_ui5_libraries`, `search_ui5_api`, and `get_ui5_api` tools. SAPUI5 metadata is
proprietary and must not be redistributed. By default this fetches the SDK's newest
published version, which is **not** the same as your tenant's actual runtime version and
may describe controls or properties that don't exist yet in your SAP DM release.

The UI5 runtime version changes with every SAP DM release wave and does not follow a
predictable formula — find the exact version your tenant runs by opening the SAP DM
Fiori launchpad, opening the browser DevTools console, and evaluating `sap.ui.version`.
Then pass it explicitly:

```bash
npm run update-ui5-api-specs -- --source sapui5 --version <version>
```

Audit the selected SAPUI5 version later with `npm run check-ui5-api-freshness`.

### Step 3: Load the REST API specifications

SAP Digital Manufacturing ships in **release waves** (format `YYMM`, e.g. `2605`, `2608`).

The REST OpenAPI specifications are tenant-bound SAP content and are not redistributed.
Load them locally from the SAP Business Accelerator Hub using credentials for your licensed
SAP Digital Manufacturing release:

```bash
SAP_API_HUB_KEY=<key> SAP_API_HUB_COOKIE='<cookie>' npm run fetch-rest-specs
```

The **REST OpenAPI specs** are fetched via the SAP Business Accelerator Hub. This requires
an [api.sap.com](https://api.sap.com) API key and a browser session cookie:

> **Important:** wrap the cookie value in **single quotes** — it contains semicolons and special characters that the shell would otherwise split.

**Get credentials:**
- **API key:** [api.sap.com](https://api.sap.com) → profile → Settings → show API Key
- **Cookie:** Log in to api.sap.com, open DevTools (F12) → Network tab → reload the page → click any request to `api.sap.com` → Request Headers → copy the full `Cookie` header value

**Example** (truncated for readability):

```bash
SAP_API_HUB_KEY=AaBbCc123456 \
  SAP_API_HUB_COOKIE='country=DE; IDP_SESSION_MARKER_accounts=eyJ...; JSESSIONID=s%3A...' \
  npm run fetch-rest-specs
```

Specs are converted from Swagger 2.0 to OpenAPI 3.0 automatically. Without `SAP_API_HUB_COOKIE` the catalog step is skipped and the script re-downloads specs for existing artifact IDs only.

SAP DM is SaaS, so the Business Accelerator Hub always serves the current release — this
step always fetches the newest specs and there is no version to pick. Just re-run it to
refresh. The fetch date is recorded in `docu/sap-dm-api-specs/VERSION.md`.

---

### Step 4: Load MDO metadata

MDO metadata is required for the MDO entity tools. It is tenant-bound SAP content and is
not redistributed. Export the OData V4 `$metadata` document from your SAP
Digital Manufacturing tenant and generate the local index:

**1. Export `$metadata` from your tenant** (requires a bearer token):

```bash
mkdir -p docu/sap-dm-mdo-specs
SAP_DM_TOKEN=<token> curl -H "Authorization: Bearer $SAP_DM_TOKEN" \
  "https://api.<region>.dmc.cloud.sap/dmci/v4/extractor/\$metadata" \
  -o docu/sap-dm-mdo-specs/metadata.xml
```

The hostname depends on your system type: production systems use `api.<region>.dmc.cloud.sap`,
test/non-production systems typically use `api.test.<region>.dmc.cloud.sap`. Check your SAP DM
tenant's actual API URL (e.g. in the Fiori launchpad or your BTP subaccount) and adjust accordingly.

**2. Generate the Markdown index:**

```bash
npm run generate-mdo-index
```

Get a bearer token from the SAP DM Fiori launchpad developer tools. Tokens expire quickly,
so export the metadata and run the generator in the same session.

### Step 5: Optional - Update the POD2 API reference

The POD2 API reference is included in `docu/pod2-api-specs/` and is ready to use. To
update it to a different SAP Digital Manufacturing release, download the JSDoc bundle
for that release (`jsdoc-pod2-<YYMM>.zip`) from
[SAP-samples/digital-manufacturing-extension-samples](https://github.com/SAP-samples/digital-manufacturing-extension-samples/tree/main/documentation),
extract it, then run the update script with the path to the extracted `docs` folder:

```bash
npm run extract-docs -- /path/to/jsdoc-pod2-<YYMM>/docs --release <YYMM>
```

`--release <YYMM>` labels the generated index with the release wave — pass the same
`<YYMM>` as the downloaded bundle. This updates only the local POD2 API reference. It
does not load the REST API or MDO metadata.

### Step 6: Start the server

Start the HTTP transport (the default):

```bash
npm start
# Server running at http://localhost:3001/mcp
# Health: http://localhost:3001/health
```

For an MCP client that starts the server as a local process, use the stdio transport:

```bash
npm run start:stdio
```

## Usage

### HTTP Stream (default)

Custom port:

```bash
PORT=8080 npm start
```

> **Security:** the HTTP transport has no authentication by default. For anything beyond
> localhost, set `MCP_AUTH_TOKEN` to require an `Authorization: Bearer <token>` header (or
> run the server behind an authenticating reverse proxy). The `/health` endpoint stays public.

```bash
MCP_AUTH_TOKEN=<your-token> npm start
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
```

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
│   ├── ui5-api-specs/        ← SAPUI5 API metadata — generated locally, not shipped
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
| `MCP_AUTH_TOKEN` | — | When set, the HTTP transport requires `Authorization: Bearer <token>`; empty/unset disables auth (local dev). `/health` stays public. |
| `LOG_LEVEL` | `info` | Log verbosity: `debug`, `info`, `warn`, `error` |
| `SAP_DM_RELEASE` | `2608` | SAP DM release wave (`YYMM`) used when fetching/generating specs |
| `SAP_API_HUB_KEY` | — | API key for `fetch-rest-specs` (never committed) |
| `SAP_DM_TOKEN` | — | Bearer token for `generate-mdo-index` (never committed) |

---

## License

Licensed under the [MIT License](LICENSE) — © 2026 sap-dm-pod2-mcp-server contributors.

Third-party attributions are collected in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md):

- **Pattern & reference documentation** (`docu/*.md`) — portions adapted from
  [KevinHunter12/SAP_DM_AI_POD_SKILL](https://github.com/KevinHunter12/SAP_DM_AI_POD_SKILL) (MIT).
- **POD2 API reference** (`docu/pod2-api-specs/`) — generated from the POD 2.0 JSDoc bundle in
  [SAP-samples/digital-manufacturing-extension-samples](https://github.com/SAP-samples/digital-manufacturing-extension-samples) (Apache-2.0); the folder carries its own LICENSE + NOTICE.
- **SAPUI5 API metadata** (`docu/ui5-api-specs/`, when generated) — fetched locally from
  the SAPUI5 SDK under the applicable SAP license; it is not redistributed.

Tenant-bound SAP specs (SAP DM REST OpenAPI, MDO metadata) are **not** covered by this license
and are **not** redistributed here — you obtain them under the applicable SAP terms of use for
your own release. See [Step 3: Load the REST API specifications](#step-3-load-the-rest-api-specifications).
