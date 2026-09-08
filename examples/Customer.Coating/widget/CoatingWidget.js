sap.ui.define([
    "customer/custom/extensions/coating/context/CoatingContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/ui/model/json/JSONModel",
    "sap/ui/layout/form/Form",
    "sap/ui/layout/form/FormContainer",
    "sap/ui/layout/form/FormElement",
    "sap/ui/layout/form/ResponsiveGridLayout",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/ValueState",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/FlexItemData",
    "sap/m/Input",
    "sap/m/InputType",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/BackgroundDesign",
    "sap/m/ListSeparators"
], (
    CoatingContext, I18nResourceModel, Widget, PodContext, JSONModel,
    Form, FormContainer, FormElement, ResponsiveGridLayout, NumberFormat, ValueState,
    HBox, VBox, FlexItemData, Input, InputType, Label, Text, Table, Column, ColumnListItem,
    BackgroundDesign, ListSeparators
) => {
    "use strict";

    class CoatingWidget extends Widget {

        async onInit() {
            await super.onInit();
            
            let i18nCustomModel = CoatingWidget.getI18nModel();
            this.getPodRuntime().getView().setModel(i18nCustomModel, "i18nCoating");

            const selectedItems = PodContext.getSelectedWorkListItems() || [];
            const aRows = selectedItems.map(item => ({
                sfc: item.sfc,
                batchGroup: item.processLot || "\u2013",
                sfcQty: this._formatNumber(item.sfcQuantity ?? item.sfcQty ?? ""),
                newSfcQty: ""
            }));

            const oModel = new JSONModel({ rows: aRows });
            this._oTable.setModel(oModel);
            this._oTable.bindItems({
                path: "/rows",
                template: new ColumnListItem({
                    cells: [
                        new Text({ text: "{sfc}" }),
                        new Text({ text: "{batchGroup}" }),
                        new Text({ text: "{sfcQty}" }),
                        new Text({ text: "{newSfcQty}" })
                    ]
                })
            });

            const coverage = CoatingContext.getCoverage();
            if (coverage !== null && coverage !== undefined) {
                this._oCoverageInput.setValue(this._formatNumber(coverage));
            }
            this._applyMinMax();
        }

        onExit() {
            super.onExit();
            CoatingContext.setSfcThicknesses([]);
            CoatingContext.setInputState(null);
        }

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.coating.i18n.i18n"
        });

        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("coating.displayName"); }
        static getIcon() { return "sap-icon://process"; }
        static getCategory() { return this.getI18nText("coating.category"); }
        static getDescription() { return this.getI18nText("coating.description"); }

        _getNumberFormat() {
            if (!this._oNumberFormat) {
                this._oNumberFormat = NumberFormat.getFloatInstance({ groupingEnabled: false });
            }
            return this._oNumberFormat;
        }

        _formatNumber(value) {
            if (value === "" || value === null || value === undefined) return "";
            const num = typeof value === "number" ? value : parseFloat(value);
            if (isNaN(num)) return String(value);
            return this._getNumberFormat().format(num);
        }

        _parseNumber(valueStr) {
            if (!valueStr) return NaN;
            const result = this._getNumberFormat().parse(valueStr);
            return (result === null || result === undefined) ? NaN : result;
        }

        _createView() {
            const oConfig = this.getConfig()
            const mkEl = (labelText, editable, showHint) => {
                const oInput = new Input({
                    width: "100%", type: InputType.Text,
                    editable: editable !== false,
                    liveChange: this._onCalcInputChange.bind(this)
                });
                let oHint = null;
                if (showHint) {
                    // Subtle range hint below the input.
                    // sap.m.Text with the sapUiTinyMarginTop utility class covers the
                    // spacing; Fiori theme + `sapUiSmallText` / `sapMH6` typography
                    // helpers cover the small light-grey visual weight without a
                    // plugin-owned CSS class. This complies with M61 (no plugin CSS
                    // surface — Fiori standard controls only).
                    oHint = new Text({ text: "" })
                        .addStyleClass("sapUiTinyMarginTop")
                        .addStyleClass("sapUiSmallText");
                }
                const oFormElement = new FormElement({
                    label: new Label({ text: labelText }),
                    fields: [showHint ? new VBox({ width: "100%", items: [oInput, oHint] }) : oInput]
                });
                return { element: oFormElement, input: oInput, hint: oHint };
            };

            this._oTable = new Table({
                backgroundDesign: BackgroundDesign.Transparent,
                showSeparators: ListSeparators.Inner,
                columns: [
                    new Column({ header: new Label({ text: this.getI18nText("coating.col.sfc") }) }),
                    new Column({ header: new Label({ text: this.getI18nText("coating.col.batchGroup") }) }),
                    new Column({ hAlign: "End", header: new Label({ text: this.getI18nText("coating.col.sfcQty") }) }),
                    new Column({ hAlign: "End", header: new Label({ text: this.getI18nText("coating.col.newSfcQty") }) })
                ]
            });

            const areaField = mkEl(this.getI18nText("coating.label.area"), true, true);
            const speedField = mkEl(this.getI18nText("coating.label.speed"), true, true);
            const viscosityField = mkEl(this.getI18nText("coating.label.viscosity"), true, true);
            const coverageField = mkEl(this.getI18nText("coating.label.coverage"), false);
            const calcField = mkEl(this.getI18nText("coating.label.calcThickness"), false);
            const directField = mkEl(this.getI18nText("coating.label.directThickness"), true, true);

            this._oAreaInput = areaField.input;
            this._oAreaHint = areaField.hint;
            this._oSpeedInput = speedField.input;
            this._oSpeedHint = speedField.hint;
            this._oViscosityInput = viscosityField.input;
            this._oViscosityHint = viscosityField.hint;
            this._oCoverageInput = coverageField.input;
            this._oCalcThicknessInput = calcField.input;
            this._oDirectThicknessInput = directField.input;
            this._oDirectThicknessHint = directField.hint;

            const oTableForm = new Form({
                editable: true, width: "100%",
                layout: new ResponsiveGridLayout({ columnsXL: 1, columnsL: 1, columnsM: 1, columnsS: 1 }),
                formContainers: [new FormContainer({
                    title: this.getI18nText("coating.title.sfcs"),
                    formElements: [new FormElement({ fields: [this._oTable] })]
                })],
                layoutData: new FlexItemData({ growFactor: 0, shrinkFactor: 0, baseSize: "70%" })
            });

            const oInputForm = new Form({
                editable: true, width: "100%",
                layout: new ResponsiveGridLayout({
                    labelSpanXL: 4, labelSpanL: 4, labelSpanM: 4, labelSpanS: 12,
                    columnsXL: 1, columnsL: 1, columnsM: 1, columnsS: 1
                }),
                formContainers: [new FormContainer({
                    title: this.getI18nText("coating.title.calculation"),
                    formElements: [
                        areaField.element, speedField.element, viscosityField.element,
                        coverageField.element, calcField.element, directField.element
                    ]
                })],
                layoutData: new FlexItemData({ growFactor: 0, shrinkFactor: 0, baseSize: "30%" })
            });

            return new HBox(oConfig.id, { width: "100%", items: [oTableForm, oInputForm] });
        }

        _applyMinMax() {
            const apply = (oInput, oHint, prop) => {
                const mm = this._getMinMax(prop);
                if (!mm) return;
                if (oInput) {
                    // mm.min / mm.max come from the Production Process JSON response
                    // (CoatingContext.getDefaultSettings()), so they are always
                    // dot-formatted strings ("0.5", "2.0", …). Native parseFloat()
                    // is correct here — locale-aware _parseNumber() would actually
                    // break in German locale. See common-mistakes #34.
                    oInput.data("min", parseFloat(mm.min));
                    oInput.data("max", parseFloat(mm.max));
                }
                if (oHint) {
                    const rangeText = this.getI18nText("coating.hint.range")
                        + " " + this._formatNumber(parseFloat(mm.min))
                        + " \u2013 " + this._formatNumber(parseFloat(mm.max));
                    // sap.m.Text uses setText() \u2014 the semantic control preserves the
                    // small light-grey styling via the sapUiSmallText helper set
                    // in _createView(). No plugin CSS, no HTML injection (M61).
                    oHint.setText(rangeText);
                }
            };
            apply(this._oAreaInput, this._oAreaHint, "Area");
            apply(this._oSpeedInput, this._oSpeedHint, "Speed");
            apply(this._oViscosityInput, this._oViscosityHint, "Viscosity");
            apply(this._oDirectThicknessInput, this._oDirectThicknessHint, "ManualThickness");
        }

        _getMinMax(propertyName) {
            const settings = CoatingContext.getDefaultSettings();
            if (!Array.isArray(settings)) return null;
            const entry = settings.find(s => s?.Property === propertyName);
            return entry ? { min: entry.Min, max: entry.Max } : null;
        }

        _onCalcInputChange() {
            const directValid = this._validateRange(this._oDirectThicknessInput);
            const directVal = this._parseNumber(this._oDirectThicknessInput.getValue());

            if (!isNaN(directVal) && directVal > 0) {
                const errors = [];
                if (!directValid) errors.push(this.getI18nText("coating.label.directThickness"));
                this._oCalcThicknessInput.setValue("");
                this._distributeThickness(Math.ceil(directVal));
                CoatingContext.setInputState({ valid: errors.length === 0, errors });
                return;
            }

            const dimFields = [
                { input: this._oAreaInput, label: "coating.label.area" },
                { input: this._oSpeedInput, label: "coating.label.speed" },
                { input: this._oViscosityInput, label: "coating.label.viscosity" }
            ];
            const errors = [];
            dimFields.forEach(f => {
                const rangeValid = this._validateRange(f.input);
                const val = this._parseNumber(f.input.getValue());
                if (!rangeValid || isNaN(val) || val <= 0) {
                    errors.push(this.getI18nText(f.label));
                }
            });

            const area = this._parseNumber(this._oAreaInput.getValue());
            const speed = this._parseNumber(this._oSpeedInput.getValue());
            const viscosity = this._parseNumber(this._oViscosityInput.getValue());
            const coverage = this._parseNumber(this._oCoverageInput.getValue());

            if ([area, speed, viscosity, coverage].every(v => !isNaN(v) && v > 0)) {
                const thicknessUm = (area * 100) * (speed / 50) * (viscosity / 200) * coverage;
                const totalRounded = Math.ceil(thicknessUm);
                this._oCalcThicknessInput.setValue(this._formatNumber(totalRounded));
                this._distributeThickness(totalRounded);
            } else {
                this._oCalcThicknessInput.setValue("");
                this._distributeThickness(null);
            }
            CoatingContext.setInputState({ valid: errors.length === 0, errors });
        }

        _validateRange(oInput) {
            if (!oInput) return true;
            const valueStr = oInput.getValue();
            if (!valueStr) {
                oInput.setValueState(ValueState.None);
                return true;
            }
            const value = this._parseNumber(valueStr);
            if (isNaN(value)) {
                oInput.setValueState(ValueState.Error);
                oInput.setValueStateText(this.getI18nText("msg.inputNotANumber"));
                return false;
            }
            const minVal = parseFloat(oInput.data("min"));
            const maxVal = parseFloat(oInput.data("max"));
            if ((!isNaN(minVal) && value < minVal) || (!isNaN(maxVal) && value > maxVal)) {
                oInput.setValueState(ValueState.Error);
                oInput.setValueStateText(
                    this.getI18nText("msg.inputOutOfRange")
                    + " " + this._formatNumber(minVal)
                    + " \u2013 " + this._formatNumber(maxVal)
                );
                return false;
            }
            oInput.setValueState(ValueState.Success);
            return true;
        }

        _distributeThickness(total) {
            if (!this._oTable) return;
            const oModel = this._oTable.getModel();
            if (!oModel) return;
            const aRows = oModel.getProperty("/rows");
            if (!aRows || aRows.length === 0) return;

            if (total === null || isNaN(total)) {
                aRows.forEach((_, i) => oModel.setProperty("/rows/" + i + "/newSfcQty", ""));
                CoatingContext.setSfcThicknesses([]);
                return;
            }
            if (aRows.length === 1) {
                oModel.setProperty("/rows/0/newSfcQty", this._formatNumber(total));
                CoatingContext.setSfcThicknesses([{ Sfc: aRows[0].sfc, Thickness: total }]);
                return;
            }
            const totalOrig = aRows.reduce((s, r) => { const q = this._parseNumber(r.sfcQty); return s + (isNaN(q) ? 0 : q); }, 0);
            let allocated = 0;
            const sfcThicknesses = [];
            aRows.forEach((row, i) => {
                if (i < aRows.length - 1) {
                    const rowQty = this._parseNumber(row.sfcQty);
                    const proportion = totalOrig > 0 ? (isNaN(rowQty) ? 0 : rowQty) / totalOrig : 1 / aRows.length;
                    const val = Math.floor(proportion * total);
                    oModel.setProperty("/rows/" + i + "/newSfcQty", this._formatNumber(val));
                    sfcThicknesses.push({ Sfc: row.sfc, Thickness: val });
                    allocated += val;
                } else {
                    const val = total - allocated;
                    oModel.setProperty("/rows/" + i + "/newSfcQty", this._formatNumber(val));
                    sfcThicknesses.push({ Sfc: row.sfc, Thickness: val });
                }
            });
            CoatingContext.setSfcThicknesses(sfcThicknesses);
        }
    }

    return CoatingWidget;
});
