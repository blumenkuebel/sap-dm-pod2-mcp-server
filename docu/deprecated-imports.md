# Deprecated SAPUI5 Pseudo-Module Imports — Exhaustive Reference

> This file is the **single source of truth** for M36 detection.
> The `validate_project` agent MUST load this file and match imports against these exact lists.

## Overview

SAPUI5 previously exposed enum/type constants as standalone AMD modules. This is **deprecated**.
Importing them directly produces console errors and will break in future SAPUI5 versions.

**Fix pattern:** Replace direct enum import with library import + destructuring.

---

## Deprecated `sap/m/` Pseudo-Modules (COMPLETE LIST)

These imports are ALL deprecated. If any appears in a `sap.ui.define([...])` dependency array, it is a **M36 finding**:

```
sap/m/BackgroundDesign
sap/m/ButtonType
sap/m/DeviationIndicator
sap/m/DialogRoleType
sap/m/DialogType
sap/m/FlexAlignItems
sap/m/FlexAlignSelf
sap/m/FlexDirection
sap/m/FlexJustifyContent
sap/m/FlexRendertype
sap/m/FlexWrap
sap/m/FrameType
sap/m/GenericTileMode
sap/m/HeaderLevel
sap/m/IBarHTMLTag
sap/m/ImageMode
sap/m/InputTextFormatMode
sap/m/InputType
sap/m/LabelDesign
sap/m/LinkConversion
sap/m/ListGrowingDirection
sap/m/ListHeaderDesign
sap/m/ListKeyboardMode
sap/m/ListMode
sap/m/ListSeparators
sap/m/ListType
sap/m/LoadState
sap/m/MenuButtonMode
sap/m/OverflowToolbarPriority
sap/m/PageBackgroundDesign
sap/m/PlacementType
sap/m/PopinDisplay
sap/m/PopinLayout
sap/m/QuickViewGroupElementType
sap/m/RatingIndicatorVisualMode
sap/m/ScreenSize
sap/m/SelectType
sap/m/Size
sap/m/SplitAppMode
sap/m/StandardTileType
sap/m/SwipeDirection
sap/m/SwitchType
sap/m/TileSizeBehavior
sap/m/ToolbarDesign
sap/m/ToolbarStyle
sap/m/ValueColor
sap/m/ValueCSSColor
sap/m/WrappingType
```

**Fix:** `import mLibrary from "sap/m/library"; const { ButtonType, InputType, ... } = mLibrary;`

---

## Deprecated `sap/ui/core/` Pseudo-Modules (COMPLETE LIST)

```
sap/ui/core/AccessibleLandmarkRole
sap/ui/core/BarColor
sap/ui/core/BusyIndicatorSize
sap/ui/core/CSSColor
sap/ui/core/CSSSize
sap/ui/core/Dock
sap/ui/core/HorizontalAlign
sap/ui/core/IconColor
sap/ui/core/ImeMode
sap/ui/core/IndicationColor
sap/ui/core/InvisibleMessageMode
sap/ui/core/MessageType
sap/ui/core/OpenState
sap/ui/core/Orientation
sap/ui/core/Priority
sap/ui/core/ScrollBarAction
sap/ui/core/Scrolling
sap/ui/core/SortOrder
sap/ui/core/TextAlign
sap/ui/core/TextDirection
sap/ui/core/TitleLevel
sap/ui/core/ValueState
sap/ui/core/VerticalAlign
sap/ui/core/Wrapping
```

**Fix:** `import coreLibrary from "sap/ui/core/library"; const { ValueState, MessageType, ... } = coreLibrary;`

---

## NOT Deprecated — Valid Direct Imports (Control Classes)

These are actual Control/Class modules that are correctly imported directly:

### `sap/m/` Controls (valid — DO NOT flag):
```
Button, Input, Text, Label, Title, Link, Icon, Image,
Table, Column, ColumnListItem,
List, StandardListItem, CustomListItem, GroupHeaderListItem,
Dialog, Popover, ResponsivePopover,
VBox, HBox, FlexBox, ScrollContainer,
Panel, Bar, Toolbar, OverflowToolbar, ToolbarSpacer, ToolbarSeparator,
Page, App, SplitApp, Shell,
Select, ComboBox, MultiComboBox, MultiInput, SearchField,
DatePicker, TimePicker, DateTimePicker,
Switch, CheckBox, RadioButton, RadioButtonGroup,
MessageStrip, MessageBox, MessageToast, MessagePopover, MessageItem,
ObjectHeader, ObjectListItem, ObjectAttribute, ObjectStatus, ObjectNumber,
ProgressIndicator, RatingIndicator, Slider, BusyIndicator,
Carousel, IconTabBar, IconTabFilter, IconTabSeparator,
SegmentedButton, SegmentedButtonItem,
TabContainer, TabContainerItem,
FormattedText, Token, Tokenizer,
GenericTile, TileContent, NumericContent,
Breadcrumbs, FeedListItem, NotificationListItem,
StepInput, TextArea, ColorPicker,
PlanningCalendar, SinglePlanningCalendar,
UploadCollection, Wizard, WizardStep,
library
```

### `sap/ui/core/` Classes (valid — DO NOT flag):
```
Control, Element, Component, Fragment, HTML, Icon,
BusyIndicator, InvisibleText, InvisibleMessage,
CustomData, Item, ListItem, SeparatorItem,
format/NumberFormat, format/DateFormat,
library
```

---

## Detection Commands (EXACT — copy-paste for the agent)

### Grep for `sap/m/` deprecated enums:

```bash
grep -rnE '"sap/m/(BackgroundDesign|ButtonType|DeviationIndicator|DialogRoleType|DialogType|FlexAlignItems|FlexAlignSelf|FlexDirection|FlexJustifyContent|FlexRendertype|FlexWrap|FrameType|GenericTileMode|HeaderLevel|IBarHTMLTag|ImageMode|InputTextFormatMode|InputType|LabelDesign|LinkConversion|ListGrowingDirection|ListHeaderDesign|ListKeyboardMode|ListMode|ListSeparators|ListType|LoadState|MenuButtonMode|OverflowToolbarPriority|PageBackgroundDesign|PlacementType|PopinDisplay|PopinLayout|QuickViewGroupElementType|RatingIndicatorVisualMode|ScreenSize|SelectType|Size|SplitAppMode|StandardTileType|SwipeDirection|SwitchType|TileSizeBehavior|ToolbarDesign|ToolbarStyle|ValueColor|ValueCSSColor|WrappingType)"' --include="*.js" .
```

### Grep for `sap/ui/core/` deprecated enums:

```bash
grep -rnE '"sap/ui/core/(AccessibleLandmarkRole|BarColor|BusyIndicatorSize|CSSColor|CSSSize|Dock|HorizontalAlign|IconColor|ImeMode|IndicationColor|InvisibleMessageMode|MessageType|OpenState|Orientation|Priority|ScrollBarAction|Scrolling|SortOrder|TextAlign|TextDirection|TitleLevel|ValueState|VerticalAlign|Wrapping)"' --include="*.js" .
```

### Combined one-liner:

```bash
grep -rnE '"sap/(m/(BackgroundDesign|ButtonType|InputType|ListMode|ListType|ListSeparators|PlacementType|FlexAlignItems|FlexJustifyContent|FlexDirection|FlexWrap|ToolbarDesign|OverflowToolbarPriority|ValueColor|Size|FrameType|LoadState|GenericTileMode|TileSizeBehavior|PopinDisplay|ScreenSize|DialogType|MenuButtonMode|SplitAppMode)|ui/core/(ValueState|MessageType|TextAlign|TextDirection|VerticalAlign|HorizontalAlign|TitleLevel|Priority|IconColor|Wrapping|SortOrder|Orientation|Dock|OpenState|IndicationColor|BarColor|AccessibleLandmarkRole|InvisibleMessageMode|ScrollBarAction))"' --include="*.js" .
```

---

## Fix Template

For each finding, apply this mechanical transformation:

### Before (deprecated):
```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/m/ButtonType",   // ← DEPRECATED
    "sap/m/InputType"     // ← DEPRECATED
], function(Button, ButtonType, InputType) {
```

### After (correct):
```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/m/library"       // ← Import library instead
], function(Button, mLibrary) {
    const { ButtonType, InputType } = mLibrary;  // ← Destructure at top
```

For `sap/ui/core/` enums:
```javascript
sap.ui.define([
    "sap/ui/core/library"
], function(coreLibrary) {
    const { ValueState, MessageType } = coreLibrary;
```

**Rule:** If `"sap/m/library"` or `"sap/ui/core/library"` is already in the dependency array, just add the destructuring — do not duplicate the import.