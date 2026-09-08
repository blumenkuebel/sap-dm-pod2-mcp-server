# HotKey Patterns

> **Source:** `sap.dm.dme.pod2.hotkey.HotKeyManager` — Framework support for keyboard shortcuts in POD 2.0 plugins.

---

## Overview

POD 2.0 provides a `HotKeyManager` that allows Widgets and Actions to register keyboard shortcuts. The manager:
- Listens for `keydown` events on `document`
- Converts key events to a normalized string format (e.g. `"Ctrl+Shift+S"`)
- Ignores hotkeys when focus is in `<input>` or `<textarea>` elements
- Preserves native `Ctrl+C` / `Ctrl+X` when text is selected
- Supports scoping (only fire if the event target is within a specific DOM element)

---

## Import

```js
sap.ui.define([
  "sap/dm/dme/pod2/hotkey/HotKeyManager"
], (HotKeyManager) => {
  // ...
});
```

---

## API

### `HotKeyManager.subscribe(hotKey, callback, listener, options?)`

Register a keyboard shortcut.

| Parameter | Type | Description |
|-----------|------|-------------|
| `hotKey` | `string` | Key combination string (e.g. `"Ctrl+S"`, `"Shift+F5"`, `"Alt+N"`) |
| `callback` | `Function` | Handler function, called with the `KeyboardEvent` |
| `listener` | `object` | Bind context (typically `this`) — used for identification & unsubscribe |
| `options` | `object` | Optional. `{ scope: Control }` — restrict to events within that control's DOM |

```js
HotKeyManager.subscribe("Ctrl+S", this._onSave, this);
HotKeyManager.subscribe("F5", this._onRefresh, this, { scope: this.getView() });
```

---

### `HotKeyManager.unsubscribe(hotKey, callback, listener)`

Remove a specific hotkey subscription.

```js
HotKeyManager.unsubscribe("Ctrl+S", this._onSave, this);
```

---

### `HotKeyManager.unsubscribeAll(listener)`

Remove ALL hotkey subscriptions for a given listener. **Call this in your Widget's `destroy()` method.**

```js
destroy() {
  HotKeyManager.unsubscribeAll(this);
  super.destroy();
}
```

---

### `HotKeyManager.keyboardEventToHotKeyString(event)`

Convert a `KeyboardEvent` to the normalized hotkey string format.

```js
// Returns e.g. "Ctrl+Shift+S", "Alt+F2", "Meta+Z"
const hotKeyStr = HotKeyManager.keyboardEventToHotKeyString(event);
```

---

### `HotKeyManager.getHotKeyDisplayText(hotKey)`

Get a localized display string for a hotkey (for showing in tooltips or menus).

```js
const displayText = HotKeyManager.getHotKeyDisplayText("Ctrl+S");
// → "Strg+S" (German) or "Control+S" (English) or "⌘+S" (Mac)
```

---

## HotKey String Format

The format is: `[Modifier+]...[Key]`

### Modifiers (in order)
| Modifier | Description |
|----------|-------------|
| `Ctrl` | Control key (⌘ on Mac is handled separately as `Meta`) |
| `Shift` | Shift key |
| `Alt` | Alt/Option key |
| `Meta` | Windows key / ⌘ Command key (Mac) |

### Key
- Single letters are **uppercased**: `"A"`, `"S"`, `"Z"`
- Function keys: `"F1"` through `"F12"`
- Special keys: `"Enter"`, `"Escape"`, `"Tab"`, `"Backspace"`, `"Delete"`, `"ArrowUp"`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"`, `"Home"`, `"End"`, `"PageUp"`, `"PageDown"`

### Examples
```
"Ctrl+S"           — Save
"Ctrl+Shift+S"     — Save As
"F5"               — Refresh
"Shift+F5"         — Force Refresh
"Alt+N"            — New
"Ctrl+Enter"       — Submit
"Escape"           — Cancel/Close
"Meta+Z"           — Undo (Mac)
```

---

## Complete Widget Example

```js
sap.ui.define([
  "sap/dm/dme/pod2/widget/LayoutWidget",
  "sap/dm/dme/pod2/hotkey/HotKeyManager",
  "sap/dm/dme/pod2/context/PodContext"
], (LayoutWidget, HotKeyManager, PodContext) => {
  "use strict";

  class MyWidget extends LayoutWidget {

    static getDisplayName() {
      return PodContext.getI18nText("myWidget.displayName"); // See M32 — camelCase <widgetName>.* prefix, NOT widget.*
    }

    createContent() {
      // Register hotkeys
      HotKeyManager.subscribe("Ctrl+S", this._onSaveHotKey, this);
      HotKeyManager.subscribe("Escape", this._onEscapeHotKey, this);
      HotKeyManager.subscribe("F5", this._onRefreshHotKey, this, {
        scope: this  // Only fire when focus is within this widget
      });

      // ... create UI content ...
      return this._oPage;
    }

    _onSaveHotKey(oEvent) {
      // oEvent is the original KeyboardEvent
      this._executeSave();
    }

    _onEscapeHotKey(oEvent) {
      this._cancelEditing();
    }

    _onRefreshHotKey(oEvent) {
      this._refreshData();
    }

    destroy() {
      // MUST: Clean up all hotkey subscriptions
      HotKeyManager.unsubscribeAll(this);
      super.destroy();
    }
  }

  return MyWidget;
});
```

---

## Best Practices

### 1. Always unsubscribe in `destroy()`
```js
destroy() {
  HotKeyManager.unsubscribeAll(this);
  super.destroy();
}
```
Without this, hotkeys remain active after the widget is removed from the page.

### 2. Use `scope` for widget-local hotkeys
If a hotkey should only trigger when focus is within your widget (not globally):
```js
HotKeyManager.subscribe("Enter", this._onEnter, this, { scope: this });
```

### 3. Don't override browser/OS shortcuts without reason
Avoid overriding common shortcuts like `Ctrl+C`, `Ctrl+V`, `Ctrl+A` unless you have a specific UI reason.

### 4. Show hotkey hints in tooltips
Use `getHotKeyDisplayText()` to display the shortcut in button tooltips:
```js
oButton.setTooltip(`Save (${HotKeyManager.getHotKeyDisplayText("Ctrl+S")})`);
```

### 5. Duplicate subscription protection
The HotKeyManager warns if the same `(hotKey, callback, listener)` combination is registered twice. You don't need manual guards.

---

## Behavior Details

### Input Fields
Hotkeys are **NOT fired** when the user is typing in:
- `<input>` elements
- `<textarea>` elements

This prevents accidental hotkey activation while entering data.

### Copy/Cut preservation
When text is selected in the document, `Ctrl+C` and `Ctrl+X` (or `Meta+C`/`Meta+X` on Mac) are passed through to the browser even if subscribed — preserving native clipboard behavior.

### Multiple subscribers
Multiple listeners can subscribe to the same hotkey. All callbacks are called in subscription order (unless scoping prevents it).

### Error handling
If a hotkey callback throws an error, it is caught and logged — other subscribers for the same key still execute.

---

## i18n Keys for Display

The framework provides these i18n keys for localized modifier names:
| Key | English | German | Mac |
|-----|---------|--------|-----|
| `keyboard.control` | Control | Strg | Control |
| `keyboard.shift` | Shift | Umschalt | Shift |
| `keyboard.alt` | Alt | Alt | Option |
| `keyboard.meta` | Windows | Windows | — |
| `keyboard.meta.mac` | — | — | ⌘ |