# Widget Patterns — Core

> Essential widget type templates for POD 2.0 plugin development.
> For API integration, pagination, custom cells, ComponentWidget/IntegrationWidget patterns
> see [`widget-patterns-advanced.md`](widget-patterns-advanced.md).

---

## POD 2.0 Custom Controls (CustomText, CustomVBox, CustomHBox)

POD 2.0 provides custom controls that extend standard SAPUI5 controls with additional styling properties for design-time configuration.

### When to Use Custom Controls

✅ **Use Custom controls when:**
- Widget needs configurable text/background colors
- Widget exposes font styling as properties (fontColor, fontSize, fontFamily)
- Widget needs consistent POD 2.0 styling patterns
- Properties need to update controls dynamically via setPropertyValue()

❌ **Use standard controls when:**
- Simple static display without styling customization
- No styling configuration needed in POD Designer
- Using sap.m.List or sap.m.Table (no custom versions exist)

### Available Custom Controls

**CustomText** - Extends sap.m.Text with styling:
- `backgroundColor` - Background color (hex or CSS color)
- `fontColor` - Text color
- `fontFamily` - Font family (e.g., "Arial", "72")
- `fontSize` - Font size (e.g., "1rem", "14px")
- `fontWeight` - Font weight (e.g., "Normal", "Bold")

**CustomHBox / CustomVBox** - Layout containers with:
- `gap` - CSS gap value (e.g., "5px", "1rem")
- `alignItems` - Flex alignment
- All standard HBox/VBox properties

### Basic Usage Pattern

```javascript
import CustomText from "sap/dm/dme/pod2/control/CustomText";
import CustomVBox from "sap/dm/dme/pod2/control/CustomVBox";
import CustomHBox from "sap/dm/dme/pod2/control/CustomHBox";

class StyledWidget extends Widget {
    PropertyId = Object.freeze({
        BackgroundColor: "backgroundColor",
        FontColor: "fontColor",
        FontSize: "fontSize"
    });
    
    #oText;
    
    static getDefaultConfig() {
        return {
            properties: {
                backgroundColor: "#FFFFFF",
                fontColor: "#000000",
                fontSize: "1rem",
                text: "Styled Text"
            }
        };
    }
    
    _createView() {
        const oConfig = this.getConfig();
        
        this.#oText = new CustomText(oConfig.id + "-text", {
            text: oConfig.properties.text,
            backgroundColor: oConfig.properties.backgroundColor,
            fontColor: oConfig.properties.fontColor,
            fontSize: oConfig.properties.fontSize
        });
        
        return new CustomVBox(oConfig.id, {
            gap: "10px",
            items: [this.#oText]
        });
    }
    
    // Update properties dynamically
    setPropertyValue(sName, vValue) {
        switch (sName) {
            case this.PropertyId.BackgroundColor:
                if (this.#oText) this.#oText.setBackgroundColor(vValue);
                break;
            case this.PropertyId.FontColor:
                if (this.#oText) this.#oText.setFontColor(vValue);
                break;
            case this.PropertyId.FontSize:
                if (this.#oText) this.#oText.setFontSize(vValue);
                break;
        }
        super.setPropertyValue(sName, vValue);
    }
}
```

### Complete Styled Widget Example

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/control/CustomText",
    "sap/dm/dme/pod2/control/CustomVBox",
    "sap/dm/dme/pod2/propertyeditor/ColorPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty"
], (Widget, CustomText, CustomVBox, ColorPropertyEditor, 
    StringPropertyEditor, PropertyCategory, WidgetProperty) => {
    "use strict";
    
    class StyledDisplayWidget extends Widget {
        static getDisplayName() { return "Styled Display"; }
        static getIcon() { return "sap-icon://palette"; }
        
        PropertyId = Object.freeze({
            Text: "text",
            BackgroundColor: "backgroundColor",
            FontColor: "fontColor",
            FontSize: "fontSize",
            FontFamily: "fontFamily",
            FontWeight: "fontWeight"
        });
        
        #oText;
        
        static getDefaultConfig() {
            return {
                properties: {
                    text: "Display Text",
                    backgroundColor: "#F5F5F5",
                    fontColor: "#333333",
                    fontSize: "1.2rem",
                    fontFamily: "72",
                    fontWeight: "Normal"
                }
            };
        }
        
        _createView() {
            const oConfig = this.getConfig();
            if (!oConfig || !oConfig.id) {
                return new CustomVBox({ 
                    items: [new Text({ text: "Config error" })] 
                });
            }
            
            this.#oText = new CustomText(oConfig.id + "-text", {
                text: oConfig.properties.text,
                backgroundColor: oConfig.properties.backgroundColor,
                fontColor: oConfig.properties.fontColor,
                fontSize: oConfig.properties.fontSize,
                fontFamily: oConfig.properties.fontFamily,
                fontWeight: oConfig.properties.fontWeight
            });
            
            return new CustomVBox(oConfig.id, {
                gap: "10px",
                items: [this.#oText]
            });
        }
        
        getProperties() {
            return [
                new WidgetProperty({
                    displayName: "Text",
                    category: PropertyCategory.General,
                    propertyEditor: new StringPropertyEditor(this, this.PropertyId.Text)
                }),
                new WidgetProperty({
                    displayName: "Background Color",
                    category: PropertyCategory.Appearance,
                    propertyEditor: new ColorPropertyEditor(this, this.PropertyId.BackgroundColor)
                }),
                new WidgetProperty({
                    displayName: "Font Color",
                    category: PropertyCategory.Appearance,
                    propertyEditor: new ColorPropertyEditor(this, this.PropertyId.FontColor)
                }),
                new WidgetProperty({
                    displayName: "Font Size",
                    category: PropertyCategory.Appearance,
                    propertyEditor: new StringPropertyEditor(this, this.PropertyId.FontSize)
                })
            ];
        }
        
        setPropertyValue(sName, vValue) {
            if (!this.#oText) return;
            
            switch (sName) {
                case this.PropertyId.Text:
                    this.#oText.setText(vValue);
                    break;
                case this.PropertyId.BackgroundColor:
                    this.#oText.setBackgroundColor(vValue);
                    break;
                case this.PropertyId.FontColor:
                    this.#oText.setFontColor(vValue);
                    break;
                case this.PropertyId.FontSize:
                    this.#oText.setFontSize(vValue);
                    break;
                case this.PropertyId.FontFamily:
                    this.#oText.setFontFamily(vValue);
                    break;
                case this.PropertyId.FontWeight:
                    this.#oText.setFontWeight(vValue);
                    break;
            }
            
            super.setPropertyValue(sName, vValue);
        }
        
        onExit() {
            super.onExit();
            this.#oText = null;
        }
    }
    
    return StyledDisplayWidget;
});
```

### Custom Controls vs Standard Controls

| Feature | CustomText | sap.m.Text |
|---------|------------|------------|
| Basic text display | ✅ | ✅ |
| backgroundColor property | ✅ | ❌ |
| fontColor property | ✅ | ❌ (wrappingType only) |
| fontSize property | ✅ | ❌ |
| fontFamily property | ✅ | ❌ |
| fontWeight property | ✅ | ❌ |
| Design-time styling | ✅ | ❌ |

**Key Difference:** Custom controls expose styling as properties that can be configured in POD Designer, while standard controls require CSS classes.

---

## Timer and Interval Management Pattern 🚨 CRITICAL

When using `setInterval` or `setTimeout` in widgets, **proper cleanup is mandatory** to prevent memory leaks.

### Complete Timer Pattern

```javascript
class TimerWidget extends Widget {
    #nIntervalId;
    #nStartTime;
    #nElapsed = 0;
    #oDisplay;
    
