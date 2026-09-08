# BaseValueHelpInputMixin

`sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin`

**Extends:** [sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin$SelectionChangeEvent](sap.dm.dme.pod2.valuehelp.base.html#.BaseValueHelpInputMixin$SelectionChangeEvent)

**Example:**

```javascript
const IntermediateBaseClass = BaseValueHelpInputMixin(MultiInput);const MyValueHelpMultiInput = IntermediateBaseClass.extend("sap.example.control.MyValueHelpMultiInput", {   ... metadata, constructor, etc.});MyValueHelpMultiInput.prototype.myFunction = function() {   ...};
```

## Constructor

```
new BaseValueHelpInputMixin ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sError` | string | null | No | The error text to be displayed. If falsey, the error will be cleared. |

## Methods

### getInternalModel () → {sap.ui.model.json.JSONModel}

Get the control's internal model used to store suggestion items.

**Returns:** sap.ui.model.json.JSONModel - sap.ui.model.json.JSONModel

### getRequired () → {boolean}

Override to infer required state from the associated label, if one exists. This accounts for scenarios where
the control is put in a mandatory FilterGroupItem, but was not instantiated with `required` set to
true.

**Returns:** boolean - boolean

### setError (sError)

Set (or clear) the error state of the control.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `sError` | string | null | No | The error text to be displayed. If falsey, the error will be cleared. |

### ApplicatorFunction (ParentClass) → {function}

Dynamically creates a subclass of the provided parent augmented with common functions and metadata necessary
for a value help input control.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `ParentClass` | TypeOf.<sap.m.Input> | No | The parent class to be augmented with the value help input mixin. |

**Returns:** function - function

### SelectionChangeHandler (oEvent)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oEvent` | sap.dm.dme.pod2.valuehelp.base.BaseValueHelpInputMixin$SelectionChangeEvent | No |  |
