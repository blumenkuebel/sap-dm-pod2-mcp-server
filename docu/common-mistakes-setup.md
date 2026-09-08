# Common Mistakes — 🚀 Setup & File Generation

> Part of the [Common Mistakes catalog](common-mistakes.md). Full index and preamble in the main file.

---

## Mistake #0: Wrong Namespace in extension.json

**Error**: Module path doesn't match what the POD framework expects, causing "file not found" errors on upload

**This is a critical mistake!** The namespace is defined in `extension.json` (`modulePath` and `type` fields). It does NOT need to match the working directory/folder name. The POD framework handles the mapping between the namespace and the actual file locations in the ZIP.

### ❌ WRONG - Deriving namespace from folder name
```bash
# DON'T do this - folder name is irrelevant for namespace!
$ basename $(pwd)
Customer.Coating  # ← This is NOT necessarily your namespace!
```

```json
// ❌ WRONG - Using folder name as namespace
{
  "widgets": [{
    "modulePath": "Customer.Coating/widget/CoatingWidget",
    "type": "Customer.Coating.widget.CoatingWidget"
  }]
}
```

### ✅ CORRECT - Use the namespace defined in extension.json consistently

```json
// extension.json - Namespace is defined here, independent of folder name
// Example: Folder is "Customer.Coating" but namespace is "customer/custom/plugins/coating"
{
  "widgets": [{
    "modulePath": "customer/custom/plugins/coating/widget/CoatingWidget",
    "type": "customer.custom.plugins.coating.widget.CoatingWidget"
  }],
  "actions": [{
    "modulePath": "customer/custom/plugins/coating/action/CoatingValidationAction",
    "type": "customer.custom.plugins.coating.action.CoatingValidationAction"
  }]
}
```

### Why This Matters:

1. **extension.json = single source of truth** - The namespace is what you define in `modulePath`/`type`
2. **Folder name ≠ namespace** - The folder can be named anything (e.g., `Customer.Coating`) while the namespace is different (e.g., `customer.custom.plugins.coating`)
3. **POD framework handles mapping** - When the ZIP is uploaded, SAP DM uses the extension.json to resolve modules
4. **All imports must use the extension.json namespace** - sap.ui.define paths must match the `modulePath` prefix

### The Rule: Define namespace in extension.json, use it consistently everywhere!

**Correct Pattern:**
```javascript
// In widget file - import path matches extension.json namespace
sap.ui.define([
    "customer/custom/plugins/coating/context/CoatingContext",  // ✅ Matches extension.json
    "sap/dm/dme/pod2/widget/Widget",
    // ...
], (CoatingContext, Widget) => {
    // ...
});
```

```javascript
// I18nResourceModel bundleName matches extension.json namespace (dots instead of slashes)
static #oI18nModel = new I18nResourceModel({
    bundleName: "customer.custom.plugins.coating.i18n.i18n"  // ✅ Dots version of namespace
});
```

**Never do:**
- ❌ Derive namespace from `basename $(pwd)` or folder structure
- ❌ Use different namespaces in extension.json vs. import paths
- ❌ Use the folder name in `modulePath` if it differs from your intended namespace

**Always do:**
- ✅ Define namespace in extension.json first
- ✅ Use that same namespace in all `sap.ui.define` imports
- ✅ Use the dot-notation version for `bundleName` in I18nResourceModel
- ✅ Keep `modulePath` (slashes) and `type` (dots) consistent

### Prevention:
1. Decide on namespace FIRST (e.g., from the POD2_PLUGIN_EXAMPLE.md template)
2. Write extension.json with that namespace
3. Use the same namespace in ALL file imports and bundleName references
4. The folder/directory name can be anything - it doesn't matter

---

---

## Mistake #1: Missing onExit() After PodContext.subscribe()

> **Stub — merged into [Mistake #14](common-mistakes-config.md#mistake-14-missing-onexit-unsubscribe--memory-leak) (canonical treatment).** Load `common-mistakes-config` for the full pattern (subscribe/unsubscribe pairing, `_activeSubs` bookkeeping, MyView cleanup, validator hook). The one-line summary: every `PodContext.subscribe(...)` in `onInit()` MUST have a matching `PodContext.unsubscribe(...)` in `onExit()` using the exact same callback reference — otherwise callbacks fire on destroyed widgets and memory grows over time.

```javascript
// ❌ WRONG — no onExit
onInit() {
    PodContext.subscribe(ModelPath.WorkInstructions, this._updateText, this);
}

// ✅ CORRECT
onInit() {
    PodContext.subscribe(ModelPath.WorkInstructions, this._updateText, this);
}
onExit() {
    super.onExit();
    PodContext.unsubscribe(ModelPath.WorkInstructions, this._updateText, this);
}
```

See [Mistake #14](common-mistakes-config.md#mistake-14-missing-onexit-unsubscribe--memory-leak) for the full rule, the `_activeSubs` counter pattern, and the multi-subscribe edge cases.

---

---

## Mistake #1B: Creating Namespace Folders During Generation

**Error**: Files in wrong location (`mycompany/extension.json` instead of root)

**Rule**: *Wrapper* folders are forbidden — the working directory itself IS where the plugin lives. Its physical folder *name* is irrelevant to the namespace (see [Mistake #0](#mistake-0-wrong-namespace-in-extensionjson)), but nothing may nest **inside** the working directory as a wrapper `<name>/` folder. All plugin files (`extension.json`, `widget/`, `action/`, `context/`, `i18n/`, `README.md`) go directly at the root of the working directory.

Read together with #0: the folder-name is a free-form identifier used for git/ZIP filenames; the namespace lives in `extension.json` (`modulePath` + `type`). The bug this mistake catches is a different one — creating an extra directory *inside* the working directory that mirrors the namespace path (e.g. `<cwd>/mycompany/extension.json`).

| Wrong | Correct |
|-------|---------|
| `Write("mycompany/extension.json")` | `Write("extension.json")` |
| `myproject/myproject/extension.json` | `myproject/extension.json` |

**Why**: User is already IN the namespace folder. Creating nested folders breaks module resolution.

---

---

## Mistake #2: Binding Syntax in WidgetProperty Metadata

**Error**: Type mismatch when using `{i18n>key}` in property definitions

**Rule**: Use `getI18nText()` method, NOT binding syntax `{i18n>key}` in WidgetProperty.

| Wrong | Correct |
|-------|---------|
| `displayName: "{i18n>prop.name}"` | `displayName: this.getI18nText("prop.name")` |
| Binding in metadata definition | Method call for i18n text |

**Why**: WidgetProperty is metadata, not UI5 binding context. Binding syntax causes parser confusion.

---

---

## Mistake #15: Not Destroying Dynamic Dialogs/Popovers

> **Stub — merged into [Mistake #19](common-mistakes-lifecycle.md#mistake-19-not-destroying-dialogs-in-afterclose).** Load `common-mistakes-lifecycle` for the canonical treatment (generic `sap.m.Dialog`, `sap.m.Popover`, and `PodDialog` all covered, plus the `Fragment.load` corollary).

```javascript
// ❌ WRONG
const oDialog = new Dialog({ /* ... */ });
oDialog.open();  // Never destroyed!

// ✅ CORRECT
const oDialog = new Dialog({
    afterClose: () => { oDialog.destroy(); }
});
oDialog.open();
```

---

---

## Mistake #16: Generic No-Data Text

**Problem**: "No data" doesn't explain WHY

**Fix**: Update based on PodContext state

```javascript
if (!PodContext.getFilterResources()?.length) {
    oTable.setNoDataText(this.getI18nText("error.noResource"));
}
```

---

---
