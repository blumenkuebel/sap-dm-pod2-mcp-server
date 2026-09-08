# PodContext ModelPath Reference

> **Source:** `sap.dm.dme.pod2.context.ModelPath` — All standard model paths available via `PodContext.get()`, `PodContext.set()`, and `PodContext.subscribe()`.

---

## Import

```js
sap.ui.define([
  "sap/dm/dme/pod2/context/PodContext",
  "sap/dm/dme/pod2/context/ModelPath"
], (PodContext, ModelPath) => {
  // Use ModelPath constants instead of string literals
  const items = PodContext.get(ModelPath.WorkListItems);
  
  PodContext.subscribe(ModelPath.SelectedWorkListItems, (value) => {
    // React to selection change
  }, this);
});
```

---

## All Standard Model Paths

| Constant Name | Path String | Category |
|---------------|-------------|----------|
| `ActivityConfirmationSummaryList` | `/activityConfirmation/summaries/list` | Activity Confirmation |
| `ExecutionSFCQuantity` | `/execution/sfcQuantity` | Execution |
| `FilterInputType` | `/filter/inputType` | Filters |
| `FilterMaterials` | `/filter/materials` | Filters |
| `FilterOperationActivities` | `/filter/operationActivities` | Filters |
| `FilterProcessLot` | `/filter/processLot` | Filters |
| `FilterResources` | `/filter/resources` | Filters |
| `FilterSfcs` | `/filter/sfcs` | Filters |
| `FilterWorkCenters` | `/filter/workCenters` | Filters |
| `GoodsReceiptSummary` | `/goodsReceipt/summary` | Goods Receipt |
| `GoodsReceiptLineItems` | `/goodsReceipt/summary/lineItems` | Goods Receipt |
| `InspectionFieldCombinations` | `/qualityInspection/fieldCombinations` | Quality Inspection |
| `InspectionPoints` | `/qualityInspection/inspectionPoints` | Quality Inspection |
| `InspectionCharacteristics` | `/qualityInspection/inspectionCharacteristics` | Quality Inspection |
| `InspectionCharacteristicsResults` | `/qualityInspection/inspectionCharacteristicsResults` | Quality Inspection |
| `InspectionPointLot` | `/qualityInspection/inspectionPointLot` | Quality Inspection |
| `IsEnablePoint` | `/qualityInspection/isEnablePoint` | Quality Inspection |
| `LastSelectedOperationActivity` | `/execution/operationActivity/lastSelected` | Selection |
| `LastSelectedWorkListItem` | `/workList/lastSelected` | Selection |
| `MessageHistory` | `/messageHistory` | Messages |
| `OperationActivities` | `/execution/operationActivity/list` | Execution |
| `OperationActivitiesLoading` | `/execution/operationActivity/loading` | Execution |
| `Plant` | `/plant` | Environment |
| `Pod` | `/pod` | Environment |
| `ReportedQuantityCount` | `/quantityConfirmation/count` | Quantity Confirmation |
| `ReportedQuantityLoading` | `/quantityConfirmation/loading` | Quantity Confirmation |
| `ReportedQuantityItems` | `/quantityConfirmation/list` | Quantity Confirmation |
| `SelectedOperationActivities` | `/execution/operationActivity/selected` | Selection |
| `SelectedWorkInstruction` | `/workInstruction/selected` | Selection |
| `SelectedWorkListItems` | `/workList/selected` | Selection |
| `UserId` | `/user/id` | User |
| `UserLanguage` | `/user/language` | User |
| `WorkInstructions` | `/workInstruction/list` | Work Instructions |
| `WorkInstructionsLoading` | `/workInstruction/loading` | Work Instructions |
| `WorkListCount` | `/workList/count` | Work List |
| `WorkListItems` | `/workList/list` | Work List |
| `WorkListLoading` | `/workList/loading` | Work List |
| `WorkListPageSize` | `/workList/pageSize` | Work List |
| `WorkListSorting` | `/workList/sorting` | Work List |
| `WorkListType` | `/workList/type` | Work List |

---

## Paths by Category

### Filters
Used to read/write the POD worklist filter bar values:

```js
PodContext.get(ModelPath.FilterSfcs);              // string[] — SFC filter values
PodContext.get(ModelPath.FilterMaterials);          // string[] — Material filter values
PodContext.get(ModelPath.FilterResources);          // string[] — Resource filter values
PodContext.get(ModelPath.FilterWorkCenters);        // string[] — Work Center filter values
PodContext.get(ModelPath.FilterOperationActivities); // string[] — Op. Activity filter values
PodContext.get(ModelPath.FilterProcessLot);         // string | null — Process Lot filter
PodContext.get(ModelPath.FilterInputType);          // WorkListFilterInputType enum
```

