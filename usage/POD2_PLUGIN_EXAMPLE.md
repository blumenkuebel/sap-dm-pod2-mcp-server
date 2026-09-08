# POD 2.0 Plugin – Request

---

## Plugin

| Field | Value |
|-------|-------|
| **Name**        | `Coating` |
| **Namespace**   | `customer.custom.extension.coating` |
| **Description** | Coating thickness calculation and distribution across selected SFCs |
| **Category**    | `Customer` |

## Widget

- Two-area layout side by side
- Left: table of selected SFCs with columns SFC, Process Lot, Quantity (kg), New Quantity (kg)
- Right: calculation form with editable fields Area, Speed, Viscosity, read-only Coverage (from PPD), calculated Thickness result, and Direct Thickness override input
- Dimension fields show min/max range hints and turn red when values are out of range
- On input change, thickness is recalculated and distributed proportionally across the SFCs
- `Direct Thickness` overrides the formula

## Actions

### Action: Validate

- Triggered implicitly on widget mount and on SFC selection change
- Pre-flight check before coating thickness can be calculated
- Rules:
  - At least one SFC must be selected
  - Process Lot: no mixing allowed; if a lot is selected, ALL its SFCs must be selected
  - Block SFCs with status "Curing", "QC", or "Hold"
- Calls Validation PPD with selected SFCs from PodContext (`SelectedWorkListItems`)
- DefaultSettings response must contain entries for: Area, Speed, Viscosity, ManualThickness
- Returns `ValidationResults[]`, `DefaultSettings` (Min/Max ranges per property), and `Coverage` value

**Sample payload** _(Validation PPD response)_:
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

### Action: Execute

- Triggered by the "Execute" button in the widget
- Pre-condition: widget input state must be valid (all fields valid, thickness > 0)
- Persists calculated thickness per SFC and triggers the downstream PPD
- Calls Execution PPD with the SFC thickness list and `LogDcThicknessCollected` flag
- `LogDcThicknessCollected` is a Boolean Action Property, configurable in POD Designer
- Shows success/error toast; resets widget on success

**Sample payload** _(Execution PPD request parameters)_:
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

_Template v2.1 · sap-dm-pod2-mcp-server v1.0.0_