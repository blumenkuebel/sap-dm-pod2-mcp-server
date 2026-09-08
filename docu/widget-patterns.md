# Widget Patterns Reference

> Content is split into two files for efficient loading — load only what you need.

## Core Patterns ([`widget-patterns-core.md`](widget-patterns-core.md))

All widget type templates needed for standard plugin development:
- **POD 2.0 Custom Controls** (CustomText, CustomVBox, CustomHBox)
- **Timer and Interval Management** 🚨 CRITICAL
- **setPropertyValue() Override** — live property updates
- **ControlWidget Pattern** — single control wrapper
- **EXCLUDE_PROPERTIES** — hiding properties from POD Designer
- **LayoutWidget Pattern** — container widgets
- **TableWidget Complete Pattern** — data tables with selection sync
- **Error Handling & Loading States** — busy indicators, error messages
- **Composite Binding Syntax** — multi-field bindings in tables
- **ContentHandler Pattern** — business logic handlers
- **Widget Categories** — POD Designer categorisation
- **Common Patterns** — shared utilities, model paths, subscribe
- **i18n (Internationalization)** — resource bundles, locale files

## Advanced Patterns ([`widget-patterns-advanced.md`](widget-patterns-advanced.md))

Specialised patterns for specific use cases:
- **SAP DM API Integration** — RestClient, ApiPaths, error handling
- **Custom Widget Events** — custom event definition and propagation
- **EXCLUDE_PROPERTIES and INCLUDE_EVENTS**
- **Growing/Pagination Pattern** — GrowingJSONModel
- **Custom Toolbar Title**
- **Complex Cell Types with Conditional Visibility**
- **ObjectStatus for Status Display**
- **VBox Cell Pattern** — multi-line cells
- **Framework Widget Extension** — FilterableWorkListWidget
- **ComponentWidget Pattern**
- **IntegrationWidget Pattern**
- **Widget Type Selection Guide**

---

> Use `get_pattern_doc({ name: "widget-patterns-core" })` or
> `get_pattern_doc({ name: "widget-patterns-advanced" })` to load content.
