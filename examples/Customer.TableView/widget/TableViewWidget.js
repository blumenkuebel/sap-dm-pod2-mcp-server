sap.ui.define([
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Title",
    "sap/m/VBox",
    "sap/m/MessageStrip",
    "sap/m/OverflowToolbar",
    "sap/m/BackgroundDesign",
    "sap/m/ListSeparators",
    "sap/ui/core/Icon",
], (
    I18nResourceModel, Widget, WidgetProperty, StringPropertyEditor,
    PodContext, ModelPath, ApiClient, Log, JSONModel,
    Table, Column, ColumnListItem, Text, Label, Title, VBox,
    MessageStrip, OverflowToolbar, BackgroundDesign, ListSeparators, Icon
) => {
    "use strict";

    const Logger = Log.getLogger("customer.custom.extensions.tableview.widget.TableViewWidget");

    class TableViewWidget extends Widget {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.tableview.i18n.i18n"
        });

        static getI18nModel() { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("tableView.displayName"); }
        static getIcon() { return "sap-icon://table-view"; }
        static getCategory() { return this.getI18nText("tableView.category"); }
        static getDescription() { return this.getI18nText("tableView.description"); }

        getProperties() {
            return [
                new WidgetProperty({
                    displayName: this.getI18nText("property.productionProcess.displayName"),
                    description: this.getI18nText("property.productionProcess.description"),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                })
            ];
        }

        async onInit() {
            await super.onInit();
            
            let i18nCustomModel = TableViewWidget.getI18nModel();
            this.getPodRuntime().getView().setModel(i18nCustomModel, "i18nTableView");

            if (PodContext.isRunMode()) {
                PodContext.subscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);
                const selectedItems = PodContext.getSelectedWorkListItems() || [];
                if (selectedItems.length > 0) {
                    this._onSelectionChanged(selectedItems);
                }
            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._onSelectionChanged, this);
            }
            this._oTable = null;
            this._oTitle = null;
            this._oMessageStrip = null;
            this._oContainer = null;
        }

        _createView() {
            const oConfig = this.getConfig();
            this._oTitle = new Title({ text: this.getI18nText("tableView.title.default"), level: "H4" });
            this._oMessageStrip = new MessageStrip({
                text: this.getI18nText("msg.noSfcSelected"), type: "Information", showIcon: true, visible: true
            });
            this._oTable = new Table({
                backgroundDesign: BackgroundDesign.Solid,
                showSeparators: ListSeparators.Inner,
                growing: true, growingThreshold: 50,
                noDataText: this.getI18nText("tableView.table.noData"),
                headerToolbar: new OverflowToolbar({ design: "Solid", content: [this._oTitle] })
            });
            this._oContainer = new VBox(oConfig.id, {
                width: "100%", items: [this._oMessageStrip, this._oTable]
            });
            return this._oContainer;
        }

        async _onSelectionChanged(aSelectedItems) {
            const selectedItems = aSelectedItems || [];
            if (selectedItems.length === 0) {
                this._clearTable();
                this._showMessage(this.getI18nText("msg.noSfcSelected"), "Information");
                return;
            }
            this._hideMessage();
            this._oTable.setBusy(true);
            try {
                const response = await this._callProductionProcess(selectedItems);
                this._renderTable(response);
            } catch (oError) {
                Logger.error("PPD call failed", oError);
                this._clearTable();
                this._showMessage(this.getI18nText("msg.ppdCallFailed") + " " + (oError.message || oError), "Error");
            } finally {
                this._oTable.setBusy(false);
            }
        }

        async _callProductionProcess(aSelectedItems) {
            const ppd = this.getPropertyValue("productionProcess");
            if (!ppd) throw new Error(this.getI18nText("msg.ppdNotConfigured"));
            const selectedSfcs = aSelectedItems.map(item => item.sfc);
            const request = {
                key: ppd, async: false, triggerFrom: "pod", passUserId: true,
                sourceName: "TableViewWidget",
                parameters: {
                    Plant: PodContext.getPlant(),
                    Operation: PodContext.getFilterOperationActivities()?.[0]?.operationActivity || "",
                    Resource: PodContext.getFilterResources()?.[0]?.resource || "",
                    WorkCenter: PodContext.getFilterWorkCenters()?.[0]?.workCenter || "",
                    Sfcs: selectedSfcs
                }
            };
            Logger.info("Calling PPD: " + ppd + " with SFCs: " + selectedSfcs.join(", "));
            const response = await ApiClient.internal.processengine.start(request);
            Logger.info("PPD response received", response);
            return response;
        }

        _renderTable(oResponse) {
            if (!oResponse) {
                this._clearTable();
                this._showMessage(this.getI18nText("msg.ppdEmptyResponse"), "Warning");
                return;
            }
            const sHeader = oResponse.Header || this.getI18nText("tableView.title.default");
            this._oTitle.setText(sHeader);
            const sColumns = oResponse.Columns || "";
            const aColumnNames = sColumns.split(",").map(s => s.trim()).filter(s => s.length > 0);
            const aRows = oResponse.Rows || [];

            this._oTable.destroyColumns();
            this._oTable.unbindItems();

            let iColCount = aColumnNames.length;
            let bShowHeaders = true;
            if (iColCount === 0) {
                iColCount = (aRows.length > 0 && aRows[0].Row) ? aRows[0].Row.length : 0;
                if (iColCount === 0) { this._clearTable(); return; }
                bShowHeaders = false;
            }

            if (bShowHeaders) {
                aColumnNames.forEach(name => {
                    this._oTable.addColumn(new Column({ header: new Label({ text: name, design: "Bold" }) }));
                });
            } else {
                for (let i = 0; i < iColCount; i++) { this._oTable.addColumn(new Column()); }
            }

            const aColKeys = [];
            for (let i = 0; i < iColCount; i++) { aColKeys.push("col" + i); }

            const aModelRows = aRows.map(oRow => {
                const aCells = oRow.Row || [];
                const oRowData = {};
                aColKeys.forEach((sKey, idx) => { oRowData[sKey] = (idx < aCells.length) ? aCells[idx] : ""; });
                return oRowData;
            });

            const fnFactory = (sId, oContext) => {
                const oRowData = oContext.getObject();
                const aCells = aColKeys.map(sKey => {
                    const sValue = oRowData[sKey] || "";
                    if (sValue.indexOf("sap-icon://") === 0) {
                        return new Icon({ src: sValue });
                    }
                    return new Text({ text: sValue });
                });
                return new ColumnListItem(sId, { cells: aCells });
            };

            const oModel = new JSONModel({ rows: aModelRows });
            this._oTable.setModel(oModel);
            this._oTable.bindItems({ path: "/rows", factory: fnFactory });
            Logger.info("Table rendered: " + iColCount + " columns, " + aModelRows.length + " rows");
        }

        _clearTable() {
            if (this._oTable) {
                this._oTable.destroyColumns();
                this._oTable.unbindItems();
                this._oTable.destroyItems();
            }
            if (this._oTitle) {
                this._oTitle.setText(this.getI18nText("tableView.title.default"));
            }
        }

        _showMessage(sText, sType) {
            if (this._oMessageStrip) {
                this._oMessageStrip.setText(sText);
                this._oMessageStrip.setType(sType || "Information");
                this._oMessageStrip.setVisible(true);
            }
        }

        _hideMessage() {
            if (this._oMessageStrip) {
                this._oMessageStrip.setVisible(false);
            }
        }
    }

    return TableViewWidget;
});
