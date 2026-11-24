// AUTO-SEEDED single source of truth for the POD2 mistake/rule catalog.
// Seeded once from docu/ (headings, Phase 3 lists, downgrade lists) + a provenance audit.
// After seeding this file is HAND-MAINTAINED; test/rules-registry.test.js guards it against
// drift with the docs. Regenerate the agent-facing table with: npm run generate-rules-registry
//
// Provenance:
//   verified   — grounded in a citable SAP source (help.sap.com / pod2-api-specs / REST specs / UI5 API)
//   inferred   — derived from the project reference examples, NOT yet SAP-doc confirmed (audit target)
//   unverified — no cited source yet; cleanup backlog (the M6/M21 risk class)

export type Severity = "error" | "warning" | "info";
export type ProvenanceStatus = "verified" | "inferred" | "unverified";
export type AuditList = "errors" | "warnings" | "info" | "html5" | "none";
export type RuleCategory = "setup" | "lifecycle" | "imports" | "ui" | "config" | "data" | "i18n" | "html5-migration";

// --- Fact verification (Tier A = machine-checkable against the bundled specs) ---
export type SpecCheck =
  | { kind: "ui5SymbolExists"; symbol: string; present: boolean }
  | { kind: "ui5AggregationType"; symbol: string; aggregation: string; type: string }
  | { kind: "ui5PropertyExists"; symbol: string; property: string; present: boolean }
  | { kind: "ui5EnumMember"; enumSymbol: string; member: string; present: boolean }
  | { kind: "pod2ClassExists"; fqn: string; present: boolean }
  | { kind: "restEndpointExists"; service: string; path: string; method: string; present: boolean };

export type VerificationMethod =
  | "ui5-api"
  | "pod2-api"
  | "rest-api" // Tier A — checks[] are evaluated by scripts/verify-rules-core.mjs
  | "behavior"
  | "convention"
  | "manual"
  | "framework-source"; // Tier B — read-only audit of proprietary POD2 framework source (never committed)

export interface Verification {
  method: VerificationMethod;
  /** Tier A only: machine-checkable predicates against the bundled specs. */
  checks?: SpecCheck[];
  /** The spec snapshot the facts were authored/confirmed against. */
  authoredAgainst?: {
    dmRelease?: string;
    ui5Version?: string;
    /** framework-source: human-readable identifier of the framework snapshot (e.g. "POD2 2208 internal"). */
    frameworkRef?: string;
  };
  note?: string;
}

export type LifecycleStatus = "current" | "obsolete" | "changed" | "unknown";
export interface Lifecycle {
  status: LifecycleStatus;
  sinceRelease?: string;
  note?: string;
}

export interface Rule {
  /** Canonical reference token, e.g. "M6", "HTML5-FETCH". */
  id: string;
  /** Cross-reference aliases, e.g. ["Cat 29"]. */
  aliases?: string[];
  title: string;
  category: RuleCategory;
  /** GitHub heading slug of the owning `## Mistake` entry; null for codes with no heading (HTML5-*). */
  anchor: string | null;
  /** True severity (independent of which Phase 3 list the code is swept under). */
  severity: Severity;
  /** Which Phase 3 severity list enumerates this code today ("none" = checked in Phase 3b/3d / Prime Directive). */
  auditList: AuditList;
  /** False = must-fix, cannot be downgraded by suppression markers. */
  downgradable: boolean;
  /** One-line justification against the Classification Criteria. */
  severityReason: string;
  provenance: { status: ProvenanceStatus; source?: string };
  /** Tier-A fact verification (machine-checkable) or a Tier-B method tag. */
  verification?: Verification;
  /** Version lifecycle — set when a rule becomes obsolete/changed in a newer release. */
  lifecycle?: Lifecycle;
  status?: "active" | "retired";
}

