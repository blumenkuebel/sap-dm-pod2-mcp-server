sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/notification/PodNotificationWebSocket",
    "sap/dm/dme/pod2/notification/EventType",
    "sap/dm/dme/pod2/notification/Filter",
    "sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/m/library",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel"
], function (Widget, I18nResourceModel, PodContext, PodNotificationWebSocket, EventType, Filter,
             SelectPropertyEditor, WidgetProperty, mLibrary, VBox, Text, JSONModel) {
    "use strict";

    const { TextAlign } = mLibrary;

    /**
     * SoundAlertWidget — Subscribes to real-time WebSocket events and plays an audio alert.
     *
     * Demonstrates:
     * - PodNotificationWebSocket usage (subscribe/unsubscribe)
     * - Widget Properties (configurable event type)
     * - Browser Audio API for sound alerts
     * - Proper cleanup in onExit()
     */
    class SoundAlertWidget extends Widget {

        // ─── Static i18n ─────────────────────────────────────────────
        static #oI18nModel = new I18nResourceModel({
            bundleName: "customer.custom.extension.soundalert.i18n.i18n"
        });

        static getI18nModel() { return SoundAlertWidget.#oI18nModel; }
        static getDisplayName() { return SoundAlertWidget.#oI18nModel.getText("soundAlert.displayName"); }
        static getDescription() { return SoundAlertWidget.#oI18nModel.getText("soundAlert.description"); }
        static getCategory() { return SoundAlertWidget.#oI18nModel.getText("soundAlert.category"); }
        static getIcon() { return "sap-icon://bell"; }

        // ─── Properties (configurable in POD Designer) ───────────────
        static INCLUDE_PROPERTIES = ["eventType"];

        getProperties() {
            // Build the dropdown from the runtime EventType enum — NEVER hardcode
            // event strings. Object.keys(EventType) always matches the deployed
            // enum, so the picker can't drift out of date.
            return [
                new WidgetProperty(this, "eventType",
                    new SelectPropertyEditor(this, "eventType", Object.keys(EventType), "CUSTOM"))
            ];
        }

        static getDefaultConfig() {
            return {
                properties: {
                    // EventType.CUSTOM is the generic channel for app-specific
                    // events; differentiate them via the payload Filter below.
                    eventType: "CUSTOM"
                }
            };
        }

        // ─── Instance state ──────────────────────────────────────────
        #oModel = null;
        #subscription = null;
        #audioContext = null;

        // ─── Lifecycle ───────────────────────────────────────────────

        onInit() {
            this.getPodRuntime().getView().setModel(
                SoundAlertWidget.#oI18nModel, "i18nSoundAlert"
            );
            this._subscribeToEvents();
        }

        _createView() {
            const oConfig = this.getConfig();               // M65 — _createView() receives no arguments
            this.#oModel = new JSONModel({
                lastAlert: null,
                alertCount: 0,
                statusText: this.getI18nText("status.waiting")
            });

            return new VBox(oConfig.id, {
                alignItems: "Center",
                justifyContent: "Center",
                items: [
                    new Text({ text: "🔔", textAlign: TextAlign.Center })
                        .addStyleClass("sapUiSmallMarginBottom"),
                    new Text({
                        text: "{soundAlert>/statusText}",
                        textAlign: TextAlign.Center
                    }).addStyleClass("sapUiTinyMarginTop")
                ],
                models: { soundAlert: this.#oModel }
            });
        }

        onExit() {
            this._unsubscribeFromEvents();
            this.#oModel = null;
            super.onExit();
        }

        // ─── WebSocket Subscription ─────────────────────────────────

        _subscribeToEvents() {
            // The property stores an EventType key (e.g. "CUSTOM", "SFC_START");
            // resolve it to the enum value. Fall back to CUSTOM if unset/unknown.
            const sEventKey = this.getPropertyValue("eventType") || "CUSTOM";
            const sEventType = EventType[sEventKey] || EventType.CUSTOM;
            const sPlant = PodContext.getPlant();

            try {
                // Handler key is `onMessage` (NOT `callback`); subscribe() returns
                // a SubscriptionContext that we store and unsubscribe in onExit().
                this.#subscription = PodNotificationWebSocket.subscribe({
                    eventType: sEventType,
                    filter: Filter.equals("plant", sPlant),
                    onMessage: (oMessage) => this._onEventReceived(oMessage),
                    description: "SoundAlertWidget"
                });
            } catch (e) {
                // WebSocket may not be available in all environments
                this._updateStatus(this.getI18nText("status.unavailable"));
            }
        }

        _unsubscribeFromEvents() {
            if (this.#subscription) {
                this.#subscription.unsubscribe();
                this.#subscription = null;
            }
        }

        // ─── Event Handler ───────────────────────────────────────────

        _onEventReceived(oMessage) {
            const iCount = (this.#oModel.getProperty("/alertCount") || 0) + 1;
            this.#oModel.setProperty("/alertCount", iCount);
            this.#oModel.setProperty("/lastAlert", new Date().toLocaleTimeString());
            this._updateStatus(this.getI18nText("status.alert", [iCount]));

            this._playSound();
        }

        _updateStatus(sText) {
            if (this.#oModel) {
                this.#oModel.setProperty("/statusText", sText);
            }
        }

        // ─── Audio ──────────────────────────────────────────────────

        _playSound() {
            try {
                // Use Web Audio API for a simple beep (no external file needed)
                if (!this.#audioContext) {
                    this.#audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                const ctx = this.#audioContext;
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = 880; // A5 note
                oscillator.type = "sine";
                gainNode.gain.value = 0.3;

                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.2); // 200ms beep
            } catch (e) {
                // Audio not available (e.g. autoplay policy)
            }
        }
    }

    return SoundAlertWidget;
});