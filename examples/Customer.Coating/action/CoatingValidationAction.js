sap.ui.define([
    "customer/custom/extensions/coating/context/CoatingContext",
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/api/ApiClient",
],
(
    CoatingContext,
    Action,
    ActionProperty,
    StringPropertyEditor,
    PodContext,
    I18nResourceModel,
    ApiClient,
) => {
    "use strict";

    class CoatingValidationAction extends Action {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.coating.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return this.getI18nText("validationAction.displayName");
        }

        static getDescription() {
            return this.getI18nText("validationAction.description");
        }

        async execute(oActionContext) {

            // 1. Validate SFC selection — one or more SFCs required
            const selectedItems = PodContext.getSelectedWorkListItems();
            if (!selectedItems || selectedItems.length === 0) {
                throw new Error(this.getI18nText(CoatingContext.msg.NO_SFC_SELECTED));
            }

            // 2. Validate Batch Group rules
            this.#validateBatchGroup(selectedItems);

            // 3. Check configured PPD key
            const ppd = this.getPropertyValue("productionProcess");
            if (!ppd) {
                throw new Error(this.getI18nText(CoatingContext.msg.PPD_NOT_DEFINED));
            }

            // 4. Store all selected SFCs and resolved Batch Group in PodContext
            const selectedSfcs = selectedItems.map(item => item.sfc);
            CoatingContext.setSelectedSfcs(selectedSfcs);
            const batchGroup = selectedItems[0].processLot || null;
            CoatingContext.setBatchGroup(batchGroup);

            // 5. Call Production Process and store response
            const request = {
                key: ppd,
                async: false,
                triggerFrom: "pod",
                passUserId: true,
                sourceName: "CoatingValidationAction",
                parameters: {
                    Plant:      PodContext.getPlant(),
                    Workcenter: PodContext.getFilterWorkCenters()?.[0]?.workCenter,
                    Sfcs:       selectedSfcs,
                    Resource:   PodContext.getFilterResources()?.[0]?.resource
                }
            };

            let response;
            try {
                response = await ApiClient.internal.processengine.start(request);
            } catch (e) {
                throw new Error(this.getI18nText(CoatingContext.msg.PPD_CALL_FAILED) + " " + e.message);
            }

            CoatingContext.setValidationResult(response?.ValidationResults);
            CoatingContext.setDefaultSettings(response?.DefaultSettings);

            // Verify that DefaultSettings contains entries for all required properties
            const REQUIRED_SETTINGS = ["Area", "Speed", "Viscosity", "ManualThickness"];
            const settings = Array.isArray(response?.DefaultSettings) ? response.DefaultSettings : [];
            const missing = REQUIRED_SETTINGS.filter(
                prop => !settings.some(s => s?.Property === prop)
            );
            if (missing.length > 0) {
                throw new Error(
                    this.getI18nText(CoatingContext.msg.DEFAULT_SETTING_MISSING) + " " + missing.join(", ")
                );
            }

            // Coverage comes as a direct string property of the response
            const coverage = response?.Coverage;
            CoatingContext.setCoverage(coverage !== undefined && coverage !== null ? parseFloat(coverage) : null);

            // 6. Check SFC statuses — Curing, QC and Hold are not allowed
            const INVALID_STATUSES = ["Curing", "QC", "Hold"];
            const rawResult = CoatingContext.getValidationResult();
            const validationResults = Array.isArray(rawResult) ? rawResult : (rawResult ? [rawResult] : []);
            const invalidSfcs = validationResults.filter(r => INVALID_STATUSES.includes(r?.Status?.trim()));
            if (invalidSfcs.length > 0) {
                const details = invalidSfcs.map(r => `${r.Sfc} (${r.Status?.trim()})`).join(", ");
                throw new Error(this.getI18nText(CoatingContext.msg.SFC_STATUS_INVALID) + " " + details);
            }
        }

        ////////////////////////////////////////////////////////////////////
        // Batch Group Validation
        ////////////////////////////////////////////////////////////////////

        #validateBatchGroup(selectedItems) {

            const groups = selectedItems.map(item => item.processLot || null);
            const groupSet = new Set(groups.filter(g => g !== null));

            // Multiple distinct Batch Groups selected → invalid
            if (groupSet.size > 1) {
                throw new Error(this.getI18nText(CoatingContext.msg.BATCH_GROUP_MIXED));
            }

            if (groupSet.size === 1) {
                // All selected SFCs belong to the same Batch Group.
                // Now verify that ALL SFCs of that group are selected.
                const group = [...groupSet][0];
                const allItems = PodContext.getWorkListItems();
                const allGroupSfcs = allItems.filter(item => item.processLot === group);
                if (allGroupSfcs.length !== selectedItems.length) {
                    throw new Error(this.getI18nText(CoatingContext.msg.BATCH_GROUP_INCOMPLETE));
                }
            }
            // groupSet.size === 0: all selected SFCs have no Batch Group → allowed
        }

        ////////////////////////////////////////////////////////////////////
        // Define Properties
        ////////////////////////////////////////////////////////////////////

        getProperties() {
            const aProperties = [];
            aProperties.push(
                new ActionProperty({
                    displayName: this.getI18nText(CoatingContext.validationAction.PPD_DISPLAY_NAME),
                    description: this.getI18nText(CoatingContext.validationAction.PPD_DESCRIPTION),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                })
            );
            return aProperties;
        }
    }

    return CoatingValidationAction;
});