    _createView() {
        const oConfig = this.getConfig();
        if (!oConfig || !oConfig.id) {
            return new VBox({ 
                items: [new Text({ text: "Config error" })] 
            });
        }
        
        this.#oDisplay = new Text({ text: "00:00:00" });
        
        const oButton = new Button({
            text: "Start",
            press: () => this._onToggle()
        });
        
        return new VBox(oConfig.id, {
            items: [this.#oDisplay, oButton]
        });
    }
    
    _onToggle() {
        if (this._isRunning()) {
            this._stopTimer();
        } else {
            this._startTimer();
        }
    }
    
    _startTimer() {
        // 1. Guard: Prevent multiple intervals
        if (this._isRunning()) {
            return;
        }
        
        this.#nStartTime = Date.now();
        
        // 2. Start interval with error handling
        this.#nIntervalId = setInterval(() => {
            try {
                this._updateDisplay();
            } catch (oError) {
                console.error("Timer update error:", oError);
                this._stopTimer();  // Stop on error
            }
        }, 1000);
    }
    
    _stopTimer() {
        if (!this._isRunning()) {
            return;
        }
        
        // 3. CRITICAL: Clear interval
        clearInterval(this.#nIntervalId);
        this.#nIntervalId = undefined;
        
        // Update elapsed time
        this.#nElapsed += Date.now() - this.#nStartTime;
        this.#nStartTime = undefined;
    }
    
    _isRunning() {
        return this.#nIntervalId !== undefined;
    }
    
    _updateDisplay() {
        const nTotal = this.#nElapsed + (Date.now() - this.#nStartTime);
        const nSeconds = Math.floor(nTotal / 1000);
        const nMinutes = Math.floor(nSeconds / 60);
        const nHours = Math.floor(nMinutes / 60);
        
        // Use modulo for correct display
        const sTime = `${nHours.toString().padStart(2, "0")}:${(nMinutes % 60).toString().padStart(2, "0")}:${(nSeconds % 60).toString().padStart(2, "0")}`;
        this.#oDisplay.setText(sTime);
    }
    
    // 4. CRITICAL: Clean up in onExit()
    onExit() {
        super.onExit();
        
        // Stop timer if running
        if (this._isRunning()) {
            this._stopTimer();
        }
        
        // Clear references
        this.#oDisplay = null;
        this.#nIntervalId = null;
        this.#nStartTime = null;
    }
}
```

### Timer Management Critical Rules

✅ **ALWAYS:**
1. Store interval ID in private field (`#nIntervalId`)
2. Clear interval in `onExit()` method
3. Guard against multiple intervals with `_isRunning()` check
4. Handle errors inside interval callback
5. Set interval ID to `undefined` after clearing

❌ **NEVER:**
1. Forget to clear interval in `onExit()` → **Memory leak**
2. Allow multiple intervals to run → **Multiple timers**
3. Skip error handling in callback → **Uncaught exceptions**

### Time Formatting Bug Fix

**❌ WRONG** - Common mistake from production code:
```javascript
_formatTime(nTime) {
    const nSeconds = Math.floor(nTime / 1000);
    const nMinutes = Math.floor(nSeconds / 60);
    const nHours = Math.floor(nMinutes / 60);
    
    // BUG: Shows total minutes, not minutes within hour
    return `${nHours}:${nMinutes}:${nSeconds}`;  // Shows 1:75:135
}
```

**✅ CORRECT** - Use modulo for remainders:
```javascript
_formatTime(nTime) {
    const nSeconds = Math.floor(nTime / 1000);
    const nMinutes = Math.floor(nSeconds / 60);
    const nHours = Math.floor(nMinutes / 60);
    
    // CORRECT: Use modulo for display values
    return `${nHours.toString().padStart(2, "0")}:${(nMinutes % 60).toString().padStart(2, "0")}:${(nSeconds % 60).toString().padStart(2, "0")}`;
}
```

---

## setPropertyValue() Override Pattern for Live Updates

When widget properties need to update controls live (without re-rendering), override `setPropertyValue()`.

### When to Override setPropertyValue

✅ **Override when:**
- Properties control visual appearance (colors, sizes, visibility)
- Properties control content (text, icons, values)
- Want live updates in POD Designer without refresh
- Properties affect control state (enabled/disabled)

❌ **Don't override when:**
- Property only affects data fetching (handle in `onInit`)
- Property only used in API calls (no UI update needed)
- Complete re-render is acceptable

### Complete setPropertyValue Pattern

```javascript
class ConfigurableWidget extends Widget {
    // 1. Define PropertyId enum
    PropertyId = Object.freeze({
        HeaderText: "headerText",
        ShowIcon: "showIcon",
        IconColor: "iconColor",
        BackgroundColor: "backgroundColor"
    });
    
    // 2. Store control references
    #oHeader;
    #oIcon;
    #oContainer;
    
    static getDefaultConfig() {
        return {
            properties: {
                headerText: "Widget Title",
                showIcon: true,
                iconColor: "#007ACC",
                backgroundColor: "#FFFFFF"
            }
        };
    }
    
    _createView() {
        const oConfig = this.getConfig();
        
        this.#oHeader = new Text({
            text: oConfig.properties.headerText
        });
        
        this.#oIcon = new Icon({
            src: "sap-icon://settings",
            color: oConfig.properties.iconColor,
            visible: oConfig.properties.showIcon
        });
        
        this.#oContainer = new VBox(oConfig.id, {
            backgroundColor: oConfig.properties.backgroundColor,
            items: [this.#oHeader, this.#oIcon]
        });
        
        return this.#oContainer;
    }
    
    // 3. Override setPropertyValue
    /**
     * Updates property values at design-time and runtime
     * @override
     * @param {string} sName Property name
     * @param {any} vValue Property value
     */
    setPropertyValue(sName, vValue) {
        // Update controls based on property
        switch (sName) {
            case this.PropertyId.HeaderText:
                if (this.#oHeader) {
                    this.#oHeader.setText(vValue);
                }
                break;
                
            case this.PropertyId.ShowIcon:
                if (this.#oIcon) {
                    this.#oIcon.setVisible(vValue);
                }
                break;
                
            case this.PropertyId.IconColor:
                if (this.#oIcon) {
                    this.#oIcon.setColor(vValue);
                }
                break;
                
            case this.PropertyId.BackgroundColor:
                if (this.#oContainer) {
                    this.#oContainer.setBackgroundColor(vValue);
                }
                break;
        }
        
        // CRITICAL: Call parent to persist value
        super.setPropertyValue(sName, vValue);
    }
    
    // 4. Define properties with editors
    getProperties() {
        return [
            new WidgetProperty({
                displayName: "Header Text",
                category: PropertyCategory.General,
                propertyEditor: new StringPropertyEditor(this, this.PropertyId.HeaderText)
            }),
            new WidgetProperty({
                displayName: "Show Icon",
                category: PropertyCategory.Appearance,
                propertyEditor: new BooleanPropertyEditor(this, this.PropertyId.ShowIcon)
            }),
            new WidgetProperty({
                displayName: "Icon Color",
                category: PropertyCategory.Appearance,
                propertyEditor: new ColorPropertyEditor(this, this.PropertyId.IconColor)
            }),
            new WidgetProperty({
                displayName: "Background Color",
                category: PropertyCategory.Appearance,
                propertyEditor: new ColorPropertyEditor(this, this.PropertyId.BackgroundColor)
            })
        ];
    }
    
    onExit() {
        super.onExit();
        this.#oHeader = null;
        this.#oIcon = null;
        this.#oContainer = null;
    }
}
```

