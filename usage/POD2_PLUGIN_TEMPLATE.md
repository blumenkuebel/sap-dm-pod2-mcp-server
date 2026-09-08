# POD 2.0 Plugin – Request Template

---

## Plugin

| Field | Value |
|-------|-------|
| **Name**        | `___` _(PascalCase, e.g. ProcessLot, Weighing)_ |
| **Namespace**   | `___` _(e.g. customer.custom.extension.processlot)_ |
| **Description** | `___` |
| **Category**    | `___` _(POD Designer grouping label – the collective name shared by your plugins, e.g. `Customer`, `Acme Corp`, `Customer Extensions`. Used verbatim as the i18n value `widget.category`.)_ |

## Widget _(optional – omit this section for an action-only plugin)_

<!-- Free-form bullets: layout, controls, user interaction, behavior. One bullet per thought. -->

- 

**Sample data** _(optional – PodContext / REST response shape the widget consumes)_:
```json

```

## Actions _(zero or more – duplicate the `### Action: ___` block per action)_ OR ## Actions --> no action required - widget only

### Action: `___` <!-- e.g. Validate, Execute, Cancel, Reset -->

<!-- Free-form bullets: trigger, logic, inputs, outputs, side effects. One bullet per thought. -->

- 

**Sample payload** _(optional – request and/or response)_:
```json

```

---

_Template v2.1 · sap-dm-pod2-mcp-server v1.0.0 · capability-composable, free-form actions_