# extension.json – Complete Schema Reference

## Overview

The `extension.json` file is the **plugin manifest** for POD 2.0 extensions. It registers all widgets and actions that should be available in the POD Designer (Manage PODs 2.0 app).

### Key Rules
- **MUST** be located at the **ZIP root** (not in a subdirectory)
- **MUST** be valid JSON
- Namespaces **MUST NOT** start with `sap.` or `sap/` (reserved for SAP internal)
- Each widget/action entry maps a unique `type` identifier to a `modulePath` (file location)

---

## JSON Schema (Formal)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "POD 2.0 Extension Manifest",
  "description": "Registers widgets and actions for the POD Designer",
  "type": "object",
  "properties": {
    "widgets": {
      "type": "array",
      "description": "List of widget plugins to register",
      "items": {
        "type": "object",
        "required": ["modulePath", "type"],
        "properties": {
          "modulePath": {
            "type": "string",
            "description": "Relative path to the widget module (slash-separated, without .js extension)",
            "pattern": "^[a-zA-Z][a-zA-Z0-9_]*/.*$",
            "examples": ["customer/processlot/widget/ProcessLotWidget"]
          },
          "type": {
            "type": "string",
            "description": "Fully qualified widget type identifier (dot-separated)",
            "pattern": "^[a-zA-Z][a-zA-Z0-9_]*(\\.[a-zA-Z][a-zA-Z0-9_]*)*$",
            "examples": ["customer.processlot.widget.ProcessLotWidget"]
          }
        },
        "additionalProperties": false
      }
    },
    "actions": {
      "type": "array",
      "description": "List of action plugins to register",
      "items": {
        "type": "object",
        "required": ["modulePath", "type"],
        "properties": {
          "modulePath": {
            "type": "string",
            "description": "Relative path to the action module (slash-separated, without .js extension)",
            "pattern": "^[a-zA-Z][a-zA-Z0-9_]*/.*$",
            "examples": ["customer/processlot/action/CreateProcessLotAction"]
          },
          "type": {
            "type": "string",
            "description": "Fully qualified action type identifier (dot-separated)",
            "pattern": "^[a-zA-Z][a-zA-Z0-9_]*(\\.[a-zA-Z][a-zA-Z0-9_]*)*$",
            "examples": ["customer.processlot.action.CreateProcessLotAction"]
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

---

## Field Reference

### Top-Level Structure

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `widgets` | Array | No* | Widget plugins to register in POD Designer |
| `actions` | Array | No* | Action plugins to register in POD Designer |

*At least one of `widgets` or `actions` must be present (otherwise the extension does nothing).

---

### Widget Entry

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `modulePath` | string | ✓ | Path to the widget JS module, using `/` separators, **without** `.js` extension |
| `type` | string | ✓ | Unique type identifier using `.` separators – used to reference the widget |

### Action Entry

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `modulePath` | string | ✓ | Path to the action JS module, using `/` separators, **without** `.js` extension |
| `type` | string | ✓ | Unique type identifier using `.` separators – used to reference the action |

---

## Naming Conventions

### modulePath (slash notation = file path)
```
{namespace}/{subpackage}/{category}/{ClassName}
```

| Part | Convention | Example |
|------|-----------|---------|
| namespace | company or project prefix (lowercase) | `customer`, `myCompany` |
| subpackage | plugin/feature name (lowercase) | `processlot`, `split`, `weighing` |
| category | `widget`, `action`, `context` | `widget`, `action` |
| ClassName | PascalCase class name | `ProcessLotWidget`, `CreateProcessLotAction` |

**Examples:**
- `customer/processlot/widget/ProcessLotWidget`
- `customer/processlot/action/CreateProcessLotAction`
- `acme/weighing/widget/WeighingWidget`
- `acme/weighing/action/WeighingValidationAction`

### type (dot notation = unique identifier)
```
{namespace}.{subpackage}.{category}.{ClassName}
```

**Rule:** The `type` is the `modulePath` with slashes replaced by dots.

```
modulePath: "customer/processlot/widget/ProcessLotWidget"
type:       "customer.processlot.widget.ProcessLotWidget"
```

### ⚠️ Critical Rules
1. **No `sap.` prefix** – namespaces starting with `sap.` or `sap/` are reserved
2. **No `.js` extension** in modulePath
3. **Exact match required** – the modulePath must correspond to an actual `.js` file in the ZIP
4. **Type must be globally unique** – across all extensions installed in the tenant

---

## Examples

### Minimal Extension (1 Widget only)

```json
{
    "widgets": [
        {
            "modulePath": "myCompany/myPlugin/widget/MyWidget",
            "type": "myCompany.myPlugin.widget.MyWidget"
        }
    ]
}
```

### Standard Extension (Widget + Validation + Execution)

This is the **recommended Best Practice pattern** (Phil-style):

```json
{
    "widgets": [
        {
            "modulePath": "customer/split/widget/SplitWidget",
            "type": "customer.split.widget.SplitWidget"
        }
    ],
    "actions": [
        {
            "modulePath": "customer/split/action/SplitValidationAction",
            "type": "customer.split.action.SplitValidationAction"
        },
        {
            "modulePath": "customer/split/action/SplitExecutionAction",
            "type": "customer.split.action.SplitExecutionAction"
        }
    ]
}
```

### Complex Extension (Multiple Widgets + Multiple Actions)

```json
{
    "widgets": [
        {
            "modulePath": "customer/processlot/widget/ProcessLotWidget",
            "type": "customer.processlot.widget.ProcessLotWidget"
        }
    ],
    "actions": [
        {
            "modulePath": "customer/processlot/action/CreateProcessLotAction",
            "type": "customer.processlot.action.CreateProcessLotAction"
        },
        {
            "modulePath": "customer/processlot/action/DeleteProcessLotAction",
            "type": "customer.processlot.action.DeleteProcessLotAction"
        },
        {
            "modulePath": "customer/processlot/action/AddMembersAction",
            "type": "customer.processlot.action.AddMembersAction"
        },
        {
            "modulePath": "customer/processlot/action/RemoveMembersAction",
            "type": "customer.processlot.action.RemoveMembersAction"
        }
    ]
}
```

---

## Corresponding File Structure

> ⚠️ **Physical layout vs. logical `modulePath`**
> The `modulePath` is a **UI5 logical module name**, not a physical directory path. The POD framework resolves it via UI5's module loader — **not by directory traversal**. The recommended convention for customer extensions is therefore a **flat layout**: place `widget/`, `action/`, `context/`, `i18n/` and `extension.json` **directly at the ZIP root** (= working directory = project root). Do NOT create a wrapper folder named after the plugin or namespace.

### Recommended (flat) layout

The `modulePath` values are logical module names; the physical files live in flat top-level folders:

```
MyExtension.zip
├── extension.json                              ← MUST be at ZIP root
├── README.md                                   ← Recommended
├── widget/
│   └── ProcessLotWidget.js                     ← modulePath: "customer.processlot.widget.ProcessLotWidget"
│                                                  (or "customer/processlot/widget/ProcessLotWidget" – same thing)
├── action/
│   ├── CreateProcessLotAction.js
│   ├── DeleteProcessLotAction.js
│   ├── AddMembersAction.js
│   └── RemoveMembersAction.js
├── context/
│   └── ProcessLotContext.js                    ← Not in extension.json (internal helper)
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
```

**Key points**
- `extension.json` and the folders `widget/` / `action/` / `context/` / `i18n/` are **directly at ZIP root**.
- There is **no** `customer/processlot/…` wrapper folder in the physical ZIP.
- The `modulePath` in `extension.json` is a UI5 logical name and works **regardless** of where the file physically sits; the POD runtime maps it to the actual `.js` file via UI5's module system.
- This matches the layout used by all customer reference examples (e.g. `Customer.Coating`, `Customer.HelloWorld`, `Customer.TableView`).

### What goes INTO extension.json:
- ✅ Widgets (UI components shown in POD Designer)
- ✅ Actions (logic executed via button/event configuration in POD Designer)

### What does NOT go into extension.json:
- ❌ Context/Singleton classes (internal helpers)
- ❌ i18n files
- ❌ Utility classes
- ❌ README.md
- ❌ CSS files

---

## How the POD Designer Uses extension.json

1. **Upload**: Extension ZIP uploaded via "Manage Extensions" in SAP DM
2. **Registration**: System reads `extension.json` and registers types
3. **Discovery**: In POD Designer (Manage PODs 2.0):
   - Widgets appear in the "Widget Palette" under their `getCategory()` group
   - Actions appear in the "Action Configuration" dialogs
4. **Display Names**: Come from the widget/action's static `getDisplayName()` method (i18n)
5. **Icons**: Come from the widget/action's static `getIcon()` method

---

## Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| extension.json not at ZIP root | Extension uploads but widgets/actions don't appear | Ensure file is at top level, not inside a subfolder |
| `.js` extension in modulePath | Module load error at runtime | Remove `.js` – use `"widget/MyWidget"` not `"widget/MyWidget.js"` |
| Slash vs. dot mismatch | Type not found errors | `modulePath` uses `/`, `type` uses `.` – they must correspond |
| Starting with `sap.` | Rejected or conflicts with framework | Use your own namespace prefix |
| Missing file in ZIP | Runtime error when widget/action is used | Ensure every modulePath has a corresponding `.js` file |
| Typo in class name | Widget loads but shows blank/error | modulePath filename must match the class exported by `sap.ui.define` |
| Duplicate type across extensions | Unpredictable behavior, one overrides the other | Ensure globally unique types per tenant |
| Non-ASCII characters in paths | May work locally but fail on deployment | Stick to `[a-zA-Z0-9_/.]` characters |

---

## Validation Checklist

Before uploading an extension, verify:

- [ ] `extension.json` is valid JSON (no trailing commas!)
- [ ] File is at ZIP root level
- [ ] Every `modulePath` has a corresponding `.js` file in the ZIP
- [ ] Every `type` is the `modulePath` with `/` replaced by `.`
- [ ] No `sap.` or `sap/` prefix in any type or modulePath
- [ ] All class names match between filename and the class exported in `sap.ui.define`
- [ ] No `.js` extension in any modulePath
- [ ] Types are unique (not already used by another extension in the tenant)