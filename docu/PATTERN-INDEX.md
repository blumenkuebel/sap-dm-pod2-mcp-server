# POD 2.0 Pattern Index

Quick reference index organized by widget type, use case, technical pattern, and complexity.

---

## By Widget Type

### ControlWidget Patterns
| Pattern | File | Complexity | Description |
|---------|------|------------|-------------|
| Basic ControlWidget | widget-patterns.md | ⭐ | Single control wrapper (Button, Input, Text) |
| ControlWidget with Properties | widget-patterns.md | ⭐⭐ | Configurable properties via POD Designer |
| ControlWidget with Events | widget-patterns.md | ⭐⭐ | Custom event handling |

### LayoutWidget Patterns
| Pattern | File | Complexity | Description |
|---------|------|------------|-------------|
| Basic LayoutWidget | widget-patterns.md | ⭐⭐ | Container for child controls |
| LayoutWidget with Refresh | widget-patterns.md | ⭐⭐⭐ | API integration with refresh button |
| Master-Detail Nav | advanced-patterns.md | ⭐⭐⭐⭐ | NavContainer with navigation |

### TableWidget Patterns
| Pattern | File | Complexity | Description |
|---------|------|------------|-------------|
| Basic TableWidget | widget-patterns.md | ⭐⭐⭐ | Simple data table |
| TableWidget Complete | tablewidget-complete.md | ⭐⭐⭐⭐ | Full-featured with pagination |
| Growing Table | widget-patterns.md | ⭐⭐⭐⭐ | GrowingJSONModel pagination |
| Custom Toolbar | advanced-patterns.md | ⭐⭐⭐⭐ | Override _createToolbar() |
| Complex Cells | tablecell-patterns.md | ⭐⭐⭐⭐ | 13 cell types (text, date, actions, charts) |
| Selection Sync | common-mistakes.md | ⭐⭐⭐⭐⭐ | Bidirectional PodContext sync |

### ContentHandler Patterns
| Pattern | File | Complexity | Description |
|---------|------|------------|-------------|
| Dialog + Form | advanced-patterns.md | ⭐⭐⭐⭐⭐ | Complex form with validation |
| Custom Dialog | advanced-patterns.md | ⭐⭐⭐⭐ | Extend sap.m.Dialog directly |
| Form Validation | form-patterns.md | ⭐⭐⭐⭐⭐ | Real-time validation patterns |

---

## By Use Case

