# Widget Patterns — Advanced

> Advanced and specialised patterns: REST API integration, custom events,
> pagination, complex table cells, ComponentWidget, IntegrationWidget, Framework Widget Extension.
> For the core widget type templates (ControlWidget, LayoutWidget, TableWidget, ContentHandler, i18n)
> see [`widget-patterns-core.md`](widget-patterns-core.md).

---

## SAP DM API Integration Pattern

POD widgets can call any of the 77+ SAP Digital Manufacturing REST APIs for production operations, material management, quality, inventory, and more.

### API Reference

📖 **Complete API Reference**: [sapdm-api-reference.md](sapdm-api-reference.md)  
📖 **API Specifications**: [sap-dm-api-specs/](sap-dm-api-specs/)

### Authentication & Base URL Pattern

All SAP DM APIs use OAuth 2.0. PodContext provides token and service registry:

```javascript
const oContext = PodContext.getContext();
const sToken = oContext.token;                           // OAuth 2.0 Bearer token
const sPlant = oContext.plant;                           // Current plant
const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc"); // Get API base URL
```

### Common API Categories

**Production APIs:**
- **SFC (Shop Floor Control)**: Start, complete, serialize, split, merge SFCs
- **Order**: Find orders, release for production, update custom values
- **Activity/Quantity Confirmation**: Confirm labor, yield, scrap, rework
- **Assembly**: Assemble/unassemble components to SFCs

**Material & BOM APIs:**
- **Material**: Create, search, update materials with routing, BOM, storage locations
- **BOM**: Define material components required for production
- **Batch**: Manage material batches and traceability

**Quality & Data Collection APIs:**
- **Data Collection**: Log parameter values at manufacturing process points
- **Quality Inspection**: Create and manage quality inspections for SFCs
- **Nonconformance**: Report and manage defects/issues

**Inventory & Logistics APIs:**
- **Inventory**: Manage inventory levels, locations, movements
- **Staging**: Stage materials for production operations
- **WIP**: Track work in process inventory

### API Call Pattern (Fetch)

```javascript
import PodContext from "sap/dm/dme/pod2/context/PodContext";
import MessageToast from "sap/m/MessageToast";

class MyApiWidget extends Widget {
    
    /**
     * Fetch SFC details from SAP DM SFC API
     * @param {string} sSfc - SFC number
     * @returns {Promise<Object>} SFC details
     */
    async _fetchSfcDetails(sSfc) {
        const oContext = PodContext.getContext();
        const sPlant = oContext.plant;
        const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
        const sUrl = `${sBaseUrl}/sfcs?plant=${sPlant}&sfc=${sSfc}`;
        
        try {
            const oResponse = await fetch(sUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oContext.token}`
                }
            });
            
            if (!oResponse.ok) {
                const oError = await oResponse.json();
                throw new Error(oError.message || `HTTP ${oResponse.status}`);
            }
            
            return await oResponse.json();
            
        } catch (oError) {
            console.error("Failed to fetch SFC details:", oError);
            MessageToast.show(this.getI18nText("api.error.sfc"));
            throw oError;
        }
    }
    
    /**
     * Start SFCs at operation
     * @param {Array<string>} aSfcs - SFC numbers to start
     * @param {string} sOperation - Operation activity
     * @param {string} sResource - Resource name
     * @returns {Promise<Object>} Start response
     */
    async _startSfcs(aSfcs, sOperation, sResource) {
        const oContext = PodContext.getContext();
        const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
        
        const oRequest = {
            plant: oContext.plant,
            sfcs: aSfcs.map(sSfc => ({ sfc: sSfc })),
            operationActivity: sOperation,
            resource: sResource
        };
        
        try {
            const oResponse = await fetch(`${sBaseUrl}/sfcs/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oContext.token}`
                },
                body: JSON.stringify(oRequest)
            });
            
            if (!oResponse.ok) {
                throw new Error(`Start failed: HTTP ${oResponse.status}`);
            }
            
            return await oResponse.json();
            
        } catch (oError) {
            console.error("Failed to start SFCs:", oError);
            throw oError;
        }
    }
}
```

### API Call Pattern (jQuery Ajax - SAPUI5 Standard)

```javascript
import PodContext from "sap/dm/dme/pod2/context/PodContext";

