import { FastMCP } from "fastmcp";

export function registerPrompts(server: FastMCP): void {

  server.addPrompt({
    name: "create_widget",
    description: "Generates a complete POD2 Widget following the Best Practice pattern. Produces Widget class, i18n files, and extension.json entry.",
    arguments: [
      { name: "namespace", description: "Company/project namespace (e.g. 'myCompany.myProject')", required: true },
      { name: "widgetName", description: "Widget name in PascalCase (e.g. 'OrderDetails', 'ProductionMonitor')", required: true },
      { name: "widgetType", description: "Widget subtype: ControlWidget | LayoutWidget | TableWidget | ContentHandler (default: LayoutWidget)", required: false, enum: ["ControlWidget", "LayoutWidget", "TableWidget", "ContentHandler"] },
      { name: "description", description: "Short description of the widget's purpose", required: false },
      { name: "hasProperties", description: "Whether the widget should have configurable properties: yes or no (default: yes)", required: false, enum: ["yes", "no"] },
    ],
    load: async ({ namespace, widgetName, widgetType, description, hasProperties }) => {
      const ns = namespace ?? "";
      const desc = description ?? `${widgetName} widget`;
      const nsPath = ns.replace(/\./g, "/");
      const withProps = hasProperties !== "no";
      const type = widgetType ?? "LayoutWidget";

      return `Generate a complete POD2 Widget following the Best Practice pattern.

## Requirements
- **Namespace:** ${namespace}
- **Widget Name:** ${widgetName}
- **Widget Type:** ${type}
- **Description:** ${desc}
- **Configurable Properties:** ${withProps ? "Yes" : "No"}
- **Module Path:** ${nsPath}/widget/${widgetName}

## Files to Generate

### 1. \`widget/${widgetName}.js\`
Follow the Best Practice pattern:
- Use \`sap.ui.define\` with ES6 class syntax
- Extend \`sap/dm/dme/pod2/widget/Widget\`
- Use \`I18nResourceModel\` for static i18n (static #oI18nModel)
- Implement static methods: \`getI18nModel()\`, \`getDisplayName()\`, \`getIcon()\`, \`getCategory()\`, \`getDescription()\`
  - **i18n key convention (MANDATORY, see common-mistakes #32):** the metadata trio uses the \`widget.\` prefix:
    - \`getDisplayName()\` → \`this.getI18nText("widget.displayName")\`
    - \`getDescription()\` → \`this.getI18nText("widget.description")\`
    - \`getCategory()\`    → \`this.getI18nText("widget.category")\`
  - The values come from \`POD2_PLUGIN_TEMPLATE.md\` (Plugin Name → \`widget.displayName\`, Description → \`widget.description\`, Category → \`widget.category\`)
  - **Never** keep unprefixed \`displayName=\` / \`description=\` keys — they are legacy and inconsistent with \`widget.category\`
- Implement \`onInit()\`, \`_createView()\`, \`onExit()\`
- In onInit(): Register i18nCustomModel on the POD view: \`let i18nCustomModel = ${widgetName}.getI18nModel(); this.getPodRuntime().getView().setModel(i18nCustomModel, "i18n${widgetName}");\`
- For UI layout: Use \`sap/ui/layout/form/Form\`, \`FormContainer\`, \`FormElement\`, \`ResponsiveGridLayout\` for well-formed form UIs
${type === "TableWidget" ? "- Implement `_createColumns()` and `_createTableCells()`\n- Handle selection sync with PodContext" : ""}
${withProps ? "- Implement `getProperties()` returning WidgetProperty array with appropriate PropertyEditors" : ""}
- Use Logger instead of console.log
- Clean up PodContext subscriptions in onExit()

### 2. \`i18n/i18n.properties\` (+ i18n_de, i18n_en, i18n_en_US)
Include the **widget metadata trio with \`widget.\` prefix** (MANDATORY):
- \`widget.displayName=…\`     (from spec field "Plugin Name")
- \`widget.description=…\`     (from spec field "Description")
- \`widget.category=…\`        (from spec field "Category" — verbatim, do NOT hardcode "CUSTOMER")

Plus${withProps ? " property labels/descriptions, and" : ""} any UI strings — typically grouped as \`widget.title.*\`, \`widget.col.*\`, \`widget.label.*\`, \`msg.*\`.

Do **NOT** emit unprefixed legacy keys (\`displayName=\`, \`description=\`, \`category=\`).

### 3. \`extension.json\` entry
Widget type: \`${namespace}.widget.${widgetName}\`
Module path: \`${nsPath}/widget/${widgetName}\`

## File Layout (CRITICAL)
- Generate ALL files **directly in the current working directory** (= project root = ZIP root).
- Do **NOT** create a wrapper folder named after the plugin or namespace.
- The folders \`widget/\` and \`i18n/\` must be **direct subfolders of the working directory**, NOT nested inside a \`${widgetName}/\` or \`${nsPath}/\` folder.
- The \`modulePath\` in \`extension.json\` is a UI5 *logical* module name – it is independent of the physical file location.

## Reference
- Use \`get_pattern_doc\` with "widget-patterns" for the full widget type templates
- Use \`get_pattern_doc\` with "common-mistakes" to avoid known issues
- Use \`get_api_doc\` with "sap.dm.dme.pod2.widget.Widget" for the Widget base class API
${type === "TableWidget" ? '- Use `get_pattern_doc` with "tablewidget-complete" for the complete TableWidget guide' : ""}
${type === "ContentHandler" ? '- Use `get_pattern_doc` with "dialog-patterns" for dialog/form patterns' : ""}`;
    },
  });

  server.addPrompt({
    name: "create_action",
    description: "Generates a POD2 Action following the Best Practice pattern. Supports Validation and Execution action types.",
    arguments: [
      { name: "namespace", description: "Company/project namespace (e.g. 'myCompany.myProject')", required: true },
      { name: "actionName", description: "Action name in PascalCase (e.g. 'ValidateOrder', 'SplitSfc')", required: true },
      { name: "actionType", description: "Action type: ValidationAction or ExecutionAction (default: ExecutionAction)", required: false, enum: ["ValidationAction", "ExecutionAction"] },
      { name: "description", description: "Short description of the action's purpose", required: false },
    ],
    load: async ({ namespace, actionName, description, actionType }) => {
      const desc = description ?? `${actionName} action`;
      const nsPath = (namespace ?? "").replace(/\./g, "/");

      return `Generate a POD2 Action following the Best Practice pattern.

## Requirements
- **Namespace:** ${namespace}
- **Action Name:** ${actionName}
- **Type:** ${actionType}
- **Description:** ${desc}
- **Module Path:** ${nsPath}/action/${actionName}

## Files to Generate

### 1. \`action/${actionName}.js\`
Follow the Best Practice pattern:
- Use \`sap.ui.define\` with ES6 class syntax
- Extend \`sap/dm/dme/pod2/action/Action\`
- Use \`I18nResourceModel\` for static i18n
- Implement static methods: \`getI18nModel()\`, \`getDisplayName()\`, \`getDescription()\`
${actionType === "validation" ? `- In \`execute(oActionContext)\`: check preconditions, throw Error to stop action sequence
- Check PodContext.getSelectedWorkListItems() and other context values
- Use descriptive i18n error messages` : ""}
${actionType === "execution" ? `- In \`execute(oActionContext)\`: perform business logic (API calls, context updates)
- Can be async (return Promise)
- Use try/catch with Logger for error handling
- Update PodContext or Context singleton with results` : ""}
${actionType === "standalone" ? `- In \`execute(oActionContext)\`: perform independent logic
- Can be sync or async` : ""}
- Use Logger instead of console.log

### 2. \`i18n/i18n.properties\` (+ i18n_de, i18n_en, i18n_en_US)
Include keys for: displayName, description, error messages

### 3. \`extension.json\` entry
Action type: \`${namespace}.action.${actionName}\`
Module path: \`${nsPath}/action/${actionName}\`

## File Layout (CRITICAL)
- Generate ALL files **directly in the current working directory** (= project root = ZIP root).
- Do **NOT** create a wrapper folder named after the plugin or namespace.
- The folders \`action/\` and \`i18n/\` must be **direct subfolders of the working directory**, NOT nested inside a \`${actionName}/\` or \`${nsPath}/\` folder.
- The \`modulePath\` in \`extension.json\` is a UI5 *logical* module name – it is independent of the physical file location.

## Reference
- Use \`get_pattern_doc\` with "basics" for the full Best Practice pattern
- Use \`get_api_doc\` with "sap.dm.dme.pod2.action.Action" for the Action base class API
- Use \`get_pattern_doc\` with "error-handling" for error handling patterns`;
    },
  });

  server.addPrompt({
    name: "create_extension",
    description: "Generates a complete POD2 Extension with Widget, Validation Action, Execution Action, Context singleton, and i18n – the full Best Practice pattern. If no parameters are provided, reads POD2_PLUGIN_TEMPLATE.md from the working directory.",
    arguments: [
      { name: "namespace", description: "Company/project namespace (e.g. 'myCompany.myProject'). If omitted, read from POD2_PLUGIN_TEMPLATE.md.", required: false },
      { name: "pluginName", description: "Plugin name in PascalCase (e.g. 'Split', 'OrderConfig'). If omitted, read from POD2_PLUGIN_TEMPLATE.md.", required: false },
      { name: "description", description: "Short description of the extension's purpose", required: false },
    ],
    load: async ({ namespace, pluginName, description, widgetType }) => {
      // If namespace or pluginName not provided, instruct agent to read from template
      if (!namespace || !pluginName) {
        return `Generate a complete POD2 Extension following the Best Practice pattern.

## IMPORTANT: Read Template First

No namespace/pluginName was provided as parameters. **Read the \`POD2_PLUGIN_TEMPLATE.md\` file in the current working directory** to extract:
- Plugin Name, Namespace, Type, Description, Category
- Functional requirements (What should it do?)
- Validation Rules
- Execution Logic
- API Data (request/response examples)

Then proceed with the full generation workflow below.

---

## Workflow

1. **Read \`POD2_PLUGIN_TEMPLATE.md\`** – extract all requirements
2. Call \`get_pod2_guidelines\` to load the rules
3. Call \`get_pattern_doc({ name: "extension-json-schema" })\` for extension.json schema
4. Call \`get_pattern_doc({ name: "widget-patterns" })\` for widget templates
5. Call \`get_pattern_doc({ name: "subscribe-patterns" })\` for PodContext lifecycle
6. Call \`get_pattern_doc({ name: "property-editors" })\` for property editor types
7. Call \`get_example({ name: "Customer.Coating" })\` for the reference implementation
8. Generate all files following the Best Practice pattern
9. Verify against the Post-Generation Checklist

## Files to Generate (Full Extension)

### 1. \`extension.json\`
Register all widgets and actions with correct modulePaths and types.

### 2. \`context/<Name>Context.js\` – Singleton Context Class
- Static class (no instantiation needed)
- Define \`#uiElements\` (frozen object with UI element IDs)
- Define \`#msg\` (frozen object with i18n message keys)
- Typed PodContext get/set methods for all shared data
- Pattern: Use \`get_pattern_doc\` with "advanced-patterns" for context singleton patterns

### 3. \`widget/<Name>Widget.js\` – Widget
- Extend \`sap/dm/dme/pod2/widget/Widget\`
- Import and use Context singleton for data access
- Implement _createView() with UI5 controls (use Form/FormContainer/FormElement/ResponsiveGridLayout for form UIs)
- In onInit(): Register i18nCustomModel on the POD view
- Subscribe to PodContext changes, unsubscribe in onExit()
- Use static I18nResourceModel pattern

### 4. \`action/<Name>ValidationAction.js\` – Validation Action
- Check preconditions (selected items, required context values)
- Throw Error with i18n message on failure
- Store validated data in Context singleton for the ExecutionAction

### 5. \`action/<Name>ExecutionAction.js\` – Execution Action
- Read validated data from Context singleton
- Execute business logic (API calls via framework API clients)
- Update context with results
- Handle errors with try/catch and Logger

### 6. \`i18n/\` – Four i18n files
- i18n.properties (fallback/English)
- i18n_de.properties (German)
- i18n_en.properties (English)
- i18n_en_US.properties (English US)
- **Widget metadata trio (MANDATORY \`widget.\` prefix — see common-mistakes #32):**
  - \`widget.displayName=…\`   (from spec field "Plugin Name")
  - \`widget.description=…\`   (from spec field "Description")
  - \`widget.category=…\`      (from spec field "Category" — verbatim, NOT hardcoded "CUSTOMER")
- **Action metadata** uses the action's own prefix:
  - \`validationAction.displayName=…\`, \`validationAction.description=…\`, …
  - \`executionAction.displayName=…\`, \`executionAction.description=…\`, …
- **UI strings** group by domain: \`widget.title.*\`, \`widget.col.*\`, \`widget.label.*\`, \`msg.*\`
- **Translations**: translate \`widget.displayName\` / \`widget.description\` per locale; **do NOT translate \`widget.category\`** unless the customer explicitly asked for it
- **Forbidden**: legacy unprefixed keys (\`displayName=\`, \`description=\`, \`category=\`)

### 7. \`README.md\` – Project Documentation (REQUIRED)
Generate a comprehensive README in the style of the examples (see Customer.Coating/README.md via \`get_example\`).

## File Layout (CRITICAL)
- Generate ALL files **directly in the current working directory** (= project root = ZIP root).
- Do **NOT** create a wrapper folder named after the plugin (e.g. NO \`<PluginName>/\` subfolder).
- The folders \`widget/\`, \`action/\`, \`context/\`, \`i18n/\` and the file \`extension.json\` must live **directly in the working directory**.
- The \`modulePath\` in \`extension.json\` is a UI5 *logical* module name – it is independent of the physical file location. So \`modulePath: "customer.myplugin.widget.MyWidget"\` is fine even when the physical file is at \`./widget/MyWidget.js\`.

## Important Rules
- **Flat layout**: Files at working-directory root, no \`<PluginName>/\` wrapper folder.
- **Namespace**: Use the namespace defined in extension.json (\`modulePath\`/\`type\`), independent of the folder structure. The POD framework handles it.
- **README style**: Write the README.md in the style of the examples.
- **i18nCustomModel**: Always register in widget.onInit() via \`getPodRuntime().getView().setModel()\`.
- **Form Layout**: Use Form/FormContainer/FormElement/ResponsiveGridLayout for well-formed UIs.

## Reference
- Use \`get_pattern_doc\` with "basics" for architecture rules and Best Practice pattern
- Use \`get_pattern_doc\` with "widget-patterns" for widget type templates
- Use \`get_pattern_doc\` with "common-mistakes" to avoid known issues
- Use \`get_api_doc\` for Widget, Action, PodContext, and API client documentation
- Use \`get_pattern_doc\` with "advanced-patterns" for enterprise patterns
- Use \`get_example\` with "Customer.Coating" for the reference README style`;
      }

      const desc = description ?? `${pluginName} extension`;
      const nsPath = namespace.replace(/\./g, "/");
      const type = widgetType ?? "LayoutWidget";

      return `Generate a complete POD2 Extension following the Best Practice pattern.

## Requirements
- **Namespace:** ${namespace}
- **Plugin Name:** ${pluginName}
- **Description:** ${desc}
- **Widget Type:** ${type}

## Files to Generate (Full Extension)

### 1. \`extension.json\`
Register all widgets and actions with correct modulePaths and types.

### 2. \`context/${pluginName}Context.js\` – Singleton Context Class
- Static class (no instantiation needed)
- Define \`#uiElements\` (frozen object with UI element IDs)
- Define \`#msg\` (frozen object with i18n message keys)
- Typed PodContext get/set methods for all shared data
- Pattern: Use \`get_pattern_doc\` with "advanced-patterns" for context singleton patterns

### 3. \`widget/${pluginName}Widget.js\` – Widget (${type})
- Extend \`sap/dm/dme/pod2/widget/Widget\`
- Import and use ${pluginName}Context for data access
- Implement _createView() with UI5 controls (use Form/FormContainer/FormElement/ResponsiveGridLayout for form UIs)
- In onInit(): Register i18nCustomModel on the POD view: \`let i18nCustomModel = ${pluginName}Widget.getI18nModel(); this.getPodRuntime().getView().setModel(i18nCustomModel, "i18n${pluginName}");\` — model name = \`"i18n"\` + PascalCase widget short name. If this extension defines **multiple widgets**, each widget registers its OWN model (e.g. \`i18n${pluginName}\` AND \`i18nOther\`).
- Subscribe to PodContext changes, unsubscribe in onExit()
- Use static I18nResourceModel pattern

### 4. \`action/${pluginName}ValidationAction.js\` – Validation Action
- Check preconditions (selected items, required context values)
- Throw Error with i18n message on failure
- Store validated data in ${pluginName}Context for the ExecutionAction

### 5. \`action/${pluginName}ExecutionAction.js\` – Execution Action
- Read validated data from ${pluginName}Context
- Execute business logic (API calls via framework API clients)
- Update context with results
- Handle errors with try/catch and Logger

### 6. \`i18n/\` – Four i18n files
- i18n.properties (fallback/English)
- i18n_de.properties (German)
- i18n_en.properties (English)
- i18n_en_US.properties (English US)
- **Widget metadata trio (MANDATORY \`widget.\` prefix — see common-mistakes #32):**
  - \`widget.displayName=${pluginName}\`
  - \`widget.description=${desc}\`
  - \`widget.category=…\`   ← from spec field "Category" (verbatim, NOT hardcoded "CUSTOMER")
- **Action metadata** uses each action's own prefix:
  - \`validationAction.displayName=…\`, \`validationAction.description=…\`, …
  - \`executionAction.displayName=…\`, \`executionAction.description=…\`, …
- **UI strings** group by domain: \`widget.title.*\`, \`widget.col.*\`, \`widget.label.*\`, \`msg.*\`
- **Translations**: translate \`widget.displayName\` / \`widget.description\` per locale; **do NOT translate \`widget.category\`** unless the customer explicitly asked for it
- **Forbidden**: legacy unprefixed keys (\`displayName=\`, \`description=\`, \`category=\`)

### 7. \`README.md\` – Project Documentation (REQUIRED)
Generate a comprehensive README with these sections:
1. **Title & Description** – Plugin name and purpose
2. **Components Table** – Component | File | Description
3. **Key Capabilities** – Bullet list of features
4. **Project Structure** – ASCII tree view
5. **Widget UI** – What the widget displays
6. **Configuration in Manage PODs 2.0** – Step-by-step setup
7. **Web Service** – JSON request/response examples (if applicable)
8. **Validation Rules** – Table: Rule | Where | Error message
9. **Disclaimer** – Standard text

## Directory Structure (flat – directly in the working directory)
\`\`\`
<working directory> / <project root>          ← all files go DIRECTLY here, NO \`${pluginName}/\` wrapper folder
├── extension.json
├── README.md
├── context/${pluginName}Context.js
├── widget/${pluginName}Widget.js
├── action/${pluginName}ValidationAction.js
├── action/${pluginName}ExecutionAction.js
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
\`\`\`

## File Layout (CRITICAL)
- Generate ALL files **directly in the current working directory** (= project root = ZIP root).
- Do **NOT** create a wrapper folder named after the plugin (e.g. NO \`${pluginName}/\` subfolder, NO \`${nsPath}/\` subfolder).
- The folders \`widget/\`, \`action/\`, \`context/\`, \`i18n/\` and the file \`extension.json\` must live **directly in the working directory**.
- The \`modulePath\` in \`extension.json\` is a UI5 *logical* module name – it is independent of the physical file location. So \`modulePath: "${namespace}.widget.${pluginName}Widget"\` is fine even when the physical file is at \`./widget/${pluginName}Widget.js\`.

## Important Rules
- **Flat layout**: Files at working-directory root, no \`${pluginName}/\` wrapper folder.
- **Namespace**: Use the namespace defined in extension.json (\`modulePath\`/\`type\`), independent of the folder structure. The POD framework handles it.
- **README style**: Write the README.md in the style of the examples (see Customer.Coating/README.md via \`get_example\`).
- **i18nCustomModel**: Always register in widget.onInit() via \`getPodRuntime().getView().setModel()\`.
- **Form Layout**: Use Form/FormContainer/FormElement/ResponsiveGridLayout for well-formed UIs.

## Reference
- Use \`get_pattern_doc\` with "basics" for architecture rules and Best Practice pattern
- Use \`get_pattern_doc\` with "widget-patterns" for widget type templates
- Use \`get_pattern_doc\` with "common-mistakes" to avoid known issues
- Use \`get_api_doc\` for Widget, Action, PodContext, and API client documentation
- Use \`get_pattern_doc\` with "advanced-patterns" for enterprise patterns
- Use \`get_example\` with "Customer.Coating" for the reference README style`;
    },
  });

  server.addPrompt({
    name: "migrate_widget",
    description: "Migrates an EXISTING POD 2.0 widget OR an HTML5 monitoring/dashboard app (Chart.js/d3/plotly/echarts + fetch + inline handlers) into a clean POD 2.0 plugin following Best-Practice. Enforces a phased workflow with mandatory Feature-Inventory, Mapping, Verification and (for HTML5) Residue-Gate artifacts to prevent silent feature loss.",
    arguments: [
      { name: "sourceDir", description: "Relative path to the source directory (POD2 plugin folder OR HTML5 app folder). If omitted, the agent must ask the user.", required: false },
      { name: "sourceFormat", description: "Source format: pod2 | html5 | auto (default: auto)", required: false, enum: ["pod2", "html5", "auto"] },
      { name: "targetNamespace", description: "Target namespace for the migrated plugin (e.g. 'customer.custom.extensions.mywidget'). If omitted, read from POD2_PLUGIN_EXAMPLE.md or prompt the user.", required: false },
    ],
    load: async ({ sourceDir, sourceFormat, targetNamespace }) => {
      const fmt = sourceFormat ?? "auto";
      const src = sourceDir ?? "<sourceDir not provided — ASK USER>";
      const ns = targetNamespace ?? "<targetNamespace not provided — read from POD2_PLUGIN_EXAMPLE.md or ASK USER>";

      return `Migrate the existing POD 2.0 widget at \`${src}\` into a clean POD 2.0 plugin following Best-Practice.

## Mission

This is a **migration**, NOT a green-field build. The biggest failure mode is:

> *The agent picks up the happy path of the source widget and silently drops dozens of small UX features — input \`valueState\`, locale-aware number formatting, table summary rows, status colors, tooltips, range validation, etc. The result "runs" but is missing half the original behaviour.*

**To prevent this, the workflow below is strictly enforced.** Each phase produces a mandatory artifact that the agent reads back in the next phase. Skipping artifacts is forbidden.

- **Source format**: ${fmt}
- **Source dir**: ${src}
- **Target namespace**: ${ns}

---

## Phase −1 — Reasoning Kickoff (BEFORE any tool calls)

Post a brief reasoning message in chat:

1. *"Migrating POD 2.0 widget from \`${src}\` to namespace \`${ns}\`"*
2. The list of MCP tools you will call (Phase 1)
3. The expected artifacts: \`MIGRATION_INVENTORY.md\`, \`MIGRATION_MAPPING.md\`, \`MIGRATION_VERIFICATION.md\`
4. The estimated number of source files

This applies the Reasoning-First meta-rule from \`get_pod2_guidelines\` Section 0.

---

## Phase 0 — Discovery (read-only)

**If \`sourceFormat === "pod2"\` (or \`auto\` detects POD 2.0):**

1. Verify \`sourceDir\` exists and contains POD 2.0 sources (\`extension.json\` + \`*.js\` extending \`sap/dm/dme/pod2/widget/Widget\`). If not → abort with a clear error message.
2. List every file in \`sourceDir\` (skip \`node_modules/\`, \`.git/\`, build artifacts, \`.DS_Store\`).
3. Identify the source plugin structure: widgets, actions, context, i18n bundles, README, extension.json.
4. Read \`POD2_PLUGIN_EXAMPLE.md\` in the **target** working directory if present — it may already specify the desired namespace, plugin name, category, etc.

**If \`sourceFormat === "html5"\` (or \`auto\` detects HTML5):**

1. Verify \`sourceDir\` contains at least one \`.html\` file with inline \`<script>\` blocks. If not → abort.
2. \`extension.json\` is NOT required for HTML5 sources.
3. Post a **"HTML5 Discovery Summary"** block in chat BEFORE Phase 1, with counts of the following patterns (use \`grep -cE\` per file, sum totals):
   - \`fetch(\` / \`XMLHttpRequest\` / \`\\$\\.ajax\` / \`axios\\.\` (Cat 22)
   - \`new Chart(\` / \`Chart\\.register\` / \`d3\\.\` / \`Plotly\\.\` / \`echarts\\.init\` / \`ApexCharts\` (Cat 21)
   - \`setInterval(\` / \`setTimeout(\` (Cat 20 / B9)
   - Module-level \`let\` / \`var\` / \`const\` — regex \`^(let|var|const)\\s+\\w+\\s*=\` inside \`<script>\` root (Cat 23 / B4)
   - \`window\\.[a-zA-Z_]+\\s*=\` and \`Object\\.defineProperty\\(window\` (Cat 23)
   - Inline handlers \`on(click|change|input|keydown|submit)=\` (Cat 25)
   - \`document\\.addEventListener\\(\` (Cat 25)
   - Hard-coded locales \`'de-DE'\` / \`'en-GB'\` / \`'en-US'\` in JS (Cat 27)
   - \`\\.toFixed\\(\` (Cat 3)
   - Emoji glyphs used as icons — regex \`[🔴🟢🟡🟠🔔🔍🎧🏭📍👤❓📊📋]\` (Cat 26)
   - Ternary threshold chains with 3+ literals — regex \`>=?\\s*\\d+\\s*\\?[^:]+:\\s*[^?]+>=?\\s*\\d+\\s*\\?\` (Cat 28)
   - CSS classes containing \`gantt\` / \`timeline\` / \`now-line\` combined with inline \`style="(left|width):.*%"\` (Cat 24)
4. Read \`POD2_PLUGIN_EXAMPLE.md\` in the **target** working directory if present — for namespace / display name / category.

## Phase 1 — Load MCP Knowledge Base

**Common knowledge base (always load, in this order):**

1. \`get_pod2_guidelines\` — load the canonical rules
2. \`get_pattern_doc({ name: "migration-suspect-list" })\` — the 29-category "things to look for" checklist (CRITICAL — this is the anti-feature-loss list)
3. \`get_pattern_doc({ name: "common-mistakes" })\` — current mistake catalog
4. \`get_pattern_doc({ name: "basics" })\` — architecture & Best Practice. **§0 (Prime Directive: Standard Controls Before Custom) is the overarching rule** governing every control-choice decision downstream — the 4-rung Escalation Ladder (search alternatives → escalate within family → compose → custom only after team alignment) is what M60 / M61 / Cat 29 / M70 all specialise.
5. \`get_pattern_doc({ name: "widget-patterns" })\` — widget templates
6. \`get_pattern_doc({ name: "extension-json-schema" })\` — extension.json contract
7. \`get_example({ plugin: "Customer.Coating" })\` — full-featured reference implementation

**HTML5-specific additions** (when \`sourceFormat === "html5"\`):

8. \`get_pattern_doc({ name: "dashboard-patterns" })\` — monitoring-dashboard blueprint (KPI tiles, drill-down, auto-refresh) + the dashboard-scoped Prime Directive (specialisation of basics.md §0) plus the Fiori-native rendering rule (visual fidelity — complements, does not replace, the Prime Directive)
9. \`get_pattern_doc({ name: "fiori-design-compliance" })\` — positive SAP Fiori design canon (Fiori decision table for Card vs. Panel / DynamicPage vs. Page / MessageBox vs. Strip vs. Toast / iconography, canonical Design Guideline URLs, Phase 5c review checklist). Complements the M61 CSS-ban with the target look-and-feel.
10. \`get_pattern_doc({ name: "chart-migration-map" })\` — Chart.js/d3/plotly/echarts → SAPUI5 control mapping
11. \`get_pattern_doc({ name: "html5-migration-guide" })\` — mechanical before/after rewrites for every HTML5 pattern
12. \`get_pattern_doc({ name: "widget-patterns-core", section: "Timer" })\` — auto-refresh (timer + cleanup)
13. \`get_pattern_doc({ name: "widget-patterns-advanced", section: "ObjectStatus" })\` — threshold-driven KPI state
14. \`get_pattern_doc({ name: "mdo-extractor-reference" })\` — MDO entity reference (used by \`ODataV4Client\`)

## Phase 2 — FEATURE INVENTORY (mandatory artifact 1)

**Read every source file completely** (no chunked partial reads — every line matters).

Then write \`MIGRATION_INVENTORY.md\` to the target working-directory root with this structure:

\`\`\`markdown
# Migration Inventory — <PluginName>

**Source**: \`${src}\`
**Source files**: <list>
**Date**: <ISO 8601>

## Source File Summary
| File | LOC | Purpose |
|---|---:|---|
| widget/Foo.js | 1329 | Main widget |
| i18n/i18n.properties | 40 | Default bundle |

## Detected Features (by Category)

### Category 1 — Input Validation State (valueState)
| # | File:Line | Snippet | Description |
|---|---|---|---|
| 1.1 | widget/Foo.js:655 | \`oInput.setValueState("Error")\` | Error state on innerDiameter > max |
| 1.2 | widget/Foo.js:663 | \`oInput.setValueState("Error")\` | Error state on isNaN |
| … | | | |

### Category 5 — Table Aggregations
…

### Category BUG — Hidden bugs to fix during migration
| # | File:Line | Snippet | Bug type | Proposed fix |
|---|---|---|---|---|
| BUG.1 | widget/Foo.js:261 | \`getI18nText("…") \\\`\${x}\\\`\` | B1 Tagged-template misuse | Use placeholder substitution |
| BUG.2 | widget/Foo.js:705 | \`innerInput.setValueState(\` | B2 Undeclared global | Use \`this.#oInnerInput\` |
\`\`\`

**Hard rules for the inventory:**

- Run **every** detection pattern from \`migration-suspect-list.md\` (Cat 1 to Cat 29) against every source file. Use \`search_files\` or \`execute_command\` with grep — do NOT rely on memory.
- For \`sourceFormat === "html5"\`: Cat 21-29 are the most important categories — inventory rows MUST include a **~60-char snippet** in the "Snippet" column because HTML5 mixes markup and JS, and \`file:line\` alone is ambiguous. **Cat 29** specifically catches the migrator's default composition bias — even a well-executed HTML5 KPI card should be inventoried, so Phase 3 has a chance to swap it for a standard control.
- If a category yields zero hits, **explicitly state**: *"Cat N: 0 hits."*
- Hidden bugs (B1–B11 from the suspect list) MUST be enumerated even if the agent intends to fix them silently.
- Estimate: a non-trivial POD 2.0 source typically yields **30–60 inventory items** across 10+ categories. HTML5 sources typically yield **40–80** because Cat 21-29 add many hits. If your inventory has fewer than 20 items, **you missed things — re-scan**.

End the inventory with the **Output Contract sentence**:

> *"Found N features across K categories plus B BUGs. See MIGRATION_INVENTORY.md."*

**Post the contract sentence to chat and STOP** — wait for the user to confirm before proceeding to Phase 3. (This is the most important checkpoint of the workflow.)

## Phase 3 — MAPPING (mandatory artifact 2)

For each inventory entry, decide the POD 2.0 target pattern and write \`MIGRATION_MAPPING.md\`:

\`\`\`markdown
# Migration Mapping — <PluginName>

## Cat 1 — Input Validation State
| # | Source | POD 2.0 Target | Doc Reference | Notes |
|---|---|---|---|---|
| 1.1 | oInput.setValueState("Error") | Keep setValueState; use ValueState enum; bind to model | form-patterns.md §3 | — |
| … | | | | |

## BUGs
| # | Source bug | Fix |
|---|---|---|
| BUG.1 | tagged template | Use \`getI18nText("key", [args])\` |
\`\`\`

**For each non-trivial mapping**, call the corresponding MCP tool to verify the target pattern:

- POD2 API class / method → \`get_api_doc\`
- UI5 control / property → \`get_ui5_api({ symbol: "sap.m.<Class>" })\` (or \`search_ui5_api({ query: "..." })\` when the exact class name is unclear). Bundled offline, pinned to SAP DM's UI5 version — no \`projectDir\` needed.
- Pattern (subscribe, dialog, form, table) → \`get_pattern_doc\`
- REST endpoint or DTO → \`get_rest_api\`

**Additional rules for HTML5 mappings (Cat 21-29):**

- Every **Cat 21 (chart)** inventory item MUST map to a specific SAPUI5 control from \`chart-migration-map.md\` (VizFrame / BulletMicroChart / LineMicroChart / GanttChart / bespoke composite). "Bespoke composite" requires an explicit fallback-rule justification (< 5 rows, no drag/resize, etc.) — otherwise the item is **Open** and the user must decide.
- Every **Cat 22 (fetch)** inventory item MUST map to either \`ODataV4Client\` (for MDO views) with the target entity + \`$select\`/\`$filter\` sketch, or an \`ApiClient.<ns>.<method>\` call. Cite the MDO entity from \`mdo-extractor-reference.md\`.
- Every **Cat 23 (module-level state)** inventory item MUST map to either a private field (\`#name\`), a JSONModel path, or a Context singleton property. NO globals allowed.
- Every **Cat 28 (magic threshold)** inventory item MUST map to a **widget property** (see \`property-editors.md\`) with a default value equal to the source literal. Inlining threshold literals in the target widget code is forbidden.
- **Every KPI-tile / info-card / totals-row / timeline-strip / sparkline / percentage-ring composite** (Cat 29 territory) MUST cite a specific row in \`dashboard-patterns.md\` §"Chart→control decision table". Empty citation = **Phase-5 gate failure**. If deviating from the first-choice standard control, add a one-sentence justification in \`MIGRATION_MAPPING.md\` (why the standard was inadequate). "Silence" defaults to picking the standard control — a hand-built \`Panel\`/\`VBox\`/\`ObjectStatus\` composite without an explicit rejection sentence is treated as a mapping bug.
- **Every KPI-tile / info-card / card-with-content / timeline / totals-row composite** ALSO gets a full **field-inventory block** in \`MIGRATION_MAPPING.md\` — this is the M70 information-preservation contract:

  \`\`\`markdown
  ## Composite: <source file/selector>

  Source fields (from HTML5 template):
  - <field1> → <role>
  - <field2> → <role>
  - …

  Candidate target: <sap.m.GenericTile | sap.f.Card + NumericHeader | …>
  - Slots covered: <list of target slots that consume source fields>
  - Slots MISSING: <fields the candidate can't hold — comma-separated>

  Decision:
  - <one of: "Escalating to <row> — cite dashboard-patterns.md §…" | "Adding f:content fragment with <control>" | "Intentionally dropped: <field>, <field> — reason: …, user-approved: pending">
  \`\`\`

  The rule is **"the SMALLEST standard control that fits ALL source fields"** — NOT "the first-choice control from the row that matched the primary KPI". Silence at this step is silent information loss (M70) — dropped fields must EITHER be picked up by an escalated target (per \`dashboard-patterns.md\` §"Chart→control decision table" Escalate-to column), OR listed in \`### Intentionally dropped\` with user sign-off, OR moved to a \`f:content\` fragment in the Card body. Never omit. See \`common-mistakes-ui.md\` §M70.

**Standard-first bias (Phase 3 XML emission rule):**

> Before you write ANY \`<Panel><VBox>…<Text class="lm*Big"/></VBox></Panel>\` group in a fragment, look up the row in \`dashboard-patterns.md\` §"Chart→control decision table" and use the first-choice control instead. If you cannot, document in \`MIGRATION_MAPPING.md\` why the standard control was inadequate (one sentence per composite). An empty justification field means the check was skipped — that is a Phase-5 gate failure.
>
> **Standard-first is NOT "primary-KPI wins"** — the rule is "the SMALLEST standard control that fits ALL source fields". Read the "Slots" column of the decision table BEFORE the "First choice" column. If the source composite has more fields than the first-choice control has slots, escalate to the row named in the "Escalate to" column (typically \`sap.f.Card\` + \`NumericHeader\` + optional \`f:content\` fragment). Silently dropping fields at this step is **M70** — the mapping bug is treated identically to a Cat 29 miss.
>
> **Overarching rule (the general form of this bias): [\`basics.md\`](basics.md) §0 — Prime Directive: Standard Controls Before Custom.** M60 / M61 / Cat 29 / M70 are all specialisations of the same 4-rung Escalation Ladder (search alternative standard controls → escalate within family → compose → custom only after team alignment). Load \`basics.md\` §0 alongside \`dashboard-patterns.md\` at Phase 1 — the ladder applies to every control decision, not only dashboard tiles.

**No-plugin-CSS bias (Phase 3 XML emission rule — M61 umbrella):**

> Do not create \`widget/css/*.css\`. If a spacing tweak is unavoidable, use a \`sapUi{Tiny,Small,Medium,Large}Margin{,Top,Bottom,Begin,End}\` utility class inline via \`addStyleClass()\`. If you do create a CSS file, you MUST call a stylesheet loader in the widget's \`init()\` (\`sap.ui.core.IconPool.registerStyleSheet(...)\`, \`jQuery.sap.includeStyleSheet(...)\`, or \`sap.ui.require(["...css!..."], ...)\`) — a CSS file with no loader is Phase-5 gate failure per M61 (a real migration shipped ~200 LOC of never-loaded CSS). Prefer utility classes and semantic-control properties (\`ObjectNumber emphasized="true"\`, \`NumericContent.valueColor\`, \`ObjectStatus.state\`, \`IconColor.*\`) over any custom CSS. If you truly need a plugin-owned style, use the \`// standard-only: exception — <reason>\` marker on the offending line (documented in \`common-mistakes-ui.md\` §M61).

**View-model data discipline** (Cat 29 unblocker — see M62): keep raw numerics (\`float\`/\`int\`) in the JSONModel; add a separate \`*Text\` string field ONLY if a plain \`Text.text\` binding still consumes it. Never store only the pre-formatted string — it blocks \`NumericContent.value\` (needs float), \`NumericHeader.number\` + \`unitOfMeasurement\` (needs a numeric-and-unit split), etc.

Apply the **Source-or-Silence** meta-rule (\`get_pod2_guidelines\` Section 0): if you can't verify a mapping, mark it explicitly as an assumption and ask the user.

## Phase 4 — IMPLEMENTATION

Now and only now: generate the target plugin files in the working-directory root using the Best-Practice pattern:

- \`extension.json\`
- \`widget/<Name>Widget.js\`
- \`action/<Name>*Action.js\` (if applicable)
- \`context/<Name>Context.js\` (if shared state needed across widget+actions)
- \`i18n/i18n.properties\` (+ \`_de\`, \`_en\`, \`_en_US\`) — see common-mistakes #32 for \`widget.\` prefix
- \`README.md\` — in the style of \`examples/Customer.Coating/README.md\`

**File layout rule** (CRITICAL): Generate ALL files **directly in the working-directory root** (= ZIP root). Do NOT create a wrapper folder named after the plugin or namespace.

**Dashboard-shaped layout** (when the source is an HTML5 monitoring/dashboard app):

\`\`\`
widget/
  <Name>Widget.js            # LayoutWidget-style shell + auto-refresh + MDO loads
context/<Name>Context.js
i18n/*
extension.json
README.md
\`\`\`

**Compose, don't extend.** Do NOT create a \`kpi/KpiTileControl.js\` (or any other custom control subclassing \`CustomVBox\`/\`VBox\`/\`FlexBox\` just to wrap a \`Title\` + \`ObjectStatus\` / \`NumericContent\`). Standard SAPUI5 controls cover every KPI-tile shape:

- **KPI tile with big number + trend** → \`sap.m.GenericTile\` + \`sap.m.TileContent\` + \`sap.m.NumericContent\` (\`value\` bound to a float, \`valueColor\` bound to a formatter returning \`ValueColor\`).
- **Threshold-driven status pill** → \`sap.m.ObjectStatus\` (\`state\` bound to a formatter returning \`ValueState\`).
- **Card-shaped KPI group** → \`sap.f.Card\` + \`sap.f.cards.NumericHeader\`.

Subclassing a layout container to inject two child controls is an anti-pattern here: it drags in the sync-renderer 404 trap (M50 family), hides the composition from the property editor, and gives Phase-5 reviewers nothing to check against the Fiori design canon. See \`dashboard-patterns.md\` §"Chart→control decision table" for the row-per-composite mapping.

**Hard rewrite rules (HTML5 sources — must be applied at implementation time):**

1. Chart.js / d3 / plotly / echarts / apexcharts code, imports, and CDN \`<script>\` tags are **NEVER copied 1:1**. They are re-implemented via UI5 controls per \`chart-migration-map.md\`. If a chart cannot be mapped: mark it \`⚠️ Bespoke composite required\` in \`MIGRATION_MAPPING.md\` and consult the user BEFORE Phase 4.
2. CSS \`<div>\`-based Gantt / timeline is re-implemented via \`sap.gantt.GanttChart\` OR the bespoke composite fallback in \`chart-migration-map.md\` §"Custom div-Gantt" — never copied CSS.
3. Every \`fetch(...)\` becomes \`ODataV4Client\` (for MDO) or \`ApiClient.<ns>.<method>\` — never keep native \`fetch\` in shipped widget/action code.
4. Every module-level \`let\` / \`var\` / \`Object.defineProperty(window,…)\` becomes a private class field or a Context singleton property.
5. Every inline \`onclick=\` / \`onchange=\` / \`document.addEventListener\` becomes \`attachPress\` / \`attachChange\` on the corresponding UI5 control.
6. Every emoji-as-icon becomes \`sap-icon://\` + \`sap.ui.core.IconColor\` (+ tooltip for accessibility).
7. Every \`toLocaleString/DateString/TimeString('de-DE'|'en-GB'|…)\` becomes \`sap.ui.core.format.DateFormat\` (locale from \`sap/ui/core/Configuration.getLanguage()\`).
8. Every \`.toFixed(N)\` becomes \`NumberFormat.getFloatInstance({minFractionDigits:N, maxFractionDigits:N})\`.
9. Every hard-coded threshold (\`if (val > 20)\`) becomes a widget property (see \`property-editors.md\`).
10. Every \`console.log\` / \`console.error\` becomes \`sap/base/Log\` (Logger).

Recipes and worked examples: \`html5-migration-guide.md\`.

**Implementation rules:**

- Read \`MIGRATION_MAPPING.md\` from disk for each section you implement.
- Every inventory item must be addressed — either implemented or explicitly skipped (with reason).
- Fix the BUGs from the inventory — never faithfully reproduce them.
- Use \`replace_in_file\` for surgical edits on existing files. New files via \`write_to_file\`.
- After each major file, post a short progress message: *"Implemented widget/Foo.js — addressing Cat 1.1, 1.2, 5.1, 6.3, 8.1, 9.1, 10.1 (7 inventory items)."*

### Phase 4b — Smoke-Test View (RECOMMENDED for HTML5 migrations)

Before writing the full \`_createView()\` with charts, tabs, tables, and MDO wiring, produce a **minimal smoke-test view** and upload it to SAP DM. This detects showstoppers (wrong base class, module 404s, i18n bundle path typo, subscribe failure) with 30-40 LOC instead of 400+.

Smoke-test view = a plain \`sap.m.VBox\` with:
- The widget title from i18n (\`{i18nX>widgetX.displayName}\`) — proves i18nCustomModel registration.
- A few JSONModel bindings that show current state — proves model init + \`_createView\` return contract:
  \`\`\`
  Plant: {lm>/plant}
  Period: {lm>/period}
  Work centers: {lm>/workCenters/length}
  Last refresh: {lm>/lastRefresh}
  \`\`\`
- A single \`sap.m.Button\` "Refresh" wired to \`this._refresh\` — proves \`attachPress\` binding.
- One \`sap.m.MessageStrip\` bound to an error state — proves error surface works.

Upload the smoke-test widget. Verify in POD:
- Widget appears in the plugin catalog (Manifest OK).
- Widget renders in the target panel (\`_createView\` return contract OK).
- Bindings show live values (JSONModel + i18nCustomModel OK).
- Refresh button reacts (\`attachPress\` OK).

Only AFTER the smoke test succeeds, expand the view region-by-region. If ANY of the above fails, the diagnostic checklist below applies.

### Phase 4c — "Widget is empty" diagnostic checklist (when Phase 4b or 4 fails)

Rendering nothing / rendering to zero-height / silent white space in the POD panel usually means one of the following. Walk this list top-to-bottom in the browser's DevTools:

1. **\`onInit()\` fires?** DevTools Sources → set breakpoint on the first line of \`onInit\`. If not hit, the manifest binding is wrong — check \`extension.json\` \`modulePath\` and \`type\` for typos or wrapper-folder path issues.
2. **\`_createView\` returns something?** Same — breakpoint on \`_createView\`. Must return a UI5 control (not \`undefined\`, not a Promise unless \`IAsyncContentCreation\` is declared).
3. **Root element has \`height > 0\`?** Inspect the DOM — if the root has \`height: 0\`, you're using \`sap.m.App\` or \`SplitApp\` at root (M58) or the parent flex container has no allocated height. Use \`sap.m.NavContainer\` or a bounded \`VBox\` with \`fitContainer: true\`.
4. **Console has an ERROR earlier than the last-visible one?** Scroll UP. Common cascades:
   - \`sap/m/items.js:404\` is usually a recovery cascade of an earlier fatal — the real cause is above (M52).
   - \`Component-preload.js:404\` served as \`application/json\` blocks the whole \`ComponentWidget\` boot — the FIRST error under it is the actual bug (M50).
5. **Network tab shows an MDO call?** If \`_loadOee\` runs but no request is on the wire, either the plant is unknown (M51 — \`ModelPath.SelectedPlant\` doesn't exist; use \`ModelPath.Plant\`; callback receives an object) or the client construction failed.
6. **JSONModel instance exists on the root control?** DevTools Elements → select root → in the Console: \`sap.ui.getCore().byId("...root...").getModel("lm")\` — should be a \`JSONModel\` instance. \`undefined\` means \`setModel\` wasn't called or was called on the wrong control.
7. **i18nCustomModel registered?** \`view.getModel("i18n<WidgetShort>")\` should be an \`I18nResourceModel\`. If \`undefined\` and bindings show \`{i18nCoating>foo}\` literally, the model wasn't registered in \`onInit\` (M35).
8. **Static field \`#oI18nModel\` bundle path matches the actual i18n folder?** \`"customer.custom.extensions.<name>.i18n.i18n"\` — dots, not slashes, and the file must be \`i18n/i18n.properties\`.
9. **No console.error at all AND widget still empty?** Try the smoke-test view (Phase 4b) with a static \`sap.m.Text\` root. If THAT is also invisible, the container/POD wiring is wrong — check the Panel type (M21: use \`CustomPanel\` at layout root, not \`sap.m.Panel\`).
10. **Everything renders but the widget crashed during refresh?** Look for the FIRST error in the Console. Usual suspects: microchart color-type parser rejection (M53), \`String\` into \`float\` property (M43), list-binding template conflict (M55), unknown-setting error (M54).

If the checklist doesn't pinpoint the issue, add \`\\Log.info("[<WidgetName>] <stage>")\` breadcrumbs at \`onInit\` start/end, \`_createView\` start/end, \`_refresh\` start/end, and \`_onPlantChange\` — then reload and diff the console.

## Phase 5 — VERIFICATION (mandatory artifact 3)

After implementation, write \`MIGRATION_VERIFICATION.md\`:

\`\`\`markdown
# Migration Verification — <PluginName>

**Date**: <ISO 8601>

## Coverage Matrix
| Inv # | Category | Status | Target File:Line | Justification (if not ✅) |
|---|---|---|---|---|
| 1.1 | Cat 1 valueState | ✅ | widget/FooWidget.js:142 | — |
| 1.2 | Cat 1 valueState | ✅ | widget/FooWidget.js:148 | — |
| 5.1 | Cat 5 aggregation | ✅ | widget/FooWidget.js:303 | — |
| 13.1 | Cat 13 bulk-add | ⚠️ Dropped | — | Customer confirmed bulk-add not needed in target. |

## Open Items
- (none — every inventory entry has a ✅ or ⚠️ row)

## Summary
- Total inventory items: N
- ✅ Migrated: N
- ⚠️ Intentionally dropped: N
- ❌ Open: 0 (required for sign-off)
\\\`\\\`\\\`

**Verification rule**: If ANY row is ❌ Open, the migration is NOT complete — go back to Phase 4 or escalate.

### Phase 5a — Field-coverage report (M70 — mandatory when \`sourceFormat === "html5"\`)

Between the "Coverage Matrix" and the "HTML5 Residue Gate", emit a **Field-coverage report** with one row per migrated KPI-tile / info-card / card-with-content / timeline / totals-row composite. This is the visible-artifact half of the M70 information-preservation contract (Phase 3's \`## Composite:\` mapping blocks are the invisible half):

\`\`\`markdown
## Field-coverage report (M70)

| Source composite | Source fields | Target control | Rendered slots | Dropped fields | User-approved? |
|---|---|---|---|---|---|
| \`renderWorkCentre .wc-card\` | wc, description, currentOrder, completedRatio, progressBar, statusText, lastRefresh | \`sap.f.Card\` + \`NumericHeader\` + \`content:ProgressIndicator\` | title, subtitle, number, scale, details, statusText, \`f:content\` | — | ✅ full coverage |
| \`renderKpiRow .kpi-cell\` | label, value, unit, subValue1, subValue2, trend | \`sap.m.GenericTile\` + \`NumericContent\` | header, TileContent.unit, NumericContent.value, NumericContent.indicator | \`subValue1\`, \`subValue2\` | ❌ NOT APPROVED — escalate to Info card |
\`\`\`

**Sign-off rule** — any row where **Dropped fields** is non-empty AND **User-approved?** is not \`✅\` blocks Phase-5 sign-off. Two legal resolutions:

1. **Escalate** the target control per \`dashboard-patterns.md\` §"Chart→control decision table" Escalate-to column. Preferred outcome — fills the dropped fields with real slots.
2. **List the fields explicitly** in \`MIGRATION_MAPPING.md\` under \`### Intentionally dropped\` with a business justification, then STOP and ask the user for approval (Category-2 halt). Update the User-approved? column to \`✅ approved — <reason>\` before proceeding.

Silence is not a legal outcome — silent drop is exactly the M70 defect this section exists to catch. See \`common-mistakes-ui.md\` §M70.

### Phase 5b — HTML5 Residue Gate (only when \`sourceFormat === "html5"\`)

After the coverage matrix, run these grep commands **against the GENERATED plugin** (not the source). **Zero hits required** — every hit is a ❌ Error and blocks sign-off:

\`\`\`bash
# Chart libraries: never keep in shipped POD 2.0 plugin (Cat 21)
grep -rnE 'new Chart\\(|Chart\\.register|Chart\\.defaults|d3\\.|Plotly\\.|echarts\\.init|ApexCharts' widget/ action/ context/ util/ 2>/dev/null

# Native fetch / XHR / Ajax (Cat 22)
grep -rnE 'fetch\\s*\\(|XMLHttpRequest|\\\$\\.ajax|axios\\.' widget/ action/ context/ util/ 2>/dev/null

# Module-level let/var (Cat 23) — heuristic: any assignment at file root
grep -rnE '^\\s*(let|var)\\s+\\w+\\s*=' widget/ action/ context/ util/ 2>/dev/null

# Inline handlers / document-level listeners (Cat 25)
grep -rnE 'onclick=|onchange=|oninput=|document\\.addEventListener\\(' widget/ action/ context/ util/ 2>/dev/null

# Emoji-as-icon in JS strings (Cat 26)
grep -rnE '[🔴🟢🟡🟠🔔🔍🎧🏭📍👤❓📊📋]' widget/ action/ context/ util/ 2>/dev/null

# Hard-coded locale literals in JS (Cat 27)
grep -rnE "'de-DE'|'en-GB'|'en-US'|'fr-FR'" widget/ action/ context/ util/ 2>/dev/null

# toFixed on numeric formatting (Cat 3 / M34)
grep -rnE '\\.toFixed\\(' widget/ action/ context/ util/ 2>/dev/null

# console.log — must be sap/base/Log
grep -rnE 'console\\.(log|error|warn|info|debug)' widget/ action/ context/ util/ 2>/dev/null

# setInterval without a stored handle (B9)
grep -rnE 'setInterval\\s*\\(' widget/ action/ context/ util/ 2>/dev/null | grep -vE 'this\\.#\\w+\\s*=\\s*setInterval|#\\w+\\s*=\\s*setInterval'

# Timer cleanup missing (Cat 20)
grep -l 'setInterval' widget/ action/ context/ util/ 2>/dev/null | while read f; do
  grep -q 'clearInterval' "\$f" || echo "\$f: setInterval without clearInterval"
done

# sap/m/BusyIndicator imported inside widget code (M33)
grep -rn 'sap/m/BusyIndicator' widget/ 2>/dev/null

# Non-existent AMD module paths (M41) — 404 at plugin-load, hard fail
grep -rnE '"sap/m/(Item|Icon|ListItem|Element|Control|Fragment|HTML)"' widget/ action/ context/ util/ 2>/dev/null

# ── Standard-First bias gate (Cat 29 / M60-M61) ──

# Custom control that is only a set-forwarder template (M60):
grep -rn 'extend("sap/dm/dme/pod2/control/CustomVBox"' widget/control/ 2>/dev/null
# For every hit — verify the class body has non-trivial behavior beyond set<Prop> forwarders;
# otherwise refactor to sap.m.GenericTile + NumericContent per dashboard-patterns.md §"Chart→control decision table".

# Custom CSS reproducing Fiori typography/color tokens (M61 subset — Fiori-token duplication):
grep -rnE 'font-size:\\s*(1\\.[2-9]|2)|font-weight:\\s*(600|700|bold)|color:\\s*var\\(--sap[A-Za-z]+Color\\)' *.css widget/**/*.css 2>/dev/null && \\
    echo "M61: Fiori-token duplication in plugin CSS — use semantic control (ObjectNumber emphasized / NumericContent / ObjectStatus state) instead"

# Physical widget/css/*.css file exists — M61 (either has no loader = dead code, or is plugin CSS at all)
if find widget/ -name "*.css" -not -path "*/node_modules/*" 2>/dev/null | grep -q . ; then
    if ! grep -rq 'includeStyleSheet\\|createStyleSheet\\|IconPool\\.registerStyleSheet\\|css!' widget/ 2>/dev/null ; then
        echo "M61: DEAD CSS — widget/css/ exists but no stylesheet loader call. Delete the file AND every class=\\"lm*\\" attribute (a real migration shipped 200 LOC of never-loaded CSS)."
    else
        echo "M61: plugin CSS file present with loader — verify Fiori standard controls could not cover it; add \\"// standard-only: exception\\" marker OR delete the CSS and use semantic controls / sapUi*Margin utilities."
    fi
fi

# sap.ui.core.HTML with <style> or inline style= in content string — M61
grep -rnE 'new HTML\\s*\\(\\s*\\{[^}]*content:\\s*"[^"]*<style' widget/ 2>/dev/null && \\
    echo "M61: HTML control with <style> — replace with sap.m.Text / sap.m.FormattedText / sap.m.Panel or use \\"// standard-only: exception\\" marker"
grep -rnE 'new HTML\\s*\\(\\s*\\{[^}]*content:\\s*"[^"]*style=' widget/ 2>/dev/null && \\
    echo "M61: HTML control with inline style= — same as above"

# Inline style= attribute in XML view/fragment — M61
grep -rnE 'style="[^"]+"' widget/ view/ 2>/dev/null | grep -E '\\.xml:|\\.fragment\\.xml:' && \\
    echo "M61: inline style= in XML view/fragment — refactor to a semantic control + sapUi*Margin utility"

# Non-Fiori-prefix addStyleClass strings — M61 whitelist
grep -rnE 'addStyleClass\\("[^"]+' widget/ 2>/dev/null | \\
    grep -vE 'addStyleClass\\("(sapUi|sapM|sapTnt|sapF|sapUxAP|sapUshell)[A-Z]' && \\
    echo "M61: non-whitelisted addStyleClass — use sapUi{Tiny,Small,Medium,Large}Margin*, sapM*, sapTnt*, sapF*, sapUxAP*, sapUshell* only"

# Popover load in a file that also uses a microchart (M63 — dead code after Cat 29 refactor):
for f in \$(grep -l 'Fragment\\.load' widget/*.js widget/**/*.js 2>/dev/null); do
    grep -q -E 'LineMicroChart|BulletMicroChart|HarveyBallMicroChart|RadialMicroChart|AreaMicroChart' "\$f" && echo "SUSPECT: \$f — popover fragment near a microchart, verify not dead code"
done

# ── Orphan i18n keys (dashboard-patterns.md §"Orphan-i18n gate") ──

# Replace <PREFIX> with the plugin's i18n widget short-name prefix (e.g. dashboard).
prefix="<PREFIX>"
for key in \$(grep -oE "^\${prefix}\\\\.[a-zA-Z0-9._]+" i18n/i18n.properties 2>/dev/null | sort -u); do
    refs=\$(grep -rn "\\\\b\${key}\\\\b" widget/ --include='*.js' --include='*.xml' --include='*.fragment.xml' 2>/dev/null | wc -l)
    if [ "\$refs" -eq 0 ]; then echo "ORPHAN: \$key"; fi
done
# Any ORPHAN — delete from all 4 locale files (i18n.properties, _de, _en, _en_US) in the same commit.

# ── Information-preservation contract (M70) ──

# Every "## Composite:" heading in MIGRATION_MAPPING.md needs matching "Source fields:" and "Slots covered:" lines.
composites=\$(grep -c '^## Composite:' MIGRATION_MAPPING.md 2>/dev/null || echo 0)
srcfields=\$(grep -c '^Source fields:' MIGRATION_MAPPING.md 2>/dev/null || echo 0)
slotsline=\$(grep -c '^Slots covered:' MIGRATION_MAPPING.md 2>/dev/null || echo 0)
if [ "\$composites" -gt 0 ] && { [ "\$srcfields" -lt "\$composites" ] || [ "\$slotsline" -lt "\$composites" ]; }; then
    echo "M70: MIGRATION_MAPPING.md has \$composites '## Composite:' headings but only \$srcfields 'Source fields:' and \$slotsline 'Slots covered:' — silent mapping. See common-mistakes-ui.md §M70."
fi

# MIGRATION_VERIFICATION.md must contain the Field-coverage report.
if ! grep -q '^## Field-coverage report' MIGRATION_VERIFICATION.md 2>/dev/null; then
    echo "M70: MIGRATION_VERIFICATION.md missing '## Field-coverage report' section — see Phase 5a."
fi
\`\`\`

Append a **Residue Gate** section to \`MIGRATION_VERIFICATION.md\`:

\`\`\`markdown
## HTML5 Residue Gate
| Check | Hits | Status |
|---|---:|---|
| Chart.js / d3 / plotly / echarts | 0 | ✅ |
| Native fetch / XHR | 0 | ✅ |
| Module-level let/var | 0 | ✅ |
| Inline onclick / document.addEventListener | 0 | ✅ |
| Emoji-as-icon | 0 | ✅ |
| Hard-coded locale ('de-DE'/'en-GB'/…) | 0 | ✅ |
| .toFixed | 0 | ✅ |
| console.log | 0 | ✅ |
| setInterval without stored handle | 0 | ✅ |
| setInterval without clearInterval | 0 | ✅ |
| sap/m/BusyIndicator in widget/ | 0 | ✅ |
| Non-existent AMD paths (sap/m/Item, sap/m/Icon, …) | 0 | ✅ |
| Custom control (CustomVBox set-forwarder-only) — Cat 29/M60 | 0 | ✅ |
| Physical widget/css/*.css file (dead-code or CSS at all) — M61 | 0 | ✅ |
| sap.ui.core.HTML with \`<style>\` or inline \`style=\` — M61 | 0 | ✅ |
| Inline \`style="..."\` in view/fragment XML — M61 | 0 | ✅ |
| Non-Fiori-prefix \`addStyleClass\` / \`class=\` — M61 whitelist | 0 | ✅ |
| Popover keyed off microchart shape — M63 | 0 | ✅ |
| Orphan i18n keys (Cat 29 §orphan-i18n gate) | 0 | ✅ |
| Composites without \`## Composite:\` / \`Source fields:\` / \`Slots covered:\` in MIGRATION_MAPPING.md — M70 | 0 | ✅ |
| Field-coverage report rows with unapproved \`Dropped fields\` — M70 | 0 | ✅ |
\`\`\`

Any row with hits > 0 → return to Phase 4. Sign-off requires all-zero. **Cat 29, M61, and M70 rows are gate failures even if the plugin "works" — a standard-first bias miss, a dead CSS file, and a silent slot-drop are all treated identically to a Chart.js residue.**

### Phase 5c — Fiori Design Compliance Review (only when \`sourceFormat === "html5"\`)

Phase 5b greps for **residue** (things that shouldn't be there). Phase 5c reviews **design compliance** (whether the produced plugin looks native to SAP DM). This is a **manual visual walk-through** guided by the 10-checkbox review in \`fiori-design-compliance.md\` §"Verification during Phase 5c"; it complements the negative Residue Gate with the positive Fiori canon.

For every generated view / fragment / control instantiation, walk the checklist and emit the result in \`MIGRATION_VERIFICATION.md\` as a table:

\`\`\`markdown
## Phase 5c — Fiori design compliance review

| # | Check | Result | Justification (if not ✅) |
|---|---|---|---|
| 1 | Icon set — sap-icon:// only (no emoji, no PNG, no external icon font) | ✅ | — |
| 2 | Color semantics — ValueState / IconColor / ValueColor (no hex, no CSS var) | ✅ | — |
| 3 | Typography hierarchy — Title level= / NumericContent / ObjectNumber emphasized | ✅ | — |
| 4 | Card vs. Panel — sap.f.Card for metric+chart+label; sap.m.Panel for form/table | ✅ | — |
| 5 | Page container — DynamicPage/Page or bounded root; NOT sap.m.App (M58) | ✅ | — |
| 6 | Empty/no-data/error — IllustratedMessage with illustrationType | ✅ | — |
| 7 | Messaging — MessageBox (blocking) / MessageStrip (in-view) / MessageToast (transient) | ✅ | — |
| 8 | Responsive S/M/L — Fiori layout controls (GridContainer, DynamicPage) | ✅ | — |
| 9 | Accessibility — tooltip on icon-only controls; noDataText on Table/List | ✅ | — |
| 10 | Localisation — 4 bundles; M30 (SFC → PSN in _de); DateFormat/NumberFormat | ✅ | — |
\`\`\`

Zero ⚠️ / ❌ required for sign-off. Any ⚠️ / ❌ row needs an explicit one-sentence justification (or the plugin returns to Phase 4). Deviations to preserve the source's original design **require user approval in this phase** — the agent posts the review table to chat and STOPS until the user confirms.

Load \`fiori-design-compliance.md\` §"Verification during Phase 5c" for the full check descriptions, and §"Fiori design decision table" for the layout/structure/messaging conventions any row 1-10 might reference.

## Phase 6 — Final Validation

Run the \`validate_project\` MCP prompt against the generated plugin to catch any common-mistakes (i18n widget. prefix, import paths, etc.). Resolve any ❌ Errors before declaring the migration done.

## Phase 7 — Chat Summary

Post a concise summary in chat (do NOT repeat the artifacts):

\\\`\\\`\\\`
✅ Migration complete — Source: ${src} → ${ns}

📊 Coverage:
- N inventory items found across K categories
- N migrated ✅
- N intentionally dropped ⚠️ (with reasons in MIGRATION_VERIFICATION.md)
- 0 open ❌

🔧 BUGs fixed: B (see MIGRATION_INVENTORY.md → Cat BUG)

📄 Artifacts:
- MIGRATION_INVENTORY.md   (Phase 2)
- MIGRATION_MAPPING.md     (Phase 3)
- MIGRATION_VERIFICATION.md (Phase 5)
- Plugin files: extension.json, widget/, action/, context/, i18n/

🧪 validate_project: <result summary>
\\\`\\\`\\\`

---

## Anti-Patterns (forbidden)

- ❌ Skipping the inventory phase ("I'll just port the code directly")
- ❌ Inventing POD 2.0 APIs without verifying via \`get_api_doc\` (Source-or-Silence rule)
- ❌ Faithfully reproducing source-code bugs (see BUG categories B1–B5 in suspect list)
- ❌ Down-grading messages (MessageBox.error → MessageToast.show) without explicit user approval
- ❌ Dropping a feature without a row in \`MIGRATION_VERIFICATION.md\` with justification
- ❌ Combining Phases 2+3+4 into a single pass (the artifacts must be written and re-read)

## When to abort

- \`sourceDir\` not provided and user cannot supply one → ask, do not guess.
- \`sourceFormat === "pod2"\` and \`sourceDir\` does not contain POD 2.0 sources → abort with: "Source does not look like a POD 2.0 widget. Retry with \`sourceFormat: 'html5'\` if the source is an HTML5 monitoring app; POD 1.0 migration is not yet supported by this prompt."
- \`sourceFormat === "html5"\` and \`sourceDir\` contains no \`.html\` files with inline \`<script>\` blocks → abort with: "Source does not look like an HTML5 app. Expected at least one \`.html\` file with inline \`<script>\`."
- User instructs "just port it quickly without inventory" → refuse and explain the failure mode (cite the customer report at the top of \`migration-suspect-list.md\`).
`;
    },
  });

  server.addPrompt({
    name: "validate_project",
    description: "Validates the POD2 plugin in the current working directory against the latest MCP server standards: all 32+ common-mistakes, SAP DM REST API versions (v1/v2/v3), POD2 Public/Internal API usage, ModelPath constants, MDO/OData. Produces VALIDATION-REPORT.md with errors, warnings, info findings and an auto-fixable section.",
    arguments: [],
    load: async () => {
      return `Validate the POD 2.0 plugin in the **current working directory** against the latest pod2-mcp-server standards.

Scope is **always full** — every applicable rule must be checked.

---

## Phase −1 — Reasoning Kickoff (MUST happen BEFORE any tool calls or file writes)

Before starting validation, post a brief reasoning message in chat:

1. *"Validating POD2 plugin in \`<cwd>\`"*
2. The list of MCP tools you will call (the Phase 1 list)
3. The expected report path: \`<cwd>/VALIDATION-REPORT.md\`
4. The estimated number of files to read

This applies the Reasoning-First meta-rule from \`get_pod2_guidelines\` Section 0. Then proceed with Phase 0.

---

## Phase 0 — Discovery

1. **Verify it is a POD 2.0 plugin project**: \`extension.json\` MUST exist in the working directory root. If not, abort with a clear error message.
2. List the project tree (skip \`node_modules/\`, \`.git/\`, \`dist/\`, \`.scaffold-done\`, \`VALIDATION-REPORT.md\`).
3. Identify the plugin structure:
   - \`extension.json\`
   - \`widget/*.js\` (zero or one widget)
   - \`action/*.js\` (zero or more actions)
   - \`context/*.js\` (zero or one context singleton)
   - \`util/*.js\` (helpers)
   - \`i18n/i18n*.properties\` (4 expected: default, _de, _en, _en_US)
   - \`README.md\`, \`POD2_PLUGIN_EXAMPLE.md\` (optional)

## Phase 1 — Load MCP Knowledge Base

Call these MCP tools in order:

1. \`get_pod2_guidelines\` — load the canonical rules
2. \`get_pattern_doc({ name: "common-mistakes" })\` — full mistake catalog (#0 … #32+)
3. \`get_pattern_doc({ name: "basics" })\` — architecture & best practices
4. \`get_pattern_doc({ name: "widget-patterns" })\` — widget templates
5. \`get_pattern_doc({ name: "extension-json-schema" })\` — extension.json contract
6. \`get_pattern_doc({ name: "subscribe-patterns" })\` — PodContext subscribe/unsubscribe lifecycle
7. \`get_pattern_doc({ name: "namespace-update" })\` — current namespace conventions
8. \`list_rest_apis\` — current SAP DM REST API services with version info (v1/v2/v3)
9. \`list_api_docs({ namespace: "sap.dm.dme.pod2.api", limit: 200 })\` — current Public/Internal POD2 API surface

## Phase 2 — Read Plugin Source

Read every relevant file (full text):
- \`extension.json\`
- All \`*.js\` files
- All \`*.properties\` files
- \`README.md\` if present

## Phase 3 — Common Mistakes Audit (every applicable rule)

For each rule in \`common-mistakes.md\`, run a concrete detection. Group findings by severity:

### Errors (must-fix — these are broken in current SAP DM)

- **M0 / M15 — extension.json placement & layout**
  - extension.json MUST sit at project root (= ZIP root)
  - NO \`webapp/\` folder, NO namespace-folder wrapper
  - Folders \`widget/\`, \`action/\`, \`context/\`, \`i18n/\` directly at root
- **M2 — extension.json schema**
  - ONLY \`widgets\` and \`actions\` arrays. No \`name\`, \`description\`, \`version\`, \`provider\`, \`license\` fields.
  - Each entry has \`modulePath\` (slashes) and \`type\` (dots), consistent.
- **M3 — PodContext / ModelPath import path**
  - MUST be \`sap/dm/dme/pod2/context/PodContext\` and \`sap/dm/dme/pod2/context/ModelPath\`
  - NOT \`sap/dm/dme/pod2/model/...\` (legacy, broken)
- **M5 — Subscribe callback parameter order**
  - Callback signature MUST be \`(newValue, path)\` — NOT \`(path, newValue)\`. Detect via \`PodContext.subscribe(...)\` lambda inspection.
- **M6 — \`_createView()\` returns view with ID**
  - The returned root control MUST receive \`oConfig.id\` as **positional** first constructor argument.
- **M14 — Model initialization order**
  - If \`_createView()\` creates controls with bindings (\`{/...}\`), the JSONModel MUST be initialized **inside \`_createView()\`** before those controls are constructed (or guarded with \`if (!this.#oModel) this._initializeModel()\`).
- **M21 — \`sap.m.Panel\` vs \`CustomPanel\`**
  - For top-level layout containers, \`sap.dm.dme.pod2.control.CustomPanel\` is required (POD-Designer-compatible). Plain \`sap.m.Panel\` will not be draggable.
- **M29 — SFC status as string**
  - Comparisons like \`sfcStatusCode === 401\` (number) MUST be \`=== "401"\` (string). Same for filters, switch cases.
- **M31 — Control ID must be FIRST positional arg**
  - Detect anti-patterns: \`oControl.setId(oConfig.id)\`, \`{ id: oConfig.id, ... }\` in mSettings, build-then-setId in two statements.
- **M32 — Widget metadata i18n trio with \`widget.\` prefix**
  - All four locale bundles MUST contain \`widget.displayName=\`, \`widget.description=\`, \`widget.category=\` (no legacy unprefixed \`displayName=\`, \`description=\`, \`category=\`).
  - The widget code MUST read these via \`getI18nText("widget.displayName" / "widget.description" / "widget.category")\`.
  - The values MUST come from \`POD2_PLUGIN_EXAMPLE.md\` (or \`POD2_PLUGIN_TEMPLATE.md\`) verbatim — flag suspicious copy-paste like \`widget.category=CUSTOMER\` if the spec says something else.

- **HAL — Hallucination Audit (invented APIs / imports)**
  - For each source file, extract every:
    - non-trivial \`sap.ui.define([...])\` / \`sap.ui.require([...])\` import path
    - \`ApiClient.<ns>.<method>(...)\` call (Public AND Internal)
    - \`ModelPath.<X>\` reference
    - POD2 base-class / utility usage (e.g. \`PodContext.<method>\`, \`Logger.<method>\`, \`I18nResourceModel.<method>\`)
  - **Prioritization**: focus on items in the \`sap/dm/dme/...\` and \`sap.dm.dme.pod2.api.*\` / \`sap.dm.dme.pod2.context.*\` namespaces. Skip trivial generic UI5 imports (\`sap/m/Button\`, \`sap/ui/model/json/JSONModel\`, \`sap/base/Log\`, …) — those are covered by the \`get_ui5_api\` tool if verification is needed.
  - **For each prioritized identifier**, resolve via MCP:
    - Import path → \`get_api_doc({ className: "<dot-notation of path>" })\`. If the call returns no doc → ❌ **likely invented**.
    - \`ApiClient.<ns>.<method>\` → \`get_api_doc({ className: "sap.dm.dme.pod2.api.<ns>.<NsClientClass>" })\` and check for the method name. If method absent → ❌ **likely invented**.
    - \`ModelPath.<X>\` → \`get_api_doc({ className: "sap.dm.dme.pod2.context.PodContext" })\` (already done in 4d, reuse). If constant absent → ❌ **likely invented**.
    - \`PodContext.<method>\` → same doc; absent → ❌ **likely invented**.
  - **Verdict per identifier**:
    - ❌ Not found in MCP knowledge base → Error: "Likely hallucinated — not in API docs"
    - ⚠️ Found but marked \`@deprecated\` → already covered by Phase 4 — link to it, do NOT double-report
    - ✅ Resolves cleanly → silent (counted as passed)
  - Report each ❌ in the standard finding format (File:Line, Found, Expected = "valid API identifier", Why it matters = "broken at runtime — class/method does not exist").

### Warnings (should-fix — works but legacy / risky)

- **M1 — \`onExit()\` unsubscribe**
  - Every \`PodContext.subscribe(...)\` MUST have a matching \`PodContext.unsubscribe(...)\` in \`onExit()\` with the SAME callback reference. Count subscribe vs unsubscribe occurrences.
- **M4 — StringPropertyEditor default value**
  - Don't pass a 3rd default argument; defaults belong in \`getDefaultConfig()\` / \`getPropertyValue()\`.
- **M7 — PlacementType import**
  - \`PlacementType\` from \`sap/m/PlacementType\`, NOT from \`sap/ui/core/library\`.
- **M8 — Wrong ModelPath constants**
  - Cross-check every \`ModelPath.X\` against \`get_api_doc({ className: "sap.dm.dme.pod2.context.PodContext" })\` and \`sap.dm.dme.pod2.context\`. Specifically flag non-existent ones like \`SelectedWorkListItem\` (singular), \`SelectedSfc\`, etc.
- **M9 — getResourceBundle()**
  - \`this.getResourceBundle()\` doesn't exist on Widget. Either use \`getI18nText()\` via I18nResourceModel, or load \`sap/base/i18n/ResourceBundle\` manually in \`onInit\`.
- **M10 — \`class:\` vs \`addStyleClass()\`**
  - In control settings, \`class: "..."\` is invalid; use \`.addStyleClass("...")\`.
- **M11 — Third-party library AMD bypass**
  - Direct \`jQuery.sap.includeScript\` or \`<script>\` tag injection without AMD shadowing → flag.
- **M13 — Expression vs Formatter for trivial conditions**
  - \`formatter: () => x === 'X'\` for simple equality → suggest expression binding \`{= \${x} === 'X' }\`.
- **M16 — No-data text**
  - Hard-coded \`"No data"\` without state-aware text → suggest dynamic explanation.
- **M18 — GrowingJSONModel page increment**
  - If GrowingJSONModel used: ensure page counter \`#iPage\` is incremented per fetch (not always 0).
- **M19 — Dialogs without \`afterClose: () => destroy()\`**
  - Detect \`new Dialog(\` / \`new PodDialog(\` without destroy in afterClose.
- **M20 — Column / cell index mismatch in TableWidget**
  - For dynamic columns: same index splice for columns and cells.
- **M22 — Multiple subscribe calls vs array form**
  - 3+ separate \`PodContext.subscribe(...)\` calls with the same callback → suggest array form \`PodContext.subscribe([...], cb, this)\`.
- **M23 — Forgetting \`finally\` to clear busy state**
  - \`oView.setBusy(true)\` must always have a matching \`setBusy(false)\` in a \`finally\` block.
- **M24 — Generic error display for expected error codes**
  - \`catch\` blocks that show error message for \`sfc.notInCompletePending\` etc. → suggest specific handling.
- **M26 — EXCLUDE_PROPERTIES vs IGNORE_TABLE_PROPERTIES misuse**
  - Cross-check whether widget-specific (non-Table) properties are in EXCLUDE_PROPERTIES instead of IGNORE_TABLE_PROPERTIES.
- **M27 — Missing \`_syncSelectionsWithPodContext\` for TableWidget**
  - If subscribing to \`SelectedWorkListItems\`, the table must sync (initial + on change) and \`_onSelectionChange\` must preserve existing selections.
- **M28 — Multi-part bindings without null checks**
  - Formatters using multiple parts MUST defensively check each parameter (\`if (!a || !b) return ""\`).
- **M30 — German i18n: SFC vs PSN**
  - In \`i18n_de.properties\`: ANY user-facing \`SFC\` literal in the value (right-hand side of \`=\`) MUST be \`PSN\`. Code identifiers stay \`sfc\`.
  - The reverse: \`i18n.properties\` / \`i18n_en.properties\` / \`i18n_en_US.properties\` should NOT contain \`PSN\`.

### Info (consider — modernization)

- **M25 — \`MessageHistory.toast()\` for important persistent messages** → suggest \`showSuccess\` / \`showError\`.
- **Spreading parent properties in \`getDefaultConfig()\` for Widget/ControlWidget** → never; for TableWidget/LayoutWidget → required.

---

## Phase 4 — API Versions Audit (CRITICAL — explicit user request)

### 4a) SAP DM REST APIs (v1 / v2 / v3)

1. Scan plugin code for any of these patterns:
   - URL strings: \`/dm/<service>/v1/...\`, \`/dm/<service>/v2/...\`, \`/dm/<service>/v3/...\`
   - \`ApiClient.rest.<service>.<method>\` (or any \`RestClient\` usage)
   - Plain \`fetch("...")\` / \`XMLHttpRequest\` to SAP DM URLs
2. Build a set of (service, version-used) tuples.
3. Cross-check against \`list_rest_apis\`. For each service:
   - **Highest version available in specs > version used by plugin** → ⚠️ **Warning** "Upgrade recommended: vX → vY"
   - **Only newer version exists in specs (legacy version no longer documented)** → ❌ **Error** "Used version no longer documented — likely deprecated"
   - **Used version matches latest** → ✅ Info "Up-to-date"
4. For each used endpoint, optionally call \`get_rest_api({ serviceName, summary: true })\` and verify:
   - Endpoint path exists in current spec
   - Request body fields match (no removed/renamed required fields)
   - Response shape unchanged

Reference table (from current MCP server snapshot — confirm via \`list_rest_apis\`):
- batch: v1 + v2 → prefer v2
- inventory: v1 + v2 → prefer v2
- order: v1 + v2 → prefer v2
- processlot: v1 + v2 → prefer v2
- processorder: v1 + v2 → prefer v2
- production: only v2 → v1 calls = ERROR (no longer documented)
- qualityinspection: v1 + v2 → prefer v2
- sfc: v1 + v2 → prefer v2
- staging: v1 + v2 → prefer v2
- tool: v1 + v2 → prefer v2
- plant_resource: only v2
- plant_workcenter: v2 + **v3** → prefer v3
- setpoint: only v3
- document (sapfnd): only v2
- (always re-confirm against \`list_rest_apis\` — the catalog evolves)

### 4b) POD2 Public / Internal APIs

1. Find every \`ApiClient.<namespace>.<method>(...)\` call in the plugin.
2. For each call:
   - \`get_api_doc({ className: "sap.dm.dme.pod2.api.<namespace>.<ClientClass>" })\` (e.g. \`OrderPublicApiClient\`)
   - Verify the method still exists with the same signature.
   - Flag any \`@deprecated\` markers.
3. **Internal APIs** (\`ApiClient.internal.<...>\`): severity depends on whether a public alternative exists.
   - **NOT a finding** when NO public alternative exists. Canonical case: \`ApiClient.internal.processengine.start(...)\` is the REQUIRED pattern for PPD execution (see \`get_pod2_guidelines\` Section 3, "Option 1: Production Process via ApiClient") and is used by every reference example. Do NOT flag as a warning. Same treatment for other public-less internals (\`internal.plant.isUserAssignedToWorkCenter\`, \`internal.oee.*\`, \`internal.qualityInspection.*\`, \`internal.workinstruction.*\`).
   - **Flag as ⚠️ Warning** ONLY when a matching Public API exists (verify via \`get_api_doc({ className: "sap.dm.dme.pod2.api.<ns>.<Ns>PublicApiClient" })\`; e.g. \`internal.sfc.getSfc\` has public \`sfc.SfcPublicApiClient.getSfc\`). Wording: "Internal API — public alternative available at \`ApiClient.<ns>.<method>(...)\`. Migrate."
   - When in doubt (no PublicApiClient class in the namespace), default to NOT-a-finding.

### 4
    },
  });MDO / OData (Extractor Service)

1. Find:
   - \`ODataV2Client\`, \`ODataV4Client\` imports/usages
   - URL patterns \`/odata/v2/...\`, \`/odata/v4/...\`
   - References to MDO entities (Order, SFC, Material, Routing, BOM, etc.)
2. **OData V2 usage** → ⚠️ **Warning** "OData V2 is legacy. The MDO Extractor Service uses V4. Migrate when possible."
3. If MDO is used: cross-check entity names against \`get_pattern_doc({ name: "mdo-extractor-reference" })\`.

### 4d) ModelPath / PodContext consistency

1. Extract every \`ModelPath.<X>\` and \`PodContext.<method>(...)\` from the plugin.
2. Cross-check against:
   - \`get_api_doc({ className: "sap.dm.dme.pod2.context.PodContext" })\`
   - \`get_api_doc({ className: "sap.dm.dme.pod2.context" })\`
3. Flag:
   - **Non-existent ModelPath constants** (e.g. \`SelectedWorkListItem\` singular, \`SelectedSfc\`) → ❌ Error
   - **Non-existent PodContext methods** → ❌ Error
   - **Deprecated methods** (if \`@deprecated\` in the API doc) → ⚠️ Warning

---

## Phase 5 — Write \`VALIDATION-REPORT.md\` to the Project Root

Create the file \`VALIDATION-REPORT.md\` in the working-directory root with this exact structure:

\`\`\`markdown
# POD 2.0 Plugin Validation Report

**Plugin:** <name from extension.json or directory>
**Date:** <ISO 8601 date, e.g. 2026-06-10>
**Validated against:** pod2-mcp-server v<version from list_capabilities>
**Scope:** Full validation (common-mistakes + API versions + ModelPath/PodContext)

## Summary

| Severity | Count |
|----------|------:|
| ❌ Errors    | N |
| ⚠️ Warnings  | N |
| ℹ️ Info      | N |
| ✅ Passed    | N |

> **Verdict:** <one of: "Production-ready ✅" / "Needs fixes ⚠️" / "Broken — must-fix items present ❌">

## 1. Common Mistakes

### ❌ Errors

#### M<N> — <short title>
- **File:** \`<path>:<line>\`
- **Found:** <code snippet or value>
- **Expected:** <what it should be>
- **Why it matters:** <one sentence>
- **Doc:** [common-mistakes.md#mistake-<N>](docu/common-mistakes.md)
- **Auto-fixable:** yes / no
- **Fix:**
  \\\`\\\`\\\`<lang>
  <before → after>
  \\\`\\\`\\\`

(repeat per finding)

### ⚠️ Warnings
(same structure)

### ℹ️ Info
(same structure)

## 2. SAP DM REST API Versions

| Service | Version used | Latest available | Status | Notes |
|---|---|---|---|---|
| order | v1 | v2 | ⚠️ Upgrade recommended | Migrate to /dm/order/v2 |
| sfc | v2 | v2 | ✅ Up-to-date | — |
| production | v1 | v2 (only) | ❌ Likely deprecated | v1 no longer documented |

## 3. POD2 Public / Internal API Usage

| Call | Type | Status | Suggested action |
|---|---|---|---|
| ApiClient.order.getOrder | Public | ✅ Current | — |
| ApiClient.internal.processengine.start | Internal | ⚠️ Internal API | No public equivalent — accept risk |
| ApiClient.internal.sfc.getSfc | Internal | ⚠️ Internal API | Public alternative: \`ApiClient.sfc.getSfc\` — migrate |

## 4. MDO / OData Usage

(omit section if no OData/MDO calls found)

| Client | Status | Notes |
|---|---|---|
| ODataV2Client | ⚠️ Legacy | Migrate to V4 (MDO Extractor) when possible |
| ODataV4Client (MDO) | ✅ Current | — |

## 5. ModelPath / PodContext Consistency

- ✅ All ModelPath constants resolved against current API
- ❌ \`ModelPath.SelectedWorkListItem\` — does NOT exist (typo? Use plural \`SelectedWorkListItems\`)
- ⚠️ \`PodContext.getCurrentSfc()\` — deprecated (see API doc) — use \`PodContext.getSelectedWorkListItems()[0].sfc\`

## 6. Auto-fixable items

The following items can be patched automatically. Review each and ask the agent to apply them:

- [ ] **M3** — Update PodContext import path: \`sap/dm/dme/pod2/model/\` → \`sap/dm/dme/pod2/context/\` (\`widget/MyWidget.js:3\`, \`action/MyAction.js:5\`)
- [ ] **M32** — Add \`widget.\` prefix to displayName/description in i18n bundles (4 files)
- [ ] **M30** — Translate "SFC" → "PSN" in 3 keys of \`i18n_de.properties\`
- [ ] **API-v** — Migrate REST URL \`/dm/order/v1/orders\` → \`/dm/order/v2/orders\` (\`action/MyAction.js:42\`)

To apply: ask the agent **"apply all auto-fixable items from VALIDATION-REPORT.md"**. The agent will read this file, patch each item, and report back.

## 7. Notes

- This file is intentionally placed at the project root for visibility.
- **Before zipping for SAP DM upload**: delete \`VALIDATION-REPORT.md\` (or add it to the zip exclusion list) — SAP DM does not need it.
- Re-run validation after fixes: \`/mcp:pod2-mcp-server:validate_project\`
\`\`\`

## Phase 6 — Chat Summary

After writing the report, post a short summary in chat (do NOT repeat the full report):

\`\`\`
✅ Validation complete — wrote VALIDATION-REPORT.md

📊 <verdict emoji + verdict>
- ❌ Errors:   <N>
- ⚠️ Warnings: <N>
- ℹ️ Info:     <N>
- ✅ Passed:   <N>

🔥 Top must-fix:
1. <one-line summary of #1 error>
2. <one-line summary of #2 error>
3. <one-line summary of #3 error>

🛠 <K> auto-fixable items detected. Say "apply all auto-fixable items" to patch them.

📄 Full report: ./VALIDATION-REPORT.md
\`\`\`

---

## Important Conventions

- **Only flag actually broken / risky things.** Don't pad the report with non-issues.
- **Prefer code snippets** over prose. Show before/after for each fix.
- **Cite the source** for every finding (Doc reference + line number).
- **\`Auto-fixable\` is a strict criterion**: only mark TRUE when the fix is mechanical (regex/text replacement) AND there is no semantic ambiguity. Anything that requires judgment → "no".
- **Preserve developer comments and custom code style** — never propose drive-by formatting changes.
- **Don't run any actual fixes during validation.** This prompt only reports.

## When to abort

- No \`extension.json\` in working directory → abort, message: "Not a POD 2.0 plugin project (extension.json missing). Run this in the plugin folder."
- \`extension.json\` is invalid JSON → write a single-error report and stop.
`;
    },
  });

}