### Work List
Core worklist data:

```js
PodContext.get(ModelPath.WorkListItems);    // WorkListItem[] — All loaded items
PodContext.get(ModelPath.WorkListCount);    // number — Total count
PodContext.get(ModelPath.WorkListLoading);  // boolean — Loading indicator
PodContext.get(ModelPath.WorkListPageSize); // number — Items per page (default: 100)
PodContext.get(ModelPath.WorkListSorting);  // Sorting[] — Current sort criteria
PodContext.get(ModelPath.WorkListType);     // WorkListType enum
```

### Selection
Currently selected items (most frequently subscribed):

```js
PodContext.get(ModelPath.SelectedWorkListItems);        // WorkListItem[] — All selected
PodContext.get(ModelPath.LastSelectedWorkListItem);     // WorkListItem | null — Last clicked
PodContext.get(ModelPath.SelectedOperationActivities);  // OperationActivity[] — Selected phases
PodContext.get(ModelPath.LastSelectedOperationActivity); // OperationActivity | null
PodContext.get(ModelPath.SelectedWorkInstruction);       // WorkInstruction | null
```

### Execution
SFC execution state:

```js
PodContext.get(ModelPath.ExecutionSFCQuantity);       // number | null
PodContext.get(ModelPath.OperationActivities);        // OperationActivity[] — All loaded
PodContext.get(ModelPath.OperationActivitiesLoading); // boolean
```

### Quantity Confirmation
Reported quantity data:

```js
PodContext.get(ModelPath.ReportedQuantityItems);   // ReportedQuantity[]
PodContext.get(ModelPath.ReportedQuantityCount);   // number
PodContext.get(ModelPath.ReportedQuantityLoading); // boolean
```

### Environment
Plant and POD metadata:

```js
PodContext.get(ModelPath.Plant);   // Plant object { plant, timeZone, industryType }
PodContext.get(ModelPath.Pod);     // Pod object { id, description, dirty }
PodContext.get(ModelPath.UserId);  // string — Logged-in user
PodContext.get(ModelPath.UserLanguage); // string — e.g. "en", "de"
```

### Goods Receipt
```js
PodContext.get(ModelPath.GoodsReceiptSummary);   // GoodsReceiptSummary object
PodContext.get(ModelPath.GoodsReceiptLineItems); // GoodsReceiptLineItem[]
```

### Quality Inspection
```js
PodContext.get(ModelPath.InspectionFieldCombinations);       // object[]
PodContext.get(ModelPath.InspectionPoints);                  // object[]
PodContext.get(ModelPath.InspectionCharacteristics);         // object[]
PodContext.get(ModelPath.InspectionCharacteristicsResults);  // object[]
PodContext.get(ModelPath.InspectionPointLot);                // object | null
PodContext.get(ModelPath.IsEnablePoint);                     // boolean
```

### Messages & Activity Confirmation
```js
PodContext.get(ModelPath.MessageHistory);                    // UserMessage[]
PodContext.get(ModelPath.ActivityConfirmationSummaryList);   // ActivityConfirmationSummary[]
```

### Work Instructions
```js
PodContext.get(ModelPath.WorkInstructions);        // WorkInstruction[]
PodContext.get(ModelPath.WorkInstructionsLoading); // boolean
```

---

---

## Extension Model Paths

These model paths are registered by optional POD2 libraries (loaded on demand):

### BatchModelPath (`sap.dm.dme.pod2.batch.context.BatchModelPath`)

| Constant Name | Path String | Description |
|---------------|-------------|-------------|
| `BatchList` | `/batch/list` | List of batch items |
| `BatchListLoading` | `/batch/loading` | Loading state for batch list |
| `SelectedBatchItem` | `/batch/selected` | Currently selected batch |
| `BatchCharacteristicsPayload` | `/batchCharacteristics/payload` | Batch characteristics request payload |
| `BatchCharacteristicsDetails` | `/batchCharacteristics/details` | Batch characteristics detail list |
| `BatchCharacteristicsValidationResult` | `/batchCharacteristics/validationResult` | Validation result for batch characteristics |

```js
sap.ui.define([
  "sap/dm/dme/pod2/batch/context/BatchModelPath",
  "sap/dm/dme/pod2/context/PodContext"
], (BatchModelPath, PodContext) => {
  const batches = PodContext.get(BatchModelPath.BatchList);
  const selected = PodContext.get(BatchModelPath.SelectedBatchItem);
});
```

### DataCollectionModelPath (`sap.dm.dme.pod2.datacollection.context.DataCollectionModelPath`)

| Constant Name | Path String | Description |
|---------------|-------------|-------------|
| `DataCollectionGroups` | `/dataCollection/groups/list` | DC groups for selected work |
| `DataCollectionInput` | `/dataCollection/params/new` | DC parameters to be logged |
| `DataCollectionSelectedGroup` | `/dataCollection/groups/selected` | Selected DC group |