class MyApiWidget extends Widget {
    
    /**
     * Log data collection values
     * @param {Object} oData - Data collection request
     * @returns {Promise<Object>} Log response
     */
    _logDataCollection(oData) {
        const oContext = PodContext.getContext();
        const sUrl = `${oContext.serviceRegistry.getApiUrl("datacollection")}/log`;
        
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                url: sUrl,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oData),
                headers: {
                    "Authorization": `Bearer ${oContext.token}`
                },
                success: (oResponse) => {
                    console.log("Data collection logged:", oResponse);
                    resolve(oResponse);
                },
                error: (oError) => {
                    console.error("Data collection failed:", oError);
                    reject(oError);
                }
            });
        });
    }
}
```

### Complete API Widget Example

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/dm/dme/pod2/model/I18nResourceModel"
], (Widget, PodContext, ModelPath, VBox, Input, Button, Text, MessageToast, I18nResourceModel) => {
    "use strict";
    
    /**
     * Widget that fetches SFC details from SAP DM API
     */
    class SfcDetailsWidget extends Widget {
        
        // Static i18n model
        static #oI18nModel = new I18nResourceModel({
            bundleName: "custom.pod2.sfcdetails.i18n.i18n"
        });
        
        static getI18nModel() {
            return this.#oI18nModel;
        }
        
        static getDisplayName() {
            return "SFC Details Widget";
        }
        
        static getIcon() {
            return "sap-icon://product";
        }
        
        constructor(oConfig) {
            super(Widget, oConfig);
            this._oSfcInput = null;
            this._oResultText = null;
        }
        
        /**
         * Create widget view
         */
        _createView() {
            this._oSfcInput = new Input({
                placeholder: this.getI18nText("sfcDetails.input.placeholder"),
                width: "15rem"
            });
            
            const oFetchButton = new Button({
                text: this.getI18nText("sfcDetails.button.fetch"),
                press: () => this._onFetchSfc()
            });
            
            this._oResultText = new Text({
                text: ""
            });
            
            return new VBox({
                items: [
                    this._oSfcInput,
                    oFetchButton,
                    this._oResultText
                ],
                class: "sapUiSmallMargin"
            });
        }
        
        /**
         * Initialize widget - subscribe to context
         */
        async onInit() {
            await super.onInit();
            
            // Subscribe to selected SFC changes
            this.subscribe(ModelPath.SelectedSfc, this._onSfcSelected.bind(this));
        }
        
        /**
         * Handle selected SFC change
         */
        _onSfcSelected(sSfc, sPath) {
            if (sSfc) {
                this._oSfcInput.setValue(sSfc);
                this._onFetchSfc();
            }
        }
        
        /**
         * Fetch SFC details from API
         */
        async _onFetchSfc() {
            const sSfc = this._oSfcInput.getValue();
            
            if (!sSfc) {
                MessageToast.show(this.getI18nText("sfcDetails.error.noSfc"));
                return;
            }
            
            try {
                const oData = await this._fetchSfcDetails(sSfc);
                
                const sResult = `SFC: ${oData.sfc}\n` +
                               `Material: ${oData.material}\n` +
                               `Status: ${oData.status}\n` +
                               `Quantity: ${oData.quantity}`;
                
                this._oResultText.setText(sResult);
                
            } catch (oError) {
                this._oResultText.setText(this.getI18nText("sfcDetails.error.fetch"));
            }
        }
        
        /**
         * Call SAP DM SFC API to get SFC details
         */
        async _fetchSfcDetails(sSfc) {
            const oContext = PodContext.getContext();
            const sPlant = oContext.plant;
            const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
            const sUrl = `${sBaseUrl}/sfcs?plant=${sPlant}&sfc=${sSfc}`;
            
            const oResponse = await fetch(sUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oContext.token}`
                }
            });
            
            if (!oResponse.ok) {
                throw new Error(`HTTP ${oResponse.status}: ${oResponse.statusText}`);
            }
            
            return await oResponse.json();
        }
        
        /**
         * Cleanup on destroy
         */
        onExit() {
            this.unsubscribe();
            super.onExit();
        }
    }
    
    return SfcDetailsWidget;
});
```

### API Best Practices

✅ **DO:**
- Cache OAuth tokens from PodContext (already cached by framework)
- Use `serviceRegistry.getApiUrl()` for base URLs
- Handle errors gracefully with user-friendly messages
- Show loading indicators for long API calls
- Validate input before making API calls
- Use async/await for cleaner code
- Log errors for debugging
- Check HTTP status codes

❌ **DON'T:**
- Request new OAuth token for every API call
- Hardcode API base URLs
- Show raw error messages to users
- Make synchronous API calls (blocks UI)
- Trust user input without validation
- Ignore error responses
- Make redundant API calls (cache when appropriate)

### Error Handling Pattern

```javascript
async _callApi(sEndpoint, oData) {
    const oContext = PodContext.getContext();
    const sUrl = `${oContext.serviceRegistry.getApiUrl("service")}${sEndpoint}`;
    
    try {
        const oResponse = await fetch(sUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oContext.token}`
            },
            body: JSON.stringify(oData)
        });
        
        if (!oResponse.ok) {
            const oError = await oResponse.json();
            throw new Error(oError.message || `HTTP ${oResponse.status}`);
        }
        
        return await oResponse.json();
        
    } catch (oError) {
        console.error(`API call failed (${sEndpoint}):`, oError);
        
        // Show user-friendly error message
        const sErrorKey = oError.code ? `api.error.${oError.code}` : "api.error.generic";
        MessageToast.show(this.getI18nText(sErrorKey));
        
        throw oError;
    }
}
```

### Pagination Pattern

Many list APIs support pagination:

```javascript
async _fetchMaterialList(sSearchTerm, iPage = 0, iSize = 20) {
    const oContext = PodContext.getContext();
    const sBaseUrl = oContext.serviceRegistry.getApiUrl("material");
    const sUrl = `${sBaseUrl}/v1/materials/list?plant=${oContext.plant}&page=${iPage}&size=${iSize}&search=${sSearchTerm}`;
    
    const oResponse = await fetch(sUrl, {
        headers: {
            "Authorization": `Bearer ${oContext.token}`
        }
    });
    
    const oData = await oResponse.json();
    
    return {
        items: oData.content,
        totalItems: oData.totalElements,
        totalPages: oData.totalPages,
        currentPage: oData.page
    };
}
```

### Async Operations Pattern

Some APIs support async processing:

```javascript
async _startSfcsAsync(aSfcs) {
    const oContext = PodContext.getContext();
    const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
    
    // Start async operation
    const oResponse = await fetch(`${sBaseUrl}/sfcs/start?async=true`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oContext.token}`
        },
        body: JSON.stringify({
            plant: oContext.plant,
            sfcs: aSfcs.map(sSfc => ({ sfc: sSfc })),
            operationActivity: "OPER_1,1",
            resource: "RESOURCE_1"
        })
    });
    
    const { asyncExecutionId } = await oResponse.json();
    
    // Poll for completion
    return await this._pollAsyncResult(asyncExecutionId);
}

