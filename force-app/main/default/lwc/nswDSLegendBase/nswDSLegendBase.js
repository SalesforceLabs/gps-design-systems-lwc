import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean, normalizeString } from "c/nswUtilsPrivate";

export default class NswDSLegend extends LightningElement {
    _label;

    @api get label() {
        return this._label;
    }

    set label(newValue) {
        this._label = normalizeString(newValue, { toLowerCase: false });
    }


    // ---- required
    _required = false;

    @api get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }

     
    // ---- helper: string
    _helper;

    @api get helper() {
        return this._helper;
    }

    set helper(value) {
        this._helper = normalizeString(value, { toLowerCase: false });
    }

    @api nswClass;
}