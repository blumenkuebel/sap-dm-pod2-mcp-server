# MultipleRoutingDialog

`sap.dm.dme.pod2.action.sfc.dialog.MultipleRoutingDialog`

**Extends:** [sap.dm.dme.pod2.action.sfc.dialog.RoutingDialog](sap.dm.dme.pod2.action.sfc.dialog.RoutingDialog.md)

## Constructor

```
new MultipleRoutingDialog ()
```

## Members

### _aRoutingSteps :Array.<sap.dm.dme.pod2.api.internal.product.RoutingStep>

### _fnComplete :function|undefined

### _oCompleteSfcRequest :sap.dm.dme.pod2.api.execution.CompleteSfcRequest

### _oDialog :sap.m.Dialog|null

### _oSfcSelect :sap.m.Select|undefined

### _oTable :sap.m.Table|undefined

## Methods

### _createCells () → {Array.<sap.ui.core.Control>}

Creates the cells for each column in the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.ui.core.Control> - Array.<sap.ui.core.Control>

### _createColumns () → {Array.<sap.m.Column>}

Creates the columns for the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.m.Column> - Array.<sap.m.Column>

### _createContent () → {Array.<sap.ui.core.Control>}

Creates the dialog contents. This calls the _createTable method to create the Table control for the contents.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Array.<sap.ui.core.Control> - Array.<sap.ui.core.Control>

### _createDialog () → {sap.m.Dialog}

Creates the dialog.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Dialog - sap.m.Dialog

### _createTable () → {sap.m.Table}

Creates a Table control containing the next steps.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Table - sap.m.Table

### _createTableHeaderToolbar () → {sap.m.Toolbar}

Creates the toolbar that goes into the header section of the table.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** sap.m.Toolbar - sap.m.Toolbar

### _onAfterDialogClose (oEvent)

Handles when the dialog is closed.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Dialog$AfterCloseEvent | No | The dialog's after close event. |

### _onCancelButtonPress (oEvent)

Handles the press event of the Cancel button.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Button$PressEvent | No | The button press event. |

### _onCompleteButtonPress (oEvent)

Handles the press event of the Complete button.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.m.Button$PressEvent | No | The button press event. |

### (async) show () → {Promise.<boolean>}

Shows the dialog. The caller should await the promise returned by this method and check the return value to
determine if the SFC complete should be retried with the updated request object.

🔧 This method may be overridden by custom subclasses.

🔧 This method may be overridden by custom subclasses.

**Returns:** Promise.<boolean> - Promise.<boolean>
