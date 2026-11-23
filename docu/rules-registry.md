# Rules Registry

> **Generated file — do not edit by hand.** Single source of truth: `src/rules/registry.ts`.
> Regenerate with `npm run generate-rules-registry`. This table holds per-rule **metadata**
> (severity, downgradability, provenance). The **detection grep + before→after fix** for each rule
> lives in its linked `common-mistakes-*` entry — this file never duplicates it.

## Provenance audit

Each rule's grounding:

- **✅ verified** — backed by a citable SAP source (help.sap.com, `pod2-api-specs`, REST specs, UI5 API).
- **🧩 inferred** — derived from the project reference examples, **not yet SAP-doc confirmed**. These
  are the audit targets: the same reverse-from-example origin that produced the wrong M6/M21 rules.
- **❓ unverified** — no cited source yet. Cleanup backlog.

| Status | Count |
|---|---:|
| ✅ verified | 13 |
| 🧩 inferred | 4 |
| ❓ unverified | 68 |
| **total** | **85** |

**🧩 inferred (confirm against SAP docs or demote):** M35, M39, M65, M66

**❓ unverified (cite a source or re-test):** M0, M1, M1B, M2, M3, M4, M5, M7, M8, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19, M20, M22, M23, M24, M25, M26, M27, M28, M30, M31, M32, M36, M37, M38, M42, M43, M50, M52, M53, M54, M55, M56, M57, M58, M59, M60, M61, M62, M63, M64, M70, M73, M75, M77, M78, M80, M81, M84, HTML5-CHART, HTML5-CHART-SCRIPT-TAG, HTML5-EMOJI-ICON, HTML5-FETCH, HTML5-INLINE-HANDLER, HTML5-LOCALE-LITERAL, HTML5-MAGIC-THRESHOLD, HTML5-MODULE-STATE, HTML5-TIMER-CLEANUP, HTML5-TIMER-HANDLE, HTML5-TOFIXED

> When an agent cites a rule whose status is **inferred** or **unverified**, it must report the finding
> with a provenance caveat (the rule is not SAP-confirmed) — see `validate-project-instructions.md` Phase 3.

## Catalog

Severity is the rule's **true** severity; `downgradable: no` means a suppression marker cannot lower it.
`Audit list` in `src/rules/registry.ts` records which Phase 3 group sweeps the code (a rule may be
swept under Errors yet be Warning-grade, e.g. M66/M70/M72).

