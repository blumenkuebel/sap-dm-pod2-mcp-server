sap.ui.define([
    "customer/custom/extensions/coating/context/CoatingContext",
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/ui/core/BusyIndicator",
],
(
    CoatingContext,
    Action,
    ActionProperty,
    StringPropertyEditor,
    BooleanPropertyEditor,
    PodContext,
    I18nResourceModel,
    ApiClient,
    BusyIndicator,
) => {
    "use strict";

    class CoatingExecutionAction extends Action {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.coating.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return this.getI18nText("executionAction.displayName");
        }

        static getDescription() {
            return this.getI18nText("executionAction.description");
        }

        async execute(oActionContext) {

            // 1. Check configured PPD key
            const ppd = this.getPropertyValue("productionProcess");
            if (!ppd) {
                throw new Error(this.getI18nText(CoatingContext.msg.EXEC_PPD_NOT_DEFINED));
            }

            // 2. Validate all input fields and thickness via CoatingContext
            this.#validateInputs();

            // 3. Build and fire Production Process request
            const sfcThicknesses = CoatingContext.getSfcThicknesses();

            // Enrich sfcThicknesses with Status from PodContext work list items
            const selectedItems = PodContext.getSelectedWorkListItems() || [];
            const statusMap = new Map(selectedItems.map(item => [item.sfc, item.sfcStatusCode || ""]));
            const sfcsWithStatus = (sfcThicknesses || []).map(t => ({
                Sfc: t.Sfc,
                Thickness: t.Thickness,
                Status: statusMap.get(t.Sfc) || ""
            }));

            const request = {
                key: ppd,
                async: false,
                triggerFrom: "pod",
                passUserId: true,
                sourceName: "CoatingExecutionAction",
                parameters: {
                    Plant:      PodContext.getPlant(),
                    Workcenter: PodContext.getFilterWorkCenters()?.[0]?.workCenter,
                    Resource:   PodContext.getFilterResources()?.[0]?.resource,
                    Operation:  selectedItems[0]?.operationActivity || "",
                    StepId:     selectedItems[0]?.stepId || "",
                    Sfcs:       sfcsWithStatus,  // [{ Sfc: string, Thickness: number, Status: string }, ...]
                    SelectedWorkListItems: JSON.stringify(selectedItems),
                    LogDcThicknessCollected: !!this.getPropertyValue("logDcThicknessCollected")
                }
            };

            // Show global busy indicator while the PPD is running.
            // Actions don't have their own widget view, so view-based
            // setBusy() is unreliable here — see common-mistakes #33.
            BusyIndicator.show(0);
            try {
                await ApiClient.internal.processengine.start(request);
            } catch (e) {
                throw new Error(this.getI18nText(CoatingContext.msg.EXEC_PPD_CALL_FAILED) + " " + e.message);
            } finally {
                BusyIndicator.hide();
            }
        }

        ////////////////////////////////////////////////////////////////////
        // Input Validation
        ////////////////////////////////////////////////////////////////////

        #validateInputs() {

            const inputState  = CoatingContext.getInputState();
            const sfcThicknesses  = CoatingContext.getSfcThicknesses();
            const hasThickness   = sfcThicknesses && sfcThicknesses.length > 0
                             && sfcThicknesses.some(t => t.Thickness > 0);

            // No input at all (dialog opened but nothing entered)
            if (!inputState) {
                throw new Error(this.getI18nText(CoatingContext.msg.EXEC_NO_THICKNESS));
            }

            // If fields are invalid, report field errors only
            if (!inputState.valid) {
                const fieldErrors = inputState.errors || [];
                if (fieldErrors.length > 0) {
                    throw new Error(
                        this.getI18nText(CoatingContext.msg.EXEC_VALIDATION_FAILED)
                        + " " + fieldErrors.join(", ")
                    );
                }
                // Fields invalid but no specific errors collected
                throw new Error(this.getI18nText(CoatingContext.msg.EXEC_NO_THICKNESS));
            }

            // Fields are valid but no thickness was produced (edge case)
            if (!hasThickness) {
                throw new Error(this.getI18nText(CoatingContext.msg.EXEC_NO_THICKNESS));
            }
        }

        ////////////////////////////////////////////////////////////////////
        // Define Properties
        ////////////////////////////////////////////////////////////////////

        getProperties() {
            const aProperties = [];
            aProperties.push(
                new ActionProperty({
                    displayName: this.getI18nText(CoatingContext.executionAction.PPD_DISPLAY_NAME),
                    description: this.getI18nText(CoatingContext.executionAction.PPD_DESCRIPTION),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                })
            );
            aProperties.push(
                new ActionProperty({
                    displayName: this.getI18nText(CoatingContext.executionAction.LOG_DC_DISPLAY_NAME),
                    description: this.getI18nText(CoatingContext.executionAction.LOG_DC_DESCRIPTION),
                    propertyEditor: new BooleanPropertyEditor(this, "logDcThicknessCollected")
                })
            );
            return aProperties;
        }
    }

    return CoatingExecutionAction;
});