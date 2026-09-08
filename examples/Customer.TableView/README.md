# **Customer.TableView — SAP DM POD 2.0 Generic Table View Widget**

**Customer.TableView** is a custom SAP Digital Manufacturing (DM) POD 2.0 widget-only plugin that displays a dynamic table whose content is provided by a configurable Production Process (PPD).

## **Components**

| Component | File | Description |
|-----------|------|-------------|
| **Widget** | `widget/TableViewWidget.js` | Dynamic table widget — subscribes to worklist selection, calls PPD, renders table |
| **i18n** | `i18n/` | Language files (DE, EN, EN_US) |

## **Key Capabilities**

- Reacts to worklist SFC selection changes in real time via `PodContext.subscribe()`.
- Calls a configurable Production Process (PPD) to retrieve table content dynamically.
- Renders a fully dynamic `sap.m.Table` with columns and rows from the PPD response.
- Supports SAP icon rendering in cells.
- If the `Columns` field is empty, the table is rendered without a column header row.
- Configurable Production Process key via POD Designer widget properties.
- Localization: English (default) and German.

## **Project Structure**

```
Customer.TableView/
├── extension.json
├── README.md
├── widget/
│   └── TableViewWidget.js
├── i18n/
│   ├── i18n.properties
│   ├── i18n_de.properties
│   ├── i18n_en.properties
│   └── i18n_en_US.properties
```

## **Production Process Data Structure**

### Request Parameters

The widget sends the following parameters to the configured Production Process on each worklist selection change:

| Parameter | Type | Description |
|-----------|------|-------------|
| `Plant` | string | Current plant from PodContext |
| `Operation` | string | First selected Operation Activity (or empty string) |
| `Resource` | string | Selected Resource (or empty string) |
| `WorkCenter` | string | Selected Work Center (or empty string) |
| `Sfcs` | string[] | Array of selected SFC numbers |

**Example:**
```json
{
  "Plant": "1030",
  "Operation": "OP01",
  "Resource": "RES01",
  "WorkCenter": "WC01",
  "Sfcs": ["SFC001", "SFC002"]
}
```

### Expected Response

The Production Process must return the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `Header` | string | Table header text (displayed above the table) |
| `Columns` | string | Comma-separated column names (if empty, no header row is rendered) |
| `Rows` | object[] | Array of row objects |
| `Rows[].Row` | string[] | Array of cell values; values starting with `sap-icon://` are rendered as icons |

**Example:**
```json
{
  "Header": "Inspection Results",
  "Columns": "Parameter,Value,Status",
  "Rows": [
    { "Row": ["Temperature", "85°C", "sap-icon://accept"] },
    { "Row": ["Pressure", "2.1 bar", "sap-icon://alert"] },
    { "Row": ["Humidity", "45%", "sap-icon://accept"] }
  ]
}
```

**Example without column headers:**
```json
{
  "Header": "SFC Details",
  "Columns": "",
  "Rows": [
    { "Row": ["Material", "MAT-001"] },
    { "Row": ["Batch", "BATCH-2025-01"] }
  ]
}
```

## **Configuration in Manage PODs 2.0**

1. Upload this project as a ZIP file via the SAP DM *Manage Extensions* app.
2. Use the namespace: `customer.custom.extensions.tableview`
3. Add the **TableView** widget to a page or dialog.
4. Configure the Widget Property:

| Property | Type | Description |
|----------|------|-------------|
| **Production Process** | String | REG-KEY of the Production Process that provides the table content |

## **Disclaimer**

This application is **not an official SAP product** and is **not supported by SAP**.
It was developed as part of a service delivery.