### setPropertyValue Critical Rules

✅ **ALWAYS:**
1. Check control exists (`if (this.#oControl)`)
2. Call `super.setPropertyValue(sName, vValue)` to persist value
3. Use PropertyId enum for property name constants
4. Store control references as private fields
5. Handle all properties defined in `getProperties()`

❌ **NEVER:**
1. Skip null check → Runtime errors if control not created
2. Forget `super.setPropertyValue()` → Value not persisted
3. Use string literals → Typos cause silent failures

### Control Reference Storage Pattern

Store references to controls you need to update dynamically.

```javascript
class DynamicWidget extends Widget {
    // 1. Declare private fields for controls
    #oTitle;
    #oStatusText;
    #oRefreshButton;
    
    _createView() {
        const oConfig = this.getConfig();
        
        // 2. Initialize and store references
        this.#oTitle = new Text({ text: "Widget Title" });
        this.#oStatusText = new Text({ text: "Ready" });
        this.#oRefreshButton = new Button({
            text: "Refresh",
            press: () => this._onRefresh()
        });
        
        // 3. Return view with control references
        return new VBox(oConfig.id, {
            items: [this.#oTitle, this.#oStatusText, this.#oRefreshButton]
        });
    }
    
    // 4. Update controls dynamically
    _onRefresh() {
        this.#oStatusText.setText("Loading...");
        this.#oRefreshButton.setEnabled(false);
        
        // ... fetch data ...
        
        this.#oStatusText.setText("Updated");
        this.#oRefreshButton.setEnabled(true);
    }
    
    // 5. Clean up in onExit
    onExit() {
        super.onExit();
        this.#oTitle = null;
        this.#oStatusText = null;
        this.#oRefreshButton = null;
    }
}
```

**Why This Matters:**
- Enables efficient updates without re-rendering
- Clear ownership and lifecycle
- Better memory management

---

## ControlWidget Pattern (For Single Controls)

