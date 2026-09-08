sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/EnumPropertyEditor",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/api/ApiClient"
],
(
    Action,
    ActionProperty,
    StringPropertyEditor,
    EnumPropertyEditor,
    PodContext,
    I18nResourceModel,
    ApiClient,
) => {
    "use strict";

    class CustomTriggerAction extends Action {

        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extensions.utils.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return this.getI18nText("customTriggerAction.displayName");
        }

        static getDescription() {
            return this.getI18nText("customTriggerAction.description");
        }

        async execute(oActionContext) {

            const aWorkListItems = PodContext.getSelectedWorkListItems();
            if (!aWorkListItems || aWorkListItems.length === 0) {
                throw new Error(this.getI18nText("customTriggerAction.noSfcSelected"));
            }

            const aWorkCenters = PodContext.getFilterWorkCenters();
            if (!aWorkCenters || aWorkCenters.length === 0) {
                throw new Error(this.getI18nText("customTriggerAction.noWorkCenterSelected"));
            }

            const aResources = PodContext.getFilterResources();
            if (!aResources || aResources.length === 0) {
                throw new Error(this.getI18nText("customTriggerAction.noResourceSelected"));
            }

            const sProductionProcess = this.getPropertyValue("productionProcess");
            if (!sProductionProcess) {
                throw new Error(this.getI18nText("customTriggerAction.noProductionProcess"));
            }

            const sTriggerType = this.getPropertyValue("triggerType");
            if (!sTriggerType) {
                throw new Error(this.getI18nText("customTriggerAction.noTriggerType"));
            }

            const parameters = {
                "Plant": PodContext.getPlant(),
                "WorkCenter": aWorkCenters[0].workCenter,
                "Resource": aResources[0].resource,
                "SelectedWorkListItems": JSON.stringify(aWorkListItems),
                "TriggerType": sTriggerType
            };

            const request = {
                key: sProductionProcess,
                async: false,
                triggerFrom: "pod",
                passUserId: true,
                sourceName: "CustomTriggerAction",
                parameters: parameters
            };

            try {
                await ApiClient.internal.processengine.start(request);
            } catch (e) {
                throw new Error(this.getI18nText("customTriggerAction.productionProcess.failed") + " " + e.message);
            }
        }

        getProperties() {
            const aProperties = [];
            aProperties.push(
                new ActionProperty({
                    displayName: this.getI18nText("customTriggerAction.productionProcess.displayName"),
                    description: this.getI18nText("customTriggerAction.productionProcess.description"),
                    propertyEditor: new StringPropertyEditor(this, "productionProcess")
                })
            );
            aProperties.push(
                new ActionProperty({
                    displayName: this.getI18nText("customTriggerAction.triggerType.displayName"),
                    description: this.getI18nText("customTriggerAction.triggerType.description"),
                    propertyEditor: new EnumPropertyEditor(this, "triggerType", {
                        "Start": "START",
                        "Complete": "COMPLETE",
                        "SignOff": "SIGNOFF"
                    })
                })
            );
            return aProperties;
        }
    }

    return CustomTriggerAction;
});