sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/m/Text"
], (Widget, I18nResourceModel, Text) => {
    "use strict";

    /**
     * HelloWorldWidget – the smallest possible POD 2.0 widget.
     *
     * Displays a single text line with an i18n-translated greeting.
     * Use this as the absolute starting template for new POD 2.0 widgets.
     *
     * Best-Practice elements demonstrated:
     *  - Static I18nResourceModel for i18n
     *  - Standard static metadata methods (getDisplayName, getIcon, getCategory, getDescription)
     *  - i18nCustomModel registration on the POD view in onInit()
     *  - Minimal _createView() returning a single sap.m.Text
     */
    class HelloWorldWidget extends Widget {

        // Static i18n model – shared across all instances of this widget
        static #oI18nModel = new I18nResourceModel(
            "customer.custom.extensions.helloworld.i18n.i18n"
        );
        static getI18nModel()   { return this.#oI18nModel; }
        static getDisplayName() { return this.getI18nText("helloWorld.displayName"); }
        static getIcon()        { return "sap-icon://hello-world"; }
        static getCategory()    { return this.getI18nText("helloWorld.category"); }
        static getDescription() { return this.getI18nText("helloWorld.description"); }

        onInit() {
            // Register the static i18n model on the POD view so XML/expression
            // bindings of the form `{i18nHelloWorld>greeting}` work in the UI.
            const oI18nModel = HelloWorldWidget.getI18nModel();
            this.getPodRuntime().getView().setModel(oI18nModel, "i18nHelloWorld");
        }

        _createView() {
            const oConfig = this.getConfig();
            return new Text(oConfig.id, {
                text: "{i18nHelloWorld>greeting}"
            });
        }

        // No subscriptions in this widget – nothing to clean up. If you add a
        // PodContext.subscribe() later, also implement onExit() and call
        // PodContext.unsubscribe() there.
    }

    return HelloWorldWidget;
});