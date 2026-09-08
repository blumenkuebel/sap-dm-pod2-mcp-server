# ActionContext

`sap.dm.dme.pod2.action.ActionContext`

Contextual information passed to the Action in its execute method.

## Constructor

```
new ActionContext (oWidget, oEvent)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oWidget` | sap.dm.dme.pod2.widget.Widget | No | The widget that triggered the action. |
| `oEvent` | sap.ui.base.Event | No | The SAPUI5 event object passed to the SAPUI5 control's event handler. |

## Members

### event :sap.ui.base.Event

The SAPUI5 event object passed to the SAPUI5 control's event handler.

### widget :sap.dm.dme.pod2.widget.Widget

The widget that triggered the action.

## Methods

### abort ()

Request to abort running all subsequent actions in the sequence.

It is important to know that calling this method does not stop the current action's `execute`
method from running, it simply signals to the event handler that it should not run any more actions in the
sequence beyond the current one.

Asynchronous actions must still resolve their promises to allow the sequence to conclude. If an error
occurs or a promise is rejected, the sequence will be implicitly aborted and an error will be logged.

### isAborted () → {boolean}

Checks if abort has been called.

**Returns:** boolean - boolean