> ⚠️ **Framework-internal base class — do NOT extend in custom plugins.** See [Mistake #39](common-mistakes-lifecycle.md#mistake-39-wrong-base-class--layoutwidget-instead-of-widget). The pattern below is retained as **reference material** so you can understand how framework-owned widgets (e.g. `TableWidget`, first-party POD 2.0 widgets) compose internally. For your own single-control wrapper, extend `sap/dm/dme/pod2/widget/Widget` and instantiate the control inside `_createView()` — see the "ButtonWidget rewritten as `extends Widget`" example immediately below, and the Ground-Truth reference plugin `Customer.Coating`.

ControlWidget wraps single SAPUI5 controls. Historically this was presented as the go-to pattern for simple widgets; that guidance is superseded — customer plugins must extend `Widget` and internally compose the desired control (M39). Framework-owned widgets remain on `ControlWidget` for historical reasons; when reading their source, this section explains the shape.

### Recommended pattern for a single-control widget — `extends Widget`

```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/dm/dme/pod2/widget/Widget"
], (Button, Widget) => {
    "use strict";

    /**
     * @alias customer.custom.extensions.example.ButtonWidget
     * @extends sap.dm.dme.pod2.widget.Widget
     */
    class ButtonWidget extends Widget {
        static getDisplayName() {
            return "Button Widget";
        }

        _createView() {
            const oConfig = this.getConfig();
            return new Button(oConfig.id, {
                text: oConfig.properties?.text ?? "Button",
                press: () => this._onPress()
            });
        }

        async onInit() {
            await super.onInit();
        }

        _onPress() {
            // handle press
        }
    }

    return ButtonWidget;
});
```

Notes: the control ID MUST be the first positional constructor argument (`new Button(oConfig.id, {...})`) — see [Mistake #6](common-mistakes-imports.md#mistake-6-missing-view-id-in-_createview) and [Mistake #31](#mistake-31-control-id-must-be-first-constructor-argument). `_createView()` receives NO arguments — read config via `this.getConfig()` — see [Mistake #65](#mistake-65-_createview-receives-no-arguments).

### Framework-internal `ControlWidget` pattern (read-only reference — do NOT copy)

```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/dm/dme/pod2/widget/ControlWidget",
    "sap/dm/dme/pod2/widget/metadata/WidgetCategory",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory"
], (Button, ControlWidget, WidgetCategory, PropertyCategory) => {
    "use strict";

    /**
     * @alias sap.dm.dme.pod2.widget.core.ButtonWidget
     * @extends sap.dm.dme.pod2.widget.ControlWidget
     */
    class ButtonWidget extends ControlWidget {
        static getDisplayName() {
            return "Button Widget";
        }

        static getIcon() {
            return "sap-icon://iphone-2";
        }

        static getCategory() {
            return WidgetCategory.Elements;
        }

        static getDefaultConfig() {
            return {
                properties: {
                    text: this.getDisplayName(),
                    type: "Ghost"  // ButtonType.Ghost
                }
            };
        }

        // Static configuration arrays (optional but recommended)
        static BINDABLE_PROPERTIES = ["text", "enabled", "visible"];
        static INCLUDE_EVENTS = ["press"];
        static EXCLUDE_PROPERTIES = ["somePropertyToHide"];
        static PROPERTY_CATEGORY_OVERRIDE = {
            text: PropertyCategory.Main,
            icon: PropertyCategory.Appearance,
            width: PropertyCategory.Dimension
        };

        /**
         * Constructor - pass SAPUI5 control class to super
         * @param {Object} oConfig
         */
        constructor(oConfig) {
            super(Button, oConfig);  // Pass the control class!
        }

        /**
         * Override for custom initialization
         * @override
         */
        _createView() {
            // Add custom logic before/after
            const oControl = super._createView();
            // Additional setup...
            return oControl;
        }
    }

    return ButtonWidget;
});
```

### Common ControlWidget Types

**Text Display:**
- `TextWidget` - Simple text
- `LabelWidget` - Form labels
- `TitleWidget` - Section titles
- `ExpandableTextWidget` - Collapsible text

**Input:**
- `InputWidget` - Text input
- `TextAreaWidget` - Multi-line input
- `DateTimeTextWidget` - Date/time display

**Buttons:**
- `ButtonWidget` - Standard button
- `MenuButtonWidget` - Button with dropdown

**Visual:**
- `IconWidget` - SAP icons
- `ImageWidget` - Images
- `HTMLWidget` - HTML content
- `IFrameWidget` - Embedded content

### IconWidget Complete Pattern ⭐⭐⭐⭐

**Base**: `sap.dm.dme.pod2.widget.core.IconWidget` | **Wraps**: `sap.ui.core.Icon`

```javascript
import IconWidget from "sap/dm/dme/pod2/widget/core/IconWidget";
import IconColor from "sap/ui/core/IconColor";

class StatusIconWidget extends IconWidget {
    static GOOD_ICON = "sap-icon://accept";
    static BAD_ICON = "sap-icon://error";
    static GOOD_COLOR = IconColor.Positive;
    static BAD_COLOR = IconColor.Negative;
    
    #static = /** @type {typeof StatusIconWidget} */(this.constructor);
    
    static getDefaultConfig() {
        return { properties: { size: "2rem", width: "3rem", height: "3rem" } };
    }
    
    static INCLUDE_PROPERTIES = ["size", "width", "height"];
    static INCLUDE_EVENTS = [];
    
    _createView() {
        const oIcon = /** @type {sap.ui.core.Icon} */ (super._createView());
        oIcon.setColor("white");
        
        if (PodContext.isDesignMode()) {
            this._setView(oIcon);
            this._updateIcon("GOOD");
        }
        
        return oIcon;
    }
    
    async onInit() {
        await super.onInit();
        if (PodContext.isRunMode()) {
            PodContext.subscribe(ModelPath.CurrentOperation, this._onOperationChanged, this);
        }
    }
    
    _updateIcon(sStatus) {
        const oIcon = /** @type {sap.ui.core.Icon} */ (this.getView());
        oIcon.setSrc(sStatus === "GOOD" ? this.#static.GOOD_ICON : this.#static.BAD_ICON);
        oIcon.setBackgroundColor(sStatus === "GOOD" ? this.#static.GOOD_COLOR : this.#static.BAD_COLOR);
        
        if (PodContext.isRunMode()) {
            oIcon.setTooltip(this.getI18nText(`status.${sStatus.toLowerCase()}`));
        }
    }
    
    onExit() {
        super.onExit();
        if (PodContext.isRunMode()) {
            PodContext.unsubscribe(ModelPath.CurrentOperation, this._onOperationChanged, this);
        }
    }
}
```

**IconColor values**: `Positive` (green), `Negative` (red), `Critical` (orange), `Neutral` (grey)

**Common icons**: `accept`, `error`, `alert`, `information`, `connected`, `disconnected`, `status-positive`

---

## EXCLUDE_PROPERTIES - Hiding Properties from POD Designer

Use `static EXCLUDE_PROPERTIES` to prevent certain properties from appearing in POD Designer's property panel. This is a production pattern used extensively in SAP-provided widgets.

### Common Use Cases

1. **Programmatically controlled properties** - Don't expose in designer
2. **Base class properties** - Inherit parent's exclusions
3. **Derived/computed properties** - Set by widget logic, not user

### Pattern

```javascript
class MyProgressWidget extends ProgressIndicatorWidget {
    // These properties are set by widget logic, not user configuration
    static EXCLUDE_PROPERTIES = [ "percentValue", "displayValue" ];
    
    async onInit() {
        await super.onInit();
        // Widget sets these programmatically
        this.getView().setPercentValue(75);
        this.getView().setDisplayValue("75 / 100");
    }
}
```

### Inheriting Parent Exclusions

When extending a specialized base class, spread parent exclusions:

```javascript
class MyImageWidget extends ImageWidget {
    // Inherit parent exclusions + add your own
    static EXCLUDE_PROPERTIES = [ 
        ...ImageWidget.EXCLUDE_PROPERTIES,  // Inherit
        "src",                               // Add your exclusions
        "alt"
    ];
}
```

### Production SAP Examples

**GoodsReceiptQuantityProgressWidget.js**:
```javascript
class GoodsReceiptQuantityProgressWidget extends ProgressIndicatorWidget {
    static EXCLUDE_PROPERTIES = [ "percentValue", "displayValue" ];
}
```

**MaterialImageWidget.js**:
```javascript
class MaterialImageWidget extends ImageWidget {
    static EXCLUDE_PROPERTIES = [ ...ImageWidget.EXCLUDE_PROPERTIES, "src", "alt" ];
}
```

**OrderHeaderTextWidget.js**:
```javascript
class OrderHeaderTextWidget extends ExpandableTextWidget {
    static EXCLUDE_PROPERTIES = [ ...ExpandableTextWidget.EXCLUDE_PROPERTIES, "text" ];
}
```

### Why Exclude Properties?

| Property | Why Exclude | Alternative |
|----------|-------------|-------------|
| `text` | Set by API response | Expose `apiEndpoint` config instead |
| `src` | Computed from data | Expose `imageField` binding config |
| `percentValue` | Calculated value | Expose `targetField`, `actualField` configs |
| `enabled` | Authorization-based | Set programmatically in `onInit()` |

### Example: Exclude vs Expose

```javascript
class DataDisplayWidget extends TextWidget {
    // Don't expose "text" - it comes from API
    static EXCLUDE_PROPERTIES = ["text"];
    
    getProperties() {
        return [
            // Instead, expose configuration for WHERE to get text
            new WidgetProperty({
                displayName: "API Endpoint",
                propertyEditor: new StringPropertyEditor(this, "apiEndpoint")
            })
        ];
    }
    
    async onInit() {
        await super.onInit();
        // Text is set programmatically
        const sText = await this._fetchData();
        this.getView().setText(sText);
    }
}
```

---

## LayoutWidget Pattern (For Containers)

> ⚠️ **Framework-internal base class — do NOT extend in custom plugins.** See [Mistake #39](common-mistakes-lifecycle.md#mistake-39-wrong-base-class--layoutwidget-instead-of-widget). If your custom widget needs to *contain* other widgets (nested drag-drop in POD Designer), that is not currently a customer-plugin capability — layout widgets are framework-owned. For your own multi-control layout, extend `Widget`, instantiate an `sap.m.VBox` / `sap.m.HBox` / `sap.f.GridContainer` inside `_createView()`, and add child controls directly.

LayoutWidget wraps layout containers that hold other widgets. Framework-owned; read the pattern below only to understand framework internals — never copy into a customer plugin.

```javascript
sap.ui.define([
    "sap/m/VBox",
    "sap/dm/dme/pod2/widget/LayoutWidget",
    "sap/dm/dme/pod2/widget/metadata/WidgetCategory"
], (VBox, LayoutWidget, WidgetCategory) => {
    "use strict";

    class VBoxWidget extends LayoutWidget {
        static getDisplayName() {
            return "Vertical Box";
        }

        static getIcon() {
            return "sap-icon://vertical-grip";
        }

        static getCategory() {
            return WidgetCategory.Layout;
        }

        constructor(oConfig) {
            super(VBox, oConfig);  // Pass container class
        }
    }

    return VBoxWidget;
});
```

### Common LayoutWidget Types

- `VBoxWidget`, `HBoxWidget` - Basic boxes
- `FlexBoxWidget` - Flexible layout
- `PanelWidget` - Panel with header
- `DialogWidget` - Modal dialog (Hidden category)
- `ToolbarWidget` - Toolbar
- `SplitterWidget` - Resizable split panes
- `ResponsiveSplitterWidget` - Responsive split panes

---

## TableWidget Complete Pattern (For Complex Tables)

TableWidget is the most complex base class, used for displaying tabular data with columns, sorting, and pagination.

### Required Static Methods

TableWidget requires specific static methods and lifecycle management for proper functionality.

```javascript
class ComponentTableWidget extends TableWidget {
    // 1. Static Field enum (column identifiers)
    static Field = Object.freeze({
        componentSequence: "componentSequence",
        componentAndVersion: "componentAndVersion",
        quantity: "quantity"
    });

    // 2. Define columns (must be static)
    static getFields() {
        return [
            {
                field: this.Field.componentSequence,
                text: "{i18n>columns.sequence}",
                width: "15%"
            },
            {
                field: this.Field.componentAndVersion,
                text: "{i18n>columns.component}",
                width: "25%"
            },
            {
                field: this.Field.quantity,
                text: "{i18n>columns.quantity}",
                width: "15%"
            }
        ];
    }

    // 3. Define default visible columns (must be static)
    static getDefaultFields() {
        return [
            this.Field.componentSequence,
            this.Field.componentAndVersion
        ];
    }
}
```

### Complete Lifecycle Implementation

```javascript
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/dm/dme/pod2/widget/core/TableWidget",
    "sap/dm/dme/pod2/widget/metadata/WidgetCategory",
    "sap/dm/dme/pod2/Logger",
    "sap/m/MessageBox"
], (
    JSONModel,
    ModelPath,
    PodContext,
    ApiClient,
    TableWidget,
    WidgetCategory,
    Logger,
    MessageBox
) => {
    "use strict";

    /**
     * @alias namespace.plugins.components.ComponentTableWidget
     * @extends sap.dm.dme.pod2.widget.core.TableWidget
     */
    class ComponentTableWidget extends TableWidget {
        // Static Field enum
        static Field = Object.freeze({
            componentSequence: "componentSequence",
            componentAndVersion: "componentAndVersion",
            quantity: "quantity"
        });

        // Private fields
        #oLog = Logger.getLogger("namespace.plugins.components.ComponentTableWidget");
        #oModel = new JSONModel([]);

        static getDisplayName() {
            return "Component Table";
        }

        static getIcon() {
            return "sap-icon://product";
        }

        static getCategory() {
            return WidgetCategory.Assembly;  // Assembly operations (component lists, BOM, kitting)
        }

        static getFields() {
            return [
                {
                    field: this.Field.componentSequence,
                    text: "{i18n>columns.sequence}",
                    width: "15%"
                },
                {
                    field: this.Field.componentAndVersion,
                    text: "{i18n>columns.component}",
                    width: "25%"
                },
                {
                    field: this.Field.quantity,
                    text: "{i18n>columns.quantity}",
                    width: "15%"
                }
            ];
        }

        static getDefaultFields() {
            return [
                this.Field.componentSequence,
                this.Field.componentAndVersion
            ];
        }

        constructor(oConfig) {
            super(oConfig);
        }

        async onInit() {
            await super.onInit();
            
            if (PodContext.isRunMode()) {
                this._fetchComponents();
                
                // Subscribe to context changes
                PodContext.subscribe(
                    ModelPath.SelectedOperationActivities,
                    this._onSelectedOperationsChange,
                    this
                );
            }
        }

        // ⚠️ CRITICAL: Always implement onExit()
        onExit() {
            super.onExit(); // TableWidget cleanup
            
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(
                    ModelPath.SelectedOperationActivities,
                    this._onSelectedOperationsChange,
                    this
                );
            }
            
            // Clean up private fields
            this.#oLog = null;
            this.#oModel = null;
        }

        // Required: Return your JSONModel
        _getModel() {
            return this.#oModel;
        }

        // Required: Path to array in model
        _getModelPath() {
            return "/components";
        }

        // Define cell rendering
        _createCell(oColumnConfig) {
            switch (oColumnConfig.field) {
                case ComponentTableWidget.Field.componentSequence:
                    return this._createTextCell(oColumnConfig, "{componentSequence}");
                    
                case ComponentTableWidget.Field.componentAndVersion:
                    // Composite binding - see separate section
                    return this._createTextCell(
                        oColumnConfig,
                        "{component/material} / {component/version}"
                    );
                    
                case ComponentTableWidget.Field.quantity:
                    return this._createTextCell(
                        oColumnConfig,
                        "{quantity/value} {quantity/unitOfMeasure}"
                    );
                    
                default:
                    return this._createTextCell(oColumnConfig, oColumnConfig.field);
            }
        }

        // Data loading with error handling
        async _fetchComponents() {
            const oView = this.getView();
            oView.setBusyIndicatorDelay(0);
            oView.setBusy(true);
            try {
                const oRequest = this._getRequest();
                if (!oRequest) {
                    this._getModel().setProperty(this._getModelPath(), []);
                    return;
                }

                const aComponents = await ApiClient.internal.assembly.getComponents(oRequest);
                this._getModel().setProperty(this._getModelPath(), aComponents);
                this.#oLog.info(`Fetched ${aComponents.length} components`);
                
            } catch (oError) {
                this.#oLog.error("Failed to fetch components", oError);
                MessageBox.error(`Failed to load components: ${oError.message}`);
            } finally {
                oView.setBusy(false);
            }
        }

        // Context change callback with null safety
        _onSelectedOperationsChange(aOperations, sPath) {
            if (!Array.isArray(aOperations)) {
                this.#oLog.warn("Invalid operations received", aOperations);
                return;
            }
            this._fetchComponents();
        }

        // Request builder
        _getRequest() {
            const aSelectedOps = PodContext.getSelectedOperationActivities();
            if (!aSelectedOps || aSelectedOps.length === 0) {
                return null;
            }

            return {
                sfcs: aSelectedOps.map((oOp) => oOp.sfc),
                operations: aSelectedOps.map((oOp) => oOp.operationActivity)
            };
        }
    }

    return ComponentTableWidget;
});
```

### TableWidget Checklist

✅ Static Field enum defined  
✅ Static getFields() implemented  
✅ Static getDefaultFields() implemented  
✅ Private #oModel created as JSONModel  
✅ _getModel() returns private model  
✅ _getModelPath() returns array path  
✅ _createCell() handles all fields  
✅ onInit() calls super.onInit()  
✅ onExit() calls super.onExit() and unsubscribes  
✅ Error handling in async methods  

### TableWidget Helper Methods

TableWidget provides these helper methods for creating cells:

```javascript
// Text cell with binding
_createTextCell(oColumnConfig, vBindPath)

// Identifier cell (clickable object name)
_createIdentifierCell(oColumnConfig, vBindPath)

// Date cell with formatting
_createDateCell(oColumnConfig, vBinding, fnFormatter)

// Quantity bullet chart
_createQuantityBulletChartCell(oBindPaths)
```

---

---

## Error Handling & Loading States Pattern

Always wrap async API calls with try-catch-finally and loading indicators.

### Complete Pattern

```javascript
async _fetchData() {
    const oView = this.getView();
    oView.setBusyIndicatorDelay(0);
    oView.setBusy(true);
    try {
        // 1. Build request with validation
        const oRequest = this._buildRequest();
        if (!oRequest) {
            this._clearData();
            return;
        }

        // 2. Call API
        const aData = await ApiClient.someEndpoint(oRequest);

        // 3. Update model
        this._updateModel(aData);
        this.#oLog.info(`Fetched ${aData.length} items`);

    } catch (oError) {
        // 4. Log and display error
        this.#oLog.error("Failed to fetch data", oError);

        MessageBox.error(
            `Failed to load data: ${oError.message}`,
            { title: "Error" }
        );

    } finally {
        // 5. Always hide loading indicator
        oView.setBusy(false);
    }
}

_buildRequest() {
    const aSelectedOps = PodContext.getSelectedOperationActivities();
    if (!aSelectedOps || aSelectedOps.length === 0) {
        this.#oLog.warn("No operations selected");
        return null;
    }
    return { /* request object */ };
}

_clearData() {
    this._getModel().setProperty(this._getModelPath(), []);
}

_updateModel(aData) {
    this._getModel().setProperty(this._getModelPath(), aData);
}
```

### Error Handling Checklist

✅ try-catch-finally around all async calls
✅ `const oView = this.getView(); oView.setBusyIndicatorDelay(0); oView.setBusy(true);` before API call
✅ `oView.setBusy(false);` in `finally` block
✅ NEVER `this.setBusy(...)` — Widget has no `setBusy()` method
✅ ALWAYS `setBusyIndicatorDelay(0)` to avoid the default 1000ms delay
✅ Null checks before API calls
✅ User-friendly error messages
✅ Logging with context
✅ Clear data on error/null request

See [common-mistakes.md #33](common-mistakes.md#mistake-33-busyindicator-in-actions-via-view-instead-of-sapuicorebusyindicator) for the full rule.

### Common Patterns

**Pattern 1: Handle empty context gracefully**
```javascript
const oContext = PodContext.getSomething();
if (!oContext) {
    this.#oLog.info("No context available, clearing data");
    this._clearData();
    return;
}
```

**Pattern 2: Defensive callback handling**
```javascript
_onContextChange(aItems, sPath) {
    // Validate callback data
    if (!Array.isArray(aItems)) {
        this.#oLog.warn("Invalid items received", aItems);
        return;
    }
    
    if (aItems.length === 0) {
        this._clearData();
        return;
    }
    
    this._fetchData();
}
```

**Pattern 3: API error status codes**
```javascript
catch (oError) {
    if (oError.status === 404) {
        MessageBox.warning("No data found for selected items");
    } else if (oError.status === 403) {
        MessageBox.error("You don't have permission to view this data");
    } else {
        MessageBox.error(`Failed to load data: ${oError.message}`);
    }
    this.#oLog.error("API call failed", oError);
}
```

---

---

## Composite Binding Syntax in TableWidget

Composite bindings combine multiple model properties into one cell.

### Basic Syntax Rules

```javascript
_createCell(oColumnConfig) {
    switch (oColumnConfig.field) {
        case MyWidget.Field.MaterialAndVersion:
            // ✅ CORRECT: Each binding wrapped in {}
            return this._createTextCell(
                oColumnConfig,
                "{material} / {version}"
            );
            
        case MyWidget.Field.FullAddress:
            // ✅ Multiple properties from nested objects
            return this._createTextCell(
                oColumnConfig,
                "{address/street}, {address/city}, {address/country}"
            );
            
        case MyWidget.Field.QuantityWithUOM:
            // ✅ Text between bindings
            return this._createTextCell(
                oColumnConfig,
                "{quantity} {unitOfMeasure}"
            );
    }
}
```

### Common Composite Patterns

**Pattern 1: Material with version**
```javascript
// Data: { material: "MAT-001", version: "v2.0" }
// Binding: "{material} / {version}"
// Result: "MAT-001 / v2.0"
```

**Pattern 2: Name with ID in parentheses**
```javascript
// Data: { name: "Work Center A", id: "WC-123" }
// Binding: "{name} ({id})"
// Result: "Work Center A (WC-123)"
```

**Pattern 3: Nested object properties**
```javascript
// Data: { component: { material: "COMP-X", version: "1.0" } }
// Binding: "{component/material} v{component/version}"
// Result: "COMP-X v1.0"
```

**Pattern 4: Multiple nested levels**
```javascript
// Data: { order: { sfc: { name: "SFC-001" }, operation: { name: "OP-10" } } }
// Binding: "{order/sfc/name} @ {order/operation/name}"
// Result: "SFC-001 @ OP-10"
```

### ❌ Common Mistakes

**Mistake 1: Missing braces around bindings**
```javascript
// ❌ WRONG - will display literal text
"{material} / version"  // Shows: "MAT-001 / version"

// ✅ CORRECT
"{material} / {version}"  // Shows: "MAT-001 / v2.0"
```

**Mistake 2: Typo in composite binding (missing brace)**
```javascript
// ❌ WRONG - parsing error
"{material / {version}"  // Error!

// ✅ CORRECT
"{material} / {version}"
```

**Mistake 3: Using wrong separator**
```javascript
// Context: Path separator in nested objects
"{component.material}"   // ❌ Wrong separator
"{component/material}"   // ✅ Correct
```

### When to Use Composite Bindings

- ✅ Combining related data in one column
- ✅ Adding context (units, versions, IDs)
- ✅ Human-readable combinations
- ❌ Don't use for complex formatting (use formatters instead)
- ❌ Don't use for calculations (use computed properties)

---

---


        // Context change callback with null safety
        _onSelectedOperationsChange(aOperations, sPath) {
            if (!Array.isArray(aOperations)) {
                this.#oLog.warn("Invalid operations received", aOperations);
                return;
            }
            this._fetchComponents();
        }

        // Request builder
        _getRequest() {
            const aSelectedOps = PodContext.getSelectedOperationActivities();
            if (!aSelectedOps || aSelectedOps.length === 0) {
                return null;
            }

            return {
                sfcs: aSelectedOps.map((oOp) => oOp.sfc),
                operations: aSelectedOps.map((oOp) => oOp.operationActivity)
            };
        }
    }

    return ComponentTableWidget;
});
```

### TableWidget Checklist

✅ Static Field enum defined  
✅ Static getFields() implemented  
✅ Static getDefaultFields() implemented  
✅ Private #oModel created as JSONModel  
✅ _getModel() returns private model  
✅ _getModelPath() returns array path  
✅ _createCell() handles all fields  
✅ onInit() calls super.onInit()  
✅ onExit() calls super.onExit() and unsubscribes  
✅ Error handling in async methods  

### TableWidget Helper Methods

TableWidget provides these helper methods for creating cells:

```javascript
// Text cell with binding
_createTextCell(oColumnConfig, vBindPath)

// Identifier cell (clickable object name)
_createIdentifierCell(oColumnConfig, vBindPath)

// Date cell with formatting
_createDateCell(oColumnConfig, vBinding, fnFormatter)

// Quantity bullet chart
_createQuantityBulletChartCell(oBindPaths)
```

---

---

## ContentHandler Pattern (Business Logic)

ContentHandlers encapsulate complex business logic without UI. Used for form processing, dialogs, and workflows.

```javascript
sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/ui/model/json/JSONModel",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/dm/dme/pod2/Logger",
    "sap/dm/dme/pod2/context/MessageHistory"
], (Dialog, Button, ButtonType, JSONModel, PodContext, ApiClient, Logger, MessageHistory) => {
    "use strict";

    /**
     * @alias sap.dm.dme.pod2.widget.custom.MyContentHandler
     */
    class MyContentHandler {
        #oModel = new JSONModel();
        #oDialog;
        #oLog = Logger.getLogger("sap.dm.dme.pod2.widget.custom.MyContentHandler");

        /**
         * Opens the content as a dialog
         * @param {Object} oData
         */
        async openAsDialog(oData) {
            this.#oModel.setData(oData);

            const oDialog = new Dialog({
                title: "My Dialog",
                content: [this._createForm()],
                buttons: [
                    new Button({
                        text: "Confirm",
                        type: ButtonType.Emphasized,
                        press: () => this._onConfirm()
                    }),
                    new Button({
                        text: "Cancel",
                        press: () => oDialog.close()
                    })
                ],
                afterClose: () => oDialog.destroy()
            });

            this.#oDialog = oDialog;
            oDialog.setModel(this.#oModel);
            oDialog.open();
        }

        _createForm() {
            // Create form controls
        }

        async _onConfirm() {
            const oData = this.#oModel.getData();

            try {
                await ApiClient.custom.post("/myEndpoint", oData);
                MessageHistory.toast({
                    message: "Success",
                    type: MessageHistory.Success
                });
            } catch (oError) {
                this.#oLog.error("Error", oError);
                MessageHistory.showError("Operation failed");
            }

            this.#oDialog.close();
        }
    }

    return MyContentHandler;
});
```

---

## Widget Categories

Available categories from `WidgetCategory`:
- `Elements` - Basic UI elements (buttons, inputs, text)
- `Layout` - Layout containers (panels, boxes, dialogs)
- `WorkList` - Work list related widgets
- `Order` - Order-related widgets
- `SFC` - Shop Floor Control widgets
- `DataCollection` - Data collection widgets
- `QuantityConfirmation` - Quantity reporting
- `ActivityConfirmation` - Activity confirmation
- `Assembly` - Assembly/component widgets
- `GoodsReceipt` - Goods receipt widgets
- `Hidden` - Not shown in widget palette (for DialogWidget, etc.)

---

## Common Patterns

> For PodContext subscribe, ModelPath constants, and unsubscribe lifecycle — see
> [`subscribe-patterns.md`](subscribe-patterns.md) (the authoritative reference).
> The patterns below cover API calls and table display only.

**Pattern: Button that Calls Custom API**
```javascript
async _onLoadData() {
    const oView = this.getView();
    oView.setBusyIndicatorDelay(0);
    oView.setBusy(true);
    try {
        const oData = await ApiClient.custom.post("/myEndpoint", {
            plant: PodContext.getPlant(),
            resource: PodContext.get(ModelPath.FilterResources)?.[0]?.resource
        });
        MessageHistory.toast({ message: "Success", type: MessageHistory.Success });
    } catch (oError) {
        Logger.error("Load failed", oError);
        MessageHistory.showError("Failed to load data");
    } finally {
        oView.setBusy(false);
    }
}
```

**Pattern: Simple Table Display**
```javascript
_updateTable(aItems) {
    this._oTable.removeAllItems();
    aItems.forEach(item => {
        this._oTable.addItem(new ColumnListItem({
            cells: [
                new Text({ text: item.name }),
                new Text({ text: item.status })
            ]
        }));
    });
}
```

---

## i18n (Internationalization) Pattern

POD 2.0 framework automatically loads i18n models - widgets provide static `getI18nModel()` and use inherited methods.

**CRITICAL**: Do NOT manually load ResourceBundle/ResourceModel — framework handles this once you register the model in `onInit()` via `getPodRuntime().getView().setModel(...)` ([Mistake #35](common-mistakes-lifecycle.md#mistake-35-missing-i18ncustommodel-registration-in-oninit)).

### Complete i18n Implementation

**Pattern from SAP Production Code** (adapted to `extends Widget` per [Mistake #39](common-mistakes-lifecycle.md#mistake-39-wrong-base-class--layoutwidget-instead-of-widget)):

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetCategory",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/model/I18nResourceModel",  // ← Framework i18n model
    "sap/dm/dme/pod2/context/PodContext",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/MessageToast"
], (
    ControlWidget,
    WidgetCategory,
    WidgetProperty,
    StringPropertyEditor,
    I18nResourceModel,
    PodContext,
    Button,
    VBox,
    Label,
    MessageToast
) => {
    "use strict";

    /**
     * Example widget with framework-driven i18n
     * @alias mycompany.widget.I18nExampleWidget
     * @extends sap.dm.dme.pod2.widget.Widget
     */
    class I18nExampleWidget extends Widget {

        // ✅ STEP 1: Define static private i18n model
        static #oI18nModel = new I18nResourceModel({
            bundleName: "mycompany.widget.i18n.i18n"  // Namespace with dots!
        });

        // ✅ STEP 2: Static getter for framework
        // Framework calls this during widget registration and loads the model
        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "i18n Example Widget";
        }

        static getIcon() {
            return "sap-icon://globe";
        }

        static getCategory() {
            return WidgetCategory.Elements;
        }

        static getDefaultConfig() {
            return {
                properties: {
                    customMessage: "Hello World"
                }
            };
        }

        async onInit() {
            await super.onInit();
            // ✅ STEP 2b (M35): Register the i18n model on the view under the per-widget name
            // Model name = "i18n" + PascalCase widget short name — see M35 for multi-widget plugins.
            this.getPodRuntime().getView().setModel(
                I18nExampleWidget.getI18nModel(),
                "i18nI18nExample"
            );
        }

        // ✅ STEP 3: Use inherited getI18nText() method
        getProperties() {
            return [
                new WidgetProperty({
                    // Use inherited method - no manual loading!
                    displayName: this.getI18nText("property.customMessage"),
                    description: this.getI18nText("property.customMessage.description"),
                    category: "Main",
                    propertyEditor: new StringPropertyEditor(this, "customMessage")
                })
            ];
        }

        // ✅ STEP 4: Use inherited getI18nText() in UI creation
        // CRITICAL: ALWAYS use method calls in _createView() - binding syntax doesn't work!
        _createView() {
            const oConfig = this.getConfig();

            return new VBox(oConfig.id, {
                items: [
                    // ✅ CORRECT: Use inherited getI18nText() method
                    new Label({ 
                        text: this.getI18nText("label.welcome") 
                    }),
                    
                    // ✅ CORRECT: Use method call, not binding
                    new Button({
                        text: this.getI18nText("button.submit"),  // Method call!
                        press: () => this._onButtonPress()
                    }),
                    
                    // ✅ CORRECT: With parameters
                    new Label({ 
                        text: this.getI18nText("label.itemCount", [5]) 
                    })
                ]
            });
        }

        _onButtonPress() {
            // Use inherited method
            const sSuccess = this.getI18nText("message.success");
            MessageToast.show(sSuccess);
            
            // Alternative: Use PodContext static method
            const sAlternative = PodContext.getI18nText("message.alternative");
            console.log(sAlternative);
        }
    }

    return I18nExampleWidget;
});
```