| ID | Title | Category | Severity | Downgradable | Provenance |
|----|-------|----------|----------|:------------:|------------|
| [M0](common-mistakes-setup.md#mistake-0-wrong-namespace-in-extensionjson) | Wrong Namespace in extension.json | setup | 🔴 Error | **no** | ❓ unverified |
| [M1](common-mistakes-setup.md#mistake-1-missing-onexit-after-podcontextsubscribe) | Missing onExit() After PodContext.subscribe() | setup | ⚠️ Warning | yes | ❓ unverified |
| [M1B](common-mistakes-setup.md#mistake-1b-creating-namespace-folders-during-generation) | Creating Namespace Folders During Generation | setup | ⚠️ Warning | yes | ❓ unverified |
| [M2](common-mistakes-setup.md#mistake-2-binding-syntax-in-widgetproperty-metadata) | Binding Syntax in WidgetProperty Metadata | setup | 🔴 Error | **no** | ❓ unverified |
| [M3](common-mistakes-lifecycle.md#mistake-3-wrong-podcontext-import-path---) | Wrong PodContext Import Path | lifecycle | 🔴 Error | **no** | ❓ unverified |
| [M4](common-mistakes-lifecycle.md#mistake-4-passing-default-value-to-stringpropertyeditor---) | Passing Default Value to StringPropertyEditor | lifecycle | ⚠️ Warning | yes | ❓ unverified |
| [M5](common-mistakes-lifecycle.md#mistake-5-wrong-callback-parameter-order---) | Wrong Callback Parameter Order | lifecycle | 🔴 Error | **no** | ❓ unverified |
| [M6](common-mistakes-imports.md#mistake-6-missing-view-id-in-_createview---) | Missing View ID in _createView() | imports | 🔴 Error | yes | ✅ verified — SAP official Widget sample uses this.getId(); POD sets widget id from config before _createView() — common-mistakes-imports.md |
| [M7](common-mistakes-imports.md#mistake-7-no-defensive-type-checking---) | No Defensive Type Checking | imports | ⚠️ Warning | yes | ❓ unverified |
| [M8](common-mistakes-imports.md#mistake-8-invalid-extensionjson-structure---) | Invalid extension.json Structure | imports | ⚠️ Warning | yes | ❓ unverified |
| [M9](common-mistakes-imports.md#mistake-9-spreading-parent-properties-in-getdefaultconfig---) | Spreading Parent Properties in getDefaultConfig() | imports | ⚠️ Warning | yes | ✅ verified — SAP Help Portal — Add Widget Properties (help.sap.com/docs/.../8dbdab1343184bf19ed36cf26f6aaf08.html) |
| [M10](common-mistakes-ui.md#mistake-10-using-class-instead-of-styleclass---) | Using "class" Instead of "styleClass" | ui | ⚠️ Warning | yes | ❓ unverified |
| [M11](common-mistakes-imports.md#mistake-11-third-party-library-loading-fails---) | Third-Party Library Loading Fails | imports | ⚠️ Warning | yes | ❓ unverified |
| [M12](common-mistakes-ui.md#mistake-12-wrong-placementtype-import---) | Wrong PlacementType Import | ui | 🔴 Error | yes | ❓ unverified |
| [M13](common-mistakes-ui.md#mistake-13-wrong-modelpath-constants---) | Wrong ModelPath Constants | ui | ⚠️ Warning | yes | ❓ unverified |
| [M14](common-mistakes-config.md#mistake-14-missing-onexit-unsubscribe---memory-leak-) | Missing onExit() Unsubscribe - Memory Leak! | config | 🔴 Error | **no** | ❓ unverified |
| [M15](common-mistakes-setup.md#mistake-15-not-destroying-dynamic-dialogspopovers) | Not Destroying Dynamic Dialogs/Popovers | setup | 🔴 Error | **no** | ❓ unverified |
| [M16](common-mistakes-setup.md#mistake-16-generic-no-data-text) | Generic No-Data Text | setup | ⚠️ Warning | yes | ❓ unverified |
| [M17](common-mistakes-ui.md#mistake-17-formatter-instead-of-expression-binding) | Formatter Instead of Expression Binding | ui | ℹ️ Info | yes | ❓ unverified |
| [M18](common-mistakes-config.md#mistake-18-not-incrementing-page-in-growingjsonmodel-) | Not Incrementing Page in GrowingJSONModel | config | ⚠️ Warning | yes | ❓ unverified |
| [M19](common-mistakes-lifecycle.md#mistake-19-not-destroying-dialogs-in-afterclose-) | Not Destroying Dialogs in afterClose | lifecycle | ⚠️ Warning | yes | ❓ unverified |
| [M20](common-mistakes-ui.md#mistake-20-columncell-index-mismatch-) | Column/Cell Index Mismatch | ui | ⚠️ Warning | yes | ❓ unverified |
| [M22](common-mistakes-config.md#mistake-22-using-toast-for-persistent-notifications---) | Using toast() for Persistent Notifications | config | ⚠️ Warning | yes | ❓ unverified |
| [M23](common-mistakes-data.md#mistake-23-forgetting-to-clear-busy-state-on-error---) | Forgetting to Clear Busy State on Error | data | ⚠️ Warning | yes | ❓ unverified |
| [M24](common-mistakes-data.md#mistake-24-not-handling-expected-api-error-codes---) | Not Handling Expected API Error Codes | data | ⚠️ Warning | yes | ❓ unverified |
| [M25](common-mistakes-config.md#mistake-25-subscribing-to-multiple-paths-with-multiple-calls---) | Subscribing to Multiple Paths with Multiple Calls | config | ℹ️ Info | yes | ❓ unverified |
| [M26](common-mistakes-config.md#mistake-26-using-wrong-property-exclusion-pattern) | Using Wrong Property Exclusion Pattern | config | ⚠️ Warning | yes | ❓ unverified |
| [M27](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext) | Missing Selection Synchronization with PodContext | data | ⚠️ Warning | yes | ❓ unverified |
| [M28](common-mistakes-ui.md#mistake-28-multi-part-bindings-without-defensive-checks) | Multi-Part Bindings Without Defensive Checks | ui | ⚠️ Warning | yes | ❓ unverified |
| [M29](common-mistakes-data.md#mistake-29-sfc-status-as-number-instead-of-string---) | SFC Status as Number Instead of String | data | 🔴 Error | **no** | ✅ verified — docu/pod2-api-specs/sap.dm.dme.pod2.api.internal.worklist.md (sfcStatus typed as string) |
| [M30](common-mistakes-i18n.md#mistake-30-wrong-german-i18n--sfc-instead-of-psn---) | Wrong German i18n — "SFC" Instead of "PSN" | i18n | ⚠️ Warning | yes | ❓ unverified |
| [M31](common-mistakes-ui.md#mistake-31-control-id-must-be-first-constructor-argument) | Control ID Must Be First Constructor Argument | ui | 🔴 Error | **no** | ❓ unverified |
| [M32](common-mistakes-config.md#mistake-32-widget-metadata-i18n-keys--use-named-prefix-widgetnamedisplayname-etc) | Widget Metadata i18n Keys — Use Named Prefix (`<widgetName>.displayName`, etc.) | config | 🔴 Error | yes | ❓ unverified |
| [M33](common-mistakes-lifecycle.md#mistake-33-busyindicator-in-actions-via-view-instead-of-sapuicorebusyindicator) | BusyIndicator in Actions via View Instead of `sap/ui/core/BusyIndicator` | lifecycle | 🔴 Error | yes | ✅ verified — SAP UI5 API sap.ui.core.BusyIndicator (sapui5.hana.ondemand.com) |
| [M34](common-mistakes-data.md#mistake-34-parsefloat-on-user-input-breaks-localized-number-formats) | `parseFloat()` on User Input Breaks Localized Number Formats | data | ⚠️ Warning | yes | ✅ verified — SAP UI5 API sap.ui.core.format.NumberFormat |
| [M35](common-mistakes-lifecycle.md#mistake-35-missing-i18ncustommodel-registration-in-oninit---) | Missing i18nCustomModel Registration in `onInit()` | lifecycle | 🔴 Error | yes | 🧩 inferred — Reference examples (Coating/HelloWorld/TableView) bundleName pattern; not SAP-doc confirmed |
| [M36](common-mistakes-imports.md#mistake-36-deprecated-sapui5-pseudo-module-enum-imports) | Deprecated SAPUI5 Pseudo-Module Enum Imports | imports | ⚠️ Warning | yes | ❓ unverified |
| [M37](common-mistakes-imports.md#mistake-37-tagged-template-misuse-on-geti18ntext-hidden-bug) | Tagged-Template Misuse on `getI18nText` (Hidden Bug) | imports | 🔴 Error | **no** | ❓ unverified |
| [M38](common-mistakes-imports.md#mistake-38-undeclared-dom-id-globals-instead-of-thisbyid-hidden-bug) | Undeclared DOM-ID Globals Instead of `this.byId` (Hidden Bug) | imports | ⚠️ Warning | yes | ❓ unverified |
| [M39](common-mistakes-lifecycle.md#mistake-39-wrong-base-class--layoutwidget-instead-of-widget) | Wrong Base Class — LayoutWidget Instead of Widget | lifecycle | 🔴 Error | **no** | 🧩 inferred — All reference examples extend Widget; not SAP-doc confirmed |
| [M40](common-mistakes-i18n.md#mistake-40-unescaped-curly-braces-and-single-quotes-in-i18n-properties) | Unescaped Curly Braces and Single Quotes in i18n Properties | i18n | ⚠️ Warning | yes | ✅ verified — SAP UI5 API sap.base.i18n.ResourceBundle (escaping rules) |
| [M41](common-mistakes-imports.md#mistake-41-non-existent-module-paths-sapmitem-sapmicon-----runtime-404--extension-fails-to-load) | Non-existent module paths (`sap/m/Item`, `sap/m/Icon`, …) (RUNTIME 404 — extension fails to load) | imports | 🔴 Error | **no** | ✅ verified — UI5 runtime 404 on sap/m/Item.js (1.136.15); cross-checked via get_ui5_api |
| [M42](common-mistakes-ui.md#mistake-42-custom-control-extend-without-renderer--404-during-extension-load----runtime-404) | Custom control (`.extend(...)`) without `renderer` — 404 during extension load (RUNTIME 404) | ui | 🔴 Error | **no** | ❓ unverified |
| [M43](common-mistakes-ui.md#mistake-43-passing-a-string-where-a-ui5-property-expects-float--int----runtime-type-mismatch) | Passing a `String` where a UI5 property expects `float` / `int` (RUNTIME type-mismatch) | ui | 🔴 Error | **no** | ❓ unverified |
| [M50](common-mistakes-lifecycle.md#mistake-50-componentwidget-for-html5-migrations--dont-six-cascading-pitfalls----use-plain-widget) | `ComponentWidget` for HTML5 migrations — don't (six cascading pitfalls) (use plain `Widget`) | lifecycle | 🔴 Error | yes | ❓ unverified |
| [M51](common-mistakes-data.md#mistake-51-modelpathselectedplant-does-not-exist--use-modelpathplant-callback-receives-a-plant-object-not-a-string----runtime-model-path-is-required) | `ModelPath.SelectedPlant` does not exist — use `ModelPath.Plant`, callback receives a Plant OBJECT (not a string) (RUNTIME "Model path is required") | data | 🔴 Error | **no** | ✅ verified — get_api_doc ModelPath/PodContext — ModelPath.SelectedPlant does not exist |
| [M52](common-mistakes-ui.md#mistake-52-xml-aggregation-wrapper-items-triggers-phantom-404-on-sapmitemsjs---diagnostic-pattern) | XML aggregation wrapper `<items>` triggers phantom 404 on `sap/m/items.js` diagnostic pattern | ui | 🔴 Error | yes | ❓ unverified |
| [M53](common-mistakes-ui.md#mistake-53-microchart-color-property--valuecolor-vs-valuecsscolor-vs-iconcolor-are-not-interchangeable----runtime-parser-rejection) | Microchart color property — `ValueColor` vs `ValueCSSColor` vs `IconColor` are NOT interchangeable (RUNTIME parser rejection) | ui | 🔴 Error | **no** | ❓ unverified |
| [M54](common-mistakes-ui.md#mistake-54-linemicrochartpoint-has-no-color-or-emphasized-property--use-linemicrochartemphasizedpoint----runtime-unknown-setting) | `LineMicroChartPoint` has no `color` or `emphasized` property — use `LineMicroChartEmphasizedPoint` (RUNTIME unknown-setting) | ui | 🔴 Error | **no** | ❓ unverified |
| [M55](common-mistakes-ui.md#mistake-55-list-binding-template-conflict--attribute-binding-and-aggregation-wrapper-on-the-same-aggregation----runtime-assertion) | List-binding template conflict — attribute binding AND `<aggregation>` wrapper on the same aggregation (RUNTIME assertion) | ui | 🔴 Error | **no** | ❓ unverified |
| [M56](common-mistakes-ui.md#mistake-56-sapmflexalignitems--flexjustifycontent-values-have-no-flex-prefix----runtime-future-fatal) | `sap.m.FlexAlignItems` / `FlexJustifyContent` values have NO `Flex` prefix (RUNTIME [FUTURE FATAL]) | ui | ⚠️ Warning | yes | ❓ unverified |
| [M57](common-mistakes-imports.md#mistake-57-sapfheader-and-other-guessed-namespace-controls-dont-exist----runtime-404) | `sap.f.Header` and other guessed-namespace controls don't exist (RUNTIME 404) | imports | 🔴 Error | yes | ❓ unverified |
| [M58](common-mistakes-ui.md#mistake-58-sapmapp-as-widget-root--absolute-positioned-to-viewport-breaks-embedded-pod-widget---) | `sap.m.App` as widget root — absolute-positioned to viewport, breaks embedded POD widget | ui | 🔴 Error | yes | ❓ unverified |
| [M59](common-mistakes-ui.md#mistake-59-widget-owned-shell-bar--header-is-redundant--pod-runtime-already-renders-the-outer-shell----ux--accessibility) | Widget-owned shell bar / header is redundant — POD runtime already renders the outer shell (UX + accessibility) | ui | 🔴 Error | yes | ❓ unverified |
| [M60](common-mistakes-ui.md#mistake-60-custom-control-class-for-pure-display-composition--use-generictile--numericcontent--numericheader-instead---) | Custom control class for pure display composition — use `GenericTile` / `NumericContent` / `NumericHeader` instead | ui | 🔴 Error | **no** | ❓ unverified |
| [M61](common-mistakes-ui.md#mistake-61-no-extension-owned-css-surface--fiori-standard-controls-only----styling-ban) | No extension-owned CSS surface — Fiori standard controls only (STYLING BAN) | ui | 🔴 Error | **no** | ❓ unverified |
| [M62](common-mistakes-ui.md#mistake-62-view-model-stores-pre-formatted-strings--blocks-all-numeric-standard-controls---) | View model stores pre-formatted strings — blocks all numeric standard controls | ui | ⚠️ Warning | yes | ❓ unverified |
| [M63](common-mistakes-ui.md#mistake-63-fragmentload-popover-keyed-off-a-microchart-shape--microcharts-have-no-click-drill---) | `Fragment.load` popover keyed off a microchart shape — microcharts have no click-drill | ui | 🔴 Error | yes | ❓ unverified |
| [M64](common-mistakes-ui.md#mistake-64-sapmmessagestriplink-aggregates-sapmlink-not-sapmbutton----runtime-aggregation-type-check) | `sap.m.MessageStrip.link` aggregates `sap.m.Link`, NOT `sap.m.Button` (RUNTIME aggregation type-check) | ui | 🔴 Error | **no** | ❓ unverified |
| [M65](common-mistakes-lifecycle.md#mistake-65-_createview-receives-no-arguments--get-widget-config-via-thisgetconfig----runtime-undefined-access) | `_createView()` receives NO arguments — get widget config via `this.getConfig()` (RUNTIME undefined-access) | lifecycle | 🔴 Error | **no** | 🧩 inferred — Ground-Truth Customer.Coating/widget/CoatingWidget.js (_createView no-args); SAP sample corroborates this.getConfig() |
| [M66](common-mistakes-lifecycle.md#mistake-66-_createview-runs-before-oninit--initialise-binding-referenced-instances-early----runtime-formatter-throws) | `_createView()` runs BEFORE `onInit()` — initialise binding-referenced instances early (RUNTIME formatter-throws) | lifecycle | ⚠️ Warning | yes | 🧩 inferred — Customer.Coating lazy-init pattern; inferred, not SAP-doc confirmed |
| [M70](common-mistakes-ui.md#mistake-70-silent-information-loss-via-standard-control-bias----semantic--no-runtime-error-invisible-until-visual-review) | Silent information loss via standard-control bias (SEMANTIC — no runtime error, invisible until visual review) | ui | ⚠️ Warning | **no** | ❓ unverified |
| [M71](common-mistakes-imports.md#mistake-71-wrong-notification-subscribe-keys--non-existent-loggerwarning----handler-never-fires--runtime-typeerror) | Wrong notification-subscribe keys & non-existent `Logger.warning()` (HANDLER NEVER FIRES / RUNTIME TypeError) | imports | 🔴 Error | yes | ✅ verified — Notification subscribe keys + Logger API confirmed via get_api_doc |
| [M72](common-mistakes-data.md#mistake-72-hard-wiring-an-internal--app-router-api-into-extension-source-instead-of-the-public-rest-api---) | Hard-wiring an INTERNAL / app-router API into extension source instead of the public REST API | data | ⚠️ Warning | yes | ✅ verified — SAP DM public REST specs (search_rest_apis/get_rest_api); internal surfaces are unversioned |
| [M73](common-mistakes-data.md#mistake-73-manual-fetch--xmlhttprequest-to-build-sap-dm-requests-instead-of-the-built-in-api-clients---) | Manual `fetch()` / `XMLHttpRequest` to build SAP DM requests instead of the built-in API clients | data | 🔴 Error | **no** | ❓ unverified |
| [M74](common-mistakes-data.md#mistake-74-reading-shared-context-plant--sfc--order--work-center-from-a-model-path-instead-of-podcontext---) | Reading shared context (plant / SFC / order / work center) from a model path instead of `PodContext` | data | 🔴 Error | **no** | ✅ verified — get_api_doc PodContext — shared-context getter/subscribe surface |
| [M75](common-mistakes-lifecycle.md#mistake-75-control-lookup-event-wiring-and-timers-started-from-_createview-instead-of-oninit---) | Control lookup, event wiring, and timers started from `_createView()` instead of `onInit()` | lifecycle | 🔴 Error | **no** | ❓ unverified |
| [M76](common-mistakes-lifecycle.md#mistake-76-fixed-timeouts-and-polling-loops-to-coordinate-async-work-instead-of-awaiting-a-signal---) | Fixed timeouts and polling loops to coordinate async work instead of awaiting a signal | lifecycle | 🔴 Error | **no** | ✅ verified — get_api_doc PodContext §getWhenAvailable/§subscribe |
| [M77](common-mistakes-ui.md#mistake-77-hand-built-dom-ui-documentcreateelement-overlay-inline-style-custom-dialogs-instead-of-standard-sapui5-controls---) | Hand-built DOM UI (`document.createElement` overlay, inline `style`, custom dialogs) instead of standard SAPUI5 controls | ui | 🔴 Error | **no** | ❓ unverified |
| [M78](common-mistakes-imports.md#mistake-78-monkey-patching-global-xmlhttprequestfetch-and-standard-controls-firepress-to-infer-request-status---) | Monkey-patching global `XMLHttpRequest`/`fetch` (and standard controls' `firePress`) to infer request status | imports | 🔴 Error | **no** | ❓ unverified |
| [M79](common-mistakes-lifecycle.md#mistake-79-discovering-another-widgets-controls-global-registry-generated-ids-identity-by-appearance-private-internals---) | Discovering another widget's controls (global registry, generated IDs, identity-by-appearance, private internals) | lifecycle | 🔴 Error | **no** | ✅ verified — get_api_doc PodContext + basics.md §0 widget boundary |
| [M80](common-mistakes-lifecycle.md#mistake-80-mutating-another-widgets-controls-or-state-setvisiblesetenabledsetselectedsetvalue-force-enable-data-tagging---) | Mutating another widget's controls or state (`setVisible`/`setEnabled`/`setSelected`/`setValue`, force-enable, data-tagging) | lifecycle | 🔴 Error | **no** | ❓ unverified |
| [M81](common-mistakes-lifecycle.md#mistake-81-firing-synthetic-events--simulating-dom-interaction-on-another-widgets-controls---) | Firing synthetic events / simulating DOM interaction on another widget's controls | lifecycle | 🔴 Error | **no** | ❓ unverified |
| [M84](common-mistakes-lifecycle.md#mistake-84-mutable-instance-state-on-public-this_x-fields-instead-of-true-private--fields---) | Mutable instance state on public `this._x` fields instead of true-private `#` fields | lifecycle | ⚠️ Warning | yes | ❓ unverified |
| HTML5-CHART | HTML5 migration residue: CHART | html5-migration | 🔴 Error | yes | ❓ unverified |
| HTML5-CHART-SCRIPT-TAG | HTML5 migration residue: CHART-SCRIPT-TAG | html5-migration | 🔴 Error | yes | ❓ unverified |
| HTML5-EMOJI-ICON | HTML5 migration residue: EMOJI-ICON | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-FETCH | HTML5 migration residue: FETCH | html5-migration | 🔴 Error | yes | ❓ unverified |
| HTML5-INLINE-HANDLER | HTML5 migration residue: INLINE-HANDLER | html5-migration | 🔴 Error | yes | ❓ unverified |
| HTML5-LOCALE-LITERAL | HTML5 migration residue: LOCALE-LITERAL | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-MAGIC-THRESHOLD | HTML5 migration residue: MAGIC-THRESHOLD | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-MODULE-STATE | HTML5 migration residue: MODULE-STATE | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-TIMER-CLEANUP | HTML5 migration residue: TIMER-CLEANUP | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-TIMER-HANDLE | HTML5 migration residue: TIMER-HANDLE | html5-migration | ⚠️ Warning | yes | ❓ unverified |
| HTML5-TOFIXED | HTML5 migration residue: TOFIXED | html5-migration | ⚠️ Warning | yes | ❓ unverified |