async _pollAsyncResult(sExecutionId, iMaxAttempts = 30) {
    const oContext = PodContext.getContext();
    const sBaseUrl = oContext.serviceRegistry.getApiUrl("sfc");
    
    for (let i = 0; i < iMaxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        
        const oResponse = await fetch(`${sBaseUrl}/async/${sExecutionId}`, {
            headers: {
                "Authorization": `Bearer ${oContext.token}`
            }
        });
        
        const oResult = await oResponse.json();
        
        if (oResult.status === "COMPLETED") {
            return oResult.data;
        } else if (oResult.status === "FAILED") {
            throw new Error(oResult.error || "Async operation failed");
        }
    }
    
    throw new Error("Async operation timeout");
}
```

### API Documentation

📖 **See Also:**
- **[sapdm-api-reference.md](sapdm-api-reference.md)** - Complete reference for all 77+ SAP DM APIs
- **[sap-dm-api-specs/](sap-dm-api-specs/)** - Full OpenAPI/Swagger specifications
- **SAP Help Portal**: [API Integration Guide](https://help.sap.com/docs/sap-digital-manufacturing/operations-guide/prepare-for-api-integration)

**Common APIs:**
- SFC API: `sap-dm-api-specs/sapdme_sfc.json` - Shop floor control operations
- Order API: `sap-dm-api-specs/sapdme_order.json` - Production order management
- Material API: `sap-dm-api-specs/sapdme_material.json` - Material master data
- Data Collection API: `sap-dm-api-specs/sapdme_datacollection.json` - Parameter logging
- Quality Inspection API: `sap-dm-api-specs/sapdme_qualityinspection.json` - Quality checks
- Inventory API: `sap-dm-api-specs/sapdme_inventory.json` - Inventory management

---

---

## Custom Widget Events Pattern

Widgets can define and trigger custom events for widget-to-widget communication. Other widgets subscribe to these events.

### EventId Enum Pattern

```javascript
class ReportedQuantitySummaryWidget extends TableWidget {
    // Define event IDs as frozen enum
    static EventId = Object.freeze({
        ReportQuantity: "reportQuantity",
        StatusChange: "statusChange"
    });
    
