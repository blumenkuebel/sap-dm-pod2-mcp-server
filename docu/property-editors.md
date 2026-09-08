# PropertyEditors & Widget/Action Properties – Complete Reference

## Overview

POD 2.0 plugins can expose **configurable properties** in the POD Designer. These allow administrators to set values (like PPD keys, feature flags, or enum choices) without modifying code.

There are two property systems:
- **`ActionProperty`** – for Action plugins
- **`WidgetProperty`** – for Widget plugins

Each property requires a **PropertyEditor** that defines the UI control shown in the POD Designer configuration panel.

---

## Import Paths

```javascript
// Property Classes
import ActionProperty from "sap/dm/dme/pod2/action/metadata/ActionProperty";
import WidgetProperty from "sap/dm/dme/pod2/widget/metadata/WidgetProperty";

// Property Editors
import StringPropertyEditor from "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor";
import BooleanPropertyEditor from "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor";
import EnumPropertyEditor from "sap/dm/dme/pod2/propertyeditor/EnumPropertyEditor";
```

---

## ActionProperty vs WidgetProperty

| Class | Used In | Import Path |
|-------|---------|-------------|
| `ActionProperty` | Action classes (`extends Action`) | `sap/dm/dme/pod2/action/metadata/ActionProperty` |
| `WidgetProperty` | Widget classes (`extends Widget`) | `sap/dm/dme/pod2/widget/metadata/WidgetProperty` |

⚠️ **Critical:** Never use `ActionProperty` in a Widget or `WidgetProperty` in an Action – they are NOT interchangeable.

### Common API (both classes)

```javascript
new ActionProperty({
    // ✅ i18n via method call — see M2 (no {i18n>...} binding syntax here)
    //    and M32 (widget-scoped key prefix: <widgetShortName>.<key>).
    displayName: this.getI18nText("myWidget.myProperty.label"),
    description: this.getI18nText("myWidget.myProperty.tooltip"),
    propertyEditor: new SomePropertyEditor(this, "propertyKey")
})
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `displayName` | string | Label shown in the property panel (use i18n!) |
| `description` | string | Help text / tooltip (use i18n!) |
| `propertyEditor` | PropertyEditor | The editor instance (see below) |

---

## PropertyEditor Types

### 1. StringPropertyEditor

A text input field. Use for free-text values like PPD keys, API URLs, custom identifiers.

```javascript
import StringPropertyEditor from "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor";

// In getProperties():
new ActionProperty({
    displayName: this.getI18nText("prop.ppd.displayName"),
    description: this.getI18nText("prop.ppd.description"),
    propertyEditor: new StringPropertyEditor(this, "productionProcess")
})
```

**Constructor:** `new StringPropertyEditor(owner, propertyKey)`
- `owner` – `this` (the Action or Widget instance)
- `propertyKey` – string key to store/retrieve the value

**Read value at runtime:**
```javascript
const value = this.getPropertyValue("productionProcess");
```

---

### 2. BooleanPropertyEditor

A checkbox / toggle. Use for feature flags, on/off settings.

```javascript
import BooleanPropertyEditor from "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor";

// In getProperties():
new ActionProperty({
    displayName: this.getI18nText("prop.logDc.displayName"),
    description: this.getI18nText("prop.logDc.description"),
    propertyEditor: new BooleanPropertyEditor(this, "logDcThicknessCollected")
})
```

**Constructor:** `new BooleanPropertyEditor(owner, propertyKey)`

**Read value at runtime:**
```javascript
const isEnabled = !!this.getPropertyValue("logDcThicknessCollected");
```

---

### 3. EnumPropertyEditor

A dropdown / select. Use for fixed choices (e.g. trigger types, modes, categories).

```javascript
import EnumPropertyEditor from "sap/dm/dme/pod2/propertyeditor/EnumPropertyEditor";