### Data Display
- [Basic Table](widget-patterns-core.md#tablewidget-complete-pattern-for-complex-tables) - Simple data table
- [Growing Table](widget-patterns-advanced.md#pagination-pattern) - Paginated table
- [Table Cells](tablecell-patterns.md) - 13 cell types
- [No-Data Messages](advanced-patterns.md#9-contextual-no-data-messages) - Context-aware messages

### Data Input & Forms
- [Form Patterns](form-patterns.md) - Complete form guide
- [ContentHandler](form-patterns.md#complex-form-validation-) - Dialog forms
- [Validation](form-patterns.md#complex-form-validation-) - Real-time validation
- [Custom Fields](advanced-patterns.md#11-jsdoc-extensible-markers) - Extensible fields

### API Integration
- [REST API Calling Pattern](pod2-public-api-pattern.md) - RestClient + ApiPaths official pattern (GET, POST, PUT, DELETE)
- [API Patterns](widget-patterns-advanced.md#sap-dm-api-integration-pattern) - REST API calls from widgets
- [Error Handling](advanced-patterns.md#4-advanced-error-handling-with-retry-logic) - Complete error management
- [Retry Pattern](advanced-patterns.md#4-advanced-error-handling-with-retry-logic) - Tolerance warnings

### State Management
- [PodContext Subscription](subscribe-patterns.md#the-subscribe-pattern-complete) - Subscribe to changes
- [ModelPath Reference](model-paths.md) - All 39 standard model paths
- [Selection Sync](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext) - Table↔PodContext sync
- [Data Delegates](model-paths.md#subscribe-patterns) - Shared state
- [Optimistic UI](advanced-patterns.md#6-optimistic-ui-updates) - Instant feedback

### User Interaction
- [Button Actions](widget-patterns-core.md#controlwidget-pattern-for-single-controls) - Button press handlers
- [HotKey Shortcuts](hotkey-patterns.md) - Keyboard shortcuts via HotKeyManager
- [Popover](advanced-patterns.md#5-async-popover-with-lifecycle-management) - Async popovers
- [Warning Dialogs](advanced-patterns.md#8-warning-dialogs-with-custom-actions) - Custom actions
- [Dynamic Enabling](advanced-patterns.md#2-authorization-based-ui-state-management) - Authorization checks

### Enumerations & Constants
- [Enumerations Reference](enumerations-reference.md) - All 23 framework enums (SFCStatus, WorkListType, ResourceStatus, ...)
- [ModelPath Reference](model-paths.md) - All 39 PodContext model paths with types
- [StatusIcon Control](status-icon-control.md) - SFC status icon/color mapping in worklist

---

## By Technical Pattern

### Modern JavaScript
- [Private Fields (#)](widget-patterns-core.md#common-patterns) - ES2022 encapsulation
- [Static Enums](widget-patterns-core.md#common-patterns) - Object.freeze() type safety
- [JSDoc @extensible](advanced-patterns.md#11-jsdoc-extensible-markers) - Extension points

### Binding & Formatting
- [Multi-Part Binding](binding-patterns.md#multi-part-binding) - Composite values
- [Expression Binding](binding-patterns.md#expression-binding) - Computed properties
- [Formatter Classes](binding-patterns.md#formatter-utility-classes) - Reusable formatters
- [Defensive Formatters](common-mistakes-ui.md#mistake-28-multi-part-bindings-without-defensive-checks) - Null-safe formatters

### Lifecycle & Memory
- [onExit Cleanup](common-mistakes-setup.md#mistake-1-missing-onexit-after-podcontextsubscribe) - Memory leak prevention
- [Dialog Destruction](common-mistakes-lifecycle.md#mistake-19-not-destroying-dialogs-in-afterclose-) - afterClose destroy
- [Timer Management](widget-patterns-core.md#timer-and-interval-management-pattern--critical) - Interval cleanup
- [Subscription Arrays](subscribe-patterns.md) - Multi-subscribe

### Enterprise Patterns
- [Dynamic Columns](advanced-patterns.md#3-dynamic-column-creation) - Conditional columns
- [UOM Handling](binding-patterns.md#formatter-utility-classes) - Unit conversion
- [Authorization](advanced-patterns.md#2-authorization-based-ui-state-management) - Permission checks
- [Audit Trail](advanced-patterns.md) - MessageHistory patterns

---

## By Complexity Level

### ⭐ Beginner (1 star)
- [Basic ControlWidget](widget-patterns-core.md#controlwidget-pattern-for-single-controls)
- [Basic Properties](widget-patterns-core.md#common-patterns)

### ⭐⭐ Intermediate (2 stars)
- [LayoutWidget](widget-patterns-core.md#layoutwidget-pattern-for-containers)
- [API Widget](widget-patterns-advanced.md#sap-dm-api-integration-pattern)
- [Context Subscription](subscribe-patterns.md#the-subscribe-pattern-complete)
- [REST API Calling Pattern](pod2-public-api-pattern.md)

### ⭐⭐⭐ Advanced (3 stars)
- [Basic TableWidget](widget-patterns-core.md#tablewidget-complete-pattern-for-complex-tables)
- [Growing Table](widget-patterns-advanced.md#pagination-pattern)
- [Custom Toolbar](advanced-patterns.md#1-custom-toolbars-and-headerbar-integration)

### ⭐⭐⭐⭐ Expert (4 stars)
- [TableWidget Complete](tablewidget-complete.md)
- [Complex Cells](tablecell-patterns.md)
- [Custom Dialog](advanced-patterns.md#8-warning-dialogs-with-custom-actions)
- [Dynamic Columns](advanced-patterns.md#3-dynamic-column-creation)

### ⭐⭐⭐⭐⭐ Master (5 stars)
- [ContentHandler + Forms](form-patterns.md#complex-form-validation-)
- [Error Handling](advanced-patterns.md#4-advanced-error-handling-with-retry-logic)
- [Selection Sync](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext)
- [Complete Form Patterns](form-patterns.md)

---

## Validation Checklists

### Pre-Generation Checklist
Before generating ANY widget code:

- [ ] PlacementType from `"sap/m/PlacementType"` (not sap/ui/core/library)
- [ ] PodContext from `"sap/dm/dme/pod2/context/PodContext"` (not model/)
- [ ] ModelPath constants are exact (SelectedWorkListItems not Item)
- [ ] i18n uses static getI18nModel() pattern
- [ ] Defensive type checking with Array.isArray()

**See**: [Basics & Best Practices](basics.md#9-best-practices)

### Post-Generation Checklist
After creating widget:

- [ ] Every `PodContext.subscribe()` has matching `unsubscribe()` in `onExit()`
- [ ] `onExit()` method exists and calls `super.onExit()`
- [ ] JSONModels initialized in `_createView()` BEFORE creating controls
- [ ] No binding syntax in WidgetProperty displayName/description
- [ ] Parent properties spread only for TableWidget/LayoutWidget
- [ ] Dialogs destroyed in afterClose handler

**See**: [Common Mistakes](common-mistakes.md) for all validation checks

### TableWidget Checklist
Specific to TableWidget:

- [ ] IGNORE_TABLE_PROPERTIES for widget config properties
- [ ] EXCLUDE_PROPERTIES for designer-hidden properties
- [ ] Selection sync: _syncSelectionsWithPodContext() implemented
- [ ] Initial sync called in onInit()
- [ ] _onSelectionChange preserves existing selections
- [ ] Multi-part formatters have null checks for ALL parameters

**See**: [Mistake #26](common-mistakes-config.md#mistake-26-using-wrong-property-exclusion-pattern) and [Mistake #27](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext)

---

## Quick Pattern Selection

### I need to...

**Display a single control** → [ControlWidget](widget-patterns-core.md#controlwidget-pattern-for-single-controls) ⭐
**Show a container** → [LayoutWidget](widget-patterns-core.md#layoutwidget-pattern-for-containers) ⭐⭐
**Display tabular data** → [TableWidget](widget-patterns-core.md#tablewidget-complete-pattern-for-complex-tables) ⭐⭐⭐
**Create a form** → [ContentHandler](form-patterns.md#complex-form-validation-) ⭐⭐⭐⭐⭐

**Call a REST API** → [REST API Calling Pattern](pod2-public-api-pattern.md) ⭐⭐
**React to selections** → [Context Subscription](subscribe-patterns.md#the-subscribe-pattern-complete) ⭐⭐
**Paginate data** → [Growing Table](widget-patterns-advanced.md#pagination-pattern) ⭐⭐⭐⭐
**Custom table columns** → [Dynamic Columns](advanced-patterns.md#3-dynamic-column-creation) ⭐⭐⭐⭐

**Validate input** → [Form Validation](form-patterns.md#complex-form-validation-) ⭐⭐⭐⭐⭐
**Handle errors** → [Error Handling](advanced-patterns.md#4-advanced-error-handling-with-retry-logic) ⭐⭐⭐⭐⭐
**Share data** → [Data Delegates](model-paths.md#subscribe-patterns) ⭐⭐⭐⭐
**Show warnings** → [Warning Dialog](advanced-patterns.md#8-warning-dialogs-with-custom-actions) ⭐⭐⭐

---

## Common Pattern Combinations

### TableWidget + API + Pagination
1. Start with [TableWidget Complete](tablewidget-complete.md)
2. Add [GrowingJSONModel](widget-patterns-advanced.md#pagination-pattern)
3. Implement [Selection Sync](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext)
4. Add [Complex Cells](tablecell-patterns.md) as needed

### Form + Validation + API
1. Start with [ContentHandler](form-patterns.md#complex-form-validation-)
2. Add [Form Validation](form-patterns.md#complex-form-validation-)
3. Implement [Error Handling](advanced-patterns.md#4-advanced-error-handling-with-retry-logic)
4. Add [Custom Fields](advanced-patterns.md#11-jsdoc-extensible-markers) if needed

### Context-Aware Table
1. Start with [Basic TableWidget](widget-patterns-core.md#tablewidget-complete-pattern-for-complex-tables)
2. Add [PodContext Subscription](subscribe-patterns.md#the-subscribe-pattern-complete)
3. Implement [Selection Sync](common-mistakes-data.md#mistake-27-missing-selection-synchronization-with-podcontext)
4. Add [Contextual No-Data](advanced-patterns.md#9-contextual-no-data-messages)

---

## File Quick Reference

| File | Focus | Patterns Count |
|------|-------|----------------|
| widget-patterns.md | Router → core / advanced | index only (start here for widget templates) |
| widget-patterns-core.md | Core widget templates | ControlWidget, LayoutWidget, TableWidget, timers, i18n |
| widget-patterns-advanced.md | Advanced widget patterns | SAP DM API integration, pagination, API examples |
| tablewidget-complete.md | Complete TableWidget | 1 comprehensive guide |
| tablecell-patterns.md | Table cells | 13 cell types |
| binding-patterns.md | Bindings & formatters | 6 binding patterns |
| advanced-patterns.md | Enterprise patterns | 11 advanced patterns |
| form-patterns.md | Forms & validation | 5 form patterns |
| common-mistakes-*.md | Error prevention | documented mistakes by category + fixes |
| delegate-architecture.md | Delegates | 8 official delegates |
| pod2-public-api-pattern.md | REST API calls | RestClient, ApiPaths, URL resolution |
| model-paths.md | PodContext model paths | standard paths + subscribe patterns |
| enumerations-reference.md | Framework enumerations | internal enum value sets (⚠ internal ≠ Public-API) |
| hotkey-patterns.md | Keyboard shortcuts | HotKeyManager API + patterns |
| status-icon-control.md | StatusIcon control | SFC status → icon/color mapping |

---

## Version History

- **v1.2.0** (2026-06-19): Added model-paths.md, enumerations-reference.md, hotkey-patterns.md
- **v1.1.0** (2026-04-29): Added pod2-public-api-pattern.md (REST API calling pattern)
- **v1.0.0** (2026-04-18): Initial pattern index created
  - Consolidates patterns from 5 major reference files
  - 400+ lines of organized pattern references
  - Covers all complexity levels (⭐ to ⭐⭐⭐⭐⭐)

See the README changelog for complete version history.
