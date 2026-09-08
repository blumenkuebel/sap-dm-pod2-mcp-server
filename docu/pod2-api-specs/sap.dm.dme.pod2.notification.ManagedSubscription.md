# ManagedSubscription

`sap.dm.dme.pod2.notification.ManagedSubscription`

Manages a conditional subscription for a given topic and event type. Based on the criteria, the underlying
subscription may be unsubscribed and resubscribed many times. For example, if the subscription is dependent on
a work list item being selected and should not be active while there is no selection, the caller can use a
ManagedSubscription instead of handling resubscribe/unsubscribe behavior itself.

Callers should ensure that subscriptions are destroyed when they are no longer needed.

For static/shared use cases, the subscription will be automatically destroyed if the POD Context is destroyed
(ie. at the end of the POD application lifecycle) to prevent subscriptions from becoming orphaned.

## Constructor

```
new ManagedSubscription (mSettings)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `mSettings` | sap.dm.dme.pod2.notification.$ManagedSubscriptionSettings | No |  |

## Methods

### destroy ()

Unsubscribes and prevents any future reuse of the subscription. This function is called automatically if
the POD Context is destroyed.

### unsubscribe ()

Unsubscribes regardless of whether the subscription criteria is met. This is primarily to be used by callers
at the end of their lifecycle in an `onExit` or `destroy` function to allow garbage
collection and avoid creating orphaned notification subscriptions.

Unlike an individual SubscriptionContext, subsequent calls to `update()` may reactivate the
subscription.

### update ()

Update the subscription based on the latest criteria. This function should be called each time the relevant
criteria changes (such as in response to a change in the POD context).

If the `getFilter` function returns a valid filter the subscription will use the new filter. If
it was not already subscribed, the subscription will be created.

If no filter (`null`) is returned by `getFilter` the subscription will be unsubscribed.

### GetFilterFunction () → {sap.dm.dme.pod2.notification.Filter.AbstractFilter}

A function which returns the current filter, or null if the criteria is not met for a subscription to be made.

**Returns:** sap.dm.dme.pod2.notification.Filter.AbstractFilter - [sap.dm.dme.pod2.notification.Filter.AbstractFilter](sap.dm.dme.pod2.notification.Filter.md#.AbstractFilter)