    // Override getEvents() to declare custom events
    getEvents() {
        return [
            new WidgetEvent({
                id: ReportedQuantitySummaryWidget.EventId.ReportQuantity,
                displayName: this.getI18nText("events.reportQuantity"),
                description: this.getI18nText("events.reportQuantity.description")
            }),
            ...super.getEvents()
        ];
    }
    
    // Trigger the event
    _onReportQuantityButtonPress(oEvent) {
        const oData = { sfc: "SFC001", quantity: 100 };
        this._handleEvent(ReportedQuantitySummaryWidget.EventId.ReportQuantity, oEvent, oData);
    }
}
```

**Usage:** Event-driven architecture for multi-widget dashboards. Widgets can communicate without tight coupling.

---

## EXCLUDE_PROPERTIES and INCLUDE_EVENTS Pattern

Control which TableWidget properties appear in POD Designer configuration panel.

```javascript
class ReportedQuantitySummaryWidget extends TableWidget {
    // Hide these properties from configuration UI
    static EXCLUDE_PROPERTIES = [
        "alternateRowColors",
        "fixedLayout",
        "growing",
        "growingDirection",
        "growingScrollToLoad",
        "growingThreshold",
        "mode",
        "multiSelectMode",
        "noDataText",
        "rememberSelections",
        "showNoData"
    ];
    
    // Only show these events (hide all others)
    static INCLUDE_EVENTS = ["selectionChange"];
}
```

**Usage:** Simplify configuration UI by hiding irrelevant inherited properties. Production widgets expose only 5-10 properties instead of 50+.

---

## Growing/Pagination Pattern for TableWidget

Implement lazy loading with "load more" functionality for large datasets.

```javascript
class ReportedQuantityTableWidget extends TableWidget {
    _createTable(oConfig, mSettings = {}) {
        return super._createTable(oConfig, {
            growing: true,
            growingScrollToLoad: true,
            growingThreshold: 20,
            headerToolbar: this._createToolbar(),
            ...mSettings
        });
    }
    
    async onInit() {
        await super.onInit();
        
        if (PodContext.isRunMode()) {
            const oTable = this.getTable();
            
            // Detect when user scrolls to load more
            oTable.attachUpdateStarted(async (oEvent) => {
                if (oEvent.getParameter("reason") === "Growing") {
                    await this._fetchNextPage();
                }
            });
        }
    }
    