### Additional PodContext Paths (not in ModelPath enum)

These paths are used internally and can be accessed via `PodContext.get()`:

| Path String | Description |
|-------------|-------------|
| `/activitySummaries` | Activity summaries object |
| `/activitySummaries/summaries` | List of activity summaries |
| `/badgedInUser` | Currently badged-in user |
| `/filter/sfc` | Legacy: single SFC filter (prefer `FilterSfcs`) |

### QualityInspectionModelPath (`sap.dm.dme.pod2.qualityinspection`)

| Constant Name | Path String | Description |
|---------------|-------------|-------------|
| `FieldCombinations` | `/qualityInspection/fieldCombinations` | Inspection field combinations |
| `IsEnablePoint` | `/qualityInspection/isEnablePoint` | Whether inspection point is enabled |
| `InspectionPoints` | `/qualityInspection/inspectionPoints` | List of inspection points |
| `InspectionCharacteristics` | `/qualityInspection/inspectionCharacteristics` | Inspection characteristics |
| `InspectionCharacteristicsResults` | `/qualityInspection/inspectionCharacteristicsResults` | Inspection results |
| `InspectionPointLot` | `/qualityInspection/inspectionPointLot` | Inspection point lot |
| `InspectionPointLotInspectionLot` | `/qualityInspection/inspectionPointLot/inspectionLot` | Inspection lot within point lot |

> **Note:** Quality Inspection paths overlap with the standard `ModelPath` constants (e.g. `InspectionFieldCombinations`). The QI library provides a more specialized view with the additional `InspectionPointLotInspectionLot` path.

---

## Custom Paths

In addition to the standard paths above, plugins can use **custom paths** for their own state:

```js
// Set custom data (any path NOT in ModelPath)
PodContext.set("/myPlugin/coatingThickness", 2.5);

// Subscribe to custom paths
PodContext.subscribe("/myPlugin/coatingThickness", (value) => {
  this.getView().byId("thicknessInput").setValue(value);
}, this);
```

> **Rule:** Standard paths (from `ModelPath`) are managed by the framework — only use the provided setter methods (e.g. `PodContext.setSelectedWorkListItems()`). Custom paths are free for plugin use.

---

## Convenience Methods

PodContext provides typed getter/setter pairs for all standard paths. Prefer these over raw `get()`/`set()`:

| Method | Equivalent |
|--------|-----------|
| `PodContext.getPlant()` | `PodContext.get(ModelPath.Plant).plant` |
| `PodContext.getPlantTimeZone()` | `PodContext.get(ModelPath.Plant).timeZone` |
| `PodContext.getIndustryType()` | `PodContext.get(ModelPath.Plant).industryType` |
| `PodContext.isProcessIndustry()` | `industryType === "PROCESS"` |
| `PodContext.isDiscreteIndustry()` | `industryType === "DISCRETE"` |
| `PodContext.getPodId()` | `PodContext.get(ModelPath.Pod).id` |
| `PodContext.getUserId()` | `PodContext.get(ModelPath.UserId)` |
| `PodContext.getSelectedWorkListItems()` | `PodContext.get(ModelPath.SelectedWorkListItems)` |
| `PodContext.getLastSelectedWorkListItem()` | Last element of selected items |
| `PodContext.getWorkListItems()` | `PodContext.get(ModelPath.WorkListItems)` |
| `PodContext.getWorkListCount()` | `PodContext.get(ModelPath.WorkListCount)` |
| `PodContext.getSelectedOperationActivities()` | `PodContext.get(ModelPath.SelectedOperationActivities)` |
| `PodContext.getLastSelectedOperationActivity()` | Last element of selected OAs |
| `PodContext.getWorkInstructions()` | `PodContext.get(ModelPath.WorkInstructions)` |
| `PodContext.getMessageHistory()` | `PodContext.get(ModelPath.MessageHistory)` |
| `PodContext.getWhenAvailable(path)` | Promise that resolves when path becomes non-null |

---

## Subscribe Patterns

```js
// Single path — callback receives (value, path)
PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);

// Multiple paths — callback receives (Map<path, value>, Map<path, changed>)
PodContext.subscribe(
  [ModelPath.SelectedWorkListItems, ModelPath.OperationActivities],
  this._onDataChanged,
  this
);

// Unsubscribe specific
PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);

// Unsubscribe ALL for a bind context (use in destroy)
PodContext.unsubscribeAll(this);
```

> **Important:** The third argument (`this`) is the **bind context** — used for cleanup. Always call `PodContext.unsubscribeAll(this)` in your Widget's `destroy()` method.