### How to Use i18n - CRITICAL Rules

**🚨 CRITICAL: NEVER use binding syntax `"{i18n>key}"` during `_createView()`!**

The i18n model is NOT available during view creation, so binding syntax will fail silently or cause errors.

#### ✅ CORRECT: Use Method Calls (ALWAYS)

POD 2.0 provides two methods for using internationalized text:

#### Method 1: Inherited `this.getI18nText()` (Recommended for widgets)

```javascript
// ✅ CORRECT: Available anywhere in widget instance
const sText = this.getI18nText("myWidget.greeting");
const sWithParams = this.getI18nText("myWidget.title", [arg1, arg2]);

// ✅ CORRECT: In _createView()
_createView() {
    return new Button({
        text: this.getI18nText("button.submit")  // Method call works!
    });
}
```

**Use when:** You're inside widget instance methods (including `_createView()`)

#### Method 2: Static `PodContext.getI18nText()`

```javascript
// ✅ CORRECT: Static method, works anywhere
const sText = PodContext.getI18nText("myWidget.error");
const sWithParams = PodContext.getI18nText("myWidget.message", [count]);
```

**Use when:** You need i18n in static methods or outside widget context

#### ❌ WRONG: Binding Syntax During View Creation

```javascript
// ❌ WRONG: This does NOT work in _createView()!
_createView() {
    return new Button({
        text: "{i18n>button.submit}"  // Model not available yet!
    });
}
```

