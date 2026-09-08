# POD 2.0 Plugin – Request

## Plugin

| Field | Value |
|-------|-------|
| **Name** | `Coating` |
| **Namespace** | `customer.custom.extensions.coating` |
| **Type** | `full` |
| **Description** | Coating thickness calculation and distribution across selected SFCs |

## What should it do?

The widget shows two areas side by side. Left: a table of selected SFCs with columns SFC, Process Lot, Quantity (kg), New Quantity (kg). Right: a calculation form with editable fields Area, Speed, Viscosity, a read-only Coverage field (from PPD), a calculated Thickness result, and a Direct Thickness override input. Dimension fields show min/max range hints and turn red when values are out of range. On input change, thickness is recalculated and distributed proportionally across the SFCs. Direct Thickness overrides the formula.

## Validation Rules

1. At least one SFC must be selected
2. Process Lot: no mixing allowed; if a lot is selected, ALL its SFCs must be selected
3. Call Validation PPD → response provides ValidationResults, DefaultSettings, Coverage
4. DefaultSettings must contain entries for: Area, Speed, Viscosity, ManualThickness
5. Block SFCs with status "Curing", "QC", or "Hold"

## Execution Logic

1. Validate widget input state (all fields valid, thickness > 0)
2. Call Execution PPD with SFC thickness list and LogDcThicknessCollected flag
3. LogDcThicknessCollected = Boolean Action Property (configurable in POD Designer)

## API Data

**Validation PPD – Response:**
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

**Execution PPD – Request (parameters):**
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
  "SelectedWorkListItems": "[...]",
  "LogDcThicknessCollected": true
}
```

---

_Template v1.2 · pod2-mcp-server v5.1+_