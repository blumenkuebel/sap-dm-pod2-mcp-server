sap.ui.define([
    "sap/dm/dme/pod2/context/PodContext",
], (
    PodContext
) => {

    "use strict";

    class CoatingContext {

        ////////////////////////////////////////////////////////////////////
        // Messages
        ////////////////////////////////////////////////////////////////////

        static #msg = Object.freeze({
            NO_SFC_SELECTED:        "msg.noSfcSelected",
            PPD_NOT_DEFINED:        "msg.ppdNotDefined",
            PPD_CALL_FAILED:        "msg.ppdCallFailed",
            SFC_STATUS_INVALID:     "msg.sfcStatusInvalid",
            BATCH_GROUP_MIXED:      "msg.batchGroupMixed",
            BATCH_GROUP_INCOMPLETE: "msg.batchGroupIncomplete",
            DEFAULT_SETTING_MISSING: "msg.defaultSettingMissing",
            EXEC_PPD_NOT_DEFINED:   "msg.exec.ppdNotDefined",
            EXEC_PPD_CALL_FAILED:   "msg.exec.ppdCallFailed",
            EXEC_NO_THICKNESS:      "msg.exec.noThickness",
            EXEC_VALIDATION_FAILED: "msg.exec.validationFailed"
        });

        static get msg() { return this.#msg; }

        ////////////////////////////////////////////////////////////////////
        // ValidationAction Properties
        ////////////////////////////////////////////////////////////////////

        static #validationAction = Object.freeze({
            PPD_DISPLAY_NAME: "validationAction.productionProcess.displayName",
            PPD_DESCRIPTION:  "validationAction.productionProcess.description"
        });

        static get validationAction() { return this.#validationAction; }

        ////////////////////////////////////////////////////////////////////
        // ExecutionAction Properties
        ////////////////////////////////////////////////////////////////////

        static #executionAction = Object.freeze({
            PPD_DISPLAY_NAME: "executionAction.productionProcess.displayName",
            LOG_DC_DISPLAY_NAME: "executionAction.logDcThicknessCollected.displayName",
            PPD_DESCRIPTION:  "executionAction.productionProcess.description",
            LOG_DC_DESCRIPTION:  "executionAction.logDcThicknessCollected.description"
        });

        static get executionAction() { return this.#executionAction; }

        ////////////////////////////////////////////////////////////////////
        // PodContext  (path: customer/coating)
        ////////////////////////////////////////////////////////////////////

        // Array of selected SFC strings
        static setSelectedSfcs(value) {
            PodContext.set("/customer/coating/selectedSfcs", value);
        }

        static getSelectedSfcs() {
            return PodContext.get("/customer/coating/selectedSfcs");
        }

        // Batch Group of the current selection (null if none)
        static setBatchGroup(value) {
            PodContext.set("/customer/coating/batchGroup", value);
        }

        static getBatchGroup() {
            return PodContext.get("/customer/coating/batchGroup");
        }

        // ValidationResults: { Status: "OK"|"Curing"|"QC"|"Hold", Sfc: string }
        static setValidationResult(value) {
            PodContext.set("/customer/coating/validationResult", value);
        }

        static getValidationResult() {
            return PodContext.get("/customer/coating/validationResult");
        }

        // DefaultSettings: Array of { Min: string, Max: string, Property: string }
        static setDefaultSettings(value) {
            PodContext.set("/customer/coating/defaultSetting", value);
        }

        static getDefaultSettings() {
            return PodContext.get("/customer/coating/defaultSetting");
        }

        // Coverage (g/m²) — extracted from DefaultSetting by ValidationAction
        static setCoverage(value) {
            PodContext.set("/customer/coating/coverage", value);
        }

        static getCoverage() {
            return PodContext.get("/customer/coating/coverage");
        }

        // SFC thickness list for ExecutionAction: [{ Sfc: string, Thickness: number }, ...]
        // Written by the widget after thickness calculation; read by ExecutionAction.
        static setSfcThicknesses(value) {
            PodContext.set("/customer/coating/sfcThicknesses", value);
        }

        static getSfcThicknesses() {
            return PodContext.get("/customer/coating/sfcThicknesses");
        }

        // Input validation state written by the widget after every change.
        // { valid: boolean, errors: string[] }
        static setInputState(value) {
            PodContext.set("/customer/coating/inputState", value);
        }

        static getInputState() {
            return PodContext.get("/customer/coating/inputState");
        }

    }

    return CoatingContext;
});