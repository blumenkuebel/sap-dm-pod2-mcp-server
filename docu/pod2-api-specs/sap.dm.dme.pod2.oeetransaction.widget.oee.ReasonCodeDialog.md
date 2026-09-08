# ReasonCodeDialog

`sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCodeDialog`

Dialog for selecting a reason code for a downtime record.

## Constructor

```
new ReasonCodeDialog (oOptions)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCodeDialog.ConfirmHandler | No | Callback invoked when user confirms reason code selection |
| `cancel` | sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCodeDialog.CancelHandler | Yes | Callback invoked when user cancels the dialog |
| `error` | sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCodeDialog.ErrorHandler | Yes | Callback invoked when an error occurs |
| `timeElementType` | string | Yes | The time element type reference to filter reason codes (e.g., "SCHED_DOWN" or "UNSCD_DOWN"). |
| `resource` | string | Yes | The resource name, used for the optimized reason code fetch when the feature flag is enabled. |

## Members

### TimeElementType :Enum.<string>

Time element type constants

## Methods

### _createColumns () → {Array.<sap.ui.table.Column>}

Creates the columns for the TreeTable.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.ui.table.Column> - Array.<sap.ui.table.Column>

### (async) _createContent () → {Promise.<sap.ui.table.TreeTable>}

Creates the content for the dialog.
The content is by default a TreeTable created with the #createTreeTable method.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Promise.<sap.ui.table.TreeTable> - Promise.<sap.ui.table.TreeTable>

### _createDialog () → {sap.m.Dialog}

Creates the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Dialog - sap.m.Dialog

### _getModel () → {sap.ui.model.json.JSONModel}

Gets the model for the dialog.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### _getTreeTable () → {sap.ui.table.TreeTable}

Gets the tree table instance

**Returns:** sap.ui.table.TreeTable - sap.ui.table.TreeTable

### _onAfterDialogClose ()

Handles when the dialog is closed.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

### CancelHandler ()

### ConfirmHandler (oSelectedReasonCode)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oSelectedReasonCode` | sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCode | No |  |

### ErrorHandler (sErrorMessage)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sErrorMessage` | string | No | The error message |
