# POD 2.0 Extension Development – Usage Guide

> How to use the `sap-dm-pod2-mcp-server` to develop and iterate on POD 2.0 extensions with AI assistance.

> [!IMPORTANT]
> **Copy `CLAUDE.md` into your plugin directory and load it at the start of every session** (Scaffold *and* every Iteration). It holds all POD2 rules — without it the agent misses the reasoning-first / source-or-silence meta-rules and produces plausible-looking but non-compliant code.
> - **Claude Code** — auto-loads `CLAUDE.md` from the project root. Nothing to type.
> - **Cline / Cursor / other agents** — do **not** auto-load it. Begin your first prompt with **“Read `CLAUDE.md`, then …”**.
>
> **Use a strong reasoning-tier model for the Phase A scaffold** (as of mid-2026, **Anthropic Opus 4.x**). Phase A sets architecture, base classes, imports, i18n, and PPD wiring — a weak model there compounds through every iteration. Phase B (iteration) can run on a mid-tier model (Sonnet-class).

---

## Overview

This workflow enables rapid development of SAP Digital Manufacturing POD 2.0 extensions using an AI coding agent backed by the `sap-dm-pod2-mcp-server`.

The server exposes **23 tools · 6 resources · 5 prompts** covering POD2 pattern docs, POD2 API references, SAPUI5 API (bundled offline, pinned to SAP DM's UI5 target), SAP DM REST specs, MDO entities, reference plugins, and full-text search. The UI5 lookup is native — a separate `sapui5-mcp-server` is not needed.

For the full capability catalog, see the [root README](../README.md) and `CLAUDE.md`.

---

## 🧭 Mental Model: Two Phases, Two Modes

POD 2.0 plugins cannot be UI-tested without deploying them — the framework, layout container, and runtime context only exist after upload. So the workflow has two distinct phases:

```
┌──────────────────────────────────────────────┐
│  PHASE A — SCAFFOLD (one time)               │
│  Agent produces a complete first draft       │
└──────────────────────────────────────────────┘
                  ↓ (you pack & upload)
┌──────────────────────────────────────────────┐
│  Deploy to SAP DM, view in POD 2.0           │  ← outside the agent
└──────────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────────┐
│  PHASE B — ITERATE (n times)                 │
│  Refine based on what you see in POD         │
└──────────────────────────────────────────────┘
                  ↺ back to ITERATE
```

The agent auto-detects the phase via a `.scaffold-done` marker file.

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **AI coding agent** | Any agent with MCP support (see [Loading the rules per agent](#-loading-the-rules-per-agent)) |
| **sap-dm-pod2-mcp-server** | Run locally (`npm start`) or point to a deployed endpoint |

Start the server locally (Node.js ≥ 22):
```bash
cd sap-dm-pod2-mcp-server
npm install && npm run build
npm start
```

Verify reachability:
```bash
curl http://localhost:3001/health
```

> **Hosted URL:** once deployed, replace `http://localhost:3001/mcp` with the app's `/mcp` endpoint.

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

```bash
cp ../usage/CLAUDE.md .
cp ../usage/.gitignore .
cp ../usage/POD2_PLUGIN_TEMPLATE.md .
```

`CLAUDE.md` holds all POD2 / SAP DM / UI5 rules and is agent-agnostic. Claude Code auto-loads it; other agents load it with *"read CLAUDE.md"*.

### A3. Fill in the template

Edit `POD2_PLUGIN_TEMPLATE.md` with your plugin requirements:

1. **Plugin metadata** – Name, Namespace, Description, Category
2. **Widget** _(optional)_ – free-form bullets describing layout, controls, interaction, behavior; plus an optional inline JSON sample of the data shape it consumes
3. **Actions** _(zero or more)_ – one `### Action: <Name>` block per action (e.g. Validate, Execute, Cancel, Reset), with free-form bullets and an optional inline JSON sample

> 💡 See `POD2_PLUGIN_EXAMPLE.md` for a fully filled-in example (Coating plugin with `Validate` + `Execute` actions).

### A4. Generate the plugin

Open the folder in your editor, open your AI agent, and make sure the rules are loaded (Claude Code: automatic; other agents: prefix your prompt with `Read CLAUDE.md,`). Because no `.scaffold-done` file exists, the agent enters **Scaffold Mode**.

Generation options:

- **A — Natural language (recommended):** *"…generate the plugin from the template."*
- **B — MCP prompt, no params:** *"…call the `create_extension` MCP prompt."* — the agent reads `POD2_PLUGIN_TEMPLATE.md` automatically.
- **C — MCP prompt, explicit params:** provide namespace, pluginName, etc. inline (ad-hoc generation without a template).

In Scaffold mode the agent keeps upfront discussion brief (1–3 clarifying questions) — no deep UI discussion, since without the rendered POD that is speculative.

### A5. The agent generates everything

After your "go", the agent:
1. Loads guidelines and patterns from the MCP server
2. Fetches the closest reference example (`Customer.HelloWorld` or `Customer.Coating`)
3. Generates all files (`extension.json`, `context/`, `widget/`, `action/`, `i18n/`, `README.md`)
4. Verifies against the post-generation checklist
5. **Creates `.scaffold-done`** → next session = Iteration Mode

### A6. Pack & upload (manual, outside the agent)

1. Exclude `CLAUDE.md`, `POD2_PLUGIN_TEMPLATE.md`, `.scaffold-done` from the ZIP (cleaner, though SAP DM ignores unknown root files)
2. Create a ZIP with `extension.json` at the root
3. Upload via *"Manage POD 2.0 Extensions"* in SAP DM
4. In the POD Designer, place the widget on a page and assign a resource
5. Open the POD as an operator and observe the result

---

# 🔁 Phase B: Iteration (after each deploy)

> Goal: refine the plugin based on what you actually see in POD 2.0. **This is where UI discussion finally makes sense** — you have the real UI in front of you.

### B1. Observe in POD

Open the POD as an operator and note what to change, e.g.:
- *"The validation message is barely visible — needs a MessageStrip at the top."*
- *"The 'Quantity' column is too narrow."*

Take a screenshot if it helps.

### B2. Start a new agent session

Because `.scaffold-done` exists, the agent enters **Iteration Mode**. Make sure the rules are loaded (Claude Code: automatic; other agents: prefix with `Read CLAUDE.md,`). Describe what you observed — ideally with a screenshot:

> "The validation error shows as small red text below the input. It's hard to see. Replace it with a `sap.m.MessageStrip` at the top of the widget. Here is a screenshot: [paste]"

The agent discusses 1–3 implementation options briefly (with file references) and waits for your confirmation.

### B3. The agent patches only affected files

After confirmation, the agent patches **only the affected files** — no regeneration of untouched code. Existing i18n keys, custom logic, and comments are preserved. It then reports which files changed.

### B4. Re-pack & re-upload

Same process as A6, then → back to B1. The marker file stays — every future session is Iteration Mode.

---

## 📁 File Reference

| File | Lifetime | Purpose |
|------|----------|---------|
| `CLAUDE.md` | Always present | POD2 rules. Auto-loaded by Claude Code; others load manually. Remove before ZIP |
| `.gitignore` | Always present | Standard ignores |
| `POD2_PLUGIN_TEMPLATE.md` | Phase A | Plugin requirements; can be removed after scaffold |
| `.scaffold-done` | Created in A5 | Marker that switches the agent to Iteration Mode |
| `extension.json` | Generated A5 | Plugin manifest (must be at ZIP root) |
| `context/`, `widget/`, `action/`, `i18n/` | Generated A5 | The actual plugin code |
| `README.md` | Generated A5 | Project documentation |

---

## 💡 Tips & Troubleshooting

**MCP server not responding** — run `curl http://localhost:3001/health`. If it fails, check your network/proxy and confirm `npm start` is running in the repo root.

**Agent forgot the rules** — `CLAUDE.md` wasn't loaded. Claude Code: confirm it's in the folder root. Other agents: start every conversation with **"Read CLAUDE.md"**.

**Agent tries to regenerate everything in iteration** — remind it: *"We are in iteration mode (`.scaffold-done` exists). Patch only the affected files."* Check that `.scaffold-done` exists.

**Force iteration mode on an existing plugin** — `touch .scaffold-done`.

**Force re-scaffold** — `rm .scaffold-done`; the next session treats it as a fresh scaffold.

**Namespace confusion** — the namespace comes from `extension.json` (`modulePath`/`type`), NOT the folder name. Double-check the generated `extension.json`.

### Plugin capabilities (composable)

A POD 2.0 plugin combines a **Widget** (optional, max. 1) and zero or more **Actions** (e.g. `Validate`, `Execute`, `Cancel`, `Reset`). There is **no fixed plugin "type"** — combine what your use case needs.

---

## 🔌 Loading the rules per agent

`CLAUDE.md` is agent-agnostic and covers all POD2 / SAP DM / UI5 rules. The only per-agent difference is how it gets loaded:

- **Claude Code** — auto-loads `CLAUDE.md` from the project root at session start. Nothing to type.
- **All other agents** (Cline, Cursor, …) — do **not** auto-load it. Instruct the agent to read it at the start of every session, e.g. prefix your prompt with **“Read `CLAUDE.md`, then …”**.

Refer to your agent's own documentation for MCP server configuration.

---

_Part of the sap-dm-pod2-mcp-server project._
