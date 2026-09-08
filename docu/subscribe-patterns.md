# PodContext Subscribe Patterns – ModelPath, Lifecycle & Guards

## Overview

Widgets often need to **react to context changes** (e.g. when the user selects a different SFC in the worklist). POD2 provides a publish/subscribe mechanism via `PodContext.subscribe()` with typed path constants from `ModelPath`.

---

## Import Paths

```javascript
import PodContext from "sap/dm/dme/pod2/context/PodContext";
import ModelPath from "sap/dm/dme/pod2/context/ModelPath";
```

---

## The Subscribe Pattern (Complete)

```javascript
class MyWidget extends Widget {

    onInit() {
        // ⚠️ CRITICAL: Only subscribe in Run Mode!
        // In Design Mode (POD Designer), subscriptions cause errors
        if (PodContext.isRunMode()) {
            PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);

            // Optionally handle current selection immediately
            const selectedItems = PodContext.getSelectedWorkListItems() || [];
            if (selectedItems.length > 0) {
                this._onSelectionChanged(selectedItems);
            }
        }
    }

    onExit() {
        // ⚠️ ALWAYS unsubscribe to prevent memory leaks
        if (PodContext.isRunMode()) {
            PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);
        }
    }

    _onSelectionChanged(aSelectedItems) {
        // Called every time the selection changes
        const items = aSelectedItems || [];
        if (items.length === 0) {
            // No selection – show empty state
            return;
        }
        // Process selected items...
    }
}
```

---

## API Reference

### `PodContext.subscribe(path, callback, context)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | string/ModelPath | The context path to observe |
| `callback` | Function | Called when the value changes; receives the new value |
| `context` | object | `this` reference for the callback (usually `this`) |

### `PodContext.unsubscribe(path, callback, context)`

Same parameters – **all three must match** the original subscribe call.

### `PodContext.isRunMode()`

Returns `true` when the POD is in actual execution mode (operator view).
Returns `false` when in Design Mode (POD Designer / Manage PODs 2.0).

⚠️ **Always guard subscribe/unsubscribe with `isRunMode()`** – subscribing in Design Mode causes runtime errors.

---

## ModelPath Constants

`ModelPath` provides typed constants for all observable context paths:

```javascript
import ModelPath from "sap/dm/dme/pod2/context/ModelPath";
```

### Key ModelPath Values

| Constant | Description | Callback receives |
|----------|-------------|-------------------|
| `ModelPath.SelectedWorkListItems` | Selected SFCs in the worklist | Array of WorkListItem objects |
| `ModelPath.WorkListItems` | All worklist items (after refresh) | Array of WorkListItem objects |
| `ModelPath.OperationActivities` | Operation activities list | Array |
| `ModelPath.DataCollectionGroups` | DC groups loaded | Array |
| `ModelPath.BadgedInUsers` | Badged-in users changed | Array |

### Usage

```javascript
// Subscribe to selection changes
PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);

// Subscribe to worklist refresh
PodContext.subscribe(ModelPath.WorkListItems, this._onWorkListRefreshed, this);
```

---

## PodContext Read Methods (No Subscription Needed)

For one-time reads (no live updates), use these direct getters:

| Method | Returns | Description |
|--------|---------|-------------|
| `PodContext.getSelectedWorkListItems()` | Array | Currently selected worklist items |
| `PodContext.getWorkListItems()` | Array | ALL worklist items (not just selected) |
| `PodContext.getPlant()` | string | Current plant |
| `PodContext.getFilterWorkCenters()` | Array | Filtered work centers `[{workCenter: "WC1"}]` |
| `PodContext.getFilterResources()` | Array | Filtered resources `[{resource: "RES1"}]` |
| `PodContext.getFilterOperationActivities()` | Array | Filtered operations `[{operationActivity: "OP1"}]` |
| `PodContext.isRunMode()` | boolean | True = operator mode, False = designer mode |
| `PodContext.get(path)` | any | Read any custom context value |
| `PodContext.set(path, value)` | void | Write any custom context value |

---

## Custom Context Paths (for Plugin Communication)

Plugins can store their own data in PodContext using custom paths:

```javascript
// Writing (e.g. in a Context Singleton)
PodContext.set("/customer/myPlugin/selectedSfcs", ["SFC1", "SFC2"]);
PodContext.set("/customer/myPlugin/validationResult", { valid: true });

// Reading
const sfcs = PodContext.get("/customer/myPlugin/selectedSfcs");
```

### Convention for Custom Paths

```
/customer/{pluginName}/{propertyName}
```

Examples:
- `/customer/coating/sfcThicknesses`
- `/customer/coating/inputState`
- `/customer/processlot/currentLot`

---