**Why this fails:** The i18n model isn't registered until AFTER `_createView()` completes, so bindings fail to resolve.

#### ⚠️ Binding Syntax MAY Work After onInit() (Not Recommended)

Binding syntax `"{i18n>key}"` might work for controls created dynamically AFTER `onInit()`, but:
- **Method calls are safer and more consistent**
- **Always works, regardless of timing**
- **No dependency on model availability**

**Bottom line:** Always use method calls (`this.getI18nText()` or `PodContext.getI18nText()`)

### File Structure

**Required folder structure:**

```
mycompany/                        # Your namespace folder
├── extension.json
├── widget/
│   └── I18nExampleWidget.js
└── i18n/                         # ✅ i18n folder at namespace root
    ├── i18n.properties           # Default (English)
    ├── i18n_en.properties        # English (explicit)
    ├── i18n_de.properties        # German
    └── i18n_fr.properties        # French
```

### i18n.properties File Example

**i18n.properties** (Default - English):

```properties
# Widget metadata trio — See M32: use <widgetName>.* prefix, NOT widget.*
i18nExample.displayName=My Widget
i18nExample.description=Example widget with internationalization
i18nExample.category=CUSTOM

# Properties
property.customMessage=Custom Message
property.customMessage.description=Enter a custom message to display

# Labels
label.welcome=Welcome to the Widget
label.itemCount=You have {0} items

# Button Labels
button.submit=Submit
button.cancel=Cancel
button.delete=Delete

# Messages
message.success=Operation completed successfully
message.error=An error occurred
message.alternative=Alternative message text
```

