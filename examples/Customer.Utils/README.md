# **Customer.Utils — SAP DM POD 2.0 Utility Extension (Action)**

**Customer.Utils** is a custom SAP Digital Manufacturing (DM) POD 2.0 plugin that provides a custom, reusable Production Process (PPD) trigger action.

## **Components**

| Component | File | Description |
|-----------|------|-------------|
| **Custom Trigger Action** | `action/CustomTriggerAction.js` | Configurable action that calls a Production Process (PPD) with the current POD context |
| **i18n** | `i18n/` | Language files (DE, EN, EN_US) |

## **Key Capabilities**

- Custom Production Process (PPD) trigger — reusable across multiple POD buttons.
- Validates SFC selection, Work Center, and Resource before execution.
- Passes the full POD context to the Production Process.
- Configurable Production Process REG-KEY via ActionProperties.
- Configurable Trigger Type (START, COMPLETE, SIGNOFF).
- Localization: English (default) and German.

## **Project Structure**

```
Customer.Utils/
├── extension.json
├── action/
│   └── CustomTriggerAction.js
├── i18n/
│   ├── i18n.properties
│   ├── i18n_de.properties
│   ├── i18n_en.properties
│   └── i18n_en_US.properties
└── README.md
```

## **Production Process Data Structure**

### Request Parameters

The action sends the following parameters to the configured Production Process:

| Parameter | Type | Description |
|-----------|------|-------------|
| `Plant` | string | Current plant from PodContext |
| `WorkCenter` | string | Selected Work Center |
| `Resource` | string | Selected Resource |
| `SelectedWorkListItems` | string (JSON) | JSON-serialized array of all selected worklist items |
| `TriggerType` | string | Configured trigger type: `START`, `COMPLETE`, or `SIGNOFF` |

**Example:**
```json
{
  "Plant": "1030",
  "WorkCenter": "WC01",
  "Resource": "RES01",
  "SelectedWorkListItems": "[{\"sfc\":\"SFC001\",\"order\":\"ORD001\",\"operationActivity\":\"OP01\",...}]",
  "TriggerType": "START"
}
```

### Response

No specific response structure is expected. The action does not process the PPD response.

## **Configuration in Manage PODs 2.0**

1. Upload the custom extension as a ZIP file into SAP DM.
2. Use the namespace: `customer.custom.extensions.utils`
3. Assign the `CustomTriggerAction` to any POD button.
4. Configure the Action Properties:

| Property | Description |
|----------|-------------|
| **Production Process** | REG-KEY of the Production Process (PPD) to be triggered |
| **Trigger Type** | Type of action: `START`, `COMPLETE`, or `SIGNOFF` |

## **Disclaimer**

This application is **not an official SAP product** and is **not supported by SAP**.
It was developed as part of a service delivery.