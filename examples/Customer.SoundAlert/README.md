# Customer.SoundAlert

A POD 2.0 widget that subscribes to real-time WebSocket events and plays an audio alert when triggered.

## Purpose

Demonstrates the `PodNotificationWebSocket` API for receiving server-push events in a POD widget. When a configured event type is received, the widget plays a short beep sound using the Web Audio API.

## Use Case

- PPD (Production Process) triggers a custom notification event
- Widget receives it in real-time via WebSocket
- Operator hears an audible alert without needing to watch the screen

## Components

| Component | File | Description |
|-----------|------|-------------|
| Widget | `widget/SoundAlertWidget.js` | Subscribes to WebSocket events, plays sound |

## Key APIs Demonstrated

| API | Usage |
|-----|-------|
| `PodNotificationWebSocket.subscribe()` | Subscribe to real-time events (handler key is `onMessage`, not `callback`) |
| `EventType` enum | Event types come from the runtime enum — the picker is built from `Object.keys(EventType)`, never hardcoded strings |
| `Filter.equals()` | Filter events by plant (and to differentiate `CUSTOM` payloads) |
| `subscription.unsubscribe()` | Cleanup in onExit |
| `sap/m/library` destructuring | Correct enum import pattern (no deprecated pseudo-modules) |
| Widget Properties | Configurable event type via POD Designer (`SelectPropertyEditor`) |
| Web Audio API | Browser-native sound without external files |

## Configuration

In the POD Designer, configure:
- **Event Type** — The WebSocket event type to listen for. The dropdown is populated from the runtime `EventType` enum (default: `CUSTOM`). You cannot invent a new event type — for app-specific events use `CUSTOM` and differentiate messages via the payload `Filter`.

## Project Structure

```
Customer.SoundAlert/
├── extension.json
├── README.md
├── widget/
│   └── SoundAlertWidget.js
└── i18n/
    ├── i18n.properties
    ├── i18n_de.properties
    ├── i18n_en.properties
    └── i18n_en_US.properties
```

## Notes

- The Web Audio API requires user interaction before playing sound (browser autoplay policy). The first event after page load may be silent until the operator clicks anywhere on the POD.
- WebSocket availability depends on the SAP DM environment configuration.
- This is a widget-only plugin (no actions, no context singleton needed).