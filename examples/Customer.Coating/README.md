# **Customer.Coating — SAP DM POD 2.0 Coating Extension (Widget & Actions)**

**Customer.Coating** is a custom SAP Digital Manufacturing (DM) POD 2.0 plugin designed for use in a coating process (Beschichtung). It enables operators to calculate and distribute the coating thickness for one or multiple SFCs based on process parameters (area, speed, viscosity, coverage) or a manually entered thickness value.

## **Components**

| Component | File | Description |
|-----------|------|-------------|
| **Widget** | `widget/CoatingWidget.js` | Dialog with SFC table and thickness calculation form |
| **Validation Action** | `action/CoatingValidationAction.js` | SFC/Batch-Group validation + PPD call for default settings (tolerances, coverage) |
| **Execution Action** | `action/CoatingExecutionAction.js` | Input validation + PPD call with SFC thickness list and selected worklist items |
| **Context** | `context/CoatingContext.js` | Singleton context class — data exchange between Widget & Actions via PodContext |
| **i18n** | `i18n/` | Language files (DE, EN, EN_US) |

## **Key Capabilities**

- Select one or multiple SFCs from the Worklist for processing.
- Batch Group validation: all SFCs of a Batch Group must be selected together; mixing SFCs from different Batch Groups is not permitted.
- SFC status check: SFCs with status **Curing**, **QC** or **Hold** are blocked from processing.
- Thickness calculation formula: `Thickness [µm] = (Area [m²] x 100) x (Speed [mm/s] / 50) x (Viscosity [mPa·s] / 200) x Coverage [g/m²]`.
- Tolerance limits (Min/Max) per parameter are provided by the Validation Production Process and enforced in real time.
- Alternative: direct thickness entry overrides the calculated thickness.
- Proportional thickness distribution across multiple SFCs based on their original quantities.
- Configurable Production Processes (PPD) via ActionProperties in the POD Designer.
- Localization: English (default) and German.

## **Project Structure**

```
Customer.Coating/
├── extension.json
├── widget/
│   └── CoatingWidget.js
├── action/
│   ├── CoatingValidationAction.js
│   └── CoatingExecutionAction.js
├── context/
│   └── CoatingContext.js
├── i18n/
│   ├── i18n.properties
│   ├── i18n_de.properties
│   ├── i18n_en.properties
│   └── i18n_en_US.properties
└── README.md
```

## **Production Process Data Structure**

### Validation PPD — Request Parameters

The `CoatingValidationAction` sends the following parameters to the configured Validation Production Process:

| Parameter | Type | Description |
|-----------|------|-------------|
| `Plant` | string | Current plant from PodContext |
| `Workcenter` | string | Selected Work Center |
| `Sfcs` | string[] | Array of selected SFC numbers |
| `Resource` | string | Selected Resource |

**Example:**
```json
{
  "Plant": "1030",
  "Workcenter": "WC01",
  "Sfcs": ["SFC001", "SFC002"],
  "Resource": "RES01"
}
```

### Validation PPD — Expected Response

The Validation PPD must return the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `ValidationResults` | object[] | Array of SFC validation results with status |
| `ValidationResults[].Sfc` | string | SFC number |
| `ValidationResults[].Status` | string | Status string (e.g. `"OK"`, `"Curing"`, `"QC"`, `"Hold"`) |
| `DefaultSettings` | object[] | Array of parameter tolerance settings |
| `DefaultSettings[].Property` | string | Property name (`Area`, `Speed`, `Viscosity`, `ManualThickness`) |
| `DefaultSettings[].Min` | string | Minimum allowed value |
| `DefaultSettings[].Max` | string | Maximum allowed value |
| `Coverage` | string | Coverage value in g/m² (used in thickness calculation) |

**Example:**
```json
{
  "ValidationResults": [
    { "Sfc": "SFC001", "Status": "OK" },
    { "Sfc": "SFC002", "Status": "Curing" }
  ],
  "DefaultSettings": [
    { "Property": "Area", "Min": "0.5", "Max": "5.0" },
    { "Property": "Speed", "Min": "10", "Max": "100" },
    { "Property": "Viscosity", "Min": "50", "Max": "500" },
    { "Property": "ManualThickness", "Min": "1", "Max": "200" }
  ],
  "Coverage": "12.5"
}
```

### Execution PPD — Request Parameters

The `CoatingExecutionAction` sends the following parameters to the configured Execution Production Process:

| Parameter | Type | Description |
|-----------|------|-------------|
| `Plant` | string | Current plant from PodContext |
| `Workcenter` | string | Selected Work Center |
| `Resource` | string | Selected Resource |
| `Operation` | string | Operation activity of the first selected item |
| `StepId` | string | Step ID of the first selected item |
| `Sfcs` | object[] | Array of SFC objects with thickness and status |
| `Sfcs[].Sfc` | string | SFC number |
| `Sfcs[].Thickness` | number | Calculated or manually entered thickness in µm |
| `Sfcs[].Status` | string | SFC status code |
| `SelectedWorkListItems` | string (JSON) | JSON-serialized array of all selected worklist items |
| `LogDcThicknessCollected` | boolean | Whether to log thickness as Data Collection (configurable Action Property) |

**Example:**
```json
{
  "Plant": "1030",
  "Workcenter": "WC01",
  "Resource": "RES01",
  "Operation": "OP01",
  "StepId": "1",
  "Sfcs": [
    { "Sfc": "SFC001", "Thickness": 85, "Status": "402" },
    { "Sfc": "SFC002", "Thickness": 43, "Status": "402" }
  ],
  "SelectedWorkListItems": "[{\"sfc\":\"SFC001\",...}]",
  "LogDcThicknessCollected": true
}
```

## **Configuration in Manage PODs 2.0**

1. Upload the custom extension as a ZIP file into SAP DM.
2. Use the namespace: `customer.custom.extensions.coating`
3. Create a new POD or modify an existing POD:
   - Add a new dialog.
   - Add the **Coating** widget to the dialog.
   - Create a **Cancel** button and configure the action `CloseDialog`.
   - Create a **Confirm** button and configure the actions:
     1. `CoatingExecutionAction`
     2. `CloseDialog`
4. Add a **Coating** button to one of the pages and configure the actions:
   1. `CoatingValidationAction`
   2. `ShowDialog` (linked to the newly created coating dialog)

## **Disclaimer**

This application is **not an official SAP product** and is **not supported by SAP**.