// In getProperties():
new ActionProperty({
    displayName: this.getI18nText("prop.triggerType.displayName"),
    description: this.getI18nText("prop.triggerType.description"),
    propertyEditor: new EnumPropertyEditor(this, "triggerType", {
        "Start": "START",
        "Complete": "COMPLETE",
        "SignOff": "SIGNOFF"
    })
})
```

**Constructor:** `new EnumPropertyEditor(owner, propertyKey, enumMap)`
- `enumMap` – Object where keys are display labels and values are stored values

**Read value at runtime:**
```javascript
const triggerType = this.getPropertyValue("triggerType"); // "START", "COMPLETE", or "SIGNOFF"
```

---

## Complete Examples

### Action with Properties

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/EnumPropertyEditor",
    "sap/dm/dme/pod2/model/I18nResourceModel",
], (Action, ActionProperty, StringPropertyEditor, BooleanPropertyEditor, EnumPropertyEditor, I18nResourceModel) => {
    "use strict";

    class MyExecutionAction extends Action {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "myCompany.myPlugin.i18n.i18n"
        });
        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("action.displayName"); }
        static getDescription() { return this.getI18nText("action.description"); }

        async execute(oActionContext) {
            const ppd = this.getPropertyValue("productionProcess");
            const mode = this.getPropertyValue("executionMode");
            const logResults = !!this.getPropertyValue("logResults");
            // ... business logic
        }

        getProperties() {
            return [
                new ActionProperty({
                    displayName: this.getI18nText("prop.ppd.displayName"),
                    description: this.getI18nText("prop.ppd.description"),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                }),
                new ActionProperty({
                    displayName: this.getI18nText("prop.mode.displayName"),
                    description: this.getI18nText("prop.mode.description"),
                    propertyEditor: new EnumPropertyEditor(this, "executionMode", {
                        "Synchronous": "SYNC",
                        "Asynchronous": "ASYNC"
                    })
                }),
                new ActionProperty({
                    displayName: this.getI18nText("prop.log.displayName"),
                    description: this.getI18nText("prop.log.description"),
                    propertyEditor: new BooleanPropertyEditor(this, "logResults")
                })
            ];
        }
    }

    return MyExecutionAction;
});
```

### Widget with Properties

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/model/I18nResourceModel",
], (Widget, WidgetProperty, StringPropertyEditor, I18nResourceModel) => {
    "use strict";

    class MyWidget extends Widget {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "myCompany.myPlugin.i18n.i18n"
        });
        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("myWidget.displayName"); } // See M32 — <widgetName>.* prefix
        static getIcon() { return "sap-icon://table-view"; }
        static getCategory() { return this.getI18nText("myWidget.category"); }
        static getDescription() { return this.getI18nText("myWidget.description"); }

        getProperties() {
            return [
                new WidgetProperty({
                    displayName: this.getI18nText("prop.ppd.displayName"),
                    description: this.getI18nText("prop.ppd.description"),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                })
            ];
        }

        onInit() {
            const ppd = this.getPropertyValue("productionProcess");
            // ... use the configured value
        }

        _createView() { /* ... */ }
        onExit() { /* ... */ }
    }

    return MyWidget;
});
```

---

## Reading Property Values at Runtime

In both Actions and Widgets, use:

```javascript
// Returns the configured value, or undefined if not set
const value = this.getPropertyValue("propertyKey");
```

The property key is the second argument passed to the PropertyEditor constructor.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `ActionProperty` in a Widget | Use `WidgetProperty` instead |
| Using `WidgetProperty` in an Action | Use `ActionProperty` instead |
| Forgetting to import the PropertyEditor | Each editor is a separate module |
| Using hardcoded display names | Always use `this.getI18nText("...")` |
| Missing `this` as first argument to PropertyEditor | Constructor is `new XEditor(this, "key")` |
| Enum values not matching expected backend values | Ensure the values (right side) match exactly what your PPD/API expects |

### 4. IntegerPropertyEditor

For integer number inputs.

```javascript
import IntegerPropertyEditor from "sap/dm/dme/pod2/propertyeditor/IntegerPropertyEditor";

// In getProperties():
new ActionProperty(this, "maxRetries", new IntegerPropertyEditor(this, "maxRetries"))
```

### 5. FloatPropertyEditor

For decimal number inputs.

```javascript
import FloatPropertyEditor from "sap/dm/dme/pod2/propertyeditor/FloatPropertyEditor";

new ActionProperty(this, "threshold", new FloatPropertyEditor(this, "threshold"))
```

### 6. ColorPropertyEditor

For color selection (hex color picker).

```javascript
import ColorPropertyEditor from "sap/dm/dme/pod2/propertyeditor/ColorPropertyEditor";

new WidgetProperty(this, "headerColor", new ColorPropertyEditor(this, "headerColor"))
```

### 7. IconPropertyEditor

For SAPUI5 icon selection (from the icon pool).

```javascript
import IconPropertyEditor from "sap/dm/dme/pod2/propertyeditor/IconPropertyEditor";

new WidgetProperty(this, "statusIcon", new IconPropertyEditor(this, "statusIcon"))
```

### 8. CssSizePropertyEditor

For CSS size values (e.g. "100%", "200px", "auto").

```javascript
import CssSizePropertyEditor from "sap/dm/dme/pod2/propertyeditor/CssSizePropertyEditor";

new WidgetProperty(this, "columnWidth", new CssSizePropertyEditor(this, "columnWidth"))
```

### 9. SelectPropertyEditor

Dropdown selection from a fixed list (similar to EnumPropertyEditor but different API).

```javascript
import SelectPropertyEditor from "sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor";

