# POD 2.0 Extension Development – Usage Guide

> How to use the `sap-dm-pod2-mcp-server` to develop and iterate on POD 2.0 extensions with AI assistance.

> [!IMPORTANT]
> **In every case: copy `CLAUDE.md` into your plugin directory.** It holds all POD2 rules — without it the agent has no POD2 rules, misses the reasoning-first / source-or-silence meta-rules, and produces plausible-looking but non-compliant code.
>
> **The rules must be loaded at the start of every session** (Scaffold AND every Iteration). How depends on your agent:
> - **Claude Code** — auto-loads `CLAUDE.md` from the project root every session. Nothing to type.
> - **Cline / Cursor / other agents** — do **not** auto-load it. Begin your first prompt with:
>   > **Read `CLAUDE.md`, then …**
>
> The `.scaffold-done` marker file selects Scaffold vs. Iteration mode, but the rules always need to be present at session start either way.

> [!IMPORTANT]
> **For the initial Phase A scaffold, use a strong reasoning-tier LLM.**
>
> Phase A sets architecture, base classes, imports, i18n structure, and PPD wiring — everything Phase B builds on. A weak model at this step compounds through every iteration.
>
> As of mid-2026, the recommended choice is **Anthropic Opus 4.x** (Opus 4.6 / 4.7 / 4.8) — or the strongest reasoning-tier model your agent supports.
>
> **Phase B (iteration)** can safely run on a mid-tier model (e.g. Sonnet-class) — patches are constrained by existing code and rarely need cross-file reasoning.

---

## Overview

This workflow enables rapid development of SAP Digital Manufacturing POD 2.0 extensions using an AI coding agent backed by **the `sap-dm-pod2-mcp-server`**:

- **`sap-dm-pod2-mcp-server`** — POD 2.0 / SAP DM specifics **plus** SAPUI5 API reference (patterns, POD2 API, SAPUI5 API, REST specs, MDO entities, examples, scaffolding prompts). The UI5-Lookup lives natively in `sap-dm-pod2-mcp-server` (bundled offline, pinned to SAP DM's UI5 target) — a second `sapui5-mcp-server` is no longer needed.

The server exposes:

- **47** POD2 pattern documentation files
- **505** POD2 API class references
- **79** SAP DM REST API OpenAPI specs *(fetched locally, not shipped)*
- **53** MDO Extractor (OData V4) analytical entities *(fetched locally, not shipped)*
- **5** production-grade reference plugins
- **~3500** SAPUI5 API symbols across 7 bundled OpenUI5 libraries (`sap.m`, `sap.ui.core`, `sap.f`, `sap.ui.layout`, `sap.ui.table`, `sap.tnt`, `sap.ui.unified`) — pinned to SAP DM's UI5 version
- Full-text search across all POD2 content

Only `sap-dm-pod2-mcp-server` is required (see §Source-or-Silence in `CLAUDE.md`).

---

## 🧭 Mental Model: Two Phases, Two Modes

POD 2.0 plugins cannot be UI-tested without deploying them — the framework, layout container, and runtime context only exist after upload. Therefore the workflow has two distinct phases:

```
┌──────────────────────────────────────────────┐
│  PHASE A — SCAFFOLD (one time)               │
│  Agent produces a complete first draft       │
│  Minimal upfront discussion                  │
└──────────────────────────────────────────────┘
                  ↓ (you pack & upload)
┌──────────────────────────────────────────────┐
│  Deploy to SAP DM, view in POD 2.0           │  ← outside the agent
└──────────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────────┐
│  PHASE B — ITERATE (n times)                 │
│  Refine based on what you see in POD         │
│  Discuss UI with screenshots, then patch     │
└──────────────────────────────────────────────┘
                  ↓ (re-pack & re-upload)
                  ↺ back to ITERATE
```

The agent automatically detects which phase it is in via a `.scaffold-done` marker file.

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **AI coding agent** | Any agent with MCP support (see [Agent Setup](#agent-setup) below) |
| **sap-dm-pod2-mcp-server** | Run locally (`npm start`) or point to a deployed BTP endpoint — see [MCP Server Setup](#mcp-server-setup) |

### MCP Server Setup

**`sap-dm-pod2-mcp-server`** — run locally or use a deployed instance:

```
http://localhost:3001/mcp
```

Start locally:
```bash
cd sap-dm-pod2-mcp-server
npm install && npm run build
npm start
```

> **Hosted URL:** once deployed on BTP, replace `http://localhost:3001/mcp` with the app's `/mcp` endpoint.

Verify reachability:
```bash
curl http://localhost:3001/health
```

> **Migrating from `sapui5-mcp-server`**: remove it from your MCP config. `get_ui5_api` / `search_ui5_api` / `list_ui5_libraries` are native in `sap-dm-pod2-mcp-server`, backed by an offline JSON bundle.

> **Which agent?** See [Agent-specific notes](#-agent-specific-notes) at the end of this document for Cline and Claude Code setup details.

---

## 📦 MCP Server Capabilities (at a glance)

The full tool catalog also lives in `CLAUDE.md`. This section is a quick reference for both servers side-by-side.

### `sap-dm-pod2-mcp-server` — 23 tools · 5 prompts · 6 resource URIs

**Tools (23)** — call once at start: `get_pod2_guidelines`.

| Category | Tools |
|---|---|
| Overview | `get_pod2_guidelines`, `list_capabilities` |
| Patterns (47 docs) | `list_pattern_docs`, `get_pattern_doc`, `search_docs` |
| POD2 API (505 classes) | `get_api_index`, `list_api_docs`, `get_api_doc`, `search_api_docs` |
| UI5 API (~3500 symbols) | `list_ui5_libraries`, `search_ui5_api`, `get_ui5_api`, `get_ui5_guidelines` |
| REST APIs (79 specs) | `list_rest_apis`, `get_rest_api`, `search_rest_apis` |
| MDO Entities (53) | `list_mdo_entities`, `get_mdo_entity`, `search_mdo_entities` |
| Examples (5 plugins) | `list_examples`, `get_example` |
| Cross-cutting | `search_all` |
| Validation | `validate_project` |

**Prompts (5)**:

| Prompt | Use |
|--------|-----|
| `create_widget` | Generate Widget + i18n + `extension.json` entry |
| `create_action` | Generate Action (validation / execution / standalone) |
| `create_extension` | Generate full plugin (10 files) — reads `POD2_PLUGIN_TEMPLATE.md` |
| `migrate_widget` | Migrate existing POD 2.0 widget **or HTML5 monitoring/dashboard app** (`sourceFormat: "pod2" \| "html5" \| "auto"`) with feature-loss prevention; HTML5 adds chart-library mapping, Residue Gate, and standard-first dashboard patterns (no custom KPI-tile controls) |
| `validate_project` | Validate plugin in cwd against all standards |

**Resources (6 URIs)**:

| URI | Description |
|-----|-------------|
| `pod2://patterns/index` | Pattern index |
| `pod2://patterns/basics` | Development fundamentals |
| `pod2://patterns/{name}` | Any pattern doc by name (templated) |
| `pod2://api/index` | POD2 API class index |
| `pod2://api/{className}` | One API class doc (templated) |
| `pod2://rest-api/{serviceName}` | OpenAPI spec for a SAP DM service (templated) |

### `sapui5-mcp-server` — removed

The external `sapui5-mcp-server` (`npx @ui5/mcp-server`) is no longer needed. Its functionality has been replaced by `sap-dm-pod2-mcp-server`'s native `get_ui5_api` / `search_ui5_api` / `list_ui5_libraries` — same data (bundled offline from OpenUI5, pinned to SAP DM's UI5 target), no `projectDir` requirement, no external stdio process. If you had `sapui5-mcp-server` in your MCP config, remove it.

---

# 🚀 Phase A: Initial Scaffold (one-time)

> Goal: produce a complete, deployable first draft. UI fine-tuning happens in Phase B with the real POD render.

### A1. Create a new project folder

```bash
mkdir Customer.MyNewPlugin
cd Customer.MyNewPlugin
```

Naming convention: `Customer.<PluginName>`.

### A2. Copy template files

Copy the agent rules and template:

```bash
cp ../usage/CLAUDE.md .
cp ../usage/.gitignore .
cp ../usage/POD2_PLUGIN_TEMPLATE.md .
```

`CLAUDE.md` holds all POD2 / SAP DM / UI5 rules and is agent-agnostic — one file for every MCP-capable agent. Claude Code auto-loads it; other agents load it with *"read CLAUDE.md"* (see the top banner).

Your folder should look like:
```
Customer.MyNewPlugin/
├── CLAUDE.md                ← POD2 rules (Claude Code auto-loads; others "read CLAUDE.md")
├── .gitignore
└── POD2_PLUGIN_TEMPLATE.md  ← Fill this in next
```

### A3. Fill in the template

Edit `POD2_PLUGIN_TEMPLATE.md` with your plugin requirements:

1. **Plugin metadata** – Name, Namespace, Description, Category
2. **Widget** _(optional)_ – free-form bullets describing layout, controls, user interaction, behavior; plus an optional inline JSON sample of the data shape it consumes
3. **Actions** _(zero or more)_ – one `### Action: <Name>` block per action (e.g. Validate, Execute, Cancel, Reset). Free-form bullets for trigger / logic / inputs / outputs, plus an optional inline JSON sample for request or response. Duplicate the block as often as needed.

> 💡 See `POD2_PLUGIN_EXAMPLE.md` (in the `usage/` folder of the repo) for a fully filled-in example (Coating plugin with `Validate` + `Execute` actions).

### A4. Open the folder in your editor

```bash
code .   # VS Code
# or open with your preferred editor / IDE
```

### A5. Generate the plugin

Open your AI agent and make sure the rules are loaded (see the top banner): **Claude Code** picks them up automatically; **other agents** need `Read CLAUDE.md,` as the first words of your prompt (prepend it to the examples below).

**Usage recommendations** (optional but recommended if your agent supports them):

- **Plan Mode / Act Mode** — Cline and Claude Code (VS Code Extension) both offer a Plan Mode. Use it for scaffold discussions and Category-2 halts (see `CLAUDE.md` §Reasoning-First); switch to Act Mode after your `Proposal: … OK?` is confirmed. Agents without a separate Plan Mode: post the proposal inline and stop before file-modifying tool calls.
- **Parallel tool calls** — If your agent supports parallel independent tool invocations (Claude Code does), batch the Scaffold-Mode preparation loads (guidelines + patterns + examples) in a single response.

Because no `.scaffold-done` file exists, the agent enters **Scaffold Mode**.

> 💡 **Model choice matters here.** See the top-of-README banner — use **Opus 4.x** (or your agent's strongest reasoning tier) for this scaffold session. Iteration sessions (Phase B) can drop to a mid-tier model.

#### Generation options

- **A — Natural language (recommended):** *"…generate the plugin from the template."*
- **B — MCP prompt, no params:** *"…call the `create_extension` MCP prompt."* — skip all parameter prompts; the agent reads `POD2_PLUGIN_TEMPLATE.md` automatically.
- **C — MCP prompt, explicit params:** *"…call the `create_extension` MCP prompt."* — provide namespace, pluginName, etc. inline (ad-hoc generation without a template).

### A6. The agent asks minimal questions

In Scaffold mode, the agent keeps upfront discussion brief: 1–3 clarifying questions max (widget type, API pattern, scope). **No deep UI discussions** — without seeing the rendered POD, those are speculative anyway.

### A7. The agent generates everything

After your "go", the agent:
1. Loads guidelines and patterns from the MCP server
2. Fetches the closest reference example (`Customer.HelloWorld` or `Customer.Coating`)
3. Generates all files:
   - `extension.json`
   - `context/<Name>Context.js`
   - `widget/<Name>Widget.js`
   - `action/<Name>ValidationAction.js`
   - `action/<Name>ExecutionAction.js`
   - `i18n/` (4 locale files)
   - `README.md`
4. Verifies against the post-generation checklist
5. **Creates `.scaffold-done`** marker → next session = Iteration mode

### A8. Pack & upload (manual, outside the agent)

You handle this:
1. Remove `CLAUDE.md`, `POD2_PLUGIN_TEMPLATE.md`, `.scaffold-done` from the ZIP scope (or leave them — SAP DM ignores unknown root files, but cleaner is better)
2. Create ZIP with `extension.json` at the root
3. Upload via *"Manage POD 2.0 Extensions"* in SAP DM
4. In the POD Designer, place the widget on a page and assign a resource
5. Open the POD as an operator and observe the result

---

# 🔁 Phase B: Iteration (after each deploy)

> Goal: refine the plugin based on what you actually see in POD 2.0. **This is where UI discussion finally makes sense** — you have the real UI in front of you.

### B1. Observe in POD

Open the POD as an operator. Notice something to change:
- *"The validation message is barely visible — needs to be a MessageStrip at the top."*
- *"The table column 'Quantity' is too narrow."*
- *"The thickness field should disable when 'Direct Override' is set."*

Take a screenshot if it helps.

### B2. Start a new agent session

Because `.scaffold-done` exists, the agent enters **Iteration Mode**.

**Remember:** the rules must be loaded (Claude Code: automatic; other agents: prefix with `Read CLAUDE.md,`). Describe what you observed — ideally with a screenshot:

> "The validation error message currently shows as a small red text below the input. It's hard to see. Replace it with a `sap.m.MessageStrip` at the top of the widget. Here is a screenshot: [paste]"
> *(non-Claude-Code agents: prepend "Read CLAUDE.md. ")*

The agent will:
- Discuss 1–3 implementation options briefly (with file references)
- Wait for your confirmation on which option

### B3. The agent patches only affected files

After confirmation, the agent patches **only the affected files** — no regeneration of untouched code. Existing i18n keys, custom logic, and comments are preserved.

After the patch, the agent reports which files changed, e.g.:
> *"Modified: widget/MyWidget.js, i18n/i18n.properties, i18n/i18n_de.properties"*

### B4. Re-pack & re-upload

You handle this — same process as A8.

### B5. → back to B1

Repeat as many times as needed. The marker file stays — every future session is Iteration Mode.

---

## 📁 File Reference

| File | Lifetime | Purpose |
|------|----------|---------|
| `CLAUDE.md` | Always present | POD2 rules. Claude Code auto-loads it; other agents load manually ("read CLAUDE.md"). Remove before ZIP (dev-time helper) |
| `.gitignore` | Always present | Standard ignores |
| `POD2_PLUGIN_TEMPLATE.md` | Phase A | Plugin requirements; can be removed after scaffold |
| `.scaffold-done` | Created in A7 | Marker that switches the agent to Iteration Mode |
| `extension.json` | Generated A7 | Plugin manifest (must be at ZIP root) |
| `context/`, `widget/`, `action/`, `i18n/` | Generated A7 | The actual plugin code |
| `README.md` | Generated A7 | Project documentation |

---

## 🛠 Generated Output Structure

```
Customer.MyNewPlugin/
├── CLAUDE.md                            ← POD2 rules (remove before ZIP, optional)
├── .scaffold-done                       ← (remove before ZIP, optional)
├── POD2_PLUGIN_TEMPLATE.md              ← (remove before ZIP)
├── extension.json                       ← Plugin registration (ZIP-root!)
├── README.md                            ← Documentation
├── context/
│   └── MyNewPluginContext.js
├── widget/
│   └── MyNewPluginWidget.js
├── action/
│   ├── MyNewPluginValidationAction.js
│   └── MyNewPluginExecutionAction.js
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
```

---

## 💡 Tips & Troubleshooting

### MCP Server Not Responding
```bash
curl http://localhost:3001/health
```
If the health check fails, check your network / proxy. If running locally, make sure `npm start` is running in the repo root.

### Agent forgot the rules?
The rules (`CLAUDE.md`) weren't loaded. **Claude Code:** confirm `CLAUDE.md` is in the folder root (it auto-loads from there). **Other agents:** start every conversation with **"Read CLAUDE.md"** and keep `CLAUDE.md` at the folder root. See the top `[!IMPORTANT]` banner.

### Agent Tries to Regenerate Everything in Iteration
Remind it: *"We are in iteration mode (`.scaffold-done` exists). Please patch only the affected files."*

If it persists, check that `.scaffold-done` actually exists in the folder root.

### Force Iteration Mode Even on First Run
If you have an existing plugin (not generated by this workflow) and want to use Iteration Mode from the start, manually create the marker:
```bash
touch .scaffold-done
```

### Force Re-Scaffold
To regenerate the plugin from scratch, remove the marker:
```bash
rm .scaffold-done
```
The next session will treat it as a fresh scaffold.

### Namespace Confusion
The namespace is defined in `extension.json` (`modulePath`/`type` fields), NOT derived from the folder name. The agent knows this rule, but double-check the generated `extension.json`.

### Plugin Capabilities (composable)

A POD 2.0 plugin combines:

| Capability    | Required? | Description |
|---------------|-----------|-------------|
| **Widget**    | optional  | UI element rendered in the POD page (max. 1 per plugin) |
| **Action(s)** | optional  | Zero or more actions. Common patterns: pre-flight `Validate`, business `Execute`, plus any number of additional actions like `Cancel`, `Reset`, `Refresh`, … |

There is **no fixed plugin "type"** – combine what your use case needs. A plugin can be widget-only, action-only, widget + 1 action, widget + 3 actions, etc.

---

## 🎯 Advanced: Using MCP Tools Directly

The `sap-dm-pod2-mcp-server` provides three prompts for granular generation:

| Prompt | Use Case |
|--------|----------|
| `create_extension` | Full plugin (Widget + Actions + Context + i18n) |
| `create_widget` | Only a widget component |
| `create_action` | Only an action component |

Ask your agent to call these MCP prompts by name, e.g.:
> "Call the `create_extension` MCP prompt on the sap-dm-pod2-mcp-server."

---

## 🔌 Agent-Specific Notes

`CLAUDE.md` is agent-agnostic and covers all POD2 / SAP DM / UI5 rules for every MCP-capable agent. Per-agent setup differences (MCP config format, tool-invocation naming) are captured below.

### Cline

[Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) is a VS Code extension with native support for MCP and a built-in Plan/Act mode split.

**MCP Configuration** — add to your Cline MCP settings:
```json
{
  "mcpServers": {
    "sap-dm-pod2-mcp-server": {
      "type": "streamableHttp",
      "url": "http://localhost:3001/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

> **Hosted URL:** replace `http://localhost:3001/mcp` with the deployed BTP endpoint once available.

**MCP prompt invocation** — via slash commands:
```
/mcp:sap-dm-pod2-mcp-server:create_extension
/mcp:sap-dm-pod2-mcp-server:create_widget
/mcp:sap-dm-pod2-mcp-server:create_action
/mcp:sap-dm-pod2-mcp-server:migrate_widget
/mcp:sap-dm-pod2-mcp-server:validate_project
```

**Plan Mode vs. Act Mode** — the `CLAUDE.md` reasoning phase maps to Plan Mode; file generation / MCP tool calls happen in Act Mode. MCP tools are only available in Act Mode.

**Cline-specific tool limits** (Cline's tool bridge, not POD 2): `read_file` is capped at 200 lines/call; `execute_command` avoids backslash continuations and multi-statement scripts (≤200 chars, one command per call); `write_to_file` only for new files or full rewrites, use `replace_in_file` for targeted edits.

### Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code) is Anthropic's official CLI (also available as desktop app, web app, and IDE extensions).

**Auto-loaded rules.** Claude Code auto-loads `CLAUDE.md` from the project root every session, so the POD2 rules are always in context — no "read CLAUDE.md" prefix needed. (Other agents must load it manually; see the top banner.)

**MCP Configuration** — add the server via `claude mcp add` or edit `~/.claude.json` (user-scoped — available in every project, no per-project `.mcp.json` needed):

```json
  "mcpServers": {
    "sap-dm-pod2-mcp-server": {
      "type": "http",
      "url": "http://localhost:3001/mcp"
    }
  }
```

> **Hosted URL:** replace `http://localhost:3001/mcp` with the deployed BTP endpoint once available. Run the server locally with `npm start` in the repo root.

Verify with `claude mcp list` — `sap-dm-pod2-mcp-server` should report `connected`.

**MCP tool invocation** — tools are exposed as `mcp__sap-dm-pod2-mcp-server__<tool>`. MCP prompts are exposed as slash commands: `/mcp__sap-dm-pod2-mcp-server__create_extension` (or ask in natural language: *"invoke the `create_extension` MCP prompt"*).

**No Plan/Act split** — Claude Code has a single conversation mode. The Reasoning-First message from `CLAUDE.md` is posted as a normal assistant response before file-modifying tool calls.

**Parallel tool calls** — Claude Code encourages parallel independent tool calls. The Scaffold Mode preparation phase (loading guidelines + patterns + examples) is a good fit.

**File & shell tools**: `Read` (whole file by default; `offset`/`limit` for large files), `Grep` (regex-capable ripgrep), `Glob` (path patterns), `Write` (new files or full rewrite), `Edit` (targeted exact-string replace; use `replace_all` for multi-occurrence), `Bash` (no artificial length limit; prefer `Read`/`Grep`/`Glob` over shell equivalents).

---

## 📜 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-03 | Initial release |

---

_Part of the sap-dm-pod2-mcp-server project · v1.0.0_