    async _fetchNextPage() {
        // Fetch next page from API or delegate
        const oData = await ApiClient.custom.get("/data?page=" + this._iPage++);
        // Update model with new data
    }
}
```

**Usage:** Critical for manufacturing tables with hundreds/thousands of rows. Loading all at once crashes browsers.

---

## Custom Toolbar Title Pattern

Override `_createToolbarTitle()` to show dynamic counts and formatted titles.

```javascript
class ReportedQuantityTableWidget extends TableWidget {
    _createToolbarTitle() {
        return new Title({
            text: {
                path: ModelPath.ReportedQuantityCount,
                formatter: (iCount) => {
                    return this.getI18nText("table.title", iCount || 0);
                }
            }
        });
    }
}
```

**i18n.properties:**
```properties
table.title=Reported Quantities ({0})
```

**Usage:** Show dynamic row counts in table header. Users need to see "Items (25)" not just "Items".

---

## Complex Cell Types with Conditional Visibility

Create table cells with multiple controls and conditional visibility.

```javascript
class ReportedQuantityTableWidget extends TableWidget {
    _createReasonCodeCell(oColumnConfig) {
        return new HBox({
            items: [
                // Show link if reason codes exist
                new Link({
                    text: {
                        path: "reasonCodes",
                        formatter: (aReasonCodes) => aReasonCodes?.at(-1) || ""
                    },
                    visible: {
                        path: "reasonCodes",
                        formatter: (aReasonCodes) => Array.isArray(aReasonCodes) && aReasonCodes.length > 0
                    },
                    press: (oEvent) => this._onReasonCodeLinkPress(oEvent)
                }),
                // Show button if no reason code assigned
                new Button({
                    type: ButtonType.Ghost,
                    text: this.getI18nText("assignReasonCode.button"),
                    visible: {
                        parts: ["scrapActivityLogId", "reasonCodes", "status"],
                        formatter: (sScrapId, aReasonCodes, sStatus) => {
                            return sScrapId !== null && 
                                   !Array.isArray(aReasonCodes) &&
                                   sStatus !== "CANCELLED_IN_DM";
                        }
                    },
                    press: (oEvent) => this._onAssignReasonCodePress(oEvent)
                })
            ]
        });
    }
}
```

**Usage:** Conditional UI showing different controls based on row data. Common in manufacturing (show button OR link, not both).

---

## ObjectStatus for Status Display

Use ObjectStatus for status fields with semantic colors (Success/Error/Warning).

```javascript
_createStatusCell(oColumnConfig) {
    return new ObjectStatus({
        text: {
            path: "status",
            formatter: (sStatus) => {
                switch (sStatus) {
                    case "SENT_TO_S4":
                    case "POSTED_IN_DM":
                        return this.getI18nText("status.posted");
                    case "CANCELLED_IN_DM":
                        return this.getI18nText("status.cancelled");
                    default:
                        return "";
                }
            }
        },
        state: {
            path: "status",
            formatter: (sStatus) => {
                if (sStatus === "CANCELLED_IN_DM") {
                    return ValueState.Error;
                }
                return ValueState.Success;
            }
        }
    });
}
```

**Import:** `import ObjectStatus from "sap/m/ObjectStatus";`  
**Import:** `import ValueState from "sap/ui/core/ValueState";`

**Usage:** Status columns with color coding are standard SAP pattern. Mandatory for manufacturing tables.

---

## VBox Cell Pattern for Multi-Line Display

Use VBox in table cells to show multiple lines of related data.

```javascript
_createCell(oColumnConfig) {
    switch (oColumnConfig.field) {
        case "resource":
            return new VBox({
                items: [
                    new Text({ text: "{resource}" }),
                    new Text({ 
                        text: "{resourceDescription}",
                        class: "sapUiTinyMarginTop"
                    }).addStyleClass("sapUiContentPadding")
                ]
            });
    }
}
```

**Usage:** Manufacturing data is hierarchical (Resource + Description, SFC + Operation). VBox shows context without horizontal scrolling.

---

---

## Framework Widget Extension Pattern

Instead of building a widget from scratch (extends `Widget`), you can **extend any existing POD 2.0 framework widget** and add/modify behavior. The extended widget appears as a **separate entry** in the POD Designer palette — the user can place YOUR version instead of (or alongside) the original.

### When to use

- Add search/filter functionality to the standard Worklist
- Add extra columns, toolbar buttons, or context menus to any framework table widget
- Override rendering/formatting of an existing widget
- Wrap a framework widget with additional business logic (e.g. auto-refresh, status coloring)

### Available base classes (examples)

Any widget class from `sap/dm/dme/pod2/widget/...` can serve as a base. Common ones:

| Framework Widget | Import Path |
|---|---|
| WorkListTableWidget | `sap/dm/dme/pod2/widget/worklist/WorkListTableWidget` |
| OrderListTableWidget | `sap/dm/dme/pod2/widget/orderlist/OrderListTableWidget` |
| Any other visible in the standard POD | Check `docu/pod2-api-specs/` for classes under `sap.dm.dme.pod2.widget.*` |

### Pattern — FilterableWorkListWidget (reference: `examples/Customer.Utils`)

```javascript
sap.ui.define([
    "sap/m/SearchField",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/widget/worklist/WorkListTableWidget",
    "sap/dm/dme/pod2/model/I18nResourceModel"
], (
    SearchField, Filter, FilterOperator, PodContext,
    WorkListTableWidget, I18nResourceModel
) => {
    "use strict";

    class FilterableWorkListWidget extends WorkListTableWidget {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.utils.i18n.i18n"
        });

        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("filterableWorkList.displayName"); } // See M32 — <widgetName>.* prefix
        static getDescription() { return this.getI18nText("filterableWorkList.description"); }
        static getCategory() { return this.getI18nText("filterableWorkList.category"); }
        static getIcon() { return "sap-icon://search"; }

        async onInit() {
            await super.onInit();  // ✅ ALWAYS `await super.onInit()` (M39) — base widget does its own async setup

            const oHeaderToolbar = this.getTable()?.getHeaderToolbar();
            if (oHeaderToolbar) {
                this._oSearchField = new SearchField({
                    placeholder: this.getI18nText("filterableWorkList.searchPlaceholder"),
                    width: "250px",
                    search: (oEvent) => this.#applyFulltextFilter(oEvent.getParameter("query")),
                    liveChange: (oEvent) => this.#applyFulltextFilter(oEvent.getParameter("newValue"))
                });
                oHeaderToolbar.addContent(this._oSearchField);
            }
        }

        onExit() {
            super.onExit();  // ✅ ALWAYS call super — base widget cleans up its subscriptions
            this._oSearchField = null;
        }

        #applyFulltextFilter(sQuery) {
            const oBinding = this.getTable()?.getBinding("items");
            if (!oBinding) return;

            if (!sQuery?.trim()) {
                oBinding.filter([]);
                return;
            }

            const aFilters = [
                new Filter("sfc", FilterOperator.Contains, sQuery.trim()),
                new Filter("shopOrder", FilterOperator.Contains, sQuery.trim()),
                new Filter("material", FilterOperator.Contains, sQuery.trim()),
                new Filter("materialDescription", FilterOperator.Contains, sQuery.trim()),
                new Filter("operation", FilterOperator.Contains, sQuery.trim())
            ];

            oBinding.filter([new Filter({ filters: aFilters, and: false })]);
        }
    }

    return FilterableWorkListWidget;
});
```

### Key differences from building from scratch

| Aspect | From-Scratch (`extends Widget`) | Framework Extension (`extends WorkListTableWidget`) |
|---|---|---|
| Base class | `sap/dm/dme/pod2/widget/Widget` | Any framework widget |
| `_createView()` | You build the entire UI | **Not needed** — base widget provides the view |
| `getTable()` | Not available | Inherited — returns the framework's `sap.m.Table` |
| `getHeaderToolbar()` | Not available | Inherited — returns the table's toolbar |
| `super.onInit()` | Calls empty base | Calls the framework widget's full initialization (subscriptions, data loading, toolbar) |
| `getDefaultConfig()` | Define your own properties | **ALWAYS spread** parent properties: `...super.getDefaultConfig().properties` |
| POD Designer | Shows as your custom widget | Shows as your custom widget (replaces or coexists with the standard one) |

### Important rules for Framework Widget Extensions

- ✅ **Always call `super.onInit()` and `super.onExit()`** — the base widget manages its own PodContext subscriptions, data bindings, toolbar, etc.
- ✅ **Don't override `_createView()`** unless you know exactly what the base class does there — you'll lose the standard UI.
- ✅ **Spread parent properties** in `getDefaultConfig()` — framework widgets have essential configuration.
- ✅ **Use `this.getTable()`** to access the underlying table control for modifications.
- ✅ **Use the same static metadata pattern** (I18nResourceModel, getDisplayName, etc.) — your extension is a first-class widget in the POD Designer.
- ❌ **Don't subscribe to the same ModelPaths** the base widget already subscribes to — you'll get double callbacks. Add only NEW subscriptions.
- ❌ **Don't call `PodContext.setSelectedWorkListItems()`** from within a WorkList extension — the base class handles selection. You'd create infinite loops.

---

## Navigation

**Other references**:
- [Common Mistakes](common-mistakes.md) - All mistakes with fixes
- [SAP DM API Reference](sapdm-api-reference.md) - Complete API documentation
- [Glossary](glossary.md) - Key terms & definitions


---

## ComponentWidget Pattern

Use `ComponentWidget` when you need a full SAPUI5 Component with its own `Component.js`, MVC structure, and models. This is for complex widgets that benefit from component isolation.

### Base Class

```javascript
import ComponentWidget from "sap/dm/dme/pod2/widget/ComponentWidget";
```

### Key Static Methods

| Method | Purpose |
|--------|----------|
| `getComponentName()` | Returns the SAPUI5 component name (e.g. `"my.component"`) |
| `getComponentModels()` | Returns models to set on the component |

### When to Use

- Widget needs its own routing/navigation
- Widget has complex MVC structure (Controller + Views + Fragments)
- Widget needs component-level models independent of POD
- Reusing an existing SAPUI5 component inside POD

### Lifecycle Differences from Widget

- `onInit()` / `onExit()` still apply
- `_createView()` is NOT used — the component handles its own view creation
- POD lifecycle (page enter/leave) still managed by framework

---

## IntegrationWidget Pattern

Use `IntegrationWidget` for embedding external content (iframe, external URL) within the POD.

### Base Class

```javascript
import IntegrationWidget from "sap/dm/dme/pod2/widget/IntegrationWidget";
```

### Key Static Methods

| Method | Purpose |
|--------|----------|
| `getEntryPoint()` | Returns the URL/path to the external content |

### Key Instance Methods

| Method | Purpose |
|--------|----------|
| `ready()` | Called when the iframe/content is loaded and ready |

### When to Use

- Embedding a third-party web application
- Embedding a separate SAPUI5 app that is not a POD plugin
- Displaying external dashboards/reports within POD

---

## Widget Type Selection Guide

| Need | Widget Type | Base Class |
|------|-------------|------------|
| Simple single control (button, text) | ControlWidget | `Widget` |
| Form/layout with multiple controls | LayoutWidget | `LayoutWidget` |
| Data table with rows | TableWidget | `Widget` (+ table pattern) |
| Dialog/popover content | ContentHandler | `Widget` |
| Full SAPUI5 Component (MVC) | ComponentWidget | `ComponentWidget` |
| External/iframe content | IntegrationWidget | `IntegrationWidget` |
