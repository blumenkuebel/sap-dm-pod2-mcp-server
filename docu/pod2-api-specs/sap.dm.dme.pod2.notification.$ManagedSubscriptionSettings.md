# $ManagedSubscriptionSettings

`sap.dm.dme.pod2.notification.$ManagedSubscriptionSettings`

## Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `eventType` | sap.dm.dme.pod2.notification.EventType | No | The eventType to subscribe to. |
| `getFilter` | sap.dm.dme.pod2.notification.ManagedSubscription.GetFilterFunction | No | A function which returns the current filter, or null if the criteria is not met for a subscription to be made. |
| `onMessage` | sap.dm.dme.pod2.notification.PodNotificationWebSocket.PodNotificationCallback | No | The function to call when a message is received. |
| `description` | string | Yes | A friendly string identifying the caller, such as a class name. |
| `topic` | string | Yes | The topic to subscribe to. If not specified, the default topic of "production" is used. |
