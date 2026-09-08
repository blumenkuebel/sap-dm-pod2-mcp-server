# SubscriptionContext

`sap.dm.dme.pod2.notification.SubscriptionContext`

Handles a subscription for a particular topic and event event. Each SubscriptionContext is unique and has a
unique ID. This class is used to manage the subscription and the filters for the messages received.

This should only be instantated by calling PodNotificationWebSocket.subscribe and should not be used
directly.

## Constructor

```
new SubscriptionContext (oOptions)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `eventType` | sap.dm.dme.pod2.notification.EventType | No | The event type to subscribe to |
| `onMessage` | sap.dm.dme.pod2.notification.PodNotificationWebSocket.PodNotificationCallback | No | The function to call when a message is received |
| `unsubscribe` | function | No | The function to publish messages to the server |
| `updateFilter` | function | No | The function to publish messages to the server |
| `topic` | string | No | The topic to subscribe to currently always "production" |
| `description` | string | Yes | The description of the subscription context or the owner |
| `filter` | sap.dm.dme.pod2.notification.Filter.AbstractFilter | Yes | The filter to apply to the messages received. If not provided then a default filter of the current plant is used. |

## Methods

### getEventType () → {sap.dm.dme.pod2.notification.EventType}

**Returns:** sap.dm.dme.pod2.notification.EventType - [sap.dm.dme.pod2.notification.EventType](sap.dm.dme.pod2.notification.md#.EventType)

### getFilter () → {sap.dm.dme.pod2.notification.Filter.AbstractFilter}

**Returns:** sap.dm.dme.pod2.notification.Filter.AbstractFilter - [sap.dm.dme.pod2.notification.Filter.AbstractFilter](sap.dm.dme.pod2.notification.Filter.md#.AbstractFilter)

### (async) ready () → {Promise.<void>}

Returns a promise which resolves when the subscription has been confirmed by the server.

**Returns:** Promise.<void> - Promise.<void>

### unsubscribe ()

Remove this SubscriptionContext from the PodNotificationWebSocket and stop receiving notifications.

### (async) updateFilter (oFilter) → {Promise.<void>}

Update the filter for this SubscriptionContext. This will mark the filter as changed and will send an
update_filters message to the server when the SubscriptionContext is processed.
This function produces an exception if called after the SubscriptionContext has been unsubscribed.

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `oFilter` | sap.dm.dme.pod2.notification.Filter.AbstractFilter | No | filter to apply to the messages received |

**Returns:** Promise.<void> - Promise.<void>
