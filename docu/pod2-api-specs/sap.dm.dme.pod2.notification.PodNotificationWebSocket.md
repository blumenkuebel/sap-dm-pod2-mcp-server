# PodNotificationWebSocket

`sap.dm.dme.pod2.notification.PodNotificationWebSocket`

PodNotificationWebSocket is a wrapper around the SAPUI5 WebSocket client that connects to the POD Notification
server and manages messages sent to and received from the server. It provides methods to connect and disconnect
from the server, subscribe and unsubscribe to topics, and monitor the server with a heartbeat.
This class is designed to be instantiated only once a singleton.

For most use cases it is recommended to use the [sap.dm.dme.pod2.notification.ManagedSubscription](sap.dm.dme.pod2.notification.ManagedSubscription.md)
class to simplify the lifecycle and cleanup of notification subscriptions rather than managing the
subscription context manually.

## Constructor

```
new PodNotificationWebSocket ()
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `description` | string | Yes | The description of the subscriber ie: who is calling the subscribe |
| `eventType` | sap.dm.dme.pod2.notification.EventType | No | The eventType to subscribe to |
| `filter` | sap.dm.dme.pod2.notification.Filter.AbstractFilter | Yes | The filter to apply to the messages received |
| `onMessage` | sap.dm.dme.pod2.notification.PodNotificationWebSocket.PodNotificationCallback | No | The function to call when a message is received |
| `topic` | string | Yes | The topic to subscribe to. If not specified, the default topic of "production" is used. |

## Methods

### (static) subscribe (oOptions) → {sap.dm.dme.pod2.notification.SubscriptionContext}

Subscribe to a topic and event type with a message handler. This creates a new SubscriptionContext and
subscribes to the topic/eventType.

For most use cases it is recommended to use the [sap.dm.dme.pod2.notification.ManagedSubscription](sap.dm.dme.pod2.notification.ManagedSubscription.md)
class to simplify the lifecycle and cleanup of notification subscriptions rather than managing the
subscription context manually.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `description` | string | Yes | The description of the subscriber ie: who is calling the subscribe |
| `eventType` | sap.dm.dme.pod2.notification.EventType | No | The eventType to subscribe to |
| `filter` | sap.dm.dme.pod2.notification.Filter.AbstractFilter | Yes | The filter to apply to the messages received |
| `onMessage` | sap.dm.dme.pod2.notification.PodNotificationWebSocket.PodNotificationCallback | No | The function to call when a message is received |
| `topic` | string | Yes | The topic to subscribe to. If not specified, the default topic of "production" is used. |

**Returns:** sap.dm.dme.pod2.notification.SubscriptionContext - [sap.dm.dme.pod2.notification.SubscriptionContext](sap.dm.dme.pod2.notification.SubscriptionContext.md)

**Example:**

```javascript
// Subscribe to a notification. The callback function will be called when the notification is received.// keep a reference to the subscription context so the filter can be updated or the subscription can be// unsubscribedconst oSubscriptionContext = PodNotificationWebSocket.subscribe({    eventType: EventType.SFC_STARTED,    onMessage: (message) => {        console.log("Received message.eventType: ", message.eventType);        console.log("Received message.topic: ", message.topic);        console.log("Received message.data.sfcs: ", message.data.sfcs); // sfcs is in this kafka message    },    filter: Filter.equals("plant", "123"),    description: "MyClass"});
```

### PodNotificationCallback (oPayload)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oPayload` | sap.dm.dme.pod2.notification.NotificationType.NotificationPayload | No | The message received from the server. The type of message is determined by the event type. |

### StateChangeCallback (bConnected)

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `bConnected` | boolean | No | True if the WebSocket is connected, false if it is disconnected. |