**i18n_de.properties** (German):

```properties
# Widget metadata trio — See M32: use <widgetName>.* prefix, NOT widget.*
i18nExample.displayName=Mein Widget
i18nExample.description=Beispiel-Widget mit Internationalisierung
i18nExample.category=CUSTOM

# Properties
property.customMessage=Benutzerdefinierte Nachricht
property.customMessage.description=Geben Sie eine benutzerdefinierte Nachricht ein

# Labels
label.welcome=Willkommen zum Widget
label.itemCount=Sie haben {0} Elemente

# Button Labels
button.submit=Absenden
button.cancel=Abbrechen
button.delete=Löschen

# Messages
message.success=Vorgang erfolgreich abgeschlossen
message.error=Ein Fehler ist aufgetreten
message.alternative=Alternativer Meldungstext
```

### Parameters in i18n Text

Use `{0}`, `{1}`, etc. for dynamic values:

```javascript
// In i18n.properties:
// message.itemsSelected={0} item(s) selected out of {1} total

_showSelectionCount(iSelected, iTotal) {
    const sMessage = this.getI18nText("message.itemsSelected", [iSelected, iTotal]);
    // Result: "5 item(s) selected out of 20 total"
    MessageToast.show(sMessage);
}
```

### Common Usage Patterns

**Pattern 1: Property Editor Labels**

