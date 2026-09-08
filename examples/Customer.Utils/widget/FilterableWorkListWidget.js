sap.ui.define([
    "sap/m/SearchField",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/widget/worklist/WorkListTableWidget",
    "sap/dm/dme/pod2/model/I18nResourceModel"
], (
    SearchField,
    Filter,
    FilterOperator,
    PodContext,
    WorkListTableWidget,
    I18nResourceModel
) => {
    "use strict";

    /**
     * Filterable Work List Table Widget that extends the default Work List Table Widget
     * and adds a fulltext search field to the toolbar. The user can filter the table
     * content client-side across all visible columns.
     *
     * @alias customer.custom.extensions.utils.widget.FilterableWorkListWidget
     * @extends sap.dm.dme.pod2.widget.worklist.WorkListTableWidget
     */
    class FilterableWorkListWidget extends WorkListTableWidget {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.utils.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return this.getI18nText("filterableWorkList.displayName");
        }

        static getDescription() {
            return this.getI18nText("filterableWorkList.description");
        }

        static getCategory() {
            return this.getI18nText("filterableWorkList.category");
        }

        static getIcon() {
            return "sap-icon://search";
        }

        /**
         * Called when the widget is initialized.
         * Adds a SearchField to the table's header toolbar.
         *
         * @override
         */
        onInit() {
            super.onInit();

            const oHeaderToolbar = this.getTable()?.getHeaderToolbar();
            if (oHeaderToolbar) {
                this._oSearchField = new SearchField({
                    placeholder: this.getI18nText("filterableWorkList.searchPlaceholder"),
                    width: "250px",
                    search: (oEvent) => {
                        this.#applyFulltextFilter(oEvent.getParameter("query"));
                    },
                    liveChange: (oEvent) => {
                        this.#applyFulltextFilter(oEvent.getParameter("newValue"));
                    }
                });
                oHeaderToolbar.addContent(this._oSearchField);
            }
        }

        /**
         * Called when the widget is destroyed.
         *
         * @override
         */
        onExit() {
            super.onExit();
            this._oSearchField = null;
        }

        /**
         * Applies a client-side fulltext filter on the table's items binding.
         * Filters across all text columns using OR logic.
         * Passing an empty string removes the filter.
         *
         * @param {string} sQuery The search string.
         */
        #applyFulltextFilter(sQuery) {
            const oTable = this.getTable();
            if (!oTable) {
                return;
            }

            const oBinding = oTable.getBinding("items");
            if (!oBinding) {
                return;
            }

            if (!sQuery || sQuery.trim() === "") {
                oBinding.filter([]);
                return;
            }

            const sSearchTerm = sQuery.trim();

            // Build OR filters across all known worklist fields
            const aFieldFilters = [
                new Filter("sfc", FilterOperator.Contains, sSearchTerm),
                new Filter("shopOrder", FilterOperator.Contains, sSearchTerm),
                new Filter("material", FilterOperator.Contains, sSearchTerm),
                new Filter("materialDescription", FilterOperator.Contains, sSearchTerm),
                new Filter("operation", FilterOperator.Contains, sSearchTerm),
                new Filter("operationDescription", FilterOperator.Contains, sSearchTerm),
                new Filter("order", FilterOperator.Contains, sSearchTerm),
                new Filter("processLot", FilterOperator.Contains, sSearchTerm)
            ];

            const oCombinedFilter = new Filter({
                filters: aFieldFilters,
                and: false
            });

            oBinding.filter([oCombinedFilter]);
        }
    }

    return FilterableWorkListWidget;
});