export const RULES: Rule[] = [
  {
    id: "M0",
    title: "Wrong Namespace in extension.json",
    category: "setup",
    anchor: "mistake-0-wrong-namespace-in-extensionjson",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "SAP Help Portal — Packaging and Uploading Custom Plugins (POD 2.0): https://help.sap.com/docs/sap-digital-manufacturing/application-help-for-manage-pods-2-0/packaging-and-uploading-custom-plugins",
    },
    verification: {
      method: "manual",
      note: "Official SAP example shows modulePath (slash-notation) and type (dot-notation) both using the same namespace prefix, independent of the working directory name. Confirms the M0 rule that the namespace is defined in extension.json and must be used consistently.",
    },
  },
  {
    id: "M1",
    title: "Missing onExit() After PodContext.subscribe()",
    category: "setup",
    anchor: "mistake-1-missing-onexit-after-podcontextsubscribe",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js#Widget.destroy",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Widget.destroy() calls PodContext.unsubscribeAll(this) before onExit(). Manual PodContext.unsubscribe() in onExit() is redundant. onExit() is still needed for timers, dialogs, and other non-subscription cleanup.",
    },
  },
  {
    id: "M1B",
    title: "Creating Namespace Folders During Generation",
    category: "setup",
    anchor: "mistake-1b-creating-namespace-folders-during-generation",
    severity: "warning",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (warning).",
    provenance: {
      status: "verified",
      source: "SAP Help Portal — Packaging and Uploading Custom Plugins (POD 2.0): https://help.sap.com/docs/sap-digital-manufacturing/application-help-for-manage-pods-2-0/packaging-and-uploading-custom-plugins",
    },
    verification: {
      method: "manual",
      note: "SAP doc states: 'Make sure to compress your extension so that the extension.json file is at the root.' This requires all extension files to sit at the ZIP root — a wrapper subfolder nesting extension.json breaks this requirement.",
    },
  },
  {
    id: "M2",
    title: "Binding Syntax in WidgetProperty Metadata",
    category: "setup",
    anchor: "mistake-2-binding-syntax-in-widgetproperty-metadata",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: propertyeditor/PropertyEditor.js#PropertyEditor._createLabel + propertyeditor/Property.js#Property.constructor",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "displayName flows: WidgetProperty(config) → Property.constructor → propertyEditor._createLabel(displayName) → new sap.m.Label({ text: displayName }). The Label constructor receives the raw string — no binding expression expansion occurs. Passing '{i18n>key}' renders the literal string as the label text. The correct pattern is to resolve the key first via getI18nText() and pass the resolved string as displayName.",
    },
  },
  {
    id: "M3",
    title: "Wrong PodContext Import Path",
    category: "lifecycle",
    anchor: "mistake-3-wrong-podcontext-import-path---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (pod2-api); see verify-rules" },
    verification: {
      method: "pod2-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [{ kind: "pod2ClassExists", fqn: "sap.dm.dme.pod2.context.PodContext", present: true }],
    },
  },
  {
    id: "M4",
    title: "Passing Default Value to StringPropertyEditor",
    category: "lifecycle",
    anchor: "mistake-4-passing-default-value-to-stringpropertyeditor---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: propertyeditor/StringPropertyEditor.js#StringPropertyEditor.constructor",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "StringPropertyEditor(accessor, propName, options): 3rd arg is CustomInput init-settings object or a string interpreted as InputType. It is NOT a default value. The displayed value always comes from _getPropertyValue() → widget.getPropertyValue(). Passing a path string as 3rd arg silently sets input type to that string.",
    },
  },
  {
    id: "M5",
    title: "Wrong Callback Parameter Order",
    category: "lifecycle",
    anchor: "mistake-5-wrong-callback-parameter-order---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/PodContext.js#PodContext.#F",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Callback is called as: t.callback.call(t.bindContext, i.get(e), e) for single path — value is first, path is second. Multi-path: callback(valuesMap, changedPathsMap).",
    },
  },
  {
    id: "M6",
    title: "Missing View ID in _createView()",
    category: "imports",
    anchor: "mistake-6-missing-view-id-in-_createview---",
    severity: "error",
    auditList: "errors",
    downgradable: true,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source:
        "SAP official Widget sample uses this.getId(); POD sets widget id from config before _createView() — common-mistakes-imports.md",
    },
  },
  {
    id: "M7",
    title: "No Defensive Type Checking",
    category: "imports",
    anchor: "mistake-7-no-defensive-type-checking---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/PodContext.js#PodContext.#F + PodContext.getWhenAvailable + PodContext.clearWorkList",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "PodContext.#F() (callback dispatcher) passes the raw model value to callbacks: t.callback.call(t.bindContext, modelProperties.get(path), path). The model does not initialize all paths — uninitialized paths return undefined. clearWorkList() explicitly sets SelectedWorkListItems to []. getWhenAvailable() checks e!==undefined&&e!==null before resolving, confirming the framework treats undefined/null as normal model states. Callbacks must therefore handle undefined, null, and [] defensively.",
    },
  },
  {
    id: "M8",
    title: "Invalid extension.json Structure",
    category: "imports",
    anchor: "mistake-8-invalid-extensionjson-structure---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAP Help Portal — Packaging and Uploading Custom Plugins (POD 2.0): https://help.sap.com/docs/sap-digital-manufacturing/application-help-for-manage-pods-2-0/packaging-and-uploading-custom-plugins",
    },
    verification: {
      method: "manual",
      note: "SAP doc defines the valid extension.json schema: top-level 'widgets' and 'actions' arrays (either may be omitted). Each widget entry requires 'modulePath' and 'type'; optional fields are 'name', 'description', 'supportsProductionProcess' (boolean, default false). The type value should use dot-notation matching the slash-notation modulePath (recommended, not required).",
    },
  },
  {
    id: "M9",
    title: "Spreading Parent Properties in getDefaultConfig()",
    category: "imports",
    anchor: "mistake-9-spreading-parent-properties-in-getdefaultconfig---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAP Help Portal — Add Widget Properties (help.sap.com/docs/.../8dbdab1343184bf19ed36cf26f6aaf08.html)",
    },
  },
  {
    id: "M10",
    title: 'Using "class" Instead of "styleClass"',
    category: "ui",
    anchor: "mistake-10-using-class-instead-of-styleclass---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 API — sap.m.VBox (no 'class' property) + sap.ui.core.Control.addStyleClass()",
    },
    verification: {
      method: "ui5-api",
      checks: [
        { kind: "ui5PropertyExists", symbol: "sap.m.VBox", property: "class", present: false },
        { kind: "ui5SymbolExists", symbol: "sap.ui.core.Control", present: true },
      ],
      authoredAgainst: { ui5Version: "1.151.0" },
      note: "sap.m.VBox has no 'class' property — passing {class: '...'} in the constructor triggers UI5 ManagedObject assertion 'encountered unknown setting'. The correct API is addStyleClass() inherited from sap.ui.core.Control.",
    },
  },
  {
    id: "M11",
    title: "Third-Party Library Loading Fails",
    category: "imports",
    anchor: "mistake-11-third-party-library-loading-fails---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 runtime: sap-ui-core.js (UI5 1.148.9) — define.amd management + bundled UMD libraries (URI.js, jQuery) using AMD detection",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "sap-ui-core.js exposes define.amd and explicitly manages 'suppressing define.amd per module'. Bundled third-party libraries (URI.js, jQuery.mobile, jQuery) all check typeof define===\"function\"&&define.amd and call define() instead of setting globals. SAPUI5 solves this internally via per-module suppression. Extensions must use the new Function(\"define\",\"exports\",\"module\", src) trick to shadow define so UMD libraries fall through to global export.",
    },
  },
  {
    id: "M12",
    title: "Wrong PlacementType Import",
    category: "ui",
    anchor: "mistake-12-wrong-placementtype-import---",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [{ kind: "ui5SymbolExists", symbol: "sap.m.PlacementType", present: true }],
    },
  },
  {
    id: "M13",
    title: "Wrong ModelPath Constants",
    category: "ui",
    anchor: "mistake-13-wrong-modelpath-constants---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/ModelPath.js#ModelPath",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Full ModelPath enum confirmed (~36 constants). SelectedWorkListItem (singular) is absent; correct is SelectedWorkListItems (plural). LastSelectedWorkListItem, SelectedOperationActivities etc. all confirmed.",
    },
  },
  {
    id: "M14",
    title: "Missing onExit() — Timer/Dialog/Listener Cleanup",
    category: "config",
    anchor: "mistake-14-missing-onexit--timerdialoglistener-cleanup-",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js#Widget.destroy + context/PodContext.js#PodContext.unsubscribeAll",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Widget.destroy() calls PodContext.unsubscribeAll(this) BEFORE onExit(). unsubscribeAll iterates all subscription lists and removes entries where bindContext === widget. Manual PodContext.unsubscribe() in onExit() is therefore redundant for the standard pattern (bindContext === this). onExit() is still essential for timers, dialogs, models, and other non-subscription cleanup.",
    },
    lifecycle: {
      status: "changed",
      note: "Original claim ('memory leak from missing manual unsubscribe') is wrong for this framework version. Framework auto-cleans PodContext subscriptions. Prose updated to reflect auto-cleanup and redirect focus to remaining onExit() duties.",
    },
  },
  {
    id: "M15",
    title: "Not Destroying Dynamic Dialogs/Popovers",
    category: "setup",
    anchor: "mistake-15-not-destroying-dynamic-dialogspopovers",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js#Widget.destroy",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Widget.destroy() only destroys child widgets in aggregations and the widget's own view. Dynamically created dialogs and popovers (attached to UI5 Core popup layer, not to the widget view) are NOT auto-destroyed. They must be destroyed manually in afterClose or onExit.",
    },
  },
  {
    id: "M16",
    title: "Generic No-Data Text",
    category: "setup",
    anchor: "mistake-16-generic-no-data-text",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 development convention — derived from SAP best practices for empty-state UX in POD 2.0 extensions",
    },
    verification: {
      method: "convention",
      note: "UX best practice: setNoDataText() (sap.m.ListBase, inherited by sap.m.Table) should reflect the actual empty-state cause derived from PodContext state (e.g. getFilterResources()?.length). API facts confirmed: sap.m.ListBase.noDataText exists in UI5 1.151.0; PodContext.getFilterResources() confirmed from framework source.",
    },
  },
  {
    id: "M17",
    title: "Formatter Instead of Expression Binding",
    category: "ui",
    anchor: "mistake-17-formatter-instead-of-expression-binding",
    severity: "info",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (info).",
    provenance: {
      status: "verified",
      source: "SAPUI5 expression binding (sap/ui/base/BindingParser.complexParser) — used directly by PodContext.resolveBinding",
    },
    verification: {
      method: "convention",
      note: "Expression binding syntax {= expr } is supported via BindingParser.complexParser, which PodContext imports and uses in resolveBinding(). For single-condition booleans, {= ${prop} === 'VALUE' } is idiomatic UI5 — a custom formatter adds indirection without benefit.",
    },
  },
  {
    id: "M18",
    title: "Not Incrementing Page in GrowingJSONModel",
    category: "config",
    anchor: "mistake-18-not-incrementing-page-in-growingjsonmodel-",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: model/GrowingJSONListBinding.js#GrowingJSONListBinding.#r",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "onGrowing callback is called as onGrowing(growingThreshold, currentItemCount) and must return [newItems, totalCount]. Not incrementing a page counter causes the same first page to reload on every growing event.",
    },
  },
  {
    id: "M19",
    title: "Not Destroying Dialogs in afterClose",
    category: "lifecycle",
    anchor: "mistake-19-not-destroying-dialogs-in-afterclose-",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js#Widget.destroy",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Same root cause as M15: Widget.destroy() does not auto-destroy dialogs. Dialogs opened via open() live on the UI5 Core popup layer outside the widget's view tree. afterClose is the idiomatic destroy point for one-shot dialogs; onExit is the fallback for persistent dialog instances.",
    },
  },
  {
    id: "M20",
    title: "Column/Cell Index Mismatch",
    category: "ui",
    anchor: "mistake-20-columncell-index-mismatch-",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 API — sap.m.Table.columns (sap.m.Column) + sap.m.ColumnListItem.cells (sap.ui.core.Control)",
    },
    verification: {
      method: "ui5-api",
      checks: [
        { kind: "ui5AggregationType", symbol: "sap.m.Table", aggregation: "columns", type: "sap.m.Column" },
        { kind: "ui5AggregationType", symbol: "sap.m.ColumnListItem", aggregation: "cells", type: "sap.ui.core.Control" },
      ],
      authoredAgainst: { ui5Version: "1.151.0" },
      note: "sap.m.Table renders each ColumnListItem by pairing cells[i] with columns[i] positionally. Inserting a column at index X without inserting the corresponding cell at the same index X causes cells to appear in the wrong columns.",
    },
  },
  {
    id: "M22",
    title: "Using toast() for Persistent Notifications",
    category: "config",
    anchor: "mistake-22-using-toast-for-persistent-notifications---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/MessageHistory.js#MessageHistory.toast + showSuccess/showError",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "MessageHistory.toast() calls sap.m.MessageToast.show() with DEFAULT_TOAST_DURATION=7000ms — auto-dismisses. MessageHistory.showSuccess()/showError()/showWarning()/showInfo() call sap.m.MessageBox.success()/error()/warning()/information() — modal dialogs that require user acknowledgment. Both add to MessageHistory (PodContext). For important outcomes (API success/failure), showSuccess()/showError() must be used so the user cannot miss them.",
    },
  },
  {
    id: "M23",
    title: "Forgetting to Clear Busy State on Error",
    category: "data",
    anchor: "mistake-23-forgetting-to-clear-busy-state-on-error---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 API — sap.ui.core.Control.busy + busyIndicatorDelay (default 1000ms)",
    },
    verification: {
      method: "ui5-api",
      checks: [
        { kind: "ui5PropertyExists", symbol: "sap.ui.core.Control", property: "busy", present: true },
        { kind: "ui5PropertyExists", symbol: "sap.ui.core.Control", property: "busyIndicatorDelay", present: true },
      ],
      authoredAgainst: { ui5Version: "1.151.0" },
      note: "setBusy(true) activates the overlay; setBusyIndicatorDelay(0) removes the default 1000ms delay. Without a finally block, an async throw bypasses setBusy(false) in the try block, leaving the widget permanently overlaid. The fix is finally { oView.setBusy(false) }.",
    },
  },
  {
    id: "M24",
    title: "Not Handling Expected API Error Codes",
    category: "data",
    anchor: "mistake-24-not-handling-expected-api-error-codes---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: api/RestClient.js#RestClient.#l + api/ApiError.js + library-preload.js",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "RestClient.#l() parses the JSON error body and throws ApiError({message, status, body: parsedJSON}). The body field holds the full SAP DM error response — error code is at oError.body.error.code. The code 'sfc.notInCompletePending' is confirmed in the library-preload bundle as a known normal-state response code, not a true error.",
    },
  },
  {
    id: "M25",
    title: "Subscribing to Multiple Paths with Multiple Calls",
    category: "config",
    anchor: "mistake-25-subscribing-to-multiple-paths-with-multiple-calls---",
    severity: "info",
    auditList: "info",
    downgradable: true,
    severityReason: "Correct and stays correct; maintainability/style only (Phase 3 → Info).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/PodContext.js#PodContext.subscribe",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "PodContext.subscribe() first normalises: const s = Array.isArray(t) ? t : [t]. Array of paths is a first-class API; multiple separate calls produce multiple independent callbacks instead of one batched callback.",
    },
  },
  {
    id: "M26",
    title: "Using Wrong Property Exclusion Pattern",
    category: "config",
    anchor: "mistake-26-using-wrong-property-exclusion-pattern",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/ControlWidget.js#ControlWidget.#s + widget/core/TableWidget.js#TableWidget._createTable",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "EXCLUDE_PROPERTIES and INCLUDE_PROPERTIES are real static class properties read by ControlWidget.#s() via _findClassProperty(). TableWidget._createTable() already auto-filters all non-sap.m.Table properties via getMetadata().getAllSettings() — IGNORE_TABLE_PROPERTIES (instance property seen in some framework widgets) has no effect in this version and is dead code.",
    },
    lifecycle: {
      status: "changed",
      note: "Original prose presented IGNORE_TABLE_PROPERTIES as a valid mechanism to skip widget-specific properties from the Table constructor. This is wrong: TableWidget auto-filters via metadata. Prose updated.",
    },
  },
  {
    id: "M27",
    title: "Missing Selection Synchronization with PodContext",
    category: "data",
    anchor: "mistake-27-missing-selection-synchronization-with-podcontext",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: context/PodContext.js — getSelectedWorkListItems + setSelectedWorkListItems confirmed",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "PodContext exposes getSelectedWorkListItems() and setSelectedWorkListItems(). Bidirectional sync (subscribe → _syncSelectionsWithPodContext) is the required pattern for table widgets reacting to external selection changes.",
    },
  },
  {
    id: "M28",
    title: "Multi-Part Bindings Without Defensive Checks",
    category: "ui",
    anchor: "mistake-28-multi-part-bindings-without-defensive-checks",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 binding framework convention: multi-part formatters receive undefined before data loads",
    },
    verification: {
      method: "convention",
      note: "SAPUI5 always calls multi-part formatters immediately on binding registration, before the model data arrives. All formatter arguments may be undefined/null at that point. Defensive checks are required to avoid 'undefined' in rendered text.",
    },
  },
  {
    id: "M29",
    title: "SFC Status as Number Instead of String",
    category: "data",
    anchor: "mistake-29-sfc-status-as-number-instead-of-string---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "docu/pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md (sfcStatus typed as string)",
    },
  },
  {
    id: "M30",
    title: 'Wrong German i18n — "SFC" Instead of "PSN"',
    category: "i18n",
    anchor: "mistake-30-wrong-german-i18n--sfc-instead-of-psn---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAP DM product convention: PSN (Produktionsstücknummer) is the established German term for SFC across the standard SAP DM UI",
    },
    verification: {
      method: "convention",
      note: "SAP Digital Manufacturing's standard German UI uses PSN everywhere. Extensions using SFC in German i18n bundles stand out as inconsistent with the product's own terminology.",
    },
  },
  {
    id: "M31",
    title: "Control ID Must Be First Constructor Argument",
    category: "ui",
    anchor: "mistake-31-control-id-must-be-first-constructor-argument",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/ControlWidget.js#ControlWidget._createView + runtime/PodRuntime.js#PodRuntime.createWidget",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "ControlWidget._createView() does: new this.#t(t.id, o) — ID is always the positional first arg. PodRuntime.createWidget() also asserts o.getId() === config.id after _createView().",
    },
  },
  {
    id: "M32",
    title: "Widget Metadata i18n Keys — Use Named Prefix (`<widgetName>.displayName`, etc.)",
    category: "config",
    anchor: "mistake-32-widget-metadata-i18n-keys--use-named-prefix-widgetnamedisplayname-etc",
    severity: "error",
    auditList: "errors",
    downgradable: true,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js — getDisplayName, getDescription, getCategory are static methods read by POD Designer",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Widget.js confirms getDisplayName(), getDescription(), getCategory() exist as static methods called by the POD Designer palette. Consistent named-prefix key style (e.g. coating.displayName) is a convention to avoid i18n key collisions between multiple widgets/actions in the same plugin.",
    },
  },
  {
    id: "M33",
    title: "BusyIndicator in Actions via View Instead of `sap/ui/core/BusyIndicator`",
    category: "lifecycle",
    anchor: "mistake-33-busyindicator-in-actions-via-view-instead-of-sapuicorebusyindicator",
    severity: "error",
    auditList: "errors",
    downgradable: true,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "SAP UI5 API sap.ui.core.BusyIndicator (sapui5.hana.ondemand.com)" },
  },
  {
    id: "M34",
    aliases: ["Cat 3"],
    title: "`parseFloat()` on User Input Breaks Localized Number Formats",
    category: "data",
    anchor: "mistake-34-parsefloat-on-user-input-breaks-localized-number-formats",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: { status: "verified", source: "SAP UI5 API sap.ui.core.format.NumberFormat" },
  },
  {
    id: "M35",
    title: "Missing i18nCustomModel Registration in `onInit()`",
    category: "lifecycle",
    anchor: "mistake-35-missing-i18ncustommodel-registration-in-oninit---",
    severity: "warning",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Needed only when {i18nXxx>...} view bindings or POD Designer palette display are used — not a universal requirement for every widget.",
    provenance: {
      status: "verified",
      source: "POD2 framework: PodObject.js#PodObject.getI18nModel + context/PodContext.js#PodContext.applyCoreModelsTo",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "PodContext.applyCoreModelsTo() only registers the global 'i18n' model on the runtime App. Custom widget i18n models must be manually registered in onInit() via setModel() when {i18nXxx>...} bindings or external i18n access (POD Designer palette, other controls) are needed. getI18nText() inside the widget class works via the static model without registration.",
    },
  },
  {
    id: "M36",
    title: "Deprecated SAPUI5 Pseudo-Module Enum Imports",
    category: "imports",
    anchor: "mistake-36-deprecated-sapui5-pseudo-module-enum-imports",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: enumeration/SFCStatus.js + enumeration/SFCStatusCode.js + enumeration/ContentDensity.js",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "All framework enums use sap.ui.define(['sap/ui/base/DataType'], E => { DataType.registerEnum(...) }). No standalone pseudo-module imports used anywhere in the framework. Confirmed correct pattern.",
    },
  },
  {
    id: "M37",
    title: "Tagged-Template Misuse on `getI18nText` (Hidden Bug)",
    category: "imports",
    anchor: "mistake-37-tagged-template-misuse-on-geti18ntext-hidden-bug",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "ECMAScript specification: Tagged Template Literals (ES2015 §12.3.5) — fn() `...` invokes fn as tag",
    },
    verification: {
      method: "convention",
      note: "Pure JavaScript syntax rule: a function call expression immediately followed (no newline/semicolon) by a template literal is parsed as a tagged template, not a function call plus string. The dynamic substitution is silently dropped.",
    },
  },
  {
    id: "M38",
    title: "Undeclared DOM-ID Globals Instead of `this.byId` (Hidden Bug)",
    category: "imports",
    anchor: "mistake-38-undeclared-dom-id-globals-instead-of-thisbyid-hidden-bug",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "HTML Living Standard: Named access on the Window object — DOM elements with id are exposed as window properties",
    },
    verification: {
      method: "convention",
      note: "Browser spec: DOM elements with id attributes are accessible as window globals in non-strict mode. This is fragile: breaks under strict mode, module bundlers, multiple widget instances (id collision), iframes, and shadow DOM. The correct pattern is storing control references in private class fields.",
    },
  },
  {
    id: "M39",
    title: "Wrong Base Class — LayoutWidget Instead of Widget",
    category: "lifecycle",
    anchor: "mistake-39-wrong-base-class--layoutwidget-instead-of-widget",
    severity: "error",
    auditList: "none",
    downgradable: false,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/LayoutWidget.js#LayoutWidget + widget/ControlWidget.js#ControlWidget.constructor",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "LayoutWidget extends ControlWidget. ControlWidget.constructor(ControlClass, config) stores ControlClass in a private field; _createView() does new this.#t(t.id, o). Extending LayoutWidget without passing the ControlClass leaves this.#t undefined → crash in _createView(). LayoutWidget is for POD Designer container widgets (VBox, HBox) that host child POD widgets in aggregations.",
    },
  },
  {
    id: "M40",
    title: "Unescaped Curly Braces and Single Quotes in i18n Properties",
    category: "i18n",
    anchor: "mistake-40-unescaped-curly-braces-and-single-quotes-in-i18n-properties",
    severity: "warning",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (warning).",
    provenance: { status: "verified", source: "SAP UI5 API sap.base.i18n.ResourceBundle (escaping rules)" },
  },
  {
    id: "M41",
    title: "Non-existent module paths (`sap/m/Item`, `sap/m/Icon`, …) (RUNTIME 404 — extension fails to load)",
    category: "imports",
    anchor: "mistake-41-non-existent-module-paths-sapmitem-sapmicon-----runtime-404--extension-fails-to-load",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "UI5 runtime 404 on sap/m/Item.js (1.136.15); cross-checked via get_ui5_api",
    },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [
        { kind: "ui5SymbolExists", symbol: "sap.m.Item", present: false },
        { kind: "ui5SymbolExists", symbol: "sap.ui.core.Item", present: true },
      ],
    },
  },
  {
    id: "M42",
    title: "Custom control (`.extend(...)`) without `renderer` — 404 during extension load (RUNTIME 404)",
    category: "ui",
    anchor: "mistake-42-custom-control-extend-without-renderer--404-during-extension-load----runtime-404",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "SAPUI5 ManagedObject.extend() behavior: no renderer in metadata → UI5 infers external renderer file",
    },
    verification: {
      method: "behavior",
      note: "SAPUI5 framework: when Control.extend() metadata has no `renderer` key, UI5 appends 'Renderer' to the class name and issues a synchronous GET for that file. In a POD 2.0 extension the renderer file does not exist → hard 404 → module load failure. Fix: pass renderer: null or renderer: {} to suppress the auto-load.",
    },
  },
  {
    id: "M43",
    title: "Passing a `String` where a UI5 property expects `float` / `int` (RUNTIME type-mismatch)",
    category: "ui",
    anchor: "mistake-43-passing-a-string-where-a-ui5-property-expects-float--int----runtime-type-mismatch",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "SAPUI5 ManagedObject.validateProperty(): strict type checking throws on string-for-float",
    },
    verification: {
      method: "behavior",
      note: "ManagedObject.validateProperty() enforces strict type checks. A string like '1' fails validation for float/int properties even when it parses cleanly. Common migration trap: HTML5 code uses String() for CSS positioning; transliterating to UI5 microchart coordinates without removing the cast throws at runtime.",
    },
  },
  {
    id: "M50",
    title: "`ComponentWidget` for HTML5 migrations — don't (six cascading pitfalls) (use plain `Widget`)",
    category: "lifecycle",
    anchor: "mistake-50-componentwidget-for-html5-migrations--dont-six-cascading-pitfalls----use-plain-widget",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "POD2 framework: library-preload.js#sap.dm.dme.pod2.widget.ComponentWidget",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "ComponentWidget confirmed in library-preload.js. Its _createView() calls Component.create({manifest:true}) triggering full component bootstrap (router, manifest.json, ComponentContainer). Using it for a simple migration adds unnecessary bootstrap overhead — use plain Widget instead.",
    },
  },
  {
    id: "M51",
    title:
      '`ModelPath.SelectedPlant` does not exist — use `ModelPath.Plant`, callback receives a Plant OBJECT (not a string) (RUNTIME "Model path is required")',
    category: "data",
    anchor:
      "mistake-51-modelpathselectedplant-does-not-exist--use-modelpathplant-callback-receives-a-plant-object-not-a-string----runtime-model-path-is-required",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "get_api_doc ModelPath/PodContext — ModelPath.SelectedPlant does not exist",
    },
  },
  {
    id: "M52",
    title: "XML aggregation wrapper `<items>` triggers phantom 404 on `sap/m/items.js` diagnostic pattern",
    category: "ui",
    anchor: "mistake-52-xml-aggregation-wrapper-items-triggers-phantom-404-on-sapmitemsjs---diagnostic-pattern",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "SAPUI5 XML view parser error-recovery: on parse failure, unresolved aggregation names are attempted as class lookups",
    },
    verification: {
      method: "behavior",
      note: "SAPUI5 XML view parser: when a fatal error occurs (e.g. missing IAsyncContentCreation, unknown property), the parser's error recovery path tries to resolve aggregation wrapper tags like <items> as class names → GET sap/m/items.js → 404. The 404 is always a cascade; the real error appears earlier in the console.",
    },
  },
  {
    id: "M53",
    title:
      "Microchart color property — `ValueColor` vs `ValueCSSColor` vs `IconColor` are NOT interchangeable (RUNTIME parser rejection)",
    category: "ui",
    anchor:
      "mistake-53-microchart-color-property--valuecolor-vs-valuecsscolor-vs-iconcolor-are-not-interchangeable----runtime-parser-rejection",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      note: "Prose names a BulletMicroChartColor enum that does not exist; the real enum is sap.m.ValueColor.",
      checks: [
        { kind: "ui5SymbolExists", symbol: "sap.m.ValueColor", present: true },
        { kind: "ui5EnumMember", enumSymbol: "sap.m.ValueColor", member: "Good", present: true },
        { kind: "ui5SymbolExists", symbol: "sap.suite.ui.microchart.BulletMicroChartColor", present: false },
      ],
    },
  },
  {
    id: "M54",
    title:
      "`LineMicroChartPoint` has no `color` or `emphasized` property — use `LineMicroChartEmphasizedPoint` (RUNTIME unknown-setting)",
    category: "ui",
    anchor:
      "mistake-54-linemicrochartpoint-has-no-color-or-emphasized-property--use-linemicrochartemphasizedpoint----runtime-unknown-setting",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [
        { kind: "ui5SymbolExists", symbol: "sap.suite.ui.microchart.LineMicroChartEmphasizedPoint", present: true },
        {
          kind: "ui5PropertyExists",
          symbol: "sap.suite.ui.microchart.LineMicroChartPoint",
          property: "color",
          present: false,
        },
      ],
    },
  },
  {
    id: "M55",
    title:
      "List-binding template conflict — attribute binding AND `<aggregation>` wrapper on the same aggregation (RUNTIME assertion)",
    category: "ui",
    anchor:
      "mistake-55-list-binding-template-conflict--attribute-binding-and-aggregation-wrapper-on-the-same-aggregation----runtime-assertion",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "SAPUI5 XMLTemplateProcessor: list bindings assert single template — attribute binding + aggregation wrapper conflict",
    },
    verification: {
      method: "behavior",
      note: "SAPUI5 XML view parser: specifying both an attribute-style aggregation binding (points='{path}') and an explicit <aggregation> wrapper with a child template for the SAME aggregation registers two templates → assertion 'list bindings support only a single template object'. Fix: use one form exclusively.",
    },
  },
  {
    id: "M56",
    title: "`sap.m.FlexAlignItems` / `FlexJustifyContent` values have NO `Flex` prefix (RUNTIME [FUTURE FATAL])",
    category: "ui",
    anchor: "mistake-56-sapmflexalignitems--flexjustifycontent-values-have-no-flex-prefix----runtime-future-fatal",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      note: "Enum values are Start/Center/End — no flex- prefix.",
      checks: [
        { kind: "ui5EnumMember", enumSymbol: "sap.m.FlexAlignItems", member: "Start", present: true },
        { kind: "ui5EnumMember", enumSymbol: "sap.m.FlexAlignItems", member: "flex-start", present: false },
        { kind: "ui5EnumMember", enumSymbol: "sap.m.FlexJustifyContent", member: "SpaceBetween", present: true },
      ],
    },
  },
  {
    id: "M57",
    title: "`sap.f.Header` and other guessed-namespace controls don't exist (RUNTIME 404)",
    category: "imports",
    anchor: "mistake-57-sapfheader-and-other-guessed-namespace-controls-dont-exist----runtime-404",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [{ kind: "ui5SymbolExists", symbol: "sap.f.Header", present: false }],
    },
  },
  {
    id: "M58",
    title: "`sap.m.App` as widget root — absolute-positioned to viewport, breaks embedded POD widget",
    category: "ui",
    anchor: "mistake-58-sapmapp-as-widget-root--absolute-positioned-to-viewport-breaks-embedded-pod-widget---",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "SAPUI5 sap.m.App: top-level shell control, renders as position:fixed/full-viewport — not embeddable",
    },
    verification: {
      method: "behavior",
      note: "sap.m.App and sap.m.SplitApp are viewport-level shell controls: their root element is position:fixed and occupies the full viewport. Embedded inside a POD widget slot (bounded height/width), the control breaks out of the slot. Use sap.m.NavContainer for in-widget navigation instead.",
    },
  },
  {
    id: "M59",
    title:
      "Widget-owned shell bar / header is redundant — POD runtime already renders the outer shell (UX + accessibility)",
    category: "ui",
    anchor:
      "mistake-59-widget-owned-shell-bar--header-is-redundant--pod-runtime-already-renders-the-outer-shell----ux--accessibility",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "POD 2.0 architecture: POD runtime owns the outer Fiori shell; widgets render only their body region",
    },
    verification: {
      method: "convention",
      note: "POD 2.0 runtime provides the SAP Fiori launchpad shell, page header, breadcrumb, and navigation. A widget that renders a second shell bar or header duplicates focus stops, wastes vertical space, and clashes with screen readers.",
    },
  },
  {
    id: "M60",
    aliases: ["Cat 29"],
    title:
      "Custom control class for pure display composition — use `GenericTile` / `NumericContent` / `NumericHeader` instead",
    category: "ui",
    anchor:
      "mistake-60-custom-control-class-for-pure-display-composition--use-generictile--numericcontent--numericheader-instead---",
    severity: "error",
    auditList: "none",
    downgradable: false,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "basics.md §0 Prime Directive Escalation Ladder: custom control is Rung 4, requires team alignment + exception marker",
    },
    verification: {
      method: "convention",
      note: "Prime Directive §0: a plain .extend(CustomVBox, {...}) for a pure display template skips Rungs 1-3 of the escalation ladder (GenericTile + NumericContent covers 80% of KPI-tile use cases). Custom control is only justified for reusable behavior, not display templates.",
    },
  },
  {
    id: "M61",
    title: "No extension-owned CSS surface — Fiori standard controls only (STYLING BAN)",
    category: "ui",
    anchor: "mistake-61-no-extension-owned-css-surface--fiori-standard-controls-only----styling-ban",
    severity: "error",
    auditList: "none",
    downgradable: false,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "POD 2.0 extension guidelines: no custom CSS surface; Fiori theme tokens + sapUi* utility classes only",
    },
    verification: {
      method: "convention",
      note: "POD 2.0 extension guidelines ban extension-owned CSS files, inline style attributes, and non-Fiori styleClass names. A CSS file without a documented loader call is dead code (not loaded at runtime). The exception marker // standard-only: exception — <reason> is required for any deviation.",
    },
  },
  {
    id: "M62",
    title: "View model stores pre-formatted strings — blocks all numeric standard controls",
    category: "ui",
    anchor: "mistake-62-view-model-stores-pre-formatted-strings--blocks-all-numeric-standard-controls---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "SAPUI5 ManagedObject.validateProperty(): numeric properties (float/int) reject strings",
    },
    verification: {
      method: "behavior",
      note: "SAPUI5 standard controls for numeric display (NumericContent, BulletMicroChart, ProgressIndicator) require float/int properties. Storing pre-formatted strings like '85.4 %' in the JSONModel forces all downstream controls to use Text instead of their native numeric rendering — loses formatting, theming, and accessibility features.",
    },
  },
  {
    id: "M63",
    title: "`Fragment.load` popover keyed off a microchart shape — microcharts have no click-drill",
    category: "ui",
    anchor: "mistake-63-fragmentload-popover-keyed-off-a-microchart-shape--microcharts-have-no-click-drill---",
    severity: "error",
    auditList: "none",
    downgradable: true,
    severityReason:
      "Not enumerated in a Phase 3 severity list; checked under Phase 3b/3d or the Prime Directive (error).",
    provenance: {
      status: "verified",
      source: "SAPUI5 sap.suite.ui.microchart.BulletMicroChart: only 'press' event (whole-chart), no per-shape events",
    },
    verification: {
      method: "behavior",
      note: "BulletMicroChart (and other microcharts) expose only a whole-chart press event — no per-shape/per-point selectData events. Per-shape drill-down requires sap.viz.ui5.controls.VizFrame.",
    },
  },
  {
    id: "M64",
    title: "`sap.m.MessageStrip.link` aggregates `sap.m.Link`, NOT `sap.m.Button` (RUNTIME aggregation type-check)",
    category: "ui",
    anchor: "mistake-64-sapmmessagestriplink-aggregates-sapmlink-not-sapmbutton----runtime-aggregation-type-check",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "machine-checked against bundled specs (ui5-api); see verify-rules" },
    verification: {
      method: "ui5-api",
      authoredAgainst: { dmRelease: "2608", ui5Version: "1.151.0" },
      checks: [{ kind: "ui5AggregationType", symbol: "sap.m.MessageStrip", aggregation: "link", type: "sap.m.Link" }],
    },
  },
  {
    id: "M65",
    title:
      "`_createView()` receives NO arguments — get widget config via `this.getConfig()` (RUNTIME undefined-access)",
    category: "lifecycle",
    anchor:
      "mistake-65-_createview-receives-no-arguments--get-widget-config-via-thisgetconfig----runtime-undefined-access",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: runtime/PodRuntime.js#PodRuntime.createWidget",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "PodRuntime.createWidget() calls: const o = await i._createView() — zero arguments passed. Config must be accessed via this.getConfig() inside _createView().",
    },
  },
  {
    id: "M66",
    title:
      "`_createView()` runs BEFORE `onInit()` — initialise binding-referenced instances early (RUNTIME formatter-throws)",
    category: "lifecycle",
    anchor:
      "mistake-66-_createview-runs-before-oninit--initialise-binding-referenced-instances-early----runtime-formatter-throws",
    severity: "warning",
    auditList: "errors",
    downgradable: true,
    severityReason:
      "⚠️ Warning-grade exception, swept with Errors: binding-referenced instances must init in onInit(), not _createView().",
    provenance: {
      status: "verified",
      source: "POD2 framework: runtime/PodRuntime.js#PodRuntime.createWidget + PodRuntime.#f",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "createWidget() calls _createView() synchronously, then #f() calls onInit() only after the full page widget tree is assembled. Any instance needed by a binding formatter must be initialised in _createView() (or lazily on first use), not in onInit().",
    },
  },
  {
    id: "M70",
    title:
      "Silent information loss via standard-control bias (SEMANTIC — no runtime error, invisible until visual review)",
    category: "ui",
    anchor:
      "mistake-70-silent-information-loss-via-standard-control-bias----semantic--no-runtime-error-invisible-until-visual-review",
    severity: "warning",
    auditList: "errors",
    downgradable: false,
    severityReason: "⚠️ Warning-grade exception: applies only to html5-origin code; not auto-fixable.",
    provenance: {
      status: "verified",
      source: "basics.md §0 Prime Directive: 'smallest standard control that fits ALL source fields' — not 'first-match'",
    },
    verification: {
      method: "convention",
      note: "Prime Directive fit check: when a source composite carries more slots than the first-match standard control provides, the correct control is the next rung up the escalation ladder — not GenericTile with silent field drops. Unmapped source fields must be surfaced explicitly in MIGRATION_MAPPING.md.",
    },
  },
  {
    id: "M71",
    title:
      "Wrong notification-subscribe keys & non-existent `Logger.warning()` (HANDLER NEVER FIRES / RUNTIME TypeError)",
    category: "imports",
    anchor:
      "mistake-71-wrong-notification-subscribe-keys--non-existent-loggerwarning----handler-never-fires--runtime-typeerror",
    severity: "error",
    auditList: "errors",
    downgradable: true,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "Notification subscribe keys + Logger API confirmed via get_api_doc" },
  },
  {
    id: "M72",
    title: "Hard-wiring an INTERNAL / app-router API into extension source instead of the public REST API",
    category: "data",
    anchor:
      "mistake-72-hard-wiring-an-internal--app-router-api-into-extension-source-instead-of-the-public-rest-api---",
    severity: "warning",
    auditList: "errors",
    downgradable: true,
    severityReason: "⚠️ Warning-grade: internal/app-router API hard-wired — works but fragile across tenants/releases.",
    provenance: {
      status: "verified",
      source: "SAP DM public REST specs (search_rest_apis/get_rest_api); internal surfaces are unversioned",
    },
  },
  {
    id: "M73",
    title: "Manual `fetch()` / `XMLHttpRequest` to build SAP DM requests instead of the built-in API clients",
    category: "data",
    anchor: "mistake-73-manual-fetch--xmlhttprequest-to-build-sap-dm-requests-instead-of-the-built-in-api-clients---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: api/RestClient.js#RestClient.fetch",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "RestClient.fetch() automatically adds Accept-Language, x-dme-plant, x-dme-industry-type, x-csrf-token headers and handles 403/session-expiry redirect. Manual fetch() bypasses all of these, causing auth and CSRF failures in production.",
    },
  },
  {
    id: "M74",
    title: "Reading shared context (plant / SFC / order / work center) from a model path instead of `PodContext`",
    category: "data",
    anchor:
      "mistake-74-reading-shared-context-plant--sfc--order--work-center-from-a-model-path-instead-of-podcontext---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "get_api_doc PodContext — shared-context getter/subscribe surface" },
  },
  {
    id: "M75",
    title: "Control lookup, event wiring, and timers started from `_createView()` instead of `onInit()`",
    category: "lifecycle",
    anchor: "mistake-75-control-lookup-event-wiring-and-timers-started-from-_createview-instead-of-oninit---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD2 framework: runtime/PodRuntime.js#PodRuntime.createWidget + PodRuntime.#f",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "_createView() is called recursively during widget-tree construction; child widgets are not yet created when parent's _createView() runs. onInit() is called in #f() only after the full tree is assembled. Cross-widget lookups, event wiring, and timers must go in onInit().",
    },
  },
  {
    id: "M76",
    title: "Fixed timeouts and polling loops to coordinate async work instead of awaiting a signal",
    category: "lifecycle",
    anchor: "mistake-76-fixed-timeouts-and-polling-loops-to-coordinate-async-work-instead-of-awaiting-a-signal---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "get_api_doc PodContext §getWhenAvailable/§subscribe" },
  },
  {
    id: "M77",
    title:
      "Hand-built DOM UI (`document.createElement` overlay, inline `style`, custom dialogs) instead of standard SAPUI5 controls",
    category: "ui",
    anchor:
      "mistake-77-hand-built-dom-ui-documentcreateelement-overlay-inline-style-custom-dialogs-instead-of-standard-sapui5-controls---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD 2.0 extension guidelines: §0 Prime Directive at DOM level — raw DOM bypasses UI5 control tree",
    },
    verification: {
      method: "convention",
      note: "Hand-built DOM elements (document.createElement, el.style.cssText, appendChild) are outside the UI5 control tree. They ignore Fiori theming, bypass onExit cleanup, break POD Designer preview, violate CSP, and reinvent — worse — what standard controls already provide (e.g. sap.m.BusyDialog for blocking overlays).",
    },
  },
  {
    id: "M78",
    title:
      "Monkey-patching global `XMLHttpRequest`/`fetch` (and standard controls' `firePress`) to infer request status",
    category: "imports",
    anchor:
      "mistake-78-monkey-patching-global-xmlhttprequestfetch-and-standard-controls-firepress-to-infer-request-status---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "Browser security model: mutating XMLHttpRequest.prototype/window.fetch affects all consumers page-wide",
    },
    verification: {
      method: "convention",
      note: "Monkey-patching XMLHttpRequest.prototype or window.fetch mutates browser-wide state from one widget. Multiple instances or extensions doing the same corrupt each other. Restoration is fragile. The correct pattern is using RestClient / fetch directly in the extension's own code and reading the returned result.",
    },
  },
  {
    id: "M79",
    title:
      "Discovering another widget's controls (global registry, generated IDs, identity-by-appearance, private internals)",
    category: "lifecycle",
    anchor:
      "mistake-79-discovering-another-widgets-controls-global-registry-generated-ids-identity-by-appearance-private-internals---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: { status: "verified", source: "get_api_doc PodContext + basics.md §0 widget boundary" },
  },
  {
    id: "M80",
    title:
      "Mutating another widget's controls or state (`setVisible`/`setEnabled`/`setSelected`/`setValue`, force-enable, data-tagging)",
    category: "lifecycle",
    anchor:
      "mistake-80-mutating-another-widgets-controls-or-state-setvisiblesetenabledsetselectedsetvalue-force-enable-data-tagging---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD 2.0 widget boundary contract: each widget is the single writer of its own controls' state",
    },
    verification: {
      method: "convention",
      note: "POD 2.0 architecture: each widget owns its controls. Cross-widget state mutation (setSelected/setValue on a foreign control) desyncs the owner's backing model from the control state, and force-enabling a disabled control bypasses the validation guard that disabled it.",
    },
  },
  {
    id: "M81",
    title: "Firing synthetic events / simulating DOM interaction on another widget's controls",
    category: "lifecycle",
    anchor: "mistake-81-firing-synthetic-events--simulating-dom-interaction-on-another-widgets-controls---",
    severity: "error",
    auditList: "errors",
    downgradable: false,
    severityReason: "Breaks at load/runtime or violates a non-negotiable POD framework contract (Phase 3 → Errors).",
    provenance: {
      status: "verified",
      source: "POD 2.0 widget boundary contract: business operations must use the public API/Action, not counterfeit events",
    },
    verification: {
      method: "convention",
      note: "Firing oTable.fireSelectionChange / oButton.firePress / getDomRef().click() on a foreign widget's controls lies to that control's owner — the handler runs with hand-crafted parameters that may not match real state. The correct trigger for a cross-widget operation is the POD 2.0 Action API.",
    },
  },
  {
    id: "M84",
    title: "Mutable instance state on public `this._x` fields instead of true-private `#` fields",
    category: "lifecycle",
    anchor: "mistake-84-mutable-instance-state-on-public-this_x-fields-instead-of-true-private--fields---",
    severity: "warning",
    auditList: "warnings",
    downgradable: true,
    severityReason: "Works in the happy path but is legacy, risky, or environment-dependent (Phase 3 → Warnings).",
    provenance: {
      status: "verified",
      source: "POD2 framework: widget/Widget.js#Widget",
    },
    verification: {
      method: "framework-source",
      authoredAgainst: { frameworkRef: "UI5 1.148.9" },
      note: "Widget.js uses only engine-enforced # private fields (#e, #t, #r, #i, #o, #n, #s, #a, #d, #g, #u). The framework never uses this._x convention for internal state. Extensions should follow the same private-field pattern.",
    },
  },
  {
    id: "HTML5-CHART",
    title: "HTML5 migration residue: CHART",
    category: "html5-migration",
    anchor: null,
    severity: "error",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Error); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 2: every Chart.js/d3/plotly/echarts call must be replaced with sap.suite.ui.microchart / sap.viz.ui5.controls.VizFrame",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: Canvas-based chart libraries (Chart.js, d3, plotly, echarts) are incompatible with Fiori theme, accessibility, and POD Designer. Must be re-implemented using the standard SAPUI5 chart controls per chart-migration-map.md.",
    },
  },
  {
    id: "HTML5-FETCH",
    title: "HTML5 migration residue: FETCH",
    category: "html5-migration",
    anchor: null,
    severity: "error",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Error); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 1: every fetch()/XMLHttpRequest/$.ajax becomes ODataV4Client or ApiClient",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: native fetch/XHR bypass the POD 2.0 RestClient contract (error handling, ApiError, auth). Every HTTP call must go through ODataV4Client or ApiClient — no exceptions inside a POD 2.0 extension unless the target is a non-DM service with explicit customer sign-off.",
    },
  },
  {
    id: "HTML5-INLINE-HANDLER",
    title: "HTML5 migration residue: INLINE-HANDLER",
    category: "html5-migration",
    anchor: null,
    severity: "error",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Error); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 5: every onclick=/onchange= becomes attachPress/attachChange",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: inline HTML event handlers (onclick=, onchange=) are incompatible with the UI5 event model and CSP. Must be replaced with control.attachPress() / attachChange() etc.",
    },
  },
  {
    id: "HTML5-CHART-SCRIPT-TAG",
    title: "HTML5 migration residue: CHART-SCRIPT-TAG",
    category: "html5-migration",
    anchor: null,
    severity: "error",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Error); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 2 + M11 (Third-Party Library Loading): <script src=...> is incompatible with AMD/sap.ui.define",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: <script src='Chart.js'> and similar global-script loads are incompatible with the SAPUI5 AMD loader. The library must either be loaded via sap.ui.define (if UMD-compatible) or removed entirely and replaced with standard SAPUI5 controls.",
    },
  },
  {
    id: "HTML5-TOFIXED",
    title: "HTML5 migration residue: TOFIXED",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 7: every .toFixed(N) becomes sap.ui.core.format.NumberFormat",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: Number.toFixed() ignores the user's locale. SAP DM targets international plants. Replace with NumberFormat.getFloatInstance({minFractionDigits:N, maxFractionDigits:N}).format(value) driven by sap/ui/core/Configuration.getLanguage().",
    },
  },
  {
    id: "HTML5-MODULE-STATE",
    title: "HTML5 migration residue: MODULE-STATE",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 3: every module-level let/var becomes a private class field (#name)",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: module-level mutable state is shared across all widget instances and survives widget destroy/re-create. Must be moved to class private fields (#name) so each instance has its own copy.",
    },
  },
  {
    id: "HTML5-EMOJI-ICON",
    title: "HTML5 migration residue: EMOJI-ICON",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 9: every emoji glyph becomes sap-icon:// + sap.ui.core.ValueState for color",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: emoji glyphs (🟢🟡🔴🔔) used as status icons are unthemeable and inaccessible. Replace with sap-icon:// URIs + ValueState for color + tooltip for screen readers.",
    },
  },
  {
    id: "HTML5-LOCALE-LITERAL",
    title: "HTML5 migration residue: LOCALE-LITERAL",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 6: every locale-hardcoded string becomes DateFormat/NumberFormat driven by Configuration.getLanguage()",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: hard-coded locale strings ('de-DE', 'en-GB') ignore the POD user's configured language. Must be replaced with sap.ui.core.Configuration.getLanguage() / DateFormat / NumberFormat so formatting adapts to the user's locale.",
    },
  },
  {
    id: "HTML5-TIMER-HANDLE",
    title: "HTML5 migration residue: TIMER-HANDLE",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 4: every setInterval gets a stored handle (this.#nIntervalId)",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: setInterval/setTimeout return values must be stored in a class private field (this.#nIntervalId) so clearInterval/clearTimeout can be called in onExit() — otherwise the timer leaks and keeps firing after the widget is destroyed.",
    },
  },
  {
    id: "HTML5-TIMER-CLEANUP",
    title: "HTML5 migration residue: TIMER-CLEANUP",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 4: matching clearInterval in onExit() required for each stored timer handle",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: every stored timer handle (this.#nIntervalId) must have a matching clearInterval/clearTimeout call in onExit(). Without cleanup the timer outlives the widget and fires against a destroyed context.",
    },
  },
  {
    id: "HTML5-MAGIC-THRESHOLD",
    title: "HTML5 migration residue: MAGIC-THRESHOLD",
    category: "html5-migration",
    anchor: null,
    severity: "warning",
    auditList: "html5",
    downgradable: true,
    severityReason:
      "HTML5→POD migration residue (Phase 3 → HTML5 Residue, Warning); detection in html5-migration-guide.md.",
    provenance: {
      status: "verified",
      source: "html5-migration-guide.md Golden Rule 10: every hard-coded threshold becomes a widget property (see property-editors.md)",
    },
    verification: {
      method: "convention",
      note: "HTML5 migration golden rule: magic numbers used as business thresholds (if (val > 20)) must be exposed as configurable widget properties so operators can adjust them in POD Designer without code changes.",
    },
  },
];

const BY_ID: Map<string, Rule> = new Map(RULES.map((r) => [r.id, r]));

export function ruleById(id: string): Rule | undefined {
  return BY_ID.get(id);
}
export function rulesByCategory(category: RuleCategory): Rule[] {
  return RULES.filter((r) => r.category === category);
}
export function rulesByProvenance(status: ProvenanceStatus): Rule[] {
  return RULES.filter((r) => r.provenance.status === status);
}
