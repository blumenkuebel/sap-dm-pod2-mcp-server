# DowntimeDialog

`sap.dm.dme.pod2.oeetransaction.widget.oee.DowntimeDialog`

Dialog handler for creating and editing downtime records

## Constructor

```
new DowntimeDialog (oOptions)
```

**Parameters:**

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `confirm` | sap.dm.dme.pod2.oeetransaction.widget.oee.DowntimeDialog.ConfirmHandler | No | Callback invoked when user confirms downtime save |
| `cancel` | sap.dm.dme.pod2.oeetransaction.widget.oee.DowntimeDialog.CancelHandler | Yes | Callback invoked when user cancels the dialog |
| `error` | sap.dm.dme.pod2.oeetransaction.widget.oee.DowntimeDialog.ErrorHandler | Yes | Callback invoked when an error occurs |
| `editData` | sap.dm.dme.pod2.oeetransaction.context.type.Downtime | Yes | Downtime data to edit. If not provided, dialog opens in create mode |
| `statusList` | Array.<sap.dm.dme.pod2.api.internal.plant.ResourceStatus> | No | List of resource statuses to populate status dropdown |
| `reasonCodeDialogClass` | TypeOf.<sap.dm.dme.pod2.oeetransaction.widget.oee.ReasonCodeDialog> | Yes |  |
| `getI18nText` | function | Yes |  |