new WidgetProperty(this, "displayMode", new SelectPropertyEditor(this, "displayMode"))
```

### 10. MultiChoicePropertyEditor

Multi-select from a list of options.

```javascript
import MultiChoicePropertyEditor from "sap/dm/dme/pod2/propertyeditor/MultiChoicePropertyEditor";

new WidgetProperty(this, "visibleColumns", new MultiChoicePropertyEditor(this, "visibleColumns"))
```

### 11. MaterialPropertyEditor

Material master data value help with search.

```javascript
import MaterialPropertyEditor from "sap/dm/dme/pod2/propertyeditor/MaterialPropertyEditor";

new ActionProperty(this, "material", new MaterialPropertyEditor(this, "material"))
```

### 12. ResourcePropertyEditor

Resource value help with search.

```javascript
import ResourcePropertyEditor from "sap/dm/dme/pod2/propertyeditor/ResourcePropertyEditor";

new ActionProperty(this, "resource", new ResourcePropertyEditor(this, "resource"))
```

### 13. WorkCenterPropertyEditor

Work center value help with search.

```javascript
import WorkCenterPropertyEditor from "sap/dm/dme/pod2/propertyeditor/WorkCenterPropertyEditor";

new ActionProperty(this, "workCenter", new WorkCenterPropertyEditor(this, "workCenter"))
```

### 14. OperationActivityPropertyEditor

Operation activity value help.

```javascript
import OperationActivityPropertyEditor from "sap/dm/dme/pod2/propertyeditor/OperationActivityPropertyEditor";

new ActionProperty(this, "operationActivity", new OperationActivityPropertyEditor(this, "operationActivity"))
```

### 15. BindBooleanPropertyEditor

Boolean property with PodContext binding support (value auto-syncs with context path).

```javascript
import BindBooleanPropertyEditor from "sap/dm/dme/pod2/propertyeditor/BindBooleanPropertyEditor";

new WidgetProperty(this, "isVisible", new BindBooleanPropertyEditor(this, "isVisible"))
```

### 16. BindStringPropertyEditor

String property with PodContext binding support (value auto-syncs with context path).

```javascript
import BindStringPropertyEditor from "sap/dm/dme/pod2/propertyeditor/BindStringPropertyEditor";

new WidgetProperty(this, "titlePath", new BindStringPropertyEditor(this, "titlePath"))
```

---

## Complete PropertyEditor Reference

| Editor | Import | Use Case |
|--------|--------|----------|
| StringPropertyEditor | `sap/dm/dme/pod2/propertyeditor/StringPropertyEditor` | Free text input |
| BooleanPropertyEditor | `sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor` | Toggle/checkbox |
| EnumPropertyEditor | `sap/dm/dme/pod2/propertyeditor/EnumPropertyEditor` | Fixed key-value dropdown |
| IntegerPropertyEditor | `sap/dm/dme/pod2/propertyeditor/IntegerPropertyEditor` | Whole numbers |
| FloatPropertyEditor | `sap/dm/dme/pod2/propertyeditor/FloatPropertyEditor` | Decimal numbers |
| ColorPropertyEditor | `sap/dm/dme/pod2/propertyeditor/ColorPropertyEditor` | Color picker |
| IconPropertyEditor | `sap/dm/dme/pod2/propertyeditor/IconPropertyEditor` | Icon selection |
| CssSizePropertyEditor | `sap/dm/dme/pod2/propertyeditor/CssSizePropertyEditor` | CSS dimensions |
| SelectPropertyEditor | `sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor` | Dropdown select |
| MultiChoicePropertyEditor | `sap/dm/dme/pod2/propertyeditor/MultiChoicePropertyEditor` | Multi-select |
| MaterialPropertyEditor | `sap/dm/dme/pod2/propertyeditor/MaterialPropertyEditor` | Material value help |
| ResourcePropertyEditor | `sap/dm/dme/pod2/propertyeditor/ResourcePropertyEditor` | Resource value help |
| WorkCenterPropertyEditor | `sap/dm/dme/pod2/propertyeditor/WorkCenterPropertyEditor` | Work center value help |
| OperationActivityPropertyEditor | `sap/dm/dme/pod2/propertyeditor/OperationActivityPropertyEditor` | Op. activity value help |
| BindBooleanPropertyEditor | `sap/dm/dme/pod2/propertyeditor/BindBooleanPropertyEditor` | Boolean + context binding |
| BindStringPropertyEditor | `sap/dm/dme/pod2/propertyeditor/BindStringPropertyEditor` | String + context binding |