## Complete Widget Example with Subscribe

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/VBox",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/MessageStrip",
], (Widget, PodContext, ModelPath, I18nResourceModel, JSONModel,
    VBox, Table, Column, ColumnListItem, Text, Label, MessageStrip) => {
    "use strict";

    class SelectionViewerWidget extends Widget {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "myCompany.selectionViewer.i18n.i18n"
        });
        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("displayName"); }
        static getIcon() { return "sap-icon://list"; }
        static getCategory() { return this.getI18nText("category"); }
        static getDescription() { return this.getI18nText("description"); }

        onInit() {
            if (PodContext.isRunMode()) {
                PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);
                // Handle initial selection
                const items = PodContext.getSelectedWorkListItems() || [];
                if (items.length > 0) {
                    this._onSelectionChanged(items);
                }
            }
        }

        onExit() {
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);
            }
            this._oTable = null;
            this._oMessage = null;
        }

        _createView() {
            const oConfig = this.getConfig();

            this._oMessage = new MessageStrip({
                text: this.getI18nText("msg.noSelection"),
                type: "Information",
                showIcon: true,
                visible: true
            });

            this._oTable = new Table({
                visible: false,
                columns: [
                    new Column({ header: new Label({ text: "SFC" }) }),
                    new Column({ header: new Label({ text: "Order" }) }),
                    new Column({ header: new Label({ text: "Status" }) })
                ]
            });

            return new VBox(oConfig.id, {
                width: "100%",
                items: [this._oMessage, this._oTable]
            });
        }

        _onSelectionChanged(aSelectedItems) {
            const items = aSelectedItems || [];

            if (items.length === 0) {
                this._oMessage.setVisible(true);
                this._oTable.setVisible(false);
                return;
            }

            this._oMessage.setVisible(false);
            this._oTable.setVisible(true);

            const aRows = items.map(item => ({
                sfc: item.sfc,
                order: item.shopOrder || "",
                status: item.sfcStatusCode || ""
            }));

            const oModel = new JSONModel({ rows: aRows });
            this._oTable.setModel(oModel);
            this._oTable.bindItems({
                path: "/rows",
                template: new ColumnListItem({
                    cells: [
                        new Text({ text: "{sfc}" }),
                        new Text({ text: "{order}" }),
                        new Text({ text: "{status}" })
                    ]
                })
            });
        }
    }

    return SelectionViewerWidget;
});
```

---

## Key Rules

1. **Always guard with `isRunMode()`** – subscribe only in operator mode
2. **Always unsubscribe in `onExit()`** – prevents memory leaks
3. **All 3 arguments must match** between subscribe and unsubscribe
4. **Use `ModelPath` constants** – don't use string paths for standard context data
5. **Use custom paths (`/customer/...`)** for plugin-specific data exchange
6. **Handle empty arrays** in callbacks – selection can be cleared
7. **Initial load**: After subscribing, check current value immediately (subscribe only fires on *change*)

---

## Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Subscribing without `isRunMode()` guard | Error in POD Designer | Wrap in `if (PodContext.isRunMode())` |
| Forgetting to unsubscribe in `onExit()` | Memory leak, stale callbacks | Always pair subscribe with unsubscribe |
| Using string path instead of `ModelPath` | Subscription never fires | Import and use `ModelPath.SelectedWorkListItems` |
| Not handling empty array in callback | TypeError on `.length` or `.map()` | Always default: `items || []` |
| Not checking initial value after subscribe | Widget blank until first selection change | Read current value right after subscribing |
| Wrong `this` context in callback | `this` is undefined in callback | Pass `this` as 3rd argument to subscribe |

---

## Server-Push Notifications (PodNotificationWebSocket)

Beyond PodContext subscriptions (which track shared UI state), POD 2.0 also supports **real-time server-push events** via WebSocket. This is useful for reacting to backend events without polling.

### Import

```javascript
import PodNotificationWebSocket from "sap/dm/dme/pod2/notification/PodNotificationWebSocket";
import EventType from "sap/dm/dme/pod2/notification/EventType";
import Filter from "sap/dm/dme/pod2/notification/Filter";
```

### Subscribe to Events

```javascript
// In onInit() or execute():
// Handler key is `onMessage` (NOT `callback`), and `eventType` must be an
// EventType enum constant — never a hardcoded string.
const subscription = PodNotificationWebSocket.subscribe({
    eventType: EventType.SFC_START,
    filter: Filter.equals("plant", PodContext.getPlant()),
    onMessage: (message) => {
        // Handle the server-push event
        console.log("SFC event:", message);
        // Optionally refresh data
        WorkListDelegate.refresh();
    },
    description: "MyWidget"
});

// Store for cleanup
this.#subscription = subscription;
```

### Unsubscribe in onExit()

```javascript
onExit() {
    if (this.#subscription) {
        this.#subscription.unsubscribe();
        this.#subscription = null;
    }
    super.onExit();
}
```

### ManagedSubscription

For more control, use `ManagedSubscription` which provides `update()` (change filter) and `destroy()` lifecycle:

```javascript
import { ManagedSubscription } from "sap/dm/dme/pod2/notification/ManagedSubscription";
```

### Key Differences from PodContext.subscribe()

| Aspect | PodContext.subscribe() | PodNotificationWebSocket |
|--------|----------------------|-------------------------|
| Source | UI state changes (client-side) | Backend events (server-push) |
| Transport | In-memory pub/sub | WebSocket |
| Use Case | React to selection changes, filter updates | React to MES events (SFC started, order released) |
| Cleanup | `PodContext.unsubscribe()` | `subscription.unsubscribe()` |