```javascript
getProperties() {
    return [
        new WidgetProperty({
            displayName: this.getI18nText("property.apiEndpoint"),
            description: this.getI18nText("property.apiEndpoint.description"),
            category: "Main",
            propertyEditor: new StringPropertyEditor(this, "apiEndpoint")
        })
    ];
}
```

**Pattern 2: Dynamic Messages**

```javascript
async _loadData() {
    try {
        const oData = await ApiClient.custom.get("/data");
        const sSuccess = this.getI18nText("message.success");
        MessageToast.show(sSuccess);
    } catch (error) {
        const sError = this.getI18nText("message.error");
        MessageBox.error(sError);
    }
}
```

**Pattern 3: Binding in Controls**

```javascript
_createView() {
    return new VBox(this.getConfig().id, {
        items: [
            new Label({ text: "{i18n>label.username}" }),
            new Input({ placeholder: "{i18n>label.placeholder}" }),
            new Button({
                text: "{i18n>button.save}",
                press: () => this._onSave()
            })
        ]
    });
}
```

### Locale Detection

`I18nResourceModel` automatically detects user locale from browser settings. The loading order is:

1. `i18n_de_DE.properties` (exact locale match)
2. `i18n_de.properties` (language match)
3. `i18n.properties` (fallback/default)

No additional configuration needed - framework handles this automatically!

### Critical Rules

✅ **DO:**
- Define static `getI18nModel()` returning `I18nResourceModel`
- Use inherited `this.getI18nText(key, params)` method
- Use `PodContext.getI18nText(key, params)` for static contexts
- Use binding syntax `"{i18n>key}"` in controls
- Place i18n folder at namespace root
- Use dot notation for bundleName: `"namespace.i18n.i18n"`

❌ **DON'T:**
- Manually load ResourceBundle or ResourceModel
- Create custom `_loadI18n()` methods
- Store `_oResourceBundle` instance variables
- Load in `onInit()` - framework already loaded it!
- Use slash notation: `"namespace/i18n/i18n"`

### Troubleshooting

**Issue**: "this.getI18nText is not a function"
**Solution**: Ensure you defined static `getI18nModel()` returning `I18nResourceModel`. Framework calls this during registration.

**Issue**: Resource bundle not found (404 error)
**Solution**: Verify bundleName matches namespace structure with dots: `"mycompany.widget.i18n.i18n"` and i18n folder exists at namespace root.

**Issue**: Text shows as key (e.g., "button.text" instead of "Click Me")
**Solution**: Check i18n.properties file syntax and ensure key exists. Use browser console to verify bundle loaded.

### See Also

- [Production Patterns: i18n from SAP Code](production-patterns-sap.md)
- **SAPUI5 Documentation**: I18nResourceModel API Reference

---

